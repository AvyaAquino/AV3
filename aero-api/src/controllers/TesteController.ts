import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class TesteController {
  
  static async store(req: Request, res: Response) {
    try {
      const novoTeste = await prisma.teste.create({
        data: {
          tipo: req.body.tipo,
          resultado: req.body.resultado,
          aeronave: { connect: { id: req.body.aeronaveId } }
        }
      });
      res.status(201).json(novoTeste);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao registrar teste' });
    }
  }
}