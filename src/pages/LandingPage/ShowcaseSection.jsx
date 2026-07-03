import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ApiRequestMappingFields,
  REQUEST_BODY_EXAMPLES,
  RESPONSE_PATH_OPTIONS,
  RESPONSE_SAMPLE_EXAMPLES,
} from '@/components/project-create/apiRequestMappingShared.jsx';

import {
  cn,
  Container,
  HeroShaderBackground,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

function StatusInfinityLoader({ className = '' }) {
  const filterId = useMemo(() => `statusInfinity${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className={cn('status-infinity-loader', className)}>
      <div
        className="status-infinity-loader__chrome"
        style={{ '--loader-filter': `url(#${filterId})` }}
      >
        <div />
        <div />
        <div />
      </div>

      <div className="status-infinity-loader__fallback">
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        aria-hidden="true"
        className="status-infinity-loader__defs"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function ApiRequestPreviewCard() {
  const [selectedResponseOptionId, setSelectedResponseOptionId] = useState('openai_chat_completions');
  const [requestBody, setRequestBody] = useState(REQUEST_BODY_EXAMPLES['messages[0].content']);
  const [responsePath, setResponsePath] = useState('choices[0].message.content');
  const [sampleResponse, setSampleResponse] = useState(
    RESPONSE_SAMPLE_EXAMPLES.openai_chat_completions
  );

  const selectedResponseOption =
    RESPONSE_PATH_OPTIONS.find(option => option.id === selectedResponseOptionId) ??
    RESPONSE_PATH_OPTIONS[0];

  const handleResponseSuggestionClick = selectedPath => {
    const nextOption = RESPONSE_PATH_OPTIONS.find(option => option.value === selectedPath);

    if (!nextOption) return;

    if (nextOption.id === 'custom') {
      setSelectedResponseOptionId(nextOption.id);
      setRequestBody('');
      setResponsePath('');
      setSampleResponse('');
      return;
    }

    setSelectedResponseOptionId(nextOption.id);
    setRequestBody(nextOption.requestBody ?? '');
    setResponsePath(nextOption.value);
    setSampleResponse(RESPONSE_SAMPLE_EXAMPLES[nextOption.id] ?? '');
  };

  const extractedTextByOption = {
    openai_chat_completions: '안녕하세요!',
    openai_responses: '안녕하세요!',
    gemini: '안녕하세요!',
    hugging_face: '모델 응답 내용',
    custom: '',
  };

  const extractedText = extractedTextByOption[selectedResponseOption.id] ?? '';
  const isCustomMode = selectedResponseOption.id === 'custom';

  return (
    <div className="mx-auto w-full max-w-[50rem] scale-[0.68] sm:scale-[0.78] lg:scale-[1]">
      <div className="overflow-hidden rounded-[26px] border border-[#ddd8ff] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="px-5 pb-6 pt-6 text-[#111827] sm:px-6">
          <ApiRequestMappingFields
            selectedResponseOptionId={selectedResponseOptionId}
            onResponseSuggestionClick={handleResponseSuggestionClick}
            selectedResponseOption={selectedResponseOption}
            templateParseError=""
            isCustomMode={isCustomMode}
            inferredPromptPath={selectedResponseOption.promptBannerLabel ?? ''}
            promptBannerLabel={selectedResponseOption.promptBannerLabel ?? ''}
            customPromptPath=""
            requestBody={requestBody}
            responsePath={responsePath}
            sampleResponse={sampleResponse}
            showResponseSuccessBanner={Boolean(extractedText)}
            extractedText={extractedText}
            showResponseErrorBanner={isCustomMode}
            responseErrorBannerText="추출 경로를 직접 입력하는 커스텀 방식도 지원합니다."
            readOnly
            appearance="light"
            hideHelperText
            editorHeightOverride={isCustomMode ? '200px' : '248px'}
            hideResponsePathSection
            requestBodyLabel="Request Body"
            responseBodyLabel="Response Body"
          />
        </div>
      </div>
    </div>
  );
}

function CandidateSearchPreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-[48rem]">
      <div className="flex w-full flex-col items-center gap-7 rounded-[18px] bg-[#ffffff] px-6 py-9 text-center shadow-[0_18px_40px_rgba(91,57,214,0.10)] sm:min-h-[27rem] sm:gap-10 sm:px-9 sm:py-12">
        <p className="relative z-10 text-lg font-bold leading-[145%] text-[#272052] sm:text-xl">
          후보를 탐색하는 중입니다.
        </p>

        <div className="relative flex min-h-[11rem] flex-none items-center justify-center sm:min-h-[12.5rem]">
          <StatusInfinityLoader className="status-infinity-loader--preview" />
        </div>

        <p className="relative z-10 max-w-[28rem] text-sm font-bold leading-[145%] text-black sm:text-base">
          URL에 접속해서 챗봇 버튼, 입력창, 전송 버튼, 응답영역 후보를 <br/>
          순서대로 준비하고 있습니다.
        </p>
      </div>
    </div>
  );
}

function TimelineContentCard({
  flowLabel = '',
  stepLabel = '',
  label,
  desc = '',
  align = 'left',
  centered = false,
  featured = false,
}) {
  return (
    <div
      className={cn(
        'rounded-[22px] text-left transition',
        centered
          ? 'pb-10 sm:pb-12 lg:col-span-3 lg:mx-auto lg:max-w-[30rem] lg:pb-14 lg:text-center'
          : 'pl-[126px] sm:pl-[154px] lg:pl-0 lg:pr-0',
        align === 'left' && 'lg:col-start-1 lg:pr-14 lg:text-right',
        align === 'right' && 'lg:col-start-3 lg:pl-14 lg:text-left'
      )}
    >
      {flowLabel ? (
        <div
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5B39D6] sm:text-xs',
            centered && 'text-center',
            align === 'left' && 'lg:text-right',
            align === 'right' && 'lg:text-left'
          )}
        >
          {flowLabel}
        </div>
      ) : null}

      <div
        className={cn(
          'mt-2 font-bold tracking-[-0.02em]',
          centered
            ? 'text-[1.6rem] text-[#111827] sm:text-[1.95rem] lg:text-[2.2rem]'
            : featured
              ? 'text-[1.35rem] text-[#111827] sm:text-[1.7rem] lg:text-[1.9rem]'
            : 'text-lg text-[#171717]'
        )}
      >
        {label}
      </div>

      {desc ? (
        <p className="mt-2 text-[15px] leading-7 text-[#57534e] sm:text-base">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

export default function ShowcaseSection() {
  const timelineRows = useMemo(
    () => [
      {
        type: 'paired',
        stepLabel: '1단계',
        left: {
          label: 'API 엔드포인트 입력',
          desc: '요청을 보낼 API URL과 HTTP 메서드를 설정합니다.',
        },
        right: {
          label: '대상 URL 입력',
          desc: '검증할 서비스의 URL을 입력합니다.',
        },
      },
      {
        type: 'paired',
        stepLabel: '2단계',
        left: {
          label: '인증 방식 설정',
          desc: 'Bearer Token, API Key Header, Basic Auth, 인증 없음 중 서비스에 맞는 방식을 선택합니다.',
        },
        right: {
          label: '로그인 영역 설정',
          desc: '로그인이 필요한 경우 아이디 입력창, 비밀번호 입력창, 로그인 버튼을 선택합니다. 로그인이 필요 없으면 이 단계는 건너뛸 수 있습니다.',
        },
      },
      {
        type: 'paired',
        stepLabel: '3단계',
        left: {
          label: 'Request Body 구성',
          desc: 'API에 전달할 JSON Body를 입력하고, 검증 질문이 들어갈 위치에 {{prompt}}를 지정합니다.',
        },
        right: {
          label: '서비스 진입 영역 설정',
          desc: '생성형 AI 입력창이 바로 보이지 않는 경우, 챗봇 실행 버튼이나 서비스 진입 버튼을 선택합니다.',
        },
      },
      {
        type: 'paired',
        stepLabel: '4단계',
        left: {
          label: 'Response Body 매핑',
          desc: '응답 JSON에서 모델 답변이 들어있는 경로를 지정합니다.',
        },
        right: {
          label: '질문 입력창 선택',
          desc: '검증 질문이 입력될 텍스트 입력 영역을 선택합니다.',
        },
      },
      {
        type: 'paired',
        stepLabel: '5단계',
        left: {
          label: '',
          desc: '',
        },
        right: {
          label: '전송 버튼 선택',
          desc: '질문을 제출할 버튼 또는 Enter 전송 방식을 지정합니다.',
        },
      },
      {
        type: 'paired',
        stepLabel: '6단계',
        left: {
          label: '',
          desc: '',
        },
        right: {
          label: '응답 영역 선택',
          desc: '모델 답변이 표시되는 영역을 선택해 응답 텍스트를 추출할 위치를 저장합니다.',
        },
      },
    ],
    []
  );

  const baseDotClassName =
    'h-4 w-4 border-[#BFB4FF] bg-[#5B39D6] shadow-[0_0_0_4px_rgba(221,216,255,0.56)]';
  const featuredDotClassName =
    'h-8 w-8 border-[#BFB4FF] bg-[#5B39D6] shadow-[0_0_0_6px_rgba(221,216,255,0.56),0_0_0_12px_rgba(244,242,255,0.7),0_0_26px_rgba(91,57,214,0.22)] sm:h-10 sm:w-10';

  return (
    <section id="showcase" className="relative py-16 sm:py-20">
      <div id="how" className="absolute -top-24" aria-hidden="true" />

      <Container>
        <div className="flex flex-col gap-10">
          
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12">
            <motion.div className="flex flex-col gap-7 lg:pr-8" {...SECTION_TITLE_REVEAL}>
              <div className="max-w-xl">
                <SectionTitle
                  eyebrow="register
"
                  title={
                    "어떻게 등록하나요?"
                  }
                  desc={
                    <>RADAR는 API로 제공되는 서비스와 URL로만 접근 가능한<br />
웹 챗봇을 모두 검증 대상으로 등록할 수 있습니다.<br />
API 방식은 요청 Body에서 프롬프트 주입 위치를 지정하고,<br />
응답 구조에서 결과 추출 경로를 매핑합니다.
                    </>
                  }
                />
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#05040d] p-4 sm:p-5"
              {...SECTION_COPY_REVEAL}
            >
              <HeroShaderBackground className="hero-shader-background--preview" />
              <div className="relative px-4 py-4 sm:px-6 sm:py-6">
                <ApiRequestPreviewCard />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)] lg:items-center lg:gap-12">
            <motion.div
              className="relative order-2 overflow-hidden rounded-3xl border border-white/10 bg-[#05040d] p-4 sm:p-5 lg:order-1"
              {...SECTION_COPY_REVEAL}
            >
              <HeroShaderBackground className="hero-shader-background--preview" />
              <div className="relative px-4 py-4 sm:px-6 sm:py-6">
                <CandidateSearchPreviewCard />
              </div>
            </motion.div>

            <motion.div className="order-1 flex flex-col gap-7 lg:order-2 lg:pl-8" {...SECTION_TITLE_REVEAL}>
              <div className="max-w-xl">
                <SectionTitle
                  eyebrow=""
                  title={"실제 서비스에도 적용 가능한가요?"}
                  desc={
                    <>
                      URL 방식은 실제 브라우저에서<br />
AI 서비스 화면을 직접 조작해 응답을 수집합니다.<br />
로그인 여부와 화면 구조에 맞춰<br />
입력창, 전송 버튼, 응답 영역을 차례대로 지정합니다.
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
