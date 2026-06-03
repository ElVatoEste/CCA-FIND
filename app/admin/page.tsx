import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { TypeBadge, StatusText } from "@/components/ui";

export default async function AdminDashboard() {
  const [users, posts, resolved, pending, byCategory, recent] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "resolved" } }),
    prisma.claim.count({ where: { status: "pending" } }),
    prisma.post.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 5,
    }),
    prisma.post.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true, owner: { select: { name: true } } },
    }),
  ]);

  const catIds = byCategory.map((c) => c.categoryId);
  const catNames = await prisma.category.findMany({
    where: { id: { in: catIds } },
    select: { id: true, name: true, color: true },
  });
  const nameOf = (id: string) => catNames.find((c) => c.id === id);

  const stats = [
    { label: "Usuarios", value: users },
    { label: "Publicaciones", value: posts },
    { label: "Casos resueltos", value: resolved },
    { label: "Solicitudes pendientes", value: pending },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-sm font-semibold tracking-widest text-accent">
          PANEL
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-ink">
          Resumen general
        </h1>
        <p className="text-sm text-ink-soft">
          Gestión de usuarios, publicaciones y solicitudes.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-1 rounded-2xl p-5 ${
              i === 0
                ? "bg-ink"
                : "bg-card shadow-sm"
            }`}
          >
            <p
              className={`font-mono text-4xl font-semibold tracking-tight ${
                i === 0 ? "text-accent" : "text-ink"
              }`}
            >
              {s.value}
            </p>
            <p className={`text-sm ${i === 0 ? "text-muted" : "text-ink-soft"}`}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-ink">Categorías más usadas</h2>
          {byCategory.length === 0 ? (
            <p className="text-sm text-ink-soft">Sin datos.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {byCategory.map((c) => {
                const cat = nameOf(c.categoryId);
                const max = byCategory[0]._count._all || 1;
                const pct = Math.round((c._count._all / max) * 100);
                return (
                  <li key={c.categoryId} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-sm text-ink-soft">
                      {cat?.name ?? "—"}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${pct}%`, background: cat?.color ?? "#3B7A57" }}
                      />
                    </span>
                    <span className="w-6 text-right font-mono text-sm text-ink">
                      {c._count._all}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-ink">Publicaciones recientes</h2>
          <ul className="flex flex-col divide-y divide-line">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/publicacion/${p.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-muted">
                    {p.owner.name} · {formatDate(p.createdAt)}
                  </p>
                </Link>
                <TypeBadge type={p.type} />
                <StatusText status={p.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
