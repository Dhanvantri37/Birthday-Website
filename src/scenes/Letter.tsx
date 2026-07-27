import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function Letter({ onNext }: { onNext: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [opened, setOpened] = useState(false);
  const [typedText, setTypedText] = useState("");

  const currentLetter = config.letters[activeTab];

  useEffect(() => {
    if (!opened) return;
    setTypedText("");
    let i = 0;
    const text = currentLetter.message;
    const interval = setInterval(() => {
      i += 3;
      setTypedText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [opened, activeTab]);

  return (
    <SceneShell mode="night" intensity={1.0} onContinue={onNext} continueLabel="Light the Birthday Cake">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          💌 Heartfelt Messages
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-gradient-gold">
          Personal Letters for Harshvardhan
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 font-display italic max-w-lg">
          Special handwritten notes sealed with love from your junior teammates.
        </p>

        {/* Tab Selection */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {config.letters.map((letItem, idx) => (
            <button
              key={letItem.id}
              onClick={() => {
                setActiveTab(idx);
                setOpened(true);
              }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-display text-sm italic transition-all ${
                activeTab === idx
                  ? "glass-gold border-gold text-gold shadow-glow-gold scale-105"
                  : "glass border-gold/20 text-slate-400 hover:text-gold"
              }`}
            >
              {letItem.avatar && <span>{letItem.avatar}</span>}
              <span>{letItem.author}</span>
            </button>
          ))}
        </div>

        {/* Envelope or Letter Display */}
        <div className="mt-8 w-full flex justify-center">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="envelope"
                onClick={() => setOpened(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="relative glass rounded-3xl p-8 sm:p-12 border border-gold/40 shadow-glow-gold flex flex-col items-center cursor-pointer max-w-md w-full"
              >
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/50 flex items-center justify-center text-4xl mb-4 shadow-inner">
                  ✉️
                </div>
                <h3 className="font-display text-2xl font-bold italic text-gold">
                  Letter from {currentLetter.author}
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                  {currentLetter.role} • Sealed for Harshvardhan
                </p>
                <div className="mt-6 rounded-full bg-gold px-6 py-2 text-xs font-semibold text-obsidian shadow-glow">
                  Tap to Unseal Letter
                </div>
              </motion.button>
            ) : (
              <motion.div
                key={`letter-${activeTab}`}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass rounded-3xl p-6 sm:p-10 border border-gold/40 shadow-glow-gold text-left max-w-2xl w-full relative bg-gradient-to-br from-obsidian-card via-obsidian to-obsidian-card"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gold/20 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    {currentLetter.avatar ? (
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-2xl">
                        {currentLetter.avatar}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-xl">
                        ✉️
                      </div>
                    )}
                    <div>
                      <h4 className="font-display text-xl font-bold italic text-gold">
                        From {currentLetter.author}
                      </h4>
                      <p className="text-xs text-slate-400">{currentLetter.role}</p>
                    </div>
                  </div>

                  <span className="text-xs font-handwriting text-gold/60 border border-gold/30 rounded-full px-3 py-1">
                    Chapter 21 Edition
                  </span>
                </div>

                {/* Letter Body in Handwriting Font */}
                <div className="min-h-[220px]">
                  <p className="whitespace-pre-line font-handwriting text-2xl sm:text-3xl text-amber-100/95 leading-relaxed tracking-wide">
                    {typedText}
                    {typedText.length < currentLetter.message.length && (
                      <span className="animate-pulse text-gold">|</span>
                    )}
                  </p>
                </div>

                <div className="mt-8 flex justify-end border-t border-gold/20 pt-4">
                  <button
                    onClick={() => {
                      if (activeTab < config.letters.length - 1) {
                        setActiveTab(activeTab + 1);
                      } else {
                        onNext();
                      }
                    }}
                    className="rounded-full bg-gold px-6 py-2 text-xs font-semibold text-obsidian shadow-glow transition hover:scale-105"
                  >
                    {activeTab < config.letters.length - 1 ? "Read Next Letter →" : "Continue Journey →"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
}
