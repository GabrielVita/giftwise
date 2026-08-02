"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Digite um e-mail válido"),
});

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const result = schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar a solicitação.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-50">
      <div className="absolute top-6 left-4 sm:left-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Login
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="text-violet-600 dark:text-violet-400 p-3 bg-violet-100/80 dark:bg-violet-500/15 rounded-2xl border border-violet-200/60 dark:border-violet-500/20 shadow-sm">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Recuperar senha</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Informe seu e-mail cadastrado para receber as instruções de redefinição.
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40 py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          {success ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Instruções enviadas!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Se o e-mail estiver cadastrado, enviamos o link para redefinir sua senha. Verifique também o console da sua aplicação local durante os testes.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-block w-full text-center py-2.5 px-4 rounded-full text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                >
                  Ir para a página de Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-500/20 text-center">
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 focus:ring-violet-500/20 focus:border-violet-500 rounded-xl bg-transparent placeholder-zinc-400 focus:outline-hidden focus:ring-2 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-all duration-300 hover:scale-102 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}