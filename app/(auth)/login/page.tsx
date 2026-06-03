"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { loginAction } from "@/actions/auth";
import { PasswordField } from "@/components/PasswordField";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const reduce = useReducedMotion();

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/colegio_centroamerica.webp"
            alt="Logo Colegio Centro América"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Encuéntralo CCA
          </span>
        </Link>
        <div className="flex flex-col gap-4">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="text-4xl font-bold leading-[1.05] tracking-tight text-white"
          >
            Lo que se pierde<br />
            casi siempre <span className="italic text-accent">vuelve</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.24 }}
            className="max-w-xs leading-relaxed text-muted"
          >
            Entra para reportar y recuperar objetos junto a la comunidad
            estudiantil.
          </motion.p>
        </div>
        <span className="font-mono text-xs tracking-widest text-muted">
          COLEGIO CENTRO AMÉRICA
        </span>
      </aside>

      <div className="flex items-center justify-center bg-surface px-6 py-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold tracking-widest text-accent">
              INICIAR SESIÓN
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              Bienvenido de nuevo
            </h1>
          </div>

          <form action={action} className="flex flex-col gap-4">
            <Field label="Correo electrónico" name="email" type="email" placeholder="nombre.apellido@est.cca.edu.ni" />
            <PasswordField label="Contraseña" name="password" placeholder="••••••••" />

            <AnimatePresence>
              {state?.error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-lost/10 px-3 py-2 text-sm font-medium text-lost"
                >
                  {state.error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={pending}
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="mt-2 rounded-full bg-accent py-3 text-sm font-semibold text-white transition disabled:opacity-60"
            >
              {pending ? "Entrando…" : "Iniciar sesión"}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-accent">
              Regístrate
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        {...props}
        required
        className="rounded-lg border border-line bg-card px-3.5 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}
