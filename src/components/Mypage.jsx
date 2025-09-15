import { useState } from 'react';
import { Login } from '../pages/Login';
import { useOpenMyPage } from '../store/useOpenMyPage';

export default function MyPage() {
  const { openMyPage, setOpenMyPage } = useOpenMyPage();

  return (
    <div className="flex flex-col w-screen h-screen">
      {/* 헤더 */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6">
        <h1 className="text-lg font-medium">Logo</h1>
        <button
          className="w-10 h-10 rounded-full bg-blue-500 text-white"
          onClick={() => setOpenMyPage(true)}
        >
          mypage
        </button>
      </header>

      {/* 메인 */}
      <main className="flex-1 bg-slate-100 p-4">
        <div className="h-full grid grid-cols-[3fr_1fr] gap-4">
          {/* 왼쪽 */}
          <div className="grid grid-rows-[1fr_2fr] gap-4">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700">뉴스</span>
              </div>
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700">날씨</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 flex items-center justify-center">
              <span className="text-xl font-medium text-slate-700">메인</span>
            </div>
          </div>

          {/* 오른쪽 (기준 컨테이너) */}
          <div className="relative">
            {/* 기본 파란 박스 */}
            <div className="bg-blue-600 rounded-lg p-6 flex items-center justify-center h-full">
              <span className="text-lg font-medium text-white">버튼</span>
            </div>

            {/* 분홍 카드: 오른쪽 박스만 덮는 오버레이 */}
            <PinkMyPageCard
              open={openMyPage}
              onClose={() => setOpenMyPage(false)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- 분홍 카드 컴포넌트 ---------- */
function PinkMyPageCard({ open, onClose }) {
  // view / edit / delete 3단계
  const [mode, setMode] = useState('view');

  return (
    <div
      className={[
        'absolute inset-0 z-10 rounded-lg shadow-xl ring-1 ring-black/10 overflow-hidden',
        'transition-all duration-300',
        open
          ? 'opacity-100 translate-x-0'
          : 'pointer-events-none opacity-0 translate-x-2',
      ].join(' ')}
    >
      <div className="h-full bg-pink-300 p-6 flex flex-col">
        {/* 닫기 */}
        <button
          className="ml-auto text-black/80 hover:text-black text-xl"
          onClick={onClose}
          aria-label="close"
        >
          ✕
        </button>

        {/* 프로필 */}
        <div className="flex flex-col items-center mt-2">
          <div className="w-20 h-20 rounded-full bg-black" />
          <span className="mt-2 text-sm text-slate-800">0000@gmail.com</span>
        </div>

        <hr className="my-4 border-black/20" />

        {/* 본문 (모드별 화면) */}
        <div className="flex-1">
          {mode === 'view' && <ViewSection onAsk={() => {}} />}

          {mode === 'edit' && <EditSection />}

          {mode === 'delete' && (
            <DeleteSection onCancel={() => setMode('view')} />
          )}
        </div>

        {/* 하단 메뉴 */}
        <div className="mt-6 flex justify-between text-sm font-medium">
          <button className="hover:underline" onClick={() => setMode('edit')}>
            편집
          </button>
          <button className="hover:underline">로그아웃</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 섹션들 ---------- */
function ViewSection({ onAsk }) {
  return (
    <div className="flex-1 space-y-4 text-center">
      <p className="text-lg font-semibold">XXX님 어서오세요!</p>
      <p className="text-sm text-slate-700">
        도움이 필요하신가요?
        <button
          className="ml-2 px-2 py-1 bg-slate-200 rounded text-sm"
          onClick={onAsk}
        >
          문의하기
        </button>
      </p>
    </div>
  );
}

function EditSection() {
  return (
    <div className="space-y-4">
      <Label>이미지 변경</Label>
      <input type="file" className="block w-full text-sm" />

      <Label>생년월일 변경</Label>
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="YYYY.MM.DD" />
        <button className="btn">적용</button>
      </div>

      <Label>비밀번호 변경</Label>
      <div className="space-y-2">
        <input className="input" placeholder="현재 비밀번호" type="password" />
        <input
          className="input"
          placeholder="새로운 비밀번호"
          type="password"
        />
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="새로운 비밀번호 확인"
            type="password"
          />
          <button className="btn">적용</button>
        </div>
      </div>

      <button className="text-xs text-slate-700 underline">회원탈퇴</button>
    </div>
  );
}

function DeleteSection({ onCancel }) {
  return (
    <div className="space-y-3">
      <Label>회원탈퇴</Label>
      <div className="bg-green-100 rounded-xl p-3 text-sm text-slate-700">
        보내기는 싫지만… 가신다면 어쩔 수 없죠… 정말 떠나실건가요?
      </div>
      <div className="flex gap-2 justify-end">
        <button className="btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button className="btn">확인</button>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-sm font-semibold text-slate-800 mt-2">{children}</div>
  );
}
