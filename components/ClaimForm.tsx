"use client";

import { useActionState } from "react";
import { createClaim, type ClaimActionState } from "@/actions/claims";
import { btnPrimary, inputClass } from "@/components/ui";

export function ClaimForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState<ClaimActionState, FormData>(
    createClaim,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="rounded-xl bg-found-soft px-4 py-3 text-sm font-medium text-found">
        ✓ Solicitud enviada. El dueño la revisará y te contactará si coincide.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm">
      <input type="hidden" name="postId" value={postId} />
      <p className="font-semibold text-ink">Creo que este objeto es mío</p>
      <textarea
        name="description"
        required
        rows={2}
        placeholder="Describe el objeto"
        className={inputClass}
      />
      <textarea
        name="distinctiveMarks"
        required
        rows={2}
        placeholder="Señas distintivas (lo que solo el dueño sabría)"
        className={inputClass}
      />
      {state?.error && <p className="text-sm font-medium text-lost">{state.error}</p>}
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
