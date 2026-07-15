import { adminRoleEnum } from '@cony-co/db';

export type AdminRole = (typeof adminRoleEnum.enumValues)[number];

export type AdminJwtPayload = {
  [key: string]: unknown;
  sub: string;
  username: string;
  role: AdminRole;
  iat: number;
  exp: number;
};

export type AppEnv = {
  Variables: {
    jwtPayload: AdminJwtPayload;
    validatedBody: unknown;
  };
};
