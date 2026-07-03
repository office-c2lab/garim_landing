import { createElement, useMemo, useState } from 'react';
import { AlertTriangle, Plus, Save, ShieldAlert, ShieldCheck, Tag, Trash2, X } from 'lucide-react';

import AppButton from '../../components/AppButton.jsx';
import AppSearchField from '../../components/AppSearchField.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import { MonitoringDropdown } from '../../components/monitoring/MonitoringListComponents.jsx';
import PageLayout from '../../layout/PageLayout.jsx';

const STATUS_META = {
  block: {
    label: '차단',
    icon: ShieldAlert,
    badgeClass: 'border-[#FFD6D7] bg-[#FFF1F1] text-[#FF4D4F]',
    dotClass: 'bg-[#FF4D4F]',
    cardClass: 'bg-[#FFF1F1] text-[#FF4D4F]',
  },
  masking: {
    label: '마스킹',
    icon: ShieldCheck,
    badgeClass: 'border-[#FDE6B8] bg-[#FFF8EB] text-[#F59E0B]',
    dotClass: 'bg-[#F59E0B]',
    cardClass: 'bg-[#FFF8EB] text-[#F59E0B]',
  },
  review: {
    label: '검토 필요',
    icon: AlertTriangle,
    badgeClass: 'border-[#BDEFF7] bg-[#ECFEFF] text-[#06B6D4]',
    dotClass: 'bg-[#06B6D4]',
    cardClass: 'bg-[#ECFEFF] text-[#06B6D4]',
  },
};

const initialKeywords = [
  {
    id: 'kw-001',
    keyword: '주민등록번호',
    description: '한국의 주민등록번호 패턴을 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-002',
    keyword: '계좌번호',
    description: '은행 계좌번호 또는 송금 정보가 포함된 입력을 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-003',
    keyword: '카드번호',
    description: '신용카드 번호와 결제 정보 패턴을 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-004',
    keyword: '여권번호',
    description: '여권번호와 신분증 관련 정보를 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-005',
    keyword: '운전면허번호',
    description: '운전면허번호 형식의 민감 정보를 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-006',
    keyword: '신용카드 CVV',
    description: '카드 보안 코드와 결제 인증 정보를 탐지합니다.',
    status: 'block',
    category: '개인정보',
  },
  {
    id: 'kw-007',
    keyword: '급여정보',
    description: '임직원 급여, 보상, 인사 평가 정보를 탐지합니다.',
    status: 'block',
    category: '기밀정보',
  },
  {
    id: 'kw-008',
    keyword: 'Access Token',
    description: '외부 시스템 접근 토큰과 인증 키를 탐지합니다.',
    status: 'block',
    category: '보안정보',
  },
  {
    id: 'kw-009',
    keyword: 'API Key',
    description: 'API 인증 키와 서비스 연동 비밀 값을 탐지합니다.',
    status: 'block',
    category: '보안정보',
  },
  {
    id: 'kw-010',
    keyword: '이메일',
    description: '개인 또는 업무 이메일 주소를 마스킹 처리합니다.',
    status: 'masking',
    category: '개인정보',
  },
  {
    id: 'kw-011',
    keyword: '전화번호',
    description: '휴대전화와 유선전화 번호를 마스킹 처리합니다.',
    status: 'masking',
    category: '개인정보',
  },
  {
    id: 'kw-012',
    keyword: '주소',
    description: '주소 정보와 위치 기반 개인정보를 마스킹 처리합니다.',
    status: 'masking',
    category: '개인정보',
  },
  {
    id: 'kw-013',
    keyword: '이름',
    description: '사람 이름으로 추정되는 텍스트를 마스킹 처리합니다.',
    status: 'masking',
    category: '개인정보',
  },
  {
    id: 'kw-014',
    keyword: '회사명',
    description: '외부 공개 전 확인이 필요한 회사명을 마스킹 처리합니다.',
    status: 'masking',
    category: '기밀정보',
  },
  {
    id: 'kw-015',
    keyword: '프로젝트 코드명',
    description: '내부 프로젝트 코드명과 릴리즈 명칭을 마스킹 처리합니다.',
    status: 'masking',
    category: '기밀정보',
  },
  {
    id: 'kw-016',
    keyword: '리포지토리 URL',
    description: '소스 저장소 URL과 내부 코드 위치를 마스킹 처리합니다.',
    status: 'masking',
    category: '보안정보',
  },
  {
    id: 'kw-017',
    keyword: '시스템 프롬프트',
    description: '시스템 지시문 유출 가능성이 있는 입력을 검토 대상으로 분류합니다.',
    status: 'review',
    category: '프롬프트 보안',
  },
  {
    id: 'kw-018',
    keyword: '역할 우회',
    description: '역할 변경 또는 권한 우회 시도를 검토 대상으로 분류합니다.',
    status: 'review',
    category: '프롬프트 보안',
  },
  {
    id: 'kw-019',
    keyword: '탈옥 시도',
    description: 'AI 안전 정책을 우회하려는 요청을 검토 대상으로 분류합니다.',
    status: 'review',
    category: '프롬프트 보안',
  },
  {
    id: 'kw-020',
    keyword: '민감한 질문',
    description: '관리자 검토가 필요한 민감 주제 질문을 분류합니다.',
    status: 'review',
    category: '운영정책',
  },
  {
    id: 'kw-021',
    keyword: '정치적 발언',
    description: '정책상 추가 검토가 필요한 정치 관련 표현을 분류합니다.',
    status: 'review',
    category: '운영정책',
  },
];

