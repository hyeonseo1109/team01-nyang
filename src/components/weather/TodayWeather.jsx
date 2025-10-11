import { useEffect, useState } from 'react';
import { weatherIconMap, mapIconCode } from '../../utils/weatherIcons';
import { useWeather, patchUserLocation } from '../../api/external';
import { DEFAULT_LOCATION } from './location';
import { getKoreanCityName } from '../../utils/weatherCityMap';

export default function TodayWeather() {
  const [coords, setCoords] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      setCoords({ lat, lon });
      try {
        await patchUserLocation(lat, lon);
      } catch (err) {
        console.warn('위치 정보 서버 저장 실패:', err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
        () => {
          console.log('위치 권한 거부 → 기본값(서울) 사용');
          setCoords(DEFAULT_LOCATION);
        },
      );
    } else {
      console.log('Geolocation 미지원 → 기본값(서울) 사용');
      setCoords(DEFAULT_LOCATION);
    }
  }, []);

  const { data: d, isLoading, isError, error: apiError } = useWeather(coords);

  if (isLoading)
    return (
      <div className="text-neutral-400 flex items-center justify-center h-full">
        🌤️ 날씨 불러오는 중...
      </div>
    );

  if (isError)
    return (
      <div className="text-red-400 text-center p-4">
        ❌ 날씨 불러오기 실패
        <br />
        {apiError?.response?.data?.message || apiError?.message}
      </div>
    );

  if (!d) return <div className="text-neutral-400 text-center">날씨 정보가 없습니다.</div>;

  const Icon = weatherIconMap[mapIconCode(d.weather_icon || '')] || weatherIconMap.cloudy;
  const cityName = getKoreanCityName(d.city);

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scroll">
        <div className="w-full h-full p-3 grid grid-rows-[1fr_auto] gap-4">
          <div className="flex flex-col lg:flex-row items-center gap-3 min-w-0 transition-all duration-300 ease-in-out">
            <div className="relative shrink-0">
              <Icon className="w-28 sm:w-32 h-auto text-blue-300" strokeWidth={1.5} />
            </div>

            <div className="lg:ml-auto pr-1 flex flex-col items-end justify-center flex-shrink min-w-0">
              <div className="font-extrabold leading-none text-[clamp(1.5rem,5vw,3.5rem)] truncate">
                {d.current_temp ?? '-'}°
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 mt-1 text-right whitespace-nowrap">
                <span className="text-red-400 font-bold">최고 {d.max_temp ?? '-'}°</span> /{' '}
                <span className="text-blue-400 font-bold">최저 {d.min_temp ?? '-'}°</span>
              </div>
              <div className="text-sm text-neutral-400 mt-1">{cityName}</div>
              <div className="text-sm text-neutral-400">{d.description ?? '-'}</div>
            </div>
          </div>

          <div
            className="transition-all duration-500 ease-in-out 
    max-h-none opacity-100 overflow-visible 
    lg:max-h-screen lg:opacity-100 lg:grid 
    grid-cols-3 gap-3"
          >
            {[
              { k: '습도', v: d.humidity != null ? `${d.humidity}%` : '-' },
              { k: '강수량', v: d.precipitation != null ? `${d.precipitation} mm` : '-' },
              { k: '미세먼지', v: d.pm10 != null ? `${d.pm10} ㎍/m³` : '-' },
            ].map((it) => (
              <div
                key={it.k}
                className="rounded-xl bg-neutral-800/70 border border-neutral-700 px-2 py-2 flex flex-col items-center justify-center"
              >
                <div className="text-[12px] text-neutral-400">{it.k}</div>
                <div className="text-sm font-semibold leading-tight">{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
