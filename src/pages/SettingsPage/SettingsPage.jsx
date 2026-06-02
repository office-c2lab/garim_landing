import {
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
      order: 1,
      createdAt: '2024.04.15',
    },
    {
      id: 'dept-dev',
      name: '개발팀',
      description: '제품 개발을 담당합니다.',
      enabled: true,
      order: 2,
      createdAt: '2024.04.15',
    },
    {
      id: 'dept-ops',
      name: '운영팀',
      description: '서비스 운영을 담당합니다.',
      enabled: true,
      order: 3,
      createdAt: '2024.04.16',
    },
    {
      id: 'dept-support',
      name: '경영지원팀',
      description: '경영지원 업무를 담당합니다.',
      enabled: true,
      order: 4,
      createdAt: '2024.04.16',
    },
    {
      id: 'dept-hr',
      name: '인사팀',
      description: '인사 관리를 담당합니다.',
      enabled: true,
      order: 5,
      createdAt: '2024.04.17',
    },
    {
      id: 'dept-marketing',
      name: '마케팅팀',
      description: '마케팅 업무를 담당합니다.',
      enabled: true,
      order: 6,
      createdAt: '2024.04.17',
    },
    {
      id: 'dept-finance',
      name: '재무팀',
      description: '재무 관리를 담당합니다.',
      enabled: true,
      order: 7,
      createdAt: '2024.04.18',
    },
    {
      id: 'dept-sales',
      name: '영업팀',
      description: '영업 업무를 담당합니다.',
      enabled: true,
      order: 8,
      createdAt: '2024.04.18',
    },
    {
      id: 'dept-cs',
      name: '고객지원팀',
      description: '고객 지원을 담당합니다.',
      enabled: true,
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
      order: 1,
      createdAt: '2024.04.15',
    },
    {
      id: 'position-manager',
      name: '매니저',
      description: '업무 실행을 관리합니다.',
      enabled: true,
      order: 2,
      createdAt: '2024.04.15',
    },
    {
      id: 'position-owner',
      name: '담당자',
      description: '실무를 담당합니다.',
      enabled: true,
      order: 3,
      createdAt: '2024.04.16',
    },
    {
      id: 'position-intern',
      name: '인턴',
      description: '업무를 보조합니다.',
      enabled: true,
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
  orderMode: 'last',
  order: '',
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

function buildDraft(item, categoryItems) {
  if (!item) {
    return {
      ...DEFAULT_MODAL_DRAFT,
      order: String(categoryItems.length + 1),
    };
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    enabled: item.enabled,
    orderMode: String(item.order),
    order: String(item.order),
  };
}

function SummaryCard({ icon, title, value, description, tone = 'purple' }) {
  const Icon = icon;
  const toneClass =
    tone === 'mint'
      ? 'bg-[#DDF8EF] text-[#18BFA7]'
      : 'bg-[linear-gradient(135deg,#F5EFFF_0%,#EFEAFF_100%)] text-[#5B21E5]';

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

function StatusBadge({ enabled }) {
  return (
    <span
      className={`inline-flex h-6 items-center justify-center rounded-full px-3 text-xs font-black ${
        enabled ? 'bg-[#F4EFFF] text-[#5B21E5]' : 'bg-slate-100 text-slate-500'
      }`.trim()}
    >
      {enabled ? '사용 중' : '미사용'}
    </span>
  );
}

function FieldLabel({ children, required = false, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-black text-slate-900">
      {children}
      {required ? <span className="ml-0.5 text-[#E11D48]">*</span> : null}
    </label>
  );
}

function ItemModal({ mode, category, draft, categoryItems, onChange, onClose, onSave }) {
  const meta = getCategoryMeta(category);
  const isSaveDisabled = !draft.name.trim();
  const lastOrder = mode === 'add' ? categoryItems.length + 1 : categoryItems.length;
  const lastOrderLabel = `마지막 (${lastOrder})`;
  const orderOptions = [
    ...(mode === 'add' ? [lastOrderLabel] : []),
    ...categoryItems.map(item => String(item.order)),
  ];
  const selectedOrderLabel = draft.orderMode === 'last' ? lastOrderLabel : draft.orderMode;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/25 px-4 py-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[25rem] flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] sm:rounded-[12px]"
      >
        <div className="flex items-start justify-between px-6 pb-3 pt-6">
          <div>
            <h2 id="settings-modal-title" className="text-[1.35rem] font-black text-slate-950">
              {mode === 'add' ? '새 항목 추가' : '항목 수정'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-100"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="monitoring-detail-scroll flex-1 overflow-y-auto px-6 py-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-name" required>
                {meta.fieldLabel}
              </FieldLabel>
              <input
                id="settings-item-name"
                type="text"
                value={draft.name}
                maxLength={50}
                onChange={event => onChange({ name: event.target.value })}
                placeholder={`예) 전략기획팀`}
                className="h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              />
              <p className="text-right text-xs font-bold text-slate-400">
                {draft.name.length} / 50
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-description">설명</FieldLabel>
              <textarea
                id="settings-item-description"
                value={draft.description}
                maxLength={200}
                rows={3}
                onChange={event => onChange({ description: event.target.value })}
                placeholder={`${meta.label}에 대한 간단한 설명을 입력하세요.`}
                className="resize-none rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#EDE9FE]"
              />
              <p className="text-right text-xs font-bold text-slate-400">
                {draft.description.length} / 200
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-enabled">사용 여부</FieldLabel>
              <div className="flex items-center gap-3">
                <AppToggle
                  checked={draft.enabled}
                  onChange={() => onChange({ enabled: !draft.enabled })}
                  ariaLabel="사용 여부"
                />
                <span className="text-sm font-bold text-slate-700">
                  {draft.enabled ? '사용 중' : '미사용'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="settings-item-order" required>
                표시 순서
              </FieldLabel>
              <MonitoringDropdown
                value={selectedOrderLabel}
                onChange={value => {
                  onChange({
                    orderMode: value === lastOrderLabel ? 'last' : value,
                    order: value === lastOrderLabel ? String(lastOrder) : value,
                  });
                }}
                options={orderOptions}
                ariaLabel="표시 순서"
                widthClass="w-full"
                triggerClassName="h-11 rounded-lg border-slate-200 bg-white shadow-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#E2E8F0] px-6 py-4">
          <MonitoringActionButton
            variant="outline"
            onClick={onClose}
            widthClass="w-full"
            heightClass="h-11"
          >
            취소
          </MonitoringActionButton>
          <MonitoringActionButton
            variant="primary"
            onClick={onSave}
            disabled={isSaveDisabled}
            widthClass="w-full"
            heightClass="h-11"
          >
            저장
          </MonitoringActionButton>
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
  const modalItems = itemsByCategory[activeCategory];
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
      draft: buildDraft(null, activeItems),
    });
  };

  const handleOpenEditModal = item => {
    setModalState({
      mode: 'edit',
      itemId: item.id,
      draft: buildDraft(item, activeItems),
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

  const handleSaveModal = () => {
    const { mode, itemId, draft } = modalState;
    const nextOrder = Number(draft.order);
    const nextItem = {
      id: itemId ?? `${activeCategory}-${Date.now()}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      enabled: draft.enabled,
      order: Number.isFinite(nextOrder) && nextOrder > 0 ? nextOrder : activeItems.length + 1,
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

        <SectionCard className="overflow-hidden rounded-[10px]">
          <div className="border-b border-[#E2E8F0]">
            <div className="flex h-12 items-end gap-7 px-5 sm:px-6">
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

          <div className="flex flex-col gap-4 px-5 py-4 sm:px-6">
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
                  <span className="text-sm font-bold text-slate-700">상태</span>
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

              <MonitoringActionButton
                variant="primary"
                onClick={handleOpenAddModal}
                heightClass="h-12"
                widthClass="w-full sm:w-[10.5rem]"
              >
                새 항목 추가
              </MonitoringActionButton>
            </div>

            <div className="max-h-[25rem] overflow-y-auto pr-1">
              <table className="w-full min-w-[54rem] table-fixed border-separate border-spacing-0 text-left">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="text-sm font-black text-[#4A5578]">
                    <th className="w-[5%] border-b border-[#E2E8F0] px-3 py-3" />
                    <th className="w-[34%] border-b border-[#E2E8F0] px-3 py-3">
                      {activeMeta.fieldLabel}
                    </th>
                    <th className="w-[18%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                      상태
                    </th>
                    <th className="w-[18%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                      표시 순서
                    </th>
                    <th className="w-[18%] border-b border-[#E2E8F0] px-3 py-3 text-center">
                      생성일
                    </th>
                    <th className="w-[7%] border-b border-[#E2E8F0] px-3 py-3 text-center">작업</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {filteredItems.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenEditModal(item)}
                      className="cursor-pointer bg-white transition hover:bg-[#F8FAFF]"
                    >
                      <td className="border-b border-[#E2E8F0] px-3 py-3 text-center text-[#61708E]">
                        <GripVertical className="mx-auto h-4 w-4" />
                      </td>
                      <td className="border-b border-[#E2E8F0] px-3 py-3">
                        <span className="font-black text-slate-800">{item.name}</span>
                      </td>
                      <td className="border-b border-[#E2E8F0] px-3 py-3 text-center">
                        <StatusBadge enabled={item.enabled} />
                      </td>
                      <td className="border-b border-[#E2E8F0] px-3 py-3 text-center font-black text-slate-700">
                        {item.order}
                      </td>
                      <td className="border-b border-[#E2E8F0] px-3 py-3 text-center font-semibold text-[#50607F]">
                        {item.createdAt}
                      </td>
                      <td className="border-b border-[#E2E8F0] px-3 py-3 text-center">
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#50607F] transition hover:bg-[#F4EFFF] hover:text-[#5B21E5]"
                          aria-label={`${item.name} 작업`}
                          onClick={event => {
                            event.stopPropagation();
                            handleOpenEditModal(item);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="mx-auto inline-flex items-center gap-2 py-1 text-sm font-black text-slate-400"
            >
              <ChevronDown className="h-4 w-4" />
              스크롤하여 더 보기
            </button>
          </div>
        </SectionCard>
      </div>

      {modalOpen ? (
        <ItemModal
          mode={modalState.mode}
          category={activeCategory}
          draft={modalState.draft}
          categoryItems={modalItems}
          onChange={handleChangeDraft}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
        />
      ) : null}
    </PageLayout>
  );
}