const scrollPreviewKeywords = Array.from({ length: 200 }, (_, index) => {
  const statusCycle = ['block', 'masking', 'review'];
  const status = statusCycle[index % statusCycle.length];
  const number = index + 1;

  return {
    id: `kw-scroll-${String(number).padStart(3, '0')}`,
    keyword: `${number}`,
    description: `스크롤 확인용 키워드 ${number}번입니다.`,
    status,
    category: '운영정책',
  };
});

const keywordSeedData = [...initialKeywords, ...scrollPreviewKeywords];

const categoryOptions = [
  '전체 분류',
  '개인정보',
  '기밀정보',
  '보안정보',
  '프롬프트 보안',
  '운영정책',
];
const statusTabs = ['all', 'block', 'masking', 'review'];

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function createKeywordDraft(keyword = {}) {
  return {
    id: keyword.id ?? `kw-${Date.now()}`,
    keyword: keyword.keyword ?? '',
    status: keyword.status ?? 'block',
  };
}

function StatCard({ label, value, icon, iconClassName, suffix = '개' }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-4">
        <div
          className={joinClasses(
            'flex h-11 w-11 items-center justify-center rounded-[8px]',
            iconClassName
          )}
        >
          {createElement(icon, {
            className: 'h-5 w-5',
            strokeWidth: 2.2,
            'aria-hidden': 'true',
          })}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-slate-700">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-bold leading-none tracking-normal text-[#4338CA]">
              {value}
            </span>
            <span className="text-[13px] font-semibold text-slate-500">{suffix}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeywordChip({ keyword, onClick }) {
  const meta = STATUS_META[keyword.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={joinClasses(
        'inline-flex h-8 max-w-full cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[12px] font-bold transition duration-150 hover:brightness-[0.96] hover:shadow-[0_4px_10px_rgba(15,23,42,0.08)]',
        meta.badgeClass,
        'hover:border-current'
      )}
    >
      <span className="min-w-0 truncate">{keyword.keyword}</span>
    </button>
  );
}

function KeywordColumn({ status, items, onSelect }) {
  const meta = STATUS_META[status];

  return (
    <section className="min-w-0 border-b border-slate-200 px-4 py-4 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0">
      <div className="mb-4 flex items-center gap-2">
        <span className={joinClasses('h-4 w-0.5 rounded-full', meta.dotClass)} />
        <h2 className="text-[15px] font-bold text-slate-900">{meta.label} 키워드</h2>
        <span
          className={joinClasses('rounded-full px-2 py-0.5 text-[11px] font-bold', meta.badgeClass)}
        >
          {items.length}
        </span>
      </div>

      <div className="relative">
        <div className="flex max-h-[min(54vh,26.875rem)] flex-wrap content-start gap-[var(--app-gap-xs)] overflow-y-auto p-[calc(var(--app-pad-xs)/2)] pb-[calc(var(--app-pad-lg)*1.5)]">
          {items.map(keyword => (
            <KeywordChip key={keyword.id} keyword={keyword} onClick={() => onSelect(keyword.id)} />
          ))}
        </div>
        {items.length > 24 ? (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-white via-white/90 to-white/0" />
        ) : null}
      </div>
    </section>
  );
}

function KeywordEditorModal({ mode, draftKeyword, setDraftKeyword, onClose, onDelete, onSave }) {
  if (!draftKeyword) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6">
      <section className="flex max-h-[min(44rem,calc(100vh-3rem))] w-full max-w-[34rem] flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-[17px] font-bold text-slate-900">
            {mode === 'create' ? '키워드 추가' : '키워드 수정'}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[6px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[13px] font-bold text-slate-700">
                키워드명 <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={draftKeyword.keyword}
                onChange={event =>
                  setDraftKeyword(current => ({ ...current, keyword: event.target.value }))
                }
                maxLength={50}
                className="mt-2 h-11 w-full rounded-[6px] border border-slate-200 bg-white px-3 text-[14px] font-semibold text-slate-800 outline-none transition focus:border-[#8B7CF6] focus:ring-4 focus:ring-[#E8E2FF]"
              />
              <span className="mt-1 block text-right text-[12px] font-medium text-slate-400">
                {draftKeyword.keyword.length} / 50
              </span>
            </label>

            <div>
              <p className="text-[13px] font-bold text-slate-700">
                조치 상태 <span className="text-red-500">*</span>
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {['block', 'masking', 'review'].map(status => {
                  const isSelected = draftKeyword.status === status;

                  return (
                    <label
                      key={status}
                      className={joinClasses(
                        'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[6px] border px-3 text-[14px] font-bold transition',
                        isSelected
                          ? `${STATUS_META[status].badgeClass} ring-2 ring-[#E8E2FF]`
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <input
                        type="radio"
                        name="keyword-status"
                        checked={isSelected}
                        onChange={() => setDraftKeyword(current => ({ ...current, status }))}
                        className="h-4 w-4 accent-[#6D5DF6]"
                      />
                      {STATUS_META[status].label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[6px] border border-[#E4E2FF] bg-[#F5F3FF] px-3 py-3 text-[12px] font-semibold leading-5 text-[#5B4BD7]">
              저장한 키워드는 정책 상태에 따라 즉시 탐지 기준에 반영됩니다.
            </div>
          </div>
        </div>

        <div
          className={joinClasses(
            'grid shrink-0 gap-3 border-t border-slate-200 px-5 py-4',
            mode === 'create' ? 'grid-cols-1' : 'grid-cols-[6rem_minmax(0,1fr)]'
          )}
        >
          {mode === 'edit' ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-red-200 bg-white px-4 text-[14px] font-bold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              삭제
            </button>
          ) : null}
          <AppButton onClick={onSave} className="h-11 gap-2 rounded-[6px]">
            <Save className="h-4 w-4" aria-hidden="true" />
            저장
          </AppButton>
        </div>
      </section>
    </div>
  );
}

export function KeywordManagementContent({ toolbarAction = null }) {
  const [keywords, setKeywords] = useState(keywordSeedData);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [draftKeyword, setDraftKeyword] = useState(null);

  const counts = useMemo(() => {
    return {
      all: keywords.length,
      block: keywords.filter(keyword => keyword.status === 'block').length,
      masking: keywords.filter(keyword => keyword.status === 'masking').length,
      review: keywords.filter(keyword => keyword.status === 'review').length,
    };
  }, [keywords]);

  const filteredKeywords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return keywords.filter(keyword => {
      const matchesCategory =
        selectedCategory === '전체 분류' ? true : keyword.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' ? true : keyword.status === selectedStatus;
      const matchesSearch = normalizedQuery
        ? [keyword.keyword, keyword.description, keyword.category]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [keywords, searchQuery, selectedCategory, selectedStatus]);

  const groupedKeywords = {
    block: filteredKeywords.filter(keyword => keyword.status === 'block'),
    masking: filteredKeywords.filter(keyword => keyword.status === 'masking'),
    review: filteredKeywords.filter(keyword => keyword.status === 'review'),
  };

  const handleSelectKeyword = keywordId => {
    const nextKeyword = keywords.find(keyword => keyword.id === keywordId);
    setDraftKeyword(createKeywordDraft(nextKeyword));
    setModalMode('edit');
  };

  const handleAddKeyword = () => {
    const newKeyword = createKeywordDraft({
      status: selectedStatus === 'all' ? 'block' : selectedStatus,
    });

    setDraftKeyword(newKeyword);
    setModalMode('create');
  };

  const handleSaveKeyword = () => {
    if (!draftKeyword) return;

    setKeywords(current => {
      const hasKeyword = current.some(keyword => keyword.id === draftKeyword.id);

      if (hasKeyword) {
        return current.map(keyword =>
          keyword.id === draftKeyword.id ? { ...draftKeyword } : keyword
        );
      }

      return [{ ...draftKeyword }, ...current];
    });
    setModalMode(null);
    setDraftKeyword(null);
  };

  const handleDeleteKeyword = () => {
    if (!draftKeyword) return;

    setKeywords(current => {
      const nextKeywords = current.filter(keyword => keyword.id !== draftKeyword.id);
      return nextKeywords;
    });
    setModalMode(null);
    setDraftKeyword(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {toolbarAction ? <div className="flex shrink-0 justify-start">{toolbarAction}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="전체 키워드"
          value={counts.all}
          icon={Tag}
          iconClassName="bg-violet-50 text-[#6D5DF6]"
        />
        <StatCard
          label="차단"
          value={counts.block}
          icon={ShieldAlert}
          iconClassName={STATUS_META.block.cardClass}
        />
        <StatCard
          label="마스킹"
          value={counts.masking}
          icon={ShieldCheck}
          iconClassName={STATUS_META.masking.cardClass}
        />
        <StatCard
          label="검토 필요"
          value={counts.review}
          icon={AlertTriangle}
          iconClassName={STATUS_META.review.cardClass}
        />
      </div>

      <SectionCard className="overflow-hidden rounded-[8px]">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row">
              <MonitoringDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                ariaLabel="키워드 분류"
                widthClass="w-full lg:w-[12rem] lg:shrink-0"
                triggerClassName="h-11 rounded-[6px] border-slate-200 bg-white shadow-none"
              />
              <AppSearchField
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="키워드 검색"
                className="w-full lg:w-[18rem]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="grid grid-cols-4 rounded-[6px] bg-[#F6F7FB] p-1">
                {statusTabs.map(status => {
                  const isActive = selectedStatus === status;
                  const label = status === 'all' ? '전체' : STATUS_META[status].label;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={joinClasses(
                        'h-9 min-w-[4.5rem] cursor-pointer rounded-[5px] px-3 text-[13px] font-bold transition',
                        isActive
                          ? 'bg-white text-[#4338CA] shadow-[0_5px_14px_rgba(15,23,42,0.08)] ring-1 ring-[#B7ACFF]'
                          : 'text-slate-500 hover:text-slate-800'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <AppButton onClick={handleAddKeyword} className="h-11 min-w-[9.5rem] gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                키워드 추가
              </AppButton>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 lg:grid-cols-3">
          {['block', 'masking', 'review'].map(status => (
            <KeywordColumn
              key={status}
              status={status}
              items={groupedKeywords[status]}
              onSelect={handleSelectKeyword}
            />
          ))}
        </div>
      </SectionCard>

      {modalMode ? (
        <KeywordEditorModal
          mode={modalMode}
          draftKeyword={draftKeyword}
          setDraftKeyword={setDraftKeyword}
          onClose={() => {
            setModalMode(null);
            setDraftKeyword(null);
          }}
          onDelete={handleDeleteKeyword}
          onSave={handleSaveKeyword}
        />
      ) : null}
    </div>
  );
}

export default function KeywordPage() {
  return (
    <PageLayout topPaddingClassName="pt-5 sm:pt-6" gapClassName="gap-5">
      <KeywordManagementContent />
    </PageLayout>
  );
}
