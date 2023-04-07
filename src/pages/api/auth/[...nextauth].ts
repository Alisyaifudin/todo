import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import { verifyPasswordWithHash } from "~/utils/hash";

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: "1234",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@email.co",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("BAD_REQUEST");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("NOT_FOUND");
        }
        const verify = await verifyPasswordWithHash(
          credentials.password,
          user.password
        );
        if (!verify) {
          throw new Error("INVALID_REQUEST");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
} as AuthOptions;

export default NextAuth(authOptions);
