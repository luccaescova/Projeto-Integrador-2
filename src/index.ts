import express from "express";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventsRoutes";
import betRoutes from "./routes/betRoutes";
import walletRoutes from "./routes/walletRoutes";
import createTables from "./utils/setupDB";

const app = express();
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/bets", betRoutes);
app.use("/wallet", walletRoutes);

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Executar o setup do banco
createTables();
