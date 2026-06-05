import { motion as Motion } from 'framer-motion';

import ServiceLogoBadge from '@/components/ServiceLogoBadge';
import { Container } from './LandingPage.primitives';

const SUPPORTED_SERVICES = ['ChatGPT', 'Gemini', 'Claude', 'Genspark', 'MS Copilot'];

export default function SupportedAiSection() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-14 sm:py-20">
      <Container className="flex flex-col items-center text-center">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#6a5ae0]">
            Supported AI Services
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-4xl">
            팀이 사용하는 생성형 AI에 바로 적용하세요
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6b6f76] sm:text-base">
            주요 외부 AI 서비스의 접근과 프롬프트를 하나의 정책으로 안전하게 관리합니다.
          </p>
        </Motion.div>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-4 sm:mt-12 sm:gap-6">
          {SUPPORTED_SERVICES.map((service, index) => (
            <Motion.div
              key={service}
              className="group flex w-[6.5rem] flex-col items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.38, ease: 'easeOut', delay: index * 0.06 }}
            >
              <ServiceLogoBadge
                name={service}
                className="h-16 w-16 rounded-2xl border-[#d9d3ff] bg-[#faf9ff] shadow-[0_12px_30px_rgba(106,90,224,0.09)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#a99dff] group-hover:shadow-[0_18px_36px_rgba(106,90,224,0.18)]"
                iconClassName="h-9 w-9"
              />
              <span className="text-xs font-semibold text-[#57534e] transition group-hover:text-[#5b4fd2] sm:text-sm">
                {service}
              </span>
            </Motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
