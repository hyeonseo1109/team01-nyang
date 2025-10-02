// src/Mypage/features/EditBirthdateField.jsx
import { useMemo } from 'react';
import Label from '../common/Label';

export default function EditBirthdateField({ value, onChangeValue, onApply, saving }) {
  const today = useMemo(() => {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
  }, []);

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-2 overflow-x-hidden">
      <Label>생년월일</Label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          className="input text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 min-w-0 flex-1"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          min="1900-01-01"
          max={today}
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
