import { useState } from 'react';
import LoginModal from '../components/ui/LoginModal';
import { LoginInput } from '../components/ui/LoginInput';
import LoginButton from '../components/ui/LoginButtons';
import { useNavigate } from 'react-router-dom';
import { newError } from '../utils/validate';

export function Login() {
  const navigate = useNavigate();
  const openModal = true;
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
  }

  const errors = newError(form);

  const mustFilled = form.email.length && form.password.length;
  const noError = !errors.email && !errors.password;
  const onButton = noError && mustFilled;

  const footer = () => {
    return (
      <div>
        <div className="buttons flex flex-col buttons w-full gap-2 pt-6">
          <LoginButton
            type="submit"
            variant={onButton ? 'common' : 'cancel'}
            size="md"
            disabled={!onButton}
            form="loginForm"
          >
            로그인
          </LoginButton>
          <button className="flex justify-center items-center h-[40px] bg-[#f2f2f2] hover:bg-[#001d35]/[0.08] rounded-[0.6rem]">
            <img className="w-6" src=".\src\assets\pngegg.png" alt="google" />
            구글로 시작하기
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <div>
            처음이신가요?
            <button
              className="text-[#3058bd] font-bold"
              onClick={() => navigate('/signup')}
            >
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
      <header className="flex h-16 items-center bg-slate-900 px-6 text-white">
        <h1 className="text-lg font-medium"></h1>
      </header>
      <main className="flex-1 bg-slate-100 p-4">
        <div className="grid h-full grid-cols-[3fr_1fr] gap-4">
          <div className="grid grid-rows-[1fr_2fr] gap-4">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700"></span>
              </div>
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700"></span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 flex items-center justify-center">
              <span className="text-xl font-medium text-slate-700"></span>
            </div>
          </div>
          <div className="bg-blue-600 rounded-lg p-6 flex items-center justify-center">
            <span className="text-lg font-medium text-white"></span>
          </div>
        </div>
      </main>

      <LoginModal openModal={openModal} title="로그인" footer={footer()}>
        <form
          id="loginForm"
          className="flex flex-col gap-1 mt-2"
          onSubmit={handleSubmit}
        >
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
          <LoginInput
            label={'비밀번호'}
            type={'password'}
            placeholder="비밀번호 입력"
            value={form.password}
            onChange={(e) => {
              const next = e.target.value;
              setForm((p) => ({ ...p, password: next }));
              setTouched((t) => ({ ...t, password: true }));
            }}
            error={touched.password ? errors.password : ''}
          />
        </form>
      </LoginModal>
    </div>
  );
}
