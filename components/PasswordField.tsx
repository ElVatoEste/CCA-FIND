"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function PasswordField({
  label,
  name = "password",
  placeholder,
}: {
  label: string;
  name?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-card px-3.5 py-3 pr-11 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:text-ink"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={show ? "on" : "off"}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {show ? <EyeOff /> : <Eye />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </label>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M6.6 6.6A18.5 18.5 0 0 0 2 12s3.5 7 10 7a9.1 9.1 0 0 0 4.1-.96" />
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
