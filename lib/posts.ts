import { prisma } from "@/lib/db";
import type { Prisma, PostStatus, PostType } from "@prisma/client";

export type CatalogParams = {
  type?: PostType;
  q?: string;
  category?: string; // slug
  status?: PostStatus;
  location?: string;
  sort?: "recent" | "old";
};

export async function listPosts(params: CatalogParams) {
  const where: Prisma.PostWhereInput = {};

  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;
  if (params.category) where.category = { slug: params.category };
  if (params.location)
    where.location = { contains: params.location, mode: "insensitive" };
  if (params.q)
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];

  return prisma.post.findMany({
    where,
    include: { category: true, images: true },
    orderBy: { createdAt: params.sort === "old" ? "asc" : "desc" },
  });
}

export async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      owner: { select: { id: true, name: true, grado: true, aula: true } },
    },
  });
}

export async function listMyPosts(ownerId: string) {
  return prisma.post.findMany({
    where: { ownerId },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });
}
