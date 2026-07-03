import { ChevronDown, Download, Eye, EyeOff } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppButton from '../../components/AppButton.jsx';
import AppSearchField from '../../components/AppSearchField.jsx';
import FixedPaginationBar from '../../components/FixedPaginationBar.jsx';
import {
  DateRangePicker,
  MonitoringActionButton,
  MonitoringDataTable,
  MonitoringDropdown,
  MonitoringResetButton,
} from '../../components/monitoring/MonitoringListComponents.jsx';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../../constants/contentLayout.js';
import { getStatusTextClassName as getStatusColorClassName } from '../../constants/statusColors.js';
import useAdaptiveRowsPerPage from '../../hooks/useAdaptiveRowsPerPage.js';
import { useDropdownSelectOptionsQuery } from '../../queries/dropdownSettingsQueries.js';
import { useMonitoringEventsQuery } from '../../queries/monitoringQueries.js';

const ALL_USERS_OPTION = '사용자';
const ALL_DEPARTMENTS_OPTION = '부서';
const ALL_POSITIONS_OPTION = '직급';
const ALL_POLICIES_OPTION = '정책';
const MAX_ROWS_PER_PAGE = 10;

function normalizeDropdownOptionNames(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => String(item?.name ?? '').trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, 'ko'));
}

function normalizeMonitoringEvent(event, index) {
  if (event.detectedAt) {
    const originalPrompt = getOriginalPromptDetail(event);
    const forwardedPrompt = getForwardedPromptDetail(event);

    return {
      ...event,
      prompt: forwardedPrompt,
      promptDetail: originalPrompt,
      originalPromptDetail: originalPrompt,
      forwardedPromptDetail: forwardedPrompt,
      policyCode: getPolicyCode(event),
      policyName: getPolicyName(event),
      detectionDetail: getGuardrailReason(event),
      actionDetail: getActionDetail(event),
      department:
        event.department ?? event.dept ?? event.organization ?? event.org ?? event.team ?? '-',
      position: event.position ?? event.jobTitle ?? event.job_title ?? event.role ?? '-',
      maskedPromptDetail: getMaskedPromptDetail(event),
      attachedFiles: normalizeAttachedFiles(event),
      attachmentAnalysisResults: normalizeAttachmentAnalysisResults(event),
    };
  }

  const result = event.status ?? '정상';
  const isNormal = result === '정상';
  const originalPrompt = getOriginalPromptDetail(event);
  const forwardedPrompt = getForwardedPromptDetail(event);
  const answer = event.ai_response ?? '-';
  const userName =
    event.username ?? event.user_name ?? event.user ?? event.user_id ?? event.userId ?? '-';

  return {
    id: event.no ?? `${event.time_kst ?? 'event'}-${index}`,
    no: event.no ?? index + 1,
    detectedAt: event.time_kst ?? '-',
    aiType: event.service ?? '-',
    organization: '-',
    prompt: forwardedPrompt,
    result,
    content: getGuardrailReason(event),
    userIp: event.client_ip ?? '-',
    userId: userName,
    department:
      event.department ?? event.dept ?? event.organization ?? event.org ?? event.team ?? '-',
    position: event.position ?? event.jobTitle ?? event.job_title ?? event.role ?? '-',
    level: isNormal ? 'safe' : 'danger',
    promptDetail: originalPrompt,
    originalPromptDetail: originalPrompt,
    forwardedPromptDetail: forwardedPrompt,
    maskedPromptDetail: getMaskedPromptDetail(event),
    answerDetail: answer,
    policyCode: getPolicyCode(event),
    policyName: getPolicyName(event),
    attachedFiles: normalizeAttachedFiles(event),
    attachmentAnalysisResults: normalizeAttachmentAnalysisResults(event),
    detectionDetail: getGuardrailReason(event),
    actionDetail: getActionDetail(event),
  };
}

function getOriginalPromptDetail(event) {
  return (
    event.originalPromptDetail ??
    event.original_prompt_detail ??
    event.originalInput ??
    event.original_input ??
    event.promptDetail ??
    event.prompt ??
    event.input ??
    '-'
  );
}

function getForwardedPromptDetail(event) {
  return (
    event.forwardedPromptDetail ??
    event.forwarded_prompt_detail ??
    event.forwardedInput ??
    event.forwarded_input ??
    event.maskedPromptDetail ??
    event.masked_prompt_detail ??
    event.maskedPrompt ??
    event.masked_prompt ??
    event.masked_input ??
    event.maskedInput ??
    '-'
  );
}

function getGuardrailReason(event) {
  return (
    event.guardrailReason ??
    event.guardrail_reason ??
    event.detectionDetail ??
    event.detection_detail ??
    event.reason ??
    ''
  );
}

function getPolicyCode(event) {
  return event.policyCode ?? event.policy_code ?? '';
}

