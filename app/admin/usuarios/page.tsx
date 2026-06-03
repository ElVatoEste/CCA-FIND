import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { inputClass } from "@/components/ui";

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
      : undefined,
    include: { _count: { select: { posts: true, claims: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Usuarios</h1>
          <p className="text-sm text-ink-soft">{users.length} registrados</p>
        </div>
        <form method="get">
          <input name="q" defaultValue={q} placeholder="Buscar nombre o correo…" className={inputClass} />
        </form>
      </header>

      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-4 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {u.name}
                  {u.role === "admin" && (
                    <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      admin
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">
                  {u.email} · {u.grado} {u.aula} · alta {formatDate(u.createdAt)}
                </p>
              </div>
              <div className="text-right text-xs text-ink-soft">
                <p className="font-mono text-sm text-ink">{u._count.posts}</p>
                publicaciones
              </div>
              <div className="text-right text-xs text-ink-soft">
                <p className="font-mono text-sm text-ink">{u._count.claims}</p>
                solicitudes
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
