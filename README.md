# cony-and-co-website

เว็บไซต์แบรนด์ **Cony & Co.** — ตุ๊กตากระต่ายสุดน่ารัก แต่ละตัวมีคาแรกเตอร์เป็นของตัวเอง

## Project Structure

```
cony-and-co-website/
├── apps/
│   ├── web/        # Next.js 15 (App Router) + TypeScript
│   └── api/        # Hono 4 (TypeScript) บน Node.js
├── packages/
│   ├── db/         # Drizzle ORM + PostgreSQL schema
│   └── shared/     # Shared TypeScript types + Zod schemas
```

## Getting Started

```bash
# ติดตั้ง dependencies
pnpm install

# รัน dev servers ทั้งสอง (web :3000, api :3001)
pnpm dev

# รัน แยก
pnpm --filter web dev
pnpm --filter api dev
```

## Tech Stack

| ส่วน         | เทคโนโลยี                               |
| ------------ | --------------------------------------- |
| Frontend     | Next.js 15 + TypeScript + Tailwind CSS  |
| Backend      | Hono 4 + TypeScript                     |
| Database     | PostgreSQL + Drizzle ORM                |
| Monorepo     | pnpm workspaces                         |
| Code Quality | ESLint + Prettier + Husky + lint-staged |
