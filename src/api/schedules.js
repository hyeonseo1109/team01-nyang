import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const SCHEDULES = 'schedules';
const CONVERSATIONS = 'conversations';

// !- - - - 일정 목록 조회 - - - -
export async function getSchedules() {
  const res = await api.get('/schedules/me');
  return res.data;
}
export function useSchedules() {
  const {
    data: schedulesData,
    isLoading: schedulesIsLoading,
    isError: schedulesIsError,
    error: schedulesError,
    ...rest
  } = useQuery({
    queryKey: [SCHEDULES],
    queryFn: getSchedules,
  });
  return { schedulesData, schedulesIsLoading, schedulesIsError, schedulesError, ...rest };
}
// const { schedulesData, schedulesIsLoading, schedulesIsError } = useSchedules();

// ! - - - - 일정 생성 - - - -
export async function createSchedule(payload) {
  const res = await api.post('/schedules', payload);
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
      queryClient.invalidateQueries({ queryKey: [SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { createScheduleMutate, createScheduleError, ...rest };
}
// const { createScheduleMutate, createScheduleError } = useCreateSchedule();

// createScheduleMutate(form)
// 여기서 payload는 객체이기 때문에, form도 객체로 내용 작성해야 함. (API 명세서에 있는 것처럼)

// !- - - - 일정 상세 조회 - - - -
export async function getScheduleById(schedule_id) {
  const res = await api.get(`/schedules/${schedule_id}`);
  return res.data;
}
export function useScheduleById(schedule_id) {
  const {
    data: scheduleByIdData,
    isLoading: scheduleByIdIsLoading,
    isError: scheduleByIdIsError,
    error: scheduleByError,
    ...rest
  } = useQuery({
    queryKey: [SCHEDULES, schedule_id],
    queryFn: () => getScheduleById(schedule_id),
    enabled: !!schedule_id, // id가 있을 때만 실행
  });
  return { scheduleByIdData, scheduleByIdIsLoading, scheduleByIdIsError, scheduleByError, ...rest };
}
// const { scheduleByIdData, scheduleByIdIsLoading, scheduleByIdIsError } = useScheduleById(id);

//  !- - - - 일정 수정 - - - -
export async function updateSchedule(schedules_id, payload) {
  const res = await api.patch(`/schedules/${schedules_id}`, payload);
  return res.data;
}
export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const {
    mutate: updateScheduleMutate,
    error: updateScheduleError,
    ...rest
  } = useMutation({
    mutationFn: ({ schedules_id, payload }) => updateSchedule(schedules_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { updateScheduleMutate, updateScheduleError, ...rest };
}
// const { updateScheduleMutate, updateScheduleError } = useUpdateSchedule();

// updateScheduleMutate({
//   id:1,
//   payload: {
//     title: "제목",
//     start_time: "2025-09-24T10:30:00Z",
//     end_time: "2025-09-24T12:00:00Z",
//   },
// })

// ! - - - - 일정 삭제 - - - -
export async function deleteSchedule(schedule_id) {
  const res = await api.delete(`/schedules/${schedule_id}?hard=true`);
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
      queryClient.invalidateQueries({ queryKey: [SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS] });
    },
  });
  return { deleteScheduleMutate, deleteScheduleError, ...rest };
}
// const { deleteScheduleMutate, deleteScheduleError } = useDeleteSchedule();
// deleteScheduleMutate(id);
