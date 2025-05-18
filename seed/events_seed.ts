import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const events = [
    { eventName: 'Singing', about: 'Solo or group singing performance.' },
    { eventName: 'Dancing', about: 'Show off your best dance moves!' },
    { eventName: 'Musical_Chair', about: 'A fun and classic game for everyone.' },
    { eventName: 'Memories_Sharing', about: 'Share your favorite memories with everyone.' },
    {
      eventName: 'Anaikatti_Nature_Trip',
      about: 'One-day nature getaway to Anaikatti on Sunday, 3rd August 2025. Departing at 8 AM for a 40 km journey, enjoy a refreshing river bath, followed by breakfast and lunch. Return by 4 PM. All expenses covered by the department.'
    }
  ];

  for (const event of events) {
    await prisma.activity.upsert({
      where: { eventName: event.eventName },
      update: {},
      create: {
        eventName: event.eventName,
        about: event.about,
      },
    });
  }

  console.log('Activities seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
