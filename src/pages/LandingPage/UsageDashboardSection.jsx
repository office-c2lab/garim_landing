import { motion as Motion } from 'framer-motion';

import dashboardBg from '@/assets/images/dashbordbg.png';
import { Container, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

export default function UsageDashboardSection() {
  return (
    <section id="usage-dashboard" className="relative overflow-hidden bg-white">
      <Container className="relative z-10 py-10 sm:absolute sm:inset-0 sm:py-0">
        <div className="flex h-full items-center">
          <Motion.div className="max-w-[32rem]" {...SECTION_TITLE_REVEAL}>
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#5B39D6]">
              AI USAGE DASHBOARD
            </div>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
              AI 사용 현황을
              <br />
              한눈에 파악하세요
            </h2>
            <p className="mt-3 text-pretty text-sm leading-6 text-[#57534e] sm:text-base">
              서비스별 사용량, 탐지 결과,
              <br />
              정책 처리 상태를 통합 대시보드에서 확인합니다.
            </p>
          </Motion.div>
        </div>
      </Container>

      <img src={dashboardBg} alt="" className="block h-auto w-full" aria-hidden="true" />
    </section>
  );
}
