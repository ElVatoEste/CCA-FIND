import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ClaimBadge } from "@/components/ui";
import { resolveClaim } from "@/actions/claims";

export default async function AdminSolicitudes() {
  const claims = await prisma.claim.findMany({
    include: {
      post: { select: { id: true, title: true } },
      claimant: { select: { name: true, grado: true, aula: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Solicitudes</h1>
        <p className="text-sm text-ink-soft">{claims.length} solicitudes de recuperación</p>
      </header>

      <ul className="flex flex-col gap-3">
        {claims.map((c) => (
          <li
            key={c.id}
            className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Link href={`/publicacion/${c.post.id}`} className="font-semibold text-ink">
                  {c.post.title}
                </Link>
                <ClaimBadge status={c.status} />
                <span className="text-xs text-muted">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-ink-soft">
                {c.claimant.name} · {c.claimant.grado} {c.claimant.aula}
              </p>
              <p className="mt-1 text-sm text-muted">Señas: {c.distinctiveMarks}</p>
            </div>
            {c.status === "pending" && (
              <div className="flex gap-2">
                <form action={resolveClaim}>
                  <input type="hidden" name="claimId" value={c.id} />
                  <input type="hidden" name="status" value="accepted" />
                  <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
                    Aceptar
                  </button>
                </form>
                <form action={resolveClaim}>
                  <input type="hidden" name="claimId" value={c.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft">
                    Rechazar
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
