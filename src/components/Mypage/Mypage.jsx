import { useEffect, useState } from 'react';
import { getMeMock, updateMeMock } from '../../mockData';
import { useOpenMyPage } from '../../store/useOpenMyPage';
import PinkCard from './common/PinkCard';
import Contact from './Contact';
import MypageEdit from './MypageEdit';
import Leave from './Leave';
import { useNavigate } from 'react-router-dom';
import { VscChromeClose } from "react-icons/vsc";

export default function MypageOverlay() {
  const navigate = useNavigate();
  const { openMyPage, setOpenMyPage } = useOpenMyPage();
  const [me, setMe] = useState(null);

  // 우측 카드 내부 상태
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'leave'
  const [askOpen, setAskOpen] = useState(false);
  const [askTab, setAskTab] = useState('ask'); // 'ask' | 'inbox'
  const [expandedId, setExpandedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [tickets, setTickets] = useState([
    {
      id: 1,
      status: '처리중',
      title: '로그인 문제가 있어요',
      time: '2025-09-10 14:22',
      body: '비밀번호 변경이 안됩니다.',
    },
    {
      id: 2,
      status: '완료',
      title: '생년월일 수정 요청',
      time: '2025-09-08 09:12',
      body: '형식 오류 경고가 나옵니다.',
      answer: '요청하신 생년월일 수정이 완료되었습니다. 다시 확인 부탁드립니다.',
    },
  ]);

  useEffect(() => {
    (async () => {
      const data = await getMeMock();
      setMe(data);
    })();
  }, []);

  const handleUpdate = async (payload) => {
    const updated = await updateMeMock(payload);
    setMe(updated);
  };

  return (
    <PinkCard open={openMyPage} onClose={() => setOpenMyPage(false)}>
      {/* 상단 바 */}
      <div className="flex items-center justify-between">
        {mode !== 'view' ? (
          <button
            className="text-black/80 hover:text-black text-xl"
            onClick={() => setMode('view')}
            aria-label="back"
          >
            ←
          </button>
        ) : (
          <div />
        )}

        <button
          className="ml-auto text-black/80 hover:text-black text-xl"
          onClick={() => setOpenMyPage(false)}
          aria-label="close"
        >
          <VscChromeClose size={30}/>
        </button>
      </div>

      {/* 프로필 */}
      <div className="flex flex-col items-center mt-2">
        <div className="w-20 h-20 rounded-full bg-black overflow-hidden">
          {(previewImage ?? me?.profile_image) && (
            <img
              src={previewImage ?? me?.profile_image}
              alt="profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <span className="mt-2 text-sm text-slate-800">{me?.email ?? '-'}</span>
      </div>

      <hr className="my-4 border-black/20" />

      {/* 문의함 버튼: view 모드에서만 노출 */}
      {mode === 'view' && (
        <div className="flex justify-end -mt-2">
          <button
            className="text-xs px-2 py-1 rounded bg-white/60 hover:bg-white shadow-sm border"
            onClick={() => {
              setAskTab('inbox');
              setAskOpen(true);
            }}
          >
            문의함
          </button>
        </div>
      )}

      {/* 본문(모드별) */}
      <div className="flex-1">
        {mode === 'view' && (
          <MainView
            name={me?.username}
            birthdate={me?.birthdate}
            onAsk={() => {
              setAskTab('ask');
              setAskOpen(true);
            }}
          />
        )}

        {mode === 'edit' && (
          <MypageEdit
            defaultUsername={me?.username ?? ''}
            defaultBirthdate={me?.birthdate ?? ''}
            defaultProfileImage={me?.profile_image ?? ''}
            onSubmit={handleUpdate}
            onAskDelete={() => setMode('leave')}
            onPreview={setPreviewImage}
          />
        )}

        {mode === 'leave' && <Leave onCancel={() => setMode('view')} />}
      </div>

      {/* 하단 메뉴 */}
      <div className="mt-6 flex justify-between text-sm font-medium">
        {mode !== 'edit' && (
          <button className="hover:underline" onClick={() => setMode('edit')}>
            편집
          </button>
        )}
        <button
          className="hover:underline"
          onClick={() => {
            // (옵션) 저장된 인증정보 제거
            // localStorage.removeItem('accessToken');
            // sessionStorage.removeItem('accessToken');

            // (옵션) 마이페이지 오버레이 닫기
            setOpenMyPage(false);

            // 이동: 필요한 경로로 선택
            navigate('/'); // 로그인(루트)로 가고 싶으면 이 줄
            // navigate('/main'); // 대시보드가 /main 이면 이 줄로

            // 나중에 로그인 기능 생기면.. 로그아웃 했을 때 토큰이 없으면 "/"으로 가게 될 거라서 그냥 토큰 삭제만 하면 됨.
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 문의 모달 */}
      <Contact
        open={askOpen}
        tab={askTab}
        setTab={setAskTab}
        onClose={() => setAskOpen(false)}
        tickets={tickets}
        setTickets={setTickets}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    </PinkCard>
  );
}

function MainView({ onAsk, name, birthdate }) {
  return (
    <div className="flex-1 space-y-4 text-center">
      <p className="text-lg font-semibold">{(name ?? '회원') + '님 어서오세요!'}</p>
      <p className="text-sm text-slate-700">생년월일: {birthdate ?? '—'}</p>
      <p className="text-sm text-slate-700">
        도움이 필요하신가요?
        <button className="ml-2 px-2 py-1 bg-slate-200 rounded text-sm" onClick={onAsk}>
          문의하기
        </button>
      </p>
    </div>
  );
}
