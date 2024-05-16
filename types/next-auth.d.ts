import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      data :{
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
        organization_id:string | null;
      },
      message: string;
      status: number;
      tokens: {
        access_token: string;
        refresh_token: string;
      }
    };
  }
 
}
