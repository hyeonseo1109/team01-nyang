import Button from "../components/ui/Button";

export function Login() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="h-16 bg-slate-900 text-white flex items-center px-6">
        <h1 className="text-lg font-medium"></h1>
      </header>

      <main className="flex-1 bg-slate-100 p-4">
        <div className="h-full grid grid-cols-[3fr_1fr] gap-4">
          <div className="grid grid-rows-[1fr_2fr] gap-4">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700">뉴스</span>
              </div>
              <div className="bg-white rounded-lg p-6 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-700">날씨</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 flex items-center justify-center">
              <span className="text-xl font-medium text-slate-700">메인</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 bg-blue-600 rounded-lg p-6 items-center justify-center">
            {/* <span className="text-lg font-medium text-white "> */}
              <Button size="md" variant="common">Todo List</Button>
              <Button size="md" variant="common">일정 리스트</Button>
              <Button size="md" variant="common">5일 날씨</Button>
              <Button size="md" variant="common">오늘의 운세</Button>
              <Button size="md" variant="common">QUIZ</Button>
              <Button size="md" variant="common">푸쉬 설정</Button>
            {/* </span> */}
          </div>
        </div>
      </main>
    </div>
  );
}

