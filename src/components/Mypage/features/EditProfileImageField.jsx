import { getPresignedUrl, uploadToS3 } from '../../../api/presignedURL';
import { updateProfileImage } from '../../../api/users';
import { useState } from 'react';
import Label from '../common/Label';

export default function EditProfileImageField({ value, onPreview, onApply, saving }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    onPreview?.(url);
  };

  const handleApply = async () => {
    if (!selectedFile) return;

    try {
      const { upload_url, file_url } = await getPresignedUrl(selectedFile.name, selectedFile.type);
      await uploadToS3(upload_url, selectedFile);
      await updateProfileImage(file_url);
      onApply?.(file_url);
    } catch (e) {
      console.error('업로드 실패:', e);
      alert('업로드에 실패했습니다.');
    }
  };

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-2 overflow-x-hidden">
      <Label>프로필 이미지</Label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input flex-1 min-w-0"
          value={value || previewUrl}
          placeholder="https://..."
          readOnly
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
          onClick={handleApply}
          disabled={saving}
        >
          적용
        </button>
      </div>
    </div>
  );
}
