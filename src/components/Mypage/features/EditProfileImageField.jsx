// src/Mypage/features/EditProfileImageField.jsx
import Label from '../common/Label';

export default function EditProfileImageField({
  value,
  onChangeValue,
  onPreview,
  onApply,
  saving,
}) {
  function handleFile(e) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPreview?.(url);
    onChangeValue(url);
  }

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-2 overflow-x-hidden">
      <Label>프로필 이미지</Label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input min-w-0 flex-1"
          value={value}
          placeholder="https://..."
          onChange={(e) => onChangeValue(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <input
          id="profile-file"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
        <label htmlFor="profile-file" className="btn cursor-pointer w-full sm:w-auto">
          파일선택
        </label>

        <button
          className="btn inline-flex items-center h-10 px-4 whitespace-nowrap cursor-pointer max-w-full"
          onClick={onApply}
          disabled={saving}
        >
          적용
        </button>
      </div>
    </div>
  );
}
