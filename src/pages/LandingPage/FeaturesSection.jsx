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
                eyebrow="security for ai"
                title="왜 RADAR가 필요한가요?"
                desc={
                  <>
생성형 AI는 질문 방식과 대화 맥락에 따라<br />
매번 다른 응답을 생성합니다.<br />
RADAR는 AI 서비스의 잠재적 리스크를<br />
책임성과 보안성 기준으로 자동 검증합니다.
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
