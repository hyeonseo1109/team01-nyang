export default function Button({
  children,
  variant = '',
  size = 'sm',
  disabled = false,
  onClick,
  ...rest
}) {
  const base = 'flex justify-center items-center transition text-white ';

  const variants = {
    common: 'bg-[#2d5b81] hover:bg-[#1b4567] disabled:bg-[#214294] shadow-3d',
    cancel: 'bg-[#636e8b] hover:bg-[#505b78] disabled:bg-[#495060] shadow-3d',
    confirm: 'bg-[#2d5b81] hover:bg-[#1b4567] disabled:bg-[#1c3063] shadow-3d',
    mini: 'bg-[#eee] hover:bg-[#ddd] disabled:bg-[#ccc]',
    mini2: 'bg-[#3f3f3f94] hover:bg-[#22222295]',
  };

  const sizes = {
    vsm: 'px-1 py-0.5 text-sm rounded-[0.3rem] w-full min-w-12',
    sm: 'px-2 py-1 text-sm rounded-[0.4rem] w-full min-w-24',
    // w-24
    md: 'px-4 py-2 text-base rounded-[0.6rem] w-full min-w-32',
    // w-32
    lg: 'px-6 py-3 text-lg rounded-[0.7rem] w-full min-w-40',
    //w-40
    mini: 'h-[30px] w-[30px] p-1 rounded-r-[0.3rem] border-y border-r border-gray-400',
    lgfree: 'px-6 py-3 text-lg rounded-[0.7rem] w-full whitespace-nowrap',
    //w-40
  };

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-70' : '';

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabledClasses}`;

  return (
    <button type="button" onClick={onClick} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
