import { useEffect, useRef, useState } from 'react';
import EditNicknameField from './EditNicknameField';
import EditBirthdateField from './EditBirthdateField';
import EditProfileImageField from './EditProfileImageField';
import Leave from '../Leave';

import { useUpdateMyProfile, useDeleteMyAccount } from '../../../api/users';
import { useUser } from '../../../store/useUser';
import { useLogout } from '../../../api/auth';

export default function MypageProfileEdit({ me, onChange, onNotify }) {
  const nameRef = useRef(null);
  const { updateMyProfileMutate } = useUpdateMyProfile();
  useDeleteMyAccount();

  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [showLeave, setShowLeave] = useState(false);

  useEffect(() => {
    if (me) {
      setUsername(me.username || '');
      setBirthdate(me.birthday || '');
      setProfileImage(me.profile_image || '');
    }
  }, [me]);

  useEffect(() => {
    nameRef.current?.focus?.();
  }, []);

  const { clearUser } = useUser();
  const { logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        clearUser();
      },
      onError: () => {
        alert('오류');
      },
    });
  };

  const safeUpdate = (payload, okMsg) => {
    setSavingProfile(true);
    updateMyProfileMutate(payload, {
      onSuccess: (next) => {
        onChange?.(next);
        onNotify?.(okMsg, '완료');
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || err?.message || '오류가 발생했습니다.';
        onNotify?.(msg, '오류');
      },
      onSettled: () => setSavingProfile(false),
    });
  };

  const applyNickname = () => safeUpdate({ username }, '닉네임이 적용되었습니다.');
  const applyBirthdate = () => safeUpdate({ birthday: birthdate }, '생년월일이 적용되었습니다.');
  const applyImage = () => safeUpdate({ profile_image: profileImage }, '이미지가 적용되었습니다.');

  if (showLeave) {
    return (
      <div className="text-white">
        <Leave onCancel={() => setShowLeave(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-2 text-white">
      <EditProfileImageField
        value={profileImage}
        onChangeValue={setProfileImage}
        onApply={applyImage}
        saving={savingProfile}
      />

      <EditNicknameField
        inputRef={nameRef}
        value={username}
        onChangeValue={setUsername}
        onApply={applyNickname}
        saving={savingProfile}
      />

      <EditBirthdateField
        value={birthdate}
        onChangeValue={setBirthdate}
        onApply={applyBirthdate}
        saving={savingProfile}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          className=" h-5 px-1 whitespace-nowrap sm:shrink-0 cursor-pointer bg-transparent text-xs underline underline-offset-2 decoration-1 text-gray-400 hover:text-gray-200"
          type="button"
          onClick={() => setShowLeave(true)}
        >
          회원탈퇴
        </button>
        <div className="flex flex-wrap items-center gap-2 basis-full justify-end sm:ml-auto">
          <button
            className="btn h-10 px-4 whitespace-nowrap sm:shrink-0"
            onClick={() => handleLogout()}
            type="button"
            disabled={savingProfile}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
