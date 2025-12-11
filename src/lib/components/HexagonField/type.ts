/** Public options mirrored from the Svelte props (only what's needed here). */
export type HexFieldOptions = {
  columns: number;
  rows: number;

  baseScale: number;
  minScale: number;

  /** Mouse influence radius factor: maxViewport / mouseRadiusDivisor. */
  mouseRadiusDivisor: number;

  /** Fill colors to randomly assign to shapes. */
  colors: string[];

  /** Gentle per-shape “breathing/jiggle” animation. */
  animateJiggle: boolean;
  jiggleDurationSec: number;
  jiggleScaleRange: [number, number];
  jiggleEase: string;

  /** If true, re-randomize color on jiggle repeat. */
  jiggleRecolor: boolean;

  /** Pixel ratio multiplier (1 to ignore HiDPI). */
  pixelRatio: number;

  colorTransitionSec?: number;  // default 0.6
  colorEase?: string;           // default 'power2.inOut'
};

export type PartialHexFieldOptions = Partial<HexFieldOptions>;

export type Shape = {
  x: number;
  y: number;
  size: number;
  scale: number;   // tweened by pointer distance
  scale2: number;  // jiggle multiplier
  row: number;
  col: number;
  color: string;

  // for animated color transitions:
  colorFrom?: string;
  colorTo?: string;
  colorProg?: number;                 // 0 → 1
  colorInterp?: (t: number) => string;
};

export type Mouse = { x: number; y: number; r: number };