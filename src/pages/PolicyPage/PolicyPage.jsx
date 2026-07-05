import { Fragment, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import AppButton, { primaryButtonClassName } from '../../components/AppButton.jsx';
import FixedPaginationBar from '../../components/FixedPaginationBar.jsx';
import ServiceLogoBadge from '../../components/ServiceLogoBadge.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import {
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import useAdaptiveRowsPerPage from '../../hooks/useAdaptiveRowsPerPage.js';
import PageLayout from '../../layout/PageLayout.jsx';
import { usePatchPolicyEnabledMutation, usePoliciesQuery } from '../../queries/policyQueries.js';
import { FileUploadProtectionContent } from '../../components/settings/SettingsContent.jsx';

const MAX_ROWS_PER_PAGE = 10;
const FILE_BLOCKING_PAGE_META = {
  title: 'Policy Management',
  subtitle: 'File Blocking Settings',
};
const PRIVACY_PROTECTION_PAGE_META = {
  title: 'Policy Management',
  subtitle: 'Privacy Protection Settings',
};
const POLICY_SETTINGS_BACK_BUTTON_CLASS = 'h-12 shrink-0 px-5';
const POLICY_SETTINGS_NAV_BUTTON_CLASS = `${primaryButtonClassName} h-12 shrink-0 px-5`;
const POLICY_SETTING_DEFINITIONS = [
  {
    view: 'fileUploadSettings',
    label: '파일 업로드 보호 정책',
    codes: ['file_upload_protection'],
    nameKeywords: ['파일 업로드 보호'],
  },
  {
    view: 'privacySettings',
    label: '개인정보 보호 정책',
    codes: [
      'privacy_protection',
      'privacy_policy',
      'personal_information_protection',
      'personal_data_protection',
      'pii_protection',
    ],
    nameKeywords: ['개인정보 보호'],
  },
];

export const POLICY_PREVIEW_POLICIES = [
  {
    id: 'pol_preview_privacy',
    code: 'privacy_protection',
    name: '개인정보 보호 정책',
    category: '개인정보',
    services: ['ChatGPT'],
    serviceLabel: 'ChatGPT',
    action: '마스킹 후 전송',
    status: '사용',
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: false,
    updatedAt: '2026-06-02 13:08',
    description: '업로드 파일의 민감정보, 실행 코드, 악성 패턴을 검사한 뒤 이상 시 차단합니다.',
    detects: ['API Key'],
    exceptions: [],
    handling: '차단',
    alerts: { admin: false },
  },
];

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getPolicyEntries(data) {
  if (Array.isArray(data)) return data.map((value, index) => [value?.code ?? index, value]);
  if (Array.isArray(data?.policies)) {
    return data.policies.map((value, index) => [value?.code ?? index, value]);
  }
  if (data && typeof data === 'object') return Object.entries(data);

  return [];
}

function getAppliedServices(data) {
  return toStringList(data?.applied_services ?? data?.appliedServices);
}

function toStringList(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (item && typeof item === 'object') {
          return (
            item.name ??
            item.service_name ??
            item.serviceName ??
            item.service_code ??
            item.serviceCode ??
            item.code ??
            item.id
          );
        }

        return item;
      })
      .map(item => String(item).trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, itemValue]) => {
        if (typeof itemValue === 'boolean') return itemValue;
        if (itemValue && typeof itemValue === 'object' && 'enabled' in itemValue) {
          return Boolean(itemValue.enabled);
        }

        return true;
      })
      .map(([itemKey, itemValue]) => {
        if (itemValue && typeof itemValue === 'object') {
          return (
            itemValue.name ??
            itemValue.service_name ??
            itemValue.serviceName ??
            itemValue.service_code ??
            itemValue.serviceCode ??
            itemValue.code ??
            itemKey
          );
        }

        return itemKey;
      })
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  return [];
}

