// src/components/Mypage/features/MypageHeaderBar.jsx
import Profile from './Profile';

export default function MypageHeaderBar({
  title,
  onClose,
  showBack,
  onBack,
  username,
  email,
  birthday,
  image,
}) {
  let leftArea = <div className="w-[72px]" />;
  if (showBack) {
    leftArea = (
      <button className="btn-secondary" type="button" onClick={onBack}>
        뒤로
      </button>
    );
  }

  const showProfile = Boolean(username || email || birthday || image);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {leftArea}
        <button className="btn-secondary" type="button" onClick={onClose}>
          닫기
        </button>
      </div>
      <div className="flex items-center justify-center">
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
      </div>
      {showProfile && (
        <div>
          <div className="border-t border-white/10" />
          <div className="h-3" aria-hidden="true" />
          <Profile username={username} email={email} birthday={birthday} image={image} />
          <div className="h-3" aria-hidden="true" />
          <div className="border-b border-white/10" />
        </div>
      )}
    </div>
  );
}
