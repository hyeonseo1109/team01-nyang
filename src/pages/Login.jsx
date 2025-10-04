import { useState } from 'react';
import LoginModal from '../components/ui/LoginModal';
import { LoginInput } from '../components/ui/LoginInput';
import LoginButton from '../components/ui/LoginButtons';
import { useNavigate } from 'react-router-dom';
import { newError } from '../utils/validate';
import { useUser } from '../store/useUser';
import { useLogin } from '../api/auth';
import { LoginInputPassword } from '../components/ui/LoginInputPassword';
import Header from '../components/ui/Header';
import { useQueryClient } from '@tanstack/react-query';

export function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const openModal = true;
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const { loginMutate } = useLogin();
  const { getUser } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });

    loginMutate(form, {
      onSuccess: async () => {
        alert('로그인 성공');
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        await getUser();
        navigate('/main');
      },
      onError: () => {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      },
    });
  }

  const errors = newError(form);

  const mustFilled = form.email.length && form.password.length;
  const noError = !errors.email && !errors.password;
  const onButton = noError && mustFilled;

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google/login`;
  };

  const footer = () => {
    return (
      <div>
        <div className="buttons flex flex-col buttons w-full gap-2 pt-3">
          <LoginButton
            type="submit"
            variant={onButton ? 'common' : 'cancel'}
            size="md"
            disabled={!onButton}
            form="loginForm"
          >
            로그인
          </LoginButton>
          <button
            className="flex justify-center items-center h-[40px] bg-[#131314] hover:bg-[#e3e3e31f]/[0.08] rounded-[0.6rem]"
            onClick={() => googleLogin()}
          >
            <img className="w-6" src="../public/pngegg.png" alt="google" />
            구글로 시작하기
          </button>
        </div>

        <div className="flex justify-between mt-4 text-[12px]">
          <div>
            처음이신가요?
            <button className="text-blue-500 font-bold" onClick={() => navigate('/signup')}>
              회원가입
            </button>
          </div>
          <button onClick={() => navigate('/pwconfirm')}>비밀번호 찾기</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen flex-col">
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

      <LoginModal openModal={openModal} title="로그인" footer={footer()}>
        <form id="loginForm" className="flex flex-col gap-1 mt-2" onSubmit={handleSubmit}>
          <div>
            <LoginInput
              label={'이메일'}
              type={'email'}
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={(e) => {
                setForm((email) => ({ ...email, email: e.target.value }));
              }} //state 업데이트
              onBlur={() => setTouched((t) => ({ ...t, email: true }))} //유효성검사 메세지 출력
              error={touched.email ? errors.email : ''}
            />
          </div>
          <LoginInputPassword
            label={'비밀번호'}
            placeholder="비밀번호 입력"
            value={form.password}
            onChange={(e) => {
              const next = e.target.value;
              setForm((password) => ({ ...password, password: next }));
              setTouched((t) => ({ ...t, password: true }));
            }}
            error={touched.password ? errors.password : ''}
          />
        </form>
      </LoginModal>
    </div>
  );
}
