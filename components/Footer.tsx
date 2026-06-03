import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-start justify-between gap-2 bg-ink px-6 py-7 text-sm md:flex-row md:items-center md:px-10">
      <div className="flex items-center gap-3">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
          <Image
            src="/colegio_centroamerica.webp"
            alt="Logo Colegio Centro América"
            fill
            sizes="40px"
            className="object-contain"
          />
        </span>
        <div>
          <p className="font-bold text-white">Encuéntralo CCA</p>
          <p className="text-muted">
            Colegio Centro América · Objetos perdidos y encontrados
          </p>
        </div>
      </div>
      <p className="text-muted">© 2026 CCA · Proyecto estudiantil</p>
    </footer>
  );
}
