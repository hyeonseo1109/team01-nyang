import { useMemo, useState } from 'react';
import LoginModal from '../components/ui/LoginModal';
import LoginButton from '../components/ui/LoginButtons';
import { LoginInput } from '../components/ui/LoginInput';
import { useNavigate } from 'react-router-dom';
import { newError } from '../utils/validate';
import Button from '../components/ui/Button';
import { LoginInputPassword } from '../components/ui/LoginInputPassword';
import Header from '../components/ui/Header';
import { useVerify } from '../api/auth';
import { useEmailSend } from '../api/auth';
import { useRegisterUser } from '../api/auth';

const CONTENT = {
  title: '[필수] 개인정보 수집·이용 동의',
  items: [
    '수집항목: 이메일, 비밀번호, 이름, 생년월일',
    '이용목적: 회원가입, 본인확인, 서비스 제공 및 문의 대응',
    '보유기간: 회원 탈퇴 시 또는 관련 법령에 따른 보관기간 경과 후 파기',
    '동의를 거부할 권리 및 불이익: 동의를 거부할 수 있으나, 서비스 이용이 제한될 수 있습니다.',
  ],
};

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
  const [emailCode, setEmailCode] = useState('');

  const [touched, setTouched] = useState({
    email: false,
    name: false,
    birth: false,
    password: false,
    confirm: false,
  });

  const [isCodeInput, setIsCodeInput] = useState(true);
  const [isEmailInput, setIsEmailInput] = useState(false);
  const [isFormInput, setIsFormInput] = useState(true);
  const [modal, setModal] = useState('');
  const [isModal, setIsModal] = useState(false);

  const errors = newError(form);

  const [agreed, setAgreed] = useState(false);

  const forms =
    form.email.length &&
    form.name.length &&
    form.birth.length &&
    form.password.length &&
    form.confirm.length;
  const noError = !errors.email && !errors.name && !errors.password && !errors.confirm;
  const onButton = agreed && noError && forms;

  const passwordPower = useMemo(() => {
    let power = 0;
    if (form.password.length >= 8) power += 1;
    if (/[A-Za-z]/.test(form.password)) power += 1;
    if (/\d/.test(form.password)) power += 1;
    return power;
  }, [form.password]);

  const { registerUserMutate } = useRegisterUser();
  const { resendMutate } = useEmailSend();
  const { verifyMutate } = useVerify();

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      email: true,
      name: true,
      birth: true,
      password: true,
      confirm: true,
    });
    const payload = {
      email: form.email,
      password: form.password,
      password_check: form.confirm,
      username: form.name,
      birthday: form.birth,
    };

    registerUserMutate(payload, {
      onSuccess: () => {
        navigate('/');
      },
      onError: () => {
        setModal('오류가 발생했습니다.');
        setIsModal(true);
      },
    });
  }

  const emailSend = () => {
    setModal('인증번호 보내는 중...');
    setIsModal(true);
    resendMutate(form.email, {
      onSuccess: () => {
        setIsModal(true);
        setModal('인증번호를 발송했습니다.');
        setTimeout(() => setIsModal(false), 1000);
        setIsEmailInput(true);
        setIsCodeInput(false);
      },
      onError: (error) => {
        setIsModal(true);
        setModal(error.response?.data?.detail || '오류가 발생했습니다.');
      },
    });
  };

  const codeConfirm = () => {
    const payload = { code: emailCode, email: form.email };
    verifyMutate(payload, {
      onSuccess: () => {
        setModal('인증되었습니다.');
        setTimeout(() => setIsModal(false), 1000);
        setIsModal(true);
        setIsFormInput(false);
        setIsCodeInput(true);
      },
      onError: (error) => {
        setModal(error.response?.data?.detail || '오류가 발생했습니다.');
        setIsModal(true);
        setIsEmailInput(false);
      },
    });
  };

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
        <div className="text-[12px]">
          생각해보니 가입했었네!?
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

      <LoginModal openModal={openModal} title="회원가입" footer={footer()}>
        <form id="signupForm" className="flex flex-col gap-1 mt-2" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            <LoginInput
              label={'이메일'}
              type={'email'}
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={(e) => {
                setForm((email) => ({ ...email, email: e.target.value }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={touched.email ? errors.email : ''}
              disabled={isEmailInput}
            />
            <button
              type="button"
              className="flex justify-center items-center h-[30px] border-[1px] text-neutral-300
                rounded-[5px] p-[2px] border-[#3f3f3f] bg-[#3f3f3f90] hover:bg-[#22222295] pr-1 pl-1 disabled:hover:bg-[#3f3f3f90]"
              disabled={!(form.email.length && !errors.email) || isEmailInput}
              onClick={() => emailSend()}
            >
              인증번호 발송
            </button>
          </div>
          <div className="flex justify-between gap-2">
            <LoginInput
              label={'인증번호'}
              type={'text'}
              placeholder="인증번호를 입력하세요"
              value={emailCode}
              onChange={(e) => {
                setEmailCode(e.target.value);
              }} //state 업데이트
              disabled={isCodeInput}
            />
            <button
              type="button"
              className="flex justify-center items-center h-[30px] border-[1px] text-neutral-300
                rounded-[5px] p-[2px] border-[#3f3f3f] bg-[#3f3f3f90] hover:bg-[#22222295] pr-1 pl-1 disabled:hover:bg-[#3f3f3f90]"
              disabled={!emailCode.length}
              onClick={() => codeConfirm()}
            >
              인증번호 확인
            </button>
          </div>
          <LoginInput
            label={'이름'}
            type={'text'}
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={(e) => setForm((name) => ({ ...name, name: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={touched.name ? errors.name : ''}
            disabled={isFormInput}
          />
          <LoginInput
            label={'생년월일'}
            type={'date'}
            placeholder="생년월일 작성"
            value={form.birth}
            onChange={(e) => setForm((prev) => ({ ...prev, birth: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, birth: true }))}
            error={touched.birth ? errors.birth : ''}
            disabled={isFormInput}
          />
          <div className="flex justify-end gap-1 mr-1">
            <div
              className={`${
                passwordPower === 0
                  ? 'bg-[#e3e3e3]'
                  : passwordPower === 1
                    ? 'bg-[#d85a5a]'
                    : passwordPower === 2
                      ? 'bg-[#ffc848]'
                      : passwordPower === 3 && 'bg-[#72e46a]'
              } w-5 h-[0.15rem]`}
            ></div>
            <div
              className={`${
                passwordPower === 0
                  ? 'bg-[#e3e3e3]'
                  : passwordPower === 1
                    ? 'bg-[#e3e3e3]'
                    : passwordPower === 2
                      ? 'bg-[#ffc848]'
                      : passwordPower === 3 && 'bg-[#72e46a]'
              } w-5 h-[0.15rem]`}
            ></div>
            <div
              className={`${
                passwordPower === 0
                  ? 'bg-[#e3e3e3]'
                  : passwordPower === 1
                    ? 'bg-[#e3e3e3]'
                    : passwordPower === 2
                      ? 'bg-[#e3e3e3]'
                      : passwordPower === 3 && 'bg-[#72e46a]'
              } w-5 h-[0.15rem]`}
            ></div>
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
            disabled={isFormInput}
          />

          <LoginInputPassword
            label={'비밀번호 확인'}
            placeholder="비밀번호 입력 확인"
            value={form.confirm}
            onChange={(e) => {
              const next = e.target.value;
              setForm((confirm) => ({ ...confirm, confirm: next }));
              setTouched((t) => ({ ...t, confirm: true }));
            }}
            error={touched.confirm ? errors.confirm : ''}
            disabled={isFormInput}
          />
          <div className="flex gap-1">
            <input
              id="cb"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="accent-[#2d5b81]"
            ></input>
            <label htmlFor="cb" className="text-neutral-200 select-none text-[12px]">
              개인 정보 수집 이용 동의 (필수)
            </label>
            <button
              type="button"
              className="text-[12px] text-blue-500"
              onClick={() => {
                setIsModal(true);
                setModal('consent');
              }}
            >
              자세히보기
            </button>
          </div>
        </form>
      </LoginModal>

      <LoginModal openModal={isModal} title={modal === 'consent' ? '' : modal} footer={close()}>
        {modal === 'consent' ? (
          <>
            <h1 className="text-neutral-300 text-[20px] pb-7 font-bold">{CONTENT.title}</h1>
            <ul className="text-neutral-300 flex flex-col gap-[10px] text-[13px] list-disc ">
              {CONTENT.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
      </LoginModal>
    </div>
  );
}
