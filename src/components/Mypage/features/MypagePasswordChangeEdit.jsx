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

  // 에러 상태
  const [errCur, setErrCur] = useState('');
  const [errNew, setErrNew] = useState('');
  const [errNew2, setErrNew2] = useState('');

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    topRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  }, []);

  // 비밀번호 규칙: 8~32자, 영문/숫자/특수 중 2종 이상 포함
  const strong =
    /^(?=.{8,32}$)(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[^A-Za-z0-9])|(?=.*\d)(?=.*[^A-Za-z0-9])).*$/;

  const validateCur = (v) => {
    if (!v) return '현재 비밀번호를 입력하세요.';
    return '';
  };
  const validateNew = (v) => {
    if (!v) return '새 비밀번호를 입력하세요.';
    if (!strong.test(v)) return '8~32자, 영문/숫자/특수 2종 이상 포함';
    return '';
  };
  const validateNew2 = (v) => {
    if (!v) return '새 비밀번호 확인을 입력하세요.';
    if (v !== newPw) return '비밀번호 확인이 일치하지 않습니다.';
    return '';
  };

  const openModal = (title, msg) => {
    setModalTitle(title);
    setModalMsg(msg);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  function applyPassword() {
    const e1 = validateCur(curPw);
    const e2 = validateNew(newPw);
    const e3 = validateNew2(newPw2);

    setErrCur(e1);
    setErrNew(e2);
    setErrNew2(e3);

    if (e1 || e2 || e3) {
      openModal('안내', '비밀번호를 다시 확인해 주세요.');
      return;
    }

    setSavingPw(true);
    passwordChangeMutate(
      { old_password: curPw, new_password: newPw },
      {
        onSuccess: () => {
          setCurPw('');
          setNewPw('');
          setNewPw2('');
          setErrCur('');
          setErrNew('');
          setErrNew2('');
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

  return (
    <>
      <div ref={topRef} className="space-y-6 text-white text-xs sm:text-sm">
        <div className="rounded-xl border border-white/10 p-4 space-y-3 overflow-x-hidden">
          <div className="font-semibold text-white">비밀번호 변경</div>

          <div className="grid gap-2">
            <div className="pw-wrap">
              <LoginInputPassword
                placeholder="현재 비밀번호"
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                onBlur={() => setErrCur(validateCur(curPw))}
                error={errCur}
                disabled={savingPw}
              />
            </div>

            <div className="pw-wrap">
              <LoginInputPassword
                placeholder="새로운 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                onBlur={() => setErrNew(validateNew(newPw))}
                error={errNew}
                disabled={savingPw}
              />
            </div>

            <div className="flex-1 pw-wrap">
              <LoginInputPassword
                placeholder="새로운 비밀번호 확인"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                onBlur={() => setErrNew2(validateNew2(newPw2))}
                error={errNew2}
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
