import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      slug?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    slug?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    slug?: string;
    accessToken?: string;
  }
}
