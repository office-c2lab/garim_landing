import { useState } from 'react';
import { motion as Motion } from 'framer-motion';

import { MonitoringDataTable } from '@/components/monitoring/MonitoringListComponents.jsx';
import { MonitoringLogExpandedRow } from '@/pages/MonitoringPage/MonitoringPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const MONITORING_PREVIEW_ROWS = [
  {
    id: 'monitoring-preview-1',
    no: 1,
    detectedAt: '2026-06-05 10:42',
    aiType: 'ChatGPT',
    prompt: '김가림 담당자 연락처 알려줘.',
    displayResult: '차단',
    result: '차단',
    detectedPolicy: '개인정보 보호 기본 정책',
    content: '전화번호·이메일 탐지',
    userIp: '10.10.24.18',
    userId: 'sales01',
    level: 'danger',
    promptDetail: '김가림 담당자 연락처 알려줘.',
    answerDetail: '개인정보가 포함되어 원문 기반 답변 생성을 보류했습니다.',
    detectionDetail: '전화번호 패턴 탐지·이메일 주소 패턴 탐지',
    actionDetail:
      '개인정보 보호 기본 정책에 따라 요청을 차단했습니다. 사용자에게 안전한 입력으로 다시 요청하도록 안내했습니다.',
  },
  {
    id: 'monitoring-preview-2',
    no: 2,
    detectedAt: '2026-06-05 10:39',
    aiType: 'Gemini',
    prompt: '월간 캠페인 성과를 요약해줘.',
    displayResult: '정상',
    result: '정상',
    detectedPolicy: '일반 사용 허용 정책',
    content: '위험 키워드 없이 정상 요청',
    userIp: '10.10.31.42',
    userId: 'mkt02',
    level: 'safe',
    promptDetail: '월간 캠페인 성과를 요약해줘.',
    answerDetail: '요청한 월간 캠페인 성과 요약이 정상 생성되었습니다.',
    detectionDetail: '위험 키워드와 민감 정보가 확인되지 않아 정상 요청으로 처리되었습니다.',
    actionDetail: '일반 사용 허용 정책에 따라 별도 마스킹 없이 사용자에게 답변을 전달했습니다.',
  },
  {
    id: 'monitoring-preview-3',
    no: 3,
    detectedAt: '2026-06-05 10:31',
    aiType: 'Claude',
    prompt: '계약서 초안에서 고객명과 계좌번호만 정리해줘.',
    displayResult: '마스킹',
    result: '마스킹',
    detectedPolicy: '민감정보 마스킹 정책',
    content: '고객명·계좌번호 탐지',
    userIp: '10.10.18.7',
    userId: 'legal03',
    level: 'danger',
    promptDetail: '계약서 초안에서 고객명과 계좌번호만 정리해줘.',
    answerDetail: '고객명과 계좌번호를 마스킹한 버전으로 계약서 요약 요청을 다시 전달했습니다.',
    detectionDetail: '고객명으로 추정되는 고유명사 탐지·계좌번호 형식 탐지',
    actionDetail:
      '민감정보 마스킹 정책에 따라 고객명과 계좌번호를 대체했습니다. 마스킹된 프롬프트만 외부 AI 서비스로 전달했습니다.',
  },
  {
    id: 'monitoring-preview-4',
    no: 4,
    detectedAt: '2026-06-05 10:28',
    aiType: 'MS Copilot',
    prompt: '외부 공개 자료 기준으로 제안서 목차를 정리해줘.',
    displayResult: '허용',
    result: '허용',
    detectedPolicy: '업무 활용 허용 정책',
    content: '정책상 허용된 업무 요청',
    userIp: '10.10.44.11',
    userId: 'dev08',
    level: 'safe',
    promptDetail: '외부 공개 자료 기준으로 제안서 목차를 정리해줘.',
    answerDetail: '위험 패턴은 탐지되었지만 정책상 차단 대상은 아니어서 답변을 전달했습니다.',
    detectionDetail: '외부 공개 자료 기반 요청으로 판단되어 업무 활용 가능 범위로 분류되었습니다.',
    actionDetail:
      '업무 활용 허용 정책에 따라 요청을 허용했습니다. 해당 요청은 사용 이력과 함께 로그로 기록됩니다.',
  },
];

function MonitoringPreviewTable({ activeRowId, onSelectRow }) {
  const [selectedRowIds, setSelectedRowIds] = useState(['monitoring-preview-1']);

  const handleToggleRowSelection = rowId => {
    setSelectedRowIds(current =>
      current.includes(rowId) ? current.filter(id => id !== rowId) : [...current, rowId]
    );
  };

  const handleToggleAllRowsSelection = rowIds => {
    setSelectedRowIds(current => {
      const allSelected = rowIds.length > 0 && rowIds.every(id => current.includes(id));

      if (allSelected) {
        return current.filter(id => !rowIds.includes(id));
      }

      return [...new Set([...current, ...rowIds])];
    });
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <MonitoringDataTable
        rows={MONITORING_PREVIEW_ROWS}
        activeRowId={activeRowId}
        selectedRowIds={selectedRowIds}
        onSelectRow={onSelectRow}
        onToggleRowSelection={handleToggleRowSelection}
        onToggleAllRowsSelection={handleToggleAllRowsSelection}
        bodyClassName="text-[13px]"
        className="rounded-[28px] border-[#D8D0FF] shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
        showSelection={false}
      />
    </Motion.div>
  );
}

function MonitoringDetailCard({ row }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
    >
      <MonitoringLogExpandedRow row={row} />
    </Motion.div>
  );
}

export default function PromptMonitoringSection() {
  const [activeRowId, setActiveRowId] = useState('monitoring-preview-1');
  const activeRow =
    MONITORING_PREVIEW_ROWS.find(row => row.id === activeRowId) ?? MONITORING_PREVIEW_ROWS[0];

  return (
    <section id="prompt-monitoring" className="relative py-16 sm:py-20">
      <Container>
        <div className="space-y-14 sm:space-y-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="max-w-xl" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="PROMPT MONITORING"
                title={<>모든 AI 사용 이력을 한 화면에서 추적합니다</>}
                desc={
                  <>
                    누가, 어떤 AI에, 어떤 프롬프트를 입력했는지 실시간으로 확인합니다.
                    <br />
                    탐지 결과와 차단·마스킹·허용 처리 상태까지 하나의 로그로 관리합니다.
                  </>
                }
              />
            </Motion.div>

            <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
              <MonitoringPreviewTable
                activeRowId={activeRowId}
                onSelectRow={row => setActiveRowId(row.id)}
              />
            </Motion.div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.58fr)_minmax(0,0.42fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="min-w-0 lg:order-1" {...SECTION_COPY_REVEAL}>
              <MonitoringDetailCard row={activeRow} />
            </Motion.div>

            <Motion.div className="max-w-xl lg:order-2" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="LOG DETAIL"
                title={<>탐지 근거와 조치 내용을 상세하게 확인합니다</>}
                desc={
                  <>
                    선택한 로그의 원본 프롬프트, 답변, 탐지 근거, 처리 내용을 분리해 확인합니다.
                    <br />
                    감사 대응과 사용자 안내에 필요한 맥락까지 함께 추적할 수 있습니다.
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
