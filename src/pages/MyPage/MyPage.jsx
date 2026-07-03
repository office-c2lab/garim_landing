import { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import PageLayout from '../../layout/PageLayout.jsx';
import SectionCard from '../../components/SectionCard.jsx';
import AppButton from '../../components/AppButton.jsx';

const initialAccountInfo = {
  name: 'C2lab 관리자',
  lastLogin: '2026-05-27 14:32',
  lastIp: '203.0.113.45',
};

const myPageTabs = [
  { key: 'account', label: '계정관리' },
  { key: 'adminLogs', label: '관리자 로그' },
];

const adminLogs = [
  {
    time: '2026-05-27 14:32',
    action: '로그인',
    account: 'C2lab 관리자',
    ip: '203.0.113.45',
  },
  {
    time: '2026-05-27 14:18',
    action: '계정 정보 수정',
    account: 'C2lab 관리자',
    ip: '203.0.113.45',
  },
  {
    time: '2026-05-26 18:04',
    action: '비밀번호 변경',
    account: 'C2lab 관리자',
    ip: '203.0.113.45',
  },
];

function MyPageTabs({ activeTab, onChange }) {
  return (
    <div className="border-b border-[#E2E8F0]">
      <div className="overflow-x-auto">
        <div className="flex h-12 min-w-max items-end gap-7">
          {myPageTabs.map(tab => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={`relative flex h-12 min-w-[4rem] cursor-pointer items-center justify-center px-1 text-sm font-black transition ${
                  isActive ? 'text-[#5B21E5]' : 'text-slate-600 hover:text-[#5B21E5]'
                }`.trim()}
              >
                {tab.label}
                {isActive ? (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-[#5B21E5]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AccountEditButton({ onClick }) {
  return (
    <AppButton onClick={onClick} className="h-12">
      수정하기
    </AppButton>
  );
}

function PasswordField({ label, placeholder, canReveal = true }) {
  const [isVisible, setIsVisible] = useState(false);
  const inputType = canReveal && isVisible ? 'text' : 'password';
  const RevealIcon = isVisible ? EyeOff : Eye;

  return (
    <label className="grid gap-3 lg:grid-cols-[10rem_1fr] lg:items-center">
      <span className="text-sm font-bold text-[#20264D]">{label}</span>
      <div className="relative">
        <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A5]" />
        <input
          type={inputType}
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border border-[#DDE4EF] bg-white px-11 text-sm font-semibold text-[#344054] outline-none transition placeholder:text-[#A7B0C0] focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE] ${
            canReveal ? 'pr-12' : 'pr-4'
          }`.trim()}
        />
        {canReveal ? (
          <button
            type="button"
            aria-label={`${label} ${isVisible ? '숨기기' : '보기'}`}
            aria-pressed={isVisible}
            onClick={() => setIsVisible(current => !current)}
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#5B39D6]"
          >
            <RevealIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </label>
  );
}

function AccountEditModal({ draft, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(15,23,42,0.42)] px-4 py-6">
      <button
        type="button"
        aria-label="계정 정보 수정 닫기"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-edit-modal-title"
        className="relative z-10 w-full max-w-[30rem] overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#E7EBF4] px-6 py-5">
          <h3 id="account-edit-modal-title" className="text-lg font-bold text-[#111827]">
            계정 정보 수정
          </h3>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#4338CA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#20264D]">이름</span>
            <input
              type="text"
              value={draft.name}
              onChange={event => onChange('name', event.target.value)}
              className="h-12 w-full rounded-lg border border-[#DDE4EF] bg-white px-4 text-sm font-semibold text-[#344054] outline-none transition placeholder:text-[#A7B0C0] focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E7EBF4] px-6 py-4">
          <AppButton variant="secondary" onClick={onClose} className="h-11">
            취소
          </AppButton>
          <AppButton onClick={onSave} className="h-11">
            저장
          </AppButton>
        </div>
      </div>
    </div>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const { setPageMetaOverride } = useOutletContext() ?? {};
  const [activeTab, setActiveTab] = useState('account');
  const [accountInfo, setAccountInfo] = useState(initialAccountInfo);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountDraft, setAccountDraft] = useState({
    name: initialAccountInfo.name,
  });

  const accountRows = [
    { label: '이름', value: accountInfo.name },
    { label: '최근 로그인', value: accountInfo.lastLogin },
    { label: '최근 접속 IP', value: accountInfo.lastIp },
  ];

  useEffect(() => {
    if (!setPageMetaOverride) return undefined;

    setPageMetaOverride({
      title: activeTab === 'account' ? 'Admin Account' : 'Admin Log',
    });

    return () => setPageMetaOverride(null);
  }, [activeTab, setPageMetaOverride]);

  const openAccountModal = () => {
    setAccountDraft({
      name: accountInfo.name,
    });
    setIsAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const handleChangeAccountDraft = (key, value) => {
    setAccountDraft(current => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSaveAccount = () => {
    setAccountInfo(current => ({
      ...current,
      name: accountDraft.name,
    }));
    closeAccountModal();
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <MyPageTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'account' ? (
          <>
            <SectionCard className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 py-5">
                <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">계정 정보</h2>
                <AccountEditButton onClick={openAccountModal} />
              </div>
              <dl>
                {accountRows.map(row => (
                  <div
                    key={row.label}
                    className="grid min-h-[4.6rem] grid-cols-[8rem_1fr] items-center gap-4 border-b border-[#E7EBF4] px-6 last:border-b-0"
                  >
                    <dt className="text-sm font-bold text-[#20264D]">{row.label}</dt>
                    <dd className="text-sm font-semibold text-[#526078]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </SectionCard>

            <SectionCard className="overflow-hidden">
              <div className="border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 py-5">
                <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">
                  비밀번호 변경
                </h2>
              </div>
              <div className="px-6 py-8">
                <div className="space-y-5">
                  <PasswordField
                    label="현재 비밀번호"
                    placeholder="현재 비밀번호를 입력하세요"
                    canReveal={false}
                  />
                  <PasswordField label="새 비밀번호" placeholder="새 비밀번호를 입력하세요" />
                  <PasswordField
                    label="새 비밀번호 확인"
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-5 lg:ml-[10rem] lg:flex-row lg:items-center lg:justify-between">
                  <p className="flex items-start gap-2 text-xs font-semibold text-[#64728C]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B39D6]" />
                    영문, 숫자, 특수문자를 포함하여 8자 이상 입력해 주세요.
                  </p>
                  <AppButton className="h-12 lg:min-w-[11rem]">비밀번호 변경</AppButton>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="overflow-hidden">
              <div className="border-b border-[#E7EBF4] bg-[linear-gradient(180deg,#F8FAFF_0%,#F2F5FC_100%)] px-6 py-5">
                <h2 className="text-xl font-bold tracking-[-0.02em] text-[#111827]">계정 관리</h2>
              </div>
              <div className="flex min-h-[5.35rem] flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#526078]">
                  현재 로그인된 관리자 계정에서 로그아웃할 수 있습니다.
                </p>
                <AppButton
                  variant="danger"
                  onClick={handleLogout}
                  className="h-12 w-full px-7 sm:w-auto sm:min-w-[10rem]"
                >
                  로그아웃
                </AppButton>
              </div>
            </SectionCard>
          </>
        ) : (
          <SectionCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[min(100%,45rem)] border-separate border-spacing-0 text-left">
                <thead className="bg-[#F8FAFF]">
                  <tr>
                    {['시간', '활동', '계정', 'IP'].map(label => (
                      <th
                        key={label}
                        className="border-b border-[#E7EBF4] px-6 py-4 text-sm font-bold text-[#20264D]"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminLogs.map((log, index) => (
                    <tr
                      key={`${log.time}-${log.action}`}
                      className={index % 2 ? 'bg-[#FEFEFF]' : 'bg-white'}
                    >
                      <td className="border-b border-[#EEF2F7] px-6 py-4 text-sm font-semibold text-[#526078]">
                        {log.time}
                      </td>
                      <td className="border-b border-[#EEF2F7] px-6 py-4 text-sm font-bold text-[#20264D]">
                        {log.action}
                      </td>
                      <td className="border-b border-[#EEF2F7] px-6 py-4 text-sm font-semibold text-[#526078]">
                        {log.account}
                      </td>
                      <td className="border-b border-[#EEF2F7] px-6 py-4 text-sm font-semibold text-[#526078]">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}
      </div>

      {isAccountModalOpen ? (
        <AccountEditModal
          draft={accountDraft}
          onChange={handleChangeAccountDraft}
          onClose={closeAccountModal}
          onSave={handleSaveAccount}
        />
      ) : null}
    </PageLayout>
  );
}
