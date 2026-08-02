import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
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

    const { token, password } = result.data;

    // 1. Busca o token no banco
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetTokenRecord) {
      return NextResponse.json(
        { error: "Token de redefinição inválido ou não encontrado." },
        { status: 400 }
      );
    }

    // 2. Comparação direta de timestamps em milissegundos
    const now = BigInt(Date.now());

    if (now > resetTokenRecord.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "Este token expirou. Solicite uma nova redefinição." },
        { status: 400 }
      );
    }

    // 3. Criptografa a nova senha e atualiza o usuário
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: resetTokenRecord.email },
      data: { password: hashedPassword },
    });

    // 4. Limpa os tokens do e-mail
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetTokenRecord.email },
    });

    return NextResponse.json(
      { message: "Senha redefinida com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}