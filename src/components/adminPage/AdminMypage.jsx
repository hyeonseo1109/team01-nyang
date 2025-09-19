import { useNavigate } from "react-router-dom";
import { useOpenAdminPage } from "../../store/useOpenAdminPage";
import PinkCard from "../Mypage/common/PinkCard";
import Button from "../ui/Button";
import { useOpenAdminDashboard } from "../../store/useOpenAdminDashboard";
import { VscChromeClose } from "react-icons/vsc";

export default function AdminMypage () {
  const { openAdminPage, setOpenAdminPage } = useOpenAdminPage();
  const { openAdminDashboard, setOpenAdminDashboard } = useOpenAdminDashboard();
  
  const navigate = useNavigate();
  return (<>
    <PinkCard open={openAdminPage} onClose={() => setOpenAdminPage(false)}>
      <button
          className="ml-auto text-black/80 hover:text-black text-xl"
          onClick={() => {
            setOpenAdminPage(false)
            setOpenAdminDashboard(false)
          }}
          aria-label="close"
        >
          <VscChromeClose size={30}/>
        </button>
      <div className="flex flex-col justify-start h-full gap-15">
        <div className="flex flex-col gap-10 w-full items-center  border-b pb-10">
          <img 
            className="mt-2 w-20 h-20 border rounded-[50%] border-gray-600 aspect-[1/1]"
            src="/images/nyangbiseo-sunglasses.png"/>
          <p className="text-[1.2rem]"
          >관리자님 ㅎㅇ?</p>
        </div>
          
        <Button 
          size="md" 
          variant="common"
          onClick = { () => { setOpenAdminDashboard(!openAdminDashboard) }}
        >
          { openAdminDashboard ? <p>숨기기</p> : <p>유저 목록</p>}
        </Button>
      </div>

      <button
          className="hover:underline"
          onClick={() => {
            // localStorage.removeItem('accessToken');
            setOpenAdminPage(false);
            navigate('/');
            // 나중에 로그인 기능 생기면.. 로그아웃 했을 때 토큰이 없으면 "/"으로 가게 될 거라서 그냥 토큰 삭제만 하면 됨.
          }}
        >
          로그아웃
        </button>

    </PinkCard>
  </>)
}