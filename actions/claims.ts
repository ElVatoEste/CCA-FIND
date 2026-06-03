"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { claimSchema } from "@/lib/validations";

export type ClaimActionState = { error?: string; ok?: boolean } | undefined;

export async function createClaim(
  _prev: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> {
  const user = await requireUser();

  const parsed = claimSchema.safeParse({
    postId: formData.get("postId"),
    description: formData.get("description"),
    distinctiveMarks: formData.get("distinctiveMarks"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const post = await prisma.post.findUnique({
    where: { id: parsed.data.postId },
    select: { ownerId: true },
  });
  if (!post) return { error: "La publicación ya no existe." };
  if (post.ownerId === user.id) {
    return { error: "No puedes reclamar tu propia publicación." };
  }

  await prisma.claim.create({
    data: { ...parsed.data, claimantId: user.id },
  });

  revalidatePath(`/publicacion/${parsed.data.postId}`);
  return { ok: true };
}

export async function resolveClaim(formData: FormData) {
  const user = await requireUser();
  const claimId = String(formData.get("claimId"));
  const next =
    String(formData.get("status")) === "accepted" ? "accepted" : "rejected";

  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { post: { select: { id: true, ownerId: true } } },
  });
  if (!claim) return;
  if (claim.post.ownerId !== user.id && user.role !== "admin") return;

  await prisma.claim.update({ where: { id: claimId }, data: { status: next } });

  // Aceptar una solicitud marca el objeto como resuelto.
  if (next === "accepted") {
    await prisma.post.update({
      where: { id: claim.post.id },
      data: { status: "resolved" },
    });
  }

  revalidatePath(`/publicacion/${claim.post.id}`);
  revalidatePath("/mis-publicaciones");
}
