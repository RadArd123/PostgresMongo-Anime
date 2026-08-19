import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
}

interface MousePosition {
  realX: number;
  realY: number;
}

const mouse: MousePosition = {
  realX: 0,
  realY: 0,
};

export default function SakuraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.realX = e.clientX;
      mouse.realY = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const petals: Petal[] = [];
    for (let i = 0; i < 120; i++) {
      petals.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        velocity: Math.random() * 1.5 + 0.5,
        sway: Math.random() * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    const drawPetals = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal) => {
        petal.y = petal.y + petal.velocity;
        petal.x = petal.x + Math.sin(petal.swayOffset) * petal.sway;
        petal.swayOffset += petal.swaySpeed;

        if (petal.y > window.innerHeight) {
          petal.y = -10;
          petal.x = Math.random() * window.innerWidth;
        }

        const dx = mouse.realX - petal.x;
        const dy = mouse.realY - petal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const influenceRadius = 150;
        let pushX = 0;
        let pushY = 0;

        if (distance < influenceRadius) {
          const force = (influenceRadius - distance) / influenceRadius;
          pushX = -dx * force * 0.5;
          pushY = -dy * force * 0.5;
        }

        ctx.beginPath();
        // A simple petal shape using ellipse
        ctx.ellipse(
          petal.x + pushX, 
          petal.y + pushY, 
          petal.size * 1.5, 
          petal.size, 
          Math.sin(petal.swayOffset), 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 183, 197, ${petal.opacity})`; // Sakura pink
        ctx.fill();
      });
    };

    const animate = () => {
      drawPetals();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block pointer-events-none"
    />
  );
}
