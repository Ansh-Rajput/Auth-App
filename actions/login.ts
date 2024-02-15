"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password , code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password){
    return {error: " Invalid Credentionsls!"}
  }

  if(!existingUser.emailVerified){
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email,verificationToken.token);

    return {success: "Confirmation email sent!"};
  }

  if(existingUser.isTwoFactorEnabled && existingUser.email){
    if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      
      if(!twoFactorToken){
        return {error: "Invalid Token!"};
      }

      if(twoFactorToken.token !== code){
        return {error:"Invalid code!"};
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired){
        return {error:"Code Expired!"};
      }

      await db.twoFactorToken.delete({
        where:{
          id:twoFactorToken.id,
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation){
        await db.twoFactorConfimation.delete({
          where:{
            id:existingConfirmation.id,
          }
        });
      }

      await db.twoFactorConfimation.create({
        data:{
          userId:existingUser.id,
        }
      })
    }
    else{
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
    await sendTwoFactorEmail(twoFactorToken.email,twoFactorToken.token);

    return {towFactor:true};
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
};
