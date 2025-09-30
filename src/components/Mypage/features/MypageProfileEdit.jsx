import { useEffect, useRef, useState } from 'react';
import EditNicknameField from './EditNicknameField';
import EditBirthdateField from './EditBirthdateField';
import EditProfileImageField from './EditProfileImageField';
// import ApplyAllRow from './ApplyAllRow';
import { useUpdateMyProfile, useDeleteMyAccount } from '../../../api/users';

export default function MypageProfileEdit({ me, onChange, onLogout, onNotify }) {
  const nameRef = useRef(null);
  const { updateMyProfileMutate } = useUpdateMyProfile();
  const { deleteMyAccountMutate } = useDeleteMyAccount();

  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (me) {
      setUsername(me.username || '');
      setBirthdate(me.birthdate || '');
      setProfileImage(me.profile_image || '');
    }
  }, [me]);

  useEffect(() => {
    if (nameRef.current && nameRef.current.focus) {
      nameRef.current.focus();
    }
  }, []);

  async function safeUpdate(payload, okMsg) {
    setSavingProfile(true);
    updateMyProfileMutate(payload, {
      onSuccess: (next) => {
        if (onChange) onChange(next);
        if (onNotify) onNotify(okMsg, '완료');
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || err?.message || '오류가 발생했습니다.';
        if (onNotify) onNotify(msg, '오류');
      },
      onSettled: () => setSavingProfile(false),
    });
  }

  const applyNickname = () => safeUpdate({ username }, '닉네임이 적용되었습니다.');
  const applyBirthdate = () => safeUpdate({ birthdate }, '생년월일이 적용되었습니다.');
  const applyImage = () => safeUpdate({ profile_image: profileImage }, '이미지가 적용되었습니다.');
  // const applyAll = () =>
  //   safeUpdate({ username, birthdate, profile_image: profileImage }, '프로필이 적용되었습니다.');

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

      {/* <ApplyAllRow onApplyAll={applyAll} saving={savingProfile} /> */}

      <div className="flex items-center justify-between gap-2">
        <button
          className="btn-secondary bg-red-900/40 hover:bg-red-900/60 border-red-500/30"
          type="button"
          onClick={() =>
            deleteMyAccountMutate(undefined, {
              onSuccess: () => {
                if (onNotify) onNotify('회원탈퇴가 완료되었습니다.', '완료');
                if (onLogout) onLogout();
              },
              onError: (err) => {
                const msg = err?.response?.data?.message || err?.message || '탈퇴에 실패했습니다.';
                if (onNotify) onNotify(msg, '오류');
              },
            })
          }
        >
          회원탈퇴
        </button>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => handleLogout()} type="button">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
