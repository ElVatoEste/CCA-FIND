"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { registerAction } from "@/actions/auth";
import { PasswordField } from "@/components/PasswordField";

const ease = [0.16, 1, 0.3, 1] as const;
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const reduce = useReducedMotion();

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex items-center justify-center bg-surface px-6 py-12">
        <motion.div
          variants={reduce ? undefined : container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <motion.div variants={item} className="mb-8 flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold tracking-widest text-accent">
              CREAR CUENTA
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              Únete a la comunidad
            </h1>
            <p className="text-sm text-ink-soft">
              Regístrate con tu correo del Colegio Centro América.
            </p>
          </motion.div>

          <form action={action} className="flex flex-col gap-4">
            <motion.div variants={item}>
              <Field label="Nombre completo" name="name" placeholder="Ana María López" />
            </motion.div>
            <motion.div variants={item}>
              <Field label="Correo electrónico" name="email" type="email" placeholder="nombre.apellido@est.cca.edu.ni" />
            </motion.div>
            <motion.div variants={item} className="flex gap-4">
              <Field label="Grado" name="grado" placeholder="9no" />
              <Field label="Aula" name="aula" placeholder="B" />
            </motion.div>
            <motion.div variants={item}>
              <PasswordField label="Contraseña" name="password" placeholder="Mínimo 8 caracteres" />
            </motion.div>

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
              variants={item}
              type="submit"
              disabled={pending}
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="mt-2 rounded-full bg-accent py-3 text-sm font-semibold text-white transition disabled:opacity-60"
            >
              {pending ? "Creando…" : "Crear cuenta"}
            </motion.button>
          </form>

          <motion.p variants={item} className="mt-6 text-sm text-ink-soft">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-accent">
              Inicia sesión
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 lg:flex">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 self-end"
        >
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
        </motion.div>
        <div className="flex flex-col gap-4">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="text-4xl font-bold leading-[1.05] tracking-tight text-white"
          >
            Una red que se<br />
            cuida{" "}
            <span className="italic text-accent">entre sí</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.28 }}
            className="max-w-xs leading-relaxed text-muted"
          >
            Cada cuenta es un estudiante más dispuesto a devolver lo que otro
            perdió.
          </motion.p>
        </div>
        <span className="self-end font-mono text-xs tracking-widest text-muted">
          COLEGIO CENTRO AMÉRICA
        </span>
      </aside>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        {...props}
        required
        className="rounded-lg border border-line bg-card px-3.5 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}
