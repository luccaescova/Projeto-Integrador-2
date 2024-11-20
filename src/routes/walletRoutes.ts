import { Router } from "express";
import { User } from "../models/User";
import { WalletTransaction } from "../models/WalletTransaction";

const router = Router();

/**
 * Adicionar fundos à carteira
 */
router.post("/addFunds", async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: "O valor deve ser maior que zero." });
        }

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Adiciona o valor à carteira
        user.walletBalance += amount;
        await user.save();

        // Registra a transação
        const transaction = new WalletTransaction();
        transaction.user = user;
        transaction.amount = amount;
        transaction.type = "deposit"; // Tipo de transação: depósito
        await transaction.save();

        res.status(200).json({ message: "Fundos adicionados com sucesso.", balance: user.walletBalance });
    } catch (error) {
        res.status(500).json({ message: "Erro ao adicionar fundos.", error });
    }
});

/**
 * Sacar fundos da carteira
 */
router.post("/withdrawFunds", async (req, res) => {
    try {
        const { userId, amount, bankDetails } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: "O valor deve ser maior que zero." });
        }

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verifica se há saldo suficiente
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Saldo insuficiente." });
        }

        // Calcula a taxa de saque
        let fee = 0;
        if (amount <= 100) {
            fee = amount * 0.04;
        } else if (amount <= 1000) {
            fee = amount * 0.03;
        } else if (amount <= 5000) {
            fee = amount * 0.02;
        } else if (amount <= 100000) {
            fee = amount * 0.01;
        }
        const finalAmount = amount - fee;

        // Deduz o valor da carteira do usuário
        user.walletBalance -= amount;
        await user.save();

        // Registra a transação
        const transaction = new WalletTransaction();
        transaction.user = user;
        transaction.amount = -amount; // Valor negativo para saque
        transaction.type = "withdraw";
        transaction.details = bankDetails; // Informações do banco
        await transaction.save();

        res.status(200).json({
            message: "Saque realizado com sucesso.",
            balance: user.walletBalance,
            fee,
            finalAmount,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar saque.", error });
    }
});

/**
 * Consultar saldo e histórico
 */
router.get("/balance", async (req, res) => {
    try {
        const { userId } = req.query;

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Busca o histórico de transações
        const transactions = await WalletTransaction.find({ where: { user } });

        res.status(200).json({
            balance: user.walletBalance,
            transactions,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao consultar saldo.", error });
    }
});

export default router;
