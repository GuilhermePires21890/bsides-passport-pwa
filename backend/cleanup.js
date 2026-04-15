const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  const attendees = await prisma.attendee.findMany({
    where: { email: { contains: 'bsidestest.com' } },
    select: { id: true, email: true }
  });

  console.log('Attendees de teste encontrados:', attendees.length);
  const ids = attendees.map(a => a.id);

  const stamps = await prisma.stamp.deleteMany({
    where: { attendeeId: { in: ids } }
  });
  console.log('Stamps apagados:', stamps.count);

  const deleted = await prisma.attendee.deleteMany({
    where: { id: { in: ids } }
  });
  console.log('Attendees apagados:', deleted.count);

  await prisma.$disconnect();
}

cleanup().catch(e => {
  console.error(e);
  prisma.$disconnect();
});