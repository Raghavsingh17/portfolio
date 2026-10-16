"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import aboutPortraitSrc from "@/src/assets/images/about-portrait.png";

// Monospace font stack for pixel-perfect alignment
const FONT_STACK =
  "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace";

// Character ramp from light (low density) to dark (high ink density)
const ASCII_RAMP = " .:-=+*#%@";
const SCRAMBLE_CHARS = ":;=+xX#@%";

interface CellData {
  char: string;
  color: string;
  isSubject: boolean;
  revealThreshold: number;
  scrambleSeed: number;
}

interface AsciiPortraitProps {
  imageSrc?: string;
  scrollProgress: MotionValue<number>;
  columns?: number;
  fontSize?: number;
  className?: string;
}

export const AsciiPortrait = memo(function AsciiPortrait({
  imageSrc = aboutPortraitSrc.src,
  scrollProgress,
  columns = 50,
  fontSize = 11,
  className = "",
}: AsciiPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridDataRef = useRef<{
    cells: CellData[];
    cols: number;
    rows: number;
    charWidth: number;
    charHeight: number;
    dispW: number;
    dispH: number;
  } | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const lastProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Deterministic pseudo-random generator
  const seededRandom = useCallback((seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  }, []);

  // Precompute ASCII character grid from source image with auto-bounding-box crop
  const processImage = useCallback(
    (img: HTMLImageElement) => {
      // 1. Measure character dimensions in selected font
      const testCanvas = document.createElement("canvas");
      const testCtx = testCanvas.getContext("2d");
      if (!testCtx) return;

      testCtx.font = `${fontSize}px ${FONT_STACK}`;
      const charHeight = fontSize;
      const charWidth = Math.ceil(testCtx.measureText("M").width) || 7;

      // 2. Scan full image to find tight bounding box of avatar (crop transparent margins)
      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = img.naturalWidth;
      fullCanvas.height = img.naturalHeight;
      const fullCtx = fullCanvas.getContext("2d");
      if (!fullCtx) return;

      fullCtx.drawImage(img, 0, 0);
      const fullData = fullCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;

      let minX = img.naturalWidth;
      let maxX = 0;
      let minY = img.naturalHeight;
      let maxY = 0;

      for (let y = 0; y < img.naturalHeight; y += 2) {
        for (let x = 0; x < img.naturalWidth; x += 2) {
          const a = fullData[(y * img.naturalWidth + x) * 4 + 3];
          if (a > 30) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Add tight 12px margin around detected avatar
      const pad = 12;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(img.naturalWidth - cropX, maxX - minX + pad * 2);
      const cropH = Math.min(img.naturalHeight - cropY, maxY - minY + pad * 2);

      // 3. Compute grid dimensions preserving cropped aspect ratio
      const cropAspect = cropW / cropH;
      const cols = columns;
      const rows = Math.round(
        cols * (1 / cropAspect) * (charWidth / charHeight)
      );

      // 4. Sample cropped image into the grid
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = cols;
      sampleCanvas.height = rows;
      const sampleCtx = sampleCanvas.getContext("2d");
      if (!sampleCtx) return;

      sampleCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cols, rows);
      const imgData = sampleCtx.getImageData(0, 0, cols, rows).data;

      // 5. Build precomputed cell grid
      const cells: CellData[] = [];
      const centerCol = cols / 2;
      const centerRow = rows * 0.40; // Focus on eyes/glasses level
      const maxDist = Math.sqrt(centerCol * centerCol + centerRow * centerRow);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const alpha = imgData[idx + 3];

          const isSubject = alpha > 40;
          let char = " ";
          let color = "#cbd5e1";

          if (isSubject) {
            // Perceived luminance (ITU-R BT.601)
            const rawLuma = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
            // Enhanced contrast curve for razor-sharp facial details
            const luma = Math.pow(rawLuma, 1.15);

            const rampIndex = Math.min(
              ASCII_RAMP.length - 1,
              Math.max(0, Math.floor(luma * ASCII_RAMP.length))
            );
            char = ASCII_RAMP[rampIndex];

            // Color grading: Cyan accents for rim lights and eyes, crisp editorial whites, subtle shadows
            const isBlueish = blue > red + 16 && blue > green + 6;
            if (isBlueish || (luma > 0.85 && (c < cols * 0.18 || c > cols * 0.82))) {
              // Cyan rim light accent
              color = "#38bdf8";
            } else if (luma > 0.72) {
              // Clean bright editorial white
              color = "#ffffff";
            } else if (luma > 0.42) {
              // Soft slate white
              color = "#e2e8f0";
            } else if (luma > 0.22) {
              // Muted slate gray
              color = "#94a3b8";
            } else {
              // Deep shadow character (beard/hair depth)
              color = "#64748b";
            }
          }

          // Calculate reveal threshold for Stage 1 (0.00 -> 0.22 scroll range)
          const cellIndex = r * cols + c;
          const dist = Math.sqrt((c - centerCol) ** 2 + (r - centerRow) ** 2) / maxDist;
          const noise = seededRandom(cellIndex + 1);
          // Radial + noise reveal: face emerges first, spreading organically outward
          const revealThreshold = Math.min(
            0.98,
            Math.max(0.04, dist * 0.30 + noise * 0.68)
          );

          cells.push({
            char,
            color,
            isSubject,
            revealThreshold,
            scrambleSeed: Math.floor(noise * 1000),
          });
        }
      }

      gridDataRef.current = {
        cells,
        cols,
        rows,
        charWidth,
        charHeight,
        dispW: cols * charWidth,
        dispH: rows * charHeight,
      };

      setIsLoaded(true);
    },
    [columns, fontSize, seededRandom]
  );

  // Load image on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    if (img.complete && img.naturalWidth > 0) {
      processImage(img);
    } else {
      img.onload = () => processImage(img);
    }
  }, [imageSrc, processImage]);

  // Canvas drawing function
  const renderCanvas = useCallback(
    (progress: number) => {
      const cv = canvasRef.current;
      const grid = gridDataRef.current;
      if (!cv || !grid) return;

      const ctx = cv.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 2, 2.5);
      const { dispW, dispH, cols, rows, charWidth, charHeight, cells } = grid;

      // Resize canvas buffer if needed
      const targetW = Math.round(dispW * dpr);
      const targetH = Math.round(dispH * dpr);
      if (cv.width !== targetW || cv.height !== targetH) {
        cv.width = targetW;
        cv.height = targetH;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clean background
      ctx.clearRect(0, 0, dispW, dispH);

      // Setup typography
      ctx.font = `${charHeight}px ${FONT_STACK}`;
      ctx.textBaseline = "top";

      // Stage 1 resolution calculation:
      // In scroll range [0.00, 0.22], stage1Progress travels 0.0 -> 1.0.
      // Once scroll reaches >= 0.22, stage1Progress is locked at 1.0 (fully resolved).
      const stage1Progress = Math.min(1, Math.max(0, progress / 0.22));

      // Micro-animation timer based on progress or subtle shift
      const flickerSeed = Math.floor(progress * 120);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const cell = cells[idx];
          if (!cell.isSubject) continue;

          const x = c * charWidth;
          const y = r * charHeight;

          if (stage1Progress < cell.revealThreshold) {
            // Cell is not yet fully revealed
            const diff = cell.revealThreshold - stage1Progress;
            if (diff > 0.16) {
              // Completely hidden in early stage
              continue;
            } else {
              // Scrambling state: draw random density character with low opacity
              const scrambleIdx =
                (cell.scrambleSeed + flickerSeed + c) % SCRAMBLE_CHARS.length;
              ctx.globalAlpha = 0.35 + (1 - diff / 0.16) * 0.4;
              ctx.fillStyle = "#38bdf8"; // cyan tint while scrambling
              ctx.fillText(SCRAMBLE_CHARS[scrambleIdx], x, y);
            }
          } else {
            // Fully revealed & locked into place
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = cell.color;
            ctx.fillText(cell.char, x, y);
          }
        }
      }

      ctx.restore();
    },
    []
  );

  // Subscribe directly to Framer Motion scroll progress without re-rendering React
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    lastProgressRef.current = latest;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      renderCanvas(lastProgressRef.current);
      rafIdRef.current = null;
    });
  });

  // Initial draw once loaded
  useEffect(() => {
    if (isLoaded) {
      renderCanvas(scrollProgress.get());
    }
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isLoaded, renderCanvas, scrollProgress]);

  const grid = gridDataRef.current;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: grid ? `${grid.dispW}px` : "auto",
        height: grid ? `${grid.dispH}px` : "auto",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {/* Subtle cyan ambient glow behind the ASCII portrait */}
      <div className="absolute inset-0 -z-10 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none scale-90" />

      {/* Main ASCII Canvas */}
      <canvas
        ref={canvasRef}
        className="block select-none pointer-events-none"
        style={{
          width: grid ? `${grid.dispW}px` : "100%",
          height: grid ? `${grid.dispH}px` : "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
});
