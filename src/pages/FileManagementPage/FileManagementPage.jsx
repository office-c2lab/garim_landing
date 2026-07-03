import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, FileText, RotateCcw, Search, Upload, X } from 'lucide-react';

import AppButton from '../../components/AppButton.jsx';
import AppToggle from '../../components/AppToggle.jsx';
import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
import {
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';

const INITIAL_FILES = [
  {
    id: 'file-business-plan',
    name: '사업계획서_2026.pdf',
    description: '2026년 사업계획 및 재무 전망 문서',
    type: 'PDF',
    size: '2.4MB',
    enabled: true,
    category: '기밀정보 기준 파일',
    processingStatus: 'completed',
    createdAt: '2026-06-08',
  },
  {
    id: 'file-roadmap',
    name: '제품로드맵.xlsx',
    description: '제품 출시 일정 및 기능 계획 문서',
    type: 'Excel',
    size: '860KB',
    enabled: true,
    category: '내부 운영 문서',
    processingStatus: 'completed',
    createdAt: '2026-06-05',
  },
  {
    id: 'file-contract-draft',
    name: '계약서_초안.docx',
    description: '고객사 계약 초안 문서',
    type: 'Word',
    size: '730KB',
    enabled: false,
    category: '계약/고객 문서',
    processingStatus: 'processing',
    createdAt: '2026-06-03',
  },
  {
    id: 'file-security-policy',
    name: '보안정책_초안.pdf',
    description: '보안 정책 초안 문서',
    type: 'PDF',
    size: '980KB',
    enabled: false,
    category: '보안 정책 문서',
    processingStatus: 'failed',
    createdAt: '2026-06-01',
  },
];

const PROCESSING_STATUS = {
  completed: '처리 완료',
  processing: '처리 중',
  failed: '처리 실패',
};

const PROCESSING_FILTER_OPTIONS = ['처리 상태 전체', ...Object.values(PROCESSING_STATUS)];
const DETECTION_FILTER_OPTIONS = ['탐지 사용 전체', '사용', '미사용'];
const CATEGORY_OPTIONS = [
  '기밀정보 기준 파일',
  '사업 문서',
  '계약/고객 문서',
  '내부 운영 문서',
  '보안 정책 문서',
];

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0KB';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = size >= 10 || unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(precision)}${units[unitIndex]}`;
}

function getFileType(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (extension === 'pdf') return 'PDF';
  if (['doc', 'docx'].includes(extension)) return 'Word';
  if (['xls', 'xlsx', 'csv'].includes(extension)) return 'Excel';
  if (['txt', 'md'].includes(extension)) return 'Text';
  return '기타';
}

const SUMMARY_CARD_STYLES = {
  registered: {
    Icon: FileText,
    iconClassName: 'bg-[#4F37D8] text-white',
    valueClassName: 'text-[#4F37D8]',
  },
  active: {
    Icon: Check,
    iconClassName: 'bg-[#4F37D8] text-white',
    valueClassName: 'text-[#4F37D8]',
  },
  failed: {
    Icon: AlertTriangle,
    iconClassName: 'bg-[#EA4353] text-white',
    valueClassName: 'text-[#EA4353]',
  },
};

const FILE_TYPE_BADGE_STYLES = {
  PDF: 'bg-[#EF233C] text-white',
  Word: 'bg-[#2A67C7] text-white',
  Excel: 'bg-[#1FA65A] text-white',
  Text: 'bg-[#64748B] text-white',
  기타: 'bg-[#6B7280] text-white',
};

const PROCESSING_CHIP_STYLES = {
  completed: 'bg-[#EDE9FE] text-[#4F37D8]',
  processing: 'bg-[#EDE9FE] text-[#4F37D8]',
  failed: 'bg-[#FDE8EB] text-[#EF233C]',
};

