import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

import {
  APP_FORM_LABEL_TEXT_CLASS,
  APP_META_TEXT_CLASS,
  APP_SMALL_META_TEXT_CLASS,
} from '../../constants/contentLayout.js';

export const REQUEST_BODY_EXAMPLES = {
  'messages[0].content': `{
  "model":"gpt-4.1",
  "messages": [
    {
      "role":"user",
      "content":"{{prompt}}"
    }
  ],
  "temperature":0.7
}`,
  input: `{
  "model":"gpt-4.1",
  "input":"{{prompt}}",
  "temperature":0.7
}`,
  'contents[0].parts[0].text': `{
  "contents": [
    {
      "parts": [
        {
          "text":"{{prompt}}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature":0.7
  }
}`,
  inputs: `{
  "inputs":"{{prompt}}",
  "parameters": {
    "temperature":0.7,
    "max_new_tokens":512
  }
}`,
  prompt: `{
  "prompt": "여기에 검증 프롬프트가 자동 입력됩니다."
}`,
};

export const RESPONSE_SAMPLE_EXAMPLES = {
  openai_chat_completions: `{
  "choices": [
    {
      "message": {
        "role":"assistant",
        "content":"안녕하세요!"
      }
    }
  ]
}`,
  openai_responses: `{
  "id":"resp_123",
  "object":"response",
  "output_text":"안녕하세요!"
}`,
  gemini: `{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text":"안녕하세요!"
          }
        ]
      }
    }
  ]
}`,
  hugging_face: `[
  {
    "generated_text":"모델 응답 내용"
  }
]`,
  custom: '',
};

export const RESPONSE_PATH_OPTIONS = [
  {
    id: 'openai_chat_completions',
    label: 'OpenAI Chat Completions',
    value: 'choices[0].message.content',
    requestBody: REQUEST_BODY_EXAMPLES['messages[0].content'],
    promptBannerLabel: 'messages[0].content',
    description:
      '기존 OpenAI Chat Completions API 방식입니다. 사용자 입력은 messages 배열의 content에 들어가며, 모델 응답은 choices[0].message.content에서 추출합니다.',
  },
  {
    id: 'openai_responses',
    label: 'OpenAI Responses',
    value: 'output_text',
    requestBody: REQUEST_BODY_EXAMPLES.input,
    promptBannerLabel: 'input',
    description:
      'OpenAI의 최신 Responses API 방식입니다. 사용자 입력은 input 필드에 들어가며, 최종 응답 텍스트는 output_text에서 추출합니다. 신규 OpenAI 연동에 적합합니다.',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    value: 'candidates[0].content.parts[0].text',
    requestBody: REQUEST_BODY_EXAMPLES['contents[0].parts[0].text'],
    promptBannerLabel: 'contents',
    description:
      'Google Gemini API 방식입니다. 사용자 입력은 contents[0].parts[0].text에 들어가며, 모델 응답은 candidates[0].content.parts[0].text에서 추출합니다.',
  },
  {
    id: 'hugging_face',
    label: 'Hugging Face',
    value: '[0].generated_text',
    requestBody: REQUEST_BODY_EXAMPLES.inputs,
    promptBannerLabel: 'input',
    description:
      'Hugging Face Inference API 방식입니다. 사용자 입력은 inputs 필드에 들어가며, 모델 응답은 [0].generated_text에서 추출합니다.',
  },
  {
    id: 'custom',
    label: 'Custom',
    value: 'data.answer',
    description: '사용자가 직접 지정해서 요청 영역과 응답영역을 설정합니다.',
  },
];

function SuggestionChip({
  label,
  value,
  selected,
  onClick,
  tone = 'default',
  disabled = false,
  appearance = 'dark',
}) {
  const isProviderButton = tone === 'provider';
  const isLight = appearance === 'light';

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onClick(value);
      }}
      disabled={disabled}
      className={`inline-flex items-center justify-center text-center transition ${
        isProviderButton
          ? `${
              selected
                ? 'border-[#5AD0DE] bg-[#5AD0DE] text-white'
                : isLight
                  ? 'border-[#5AD0DE] bg-white text-[#026E92] hover:bg-[rgba(90,208,222,0.10)]'
                  : 'border-[#5AD0DE] bg-transparent text-[#5AD0DE] hover:bg-[rgba(90,208,222,0.12)]'
            } h-[35px] min-w-[136px] rounded-[8px] border px-[14px] text-[10px] font-semibold leading-[150%] ${
              selected ? 'font-semibold' : 'font-normal'
            }`
          : `${
              selected
                ? 'border-[#5AD0DE] bg-[rgba(90,208,222,0.3)] text-[#5AD0DE]'
                : isLight
                  ? 'border-[#D7E5EA] bg-white text-[#1F2937] hover:border-[#5AD0DE] hover:bg-[rgba(90,208,222,0.12)] hover:text-[#01557D] active:bg-[rgba(90,208,222,0.18)]'
                  : 'border-white bg-[rgba(255,255,255,0.3)] text-white hover:border-[#5AD0DE] hover:bg-[rgba(90,208,222,0.22)] hover:text-[#B9F4F8] active:bg-[rgba(90,208,222,0.3)]'
            } min-h-[30px] rounded-[6px] border px-[14px] py-[6px] text-[12px] font-medium leading-[150%]`
      } ${disabled ? 'cursor-default' : ''}`.trim()}
    >
      {label}
    </button>
  );
}

