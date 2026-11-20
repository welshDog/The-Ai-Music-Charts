# The AI Music Charts

A community discovery platform for AI-generated music. Tracks are indexed by metadata and link outward to their original hosting platform.

## Stack

- Next.js App Router
- PocketBase
- TypeScript
- Tailwind CSS

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_POCKETBASE_URL` to the PocketBase server URL.

## PocketBase collections

See `pocketbase/README.md` for collection schemas and server hooks.
