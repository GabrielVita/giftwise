import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Definição do esquema de validação do Zod
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "O username só pode conter letras, números e underlines"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação com o Zod
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      // No Zod, a propriedade correta para acessar a lista de erros é .issues
      const firstError = result.error.issues[0].message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, username, email, password } = result.data;

    // Verificar se o e-mail já está cadastrado
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 400 });
    }

    // Verificar se o username já está cadastrado
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json({ error: "Este nome de usuário já está em uso." }, { status: 400 });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        gender: "UNISEX",
      },
    });

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso!", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email } 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro no registro de usuário:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao cadastrar usuário." },
      { status: 500 }
    );
  }
}