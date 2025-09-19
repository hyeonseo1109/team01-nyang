import { useMutation } from "@tanstack/react-query";
import { api } from "./client";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법



// !- - - - 이메일/패스워드 회원가입 - - - -
export async function registerUser (payload) {
  // 사용자가 적은 이메일/패스워드를 payload 매개변수로 받아와서 보냄
  const res = await api.post("/auth/register", payload);
  return res.data;
}
export function useRegisterUser() {
  // 위에서 만든 registerUser를 호출하는 용도.
  const {
    mutate: registerUserMutate,
    error: registerUserError,
    ...rest
  } = useMutation({ mutationFn: registerUser });
  // useMutation: 서버에 데이터 보낼 때. (주로 POST, PUT, PATCH, DELETE 요청)
  // mutationFn: 실행할 함수
  return { registerUserMutate, registerUserError, ...rest };
}
// const { registerUserMutate, registerUserError } = useRegisterUser();
// const handleSignInSubmit =()=> { registerUserMutate(form) }; 
// -- Mutate(실행할 함수)에 payload로 form(이건 따로 상태 같은 거로 만들어서..)를 request body에 담아서 보내기 



// !- - - - 로그인(JWT 발급) - - - - 
export async function login (payload) {
  const res = await api.post("/auth/login", payload);
  // 로그인 정보 
  return res.data;
}
export function useLogin () {
  const {
    mutate: loginMutate,
    error: loginError,
    ...rest
  } = useMutation ({ mutationFn: login });
  return { loginMutate, loginError, ...rest };
}
// const { loginMutate, loginError } = useLogin();
// const handleLoginSubmit =()=> { loginMutate(form) };



// !- - - - 구글 소셜 로그인 - - - -
export async function socialLogin (payload) {
  const res = await api.post("/auth/social", payload)
  return res.data;
}
export function useSocialLogin () {
  const {
    mutate: socialLoginMutate,
    error: socialLoginError,
    ...rest
  } = useMutation ({ mutationFn: socialLogin });
  return { socialLoginMutate, socialLoginError, ...rest };
}
// const { socialLoginMutate, socialLoginError } = useSocialLogin();



// !- - - - 토큰 리프레시로 액세스 재발급 (다시 불러오기) - - - -
export async function refreshToken (payload) {
  const res = await api.post("/auth/token/refresh", payload);
  return res.data;
}
export function useRefreshToken () {
  const {
    mutate: refreshTokenMutate,
    error: refreshTokenError,
    ...rest
  } = useMutation ({ mutationFn: refreshToken });
  return { refreshTokenMutate, refreshTokenError, ...rest };
}
// const { refreshTokenMutate, refreshTokenError } = useRefreshToken();
// const handleRefresh = () => {
//   const refreshToken = localStorage.getItem("refresh_token");
//   refreshTokenMutate({ refresh_token: refreshToken });
// };



// !- - - - 로그아웃(현재 jti 블랙리스트 등록) - - - -
export async function logout () {
  const res = await api.post("/auth/logout");
  return res.data;
}
export function useLogout () {
  const {
    mutate: logoutMutate,
    error: logoutError,
    ...rest
  } = useMutation ({ mutationFn: logout });
  return { logoutMutate, logoutError, ...rest };
}
// const { logoutMutate, logoutError } = useLogout();
// const handleLogout = () => {
//   logoutMutate(undefined, {
//     onSuccess: () => {
//       localStorage.removeItem("access_token");
//     },
//   });
// };



// !- - - - 인증 메일 발송 - - - - 
export async function emailSend () {
  const res = await api.post("/auth/email/resend");
  return res.data;
}
export function useEmailSend () {
  const {
    mutate: resendMutate,
    error: resendError,
    ...rest
  } =  useMutation ({ mutationFn: emailSend });
  return { resendMutate, resendError, ...rest };
}
// const { resendMutate, resendError } = useResend();

// const handleResend =()=> { resendMutate() }; 
// -- 이렇게만 해도 되는데

// const handleResend =()=> { 
//   resendMutate(undefined, { 
// -- Request_Body로 내용을 첫 번쨰 인자에 넣는 건데, 이 api는 보낼 내용 없으니까 undefined로 두기.
//     onSuccess: () => alert("인증 메일 보냄!"),
//     onError: () => alert("실패!"),
//   });
// }
// 이렇게 하면 성공시/실패시 실행할 콜백을 지정할 수 있음. 
// 여러 군데의 컴포넌트에서 쓰더라도 일괄적으로 미리 공통 처리할 수 있음. 



// !- - - - 이메일 인증 완료 - - - - (인증번호 담아서 보내기)
export async function verify (payload) {
  const res = await api.post("/auth/email/verify", payload);
  return res.data;
}
export function useVerify () {
  const {
    mutate: verifyMutate,
    error: verifyError,
    ...rest
  } = useMutation ({ mutationFn: verify });
  return { verifyMutate, verifyError, ...rest };
}
// const { verifyMutate, verifyError } = useVerify();
// verifyMutate(form)



//! - - - - 비밀번호 변경 - - - - 
export async function passwordChange (payload) {
  const res = await api.post("/auth/password/change", payload);
  return res.data;
}
export function usePasswordChange () {
  const {
    mutate: passwordChangeMutate,
    error: passwordChangeError,
    ...rest
  } = useMutation ({ mutationFn: passwordChange });
  return { passwordChangeMutate, passwordChangeError, ...rest };
}
// const { passwordChangeMutate, passwordChangeError } = usePasswordChange();
// const handleChangePassword =()=> {
//   passwordChangeMutate(
//     { old_password: oldPassword,
//       new_password: newPassword,
//     },
//   )
// }



// !- - - - 비밀번호 초기화 메일 - - - - 
export async function passwordReset (payload) {
  const res = await api.post("/auth/password/reset-request", payload);
  return res.data;
}
export function usePasswordReset () {
  const {
    mutate: passwordResetMutate,
    error: passwordResetError,
    ...rest
  } = useMutation ({ mutationFn: passwordReset });
  return { passwordResetMutate, passwordResetError, ...rest };
}
// const { passwordResetMutate, passwordResetError } = usePasswordReset();
// passwordResetMutate({ email });



// !- - - - 새 비밀번호 설정(초기화 토큰으로 설정) - - - -
export async function confirmPasswordReset (payload) {
  const res = await api.post("/auth/password/reset-confirm", payload);
  return res.data;
}
export function useConfirmPasswordReset () {
  const {
    mutate: confirmPasswordResetMutate, 
    error: confirmPasswordResetError,
    ...rest
  } = useMutation ({ mutationFn: confirmPasswordReset });
  return { confirmPasswordResetMutate, confirmPasswordResetError, ...rest };
}
// const { confirmPasswordResetMutate, confirmPasswordResetError } = useConfirmPasswordReset();
// confirmPasswordResetMutate({ new_password });