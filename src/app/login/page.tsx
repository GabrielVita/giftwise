"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    // Validação client-side com Zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Record<string, string> = {};

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciais inválidas. Tente novamente.");
      }

      alert(`Bem-vindo de volta, ${data.user.name || "usuário"}!`);
      // Redirecionamento futuro para a dashboard
      // router.push("/dashboard");

    } catch (err: any) {
      setApiError(err.message || "Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-50">
      
      {/* Botão de voltar */}
      <div className="absolute top-6 left-4 sm:left-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Home
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        {/* Header da Marca */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-violet-600 dark:text-violet-400 p-3 bg-violet-100/80 dark:bg-violet-500/15 rounded-2xl border border-violet-200/60 dark:border-violet-500/20 shadow-sm">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Acessar o <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">GiftWise</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Ainda não tem uma conta?{" "}
            <Link 
              href="/cadastro" 
              className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 cursor-pointer"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700/40 py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          
          {/* Botão do Google Desabilitado */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/40 text-sm font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-75 shadow-xs"
          >
            <svg className="w-5 h-5 opacity-60 filter grayscale" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Entrar com o Google <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">(Em breve)</span>
          </button>

          {/* Divisor "ou com e-mail" */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-400 font-medium">
                ou com e-mail
              </span>
            </div>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-500/20 text-center">
              {apiError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                E-mail
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500"
                  } rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Senha + Esqueci minha senha */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Senha
                </label>
                <Link
                  href="/esqueci-senha"
                  className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 cursor-pointer"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500"
                  } rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Botão de Entrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-all duration-300 hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  "Entrando..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}