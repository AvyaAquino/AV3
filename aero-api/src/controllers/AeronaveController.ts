import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class AeronaveController {
  
  static async store(req: Request, res: Response) {
    try {
      const novaAeronave = await prisma.aeronave.create({ data: req.body });
      res.status(201).json(novaAeronave);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar aeronave.' });
    }
  }

  static async index(req: Request, res: Response) {
    const aeronaves = await prisma.aeronave.findMany({
      include: { 
        pecas: true, 
        testes: true, 
        etapas: { include: { funcionarios: true }, orderBy: { ordem: 'asc' } } 
      }
    });
    res.json(aeronaves);
  }

  static async show(req: Request, res: Response) {
    const { codigo } = req.params;
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { pecas: true, testes: true, etapas: { include: { funcionarios: true } } }
    });
    if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada' });
    res.json(aeronave);
  }

  static async update(req: Request, res: Response) {
    const { codigo } = req.params;
    try {
      const aeronave = await prisma.aeronave.update({
        where: { codigo },
        data: req.body 
      });
      res.json(aeronave);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar aeronave.' });
    }
  }

  static async delete(req: Request, res: Response) {
    const { codigo } = req.params;
    try {
      await prisma.aeronave.delete({
        where: { codigo }
      });
      res.status(204).send(); 
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar aeronave.' });
    }
  }
}