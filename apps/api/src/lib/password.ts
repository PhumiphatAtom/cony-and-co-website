import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  dummyHashPromise ??= bcrypt.hash('dummy-password-for-timing', SALT_ROUNDS);
  return dummyHashPromise;
}

// Always runs a bcrypt.compare, even when there's no real hash to check against
// (unknown username) — keeps response timing similar for both cases so a
// brute-forcer can't distinguish "wrong password" from "no such user".
export async function verifyPasswordTimingSafe(
  password: string,
  hash: string | null
): Promise<boolean> {
  const target = hash ?? (await getDummyHash());
  const result = await bcrypt.compare(password, target);
  return hash !== null && result;
}
