// src/components/Mypage/features/PasswordChangeBox.jsx
import { useEffect, useRef, useState } from 'react';
import { usePasswordChange } from '../../../api/auth';
import { LoginInputPassword } from '../../ui/LoginInputPassword';
import Modal from '../../ui/Modal';

export default function PasswordChangeBox() {
  const topRef = useRef(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const { passwordChangeMutate } = usePasswordChange();

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    topRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  }, []);

  const openModal = (title, msg) => {
    setModalTitle(title);
    setModalMsg(msg);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  function applyPassword() {
    if (newPw !== newPw2) return openModal('안내', '비밀번호 확인이 일치하지 않습니다.');
    if (!curPw || !newPw) return openModal('안내', '비밀번호를 입력해 주세요.');
    setSavingPw(true);
    passwordChangeMutate(
      { old_password: curPw, new_password: newPw },
      {
        onSuccess: () => {
          setCurPw('');
          setNewPw('');
          setNewPw2('');
          openModal('완료', '비밀번호가 변경되었습니다.');
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message || err?.message || '비밀번호 변경에 실패했습니다.';
          openModal('오류', msg);
        },
        onSettled: () => setSavingPw(false),
      },
    );
  }

  const label = savingPw ? '적용 중…' : '적용';

  const wrapCls =
    '[&_input]:!bg-neutral-900 [&_input]:!text-white [&_input]:!placeholder-white/60 ' +
    '[&_input]:!border-white/30 [&_input]:!h-10 [&_input]:!rounded-l-md ' +
    '[&_input:focus]:!outline-none [&_input:focus]:!ring-2 [&_input:focus]:!ring-white [&_input:focus]:!border-white ' +
    '[&_button]:!h-10 ' +
    '[&_div.select-none]:hidden'; // LoginInputPassword 내부 "123" 숨김

  return (
    <>
      <div ref={topRef} className="space-y-6 text-white">
        <div className="rounded-xl border border-white/10 p-4 space-y-3">
          <div className="font-semibold text-white">비밀번호 변경</div>

          <div className="grid gap-2">
            <div className={wrapCls}>
              <LoginInputPassword
                placeholder="현재 비밀번호"
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                disabled={savingPw}
              />
            </div>

            <div className={wrapCls}>
              <LoginInputPassword
                placeholder="새로운 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={savingPw}
              />
            </div>

            <div className={`flex-1 ${wrapCls}`}>
              <LoginInputPassword
                placeholder="새로운 비밀번호 확인"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                disabled={savingPw}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            className="btn !h-10 !py-0"
            type="button"
            onClick={applyPassword}
            disabled={savingPw}
          >
            {label}
          </button>
        </div>
      </div>

      {/* UI 폴더의 Modal 사용 */}
      <Modal
        openModal={modalOpen}
        title={modalTitle}
        onClose={closeModal}
        footer={
          <button className="btn text-xs" onClick={closeModal}>
            확인
          </button>
        }
      >
        {modalMsg}
      </Modal>
    </>
  );
}
