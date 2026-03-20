const { prisma } = require("../lib/prisma.cjs");

const HARDCODED_EMAIL = "nosigned@user.com";

const signIn = async () => {
  try {
    const user = await prisma.user.upsert({
      where: { email: HARDCODED_EMAIL },
      update: {},
      create: {
        email: HARDCODED_EMAIL,
        name: "User",
        avatarUrl: "",
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to initialize user");
  }
};

const isFirstUser = async () => {
  const totalUsers = await prisma.user.count();
  return totalUsers > 0;
};

// const getDatabaseUser = async (event, data) => {
//   const user = await prisma.user.findFirst({
//     where: {
//       email: data.email,
//     },
//   });

//   if (user) {
//     return user;
//   }

//   try {
//     const dataSchema = z.object({
//       name: z.string(),
//       email: z.string().email(),
//       avatarUrl: z.string().url(),
//     });

//     const { avatarUrl, email, name } = dataSchema.parse(data);

//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         avatarUrl,
//         name,
//       },
//     });

//     return newUser;
//   } catch (e) {
//     console.log(e);
//   }
// };

module.exports = {
  signIn,
  isFirstUser,
};
