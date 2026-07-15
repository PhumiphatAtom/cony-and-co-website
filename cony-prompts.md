# Cony & Co. — Implementation Prompt Sequence (สำหรับ Claude Code / Cursor)

อ้างอิงจาก `requirement.md` v1.0 — ใช้ prompt เหล่านี้เรียงลำดับทีละตัว แต่ละ prompt ควรทำให้เสร็จ + ทดสอบก่อนไปตัวถัดไป อย่ารวมหลาย prompt พร้อมกันในครั้งเดียว เพราะจะควบคุมคุณภาพยากและ debug ลำบากเมื่อ error

**วิธีใช้**: copy เนื้อหาในแต่ละ prompt (ไม่รวมหัวข้อ "Acceptance Criteria") ไปวางใน Claude Code/Cursor ทีละตัว ตรวจสอบผลลัพธ์ตาม Acceptance Criteria ก่อนไป prompt ถัดไป

---

## Prompt 1: Monorepo & Project Setup

```
สร้าง pnpm monorepo สำหรับโปรเจกต์ "Cony & Co." ประกอบด้วย:
- apps/web: Next.js 14+ (App Router) + TypeScript
- apps/api: Hono (TypeScript) บน Node.js
- packages/db: Drizzle ORM schema + migration (PostgreSQL) แชร์ระหว่าง apps/api
- packages/shared: TypeScript types/schemas (Zod) ที่ใช้ร่วมกันระหว่าง web และ api (เช่น validation schema)

ตั้งค่า:
- pnpm-workspace.yaml
- TypeScript config แบบ strict mode ทุก package
- ESLint + Prettier ที่ root level ใช้ร่วมกันทุก package
- .env.example ที่ root และแต่ละ app ระบุ env variable ที่ต้องใช้ (DATABASE_URL, JWT_SECRET, GOOGLE_SERVICE_ACCOUNT_KEY, FRONTEND_URL ฯลฯ)
- .gitignore ที่ครอบคลุม node_modules, .env, dist, .next

ตั้งค่า Git Hooks และ Auto-format ตาม requirement.md หัวข้อ 4.1:
- ติดตั้ง Husky ที่ root ของ monorepo, ตั้ง pre-commit hook ให้รัน lint-staged
- ติดตั้ง lint-staged: ไฟล์ .ts/.tsx รัน ESLint --fix แล้วตามด้วย Prettier --write, ไฟล์ .json/.md/.css รัน Prettier --write เท่านั้น
- เพิ่ม pre-push hook รัน `tsc --noEmit` ทุก package เพื่อดัก type error ก่อน push
- สร้าง .vscode/settings.json ตั้งค่า editor.formatOnSave = true, defaultFormatter เป็น Prettier, และ codeActionsOnSave รัน eslint fix อัตโนมัติ (ให้ทุกคนที่ clone repo แล้วเปิดด้วย VS Code ได้ auto-format ทันทีโดยไม่ต้อง config เอง)
- สร้าง .vscode/extensions.json แนะนำ extension Prettier + ESLint ให้ VS Code เสนอติดตั้งอัตโนมัติเมื่อเปิด repo ครั้งแรก

ห้าม commit .env จริงหรือ secret ใดๆ
```

**Acceptance Criteria**: `pnpm install` รันผ่านทั้ง monorepo, `pnpm --filter web dev` และ `pnpm --filter api dev` รันแยกกันได้โดยไม่ error, ลองแก้ไฟล์ให้ format ผิด (เช่น indent เพี้ยน) แล้ว `git commit` ต้องถูก Husky บล็อกจนกว่าจะ format ถูก, เปิดไฟล์ .ts ใดๆ ใน VS Code แล้วกด save ต้อง auto-format ทันทีโดยไม่ต้องตั้งค่าอะไรเพิ่ม

---

## Prompt 2: Design System & Tailwind Config

