import { api } from './client';

// 1. Presigned URL 발급 (client.js에서 만든 axios 인스턴스 활용)
export async function getPresignedUrl(filename, content_type) {
  const res = await api.post('/s3/presigned-url', {
    filename,
    content_type,
  });
  return res.data.data;
}

// 2. S3에 파일 업로드 (별도의 새 axios 인스턴스 활용. content-type을 file로 함.)
export async function uploadToS3(upload_url, file) {
  const response = await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('S3 업로드 실패:', errorText);
    throw new Error(`S3 업로드 실패: ${response.status}`);
  }
}

// 3. 프로필 이미지 URL 저장은 users.js에서 '내 프로필 수정'으로 함.

// 4. 프로필 조회는 users.js에서 '내 프로필 조회'로 함.
