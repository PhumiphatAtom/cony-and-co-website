import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from '@/components/ui';

type ColorEntry = { token: string; hex: string; bg: string; fg: string; border?: boolean };

const COLORS: ColorEntry[] = [
  { token: 'background', hex: '#B5C7D9', bg: 'bg-background', fg: 'text-brand' },
  { token: 'brand', hex: '#402D1F', bg: 'bg-brand', fg: 'text-white' },
  { token: 'brand.muted', hex: '#635B56', bg: 'bg-brand-muted', fg: 'text-white' },
  { token: 'brand.accent', hex: '#B77749', bg: 'bg-brand-accent', fg: 'text-white' },
  { token: 'surface', hex: '#FFFDF7', bg: 'bg-surface', fg: 'text-brand', border: true },
  { token: 'badge', hex: '#9EA8B4', bg: 'bg-badge', fg: 'text-brand' },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-brand/10 bg-surface px-6 py-8 md:px-10 lg:px-16">
        <Badge className="mb-3">Design System</Badge>
        <h1 className="font-heading text-4xl font-bold text-brand md:text-5xl">Cony &amp; Co.</h1>
        <p className="mt-2 font-body text-brand-muted">
          Style Guide — ตรวจสอบ Component และ Design Token
        </p>
      </div>

      <div className="space-y-16 px-6 py-12 md:px-10 lg:px-16">
        {/* ── Color Palette ── */}
        <section>
          <SectionTitle>Color Palette</SectionTitle>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {COLORS.map(({ token, hex, bg, fg, border }) => (
              <div key={token} className="space-y-2">
                <div
                  className={`${bg} ${border ? 'border border-brand/20' : ''} flex h-24 items-end rounded-xl p-3`}
                >
                  <span className={`${fg} font-mono text-xs`}>{hex}</span>
                </div>
                <p className="text-sm font-medium text-brand">{token}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section>
          <SectionTitle>Typography</SectionTitle>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Fredoka — EN */}
            <Card>
              <CardHeader>
                <Badge>Fredoka — EN (--font-en)</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-heading text-4xl font-bold text-brand">Cony &amp; Co.</p>
                <p className="font-heading text-2xl font-semibold text-brand-muted">
                  PERSONALITY QUIZ
                </p>
                <p className="font-heading text-lg font-medium text-brand">Start Quiz →</p>
                <p className="font-heading text-base text-brand">
                  Find the bunny that matches your personality.
                </p>
              </CardContent>
            </Card>

            {/* Prompt — TH */}
            <Card>
              <CardHeader>
                <Badge>Prompt — TH (--font-th)</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-body text-4xl font-bold text-brand">ตุ๊กตาของคุณ</p>
                <p className="font-body text-2xl font-semibold text-brand-muted">
                  แบบทดสอบบุคลิกภาพ
                </p>
                <p className="font-body text-lg font-medium text-brand">เริ่มทำแบบทดสอบ →</p>
                <p className="font-body text-base text-brand">
                  ค้นหาตุ๊กตากระต่ายที่ตรงกับบุคลิกของคุณที่สุด
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Buttons ── */}
        <section>
          <SectionTitle>Buttons</SectionTitle>
          <Card className="space-y-8">
            <div>
              <Label>Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </div>

            <div>
              <Label>All Combinations</Label>
              <div className="space-y-3">
                {(['primary', 'secondary', 'outline'] as const).map((v) => (
                  <div key={v} className="flex flex-wrap items-center gap-3">
                    <Button variant={v} size="sm">
                      {v} sm
                    </Button>
                    <Button variant={v} size="md">
                      {v} md
                    </Button>
                    <Button variant={v} size="lg">
                      {v} lg
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Disabled</Label>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <Label>Thai Labels</Label>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">สั่งซื้อเลย</Button>
                <Button variant="secondary">ดูสินค้า</Button>
                <Button variant="outline">เริ่มทำแบบทดสอบ</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Badges ── */}
        <section>
          <SectionTitle>Badges / Tags</SectionTitle>
          <Card>
            <div className="flex flex-wrap gap-3">
              <Badge>CONYLAND</Badge>
              <Badge>NEW ARRIVAL</Badge>
              <Badge>BEST SELLER</Badge>
              <Badge>LIMITED</Badge>
              <Badge>สินค้าใหม่</Badge>
              <Badge>ขายดี</Badge>
            </div>
          </Card>
        </section>

        {/* ── Cards ── */}
        <section>
          <SectionTitle>Cards</SectionTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_PRODUCTS.map((p) => (
              <Card key={p.name}>
                <CardHeader>
                  <Badge>{p.tag}</Badge>
                  {/* placeholder image area */}
                  <div className="mt-3 flex h-40 items-center justify-center rounded-xl bg-background text-4xl">
                    {p.emoji}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-heading text-xl font-bold text-brand">{p.name}</h3>
                  <p className="mt-1 font-body text-sm text-brand-muted">{p.desc}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="font-heading text-xl font-bold text-brand">{p.price}</span>
                  <Button size="sm">สั่งซื้อ</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Responsive Check ── */}
        <section>
          <SectionTitle>Responsive Breakpoints</SectionTitle>
          <Card className="font-body text-brand">
            <div className="rounded-lg bg-background p-4 text-center">
              <p className="block text-sm font-semibold md:hidden">📱 Mobile (&lt;768px)</p>
              <p className="hidden text-sm font-semibold md:block lg:hidden">
                📟 Tablet (768–1023px)
              </p>
              <p className="hidden text-sm font-semibold lg:block">🖥 Desktop (≥1024px)</p>
            </div>
            <p className="mt-3 text-sm text-brand-muted">
              ย่อ/ขยาย browser window เพื่อดูว่า breakpoint เปลี่ยนถูกต้อง
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}

/* ── Small helpers (server components, no need for separate files) ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-heading text-2xl font-bold text-brand after:ml-3 after:text-brand-accent after:content-['—']">
      {children}
    </h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-body text-sm font-medium text-brand-muted">{children}</p>;
}

const SAMPLE_PRODUCTS = [
  {
    name: 'Cony Classic',
    tag: 'CONYLAND',
    price: '฿ 590',
    desc: 'ตุ๊กตากระต่ายขาวอารมณ์ดี ชอบกอดและฟังเรื่องราว',
    emoji: '🐰',
  },
  {
    name: 'Luna Dark',
    tag: 'DARK SERIES',
    price: '฿ 650',
    desc: 'กระต่ายดำลึกลับ สายมิสทีเรียส ชอบดูดาวกลางคืน',
    emoji: '🌙',
  },
  {
    name: 'Rosie Pink',
    tag: 'NEW ARRIVAL',
    price: '฿ 620',
    desc: 'กระต่ายชมพูสดใส พลังงานสูง ชอบทำเบเกอรี่',
    emoji: '🌸',
  },
];
