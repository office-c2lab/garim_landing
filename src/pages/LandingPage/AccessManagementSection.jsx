import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

import { UserManagementTable } from '@/pages/UserPage/UserPage.jsx';
import {
  Container,
  SectionTitle,
  SECTION_COPY_REVEAL,
  SECTION_TITLE_REVEAL,
} from './LandingPage.primitives';

const USER_PREVIEW_ROWS = [
  {
    id: 'usr-preview-1',
    ip: '10.10.24.18',
    name: '김가림',
    email: 'garim.kim@company.co.kr',
    department: '영업팀',
    position: '매니저',
    createdAt: '2026-06-05 10:20',
  },
  {
    id: 'usr-preview-2',
    ip: '10.10.31.42',
    name: '박민준',
    email: 'minjun.park@company.co.kr',
    department: '마케팅팀',
    position: '팀장',
    createdAt: '2026-06-04 16:12',
  },
  {
    id: 'usr-preview-3',
    ip: '10.10.18.7',
    name: '이서연',
    email: 'seoyeon.lee@company.co.kr',
    department: '법무팀',
    position: '책임',
    createdAt: '2026-06-03 09:45',
  },
  {
    id: 'usr-preview-4',
    ip: '10.10.44.11',
    name: '최도윤',
    email: 'doyun.choi@company.co.kr',
    department: '개발팀',
    position: '시니어 엔지니어',
    createdAt: '2026-06-02 13:08',
  },
];

function UserPreviewTable() {
  const [users, setUsers] = useState(USER_PREVIEW_ROWS);
  const [selectedId, setSelectedId] = useState(USER_PREVIEW_ROWS[0]?.id ?? null);

  const selectedUser = useMemo(
    () => users.find(user => user.id === selectedId) ?? null,
    [selectedId, users]
  );

  const handleDeleteUser = userId => {
    setUsers(current => {
      const nextUsers = current.filter(user => user.id !== userId);
      setSelectedId(nextUsers[0]?.id ?? null);
      return nextUsers;
    });
  };

  const handleSaveUser = draft => {
    if (!selectedUser) return;

    setUsers(current =>
      current.map(user => (user.id === selectedUser.id ? { ...user, ...draft } : user))
    );
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <UserManagementTable
        rows={users}
        selectedId={selectedId}
        selectedUser={selectedUser}
        onSelectUser={userId => setSelectedId(userId)}
        onDeleteUser={handleDeleteUser}
        onSaveUser={handleSaveUser}
        statusMessage={!users.length ? '현재 조건에 맞는 사용자가 없습니다.' : ''}
        className="rounded-[28px] border border-[#ded9ff] bg-white shadow-[0_24px_70px_rgba(64,48,150,0.12)]"
        tableClassName="min-w-[860px] text-[13px]"
      />
    </Motion.div>
  );
}

export default function AccessManagementSection() {
  return (
    <section id="access-management" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] lg:items-center lg:gap-12 xl:gap-14">
          <Motion.div className="max-w-xl" {...SECTION_TITLE_REVEAL}>
            <SectionTitle
              eyebrow="USER MANAGEMENT"
              title={<>사용자와 고정 IP 기준으로 접근 권한을 관리합니다</>}
              desc={
                <>
                  부서, 직책, 사용자, IP 정보를 기준으로 AI 접근 대상을 세분화합니다.
                  <br />
                  누가 어떤 환경에서 AI를 쓰는지 관리해 정책 적용과 감사 추적을 선명하게 만듭니다.
                </>
              }
            />
          </Motion.div>

          <Motion.div className="min-w-0" {...SECTION_COPY_REVEAL}>
            <UserPreviewTable />
          </Motion.div>
        </div>
      </Container>
    </section>
  );
}
