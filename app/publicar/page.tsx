import { TopNav } from "@/components/TopNav";
import { listActiveCategories } from "@/lib/categories";
import { requireUser } from "@/lib/session";
import { PublicarForm } from "@/components/PublicarForm";

export default async function PublicarPage() {
  await requireUser();
  const categories = await listActiveCategories();

  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <PublicarForm categories={categories} />
      </main>
    </>
  );
}
