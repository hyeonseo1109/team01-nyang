import dayjs from 'dayjs';
import { fiveDayWeatherDummy } from '../../api/dummyData/dummyWeather';
import { weatherIconMap, mapDescription } from '../../utils/weatherIcons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  annotationPlugin,
);

export default function FiveDayWeather() {
  const data = fiveDayWeatherDummy;

  // 라벨 & 데이터 준비
  const labels = data.map((d) => dayjs(d.date).format('MM/DD'));
  const maxTemps = data.map((d) => d.temp_max);
  const minTemps = data.map((d) => d.temp_min);

  const chartData = {
    labels,
    datasets: [
      {
        label: '최고 기온',
        data: maxTemps,
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        tension: 0.3,
        pointBackgroundColor: '#f87171',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
      },
      {
        label: '최저 기온',
        data: minTemps,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        tension: 0.3,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
      },
    ],
  };

  const annotations = {};
  for (let i = 1; i < labels.length; i++) {
    if (i < labels.length) {
      annotations[`divider${i}`] = {
        type: 'line',
        xMin: i - 0.5,
        xMax: i - 0.5,
        borderColor: 'rgba(64,64,64,0.5)',
        borderWidth: 1,
      };
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 20 } },
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'bottom',
        offset: 15,
        clip: false,
        font: { weight: 'bold', size: 14 },
        formatter: (value) => `${value}°`,
      },
      annotation: {
        annotations,
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: { display: false },
        grid: { display: false },
      },
      y: { display: false },
    },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full max-w-[800px]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 border-r border-neutral-700/50 last:border-r-0">
            <WeatherCard d={d} />
          </div>
        ))}
      </div>

      <div className="w-full max-w-[815px] h-[250px] mt-0">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

function WeatherCard({ d }) {
  const iconKey = mapDescription(d.description);
  const Icon = weatherIconMap[iconKey] || weatherIconMap.cloudy;
  const date = dayjs(d.date).format('MM/DD (ddd)');

  return (
    <div className="flex flex-col items-center text-center text-sm py-1">
      <div className="font-semibold text-neutral-200">{date}</div>
      <Icon className="w-8 h-8 my-1 text-blue-300" strokeWidth={1.5} />
      <div className="text-neutral-300 text-xs">{d.description}</div>
      <div className="text-xs text-red-400 font-bold">{d.temp_max}°</div>
      <div className="text-xs text-blue-400 font-bold">{d.temp_min}°</div>
      <div className="text-[11px] text-neutral-400 mt-1">
        습도 {d.humidity}% <br /> 강수 {d.precipitation}mm
      </div>
    </div>
  );
}
