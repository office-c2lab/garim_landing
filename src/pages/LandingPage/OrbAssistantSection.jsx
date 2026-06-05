import { motion as Motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import LoginAnimatedBackground from '@/components/LoginAnimatedBackground';
import { Container, SECTION_COPY_REVEAL, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

function ShaderOrb() {
  return (
    <div className="relative flex h-[230px] w-[230px] items-center justify-center">
      <div className="absolute inset-[-36px] rounded-full bg-[#6a5ae0]/24 blur-3xl" />
      <div className="absolute inset-[-16px] rounded-full border border-[#b8aaff]/18 bg-[#6a5ae0]/8 blur-[1px]" />

      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/16 bg-[#05040d] shadow-[0_0_34px_rgba(169,157,255,0.42),0_0_92px_rgba(106,90,224,0.28)]">
        <LoginAnimatedBackground
          className="!absolute !inset-0 !h-full !w-full  contrast-[1.85] saturate-[1.8] brightness-[1.45]"
          minimumGlow={0.16}
          speed={0.0005}
          intensity={2.05}
          alphaFloor={0.16}
        />
        <LoginAnimatedBackground
          className="!absolute !inset-0 !h-full !w-full rotate-180  mix-blend-screen contrast-[1.65] saturate-[1.75] brightness-[1.28]"
          minimumGlow={0.1}
          speed={0.0005}
          intensity={1.55}
          alphaFloor={0.08}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),transparent_17%),radial-gradient(circle_at_62%_68%,rgba(169,157,255,0.12),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(106,90,224,0)_42%,rgba(2,2,7,0.16)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[10px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[72%] w-[132%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full border border-[#d9d3ff]/20"
        />
        <style>
          {`
            @keyframes garim-orb-spin {
              from {
                transform: rotate(0deg) scale(1.02);
              }
              to {
                transform: rotate(360deg) scale(1.02);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

function AssistantModalPreview() {
  return (
    <Motion.aside
      className="relative mx-auto flex min-h-[560px] w-full max-w-[390px] flex-col overflow-hidden rounded-[34px] border border-white/12 bg-[#070724]/94 text-white shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_24%,rgba(126,58,242,0.2),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_42%)]" />
      <div className="pointer-events-none absolute right-[-120px] top-0 h-full w-[210px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)] blur-sm" />

      <header className="relative flex h-14 items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold tracking-[0.08em] text-white">GARIM</span>
          <span className="text-sm font-bold text-white/88">Alert</span>
        </div>

        <button
          type="button"
          aria-label="알림 닫기"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/72 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
        <ShaderOrb />

        <div className="mt-8 text-center">
          <p className="text-[15px] font-bold leading-7 text-white">
            새로운 보안 알림이 도착했습니다.
          </p>
          <p className="mt-1 text-[15px] font-bold leading-7 text-white/92">
            위험 요청 및 정책 탐지 내역을 확인해 주세요
          </p>
        </div>

        <Link
          to="/monitoring"
          className="mt-7 inline-flex h-12 min-w-[190px] items-center justify-center rounded-xl border border-[#4338CA] bg-[#4338CA] px-7 text-[15px] font-bold text-white no-underline shadow-[0_10px_24px_rgba(67,56,202,0.24)] transition hover:bg-[#3730A3] active:bg-[#312E81]"
        >
          모니터링으로 이동
        </Link>
      </div>
    </Motion.aside>
  );
}

export default function OrbAssistantSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] lg:items-center lg:gap-16">
          <Motion.div className="max-w-2xl" {...SECTION_TITLE_REVEAL}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#6a5ae0]">
              GARIM ALERT
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-5xl">
              중요 보안 알림을
              <br />
              즉시 확인합니다
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-[#57534e] sm:text-base">
              GARIM 알림 모달은 위험 요청, 정책 위반, 사용자 활동 변화를 즉시 안내하고 관리자에게
              필요한 모니터링 화면으로 빠르게 연결합니다.
            </p>
          </Motion.div>

          <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
            <AssistantModalPreview />
          </Motion.div>
        </div>
      </Container>
    </section>
  );
}
