import { useState } from 'react';
import { useQuiz } from '../../api/external';
import { IoMdRefresh } from 'react-icons/io';

export function Quiz() {
  const [selectOption, setSelectOption] = useState();
  const [message, setMessage] = useState('과연 정답은?');

  const { quizData, quizIsLoading, quizIsError, refetch } = useQuiz();
  if (quizIsLoading) return <div>로딩 중</div>;
  if (quizIsError) return <div>에러</div>;
  const data = quizData?.data;

  const handleBack = (idx) => {
    // 아무것도 선택 안 했을 때
    if (selectOption === undefined) {
      return 'bg-[#2d5b81] hover:bg-[#1b4567] cursor-pointer';
    }
    // 선택한 옵션만 색상 변경
    if (selectOption === idx) {
      return data.options[idx] === data.answer
        ? 'bg-[#379e3b] hover:bg-[#267c29] cursor-pointer'
        : 'bg-[#bf4b4b] hover:bg-[#a73939] cursor-pointer';
    }
    // 선택되지 않은 나머지 옵션들은 회색
    return 'bg-[#333] hover:bg-[#222] cursor-pointer';
  };

  const handleOptionClick = (idx) => {
    setSelectOption(idx);
    if (data.options[idx] === data.answer) {
      setMessage('정답입니다!');
    } else {
      setMessage('아쉽지만 오답이네요.. 다른 답을 골라볼까요?');
    }
  };

  const handleRefresh = () => {
    setSelectOption(undefined);
    setMessage('과연 정답은?');
    refetch();
  };

  return (
    <>
      <div className="flex justify-between w-full h-full items-center">
        <div className="flex flex-col w-full h-[70%] items-center   justify-around gap-10 lg:gap-0">
          <div className="flex gap-2 items-center">
            <h1 className="text-[1.4rem] font-semibold select-none break-keep lg:text-[1.8rem]">
              {data.question}
            </h1>
            <span onClick={handleRefresh}>
              <IoMdRefresh size={24} />
            </span>
          </div>

          <div className="flex flex-col gap-10 items-center justify-center">
            <div className="flex flex-col justify-around w-full select-none lg:flex-row gap-7 items-center ">
              {data.options.map((option, idx) => (
                <p
                  key={idx}
                  className={`shadow-3d rounded-2xl px-5 py-1 text-[1.4rem] text-center max-w-[14rem] min-w-[7rem] transition-colors ${handleBack(idx)}
                  `}
                  onClick={() => handleOptionClick(idx)}
                >
                  {option}
                </p>
              ))}
            </div>

            <p className="text-[1.2rem] text-[#999] mb-10 lg:mb-0">{message}</p>
          </div>
        </div>
      </div>
    </>
  );
}
