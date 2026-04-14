import prisma from "../../config/database.js";

export const syncUser = async (clerkId: string, email: string, username?: string, avatarUrl?: string) => {
  // Upsert user to ensure they exist
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      username: username || null,
      avatarUrl: avatarUrl || null,
    },
    create: {
      clerkId,
      email,
      username: username || null,
      avatarUrl: avatarUrl || null,
    },
  });

  return user;
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
