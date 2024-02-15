import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN"
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages:{
    signIn:"/auth/login",
    error:"/auth/error",
  },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id: user.id},
        data:{emailVerified:new Date()}
      })
    }
  },
  callbacks:{
    async signIn({user,account}){
      //Allow OAuth without email verification
      if(account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      if(!existingUser?.emailVerified) return false;//prevent sign in without verification

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation) return false;

        await db.twoFactorConfimation.delete({
          where:{id:twoFactorConfirmation.id}
        });
      }

      return true;
    },
    async session({ session, token }) {
      if(token.role  && session.user){
        session.user.role = token.role;
      }
      if(token.sub && session.user){
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile}) {
      if(!token.sub){
        return token;
      }
      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;
      token.role = existingUser.role;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
