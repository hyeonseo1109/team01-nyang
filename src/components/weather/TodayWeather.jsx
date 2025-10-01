import { weatherIconMap, mapIconCode } from '../../utils/weatherIcons';
import useLocation from '../../hook/useLocation';
import { useTodayWeather } from '../../api/external';
import { DEFAULT_LOCATION } from './location';

export default function TodayWeather() {
  const { location, error } = useLocation();
  const coords = location || DEFAULT_LOCATION;

  const { data: d, isLoading, isError, error: apiError } = useTodayWeather(coords);

  if (isLoading) return <div className="text-neutral-400">날씨 불러오는 중...</div>;
  if (isError)
    return (
      <div className="text-red-400">
        날씨 불러오기 실패 ({apiError?.response?.data?.message || apiError?.message})
      </div>
    );
  if (!d) return <div className="text-neutral-400">날씨 정보가 없습니다.</div>;

  const iconKey = mapIconCode(d?.weather_icon || '');
  const Icon = weatherIconMap[iconKey] || weatherIconMap.cloudy;

  return (
    <div className="flex flex-col gap-4 h-full">
      {error && (
        <div className="text-neutral-400 text-sm">
          현재 위치 확인이 어려워 서울 날씨로 대신합니다.
        </div>
      )}

      <div className="flex items-center gap-3">
        <Icon className="w-20 h-20 text-blue-300" strokeWidth={1.5} />
        <div className="ml-auto text-right">
          <div className="text-4xl font-bold">{d?.current_temp ?? '-'}°</div>
          <div className="text-sm text-neutral-400">
            최고 {d?.max_temp ?? '-'}° / 최저 {d?.min_temp ?? '-'}°
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <InfoCard label="습도" value={d?.humidity != null ? `${d.humidity}%` : '-'} />
        <InfoCard label="강수량" value={d?.precipitation != null ? `${d.precipitation}mm` : '-'} />
        <InfoCard label="미세먼지" value={d?.pm10 != null ? `${d.pm10}㎍/m³` : '-'} />
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-neutral-800/70 border border-neutral-700 px-2 py-2 flex flex-col items-center">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
