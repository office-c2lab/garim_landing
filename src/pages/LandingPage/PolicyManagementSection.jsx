import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

import { FileUploadProtectionContent } from '@/components/settings/SettingsContent.jsx';
import {
  PolicyDetailPanel,
  PolicyManagementTable,
  POLICY_PREVIEW_POLICIES,
  createPolicyDraft,
} from '@/pages/PolicyPage/PolicyPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const POLICY_PREVIEW_ROWS = POLICY_PREVIEW_POLICIES.filter(
  policy => policy.code !== 'prompt_injection'
).slice(0, 4);

const FILE_UPLOAD_PREVIEW_ROWS = [
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
];

const SECRET_FILE_PREVIEW_ROWS = [
  {
    id: 'secret-1',
    category: '재무 실적 파일',
    keywords: ['매출 실적', '영업이익', '원가율'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'secret-2',
    category: '계약서 초안 파일',
    keywords: ['계약 조건', '견적 금액', '거래처명'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'secret-3',
    category: '사업 전략 발표 파일',
    keywords: ['시장 진입 전략', '로드맵', '신규 사업'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'secret-4',
    category: '인사 평가 문서',
    keywords: ['평가 등급', '연봉 조정', '승진 후보'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'secret-5',
    category: '소스코드 파일',
    keywords: ['repository', 'access token', 'internal api'],
    action: '차단',
    enabled: true,
  },
];

const HARMFUL_EXPRESSION_PREVIEW_ROWS = [
  {
    id: 'harmful-1',
    category: '비속어',
    keywords: ['욕설', '모욕 표현'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'harmful-2',
    category: '혐오발언',
    keywords: ['차별 표현', '혐오 표현'],
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
    category: '성적 표현',
    keywords: ['성희롱', '노골적 표현'],
    action: '차단',
    enabled: true,
  },
  {
    id: 'harmful-5',
    category: '자해 표현',
    keywords: ['자해 암시', '극단 선택'],
    action: '차단',
    enabled: true,
  },
];

function PolicySettingsPreview({ selectedPolicy }) {
  const isPrivacyPolicy = selectedPolicy?.code === 'privacy_protection';
  const isFilePolicy = selectedPolicy?.code === 'file_upload_protection';
  const isSecretPolicy = selectedPolicy?.code === 'secret_protection';
  const isHarmfulPolicy = selectedPolicy?.code === 'harmful_expression_protection';

  if (!isPrivacyPolicy && !isFilePolicy && !isSecretPolicy && !isHarmfulPolicy) {
    return (
      <PolicyDetailPanel draftPolicy={selectedPolicy ? createPolicyDraft(selectedPolicy) : null} />
    );
  }

  return (
    <FileUploadProtectionContent
      key={selectedPolicy?.code ?? 'privacy_protection'}
      variant={isFilePolicy ? 'file' : 'privacy'}
      showToolbar={false}
      showPagination={false}
      previewLimit={5}
      allowRowExpand={false}
      previewRows={
        isFilePolicy
          ? FILE_UPLOAD_PREVIEW_ROWS
          : isSecretPolicy
            ? SECRET_FILE_PREVIEW_ROWS
            : isHarmfulPolicy
              ? HARMFUL_EXPRESSION_PREVIEW_ROWS
              : null
      }
    />
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
              <PolicyManagementTable
                rows={policyRows}
                selectedId={selectedId}
                onSelectPolicy={handleSelectPolicy}
                onTogglePolicyStatus={handleTogglePolicyStatus}
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
