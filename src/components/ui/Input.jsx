export function Input({
  label,
  type,
  error, //ex: 유효성 검사 부적합 시 메세지 출력
  onChange, // 타이핑할 때마다 바로바로 실행하는 거.
  onBlur, // onFocus 반대, input에서 포커스가 빠져나갔을 때 실행.
  // 사용자가 입력을 마치고, Focus가 해제됐을 때.
  // ex: 유효성 검사 바로바로 할 때 =  Controlled Component일 떄 쓰면 좋음.
  classNames = "rounded-sm border px-3",
  ...rest
}) {
  const id = rest.id || `input-${Math.random().toString(36).slice(2, 11)}`;

  const errorMessage = 'text-red-500';

  return (
    <div>
      {label && (
        <label htmlFor={id} className="sr-only opacity-0">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames}
        {...rest}
      />
      {error && <span className={errorMessage}>{error}</span>}
    </div>
  );
}
