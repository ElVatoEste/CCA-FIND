"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export type ProfileActionState = { error?: string; ok?: boolean } | undefined;

const profileSchema = z.object({
  name: z.string().min(3, "Nombre muy corto").max(80),
  grado: z.string().min(1).max(20),
  aula: z.string().min(1).max(20),
});

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    grado: formData.get("grado"),
    aula: formData.get("aula"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  revalidatePath("/perfil");
  return { ok: true };
}
