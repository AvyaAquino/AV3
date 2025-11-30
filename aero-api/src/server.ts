import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import router from './routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();

    res.on('finish', () => {
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        console.log(`[MÉTRICA] ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duration}ms`);
    });

    next();
});

app.use(router);

app.get('/', (req, res) => {
    res.json({ status: 'API AeroCode Online' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Middleware de métricas ativo`);
});