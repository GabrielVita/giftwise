import { PrismaClient } from '@prisma/client';

// Forçamos a injeção da URL diretamente na variável de ambiente do processo
// que o Prisma Client lê nativamente antes de inicializar.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in your environment variables.');
}

const prismaClientSingleton = () => {
  // Inicializamos o PrismaClient puro. Ele vai ler a URL automaticamente 
  // do process.env.DATABASE_URL que validamos acima, sem precisar passar chaves extras.
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}