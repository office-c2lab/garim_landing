import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn, SectionTitle, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

const FAQ_ITEMS = [
  {
    q: '관리자 화면을 미리 체험해볼 수 있나요?',
    a: (
      <>
        목업 관리자 페이지에서 대시보드, 모니터링, 정책, 사용자 관리 화면을 확인할 수 있습니다.
        <br />
        <Link
          to="/dashboard"
          className="font-bold text-[#5B39D6] underline decoration-[#C4B5FD] underline-offset-4 transition hover:text-[#3F22B8]"
        >
          목업 페이지 바로가기
        </Link>
      </>
    ),
  },
  {
    q: '기존 AI 사이트 차단 솔루션과 무엇이 다른가요?',
    a: 'GARIM은 생성형 AI 사용 자체를 막는 대신, 실제 업무에 안전하게 활용할 수 있도록 돕습니다.\n별도 사용자 단말 에이전트 설치 없이 프록시 기반으로 적용할 수 있으며,\n사용자가 입력하는 프롬프트를 실시간으로 점검하고 기업 정책에 따라 허용·마스킹·차단합니다.',
  },
  {
    q: '어떤 생성형 AI 서비스를 관리할 수 있나요?',
    a: 'ChatGPT, Gemini, Claude 등 기업에서 사용하는 외부 생성형 AI 서비스를 통합 관리할 수 있습니다.\n허용할 AI 서비스와 도메인을 직접 지정해 비인가 AI 및 Shadow AI 사용 위험도 통제할 수 있습니다.',
  },
  {
    q: '민감정보가 포함된 프롬프트는 어떻게 처리되나요?',
    a: '개인정보, 기밀정보, 위험 키워드 등 기업이 설정한 탐지 항목을 실시간으로 확인합니다.\n탐지 결과와 정책에 따라 프롬프트를 그대로 허용하거나, 민감정보만 마스킹하거나, 전송을 차단할 수 있습니다.',
  },
  {
    q: '사용자에게는 어떻게 적용하나요?',
    a: 'GARIM은 온프레미스 환경에 설치한 뒤, 관리자가 안내한 PAC를 사용자 PC에 적용하는 방식으로 운영합니다.\n사용자는 안내된 압축 파일을 내려받아 실행하고, 이후 AI 서비스에 다시 접속하면 조직 정책에 따라 프롬프트 점검과 모니터링이 적용됩니다.',
  },
  {
    q: '탐지 및 조치 내역을 감사 자료로 활용할 수 있나요?',
    a: '가능합니다.\n누가 어떤 AI를 어떻게 사용했는지 프롬프트 처리 이력과 사용자·IP 정보를 통합 추적하며, 탐지 근거와 조치 내용을 함께 확인해 보안 감사와 내부 거버넌스에 활용할 수 있습니다.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto flex w-full  flex-col gap-9">
      <Motion.div {...SECTION_TITLE_REVEAL}>
        <SectionTitle
          eyebrow="FAQ"
          title="자주 묻는 질문"
          desc={
            <>GARIM의 보안 정책, 지원 서비스, 배포 및 운영에 대해 자주 묻는 질문을 정리했습니다.</>
          }
        />
      </Motion.div>

      <div className="overflow-hidden border-y border-[#e5e1ff] bg-white">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = open === index;

          return (
            <div key={item.q} className="border-b border-[#e5e1ff] last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-white px-5 py-5 text-left transition hover:bg-[#f7f5ff] sm:px-6"
              >
                <span
                  className={cn(
                    'text-[15px] font-bold tracking-[-0.02em] transition sm:text-base',
                    isOpen ? 'text-[#5B39D6]' : 'text-[#30343b] group-hover:text-[#5B39D6]'
                  )}
                >
                  Q. {item.q}
                </span>

                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition duration-300',
                    isOpen
                      ? 'rotate-180 text-[#5B39D6]'
                      : 'text-[#b8b8b8] group-hover:text-[#5B39D6]'
                  )}
                />
              </button>

              {isOpen ? (
                <Motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="border-t border-[#ece8ff] bg-[#fbfaff] px-5 py-6 sm:px-6"
                >
                  <p className="whitespace-pre-line text-[15px] leading-8 text-[#6b6f76] sm:text-base">
                    {item.a}
                  </p>
                </Motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
