// @ts-ignore
import NextAuth, { Account, NextAuthOptions, Profile, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AdapterUser } from "next-auth/adapters";
import { toast } from "sonner";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          placeholder: "eg:john@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BE_URL}/auth/login/`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (res.ok) {
            const user = await res.json();
            return user;
          } else {
            const errorData = await res.json();
            throw new Error(
              JSON.stringify({ errors: errorData.message, status: false })
            );
          }
        } catch (error) {
          //@ts-ignore

          const errorObj = JSON.parse(error.message);
          const errorMessage = errorObj.errors;
          //@ts-ignore

          throw new Error(errorMessage);
          // return false;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      account: Account | null;
      profile?: Profile | undefined;
      user: User | AdapterUser;
    }) {
      return true;
    },
  },
};

export default authOptions;
