import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GlassPagination from '../../components/GlassPagination.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import { DateRangePicker } from '../../components/monitoring/MonitoringListComponents.jsx';
import {
  monitoringTableBodyClass,
  monitoringTableCellClass,
  monitoringTableClass,
  monitoringTableHeadClass,
  monitoringTableHeaderCellClass,
  monitoringTableHeaderRowClass,
  monitoringTableRowClass,
  monitoringTableScrollClass,
  monitoringTableSurfaceClass,
} from '../../components/monitoring/monitoringTableStyles.js';
import PageLayout from '../../layout/PageLayout.jsx';

const PAGE_SIZE = 6;

const NOTIFICATION_CONTENT = [
  {
    title: '검토 필요 항목이 발생했습니다.',
    preview: 'ahn@cloudmate.com 사용자의 요청이 관리자 검토 필요로 분류되었습니다.',
    user: 'ahn@cloudmate.com',
    service: 'ChatGPT',
    policy: '개인정보 보호 정책',
    summary: '주민등록번호, 이메일 등 개인정보가 포함된 요청이 탐지되었습니다.',
    action: '검토 대기',
    type: 'other',
  },
  {
    title: 'API Key 노출 시도가 반복 탐지되었습니다.',
    preview: '최근 1시간 동안 API Key 관련 탐지가 5건 발생했습니다.',
    user: 'lee@cloudmate.com',
    service: 'Claude',
    policy: 'API Key 보호 정책',
    summary: '동일 사용자의 프롬프트에서 API Key 형식의 문자열이 반복 탐지되었습니다.',
    action: '검토 대기',
    type: 'repeat',
  },
  {
    title: 'Claude 서비스의 차단 건수가 급증했습니다.',
    preview: '전일 대비 32% 증가했습니다. (어제 25건 → 오늘 33건)',
    user: '전체 사용자',
    service: 'Claude',
    policy: '서비스 차단 정책',
    summary: 'Claude 서비스에서 차단 처리된 요청 건수가 평소보다 크게 증가했습니다.',
    action: '검토 대기',
    type: 'repeat',
  },
  {
    title: '개인정보 보호 정책이 수정되었습니다.',
    preview: "미수정 정책에 '전화번호' 룰이 추가되었습니다.",
    user: 'admin@cloudmate.com',
    service: '전체 서비스',
    policy: '개인정보 보호 정책',
    summary: '정책 탐지 항목과 조치 방식이 관리자에 의해 변경되었습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '다운로드 URL이 변경되었습니다.',
    preview: '기존 /download → /guide 로 변경되었습니다.',
    user: 'admin@cloudmate.com',
    service: 'GARIM',
    policy: '다운로드 설정',
    summary: '사용자에게 제공되는 에이전트 다운로드 URL이 변경되었습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '사용자 정보가 수정되었습니다.',
    preview: "kim@cloudmate.com 사용자의 부서가 '개발팀'으로 변경되었습니다.",
    user: 'kim@cloudmate.com',
    service: 'GARIM',
    policy: '사용자 관리',
    summary: '관리자가 사용자의 부서와 직책 정보를 수정했습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '시스템 점검이 완료되었습니다.',
    preview: '2026-05-20 09:00 ~ 09:30 기간의 시스템 점검이 완료되었습니다.',
    user: '시스템',
    service: 'GARIM',
    policy: '시스템 운영',
    summary: '예정된 시스템 점검이 정상적으로 완료되었습니다.',
    action: '확인 완료',
    type: 'system',
  },
  {
    title: '민감정보 탐지가 반복 발생했습니다.',
    preview: '동일 사용자의 요청에서 민감정보가 3회 연속 탐지되었습니다.',
    user: 'park@cloudmate.com',
    service: 'ChatGPT',
    policy: '민감정보 보호 정책',
    summary: '짧은 시간 내 동일 유형의 민감정보 탐지가 반복 발생했습니다.',
    action: '검토 대기',
    type: 'repeat',
  },
  {
    title: '차단 정책의 적용 서비스가 변경되었습니다.',
    preview: '서비스 차단 정책에 Gemini가 추가되었습니다.',
    user: 'admin@cloudmate.com',
    service: 'Gemini',
    policy: '서비스 차단 정책',
    summary: '관리자가 정책 적용 서비스 목록을 변경했습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '서비스 연결이 복구되었습니다.',
    preview: '일시적으로 중단되었던 정책 서버 연결이 복구되었습니다.',
    user: '시스템',
    service: 'GARIM',
    policy: '시스템 운영',
    summary: '정책 서버 연결 상태가 정상으로 복구되었습니다.',
    action: '확인 완료',
    type: 'system',
  },
  {
    title: '카드번호 탐지가 반복 발생했습니다.',
    preview: '최근 30분 동안 카드번호 관련 탐지가 4건 발생했습니다.',
    user: 'choi@cloudmate.com',
    service: 'Copilot',
    policy: '금융정보 보호 정책',
    summary: '동일 사용자의 요청에서 카드번호 형식이 반복 탐지되었습니다.',
    action: '검토 대기',
    type: 'repeat',
  },
  {
    title: '외부 도메인 사용 설정이 변경되었습니다.',
    preview: 'Genspark 도메인이 미사용으로 변경되었습니다.',
    user: 'admin@cloudmate.com',
    service: 'Genspark',
    policy: '도메인 설정',
    summary: '관리자가 외부 AI 서비스 도메인의 사용 상태를 변경했습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '대량 요청이 탐지되었습니다.',
    preview: '단일 사용자에게서 비정상적으로 많은 요청이 발생했습니다.',
    user: 'jung@cloudmate.com',
    service: 'ChatGPT',
    policy: '이상 요청 탐지 정책',
    summary: '짧은 시간에 기준치를 초과하는 요청이 발생해 검토가 필요합니다.',
    action: '검토 대기',
    type: 'other',
  },
  {
    title: '관리자 알림 설정이 변경되었습니다.',
    preview: '정책 위반 알림 수신 설정이 활성화되었습니다.',
    user: 'admin@cloudmate.com',
    service: 'GARIM',
    policy: '알림 설정',
    summary: '관리자 알림 수신 조건이 변경되었습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '정책 예외 항목이 추가되었습니다.',
    preview: '개인정보 보호 정책에 예외 항목 2개가 추가되었습니다.',
    user: 'admin@cloudmate.com',
    service: '전체 서비스',
    policy: '개인정보 보호 정책',
    summary: '관리자가 정책 탐지 예외 항목을 추가했습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '프록시 설정 동기화가 완료되었습니다.',
    preview: '등록된 사용자 128명의 프록시 설정이 동기화되었습니다.',
    user: '시스템',
    service: 'GARIM',
    policy: '시스템 운영',
    summary: '모든 등록 사용자의 프록시 설정 동기화가 완료되었습니다.',
    action: '확인 완료',
    type: 'system',
  },
  {
    title: '정책 위반 요청이 반복 탐지되었습니다.',
    preview: '동일 정책 위반 요청이 최근 1시간 동안 6건 발생했습니다.',
    user: 'seo@cloudmate.com',
    service: 'Gemini',
    policy: '기밀정보 보호 정책',
    summary: '동일 사용자의 정책 위반 요청이 반복적으로 탐지되었습니다.',
    action: '검토 대기',
    type: 'repeat',
  },
  {
    title: '사용자 부서 정보가 일괄 변경되었습니다.',
    preview: '사용자 12명의 부서 정보가 업데이트되었습니다.',
    user: 'admin@cloudmate.com',
    service: 'GARIM',
    policy: '사용자 관리',
    summary: '조직 개편에 따라 사용자 부서 정보가 일괄 변경되었습니다.',
    action: '확인 완료',
    type: 'settings',
  },
  {
    title: '마스킹 정책이 정상 적용되었습니다.',
    preview: '개인정보 마스킹 정책의 적용 상태를 확인했습니다.',
    user: '관리자',
    service: 'ChatGPT',
    policy: '개인정보 보호 정책',
    summary: '설정된 마스킹 정책이 대상 서비스에 정상 적용되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
  {
    title: '신규 사용자가 등록되었습니다.',
    preview: '신규 사용자 4명이 GARIM에 등록되었습니다.',
    user: '관리자',
    service: 'GARIM',
    policy: '사용자 관리',
    summary: '신규 사용자 등록 처리가 완료되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
  {
    title: '정책 배포가 완료되었습니다.',
    preview: '변경된 정책이 전체 사용자에게 배포되었습니다.',
    user: '관리자',
    service: '전체 서비스',
    policy: '정책 배포',
    summary: '최신 정책 버전이 모든 대상 사용자에게 배포되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
  {
    title: '도메인 연결 상태를 확인했습니다.',
    preview: '등록된 외부 AI 서비스 도메인이 정상 연결 상태입니다.',
    user: '관리자',
    service: '전체 서비스',
    policy: '도메인 설정',
    summary: '등록된 외부 AI 서비스의 연결 상태 점검이 완료되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
  {
    title: '운영 가이드가 업데이트되었습니다.',
    preview: '최신 운영 가이드 파일이 등록되었습니다.',
    user: '관리자',
    service: 'GARIM',
    policy: '운영지원',
    summary: '관리자용 운영 가이드가 최신 버전으로 업데이트되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
  {
    title: '일일 탐지 보고서가 생성되었습니다.',
    preview: '2026-05-19 탐지 현황 보고서가 생성되었습니다.',
    user: '관리자',
    service: '전체 서비스',
    policy: '모니터링',
    summary: '전일 탐지 현황을 요약한 보고서가 생성되었습니다.',
    action: '확인 완료',
    type: 'other',
  },
];

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const INITIAL_NOTIFICATIONS = NOTIFICATION_CONTENT.map((item, index) => {
  const minuteOffset = index * 47;
  const baseDate = new Date('2026-05-20T13:22:15');
  baseDate.setMinutes(baseDate.getMinutes() - minuteOffset);

  return {
    ...item,
    id: index + 1,
    occurredAt: formatDateTime(baseDate),
    completed: item.action === '확인 완료',
  };
});

function createDefaultDateRange() {
  const endDate = new Date(INITIAL_NOTIFICATIONS[0].occurredAt.replace(' ', 'T'));
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - 6);

  return {
    startDate: formatDateTime(startDate).slice(0, 10),
    endDate: formatDateTime(endDate).slice(0, 10),
  };
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const defaultDateRange = useMemo(() => createDefaultDateRange(), []);
  const notifications = INITIAL_NOTIFICATIONS;
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return notifications
      .filter(item => {
        const occurredAt = new Date(item.occurredAt.replace(' ', 'T'));
        if (startBoundary && occurredAt < startBoundary) return false;
        if (endBoundary && occurredAt > endBoundary) return false;

        return normalizedQuery
          ? [item.title, item.preview, item.user].some(value =>
              value.toLowerCase().includes(normalizedQuery)
            )
          : true;
      })
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  }, [endDate, notifications, searchQuery, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleNotifications = filteredNotifications.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const handleNavigateToMonitoring = notification => {
    const occurredDate = notification.occurredAt.slice(0, 10);
    const searchParams = new URLSearchParams({
      startDate: occurredDate,
      endDate: occurredDate,
      user: notification.user,
    });

    navigate(`/monitoring?${searchParams.toString()}`);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <DateRangePicker
              label="조회 기간"
              startDate={startDate}
              endDate={endDate}
              onChange={range => {
                setStartDate(range.startDate);
                setEndDate(range.endDate);
                setCurrentPage(1);
              }}
              widthClass="w-full md:w-[12rem]"
              labelClassName="sr-only"
              triggerHeightClass="h-12"
            />
            <label className="relative w-full md:w-[21rem]">
              <input
                type="text"
                value={searchQuery}
                onChange={event => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="제목, 내용, 사용자 검색"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A5B4FC] focus:ring-4 focus:ring-[#E0E7FF]"
              />
              <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>
          </div>
        </div>

        <SectionCard className="overflow-hidden">
          <div className={monitoringTableSurfaceClass}>
            <div className={monitoringTableScrollClass}>
              <table className={`${monitoringTableClass} min-w-[920px] text-left`}>
                <thead className={monitoringTableHeadClass}>
                  <tr className={monitoringTableHeaderRowClass}>
                    <th className={`${monitoringTableHeaderCellClass} w-[36%] px-5`}>제목</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[34%] px-3`}>내용</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[17%] px-3`}>사용자</th>
                    <th className={`${monitoringTableHeaderCellClass} w-[13%] px-3`}>발생 일시</th>
                  </tr>
                </thead>
                <tbody className={monitoringTableBodyClass}>
                  {visibleNotifications.map((notification, index) => (
                    <tr
                      key={notification.id}
                      onClick={() => handleNavigateToMonitoring(notification)}
                      className={monitoringTableRowClass({
                        striped: index % 2 === 1,
                        interactive: true,
                      })}
                    >
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'px-5 font-semibold text-slate-800'
                        )}
                      >
                        <div className="truncate">{notification.title}</div>
                      </td>
                      <td className={monitoringTableCellClass(index, 'px-3 text-slate-600')}>
                        <div className="truncate">{notification.preview}</div>
                      </td>
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'whitespace-nowrap px-3 text-slate-600'
                        )}
                      >
                        <div className="truncate">{notification.user}</div>
                      </td>
                      <td
                        className={monitoringTableCellClass(
                          index,
                          'whitespace-nowrap px-3 text-slate-600'
                        )}
                      >
                        {notification.occurredAt.slice(0, 16)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!visibleNotifications.length ? (
              <div className="grid min-h-[20rem] place-items-center px-6 py-10 text-sm font-semibold text-slate-400">
                현재 조건에 맞는 알림이 없습니다.
              </div>
            ) : null}
          </div>
        </SectionCard>

        {filteredNotifications.length ? (
          <div className="mt-1 shrink-0 pb-0">
            <GlassPagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
}
