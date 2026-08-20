"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* SVG Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
      {/* Radial Gradient Ambient Glows */}
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px] dark:bg-blue-600/15" />
      <div className="absolute top-[30%] right-[-10%] -z-10 h-[400px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px] dark:bg-indigo-600/15" />
    </div>
  );
}
