import type { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

// Rutas que exigen sesión de estudiante (o admin).
const STUDENT_ROUTES = ["/publicar", "/mis-publicaciones", "/perfil"];

/**
 * Config edge-safe (sin Prisma ni bcrypt): la importa el middleware.
 * Los providers se añaden en auth.ts (corren en Node).
 */
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const role = user?.role;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) return role === "admin";
      if (STUDENT_ROUTES.some((r) => path.startsWith(r))) return !!user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub!;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
