import { CategoriaForm } from "@/components/CategoriaForm";
import { listAllCategories } from "@/lib/categories";
import { toggleCategory, deleteCategory } from "@/actions/categories";

export default async function AdminCategorias() {
  const categories = await listAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Categorías</h1>
        <p className="text-sm text-ink-soft">
          Crea, activa/desactiva o elimina categorías. Las inactivas no aparecen al publicar.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
          <ul className="divide-y divide-line">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-4">
                <span
                  className="h-9 w-9 shrink-0 rounded-xl"
                  style={{ background: c.color, opacity: c.active ? 1 : 0.4 }}
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${c.active ? "text-ink" : "text-muted"}`}>
                    {c.name}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {c.slug} · {c._count.posts} objetos
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.active ? "bg-found-soft text-found" : "bg-surface-2 text-muted"
                  }`}
                >
                  {c.active ? "Activa" : "Inactiva"}
                </span>
                <form action={toggleCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft">
                    {c.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-lost">
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        <CategoriaForm />
      </div>
    </div>
  );
}
