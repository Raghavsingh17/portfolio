"use client";

import React from "react";
import { cn } from "@/src/lib/utils";
import { AnimatedBorderGlow } from "@/src/components/reactbits/AnimatedBorderGlow";

interface MarqueeItem {
  name: string;
  category?: string;
  icon?: React.ReactNode;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: "slow" | "medium" | "fast";
  pauseOnHover?: boolean;
  className?: string;
}

const GLOW_COLOR_PRESETS = [
  "cyan-blue",
  "sunset",
  "emerald",
  "purple",
  "rainbow",
  "gold",
  "cyber",
  "amber",
  "indigo",
];

export function InfiniteMarquee({
  items,
  direction = "left",
  speed = "medium",
  pauseOnHover = true,
  className,
}: InfiniteMarqueeProps) {
  // Speed duration mapping
  const durationMap = {
    slow: "50s",
    medium: "35s",
    fast: "20s",
  };

  const duration = durationMap[speed];
  const isLeft = direction === "left";

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-nowrap gap-3.5 py-4",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          isLeft ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          animationDuration: duration,
        }}
      >
        {items.concat(items).map((item, idx) => {
          const glowPreset = GLOW_COLOR_PRESETS[idx % GLOW_COLOR_PRESETS.length];
          return (
            <AnimatedBorderGlow
              key={`${item.name}-${idx}`}
              glowColor={glowPreset}
              containerClassName="rounded-2xl p-[1.5px] shrink-0 shadow-md"
              className="px-4 py-2.5 rounded-[calc(1rem-1.5px)] bg-slate-950/90 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200 backdrop-blur-xl whitespace-nowrap"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="font-mono tracking-tight text-white">{item.name}</span>
            </AnimatedBorderGlow>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 flex-nowrap gap-3.5 py-4",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          isLeft ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          animationDuration: duration,
        }}
      >
        {items.concat(items).map((item, idx) => {
          const glowPreset = GLOW_COLOR_PRESETS[idx % GLOW_COLOR_PRESETS.length];
          return (
            <AnimatedBorderGlow
              key={`clone-${item.name}-${idx}`}
              glowColor={glowPreset}
              containerClassName="rounded-2xl p-[1.5px] shrink-0 shadow-md"
              className="px-4 py-2.5 rounded-[calc(1rem-1.5px)] bg-slate-950/90 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200 backdrop-blur-xl whitespace-nowrap"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="font-mono tracking-tight text-white">{item.name}</span>
            </AnimatedBorderGlow>
          );
        })}
      </div>
    </div>
  );
}
