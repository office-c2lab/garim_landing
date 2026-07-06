import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const POLICY_PREVIEW_POLICIES = [
  {
    id: 'pol_preview_privacy',
    code: 'privacy_protection',
    name: '개인정보 보호 정책',
    category: '개인정보',
    services: ['ChatGPT'],
    serviceLabel: 'ChatGPT',
    action: '마스킹 후 전송',
    status: '사용',
    updatedAt: '2026-06-05 10:20',
    description: '사용자 입력 및 첨부에 포함된 개인정보를 탐지하여 마스킹 처리 후 전송합니다.',
    detects: ['이메일', '전화번호', '주민등록번호', '계좌번호'],
    exceptions: [],
    handling: '마스킹',
    alerts: { admin: true },
  },
  {
    id: 'pol_preview_injection',
    code: 'prompt_injection',
    name: '프롬프트 인젝션 방어 정책',
    category: '보안',
    services: ['전체 서비스'],
    serviceLabel: '전체 서비스',
    action: '차단',
    status: '사용',
    updatedAt: '2026-06-04 16:12',
    description: '시스템 프롬프트 우회, 권한 상승, 규칙 무시 패턴을 탐지해 즉시 차단합니다.',
    detects: ['시스템 프롬프트 요청', '인코딩 우회'],
    exceptions: [],
    handling: '차단',
    alerts: { admin: true },
  },
  {
    id: 'pol_preview_secret',
    code: 'secret_protection',
    name: '기밀정보 차단 정책',
    category: '기밀정보',
    services: ['Gemini'],
    serviceLabel: 'Gemini',
    action: '차단',
    status: '사용',
    updatedAt: '2026-06-03 09:45',
    description: '프로젝트 코드명, 재무 수치, 계약서 초안 등 기밀정보는 외부 전송을 차단합니다.',
    detects: ['계약/견적 정보'],
    exceptions: [],
    handling: '차단',
    alerts: { admin: true },
  },
  {
    id: 'pol_preview_harmful',
    code: 'harmful_expression_protection',
    name: '유해 표현 차단 정책',
    category: '유해 표현',
    services: ['전체 서비스'],
    serviceLabel: '전체 서비스',
    action: '차단',
    status: '사용',
    updatedAt: '2026-06-03 11:30',
    description: '욕설, 혐오 표현, 폭력적 표현 등 부적절한 프롬프트를 탐지해 차단합니다.',
    detects: ['욕설', '혐오 표현', '폭력 표현'],
    exceptions: [],
    handling: '차단',
    alerts: { admin: true },
  },
  {
    id: 'pol_preview_file',
    code: 'file_upload_protection',
    name: '파일 업로드 검사 정책',
    category: '파일 검사',
    services: ['Claude'],
    serviceLabel: 'Claude',
    action: '차단',
    status: '미사용',
    updatedAt: '2026-06-02 13:08',
    description: '업로드 파일의 민감정보, 실행 코드, 악성 패턴을 검사한 뒤 이상 시 차단합니다.',
    detects: ['API Key'],
    exceptions: [],
    handling: '차단',
    alerts: { admin: false },
  },
];

const POLICY_PREVIEW_ROWS = POLICY_PREVIEW_POLICIES.filter(
  policy => policy.code !== 'prompt_injection'
).slice(0, 4);

