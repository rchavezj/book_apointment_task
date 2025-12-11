// src/lib/components/HexagonField/engine.ts
import { gsap } from 'gsap';

import type { 
     Shape, 
     Mouse, 
     HexFieldOptions, 
     PartialHexFieldOptions 
} from './type';

function randFrom<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0];
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  const angle = Math.PI / 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = i * angle;
    const px = x + size * Math.cos(a);
    const py = y + size * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** Create a reusable engine instance bound to a <canvas>. */
export function createHexFieldEngine(userOptions: HexFieldOptions) {
  // Canvas & drawing
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;

  // Geometry/data
  const shapes: Shape[] = [];
  let hexagonCount = 0;
  let canvasRect: DOMRect | null = null;
  let maxViewport = 1024; // safe default for SSR

  // Mouse proxy (animated via gsap)
  const mouse: Mouse = { x: 0, y: 0, r: 0 };

  // Options (mutable via updateOptions)
  let opt: HexFieldOptions = { ...userOptions };

  // Render loop hook
  const render = () => {
    if (!canvas || !ctx) return;

    const logicalW = canvas.width / opt.pixelRatio;
    const logicalH = canvas.height / opt.pixelRatio;
    ctx.clearRect(0, 0, logicalW, logicalH);

    for (let i = 0; i < hexagonCount; i++) {
      const s = shapes[i];
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.hypot(dx, dy);

      const targetScale =
        dist <= mouse.r
          ? Math.min(opt.baseScale, 1 + (opt.minScale - 1) * (1 - dist / mouse.r))
          : opt.baseScale;

      gsap.to(
        s, { 
          duration: 3, 
          ease: 'power3', 
          overwrite: false, 
          scale: targetScale 
        }
      );

      // ✨ NEW: pick current frame color (animated if a transition is active)
      const fill = s.colorInterp ? s.colorInterp(s.colorProg ?? 0) : s.color;

      drawHexagon(
        ctx,
        s.x,
        s.y,
        s.size * s.scale * s.scale2,
        fill
      );
    }
  };


  function recolor(s: Shape) {
    const next = opt.colors[(Math.random() * opt.colors.length) | 0];
    const current = s.colorInterp ? s.colorInterp(s.colorProg ?? 1) : s.color;

    if (next === current) return; // nothing to do

    s.colorFrom = current;
    s.colorTo = next;
    s.colorInterp = gsap.utils.interpolate(current, next);
    s.colorProg = 0;

    gsap.to(s, {
      colorProg: 1,
      duration: opt.colorTransitionSec ?? 0.6,
      ease: opt.colorEase ?? 'power2.inOut',
      onComplete() {
        // lock in and clean up
        s.color = next;
        s.colorFrom = s.colorTo = undefined;
        s.colorInterp = undefined;
        s.colorProg = undefined;
      }
    });
  }

  // Size/grid building
  function setupCanvasSizeAndGrid() {
    if (!canvas || !ctx) return;

    maxViewport = Math.max(window.innerWidth, window.innerHeight);
    const logicalSize = maxViewport; // centered square canvas

    // HiDPI-aware sizing
    canvas.width = Math.floor(logicalSize * opt.pixelRatio);
    canvas.height = Math.floor(logicalSize * opt.pixelRatio);

    // CSS pixel size (keeps canvas visually the same)
    canvas.style.width = `${logicalSize}px`;
    canvas.style.height = `${logicalSize}px`;

    ctx.setTransform(opt.pixelRatio, 0, 0, opt.pixelRatio, 0, 0);

    canvasRect = canvas.getBoundingClientRect();

    // Mouse radius scales with viewport
    mouse.r = maxViewport / opt.mouseRadiusDivisor;

    // Grid geometry
    const total = opt.rows * opt.columns;
    hexagonCount = total;

    const hexagonSize = maxViewport / (opt.columns + 1);
    const verticalSpacing = hexagonSize / Math.tan(Math.PI / 6);

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / opt.columns);
      const col = i % opt.columns;

      const x = col * hexagonSize * 1.5 + hexagonSize * 0.5; // center offset
      const y = row * verticalSpacing + (col % 2) * (verticalSpacing / 2) + hexagonSize * 0.5;

      if (i >= shapes.length) {
        const s: Shape = {
          x,
          y,
          size: hexagonSize,
          scale: opt.baseScale,
          scale2: 1,
          row,
          col,
          color: randFrom(opt.colors)
        };
        shapes.push(s);

        if (opt.animateJiggle) {
          gsap
            .to(s, {
              duration: opt.jiggleDurationSec,
              // random per-repeat amplitude
              scale2: () =>
                gsap.utils.random(opt.jiggleScaleRange[0], opt.jiggleScaleRange[1], 0.001),
              onRepeat: opt.jiggleRecolor ? () => recolor(s) : undefined,
              repeat: -1,
              repeatRefresh: true,
              yoyo: true,
              ease: opt.jiggleEase
            })
            // desync so it feels organic
            .seek(Math.random() * 99);
        }
      } else {
        const s = shapes[i];
        s.x = x;
        s.y = y;
        s.size = hexagonSize;
      }
    }

    // Trim if the grid shrank
    if (shapes.length > total) {
      // Kill tweens for trimmed shapes to avoid leaks
      for (let i = total; i < shapes.length; i++) gsap.killTweensOf(shapes[i]);
      shapes.length = total;
    }

    // Reset mouse to center of logical canvas
    mouse.x = logicalSize / 2;
    mouse.y = logicalSize / 2;
  }

  // Pointer mapping (viewport -> canvas local)
  function handlePointerMove(e: PointerEvent) {
    if (!canvasRect) return;
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    gsap.to(mouse, { x, y, duration: 0.25, ease: 'power2.out' });
  }

  function handlePointerLeave() {
    const logicalSize = Math.max(window.innerWidth, window.innerHeight);
    gsap.to(mouse, { x: logicalSize / 2, y: logicalSize / 2, duration: 0.5, ease: 'power2.out' });
  }

  function handleResize() {
    const newMax = Math.max(window.innerWidth, window.innerHeight);
    if (!canvas) return;

    if (canvas.style.width !== `${newMax}px`) {
      setupCanvasSizeAndGrid();
    } else {
      canvasRect = canvas.getBoundingClientRect();
      mouse.r = newMax / opt.mouseRadiusDivisor;
    }
  }

  // Public API
  return {
    /** Bind the engine to a canvas and initialize context. */
    attach(el: HTMLCanvasElement, options?: PartialHexFieldOptions) {
      canvas = el;
      if (options) this.updateOptions(options);

      const context = canvas.getContext('2d', { alpha: true });
      if (!context) {
        console.warn('HexFieldEngine: 2D context unavailable.');
        return;
      }
      ctx = context;

      // Compute default pixel ratio if caller passed <= 0 or 1
      if (!opt.pixelRatio || opt.pixelRatio < 1) {
        opt.pixelRatio = Math.max(1, window.devicePixelRatio || 1);
      }

      setupCanvasSizeAndGrid();
    },

    /** Start animation and global listeners. */
    start() {
      if (!canvas || !ctx) return;

      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

      gsap.ticker.add(render);
    },

    /** Stop animation and remove listeners (keeps current canvas). */
    stop() {
      gsap.ticker.remove(render);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    },

    /** Update one or more options. Triggers resize/rebuild when geometry-affecting values change. */
    updateOptions(next: PartialHexFieldOptions) {
      const prev = opt;
      opt = { ...opt, ...next };

      // If geometry-affecting properties changed, rebuild grid
      const geometryChanged =
        next.columns !== undefined ||
        next.rows !== undefined ||
        next.mouseRadiusDivisor !== undefined ||
        next.pixelRatio !== undefined;

      if (geometryChanged && canvas && ctx) {
        setupCanvasSizeAndGrid();
      }

      // If colors changed and jiggle recolor is enabled, future jiggles will pick from new palette.
      if (next.colors && opt.animateJiggle && opt.jiggleRecolor) {
        // no hard reset needed; palette swap happens on next onRepeat
      }

      // If animateJiggle toggled, rebuild tweens for shapes
      if (next.animateJiggle !== undefined && next.animateJiggle !== prev.animateJiggle) {
        // Kill any existing jiggle tweens
        shapes.forEach((s) => gsap.killTweensOf(s));
        // Recreate if enabled
        if (opt.animateJiggle) {
          for (const s of shapes) {
            gsap
              .to(s, {
                duration: opt.jiggleDurationSec,
                scale2: () =>
                  gsap.utils.random(opt.jiggleScaleRange[0], opt.jiggleScaleRange[1], 0.001),
                onRepeat: opt.jiggleRecolor ? () => recolor(s) : undefined,
                repeat: -1,
                repeatRefresh: true,
                yoyo: true,
                ease: opt.jiggleEase
              })
              .seek(Math.random() * 99);
          }
        } else {
          // Reset scale2 when jiggle is disabled
          for (const s of shapes) s.scale2 = 1;
        }
      }
    },

    /** Fully destroy: stop, kill tweens, and clear refs. */
    destroy() {
      this.stop();
      shapes.forEach((s) => gsap.killTweensOf(s));
      gsap.killTweensOf(mouse);
      canvas = null;
      ctx = null;
      canvasRect = null;
      shapes.length = 0;
      hexagonCount = 0;
    }
  };
}
