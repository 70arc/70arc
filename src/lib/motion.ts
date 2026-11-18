import type { CSSProperties } from "react";

export const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

export const duration = {
  micro: 150,
  ui: 250,
  reveal: 800,
  scene: 1200,
  drop: 200,
  page: 300,
} as const;

export const stagger = 80;

/** Large-text AA floor. 30% ink on sunken is about 1.94:1. */
export const wordFloor = 0.5;

export const motionVars = {
  "--ease": ease,
  "--ease-float": "ease-in-out",
  "--dur-micro": `${duration.micro}ms`,
  "--dur-ui": `${duration.ui}ms`,
  "--dur-reveal": `${duration.reveal}ms`,
  "--dur-scene": `${duration.scene}ms`,
  "--dur-drop": `${duration.drop}ms`,
  "--dur-page": `${duration.page}ms`,
  "--stagger": `${stagger}ms`,
  "--rise": "24px",
  "--rise-hero": "28px",
  "--float": "6px",
  "--float-duration": "8s",
  "--lift": "8px",
  "--drift": "12px",
  "--drift-duration": "6s",
  "--word-floor": String(wordFloor),
} as CSSProperties;