const POLICY_DETAIL_PREVIEWS = {
  privacy_protection: {
    variant: 'privacy',
    rows: [
      {
        id: 'privacy-1',
        category: '성함',
        keywords: ['유동석', '김가림', '홍길동'],
        action: '마스킹',
        enabled: true,
      },
      {
        id: 'privacy-2',
        category: '주민등록번호',
        keywords: ['900101-1234567', '880505-2345678'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'privacy-3',
        category: '휴대전화 번호',
        keywords: ['010-1234-5678', '01098765432'],
        action: '마스킹',
        enabled: true,
      },
      {
        id: 'privacy-4',
        category: '이메일 주소',
        keywords: ['user@example.com', 'admin@company.co.kr'],
        action: '마스킹',
        enabled: true,
      },
      {
        id: 'privacy-5',
        category: '계좌번호',
        keywords: ['123456-01-123456', '110-123-456789'],
        action: '차단',
        enabled: true,
      },
    ],
  },
  secret_protection: {
    variant: 'privacy',
    rows: [
      {
        id: 'secret-1',
        category: 'API Key',
        keywords: ['sk-...', 'AKIA...'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'secret-2',
        category: '계정 정보',
        keywords: ['password=', 'admin token'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'secret-3',
        category: '프로젝트 코드',
        keywords: ['Project Orion', '내부 코드명'],
        action: '마스킹',
        enabled: true,
      },
      {
        id: 'secret-4',
        category: '계약 정보',
        keywords: ['견적서 초안', '계약 조건'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'secret-5',
        category: '재무 수치',
        keywords: ['매출 전망', '원가율'],
        action: '차단',
        enabled: true,
      },
    ],
  },
  harmful_expression_protection: {
    variant: 'privacy',
    rows: [
      {
        id: 'harmful-1',
        category: '욕설',
        keywords: ['비속어', '모욕 표현'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'harmful-2',
        category: '혐오 표현',
        keywords: ['차별 표현', '혐오 발언'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'harmful-3',
        category: '폭력 표현',
        keywords: ['위협', '폭력 묘사'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'harmful-4',
        category: '자해 표현',
        keywords: ['자해 암시', '극단 선택'],
        action: '차단',
        enabled: true,
      },
      {
        id: 'harmful-5',
        category: '불법 행위',
        keywords: ['우회 방법', '불법 제작'],
        action: '차단',
        enabled: true,
      },
    ],
  },
  file_upload_protection: {
    variant: 'file',
    rows: [
      {
        extension: 'env',
        label: '환경 변수 파일',
        category: 'credential',
        mime_types: ['text/plain'],
        blocked: true,
      },
      {
        extension: 'key',
        label: '키 파일',
        category: 'credential',
        mime_types: ['application/octet-stream', 'text/plain'],
        blocked: true,
      },
      {
        extension: 'pem',
        label: 'PEM 인증서/키 파일',
        category: 'credential',
        mime_types: ['application/x-pem-file', 'text/plain'],
        blocked: true,
      },
      {
        extension: 'csv',
        label: 'CSV 파일',
        category: 'data',
        mime_types: ['text/csv'],
        blocked: true,
      },
      {
        extension: 'json',
        label: 'JSON 파일',
        category: 'data',
        mime_types: ['application/json'],
        blocked: true,
      },
    ],
  },
};

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function PolicyPreviewTable({
  policyRows,
  selectedId,
  handleSelectPolicy,
  handleTogglePolicyStatus,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]">
        <div className="flex items-center justify-between border-b border-[#E6E0FF] px-6 py-5">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-[#6B4CFF]">POLICY LIST</p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.03em] text-slate-950">정책 관리</h3>
          </div>
          <div className="rounded-xl bg-[#F4F1FF] px-4 py-2 text-xs font-black text-[#5B39D6]">
            {policyRows.length}개 정책
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[46rem] w-full text-left text-[13px]">
            <thead className="bg-[#F8F7FF] text-xs font-black text-[#6F7890]">
              <tr>
                <th className="px-6 py-4">정책명</th>
                <th className="px-4 py-4">적용 서비스</th>
                <th className="px-4 py-4">처리 방식</th>
                <th className="px-4 py-4">상태</th>
                <th className="px-4 py-4">업데이트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF0F6]">
              {policyRows.map(policy => {
                const isSelected = selectedId === policy.id;
                const isEnabled = policy.status === '사용';

                return (
                  <tr
                    key={policy.id}
                    className={joinClasses(
                      'cursor-pointer bg-white transition hover:bg-[#FAF9FF]',
                      isSelected && 'bg-[#F7F4FF]'
                    )}
                    onClick={() => handleSelectPolicy(policy.id)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-950">{policy.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#8A94A8]">{policy.category}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#F1EEFF] px-3 py-1 text-xs font-black text-[#5B39D6]">
                        {policy.serviceLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#526078]">{policy.action}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        className={joinClasses(
                          'relative inline-flex h-7 w-12 items-center rounded-full border transition',
                          isEnabled
                            ? 'border-[#5B39D6] bg-[#5B39D6]'
                            : 'border-[#D4D9E7] bg-[#CBD3E3]'
                        )}
                        onClick={event => {
                          event.stopPropagation();
                          handleTogglePolicyStatus(policy.id);
                        }}
                      >
                        <span
                          className={joinClasses(
                            'size-5 rounded-full bg-white shadow transition',
                            isEnabled ? 'translate-x-[1.35rem]' : 'translate-x-[0.15rem]'
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#7A8498]">{policy.updatedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Motion.div>
  );
}

function PolicySettingsPreview({ selectedPolicy }) {
  const preview =
    POLICY_DETAIL_PREVIEWS[selectedPolicy?.code] ?? POLICY_DETAIL_PREVIEWS.privacy_protection;

  return (
    <Motion.div
      key={selectedPolicy?.code ?? 'privacy_protection'}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]">
        <div className="flex items-center justify-between border-b border-[#E6E0FF] px-6 py-5">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-[#6B4CFF]">DETAIL SETTINGS</p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.03em] text-slate-950">
              탐지 기준 설정
            </h3>
          </div>
          <span className="rounded-xl bg-[#F4F1FF] px-4 py-2 text-xs font-black text-[#5B39D6]">
            미리보기
          </span>
        </div>

        <div className="grid gap-3 p-5">
          {preview.rows.map(row => (
            <div
              key={row.id ?? row.extension}
              className="grid gap-4 rounded-2xl border border-[#EDF0F6] bg-[#FBFCFF] px-5 py-4 sm:grid-cols-[9rem_1fr_6rem] sm:items-center"
            >
              <div>
                <p className="text-sm font-black text-slate-950">
                  {row.category ?? `.${row.extension}`}
                </p>
                <p className="mt-1 text-xs font-bold text-[#8A94A8]">
                  {row.label ?? row.mime_types?.join(', ')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(row.keywords ?? row.mime_types ?? []).slice(0, 4).map(keyword => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[#DDD6FF] bg-white px-3 py-1 text-xs font-bold text-[#5B39D6]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <span className="justify-self-start rounded-full bg-[#FFECEC] px-3 py-1 text-xs font-black text-[#FF3B4A] sm:justify-self-end">
                {row.action ?? (row.blocked ? '차단' : '허용')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Motion.div>
  );
}

export default function PolicyManagementSection() {
  const [policyRows, setPolicyRows] = useState(POLICY_PREVIEW_ROWS);
  const [selectedId, setSelectedId] = useState(POLICY_PREVIEW_ROWS[0]?.id ?? null);

  const selectedPolicy = useMemo(
    () => policyRows.find(policy => policy.id === selectedId) ?? null,
    [policyRows, selectedId]
  );

  const handleSelectPolicy = policyId => {
    setSelectedId(policyId);
  };

  const handleTogglePolicyStatus = policyId => {
    setPolicyRows(current =>
      current.map(policy =>
        policy.id === policyId
          ? { ...policy, status: policy.status === '사용' ? '미사용' : '사용' }
          : policy
      )
    );
  };

  return (
    <section id="policy-management" className="relative bg-white py-16 sm:py-20">
      <Container>
        <div className="space-y-14 sm:space-y-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="max-w-xl" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="POLICY MANAGEMENT"
                title={<>보안 정책 설정</>}
                desc={
                  <>
                    AI 사용에 필요한 보안 기준을
                    <br />
                    정책으로 체계화하고,
                    <br />
                    상황에 맞는 탐지와 조치를
                    <br />
                    일관되게 적용합니다.
                  </>
                }
              />
            </Motion.div>

            <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
              <PolicyPreviewTable
                policyRows={policyRows}
                selectedId={selectedId}
                handleSelectPolicy={handleSelectPolicy}
                handleTogglePolicyStatus={handleTogglePolicyStatus}
              />
            </Motion.div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.58fr)_minmax(0,0.42fr)] lg:items-center lg:gap-12 xl:gap-14">
            <Motion.div className="min-w-0 lg:order-1" {...SECTION_COPY_REVEAL}>
              <PolicySettingsPreview selectedPolicy={selectedPolicy} />
            </Motion.div>

            <Motion.div className="max-w-xl lg:order-2" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="POLICY DETAIL"
                title={<>정책 상세 설정</>}
                desc={
                  <>
                    정책별 탐지 기준과
                    <br />
                    처리 방식을 세분화하고,
                    <br />
                    업무 환경에 맞게
                    <br />
                    보안 설정을 조정합니다.
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
