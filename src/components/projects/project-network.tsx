"use client";

import { useEffect, useRef } from "react";

type ProjectNetworkProps = {
  className?: string;
};

type NetworkNode = {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  cluster: number;
  major: boolean;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const PROJECT_COLORS = [
  [59, 130, 246],
  [249, 115, 22],
  [168, 85, 247],
] as const;

const MAJOR_POSITIONS = [
  [0.28, 0.34],
  [0.7, 0.3],
  [0.54, 0.7],
] as const;

export function ProjectNetwork({ className = "" }: ProjectNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: PointerState = { x: 0, y: 0, active: false };
    let nodes: NetworkNode[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let isLightTheme = document.documentElement.classList.contains("light");

    const createNodes = () => {
      if (!width || !height) return;

      const majorNodes = MAJOR_POSITIONS.map(([xRatio, yRatio], cluster) => {
        const x = width * xRatio;
        const y = height * yRatio;

        return {
          anchorX: x,
          anchorY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 4.2,
          phase: cluster * 2.1,
          cluster,
          major: true,
        };
      });

      const satelliteCount = Math.min(72, Math.max(48, Math.round(width * 0.16)));
      const satellites = Array.from({ length: satelliteCount }, (_, index) => {
        const cluster = index % MAJOR_POSITIONS.length;
        const [centerX, centerY] = MAJOR_POSITIONS[cluster];
        const angle = Math.random() * Math.PI * 2;
        const distance = 28 + Math.pow(Math.random(), 0.7) * Math.min(width, height) * 0.3;
        const anchorX = Math.min(width - 12, Math.max(12, width * centerX + Math.cos(angle) * distance));
        const anchorY = Math.min(height - 12, Math.max(12, height * centerY + Math.sin(angle) * distance * 0.72));

        return {
          anchorX,
          anchorY,
          x: anchorX,
          y: anchorY,
          vx: 0,
          vy: 0,
          radius: 0.8 + Math.random() * 1.05,
          phase: Math.random() * Math.PI * 2,
          cluster,
          major: false,
        };
      });

      nodes = [...majorNodes, ...satellites];
    };

    const draw = (time: number, animate: boolean) => {
      context.clearRect(0, 0, width, height);

      const connectionDistance = Math.min(width, height) * 0.225;
      const pointerRadius = Math.min(width, height) * 0.31;
      const lineColor = isLightTheme ? [51, 65, 85] : [148, 163, 184];

      for (const node of nodes) {
        if (!animate) {
          node.x = node.anchorX;
          node.y = node.anchorY;
          continue;
        }

        const driftX = Math.cos(time * 0.00032 + node.phase) * (node.major ? 2.3 : 4.2);
        const driftY = Math.sin(time * 0.00027 + node.phase) * (node.major ? 2 : 3.7);
        const targetX = node.anchorX + driftX;
        const targetY = node.anchorY + driftY;

        node.vx += (targetX - node.x) * (node.major ? 0.012 : 0.017);
        node.vy += (targetY - node.y) * (node.major ? 0.012 : 0.017);

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < pointerRadius) {
            const pull = Math.pow(1 - distance / pointerRadius, 2) * (node.major ? 0.035 : 0.085);
            node.vx += (dx / distance) * pull;
            node.vy += (dy / distance) * pull;
          }
        }

        node.vx *= 0.92;
        node.vy *= 0.92;
        node.x += node.vx;
        node.y += node.vy;
      }

      for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
        const first = nodes[firstIndex];

        for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
          const second = nodes[secondIndex];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.hypot(dx, dy);

          if (distance > connectionDistance) continue;

          const sameCluster = first.cluster === second.cluster;
          const strength = 1 - distance / connectionDistance;
          const alpha = strength * (sameCluster ? 0.2 : 0.075) * (isLightTheme ? 0.72 : 1);

          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(${lineColor[0]}, ${lineColor[1]}, ${lineColor[2]}, ${alpha})`;
          context.lineWidth = sameCluster ? 0.65 : 0.45;
          context.stroke();
        }
      }

      if (pointer.active) {
        for (const node of nodes) {
          const distance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (distance > pointerRadius * 0.72) continue;

          const alpha = (1 - distance / (pointerRadius * 0.72)) * (isLightTheme ? 0.12 : 0.17);
          const color = PROJECT_COLORS[node.cluster];
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(node.x, node.y);
          context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }

      for (const node of nodes) {
        const color = PROJECT_COLORS[node.cluster];
        const alpha = node.major ? (isLightTheme ? 0.95 : 1) : isLightTheme ? 0.48 : 0.68;

        context.save();
        if (node.major) {
          context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.65)`;
          context.shadowBlur = 16;
        }
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        context.fill();
        context.restore();

        if (node.major) {
          context.beginPath();
          context.arc(node.x, node.y, node.radius + 5.5, 0, Math.PI * 2);
          context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${isLightTheme ? 0.18 : 0.28})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    };

    const shouldAnimate = () =>
      isVisible && isDocumentVisible && !reducedMotion.matches && width > 0 && height > 0;

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
        if (width && height) draw(0, false);
      }
    };

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
      draw(0, false);
      syncAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const margin = Math.min(bounds.width, bounds.height) * 0.1;
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
      draw(0, !reducedMotion.matches);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", syncAnimation);
    resizeCanvas();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", syncAnimation);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{
        WebkitMaskImage: "radial-gradient(ellipse, black 42%, transparent 82%)",
        maskImage: "radial-gradient(ellipse, black 42%, transparent 82%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
