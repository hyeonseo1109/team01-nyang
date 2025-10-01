import { useState, useEffect } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보를 지원하지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        console.log('현재 위치:', coords);
        setLocation(coords);
      },
      (err) => {
        console.error('위치 가져오기 실패:', err);
        setError(err.message);
      },
    );
  }, []);

  return { location, error };
}
