import NextAuth from "next-auth/next";

interface CustomUser {
  data: {
    avatar: string;
    date_joined: string;
    email: string;
    first_name: string;
    is_active: boolean;
    is_admin: boolean;
    is_superuser: boolean;
    last_login: string;
    last_name: string;
    subscription_plan: string;
    username: string;
    organization_id: string | null;
    role?: string | null;
  };
  message: string;
  status: number;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: CustomUser;
  }
}
