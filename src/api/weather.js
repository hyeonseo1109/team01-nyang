import { api } from './client';

// 오늘 날씨
export async function getTodayWeather(lat, lon) {
  const res = await api.get('/weather', { params: { lat, lon } });
  console.log('오늘날씨 응답:', res.data); // ✅ JSON 나오는지 확인
  return res.data;
}

// 5일 날씨
export async function getFiveDayWeather(lat, lon) {
  try {
    const res = await api.get('/weather/forecast', { params: { lat, lon } });
    console.log('5일날씨 응답:', res.data);
    return res.data;
  } catch (err) {
    console.error('5일날씨 요청 실패:', err);
    throw err;
  }
}
