"use client";

import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";

interface CosmicContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  toggleSound: () => void;
  playAudio: () => void;
  pauseAudio: () => void;
}

const CosmicContext = createContext<CosmicContextType | null>(null);

export function CosmicProvider({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Web Audio ambient synthesizer refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize atmospheric cosmic sound generator (warm interstellar drone)
  const initAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (audioCtxRef.current && masterGainRef.current) {
      return { ctx: audioCtxRef.current, masterGain: masterGainRef.current };
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      const ctx = new AudioContextClass();

      // Master Gain Node for smooth fade in/out
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Low-pass warm cosmic filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);
      filter.connect(masterGain);

      // Sub-drone 1: Deep cosmic fundamental (55 Hz - A1)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      osc1.connect(gain1);
      gain1.connect(filter);
      osc1.start();

      // Drone 2: Perfect fifth harmonic (82.4 Hz - E2)
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(82.4, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.2, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(filter);
      osc2.start();

      // Drone 3: Octave warmth (110 Hz - A2)
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(110, ctx.currentTime);
      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0.12, ctx.currentTime);
      osc3.connect(gain3);
      gain3.connect(filter);
      osc3.start();

      // Slow breathing LFO modulating filter cutoff (~12s swell)
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(90, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Celestial solar wind pink noise layer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        output[i] = (b0 + b1 + b2) * 0.035;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(450, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start();

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;

      return { ctx, masterGain };
    } catch (e) {
      console.warn("Failed to initialize cosmic audio:", e);
      return null;
    }
  }, []);

  const playAudio = useCallback(() => {
    const audio = initAudio();
    if (!audio) return;
    const { ctx, masterGain } = audio;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 1.2);

    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }

    isPlayingRef.current = true;
    setIsMuted(false);
  }, [initAudio]);

  const pauseAudio = useCallback(() => {
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      const masterGain = masterGainRef.current;
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }

    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    isPlayingRef.current = false;
    setIsMuted(true);
  }, []);

  const toggleSound = useCallback(() => {
    if (isMuted) {
      playAudio();
    } else {
      pauseAudio();
    }
  }, [isMuted, playAudio, pauseAudio]);

  // Mute when tab is hidden, resume when tab is active
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlayingRef.current && masterGainRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          masterGainRef.current.gain.cancelScheduledValues(now);
          masterGainRef.current.gain.setValueAtTime(0.0001, now);
        }
      } else {
        if (isPlayingRef.current && masterGainRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          masterGainRef.current.gain.cancelScheduledValues(now);
          masterGainRef.current.gain.linearRampToValueAtTime(0.18, now + 0.8);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Cleanup audio context on unmount
  React.useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  return (
    <CosmicContext.Provider value={{ videoRef, isMuted, toggleSound, playAudio, pauseAudio }}>
      {children}
    </CosmicContext.Provider>
  );
}

export function useCosmic() {
  const context = useContext(CosmicContext);
  if (!context) {
    throw new Error("useCosmic must be used within CosmicProvider");
  }
  return context;
}
