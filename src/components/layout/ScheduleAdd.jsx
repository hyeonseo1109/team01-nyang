export default function ScheduleAdd({ list, onDelete, onEdit }) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {list.length === 0 ? (
        <p className="text-[#555] text-center py-4">등록된 일정이 없습니다.</p>
      ) : (
        <div className="overflow-y-auto custom-scroll space-y-2 flex-1 min-h-0">
          {list.map((item) => (
            <div key={item.id} className="border-b border-[#555] pb-3 w-full">
              <div className="flex flex-col justify-center items-center gap-[-2rem] w-full">
                {/* 날짜묶음 */}
                <div className="flex xl:flex-row flex-col opacity-70">
                  {/* 시작 날짜/시간 */}
                  <div className="flex gap-2 items-center text-[0.8rem]">
                    <span className="font-medium whitespace-nowrap">
                      {item.dateStart &&
                        new Date(item.dateStart)
                          .toLocaleDateString('ko-KR', {
                            month: 'numeric',
                            day: 'numeric',
                          })
                          .replace(/. /, '/')
                          .slice(0, -1)}
                    </span>
                    <span className="whitespace-nowrap">{item.timeStart}</span>
                  </div>
                  <div className="text-center font-semibold -my-2 text-[0.8rem]">~</div>
                  {/* 종료 날짜/시간 */}
                  <div className="flex gap-2 items-center">
                    <span className="font-medium whitespace-nowrap text-[0.8rem]">
                      {item.dateEnd &&
                        new Date(item.dateEnd)
                          .toLocaleDateString('ko-KR', {
                            month: 'numeric',
                            day: 'numeric',
                          })
                          .replace(/. /, '/')
                          .slice(0, -1)}
                    </span>
                    <span className="whitespace-nowrap text-[0.8rem]">{item.timeEnd}</span>
                  </div>
                </div>

                {/* 제목 */}
                <span className="flex justify-center mt-1">{item.title}</span>

                {/* 메모 */}
                {item.memo && <span className="text-[#1b4567] text-mt">{item.memo}</span>}
              </div>

              {/* 수정/삭제 버튼 */}
              <div className="text-xs flex justify-center mt-2 font-semibold text-[#888]">
                <button
                  onClick={() => onEdit(item)}
                  className="hover:text-[#1b4567] mr-3"
                  disabled={item.completed}
                >
                  수정
                </button>
                <span className="mr-3">/</span>
                <button onClick={() => onDelete(item.id)} className="hover:text-red-700">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}