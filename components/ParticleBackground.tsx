"use client";

import { useEffect, useRef } from "react";

export type ParticleBackgroundProps = {
  count?: number;
  /** Multiplier for the drift velocity; 1 is roughly 3–9 pixels/second. */
  speed?: number;
  color?: string;
  maxOpacity?: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  velocity: number;
  phase: number;
  rightSide: boolean;
  sprite: HTMLCanvasElement;
};

export default function ParticleBackground({
  count = 70,
  speed = 1,
  color = "#2FBF8F",
  maxOpacity = 0.6,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const amount = Math.min(
      1000,
      Math.max(0, Math.round(Number.isFinite(count) ? count : 70)),
    );
    const drift = Math.max(0, Number.isFinite(speed) ? speed : 1);
    const opacityLimit = Math.min(
      1,
      Math.max(0, Number.isFinite(maxOpacity) ? maxOpacity : 0.6),
    );
    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let lastTime: number | null = null;
    let particles: Particle[] = [];

    // Cache soft bokeh sprites at backing-store resolution instead of creating
    // gradients for every particle on every animation frame.
    function createSprite(radius: number, ratio: number) {
      const sprite = document.createElement("canvas");
      const size = radius * 8;
      sprite.width = sprite.height = Math.ceil(size * ratio);
      const brush = sprite.getContext("2d");
      if (!brush) return sprite;
      const middle = sprite.width / 2;
      const glow = brush.createRadialGradient(
        middle,
        middle,
        0,
        middle,
        middle,
        middle,
      );
      brush.fillStyle = color;
      const resolvedColor = brush.fillStyle;
      glow.addColorStop(0, resolvedColor);
      glow.addColorStop(radius > 1.6 ? 0.15 : 0.3, resolvedColor);
      glow.addColorStop(1, "transparent");
      brush.fillStyle = glow;
      brush.fillRect(0, 0, sprite.width, sprite.height);
      return sprite;
    }

    function draw() {
      context!.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const size = particle.radius * 8;
        // Fade the wrapping margins so particles never pop at an edge.
        const right = particle.rightSide ? width : width * 0.4;
        const edge = Math.min(
          particle.x - (particle.rightSide ? width * 0.4 : 0),
          right - particle.x,
          particle.y,
          height - particle.y,
        );
        context!.globalAlpha =
          particle.opacity * Math.min(1, Math.max(0, edge / 35));
        context!.drawImage(
          particle.sprite,
          particle.x - size / 2,
          particle.y - size / 2,
          size,
          size,
        );
      }
      context!.globalAlpha = 1;
    }

    function resize() {
      const previousWidth = width;
      const previousHeight = height;
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (particles.length) {
        for (const particle of particles) {
          particle.x *= width / previousWidth;
          particle.y *= height / previousHeight;
          particle.sprite = createSprite(particle.radius, ratio);
        }
      } else {
        particles = Array.from({ length: amount }, (_, index) => {
          const rightSide = index < Math.round(amount * 0.85);
          const radius = 0.5 + Math.random() * 2;
          return {
            rightSide,
            x:
              width *
              (rightSide ? 0.4 + Math.random() * 0.6 : Math.random() * 0.4),
            y: Math.random() * height,
            radius,
            opacity:
              Math.min(0.1, opacityLimit) +
              Math.random() * Math.max(0, opacityLimit - 0.1),
            velocity: 3 + Math.random() * 6,
            phase: Math.random() * Math.PI * 2,
            sprite: createSprite(radius, ratio),
          };
        });
      }
      draw();
    }

    function animate(time: number) {
      frame = null;
      const elapsed =
        lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      for (const particle of particles) {
        particle.phase += elapsed * 0.35 * drift;
        particle.x += particle.velocity * elapsed * drift;
        particle.y +=
          (-particle.velocity * 0.2 + Math.sin(particle.phase) * 0.7) *
          elapsed *
          drift;
        const left = particle.rightSide ? width * 0.4 : 0;
        const right = particle.rightSide ? width : width * 0.4;
        if (particle.x > right) particle.x = left;
        if (particle.y < 0) particle.y = height;
      }
      draw();
      frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
      if (!document.hidden && !motion.matches && drift > 0 && amount > 0) {
        frame = requestAnimationFrame(animate);
      } else if (!document.hidden) {
        draw();
      }
    }

    resize();
    syncAnimation();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncAnimation);
    motion.addEventListener("change", syncAnimation);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncAnimation);
      motion.removeEventListener("change", syncAnimation);
    };
  }, [count, speed, color, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 75% 45%, #10231C 0%, #0A0D0C 65%)",
      }}
    />
  );
}