```
ตั้งค่า Tailwind CSS ใน apps/web ตาม design token จาก requirement.md หัวข้อ 5:

Colors:
- background: #B5C7D9
- brand.DEFAULT: #402D1F (primary/heading/button)
- brand.muted: #635B56 (secondary heading)
- brand.accent: #B77749 (rust/terracotta accent)
- surface: #FFFDF7 (card background)
- badge: #9EA8B4 (pill/tag background)

Fonts (ใช้ next/font/google):
- EN: Fredoka (weight 400,500,600,700) — CSS variable --font-en
- TH: Prompt (weight 300,400,500,600,700, subset thai+latin) — CSS variable --font-th
- map เข้า Tailwind fontFamily.heading (Fredoka + Prompt fallback) และ fontFamily.body (Prompt)

สร้าง base UI components ใน apps/web/components/ui/ ด้วยสไตล์ pill-shaped ตามภาพตัวอย่าง:
- Button (variant: primary ใช้ brand.DEFAULT, secondary, outline) ทรง fully-rounded (pill)
- Badge/Tag (pill shape เล็ก พื้นหลัง badge color)
- Card (rounded-2xl หรือมากกว่า, ใช้ surface color, มี shadow เบาๆ)

ทุก component ต้อง responsive ตาม breakpoint mobile (<768px) / tablet (768-1023px, md:) / desktop (≥1024px, lg:) ตาม requirement.md หัวข้อ 7.4

สร้างหน้า /style-guide แสดงตัวอย่าง component ทั้งหมดเพื่อ QA ด้วยตา
```

**Acceptance Criteria**: เข้า `/style-guide` แล้วเห็นสี/ฟอนต์/ปุ่มตรงตาม design token, resize browser แล้ว component ปรับตาม breakpoint ถูกต้อง

---

## Prompt 3: Database Schema (Drizzle ORM)

```
ใน packages/db เขียน Drizzle schema (PostgreSQL) ตาม data model ใน requirement.md หัวข้อ 9:

- products: id, name, description, price, stock, images (jsonb array), character_tag, status (enum: active/inactive), created_at, updated_at
- quiz_questions: id, question_text, display_order, created_at
- quiz_options: id, question_id (FK), option_text, result_weight (jsonb — mapping ไปยัง product/character)
- quiz_results: id, session_id, matched_product_id (FK), submitted_at
- contact_messages: id, name, email, phone, subject, message, status (enum: new/in_progress/replied), created_at
- orders: id, order_token (uuid, unique, public), source_order_number (int, unique, internal only), account_name, recipient_name, address (text, จะ encrypt ที่ application layer), phone (text, nullable, จะ encrypt), product_name, size, quantity, gift_wrap (boolean), note (text, internal only), status, lot, tracking_number_raw, tracking_number_normalized (nullable), synced_at, created_at, updated_at
- order_lookup_logs: id, order_id (FK nullable), ip_address, success (boolean), attempted_at
- admin_users: id, username (unique), password_hash, role (enum: super_admin/staff), created_at

ใช้ UUID เป็น primary key ทุกตาราง ยกเว้นที่ระบุเป็น int
เพิ่ม index ที่จำเป็น: orders.order_token, orders.source_order_number, order_lookup_logs.ip_address + attempted_at (สำหรับ rate limit query เร็ว)

เขียน migration script และ Drizzle config พร้อมใช้ `drizzle-kit push` หรือ `drizzle-kit generate` ได้
```

**Acceptance Criteria**: รัน migration เข้า local PostgreSQL (ผ่าน Docker) สำเร็จ, ตรวจสอบด้วย `drizzle-kit studio` เห็นทุกตารางตาม schema

---

## Prompt 4: Hono Middleware Stack + Admin Authentication

```
ใน apps/api ตั้งค่า Hono middleware chain ตามลำดับที่ระบุใน requirement.md หัวข้อ 6.2.4:

1. Security headers (hono/secure-headers)
2. CORS (จำกัด origin = FRONTEND_URL จาก env)
3. Request logging middleware (custom — log method, path, ip, timestamp, response time)
4. Rate limiting middleware (custom, ใช้ in-memory store หรือ Redis — เขียนแบบยืดหยุ่นให้กำหนด window/max ต่อ route ได้)
5. Body validation middleware (Zod, ต่อกับ packages/shared schemas)
6. JWT auth middleware (hono/jwt) — เฉพาะ route ใต้ /admin/*
7. RBAC guard middleware (custom) — เช็ค role จาก JWT payload
8. CSRF protection middleware (custom) — สำหรับ route ที่ mutate ข้อมูล
9. Centralized error handler (app.onError) — ไม่ leak stack trace ใน production

จัดโครงสร้าง route เป็น 2 กลุ่มชัดเจน:
- Public routes: ไม่ผ่าน JWT/RBAC/CSRF (แต่ผ่าน 1-5, 9)
- Admin routes (ขึ้นต้นด้วย /admin): ผ่านครบทุกตัว

Implement authentication endpoints:
- POST /admin/auth/login — รับ username/password, verify กับ bcrypt hash, ออก JWT access token (อายุสั้น เช่น 15 นาที) + refresh token (อายุยาวกว่า เช่น 7 วัน, เก็บใน HttpOnly cookie)
- POST /admin/auth/refresh — ใช้ refresh token ขอ access token ใหม่
- POST /admin/auth/logout — เคลียร์ refresh token cookie

เขียน seed script สร้าง admin user ตัวอย่าง 1 คนสำหรับทดสอบ (password ต้อง hash ด้วย bcrypt ไม่เก็บ plain text)
```

**Acceptance Criteria**: เรียก POST /admin/auth/login ด้วย credential ที่ถูกต้องได้ JWT กลับมา, เรียก route ภายใต้ /admin/* โดยไม่มี JWT ได้ 401, ทดสอบ rate limit โดยยิง request เกิน limit แล้วได้ 429

---

## Prompt 5: Product Listing & Detail (Frontend + Public API)

```
Implement ฟีเจอร์แสดงรายการสินค้าตาม requirement.md หัวข้อ 6.1.1:

Backend (apps/api):
- GET /products — คืนรายการสินค้าที่ status=active ทั้งหมด รองรับ query param สำหรับ filter (character_tag) และ sort (price, created_at)
- GET /products/:id — คืนรายละเอียดสินค้า 1 ชิ้น

Frontend (apps/web):
- หน้า /products — แสดง grid สินค้าทั้งหมด (เริ่มต้น 12 ชิ้น ไม่ต้อง pagination ตอนนี้ แต่เขียน component ให้รองรับ pagination ในอนาคตได้ง่าย — ใช้ TanStack Query สำหรับดึงข้อมูล)
- Filter UI ตาม character_tag, sort dropdown (ราคา/ความนิยม/ใหม่)
- หน้า /products/[id] — แสดงรายละเอียดสินค้า, รูปหลายมุม (image gallery), เรื่องราว/บุคลิกตุ๊กตา, ราคา, สต็อกคงเหลือ
- ใช้ Next.js Image component สำหรับ optimize รูปภาพทั้งหมด
- Responsive ตาม breakpoint ที่กำหนดไว้ (mobile/tablet/desktop)
```

**Acceptance Criteria**: เข้า /products เห็นรายการสินค้า, filter/sort ทำงานถูกต้อง, คลิกเข้า detail page แสดงข้อมูลครบ, ทดสอบบนขนาดจอ mobile/tablet/desktop แล้ว layout ไม่พัง

---

## Prompt 6: Quiz Feature (Frontend + Backend)

```
Implement ฟีเจอร์ Quiz ตาม requirement.md หัวข้อ 6.1.2:

Backend:
- GET /quiz/questions — คืนคำถามทั้งหมดพร้อม options เรียงตาม display_order
- POST /quiz/submit — รับคำตอบทั้งหมด (array ของ question_id + selected_option_id), คำนวณผลลัพธ์จาก result_weight ของแต่ละ option, หา product ที่ match มากที่สุด, บันทึกลง quiz_results, คืน matched_product กลับไป

Frontend:
- หน้า /quiz — แสดงคำถามทีละข้อ (step-by-step UI มี progress bar), เก็บคำตอบใน Zustand store ระหว่างทำ
- หน้า /quiz/result — แสดงผลลัพธ์ตุ๊กตาที่ match, ปุ่มลิงก์ไปหน้า product detail, ปุ่มแชร์ผลลัพธ์ (Web Share API หรือ copy link พร้อม Open Graph meta tag สำหรับตอนแชร์ลงโซเชียล)
- ออกแบบ UI ให้สนุก น่ารัก ตรงกับ theme (ใช้ปุ่ม/การ์ดจาก style guide ที่ทำใน Prompt 2)
```

**Acceptance Criteria**: ทำ quiz ครบทุกข้อแล้วได้ผลลัพธ์ที่สมเหตุสมผล, แชร์ลิงก์ผลลัพธ์แล้ว preview การ์ดบนโซเชียล (Open Graph) แสดงถูกต้อง, ข้อมูลถูกบันทึกใน quiz_results table

---

## Prompt 7: Contact Page

```
Implement หน้า Contact ตาม requirement.md หัวข้อ 6.1.3:

Backend:
- POST /contact — รับ name, email/phone, subject, message, validate ด้วย Zod (server-side), บันทึกลง contact_messages (status=new), ป้องกัน spam ด้วย rate limiting (จำกัดเข้มกว่า route ทั่วไป เช่น 3 ครั้ง/ชั่วโมงต่อ IP)

Frontend:
- หน้า /contact — ฟอร์มติดต่อพร้อม client-side validation (React Hook Form + Zod, schema เดียวกับฝั่ง backend ผ่าน packages/shared)
- แสดง success/error state ที่ชัดเจนหลัง submit
- Responsive ทุกขนาดจอ
```

**Acceptance Criteria**: ส่งฟอร์มด้วยข้อมูลถูกต้องสำเร็จ, ส่งข้อมูลผิด format ถูก validate ทั้ง client และ server, ยิง request เกิน rate limit ได้ error ที่เหมาะสม

---

## Prompt 8: Google Sheets Sync Architecture

```
Implement การ sync ข้อมูลจาก Google Sheet เข้า database ตาม requirement.md หัวข้อ 6.3:

1. ตั้งค่า Google Service Account authentication (อ่าน credential จาก env variable, ห้าม hardcode)
2. เขียน sync function ใน apps/api ที่:
   - อ่านข้อมูลทุกแถวจาก Google Sheet ที่กำหนด (ผ่าน Google Sheets API, read-only scope)
   - Map คอลัมน์ตามตาราง field mapping ในหัวข้อ 6.3.4 (เลขรายการสั่งซื้อ → source_order_number, ชื่อแอคเคาท์ → account_name, ที่อยู่ลูกค้า → address (เข้ารหัสก่อนบันทึก) ฯลฯ)
   - Normalize เลขพัสดุ: parse tracking_number_raw ว่าเป็นเลข tracking จริงหรือข้อความสถานะ (เช่น "จัดส่งแล้ว") — ถ้า parse ไม่ได้ให้เก็บ tracking_number_normalized เป็น null และเก็บค่าดิบไว้ใน tracking_number_raw เสมอ
   - Upsert เข้าตาราง orders โดยใช้ source_order_number เป็น unique key (ถ้ามีอยู่แล้วให้ update, ถ้าไม่มีให้สร้างใหม่พร้อม generate order_token เป็น UUID ใหม่)
   - อัปเดต synced_at ทุกครั้งที่ sync สำเร็จ
3. Endpoint สำหรับ trigger sync:
   - POST /admin/orders/sync — ให้แอดมิน manual trigger ได้ (ต้อง rate limit เพื่อไม่ให้เรียก Google Sheets API ถี่เกินไป เช่น จำกัด 1 ครั้ง/5 นาที)
4. เขียน cron job แยกต่างหาก (standalone script ที่เรียกใช้ sync function เดียวกัน) สำหรับตั้งเป็น scheduled task รายสัปดาห์ผ่าน external cron (Railway Cron/Vercel Cron) — ไม่ผูกกับ Hono request cycle

เขียน error handling ที่ดี: ถ้า sync fail กลางทาง (เช่น Google API rate limit) ต้อง log error ชัดเจนและไม่ทำให้ data เดิมเสียหาย (ใช้ database transaction)
```

**Acceptance Criteria**: รัน sync function แล้วข้อมูลจาก Google Sheet ตัวอย่างเข้า orders table ถูกต้องครบทุกแถว, ทดสอบ manual trigger endpoint สำเร็จ, ทดสอบกรณี tracking number เป็นข้อความ (ไม่ใช่ตัวเลข) ว่า normalize ถูกต้อง

---

## Prompt 9: Order Tracking Page (2-Factor Lookup)

```
Implement หน้าตรวจสอบสถานะพัสดุตาม requirement.md หัวข้อ 6.1.4 และ 6.3.3 (สำคัญมาก — อ่านทั้ง 2 หัวข้อให้ครบก่อนเริ่ม):

Backend:
- POST /order-tracking/lookup — รับ order_number_or_tracking + verification_factor (account_name ตาม MVP ที่เลือกใช้)
  - ต้อง exact match เท่านั้น ห้าม partial/wildcard search
  - ถ้าไม่พบ หรือปัจจัยที่ 2 ไม่ตรง ต้องคืน error response เดียวกันเป๊ะๆ ทั้ง message และ HTTP status (ใช้ 200 พร้อม { found: false } เสมอ ไม่ใช่ 404/401/403)
  - เพิ่ม artificial delay 1-2 วินาทีทุก request (เจอหรือไม่เจอก็ตาม)
  - บันทึก log ทุกครั้งลง order_lookup_logs (ip_address, success, order_id ถ้าเจอ, attempted_at) — ห้าม log ปัจจัยยืนยันตัวตนแบบ plain text
  - Rate limit เข้ม: 5 ครั้ง/10 นาทีต่อ IP, เกินแล้วต้องผ่าน CAPTCHA ก่อน (เตรียม hook ไว้สำหรับต่อ Cloudflare Turnstile ทีหลังได้)
  - ถ้าเจอ: mask ข้อมูลตามตาราง data minimization หัวข้อ 6.3.4 (ไม่คืนที่อยู่เต็ม/ชื่อเต็ม/หมายเหตุ/ล็อต/เลขออเดอร์จริง — ใช้ order_token แทน) พร้อมคืน synced_at เพื่อแสดงเวลาอัปเดตล่าสุด

Frontend:
- หน้า /order-tracking — ฟอร์มกรอกเลขคำสั่งซื้อ/เลขพัสดุ + ชื่อแอคเคาท์
- แสดงผลลัพธ์เป็น timeline สถานะที่เข้าใจง่าย (รับออเดอร์แล้ว → เตรียมจัดส่ง → จัดส่งแล้ว → ถึงปลายทาง)
- แสดงข้อความ "อัปเดตข้อมูลล่าสุดเมื่อ [วันที่/เวลา]" จาก synced_at เสมอ
- แสดง error message เดียวกันทุกกรณีที่ค้นหาไม่พบ
- Responsive ทุกขนาดจอ
```

**Acceptance Criteria**: ค้นหาด้วยข้อมูลถูกต้องเจอผลลัพธ์ที่ mask ข้อมูลตามสเปก, ค้นหาผิดทั้ง 2 กรณี (เลขผิด/ชื่อผิด) ได้ error message เดียวกันเป๊ะ, ยิง request เกิน rate limit ได้ block ที่เหมาะสม, ตรวจสอบว่าไม่มีข้อมูล address/note/เลขออเดอร์จริงหลุดออกมาใน response

---

## Prompt 10: Admin Back Office (CRUD ทั้งหมด + TanStack Table)

```
Implement ระบบ back office ตาม requirement.md หัวข้อ 6.2 ทั้งหมด ทุก endpoint ต้องอยู่ใต้ /admin/* และผ่าน middleware stack ที่ทำใน Prompt 4 ครบ:

Backend:
- Product: GET/POST/PUT/DELETE /admin/products
- Quiz: GET/POST/PUT/DELETE /admin/quiz/questions, /admin/quiz/options, GET /admin/quiz/results (สถิติ)
- Contact: GET /admin/contact, PUT /admin/contact/:id (เปลี่ยนสถานะ), DELETE /admin/contact/:id
- Order lookup log: GET /admin/orders/logs (สำหรับดู audit trail)

ทุก list endpoint ต้องรองรับ server-side pagination, sorting, filtering (query params) เพื่อให้ต่อกับ TanStack Table แบบ server-side ได้

Frontend (apps/web/admin หรือ route group (admin)):
- หน้า login สำหรับแอดมิน
- Layout back office แยกจากฝั่ง user (sidebar navigation)
- หน้า /admin/products — TanStack Table แสดงรายการสินค้า พร้อม sort/filter/pagination, ปุ่ม create/edit/delete เปิด modal หรือหน้าแยก
- หน้า /admin/quiz — TanStack Table สำหรับคำถามและสถิติผลลัพธ์
- หน้า /admin/contact — TanStack Table พร้อม filter ตามสถานะ
- หน้า /admin/orders — ปุ่ม "Sync ข้อมูลล่าสุด" (เรียก endpoint จาก Prompt 8) + TanStack Table แสดง order lookup log
- ทุกตารางต้อง responsive ตาม requirement.md หัวข้อ 7.4 (ปรับเป็น card view บนมือถือถ้าจำเป็น ไม่ overflow แนวนอนแบบไม่มี indicator)
- ใช้ TanStack Query คู่กับ TanStack Table สำหรับดึงข้อมูลและ cache
```

**Acceptance Criteria**: Login เข้า back office ได้, CRUD ทุกโมดูลทำงานถูกต้อง, ตารางมี sort/filter/pagination ทำงานจริง (ไม่ใช่แค่ UI), ทดสอบ responsive บนมือถือ/แท็บเล็ต/desktop, พยายามเข้า /admin/* โดยไม่ login ต้อง redirect ไปหน้า login

---

## Prompt 11: Responsive & Accessibility Polish

```
ตรวจสอบและแก้ไขทุกหน้าที่ implement มาแล้ว (products, product detail, quiz, contact, order-tracking, admin back office ทั้งหมด) ให้ตรงตาม requirement.md หัวข้อ 7.4:

1. ทดสอบทุกหน้าที่ breakpoint mobile (<768px), tablet (768-1023px), desktop (≥1024px) — แก้ layout ที่พังหรือ overflow
2. ตรวจสอบ WCAG เบื้องต้น: contrast ratio ของสีที่ใช้ (โดยเฉพาะ text บน background สี #B5C7D9 และปุ่มสี #402D1F), alt text ทุกรูปภาพ, keyboard navigation ทำงานได้ทุกฟอร์ม/ปุ่ม/modal
3. ตรวจสอบ TanStack Table ในฝั่ง admin ว่าบนมือถือไม่ overflow แนวนอนโดยไม่มี indicator ที่ชัดเจน
4. รัน Lighthouse audit ทุกหน้าหลัก เป้าหมาย ≥90 สำหรับ Performance/Accessibility/SEO ตามหัวข้อ 7.2 — แก้ไขจุดที่คะแนนต่ำ
```

**Acceptance Criteria**: ทุกหน้าใช้งานได้ปกติทั้ง 3 breakpoint, Lighthouse score ผ่านเกณฑ์ที่กำหนด, keyboard-only navigation ใช้งานได้ครบทุก flow หลัก

---

## Prompt 12: Deployment Setup

```
เตรียม deployment ตาม requirement.md หัวข้อ 8 ทั้งหมด:

1. เขียน Dockerfile แยกสำหรับ apps/web และ apps/api (multi-stage build, production-optimized, ไม่ build บน production server)
2. เขียน docker-compose.yml สำหรับ local development ประกอบด้วย web, api, postgres พร้อม memory limit ต่อ container ตามที่ระบุในหัวข้อ 8.4 (Next.js ~500MB, Hono ~150MB, PostgreSQL ~300MB)
3. เขียน GitHub Actions workflow (.github/workflows/deploy.yml):
   - Build Docker image ทั้ง web และ api เมื่อ push เข้า main branch
   - Push image เข้า GitHub Container Registry
   - (ทางเลือก) SSH เข้า VPS แล้ว docker pull + restart container อัตโนมัติ
4. เขียน setup script สำหรับ VPS (Ubuntu 24) ครอบคลุม:
   - สร้าง swap file 2-4GB
   - ตั้งค่า ufw firewall (เปิดเฉพาะ 22, 80, 443)
   - ติดตั้ง Docker + Docker Compose
   - ตั้งค่า Caddy เป็น reverse proxy พร้อม auto HTTPS
   - เปิด unattended-upgrades
5. เขียน backup script (cron) สำหรับ pg_dump รายวัน อัปโหลดไปยัง object storage ที่กำหนด
6. เขียนไฟล์ .env.production.example ระบุ environment variable ทั้งหมดที่ต้องตั้งค่าจริงบน VPS (ไม่ใส่ค่าจริง)
```

**Acceptance Criteria**: `docker-compose up` รันได้ทั้ง stack ใน local, GitHub Actions build image สำเร็จ, VPS setup script รันบน Ubuntu 24 สด (fresh instance) แล้วพร้อม deploy ได้จริง

---

## หมายเหตุสำหรับทุก Prompt

- ทุกครั้งที่ implement ฟีเจอร์ที่แตะข้อมูลลูกค้า (orders, contact) ให้ทวนกับหัวข้อ 7.1 (Security) และ PDPA compliance อีกครั้งก่อนถือว่าเสร็จ
- ถ้า Claude Code/Cursor เสนอ shortcut ที่ขัดกับ requirement (เช่น ข้าม rate limiting เพื่อความเร็ว) ให้ปฏิเสธและอ้างอิงกลับไปที่หัวข้อที่เกี่ยวข้องใน requirement.md เสมอ
- Open Questions ที่ยังไม่ resolve (หัวข้อ 3 และ 11 ของ requirement.md) ควรตัดสินใจก่อนเริ่ม Prompt 8-9 เพราะมีผลโดยตรงต่อ schema และ lookup logic