function WarningBanner({ text, appearance = 'dark' }) {
  const isLight = appearance === 'light';

  return (
    <div
      className={`flex min-h-[30px] items-center rounded-[4px] border px-[10px] ${
        isLight
          ? 'border-[#9EDDE5] bg-[rgba(90,208,222,0.12)]'
          : 'border-[#5AD0DE] bg-[rgba(90,208,222,0.4)]'
      }`.trim()}
    >
      <p
        className={`text-[10px] font-normal leading-[150%] ${
          isLight ? 'text-[#01557D]' : 'text-[#93F0F4]'
        }`.trim()}
      >
        {text}
      </p>
    </div>
  );
}

function ErrorBanner({ text, appearance = 'dark' }) {
  const isLight = appearance === 'light';

  return (
    <div
      className={`flex min-h-[30px] items-center rounded-[4px] border px-[10px] ${
        isLight
          ? 'border-[#F1B5B5] bg-[rgba(211,47,47,0.06)]'
          : 'border-[#D32F2F] bg-[rgba(211,47,47,0.1)]'
      }`.trim()}
    >
      <p className="text-[10px] font-normal leading-[150%] text-[#D32F2F]">{text}</p>
    </div>
  );
}

export function ApiRequestMappingFields({
  responsePathOptions = RESPONSE_PATH_OPTIONS,
  selectedResponseOptionId,
  onResponseSuggestionClick,
  selectedResponseOption,
  templateParseError = '',
  isCustomMode = false,
  inferredPromptPath = '',
  promptBannerLabel = '',
  customPromptPath = '',
  onCustomPromptPathChange,
  requestBody = '',
  onRequestBodyChange,
  responsePath = '',
  onResponsePathChange,
  sampleResponse = '',
  onSampleResponseChange,
  showResponseSuccessBanner = false,
  extractedText = '',
  showResponseErrorBanner = false,
  responseErrorBannerText = '',
  readOnly = false,
  disableProviderSelection = false,
  appearance = 'dark',
  hideHelperText = false,
  editorHeightOverride = '',
  hideResponsePathSection = false,
  requestBodyLabel = 'Request Body',
  responseBodyLabel = 'Response Body',
}) {
  const noop = () => {};
  const isLight = appearance === 'light';
  const editorHeight = editorHeightOverride || (isCustomMode ? '184px' : '216px');

  return (
    <>
      {hideResponsePathSection ? null : (
        <>
          <div className="mt-4 grid gap-5 lg:grid-cols-[8rem_minmax(0,1fr)] lg:items-start">
            <div
              className={`${APP_FORM_LABEL_TEXT_CLASS} pt-[2px] font-bold leading-[150%] ${
                isLight ? 'text-[#111827]' : ''
              }`.trim()}
            >
              추출 경로
            </div>

            <div>
              <div className="flex flex-wrap gap-[7px]">
                {responsePathOptions.map(option => (
                  <SuggestionChip
                    key={option.id}
                    label={option.label}
                    value={option.value}
                    selected={selectedResponseOptionId === option.id}
                    onClick={onResponseSuggestionClick ?? noop}
                    tone="provider"
                    disabled={disableProviderSelection}
                    appearance={appearance}
                  />
                ))}
              </div>
              {hideHelperText ? null : isCustomMode ? null : templateParseError ? (
                <div className="mt-[10px]">
                  <ErrorBanner text={templateParseError} appearance={appearance} />
                </div>
              ) : null}
              {!hideHelperText && isCustomMode ? (
                <div className="mt-[10px]">
                  <WarningBanner text={selectedResponseOption.description} appearance={appearance} />
                </div>
              ) : null}
              {!hideHelperText && !isCustomMode && !templateParseError && inferredPromptPath ? (
                <div className="mt-[10px]">
                  <WarningBanner
                    text={`검증 실행 시 ${promptBannerLabel} 에 테스트 프롬프트가 자동으로 채워집니다.`}
                    appearance={appearance}
                  />
                </div>
              ) : null}
              {!hideHelperText && !isCustomMode && !templateParseError && !inferredPromptPath ? (
                <div className="mt-[10px]">
                  <ErrorBanner
                    text="프롬프트 주입 위치를 자동 인식하지 못했습니다. 일반적인 messages/input/contents/inputs/prompt 형식을 사용해 주세요."
                    appearance={appearance}
                  />
                </div>
              ) : null}
              {hideHelperText || isCustomMode ? null : (
                <p
                  className={`mt-[7px] ${APP_SMALL_META_TEXT_CLASS} font-medium leading-[150%] ${
                    isLight ? 'text-[#6B7280]' : 'text-[#6D717F]'
                  }`.trim()}
                >
                  아래 JSON에서 {'{{prompt}}'}가 있는 필드의 경로입니다.
                </p>
              )}
            </div>
          </div>

          <div className={`mt-5 h-px w-full ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#6D717F]'}`.trim()} />
        </>
      )}

      <div className="mt-4 grid gap-5 lg:grid-cols-[8rem_minmax(0,1fr)] lg:items-start">
        <div
          className={`${APP_FORM_LABEL_TEXT_CLASS} pt-[2px] font-bold leading-[150%] ${
            isLight ? 'text-[#111827]' : ''
          }`.trim()}
        >
          {requestBodyLabel}
        </div>

        <div>
          {!hideHelperText && !isCustomMode ? (
            <div
              className={`mb-[10px] rounded-[4px] border px-[18px] py-[8px] ${
                isLight
                  ? 'border-[#E5E7EA] bg-[#F8FAFC]'
                  : 'border-[#E5E7EA] bg-[rgba(243,244,246,0.2)]'
              }`.trim()}
            >
              <p
                className={`text-[10px] font-normal leading-[150%] ${
                  isLight ? 'text-[#4B5563]' : 'text-[#F3F4F6]'
                }`.trim()}
              >
                {selectedResponseOption.description}
              </p>
            </div>
          ) : null}
          {isCustomMode ? (
            <input
              value={customPromptPath}
              onChange={event => (onCustomPromptPathChange ?? noop)(event.target.value)}
              readOnly={readOnly}
              placeholder="프롬프트 주입 경로 입력"
              className={`mb-[10px] h-[30px] w-full max-w-[421px] rounded-[4px] px-[11px] ${APP_META_TEXT_CLASS} font-normal leading-[150%] outline-none placeholder:text-[#6D717F] focus:ring-2 focus:ring-[#5AD0DE]/45 ${
                isLight ? 'border border-[#D7E5EA] bg-white text-[#111827]' : 'bg-[rgba(255,255,255,0.2)] text-white'
              }`.trim()}
            />
          ) : null}
          <div
            className={`overflow-hidden rounded-[4px] border ${
              isLight ? 'border-[#D7E5EA] bg-white' : 'border-[#6D717F]'
            }`.trim()}
          >
            <CodeMirror
              value={requestBody}
              height={editorHeight}
              extensions={[json()]}
              theme={oneDark}
              basicSetup={{
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: false,
                highlightSelectionMatches: false,
              }}
              editable={!readOnly}
              onChange={value => (onRequestBodyChange ?? noop)(value)}
            />
          </div>
        </div>
      </div>

      <div className={`mt-5 h-px w-full ${isLight ? 'bg-[#E5E7EB]' : 'bg-[#6D717F]'}`.trim()} />

      <div className="mt-4 grid gap-5 lg:grid-cols-[8rem_minmax(0,1fr)] lg:items-start">
        <div
          className={`${APP_FORM_LABEL_TEXT_CLASS} pt-[2px] font-bold leading-[150%] ${
            isLight ? 'text-[#111827]' : ''
          }`.trim()}
        >
          {responseBodyLabel}
        </div>

        <div>
          {isCustomMode ? (
            <input
              value={responsePath}
              onChange={event => (onResponsePathChange ?? noop)(event.target.value)}
              readOnly={readOnly}
              placeholder="응답 경로 입력"
              className={`mb-[10px] h-[30px] w-full max-w-[421px] rounded-[4px] px-[11px] ${APP_META_TEXT_CLASS} font-normal leading-[150%] outline-none placeholder:text-[#6D717F] focus:ring-2 focus:ring-[#5AD0DE]/45 ${
                isLight ? 'border border-[#D7E5EA] bg-white text-[#111827]' : 'bg-[rgba(255,255,255,0.2)] text-white'
              }`.trim()}
            />
          ) : null}
          <div
            className={`overflow-hidden rounded-[4px] border ${
              isLight ? 'border-[#D7E5EA] bg-white' : 'border-[#6D717F]'
            }`.trim()}
          >
            <CodeMirror
              value={sampleResponse}
              height={editorHeight}
              extensions={[json()]}
              theme={oneDark}
              basicSetup={{
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: false,
                highlightSelectionMatches: false,
              }}
              editable={!readOnly}
              onChange={value => (onSampleResponseChange ?? noop)(value)}
            />
          </div>
          {!hideHelperText && showResponseSuccessBanner ? (
            <div className="mt-[14px]">
              <WarningBanner text={`추출 성공: "${extractedText}"`} appearance={appearance} />
            </div>
          ) : null}
          {!hideHelperText && showResponseErrorBanner ? (
            <div className="mt-[14px]">
              <ErrorBanner text={responseErrorBannerText} appearance={appearance} />
            </div>
          ) : null}
          {hideHelperText ? null : (
            <p
              className={`mt-[7px] ${APP_SMALL_META_TEXT_CLASS} font-medium leading-[150%] ${
                isLight ? 'text-[#6B7280]' : 'text-[#6D717F]'
              }`.trim()}
            >
              실제 응답 JSON을 붙여넣으면 경로가 맞는지 즉시 확인할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
