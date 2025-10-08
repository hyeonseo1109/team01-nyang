// src/Mypage/features/EditNicknameField.jsx
import Label from '../common/Label';

export default function EditNicknameField({ inputRef, value, onChangeValue, onApply, saving }) {
  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-2 overflow-x-hidden">
      <Label>닉네임</Label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          className="input min-w-0 flex-1"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
        />
        <button
          className="btn h-10 px-4 whitespace-nowrap max-w-full"
          onClick={onApply}
          disabled={saving}
        >
          적용
        </button>
      </div>
    </div>
  );
}
