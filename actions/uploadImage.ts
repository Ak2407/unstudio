"use server";

import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import prisma from "@/db";

export const uploadImage = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return { error: "User ID not found" };
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return { error: "User Not found" };
  }

  const images = await prisma.image.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return images;
};
