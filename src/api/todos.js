import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./apiClient";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법


// !- - - - 할 일 목록 조회 - - - - 
export async function getTodos(params = {}) {
  // 쿼리: is_completed, schedule_id
  const res = await api.get("/todos", { params });
  return res.data;
}
export function useTodos(params) {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => getTodos(params),
  });
}


// !- - - - 할 일 생성 - - - - 
export async function createTodo(payload) {
  const res = await api.post("/todos", payload);
  return res.data;
}
export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}



// !- - - - 할 일 상세 조회 - - - - 
export async function getTodoById(id) {
  const res = await api.get(`/todos/${id}`);
  return res.data;
}
export function useTodo(id) {
  return useQuery({
    queryKey: ["todos", id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  });
}



// !- - - - 할 일 수정 - - - - 
export async function updateTodo(id, payload) {
  const res = await api.patch(`/todos/${id}`, payload);
  return res.data;
}
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateTodo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}



// !- - - - 할 일 삭제 - - - - 
export async function deleteTodo(id) {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
}
export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}



// !- - - - 할 일 완료 처리 토글 - - - - 
export async function toggleTodoComplete(id, payload) {
  const res = await api.post(`/todos/${id}/complete`, payload);
  return res.data;
}
export function useToggleTodoComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => toggleTodoComplete(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
