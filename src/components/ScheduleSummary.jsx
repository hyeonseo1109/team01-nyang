import { useEffect, useState } from 'react';
// import { useConversations } from '../api/external';
import { conversationsData } from '../api/dummyData/dummySummary';

export default function ScheduleSummary() {
  // const { conversationsData, conversationsIsLoading, conversationsIsError } = useConversations();
  // api 현재 500에러, 복구 시 윗 줄 주석 해제, 아래 두 줄 삭제
  const [conversationsIsLoading] = useState(false);
  const [conversationsIsError] = useState(false);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log(conversationsData);
  }, [page]);

  return (
    <>
      <div className="w-full h-auto justify-center items-center border border-[#444] px-3 py-5 rounded-xl select-none break-keep text-light">
        {/* {conversationsData.data.summary[page]} */}
        {conversationsIsLoading
          ? '로딩 중입니다.'
          : conversationsIsError
            ? '에러 발생'
            : conversationsData.data.summary[page]}
      </div>
    </>
  );
}
