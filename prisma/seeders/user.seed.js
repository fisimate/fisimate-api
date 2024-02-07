import { encrypt } from "../../src/lib/bcrypt.js";
import prisma from "../../src/lib/prisma.js";

const userSeed = async () => {
  const roles = [
    {
      name: "admin",
    },
    {
      name: "teacher",
    },
    {
      name: "user",
    },
  ];

  await prisma.role.createMany({ data: roles });

  const createdRoles = await prisma.role.findMany();

  const users = [
    {
      fullname: "User Siswa",
      email: "siswa@gmail.com",
      nis: "33421221",
      password: await encrypt("siswa123"),
      roleId: createdRoles[2].id,
    },
    {
      fullname: "User Guru",
      email: "guru@gmail.com",
      password: await encrypt("guru12345"),
      roleId: createdRoles[1].id,
    },
    {
      fullname: "Admin",
      email: "admin@gmail.com",
      password: await encrypt("admin"),
      roleId: createdRoles[0].id,
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  return;
};

export default userSeed;
