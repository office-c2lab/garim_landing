import { motion } from 'framer-motion';

import LazyVisual from './LazyVisual';
import {
  AgenticCommerceVisual,
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-7 lg:pr-8">
            <motion.div className="max-w-xl space-y-4" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="AI GUARDRAIL"
                title="AI 가드레일이란?"
                desc={
                  <>
AI 가드레일은 AI 사용을 막는 장벽이 아니라,<br />
위험한 사용만 제어하는 보안 기준입니다.<br />
GARIM은 개인정보·기밀정보·위험 프롬프트를 실시간으로 탐지하고,<br />
정책에 따라 차단하거나 마스킹합니다.
                  </>
                }
              />
            </motion.div>

            <motion.div
              className="max-w-lg text-sm leading-7 text-[#57534e] sm:text-base"
              {...SECTION_COPY_REVEAL}
            >
            </motion.div>

            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
            >
              
              
            </motion.div>
          </div>

          <div className="w-full">
            <LazyVisual minHeight={620}>
              <AgenticCommerceVisual />
            </LazyVisual>
          </div>
        </div>
      </Container>
    </section>
  );
}
