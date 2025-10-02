import { useBriefings } from '../../api/external';

export default function Briefing() {
  const { briefingsData, briefingsIsLoading, briefingsIsError, error } = useBriefings();

  if (briefingsIsLoading) {
    return <p className="text-sm text-neutral-400">브리핑 불러오는 중...</p>;
  }

  if (briefingsIsError) {
    return (
      <p className="text-sm text-red-400">
        브리핑 불러오기 실패 ({error?.response?.data?.message || error?.message})
      </p>
    );
  }

  if (!briefingsData || !briefingsData.summary) {
    return <p className="text-sm text-neutral-400">브리핑 데이터가 없습니다.</p>;
  }

  const typeLabel =
    briefingsData.type === 'morning'
      ? '아침 브리핑'
      : briefingsData.type === 'afternoon'
        ? '점심 브리핑'
        : briefingsData.type === 'evening'
          ? '저녁 브리핑'
          : '브리핑';

  return (
    <div className="w-full">
      <div className="mb-3">
        <span className="px-3 py-1 rounded-lg bg-[#2d5b81] text-white text-sm font-medium">
          {typeLabel}
        </span>
      </div>

      <p className="whitespace-pre-line">{briefingsData.summary}</p>
    </div>
  );
}
