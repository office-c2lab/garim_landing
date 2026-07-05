import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

import {
  POLICY_PREVIEW_POLICIES,
  PolicyManagementTable,
  createPolicyDraft,
} from '@/pages/PolicyPage/PolicyPage.jsx';
import { FileUploadProtectionContent } from '@/components/settings/SettingsContent.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

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

function PolicyPreviewTable({
  policyRows,
  selectedId,
  selectedPolicy,
  draftPolicy,
  handleSelectPolicy,
  handleTogglePolicyStatus,
  handleDeletePolicy,
  handleCancelEdit,
  handleSavePolicy,
  setDraftPolicy,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <PolicyManagementTable
        rows={policyRows}
        selectedId={selectedId}
        selectedPolicy={selectedPolicy}
        draftPolicy={draftPolicy}
        onSelectPolicy={handleSelectPolicy}
        onTogglePolicyStatus={handleTogglePolicyStatus}
        setDraftPolicy={setDraftPolicy}
        handleDeletePolicy={handleDeletePolicy}
        handleCancelEdit={handleCancelEdit}
        handleSavePolicy={handleSavePolicy}
        className="rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
        tableClassName="text-[13px]"
        showDetail={false}
      />
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
      <FileUploadProtectionContent
        variant={preview.variant}
        showToolbar={false}
        showPagination={false}
        previewLimit={5}
        allowRowExpand={false}
        previewRows={preview.rows}
      />
    </Motion.div>
  );
}

export default function PolicyManagementSection() {
  const [policyRows, setPolicyRows] = useState(POLICY_PREVIEW_ROWS);
  const [selectedId, setSelectedId] = useState(POLICY_PREVIEW_ROWS[0]?.id ?? null);
  const [draftPolicy, setDraftPolicy] = useState(() =>
    POLICY_PREVIEW_ROWS[0] ? createPolicyDraft(POLICY_PREVIEW_ROWS[0]) : null
  );

  const selectedPolicy = useMemo(
    () => policyRows.find(policy => policy.id === selectedId) ?? null,
    [policyRows, selectedId]
  );

  const handleSelectPolicy = policyId => {
    const policy = policyRows.find(item => item.id === policyId);
    setSelectedId(policyId);
    setDraftPolicy(policy ? createPolicyDraft(policy) : null);
  };

  const handleTogglePolicyStatus = policyId => {
    setPolicyRows(current =>
      current.map(policy =>
        policy.id === policyId
          ? { ...policy, status: policy.status === '사용' ? '미사용' : '사용' }
          : policy
      )
    );
    setDraftPolicy(current =>
      current && current.id === policyId
        ? { ...current, status: current.status === '사용' ? '미사용' : '사용' }
        : current
    );
  };

  const handleDeletePolicy = () => {
    if (!selectedPolicy) return;

    setPolicyRows(current => {
      const nextRows = current.filter(policy => policy.id !== selectedPolicy.id);
      const nextSelected = nextRows[0] ?? null;

      setSelectedId(nextSelected?.id ?? null);
      setDraftPolicy(nextSelected ? createPolicyDraft(nextSelected) : null);

      return nextRows;
    });
  };

  const handleCancelEdit = () => {
    if (!selectedPolicy) return;
    setDraftPolicy(createPolicyDraft(selectedPolicy));
  };

  const handleSavePolicy = () => {
    if (!draftPolicy) return;

    const savedPolicy = {
      ...draftPolicy,
      action:
        draftPolicy.handling === '허용'
          ? '허용'
          : draftPolicy.handling === '마스킹'
            ? '마스킹 후 전송'
            : draftPolicy.handling,
      serviceLabel: draftPolicy.services.join(', '),
    };

    setPolicyRows(current =>
      current.map(policy => (policy.id === savedPolicy.id ? savedPolicy : policy))
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
                selectedPolicy={selectedPolicy}
                draftPolicy={draftPolicy}
                handleSelectPolicy={handleSelectPolicy}
                handleTogglePolicyStatus={handleTogglePolicyStatus}
                handleDeletePolicy={handleDeletePolicy}
                handleCancelEdit={handleCancelEdit}
                handleSavePolicy={handleSavePolicy}
                setDraftPolicy={setDraftPolicy}
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
