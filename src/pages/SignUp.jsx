import { useState } from 'react';
import LoginModal from '../components/ui/LoginModal';
import LoginButton from '../components/ui/LoginButtons';
import { LoginInput } from '../components/ui/LoginInput';
import { useNavigate } from 'react-router-dom';
import { newError } from '../utils/validate';

export function SignUp() {
  const navigate = useNavigate();
  const openModal = true;
  const [form, setForm] = useState({
    email: '',
    name: '',
    birth: '',
    password: '',
    confirm: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    name: false,
    birth: false,
    password: false,
    confirm: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      email: true,
      name: true,
      birth: true,
      password: true,
      confirm: true,
    });
  }

  const errors = newError(form);

  const [agreed, setAgreed] = useState(false);

  const forms =
    form.email.length &&
    form.password.length &&
    form.birth.length &&
    form.password.length &&
    form.confirm.length;
  const noError =
    !errors.email && !errors.name && !errors.password && !errors.confirm;
  const onButton = agreed && noError && forms;

  const footer = () => {
    return (
      <div className="flex flex-col buttons w-full gap-2 pt-6">
        <LoginButton
          type="submit"
          variant={onButton ? 'common' : 'cancel'}
          size="md"
          disabled={!onButton}
          form="signupForm"
        >
          회원가입
        </LoginButton>
        <div>
          생각해보니 가입했었네!?
          <button
            onClick={() => navigate('/')}
            type="button"
            className="text-[#3058bd] font-bold"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="h-16 bg-slate-900 text-white flex items-center px-6">
        <h1 className="text-lg font-medium"></h1>
      </header>
      <main className="flex-1 bg-slate-100 p-4">
        <div className="h-full grid grid-cols-[3fr_1fr] gap-4">
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

      <LoginModal openModal={openModal} title="회원가입" footer={footer()}>
        <form
          id="signupForm"
          className="flex flex-col gap-1 mt-2"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between gap-2">
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
            <button
              type="button"
              className="flex justify-center items-center h-[35px] border-[1px]
                rounded-[5px] p-[2px] border-gray-400 bg-gray-200 hover:bg-gray-400 pr-1 pl-1"
            >
              이메일 인증
            </button>
          </div>
          <LoginInput
            label={'이름'}
            type={'text'}
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={touched.name ? errors.name : ''}
          />
          <LoginInput
            label={'생년월일'}
            type={'date'}
            placeholder="생년월일 작성"
            value={form.birth}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, birth: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, birth: true }))}
            error={touched.birth ? errors.birth : ''}
          />
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
          <LoginInput
            label={'비밀번호 확인'}
            type={'password'}
            placeholder="비밀번호 입력 확인"
            value={form.confirm}
            onChange={(e) => {
              const next = e.target.value;
              setForm((p) => ({ ...p, confirm: next }));
              setTouched((t) => ({ ...t, confirm: true }));
            }}
            error={touched.confirm ? errors.confirm : ''}
          />
          <div className="flex gap-1">
            <input
              id="cb"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            ></input>
            <label htmlFor="cb" className="select-none">
              개인 정보 수집 이용 동의 (필수)
            </label>
          </div>
        </form>
      </LoginModal>
    </div>
  );
}
