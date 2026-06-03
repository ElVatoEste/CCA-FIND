"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PostCard, type PostCardData } from "@/components/PostCard";
import { EmptyState } from "@/components/ui";
import type { PostType } from "@prisma/client";

type Category = { id: string; name: string; slug: string; color: string };
type CatalogPost = Omit<PostCardData, "category"> & {
  category: { name: string; color: string; slug: string };
};
type Tab = "all" | PostType;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "lost", label: "Perdidos" },
  { key: "found", label: "Encontrados" },
];

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;
const ease = [0.16, 1, 0.3, 1] as const;

export function CatalogClient({
  posts,
  categories,
  initialTab = "all",
}: {
  posts: CatalogPost[];
  categories: Category[];
  initialTab?: Tab;
}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"recent" | "old">("recent");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = posts
      .filter((p) => (tab === "all" ? true : p.type === tab))
      .filter((p) => (cat ? p.category.slug === cat : true))
      .filter((p) =>
        needle
          ? p.title.toLowerCase().includes(needle) ||
            p.location.toLowerCase().includes(needle) ||
            p.category.name.toLowerCase().includes(needle)
          : true,
      );
    list.sort((a, b) => {
      const d = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sort === "old" ? d : -d;
    });
    return list;
  }, [posts, tab, cat, q, sort]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Catálogo de objetos
        </h1>
        <p className="mt-2 text-ink-soft">
          Lo que la comunidad perdió y encontró ·{" "}
          <motion.span
            key={filtered.length}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="inline-block font-mono font-semibold text-accent"
          >
            {filtered.length}
          </motion.span>{" "}
          resultados
        </p>
      </motion.header>

      <div className="mb-8 flex flex-col gap-5">
        <div className="flex w-fit gap-1 rounded-full border border-line bg-card p-1">
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  on ? "text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="tab-pill"
                    transition={spring}
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                  />
                )}
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar objeto, lugar…"
              className="w-full rounded-full border border-line bg-card px-4 py-2.5 pr-9 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <AnimatePresence>
              {q && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label="Limpiar"
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "recent" | "old")}
            className="rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="recent">Recientes</option>
            <option value="old">Antiguos</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill active={!cat} onClick={() => setCat(null)} label="Todas" />
          {categories.map((c) => (
            <Pill
              key={c.id}
              active={cat === c.slug}
              onClick={() => setCat(cat === c.slug ? null : c.slug)}
              label={c.name}
              color={c.color}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <EmptyState
            title="Nada por aquí todavía"
            subtitle="Ajusta los filtros o intenta otra búsqueda."
          />
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-card text-ink-soft hover:border-ink/25"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: active ? "#fff" : color }}
        />
      )}
      {label}
    </motion.button>
  );
}
