import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class PecaController {
  
  static async store(req: Request, res: Response) {
    try {
      const novaPeca = await prisma.peca.create({
        data: {
          nome: req.body.nome,
          fornecedor: req.body.fornecedor,
          tipo: req.body.tipo,
          status: req.body.status,
          aeronave: { connect: { id: req.body.aeronaveId } }
        }
      });
      res.status(201).json(novaPeca);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao adicionar peça' });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const peca = await prisma.peca.update({
      where: { id },
      data: { status }
    });
    res.json(peca);
  }
}