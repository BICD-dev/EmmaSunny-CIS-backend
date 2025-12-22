import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';
async function main() {
  console.log('Start seeding...');

  // Hash passwords for security
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);

  // Create admin officer
  const admin = await prisma.officer.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'User',
      username: 'admin',
      email: 'admin@company.com',
      phone: '+234-800-000-0001',
      role: 'admin',
      password: hashedAdminPassword,
    },
  });

  console.log('Created admin:', admin);

  // Create staff officers
  const staff1 = await prisma.officer.upsert({
    where: { email: 'john.doe@company.com' },
    update: {},
    create: {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      email: 'john.doe@company.com',
      phone: '+234-800-000-0002',
      role: 'staff',
      password: hashedStaffPassword,
    },
  });

  console.log('Created staff 1:', staff1);

  const staff2 = await prisma.officer.upsert({
    where: { email: 'jane.smith@company.com' },
    update: {},
    create: {
      first_name: 'Jane',
      last_name: 'Smith',
      username: 'janesmith',
      email: 'jane.smith@company.com',
      phone: '+234-800-000-0003',
      role: 'staff',
      password: hashedStaffPassword,
    },
  });

  console.log('Created staff 2:', staff2);

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