import { useState } from 'react';
import Button from './Button';
import { IoEyeOutline } from 'react-icons/io5';
import { IoEyeOffOutline } from 'react-icons/io5';

export function LoginInputPassword({
  label,
  error, //ex: 유효성 검사 부적합 시 메세지 출력
  onChange, // 타이핑할 때마다 바로바로 실행하는 거.
  onBlur, // onFocus 반대, input에서 포커스가 빠져나갔을 때 실행.
  // 사용자가 입력을 마치고, Focus가 해제됐을 때.
  // ex: 유효성 검사 바로바로 할 때 =  Controlled Component일 떄 쓰면 좋음.
  disabled = false,
  ...rest
}) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const passwordType = passwordVisibility ? 'text' : 'password';

  const id = rest.id || `input-${Math.random().toString(36).slice(2, 11)}`;

  const errorMessage = error
    ? 'text-red-500 text-[12px] mt-1 select-none'
    : 'text-[#222222] text-[12px] mt-1 select-none';

  return (
    <div className="flex flex-col flex-1">
      {label && (
        <label htmlFor={id} className="opacity-0 sr-only">
          {label}
        </label>
      )}
      <div>
        <div className="flex">
          <input
            id={id}
            type={passwordType}
            onChange={onChange}
            onBlur={onBlur}
            className="text-neutral-100 border px-3 rounded-l-sm h-[30px] border-gray-400 w-full"
            disabled={disabled}
            {...rest}
          />
          <div onClick={() => setPasswordVisibility((prev) => !prev)}>
            <Button size="mini" variant="mini2">
              {passwordVisibility ? (
                <IoEyeOffOutline style={{ color: 'white' }} size={24} />
              ) : (
                <IoEyeOutline style={{ color: 'white' }} size={24} />
              )}
            </Button>
          </div>
        </div>
        <div className={errorMessage}>{error ? error : '123'}</div>
      </div>
    </div>
  );
}
