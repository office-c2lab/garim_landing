import { Download, FileArchive, LogOut, MousePointerClick, ShieldCheck } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import packIcon from '@/assets/images/pac.png';
import SectionCard from '@/components/SectionCard.jsx';
import { CompactGuideCard, SectionHeader } from '@/pages/DownloadPage/DownloadPage.jsx';
import { CardHeader, InfoRow } from '@/pages/SupportPage/SupportPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const SUPPORT_TEMPLATE = {
  logoLabel: 'GARIM',
  companyName: 'C2Lab GARIM 운영팀',
  companyDescription: '전사 생성형 AI 보안 정책과 배포 URL을 관리합니다.',
  adminEmail: 'security@company.co.kr',
  adminPhone: '02-1234-5678',
  downloadPath: '/download',
  fullDownloadUrl: 'https://garim.company.co.kr/download',
};

const INSTALL_PREVIEW_STEPS = [
  [Download, '압축 파일 다운로드', 'garim-windows-setup.zip\n파일을 다운로드합니다.'],
  [FileArchive, '압축 해제', '다운로드한 zip 파일의\n압축을 풉니다.'],
  [LogOut, 'AI 서비스 종료', 'AI 서비스 웹페이지나 앱을\n완전히 종료합니다.'],
  [MousePointerClick, '설치 파일 실행', 'garim-start.cmd 파일을\n실행합니다.'],
  [ShieldCheck, '보안 확인 허용', '인증서 설치 확인 창을\n허용합니다.'],
];

function SupportPreview() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="space-y-5"
    >
      <SectionCard className="overflow-hidden rounded-[28px] border-[#D8D0FF] shadow-[0_24px_70px_rgba(64,48,150,0.12)]">
        <CardHeader title="템플릿 관리" action="수정하기" onAction={() => {}} />
        <dl>
          <InfoRow label="로고">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-[#5B39D6] text-xs font-black text-white">
              {SUPPORT_TEMPLATE.logoLabel}
            </div>
          </InfoRow>
          <InfoRow label="회사 정보">{SUPPORT_TEMPLATE.companyName}</InfoRow>
          <InfoRow label="회사 설명">{SUPPORT_TEMPLATE.companyDescription}</InfoRow>
          <InfoRow label="이메일">{SUPPORT_TEMPLATE.adminEmail}</InfoRow>
          <InfoRow label="전화번호">{SUPPORT_TEMPLATE.adminPhone}</InfoRow>
        </dl>
      </SectionCard>

      <SectionCard className="overflow-hidden rounded-[28px] border-[#D8D0FF] shadow-[0_24px_70px_rgba(64,48,150,0.12)]">
        <CardHeader title="다운로드 URL 관리" action="변경하기" onAction={() => {}} />
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500">현재 URL</span>
              <span className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm font-bold text-[#64728C]">
                {SUPPORT_TEMPLATE.downloadPath}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-4">
              <span className="shrink-0 text-sm font-bold text-slate-500">전체 주소</span>
              <span className="truncate text-sm font-bold text-[#5B39D6]">
                {SUPPORT_TEMPLATE.fullDownloadUrl}
              </span>
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
      className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-[#F3F6FA] p-6 shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
    >
      <SectionHeader
        title="설치 안내"
        description={
          '다운로드한 압축 파일을 실행한 뒤 안내에 따라 GARIM 설정을 적용해 주세요.\n설치 후 대상 AI 서비스 접속은 회사 보안 정책을 통해 관리됩니다.'
        }
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INSTALL_PREVIEW_STEPS.map(([Icon, title, description], index) => (
          <CompactGuideCard
            key={title}
            icon={Icon}
            number={index + 1}
            title={title}
            description={description}
          />
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#DDE4EF] bg-[#FAFBFF] p-5">
        <div className="grid gap-5 lg:grid-cols-[7rem_1fr_auto] lg:items-center">
          <img src={packIcon} alt="" className="h-28 w-28 object-contain" />
          <div>
            <h3 className="break-all text-xl font-black tracking-[-0.03em] text-slate-900">
              garim-windows-setup.zip
            </h3>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-[#64728C]">
              <span>버전 v0.1.0</span>
              <span>파일 형식 .zip</span>
              <span>크기 3KB</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#526078]">
              GARIM 정책 및 환경 설정 적용을 위한 압축 파일입니다.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-[#5B39D6] bg-[#5B39D6] px-6 text-base font-black text-white shadow-[0_14px_30px_rgba(91,57,214,0.24)] transition hover:bg-[#4C2FC0]"
          >
            <Download className="h-5 w-5" />
            압축 파일 다운로드
          </button>
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
                title={<>관리자가 배포 환경과 안내 페이지를 직접 운영합니다</>}
                desc={
                  <>
                    운영지원 화면에서 다운로드 페이지 템플릿과 배포 URL을 관리합니다.
                    <br />
                    임직원에게 안내할 회사 정보, 담당자 연락처, 접근 경로를 한곳에서 조정합니다.
                  </>
                }
              />
            </Motion.div>

            <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
              <SupportPreview />
            </Motion.div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.58fr)_minmax(0,0.42fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="min-w-0 lg:order-1" {...SECTION_COPY_REVEAL}>
              <DownloadPreview />
            </Motion.div>

            <Motion.div className="max-w-xl lg:order-2" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="EASY DEPLOYMENT"
                title={<>임직원은 안내 페이지에서 설치 파일과 절차를 바로 확인합니다</>}
                desc={
                  <>
                    다운로드 페이지는 GARIM 적용 파일, 설치 순서, 주의사항을 한 화면에 제공합니다.
                    <br />
                    복잡한 구축 없이 전사 AI 보안 환경을 빠르게 배포할 수 있습니다.
                  </>
                }
              />
            </Motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
