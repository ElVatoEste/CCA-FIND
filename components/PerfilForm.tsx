"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "@/actions/profile";
import { btnPrimary, inputClass } from "@/components/ui";

type Profile = { name: string; grado: string; aula: string };

export function PerfilForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ProfileActionState, FormData>(
    updateProfile,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
      <h2 className="font-bold text-ink">Editar perfil</h2>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Nombre</span>
        <input name="name" required defaultValue={profile.name} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Grado</span>
          <input name="grado" required defaultValue={profile.grado} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Aula</span>
          <input name="aula" required defaultValue={profile.aula} className={inputClass} />
        </label>
      </div>

      {state?.error && <p className="text-sm font-medium text-lost">{state.error}</p>}
      {state?.ok && <p className="text-sm text-found">✓ Perfil actualizado.</p>}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
