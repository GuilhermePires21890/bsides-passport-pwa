const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  const staff = await prisma.staff.create({ data: { name: 'Admin', email: 'admin@test.com', password: hash }});
  const event = await prisma.event.create({ data: { name: 'Test Event', date: new Date('2026-06-26'), active: true } });
  const sponsor = await prisma.sponsor.create({ data: { name: 'Sponsor Test', boothNumber: '1', eventId: event.id } });
  console.log('Done:', { staff: staff.email, event: event.name, sponsor: sponsor.name });
}

main().finally(() => prisma.$disconnect());