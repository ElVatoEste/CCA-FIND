import { getImageObject } from "@/lib/s3";

// Proxy de imágenes: el bucket de Railway es privado, se sirve con credenciales propias.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const objectKey = key.join("/");

  try {
    const { bytes, contentType } = await getImageObject(objectKey);
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
