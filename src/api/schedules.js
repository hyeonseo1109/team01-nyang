import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./apiClient";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const schedules = "schedules";

// !- - - - 일정 목록 조회 - - - - 
export async function getSchedules() {
  const res = await api.get("/schedules");
  return res.data;
}
export function useSchedules() {
  const {
    data: schedulesData,
    isLoading: schedulesIsLoading,
    isError: schedulesIsError,
    ...rest
  } = useQuery({
    queryKey: [schedules],
    queryFn: getSchedules,
  });
  return { schedulesData, schedulesIsLoading, schedulesIsError, ...rest };
}
// const { schedulesData, schedulesIsLoading, schedulesIsError } = useSchedules();


// ! - - - - 일정 생성 - - - - 
export async function createSchedule(payload) {
  const res = await api.post("/schedules", payload);
  return res.data;
}
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const {
    mutate: createScheduleMutate,
    error: createScheduleError,
    ...rest
  } = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [schedules] });
    },
  });
  return { createScheduleMutate, createScheduleError, ...rest };
}
// const { createScheduleMutate, createScheduleError } = useCreateSchedule();
// createScheduleMutate(form) 
// 여기서 payload는 객체이기 때문에, form도 객체로 내용 작성해야 함. (API 명세서에 있는 것처럼)


// !- - - - 일정 상세 조회 - - - - 
export async function getScheduleById(id) {
  const res = await api.get(`/schedules/${id}`);
  return res.data;
}
export function useScheduleById(id) {
  const {
    data: scheduleByIdData,
    isLoading: scheduleByIdIsLoading,
    isError: scheduleByIdIsError,
    ...rest
  } = useQuery({
    queryKey: [schedules, id],
    queryFn: () => getScheduleById(id),
    enabled: !!id, // id가 있을 때만 실행
  });
  return { scheduleByIdData, scheduleByIdIsLoading, scheduleByIdIsError, ...rest };
}
// const { scheduleByIdData, scheduleByIdIsLoading, scheduleByIdIsError } = useScheduleById(id);



//  !- - - - 일정 수정 - - - - 
export async function updateSchedule(id, payload) {
  const res = await api.patch(`/schedules/${id}`, payload);
  return res.data;
}
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const {
    mutate: updateScheduleMutate,
    error: updateScheduleError,
    ...rest
  } = useMutation({
    mutationFn: ({ id, payload }) => updateSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [schedules] });
    },
  });
  return { updateScheduleMutate, updateScheduleError, ...rest };
}
// const { updateScheduleMutate, updateScheduleError } = useUpdateSchedule();
// updateScheduleError({ 
//   id:1, 
//   payload: {
//     title: "제목",
//     start_time: "2025-09-24T10:30:00Z",
//     end_time: "2025-09-24T12:00:00Z",
//   },
// })



// ! - - - - 일정 삭제 - - - - 
export async function deleteSchedule(id) {
  const res = await api.delete(`/schedules/${id}`);
  return res.data;
}
export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteScheduleMutate,
    error: deleteScheduleError,
    ...rest
  } = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [schedules] });
    },
  });
  return { deleteScheduleMutate, deleteScheduleError, ...rest };
}
// const { deleteScheduleMutate, deleteScheduleError } = useDeleteSchedule();
// deleteScheduleMutate(id);



//  !- - - - 일정 연계 할 일 조회 - - - - 
export async function getScheduleTodos(id) {
  const res = await api.get(`/schedules/${id}/todos`);
  return res.data;
}
export function useScheduleTodos(id) {
  const {
    data: scheduleTodosData,
    isLoading: scheduleTodosIsLoading,
    isError: scheduleTodosIsError,
    ...rest
  } = useQuery({
    queryKey: [schedules, id, "todos"],
    queryFn: () => getScheduleTodos(id),
    enabled: !!id,
  });
  return { scheduleTodosData, scheduleTodosIsLoading, scheduleTodosIsError, ...rest };
}
// const { scheduleTodosData, scheduleTodosIsLoading, scheduleTodosIsError } = useScheduleTodos();
// scheduleTodosData(id)