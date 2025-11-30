import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class EtapaController {

  static async store(req: Request, res: Response) {
    try {
      const { funcionariosIds, aeronaveId, ...dadosEtapa } = req.body;

      const novaEtapa = await prisma.etapa.create({
        data: {
          ...dadosEtapa,
          aeronave: { connect: { id: aeronaveId } },
          funcionarios: {
            connect: funcionariosIds.map((id: string) => ({ id }))
          }
        },
        include: { funcionarios: true }
      });
      res.status(201).json(novaEtapa);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao adicionar etapa' });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status, funcionariosIds } = req.body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;

    if (funcionariosIds) {
      dataToUpdate.funcionarios = {
        set: funcionariosIds.map((fId: string) => ({ id: fId }))
      };
    }

    const etapa = await prisma.etapa.update({
      where: { id },
      data: dataToUpdate,
      include: { funcionarios: true }
    });
    res.json(etapa);
  }
}