// import Admin from './components/Admin';
import News from './components/News';
import Button from './components/ui/Button';
import { useOpenMyPage } from './store/useOpenMyPage';
import MyPage from './components/Mypage/Mypage';
// import { Link } from 'react-router-dom';
import AdminMypage from './components/adminPage/AdminMypage';
import { useOpenAdminPage } from './store/useOpenAdminPage';
import { useOpenAdminDashboard } from './store/useOpenAdminDashboard';
import Admin from './components/adminPage/Admin';
import { useEffect } from 'react';


export default function MainPage() {
  const { setOpenMyPage } = useOpenMyPage();
  const { openAdminPage, setOpenAdminPage } = useOpenAdminPage();
  const { openAdminDashboard } = useOpenAdminDashboard();
  
  useEffect( ()=> {
    console.log(openAdminDashboard)
  }, [openAdminDashboard]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6">
        <h1 className="text-lg font-medium">Logo</h1>

        {/* 테스트용: 필요하면 어드민 바로 가기 버튼 추가 */}
        {/* <Link to="/admin" className="underline">
          Admin으로
        </Link> */}
        <button
          className='underline'
          onClick={() => {
            setOpenAdminPage(true)
            setOpenMyPage(false)
          }}
        >
          Admin
        </button>

        <button
          className="w-10 h-10 rounded-full bg-blue-500 text-white"
          onClick={() => {
            setOpenMyPage(true)
            setOpenAdminPage(false)

          }}
        >
          마이페이지
        </button>
      </header>

      <main className="flex-1 bg-slate-100 p-4">
        <div className="grid h-full grid-cols-[3fr_1fr] gap-4">
          <div className="grid grid-rows-[1fr_2fr] gap-4">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div className="bg-white rounded-lg p-6 flex flex-col">
                <News />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-white p-6">
                <span className="text-lg font-medium text-slate-700">날씨</span>
              </div>
            </div>

            <div className="flex items-center justify-center rounded-lg bg-white p-6 ">
              { !openAdminDashboard || !openAdminPage?
              <span className="text-xl font-medium text-slate-700">메인</span>
              : <Admin />
              }
            </div>
          </div>

          <div className="relative flex flex-col gap-5 bg-blue-600 rounded-lg p-6 items-center justify-center">
            <span className="text-lg font-medium text-white flex flex-col gap-3">
              <Button size="lg" variant="common">
                Todo List
              </Button>
              <Button size="lg" variant="common">
                일정 리스트
              </Button>
              <Button size="lg" variant="common">
                5일 날씨
              </Button>
              <Button size="lg" variant="common">
                오늘의 운세
              </Button>
              <Button size="lg" variant="common">
                QUIZ
              </Button>
              <Button size="lg" variant="common">
                푸쉬 설정
              </Button>
            </span>
            <MyPage />
            <AdminMypage/>
          </div>
        </div>
      </main>
    </div>
  );
}
