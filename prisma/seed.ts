import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 10 activities
  const activities = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.activity.create({
        data: {
          eventName: `Event ${index + 1}`,
          about: `This is event number ${index + 1}`,
        },
      }),
    ),
  );

  // Create 5 users with associated profiles
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, index) =>
      prisma.user.create({
        data: {
          email: `user${index + 1}@example.com`,
          role: index === 0 ? 'SUPERUSER' : 'USER', // First user is SUPERUSER
          profile: {
            create: {
              name: `User ${index + 1}`,
              email: `user${index + 1}@example.com`,
              password: 'password123', // In real apps, encrypt passwords!
              gender: index % 2 === 0 ? 'Male' : 'Female',
              rollNumber: `21ABC${index + 1}`,
              phoneNumber: `9876543${index + 1}`,
              designation: `Student ${index + 1}`,
              graduationYear: 2027,
              address: `Address ${index + 1}`,
              course: index % 2 === 0 ? 'SOFTWARESYSTEMS' : 'DATASCIENCE',
            },
          },
        },
        include: { profile: true }, // Include the profile in the user
      }),
    ),
  );

  // Assign users to activities (10 activities, 5 users)
  for (const activity of activities) {
    // Pick 2 random users for each activity
    const randomUsers = users.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const user of randomUsers) {
      await prisma.userActivity.create({
        data: {
          eventId: activity.id,
          userId: user.id,
        },
      });
    }
  }

//   // Create some singing records for users
//   for (const user of users) {
//     await prisma.singing.create({
//       data: {
//         songDetails: `Song details for ${user.profile?.name}`,
//         userId: user.id,
//       },
//     });
//   }

  // Create some gallery records for users
  for (const user of users) {
    await prisma.gallery.create({
      data: {
        assetUrl: `https://someurl.com/${user.profile?.name}-gallery.jpg`,
        userId: user.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });