import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class AuthController {
  
  static async login(req: Request, res: Response) {
    const { usuario, senha } = req.body;
    try {
      const funcionario = await prisma.funcionario.findUnique({
        where: { usuario: usuario }
      });

      if (funcionario && funcionario.senha === senha) {
        const { senha, ...dadosFuncionario } = funcionario;
        res.json({ success: true, user: dadosFuncionario });
      } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro interno' });
    }
  }
}