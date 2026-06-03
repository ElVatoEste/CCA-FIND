import { TopNav } from "@/components/TopNav";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <TopNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 md:flex-row">
        <aside className="md:w-52 md:shrink-0">
          <span className="mb-3 hidden font-mono text-xs font-semibold tracking-widest text-muted md:block">
            ADMIN
          </span>
          <AdminNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
