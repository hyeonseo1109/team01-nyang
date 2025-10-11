import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFortune } from '../api/external';
import { useAuth } from '../store/useAuth';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TodayFortune() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useAuth();

  const { data: raw, isLoading, isError, error } = useFortune();

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['fortune'] });
    }, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [queryClient]);

  if (userLoading) return <div className="text-neutral-400">로그인 정보 확인 중...</div>;

  const data = raw?.data ?? raw;
  const birthdate = data?.birthday || user?.birthdate;
  const fortune = data?.fortune;
  const created_at = data?.generated_at || data?.created_at;

  let luckStars = 3;
  if (fortune) {
    const positiveWords = ['좋', '행운', '성공', '긍정', '기쁨', '원활', '기대', '행복', '성취'];
    const negativeWords = ['주의', '조심', '불운', '피로', '지출', '문제', '위험', '실수'];
    let score = 3;

    positiveWords.forEach((word) => {
      if (fortune.includes(word)) score += 0.5;
    });
    negativeWords.forEach((word) => {
      if (fortune.includes(word)) score -= 0.5;
    });

    luckStars = Math.min(Math.max(Math.round(score), 1), 5);
  }

  if (isError) {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    if (status === 400 && code === 'INVALID_DATE') {
      return (
        <div className="flex flex-col gap-3 items-center justify-center h-full text-neutral-400 text-center px-6">
          <p>생일 정보가 없어 운세를 보여드릴 수 없어요.</p>
          <p>마이페이지에서 생일을 등록한 후 다시 시도해 주세요.</p>
        </div>
      );
    }

    if (status === 401) {
      return <div className="text-red-400">로그인이 필요합니다. 다시 로그인해 주세요.</div>;
    }

    return (
      <div className="text-red-400">
        운세 불러오기 실패 ({error?.response?.data?.message || error?.message})
      </div>
    );
  }

  if (isLoading) return <div className="text-neutral-400">오늘의 운세를 불러오는 중...</div>;
  if (!data || !fortune) return <div className="text-neutral-400">운세 정보가 없습니다.</div>;

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 text-neutral-100">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          생일:{' '}
          {birthdate && dayjs(birthdate).isValid()
            ? dayjs(birthdate).format('YYYY.MM.DD')
            : '미입력'}
        </span>

        <span className="text-yellow-400 mr-8 whitespace-nowrap">
          행운 지수:&nbsp;{'⭐'.repeat(luckStars)}
          {'☆'.repeat(5 - luckStars)}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-auto custom-scroll rounded-2xl border border-neutral-700 bg-neutral-900/70 p-6 shadow-md">
        <h3 className="text-2xl font-semibold text-blue-400 mb-4">🌟 오늘의 운세</h3>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: (props) => (
              <p
                className="text-base leading-relaxed text-neutral-200 whitespace-pre-line mb-3"
                {...props}
              />
            ),
            strong: (props) => <strong className="text-blue-300 font-semibold" {...props} />,
            ul: (props) => (
              <ul className="list-disc list-inside text-neutral-200 space-y-1 mb-3" {...props} />
            ),
            li: (props) => <li className="ml-2 text-neutral-300" {...props} />,
          }}
        >
          {fortune}
        </ReactMarkdown>
      </div>

      <p className="text-xs text-neutral-500 text-right">
        업데이트:{' '}
        {created_at && dayjs(created_at).isValid()
          ? dayjs(created_at).format('YYYY.MM.DD HH:mm')
          : '-'}
      </p>
    </div>
  );
}