function SummaryCard({ title, value, variant = 'registered' }) {
  const style = SUMMARY_CARD_STYLES[variant] ?? SUMMARY_CARD_STYLES.registered;
  const Icon = style.Icon;

  return (
    <SectionCard className="rounded-[14px]">
      <div className="flex min-h-[8.8rem] items-center gap-7 px-8 py-6">
        <div
          className={`flex h-[4.4rem] w-[4.4rem] shrink-0 items-center justify-center rounded-full shadow-[0_16px_34px_rgba(79,55,216,0.22)] ${style.iconClassName}`.trim()}
        >
          <Icon className="h-9 w-9" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.96rem] font-black text-[#111827]">{title}</p>
          <p
            className={`mt-2 text-[clamp(1.75rem,2.5vw,2.2rem)] font-black leading-none ${style.valueClassName}`.trim()}
          >
            {value}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function FileIconBadge({ type }) {
  const label = type === 'Excel' ? 'X' : type === 'Word' ? 'W' : type === 'PDF' ? 'PDF' : 'TXT';

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] text-[0.63rem] font-black leading-none shadow-[0_8px_16px_rgba(15,23,42,0.12)] ${
        FILE_TYPE_BADGE_STYLES[type] ?? FILE_TYPE_BADGE_STYLES['기타']
      }`.trim()}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}

function ProcessingStatusChip({ status }) {
  return (
    <span
      className={`inline-flex min-w-[5.1rem] justify-center rounded-[7px] px-3 py-1 text-[0.82rem] font-black ${
        PROCESSING_CHIP_STYLES[status] ?? PROCESSING_CHIP_STYLES.processing
      }`.trim()}
    >
      {PROCESSING_STATUS[status] ?? PROCESSING_STATUS.processing}
    </span>
  );
}

function DetectionToggle({ file, onToggle, readOnly = false }) {
  const handleToggle = event => {
    event.stopPropagation();

    if (!readOnly) {
      onToggle(file.id);
    }
  };

  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <AppToggle
        checked={file.enabled}
        onChange={handleToggle}
        ariaLabel={`${file.name} 탐지 사용 여부`}
      />
    </span>
  );
}

function UploadDropZone({ file, error, onFileChange }) {
  const inputRef = useRef(null);

  const handleFiles = fileList => {
    const nextFile = fileList?.[0];
    if (nextFile) {
      onFileChange(nextFile);
    }
  };

  return (
    <div
      className={`rounded-[8px] border border-dashed p-5 transition ${
        error ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#8B5CF6] bg-[#FBFAFF]'
      }`.trim()}
      onDragOver={event => event.preventDefault()}
      onDrop={event => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.md"
        onChange={event => handleFiles(event.target.files)}
      />

      {file ? (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#FBCACA] bg-white text-[#EF4444]">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.95rem] font-black text-[#172033]">{file.name}</p>
            <p className="mt-1 text-[0.82rem] font-semibold text-[#667085]">
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D8DEEA] bg-white text-[#667085] transition hover:border-[#C7D2FE] hover:bg-[#F8FAFF] hover:text-[#4338CA]"
            onClick={() => onFileChange(null)}
            aria-label="선택 파일 제거"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="flex min-h-[6rem] w-full flex-col items-center justify-center gap-2 text-center"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-[#6D4AE8]" aria-hidden="true" />
          <span className="text-[0.92rem] font-bold text-[#344054]">
            파일을 드롭하거나 파일을 선택하세요.
          </span>
          <span className="text-[0.78rem] font-semibold text-[#667085]">
            지원 형식: PDF, DOCX, XLSX, TXT, CSV
          </span>
        </button>
      )}

      {error ? <p className="mt-3 text-sm font-semibold text-[#DC2626]">{error}</p> : null}
    </div>
  );
}

function UploadModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    if (!file) {
      setError('등록할 파일을 선택해주세요.');
      return;
    }

    onUpload({
      id: `file-${Date.now()}`,
      name: file.name,
      description: description.trim() || '설명 없음',
      type: getFileType(file),
      size: formatBytes(file.size),
      enabled,
      category,
      processingStatus: 'processing',
      createdAt: formatDateTime(new Date()).slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(15,23,42,0.46)] backdrop-blur-[4px]"
        onClick={onClose}
        aria-label="파일 업로드 닫기"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-upload-title"
        className="relative z-10 flex max-h-[min(92vh,46rem)] w-[min(92vw,34rem)] flex-col overflow-hidden rounded-[10px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.24)]"
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-4">
          <div>
            <h2 id="file-upload-title" className="text-[1.35rem] font-black text-[#111827]">
              파일 업로드
            </h2>
            <p className="mt-2 text-[0.9rem] font-semibold text-[#667085]">
              기밀정보 탐지 기준으로 사용할 파일을 등록합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#111827] transition hover:bg-slate-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto px-7 pb-7">
          <div className="grid gap-4">
            <UploadDropZone
              file={file}
              error={error}
              onFileChange={nextFile => {
                setFile(nextFile);
                setError('');
              }}
            />

            <label className="grid gap-2">
              <span className="text-[0.9rem] font-black text-[#344054]">설명</span>
              <input
                type="text"
                value={description}
                onChange={event => setDescription(event.target.value)}
                placeholder="파일 설명을 입력하세요"
                className="h-11 rounded-[7px] border border-[#D8DEEA] bg-white px-3 text-[0.92rem] font-semibold text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.9rem] font-black text-[#344054]">분류</span>
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
                className="h-11 rounded-[7px] border border-[#D8DEEA] bg-white px-3 text-[0.92rem] font-semibold text-[#344054] outline-none transition focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-2">
              <span className="text-[0.9rem] font-black text-[#344054]">사용 여부</span>
              <div className="flex items-center gap-3">
                <AppToggle
                  checked={enabled}
                  onChange={() => setEnabled(current => !current)}
                  ariaLabel="업로드 후 즉시 사용 여부"
                />
                <span className="text-[0.9rem] font-semibold text-[#344054]">
                  업로드 후 즉시 탐지 기준에 포함
                </span>
              </div>
            </div>

            <div className="rounded-[7px] border border-[#DDD6FE] bg-[#F5F3FF] px-4 py-3 text-[0.84rem] font-semibold leading-6 text-[#6D4AE8]">
              업로드된 파일은 기밀정보 탐지 기준으로 사용됩니다.
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <AppButton
              type="button"
              variant="secondary"
              className="h-11 rounded-[7px]"
              onClick={onClose}
            >
              취소
            </AppButton>
            <AppButton type="submit" className="h-11 rounded-[7px]">
              업로드
            </AppButton>
          </div>
        </form>
      </section>
    </div>
  );
}

function FileInlineDetailPanel({ file, onDelete, onRetry, onToggleDetection }) {
  const detailItems = [
    { label: '설명', value: file.description },
    { label: '파일 유형', value: file.type },
    { label: '처리 상태', value: <ProcessingStatusChip status={file.processingStatus} /> },
    { label: '탐지 사용', value: <DetectionToggle file={file} onToggle={onToggleDetection} /> },
    { label: '크기', value: file.size },
    { label: '분류', value: file.category },
    { label: '등록일', value: file.createdAt },
  ];

  return (
    <div className="bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-900">파일 상세 내역</h2>
          <p className="mt-1 truncate text-sm text-slate-400">{file.name}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {file.processingStatus === 'failed' ? (
            <AppButton onClick={() => onRetry(file)} className="h-10 min-w-[4.8rem]">
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.3} aria-hidden="true" />
              재처리
            </AppButton>
          ) : null}
          {file.processingStatus !== 'processing' ? (
            <AppButton
              variant="danger"
              onClick={() => onDelete(file)}
              className="h-10 min-w-[4.5rem]"
            >
              삭제
            </AppButton>
          ) : null}
        </div>
      </div>

      <dl className="grid gap-0 bg-white sm:grid-cols-2 xl:grid-cols-3">
        {detailItems.map(item => (
          <div
            key={item.label}
            className="min-w-0 border-b border-slate-200 px-5 py-5 sm:px-6 xl:border-r [&:nth-child(3n)]:xl:border-r-0"
          >
            <dt className="text-sm font-bold text-slate-900">{item.label}</dt>
            <dd
              className="mt-2 truncate text-sm font-semibold text-slate-600"
              title={typeof item.value === 'string' ? item.value : undefined}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DeleteConfirmModal({ file, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(15,23,42,0.42)] backdrop-blur-[4px]"
        onClick={onClose}
        aria-label="파일 삭제 닫기"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-delete-title"
        className="relative z-10 w-[min(92vw,25.5rem)] rounded-[8px] border border-white/70 bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.26)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EF233C] text-white">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <h2 id="file-delete-title" className="text-[1.05rem] font-black text-[#111827]">
              기밀 파일 삭제
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#64748B] transition hover:bg-slate-100 hover:text-[#111827]"
            aria-label="닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-5 text-[0.82rem] font-semibold leading-5 text-[#344054]">
          선택한 파일을 삭제하시겠습니까?
          <br />
          삭제하면 해당 파일은 더 이상 기밀정보 탐지 기준으로 사용되지 않습니다.
        </p>

        <div className="mt-4 rounded-[7px] border border-[#D8DEEA] bg-white px-4 py-3">
          <dl className="grid gap-3 text-[0.82rem]">
            <div className="grid grid-cols-[4.8rem_1fr] gap-4">
              <dt className="font-black text-[#344054]">파일명</dt>
              <dd className="truncate font-black text-[#111827]">{file.name}</dd>
            </div>
            <div className="grid grid-cols-[4.8rem_1fr] gap-4">
              <dt className="font-black text-[#344054]">상태</dt>
              <dd>
                <ProcessingStatusChip status={file.processingStatus} />
              </dd>
            </div>
            <div className="grid grid-cols-[4.8rem_1fr] gap-4">
              <dt className="font-black text-[#344054]">탐지 사용</dt>
              <dd>
                <DetectionToggle file={file} readOnly />
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 flex items-center gap-2 text-[0.78rem] font-black text-[#EF233C]">
          <AlertTriangle className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          삭제 후에는 복구할 수 없습니다.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-10 min-w-[4.3rem] items-center justify-center rounded-[7px] border border-[#CBD5E1] bg-white px-5 text-[0.88rem] font-black text-[#344054] transition hover:bg-[#F8FAFC]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="inline-flex h-10 min-w-[4.3rem] items-center justify-center rounded-[7px] border border-[#EF233C] bg-[#EF233C] px-5 text-[0.88rem] font-black text-white shadow-[0_10px_22px_rgba(239,35,60,0.28)] transition hover:bg-[#DC1E37]"
            onClick={() => onConfirm(file.id)}
          >
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}

function RetryConfirmModal({ file, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(15,23,42,0.42)] backdrop-blur-[4px]"
        onClick={onClose}
        aria-label="파일 재처리 닫기"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-retry-title"
        className="relative z-10 w-[min(92vw,23rem)] rounded-[8px] border border-white/70 bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.26)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="file-retry-title" className="text-[1.15rem] font-black text-[#111827]">
            파일 재처리
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#64748B] transition hover:bg-slate-100 hover:text-[#111827]"
            aria-label="닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-[0.82rem] font-semibold leading-5 text-[#344054]">
          선택한 파일의 텍스트 추출 및 분석 처리를 다시 시도하시겠습니까?
        </p>

        <div className="mt-5 rounded-[7px] border border-[#D8DEEA] bg-white px-4 py-4">
          <dl className="grid gap-4 text-[0.82rem]">
            <div className="grid grid-cols-[5rem_1fr] gap-4">
              <dt className="font-black text-[#344054]">파일명</dt>
              <dd className="truncate font-semibold text-[#344054]">{file.name}</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] gap-4">
              <dt className="font-black text-[#344054]">현재 상태</dt>
              <dd>
                <ProcessingStatusChip status={file.processingStatus} />
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 text-[0.8rem] font-semibold leading-5 text-[#64748B]">
          재처리를 시작하면 기존 실패 이력을 유지한 채 다시 분석을 시도합니다.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-10 min-w-[5rem] items-center justify-center rounded-[7px] border border-[#CBD5E1] bg-white px-5 text-[0.88rem] font-black text-[#344054] transition hover:bg-[#F8FAFC]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="app-solid-button inline-flex h-10 min-w-[5rem] items-center justify-center rounded-[7px] border border-[#4F37D8] bg-[#4F37D8] px-5 text-[0.88rem] font-black text-white shadow-[0_10px_22px_rgba(79,55,216,0.26)] transition hover:bg-[#4338CA]"
            onClick={() => onConfirm(file.id)}
          >
            재처리
          </button>
        </div>
      </section>
    </div>
  );
}

export function FileManagementContent() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [processingFilter, setProcessingFilter] = useState(PROCESSING_FILTER_OPTIONS[0]);
  const [detectionFilter, setDetectionFilter] = useState(DETECTION_FILTER_OPTIONS[0]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [retryFile, setRetryFile] = useState(null);

  const filteredFiles = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return files.filter(file => {
      const matchesKeyword =
        !keyword ||
        [file.name, file.description, file.category].join(' ').toLowerCase().includes(keyword);
      const matchesProcessing =
        processingFilter === '처리 상태 전체' ||
        PROCESSING_STATUS[file.processingStatus] === processingFilter;
      const matchesDetection =
        detectionFilter === '탐지 사용 전체' ||
        (detectionFilter === '사용' && file.enabled) ||
        (detectionFilter === '미사용' && !file.enabled);

      return matchesKeyword && matchesProcessing && matchesDetection;
    });
  }, [files, searchKeyword, processingFilter, detectionFilter]);

  const statusCounts = useMemo(() => {
    return files.reduce(
      (counts, file) => ({
        active: counts.active + (file.enabled ? 1 : 0),
        failed: counts.failed + (file.processingStatus === 'failed' ? 1 : 0),
      }),
      { active: 0, failed: 0 }
    );
  }, [files]);

  useEffect(() => {
    if (!isUploadOpen && !deleteFile && !retryFile) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsUploadOpen(false);
        setDeleteFile(null);
        setRetryFile(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUploadOpen, deleteFile, retryFile]);

  const handleUpload = nextFile => {
    setFiles(current => [nextFile, ...current]);
    setIsUploadOpen(false);
  };

  const handleDeleteFile = fileId => {
    setFiles(current => current.filter(file => file.id !== fileId));
    setSelectedFileId(current => (current === fileId ? null : current));
    setDeleteFile(null);
  };

  const handleToggleDetection = fileId => {
    setFiles(current =>
      current.map(file => (file.id === fileId ? { ...file, enabled: !file.enabled } : file))
    );
    setDeleteFile(current =>
      current?.id === fileId ? { ...current, enabled: !current.enabled } : current
    );
    setRetryFile(current =>
      current?.id === fileId ? { ...current, enabled: !current.enabled } : current
    );
  };

  const handleRetryFile = fileId => {
    setFiles(current =>
      current.map(file =>
        file.id === fileId ? { ...file, processingStatus: 'processing', enabled: false } : file
      )
    );
    setRetryFile(null);
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard title="등록 파일" value={`${files.length}개`} variant="registered" />
        <SummaryCard title="탐지 사용 중" value={`${statusCounts.active}개`} variant="active" />
        <SummaryCard title="처리 실패" value={`${statusCounts.failed}개`} variant="failed" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(18rem,1fr)_17rem_17rem_auto] lg:items-center">
        <label className="relative min-w-0">
          <input
            type="text"
            value={searchKeyword}
            onChange={event => setSearchKeyword(event.target.value)}
            placeholder="파일명 또는 설명 검색"
            className="h-[3.15rem] w-full rounded-[8px] border border-[#CBD5E1] bg-white px-5 pr-12 text-[0.95rem] font-semibold text-[#344054] outline-none transition placeholder:text-[#94A3B8] focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
          />
          <Search
            className="pointer-events-none absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-[#8EA0BC]"
            aria-hidden="true"
          />
        </label>

        <MonitoringDropdown
          value={processingFilter}
          options={PROCESSING_FILTER_OPTIONS}
          onChange={setProcessingFilter}
          ariaLabel="처리 상태 필터"
          widthClass="w-full"
          triggerClassName="h-[3.15rem] rounded-[8px] border-[#CBD5E1] bg-white px-5 shadow-none hover:border-[#C7D2FE] hover:bg-[#F8FAFF]"
        />

        <MonitoringDropdown
          value={detectionFilter}
          options={DETECTION_FILTER_OPTIONS}
          onChange={setDetectionFilter}
          ariaLabel="탐지 사용 필터"
          widthClass="w-full"
          triggerClassName="h-[3.15rem] rounded-[8px] border-[#CBD5E1] bg-white px-5 shadow-none hover:border-[#C7D2FE] hover:bg-[#F8FAFF]"
        />

        <AppButton
          className="h-[3.15rem] rounded-[8px] px-8 text-[0.98rem] font-black lg:min-w-[11.8rem]"
          onClick={() => setIsUploadOpen(true)}
        >
          파일 업로드
        </AppButton>
      </div>

      <div className={monitoringTableSurfaceClass}>
        <div className="overflow-x-auto">
          <table className={`min-w-[min(100%,60rem)] ${monitoringTableClass} text-left`}>
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[28%]" />
              <col className="w-[11%]" />
              <col className="w-[13%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className={monitoringTableHeadClass}>
              <tr className={monitoringTableHeaderRowClass}>
                {['파일명', '설명', '파일 유형', '처리 상태', '탐지 사용', '등록일'].map(label => (
                  <th key={label} className={`${monitoringTableHeaderCellClass} whitespace-nowrap`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => {
                const isSelected = selectedFileId === file.id;

                return (
                  <Fragment key={file.id}>
                    <tr
                      className={monitoringTableRowClass({
                        selected: isSelected,
                        striped: index % 2 === 1,
                        interactive: true,
                      })}
                      onClick={() =>
                        setSelectedFileId(current => (current === file.id ? null : file.id))
                      }
                      aria-expanded={isSelected}
                    >
                      <td className={monitoringTableCellClass(index, 'whitespace-nowrap')}>
                        <div className="flex min-w-0 items-center gap-4">
                          <FileIconBadge type={file.type} />
                          <span className="truncate font-black text-[#111827]">{file.name}</span>
                        </div>
                      </td>
                      <td className={monitoringTableCellClass(index)}>
                        <div className="truncate text-[#475569]">{file.description}</div>
                      </td>
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'whitespace-nowrap font-semibold text-slate-700'
                        )}
                      >
                        {file.type}
                      </td>
                      <td className={monitoringTableCellClass(index, 'whitespace-nowrap')}>
                        <ProcessingStatusChip status={file.processingStatus} />
                      </td>
                      <td className={monitoringTableCellClass(index, 'whitespace-nowrap')}>
                        <DetectionToggle file={file} onToggle={handleToggleDetection} />
                      </td>
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'whitespace-nowrap text-slate-600'
                        )}
                      >
                        {file.createdAt}
                      </td>
                    </tr>
                    {isSelected ? (
                      <tr className="bg-white">
                        <td colSpan={6} className="border-t border-[#E6EAF4] px-0 py-0">
                          <FileInlineDetailPanel
                            file={file}
                            onDelete={setDeleteFile}
                            onRetry={setRetryFile}
                            onToggleDetection={handleToggleDetection}
                          />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredFiles.length === 0 ? (
            <div className="border-t border-[#E7EBF4] bg-white px-6 py-12 text-center text-sm text-slate-400">
              조건에 맞는 파일이 없습니다.
            </div>
          ) : null}
        </div>
      </div>

      {isUploadOpen ? (
        <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
      ) : null}
      {deleteFile ? (
        <DeleteConfirmModal
          file={deleteFile}
          onClose={() => setDeleteFile(null)}
          onConfirm={handleDeleteFile}
        />
      ) : null}
      {retryFile ? (
        <RetryConfirmModal
          file={retryFile}
          onClose={() => setRetryFile(null)}
          onConfirm={handleRetryFile}
        />
      ) : null}
    </>
  );
}

export default function FileManagementPage() {
  return (
    <PageLayout>
      <FileManagementContent />
    </PageLayout>
  );
}
