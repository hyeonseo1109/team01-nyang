import { useState } from 'react';
import { useNews } from '../api/external';

const CATEGORY_LABELS = {
  politics: '정치',
  economy: '경제',
  society: '사회',
  life_culture: '사회/문화',
  it_science: 'IT/과학',
  world: '세계',
};

export default function News() {
  const [category, setCategory] = useState('life_culture');
  const { newsData = {}, newsIsLoading, newsIsError, newsError } = useNews(category);

  const newsList = Array.isArray(newsData.data) ? newsData.data : [];
  const limitedNews = newsList.slice(0, 6);

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">뉴스</h2>
        <div className="flex-1 ml-3 overflow-x-auto custom-scroll">
          <div className="flex gap-2 w-max">
            {Object.keys(CATEGORY_LABELS).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  cat === category
                    ? 'bg-[#2d5b81] hover:bg-[#1b4567]'
                    : 'bg-neutral-700 hover:bg-neutral-800'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {newsIsLoading ? (
        <p className="text-sm text-neutral-400">뉴스를 불러오는 중...</p>
      ) : newsIsError ? (
        <p className="text-sm text-red-400">
          뉴스 불러오기 실패 ({newsError?.response?.data?.message || newsError?.message})
        </p>
      ) : limitedNews.length === 0 ? (
        <p className="text-sm text-neutral-400">
          {CATEGORY_LABELS[category]} 뉴스 정보가 없습니다.
        </p>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto custom-scroll">
          <ul className="space-y-2">
            {limitedNews.map((news, idx) => (
              <li
                key={`${news.url}-${idx}`}
                className="rounded-lg bg-neutral-800/60 px-3 py-2 hover:bg-neutral-700 transition-colors"
              >
                <a
                  href={news.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-neutral-100 hover:text-[#417eb0]"
                >
                  {news.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
