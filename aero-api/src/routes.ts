import { Router } from 'express';

import { AeronaveController } from './controllers/AeronaveController.js';
import { PecaController } from './controllers/PecaController.js';
import { EtapaController } from './controllers/EtapaController.js';
import { TesteController } from './controllers/TesteController.js';
import { FuncionarioController } from './controllers/FuncionarioController.js';
import { AuthController } from './controllers/AuthController.js';

const router = Router();

// Aeronaves
router.get('/aeronaves', AeronaveController.index);
router.get('/aeronaves/:codigo', AeronaveController.show);
router.post('/aeronaves', AeronaveController.store);
router.put('/aeronaves/:codigo', AeronaveController.update);
router.delete('/aeronaves/:codigo', AeronaveController.delete);
// Peças
router.post('/pecas', PecaController.store);
router.patch('/pecas/:id', PecaController.update);

// Etapas
router.post('/etapas', EtapaController.store);
router.patch('/etapas/:id', EtapaController.update);

// Testes
router.post('/testes', TesteController.store);

// Funcionários
router.get('/funcionarios', FuncionarioController.index);
router.post('/funcionarios', FuncionarioController.store);
router.put('/funcionarios/:id', FuncionarioController.update);
router.delete('/funcionarios/:id', FuncionarioController.delete);

// Auth
router.post('/login', AuthController.login);

export default router;