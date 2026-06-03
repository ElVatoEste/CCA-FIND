"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { deleteImage, uploadImage } from "@/lib/s3";
import { postSchema } from "@/lib/validations";

export type PostValues = {
  type?: string;
  title?: string;
  categoryId?: string;
  description?: string;
  location?: string;
  eventDate?: string;
};
export type PostActionState =
  | { error?: string; values?: PostValues }
  | undefined;

function readValues(formData: FormData): PostValues {
  return {
    type: String(formData.get("type") ?? ""),
    title: String(formData.get("title") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    description: String(formData.get("description") ?? ""),
    location: String(formData.get("location") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
  };
}

async function assertCanEdit(postId: string) {
  const user = await requireUser();
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { images: true },
  });
  if (!post) redirect("/perdidos");
  if (post.ownerId !== user.id && user.role !== "admin") redirect("/");
  return { user, post };
}

export async function createPost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await requireUser();

  const parsed = postSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      values: readValues(formData),
    };
  }

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  let images;
  try {
    images = await Promise.all(files.map(uploadImage));
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Error al subir imágenes.",
      values: readValues(formData),
    };
  }

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      ownerId: user.id,
      images: { create: images },
    },
  });

  revalidatePath("/perdidos");
  revalidatePath("/encontrados");
  redirect(`/publicacion/${post.id}`);
}

export async function updatePost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const id = String(formData.get("id"));
  await assertCanEdit(id);

  const parsed = postSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length) {
    try {
      const images = await Promise.all(files.map(uploadImage));
      await prisma.image.createMany({
        data: images.map((img) => ({ ...img, postId: id })),
      });
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error al subir imágenes." };
    }
  }

  await prisma.post.update({ where: { id }, data: parsed.data });

  revalidatePath(`/publicacion/${id}`);
  redirect(`/publicacion/${id}`);
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id"));
  const { post } = await assertCanEdit(id);

  // Borra objetos S3 antes de borrar el post (cascade elimina filas Image).
  await Promise.allSettled(post.images.map((img) => deleteImage(img.key)));
  await prisma.post.delete({ where: { id } });

  revalidatePath("/perdidos");
  revalidatePath("/encontrados");
  redirect("/mis-publicaciones");
}

export async function resolvePost(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("status")) === "resolved" ? "resolved" : "active";
  await assertCanEdit(id);

  await prisma.post.update({ where: { id }, data: { status: next } });
  revalidatePath(`/publicacion/${id}`);
  revalidatePath("/mis-publicaciones");
}
