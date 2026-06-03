import Image from "next/image";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { TypeBadge, btnPrimary, btnOutline } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/format";

const HERO_TILES = [
  {
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
    label: "Mochila · Patio",
    tall: true,
  },
  {
    img: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?w=500&h=600&fit=crop",
    label: "Llaves · Cancha",
    tall: false,
  },
  {
    img: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&h=600&fit=crop",
    label: "Calculadora · Lab",
    tall: false,
  },
];

const STEPS = [
  { n: "01", t: "Publica", d: "Sube una foto y describe qué perdiste o encontraste. Toma menos de un minuto." },
  { n: "02", t: "Conecta", d: "Quien reconoce el objeto envía una solicitud con señas para verificar que es suyo." },
  { n: "03", t: "Recupera", d: "Aceptas la solicitud, coordinan la entrega y el objeto vuelve a casa." },
];

export default async function Home() {
  const [user, users, posts, resolved, recent] = await Promise.all([
    getCurrentUser(),
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "resolved" } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true, images: true, owner: { select: { name: true } } },
    }),
  ]);

  const [feature, ...rest] = recent;

  return (
    <>
      <TopNav active="/" />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Comunidad CCA · {resolved} objetos devueltos
          </span>
          <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-6xl">
            Lo que se pierde<br />
            casi siempre <span className="italic text-accent">vuelve</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-ink-soft">
            Reporta lo que perdiste o encontraste en el colegio. La comunidad
            estudiantil se encarga del resto.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={user ? "/publicar" : "/login"} className={btnPrimary}>
              Publicar un objeto
            </Link>
            <Link href="/catalogo" className={btnOutline}>
              Explorar catálogo →
            </Link>
          </div>
        </div>

        <div className="grid h-[420px] grid-cols-2 gap-4">
          {HERO_TILES.slice(0, 1).map((t) => (
            <HeroTile key={t.label} {...t} className="h-full" />
          ))}
          <div className="flex flex-col gap-4 pt-10">
            {HERO_TILES.slice(1).map((t) => (
              <HeroTile key={t.label} {...t} className="flex-1" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-4">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink p-10 md:flex-row md:items-center">
          <p className="max-w-xs text-2xl font-bold leading-snug tracking-tight text-white">
            Una red de estudiantes que se cuida entre sí.
          </p>
          <div className="flex gap-12">
            {[
              [users, "estudiantes"],
              [posts, "objetos reportados"],
              [resolved, "ya devueltos"],
            ].map(([n, l]) => (
              <div key={l as string} className="flex flex-col">
                <span className="font-mono text-4xl font-semibold tracking-tight text-accent">
                  {n}
                </span>
                <span className="text-sm text-muted">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-bold tracking-tight text-ink">Tres pasos y listo</h2>
          <p className="max-w-xs text-right text-sm text-ink-soft">
            Sin formularios eternos. Publicas, te contactan, lo recuperas.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-3 border-t border-line pt-6">
              <span className="font-mono text-sm font-semibold tracking-widest text-accent">
                {s.n}
              </span>
              <h3 className="text-xl font-semibold text-ink">{s.t}</h3>
              <p className="leading-relaxed text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {feature && (
        <section className="bg-surface-2 py-16">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-ink">Recién reportados</h2>
              <Link href="/catalogo" className="text-sm font-semibold text-accent">
                Ver todo el catálogo →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_2fr]">
              <FeatureTile post={feature} />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {rest.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-accent-soft px-6 py-14 text-center">
          <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-ink">
            ¿Perdiste algo hoy? No esperes a mañana.
          </h2>
          <p className="max-w-md text-ink-soft">
            Mientras más rápido lo reportas, más fácil es que alguien lo reconozca.
          </p>
          <Link href={user ? "/publicar" : "/login"} className={btnPrimary}>
            Publicar ahora
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function HeroTile({
  img,
  label,
  className = "",
}: {
  img: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface-2 ${className}`}>
      <Image
        src={img}
        alt={label}
        fill
        sizes="280px"
        className="object-cover"
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
        {label}
      </span>
    </div>
  );
}

function FeatureTile({
  post,
}: {
  post: {
    id: string;
    title: string;
    type: "lost" | "found";
    location: string;
    createdAt: Date;
    images: { url: string }[];
  };
}) {
  const img = post.images[0]?.url;
  return (
    <Link
      href={`/publicacion/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-surface-2">
        {img ? (
          <Image src={img} alt={post.title} fill sizes="400px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">Sin foto</div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <TypeBadge type={post.type} />
        <h3 className="text-xl font-bold tracking-tight text-ink">{post.title}</h3>
        <p className="text-sm text-ink-soft">
          {post.location} · {formatDate(post.createdAt)}
        </p>
      </div>
    </Link>
  );
}
