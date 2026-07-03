import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import AppButton from '../../components/AppButton.jsx';
import garimLogo from '../../assets/icons/logo.svg';
import loginBgImage from '../../assets/images/loginbg.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const PasswordRevealIcon = isPasswordVisible ? EyeOff : Eye;

  const handleSubmit = event => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#111827]">
      <section className="flex min-h-screen items-center justify-center px-[var(--app-page-x)] py-[var(--app-page-y)]">
        <div className="grid min-h-[min(100vh,44rem)] w-full overflow-hidden bg-white lg:grid-cols-[1.1fr_0.9fr] 2xl:max-w-[min(100%,80rem)] 2xl:rounded-[var(--app-radius-lg)] 2xl:shadow-[0_1.25rem_4rem_rgba(15,23,42,0.12)]">
          <section
            className="relative hidden min-h-[min(100vh,44rem)] overflow-hidden bg-[#080B28] bg-cover bg-center px-[clamp(3rem,4.5vw,4rem)] py-[clamp(4rem,5.6vw,5rem)] text-white lg:block"
            style={{ backgroundImage: `url(${loginBgImage})` }}
          >
            <div className="relative z-10 flex h-full flex-col justify-center">
              <div className="flex items-center">
                <img
                  src={garimLogo}
                  alt="GARIM"
                  className="h-[clamp(2.75rem,3.6vw,3.2rem)] w-auto object-contain"
                />
              </div>

              <div className="mt-[calc(var(--app-gap-lg)*2)]">
                <h1 className="text-xl font-black leading-8 tracking-[-0.02em]">
                생성형 AI 사용 환경 보호 및 거버넌스 솔루션
                </h1>
                <p className="mt-[var(--app-gap-lg)] max-w-[min(100%,32rem)] text-sm font-semibold leading-6 text-white/76">
                기업 내 생성형 AI 사용 탐지부터 개인정보·민감정보 보호까지,<br />
                정책과 감사 이력을 한 곳에서 관리합니다
                </p>
              </div>
            </div>
          </section>

          <section className="flex min-h-[min(100vh,44rem)] items-center justify-center px-[clamp(2rem,3.4vw,3rem)] py-[clamp(2.5rem,4vw,3.5rem)]">
            <form onSubmit={handleSubmit} className="w-full max-w-[min(100%,27.5rem)]">
              <div>
                <h2 className="text-[2.2rem] font-black leading-tight tracking-[-0.04em] text-slate-950">
                  로그인
                </h2>
                <p className="mt-[var(--app-gap-md)] text-base font-semibold text-[#6B7280]">
                  관리자 계정으로 로그인해 주세요.
                </p>
              </div>

              <div className="mt-[calc(var(--app-gap-lg)*1.65)] space-y-[var(--app-gap-lg)]">
                <label className="block">
                  <span className="text-sm font-bold text-[#5B6478]">이메일</span>
                  <input
                    type="email"
                    placeholder="admin@garim.com"
                    className="mt-[var(--app-gap-sm)] h-[var(--app-control-xl)] w-full rounded-[var(--app-radius-lg)] border border-[#D8DEE9] bg-white px-[var(--app-pad-md)] text-[clamp(0.82rem,0.95vw,0.9rem)] font-semibold text-[#111827] outline-none transition placeholder:text-[#B8C0CE] focus:border-[#8B7CFF] focus:ring-[clamp(0.2rem,0.32vw,0.25rem)] focus:ring-[#EEEAFE]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#5B6478]">비밀번호</span>
                  <div className="relative mt-[var(--app-gap-sm)]">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder="••••••••••••••"
                      className="h-[var(--app-control-xl)] w-full rounded-[var(--app-radius-lg)] border border-[#D8DEE9] bg-white px-[var(--app-pad-md)] pr-[calc(var(--app-pad-lg)*1.9)] text-[clamp(0.82rem,0.95vw,0.9rem)] font-semibold text-[#111827] outline-none transition placeholder:text-[#B8C0CE] focus:border-[#8B7CFF] focus:ring-[clamp(0.2rem,0.32vw,0.25rem)] focus:ring-[#EEEAFE]"
                    />
                    <button
                      type="button"
                      aria-label={`비밀번호 ${isPasswordVisible ? '숨기기' : '보기'}`}
                      aria-pressed={isPasswordVisible}
                      onClick={() => setIsPasswordVisible(current => !current)}
                      className="absolute right-[var(--app-pad-md)] top-1/2 flex h-[var(--app-control-xs)] w-[var(--app-control-xs)] -translate-y-1/2 items-center justify-center rounded-[var(--app-radius-sm)] text-[#8A93A5] transition hover:bg-[#F4F6FA] hover:text-[#5B39D6]"
                    >
                      <PasswordRevealIcon className="h-[var(--app-icon-xs)] w-[var(--app-icon-xs)]" />
                    </button>
                  </div>
                </label>
              </div>

              <AppButton
                type="submit"
                className="mt-[calc(var(--app-gap-lg)*1.65)] h-[var(--app-control-xl)] w-full text-base font-black"
              >
                로그인
              </AppButton>

              <div className="mt-[calc(var(--app-gap-lg)*2)] border-t border-[#E5EAF3] pt-[calc(var(--app-pad-lg)*1.35)] text-center text-sm font-bold text-[#8A93A5]">
                © 2026 GARIM Co., Ltd.
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
