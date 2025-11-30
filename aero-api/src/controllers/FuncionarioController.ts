import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class FuncionarioController {

  static async store(req: Request, res: Response) {
    try {
      const dados = { ...req.body, senha: req.body.senha || '123' };
      const novoFunc = await prisma.funcionario.create({ data: dados });
      const { senha, ...seguro } = novoFunc;
      res.status(201).json(seguro);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar funcionário. Usuário já existe?' });
    }
  }

  static async index(req: Request, res: Response) {
    const funcionarios = await prisma.funcionario.findMany();
    const seguros = funcionarios.map(({ senha, ...resto }) => resto);
    res.json(seguros);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { senha, ...dados } = req.body;
    try {
      const funcionario = await prisma.funcionario.update({
        where: { id },
        data: dados
      });
      res.json({ id: funcionario.id, nome: funcionario.nome, usuario: funcionario.usuario });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar funcionário.' });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.funcionario.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar funcionário.' });
    }
  }
}