// src/app.ts
import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Rotas de autenticação
app.use('/auth', authRoutes);

export default app;
