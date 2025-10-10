import News from './components/News';
import Button from './components/ui/Button';
import MyPage from './components/Mypage/Mypage';
import AdminMypage from './components/adminPage/AdminMypage';
import { useOpenAdminPage } from './store/useOpenAdminPage';
import { useOpenAdminDashboard } from './store/useOpenAdminDashboard';
import { useMainPage } from './store/useMainPage';
import TodayWeather from './components/weather/TodayWeather';
import FiveDayWeather from './components/weather/FiveDayWeather';
import TodayFortune from './components/TodayFortune';
import BriefingSection from './components/briefing/BriefingSection';
import { Quiz } from './components/quizPage/Quiz';
import BackButton from './components/ui/BackButton';
import { AdminInquiries } from './components/adminPage/AdminInquiries';
import Header from './components/ui/Header';
import Todo from './components/layout/Todo';
import ScheduleForm from './components/layout/Scheduleform';
import ScheduleSummary from './components/ScheduleSummary';
import { useOpenMyPage } from './store/useOpenMypage';
import { AdminNewUpdate } from './components/adminPage/AdminNewUpdate';
import GlareEffect from './components/GlareEffect';
import AnalogClock from './components/AnalogClock';
import { useUser } from './store/useUser';
import Admin from './components/adminPage/Admin';

