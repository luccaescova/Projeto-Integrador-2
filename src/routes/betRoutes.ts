import { Router } from "express";
import { Bet } from "../models/Bet";
import { Event } from "../models/Event";
import { User } from "../models/User";
import { getRepository } from "typeorm";

const router = Router();

/**
 * Realizar uma aposta
 */
router.post("/betOnEvent", async (req, res) => {
    try {
        const { userId, eventId, amount, prediction } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verifica se o evento existe e está aprovado
        const event = await Event.findOne({ where: { id: eventId, status: "approved" } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado ou não está aprovado." });
        }

        // Verifica se o usuário tem saldo suficiente
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Saldo insuficiente." });
        }

        // Cria a aposta
        const bet = new Bet();
        bet.user = user;
        bet.event = event;
        bet.amount = amount;
        bet.prediction = prediction; // True = "Sim", False = "Não"
        await bet.save();

        // Deduz o saldo do usuário
        user.walletBalance -= amount;
        await user.save();

        res.status(201).json({ message: "Aposta realizada com sucesso.", bet });
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar aposta.", error });
    }
});

/**
 * Encerrar evento e redistribuir ganhos
 */
router.post("/finishEvent", async (req, res) => {
    try {
        const { eventId, result } = req.body;

        // Verifica se o evento existe e está aprovado
        const event = await Event.findOne({ where: { id: eventId, status: "approved" }, relations: ["creator"] });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado ou já foi encerrado." });
        }

        // Atualiza o resultado do evento
        event.result = result; // True = ocorreu, False = não ocorreu
        event.status = "finished";
        await event.save();

        // Busca todas as apostas relacionadas ao evento
        const bets = await getRepository(Bet).find({ where: { event }, relations: ["user"] });

        // Calcula os ganhos e atualiza o saldo dos vencedores
        const totalPool = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const winningPool = bets.filter((bet) => bet.prediction === result);
        const totalWinningAmount = winningPool.reduce((sum, bet) => sum + bet.amount, 0);

        if (winningPool.length > 0) {
            for (const bet of winningPool) {
                const user = bet.user;
                const proportion = bet.amount / totalWinningAmount;
                const winnings = totalPool * proportion;

                user.walletBalance += winnings;
                await user.save();
            }
        }

        res.status(200).json({ message: "Evento encerrado e ganhos distribuídos com sucesso." });
    } catch (error) {
        res.status(500).json({ message: "Erro ao encerrar evento.", error });
    }
});

export default router;
