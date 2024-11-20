import { Router } from "express";
import { Like } from "typeorm";
import { Event } from "../models/Event";

const router = Router();

/**
 * Buscar eventos por critérios
 */
router.get("/searchEvent", async (req, res) => {
    try {
        const { query, status, startDate, endDate } = req.query;

        // Condições de busca dinâmicas
        const conditions: any = {};

        if (query) {
            conditions.title = Like(`%${query}%`); // Busca por palavra-chave no título
        }

        if (status) {
            conditions.status = status; // Status: pending, approved, finished, etc.
        }

        if (startDate) {
            conditions.startDate = { $gte: new Date(startDate as string) };
        }

        if (endDate) {
            conditions.endDate = { $lte: new Date(endDate as string) };
        }

        // Busca no banco de dados com as condições
        const events = await Event.find({ where: conditions });

        if (events.length === 0) {
            return res.status(404).json({ message: "Nenhum evento encontrado." });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar eventos.", error });
    }
});

export default router;
