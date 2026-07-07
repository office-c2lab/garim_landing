import { motion as Motion } from 'framer-motion';

import garimSymbol from '@/assets/icons/simbol.svg';
import SectionCard from '@/components/SectionCard.jsx';
import { CardHeader, InfoRow } from '@/pages/SupportPage/SupportPage.jsx';
import DownloadPagePreview from './DownloadPagePreview.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const SUPPORT_TEMPLATE = {
  logoLabel: 'GARIM',
  logoSrc: garimSymbol,
  companyName: 'C2Lab GARIM 운영팀',
  companyDescription: '전사 생성형 AI 보안 정책과 배포 URL을 관리합니다.',
  adminEmail: 'security@company.co.kr',
  adminPhone: '02-1234-5678',
  downloadPath: '/download',
  fullDownloadUrl: 'https://aigarim.kr/download',
};

function SupportPreview() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="space-y-5"
    >
      <SectionCard className="overflow-hidden">
        <CardHeader title="템플릿 관리" action="수정하기" onAction={() => {}} />
        <dl>
          <InfoRow label="로고">
            <div className="flex items-center gap-3">
              <img
                src={SUPPORT_TEMPLATE.logoSrc}
                alt={SUPPORT_TEMPLATE.logoLabel}
                className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
              />
            </div>
          </InfoRow>
          <InfoRow label="회사 정보">{SUPPORT_TEMPLATE.companyName}</InfoRow>
          <InfoRow label="회사 설명">{SUPPORT_TEMPLATE.companyDescription}</InfoRow>
          <InfoRow label="이메일">{SUPPORT_TEMPLATE.adminEmail}</InfoRow>
          <InfoRow label="전화번호">{SUPPORT_TEMPLATE.adminPhone}</InfoRow>
        </dl>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <CardHeader title="다운로드 URL 관리" action="변경하기" onAction={() => {}} />
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500">현재 URL</span>
                <span className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm font-bold text-[#64728C]">
                  {SUPPORT_TEMPLATE.downloadPath}
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-4">
                <span className="shrink-0 text-sm font-bold text-slate-500">전체 주소</span>
                <span className="truncate text-sm font-bold text-[#4338CA]">
                  {SUPPORT_TEMPLATE.fullDownloadUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </Motion.div>
  );
}

function DownloadPreview() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
    >
      <div className="flex h-12 items-center gap-3 border-b border-[#E4E8F0] bg-[#F8FAFC] px-5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF605C]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD44]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00CA4E]" />
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-bold text-[#64728C] shadow-inner">
          <span className="block truncate">https://aigarim.kr/download</span>
        </div>
      </div>

      <div className="h-[38rem] overflow-y-auto overflow-x-hidden bg-[#F3F6FA] [container-type:inline-size] sm:h-[44rem]">
        <div className="w-[80rem] origin-top-left" style={{ zoom: 'min(1, calc(100cqw / 80rem))' }}>
          <DownloadPagePreview />
        </div>
      </div>
    </Motion.div>
  );
}

export default function EasyDeploymentSection() {
  return (
    <section id="easy-deployment" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <Container>
        <div className="space-y-20 sm:space-y-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="max-w-xl" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="OPERATION SUPPORT"
                title={<>운영지원</>}
                desc={
                  <>
                    서비스 적용 대상자들에게
                    <br />
                    설치 안내와 PAC 파일을 제공하는
                    <br />
                    배포 URL을 관리하고,
                    <br />
                    회사 정보와 담당자 연락처를
                    <br />
                    함께 안내합니다.
                  </>
                }
              />
            </Motion.div>

            <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
              <SupportPreview />
            </Motion.div>
          </div>

          <div className="space-y-10">
            <Motion.div className="max-w-3xl" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="EASY DEPLOYMENT"
                title={<>설치 절차 안내</>}
                desc={
                  <>
                    GARIM 적용 파일과 설치 절차, 주의사항을 함께 제공합니다.
                    <br />
                    대상자는 안내된 절차에 따라 보안 설정을 손쉽게 적용할 수 있습니다.
                  </>
                }
              />
            </Motion.div>

            <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
              <DownloadPreview />
            </Motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
