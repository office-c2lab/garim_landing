import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../constants/contentLayout.js';
import GlassPagination from './GlassPagination.jsx';

export default function FixedPaginationBar({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-20 bg-[linear-gradient(180deg,rgba(245,247,251,0)_0%,rgba(245,247,251,0.94)_34%,#F5F7FB_100%)] pt-[calc(var(--app-pad-lg)*1.45)] pb-[var(--app-pad-md)] lg:left-[var(--app-sidebar-width)]">
      <div
        className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
      >
        <div className={`mx-auto py-[var(--app-pad-xs)] ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}>
          <div className="pointer-events-auto">
            <GlassPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
