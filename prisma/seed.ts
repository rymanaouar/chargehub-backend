import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.chargingStation.deleteMany();

  await prisma.chargingStation.createMany({ data: [
    { name: 'Charge Hub — Sousse Centre', address: 'Avenue Habib Bourguiba', city: 'Sousse', lat: 35.8256, lng: 10.6369, availablePorts: 6, totalPorts: 8, pricePerKwh: 0.45, powerOutput: '250 kW', rating: 4.8, status: 'available' },
    { name: 'Charge Hub — Aéroport Sousse', address: 'Route de Monastir', city: 'Sousse', lat: 35.7541, lng: 10.6869, availablePorts: 4, totalPorts: 8, pricePerKwh: 0.48, powerOutput: '250 kW', rating: 4.6, status: 'available' },
    { name: 'Charge Hub — Zone Industrielle', address: 'Route de Ceinture', city: 'Sousse', lat: 35.8100, lng: 10.6200, availablePorts: 0, totalPorts: 6, pricePerKwh: 0.42, powerOutput: '150 kW', rating: 4.5, status: 'maintenance' },
    { name: 'Charge Hub — Centre Commercial', address: 'Mall de Sousse', city: 'Sousse', lat: 35.8300, lng: 10.6500, availablePorts: 2, totalPorts: 10, pricePerKwh: 0.50, powerOutput: '250 kW', rating: 4.7, status: 'busy' },
  ]});

  console.log('✅ 4 stations Sousse created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
