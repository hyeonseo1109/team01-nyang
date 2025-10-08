const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const NAME_REGEX = /^[A-Za-z가-힣]{2,8}$/;
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

const validateEmail = (email) =>
  email && !EMAIL_REGEX.test(email) ? '이메일 형식이 올바르지 않습니다.' : '';
const validateName = (name) =>
  name && !NAME_REGEX.test(name) ? '이름은 2~8자의 한글/영문만 가능합니다.' : '';
const validatePw = (pw) =>
  pw && !PW_REGEX.test(pw) ? '비밀번호는 8자 이상, 영문 + 숫자를 포함해야합니다.' : '';
const validateConfirm = (pw, confirm) => (pw === confirm ? '' : '비밀번호가 일치하지않습니다.');

export const newError = (form) => ({
  email: validateEmail(form.email),
  name: validateName(form.name),
  birth: '',
  password: validatePw(form.password),
  confirm: validateConfirm(form.confirm, form.password),
});
