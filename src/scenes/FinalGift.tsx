import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function FinalGift() {
  useEffect(() => {
    // Grand finale confetti firework
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
      colors: ["#E5C158", "#3B82F6", "#F8FAFC", "#C9B8F5"],
    });
  }, []);

  return (
    <SceneShell mode="night" intensity={1.3} showContinue={false}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center max-w-2xl mx-auto px-4 py-8"
      >
        <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/60 flex items-center justify-center text-5xl mb-6 shadow-glow-gold">
          👑
        </div>

        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          Forever Celebrated
        </span>

        <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-gradient-gold mb-4">
          Happy {config.age}st Birthday, {config.name}!
        </h2>

        <p className="font-display text-lg sm:text-xl italic text-slate-200 leading-relaxed max-w-lg mb-8">
          "May your {config.age}st year bring you extraordinary joy, breakthroughs, prosperity, and memories that last a lifetime. Chapter {config.age} is officially yours to write!"
        </p>

        <div className="glass-gold rounded-3xl p-8 border border-gold/40 shadow-glow-gold w-full mb-8">
          <h3 className="font-display text-xl font-bold italic text-gold mb-2">
            A Toast from Dhanvantri, Guruprasad, and Friends
          </h3>
          <p className="text-sm font-display italic text-slate-300">
            "{config.finaleMessage.quote}"
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="glass rounded-full px-8 py-3.5 font-display text-base italic text-gold border border-gold/40 shadow-glow hover:scale-105 transition active:scale-95 flex items-center gap-2"
        >
          🔄 Relive Chapter {config.age} Experience
        </button>
      </motion.div>
    </SceneShell>
  );
}
