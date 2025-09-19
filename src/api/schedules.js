import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./apiClient";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법


// !- - - - 일정 목록 조회 - - - - 
export async function getSchedules() {
  const res = await api.get("/schedules");
  return res.data;
}
export function useSchedules() {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });
}


// ! - - - - 일정 생성 - - - - 
export async function createSchedule(payload) {
  const res = await api.post("/schedules", payload);
  return res.data;
}
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}



// !- - - - 일정 상세 조회 - - - - 
export async function getScheduleById(id) {
  const res = await api.get(`/schedules/${id}`);
  return res.data;
}
export function useSchedule(id) {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: () => getScheduleById(id),
    enabled: !!id, // id가 있을 때만 실행
  });
}



//  !- - - - 일정 수정 - - - - 
export async function updateSchedule(id, payload) {
  const res = await api.patch(`/schedules/${id}`, payload);
  return res.data;
}
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}



// ! - - - - 일정 삭제 - - - - 
export async function deleteSchedule(id) {
  const res = await api.delete(`/schedules/${id}`);
  return res.data;
}
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}



//  !- - - - 일정 연계 할 일 조회 - - - - 
export async function getScheduleTodos(id) {
  const res = await api.get(`/schedules/${id}/todos`);
  return res.data;
}
export function useScheduleTodos(id) {
  return useQuery({
    queryKey: ["schedules", id, "todos"],
    queryFn: () => getScheduleTodos(id),
    enabled: !!id,
  });
}
