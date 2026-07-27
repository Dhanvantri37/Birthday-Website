import { motion } from "framer-motion";
import type { ReactNode } from "react";
import AmbientBackground from "./AmbientBackground";

interface Props {
  children: ReactNode;
  mode?: "night" | "day" | "gold-glow" | "cosmic";
  intensity?: number;
  onContinue?: () => void;
  continueLabel?: string;
  showContinue?: boolean;
  className?: string;
  maxWidth?: string;
}

export default function SceneShell({
  children,
  mode = "day",
  intensity = 1,
  onContinue,
  continueLabel = "Continue the Journey",
  showContinue = true,
  className = "",
  maxWidth = "max-w-2xl",
}: Props) {
  return (
    <section
      className={`relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-midnight via-midnight-light to-midnight-deep px-4 sm:px-8 py-16 ${className}`}
    >
      <AmbientBackground mode={mode} intensity={intensity} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={`relative z-10 flex w-full ${maxWidth} flex-col items-center text-center`}
      >
        {children}
      </motion.div>

      {showContinue && onContinue && (
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          onClick={onContinue}
          className="group relative z-10 mt-14 flex flex-col items-center gap-2 text-gold/90 cursor-pointer"
        >
          <span className="font-display text-lg italic tracking-wide">{continueLabel}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-bounce">
            <path d="M3 6l6 6 6-6" stroke="#E8C874" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </section>
  );
}
