import { motion as Motion } from 'framer-motion';

import ServiceLogoBadge, { ALL_SERVICE_LOGO_NAMES } from '@/components/ServiceLogoBadge';
import { Container } from './LandingPage.primitives';

const SUPPORTED_SERVICES = ALL_SERVICE_LOGO_NAMES;

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
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#5B39D6]">
            Supported AI Services
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-4xl">
            팀이 사용하는 생성형 AI에 바로 적용하세요
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6b6f76] sm:text-base">
            주요 외부 AI 서비스의 접근과 프롬프트를 하나의 정책으로 안전하게 관리합니다.
          </p>
        </Motion.div>

        <div className="mt-10 grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(7.5rem,8.5rem))] justify-center gap-5 sm:mt-12 sm:gap-7">
          {SUPPORTED_SERVICES.map((service, index) => (
            <Motion.div
              key={service}
              className="flex min-h-[7.5rem] w-full max-w-[8.5rem] -translate-y-0.5 flex-col items-center justify-center gap-3 rounded-[8px] border border-[#8B7CFF] bg-white px-4 py-5 shadow-[0_14px_30px_rgba(91,57,214,0.16)] transition duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.38, ease: 'easeOut', delay: index * 0.06 }}
            >
              <ServiceLogoBadge
                name={service}
                className="h-12 w-12 rounded-[8px] !border-transparent !bg-transparent !shadow-none"
                iconStyle={{ height: '34px', width: '34px' }}
              />
              <span className="max-w-full truncate text-center text-xs font-semibold text-[#5B39D6] sm:text-sm">
                {service}
              </span>
            </Motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
