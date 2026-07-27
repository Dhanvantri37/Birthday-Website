import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function GiftBoxes({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SceneShell mode="night" intensity={1.1} onContinue={onNext} continueLabel="Read Personal Messages">
      <div className="flex flex-col items-center text-center max-w-5xl mx-auto px-4">
        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          💙 Gratitude & Appreciation
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold max-w-3xl leading-tight">
          ✨ 21 Reasons We're Grateful to Have You in Our Journey ✨
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 font-display italic max-w-xl">
          Each card represents one of the 21 reasons why we are immensely blessed to have Harshvardhan in our lives. Tap any card to reveal!
        </p>

        {/* 21 Quality Cards Grid */}
        <div className="mt-10 grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {config.admireQualities.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 7) * 0.04, duration: 0.4 }}
              onClick={() => setSelected(idx)}
              className="group cursor-pointer glass-gold rounded-2xl p-4 flex flex-col items-center justify-between border border-gold/30 hover:border-gold transition-all shadow-glass hover:scale-105 min-h-[140px]"
            >
              <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold/60">
                Reason #{item.id}
              </span>
              <h3 className="font-display text-xs font-bold text-ivory group-hover:text-gold transition text-center line-clamp-2">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-4 sm:p-6 backdrop-blur-xl"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="glass max-w-md w-full rounded-3xl p-8 text-center border border-gold/50 shadow-glow-gold relative overflow-hidden"
              >
                <div className="text-5xl mb-4 animate-bounce">
                  {config.admireQualities[selected].icon}
                </div>

                <span className="inline-block rounded-full bg-gold/10 border border-gold/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                  Reason #{config.admireQualities[selected].id} of 21
                </span>

                <h3 className="font-display text-3xl font-bold italic text-gradient-gold mb-3">
                  {config.admireQualities[selected].title}
                </h3>

                <p className="text-base text-slate-200 font-display italic leading-relaxed mb-6">
                  "{config.admireQualities[selected].desc}"
                </p>

                <div className="flex items-center justify-between border-t border-gold/20 pt-4">
                  {selected > 0 ? (
                    <button
                      onClick={() => setSelected(selected - 1)}
                      className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
                    >
                      ← Previous
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-full bg-gold px-6 py-1.5 text-xs font-semibold text-obsidian shadow-glow"
                  >
                    Close
                  </button>

                  {selected < config.admireQualities.length - 1 ? (
                    <button
                      onClick={() => setSelected(selected + 1)}
                      className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
                    >
                      Next →
                    </button>
                  ) : <div />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
