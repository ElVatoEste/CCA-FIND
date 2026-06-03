"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type CategoryActionState = { error?: string; ok?: boolean } | undefined;

const categorySchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(40),
  icon: z.string().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido"),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon") || "package",
    color: formData.get("color") || "#6B7280",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const slug = slugify(parsed.data.name);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { error: "Ya existe una categoría con ese nombre." };

  await prisma.category.create({ data: { ...parsed.data, slug } });
  revalidatePath("/admin/categorias");
  return { ok: true };
}

export async function toggleCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) return;
  await prisma.category.update({ where: { id }, data: { active: !cat.active } });
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const count = await prisma.post.count({ where: { categoryId: id } });
  // No borrar si tiene publicaciones: desactivar en su lugar.
  if (count > 0) {
    await prisma.category.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.category.delete({ where: { id } });
  }
  revalidatePath("/admin/categorias");
}
