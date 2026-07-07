import { useEffect, useState } from 'react';
import { BellRing, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import AppButton from '../../components/AppButton.jsx';
import AppToggle from '../../components/AppToggle.jsx';
import GarimAlertModal from '../../components/GarimAlertModal.jsx';
import GarimAgentOrbWithFace from '../../components/GarimAgentOrbWithFace.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import { STATUS_COLORS, getStatusTextClassName } from '../../constants/statusColors.js';
import PageLayout from '../../layout/PageLayout.jsx';

const NOTIFICATION_STATUS_SETTINGS = [
  {
    key: 'normal',
    label: '정상',
    description: '정상 처리된 요청이 발생했을 때 알림을 표시합니다.',
    enabled: true,
    statusKey: 'normal',
  },
  {
    key: 'block',
    label: '차단',
    description: '정책에 의해 요청이 차단되었을 때 알림을 표시합니다.',
    enabled: true,
    statusKey: 'block',
  },
  {
    key: 'masking',
    label: '마스킹',
    description: '민감정보가 마스킹 처리되었을 때 알림을 표시합니다.',
    enabled: false,
    statusKey: 'masking',
  },
  {
    key: 'allow',
    label: '검토필요',
    description: '위험 요소가 탐지되어 검토가 필요한 경우 알림을 표시합니다.',
    enabled: false,
    statusKey: 'allow',
  },
];

function StatusLabel({ children, statusKey }) {
  const textClassName = getStatusTextClassName(statusKey);

  return (
    <span className={`inline-flex items-center text-[15px] font-semibold ${textClassName}`}>
      {children}
    </span>
  );
}

function NotificationSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center">
      <AppToggle checked={checked} onChange={onChange} ariaLabel={`${label} 알림 표시`} />
    </div>
  );
}

