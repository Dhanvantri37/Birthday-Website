import { useEffect, useRef } from "react";

interface Props {
  mode?: "night" | "day" | "gold-glow" | "cosmic";
  intensity?: number;
}

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  color: string;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
};

export default function AmbientBackground({ mode = "cosmic", intensity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = (canvas.width = window.innerWidth * devicePixelRatio);
    let h = (canvas.height = window.innerHeight * devicePixelRatio);

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
    };
    window.addEventListener("resize", resize);

    const starCount = Math.round(180 * intensity);
    const starColors = ["#E5C158", "#F8FAFC", "#60A5FA", "#E4DBFF", "#FBE697"];

    const stars: Star[] = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (0.5 + Math.random() * 2) * devicePixelRatio,
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.035,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    const shootingStars: ShootingStar[] = Array.from({ length: 3 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * (h * 0.5),
      length: (60 + Math.random() * 80) * devicePixelRatio,
      speed: (12 + Math.random() * 10) * devicePixelRatio,
      opacity: 0,
      angle: Math.PI / 4,
      active: false,
    }));

    let frame = 0;

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle background glowing nebulae
      const grad1 = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, w * 0.5);
      grad1.addColorStop(0, "rgba(29, 78, 216, 0.12)");
      grad1.addColorStop(1, "rgba(5, 8, 20, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const grad2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.4);
      grad2.addColorStop(0, "rgba(229, 193, 88, 0.08)");
      grad2.addColorStop(1, "rgba(5, 8, 20, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // Draw twinkling stars
      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(frame * s.speed + s.phase);
        ctx.save();
        ctx.globalAlpha = twinkle * 0.95;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = s.r * 4;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Spawn and draw shooting stars occasionally
      if (!reduceMotion && frame % 180 === 0) {
        const s = shootingStars.find((st) => !st.active);
        if (s) {
          s.x = Math.random() * w;
          s.y = Math.random() * (h * 0.4);
          s.opacity = 1;
          s.active = true;
        }
      }

      shootingStars.forEach((s) => {
        if (!s.active) return;
        ctx.save();
        ctx.globalAlpha = s.opacity;
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, "#E5C158");
        grad.addColorStop(0.5, "#F8FAFC");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.015;

        if (s.opacity <= 0 || s.x > w || s.y > h) {
          s.active = false;
        }
      });

      frame++;
      if (!reduceMotion) rafRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full z-0"
      aria-hidden="true"
    />
  );
}
