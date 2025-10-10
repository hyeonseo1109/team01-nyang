import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const TODOS = 'todos';
const CONVERSATIONS = 'conversations';

// !- - - - 할 일 목록 조회 - - - -
export async function getTodos() {
  // 쿼리: is_completed, schedule_id
  const res = await api.get('/todos');
  return res.data;
}
export function useTodos() {
  const {
    data: todoData,
    isLoading: todoIsLoading,
    isError: todoIsError,
    error: todoError,
    ...rest
  } = useQuery({
    queryKey: [TODOS],
    queryFn: () => getTodos(),
  });
  return { todoData, todoIsLoading, todoIsError, todoError, ...rest };
}
// const { todoData, todoIsError } = useTodos();   :   전체 할일 목록 조회
// -- 꼭 다 가져오지 않아도 됨, 쓰고 싶은 것만 가져와서 쓰면 됨.
// const { todoData } = useTodos({ schedule_id: 5 });    :   5번인 것만 조회
// const { todoData } = useTodos({ is_completed: true });   :   완료한 것만 조회

// !- - - - 할 일 생성 - - - -
export async function createTodo(payload) {
  const res = await api.post('/todos', payload);
  return res.data;
}
export function useCreateTodo() {
  const queryClient = useQueryClient();
  const {
    mutate: createTodoMutate,
    error: createTodoError,
    ...rest
  } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { createTodoMutate, createTodoError, ...rest };
}
// const { createTodoMutate, createTodoError } = useCreateTodo();
// createTodoMutate(form);

// !- - - - 할 일 상세 조회 - - - -
export async function getTodoById(todo_id) {
  const res = await api.get(`/todos/${todo_id}`);
  return res.data;
}
export function useTodo(todo_id) {
  const {
    data: todoByIdData,
    isLoading: todoByIdIsLoading,
    isError: todoByIdIsError,
    error: todoByIdError,
    ...rest
  } = useQuery({
    queryKey: [TODOS, todo_id],
    queryFn: () => getTodoById(todo_id),
    enabled: !!todo_id,
  });
  return { todoByIdData, todoByIdIsLoading, todoByIdIsError, todoByIdError, ...rest };
}
// const { todoByIdData } = useTodo(id);

// !- - - - 할 일 수정 - - - -
export async function updateTodo(todo_id, payload) {
  const res = await api.patch(`/todos/${todo_id}`, payload);
  return res.data;
}
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  const {
    mutate: updateTodoMutate,
    error: updateTodoError,
    ...rest
  } = useMutation({
    mutationFn: ({ todo_id, payload }) => updateTodo(todo_id, payload),
    onSuccess: (_, variables) => {
      const { todo_id } = variables;
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [TODOS, todo_id] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { updateTodoMutate, updateTodoError, ...rest };
}
// const { updateTodoMutate, updateTodoError } = useUpdateTodo();
// updateTodoMutate({
//   id: todo.id, // 수정할 할 일 id
//   payload: {
//     content: "변경 내용",
//     is_completed: true,
//   }
// });

// !- - - - 할 일 삭제 - - - -
export async function deleteTodo(todo_id) {
  const res = await api.delete(`/todos/${todo_id}?hard=true`);
  return res.data;
}
export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteTodoMutate,
    error: deleteTodoError,
    ...rest
  } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { deleteTodoMutate, deleteTodoError, ...rest };
}
// const { deleteTodoMutate, deleteTodoError } = useDeleteTodo(id);
// deleteTodoMutate(id);

// !- - - - 할 일 완료 처리 토글 - - - -
export async function toggleTodoComplete(todo_id, payload) {
  const res = await api.post(`/todos/${todo_id}/complete`, payload);
  return res.data;
}
export function useToggleTodoComplete() {
  const queryClient = useQueryClient();
  const {
    mutate: toggleTodoCompleteMutate,
    error: toggleTodoCompleteError,
    ...rest
  } = useMutation({
    mutationFn: ({ todo_id, payload }) => toggleTodoComplete(todo_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { toggleTodoCompleteMutate, toggleTodoCompleteError, ...rest };
}
// const { toggleTodoCompleteMutate, toggleTodoCompleteError } = useToggleTodoComplete();
// toggleTodoCompleteMutate({
//   "id": 3,
//   "payload": {
//     "notify_at": "2025-09-18T18:00:00Z"
//   }
// })