function getPolicyAction(handling, action) {
  if (action) return String(action);
  if (handling === '검토필요' || handling === '허용') return '검토필요';
  if (handling === '마스킹') return '마스킹 후 전송';

  return handling;
}

function getPolicySettingDefinition(policy) {
  if (!policy) return null;

  const normalizedCode = String(policy.code ?? '').toLowerCase();
  const policyName = String(policy.name ?? '');

  return (
    POLICY_SETTING_DEFINITIONS.find(
      definition =>
        definition.codes.includes(normalizedCode) ||
        definition.nameKeywords.some(keyword => policyName.includes(keyword))
    ) ?? null
  );
}

function getPolicySettingsButtonLabel(policy) {
  const definition = getPolicySettingDefinition(policy);
  const policyName =
    definition?.label ?? String(policy?.name ?? '').replace('보호정책', '보호 정책');

  return `${policyName} 설정`;
}

function normalizePolicy([key, value]) {
  const policy = value && typeof value === 'object' ? value : {};
  const code = String(policy.code ?? policy.policy_code ?? policy.policyCode ?? policy.id ?? key);
  const services = toStringList(policy.applied_services ?? policy.appliedServices);
  const serviceLabel =
    policy.serviceLabel ?? policy.service_label ?? (services.length ? services.join(', ') : '-');
  const handling = String(policy.handling ?? policy.action ?? '검토필요');
  const enabled =
    typeof value === 'boolean'
      ? value
      : Boolean(policy.enabled ?? policy.is_enabled ?? policy.isEnabled);

  return {
    id: code,
    code,
    name: String(policy.name ?? policy.policy_name ?? policy.policyName ?? code),
    category: String(policy.category ?? policy.type ?? '-'),
    services,
    serviceLabel,
    action: getPolicyAction(handling, policy.action),
    status: enabled ? '사용' : '미사용',
    updatedAt: String(
      policy.updated_at_kst ??
        policy.updatedAtKst ??
        policy.updatedAt ??
        policy.updated_at ??
        policy.modified_at ??
        policy.modifiedAt ??
        '-'
    ),
    description: String(policy.description ?? ''),
    detects: toStringList(policy.detects ?? policy.detection_targets ?? policy.detectionTargets),
    exceptions: toStringList(policy.exceptions),
    handling,
    alerts: {
      admin: Boolean(policy.alerts?.admin ?? policy.admin_alert ?? policy.adminAlert),
    },
    enabled,
  };
}

export function createPolicyDraft(policy) {
  return {
    ...policy,
    services: [...policy.services],
    detects: [...policy.detects],
    exceptions: [...policy.exceptions],
    alerts: { ...policy.alerts },
  };
}

