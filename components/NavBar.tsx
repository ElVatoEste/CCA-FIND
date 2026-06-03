"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { logoutAction } from "@/actions/auth";

type NavUser = { name: string; role: "student" | "admin" } | null;

const LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?tipo=lost", label: "Perdidos" },
  { href: "/catalogo?tipo=found", label: "Encontrados" },
];

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;

export function NavBar({ user, active }: { user: NavUser; active?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <motion.header
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, damping: 26 }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-card/85 backdrop-blur-md"
          : "border-transparent bg-card"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.span
            whileHover={reduce ? undefined : { rotate: -8, scale: 1.08 }}
            transition={spring}
            className="relative h-9 w-9 overflow-hidden rounded-lg"
          >
            <Image
              src="/colegio_centroamerica.webp"
              alt="Logo Colegio Centro América"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </motion.span>
          <span className="text-lg font-bold tracking-tight text-ink">
            Encuéntralo CCA
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const on = active === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  on ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    transition={spring}
                    className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 text-sm md:flex">
          {user ? (
            <>
              <Link href="/mis-publicaciones" className="px-2 text-ink-soft hover:text-ink">
                Mis publicaciones
              </Link>
              <Link href="/perfil" className="px-2 text-ink-soft hover:text-ink">
                Perfil
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="px-2 font-medium text-ink">
                  Admin
                </Link>
              )}
              <Tap>
                <Link
                  href="/publicar"
                  className="rounded-full bg-accent px-4 py-2 font-semibold text-white"
                >
                  Publicar
                </Link>
              </Tap>
              <form action={logoutAction}>
                <Tap>
                  <button className="rounded-full border border-line px-3 py-2 font-medium text-ink-soft">
                    Salir
                  </button>
                </Tap>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="px-2 font-medium text-ink">
                Entrar
              </Link>
              <Tap>
                <Link
                  href="/register"
                  className="rounded-full bg-accent px-4 py-2 font-semibold text-white"
                >
                  Registrarse
                </Link>
              </Tap>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line md:hidden"
          aria-label="Menú"
        >
          <motion.span
            animate={open ? { rotate: 45 } : { rotate: 0 }}
            className="relative block h-3.5 w-4"
          >
            <motion.span
              animate={open ? { y: 6, rotate: 0 } : { y: 0 }}
              className="absolute left-0 top-0 h-0.5 w-full rounded bg-ink"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="absolute left-0 top-1.5 h-0.5 w-full rounded bg-ink"
            />
            <motion.span
              animate={open ? { y: -6, rotate: 90 } : { y: 3, rotate: 0 }}
              className="absolute left-0 top-3 h-0.5 w-full rounded bg-ink"
            />
          </motion.span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-card md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-line" />
              {user ? (
                <>
                  <MobileLink href="/mis-publicaciones" onClick={() => setOpen(false)}>
                    Mis publicaciones
                  </MobileLink>
                  <MobileLink href="/perfil" onClick={() => setOpen(false)}>
                    Perfil
                  </MobileLink>
                  {user.role === "admin" && (
                    <MobileLink href="/admin" onClick={() => setOpen(false)}>
                      Admin
                    </MobileLink>
                  )}
                  <Link
                    href="/publicar"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Publicar objeto
                  </Link>
                  <form action={logoutAction} className="mt-1">
                    <button className="w-full rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-soft">
                      Salir
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <MobileLink href="/login" onClick={() => setOpen(false)}>
                    Entrar
                  </MobileLink>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-2"
    >
      {children}
    </Link>
  );
}

function Tap({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