export default function MainPage() {
  const { openAdminPage, setOpenAdminPage } = useOpenAdminPage();
  const { openAdminDashboard } = useOpenAdminDashboard();
  const { pageMode, setPageMode } = useMainPage();
  const { openMyPage, setOpenMyPage } = useOpenMyPage();

  const { user } = useUser();
  const isSuper = user?.is_superuser;

  const handleBackToMain = () => setPageMode('main');

  const CONTENT_MAP = {
    ...(isSuper && { admin: <Admin /> }),
    five: (
      <>
        <div className="absolute top-2 right-2">
          <BackButton onClose={handleBackToMain} />
        </div>
        <FiveDayWeather />
      </>
    ),
    fortune: (
      <>
        <div className="absolute top-2 right-2">
          <BackButton onClose={handleBackToMain} />
        </div>
        <TodayFortune />
      </>
    ),
    main: <BriefingSection />,
    todo: <BriefingSection />,
    schedule: <BriefingSection />,
    quiz: (
      <>
        <div className="absolute top-2 right-2">
          <BackButton onClose={handleBackToMain} />
        </div>
        <Quiz />
      </>
    ),
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* 스크롤바 공간 예약으로 미세 흔들림 방지 */}
      <main className="flex-1 bg-[#090909] p-4 min-h-0 overflow-hidden overflow-x-auto [scrollbar-gutter:stable_both-edges]">
        {/* 본문 vs 마이페이지 */}
        <div className="grid h-full grid-cols-[4fr_1fr] gap-4 min-w-0">
          {/* 헤더 vs 본문 */}
          <div className="grid grid-rows-[auto_1fr] gap-4 min-h-0 min-w-0">
            <Header isSuper={isSuper} />

            {/* 본문 - 위아래 1:2 비율 */}
            <div className="grid grid-rows-[1fr_2fr] gap-4 min-h-0 min-w-0">
              {/* 본문 윗부분 왼오 */}
              <div className="grid grid-cols-[3fr_2fr] gap-4 min-h-0 min-w-0">
                {/* 본문 윗부분 왼 */}
                <div className="bg-[#22222295] shadow-3d rounded-lg p-6 flex flex-col overflow-y-auto custom-scroll min-w-0">
                  {isSuper && openAdminDashboard ? <AdminNewUpdate /> : <News />}
                </div>

                {/* 본문 윗부분 오 */}
                <div className="flex items-center justify-center rounded-lg bg-[#22222295] shadow-3d p-6 overflow-y-auto min-w-0 custom-scroll">
                  {isSuper && openAdminDashboard ? <AdminInquiries /> : <TodayWeather />}
                </div>
              </div>

              {/* 본문 아랫부분 */}
              <div className="lg:grid grid-cols-[1fr_3fr] gap-4 min-h-0 min-w-0">
                {/* 본문 아랫부분 왼 */}
                <div className="hidden lg:flex bg-[#22222295] items-center justify-center shadow-3d rounded-lg relative overflow-hidden">
                  <AnalogClock />
                  <GlareEffect />
                </div>

                {/* 대시보드 = 본문 아랫부분 오 */}
                <div className="flex items-center justify-center rounded-lg bg-[#22222295] p-6 relative overflow-x-auto custom-scroll w-full h-full shadow-3d min-w-0">
                  {CONTENT_MAP[pageMode]}
                </div>
              </div>
            </div>
          </div>

          {/* 우측 사이드 (버튼/요약/마이페이지 인라인 렌더링 for lg) */}
          <div className="relative flex flex-col bg-[#22222295] shadow-3d rounded-lg min-w-0">
            <div className="flex-1 p-6 min-h-0">
              {/* lg 이상에서는 MyPage/AdminMypage가 열리면 이 기본 패널을 숨김 */}
              {pageMode !== 'todo' &&
                pageMode !== 'schedule' &&
                !openMyPage &&
                !(isSuper && openAdminPage) && (
                  <div className="flex flex-col justify-between h-full">
                    <span className="text-lg font-medium text-white flex flex-col gap-4 w-full whitespace-nowrap ">
                      <Button size="lgfree" variant="common" onClick={() => setPageMode('todo')}>
                        Todo List
                      </Button>
                      <Button
                        size="lgfree"
                        variant="common"
                        onClick={() => setPageMode('schedule')}
                      >
                        일정 리스트
                      </Button>
                      <Button size="lgfree" variant="common" onClick={() => setPageMode('five')}>
                        5일 날씨
                      </Button>
                      <Button size="lgfree" variant="common" onClick={() => setPageMode('fortune')}>
                        오늘의 운세
                      </Button>
                      <Button size="lgfree" variant="common" onClick={() => setPageMode('quiz')}>
                        QUIZ
                      </Button>
                      <Button size="lgfree" variant="common">
                        푸쉬 설정
                      </Button>
                    </span>
                    <div className="transition-opacity duration-500 ease-in-out opacity-0 lg:opacity-100">
                      <ScheduleSummary />
                    </div>
                  </div>
                )}

              {/* 🔹 작은 화면 전용: todo/schedule 패널은 fixed 오버레이(레이아웃 간섭 제거) */}
              <div
                className={`
                  transition-opacity ease-in-out
                  ${pageMode === 'todo' || pageMode === 'schedule' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                  fixed top-0 right-0 h-full w-[360px] bg-[#1c1c1c] backdrop-blur-md rounded-l-lg shadow-2xl z-50
                  lg:relative lg:top-auto lg:right-auto lg:w-full lg:h-full lg:bg-transparent lg:backdrop-blur-none lg:rounded-none lg:shadow-none lg:z-auto
                `}
              >
                <div className="h-full lg:p-0 p-6 overflow-y-auto custom-scroll">
                  {pageMode === 'todo' && <Todo setOpenTodo={handleBackToMain} />}
                  {pageMode === 'schedule' && (
                    <ScheduleForm
                      setOpenSchedule={handleBackToMain}
                      openAdminDashboard={openAdminDashboard}
                      openAdminPage={openAdminPage}
                      openSchedule={true}
                    />
                  )}
                </div>
              </div>

              {/* 🔹 큰 화면 전용: MyPage/AdminMypage를 '우측 패널 내부'에 인라인 렌더 */}
              <div className="hidden lg:block h-full">
                {openMyPage && <MyPage open={openMyPage} onClose={() => setOpenMyPage(false)} />}
                {isSuper && openAdminPage && (
                  <AdminMypage open={openAdminPage} onClose={() => setOpenAdminPage(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 작은 화면 전용: MyPage/AdminMypage는 우측 360px 오버레이로 */}
      {openMyPage && (
        <div className="fixed inset-0 z-[1000] pointer-events-auto lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMyPage(false)} />
          <div
            className="absolute right-0 top-0 h-full w-[360px] bg-[#1c1c1c] shadow-2xl rounded-l-lg p-6 overflow-y-auto custom-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <MyPage open={true} onClose={() => setOpenMyPage(false)} />
          </div>
        </div>
      )}

      {isSuper && openAdminPage && (
        <div className="fixed inset-0 z-[1000] pointer-events-auto lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenAdminPage(false)} />
          <div
            className="absolute right-0 top-0 h-full w-[360px] bg-[#1c1c1c] shadow-2xl rounded-l-lg p-6 overflow-y-auto custom-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminMypage open={true} onClose={() => setOpenAdminPage(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
