"use client";

import { useActionState, useState } from "react";
import { updatePost, type PostActionState } from "@/actions/posts";
import { btnPrimary, inputClass } from "@/components/ui";
import type { PostType } from "@prisma/client";

type Category = { id: string; name: string };
type PostData = {
  id: string;
  type: PostType;
  title: string;
  categoryId: string;
  description: string;
  location: string;
  eventDate: Date;
};

export function EditarForm({
  post,
  categories,
}: {
  post: PostData;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState<PostActionState, FormData>(
    updatePost,
    undefined,
  );
  const [type, setType] = useState<PostType>(post.type);
  const dateStr = new Date(post.eventDate).toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-5 rounded-2xl bg-card p-7 shadow-md">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Editar publicación</h1>
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="type" value={type} />

      <div className="grid grid-cols-2 gap-3">
        {(["lost", "found"] as const).map((t) => {
          const on = type === t;
          const isLost = t === "lost";
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                on
                  ? isLost
                    ? "border-lost bg-lost-soft text-lost"
                    : "border-found bg-found-soft text-found"
                  : "border-line bg-surface text-ink-soft"
              }`}
            >
              {isLost ? "Perdido" : "Encontrado"}
            </button>
          );
        })}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Título</span>
        <input name="title" required defaultValue={post.title} className={inputClass} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Categoría</span>
          <select name="categoryId" required defaultValue={post.categoryId} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Ubicación</span>
          <input name="location" required defaultValue={post.location} className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Fecha</span>
        <input type="date" name="eventDate" required defaultValue={dateStr} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Descripción</span>
        <textarea name="description" required rows={4} defaultValue={post.description} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Agregar fotos (opcional)</span>
        <input
          type="file"
          name="images"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent"
        />
      </label>

      {state?.error && (
        <p className="rounded-lg bg-lost/10 px-3 py-2 text-sm font-medium text-lost">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
