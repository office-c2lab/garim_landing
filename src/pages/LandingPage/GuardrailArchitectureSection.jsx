import { motion as Motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Cloud, Database, ShieldCheck, UsersRound } from 'lucide-react';

import garimLogo from '@/assets/icons/simbol.svg';
import hardImage from '@/assets/images/hard.png';
import { Container } from './LandingPage.primitives';

function StepBadge({ children }) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#171717] shadow-[0_0_0_4px_rgba(255,255,255,0.08)]">
      {children}
    </span>
  );
}

function FlowLabel({ number, children, align = 'left' }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-semibold text-white sm:text-[15px] ${
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
    <section className="relative overflow-hidden bg-black py-20 text-white sm:py-28">
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
          className="mt-14 hidden xl:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
        >
          <div className="grid grid-cols-[13rem_minmax(10rem,1fr)_22rem_minmax(10rem,1fr)_13rem] items-center gap-0">
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035] px-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
              <UsersRound className="h-14 w-14 stroke-[1.35] text-white/86" />
              <p className="mt-5 text-lg font-semibold">부서 · 사용자</p>
              <p className="mt-2 text-xs text-white/45">업무용 AI 프롬프트</p>
            </div>

            <div className="px-4">
              <FlowLabel number="1">프롬프트 입력</FlowLabel>
              <div className="mt-3 flex items-center text-white/70">
                <div className="h-px flex-1 bg-white/55" />
                <ArrowRight className="-ml-px h-5 w-5" />
              </div>
              <div className="mt-5 flex items-center text-white/38">
                <ArrowLeft className="-mr-px h-5 w-5" />
                <div className="h-px flex-1 bg-white/35" />
              </div>
              <div className="mt-3">
                <FlowLabel number="4" align="right">
                  안전한 답변 출력
                </FlowLabel>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#8B7CFF]/45 bg-[linear-gradient(135deg,rgba(86,66,174,0.78),rgba(26,27,45,0.96)_52%,rgba(66,80,126,0.78))] px-7 py-7 text-center shadow-[0_0_70px_rgba(91,57,214,0.22)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%)]"
              />
              <div className="relative">
                <div className="flex items-center justify-center gap-3">
                  <img src={garimLogo} alt="" className="h-12 w-12 object-contain" />
                  <span className="text-3xl font-bold tracking-[-0.04em]">GARIM</span>
                </div>
                <div className="mt-7 flex items-center justify-center gap-3 text-[15px] font-semibold">
                  <StepBadge>2</StepBadge>
                  <span>프롬프트 내 보안 위험 실시간 탐지</span>
                </div>
              </div>
            </div>

            <div className="px-4">
              <FlowLabel number="3">정책 처리 후 전달</FlowLabel>
              <div className="mt-3 flex items-center text-white/70">
                <div className="h-px flex-1 bg-white/55" />
                <ArrowRight className="-ml-px h-5 w-5" />
              </div>
              <div className="mt-5 flex items-center text-white/38">
                <ArrowLeft className="-mr-px h-5 w-5" />
                <div className="h-px flex-1 bg-white/35" />
              </div>
              <p className="mt-3 text-right text-xs font-medium text-white/45">안전한 응답 반환</p>
            </div>

            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035] px-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
              <Cloud className="h-16 w-16 stroke-[1.25] text-white/86" />
              <p className="mt-4 text-lg font-semibold">생성형 AI</p>
              <p className="mt-2 text-xs text-white/45">외부 LLM 서비스</p>
            </div>
          </div>

          <div className="relative mx-2 mt-9 border-x border-b border-white/34 pb-4 pt-9">
            <span className="absolute -left-1 top-[-4px] h-2 w-2 rounded-full bg-white" />
            <span className="absolute -right-1 top-[-4px] h-2 w-2 rounded-full bg-white" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/34" />
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-white/88">
              <StepBadge>5</StepBadge>
              <Database className="h-5 w-5 text-[#8B7CFF]" />
              <span>사용 이력 · 탐지 근거 · 조치 로그 중앙 관리</span>
            </div>
          </div>
        </Motion.div>

        <Motion.div
          className="mt-12 grid gap-3 xl:hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
        >
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <FlowLabel number="1">부서·사용자가 프롬프트 입력</FlowLabel>
            <UsersRound className="mt-5 h-10 w-10 text-white/70" />
          </div>
          <div className="rounded-2xl border border-[#8B7CFF]/38 bg-[linear-gradient(135deg,rgba(86,66,174,0.7),rgba(22,22,35,0.96))] p-5">
            <FlowLabel number="2">GARIM이 보안 위험 실시간 탐지</FlowLabel>
            <div className="mt-5 flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-[#c5baff]" />
              <p className="text-sm leading-6 text-white/66">
                기업 정책에 따라 프롬프트를 허용·마스킹·차단합니다.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <FlowLabel number="3">정책 처리 후 생성형 AI에 전달</FlowLabel>
            <Cloud className="mt-5 h-10 w-10 text-white/70" />
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <FlowLabel number="4">안전한 답변 출력</FlowLabel>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <FlowLabel number="5">사용 이력·탐지·조치 로그 중앙 관리</FlowLabel>
            <Database className="mt-5 h-9 w-9 text-[#8B7CFF]" />
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
