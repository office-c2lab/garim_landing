import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../constants/contentLayout.js';
import { useSystemIpaddrQuery, useSystemResourceStream } from '../queries/systemQueries.js';
import RadarBrand from './RadarBrand.jsx';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Prompt Monitoring',
  '/users': 'User Management',
  '/policies': 'Policy Management',
  '/domains': 'Domains Management',
  '/support': 'Operation Support',
  '/mypage': 'My Page',
  '/download': 'Download',
};

export default function AppHeader({ onMenuClick, isSidebarOpen = false, pageMetaOverride = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageMetaOverride?.title ?? PAGE_TITLES[location.pathname] ?? 'GARIM';
  const pageSubtitle = pageMetaOverride?.subtitle ?? '';
  const { data: ipaddrData } = useSystemIpaddrQuery();
  const { data: resourceData } = useSystemResourceStream();

  return (
    <header className="w-full border-b border-[#E7ECF5] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
      <div className="flex h-[var(--app-header-height)] items-center justify-between px-[var(--app-page-x)] lg:hidden">
        <div className="flex min-w-0 items-center gap-[var(--app-gap-sm)]">
          <button
            type="button"
            aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar-drawer"
            onClick={onMenuClick}
            className={`flex h-[var(--app-control-sm)] items-center rounded-full border px-[var(--app-pad-md)] transition ${
              isSidebarOpen
                ? 'border-[#C7D2FE] bg-[#EEF2FF]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]'
            }`.trim()}
          >
            <RadarBrand radarClassName="w-[clamp(6.2rem,22vw,7.1rem)]" />
          </button>
          <HeaderTitle title={pageTitle} subtitle={pageSubtitle} compact />
        </div>

        <div className="ml-auto flex items-center gap-[var(--app-gap-xs)]">
          <HeaderSystemStatus compact ipaddrData={ipaddrData} resourceData={resourceData} />
        </div>
      </div>

      <div className="hidden h-[var(--app-header-height)] lg:flex">
        <div className="flex h-full w-[var(--app-sidebar-width)] items-center justify-center px-[var(--app-pad-sm)]">
          <button
            type="button"
            className="shrink-0 cursor-pointer"
            onClick={() => navigate('/dashboard')}
            aria-label="대시보드로 이동"
          >
            <RadarBrand radarClassName="w-[clamp(8rem,9.4vw,9.5rem)]" />
          </button>
        </div>

        <div className="h-full min-w-0 flex-1 px-[var(--app-pad-md)]">
          <div
            className={`mx-auto flex h-full w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
          >
            <div
              className={`mx-auto flex w-full items-center justify-between gap-[var(--app-gap-md)] ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
            >
              <div className="flex min-w-0 items-center gap-[var(--app-gap-sm)] pr-[var(--app-pad-md)]">
                <HeaderTitle title={pageTitle} subtitle={pageSubtitle} />
              </div>
              <div className="flex shrink-0 items-center gap-[var(--app-gap-md)]">
                <HeaderSystemStatus ipaddrData={ipaddrData} resourceData={resourceData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderTitle({ title, subtitle, compact = false }) {
  const titleColorClass = subtitle ? 'text-[#A78BFA]' : 'text-[#4E15BD]';

  return (
    <div className="flex min-w-0 items-center gap-[var(--app-gap-xs)]">
      <h1
        className={
          compact
            ? `truncate text-[clamp(0.9rem,3.6vw,1rem)] font-bold tracking-[-0.03em] ${titleColorClass}`
            : `shrink-0 text-[clamp(1.1rem,1.5vw,1.45rem)] font-bold tracking-[-0.035em] ${titleColorClass}`
        }
      >
        {title}
      </h1>
      {subtitle ? (
        <>
          <ChevronRight
            strokeWidth={3}
            className={
              compact
                ? 'h-[var(--app-icon-xs)] w-[var(--app-icon-xs)] shrink-0 text-[#4E15BD]'
                : 'h-[var(--app-icon-sm)] w-[var(--app-icon-sm)] shrink-0 text-[#4E15BD]'
            }
            aria-hidden="true"
          />
          <span
            className={
              compact
                ? 'truncate text-[clamp(0.9rem,3.6vw,1rem)] font-bold tracking-[-0.03em] text-[#4E15BD]'
                : 'truncate text-[clamp(1.1rem,1.5vw,1.45rem)] font-bold tracking-[-0.035em] text-[#4E15BD]'
            }
          >
            {subtitle}
          </span>
        </>
      ) : null}
    </div>
  );
}

function HeaderSystemStatus({ compact = false, ipaddrData, resourceData }) {
  const serverIp = getPrimaryIpAddress(ipaddrData);
  const diskValue = formatPercent(resourceData?.disk?.percent);
  const items = [
    {
      label: 'CPU',
      value: formatPercent(resourceData?.cpu?.percent),
      tooltipRows: getCpuTooltipRows(resourceData?.cpu),
      widthClass: compact ? 'w-[6.4rem]' : 'w-[6.7rem]',
      valueWidthClass: 'w-[6ch]',
    },
    {
      label: '메모리',
      value: formatPercent(resourceData?.memory?.percent),
      tooltipRows: getMemoryTooltipRows(resourceData?.memory),
      widthClass: compact ? 'w-[7.3rem]' : 'w-[7.7rem]',
      valueWidthClass: 'w-[6ch]',
    },
    {
      label: '저장공간',
      value: diskValue,
      tooltipRows: getDiskTooltipRows(resourceData?.disk),
      widthClass: compact ? 'w-[7.3rem]' : 'w-[7.9rem]',
      valueWidthClass: 'w-[6ch]',
    },
    {
      label: '서버 IP',
      value: serverIp,
      tooltipRows: getIpTooltipRows(ipaddrData),
      widthClass: 'w-fit',
      valueWidthClass: 'w-auto',
    },
  ];

  return (
    <div
      className={`flex items-center ${compact ? 'gap-[var(--app-gap-xs)]' : 'gap-[var(--app-gap-sm)]'}`.trim()}
    >
      {items.map(item => (
        <HeaderStatusTooltip key={item.label} rows={item.tooltipRows}>
          <div
            aria-label={item.tooltipRows?.length ? `${item.label} 상세 정보` : undefined}
            className={`flex h-[var(--app-control-xs)] ${item.widthClass} items-center justify-between gap-[var(--app-gap-xs)] rounded-full bg-[#F8FAFF] font-extrabold text-[#475467] ring-1 ring-[#E2E8F0] ${
              compact
                ? 'px-[var(--app-pad-xs)] text-[clamp(0.64rem,2.4vw,0.72rem)]'
                : 'px-[var(--app-pad-sm)] text-[clamp(0.74rem,0.9vw,0.82rem)]'
            }`.trim()}
          >
            <span className="shrink-0 text-[#111827]">{item.label}</span>
            <span
              className={`${item.valueWidthClass} whitespace-nowrap text-right text-[#4F37FF] tabular-nums`}
            >
              {item.value}
            </span>
          </div>
        </HeaderStatusTooltip>
      ))}
    </div>
  );
}

function HeaderStatusTooltip({ rows, children }) {
  if (!rows?.length) return children;

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className="pointer-events-none absolute top-[calc(100%+0.5rem)] right-0 z-50 w-max min-w-[9.5rem] rounded-lg border border-[#C7D2FE] bg-white px-3 py-2 text-[12px] font-bold whitespace-nowrap text-[#4338CA] opacity-0 shadow-[0_10px_24px_rgba(67,56,202,0.14)] transition group-hover:opacity-100"
        role="tooltip"
      >
        <dl className="grid gap-1.5">
          {rows.map(row => (
            <div
              key={row.label}
              className="grid grid-cols-[max-content_minmax(max-content,1fr)] gap-3"
            >
              <dt className="text-left text-[#667085]">{row.label}</dt>
              <dd className="whitespace-nowrap text-right text-[#2E3363]">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function getIpTooltipRows(ipaddrData) {
  const addresses = Array.isArray(ipaddrData?.ip_addresses) ? ipaddrData.ip_addresses : [];
  const ipv4Address = addresses.find(item => item?.family === 'ipv4' && item?.address);
  const ipv6Address = addresses.find(item => item?.family === 'ipv6' && item?.address);

  return [
    { label: '서버 이름', value: ipaddrData?.hostname ?? '-' },
    { label: 'IPv4', value: ipv4Address?.address ?? '-' },
    { label: 'IPv6', value: ipv6Address?.address ?? '-' },
  ];
}

function getCpuTooltipRows(cpu) {
  const loadAverage = cpu?.load_average;

  return [
    {
      label: '현재 사용 코어',
      value:
        typeof loadAverage?.used_cores === 'number' && typeof loadAverage?.total_cores === 'number'
          ? `${formatNumber(loadAverage.used_cores)} / ${formatNumber(loadAverage.total_cores)}`
          : '-',
    },
    { label: '1분 평균 부하', value: formatNumber(loadAverage?.['1m']) },
    { label: '5분 평균 부하', value: formatNumber(loadAverage?.['5m']) },
    { label: '15분 평균 부하', value: formatNumber(loadAverage?.['15m']) },
  ];
}

function getMemoryTooltipRows(memory) {
  return [
    { label: '전체', value: memory?.total ?? '-' },
    { label: '사용', value: memory?.used ?? '-' },
    { label: '사용 가능', value: memory?.available ?? '-' },
  ];
}

function getDiskTooltipRows(disk) {
  return [
    { label: '전체', value: disk?.total ?? '-' },
    { label: '사용', value: disk?.used ?? '-' },
    { label: '사용 가능', value: disk?.available ?? disk?.free ?? '-' },
  ];
}

function getPrimaryIpAddress(ipaddrData) {
  const addresses = Array.isArray(ipaddrData?.ip_addresses) ? ipaddrData.ip_addresses : [];
  const ipv4Address = addresses.find(item => item?.family === 'ipv4' && item?.address);
  const firstAddress = addresses.find(item => item?.address);

  return ipv4Address?.address ?? firstAddress?.address ?? '-';
}

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';

  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '-';

  return value.toFixed(value % 1 === 0 ? 0 : 2);
}
