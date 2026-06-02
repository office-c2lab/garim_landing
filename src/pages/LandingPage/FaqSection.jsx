import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { cn, SectionTitle, SECTION_TITLE_REVEAL } from './LandingPage.primitives';

const FAQ_ITEMS = [
  {
    q: 'API 방식과 URL 방식은 무엇이 다른가요?',
    a: 'API 방식은 엔드포인트에 직접 요청을 보내는 방식입니다.\nURL 방식은 실제 브라우저에서 생성형 AI 서비스 화면을 조작해, 사용자와 같은 경로로 응답을 수집하는 방식입니다.',
  },
  {
    q: '로그인이 필요한 서비스도 검증할 수 있나요?',
    a: '가능합니다.\n로그인 입력창과 버튼을 지정한 뒤, 세션을 유지한 상태로 입력창·전송 버튼·응답 영역을 선택해 검증할 수 있습니다.',
  },
  {
    q: '결과는 어떤 기준으로 분류되나요?',
    a: '응답 원문과 Judge 판정 근거를 함께 저장하고,\nMITRE ATLAS와 OWASP LLM Top 10 관점으로 리스크 유형과 개선 우선순위를 정리합니다.',
  },
  {
    q: '검증 결과를 PDF로 받을 수 있나요?',
    a: '가능합니다.\n세션 요약, 위험 점수, Top Risk, 판정 근거, 우선 조치 항목을 PDF 리포트로 내보내 팀 내부 공유나 고객 보고에 활용할 수 있습니다.',
  },
  {
    q: '검증 중 위험한 응답 원문도 확인할 수 있나요?',
    a: '확인할 수 있습니다.\n실패 사유, 위험 응답, 관련 항목을 세션 단위로 남겨서 재현과 후속 조치가 가능하도록 구성합니다.',
  },
  {
    q: '기존 운영 서비스에 바로 연결해도 되나요?',
    a: '운영 환경과 같은 방식으로 연결해 검증할 수 있습니다.\n다만 처음에는 테스트 계정과 제한된 질문 세트로 연결 테스트를 먼저 진행하는 것을 권장합니다.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto flex w-full  flex-col gap-9">
      <motion.div {...SECTION_TITLE_REVEAL}>
        <SectionTitle
          eyebrow="FAQ"
          title="자주 묻는 질문"
          desc={
            <>
              RADAR, 검증 기능, 등록 방식, 결과 분석에 대해 자주 묻는 질문을 정리했습니다.
            </>
          }
        />
      </motion.div>

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
                    isOpen ? 'text-[#6a5ae0]' : 'text-[#30343b] group-hover:text-[#6a5ae0]'
                  )}
                >
                  Q. {item.q}
                </span>

                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition duration-300',
                    isOpen
                      ? 'rotate-180 text-[#6a5ae0]'
                      : 'text-[#b8b8b8] group-hover:text-[#6a5ae0]'
                  )}
                />
              </button>

              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="border-t border-[#ece8ff] bg-[#fbfaff] px-5 py-6 sm:px-6"
                >
                  <p className="whitespace-pre-line text-[15px] leading-8 text-[#6b6f76] sm:text-base">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
