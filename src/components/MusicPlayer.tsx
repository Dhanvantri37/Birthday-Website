import { useEffect, useRef, useState } from "react";
import { config } from "../config";

export default function MusicPlayer({ started }: { started: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [usingSynth, setUsingSynth] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Play ambient soft piano chords via Web Audio API synthesizer
  const startPianoSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      setUsingSynth(true);

      // Relaxing soft piano chord progression (Cmaj7, Am9, Fmaj7, G6)
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 392.0],  // G6
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const currentChord = chords[chordIdx % chords.length];
        const now = ctx.currentTime;

        currentChord.forEach((freq, noteIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + noteIdx * 0.18);

          // Soft piano envelope
          const noteTime = now + noteIdx * 0.18;
          gain.gain.setValueAtTime(0.001, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.12 * volume, noteTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 3.4);
        });

        chordIdx++;
      };

      playChord();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      synthTimerRef.current = window.setInterval(playChord, 3800);
    } catch {
      setUsingSynth(false);
    }
  };

  const stopPianoSynth = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    setUsingSynth(false);
  };

  const togglePlay = () => {
    if (!started) return;
    if (playing) {
      setPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      stopPianoSynth();
    } else {
      setPlaying(true);
      if (audioRef.current && !customAudioUrl) {
        audioRef.current.play().catch(() => {
          // If mp3 fails, fallback to procedural ambient piano synth
          startPianoSynth();
        });
      } else if (audioRef.current && customAudioUrl) {
        audioRef.current.play().catch(() => startPianoSynth());
      } else {
        startPianoSynth();
      }
    }
  };

  useEffect(() => {
    if (started && !playing) {
      // Auto-start music when journey begins
      setPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => startPianoSynth());
      } else {
        startPianoSynth();
      }
    }
  }, [started]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopPianoSynth();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      stopPianoSynth();
      setPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }, 100);
    }
  };

  return (
    <div className="fixed left-4 top-4 z-50 flex items-center gap-3 md:left-6 md:top-6">
      <audio
        ref={audioRef}
        src={customAudioUrl || config.musicSrc}
        loop
        onError={() => {
          if (playing) startPianoSynth();
        }}
      />

      <button
        onClick={togglePlay}
        className="glass-gold flex h-12 w-12 items-center justify-center rounded-full text-gold shadow-glow-gold transition hover:scale-105"
        aria-label={playing ? "Pause music" : "Play music"}
        title={usingSynth ? "Playing Ambient Soft Piano" : "Playing Background Track"}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="3.5" height="12" rx="1" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2v12l10-6z" />
          </svg>
        )}
      </button>

      <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md">
        <span className="text-xs font-display text-gold/90 hidden sm:inline">
          {usingSynth ? "🎹 Soft Piano" : "🎵 Background Music"}
        </span>
        <button
          onClick={() => setShowVolume((v) => !v)}
          className="text-xs text-ivory/80 hover:text-gold transition px-2 py-1"
        >
          🔊
        </button>

        <label className="cursor-pointer text-xs text-gold/80 hover:text-gold transition px-2 py-1" title="Upload custom song">
          📂
          <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {showVolume && (
        <div className="glass rounded-full px-3 py-2 flex items-center">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1.5 w-20 accent-gold cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
