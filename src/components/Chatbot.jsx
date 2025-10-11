import dayjs from 'dayjs';
import { useSchedules } from '../api/schedules';
import { useTodos, useToggleTodoComplete } from '../api/todos';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export default function Chatbot() {
  const {
    schedulesData = [],
    schedulesIsLoading,
    schedulesIsError,
    error: schedulesError,
  } = useSchedules();

  const {
    todoData = { todos: [], total: 0 },
    todoIsLoading,
    todoIsError,
    error: todosError,
  } = useTodos();

  const { toggleTodoCompleteMutate } = useToggleTodoComplete();

  const today = dayjs();
  const todaySchedules =
    schedulesData?.schedules?.filter((item) => {
      const start = dayjs(item.start_time);
      const end = dayjs(item.end_time);
      return (
        today.isSame(start, 'day') ||
        today.isSame(end, 'day') ||
        today.isBetween(start, end, null, '[]')
      );
    }) || [];

  const todos = Array.isArray(todoData?.todos) ? todoData.todos : [];
  const sortedTodos = [
    ...todos.filter((t) => !t.is_completed),
    ...todos.filter((t) => t.is_completed),
  ];

  const toggleTodo = (id, currentState) => toggleTodoCompleteMutate({ id, currentState });

  if (schedulesIsLoading || todoIsLoading)
    return <div className="text-neutral-400">불러오는 중...</div>;

  if (schedulesIsError || todoIsError)
    return (
      <div className="text-red-400">
        데이터 불러오기 실패
        <br />
        {schedulesError?.message || ''} {todosError?.message || ''}
      </div>
    );

  const hasData = sortedTodos.length > 0 || todaySchedules.length > 0;

  if (!hasData) return <div className="text-neutral-400">오늘 일정/할 일 데이터가 없습니다.</div>;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 gap-12 w-full">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">오늘의 Todo</h2>
          {sortedTodos.length ? (
            <ul className="space-y-3 w-[70%]">
              {sortedTodos.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <input
                    id={`todo-${item.id}`}
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={() => toggleTodo(item.id, item.is_completed)}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor={`todo-${item.id}`}
                    className={`text-lg ${item.is_completed && 'line-through'}`}
                  >
                    {item.title}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p>할 일이 없습니다.</p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">오늘의 일정</h2>
          {todaySchedules.length ? (
            <ul className="text-lg space-y-4 w-[70%] pl-6">
              {todaySchedules.map((item) => (
                <li key={item.id} className="flex flex-col">
                  <span className="font-medium">
                    {dayjs(item.start_time).format('YYYY-MM-DD HH:mm')} ~{' '}
                    {dayjs(item.end_time).format('YYYY-MM-DD HH:mm')}
                    {item.all_day && ' [종일]'}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                  {item.memo && <span className="text-sm">{item.memo}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>오늘 일정이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
