import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT!;
const bucket = process.env.S3_BUCKET!;

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "auto",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export type UploadedImage = { url: string; key: string };

export async function uploadImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Formato no permitido (usa JPG, PNG o WEBP).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La imagen supera los 5 MB.");
  }

  const ext = file.type.split("/")[1];
  const key = `posts/${randomUUID()}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
    }),
  );

  // El bucket de Railway es privado: servimos vía proxy propio, no URL pública.
  return { url: `/api/img/${key}`, key };
}

export async function deleteImage(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getImageObject(key: string) {
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const bytes = await obj.Body!.transformToByteArray();
  return {
    bytes,
    contentType: obj.ContentType ?? "application/octet-stream",
  };
}
