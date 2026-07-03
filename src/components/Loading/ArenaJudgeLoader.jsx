import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

import logoIcon from '../../assets/icons/simbol.svg';

export default function ArenaJudgeLoader({
  className = '',
  frameClassName = '',
  fullscreen = false,
  compact = false,
}) {
  const circleRadius = compact ? 178 : 258;
  const circumference = 2 * Math.PI * circleRadius;
  const containerSize = compact ? 428 : 620;
  const center = containerSize / 2;

  const smoothProgress = useSpring(0, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  const dashOffset = useTransform(smoothProgress, p => circumference * (1 - p));
  const displayPercent = useTransform(smoothProgress, p => `${Math.floor(p * 100)}%`);

  useEffect(() => {
    smoothProgress.set(0);
    let progress = 0;
    const target = 0.95;
    const interval = window.setInterval(() => {
      progress += 0.005;
      smoothProgress.set(Math.min(progress, target));
      if (progress >= target) window.clearInterval(interval);
    }, 30);

    return () => window.clearInterval(interval);
  }, [smoothProgress]);

  return (
    <div
        className={[
          'relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] bg-white text-white shadow-2xl',
          fullscreen ? 'h-[100svh] w-full rounded-none bg-white' : 'h-[600px] w-[950px]',
          className,
        ]
        .filter(Boolean)
        .join(' ')}
    >
      {fullscreen ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(106,90,224,0.12),transparent_32%)]" />
      ) : null}

      <div
        className={[
          'relative flex h-full w-full items-center justify-center overflow-hidden',
          frameClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={`relative flex items-center justify-center ${
            compact ? 'h-[428px] w-[428px]' : 'h-full w-full'
          }`}
        >
          <svg
            className="absolute"
            width={containerSize}
            height={containerSize}
            viewBox={`0 0 ${containerSize} ${containerSize}`}
            fill="none"
            style={{ transform: 'rotate(-90deg)', zIndex: 1 }}
          >
            <circle cx={center} cy={center} r={circleRadius} stroke="#ddd8ff" strokeWidth="2" />
            <motion.circle
              cx={center}
              cy={center}
              r={circleRadius}
              stroke="#6a5ae0"
              strokeOpacity="0.85"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>

          <div className="relative z-[2] flex flex-col items-center justify-center text-center">
            <motion.img
              src={logoIcon}
              alt="GARIM 로고"
              className={compact ? 'h-[112px] w-auto sm:h-[128px]' : 'h-[148px] w-auto'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            />
            <motion.p className="mt-6 text-sm font-semibold text-[#6a5ae0]">
              {[
                { text: '검증을', delay: 0.2 },
                { text: '진행중입니다', delay: 0.45 },
              ].map(({ text, delay }) => (
                <motion.span
                  key={text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay,
                    duration: 2.6,
                    repeat: Infinity,
                    repeatDelay: 0.45,
                    ease: 'easeInOut',
                  }}
                >
                  {text}{' '}
                </motion.span>
              ))}
            </motion.p>
            <motion.div className="mt-2 text-xs font-medium tracking-[0.18em] text-[#5f6f78]">
              {displayPercent}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
