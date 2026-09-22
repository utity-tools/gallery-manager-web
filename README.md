# Gallery Manager

Frontend for Gallery Manager — a web app for art galleries to manage their
collection and publish a public gallery page.

## Stack

- [Next.js 15](https://nextjs.org/docs) (App Router)
- TypeScript
- Tailwind CSS v4
- [SWR](https://swr.vercel.app/) for client-side data fetching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms and validation
- [Axios](https://axios-http.com/) as the HTTP client
- [NextAuth.js](https://next-auth.js.org/) for authentication

## Getting started

Install dependencies:

```bash
npm install
```

Copy the example environment file and fill in real values:

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  (auth)/              Route group for login/signup, no shared layout segment
    login/
    signup/
  dashboard/            Authenticated area
    gallery/
      settings/         Gallery profile settings
      artworks/
        new/             Create artwork
        [id]/edit/        Edit artwork
  gallery/[slug]/        Public gallery page
  layout.tsx             Root layout (Header/Footer)
  page.tsx                Landing page

components/
  auth/                  LoginForm, SignupForm
  gallery/               GalleryGrid, ArtworkCard
  ui/                    Header, Navigation, Footer

lib/
  api.ts                 Axios instance with auth header injection
  auth.ts                 NextAuth configuration
  validation.ts           Zod schemas shared by forms

types/
  index.ts                Domain types (User, Gallery, Artwork, ...)
```

## Environment variables

See [.env.example](./.env.example) for the full list. At minimum you need:

- `API_URL` — backend API base URL, used server-side
- `NEXT_PUBLIC_API_URL` — backend API base URL, used in the browser
- `NEXTAUTH_SECRET` — random secret used to sign session tokens
- `NEXTAUTH_URL` — the canonical URL of this app

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
