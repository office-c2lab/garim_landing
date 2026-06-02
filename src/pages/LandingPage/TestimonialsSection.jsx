import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import responsibilityData from '../../../responsibilitydata.js';
import securityData from '../../../securitydata.js';
import BenchmarkResultDashboard from '@/components/project-detail/BenchmarkResultDashboard.jsx';
import SecurityResultDashboard from '@/components/project-detail/SecurityResultDashboard.jsx';
import { createProgressRowsFromMatrix } from '@/components/project-detail/projectDetailSessionUtils.js';
import {
  Container,
  HeroShaderBackground,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const RESULT_PREVIEW_MIN_HEIGHT = 420;
const RESULT_PREVIEW_MAX_HEIGHT = 760;
const RESULT_PREVIEW_CONTENT_WIDTH = 1360;
const RESULT_PREVIEW_PADDING_X = 4;
const RESULT_PREVIEW_PADDING_Y = 16;
const RESULT_PREVIEW_FIT = 0.9;

function ZoomedResultPreview({
  children,
  minHeight = 420,
  frameHeight = null,
  contentWidth = 1320,
  useTransformScale = false,
  fitPadding = 1,
  framePaddingX = 16,
  framePaddingY = 16,
  limitHeightToWidth = false,
  maxHeight = null,
}) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const viewportNode = viewportRef.current;
    const contentNode = contentRef.current;
    if (!viewportNode || !contentNode) return undefined;

    const measure = () => {
      setViewportWidth(viewportNode.clientWidth);
      setContentHeight(contentNode.scrollHeight);
    };

    viewportNode.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewportNode);
    resizeObserver.observe(contentNode);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [children, contentWidth, frameHeight, framePaddingX, framePaddingY, fitPadding]);

  const effectiveContentWidth = contentWidth;
  const availableWidth = Math.max(viewportWidth - framePaddingX * 2, 0);
  const widthFitZoom =
    availableWidth > 0
      ? Math.min(1, Math.max(0.55, (availableWidth * fitPadding) / effectiveContentWidth))
      : 1;
  const zoom = widthFitZoom;
  const scaledHeight = Math.max(contentHeight * zoom + framePaddingY * 2, minHeight);
  const widthLimitedHeight =
    viewportWidth > 0 ? Math.max(minHeight, viewportWidth) : minHeight;
  const limitedHeight = limitHeightToWidth
    ? Math.min(widthLimitedHeight, maxHeight ?? widthLimitedHeight)
    : scaledHeight;
  const viewportHeight = frameHeight ?? Math.min(scaledHeight, limitedHeight);
  const hasOverflow = scaledHeight > viewportHeight + 1;

  return (
    <div
      ref={viewportRef}
      className="landing-result-preview-scroll relative overflow-x-hidden overflow-y-auto overscroll-contain rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#15112f_0%,#090716_100%)] shadow-[0_24px_60px_rgba(37,56,138,0.24)] [scrollbar-color:rgba(169,157,255,0.62)_rgba(255,255,255,0.06)] [scrollbar-gutter:stable]"
      style={{ height: `${viewportHeight}px` }}
    >
      <div
        className="relative min-h-full"
        style={{ padding: `${framePaddingY}px ${framePaddingX}px` }}
      >
        {useTransformScale ? (
          <div
            className="absolute top-0 left-1/2"
            style={{
              width: `${effectiveContentWidth}px`,
              transform: `translateX(-50%) scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            <div ref={contentRef} style={{ width: `${effectiveContentWidth}px` }}>
              {children}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div style={{ zoom }}>
              <div ref={contentRef} style={{ width: `${effectiveContentWidth}px` }}>
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
      {hasOverflow ? (
        <div
          className="pointer-events-none sticky bottom-0 h-14 bg-[linear-gradient(180deg,rgba(7,22,39,0)_0%,rgba(7,22,39,0.92)_100%)]"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

export default function TestimonialsSection() {
  const progressRows = useMemo(() => createProgressRowsFromMatrix(responsibilityData), []);

  return (
    <section id="history" className="relative py-16 sm:py-20">
      <Container>
        <div className="grid gap-10">
          

          <div className="grid gap-12 sm:gap-14">
            <motion.div
              className="mr-auto grid w-full items-center gap-6 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1.2fr)] lg:gap-10"
              {...SECTION_COPY_REVEAL}
            >
              <div className="max-w-[42rem]">
                <SectionTitle
                  eyebrow="result & report"
                  title="결과는 어떻게 확인하나요?"
                  desc={
                    <>
                      RADAR는 PASS/FAIL을 넘어<br />
                      위험 원인과 개선 방향을 제시합니다.<br />
                      검증 결과와 벤치마크 비교를 바탕으로<br />
                      현재 서비스 수준을 진단합니다.<br /><br />
                      책임성 결과 화면에서는 전체 점수와 상태를 통해<br />
                      AI 응답의 신뢰 수준을 한눈에 확인합니다.<br />
                      카테고리와 질문 유형별 분석을 기반으로<br />
                      서비스 신뢰도 개선에 필요한 인사이트를 제공합니다.
                    </>
                  }
                />
              </div>
              
                
                <div className="relative overflow-hidden rounded-[28px]">
                  <ZoomedResultPreview
                    minHeight={RESULT_PREVIEW_MIN_HEIGHT}
                    contentWidth={RESULT_PREVIEW_CONTENT_WIDTH}
                    fitPadding={RESULT_PREVIEW_FIT}
                    framePaddingX={RESULT_PREVIEW_PADDING_X}
                    framePaddingY={RESULT_PREVIEW_PADDING_Y}
                    limitHeightToWidth
                    maxHeight={RESULT_PREVIEW_MAX_HEIGHT}
                  >
                    <BenchmarkResultDashboard
                      sessionId={responsibilityData.id}
                      sessionDetail={responsibilityData}
                      isLoading={false}
                      rows={progressRows}
                    />
                  </ZoomedResultPreview>
                </div>
              
            </motion.div>

            <motion.div
              className="ml-auto grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.5fr)] lg:gap-10"
              {...SECTION_COPY_REVEAL}
            >
              
                <div className="relative overflow-hidden rounded-[28px]">
                  <ZoomedResultPreview
                    minHeight={RESULT_PREVIEW_MIN_HEIGHT}
                    contentWidth={RESULT_PREVIEW_CONTENT_WIDTH}
                    fitPadding={RESULT_PREVIEW_FIT}
                    framePaddingX={RESULT_PREVIEW_PADDING_X}
                    framePaddingY={RESULT_PREVIEW_PADDING_Y}
                    limitHeightToWidth
                    maxHeight={RESULT_PREVIEW_MAX_HEIGHT}
                  >
                    <SecurityResultDashboard
                      sessionId={securityData.id}
                      sessionDetail={securityData}
                      isLoading={false}
                    />
                  </ZoomedResultPreview>
                </div>
              
              <div className="ml-auto max-w-[42rem] text-left lg:order-2">
                <SectionTitle
                  title="어떤 결과를 제공하나요?"
                  desc={
                    <>
                      RADAR는 검증 결과를 요약 지표와<br />
                      리스크 분석으로 한눈에 정리합니다.<br />
                      판정 근거와 우선 조치 항목을 함께 제공하며,<br />
                      PDF 리포트와 CSV 데이터로 활용할 수 있습니다.<br /><br />
                      보안성 결과 화면에서는 검증 범주와 공격 유형별로<br />
                      AI 서비스의 취약 지점을 확인할 수 있습니다.<br />
                      OWASP 기반 우선 완화 필요 항목을 정리하고,<br />
                      대응이 필요한 리스크와 개선 방향을 제시합니다.
                    </>
                  }
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
