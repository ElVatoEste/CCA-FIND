import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { PerfilForm } from "@/components/PerfilForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/format";

export default async function PerfilPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return null;

  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-ink">Mi perfil</h1>

        <dl className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-card p-6 shadow-sm">
          <Item k="Nombre" v={user.name} />
          <Item k="Correo" v={user.email} />
          <Item k="Grado" v={user.grado} />
          <Item k="Aula" v={user.aula} />
          <Item k="Fecha de registro" v={formatDate(user.createdAt)} />
        </dl>

        <PerfilForm profile={{ name: user.name, grado: user.grado, aula: user.aula }} />
      </main>
      <Footer />
    </>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="text-sm font-semibold text-ink">{v}</dd>
    </div>
  );
}
