import { motion as Motion } from 'framer-motion';

import { DashboardPreviewContent } from '@/pages/DashboardPage/DashboardPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

export default function UsageDashboardSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] lg:items-center lg:gap-12 xl:gap-14">
          <Motion.div className="max-w-xl" {...SECTION_TITLE_REVEAL}>
            <SectionTitle
              eyebrow="AI USAGE DASHBOARD"
              title={<>AI 사용 현황</>}
              desc={
                <>
                  서비스 사용량과 탐지 결과를
                  <br />
                  대시보드에서 확인하고,
                  <br />
                  정책 처리 상태를
                  <br />
                  한눈에 관리합니다.
                </>
              }
            />
          </Motion.div>

          <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
            <div className="rounded-[28px] border border-[#D8D0FF] bg-[#F7F8FC] p-5 shadow-[0_24px_70px_rgba(64,48,150,0.12)]">
              <DashboardPreviewContent />
            </div>
          </Motion.div>
        </div>
      </Container>
    </section>
  );
}
