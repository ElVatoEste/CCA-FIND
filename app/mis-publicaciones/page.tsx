import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { EmptyState, btnPrimary } from "@/components/ui";
import { listMyPosts } from "@/lib/posts";
import { requireUser } from "@/lib/session";

export default async function MisPublicacionesPage() {
  const user = await requireUser();
  const posts = await listMyPosts(user.id);
  const active = posts.filter((p) => p.status === "active");
  const resolved = posts.filter((p) => p.status === "resolved");

  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-ink">Mis publicaciones</h1>
          <Link href="/publicar" className={btnPrimary}>
            Publicar
          </Link>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            title="Aún no has publicado nada"
            subtitle="Reporta un objeto perdido o encontrado para que la comunidad te ayude."
            action={
              <Link href="/publicar" className={btnPrimary}>
                Publicar objeto
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-10">
            <Section title={`Activas (${active.length})`} posts={active} />
            {resolved.length > 0 && (
              <Section title={`Resueltas (${resolved.length})`} posts={resolved} />
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  posts,
}: {
  title: string;
  posts: React.ComponentProps<typeof PostCard>["post"][];
}) {
  if (posts.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
        <p className="text-sm text-ink-soft">Nada por aquí.</p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
