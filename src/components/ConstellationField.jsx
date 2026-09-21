// The one deliberate motion moment on the site: a soft field of drifting
// points behind the hero, faint lines drawn between near neighbours. Reads
// as "astronomical" without literally rendering a starfield-on-black cliché -
// it sits in the light palette and moves at a pace closer to "atmospheric"
// than "cosmic". Freezes entirely under prefers-reduced-motion.
//
// Flicker tuning knobs (adjust these to taste):
//   FLICKER_CHANCE     – fraction of stars that flicker (0 = none, 1 = all)
//   FLICKER_SPEED      – how many full cycles per second (higher = faster)
//   FLICKER_INTENSITY  – how deep the dip goes; 0 = fully transparent at trough,
//                        1 = no visible flicker (opacity stays at BASE_ALPHA)
//   BASE_ALPHA         – resting opacity for every star

import { useEffect, useRef } from "react";

const POINT_COUNT = 46;
const LINK_DISTANCE = 120;
const COLORS = ["#D8579C", "#EEBCDC", "#5F7AC5"];

const BASE_ALPHA = 0.8;        // base star opacity
const FLICKER_CHANCE = 0.6;    // 60 % of stars flicker
const FLICKER_SPEED = 0.8;     // cycles per second
const FLICKER_INTENSITY = 0.4; // opacity floor = BASE_ALPHA * FLICKER_INTENSITY

export function ConstellationField({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let points = [];
    let frame;
    let startTime = null;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const count = Math.min(POINT_COUNT, Math.floor((width * height) / 14000));
      points = Array.from({ length: count }, () => {
        const flickers = Math.random() < FLICKER_CHANCE;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.6 + 0.6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          // Flicker: each flickering star gets its own random phase and a slight
          // frequency jitter so they never pulse in unison.
          flickers,
          flickerPhase: Math.random() * Math.PI * 2,
          flickerFreq: FLICKER_SPEED * (0.7 + Math.random() * 0.6),
        };
      });
    }

    function step(ts) {
      if (startTime === null) startTime = ts;
      const elapsed = (ts - startTime) / 1000; // seconds

      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(216, 87, 156, ${0.5 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of points) {
        let alpha = BASE_ALPHA;
        if (!reduceMotion && p.flickers) {
          // Sine oscillates in [-1, 1]; remap to [FLICKER_INTENSITY, 1].
          const sine = Math.sin(elapsed * p.flickerFreq * Math.PI * 2 + p.flickerPhase);
          const t = (sine + 1) / 2; // → [0, 1]
          alpha = BASE_ALPHA * (FLICKER_INTENSITY + (1 - FLICKER_INTENSITY) * t);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!reduceMotion) frame = requestAnimationFrame(step);
    }

    // Browsers already throttle rAF in background tabs, but that's implicit
    // and inconsistent across engines. Make it explicit: cancel the frame
    // loop on hide and restart cleanly on show, resetting startTime so the
    // elapsed-time-based flicker doesn't jump on resume.
    function handleVisibility() {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
      } else {
        startTime = null;
        frame = requestAnimationFrame(step);
      }
    }

    resize();
    frame = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
