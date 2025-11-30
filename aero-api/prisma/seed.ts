import { PrismaClient, NivelPermissao } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const admin = await prisma.funcionario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nome: 'Admin User',
      usuario: 'admin',
      senha: 'admin',
      nivelPermissao: NivelPermissao.ADMINISTRADOR,
    },
  });

  const eng = await prisma.funcionario.upsert({
    where: { usuario: 'eng' },
    update: {},
    create: {
      nome: 'Engenheiro Chefe',
      usuario: 'eng',
      senha: '123',
      nivelPermissao: NivelPermissao.ENGENHEIRO,
    },
  });

  const op = await prisma.funcionario.upsert({
    where: { usuario: 'op' },
    update: {},
    create: {
      nome: 'Operador de Montagem',
      usuario: 'op',
      senha: '123',
      nivelPermissao: NivelPermissao.OPERADOR,
    },
  });

  console.log('✅ Funcionários criados:', { admin, eng, op });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });