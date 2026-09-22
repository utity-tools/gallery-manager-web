import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { data: body } = await axios.post(`${process.env.API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const payload = body?.data;

          if (!body?.success || !payload?.user || !payload?.accessToken) {
            throw new Error("Invalid credentials");
          }

          return {
            id: payload.user.id,
            name: payload.user.name,
            email: payload.user.email,
            slug: payload.user.slug,
            accessToken: payload.accessToken,
          };
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const message = err.response?.data?.error?.message ?? "Invalid credentials";
            throw new Error(message);
          }
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.slug = user.slug;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.slug = token.slug as string | undefined;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
