import app from './app.js';
import { prisma } from './db.js';

const port = Number(process.env.PORT || 4000);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Arabzadeh store API listening on http://0.0.0.0:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, closing server`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
