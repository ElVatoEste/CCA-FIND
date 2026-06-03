import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Middleware edge-safe: usa authConfig (sin Prisma).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Excluye assets estáticos y la ruta de auth.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
