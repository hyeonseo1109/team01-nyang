export default function LoginButton({
  type = 'button',
  children,
  variant = '',
  disabled = false,
  ...rest
}) {
  const base = 'flex justify-center items-center transition text-white ';

  const variants = {
    common: 'bg-[#3456AF] hover:bg-[#24469d] disabled:bg-[#214294]',
    cancel: 'bg-[#636e8b] hover:bg-[#505b78] disabled:bg-[#495060]',
    confirm: 'bg-[#3058bd] hover:bg-[#1f45a5] disabled:bg-[#1c3063]',
  };

  const sizes = {
    md: 'w-full px-4 py-2 text-base rounded-[0.6rem]',
  };

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-70' : '';

  const classes = `${base} ${variants[variant]} ${sizes['md']} ${disabledClasses}`;

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
