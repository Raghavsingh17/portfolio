"use client";

import { useSyncExternalStore } from "react";
import { Lottie } from "lottie-react";

interface LottiePlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData?: any;
  src?: string | object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const emptySubscribe = () => () => {};

export function LottiePlayer({
  animationData,
  src,
  className = "w-full h-auto",
  loop = true,
  autoplay = true,
}: LottiePlayerProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return (
      <div
        className={`flex items-center justify-center min-h-[260px] sm:min-h-[340px] ${className}`}
      >
        <div className="h-10 w-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  const animationSrc = src || animationData || "/code.json";

  return (
    <div className={className}>
      <Lottie
        src={animationSrc}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
}
