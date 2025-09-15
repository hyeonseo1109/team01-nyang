import { useState } from "react";
import { SignIn } from "./components/SignIn";
import Button from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import Modal from "./components/ui/Modal";
import { useOpenModal } from "./Store/useOpenModal";


export default function MainPage() {
  const {openModal, setOpenModal} = useOpenModal();
  const [verification, setVerification] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const handleVerification = () => {
    if (verification !== "check") {
      setVerificationError("인증번호가 일치하지 않습니다.");
    } else {
      setVerificationError("");
    }
  }
  return (<>
    {/* 버튼 */}
    <div className="flex flex-col gap-5 border p-8">
      <h1 className="text-black">Common 버튼</h1>
      <Button size="sm" variant="common">common-m</Button>
      <Button size="md" variant="common">common-m</Button>
      <Button size="lg" variant="common">common-m</Button>
    </div>
    <div className="flex flex-col gap-5 border p-8">
      <h1 className="text-black">confirm/cancle 버튼</h1>
      <div className="flex gap-5">
        <Button size="sm" variant="confirm">confirm-sm</Button>
        <Button size="sm" variant="cancle">cancle-sm</Button>
      </div>
    </div>

    {/* input */}
    <div className="flex flex-col border p-8">
      <SignIn/>
    </div>

    {/* 모달 */}
    <div className="border p-8">
      <Button 
        size="md" variant="common"
        onClick={()=> setOpenModal(!openModal)}
      >모달 토글</Button>

      <Modal
        openModal={openModal}
        title="인증 확인 요청을 보냈습니다. 인증번호를 입력해주세요."
        onClose={()=> setOpenModal()}
        children={
          <Input
            label="인증번호"
            type="text"
            placeholder="인증번호를 입력해주세요"
            value={verification}
            onChange={(e)=>setVerification(e.target.value)}
            onBlur={handleVerification}
            error={verificationError}
          />
        }
        footer={
        <div className="flex gap-5">
          <Button size="sm" variant="confirm">confirm-sm</Button>
          <Button size="sm" variant="cancle">cancle-sm</Button>
        </div>}

      />


    </div>


  </>  
  );
}