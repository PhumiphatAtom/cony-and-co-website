import { adminUsers, db } from '@cony-co/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../src/lib/password.js';

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);
  if (existing) {
    console.log(`Admin user "${username}" already exists — skipping.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.insert(adminUsers).values({ username, passwordHash, role: 'super_admin' });

  console.log(`Seeded admin user "${username}" (role: super_admin).`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Default password: ${password} — change this immediately.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
