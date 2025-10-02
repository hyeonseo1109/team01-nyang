import { todayWeatherDummy } from '../../api/dummyData/dummyWeather';

export default function TodayWeather() {
  const d = todayWeatherDummy;
  const iconUrl = `https://openweathermap.org/img/wn/${d.weather_icon}@4x.png`;

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scroll">
        <div className="w-full h-full p-3 grid grid-rows-[1fr_auto] gap-4 ">
          <div className="flex flex-col lg:flex-row items-center gap-3 min-w-0 transition-all duration-300 ease-in-out">
            <div className="relative shrink-0">
              <img src={iconUrl} alt="weather" className="w-28 sm:w-32 h-auto object-contain" />
              <div className="absolute top-1 left-1 text-[11px] px-2 py-0.5 rounded bg-black/50 border border-white/10">
                내 현재 위치
              </div>
            </div>

            <div className="lg:ml-auto pr-1 flex flex-col items-end justify-center flex-shrink min-w-0">
              <div className="font-extrabold leading-none text-[clamp(1.5rem,5vw,3.5rem)] truncate">
                {d.current_temp}°
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 mt-1 text-right whitespace-nowrap">
                <span className="text-red-400 font-bold">최고 {d.max_temp}°</span> /{' '}
                <span className="text-blue-400 font-bold">최저 {d.min_temp}°</span>
              </div>
            </div>
          </div>

          <div
            className="transition-all duration-500 ease-in-out 
    max-h-0 opacity-0 overflow-hidden 
    lg:max-h-screen lg:opacity-100 lg:grid 
    grid-cols-3 gap-3"
          >
            {[
              { k: '습도', v: `${d.humidity}%` },
              { k: '강수량', v: `${d.precipitation} mm` },
              { k: '미세먼지', v: `${d.pm10} ㎍/m³` },
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
