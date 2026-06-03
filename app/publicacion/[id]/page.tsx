import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { ClaimForm } from "@/components/ClaimForm";
import { ClaimBadge, StatusText, TypeBadge, btnOutline } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getPost } from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";
import { deletePost, resolvePost } from "@/actions/posts";
import { resolveClaim } from "@/actions/claims";
import { formatDate } from "@/lib/format";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === post.ownerId;
  const canManage = isOwner || user?.role === "admin";

  const claims = canManage
    ? await prisma.claim.findMany({
        where: { postId: id },
        include: { claimant: { select: { name: true, grado: true, aula: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const myClaim =
    user && !isOwner
      ? await prisma.claim.findFirst({ where: { postId: id, claimantId: user.id } })
      : null;

  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <nav className="mb-5 text-sm text-muted">
          <Link href={post.type === "lost" ? "/perdidos" : "/encontrados"}>
            {post.type === "lost" ? "Perdidos" : "Encontrados"}
          </Link>{" "}
          / <span className="text-ink">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2">
              {post.images[0] ? (
                <Image
                  src={post.images[0].url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  Sin foto
                </div>
              )}
            </div>
            {post.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {post.images.slice(1, 5).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden rounded-xl bg-surface-2"
                  >
                    <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <TypeBadge type={post.type} />
              <StatusText status={post.status} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{post.title}</h1>

            <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-card p-5 shadow-sm">
              <Spec k="Categoría" v={post.category.name} />
              <Spec k="Ubicación" v={post.location} />
              <Spec k="Fecha" v={formatDate(post.eventDate)} />
              <Spec k="Reportado por" v={`${post.owner.name} · ${post.owner.grado} ${post.owner.aula}`} />
            </dl>

            <div>
              <p className="mb-1 text-xs font-semibold text-muted">DESCRIPCIÓN</p>
              <p className="leading-relaxed text-ink-soft">{post.description}</p>
            </div>

            {canManage && (
              <div className="flex flex-wrap gap-3 border-t border-line pt-5">
                <Link href={`/publicacion/${post.id}/editar`} className={btnOutline}>
                  Editar
                </Link>
                <form action={resolvePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={post.status === "active" ? "resolved" : "active"}
                  />
                  <button className={btnOutline}>
                    {post.status === "active" ? "Marcar resuelta" : "Reabrir"}
                  </button>
                </form>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button className="rounded-full border border-lost px-5 py-3 text-sm font-semibold text-lost">
                    Eliminar
                  </button>
                </form>
              </div>
            )}

            {!canManage && post.status === "active" && (
              <div className="border-t border-line pt-5">
                {!user ? (
                  <Link href="/login" className={btnOutline}>
                    Inicia sesión para reclamar este objeto
                  </Link>
                ) : myClaim ? (
                  <div className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm">
                    <span className="text-ink-soft">Tu solicitud:</span>
                    <ClaimBadge status={myClaim.status} />
                  </div>
                ) : (
                  <ClaimForm postId={post.id} />
                )}
              </div>
            )}
          </div>
        </div>

        {canManage && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink">
              Solicitudes recibidas ({claims.length})
            </h2>
            {claims.length === 0 ? (
              <p className="text-sm text-ink-soft">Aún no hay solicitudes.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {claims.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-semibold text-ink">
                          {c.claimant.name} · {c.claimant.grado} {c.claimant.aula}
                        </span>
                        <ClaimBadge status={c.status} />
                      </div>
                      <p className="text-sm text-ink-soft">{c.description}</p>
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
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="text-sm font-semibold text-ink">{v}</dd>
    </div>
  );
}
