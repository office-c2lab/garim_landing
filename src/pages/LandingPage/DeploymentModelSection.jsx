import { motion as Motion } from 'framer-motion';

import hardImage from '@/assets/images/hard.png';
import { Container } from './LandingPage.primitives';

export default function DeploymentModelSection() {
  return (
    <section
      id="deployment-model"
      className="relative overflow-hidden bg-black py-16 text-white sm:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
          <Motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#a99dff]">
              ON-PREMISE DEPLOYMENT
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              온프레미스 구축 방식
            </h2>
            <p className="mt-5 text-pretty text-sm leading-7 text-white/62 sm:text-base">
              GARIM은 기업 내부망 또는 전용 인프라에 온프레미스 형태로 구축됩니다. 외부로 보안
              데이터를 이전하지 않고, 사내 환경 안에서 프롬프트 검사와 정책 적용, 사용 이력 관리를
              중앙에서 수행합니다.
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
