"use client";

import { useEffect, useRef } from "react";

type ParticleCloudProps = {
  className?: string;
};

type Particle = {
  angle: number;
  radius: number;
  depth: number;
  size: number;
  drift: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type PointerPosition = {
  x: number;
  y: number;
  active: boolean;
};

const DARK_PALETTE = [
  [96, 165, 250],
  [56, 189, 248],
  [148, 163, 184],
  [245, 158, 11],
] as const;

const LIGHT_PALETTE = [
  [30, 64, 175],
  [2, 132, 199],
  [71, 85, 105],
  [180, 83, 9],
] as const;

export function ParticleCloud({ className = "" }: ParticleCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: PointerPosition = { x: 0, y: 0, active: false };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let isLightTheme = document.documentElement.classList.contains("light");

    const createParticles = () => {
      const shortestSide = Math.min(width, height);
      const count = Math.min(560, Math.max(280, Math.round(shortestSide * 1.45)));
      const cloudRadius = shortestSide * 0.43;

      particles = Array.from({ length: count }, (_, index) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = cloudRadius * Math.pow(Math.random(), 0.78);
        const depth = Math.random();
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius * 0.92;

        return {
          angle,
          radius,
          depth,
          size: 0.55 + depth * 1.05,
          drift: 0.72 + (index % 11) * 0.025,
          x,
          y,
          vx: 0,
          vy: 0,
        };
      });
    };

    const draw = (time: number, animate: boolean) => {
      context.clearRect(0, 0, width, height);

      const palette = isLightTheme ? LIGHT_PALETTE : DARK_PALETTE;
      const centerX = width / 2;
      const centerY = height / 2;
      const rotation = animate ? time * 0.000055 : 0;
      const repelRadius = Math.min(width, height) * 0.24;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const particleAngle = particle.angle + rotation * particle.drift;
        const targetX = centerX + Math.cos(particleAngle) * particle.radius;
        const targetY = centerY + Math.sin(particleAngle) * particle.radius * 0.92;

        if (animate) {
          particle.vx += (targetX - particle.x) * 0.018;
          particle.vy += (targetY - particle.y) * 0.018;

          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;

            if (distance < repelRadius) {
              const force = Math.pow(1 - distance / repelRadius, 1.65) * 1.9;
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;
            }
          }

          particle.vx *= 0.88;
          particle.vy *= 0.88;
          particle.x += particle.vx;
          particle.y += particle.vy;
        } else {
          particle.x = targetX;
          particle.y = targetY;
        }

        const color = palette[index % palette.length];
        const edgeRatio = particle.radius / (Math.min(width, height) * 0.43);
        const edgeFade = Math.max(0.15, 1 - Math.pow(edgeRatio, 2.25));
        const alphaBase = isLightTheme ? 0.24 : 0.34;
        const alpha = alphaBase * (0.45 + particle.depth * 0.55) * (0.55 + edgeFade * 0.45);

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        context.fill();
      }
    };

    const shouldAnimate = () =>
      isVisible && isDocumentVisible && !reduceMotion.matches && width > 0 && height > 0;

    const animate = (time: number) => {
      draw(time, true);
      frameId = shouldAnimate() ? window.requestAnimationFrame(animate) : 0;
    };

    const syncAnimation = () => {
      if (shouldAnimate()) {
        if (!frameId) frameId = window.requestAnimationFrame(animate);
      } else {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        if (width > 0 && height > 0) draw(0, false);
      }
    };

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
      draw(0, false);
      syncAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const margin = Math.min(bounds.width, bounds.height) * 0.12;

      pointer.x = x;
      pointer.y = y;
      pointer.active =
        x >= -margin && x <= bounds.width + margin && y >= -margin && y <= bounds.height + margin;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      syncAnimation();
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncAnimation();
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      isLightTheme = document.documentElement.classList.contains("light");
      draw(0, !reduceMotion.matches);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reduceMotion.addEventListener("change", syncAnimation);
    resizeCanvas();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reduceMotion.removeEventListener("change", syncAnimation);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{
        WebkitMaskImage: "radial-gradient(circle, black 38%, transparent 76%)",
        maskImage: "radial-gradient(circle, black 38%, transparent 76%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