function getPolicyName(event) {
  return event.policyName ?? event.policy_name ?? event.policy ?? '';
}

function getActionDetail(event) {
  return event.actionDetail ?? event.action_detail ?? event.ai_response ?? '';
}

function getMaskedPromptDetail(event) {
  return (
    event.maskedPromptDetail ??
    event.masked_prompt_detail ??
    event.maskedPrompt ??
    event.masked_prompt ??
    event.masked_input ??
    event.maskedInput ??
    '-'
  );
}

function normalizeAttachedFiles(event) {
  const rawFiles =
    event.attachedFiles ??
    event.attachments ??
    event.files ??
    event.file_list ??
    event.uploaded_files ??
    event.fileName ??
    event.filename ??
    event.file_name;

  if (!rawFiles) {
    return [];
  }

  const files = Array.isArray(rawFiles) ? rawFiles : [rawFiles];

  return files
    .map(file => {
      if (!file) return '';

      if (typeof file === 'string') {
        return file;
      }

      const name =
        file.name ?? file.fileName ?? file.filename ?? file.file_name ?? file.originalName;
      const size = file.size ?? file.fileSize ?? file.file_size;

      if (!name) return '';

      return size ? `${name} (${size})` : name;
    })
    .filter(Boolean);
}

function normalizeAttachmentAnalysisResults(event) {
  const rawResults =
    event.attachmentAnalysisResults ??
    event.attachment_analysis_results ??
    event.fileAnalysisResults ??
    event.file_analysis_results ??
    event.attachmentAnalysis ??
    event.attachment_analysis ??
    event.fileAnalysis ??
    event.file_analysis;

  if (!rawResults) {
    return [];
  }

  const results = Array.isArray(rawResults) ? rawResults : [rawResults];

  return results
    .flatMap(result => {
      if (!result) return [];

      if (typeof result === 'string') {
        return result
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean);
      }

      const fileName =
        result.fileName ??
        result.filename ??
        result.file_name ??
        result.name ??
        result.originalName;
      const status = result.status ?? result.result ?? result.outcome;
      const detail = result.detail ?? result.message ?? result.description ?? result.reason;
      const detections = result.detections ?? result.detectedItems ?? result.detected_items;
      const detectionText = Array.isArray(detections) ? detections.join(', ') : detections;
      const parts = [fileName, status, detail, detectionText].filter(Boolean);

      return parts.length ? [parts.join(' - ')] : [];
    })
    .filter(Boolean);
}

function createDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - 13);

  return {
    startDate: formatDateValue(startDate),
    endDate: formatDateValue(endDate),
  };
}

function getLogStatusCategory(log) {
  const result = log.result ?? log.status;
  const actionDetail = log.actionDetail ?? '';

  if (result === '정상') return 'normal';
  if (result === '검토필요' || result === '허용') return 'allow';
  if (result === '마스킹') return 'masking';
  if (result === '차단') return 'block';

  if (actionDetail.includes('경고로 기록')) return 'allow';

  if (
    result === '개인정보 탐지' ||
    actionDetail.includes('마스킹') ||
    actionDetail.includes('치환') ||
    actionDetail.includes('대체') ||
    actionDetail.includes('제거한 버전')
  ) {
    return 'masking';
  }

  return 'block';
}

function getStatusLabel(row) {
  const statusCategory = getLogStatusCategory(row);

  if (statusCategory === 'allow') return '검토필요';
  if (statusCategory === 'masking') return '마스킹';
  if (statusCategory === 'block') return '차단';
  return '정상';
}

function getDetectedPolicyName(row) {
  return row.policyName || row.policy_name || '-';
}

function getStatusTextClassName(row) {
  return getStatusColorClassName(getLogStatusCategory(row));
}

