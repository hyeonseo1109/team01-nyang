import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useUsers } from '../../api/admin';
import { IoMdRefresh } from 'react-icons/io';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export function AdminNewUpdate() {
  const { usersData, refetch } = useUsers();

  console.log('🔍 전체 usersData:', usersData);
  console.log('🔍 오늘 날짜 (로컬):', getKSTDateString(0));
  console.log(
    '🔍 유저들 created_at 샘플:',
    usersData?.users.slice(0, 3).map((u) => u.created_at),
  );

  function getKSTDateString(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function convertUTCtoKSTDate(utcString) {
    const date = new Date(utcString);
    // 한국 시간으로 변환된 날짜 문자열 추출
    const kstDate = date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '-')
      .replace('.', '');

    return kstDate; // "2025-10-11" 형식
  }

  // 일주일치 담은 배열
  const weekWhile = Array.from({ length: 7 }, (_, i) => {
    return getKSTDateString(6 - i);
  });

  // 그날그날 전체회원수
  const totalUserCounts = Array.from({ length: 7 }, (_, i) => {
    return usersData?.users.filter((user) => convertUTCtoKSTDate(user.created_at) <= weekWhile[i])
      .length;
  });

  // 그날그날 신규회원수
  const weekUser = Array.from({ length: 7 }, (_, i) => {
    return usersData?.users.filter((user) => convertUTCtoKSTDate(user.created_at) === weekWhile[i])
      .length;
  });

  const week = weekWhile.map((day) => day.split(/-/).slice(1).join('/'));

  const chartData = {
    labels: week,
    datasets: [
      {
        type: 'line',
        label: '신규 회원',
        data: weekUser,
        borderColor: '#00a8ca',
        backgroundColor: '#009cbb',
        borderWidth: 1,
        tension: 0,
      },
      {
        type: 'bar',
        label: '전체 회원',
        data: totalUserCounts,
        backgroundColor: '#2e5b81',
        borderColor: '#204a6b',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        align: 'end',
        labels: {
          color: '#fff',
          boxWidth: 12,
          padding: 10,
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#333' },
      },
    },
  };

  return (
    <div className="flex  overflow-x-hidden overflow-y-hidden w-full h-full">
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex flex-col items-start h-full lg:gap-2">
          <h2 className="text-lg font-bold w-full [word-break:keep-all]">유저 가입 현황</h2>
          <IoMdRefresh size={24} onClick={() => refetch()} />
        </div>

        <div className="flex flex-col items-center justify-center h-full w-full">
          <Chart type="bar" data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
