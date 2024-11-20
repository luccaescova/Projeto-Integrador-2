// src/controllers/AuthController.ts
import { Request, Response } from 'express';

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Exemplo de validação simples (em uma aplicação real, use hashing e verificação com banco de dados)
    if (email === 'user@example.com' && password === 'password123') {
        res.status(200).json({ message: 'Login bem-sucedido', token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
};
