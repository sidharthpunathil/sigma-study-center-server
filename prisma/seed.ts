const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
  const role = "admin"
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL

  const user = await prisma.user.create({
    data: {
      name: name,
      role: role,
      email: email
    },
  });

  console.log('User created!', user);
}


async function remove() {
  const user = await prisma.user.delete({
    where: {
      email: 'sidharthpunathil714@gmail.com'
    },
  });

  console.log('User deleted!', user);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });