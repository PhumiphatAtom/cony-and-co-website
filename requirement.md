# Requirement Document: Cony & Co. Website (New Version)

**Project Owner:** Atom
**Role:** Tech Lead / Full-stack Developer
**Version:** 1.0
**สถานะ:** Draft สำหรับพิจารณา

---

## 1. ภาพรวมโปรเจกต์ (Overview)

Cony & Co. เป็นเว็บไซต์แบรนด์ขายตุ๊กตากระต่าย โดยตุ๊กตาแต่ละตัวมีคาแรกเตอร์และเอกลักษณ์เฉพาะตัว (mascot-driven brand) โปรเจกต์นี้คือการรีดีไซน์และพัฒนาเว็บไซต์ใหม่ทั้งหมด โดยอ้างอิงธีมและโทนจากเว็บเดิม (conyandco.website) แต่ยกระดับในด้าน:

- ความสวยงามและความน่ารักของ UI ให้สอดคล้องกับคาแรกเตอร์ตุ๊กตาแต่ละตัว
- ประสบการณ์ผู้ใช้ (UX) ที่ลื่นไหล ใช้งานง่าย ตามหลัก UX/UI Design
- ระบบหลังบ้าน (Back office) ที่ช่วยให้แอดมินจัดการข้อมูลได้เอง โดยไม่ต้องพึ่งนักพัฒนา
- ความปลอดภัยของระบบในระดับที่เหมาะสมกับเว็บอีคอมเมิร์ซ (มีข้อมูลลูกค้า / ที่อยู่จัดส่ง)

> หมายเหตุ: เว็บ conyandco.website เป็น JS-rendered site ที่ไม่สามารถดึงเนื้อหาแบบ static ได้ครบถ้วนผ่านการ fetch อัตโนมัติ แนะนำให้แนบภาพหน้าจอ (screenshot) หรือไฟล์ตัวอย่างธีม/สี/ฟอนต์จากเว็บเดิมเพิ่มเติม เพื่อให้ทีมออกแบบอ้างอิงได้แม่นยำขึ้น

---

## 2. เป้าหมายของโปรเจกต์ (Goals)

1. ผู้ใช้สามารถเลือกซื้อตุ๊กตาได้ง่าย เข้าใจคาแรกเตอร์ของแต่ละตัวผ่านหน้ารายการสินค้า
2. สร้าง engagement ผ่านหน้า Quiz ที่ช่วยแนะนำว่าผู้ใช้เหมาะกับตุ๊กตาตัวไหน (เพิ่มโอกาสปิดการขาย)
3. ผู้ใช้ตรวจสอบสถานะพัสดุได้เองโดยไม่ต้องทักแชทสอบถาม
4. แอดมินจัดการสินค้า/Quiz/ข้อความติดต่อได้ครบวงจรผ่าน back office
5. ระบบมีความปลอดภัยเพียงพอสำหรับการเก็บข้อมูลลูกค้าและธุรกรรม

---

## 3. Scope (ขอบเขตของเวอร์ชันนี้)

**อยู่ใน scope:**

- หน้าเว็บฝั่ง user 4 หน้าหลักตามที่ระบุ
- Back office สำหรับ 3 โมดูล (สินค้า, quiz, contact)
- ระบบ authentication สำหรับ admin
- ระบบตรวจสอบสถานะพัสดุ โดยดึงข้อมูลจาก Google Sheet มา sync (**ยืนยันแล้ว**: ไม่มีระบบสั่งซื้อ/ชำระเงินผ่านเว็บไซต์ — ดูรายละเอียดด้านล่าง)

**ยืนยันแล้ว (Resolved):**

- ✅ **ไม่มีระบบตะกร้าสินค้า/ชำระเงินบนเว็บไซต์** เว็บนี้ทำหน้าที่เป็น catalog/แบรนด์เพจ + quiz + tracking เท่านั้น การสั่งซื้อจริงยังเกิดผ่านช่องทางอื่น (แชท/โซเชียล) แล้วแอดมินกรอกลง Google Sheet เอง — ตัดขอบเขตเรื่อง payment gateway/cart ออกจากโปรเจกต์นี้ทั้งหมด
- ✅ **การตรวจสอบสถานะพัสดุดึงข้อมูลผ่าน Google Sheet** ยืนยันสถาปัตยกรรมตามหัวข้อ 6.3 (ไม่เชื่อม courier API โดยตรง)
- ✅ **ความถี่การ sync Google Sheet: ทุกสัปดาห์** (ปรับจากที่เคยเสนอไว้ 5-15 นาที) — รายละเอียดผลกระทบต่อ UX ดูหัวข้อ 6.1.4 และ 6.3.1
- ✅ **จำนวนสินค้าเริ่มต้น 12 แบบ** (ตุ๊กตา 12 คาแรกเตอร์) โดยมีแผนเพิ่มในอนาคต — ออกแบบหน้ารายการสินค้าให้รองรับการขยายได้ ไม่ต้อง hard-code จำนวน

**ยังไม่ชัดเจน / ต้องตัดสินใจเพิ่มเติม (Open Questions):**

- ต้องมีระบบสมาชิก/login สำหรับ user ทั่วไปหรือไม่ (เพื่อดูประวัติคำสั่งซื้อ/ติดตามพัสดุแบบผูกบัญชี) — เบื้องต้นออกแบบเป็น guest lookup ไม่บังคับ login ก่อน (ดูหัวข้อ 6.3.2) แต่เปิดไว้เป็นตัวเลือกอนาคต
- จำนวน admin roles มีกี่ระดับ (เช่น super admin / staff)
- **ใหม่**: ต้องตัดสินใจว่าจะยังใช้ Google Sheet เป็นที่กรอกข้อมูลหลักของแอดมินต่อไป (แล้ว sync เข้าเว็บ) หรือย้ายมากรอกผ่าน back office ของเว็บใหม่ทั้งหมดแล้วเลิกใช้ Sheet — มีผลต่อสถาปัตยกรรมอย่างมาก (ดูหัวข้อ 6.3.1)
- **ใหม่**: คอลัมน์ "ชื่อแอคเคาท์" (เช่น ยูสเซอร์เนม Shopee/IG) จะใช้เป็นปัจจัยยืนยันตัวตนของ user ตอนตรวจสอบพัสดุได้หรือไม่ หรือควรใช้เบอร์โทร/อีเมลแทน (ปัจจุบันไฟล์ตัวอย่างไม่มีคอลัมน์เบอร์โทร/อีเมลเลย — ต้องเพิ่มคอลัมน์นี้ใน Sheet ถ้าจะใช้เป็นตัวยืนยันตัวตน)

---

## 4. Tech Stack ที่แนะนำ

อ้างอิงจาก stack ที่ถนัดอยู่แล้ว เพื่อความเร็วในการพัฒนาและดูแลรักษาต่อเนื่อง:

| ส่วน                     | เทคโนโลยี                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Frontend Framework       | Next.js (App Router) + TypeScript                                                                      |
| Styling                  | Tailwind CSS                                                                                           |
| State Management         | Zustand                                                                                                |
| Data Fetching / Cache    | TanStack Query                                                                                         |
| Table/Data Grid          | **TanStack Table** (สำหรับทุกตารางในระบบ ทั้งฝั่ง admin back office และฝั่ง user ถ้ามี)                |
| Form & Validation        | React Hook Form + Zod                                                                                  |
| Backend                  | Hono (TypeScript, บน Node.js หรือ Bun)                                                                 |
| ORM                      | Drizzle ORM                                                                                            |
| Database                 | PostgreSQL                                                                                             |
| Authentication (Admin)   | JWT (access + refresh token) หรือ session-based ผ่าน HttpOnly cookie                                   |
| File/Image Storage       | Object storage เช่น Cloudflare R2 / AWS S3 (สำหรับรูปสินค้า)                                           |
| Image Optimization       | Next.js Image component + CDN                                                                          |
| Deployment               | Docker + Docker Compose (dev) / แนะนำ Railway หรือ VPS + Nginx (prod)                                  |
| Monitoring/Logging       | Sentry (error tracking)                                                                                |
| Git Hooks / Code Quality | **Husky** + **lint-staged** (ตรวจสอบ lint/format อัตโนมัติก่อน commit)                                 |
| Editor Formatting        | Prettier ตั้งค่า Format on Save (VS Code `.vscode/settings.json`) ให้ auto-format อัตโนมัติเวลากด save |

> หมายเหตุ: ใช้ Hono เพื่อให้ stack เดียวกับโปรเจกต์ Macha (Next.js + Hono v4 + Drizzle ORM ใน pnpm monorepo) ช่วยลด context switching และ maintain code ง่ายขึ้น หากต้องการฝึกฝน Java Spring Boot เพิ่มเติมสำหรับสาย backend ก็ยังสลับใช้แทนได้ในภายหลัง — แจ้งได้ถ้าต้องการปรับ

### 4.1 Code Quality & Git Hooks

- **Husky**: ติดตั้งที่ root ของ monorepo ตั้ง pre-commit hook ให้รัน `lint-staged` ทุกครั้งก่อน commit สำเร็จ ถ้า lint/format ไม่ผ่าน ต้อง block การ commit ทันที (ป้องกันโค้ดที่ผิด convention หลุดเข้า repo)
- **lint-staged**: รันเฉพาะไฟล์ที่ staged (ไม่ใช่ทั้ง repo เพื่อความเร็ว) โดย:
  - ไฟล์ `.ts`/`.tsx` → รัน ESLint --fix แล้วตามด้วย Prettier --write
  - ไฟล์ `.json`/`.md`/`.css` → รัน Prettier --write
- พิจารณาเพิ่ม pre-push hook รัน type-check (`tsc --noEmit`) ก่อน push ขึ้น remote เพื่อดัก type error ก่อนเข้า CI/CD
- **Format on Save**: ตั้งค่า `.vscode/settings.json` ใน repo ให้ทุกคนที่ clone แล้วเปิดด้วย VS Code ได้ auto-format ทันทีโดยไม่ต้อง config เอง:
  ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
  ```
- แนะนำใส่ `.vscode/extensions.json` แนะนำให้ลง extension Prettier + ESLint อัตโนมัติเมื่อเปิด repo ครั้งแรก

---

## 5. Design Direction

### 5.1 อ้างอิงจากภาพตัวอย่างธีมที่ได้รับ

จากภาพหน้า Quiz ของเว็บเดิมที่แนบมา สรุปทิศทางดีไซน์ที่ต้องคงไว้/พัฒนาต่อดังนี้:

**Color Palette — ยืนยัน HEX code จริงแล้ว (pick จากภาพตัวอย่างล่าสุด):**

| การใช้งาน                                                        | สี                                                | HEX       |
| ---------------------------------------------------------------- | ------------------------------------------------- | --------- |
| พื้นหลังหลัก (hero, section)                                     | ฟ้าอมเทาพาสเทล (dusty blue) โทนนุ่ม สบายตา        | `#B5C7D9` |
| ปุ่ม / heading หลัก (เช่น "CONY & CO.")                          | น้ำตาลเข้ม (dark brown)                           | `#402D1F` |
| Heading รอง (เช่น "PERSONALITY QUIZ")                            | น้ำตาลเทาอมม่วง (muted taupe)                     | `#635B56` |
| การ์ด/พื้นที่แสดงสินค้า                                          | ครีมขาวอมเหลืองนิดๆ (warm off-white) ไม่ใช่ขาวจ๋า | `#FFFDF7` |
| Badge/Tag (เช่น "CONYLAND")                                      | ฟ้าเทาอ่อนกว่าพื้นหลัง                            | `#9EA8B4` |
| Accent/สีเน้นพิเศษ (เช่น ข้อความสไตล์ลายมือ, สีของสินค้าบางชิ้น) | สนิมอิฐ/เทอร์ราคอตต้า (rust/terracotta)           | `#B77749` |

> หมายเหตุ: มีสีชมพูคอรัลเล็กๆ ใช้เป็น micro-accent ในภาพตัวอย่าง (ข้อความ "forever!" ขีดฆ่า) แต่ใช้พื้นที่น้อยมากและไม่ใช่สีหลักของแบรนด์ — แนะนำเพิ่มเป็น optional accent เพิ่มเติมภายหลังถ้าต้องการ ไม่จำเป็นต้องกำหนดเป็น design token หลักตอนนี้

จากพาเลตนี้ ตั้งเป็น Tailwind design token ได้ดังนี้ (ตัวอย่าง):

```js
// tailwind.config.js
colors: {
  background: '#B5C7D9',
  brand: {
    DEFAULT: '#402D1F',   // primary (heading, button)
    muted: '#635B56',     // secondary heading/text
    accent: '#B77749',    // rust/terracotta accent
  },
  surface: '#FFFDF7',     // card background
  badge: '#9EA8B4',       // pill/tag background
}
```

**Typography — ยืนยันฟอนต์ที่ใช้จริงแล้ว:**

| ระดับ          | ฟอนต์                                                  | หมายเหตุการใช้งาน                                                                                                                                                                  |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EN (Latin)** | **Fredoka**                                            | ใช้กับข้อความ/heading ที่เป็นภาษาอังกฤษ เช่น "CONY & CO.", "PERSONALITY QUIZ" — rounded, bold, ปลายมน ตรงกับภาพตัวอย่างธีมเว็บเดิม                                                 |
| **TH (Thai)**  | **[Prompt](https://fonts.google.com/specimen/Prompt)** | ใช้กับข้อความภาษาไทยทั้งหมด รองรับ weight ตั้งแต่ 100-900 จึงใช้ได้ทั้ง heading (Bold/SemiBold) และ body text (Regular/Medium) ในฟอนต์ตระกูลเดียว ลดความซับซ้อนเรื่อง font pairing |

**แนวทางการใช้งานจริงในเว็บ (เนื้อหาเป็น mixed Thai/English):**

- **Heading**: Fredoka (Bold/SemiBold) สำหรับคำ/วลีภาษาอังกฤษ, Prompt (Bold/SemiBold) สำหรับภาษาไทย — ใช้ font-family แบบ fallback stack เพื่อให้ browser เลือกฟอนต์ตาม character set อัตโนมัติในประโยคที่มีทั้งไทย-อังกฤษปนกัน
- **Body text**: ใช้ **Prompt (Regular/Medium)** เป็นหลักทั้งเว็บ เนื่องจากเนื้อหาส่วนใหญ่เป็นภาษาไทย และ Prompt อ่านง่ายสบายตาในระดับ body text ด้วย ไม่จำเป็นต้องหาฟอนต์ไทยแยกต่างหากสำหรับ body
- **Accent/script font**: ยังคงพิจารณาฟอนต์ cursive/script (เช่น Charmonman คู่กับ Playfair Display Italic) ใช้เฉพาะจุดตกแต่งเล็กๆ ที่ต้องการความรู้สึกพรีเมียม (ดูหัวข้อก่อนหน้า) — แยกอิสระจากคู่ Fredoka/Prompt ที่เป็นฟอนต์หลัก
- Logo "Cony & Co." ใช้ **Fredoka (Bold)**

**Implementation**: โหลดทั้งสองฟอนต์ผ่าน `next/font/google` เพื่อ self-host และ optimize อัตโนมัติ ตัวอย่าง:

```ts
import { Fredoka, Prompt } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-en',
});
const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-th',
});
```

แล้ว map เข้า Tailwind config เป็น `fontFamily.heading` / `fontFamily.body` เพื่อเรียกใช้เป็น design token ที่สม่ำเสมอทั้งเว็บ

**Layout Pattern ที่สังเกตจากภาพ:**

- Navbar: โลโก้ชิดซ้าย, เมนู (Quizzes / Cony / About Us) กลาง-ขวา, ปุ่ม CTA (เช่น "Start Quiz") ชิดขวาสุดแบบปุ่ม pill สีน้ำตาลเข้ม
- Hero section เป็น **split layout**: ฝั่งซ้ายข้อความ + ปุ่ม CTA คู่ (primary + secondary ทั้งคู่เป็นปุ่ม pill สีน้ำตาล), ฝั่งขวาเป็นการ์ดภาพสินค้ามุมโค้งมนขนาดใหญ่ วางเหลื่อมขอบจอเล็กน้อยเพื่อความไดนามิก
- ปุ่มทุกปุ่มเป็นทรง **pill (fully rounded)** สม่ำเสมอทั้งเว็บ
- Badge/Tag ทรง pill ขนาดเล็กใช้แนะนำหมวดหมู่ (เช่น "CONYLAND") วางเหนือ heading

### 5.2 แนวทางที่จะพัฒนาเพิ่มจากเว็บเดิม

- ใช้โทนสี/ฟอนต์เดิมเป็นฐาน แต่จัด typography hierarchy และ spacing ให้เป็นระบบมากขึ้น (design token ชัดเจนใน Tailwind config)
- เพิ่ม micro-interaction/animation เบาๆ (hover, transition) บนปุ่มและการ์ดสินค้า เพื่อความน่ารักและ premium feel มากขึ้น
- Layout เป็น mobile-first เนื่องจากกลุ่มลูกค้าหลักน่าจะเข้าชมผ่านมือถือ (โซเชียล/อินฟลูเอนเซอร์) — ต้องออกแบบ split-layout hero ข้างต้นให้ปรับเป็น stacked layout บนมือถือ
- แต่ละตัวละคร (mascot) ควรมีชุดสี/ไอคอนประจำตัว เพื่อสร้างความจดจำ (brand identity ต่อคาแรกเตอร์) โดยยังอยู่ภายใต้ palette หลักของแบรนด์
- ควรทำ Design System เบื้องต้น (สี, spacing, typography scale, component library) ก่อนเริ่ม build จริง เพื่อความสม่ำเสมอของ UI ทั้งเว็บ

---

## 6. Functional Requirements

### 6.1 ฝั่ง User (Frontend)

#### 6.1.1 หน้าแสดงรายการสินค้า (Product Listing)

- แสดงรายการตุ๊กตาทั้งหมด พร้อมรูปภาพ ชื่อ ราคา และคาแรกเตอร์สั้นๆ
- **จำนวนสินค้าเริ่มต้น: 12 แบบ** โดยมีแผนเพิ่มในอนาคต — เนื่องจากจำนวนยังไม่มาก ช่วง MVP อาจแสดงแบบ grid เดียวไม่ต้อง pagination ก็ได้ แต่ควรออกแบบ component ให้รองรับ pagination/infinite scroll ล่วงหน้า เพื่อไม่ต้องรื้อ UI เมื่อสินค้าเพิ่มขึ้นในอนาคต
- มี filter/sort เช่น ตามคาแรกเตอร์ ราคา ความนิยม สินค้าใหม่
- หน้ารายละเอียดสินค้า (Product Detail) แสดงเรื่องราว/บุคลิกของตุ๊กตาตัวนั้น รูปหลายมุม ราคา สต็อกคงเหลือ
- Responsive รองรับมือถือเป็นหลัก

#### 6.1.2 หน้า Quiz (แนะนำตุ๊กตาที่เหมาะกับผู้ใช้)

- ชุดคำถามแบบ multiple choice (จำนวนคำถามและตัวเลือกกำหนดได้จาก back office)
- ระบบคำนวณผลลัพธ์ (scoring logic) เพื่อ match กับตุ๊กตาตัวที่เหมาะสมที่สุด
- หน้าแสดงผลลัพธ์: แนะนำตุ๊กตา พร้อมปุ่มลิงก์ไปหน้าสินค้านั้น และปุ่มแชร์ผลลัพธ์ (social share) เพื่อสร้าง viral loop
- เก็บสถิติผลลัพธ์ quiz เพื่อใช้วิเคราะห์พฤติกรรมลูกค้า (analytics)

#### 6.1.3 หน้า Contact

- ฟอร์มติดต่อ (ชื่อ, อีเมล/เบอร์โทร, หัวข้อ, ข้อความ)
- Validation ฝั่ง client และ server
- ป้องกัน spam ด้วย CAPTCHA หรือ rate limiting
- ส่งข้อมูลเข้าระบบ back office ให้แอดมินดู/ตอบกลับ (และ/หรือแจ้งเตือนผ่านอีเมล)

#### 6.1.4 หน้าตรวจสอบสถานะการจัดส่ง (Order Tracking)

> **บริบทจริง**: ปัจจุบันแอดมินเก็บข้อมูลออเดอร์ใน Google Sheet (ตัวอย่างคอลัมน์: เลขรายการสั่งซื้อ, ชื่อแอคเคาท์, ชื่อผู้รับสินค้า, ที่อยู่ลูกค้า, รายการสินค้า, ไซส์, จำนวน, ห่อของขวัญ, หมายเหตุ, สถานะออเดอร์, ล็อต, เลขพัสดุ) โดย **เลขรายการสั่งซื้อเป็นเลขเรียงต่อกัน (sequential)** เช่น 3763, 3764, 3765 ... ซึ่งเดาได้ง่ายมาก นี่คือความเสี่ยงด้านความปลอดภัยที่สำคัญที่สุดของฟีเจอร์นี้ (ดูหัวข้อ 6.3.3)

**Flow การใช้งานของ user:**

1. ผู้ใช้เข้าหน้า "ตรวจสอบสถานะพัสดุ"
2. กรอกข้อมูล **อย่างน้อย 2 ปัจจัย** เพื่อยืนยันตัวตนก่อนแสดงผล (ห้ามใช้แค่เลขรายการสั่งซื้ออย่างเดียว เพราะเดาเลขต่อได้):
   - ปัจจัยที่ 1: เลขรายการสั่งซื้อ **หรือ** เลขพัสดุ (tracking number)
   - ปัจจัยที่ 2: ข้อมูลที่ต้องรู้เฉพาะเจ้าของออเดอร์ เช่น เบอร์โทร 4 ตัวท้าย, หรือชื่อแอคเคาท์ที่สั่งซื้อ (ต้อง confirm กับทีมว่าจะเพิ่มคอลัมน์เบอร์โทรใน Sheet หรือไม่ — ดู Open Questions)
3. ระบบตรวจสอบ (ผ่าน backend เท่านั้น ไม่ query ตรงจาก client) แล้วแสดงผลเฉพาะข้อมูลที่จำเป็น:
   - สถานะออเดอร์ปัจจุบัน (แปลงจากคอลัมน์ "สถานะออเดอร์" เป็น timeline ที่เข้าใจง่าย เช่น รับออเดอร์แล้ว → กำลังเตรียมจัดส่ง → จัดส่งแล้ว → ถึงปลายทาง)
   - **ข้อความ "อัปเดตข้อมูลล่าสุดเมื่อ [วันที่/เวลา]"** ตามรอบ sync ล่าสุด (เนื่องจากข้อมูลมาจาก Google Sheet ที่ sync รายสัปดาห์ ไม่ใช่ real-time — ดูหัวข้อ 6.3.1) เพื่อความโปร่งใส ไม่ให้ผู้ใช้เข้าใจผิดว่าระบบ error
   - เลขพัสดุ พร้อมลิงก์ไป track กับขนส่งต้นทาง (ถ้ามี)
   - รายการสินค้าที่สั่ง (ชื่อ/ไซส์/จำนวน) แบบย่อ
   - **ไม่แสดง**: ที่อยู่เต็ม, ชื่อ-นามสกุลเต็มของผู้รับ, หมายเหตุที่แอดมินจดไว้ภายใน — แสดงแบบ mask บางส่วนเท่านั้น (เช่น ชื่อผู้รับ "รัชฎ... ส..." ที่อยู่ไม่แสดงเลย หรือแสดงแค่จังหวัด)
4. Rate limit การค้นหา (เช่น จำกัดจำนวนครั้ง/นาที ต่อ IP หรือ session) และมี CAPTCHA หากพยายามค้นหาผิดหลายครั้งติดกัน เพื่อป้องกันการ brute-force เดาเลขออเดอร์
5. Log ทุกครั้งที่มีการค้นหา (สำเร็จ/ไม่สำเร็จ) เพื่อใช้ตรวจสอบพฤติกรรมผิดปกติภายหลัง (audit trail)

รายละเอียดสถาปัตยกรรมและการเชื่อมต่อ Google Sheet อยู่ในหัวข้อ **6.3**

### 6.2 ฝั่ง Admin (Back Office)

ระบบต้องมี authentication แยกจากฝั่ง user ทั่วไป และจำกัดสิทธิ์การเข้าถึงเฉพาะแอดมิน

> **ข้อกำหนดร่วม**: ทุกหน้าที่แสดงข้อมูลแบบตาราง (รายการสินค้า, รายการ quiz, รายการ contact, order lookup log) ต้อง implement ด้วย **TanStack Table** เพื่อให้ได้ฟีเจอร์ sorting, filtering, pagination, column visibility ที่สม่ำเสมอกันทั้งระบบ โดยต่อร่วมกับ TanStack Query สำหรับดึงข้อมูล (server-side pagination/filtering แนะนำสำหรับตารางที่ข้อมูลจะโตขึ้นเรื่อยๆ เช่น order log)

#### 6.2.1 จัดการสินค้า (Product Management)

- CRUD: สร้าง / แก้ไข / ลบ / ดูรายการสินค้า
- **หน้ารายการสินค้าในฝั่งแอดมินแสดงผลผ่าน TanStack Table** พร้อม sort ตามชื่อ/ราคา/สต็อก, filter ตามหมวดหมู่/สถานะ
- ฟิลด์: ชื่อ, คาแรกเตอร์/เรื่องราว, ราคา, สต็อก, รูปภาพ (อัปโหลดหลายรูป), สถานะ (active/inactive), หมวดหมู่/แท็ก
- ระบบจัดการสต็อกเบื้องต้น (เพิ่ม/ลดจำนวนคงเหลือ)

#### 6.2.2 จัดการ Quiz

- CRUD คำถาม, ตัวเลือกคำตอบ, และ logic การจับคู่ผลลัพธ์กับสินค้า
- **รายการคำถามและรายการผลลัพธ์สถิติแสดงผลผ่าน TanStack Table**
- ดูสถิติ/ผลลัพธ์ที่ผู้ใช้ได้รับ เพื่อวิเคราะห์เทรนด์ความนิยม

#### 6.2.3 จัดการ Contact

- ดูรายการข้อความที่ผู้ใช้ส่งเข้ามา
- **แสดงผลผ่าน TanStack Table** พร้อม filter ตามสถานะ (ใหม่/กำลังดำเนินการ/ตอบแล้ว) และ sort ตามวันที่
- เปลี่ยนสถานะ (ใหม่ / กำลังดำเนินการ / ตอบแล้ว)
- ลบ/archive ข้อความ
- (แนะนำเพิ่ม) ตอบกลับผู้ใช้ผ่านระบบได้โดยตรง หรืออย่างน้อย mark ว่าตอบแล้วนอกระบบ

#### 6.2.4 Middleware Stack สำหรับ Back Office API

ทุก request ที่เข้า API ฝั่ง back office (Hono) ต้องผ่าน middleware chain ตามลำดับที่กำหนดไว้ชัดเจน เพื่อให้มั่นใจว่าทุก route มี security layer ครบและสม่ำเสมอ ไม่ใช่ต่างคนต่าง handle เอง

**ลำดับ Middleware (จากนอกสุดเข้าในสุด):**

| ลำดับ | Middleware                      | หน้าที่                                                                                                          | ป้องกันอะไร                                                    |
| ----- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1     | **Security Headers**            | ตั้งค่า HTTP header มาตรฐาน (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` ฯลฯ)       | Clickjacking, MIME sniffing                                    |
| 2     | **CORS**                        | จำกัด origin ที่อนุญาตให้เรียก API ได้ (เฉพาะ domain ของ frontend เว็บนี้เท่านั้น)                               | Cross-origin request จาก domain ที่ไม่รู้จัก                   |
| 3     | **Request Logging**             | log request เข้าออกทุกตัว (method, path, IP, timestamp, response time)                                           | ใช้ debug และเป็น audit trail เบื้องต้น                        |
| 4     | **Rate Limiting**               | จำกัดจำนวน request ต่อ IP/route ตามความเสี่ยง (เช่น login endpoint จำกัดเข้มกว่า route ทั่วไป)                   | Brute-force, DDoS เบื้องต้น                                    |
| 5     | **Body Parsing + Validation**   | parse request body แล้ว validate ด้วย Zod schema ก่อนเข้าถึง business logic                                      | Invalid input, injection พื้นฐาน                               |
| 6     | **Authentication (JWT verify)** | ตรวจสอบ JWT จาก Authorization header หรือ HttpOnly cookie ว่า valid และไม่หมดอายุ                                | Unauthorized access — route ที่ไม่ผ่านจะ reject ด้วย 401 ทันที |
| 7     | **Authorization (RBAC guard)**  | ตรวจสอบว่า admin คนนี้มีสิทธิ์ทำ action นี้หรือไม่ตาม role (เช่น staff แก้ไขสินค้าได้แต่ลบไม่ได้ ถ้ามีหลาย role) | Privilege escalation — reject ด้วย 403 ถ้าไม่มีสิทธิ์          |
| 8     | **CSRF Protection**             | ตรวจสอบ CSRF token สำหรับ request ที่มีผลกระทบ (POST/PUT/DELETE) โดยเฉพาะถ้าใช้ cookie-based session             | Cross-site request forgery                                     |
| 9     | **Route Handler**               | business logic จริงของแต่ละ endpoint                                                                             | —                                                              |
| 10    | **Centralized Error Handler**   | จับ error ทุกจุด แปลงเป็น response format มาตรฐาน ไม่ leak stack trace/internal detail ออกไปให้ client           | Information disclosure ผ่าน error message                      |

**หลักการแบ่ง route ตามระดับการป้องกัน:**

| กลุ่ม route            | ตัวอย่าง                                                                     | Middleware ที่ต้องผ่าน                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Public (ไม่ต้อง login) | `GET /products`, `GET /quiz`, `POST /contact`, `POST /order-tracking/lookup` | 1-5, 9-10 (ข้าม auth/RBAC/CSRF) แต่ `/order-tracking/lookup` และ `/contact` ต้องมี rate limit เข้มเป็นพิเศษ (ดูหัวข้อ 6.3.3)         |
| Admin (ต้อง login)     | `POST /admin/products`, `PUT /admin/quiz/:id`, `DELETE /admin/contact/:id`   | ทั้ง 1-10 ครบทุกตัว ไม่มีข้อยกเว้น                                                                                                   |
| Admin Login            | `POST /admin/auth/login`                                                     | 1-5, 9-10 (ยังไม่มี JWT ให้ verify เพราะเป็น endpoint ขอ token) แต่ต้องมี rate limit เข้มที่สุดในระบบ (ป้องกัน brute-force รหัสผ่าน) |

**โครงสร้างตัวอย่างใน Hono (แนวคิด ไม่ใช่ production-ready code):**

```ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { jwt } from 'hono/jwt';

const app = new Hono();

// Global middleware (ทุก route)
app.use('*', secureHeaders());
app.use('*', cors({ origin: process.env.FRONTEND_URL }));
app.use('*', requestLogger());
app.use('*', rateLimiter({ windowMs: 60_000, max: 100 }));

// Public routes — ไม่ผ่าน auth
app.get('/products', productListHandler);
app.post('/order-tracking/lookup', rateLimiter({ windowMs: 600_000, max: 5 }), orderLookupHandler);

// Admin routes — ผ่าน auth + RBAC ทุกตัว
const admin = new Hono();
admin.use('*', jwt({ secret: process.env.JWT_SECRET }));
admin.use('*', rbacGuard());
admin.use('*', csrfProtection());
admin.post('/products', createProductHandler);
admin.put('/products/:id', updateProductHandler);
admin.delete('/products/:id', deleteProductHandler);

app.route('/admin', admin);

// Centralized error handler
app.onError((err, c) => errorHandler(err, c));
```

> หมายเหตุ: โค้ดนี้เป็นแนวคิดโครงสร้างเพื่อสื่อสาร requirement เท่านั้น ตอน implement จริงต้องเลือก/เขียน middleware แต่ละตัวให้เหมาะกับ Hono v4 API จริง (บาง middleware ในตัวอย่าง เช่น `rateLimiter`, `rbacGuard`, `csrfProtection`, `requestLogger`, `errorHandler` เป็น custom middleware ที่ต้องเขียนเอง ไม่ใช่ built-in ของ Hono)

### 6.3 สถาปัตยกรรมการเชื่อมต่อ Google Sheet (Order Data Integration)

#### 6.3.1 หลักการสำคัญ: ห้าม Frontend เรียก Google Sheet โดยตรง

**ห้ามเด็ดขาด** ไม่ให้ฝั่ง client (browser) เรียก Google Sheets API หรือ published-CSV link ตรงๆ เพราะ:

- จะต้องฝัง credential/API key ไว้ใน frontend ซึ่งดักดูได้จาก browser devtools
- Google Sheet เดิมมีข้อมูลลูกค้าทุกคนอยู่ในไฟล์เดียว หาก client ดึงข้อมูลทั้งชีตมาแล้วค่อย filter ฝั่ง browser เท่ากับส่งข้อมูลลูกค้า "ทุกคน" ไปอยู่ใน response ที่ browser ของใครก็ตามเปิดดูได้ (แม้จะซ่อนด้วย CSS/JS ก็ตาม)

**สถาปัตยกรรมที่แนะนำ (Sync-then-serve pattern):**

```
Google Sheet (ที่แอดมินกรอกข้อมูลอยู่)
        │  (1) Sync แบบมีเงื่อนไข/ตามรอบเวลา ผ่าน Service Account
        ▼
Backend Sync Job (Hono + scheduled task / webhook)
        │  (2) เขียนเฉพาะฟิลด์ที่จำเป็นลง Database ภายใน
        ▼
Internal Database (PostgreSQL) — ตาราง Order
        │  (3) API endpoint ที่ต้องผ่านการยืนยันตัวตน 2 ปัจจัย
        ▼
Frontend (Next.js) — หน้าตรวจสอบสถานะพัสดุ
```

**ยืนยันความถี่การ sync: รายสัปดาห์ (weekly)**

| แบบ                                          | วิธีการ                                                                                                                                                               | ข้อดี                                            | ข้อเสีย                                                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| A. Scheduled pull (ที่เลือกใช้)              | Backend ดึงข้อมูลจาก Google Sheets API **ทุกสัปดาห์** ผ่าน cron job                                                                                                   | ทำง่าย ไม่ต้องแก้ฝั่ง Sheet, ภาระ backend ต่ำมาก | ข้อมูลอาจ delay สูงสุด 1 สัปดาห์ (ดูข้อควรระวังด้านล่าง)                                                             |
| A (implementation บน Hono)                   | เนื่องจาก Hono ไม่มี built-in scheduler ให้ใช้ Railway Cron Job / Vercel Cron ยิงเรียก endpoint sync แยกต่างหาก (ตั้ง schedule แบบ weekly เช่น ทุกวันจันทร์เที่ยงคืน) | —                                                | —                                                                                                                    |
| B. Apps Script webhook (ไม่เลือกใช้ในเฟสนี้) | ติดตั้ง Google Apps Script trigger เมื่อมีการแก้ไขชีต ยิง webhook มา sync ทันที                                                                                       | ข้อมูล real-time                                 | เกินความจำเป็นเมื่อเทียบกับรอบ sync รายสัปดาห์ที่ทีมยืนยัน — เก็บไว้เป็นตัวเลือกอัปเกรดในอนาคตถ้าต้องการข้อมูลไวขึ้น |
| C. Manual trigger (แนะนำเพิ่ม)               | เพิ่มปุ่ม "Sync ข้อมูลล่าสุด" ใน back office ให้แอดมินกดสั่ง sync เองได้ทันทีนอกรอบ (เช่น กรณีอัปเดตสถานะด่วน ไม่อยากรอถึงรอบสัปดาห์ถัดไป)                            | ยืดหยุ่น แก้ปัญหาข้อเสียของ weekly sync ได้      | ต้อง rate-limit การกดปุ่มนี้เช่นกัน เพื่อไม่ให้เรียก Google Sheets API ถี่เกินไปจน hit quota                         |

**ข้อควรระวังจาก delay สูงสุด 1 สัปดาห์ (สำคัญ ต้องแจ้งลูกค้า):**

- ผู้ใช้ที่เข้าหน้า tracking อาจเห็นสถานะไม่ใช่ real-time ที่สุด — **ต้องแสดงข้อความ "อัปเดตข้อมูลล่าสุดเมื่อ [วันที่/เวลา sync ล่าสุด]"** บนหน้า tracking เสมอ เพื่อความโปร่งใสกับผู้ใช้ ไม่ให้เข้าใจผิดว่าระบบ error
- แนะนำให้มีปุ่ม Manual trigger (แบบ C) ควบคู่กับ weekly cron เพื่อให้แอดมิน sync ด่วนได้เมื่อจำเป็น (เช่น ลูกค้าทักถามเยอะช่วงเทศกาล)
- พิจารณาอัปเกรดเป็นรอบที่ถี่ขึ้น (เช่นรายวัน) ในอนาคตหากพบว่า delay รายสัปดาห์สร้างปัญหากับลูกค้าจริง

#### 6.3.2 การยืนยันสิทธิ์เข้าถึง Google Sheets API

- ใช้ **Google Service Account** (ไม่ใช่ OAuth ของบัญชีส่วนตัว) แชร์สิทธิ์ "Viewer" ให้ service account อ่านชีตได้อย่างเดียว (read-only) ไม่ให้สิทธิ์แก้ไข
- เก็บ credential (JSON key file) ไว้เป็น environment variable/secret บน server เท่านั้น **ห้าม commit เข้า git repository**
- จำกัดสิทธิ์ service account ให้เข้าถึงได้เฉพาะไฟล์ชีตนี้ไฟล์เดียว ไม่ใช่สิทธิ์ระดับ Drive ทั้งหมด

#### 6.3.3 การยืนยันตัวตนของ user ก่อนดูข้อมูล (สำคัญที่สุด)

เนื่องจาก "เลขรายการสั่งซื้อ" เป็นเลขเรียงต่อกัน (sequential ID) การอนุญาตให้ค้นหาด้วยเลขนี้อย่างเดียวเท่ากับเปิดช่องให้ใครก็ตาม loop เลข 1-9999 แล้วเห็นชื่อ-ที่อยู่ลูกค้าทุกคนได้ ต้องออกแบบดังนี้:

**ตัวเลือกปัจจัยที่ 2 (เลือกอย่างน้อย 1 อย่าง):**

| ตัวเลือก                          | ข้อดี                                          | ข้อเสีย                                                                   |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| เบอร์โทร (เต็มหรือ 4 ตัวท้าย)     | ปลอดภัยสุด ไม่ซ้ำกันง่าย                       | ต้องเพิ่มคอลัมน์นี้ใน Sheet ก่อน (ยังไม่มีตาม Open Question หัวข้อ 3)     |
| ชื่อแอคเคาท์ (username Shopee/IG) | มีข้อมูลอยู่แล้วใน Sheet ไม่ต้องรอเพิ่มคอลัมน์ | บางคนอาจรู้ username ของคนอื่นได้ถ้าเป็นเพื่อนกัน ปลอดภัยน้อยกว่าเบอร์โทร |
| อีเมล                             | ปลอดภัยดี                                      | ต้องเพิ่มคอลัมน์เช่นกัน ลูกค้าที่สั่งผ่านแชทอาจไม่มีข้อมูลนี้             |

**แนะนำ**: เริ่มจาก "ชื่อแอคเคาท์" เป็น MVP ก่อน (มีข้อมูลพร้อมใช้ทันที) แล้วอัปเกรดเป็นเบอร์โทรภายหลังเพื่อยกระดับความปลอดภัย เมื่อทีมเพิ่มคอลัมน์นี้ใน Sheet แล้ว

1. **บังคับ 2-factor lookup** เสมอ (เลขออเดอร์/เลขพัสดุ + ข้อมูลลับที่เจ้าของรู้เท่านั้น เช่น ชื่อแอคเคาท์ หรือเบอร์โทร — ดูตัวเลือกเปรียบเทียบด้านล่าง)
2. **Rate limiting ระดับ IP และ session** เช่น จำกัด 5 ครั้ง/10 นาที ต่อ IP หากเกินให้ขึ้น CAPTCHA (เช่น Cloudflare Turnstile หรือ Google reCAPTCHA)
3. **ตอบ error message แบบเดียวกันเป๊ะๆ** ทั้งกรณี "ไม่พบออเดอร์" และ "ปัจจัยที่ 2 ไม่ตรง" เพื่อไม่ให้ผู้โจมตีรู้ว่าเดาเลขออเดอร์ถูกหรือไม่ (ป้องกัน enumeration attack) — ใช้ข้อความมาตรฐานเดียว เช่น:

   > "ไม่พบข้อมูลคำสั่งซื้อ กรุณาตรวจสอบเลขคำสั่งซื้อและข้อมูลยืนยันตัวตนอีกครั้ง"

   ห้าม return ข้อความที่บอกใบ้ เช่น "เลขออเดอร์ถูกต้องแต่ข้อมูลยืนยันไม่ตรง" หรือ HTTP status code ที่ต่างกันระหว่าง 2 กรณีนี้ (ทั้งคู่ควรตอบ 404 หรือ 200 พร้อม `found: false` แบบเดียวกันเสมอ ไม่ใช่ 401/403 ที่บอกใบ้ว่าเจอ record แล้ว)

4. **หน่วงเวลาตอบกลับเทียม (throttling)**: เพิ่ม artificial delay ~1-2 วินาทีที่ backend endpoint นี้ทุก request (ไม่ว่าจะเจอหรือไม่เจอ) เพื่อทำให้การยิง request จำนวนมาก (brute-force script) ช้าลงอย่างมีนัยสำคัญ โดย user จริงที่ค้นหาแค่ 1 ครั้งแทบไม่รู้สึกถึงความช้านี้
5. **บังคับ exact match เท่านั้น**: query ต้อง match แบบตรงเป๊ะทั้งเลขออเดอร์และปัจจัยที่ 2 ห้ามรองรับ partial/wildcard search และ response ต้องคืนแค่ 1 order ที่ตรงพอดีเท่านั้น (ไม่คืน list/array หลายรายการ) ป้องกันการดึงข้อมูลทีละหลายแถว
6. พิจารณาเปลี่ยนจากการ expose เลขรายการสั่งซื้อแบบ sequential ให้ user เห็น เป็นการสร้าง **public order token** (เช่น UUID หรือ random string) แยกต่างหากสำหรับใช้ค้นหาแทน โดยยังเก็บเลขเดิมไว้ภายในสำหรับแอดมินอ้างอิงกับ Sheet
7. ไม่ log ปัจจัยยืนยันตัวตน (เบอร์โทร) แบบ plain text ลง log file ทั่วไป
8. **เฝ้าระวังพฤติกรรมผิดปกติ**: ใช้ตาราง `OrderLookupLog` (ดูหัวข้อ 9) ตั้ง alert เมื่อ IP เดียวลองค้นหาเลขออเดอร์ที่ต่างกันเกิน threshold ที่กำหนด (เช่น >20 เลขต่างกันภายใน 1 ชั่วโมง) ซึ่งเป็นสัญญาณของการ scan/enumeration attack
9. (ทางเลือกขั้นสูง สำหรับอนาคต) เพิ่ม OTP ยืนยันผ่านเบอร์โทรก่อนแสดงผล — ปลอดภัยสุดแต่มีต้นทุนค่า SMS และซับซ้อนขึ้น ไม่จำเป็นสำหรับ MVP

#### 6.3.4 Data Minimization — Field Mapping จาก Sheet สู่สิ่งที่ user เห็น

| คอลัมน์ใน Google Sheet      | เก็บใน DB ภายใน           | แสดงผลให้ user เห็นในหน้า tracking                       |
| --------------------------- | ------------------------- | -------------------------------------------------------- |
| เลขรายการสั่งซื้อ           | ✅ (ใช้เป็น internal key) | ❌ ไม่แสดงตรงๆ ใช้ order token แทน                       |
| ชื่อแอคเคาท์                | ✅                        | ⚠️ ใช้เป็นปัจจัยยืนยันตัวตนได้ (ไม่แสดงกลับ)             |
| ชื่อผู้รับสินค้า            | ✅                        | ⚠️ แสดงแบบ mask บางส่วน (เช่น "รัชฎ\*\*\* ส\*\*\*")      |
| ที่อยู่ลูกค้า               | ✅ (encrypt at rest)      | ❌ ไม่แสดง                                               |
| รายการสินค้า / ไซส์ / จำนวน | ✅                        | ✅ แสดงได้                                               |
| ห่อของขวัญ                  | ✅                        | ✅ แสดงได้ (ไม่กระทบความเป็นส่วนตัว)                     |
| หมายเหตุ                    | ✅                        | ❌ ไม่แสดง (อาจมีข้อความส่วนตัวที่แอดมินจดถึงทีมแพ็คของ) |
| สถานะออเดอร์                | ✅                        | ✅ แสดงเป็น timeline                                     |
| ล็อต                        | ✅                        | ❌ ไม่จำเป็นต้องแสดง (เป็นข้อมูล operation ภายใน)        |
| เลขพัสดุ                    | ✅                        | ✅ แสดง + ลิงก์ไป track กับขนส่ง                         |

#### 6.3.5 การจัดการข้อมูลกรณี Sheet มีค่าไม่สมบูรณ์

จากตัวอย่างข้อมูลจริงพบว่า:

- บางแถวคอลัมน์ "เลขพัสดุ" มีค่าเป็นข้อความอธิบาย (เช่น "จัดส่งแล้ว", "จัดส่ง 9-10 กค") แทนที่จะเป็นเลข tracking จริง — ระบบต้อง parse/normalize ค่านี้ และรองรับกรณีที่ไม่ใช่เลขพัสดุมาตรฐาน (แสดงเป็นข้อความสถานะแทนลิงก์ tracking)
- คอลัมน์ "ที่อยู่ลูกค้า" ว่างในหลายแถว (ทีมอาจเก็บที่อยู่แยกไว้ที่อื่น เช่นระบบขนส่ง) — ต้อง confirm แหล่งข้อมูลที่อยู่จริงกับทีมก่อนออกแบบ sync
- ไม่มีคอลัมน์เบอร์โทร/อีเมลในตัวอย่างที่ได้รับ — จำเป็นต้องเพิ่มก่อนใช้เป็นปัจจัยยืนยันตัวตน (ตาม Open Question ในหัวข้อ 3)

---

## 7. Non-Functional Requirements

### 7.1 Security

- Input validation และ sanitization ทุกจุดที่รับข้อมูลจากผู้ใช้ (ป้องกัน XSS, SQL Injection)
- ใช้ HTTPS ทั้งเว็บไซต์ (บังคับ redirect จาก HTTP)
- Authentication ฝั่ง admin: hash password ด้วย bcrypt/argon2, JWT หมดอายุและมี refresh token flow
- Rate limiting บน API ที่เสี่ยงต่อการโดนโจมตี (login, contact form, quiz submit)
- CSRF protection สำหรับฟอร์มที่มีผลกระทบ (โดยเฉพาะฝั่ง admin)
- File upload validation (จำกัดชนิดไฟล์รูปภาพ, ขนาดไฟล์, scan ก่อนบันทึก)
- แยกสิทธิ์การเข้าถึง (RBAC) หากมี admin หลายระดับ
- Audit log สำหรับการกระทำสำคัญในฝั่ง admin (แก้ไข/ลบข้อมูล)
- ปฏิบัติตาม PDPA สำหรับข้อมูลส่วนบุคคลของลูกค้า (ชื่อ, เบอร์โทร, ที่อยู่จัดส่ง)
- **Google Sheets integration**: อ่านข้อมูลผ่าน Service Account แบบ read-only เท่านั้น, sync เข้าฐานข้อมูลภายในก่อนเสมอ (ห้าม frontend query Sheet ตรง), เข้ารหัสฟิลด์ที่อยู่ลูกค้า (encryption at rest), และดูรายละเอียดทั้งหมดที่หัวข้อ 6.3
- **Order tracking lookup**: บังคับยืนยันตัวตน 2 ปัจจัยเสมอ, rate limit + CAPTCHA ป้องกัน brute-force เดาเลขออเดอร์ที่เป็น sequential ID, ไม่ expose เลขออเดอร์จริงให้ user เห็นโดยตรง (ใช้ token แทน), mask ข้อมูลชื่อ/ไม่แสดงที่อยู่เต็ม (ดูตาราง data minimization หัวข้อ 6.3.4)

### 7.2 Performance

- Lighthouse score เป้าหมาย ≥ 90 สำหรับ Performance/Accessibility/SEO
- Image optimization (lazy load, responsive images, WebP)
- Caching กลยุทธ์สำหรับ product listing (ISR หรือ cache-control ที่เหมาะสม)

### 7.3 SEO

- Meta tags, Open Graph สำหรับแชร์ลิงก์สินค้า/quiz result บนโซเชียล
- Sitemap.xml และ robots.txt
- Semantic HTML และ structured data (schema.org Product) สำหรับหน้าสินค้า

### 7.4 Accessibility & UX

- ตาม WCAG เบื้องต้น (contrast, alt text, keyboard navigation)
- **Responsive ครบ 3 ขนาดหน้าจอ: โทรศัพท์ / แท็บเล็ท / คอมพิวเตอร์** ออกแบบแบบ mobile-first (เขียน style สำหรับมือถือก่อน แล้วขยายด้วย `md:`/`lg:` breakpoint ของ Tailwind)

| Breakpoint | ขนาดหน้าจอ (โดยประมาณ) | Tailwind prefix              |
| ---------- | ---------------------- | ---------------------------- |
| Mobile     | < 768px                | (default, ไม่ต้องใส่ prefix) |
| Tablet     | 768px – 1023px         | `md:`                        |
| Desktop    | ≥ 1024px               | `lg:`                        |

- ครอบคลุมทั้งฝั่ง user (product listing, quiz, contact, order tracking) และฝั่ง admin back office (รวมถึงตาราง TanStack Table ในหัวข้อ 6.2 ที่ต้อง responsive ด้วย เช่น ย่อคอลัมน์หรือเปลี่ยนเป็น card view บนมือถือ ไม่ overflow แนวนอนโดยไม่มี scroll indicator)
- ต้องทดสอบจริงบนอุปกรณ์ตัวแทนแต่ละกลุ่มก่อน launch (เช่น iPhone/Android ตัวจริงหรือ DevTools emulator สำหรับ mobile, iPad สำหรับ tablet, จอ 1440px+ สำหรับ desktop) ไม่ใช่แค่ resize browser window เดา

---

## 8. Deployment & Infrastructure

### 8.1 เป้าหมาย

Deploy บน **Cloud VPS** โดยรัน OS เป็น **Ubuntu 24 (LTS)** และรันทุก service ผ่าน **Docker Compose** เพื่อให้ย้ายเครื่อง/scale ในอนาคตทำได้ง่าย

### 8.2 สเปก VPS เริ่มต้น (MVP Stage)

| รายการ        | สเปก            |
| ------------- | --------------- |
| CPU           | 1 vCore         |
| RAM           | 2GB             |
| Disk          | 20GB SSD        |
| Data Transfer | Unlimited       |
| Port Speed    | 100 Mbps        |
| OS            | Ubuntu 24 (LTS) |

> **ข้อควรทราบ**: สเปกนี้เพียงพอสำหรับช่วง MVP/ทดสอบตลาดที่ traffic ยังไม่สูง แต่ RAM 2GB ค่อนข้างจำกัดสำหรับ stack Next.js + Hono + PostgreSQL รวมกันในเครื่องเดียว ต้องปฏิบัติตามข้อกำหนดในหัวข้อ 8.4 อย่างเคร่งครัดเพื่อป้องกันปัญหา out-of-memory (OOM) และควรวางแผน**อัปเกรดเป็น 2 vCore / 4GB RAM** เมื่อ traffic เพิ่มขึ้น หรือเริ่มพบสัญญาณ container restart บ่อย/response ช้า

### 8.3 สถาปัตยกรรมการ Deploy

```
GitHub Repository (monorepo: Next.js + Hono + Drizzle)
        │  (1) Push to main branch
        ▼
CI/CD Pipeline (GitHub Actions)
        │  (2) Build Docker image ทั้งฝั่ง frontend และ backend
        │      แล้ว push เข้า Container Registry (เช่น GitHub Container Registry)
        ▼
Container Registry
        │  (3) VPS ทำ `docker pull` image ที่ build เสร็จแล้ว
        ▼
VPS (Ubuntu 24 + Docker Compose)
  ├─ Reverse Proxy (Caddy หรือ Nginx + Certbot) → จัดการ HTTPS
  ├─ Next.js container
  ├─ Hono API container
  └─ PostgreSQL container (หรือใช้ managed DB แยกถ้างบเอื้อ — ดูหัวข้อ 8.6)
```

**หลักการสำคัญ: ห้าม build (`next build`) บน VPS โดยตรง** เพราะ RAM 2GB ไม่พอ (ขั้นตอน build อาจใช้ RAM 1.5-2GB+) เสี่ยง OOM สูงมาก ต้อง build ผ่าน CI/CD แล้ว pull image สำเร็จรูปมาแทน

### 8.4 การจัดการ Resource บน VPS สเปกนี้ (บังคับ)

1. **ตั้ง Swap file 2-4GB** เป็น safety net ป้องกัน process ถูก OOM-kill:
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```
2. **จำกัด memory ต่อ container** ใน `docker-compose.yml` เพื่อไม่ให้ container ใดใช้ RAM จนตัวอื่นล่ม:
   - Next.js: ~500MB
   - Hono API: ~150MB
   - PostgreSQL: ~300MB
3. **Tune PostgreSQL** ให้เหมาะกับ RAM จำกัด: ลด `shared_buffers` (~128-256MB) และ `max_connections` (~20-30 พอสำหรับสเกลนี้)
4. **ตั้ง log rotation** (`logrotate` + `docker` log driver จำกัดขนาด) ไม่ให้ log บวมจนดิสก์เต็ม
5. **ไม่เก็บไฟล์รูปภาพสินค้าบน VPS** — ใช้ external object storage (Cloudflare R2/S3) ตามที่ระบุในหัวข้อ 4 เพื่อประหยัด disk 20GB ไว้สำหรับ OS/images/database เท่านั้น

### 8.5 Reverse Proxy & HTTPS

- แนะนำ **Caddy** แทน Nginx+Certbot เพราะออก/ต่ออายุ SSL certificate (Let's Encrypt) ให้อัตโนมัติ ลดงาน config
- Force redirect HTTP → HTTPS ทั้งเว็บไซต์ (สอดคล้องกับข้อกำหนดด้าน Security หัวข้อ 7.1)

### 8.6 Database Backup

- ตั้ง cron job รัน `pg_dump` สำรองฐานข้อมูลเป็นระยะ (เช่นทุกวัน) แล้วอัปโหลดไฟล์ backup ไปเก็บที่ object storage แยกต่างหาก (ไม่เก็บไว้บน VPS เครื่องเดียวกัน)
- สำคัญเป็นพิเศษเพราะฐานข้อมูลมีข้อมูล order/ลูกค้าที่ sync มาจาก Google Sheet (ดูหัวข้อ 6.3) หากข้อมูลหายจะกระทบการตรวจสอบสถานะพัสดุของลูกค้าโดยตรง
- พิจารณาย้ายไปใช้ managed PostgreSQL (เช่น Railway, Supabase, Neon) ในอนาคตหากต้องการลดภาระดูแล backup/HA เอง

### 8.7 Security ที่ระดับ VPS

- ตั้ง `ufw` firewall เปิดเฉพาะ port ที่จำเป็น (22 สำหรับ SSH, 80/443 สำหรับเว็บ)
- Disable SSH password login ใช้ SSH key เท่านั้น, พิจารณาเปลี่ยน default SSH port
- เปิด `unattended-upgrades` เพื่อรับ security patch ของ Ubuntu อัตโนมัติ
- จำกัดสิทธิ์ Docker container ไม่ให้รันเป็น root โดยไม่จำเป็น

### 8.8 Monitoring

- ติดตั้ง Sentry (ตามที่ระบุในหัวข้อ 4) สำหรับ error tracking ฝั่ง application
- ตั้ง basic uptime monitoring (เช่น UptimeRobot แบบฟรี) เพื่อแจ้งเตือนเมื่อเว็บล่ม
- เฝ้าระวัง RAM/disk usage สม่ำเสมอในช่วงแรกหลัง launch เนื่องจากสเปก VPS ค่อนข้างจำกัด (ดูหัวข้อ 8.2)

---

## 9. Data Model เบื้องต้น (High-level Entities)

- **Product**: id, name, description/story, price, stock, images[], character_tag, status, created_at, updated_at
- **QuizQuestion**: id, question_text, order, options[]
- **QuizOption**: id, question_id, option_text, result_weight (mapping ไปยัง mascot/product)
- **QuizResult**: id, session_id, matched_product_id, submitted_at (สำหรับเก็บสถิติ)
- **ContactMessage**: id, name, email/phone, subject, message, status, created_at
- **Order**: id (internal), order_token (public, random/UUID สำหรับให้ user ใช้ค้นหาแทนเลขจริง), source_order_number (เลขจาก Sheet เดิม, internal only), account_name, recipient_name, address (encrypted), phone (encrypted, ถ้าเพิ่มเข้ามา), product_name, size, quantity, gift_wrap (boolean), note (internal only), status, lot, tracking_number_raw (ค่าดิบจาก Sheet), tracking_number_normalized (เลขพัสดุที่ parse แล้ว หรือ null ถ้า parse ไม่ได้), synced_at, created_at, updated_at
- **OrderLookupLog**: id, order_id (nullable ถ้าไม่พบ), ip_address, success (boolean), attempted_at — สำหรับ rate limiting และ audit
- **AdminUser**: id, username, password_hash, role, created_at

> Data model นี้เป็นระดับ high-level ต้อง finalize field และ relationship อีกครั้งตอนออกแบบ database schema จริง

---

## 10. Milestone แนะนำ (Phased Rollout)

1. **Phase 0 — Design & Setup**: Design system, wireframe, ตั้งค่า repo/monorepo, CI/CD พื้นฐาน
2. **Phase 1 — Core User Pages**: หน้ารายการสินค้า + รายละเอียดสินค้า, หน้า contact
3. **Phase 2 — Quiz Feature**: หน้า quiz + logic การจับคู่ผลลัพธ์
4. **Phase 3 — Order Tracking + Google Sheet Sync**: ตั้งค่า Service Account, backend sync job (scheduled pull), ตาราง Order/OrderLookupLog, API lookup แบบ 2-factor + rate limiting, หน้า tracking ฝั่ง user (ดูหัวข้อ 6.1.4 และ 6.3 ทั้งหมด)
5. **Phase 4 — Admin Back Office**: CRUD ทั้ง 3 โมดูล + authentication
6. **Phase 5 — Security Hardening & QA**: penetration testing เบื้องต้น, load testing, ปรับปรุงตาม feedback
7. **Phase 6 — Launch**: provision VPS ตามหัวข้อ 8, ตั้ง CI/CD build+deploy pipeline, swap/memory limit/backup ตามหัวข้อ 8.4-8.6, monitoring setup (หัวข้อ 8.8)

---

## 11. สิ่งที่ต้องการเพิ่มเติมจากผู้ว่าจ้าง/ทีม (ก่อนเริ่มพัฒนา)

- ~~ภาพหน้าจอหรือไฟล์ตัวอย่างธีม/สี/ฟอนต์จากเว็บเดิม~~ → **ได้รับครบแล้ว** ทั้งฟอนต์ (Fredoka EN + Prompt TH) และ HEX code สี (ดูหัวข้อ 5.1) — ไม่มี open item เรื่องธีม/ฟอนต์/สีเหลืออยู่แล้ว
- ~~ยืนยันขอบเขตเรื่องระบบสั่งซื้อ/ชำระเงิน~~ → **ยืนยันแล้ว: ไม่มีในเว็บนี้** (ดูหัวข้อ 3)
- ~~ยืนยันวิธีตรวจสอบสถานะพัสดุ~~ → **ยืนยันแล้ว: ดึงจาก Google Sheet** (ดูหัวข้อ 3, 6.3)
- ~~จำนวนสินค้า (ตุ๊กตา) โดยประมาณ~~ → **ยืนยันแล้ว: 12 แบบ เริ่มต้น มีแผนเพิ่ม** (ดูหัวข้อ 6.1.1)
- Branding guideline หรือ mascot character sheet แบบเต็ม (ถ้ามี) เพื่อให้ทีมออกแบบอ้างอิงคาแรกเตอร์แต่ละตัวทั้ง 12 แบบได้ถูกต้อง
- ยืนยันว่าจะเพิ่มคอลัมน์เบอร์โทร/อีเมลใน Google Sheet เพื่อใช้เป็นปัจจัยยืนยันตัวตนของ user ตอนตรวจสอบพัสดุหรือไม่ (ปัจจุบันยังไม่มีในไฟล์ตัวอย่าง)
- ยืนยันแหล่งข้อมูล "ที่อยู่ลูกค้า" ที่แท้จริง (เนื่องจากคอลัมน์นี้ว่างในตัวอย่างที่ได้รับ — เก็บอยู่ในระบบขนส่งแทนหรือไม่)
- สิทธิ์เข้าถึง Google Sheet เพื่อสร้าง Service Account (ต้องขอสิทธิ์ระดับ Editor ของ Google Workspace/Drive ที่เก็บไฟล์นี้ เพื่อแชร์สิทธิ์ Viewer ให้ service account)
- ข้อมูล access VPS (IP, root/SSH access) และยืนยันสเปกเริ่มต้นตามหัวข้อ 8.2 พร้อมงบประมาณสำรองไว้สำหรับอัปเกรดสเปกเมื่อ traffic เพิ่มขึ้น
- Domain name ที่จะใช้ (สำหรับตั้งค่า DNS ชี้มาที่ VPS และออก SSL certificate)
- ยืนยันว่าต้องการปุ่ม "Manual sync" ให้แอดมินสั่ง sync ข้อมูลจาก Sheet ได้เองนอกรอบสัปดาห์หรือไม่ (ดูหัวข้อ 6.3.1 ตัวเลือก C)
