import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Electrónica", slug: "electronica", icon: "laptop", color: "#2563EB" },
  { name: "Ropa", slug: "ropa", icon: "shirt", color: "#D97706" },
  { name: "Documentos", slug: "documentos", icon: "file-text", color: "#0D9488" },
  { name: "Llaves", slug: "llaves", icon: "key", color: "#7C3AED" },
  { name: "Útiles escolares", slug: "utiles", icon: "pencil", color: "#DB2777" },
  { name: "Otros", slug: "otros", icon: "package", color: "#6B7280" },
];

async function main() {
  // Categorías base — idempotente por slug único.
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, color: c.color },
      create: c,
    });
  }
  console.log(`✓ ${CATEGORIES.length} categorías`);

  // Usuario admin inicial — desde variables de entorno.
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@cca.edu";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      name: "Administrador CCA",
      email,
      grado: "—",
      aula: "—",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`✓ admin: ${email}`);

  // Datos demo (solo si la base no tiene publicaciones aún).
  const existing = await prisma.post.count();
  if (existing === 0) {
    const cats = await prisma.category.findMany();
    const bySlug = (s: string) => cats.find((c) => c.slug === s)!.id;
    const demo = [
      { type: "lost" as const, title: "Mochila negra Jansport", categoryId: bySlug("utiles"), location: "Patio central", description: "Mochila negra con llavero de panda. Tiene una libreta de química adentro." },
      { type: "found" as const, title: "Calculadora científica", categoryId: bySlug("electronica"), location: "Lab. de Química", description: "Calculadora Casio encontrada sobre una mesa del laboratorio." },
      { type: "lost" as const, title: "Llaves con llavero rojo", categoryId: bySlug("llaves"), location: "Cancha", description: "Juego de tres llaves con un llavero rojo de goma." },
      { type: "found" as const, title: "Suéter azul talla M", categoryId: bySlug("ropa"), location: "Biblioteca", description: "Suéter azul olvidado en una silla de la biblioteca." },
      { type: "lost" as const, title: "Audífonos inalámbricos", categoryId: bySlug("electronica"), location: "Aula 9B", description: "Estuche blanco de audífonos inalámbricos." },
    ];
    for (const d of demo) {
      await prisma.post.create({
        data: { ...d, eventDate: new Date(), ownerId: admin.id },
      });
    }
    console.log(`✓ ${demo.length} publicaciones demo`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
