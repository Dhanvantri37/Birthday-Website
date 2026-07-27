import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientBackground from "./AmbientBackground";

interface Props {
  onSuccess: () => void;
  correctPin?: string;
}

export default function PinLock({ onSuccess, correctPin = "2807" }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setUnlocked(true);
          setTimeout(() => {
            onSuccess();
          }, 800);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 900);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin("");
    setError(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  return (
    <AnimatePresence>
      {!unlocked ? (
        <motion.div
          key="pin-lock"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-deep px-4"
        >
          <AmbientBackground mode="night" intensity={1.4} />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`glass-gold relative z-10 w-full max-w-md rounded-3xl p-8 text-center border border-gold/40 shadow-glow-gold backdrop-blur-2xl ${
              error ? "animate-shake" : ""
            }`}
          >
            {/* Crown Icon Header */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 border border-gold/50 text-3xl shadow-glow">
              👑
            </div>

            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold/80 mb-1 block">
              Private Experience
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-bold italic text-gradient-gold mb-2">
              Enter Passcode
            </h2>

            <p className="font-display text-xs text-slate-300 italic mb-6">
              Enter the 4-digit PIN to unlock Chapter 21
            </p>

            {/* PIN Slots */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < pin.length;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: filled ? 1.15 : 1,
                      borderColor: error ? "#EF4444" : filled ? "#E8C874" : "rgba(232, 200, 116, 0.3)",
                    }}
                    className={`h-12 w-12 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition ${
                      filled ? "bg-gold/20 text-gold shadow-glow" : "bg-black/30 text-transparent"
                    } ${error ? "bg-red-500/20 text-red-400" : ""}`}
                  >
                    {filled ? "•" : ""}
                  </motion.div>
                );
              })}
            </div>

            {/* Error message */}
            <div className="h-6 mb-4">
              {error && (
                <span className="text-xs font-semibold text-red-400 animate-pulse">
                  ❌ Incorrect PIN! Please try again.
                </span>
              )}
            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDigit(num)}
                  className="glass hover:bg-gold/20 active:scale-95 rounded-2xl py-3.5 font-display text-xl font-semibold text-ivory border border-gold/30 shadow-glass transition flex items-center justify-center"
                >
                  {num}
                </button>
              ))}

              <button
                onClick={handleClear}
                className="glass hover:bg-red-500/20 active:scale-95 rounded-2xl py-3.5 font-display text-xs font-semibold text-slate-400 border border-slate-700 transition flex items-center justify-center"
              >
                Clear
              </button>

              <button
                onClick={() => handleDigit("0")}
                className="glass hover:bg-gold/20 active:scale-95 rounded-2xl py-3.5 font-display text-xl font-semibold text-ivory border border-gold/30 shadow-glass transition flex items-center justify-center"
              >
                0
              </button>

              <button
                onClick={handleBackspace}
                className="glass hover:bg-gold/20 active:scale-95 rounded-2xl py-3.5 font-display text-lg font-semibold text-gold border border-gold/30 shadow-glass transition flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="unlock-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-deep"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">✨🔓✨</div>
            <h2 className="font-display text-3xl font-bold italic text-gradient-gold">
              Welcome to Chapter 21!
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
