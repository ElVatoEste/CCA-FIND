import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nombre muy corto").max(80),
  email: z
    .string()
    .email("Correo inválido")
    .endsWith("@est.cca.edu.ni", "Usa tu correo institucional @est.cca.edu.ni"),
  grado: z.string().min(1, "Indica tu grado").max(20),
  aula: z.string().min(1, "Indica tu aula").max(20),
  password: z.string().min(8, "Mínimo 8 caracteres").max(100),
});

export const postSchema = z.object({
  type: z.enum(["lost", "found"]),
  title: z.string().min(3, "Título muy corto").max(120),
  categoryId: z.string().min(1, "Elige una categoría"),
  description: z.string().min(10, "Describe un poco más").max(2000),
  location: z.string().min(2, "Indica dónde").max(120),
  eventDate: z.coerce.date(),
});

export const claimSchema = z.object({
  postId: z.string().min(1),
  description: z.string().min(5, "Describe el objeto").max(1000),
  distinctiveMarks: z.string().min(3, "Indica señas distintivas").max(1000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
