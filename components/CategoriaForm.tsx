"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createCategory,
  type CategoryActionState,
} from "@/actions/categories";
import { btnPrimary, inputClass } from "@/components/ui";

const ICONS = ["laptop", "shirt", "file-text", "key", "pencil", "package", "watch", "wallet"];

export function CategoriaForm() {
  const [state, action, pending] = useActionState<CategoryActionState, FormData>(
    createCategory,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm"
    >
      <h2 className="font-bold text-ink">Nueva categoría</h2>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Nombre</span>
        <input name="name" required className={inputClass} placeholder="Electrónica" />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Icono</span>
        <select name="icon" defaultValue="package" className={inputClass}>
          {ICONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-soft">Color</span>
        <input
          type="color"
          name="color"
          defaultValue="#3B7A57"
          className="h-10 w-16 cursor-pointer rounded-lg border border-line"
        />
      </label>

      {state?.error && <p className="text-sm font-medium text-lost">{state.error}</p>}
      {state?.ok && <p className="text-sm text-found">✓ Categoría creada.</p>}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Guardando…" : "Crear categoría"}
      </button>
    </form>
  );
}
