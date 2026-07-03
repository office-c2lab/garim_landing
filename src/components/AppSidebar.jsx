import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_NAV_ITEMS = [
  {
    key: 'dashboard',
    label: '대시보드',
    path: '/dashboard',
  },
  {
    key: 'monitoring',
    label: '모니터링',
    path: '/monitoring',
    children: [
      { key: 'all', label: '전체', path: '/monitoring' },
      { key: 'block', label: '차단', path: '/monitoring?status=block' },
      { key: 'masking', label: '마스킹', path: '/monitoring?status=masking' },
      { key: 'allow', label: '검토필요', path: '/monitoring?status=allow' },
    ],
  },
  {
    key: 'users',
    label: '사용자 관리',
    path: '/users',
  },
  {
    key: 'policy',
    label: '정책',
    path: '/policies',
  },
  {
    key: 'domain',
    label: '도메인',
    path: '/domains',
  },
  {
    key: 'support',
    label: '운영지원',
    path: '/support',
  },
];

const ADMIN_PROFILE = {
  name: 'C2lab 관리자',
};

function getIsActive(pathname, itemPath) {
  if (itemPath === '/dashboard') {
    return pathname === '/' || pathname.startsWith('/dashboard');
  }

  return pathname.startsWith(itemPath);
}

function getIsChildActive(location, childPath) {
  const [pathname, search = ''] = childPath.split('?');

  if (location.pathname !== pathname) {
    return false;
  }

  return search ? location.search === `?${search}` : !location.search;
}

export default function AppSidebar({
  overlayHeader = false,
  showBrand = true,
  navItems = DEFAULT_NAV_ITEMS,
  onNavigate,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarTopPaddingClass = overlayHeader ? 'pt-0' : 'pt-0';
  const isMyPageActive = getIsActive(location.pathname, '/mypage');

  const handleNavigate = path => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-full overflow-hidden border-r border-[#E7ECF5] bg-white text-[#344054] shadow-[0_0.625rem_1.875rem_rgba(15,23,42,0.045)]">
      <div className="flex h-full w-full flex-col px-[var(--app-pad-sm)]">
        <div
          className={`flex min-h-0 flex-1 flex-col pb-[var(--app-pad-md)] ${sidebarTopPaddingClass}`.trim()}
        >
          <nav
            className={`flex min-h-0 flex-1 ${showBrand ? 'pt-[var(--app-pad-md)]' : 'pt-0'}`.trim()}
            aria-label="화면 이동 메뉴"
          >
            <ul className="h-full w-full space-y-[var(--app-gap-xs)] text-left">
              {navItems.map(item => {
                const isActive = getIsActive(location.pathname, item.path);
                const isExpanded = isActive && item.children?.length;

                return (
                  <li key={item.key} className={isExpanded ? 'pb-[var(--app-pad-xs)]' : ''}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={`group flex h-[var(--app-control-lg)] w-full cursor-pointer items-center gap-[var(--app-gap-sm)] rounded-[var(--app-radius-lg)] px-[var(--app-pad-sm)] text-left transition duration-200 ${
                        isActive
                          ? 'border border-[rgba(67,56,202,0.2)] bg-transparent text-[#4338CA] '
                          : 'border border-transparent bg-transparent text-[#5F6B85] hover:border-[#E7ECF5] hover:bg-[#F8FAFF] hover:text-[#1F2937]'
                      }`.trim()}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="min-w-0 flex-1 truncate text-[clamp(0.88rem,1.18vw,0.95rem)] font-semibold leading-[140%]">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-[clamp(0.5rem,0.7vw,0.625rem)] w-[clamp(0.5rem,0.7vw,0.625rem)] flex-none rounded-full transition duration-200 ${
                          isActive
                            ? 'bg-[#4338CA] shadow-[0_0_0_4px_rgba(67,56,202,0.12),0_0_18px_rgba(67,56,202,0.2)]'
                            : 'bg-[#D8E0EB] group-hover:bg-[#C7D2FE]'
                        }`.trim()}
                      />
                    </button>
                    {item.children?.length ? (
                      <div
                        className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
                          isExpanded
                            ? 'grid-rows-[1fr] opacity-100 translate-y-0'
                            : 'grid-rows-[0fr] opacity-0 -translate-y-1'
                        }`.trim()}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ul className="mt-[calc(var(--app-gap-xs)/3)] py-[var(--app-pad-xs)]">
                            {item.children.map((child, childIndex) => {
                              const isChildActive = getIsChildActive(location, child.path);
                              const isLastChild = childIndex === item.children.length - 1;

                              return (
                                <li
                                  key={child.key}
                                  className="relative ml-[clamp(1rem,1.55vw,1.375rem)] pb-[var(--app-pad-xs)] pl-[var(--app-pad-md)] last:pb-0"
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`absolute left-0 top-0 w-px bg-[#D9E0F0] ${
                                      isLastChild ? 'h-[clamp(1rem,1.3vw,1.125rem)]' : 'bottom-0'
                                    }`.trim()}
                                  />
                                  <span
                                    aria-hidden="true"
                                    className="absolute left-0 top-[clamp(1rem,1.3vw,1.125rem)] h-px w-[var(--app-pad-md)] bg-[#D9E0F0]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleNavigate(child.path)}
                                    className={`flex h-[var(--app-control-xs)] w-full items-center rounded-[var(--app-radius-sm)] px-[var(--app-pad-md)] text-left text-[clamp(0.82rem,1.05vw,0.9rem)] font-semibold transition duration-200 ${
                                      isChildActive
                                        ? 'bg-[#E8E2FF] text-[#3528B8]'
                                        : 'text-[#64728C] hover:bg-[#F8FAFF] hover:text-[#4338CA]'
                                    }`.trim()}
                                    aria-current={isChildActive ? 'page' : undefined}
                                  >
                                    {child.label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-[#E7ECF5] pt-[var(--app-pad-sm)]">
            <button
              type="button"
              onClick={() => handleNavigate('/mypage')}
              className={`group flex w-full cursor-pointer items-center gap-[var(--app-gap-sm)] rounded-[var(--app-radius-lg)] border px-[var(--app-pad-sm)] py-[var(--app-pad-sm)] text-left transition duration-200 ${
                isMyPageActive
                  ? 'border-[rgba(67,56,202,0.2)] bg-[#F8FAFF]'
                  : 'border-transparent bg-transparent hover:border-[#E7ECF5] hover:bg-[#F8FAFF]'
              }`.trim()}
              aria-current={isMyPageActive ? 'page' : undefined}
            >
              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate text-[clamp(0.82rem,1vw,0.9rem)] font-bold ${
                    isMyPageActive ? 'text-[#4338CA]' : 'text-[#344054]'
                  }`.trim()}
                >
                  {ADMIN_PROFILE.name}
                </span>
              </span>
              <ChevronRight
                className={`h-[var(--app-icon-xs)] w-[var(--app-icon-xs)] shrink-0 transition ${
                  isMyPageActive ? 'text-[#4338CA]' : 'text-[#A7B0C0] group-hover:text-[#4338CA]'
                }`.trim()}
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