function normalizeLogDateTime(value) {
  return String(value).replace(' ', 'T');
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildAnswerDetail(row) {
  return row.answerDetail || '-';
}

function buildPromptPanelState(row, showOriginal) {
  const statusCategory = getLogStatusCategory(row);

  if (statusCategory === 'normal') {
    return {
      title: '프롬프트',
      text: row.forwardedPromptDetail ?? row.originalPromptDetail ?? row.promptDetail ?? '-',
      toggleLabel: null,
      canToggle: false,
    };
  }

  if (showOriginal) {
    const toggleLabel =
      statusCategory === 'block' ? '차단 안내 보기' : '마스킹 처리된 프롬프트 보기';

    return {
      title: '원문 프롬프트',
      text: row.originalPromptDetail ?? row.promptDetail ?? '-',
      toggleLabel,
      canToggle: true,
    };
  }

  if (statusCategory === 'block') {
    return {
      title: '차단 안내',
      text: row.forwardedPromptDetail || '-',
      toggleLabel: '원문 프롬프트 보기',
      canToggle: true,
    };
  }

  if (statusCategory === 'masking') {
    return {
      title: '마스킹 처리된 프롬프트',
      text: row.forwardedPromptDetail ?? row.maskedPromptDetail ?? '-',
      toggleLabel: '원문 프롬프트 보기',
      canToggle: true,
    };
  }

  return {
    title: '실제 전달 프롬프트',
    text: row.forwardedPromptDetail ?? row.maskedPromptDetail ?? '-',
    toggleLabel: '원문 프롬프트 보기',
    canToggle: true,
  };
}

function buildDetailContext(row) {
  const statusCategory = getLogStatusCategory(row);
  const detectionDetail = row.detectionDetail || '-';
  const policyName = getDetectedPolicyName(row);

  return {
    policyName,
    actionStatus:
      statusCategory === 'allow'
        ? '검토필요 처리'
        : statusCategory === 'masking'
          ? '마스킹 처리'
          : statusCategory === 'block'
            ? '차단 처리'
            : '정상 처리',
    policyItems: policyName === '-' ? [] : [policyName],
    answerDetail: buildAnswerDetail(row),
    evidenceLines: splitDetailLines(detectionDetail),
    actionLines: ['-'],
  };
}

function splitDetailLines(value) {
  if (!value || value === '-') return ['-'];

  return String(value)
    .split('\n')
    .flatMap(line => line.split('. '))
    .map(line => line.replaceAll('·', '').trim())
    .filter(Boolean)
    .map(line => (line.endsWith('.') ? line : `${line}.`));
}

function DetailSectionLabel({ children }) {
  return <div className="text-[13px] font-bold tracking-[-0.01em] text-[#4A57D1]">{children}</div>;
}

function DetailSummaryItem({ label, value, valueClassName = '' }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-[#7C86A7]">{label}</p>
      <p
        className={`truncate pt-1 text-[13px] font-semibold tracking-[-0.01em] text-[#2E3A59] ${valueClassName}`.trim()}
      >
        {value}
      </p>
    </div>
  );
}

function IconButtonTooltip({ label, children }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 -translate-x-1/2 rounded-lg border border-[#C7D2FE] bg-white px-2.5 py-1.5 text-[12px] font-bold whitespace-nowrap text-[#4338CA] opacity-0 shadow-[0_10px_24px_rgba(67,56,202,0.14)] transition group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </div>
  );
}

function UserScopeFilterDropdown({
  selectedDepartment,
  selectedPosition,
  selectedUser,
  departmentOptions,
  positionOptions,
  userOptions,
  onDepartmentChange,
  onPositionChange,
  onUserChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const optionLabels = {
    [ALL_DEPARTMENTS_OPTION]: '전체',
    [ALL_POSITIONS_OPTION]: '전체',
    [ALL_USERS_OPTION]: '전체',
  };
  const selectedParts = [
    selectedDepartment !== ALL_DEPARTMENTS_OPTION ? selectedDepartment : '',
    selectedPosition !== ALL_POSITIONS_OPTION ? selectedPosition : '',
    selectedUser !== ALL_USERS_OPTION ? selectedUser : '',
  ].filter(Boolean);
  const displayValue = selectedParts.length ? selectedParts.join(' / ') : '사용자 필터';

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const sections = [
    {
      title: '부서',
      value: selectedDepartment,
      options: departmentOptions,
      onChange: onDepartmentChange,
    },
    {
      title: '직급',
      value: selectedPosition,
      options: positionOptions,
      onChange: onPositionChange,
    },
    {
      title: '사용자',
      value: selectedUser,
      options: userOptions,
      onChange: onUserChange,
    },
  ];

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        type="button"
        aria-label="사용자 필터"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className={`flex h-[var(--app-control-lg)] w-full cursor-pointer items-center gap-[var(--app-gap-xs)] rounded-[var(--app-radius-lg)] border pr-[var(--app-pad-xs)] pl-0 text-left transition ${
          isOpen
            ? 'border-[#A5B4FC] bg-[#EEF2FF] ring-[clamp(0.2rem,0.32vw,0.25rem)] ring-[#E0E7FF]'
            : 'border-slate-200 bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF] active:border-[#A5B4FC] active:bg-[#EEF2FF] focus:border-[#A5B4FC] focus:ring-[clamp(0.2rem,0.32vw,0.25rem)] focus:ring-[#E0E7FF]'
        }`.trim()}
      >
        <span className="flex min-w-0 flex-1 items-center px-[var(--app-pad-md)] text-[clamp(0.86rem,0.95vw,0.94rem)] font-medium leading-5 tracking-[0.01em] text-[#344054]">
          <span className="truncate">{displayValue}</span>
        </span>
        <ChevronDown
          className={`h-[var(--app-icon-md)] w-[var(--app-icon-md)] shrink-0 text-[#4338CA] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`.trim()}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+var(--app-gap-xs))] left-1/2 z-40 w-max max-w-[calc(100vw-(var(--app-page-x)*2))] -translate-x-1/2 overflow-hidden rounded-[var(--app-radius-lg)] border border-slate-200 bg-white shadow-[0_1rem_2rem_rgba(15,23,42,0.12)]">
          <div className="grid max-h-[min(44vh,18rem)] max-w-full overflow-auto md:grid-cols-[max-content_max-content_max-content]">
            {sections.map(section => (
              <section
                key={section.title}
                className="w-max min-w-[clamp(8.75rem,11vw,10rem)] max-w-[min(22rem,calc(100vw-(var(--app-page-x)*2)))] md:border-l md:border-[#E2E8F0] md:first:border-l-0"
              >
                <div className="border-b border-[#E2E8F0] bg-[#F8FAFF] px-[calc(var(--app-pad-md)*0.7)] py-[calc(var(--app-pad-sm)*0.75)] text-[clamp(0.84rem,0.95vw,0.92rem)] font-black text-[#667085]">
                  {section.title}
                </div>
                <div className="flex max-h-[min(32vh,12rem)] flex-col gap-[calc(var(--app-gap-xs)*0.35)] overflow-y-auto px-[calc(var(--app-pad-md)*0.65)] py-[calc(var(--app-pad-sm)*0.75)]">
                  {section.options.map(option => {
                    const isSelected = option === section.value;

                    return (
                      <button
                        key={`${section.title}-${option}`}
                        type="button"
                        onClick={() => section.onChange(option)}
                        title={optionLabels[option] ?? option}
                        className={`flex h-[var(--app-control-xs)] w-full shrink-0 cursor-pointer items-center gap-[var(--app-gap-xs)] px-[var(--app-pad-sm)] text-left transition ${
                          isSelected
                            ? 'app-solid-button rounded-[var(--app-radius-md)] bg-[#4338CA] text-[clamp(0.8rem,0.9vw,0.86rem)] font-bold leading-[150%] text-white'
                            : 'rounded-[var(--app-radius-sm)] bg-white text-[clamp(0.8rem,0.9vw,0.86rem)] font-normal leading-5 tracking-[0.01em] text-[#484848] hover:bg-[#F7F8FC]'
                        }`.trim()}
                      >
                        <span className="flex-1 whitespace-nowrap">
                          {optionLabels[option] ?? option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailPanel({ title, children, action }) {
  return (
    <section className="min-h-[clamp(7rem,8.9vw,8rem)] min-w-0 px-[var(--app-pad-md)] py-[var(--app-pad-md)]">
      <div className="flex items-center justify-between gap-[var(--app-gap-sm)] pb-[var(--app-pad-md)]">
        <DetailSectionLabel>{title}</DetailSectionLabel>
        {action}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function PromptVisibilityToggle({ showOriginal, onToggle, label }) {
  const ToggleIcon = showOriginal ? Eye : EyeOff;
  const buttonText = label ?? (showOriginal ? '처리 후 프롬프트 보기' : '원문 프롬프트 보기');

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold text-[#5B39D6]">{buttonText}</span>
      <button
        type="button"
        aria-label={buttonText}
        aria-pressed={showOriginal}
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F4F6FA] text-[#5B39D6] transition hover:bg-[#EEF2FF]"
      >
        <ToggleIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function DetailPanelText({ children, subtle = false }) {
  return (
    <div
      className={`monitoring-detail-scroll max-h-[min(28vh,13.75rem)] min-w-0 overflow-y-auto rounded-[var(--app-radius-sm)] border border-[#EEF1FB] bg-[#FCFDFF] px-[var(--app-pad-sm)] py-[var(--app-pad-xs)] text-[clamp(0.74rem,0.87vw,0.78rem)] leading-[1.7] whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
        subtle ? 'text-[#5B6686]' : 'text-[#2F3A56]'
      }`.trim()}
    >
      {children}
    </div>
  );
}

function DetailBulletList({ items, showMarkers = true }) {
  return (
    <ul className="monitoring-detail-scroll max-h-[min(28vh,13.75rem)] min-w-0 space-y-[var(--app-gap-xs)] overflow-y-auto rounded-[var(--app-radius-sm)] border border-[#EEF1FB] bg-[#FCFDFF] px-[var(--app-pad-sm)] py-[var(--app-pad-xs)] text-[clamp(0.74rem,0.87vw,0.78rem)] leading-[1.65] text-[#2F3A56]">
      {items.map(item => (
        <li key={item} className="flex min-w-0 gap-2">
          {showMarkers ? (
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#6A5AE0]" />
          ) : null}
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailFileList({ files }) {
  if (!files.length) {
    return <DetailPanelText subtle>첨부된 파일이 없습니다.</DetailPanelText>;
  }

  return <DetailBulletList items={files} />;
}

function DetailAnalysisList({ results }) {
  if (!results.length) {
    return <DetailPanelText subtle>분석 결과가 없습니다.</DetailPanelText>;
  }

  return <DetailBulletList items={results} />;
}

export function MonitoringLogExpandedRow({ row }) {
  const detail = buildDetailContext(row);
  const [showOriginalPrompt, setShowOriginalPrompt] = useState(false);
  const promptText = showOriginalPrompt
    ? (row.originalPromptDetail ?? row.promptDetail ?? row.prompt ?? '-')
    : detail.answerDetail.text;

  return (
    <div className="grid overflow-hidden bg-white lg:grid-cols-2">
      <DetailPanel title="탐지 정책">
        <DetailSummaryItem label="정책명" value={detail.policyName} />
      </DetailPanel>
      <DetailPanel title="처리 상태">
        <DetailSummaryItem label="상태" value={detail.actionStatus} />
      </DetailPanel>
      <DetailPanel
        title={showOriginalPrompt ? '원문 프롬프트' : detail.answerDetail.title}
        action={
          detail.answerDetail.canToggle ? (
            <PromptVisibilityToggle
              showOriginal={showOriginalPrompt}
              onToggle={() => setShowOriginalPrompt(current => !current)}
              label={detail.answerDetail.toggleLabel}
            />
          ) : null
        }
      >
        <DetailPanelText>{promptText}</DetailPanelText>
      </DetailPanel>
      <DetailPanel title="탐지 근거">
        <DetailAnalysisList results={detail.evidenceLines} />
      </DetailPanel>
    </div>
  );
}

export function MonitoringLogView({
  useStatusFilter = false,
  emptyMessage = '현재 조건에 맞는 모니터링 로그가 없습니다.',
}) {
  const [searchParams] = useSearchParams();
  const defaultDateRange = useMemo(() => createDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(
    () => searchParams.get('startDate') ?? defaultDateRange.startDate
  );
  const [endDate, setEndDate] = useState(
    () => searchParams.get('endDate') ?? defaultDateRange.endDate
  );
  const [selectedPolicy, setSelectedPolicy] = useState(ALL_POLICIES_OPTION);
  const [selectedDepartment, setSelectedDepartment] = useState(ALL_DEPARTMENTS_OPTION);
  const [selectedPosition, setSelectedPosition] = useState(ALL_POSITIONS_OPTION);
  const [selectedUser, setSelectedUser] = useState(
    () => searchParams.get('user') ?? ALL_USERS_OPTION
  );
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q') ?? '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [selectedLogId, setSelectedLogId] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [originalPromptRowIds, setOriginalPromptRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { containerRef: tableAreaRef, rowsPerPage } = useAdaptiveRowsPerPage({
    maxRows: MAX_ROWS_PER_PAGE,
    minRows: 4,
    rowHeight: 36,
  });
  const statusFilter = useStatusFilter ? (searchParams.get('status') ?? 'all') : 'all';
  const {
    data: monitoringData,
    isError,
    isFetching,
    isLoading,
  } = useMonitoringEventsQuery({
    statusFilter,
    q: searchQuery,
  });
  const { data: dropdownSelectData } = useDropdownSelectOptionsQuery();

  const monitoringLogs = useMemo(() => {
    if (isError) return [];

    return (monitoringData?.events ?? []).map(normalizeMonitoringEvent);
  }, [isError, monitoringData?.events]);

  const dropdownDepartmentOptions = useMemo(
    () => normalizeDropdownOptionNames(dropdownSelectData?.departments),
    [dropdownSelectData?.departments]
  );
  const dropdownPositionOptions = useMemo(
    () => normalizeDropdownOptionNames(dropdownSelectData?.positions),
    [dropdownSelectData?.positions]
  );

  const policyOptions = useMemo(() => {
    const policies = monitoringLogs
      .map(log => getDetectedPolicyName(log))
      .filter(policy => policy && policy !== '-')
      .sort((left, right) => left.localeCompare(right, 'ko'));

    return [ALL_POLICIES_OPTION, ...new Set(policies)];
  }, [monitoringLogs]);

  const departmentOptions = useMemo(() => {
    const logDepartments = monitoringLogs
      .map(log => log.department)
      .filter(department => department && department !== '-')
      .sort((left, right) => left.localeCompare(right, 'ko'));
    const departments = [...dropdownDepartmentOptions, ...logDepartments].filter(
      (value, index, array) => array.indexOf(value) === index
    );

    return [ALL_DEPARTMENTS_OPTION, ...departments];
  }, [dropdownDepartmentOptions, monitoringLogs]);

  const positionOptions = useMemo(() => {
    const logPositions = monitoringLogs
      .filter(log =>
        selectedDepartment === ALL_DEPARTMENTS_OPTION ? true : log.department === selectedDepartment
      )
      .map(log => log.position)
      .filter(position => position && position !== '-')
      .sort((left, right) => left.localeCompare(right, 'ko'));
    const positions = [...dropdownPositionOptions, ...logPositions].filter(
      (value, index, array) => array.indexOf(value) === index
    );

    return [ALL_POSITIONS_OPTION, ...positions];
  }, [dropdownPositionOptions, monitoringLogs, selectedDepartment]);

  const userOptions = useMemo(() => {
    const users = monitoringLogs
      .filter(log =>
        selectedDepartment === ALL_DEPARTMENTS_OPTION ? true : log.department === selectedDepartment
      )
      .filter(log =>
        selectedPosition === ALL_POSITIONS_OPTION ? true : log.position === selectedPosition
      )
      .map(log => log.userId)
      .filter(user => user && user !== '-')
      .sort((left, right) => left.localeCompare(right, 'ko'));

    return [ALL_USERS_OPTION, ...new Set(users)];
  }, [monitoringLogs, selectedDepartment, selectedPosition]);

  const filteredLogs = useMemo(() => {
    return monitoringLogs.filter(log => {
      const logDate = new Date(normalizeLogDateTime(log.detectedAt));
      const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const matchesDateRange =
        (!startBoundary || logDate >= startBoundary) && (!endBoundary || logDate <= endBoundary);
      const matchesPolicy =
        selectedPolicy === ALL_POLICIES_OPTION || getDetectedPolicyName(log) === selectedPolicy;
      const matchesDepartment =
        selectedDepartment === ALL_DEPARTMENTS_OPTION || log.department === selectedDepartment;
      const matchesPosition =
        selectedPosition === ALL_POSITIONS_OPTION || log.position === selectedPosition;
      const matchesUser = selectedUser === ALL_USERS_OPTION || log.userId === selectedUser;
      const normalizedSearchQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = normalizedSearchQuery
        ? [
            log.detectedAt,
            log.aiType,
            log.result,
            log.userIp,
            log.userId,
            log.department,
            log.position,
            log.prompt,
            log.promptDetail,
            log.originalPromptDetail,
            log.forwardedPromptDetail,
            log.maskedPromptDetail,
            log.answerDetail,
            log.detectionDetail,
            log.actionDetail,
            log.policyCode,
            log.policyName,
            getDetectedPolicyName(log),
            ...(log.attachedFiles ?? []),
            ...(log.attachmentAnalysisResults ?? []),
          ]
            .filter(Boolean)
            .some(value => String(value).toLowerCase().includes(normalizedSearchQuery))
        : true;
      const logStatusCategory = getLogStatusCategory(log);
      const matchesStatus = !useStatusFilter
        ? true
        : statusFilter === 'all'
          ? true
          : statusFilter === logStatusCategory;
      return (
        matchesDateRange &&
        matchesPolicy &&
        matchesDepartment &&
        matchesPosition &&
        matchesUser &&
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    endDate,
    monitoringLogs,
    selectedDepartment,
    selectedPolicy,
    selectedPosition,
    selectedUser,
    searchQuery,
    startDate,
    statusFilter,
    useStatusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const pagedLogs = useMemo(() => {
    const startIndex = (safePage - 1) * rowsPerPage;
    return filteredLogs.slice(startIndex, startIndex + rowsPerPage).map(log => ({
      ...log,
      displayResult: getStatusLabel(log),
      detectedPolicy: getDetectedPolicyName(log),
    }));
  }, [filteredLogs, rowsPerPage, safePage]);

  const statusMessage = isError
    ? '모니터링 데이터를 불러오지 못했습니다.'
    : isLoading
      ? '모니터링 데이터를 불러오는 중입니다.'
      : isFetching
        ? '모니터링 데이터를 갱신하는 중입니다.'
        : !filteredLogs.length
          ? emptyMessage
          : '';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  }, [statusFilter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!positionOptions.includes(selectedPosition)) {
      setSelectedPosition(ALL_POSITIONS_OPTION);
    }
  }, [positionOptions, selectedPosition]);

  useEffect(() => {
    if (!policyOptions.includes(selectedPolicy)) {
      setSelectedPolicy(ALL_POLICIES_OPTION);
    }
  }, [policyOptions, selectedPolicy]);

  useEffect(() => {
    if (!userOptions.includes(selectedUser)) {
      setSelectedUser(ALL_USERS_OPTION);
    }
  }, [selectedUser, userOptions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleToggleRowSelection = rowId => {
    setSelectedRowIds(current =>
      current.includes(rowId) ? current.filter(id => id !== rowId) : [...current, rowId]
    );
  };

  const handleToggleAllRowsSelection = rowIds => {
    setSelectedRowIds(current => {
      const allSelected = rowIds.every(id => current.includes(id));

      if (allSelected) {
        return current.filter(id => !rowIds.includes(id));
      }

      return [...new Set([...current, ...rowIds])];
    });
  };

  const handleSelectLog = log => {
    setSelectedLogId(current => {
      const isClosing = current === log.id;

      setSelectedRowIds(selectedCurrent => {
        if (isClosing) {
          return selectedCurrent.filter(id => id !== log.id);
        }

        return selectedCurrent.includes(log.id) ? selectedCurrent : [...selectedCurrent, log.id];
      });

      return isClosing ? null : log.id;
    });
  };

  const handleTogglePromptVisibility = rowId => {
    setOriginalPromptRowIds(current =>
      current.includes(rowId) ? current.filter(id => id !== rowId) : [...current, rowId]
    );
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  };

  const handleResetFilters = () => {
    setStartDate(defaultDateRange.startDate);
    setEndDate(defaultDateRange.endDate);
    setSelectedPolicy(ALL_POLICIES_OPTION);
    setSelectedDepartment(ALL_DEPARTMENTS_OPTION);
    setSelectedPosition(ALL_POSITIONS_OPTION);
    setSelectedUser(ALL_USERS_OPTION);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  };
  const handleDepartmentFilterChange = value => {
    setSelectedDepartment(value);
    setSelectedPosition(ALL_POSITIONS_OPTION);
    setSelectedUser(ALL_USERS_OPTION);
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  };
  const handlePositionFilterChange = value => {
    setSelectedPosition(value);
    setSelectedUser(ALL_USERS_OPTION);
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  };
  const handleUserFilterChange = value => {
    setSelectedUser(value);
    setCurrentPage(1);
    setSelectedLogId(null);
    setSelectedRowIds([]);
  };
  const hasSelectedRows = selectedRowIds.length > 0;

  return (
    <div
      className={`mx-auto mb-[calc(var(--app-pad-md)*-1)] flex h-[calc(100%+var(--app-pad-md))] min-h-0 w-full flex-col ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pt-[var(--app-page-top)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex h-full min-h-0 w-full flex-col ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        <div className="mt-[calc(var(--app-gap-xs)*-0.35)] w-full">
          <div className="mt-[calc(var(--app-gap-xs)/2)]">
            <div className="grid max-w-full items-end gap-[var(--app-gap-sm)] sm:grid-cols-2 lg:grid-cols-[minmax(7.75rem,0.72fr)_minmax(10.25rem,1fr)_minmax(12.5rem,1.22fr)_minmax(21rem,2.05fr)]">
              <DateRangePicker
                label="조회 기간"
                labelClassName="sr-only"
                startDate={startDate}
                endDate={endDate}
                onChange={range => {
                  setStartDate(range.startDate);
                  setEndDate(range.endDate);
                  setCurrentPage(1);
                }}
                widthClass="w-full min-w-0"
              />

              <MonitoringDropdown
                value={selectedPolicy}
                displayValue={selectedPolicy === ALL_POLICIES_OPTION ? '전체 정책' : selectedPolicy}
                onChange={value => {
                  setSelectedPolicy(value);
                  setCurrentPage(1);
                }}
                options={policyOptions}
                ariaLabel="탐지된 정책"
                widthClass="w-full min-w-0"
                triggerTextClassName="truncate text-[clamp(0.92rem,1vw,1rem)]"
                optionLabelMap={{ [ALL_POLICIES_OPTION]: '전체' }}
              />

              <UserScopeFilterDropdown
                selectedDepartment={selectedDepartment}
                selectedPosition={selectedPosition}
                selectedUser={selectedUser}
                departmentOptions={departmentOptions}
                positionOptions={positionOptions}
                userOptions={userOptions}
                onDepartmentChange={handleDepartmentFilterChange}
                onPositionChange={handlePositionFilterChange}
                onUserChange={handleUserFilterChange}
              />

              <div className="w-full min-w-0 sm:col-span-2 lg:col-span-1">
                <div className="grid w-full grid-cols-1 gap-[var(--app-gap-sm)] sm:grid-cols-[minmax(0,1fr)_minmax(4.75rem,max-content)_auto_auto]">
                  <AppSearchField
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    placeholder="검색어"
                    className="w-full min-w-0"
                  />
                  <AppButton
                    onClick={handleSearch}
                    className="h-[var(--app-control-lg)] min-w-[clamp(4.75rem,5.6vw,5.25rem)]"
                  >
                    검색
                  </AppButton>
                  <IconButtonTooltip label="초기화">
                    <MonitoringResetButton
                      onClick={handleResetFilters}
                      widthClass="w-[var(--app-control-lg)] min-w-[var(--app-control-lg)]"
                      textClassName="shadow-[0_0.625rem_1.5rem_rgba(67,56,202,0.18)]"
                      aria-label="초기화"
                    />
                  </IconButtonTooltip>
                  <IconButtonTooltip label={hasSelectedRows ? 'CSV 다운로드' : '항목을 선택하세요'}>
                    <MonitoringActionButton
                      variant="csvDownload"
                      heightClass="h-[var(--app-control-lg)]"
                      widthClass="w-[var(--app-control-lg)] min-w-[var(--app-control-lg)] px-0"
                      onClick={() => {}}
                      disabled={!hasSelectedRows}
                      aria-label="CSV 다운로드"
                    >
                      <Download
                        className="h-[var(--app-icon-xs)] w-[var(--app-icon-xs)] shrink-0"
                        strokeWidth={2.8}
                        aria-hidden="true"
                      />
                    </MonitoringActionButton>
                  </IconButtonTooltip>
                </div>
              </div>
            </div>
            <div className="mt-[var(--app-gap-lg)] flex items-center justify-between gap-[var(--app-gap-sm)]">
              <p className="text-base font-semibold text-[#526078]">
                전체 로그 갯수 :{' '}
                <span className="text-lg font-bold text-[#4338CA]">
                  {filteredLogs.length.toLocaleString()}
                </span>{' '}
                건
              </p>
            </div>
          </div>
        </div>

        <div
          ref={tableAreaRef}
          className="mt-[var(--app-gap-md)] flex min-h-0 flex-1 flex-col pb-[calc(var(--app-page-bottom)*1.65)]"
        >
          <MonitoringDataTable
            rows={pagedLogs}
            activeRowId={selectedLogId}
            selectedRowIds={selectedRowIds}
            onToggleRowSelection={handleToggleRowSelection}
            onToggleAllRowsSelection={handleToggleAllRowsSelection}
            rowNumberStart={(safePage - 1) * rowsPerPage + 1}
            onSelectRow={handleSelectLog}
            renderExpandedRow={row => {
              const detail = buildDetailContext(row);
              const isOriginalPromptVisible = originalPromptRowIds.includes(row.id);
              const promptPanel = buildPromptPanelState(row, isOriginalPromptVisible);

              return (
                <div className="grid gap-0">
                  <section className="bg-white">
                    <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
                      <div className="px-4 py-4">
                        <DetailSummaryItem label="탐지 일시" value={row.detectedAt} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-t-0 md:border-l md:border-[#E7EBF5]">
                        <DetailSummaryItem label="서비스" value={row.aiType} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 xl:border-t-0 xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem
                          label="처리 상태"
                          value={detail.actionStatus}
                          valueClassName={getStatusTextClassName(row)}
                        />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-t md:border-[#E7EBF5] xl:border-t-0 xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem label="적용 정책" value={detail.policyName} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4">
                        <DetailSummaryItem label="IP" value={row.userIp} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-l md:border-[#E7EBF5]">
                        <DetailSummaryItem label="사용자명" value={row.userId ?? '-'} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem label="부서" value={row.department ?? '-'} />
                      </div>
                      <div className="border-t border-[#E7EBF5] px-4 py-4 md:border-l md:border-[#E7EBF5] xl:border-l xl:border-[#E7EBF5]">
                        <DetailSummaryItem label="직책" value={row.position ?? '-'} />
                      </div>
                    </div>
                  </section>

                  <section className="border-t border-[#E7EBF5] bg-white">
                    <div className="grid lg:grid-cols-2">
                      <div className="min-w-0 border-b border-[#E7EBF5] lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel
                          title={promptPanel.title}
                          action={
                            promptPanel.canToggle ? (
                              <PromptVisibilityToggle
                                showOriginal={isOriginalPromptVisible}
                                label={promptPanel.toggleLabel}
                                onToggle={() => handleTogglePromptVisibility(row.id)}
                              />
                            ) : null
                          }
                        >
                          <DetailPanelText>{promptPanel.text}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5]">
                        <DetailPanel title="답변">
                          <DetailPanelText>{detail.answerDetail}</DetailPanelText>
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5] lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="첨부된 파일">
                          <DetailFileList files={row.attachedFiles ?? []} />
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5]">
                        <DetailPanel title="첨부 파일 분석 결과">
                          <DetailAnalysisList results={row.attachmentAnalysisResults ?? []} />
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5] lg:border-r lg:border-[#E7EBF5]">
                        <DetailPanel title="탐지 근거">
                          <DetailBulletList items={detail.evidenceLines} showMarkers={false} />
                        </DetailPanel>
                      </div>
                      <div className="min-w-0 border-b border-[#E7EBF5]">
                        <DetailPanel title="조치 내용">
                          <DetailBulletList items={detail.actionLines} showMarkers={false} />
                        </DetailPanel>
                      </div>
                    </div>
                  </section>
                </div>
              );
            }}
            className="flex-1"
          />

          {statusMessage ? (
            <section className="mt-2 shrink-0 border-t border-dashed border-[#DCEAF1] px-6 py-4 text-center text-sm text-[#94A3B8]">
              {statusMessage}
            </section>
          ) : null}

          <FixedPaginationBar
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  return <MonitoringLogView useStatusFilter />;
}
