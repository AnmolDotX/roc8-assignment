import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = Array.from({ length: 100 }).map(() => ({
    name: faker.commerce.department(),
    isChecked: false,
  }));

  await prisma.category.createMany({
    data: categories,
  });

  console.log('Seeded categories');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch(e => {
      console.error(e);
      process.exit(1);
    });
  });
