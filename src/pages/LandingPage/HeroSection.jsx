import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useInView } from 'framer-motion';

import LoginAnimatedBackground from '@/components/LoginAnimatedBackground';
import ArenaOpeningHeroArt from './ArenaOpeningHeroArt';

export default function HeroSection({ onVisibilityChange }) {
  const heroRef = useRef(null);
  const shaderRevealMs = 2620;
  const [showAnimatedBackground, setShowAnimatedBackground] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isAnimatedBackgroundVisible, setIsAnimatedBackgroundVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const isHeroInView = useInView(heroRef, {
    margin: '-15% 0px -55% 0px',
  });

  useEffect(() => {
    onVisibilityChange?.(isHeroInView);
  }, [isHeroInView, onVisibilityChange]);

  useEffect(() => {
    if (showAnimatedBackground && isAnimatedBackgroundVisible) {
      return undefined;
    }

    if (showAnimatedBackground) {
      const fadeTimeoutId = window.setTimeout(() => {
        setIsAnimatedBackgroundVisible(true);
      }, 80);

      return () => window.clearTimeout(fadeTimeoutId);
    }

    const mountTimeoutId = window.setTimeout(() => {
      setShowAnimatedBackground(true);
    }, shaderRevealMs);

    return () => {
      window.clearTimeout(mountTimeoutId);
    };
  }, [isAnimatedBackgroundVisible, showAnimatedBackground]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#05040d]"
    >
      {showAnimatedBackground ? (
        <div
          className={`absolute inset-0 transition-opacity duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isAnimatedBackgroundVisible ? 'opacity-100' : 'opacity-0'
          }`.trim()}
          aria-hidden="true"
        >
          <LoginAnimatedBackground />
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(91,57,214,0.18),transparent_42%),linear-gradient(180deg,rgba(5,4,13,0.82)_0%,rgba(8,7,18,0.5)_46%,rgba(2,2,7,0.2)_100%)] transition-opacity duration-[2600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isAnimatedBackgroundVisible ? 'opacity-0' : 'opacity-100'
        }`.trim()}
        aria-hidden="true"
      />

      <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center gap-10 px-5 py-8 text-center sm:gap-12 sm:px-8 sm:py-10">
        <ArenaOpeningHeroArt />

        <Motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: shaderRevealMs / 1000 }}
          className="flex max-w-4xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center sm:gap-x-6"
        >
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.88rem]">
            <span className="mr-1 text-[1.22rem] font-semibold tracking-[0.18em] text-[#8B7CFF] sm:text-[1.34rem]">
              G
            </span>
            enAI
          </span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.88rem]">
            <span className="mr-1 text-[1.22rem] font-semibold tracking-[0.18em] text-[#8B7CFF] sm:text-[1.34rem]">
              A
            </span>
            ccess
          </span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.88rem]">
            <span className="mr-1 text-[1.22rem] font-semibold tracking-[0.18em] text-[#8B7CFF] sm:text-[1.34rem]">
              R
            </span>
            isk
          </span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.88rem]">
            <span className="mr-1 text-[1.22rem] font-semibold tracking-[0.18em] text-[#8B7CFF] sm:text-[1.34rem]">
              I
            </span>
            nspection
          </span>
          <span className="text-[0.78rem] font-medium uppercase tracking-[0.32em] text-white sm:text-[0.88rem]">
            <span className="mr-1 text-[1.22rem] font-semibold tracking-[0.18em] text-[#8B7CFF] sm:text-[1.34rem]">
              M
            </span>
            anagement
          </span>
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: shaderRevealMs / 1000 + 0.13 }}
          className="flex flex-col items-center"
        >
          <a
            href="https://c2lab.kr/"
            target="_blank"
            rel="noreferrer"
            className="group relative z-[1] inline-flex min-w-[280px] items-center justify-center overflow-hidden rounded-2xl bg-[#1d1d1d] px-7 py-4 text-base font-bold leading-[26px] text-[#747474] no-underline shadow-[0_4px_12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.16),inset_0_1px_1px_rgba(255,255,255,0.05)] transition duration-300 hover:scale-[1.04] hover:bg-[#5B39D6] hover:text-white hover:shadow-[0_0_90px_rgba(91,57,214,0.4),0_4px_12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.16),inset_0_1px_1px_rgba(255,255,255,0.32)] active:scale-[1.02]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl border border-white/10"
            />

            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
              viewBox="0 0 280 58"
              preserveAspectRatio="none"
            >
              <rect
                x="1"
                y="1"
                width="278"
                height="56"
                rx="16"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1"
                strokeDasharray="36 244"
                pathLength="280"
                className="[animation:arena-border-line_1.8s_linear_infinite]"
              />
              <rect
                x="1"
                y="1"
                width="278"
                height="56"
                rx="16"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="2"
                strokeDasharray="36 244"
                pathLength="280"
                filter="blur(3px)"
                className="[animation:arena-border-line_1.8s_linear_infinite]"
              />
            </svg>

            <span
              aria-hidden="true"
              className="absolute bottom-[-10px] left-[20%] right-[20%] z-[2] h-5 rounded-full bg-[#5B39D6] opacity-0 blur-[12.5px] transition duration-300 group-hover:opacity-100"
            />

            <span className="relative z-[1]">도입 문의하기</span>

            <style>
              {`
                @keyframes arena-border-line {
                  from {
                    stroke-dashoffset: 280;
                  }
                  to {
                    stroke-dashoffset: 0;
                  }
                }
              `}
            </style>
          </a>
        </Motion.div>
      </div>
    </section>
  );
}