function SupportedServiceList({ services }) {
  const normalizedServices = services?.length ? services : [];

  if (!normalizedServices.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-[#D8DEEA] bg-white px-5 py-6 text-sm font-semibold text-[#94A3B8]">
        적용중인 서비스가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(6.75rem,7.5rem))] gap-3">
      {normalizedServices.map(service => (
        <div
          key={service}
          className="group flex min-h-[6.75rem] w-full max-w-[7.5rem] flex-col items-center justify-center gap-3 rounded-[8px] border border-[#E1DDF8] bg-white px-3 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#A99DFF] hover:shadow-[0_14px_30px_rgba(106,90,224,0.14)]"
        >
          <ServiceLogoBadge
            name={service}
            className="h-12 w-12 rounded-[8px] !border-transparent !bg-transparent !shadow-none"
            iconStyle={{ height: '34px', width: '34px' }}
          />
          <span className="max-w-full truncate text-center text-xs font-semibold text-[#57534E] transition group-hover:text-[#5B4FD2] sm:text-sm">
            {service}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusToggleIndicator({ checked, ariaLabel, disabled = false, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={joinClasses(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition duration-200 hover:brightness-[1.04] disabled:cursor-not-allowed disabled:opacity-60',
        checked
          ? 'border-[#5B4BD7] bg-[#5B4BD7] shadow-[0_8px_18px_rgba(91,75,215,0.28)]'
          : 'border-[#D5CFF5] bg-[#C8BDEB]'
      )}
    >
      <span
        className={joinClasses(
          'h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,18,20,0.18)] transition duration-200',
          checked ? 'translate-x-[1.35rem]' : 'translate-x-[0.15rem]'
        )}
      />
    </button>
  );
}

export function PolicyDetailPanel({ draftPolicy, onOpenPolicySettings }) {
  const settingDefinition = getPolicySettingDefinition(draftPolicy);
  const description =
    settingDefinition?.view === 'fileUploadSettings'
      ? '파일 업로드 시 적용할 차단 기준을 관리할 수 있습니다.'
      : '선택된 정책의 세부 설정을 관리할 수 있습니다.';

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#FCFDFF] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex min-w-0 items-center gap-2.5 text-[0.92rem] font-semibold text-[#64708B]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9B8CF8]" aria-hidden="true" />
          {description}
        </p>
        {settingDefinition ? (
          <button
            type="button"
            onClick={() => onOpenPolicySettings?.(settingDefinition.view)}
            className={POLICY_SETTINGS_NAV_BUTTON_CLASS}
          >
            {getPolicySettingsButtonLabel(draftPolicy)}
            <ChevronRight className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function PolicyManagementTable({
  rows,
  selectedId,
  onSelectPolicy,
  onTogglePolicyStatus,
  className = '',
  tableClassName = '',
}) {
  return (
    <div className={joinClasses(monitoringTableSurfaceClass, className)}>
      <div className="overflow-x-auto">
        <table
          className={joinClasses(
            'min-w-[min(100%,47.5rem)] text-left',
            monitoringTableClass,
            tableClassName
          )}
        >
          <thead className={monitoringTableHeadClass}>
            <tr className={monitoringTableHeaderRowClass}>
              <th className={`${monitoringTableHeaderCellClass} w-12 px-5 sm:px-6`} />
              <th className={`${monitoringTableHeaderCellClass} w-[22%]`}>정책명</th>
              <th className={`${monitoringTableHeaderCellClass} w-[64%]`}>설명</th>
              <th className={`${monitoringTableHeaderCellClass} w-[14%] !text-center`}>
                사용 여부
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((policy, index) => {
              const isSelected = policy.id === selectedId;

              return (
                <tr
                  key={policy.id}
                  className={monitoringTableRowClass({
                    selected: isSelected,
                    striped: index % 2 === 1,
                    interactive: true,
                  })}
                  onClick={() => onSelectPolicy?.(policy.id)}
                >
                  <td className={monitoringTableCellClass(index, 'px-5 align-middle sm:px-6')}>
                    <button
                      type="button"
                      aria-label={`${policy.name} 선택`}
                      className={joinClasses(
                        'flex h-5 w-5 items-center justify-center rounded-full border transition',
                        isSelected ? 'border-[#4338CA]' : 'border-slate-300'
                      )}
                    >
                      <span
                        className={joinClasses(
                          'h-2.5 w-2.5 rounded-full transition',
                          isSelected ? 'bg-[#4338CA]' : 'bg-transparent'
                        )}
                      />
                    </button>
                  </td>
                  <td
                    className={monitoringTableCellClass(
                      index,
                      'whitespace-nowrap font-semibold text-slate-800'
                    )}
                  >
                    {policy.name}
                  </td>
                  <td className={monitoringTableCellClass(index)}>
                    <div className="truncate text-slate-600" title={policy.description}>
                      {policy.description || '-'}
                    </div>
                  </td>
                  <td
                    className={monitoringTableCellClass(
                      index,
                      'whitespace-nowrap text-center font-semibold text-slate-600'
                    )}
                  >
                    <StatusToggleIndicator
                      checked={policy.status === '사용'}
                      ariaLabel={`${policy.name} 사용 여부`}
                      onToggle={event => {
                        event.stopPropagation();
                        onTogglePolicyStatus?.(policy.id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PolicyPage() {
  const { setPageMetaOverride } = useOutletContext() ?? {};
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get('view');
  const activeView = ['fileUploadSettings', 'privacySettings'].includes(requestedView)
    ? requestedView
    : 'policies';
  const [selectedId, setSelectedId] = useState(null);
  const [draftPolicy, setDraftPolicy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isError, isFetching, isLoading } = usePoliciesQuery();
  const {
    mutate: patchPolicyEnabled,
    isPending: isSaving,
    variables,
  } = usePatchPolicyEnabledMutation();
  const { containerRef: tableAreaRef, rowsPerPage } = useAdaptiveRowsPerPage({
    maxRows: MAX_ROWS_PER_PAGE,
    minRows: 4,
    rowHeight: 55,
  });

  useEffect(() => {
    if (!setPageMetaOverride) return undefined;

    setPageMetaOverride(
      activeView === 'fileUploadSettings'
        ? FILE_BLOCKING_PAGE_META
        : activeView === 'privacySettings'
          ? PRIVACY_PROTECTION_PAGE_META
          : null
    );

    return () => setPageMetaOverride(null);
  }, [activeView, setPageMetaOverride]);

  const policyList = useMemo(() => getPolicyEntries(data).map(normalizePolicy), [data]);
  const filteredPolicies = policyList;
  const totalPages = Math.max(1, Math.ceil(filteredPolicies.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const visiblePolicies = filteredPolicies.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const selectedPolicy = policyList.find(policy => policy.id === selectedId) ?? null;
  const savingPolicyCode = isSaving ? variables?.code : null;
  const appliedServices = useMemo(() => {
    if (draftPolicy?.services?.length) {
      return draftPolicy.services;
    }

    return getAppliedServices(data);
  }, [data, draftPolicy]);

  const handleSelectPolicy = policyId => {
    if (selectedId === policyId) {
      setSelectedId(null);
      setDraftPolicy(null);
      return;
    }

    const policy = policyList.find(item => item.id === policyId);
    setSelectedId(policyId);
    setDraftPolicy(policy ? createPolicyDraft(policy) : null);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    setSelectedId(null);
    setDraftPolicy(null);
  };

  const handleChangeView = view => {
    setSelectedId(null);
    setDraftPolicy(null);
    setCurrentPage(1);
    setSearchParams(current => {
      const nextParams = new URLSearchParams(current);

      if (view === 'policies') {
        nextParams.delete('view');
      } else {
        nextParams.set('view', view);
      }

      return nextParams;
    });
  };

  const handleTogglePolicyStatus = policyId => {
    const policy = policyList.find(item => item.id === policyId);
    if (!policy) return;

    patchPolicyEnabled({
      code: policy.code,
      enabled: !policy.enabled,
    });
  };

  const statusMessage = isError
    ? '정책 목록을 불러오지 못했습니다.'
    : isLoading
      ? '정책 목록을 불러오는 중입니다.'
      : isFetching
        ? '정책 목록을 갱신하는 중입니다.'
        : !filteredPolicies.length
          ? '등록된 정책이 없습니다.'
          : '';

  return (
    <PageLayout>
      <div className="flex min-h-0 flex-1 flex-col gap-5 pb-20">
        {activeView === 'policies' ? (
          <>
            <section className="px-1">
              <h3 className="mb-3 text-base font-bold text-slate-900">적용중인 서비스</h3>
              <SupportedServiceList services={appliedServices} />
            </section>

            <SectionCard className="overflow-hidden">
              <div ref={tableAreaRef} className={monitoringTableSurfaceClass}>
                <div className="overflow-x-auto">
                  <table className={`min-w-[min(100%,47.5rem)] ${monitoringTableClass} text-left`}>
                    <thead className={monitoringTableHeadClass}>
                      <tr className={monitoringTableHeaderRowClass}>
                        <th className={`${monitoringTableHeaderCellClass} w-12 px-5 sm:px-6`} />
                        <th className={`${monitoringTableHeaderCellClass} w-[22%]`}>정책명</th>
                        <th className={`${monitoringTableHeaderCellClass} w-[64%]`}>설명</th>
                        <th className={`${monitoringTableHeaderCellClass} w-[14%] !text-center`}>
                          사용 여부
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visiblePolicies.map((policy, index) => {
                        const isSelected = policy.id === selectedId;

                        return (
                          <Fragment key={policy.id}>
                            <tr
                              className={monitoringTableRowClass({
                                selected: isSelected,
                                striped: index % 2 === 1,
                                interactive: true,
                              })}
                              onClick={() => handleSelectPolicy(policy.id)}
                            >
                              <td
                                className={monitoringTableCellClass(
                                  index,
                                  'px-5 align-middle sm:px-6'
                                )}
                              >
                                <button
                                  type="button"
                                  aria-label={`${policy.name} 선택`}
                                  className={joinClasses(
                                    'flex h-5 w-5 items-center justify-center rounded-full border transition',
                                    isSelected ? 'border-[#4338CA]' : 'border-slate-300'
                                  )}
                                >
                                  <span
                                    className={joinClasses(
                                      'h-2.5 w-2.5 rounded-full transition',
                                      isSelected ? 'bg-[#4338CA]' : 'bg-transparent'
                                    )}
                                  />
                                </button>
                              </td>
                              <td
                                className={monitoringTableCellClass(
                                  index,
                                  'whitespace-nowrap font-semibold text-slate-800'
                                )}
                              >
                                {policy.name}
                              </td>
                              <td className={monitoringTableCellClass(index)}>
                                <div className="truncate text-slate-600" title={policy.description}>
                                  {policy.description || '-'}
                                </div>
                              </td>
                              <td
                                className={monitoringTableCellClass(
                                  index,
                                  'whitespace-nowrap text-center font-semibold text-slate-600'
                                )}
                              >
                                <StatusToggleIndicator
                                  checked={policy.status === '사용'}
                                  ariaLabel={`${policy.name} 사용 여부`}
                                  disabled={savingPolicyCode === policy.code}
                                  onToggle={event => {
                                    event.stopPropagation();
                                    handleTogglePolicyStatus(policy.id);
                                  }}
                                />
                              </td>
                            </tr>
                            {isSelected && selectedPolicy && draftPolicy ? (
                              <tr className="bg-[#FFFFFF]">
                                <td colSpan={4} className="border-t border-[#E6EAF4] px-0 py-0">
                                  <PolicyDetailPanel
                                    draftPolicy={draftPolicy}
                                    onOpenPolicySettings={handleChangeView}
                                  />
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {statusMessage ? (
                  <div className="px-6 py-12 text-center text-sm text-slate-400">
                    {statusMessage}
                  </div>
                ) : null}
              </div>
            </SectionCard>

            {filteredPolicies.length ? (
              <FixedPaginationBar
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            ) : null}
          </>
        ) : activeView === 'fileUploadSettings' ? (
          <FileUploadProtectionContent
            toolbarAction={
              <AppButton
                onClick={() => handleChangeView('policies')}
                className={POLICY_SETTINGS_BACK_BUTTON_CLASS}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                정책 관리로 이동
              </AppButton>
            }
          />
        ) : (
          <FileUploadProtectionContent
            variant="privacy"
            toolbarAction={
              <AppButton
                onClick={() => handleChangeView('policies')}
                className={POLICY_SETTINGS_BACK_BUTTON_CLASS}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                정책 관리로 이동
              </AppButton>
            }
          />
        )}
      </div>
    </PageLayout>
  );
}