function AlertStatusTestControl({ value, onChange }) {
  return (
    <div className="inline-flex w-full overflow-hidden rounded-xl border border-[#D8DEEA] bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.18)] sm:w-auto">
      {NOTIFICATION_STATUS_SETTINGS.map(item => {
        const isSelected = value === item.statusKey;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.statusKey)}
            className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-[13px] font-bold transition sm:flex-none ${
              isSelected
                ? 'bg-[#F4F6FB] text-[#111827] shadow-[0_2px_7px_rgba(15,23,42,0.08)]'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
            }`.trim()}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[item.statusKey] }}
            />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function NotificationSettingsContent() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isBlobOrbModalOpen, setIsBlobOrbModalOpen] = useState(false);
  const [alertStatusKey, setAlertStatusKey] = useState('normal');
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(NOTIFICATION_STATUS_SETTINGS.map(item => [item.key, item.enabled]))
  );
  const selectedAlertStatus =
    NOTIFICATION_STATUS_SETTINGS.find(item => item.statusKey === alertStatusKey) ??
    NOTIFICATION_STATUS_SETTINGS[0];

  useEffect(() => {
    if (!isAlertModalOpen && !isBlobOrbModalOpen) {
      return undefined;
    }

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsAlertModalOpen(false);
        setIsBlobOrbModalOpen(false);
      }
    };

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAlertModalOpen, isBlobOrbModalOpen]);

  const handleToggle = key => {
    setSettings(current => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <>
      <div className="flex flex-col items-stretch justify-end gap-[var(--app-gap-sm)] sm:flex-row sm:items-center">
        <AppButton
          onClick={() => setIsAlertModalOpen(true)}
          className="h-[var(--app-control-md)] sm:min-w-[clamp(9rem,11vw,10rem)]"
        >
          <BellRing
            aria-hidden="true"
            className="h-[var(--app-icon-xs)] w-[var(--app-icon-xs)]"
          />
          알림 모달 테스트
        </AppButton>
        <AppButton
          onClick={() => setIsBlobOrbModalOpen(true)}
          className="h-[var(--app-control-md)] sm:min-w-[clamp(10rem,12vw,11rem)]"
        >
          <Sparkles
            aria-hidden="true"
            className="h-[var(--app-icon-xs)] w-[var(--app-icon-xs)]"
          />
          알림 모달테스트 2
        </AppButton>
      </div>

      <SectionCard className="overflow-hidden bg-[radial-gradient(circle_at_top,#FFFFFF_0%,#FBFCFF_72%,#F6F8FD_100%)]">
        <div className="min-h-0 w-full overflow-x-auto">
          <div className="min-w-[60rem]">
            <div className="grid h-[var(--app-control-lg)] grid-cols-[minmax(9rem,1fr)_minmax(24rem,3fr)_minmax(9rem,0.8fr)] items-center border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-[var(--app-pad-lg)] text-[clamp(0.82rem,0.95vw,0.9rem)] font-semibold tracking-[-0.01em] text-[#59627A]">
              <span>처리 상태</span>
              <span>설명</span>
              <span className="text-center">알림 표시</span>
            </div>

            <div className="overflow-hidden">
              {NOTIFICATION_STATUS_SETTINGS.map((item, index) => (
                <div
                  key={item.key}
                  className={`grid min-h-[clamp(3.75rem,4.6vw,4.125rem)] grid-cols-[minmax(9rem,1fr)_minmax(24rem,3fr)_minmax(9rem,0.8fr)] items-center bg-white px-[var(--app-pad-lg)] text-[clamp(0.82rem,0.95vw,0.9rem)] leading-[150%] ${
                    index === 0 ? '' : 'border-t border-[#EEF1F6]'
                  }`}
                >
                  <div className="py-[var(--app-pad-sm)] pr-[var(--app-pad-md)]">
                    <StatusLabel statusKey={item.statusKey}>{item.label}</StatusLabel>
                  </div>
                  <div className="py-[var(--app-pad-sm)] pr-[var(--app-pad-md)] font-semibold text-[#64748B]">
                    {item.description}
                  </div>
                  <div className="flex justify-center py-[var(--app-pad-sm)]">
                    <NotificationSwitch
                      checked={settings[item.key]}
                      label={item.label}
                      onChange={() => handleToggle(item.key)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {isAlertModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GARIM Alert"
          className="fixed inset-0 z-50 flex items-end justify-end overflow-y-auto px-[var(--app-page-x)] py-[calc(var(--app-page-y)*2)]"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setIsAlertModalOpen(false);
            }
          }}
        >
          <div className="flex w-full max-w-[min(100%,24.375rem)] flex-col items-stretch gap-[var(--app-gap-sm)] sm:items-end">
            <AlertStatusTestControl value={alertStatusKey} onChange={setAlertStatusKey} />

            <GarimAlertModal
              statusKey={alertStatusKey}
              headline={`${selectedAlertStatus.label} 알림이 도착했습니다.`}
              detail={selectedAlertStatus.description}
              onClose={() => setIsAlertModalOpen(false)}
              renderCta={({ className, href, label }) => (
                <Link to={href} onClick={() => setIsAlertModalOpen(false)} className={className}>
                  {label}
                </Link>
              )}
            />
          </div>
        </div>
      ) : null}

      {isBlobOrbModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GARIM Alert"
          className="fixed inset-0 z-50 flex items-end justify-end overflow-y-auto px-[var(--app-page-x)] py-[calc(var(--app-page-y)*2)]"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setIsBlobOrbModalOpen(false);
            }
          }}
        >
          <div className="flex w-full max-w-[min(100%,24.375rem)] flex-col items-stretch gap-[var(--app-gap-sm)] sm:items-end">
            <AlertStatusTestControl value={alertStatusKey} onChange={setAlertStatusKey} />

            <GarimAlertModal
              statusKey={alertStatusKey}
              headline={`${selectedAlertStatus.label} 알림이 도착했습니다.`}
              detail={selectedAlertStatus.description}
              onClose={() => setIsBlobOrbModalOpen(false)}
              renderOrb={({ statusKey }) => (
                <div className="relative h-[clamp(12rem,16vw,14.375rem)] w-[clamp(12rem,16vw,14.375rem)] shrink-0 overflow-visible">
                  <GarimAgentOrbWithFace
                    className="garim-agent-orb-modal-visual"
                    size={460}
                    speed={10}
                    motion={0.78}
                    statusKey={statusKey}
                  />
                </div>
              )}
              renderCta={({ className, href, label }) => (
                <Link to={href} onClick={() => setIsBlobOrbModalOpen(false)} className={className}>
                  {label}
                </Link>
              )}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function NotificationPage() {
  return (
    <PageLayout>
      <NotificationSettingsContent />
    </PageLayout>
  );
}
