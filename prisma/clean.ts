import { PrismaClient } from "@prisma/client";
import { deleteImage } from "../lib/s3";

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany({ select: { key: true } });
  for (const img of images) {
    try {
      await deleteImage(img.key);
    } catch {
      /* objeto ya inexistente: ignorar */
    }
  }

  const claims = await prisma.claim.deleteMany();
  const imgs = await prisma.image.deleteMany();
  const posts = await prisma.post.deleteMany();

  console.log(
    `✓ limpiado: ${posts.count} publicaciones, ${imgs.count} imágenes, ${claims.count} reclamos`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
