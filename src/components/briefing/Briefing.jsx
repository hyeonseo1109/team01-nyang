import { useBriefings } from '../../api/external';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';

export default function Briefing() {
  const { data, isLoading, isError, error } = useBriefings();

  if (isLoading) return <p className="text-sm text-neutral-400">브리핑 불러오는 중...</p>;

  if (isError)
    return (
      <p className="text-sm text-red-400">
        브리핑 불러오기 실패 ({error?.response?.data?.message || error?.message})
      </p>
    );

  if (!data?.briefing)
    return <p className="text-sm text-neutral-400">현재 시간대에 맞는 브리핑 데이터가 없습니다.</p>;

  const { period, type, briefing, generated_at } = data;
  const typeLabel = `${period || type || '일일'} 브리핑`;

  const cleanedBriefing = briefing.replace(/^#{1,3}\s*(아침|점심|저녁)\s*브리핑\s*/i, '').trim();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 rounded-lg bg-[#2d5b81] text-white text-sm font-medium">
          {typeLabel}
        </span>
        <span className="text-xs text-neutral-500">
          {generated_at && dayjs(generated_at).isValid()
            ? dayjs(generated_at).format('YYYY.MM.DD HH:mm')
            : '-'}
        </span>
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (props) => (
            <p
              className="text-sm leading-relaxed text-neutral-200 whitespace-pre-line mb-3"
              {...props}
            />
          ),
          strong: (props) => <strong className="text-blue-300 font-semibold" {...props} />,
        }}
      >
        {cleanedBriefing}
      </ReactMarkdown>
    </div>
  );
}
