import { motion as Motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Cloud, Database, UsersRound } from 'lucide-react';

import garimLogo from '@/assets/icons/simbol.svg';
import hardImage from '@/assets/images/hard.png';
import { Container } from './LandingPage.primitives';

function StepBadge({ children }) {
  return (
    <span className="inline-flex h-[clamp(1.25rem,2.15vw,1.75rem)] w-[clamp(1.25rem,2.15vw,1.75rem)] shrink-0 items-center justify-center rounded-full bg-white text-[clamp(0.58rem,0.95vw,0.75rem)] font-bold text-[#171717] shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
      {children}
    </span>
  );
}

function FlowLabel({ number, children, align = 'left' }) {
  return (
    <div
      className={`flex items-center gap-[clamp(0.25rem,0.75vw,0.5rem)] text-[clamp(0.56rem,1.35vw,0.94rem)] font-semibold leading-tight text-white ${
        align === 'right' ? 'justify-end' : ''
      }`.trim()}
    >
      <StepBadge>{number}</StepBadge>
      <span>{children}</span>
    </div>
  );
}

export default function GuardrailArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative overflow-hidden bg-black py-20 text-white sm:py-28"
    >
      <Container className="relative">
        <Motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8B7CFF]">
            How GARIM Works
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            GARIM 구성도
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            임직원의 프롬프트부터 외부 AI 응답까지, 모든 사용 흐름에 기업 보안 정책을 적용합니다.
          </p>
        </Motion.div>

        <Motion.div
          className="relative z-10 mx-auto mt-8 max-w-[26rem] sm:mt-14 sm:max-w-none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
        >
          <div className="grid grid-cols-[clamp(4.25rem,18.5vw,13rem)_minmax(1.65rem,1fr)_clamp(7.25rem,29vw,22rem)_minmax(1.65rem,1fr)_clamp(4.25rem,18.5vw,13rem)] items-center gap-0">
            <div className="flex h-[clamp(6.5rem,17vw,12rem)] flex-col items-center justify-center rounded-[clamp(0.7rem,1.4vw,1rem)] border border-white/8 bg-white/[0.035] px-[clamp(0.45rem,1.7vw,1.25rem)] text-center shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
              <UsersRound className="h-[clamp(1.8rem,4.6vw,3.5rem)] w-[clamp(1.8rem,4.6vw,3.5rem)] stroke-[1.35] text-white/86" />
              <p className="mt-[clamp(0.55rem,1.5vw,1.25rem)] text-[clamp(0.64rem,1.45vw,1.125rem)] font-semibold leading-tight">
                부서 · 사용자
              </p>
              <p className="mt-[clamp(0.25rem,0.7vw,0.5rem)] text-[clamp(0.5rem,1vw,0.75rem)] leading-tight text-white/45">
                업무용 AI 프롬프트
              </p>
            </div>

            <div className="px-[clamp(0.2rem,1.15vw,1rem)]">
              <FlowLabel number="1">프롬프트 입력</FlowLabel>
              <div className="mt-[clamp(0.3rem,0.85vw,0.75rem)] flex items-center text-white/70">
                <div className="h-px flex-1 bg-white/55" />
                <ArrowRight className="-ml-px h-[clamp(0.85rem,1.55vw,1.25rem)] w-[clamp(0.85rem,1.55vw,1.25rem)]" />
              </div>
              <div className="mt-[clamp(0.5rem,1.4vw,1.25rem)] flex items-center text-white/38">
                <ArrowLeft className="-mr-px h-[clamp(0.85rem,1.55vw,1.25rem)] w-[clamp(0.85rem,1.55vw,1.25rem)]" />
                <div className="h-px flex-1 bg-white/35" />
              </div>
              <div className="mt-[clamp(0.3rem,0.85vw,0.75rem)]">
                <FlowLabel number="4" align="right">
                  안전한 답변 출력
                </FlowLabel>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[clamp(0.7rem,1.4vw,1rem)] border border-[#8B7CFF]/45 bg-[linear-gradient(135deg,rgba(86,66,174,0.78),rgba(26,27,45,0.96)_52%,rgba(66,80,126,0.78))] px-[clamp(0.55rem,2vw,1.75rem)] py-[clamp(0.9rem,2.5vw,1.75rem)] text-center shadow-[0_0_70px_rgba(91,57,214,0.22)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%)]"
              />
              <div className="relative">
                <div className="flex items-center justify-center gap-[clamp(0.35rem,1vw,0.75rem)]">
                  <img
                    src={garimLogo}
                    alt=""
                    className="h-[clamp(1.6rem,4vw,3rem)] w-[clamp(1.6rem,4vw,3rem)] object-contain"
                  />
                  <span className="text-[clamp(1rem,2.7vw,1.875rem)] font-bold tracking-[-0.04em]">
                    GARIM
                  </span>
                </div>
                <div className="mt-[clamp(0.75rem,2.2vw,1.75rem)] flex items-center justify-center gap-[clamp(0.35rem,1vw,0.75rem)] text-[clamp(0.58rem,1.25vw,0.94rem)] font-semibold leading-tight">
                  <StepBadge>2</StepBadge>
                  <span>프롬프트 내 보안 위험 실시간 탐지</span>
                </div>
              </div>
            </div>

            <div className="px-[clamp(0.2rem,1.15vw,1rem)]">
              <FlowLabel number="3">정책 처리 후 전달</FlowLabel>
              <div className="mt-[clamp(0.3rem,0.85vw,0.75rem)] flex items-center text-white/70">
                <div className="h-px flex-1 bg-white/55" />
                <ArrowRight className="-ml-px h-[clamp(0.85rem,1.55vw,1.25rem)] w-[clamp(0.85rem,1.55vw,1.25rem)]" />
              </div>
              <div className="mt-[clamp(0.5rem,1.4vw,1.25rem)] flex items-center text-white/38">
                <ArrowLeft className="-mr-px h-[clamp(0.85rem,1.55vw,1.25rem)] w-[clamp(0.85rem,1.55vw,1.25rem)]" />
                <div className="h-px flex-1 bg-white/35" />
              </div>
              <p className="mt-[clamp(0.3rem,0.85vw,0.75rem)] text-right text-[clamp(0.5rem,1vw,0.75rem)] font-medium leading-tight text-white/45">
                안전한 응답 반환
              </p>
            </div>

            <div className="flex h-[clamp(6.5rem,17vw,12rem)] flex-col items-center justify-center rounded-[clamp(0.7rem,1.4vw,1rem)] border border-white/8 bg-white/[0.035] px-[clamp(0.45rem,1.7vw,1.25rem)] text-center shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
              <Cloud className="h-[clamp(2rem,5vw,4rem)] w-[clamp(2rem,5vw,4rem)] stroke-[1.25] text-white/86" />
              <p className="mt-[clamp(0.5rem,1.25vw,1rem)] text-[clamp(0.64rem,1.45vw,1.125rem)] font-semibold leading-tight">
                생성형 AI
              </p>
              <p className="mt-[clamp(0.25rem,0.7vw,0.5rem)] text-[clamp(0.5rem,1vw,0.75rem)] leading-tight text-white/45">
                외부 LLM 서비스
              </p>
            </div>
          </div>

          <div className="relative mx-[clamp(0.15rem,0.7vw,0.5rem)] mt-[clamp(1.15rem,3vw,2.25rem)] border-x border-b border-white/34 pb-[clamp(0.65rem,1.4vw,1rem)] pt-[clamp(1.1rem,3vw,2.25rem)]">
            <span className="absolute -left-1 top-[-4px] h-[clamp(0.35rem,0.8vw,0.5rem)] w-[clamp(0.35rem,0.8vw,0.5rem)] rounded-full bg-white" />
            <span className="absolute -right-1 top-[-4px] h-[clamp(0.35rem,0.8vw,0.5rem)] w-[clamp(0.35rem,0.8vw,0.5rem)] rounded-full bg-white" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/34" />
            <div className="flex items-center justify-center gap-[clamp(0.35rem,1vw,0.75rem)] text-[clamp(0.56rem,1.35vw,0.875rem)] font-semibold leading-tight text-white/88">
              <StepBadge>5</StepBadge>
              <Database className="h-[clamp(0.9rem,1.55vw,1.25rem)] w-[clamp(0.9rem,1.55vw,1.25rem)] shrink-0 text-[#8B7CFF]" />
              <span>사용 이력 · 탐지 근거 · 조치 로그 중앙 관리</span>
            </div>
          </div>
        </Motion.div>

        <div className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
          <Motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8B7CFF]">
              ON-PREMISE DEPLOYMENT
            </p>
            <h3 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              구축 방식
            </h3>
            <p className="mt-5 text-pretty text-sm leading-7 text-white/62 sm:text-base">
              GARIM은 On-Premise 환경에서 Agentless 방식으로 구축됩니다.
              <br />
              외부로 보안 데이터를 이전하지 않고,
              <br />
              사내 환경 안에서 프롬프트 검사와 정책 적용,
              <br />
              사용 이력 관리를 중앙에서 수행합니다.
            </p>
          </Motion.div>

          <Motion.img
            src={hardImage}
            alt="GARIM 전용 보안 게이트웨이 서버"
            className="w-full object-contain"
            loading="lazy"
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.58, ease: 'easeOut', delay: 0.08 }}
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 0%, #000 76%, rgba(0, 0, 0, 0.72) 86%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, #000 0%, #000 76%, rgba(0, 0, 0, 0.72) 86%, transparent 100%)',
            }}
          />
        </div>
      </Container>
    </section>
  );
}
