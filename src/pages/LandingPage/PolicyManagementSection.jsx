import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

import {
  POLICY_PREVIEW_POLICIES,
  PolicyDetailPanel,
  PolicyManagementTable,
  createPolicyDraft,
} from '@/pages/PolicyPage/PolicyPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const POLICY_PREVIEW_ROWS = POLICY_PREVIEW_POLICIES.slice(0, 4);

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

function PolicyDetailCard({
  draftPolicy,
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
      className="overflow-hidden rounded-[28px] border border-[#D8D0FF] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
    >
      {draftPolicy ? (
        <PolicyDetailPanel
          draftPolicy={draftPolicy}
          handleDeletePolicy={handleDeletePolicy}
          handleCancelEdit={handleCancelEdit}
          handleSavePolicy={handleSavePolicy}
          setDraftPolicy={setDraftPolicy}
        />
      ) : null}
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
                title={<>어떤 기준으로 탐지하고 처리할지 직접 설정합니다</>}
                desc={
                  <>
                    개인정보, 기밀정보, 프롬프트 인젝션 같은 탐지 기준을 정책으로 관리합니다.
                    <br />
                    서비스별 적용 범위와 허용·마스킹·차단 조치를 한 화면에서 조정합니다.
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
              <PolicyDetailCard
                draftPolicy={draftPolicy}
                handleDeletePolicy={handleDeletePolicy}
                handleCancelEdit={handleCancelEdit}
                handleSavePolicy={handleSavePolicy}
                setDraftPolicy={setDraftPolicy}
              />
            </Motion.div>

            <Motion.div className="max-w-xl lg:order-2" {...SECTION_TITLE_REVEAL}>
              <SectionTitle
                eyebrow="POLICY DETAIL"
                title={<>탐지 항목과 조치 방식을 세부 기준으로 조정합니다</>}
                desc={
                  <>
                    선택한 정책의 적용 서비스, 탐지 항목, 예외 조건, 관리자 알림을 세밀하게
                    설정합니다.
                    <br />
                    업무 목적에 따라 허용·마스킹·차단 기준을 빠르게 바꿀 수 있습니다.
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
