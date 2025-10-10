// src/Mypage/features/Profile.jsx
import fallbackAvatar from '../../../assets/ProfileNormal.jpg';

export default function Profile({ username, email, birthday, image }) {
  const name = username || '';
  const mail = email || '';
  const bday = birthday || '';
  const img = image || fallbackAvatar;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <img
        src={img}
        alt="profile"
        className="w-20 h-20 rounded-full object-cover border border-white/10 bg-white"
      />
      <div>
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm text-neutral-300">{mail}</div>
        <div className="text-sm text-neutral-400 mt-1"> 생일 : {bday || '-'}</div>
      </div>
    </div>
  );
}
