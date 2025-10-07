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
  const { usersData } = useUsers();

  // 일주일치 담은 배열
  const weekWhile = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().slice(0, 10);
  });

  // 그날그날 전체회원수
  const totalUserCounts = Array.from({ length: 7 }, (_, i) => {
    return usersData?.users.filter((user) => user.created_at.slice(0, 10) <= weekWhile[i]).length;
  });

  // 그날그날 신규회원수
  const weekUser = Array.from({ length: 7 }, (_, i) => {
    return usersData?.users.filter((user) => user.created_at.slice(0, 10) === weekWhile[i]).length;
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
        <div className="flex items-start h-full">
          <h2 className="text-lg font-bold w-full [word-break:keep-all]">유저 가입 현황</h2>
        </div>

        <div className="flex flex-col items-center justify-center h-full w-full">
          <Chart type="bar" data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
