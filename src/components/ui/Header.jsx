import { useMainPage } from '../../store/useMainPage';
import { useOpenAdminDashboard } from '../../store/useOpenAdminDashboard';
import { useOpenAdminPage } from '../../store/useOpenAdminPage';
import { useOpenMyPage } from '../../store/useOpenMypage';

export default function Header({ isSuper }) {
  const { setOpenAdminPage } = useOpenAdminPage();
  const { setOpenMyPage } = useOpenMyPage();
  const { setPageMode } = useMainPage();
  const { setOpenAdminDashboard } = useOpenAdminDashboard();
  return (
    <header className="h-[2rem] flex items-center justify-between px-4">
      <img src="/public/lineHeartTitle.png" className="h-full" />

      {isSuper ? (
        <button
          className="underline"
          onClick={() => {
            setOpenAdminPage(true);
            setOpenMyPage(false);
          }}
        >
          Admin
        </button>
      ) : (
        <button
          className=" text-white"
          onClick={() => {
            setOpenMyPage(true);
            setOpenAdminPage(false);
            setPageMode('main');
            setOpenAdminDashboard(false);
          }}
        >
          마이페이지
        </button>
      )}
    </header>
  );
}
