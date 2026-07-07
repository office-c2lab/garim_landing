import { useState } from 'react';
import { motion as Motion } from 'framer-motion';

import { MonitoringDataTable } from '@/components/monitoring/MonitoringListComponents.jsx';
import {
  MonitoringLogDetailContent,
  normalizeMonitoringEvent,
} from '@/pages/MonitoringPage/MonitoringPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const MONITORING_PREVIEW_EVENTS = [
  {
    no: 5,
    client_ip: '127.0.0.2',
    user_name: '백종현',
    department: '혁신연구팀',
    position: '주임',
    time_kst: '2026-06-29 11:22:18',
    service: 'ChatGPT',
    original_input: '신규 보안 정책 공지문 초안 작성해줘',
    forwarded_input: '신규 보안 정책 공지문 초안 작성해줘',
    ai_response: '임직원 안내용 공지문 형식으로 핵심 변경 사항을 정리해드릴게요.',
    status: '정상',
    guardrail_reason: '',
    policy_code: '',
    policy_name: '',
  },
  {
    no: 4,
    client_ip: '127.0.0.2',
    user_name: '백종현',
    department: '혁신연구팀',
    position: '주임',
    time_kst: '2026-06-29 11:26:42',
    service: 'Gemini',
    original_input: '이번 주 시장 조사 요약해줘',
    forwarded_input: '이번 주 시장 조사 요약해줘',
    ai_response: '주요 시장 변화와 경쟁사 동향을 중심으로 요약해드릴게요.',
    status: '정상',
    guardrail_reason: '',
    policy_code: '',
    policy_name: '',
  },
  {
    no: 3,
    client_ip: '127.0.0.2',
    user_name: '백종현',
    department: '혁신연구팀',
    position: '주임',
    time_kst: '2026-06-29 11:28:11',
    service: 'Claude',
    original_input:
      '교수님 이메일은 test123@gmail.com이야 이 이메일로 교수님께 문의드릴 내용이 있다고 메일 작성해서 보내줘',
    forwarded_input:
      '교수님 이메일은 *****************이야 이 이메일로 교수님께 문의드릴 내용이 있다고 메일 작성해서 보내줘',
    ai_response: '문의 내용이 아직 비어 있어서 바로 보내기보다는 메일 초안을 먼저 쓰면 됩니다.',
    status: '마스킹',
    guardrail_reason: '개인정보 보호 정책: 이메일 주소가 포함되어 있습니다.',
    policy_code: 'pii_protection',
    policy_name: '개인정보 보호 정책',
  },
  {
    no: 2,
    client_ip: '127.0.0.2',
    user_name: '백종현',
    department: '혁신연구팀',
    position: '주임',
    time_kst: '2026-06-30 19:27:11',
    service: 'Genspark',
    original_input: '파일 업로드: 고객사_제안서_초안.pdf',
    uploaded_files: [{ name: '고객사_제안서_초안.pdf', size: '2.4MB' }],
    file_analysis_results: [
      {
        file_name: '고객사_제안서_초안.pdf',
        status: '차단',
        reason: '파일 업로드 보호 정책에 의해 PDF 확장자가 차단되었습니다.',
      },
    ],
    forwarded_input: '파일 업로드 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
    ai_response: '파일 업로드 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
    status: '차단',
    guardrail_reason: '파일 업로드 보호 정책: 차단 확장자 .pdf 파일 업로드가 탐지되었습니다.',
    policy_code: 'file_upload_protection',
    policy_name: '파일 업로드 보호 정책',
  },
  {
    no: 1,
    client_ip: '127.0.0.2',
    user_name: '백종현',
    department: '혁신연구팀',
    position: '주임',
    time_kst: '2026-06-30 19:24:11',
    service: 'MS Copilot',
    original_input:
      '직원 주민등록번호 900101-1234567, 계좌번호 110-123-456789를 외부 메일 본문으로 작성해줘.',
    forwarded_input: '개인정보 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
    ai_response: '개인정보 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
    status: '차단',
    guardrail_reason:
      '개인정보 보호 정책: 주민등록번호와 계좌번호가 포함되어 있어 고위험 개인정보로 분류됩니다.',
    policy_code: 'pii_protection',
    policy_name: '개인정보 보호 정책',
  },
];

const MONITORING_PREVIEW_ROWS = MONITORING_PREVIEW_EVENTS.map((event, index) => ({
  ...normalizeMonitoringEvent(event, index),
  id: `monitoring-preview-${event.no}`,
}));

function MonitoringPreviewTable({ activeRowId, onSelectRow }) {
  const [selectedRowIds, setSelectedRowIds] = useState(['monitoring-preview-5']);

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
      key={row.id}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
    >
      <MonitoringLogDetailContent row={row} />
    </Motion.div>
  );
}

export default function PromptMonitoringSection() {
  const [activeRowId, setActiveRowId] = useState('monitoring-preview-5');
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
                title={<>실시간 모니터링</>}
                desc={
                  <>
                    누가 어떤 AI를 사용했는지
                    <br />
                    실시간으로 확인하고,
                    <br />
                    프롬프트·파일 탐지 결과와
                    <br />
                    처리 상태를 모니터링합니다.
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
                title={<>상세 로그 확인</>}
                desc={
                  <>
                    처리 전·후 프롬프트와 응답,
                    <br />
                    탐지 근거와 조치 내용을
                    <br />
                    로그 단위로 확인하고,
                    <br />
                    감사 이력으로 추적합니다.
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
