import Label from './common/Label';
import { useDeleteMyAccount } from '../../api/users';
import { useLogout } from '../../api/auth';

export default function Leave({ onCancel }) {
  const { deleteMyAccountMutate } = useDeleteMyAccount();
  const { logoutMutate } = useLogout();

  return (
    <div className="space-y-3">
      <Label>회원탈퇴</Label>
      <div className="rounded-xl p-3 text-sm text-green-100 bg-green-900/40">
        보내기는 싫지만… 가신다면 어쩔 수 없죠… 정말 떠나실건가요?
      </div>
      <div className="flex gap-2 justify-end">
        <button className="btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          onClick={() => {
            deleteMyAccountMutate(undefined, {
              onSettled: () => {
                logoutMutate();
                window.location.href = '/';
              },
            });
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
