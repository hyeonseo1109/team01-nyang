import { useOpenAdminPage } from '../../store/useOpenAdminPage';
import PinkCard from '../Mypage/common/PinkCard';
import { useOpenAdminDashboard } from '../../store/useOpenAdminDashboard';
import Contact from '../Mypage/Contact/Contact';
import { useState } from 'react';
import { useTicketsStore } from '../../store/useTicketsStore';
import { useMainPage } from '../../store/useMainPage';
import { useUser } from '../../store/useUser';
import { useLogout } from '../../api/auth';
import { VscAccount, VscChromeClose } from 'react-icons/vsc';
import { MdOutlineMailOutline } from 'react-icons/md';

export default function AdminMypage() {
  const { openAdminPage, setOpenAdminPage } = useOpenAdminPage();
  const { openAdminDashboard, setOpenAdminDashboard } = useOpenAdminDashboard();

  const { clearUser } = useUser();
  const { logoutMutate } = useLogout();

  const { user } = useUser();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        clearUser();
      },
      onError: () => {
        alert('오류');
      },
    });
  };

  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState('reply');
  const [expandedId, setExpandedId] = useState(null);
  const { tickets, setTickets } = useTicketsStore();
  const { setPageMode } = useMainPage();

  const handleBackToMain = () => setPageMode('main');

  return (
    <>
      <PinkCard open={openAdminPage} onClose={() => setOpenAdminPage(false)}>
        <button
          className="ml-auto text-white/80 hover:text-gray-500 text-xl"
          onClick={() => {
            setOpenAdminPage(false);
            setOpenAdminDashboard(false);
            handleBackToMain();
          }}
          aria-label="close"
        >
          ✕
        </button>
        <div className="flex flex-col justify-start items-center h-full gap-5 w-full">
          <div className="text-2xl font-bold w-full justify-center flex pt-3">관리자 페이지</div>
          <div className="flex gap-4 w-full items-center border-t border-b py-3 border-[#444] lg:flex-row flex-col">
            <img
              className="w-20 h-20 border rounded-[50%] border-gray-600 aspect-[1/1]"
              src="/adminProfile.png"
              alt="관리자 아바타" //추가
            />
            <div className="flex flex-col w-full lg:items-start items-center">
              <p className="text-[1.2rem] font-bold">관리자님 ㅎㅇ?</p>
              <p className="text-[0.9rem] text-[#999]">{user.email}</p>
            </div>
          </div>
          <div className="w-full border rounded-xl px-5 py-8 gap-10 flex flex-col border-[#444]">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#999]">[회원정보]</p>
              <button
                className="border-b pb-10 border-[#444] w-full justify-start flex hover:text-[#999]"
                onClick={() => {
                  setOpenAdminDashboard(!openAdminDashboard);
                  if (openAdminDashboard) {
                    setPageMode('main');
                  } else {
                    setPageMode('admin');
                  }
                }}
              >
                {openAdminDashboard ? (
                  <div className="flex items-center gap-2">
                    <VscChromeClose />
                    <p>숨기기</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <VscAccount size={20} />
                    <p>유저 목록</p>
                  </div>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#999]">[문의 답변]</p>
              <div className="flex items-center gap-2 hover:text-[#999]">
                <MdOutlineMailOutline size={24} />
                <button
                  className="w-full justify-start flex"
                  onClick={() => {
                    setContactTab('reply'); // 관리자 전용 탭으로 진입
                    setContactOpen(true); // 모달 열기
                  }}
                >
                  고객센터
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-[#2d5b81] hover:bg-[#1b4567] shadow-3d flex justify-center items-center transition px-2 py-1 text-sm rounded-[0.4rem] w-20"
            onClick={() => {
              handleLogout();
            }}
          >
            로그아웃
          </button>
        </div>
      </PinkCard>

      <Contact
        open={contactOpen}
        tab={contactTab}
        setTab={setContactTab}
        onClose={() => {
          setContactOpen(false);
          setExpandedId(null);
        }}
        tickets={tickets}
        setTickets={setTickets}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        isAdmin={true} // ★ 관리자 전용 탭(답변함) 표시
        adminOnlyReply={true} // ★ 관리자 전용 모드 (문의하기 탭 숨김)
      />
    </>
  );
}
