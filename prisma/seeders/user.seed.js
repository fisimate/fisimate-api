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
      profilePicture:
        "https://storage.googleapis.com/fisibucket/profile_pictures/4b4aaafa156e86.jpg",
      roleId: createdRoles[2].id,
    },
    {
      fullname: "User Guru",
      email: "guru@gmail.com",
      password: await encrypt("guru12345"),
      profilePicture:
        "https://static.independent.co.uk/2024/05/02/23/newFile-1.jpg",
      roleId: createdRoles[1].id,
    },
    {
      fullname: "Admin",
      email: "admin@gmail.com",
      password: await encrypt("admin"),
      profilePicture:
        "https://static.independent.co.uk/2024/05/02/23/newFile-1.jpg",
      roleId: createdRoles[0].id,
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  return prisma.user.findMany({
    where: {
      role: {
        name: "user",
      },
    },
  });
};

export default userSeed;
