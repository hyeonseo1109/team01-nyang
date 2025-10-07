export default function LoginModal({
  openModal,
  title,
  children,
  onClose,
  modal = '',
  popup = false,
  footer,
}) {
  if (!openModal) return null;

  return (
    <div
      className={
        popup
          ? modal === 'consent'
            ? 'fixed inset-0 bg-white/3 backdrop-blur-md flex items-center justify-center z-51'
            : 'fixed inset-0 bg-white/3 flex items-start justify-center z-51 pt-[3vh]'
          : 'fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50'
      }
      onClick={onClose}
    >
      <div //모달
        className={`bg-[#222222] rounded-[0.7rem] shadow-lg ${modal === 'consent' ? 'w-[500px]' : 'w-[400px]'} p-11`}
        onClick={(e) => e.stopPropagation()}
        //모달 부분은 이벤트를 막아서 모달 창을 누르더라도 종료 안 되게 함.
      >
        {/* 모달 제목 */}
        {title && <h2 className="text-xl font-semibold text-neutral-100 mb-6">{title}</h2>}

        {/* 모달 본문 */}
        <div className="text-neutral-200">{children}</div>

        {/* 확인/취소 버튼 부분 */}
        {footer && <div className="flex justify-end">{footer}</div>}
      </div>
    </div>
  );
}
