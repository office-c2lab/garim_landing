import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';
import { useSidebarStore } from '../stores/sidebarStore.js';

export default function AppShell({ showBrand = true }) {
  const isMobileSidebarOpen = useSidebarStore(state => state.isMobileSidebarOpen);
  const toggleMobileSidebar = useSidebarStore(state => state.toggleMobileSidebar);
  const closeMobileSidebar = useSidebarStore(state => state.closeMobileSidebar);
  const [pageMetaOverride, setPageMetaOverride] = useState(null);

  useEffect(() => {
    if (!isMobileSidebarOpen) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        closeMobileSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7FB] text-[#111827] lg:h-screen">
      <div className="h-full w-full overflow-hidden">
        <div className="fixed inset-x-0 top-0 z-30">
          <AppHeader
            isSidebarOpen={isMobileSidebarOpen}
            onMenuClick={toggleMobileSidebar}
            pageMetaOverride={pageMetaOverride}
          />
        </div>

        <div className="fixed top-[var(--app-header-height)] left-0 bottom-0 z-40 hidden w-[var(--app-sidebar-width)] lg:block">
          <AppSidebar showBrand={showBrand} />
        </div>

        <div
          className={`fixed inset-0 z-50 transition lg:hidden ${
            isMobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`.trim()}
          aria-hidden={!isMobileSidebarOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-[rgba(2,10,24,0.58)] backdrop-blur-[3px] transition ${
              isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`.trim()}
            aria-label="사이드바 닫기"
            onClick={closeMobileSidebar}
          />

          <div
            id="app-sidebar-drawer"
            className={`absolute top-[var(--app-header-height)] left-0 bottom-0 w-[var(--app-sidebar-mobile-width)] max-w-full transition-transform duration-300 ease-out ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`.trim()}
          >
            <AppSidebar showBrand={showBrand} onNavigate={closeMobileSidebar} />
          </div>
        </div>

        <section className="fixed top-[var(--app-header-height)] right-0 bottom-0 left-0 overflow-hidden border-t border-[#E7ECF5] bg-[#F5F7FB] text-[#111827] lg:left-[var(--app-sidebar-width)] lg:border-l lg:border-[#E7ECF5]">
          <div className="hover-scrollbar relative h-full overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full w-full bg-[#F5F7FB]">
              <Outlet context={{ setPageMetaOverride }} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
