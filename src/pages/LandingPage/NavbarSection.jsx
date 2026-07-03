import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { BRAND, BRAND_LOGO } from './LandingPage.constants';
import { Container } from './LandingPage.primitives';

export default function NavbarSection({ className = '' }) {
  const items = useMemo(
    () => [
      { label: 'AI ACCESS CONTROL', href: '#features' },
      { label: '검증 기능', href: '#judge' },
      { label: '등록 방식', href: '#showcase' },
      { label: '결과 분석', href: '#history' },
      { label: 'FAQ', href: '#faq' },
    ],
    []
  );

  return (
    <div
      className={`border-b border-[#ece7e1] bg-[rgba(255,255,255,0.88)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.78)] ${className}`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between">
        <a href="#" className="inline-flex items-center">
          <img src={BRAND_LOGO} alt={BRAND} className="h-[1.7rem] w-auto sm:h-[1.9rem]" />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[#57534e] transition hover:text-[#171717]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
  to="/dashboard"
  className="group inline-flex items-center gap-2 rounded-xl border border-[#D8D0FF] bg-white px-4 py-2 text-sm font-medium text-[#5B39D6] shadow-[0_8px_20px_rgba(91,57,214,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#5B39D6] hover:bg-[#5B39D6] hover:text-white hover:shadow-[0_12px_28px_rgba(91,57,214,0.22)] focus:outline-none focus-visible:-translate-y-0.5 focus-visible:border-[#5B39D6] focus-visible:bg-[#5B39D6] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#8B7CFF] focus-visible:ring-offset-2"
>
  도입 문의하기
  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
</Link>
        </div>
      </Container>
    </div>
  );
}
