"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

function RedefinirSenhaForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token ausente na URL.");
      return;
    }

    const result = schema.safeParse({ password, confirmPassword });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao redefinir senha.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-4 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-2xl text-sm">
        Link inválido. Por favor, solicite a redefinição de senha novamente.
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Senha alterada com sucesso!
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Você será redirecionado para a página de login em instantes...
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-500/20 text-center">
              {error}
            </div>
          )}

          {/* Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nova Senha
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500 rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm"
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
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Confirmar Nova Senha
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500 rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-all duration-300 hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-50">
      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-violet-600 dark:text-violet-400 p-3 bg-violet-100/80 dark:bg-violet-500/15 rounded-2xl border border-violet-200/60 dark:border-violet-500/20 shadow-sm">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Crie sua nova senha</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Escolha uma senha forte para garantir a segurança da sua conta.
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40 py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          <Suspense fallback={<div className="text-center py-4">Carregando...</div>}>
            <RedefinirSenhaForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}