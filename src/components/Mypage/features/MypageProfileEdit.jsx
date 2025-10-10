import { useEffect, useRef, useState } from 'react';
import EditNicknameField from './EditNicknameField';
import EditBirthdateField from './EditBirthdateField';
import EditProfileImageField from './EditProfileImageField';

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

  const [_, setShowLeave] = useState(false);

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
        const merged = { ...(me || {}), ...(next || {}) };
        if (payload && 'birthday' in payload) {
          merged.birthday = payload.birthday; // YYYY-MM-DD 보장
        }
        onChange?.(merged);
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
  const applyBirthdate = () => safeUpdate({ birthdate }, '생년월일이 적용되었습니다.');

  const handleImageApplied = (newImageUrl) => {
    setProfileImage(newImageUrl); // state 업데이트
    if (onChange) {
      // 전체 user 객체 업데이트
      onChange({ ...me, profile_image: newImageUrl });
    }
    if (onNotify) {
      onNotify('프로필 이미지가 변경되었습니다.', '완료');
    }
  };

  const handleImagePreview = (previewUrl) => {
    setProfileImage(previewUrl); // 임시로 미리보기 표시
  };

  return (
    <div className="space-y-2 text-white">
      <EditProfileImageField
        value={profileImage}
        onPreview={handleImagePreview}
        onApply={handleImageApplied}
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
