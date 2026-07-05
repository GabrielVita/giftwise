"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Gift, UserPlus, Wand2 } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Função para fazer scroll suave até a seção "Como Funciona"
  const scrollToHowItWorks = () => {
    const element = document.getElementById("como-funciona");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-50">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="hidden sm:flex w-24"></div>

          {/* Centro: Nome do App */}
          <div className="flex flex-1 justify-start sm:justify-center">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              GiftWise
            </span>
          </div>

          {/* Direita: Controles */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Botão Alternador de Tema */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-zinc-500 cursor-pointer transition-all hover:scale-110 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.22 5.22l1.58 1.58m10.4 10.4l1.58 1.58M3 12h2.25m13.5 0H21M5.22 18.78l1.58-1.58m10.4-10.4l1.58-1.58M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            {/* Botão Entrar */}
            <Link 
              href="/login" 
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-violet-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-violet-500 dark:hover:text-white"
            >
              Entrar
            </Link>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl text-center space-y-6 flex flex-col items-center mb-16">
          
          {/* Ícone Super Destacado */}
          <div className="mb-4 text-violet-600 dark:text-violet-400 p-5 bg-violet-100/80 dark:bg-violet-500/15 rounded-3xl border border-violet-200/60 dark:border-violet-500/20 shadow-md shadow-violet-600/5 dark:shadow-none animate-pulse">
            <Gift className="w-16 h-16" strokeWidth={1.2} />
          </div>

          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50/50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400">
            O jeito inteligente de presentear ✨
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50">
            Acerte no presente,{" "}
            <span className="block mt-1 sm:inline bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              todas as vezes.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            O GiftWise usa inteligência para analisar a idade, gênero e os hobbies de quem você ama, recomendando o presente ideal para surpreender.
          </p>

          <div className="flex flex-col gap-3 justify-center pt-4 sm:flex-row sm:gap-4 w-full sm:w-auto">
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-full font-medium text-white bg-violet-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg shadow-violet-600/20 dark:bg-violet-500 dark:shadow-none"
            >
              Começar Agora
            </Link>
            <button 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-full font-medium border border-zinc-300 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
            >
              Como Funciona?
            </button>
          </div>

        </div>

        {/* SEÇÃO COMO FUNCIONA */}
        <section id="como-funciona" className="w-full max-w-5xl pt-24 border-t border-zinc-200/60 dark:border-zinc-700/50 scroll-mt-20">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
              Presentear nunca foi tão simples
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-500 dark:text-zinc-400">
              Esqueça a indecisão e horas de buscas cansativas. Descubra como nossa inteligência trabalha em três etapas rápidas.
            </p>
          </div>

          {/* Grid de Passos */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Passo 1 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">1. Defina o perfil</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Informe a faixa etária, gênero e os principais hobbies ou interesses de quem vai receber o presente.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 mb-4">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">2. IA em ação</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nossos algoritmos cruzam os dados para mapear as tendências mais assertivas e criativas do mercado.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">3. Escolha o ideal</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Receba uma lista sob medida com as melhores ideias de presentes, filtradas exatamente para surpreender quem você ama.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-700 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} GiftWise. Todos os direitos reservados.
      </footer>

    </div>
  );
}