import LoginModal from '../components/ui/LoginModal';
import { LoginInput } from '../components/ui/LoginInput';
import { useState } from 'react';
import LoginButton from '../components/ui/LoginButtons';
import { useNavigate } from 'react-router-dom';
import { newError } from '../utils/validate';
import Button from '../components/ui/Button';
import { LoginInputPassword } from '../components/ui/LoginInputPassword';
import Header from '../components/ui/Header';
import { useConfirmPasswordReset, usePasswordReset } from '../api/auth';
import toast, { Toaster } from 'react-hot-toast';

export function PwConfirm() {
  const navigate = useNavigate();
  const openModal = true;
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
  });

  const [isEmail, setIsEmail] = useState(false);
  const [isInput, setIsInput] = useState(true);
  const [modal, setModal] = useState('');
  const [isModal, setIsModal] = useState(false);

  const { passwordResetMutate } = usePasswordReset();
  const { confirmPasswordResetMutate } = useConfirmPasswordReset();

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirm: true,
    });

    const payload = {
      email: form.email,
      new_password: form.password,
      new_password_check: form.confirm,
    };
    confirmPasswordResetMutate(payload, {
      onSuccess: () => {
        toast.success('비밀번호 변경 완료', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setTimeout(() => navigate('/'), 1000);
      },
      onError: (error) => {
        setModal(error.response?.data?.detail || '비밀번호 변경 중 오류가 발생했습니다.');
        setIsModal(true);
      },
    });
  }

  const errors = newError(form);

  function emailConfirm() {
    setModal('이메일 확인하는 중...');
    setIsModal(true);
    const payload = { email: form.email };
    passwordResetMutate(payload, {
      onSuccess: () => {
        setModal('확인되었습니다.');
        setIsModal(true);
        setIsInput(false);
        setIsEmail(true);
        setTimeout(() => setIsModal(false), 2000);
      },
      onError: (error) => {
        setModal(error.response?.data?.detail || '이메일 확인 중 오류가 발생했습니다.');
        setIsModal(true);
      },
    });
  }

  const forms = form.password.length && form.confirm.length;
  const noError = !errors.password && !errors.confirm;
  const onButton = noError && forms;

  const footer = () => {
    return (
      <div className="flex flex-col w-full gap-2 pt-3">
        <LoginButton
          type="submit"
          variant={onButton ? 'common' : 'cancel'}
          size="md"
          form="pwConfirmForm"
          disabled={!onButton}
        >
          변경하기
        </LoginButton>
        <div className="text-[12px]">
          비밀번호 생각났어요!
          <button onClick={() => navigate('/')} type="button" className="text-blue-500 font-bold">
            돌아가기
          </button>
        </div>
      </div>
    );
  };

  const close = () => {
    return (
      <div className="mt-6">
        <Button
          variant="common"
          size="md"
          onClick={() => {
            setIsModal(false);
          }}
        >
          닫기
        </Button>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <main className="flex-1 bg-[#090909] p-4 min-h-0 overflow-hidden">
        <div className="grid h-full grid-cols-[4fr_1fr] gap-4 min-w-0">
          <div className="grid grid-rows-[auto_1fr] gap-4 min-h-0 min-w-0">
            <Header />
            <div className="grid grid-rows-[1fr_2fr] gap-4 min-h-0 min-w-0">
              <div className="grid grid-cols-[3fr_2fr] gap-4 min-h-0 min-w-0">
                <div className="bg-[#22222295] shadow-3d rounded-lg p-6 flex flex-col overflow-y-auto min-w-0"></div>
                <div className="flex items-center justify-center rounded-lg bg-[#22222295] shadow-3d p-6 overflow-y-auto min-w-0"></div>
              </div>
              <div className="grid grid-cols-[1fr_2fr] gap-4 min-h-0 min-w-0">
                <div className="flex bg-[#22222295] items-center justify-center shadow-3d rounded-lg min-w-0"></div>
                <div className="flex items-center justify-center rounded-lg bg-[#22222295] p-6 relative  overflow-x-auto custom-scroll shadow-3d min-w-0"></div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col bg-[#22222295] shadow-3d rounded-lg overflow-hidden min-w-0"></div>
        </div>
      </main>

      <LoginModal openModal={openModal} title={'비밀번호 찾기'} footer={footer()}>
        <form id="pwConfirmForm" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            <LoginInput
              label={'이메일'}
              type={'email'}
              placeholder="이메일을 입력하세요"
              value={form.email}
              disabled={isEmail}
              onChange={(e) => {
                setForm((email) => ({ ...email, email: e.target.value }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={touched.email ? errors.email : ''}
            ></LoginInput>
            <button
              type="button"
              className="flex justify-center items-center w-auto h-[30px] border-[1px] text-neutral-300
                rounded-[5px] p-[2px] border-[#3f3f3f] bg-[#3f3f3f90] hover:bg-[#22222295] pr-1 pl-1 disabled:hover:bg-[#3f3f3f90]"
              disabled={!form.email || errors.email || isEmail}
              onClick={() => emailConfirm(form.email)}
            >
              이메일 확인
            </button>
          </div>
          <LoginInputPassword
            label={'비밀번호'}
            placeholder="비밀번호 입력"
            value={form.password}
            disabled={isInput}
            onChange={(e) => {
              const next = e.target.value;
              setForm((password) => ({ ...password, password: next }));
              setTouched((t) => ({ ...t, password: true }));
            }}
            error={touched.password ? errors.password : ''}
          />
          <LoginInputPassword
            label={'비밀번호 확인'}
            placeholder="비밀번호 입력 확인"
            value={form.confirm}
            disabled={isInput}
            onChange={(e) => {
              const next = e.target.value;
              setForm((confirm) => ({ ...confirm, confirm: next }));
              setTouched((t) => ({ ...t, confirm: true }));
            }}
            error={touched.confirm ? errors.confirm : ''}
          />
        </form>
      </LoginModal>
      <LoginModal openModal={isModal} title={modal} popup={true} footer={close()}></LoginModal>
    </div>
  );
}
