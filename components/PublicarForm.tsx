"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { createPost, type PostActionState } from "@/actions/posts";
import { btnPrimary, inputClass } from "@/components/ui";

type Category = { id: string; name: string };

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 380, damping: 30 } as const;
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

type Preview = { url: string; name: string };

export function PublicarForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<PostActionState, FormData>(
    createPost,
    undefined,
  );
  const [type, setType] = useState<"lost" | "found">("lost");
  const [previews, setPreviews] = useState<Preview[]>([]);
  const reduce = useReducedMotion();

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setPreviews(files.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  // Tras un error el server action devuelve los valores enviados; React resetea
  // los inputs no controlados a su defaultValue → se conservan.
  const v = state?.values;

  return (
    <motion.form
      variants={reduce ? undefined : container}
      initial="hidden"
      animate="show"
      action={action}
      className="flex flex-col gap-5 rounded-2xl bg-card p-7 shadow-md"
    >
      <motion.div variants={item}>
        <span className="font-mono text-sm font-semibold tracking-widest text-accent">
          NUEVO REPORTE
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Publicar objeto</h1>
        <p className="text-sm text-ink-soft">
          Cuéntale a la comunidad qué encontraste o perdiste.
        </p>
      </motion.div>

      <input type="hidden" name="type" value={type} />
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {(["lost", "found"] as const).map((t) => {
          const on = type === t;
          const isLost = t === "lost";
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`relative overflow-hidden rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                on
                  ? isLost
                    ? "border-lost text-lost"
                    : "border-found text-found"
                  : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="type-pill"
                  transition={spring}
                  className={`absolute inset-0 -z-10 ${isLost ? "bg-lost-soft" : "bg-found-soft"}`}
                />
              )}
              {isLost ? "Perdí algo" : "Encontré algo"}
            </button>
          );
        })}
      </motion.div>

      <motion.label variants={item} className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Título</span>
        <input name="title" required defaultValue={v?.title} className={inputClass} placeholder="Ej. Mochila negra Jansport" />
      </motion.label>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Categoría</span>
          <select name="categoryId" required defaultValue={v?.categoryId ?? ""} className={inputClass}>
            <option value="" disabled>
              Selecciona…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Ubicación</span>
          <input name="location" required defaultValue={v?.location} className={inputClass} placeholder="Patio central" />
        </label>
      </motion.div>

      <motion.label variants={item} className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Fecha</span>
        <input type="date" name="eventDate" required defaultValue={v?.eventDate} className={inputClass} />
      </motion.label>

      <motion.label variants={item} className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Descripción</span>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={v?.description}
          className={inputClass}
          placeholder="Describe el objeto: color, marca, señas distintivas…"
        />
      </motion.label>

      <motion.label variants={item} className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Fotografías</span>
        <input
          type="file"
          name="images"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={onFiles}
          className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-accent/15"
        />
        <span className="text-xs text-muted">JPG, PNG o WEBP · máx. 5 MB c/u · hasta 5</span>

        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex flex-wrap gap-2"
            >
              {previews.map((p, i) => (
                <motion.div
                  key={p.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, ...spring }}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.label>

      <AnimatePresence>
        {state?.error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-lost/10 px-3 py-2 text-sm font-medium text-lost"
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        variants={item}
        type="submit"
        disabled={pending}
        whileHover={reduce ? undefined : { y: -1 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        className={btnPrimary}
      >
        {pending ? "Publicando…" : "Publicar"}
      </motion.button>
    </motion.form>
  );
}
