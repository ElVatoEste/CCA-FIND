"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/publicaciones", label: "Publicaciones" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-ink text-white"
                : "text-ink-soft hover:bg-card"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
