import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { CatalogClient } from "@/components/CatalogClient";
import { listActiveCategories } from "@/lib/categories";
import { listPosts } from "@/lib/posts";
import type { PostType } from "@prisma/client";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const initialTab: "all" | PostType =
    tipo === "lost" || tipo === "found" ? tipo : "all";

  const [categories, posts] = await Promise.all([
    listActiveCategories(),
    listPosts({ status: "active" }),
  ]);

  const active =
    initialTab === "lost"
      ? "/catalogo?tipo=lost"
      : initialTab === "found"
        ? "/catalogo?tipo=found"
        : "/catalogo";

  return (
    <>
      <TopNav active={active} />
      <CatalogClient posts={posts} categories={categories} initialTab={initialTab} />
      <Footer />
    </>
  );
}
