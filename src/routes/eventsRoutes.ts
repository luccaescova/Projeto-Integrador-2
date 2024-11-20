import { Router } from "express";
import { Event } from "../models/Event";
import { User } from "../models/User";

const router = Router();

/**
 * Criar um novo evento
 */
router.post("/addNewEvent", async (req, res) => {
    try {
        const { userId, title, description, betAmount, startDate, endDate } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Cria o evento
        const event = new Event();
        event.title = title;
        event.description = description;
        event.betAmount = betAmount;
        event.startDate = new Date(startDate);
        event.endDate = new Date(endDate);
        event.creator = user;
        event.status = "pending"; // Status inicial: aguardando aprovação
        await event.save();

        res.status(201).json({ message: "Evento criado com sucesso.", event });
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar evento.", error });
    }
});

/**
 * Listar eventos por status
 */
router.get("/getEvents", async (req, res) => {
    try {
        const { status } = req.query; // pending, approved, rejected
        const events = await Event.find({ where: { status } });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar eventos.", error });
    }
});

/**
 * Aprovar ou Reprovar um evento
 */
router.patch("/evaluateEvent", async (req, res) => {
    try {
        const { eventId, isApproved, moderatorId } = req.body;

        // Verifica se o moderador existe
        const moderator = await User.findOne({ where: { id: moderatorId, isModerator: true } });
        if (!moderator) {
            return res.status(403).json({ message: "Acesso negado. Usuário não é moderador." });
        }

        // Busca o evento
        const event = await Event.findOne({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // Atualiza o status do evento
        event.status = isApproved ? "approved" : "rejected";
        await event.save();

        res.status(200).json({ message: `Evento ${isApproved ? "aprovado" : "reprovado"} com sucesso.` });
    } catch (error) {
        res.status(500).json({ message: "Erro ao avaliar evento.", error });
    }
});

/**
 * Excluir um evento
 */
router.delete("/deleteEvent", async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        // Verifica se o evento pertence ao usuário
        const event = await Event.findOne({ where: { id: eventId, creator: { id: userId } } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado ou acesso negado." });
        }

        // Verifica se o evento já foi aprovado ou recebeu apostas
        if (event.status !== "pending") {
            return res.status(400).json({ message: "Não é possível excluir eventos aprovados ou com apostas." });
        }

        // Exclui logicamente o evento (alterando status para 'deleted')
        event.status = "deleted";
        await event.save();

        res.status(200).json({ message: "Evento excluído com sucesso." });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir evento.", error });
    }
});

export default router;
