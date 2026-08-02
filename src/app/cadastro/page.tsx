"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, ArrowLeft, User, Mail, Lock, AtSign } from "lucide-react";
import { z } from "zod";

// Mesmo esquema do Zod adaptado para o Front
const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e underline (_)"),
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    
    // Validação do Zod
    const result = registerSchema.safeParse(formData);
    
    if (!result.success) {
      // O flatten() organiza os erros por campo: { name: ["erro1", "erro2"], email: ["erro1"] }
      const formattedErrors = result.error.flatten().fieldErrors;
      
      const fieldErrors: Record<string, string> = {};
      
      // Pegamos apenas a primeira mensagem de erro de cada campo
      Object.keys(formattedErrors).forEach((key) => {
        const messages = formattedErrors[key as keyof typeof formattedErrors];
        if (messages && messages.length > 0) {
          fieldErrors[key] = messages[0];
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor respondeu de forma inesperada. Verifique se a rota da API está configurada.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta.");
      }

      // 📝 Registro bem-sucedido!
      // Quando criarmos o sistema de sessão (ex: NextAuth ou JWT), aqui salvaremos os dados do usuário.
      
      alert(`Conta criada com sucesso para: ${data.user.name}!`);

      // 💡 O fluxo ideal: Redirecionar para escolher hobbies
      // Como ainda não criamos a rota /onboarding/hobbies, vamos deixar comentado para o teste não quebrar em um 404.
      // router.push("/onboarding/hobbies");

    } catch (err: any) {
      setApiError(err.message || "Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-50">
      
      <div className="absolute top-6 left-4 sm:left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Home
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-violet-600 dark:text-violet-400 p-3 bg-violet-100/80 dark:bg-violet-500/15 rounded-2xl border border-violet-200/60 dark:border-violet-500/20 shadow-sm">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Criar sua conta no <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">GiftWise</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 cursor-pointer">
              Fazer login
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40 py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-500/20 text-center">
              {apiError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo</label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  placeholder="Ex: Gabriel Vita"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <AtSign className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  placeholder="gabrielvita"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.username ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm`}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.username}</p>}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail</label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm autofill:bg-transparent`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Senha</label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500'} rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm autofill:bg-transparent`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-all duration-300 hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Criando conta..." : "Cadastrar Grátis"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}