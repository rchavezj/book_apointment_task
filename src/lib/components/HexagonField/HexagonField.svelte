<script lang="ts">
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';
  import { type HexFieldOptions } from './type';
  import { createHexFieldEngine } from './engine';

  import { tick } from 'svelte';

  // ────────────────────────────────────────────────────────────────────────────
  // Props
  // ────────────────────────────────────────────────────────────────────────────
  let {
    columns = 35,
    rows = 35,
    baseScale = 0.98,
    minScale = 0.12,
    mouseRadiusDivisor = 2.6,
    colors = ['rgb(0,0,99)', 'rgb(200,50,200)', 'rgb(23,23,223)', 'rgb(80,80,235)'],
    animateJiggle = true,
    jiggleDurationSec = 2,
    jiggleScaleRange = [0.65, 0.85] as [number, number],
    jiggleEase = 'power1.inOut',
    fullScreenFixed = true,
    wrapperClass = '',
    wrapperStyle = '',
    canvasClass = '',
    canvasStyle = '',
    background = 'transparent',
    pixelRatio = 1,
    jiggleRecolor = true,
    colorTransitionSec = 0.6,
    colorEase = 'power2.inOut',

    children
  }: {
    columns?: number;
    rows?: number;
    baseScale?: number;
    minScale?: number;
    mouseRadiusDivisor?: number;
    colors?: string[];
    animateJiggle?: boolean;
    jiggleDurationSec?: number;
    jiggleScaleRange?: [number, number];
    jiggleEase?: string;
    fullScreenFixed?: boolean;
    wrapperClass?: string;
    wrapperStyle?: string;
    canvasClass?: string;
    canvasStyle?: string;
    background?: string;
    pixelRatio?: number;
    jiggleRecolor?: boolean;

    // NEW ↓↓↓
    colorTransitionSec?: number;
    colorEase?: string;

    children?: Snippet;
  } = $props();



  let canvas: HTMLCanvasElement | null = null;
  let engine = createHexFieldEngine({
    columns, 
    rows,
    baseScale, 
    minScale,
    mouseRadiusDivisor,
    colors,
    animateJiggle, 
    jiggleDurationSec, 
    jiggleScaleRange, 
    jiggleEase,
    jiggleRecolor,
    pixelRatio,
    colorTransitionSec,
    colorEase
  } satisfies HexFieldOptions);

  $effect(() => {
    if (!browser || !canvas) return;

    let cancelled = false;

    (async () => {
      // ensure DOM is in place
      await tick();

      // wait for fonts (prevents reflow when fonts swap in)
      // safe even if not supported
      try { // @ts-ignore
        if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
      } catch {}

      // wait until full page load if we’re still loading
      if (document.readyState !== 'complete') {
        await new Promise((r) => window.addEventListener('load', r, { once: true }));
      }

      // one frame to let CSS apply
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      if (cancelled) return;

      engine.attach(canvas, { pixelRatio: Math.max(1, window.devicePixelRatio || 1) });
      engine.start();
    })();

    return () => { cancelled = true; engine.destroy(); };
  });


  // keep reactive updates equivalent to your previous $effects
  $effect(() => {
    engine.updateOptions({ columns, rows, mouseRadiusDivisor, pixelRatio });
  });
  $effect(() => {
    engine.updateOptions({ colors });
  });
</script>

<!-- ────────────────────────────────────────────────────────────────────────── -->
<!-- BACKGROUND (fixed; behind everything; no pointer events)                   -->
<!-- ────────────────────────────────────────────────────────────────────────── -->
<div
  class={`hex-bg ${wrapperClass ?? ''}`}
  style={`${
    fullScreenFixed ? 'position:fixed;inset:0;display:grid;place-items:center;' : ''
  }${background ? `background:${background};` : ''}${wrapperStyle ?? ''}`}
  aria-hidden="true"
>
  <canvas
    bind:this={canvas}
    id="hexagon-field"
    class={canvasClass}
    style={`${
      fullScreenFixed
        ? 'position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);'
        : ''
    }${canvasStyle ?? ''}`}
  ></canvas>
</div>

<!-- ────────────────────────────────────────────────────────────────────────── -->
<!-- FOREGROUND (normal flow; above bg)                                         -->
<!-- ────────────────────────────────────────────────────────────────────────── -->
{#if children}
  <div class="hex-content">
    {@render children()}
  </div>
{/if}

<style>
  /* Foreground layer sits above */
  .hex-content {
    position: relative;
    z-index: 1;
  }
</style>
