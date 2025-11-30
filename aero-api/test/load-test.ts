import axios from 'axios';

const API_URL = 'http://localhost:3000/aeronaves'; 

const ITERATIONS = 5; 

interface Metrics {
    totalResponseTime: number; 
    serverProcessingTime: number; 
    networkLatency: number;
}

async function simulateUser(): Promise<Metrics> {
    const start = performance.now();
    
    try {
        const response = await axios.get(API_URL);
        const end = performance.now();

        const totalTime = end - start;
        const serverTime = parseFloat(response.headers['x-processing-time'] as string || '0');
        
        const latency = Math.max(0, totalTime - serverTime);

        return {
            totalResponseTime: totalTime,
            serverProcessingTime: serverTime,
            networkLatency: latency
        };
    } catch (error) {
        console.error("Erro na requisição. O servidor está rodando?");
        return { totalResponseTime: 0, serverProcessingTime: 0, networkLatency: 0 };
    }
}

async function runScenario(userCount: number) {
    console.log(`\n--- 🧪 TESTANDO COM ${userCount} USUÁRIO(S) SIMULTÂNEO(S) ---`);
    
    const results: Metrics[] = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const requests = Array.from({ length: userCount }, () => simulateUser());
        
        const batchResults = await Promise.all(requests);
        results.push(...batchResults);
    }

    const avgResponse = results.reduce((acc, cur) => acc + cur.totalResponseTime, 0) / results.length;
    const avgProcessing = results.reduce((acc, cur) => acc + cur.serverProcessingTime, 0) / results.length;
    const avgLatency = results.reduce((acc, cur) => acc + cur.networkLatency, 0) / results.length;

    console.log(`📊 RESULTADOS MÉDIOS (${userCount} Users):`);
    console.log(`   - Tempo de Resposta (Total): ${avgResponse.toFixed(2)} ms`);
    console.log(`   - Tempo de Processamento (Server): ${avgProcessing.toFixed(2)} ms`);
    console.log(`   - Latência de Rede (Estimada): ${avgLatency.toFixed(2)} ms`);
    
    return { users: userCount, avgResponse, avgProcessing, avgLatency };
}

async function main() {
    console.log("🚀 INICIANDO TESTES");
    
    await runScenario(1);
    await runScenario(5);
    await runScenario(10);
    
    console.log("\nTestes finalizados");
}

main();
