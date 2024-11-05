import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import betRoutes from './routes/bets';

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/apostas', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/bets', betRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(Servidor rodando na porta ${PORT});
});
