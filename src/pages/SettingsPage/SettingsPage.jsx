import { Building2, BriefcaseBusiness, GripVertical, Search, UserRound, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import AppToggle from '../../components/AppToggle.jsx';
import {
  MonitoringActionButton,
  MonitoringDropdown,
} from '../../components/monitoring/MonitoringListComponents.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import PageLayout from '../../layout/PageLayout.jsx';

const CATEGORIES = [
  { key: 'departments', label: '부서', fieldLabel: '부서명', placeholder: '부서명 검색' },
  { key: 'positions', label: '직책', fieldLabel: '직책명', placeholder: '직책명 검색' },
];

const INITIAL_ITEMS = {
  departments: [
    {
      id: 'dept-security',
      name: '보안팀',
      description: '보안 정책을 담당합니다.',
      enabled: true,
      memberCount: 18,
      order: 1,
      createdAt: '2024.04.15',
    },
    {
      id: 'dept-dev',
      name: '개발팀',
      description: '제품 개발을 담당합니다.',
      enabled: true,
      memberCount: 29,
      order: 2,
      createdAt: '2024.04.15',
    },
    {
      id: 'dept-ops',
      name: '운영팀',
      description: '서비스 운영을 담당합니다.',
      enabled: true,
      memberCount: 16,
      order: 3,
      createdAt: '2024.04.16',
    },
    {
      id: 'dept-support',
      name: '경영지원팀',
      description: '경영지원 업무를 담당합니다.',
      enabled: true,
      memberCount: 13,
      order: 4,
      createdAt: '2024.04.16',
    },
    {
      id: 'dept-hr',
      name: '인사팀',
      description: '인사 관리를 담당합니다.',
      enabled: true,
      memberCount: 12,
      order: 5,
      createdAt: '2024.04.17',
    },
    {
      id: 'dept-marketing',
      name: '마케팅팀',
      description: '마케팅 업무를 담당합니다.',
      enabled: true,
      memberCount: 11,
      order: 6,
      createdAt: '2024.04.17',
    },
    {
      id: 'dept-finance',
      name: '재무팀',
      description: '재무 관리를 담당합니다.',
      enabled: true,
      memberCount: 9,
      order: 7,
      createdAt: '2024.04.18',
    },
    {
      id: 'dept-sales',
      name: '영업팀',
      description: '영업 업무를 담당합니다.',
      enabled: true,
      memberCount: 12,
      order: 8,
      createdAt: '2024.04.18',
    },
    {
      id: 'dept-cs',
      name: '고객지원팀',
      description: '고객 지원을 담당합니다.',
      enabled: true,
      memberCount: 8,
      order: 9,
      createdAt: '2024.04.19',
    },
  ],
  positions: [
    {
      id: 'position-lead',
      name: '팀장',
      description: '팀 운영을 담당합니다.',
      enabled: true,
      memberCount: 14,
      order: 1,
      createdAt: '2024.04.15',
    },
    {
      id: 'position-manager',
      name: '매니저',
      description: '업무 실행을 관리합니다.',
      enabled: true,
      memberCount: 35,
      order: 2,
      createdAt: '2024.04.15',
    },
    {
      id: 'position-owner',
      name: '담당자',
      description: '실무를 담당합니다.',
      enabled: true,
      memberCount: 72,
      order: 3,
      createdAt: '2024.04.16',
    },
    {
      id: 'position-intern',
      name: '인턴',
      description: '업무를 보조합니다.',
      enabled: true,
      memberCount: 7,
      order: 4,
      createdAt: '2024.04.17',
    },
  ],
};

const DEFAULT_MODAL_DRAFT = {
  id: null,
  name: '',
  description: '',
  enabled: true,
};

const STATUS_FILTER_LABELS = {
  all: '전체',
  enabled: '사용 중',
  disabled: '미사용',
};

const STATUS_FILTER_OPTIONS = Object.values(STATUS_FILTER_LABELS);

function getStatusFilterValue(label) {
  return (
    Object.entries(STATUS_FILTER_LABELS).find(([, optionLabel]) => optionLabel === label)?.[0] ??
    'all'
  );
}

function getTodayText() {
  return '2024.05.27';
}

function getCategoryMeta(category) {
  return CATEGORIES.find(item => item.key === category) ?? CATEGORIES[0];
}

function getActiveSummary(items) {
  const active = items.filter(item => item.enabled).length;

  return `사용 중 ${active}개 · 비활성 ${items.length - active}개`;
}

function buildDraft(item) {
  if (!item) {
    return DEFAULT_MODAL_DRAFT;
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    enabled: item.enabled,
  };
}

function SummaryCard({ icon, title, value, description }) {
  const Icon = icon;
  const toneClass = 'bg-[#5B39D6] text-[#F4F1FF]';

  return (
    <SectionCard className="overflow-hidden rounded-[10px]">
      <div className="flex min-h-[7rem] items-center gap-5 px-6 py-5">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${toneClass}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800">{title}</p>
          <p className="mt-1 text-[1.55rem] font-black leading-none text-[#5B21E5]">{value}</p>
          <p className="mt-3 text-sm font-semibold text-slate-500">{description}</p>
        </div>
      </div>
    </SectionCard>
  );
}

function FieldLabel({ children, required = false, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
      {children}
      {required ? <span className="ml-1 text-[#EF4444]">*</span> : null}
    </label>
  );
}

function ItemModal({ mode, category, draft, onChange, onClose, onDelete, onSave }) {
  const meta = getCategoryMeta(category);
  const isSaveDisabled = !draft.name.trim();
  const canDelete = mode === 'edit' && category === 'departments';
  const modalTitle = mode === 'add' ? `새 ${meta.label} 추가` : `${meta.label} 정보 수정`;
  const modalDescription =
    mode === 'add'
      ? `새로운 ${meta.label} 정보를 입력하고 사용 여부를 설정하세요.`
      : `${draft.name || meta.label}의 기본 정보와 사용 여부를 변경합니다.`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-[clamp(0.75rem,1.8vw,1.25rem)]">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(15,23,42,0.46)] backdrop-blur-[4px]"
        aria-label={`${modalTitle} 닫기`}
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        aria-describedby="settings-modal-description"
        className="relative z-10 col-start-1 row-start-1 flex max-h-[min(82vh,46rem)] w-[min(72vw,42rem)] min-w-[min(92vw,34rem)] self-center flex-col overflow-hidden rounded-[clamp(1.25rem,1.9vw,1.75rem)] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(0.9rem,1.6vw,1.25rem)]">
          <div>
            <h2
              id="settings-modal-title"
              className="text-[clamp(1.1rem,1.55vw,1.4rem)] font-bold tracking-[-0.03em] text-slate-900"
            >
              {modalTitle}
            </h2>
            <p
              id="settings-modal-description"
              className="mt-1 text-[clamp(0.82rem,1vw,0.92rem)] text-slate-500"
            >
              {modalDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#111827] transition hover:bg-slate-100"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-scrollbar overflow-y-auto px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(0.95rem,1.6vw,1.125rem)]">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <FieldLabel htmlFor="settings-item-name" required>
                {meta.fieldLabel}
              </FieldLabel>
              <div className="relative">
                <input
                  id="settings-item-name"
                  type="text"
                  value={draft.name}
                  maxLength={50}
                  autoFocus
                  onChange={event => onChange({ name: event.target.value })}
                  placeholder={`예) ${category === 'departments' ? '전략기획팀' : '책임 매니저'}`}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-20 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-slate-400">
                  {draft.name.length} / 50
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <FieldLabel htmlFor="settings-item-description">설명</FieldLabel>
              <div className="relative">
                <textarea
                  id="settings-item-description"
                  value={draft.description}
                  maxLength={200}
                  rows={4}
                  onChange={event => onChange({ description: event.target.value })}
                  placeholder={`${meta.label}의 역할이나 담당 업무를 간단히 입력하세요.`}
                  className="min-h-[7rem] w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 pb-8 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                />
                <span className="pointer-events-none absolute right-4 bottom-3 text-xs text-slate-400">
                  {draft.description.length} / 200
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-700">사용 여부</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  미사용으로 설정하면 관련 선택 목록에서 숨겨집니다.
                </p>
              </div>
              <AppToggle
                checked={draft.enabled}
                onChange={() => onChange({ enabled: !draft.enabled })}
                ariaLabel="사용 여부"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-[clamp(1rem,1.8vw,1.5rem)] py-[clamp(0.75rem,1.4vw,0.9rem)]">
          {canDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
            >
              삭제
            </button>
          ) : null}

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaveDisabled}
              className={`inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition ${
                isSaveDisabled
                  ? 'cursor-not-allowed bg-slate-300'
                  : 'border border-[#4338CA] bg-[#4338CA] shadow-[0_10px_24px_rgba(67,56,202,0.24)] hover:bg-[#3730A3] active:bg-[#312E81]'
              }`.trim()}
            >
              {mode === 'add' ? '추가' : category === 'departments' ? '저장' : '변경 저장'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  const [itemsByCategory, setItemsByCategory] = useState(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalState, setModalState] = useState({
    mode: null,
    itemId: null,
    draft: DEFAULT_MODAL_DRAFT,
  });
  const [dragState, setDragState] = useState({
    itemId: null,
    overItemId: null,
    position: null,
  });
  const dragPreviewRef = useRef(null);
  const dragImageRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const activeMeta = CATEGORIES.find(category => category.key === activeCategory) ?? CATEGORIES[0];
  const activeItems = useMemo(
    () => [...itemsByCategory[activeCategory]].sort((a, b) => a.order - b.order),
    [activeCategory, itemsByCategory]
  );
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return activeItems.filter(item => {
      const matchesSearch = query ? item.name.toLowerCase().includes(query) : true;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'enabled' && item.enabled) ||
        (statusFilter === 'disabled' && !item.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [activeItems, searchQuery, statusFilter]);
  const modalOpen = Boolean(modalState.mode);
  const departmentItems = itemsByCategory.departments;
  const positionItems = itemsByCategory.positions;

  const handleChangeCategory = category => {
    setActiveCategory(category);
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleOpenAddModal = () => {
    setModalState({
      mode: 'add',
      itemId: null,
      draft: buildDraft(null),
    });
  };

  const handleOpenEditModal = item => {
    setModalState({
      mode: 'edit',
      itemId: item.id,
      draft: buildDraft(item),
    });
  };

  const handleCloseModal = () => {
    setModalState({
      mode: null,
      itemId: null,
      draft: DEFAULT_MODAL_DRAFT,
    });
  };

  const handleChangeDraft = nextDraft => {
    setModalState(current => ({
      ...current,
      draft: {
        ...current.draft,
        ...nextDraft,
      },
    }));
  };

  const handleToggleItem = itemId => {
    setItemsByCategory(current => ({
      ...current,
      [activeCategory]: current[activeCategory].map(item =>
        item.id === itemId ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  const handleDragStart = (event, itemId) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', itemId);

    const row = event.currentTarget.closest('tr');
    if (row) {
      dragPreviewRef.current?.remove();
      dragImageRef.current?.remove();

      const rowRect = row.getBoundingClientRect();
      const previewTable = document.createElement('table');
      const previewBody = document.createElement('tbody');
      const previewRow = row.cloneNode(true);
      const rowCells = [...row.children];
      const previewCells = [...previewRow.children];

      rowCells.forEach((cell, index) => {
        const cellWidth = `${cell.getBoundingClientRect().width}px`;
        previewCells[index].style.width = cellWidth;
        previewCells[index].style.minWidth = cellWidth;
        previewCells[index].style.maxWidth = cellWidth;
      });

      previewTable.style.position = 'fixed';
      previewTable.style.top = `${rowRect.top}px`;
      previewTable.style.left = `${rowRect.left}px`;
      previewTable.style.width = `${rowRect.width}px`;
      previewTable.style.tableLayout = 'fixed';
      previewTable.style.borderCollapse = 'separate';
      previewTable.style.borderSpacing = '0';
      previewTable.style.overflow = 'hidden';
      previewTable.style.borderRadius = '12px';
      previewTable.style.background = '#DDD6FE';
      previewTable.style.boxShadow = '0 22px 55px rgba(67, 56, 202, 0.42)';
      previewTable.style.zIndex = '9999';
      previewTable.style.pointerEvents = 'none';
      previewTable.style.opacity = '1';
      previewRow.style.background = '#DDD6FE';
      previewCells.forEach(cell => {
        cell.style.background = '#DDD6FE';
        cell.style.borderColor = '#A78BFA';
      });

      previewBody.appendChild(previewRow);
      previewTable.appendChild(previewBody);
      document.body.appendChild(previewTable);
      dragPreviewRef.current = previewTable;

      const transparentDragImage = document.createElement('div');
      transparentDragImage.style.position = 'fixed';
      transparentDragImage.style.top = '-10000px';
      transparentDragImage.style.left = '-10000px';
      transparentDragImage.style.width = '1px';
      transparentDragImage.style.height = '1px';
      transparentDragImage.style.opacity = '0';
      document.body.appendChild(transparentDragImage);
      dragImageRef.current = transparentDragImage;

      dragOffsetRef.current = {
        x: Math.max(0, event.clientX - rowRect.left),
        y: Math.max(0, event.clientY - rowRect.top),
      };
      event.dataTransfer.setDragImage(transparentDragImage, 0, 0);
    }

    setDragState({
      itemId,
      overItemId: null,
      position: null,
    });
  };

  const moveDragPreview = event => {
    if (!dragPreviewRef.current || event.clientX === 0 || event.clientY === 0) return;

    dragPreviewRef.current.style.left = `${event.clientX - dragOffsetRef.current.x}px`;
    dragPreviewRef.current.style.top = `${event.clientY - dragOffsetRef.current.y}px`;
  };

  const clearDragPreview = () => {
    dragPreviewRef.current?.remove();
    dragImageRef.current?.remove();
    dragPreviewRef.current = null;
    dragImageRef.current = null;
  };

  const handleDragOver = (event, itemId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    moveDragPreview(event);

    if (!dragState.itemId || dragState.itemId === itemId) return;

    const { top, height } = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < top + height / 2 ? 'before' : 'after';

    setDragState(current =>
      current.overItemId === itemId && current.position === position
        ? current
        : {
            ...current,
            overItemId: itemId,
            position,
          }
    );
  };

  const handleDrop = (event, targetItemId) => {
    event.preventDefault();
    event.stopPropagation();

    const sourceItemId = dragState.itemId || event.dataTransfer.getData('text/plain');
    if (!sourceItemId || sourceItemId === targetItemId) {
      clearDragPreview();
      setDragState({ itemId: null, overItemId: null, position: null });
      return;
    }

    setItemsByCategory(current => {
      const orderedItems = [...current[activeCategory]].sort((a, b) => a.order - b.order);
      const sourceItem = orderedItems.find(item => item.id === sourceItemId);
      const withoutSource = orderedItems.filter(item => item.id !== sourceItemId);
      const targetIndex = withoutSource.findIndex(item => item.id === targetItemId);

      if (!sourceItem || targetIndex < 0) return current;

      const insertIndex = targetIndex + (dragState.position === 'after' ? 1 : 0);
      withoutSource.splice(insertIndex, 0, sourceItem);

      return {
        ...current,
        [activeCategory]: withoutSource.map((item, index) => ({
          ...item,
          order: index + 1,
        })),
      };
    });
    clearDragPreview();
    setDragState({ itemId: null, overItemId: null, position: null });
  };

  const handleDragEnd = () => {
    clearDragPreview();
    setDragState({ itemId: null, overItemId: null, position: null });
  };

  const handleSaveModal = () => {
    const { mode, itemId, draft } = modalState;
    const currentItem = activeItems.find(item => item.id === itemId);
    const nextItem = {
      id: itemId ?? `${activeCategory}-${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      enabled: draft.enabled,
      memberCount: currentItem?.memberCount ?? 0,
      order: currentItem?.order ?? activeItems.length + 1,
      createdAt: getTodayText(),
    };

    setItemsByCategory(current => {
      const withoutCurrent =
        mode === 'edit'
          ? current[activeCategory].filter(item => item.id !== itemId)
          : current[activeCategory];
      const nextItems = [...withoutCurrent, nextItem].sort((a, b) => a.order - b.order);

      return {
        ...current,
        [activeCategory]: nextItems,
      };
    });
    handleCloseModal();
  };

  const handleDeleteDepartment = () => {
    if (modalState.mode !== 'edit' || activeCategory !== 'departments') return;

    setItemsByCategory(current => ({
      ...current,
      departments: current.departments
        .filter(item => item.id !== modalState.itemId)
        .sort((a, b) => a.order - b.order)
        .map((item, index) => ({
          ...item,
          order: index + 1,
        })),
    }));
    handleCloseModal();
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 pb-3">
        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCard
            icon={Building2}
            title="부서 항목"
            value={`${departmentItems.length}개`}
            description={getActiveSummary(departmentItems)}
          />
          <SummaryCard
            icon={BriefcaseBusiness}
            title="직책 항목"
            value={`${positionItems.length}개`}
            description={getActiveSummary(positionItems)}
          />
          <SummaryCard
            icon={UserRound}
            title="보호 대상"
            value="128명"
            description="서비스 이용 사용자"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="overflow-x-auto border-b border-[#E2E8F0]">
            <div className="flex h-12 min-w-max items-end gap-7">
              {CATEGORIES.map(category => {
                const isActive = category.key === activeCategory;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleChangeCategory(category.key)}
                    className={`relative flex h-12 min-w-[4rem] items-center justify-center px-1 text-sm font-black transition ${
                      isActive ? 'text-[#5B21E5]' : 'text-slate-600 hover:text-[#5B21E5]'
                    }`.trim()}
                  >
                    {category.label}
                    {isActive ? (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B21E5]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative w-full sm:max-w-[24rem]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder={activeMeta.placeholder}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
                />
                <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">사용 여부</span>
                <MonitoringDropdown
                  value={STATUS_FILTER_LABELS[statusFilter]}
                  onChange={label => setStatusFilter(getStatusFilterValue(label))}
                  options={STATUS_FILTER_OPTIONS}
                  ariaLabel="상태"
                  widthClass="w-[9rem]"
                  triggerClassName="h-12 rounded-xl border-slate-200 bg-white shadow-none"
                />
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-[10px] sm:w-[10.5rem]">
              <MonitoringActionButton
                variant="primary"
                onClick={handleOpenAddModal}
                heightClass="h-12"
                widthClass="w-full"
              >
                새 항목 추가
              </MonitoringActionButton>
            </div>
          </div>
        </div>

        <SectionCard className="overflow-hidden rounded-[10px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] table-fixed border-separate border-spacing-0 text-left">
              <thead className="bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)]">
                <tr className="text-sm font-black text-[#4A5578]">
                  <th className="w-[6%] border-b border-[#E2E8F0] px-3 py-3" />
                  <th className="w-[20%] border-b border-[#E2E8F0] px-3 py-3">
                    {activeMeta.fieldLabel}
                  </th>
                  <th className="w-[30%] border-b border-[#E2E8F0] px-3 py-3">설명</th>
                  <th className="w-[14%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                    인원수
                  </th>
                  <th className="w-[14%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                    사용 여부
                  </th>
                  <th className="w-[16%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                    생성일
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {filteredItems.map(item => (
                  <tr
                    key={item.id}
                    onDragOver={event => handleDragOver(event, item.id)}
                    onDrop={event => handleDrop(event, item.id)}
                    onClick={() => handleOpenEditModal(item)}
                    className={`relative cursor-pointer bg-white transition hover:bg-[#F8FAFF] ${
                      dragState.itemId === item.id ? '[&>td]:bg-[#C4B5FD]' : ''
                    } ${
                      dragState.overItemId === item.id && dragState.position === 'before'
                        ? '[&>td]:bg-[#EDE9FE]'
                        : dragState.overItemId === item.id && dragState.position === 'after'
                          ? '[&>td]:bg-[#EDE9FE]'
                          : ''
                    }`.trim()}
                  >
                    <td className="border-b border-[#E2E8F0] px-3 py-3 text-center text-[#61708E]">
                      <button
                        type="button"
                        draggable
                        onClick={event => event.stopPropagation()}
                        onDragStart={event => handleDragStart(event, item.id)}
                        onDrag={moveDragPreview}
                        onDragEnd={handleDragEnd}
                        aria-label={`${item.name} 순서 변경`}
                        title="누른 상태로 드래그하여 순서 변경"
                        className="mx-auto inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-lg text-[#61708E] transition hover:bg-[#EEEAFE] hover:text-[#5B39D6] active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="border-b border-[#E2E8F0] px-3 py-3">
                      <span className="font-black text-slate-800">{item.name}</span>
                    </td>
                    <td
                      className="truncate border-b border-[#E2E8F0] px-3 py-3 font-semibold text-[#64748B]"
                      title={item.description}
                    >
                      {item.description || '-'}
                    </td>
                    <td className="border-b border-[#E2E8F0] px-3 py-3 text-center font-semibold text-[#50607F]">
                      {item.memberCount.toLocaleString()}명
                    </td>
                    <td
                      className="border-b border-[#E2E8F0] px-3 py-3 text-center"
                      onClick={event => event.stopPropagation()}
                    >
                      <AppToggle
                        checked={item.enabled}
                        onChange={() => handleToggleItem(item.id)}
                        ariaLabel={`${item.name} 사용 여부`}
                      />
                    </td>
                    <td className="border-b border-[#E2E8F0] px-3 py-3 text-center font-semibold text-[#50607F]">
                      {item.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {modalOpen ? (
        <ItemModal
          mode={modalState.mode}
          category={activeCategory}
          draft={modalState.draft}
          onChange={handleChangeDraft}
          onClose={handleCloseModal}
          onDelete={handleDeleteDepartment}
          onSave={handleSaveModal}
        />
      ) : null}
    </PageLayout>
  );
}
