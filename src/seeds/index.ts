import db from '../config/connection.js';
import { Course, thoughts } from '../models/index.js';
import cleanDB from './cleanDB.js';
import { getRandomName, getRandomreactions } from './data.js';

try {
  await db();
  await cleanDB();

  // Create empty array to hold the thoughtss
  const thoughtss = [];

  // Loop 20 times -- add thoughtss to the thoughtss array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    const reactions = getRandomreactions(20);

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    thoughtss.push({
      first,
      last,
      github,
      reactions,
    });
  }

  // Add thoughtss to the collection and await the results
  const thoughtsData = await thoughts.create(thoughtss);

  // Add courses to the collection and await the results
  await Course.create({
    name: 'UCLA',
    inPerson: false,
    thoughtss: [...thoughtsData.map(({ _id }: { [key: string]: any }) => _id)],
  });

  // Log out the seed data to indicate what should appear in the database
  console.table(thoughtss);
  console.info('Seeding complete! 🌱');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}

