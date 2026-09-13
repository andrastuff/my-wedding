"use client";

import { useEffect, useRef } from "react";

const flowerSymbols = ["✿", "❀", "❁", "✾"];
const flowerColors = ["#c9a85f", "#8f3e4a", "#d6b873", "#758876"];

export function TouchFlowerTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!coarsePointer.matches || reducedMotion.matches) return;

    let previousX: number | null = null;
    let previousY: number | null = null;
    let hasEmittedForGesture = false;

    const createFlower = (x: number, y: number) => {
      const layer = layerRef.current;
      if (!layer || layer.childElementCount >= 128) return;

      const flower = document.createElement("span");
      const size = 14 + Math.random() * 12;
      flower.className = "touch-flower";
      flower.textContent = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
      flower.style.left = `${x}px`;
      flower.style.top = `${y}px`;
      flower.style.fontSize = `${size}px`;
      flower.style.color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      flower.style.setProperty("--flower-drift-x", `${(Math.random() - .5) * 90}px`);
      flower.style.setProperty("--flower-drift-y", `${-70 - Math.random() * 65}px`);
      flower.style.setProperty("--flower-rotation", `${(Math.random() - .5) * 120}deg`);
      flower.style.setProperty("--flower-scale", `${.8 + Math.random() * .55}`);
      flower.addEventListener("animationend", () => flower.remove(), { once: true });
      layer.appendChild(flower);
    };

    const createFlowerBurst = (x: number, y: number) => {
      for (let index = 0; index < 8; index += 1) {
        createFlower(x, y);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      previousX = touch.clientX;
      previousY = touch.clientY;
      hasEmittedForGesture = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || previousX === null || previousY === null || hasEmittedForGesture) return;

      const distanceX = touch.clientX - previousX;
      const distanceY = touch.clientY - previousY;

      if (Math.abs(distanceY) >= 12 && Math.abs(distanceY) > Math.abs(distanceX)) {
        createFlowerBurst(touch.clientX, touch.clientY);
        hasEmittedForGesture = true;
      }
    };

    const resetTouch = () => {
      previousX = null;
      previousY = null;
      hasEmittedForGesture = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetTouch, { passive: true });
    window.addEventListener("touchcancel", resetTouch, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetTouch);
      window.removeEventListener("touchcancel", resetTouch);
    };
  }, []);

  return <div ref={layerRef} className="touch-flower-layer" aria-hidden="true" />;
}
