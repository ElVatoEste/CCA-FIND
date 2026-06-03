import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { TypeBadge, StatusText, inputClass } from "@/components/ui";

export default async function AdminPublicaciones({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await prisma.post.findMany({
    where: q
      ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { location: { contains: q, mode: "insensitive" } }] }
      : undefined,
    include: { category: true, owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Publicaciones</h1>
          <p className="text-sm text-ink-soft">{posts.length} resultados</p>
        </div>
        <form method="get">
          <input name="q" defaultValue={q} placeholder="Buscar…" className={inputClass} />
        </form>
      </header>

      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <ul className="divide-y divide-line">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center gap-4 px-5 py-3">
              <Link href={`/publicacion/${p.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.title}</p>
                <p className="text-xs text-muted">
                  {p.category.name} · {p.owner.name} · {formatDate(p.createdAt)}
                </p>
              </Link>
              <TypeBadge type={p.type} />
              <StatusText status={p.status} />
              <Link
                href={`/publicacion/${p.id}/editar`}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
