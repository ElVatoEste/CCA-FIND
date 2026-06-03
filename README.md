# Encuéntralo CCA

Portal web para la comunidad estudiantil del **Colegio Centro América (CCA)**: reportar objetos **perdidos** y **encontrados**, y recuperarlos mediante reclamos entre estudiantes.

> Proyecto estudiantil. Pensado para ser simple y directo, sin sobre-ingeniería.

---

## ¿Qué resuelve?

En el colegio se pierden cosas todos los días (mochilas, calculadoras, llaves, suéteres…). Antes la única forma de recuperarlas era preguntar de boca en boca o esperar suerte. **Encuéntralo CCA** centraliza todo en un solo lugar:

- Quien **pierde** algo lo reporta.
- Quien **encuentra** algo lo publica.
- La comunidad busca en el catálogo y, si reconoce su objeto, envía una **solicitud** con señas para demostrar que es suyo.
- El dueño de la publicación acepta o rechaza, coordinan la entrega y el objeto vuelve a casa.

El contacto del dueño **no se expone** hasta que una solicitud es aceptada.

---

## Funcionalidades

- **Catálogo unificado** de perdidos y encontrados con pestañas, búsqueda en vivo, orden y filtro por categoría.
- **Publicar objeto** con título, categoría, ubicación, fecha, descripción y hasta 5 fotos.
- **Reclamos**: pedir un objeto describiendo señas distintivas; el dueño los gestiona.
- **Mis publicaciones** y **perfil** del estudiante.
- **Panel de administración**: estadísticas, publicaciones, solicitudes, usuarios y **gestión de categorías** (CRUD + activar/desactivar).
- **Autenticación** con correo institucional `@est.cca.edu.ni` y contraseña.
- UI moderna con animaciones y micro-interacciones; respeta `prefers-reduced-motion`.

---

## Stack

- **Next.js 15** (App Router, TypeScript) con **Server Actions** y Route Handlers.
- **TailwindCSS v4** + **Motion** (animaciones).
- **PostgreSQL** (Railway) con **Prisma** ORM.
- **Auth.js v5** (Credentials) + `@auth/prisma-adapter`, contraseñas con **bcrypt**.
- **Railway Object Storage (S3)** para imágenes (servidas vía proxy propio porque el bucket es privado).
- Validación de entradas con **zod**.

---

## Requisitos

- Node.js 24
- Una base PostgreSQL y un bucket S3 (Railway)

Crear un archivo `.env` en la raíz:

```env
DATABASE_URL=
AUTH_SECRET=
S3_ENDPOINT=
S3_REGION=auto
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
# opcional para el seeder
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

---

## Puesta en marcha

```bash
npm install
npx prisma migrate dev      # crea las tablas
npm run seed                # categorías base + admin + datos demo
npm run dev                 # http://localhost:3000
```

> **Nota:** dev y build usan `--turbopack` a propósito. El webpack de Next 15 crashea (`WasmHash`) bajo Node 24; Turbopack no.

---

## Comandos

```bash
npm run dev      # desarrollo (Turbopack)
npm run build    # build de producción
npm run lint     # ESLint
npm run seed     # poblar la base (idempotente)

npx prisma migrate dev --name <x>          # nueva migración
npx prisma studio                          # explorar la base
npx tsx --env-file=.env prisma/clean.ts    # vaciar publicaciones
```

---

## Estructura

```
/app           rutas (App Router): home, (auth), admin, api, catalogo, publicar, perfil…
/actions       Server Actions (auth, posts, claims, categories, profile)
/components     UI reutilizable (NavBar, catálogo, formularios, ui.tsx)
/lib           db (Prisma), s3, session, posts, categories, format, validations
/prisma         schema, migraciones, seed.ts, clean.ts
/types          tipos compartidos (augment de Auth.js)
auth.ts         Auth.js v5 (Node)
auth.config.ts  Auth.js v5 (edge-safe) — la usa el middleware
```

---

## Rutas

| Ruta | Acceso |
|------|--------|
| `/`, `/catalogo`, `/publicacion/[id]` | público |
| `/login`, `/register` | solo no autenticados |
| `/publicar`, `/mis-publicaciones`, `/perfil` | estudiante |
| `/admin` | administrador |

`/perdidos` y `/encontrados` redirigen al catálogo unificado con el filtro aplicado.

---

## Seguridad

- Contraseñas siempre hasheadas (bcrypt), nunca en texto plano.
- Autorización **en el servidor** dentro de cada Server Action (no se confía en ocultar botones).
- Email institucional único por cuenta.
- El contacto del dueño no se revela hasta aceptar un reclamo.
- Imágenes validadas (formato y tamaño ≤ 5 MB) y servidas con credenciales propias.
