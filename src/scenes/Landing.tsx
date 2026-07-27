import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AmbientBackground from "../components/AmbientBackground";
import { config } from "../config";

interface Props {
  onBegin: () => void;
}

export default function Landing({ onBegin }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= config.openingSequence.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 3000);
    return () => clearTimeout(timer);
  }, [step]);

  const isRevealed = step >= config.openingSequence.length;

  return (
    <section className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-obsidian px-6">
      <AmbientBackground mode="cosmic" intensity={1.2} />

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="py-12"
            >
              <span className="font-display text-2xl italic tracking-wide text-gold/90 sm:text-4xl">
                "{config.openingSequence[step]}"
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="main-reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6 glass rounded-3xl p-8 sm:p-14 shadow-glass border border-gold/30 backdrop-blur-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
              >
                ✨ Chapter 21 – The Journey Continues ✨
              </motion.div>

              <h1 className="text-gradient-gold font-display text-5xl font-bold leading-tight sm:text-7xl md:text-8xl tracking-tight">
                {config.name}
              </h1>

              <p className="font-display text-xl italic text-slate-300 max-w-xl">
                "Happy 21st Birthday! Tonight, we honor every milestone, every laughter, and every chapter of your beautiful story."
              </p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-0.5 w-32 bg-gradient-to-r from-transparent via-gold to-transparent my-2"
              />

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                onClick={onBegin}
                className="glass-gold group relative overflow-hidden rounded-full px-10 py-4 font-display text-xl font-medium italic text-gold shadow-glow-gold transition hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Begin Chapter 21
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Skip Intro button */}
      {!isRevealed && (
        <button
          onClick={() => setStep(config.openingSequence.length)}
          className="absolute bottom-8 text-xs font-display italic text-gold/60 hover:text-gold transition uppercase tracking-widest"
        >
          Skip Intro →
        </button>
      )}
    </section>
  );
}
