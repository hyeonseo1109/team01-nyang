import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFortune } from '../api/external';
import { useAuth } from '../store/useAuth';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function TodayFortune() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const birthdate = user?.birthdate;

  const { data: fortuneData, isLoading, isError, error } = useFortune(birthdate);

  useEffect(() => {
    if (!birthdate) return;
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['fortune', birthdate] });
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [birthdate, queryClient]);

  const labels = {
    general: '🌟 전체 운세',
    study: '📚 일/학업',
    money: '💰 금전',
    love: '💕 연애',
    health: '🩺 건강',
    advice: '✨ 오늘의 한 줄 조언',
  };

  if (!birthdate) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-full text-neutral-400">
        <p>생일 정보가 없습니다. 마이페이지에서 등록해주세요.</p>
        <button
          onClick={() => navigate('/mypage')}
          className="px-3 py-1.5 rounded-lg bg-[#2d5b81] hover:bg-[#1b4567] text-xs font-medium text-white transition-colors"
        >
          마이페이지로 이동
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="text-neutral-400">오늘의 운세를 불러오는 중...</div>;
  if (isError)
    return (
      <div className="text-red-400">
        운세 불러오기 실패 ({error?.response?.data?.message || error?.message})
      </div>
    );
  if (!fortuneData) return <div className="text-neutral-400">운세 정보가 없습니다.</div>;

  const { fortune, created_at } = fortuneData;

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 text-neutral-100">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          생일: {dayjs(birthdate).isValid() ? dayjs(birthdate).format('YYYY.MM.DD') : '미입력'}
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-auto custom-scroll rounded-xl bg-neutral-900/60 border border-neutral-700 p-5 space-y-4">
        {Object.entries(fortune).map(([key, value]) => (
          <div key={key}>
            <span className="block font-semibold text-blue-400 mb-1">{labels[key]}</span>
            <p className="text-sm leading-relaxed text-neutral-200">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-500 text-right">
        업데이트: {dayjs(created_at).isValid() ? dayjs(created_at).format('YYYY.MM.DD HH:mm') : '-'}
      </p>
    </div>
  );
}
