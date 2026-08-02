import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import crypto from "crypto";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Se o e-mail estiver cadastrado, você receberá um link de redefinição." },
        { status: 200 }
      );
    }

    // Limpa tokens antigos desse e-mail
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Expiração em 1 hora em milissegundos absolutos (Unix Timestamp)
    const expiresAt = BigInt(Date.now() + 60 * 60 * 1000); 

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/redefinir-senha?token=${resetToken}`;
    
    console.log("-----------------------------------------");
    console.log("🔗 LINK GERADO:", resetLink);
    console.log("-----------------------------------------");

    const { error: emailError } = await resend.emails.send({
      from: "GiftWise <onboarding@resend.dev>",
      to: email,
      subject: "Redefinição de Senha - GiftWise",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Redefinição de Senha - GiftWise</h2>
          <p>Você solicitou a alteração de senha da sua conta.</p>
          <p>Clique no botão abaixo para redefinir sua senha (válido por 1 hora):</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; margin: 16px 0;">Redefinir Senha</a>
          <p style="color: #666; font-size: 12px;">Se você não solicitou este e-mail, pode ignorá-lo com segurança.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("⚠️ Resend notice:", emailError);
    }

    return NextResponse.json(
      { message: "Se o e-mail estiver cadastrado, você receberá um link de redefinição." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na solicitação de esqueci senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}