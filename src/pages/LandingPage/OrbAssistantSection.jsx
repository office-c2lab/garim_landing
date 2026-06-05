import { motion as Motion } from 'framer-motion';

import GarimAlertModal from '@/components/GarimAlertModal';
import { Container, SECTION_COPY_REVEAL, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

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
            <GarimAlertModal />
          </Motion.div>
        </div>
      </Container>
    </section>
  );
}
