import { useState, useEffect } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setLocation(coords);
      },
      (err) => {
        const errorMessages = {
          1: '위치 권한이 거부되었습니다.',
          2: '위치 정보를 사용할 수 없습니다.',
          3: '위치 요청이 시간 초과되었습니다.',
        };
        setError(errorMessages[err.code] || err.message);
      },
    );
  }, []);

  return { location, error };
}
