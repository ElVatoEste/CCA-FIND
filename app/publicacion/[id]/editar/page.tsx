import { notFound, redirect } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { EditarForm } from "@/components/EditarForm";
import { listActiveCategories } from "@/lib/categories";
import { getPost } from "@/lib/posts";
import { requireUser } from "@/lib/session";

export default async function EditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const post = await getPost(id);
  if (!post) notFound();
  if (post.ownerId !== user.id && user.role !== "admin") redirect("/");

  const categories = await listActiveCategories();

  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <EditarForm post={post} categories={categories} />
      </main>
    </>
  );
}
