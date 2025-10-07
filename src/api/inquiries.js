import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const INQUIRIES = 'inquiries';
const ADMIN_INQUIRIES = 'adminInquiries';

// !- - - - 전체 문의 검색 - - - -
export async function getAllInquiries() {
  const res = await api.get('/inquiries');
  return res.data;
}
export function useAllInquiries() {
  const {
    data: allInquiriesData,
    isLoading: allInquiriesIsLoading,
    isError: allInquiriesIsError,
    error: allInquiriesError,
    ...rest
  } = useQuery({
    queryKey: [ADMIN_INQUIRIES],
    queryFn: getAllInquiries,
  });
  return {
    allInquiriesData,
    allInquiriesIsLoading,
    allInquiriesIsError,
    allInquiriesError,
    ...rest,
  };
}
//const { allInquiriesData, allInquiriesIsLoading, allInquiriesIsError } = useAllInquiries();

// !- - - - 내 문의 목록 조회 (쿼리: status=pending 등) - - - -
export async function getInquiries() {
  const res = await api.get('/inquiries/me');
  return res.data;
}
export function useInquiries() {
  const {
    data: inquiriesData,
    isLoading: inquiriesIsLoading,
    isError: inquiriesIsError,
    error: inquiriesError,
    ...rest
  } = useQuery({
    queryKey: [INQUIRIES],
    queryFn: () => getInquiries(),
    staleTime: 1000 * 60 * 5,
    // 문의 달았을 때 createInquiry에서 캐시 초기화가 발생하기 때문에 새로고침돼서 바로바로 잘 나타나고, 그렇기에 오래 캐싱할 필요도 없음.
  });
  return { inquiriesData, inquiriesIsLoading, inquiriesIsError, inquiriesError, ...rest };
}
// const { inquiriesData, inquiriesIsLoading, inquiriesIsError } = useInquiries();   :   전체 조회
// const { inquiriesData, inquiriesIsLoading, inquiriesIsError } = useInquiries({ status: "pending" });   :    pending 상태인 문의만 보여줌.

// !- - - - 문의 등록 - - - -
export async function createInquiry(payload) {
  const res = await api.post('/inquiries', payload);
  return res.data;
}
export function useCreateInquiry() {
  const queryClient = useQueryClient();
  const {
    mutate: createInquiryMutate,
    error: createInquiryError,
    ...rest
  } = useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRIES] });
    },
  });
  return { createInquiryMutate, createInquiryError, ...rest };
}
// const { createInquiryMutate, createInquiryError } = useCreateInquiry();
// createInquiryMutate({ "title": "문의 등록", "message": "문의 등록하겠습니다."})

// !- - - - 문의 상세 조회 - - - -
export async function getInquiryById(inquiry_id) {
  const res = await api.get(`/inquiries/${inquiry_id}`);
  return res.data;
}
export function useInquiry(inquiry_id) {
  const {
    data: inquiryByIdData,
    isLoading: inquiryByIdIsLoading,
    isError: inquiryByIdIsError,
    error: inquiryByIdError,
    ...rest
  } = useQuery({
    queryKey: [INQUIRIES, inquiry_id],
    queryFn: () => getInquiryById(inquiry_id),
    enabled: !!inquiry_id,
  });
  return { inquiryByIdData, inquiryByIdIsLoading, inquiryByIdIsError, inquiryByIdError, ...rest };
}
// const { inquiryByIdData, inquiriesIsLoading, inquiriesIsError } = useInquiry(3);

// !- - - - 관리자 문의 수정 - - - -
export async function updateInquiry(inquiry_id, payload) {
  const res = await api.patch(`/inquiries/${inquiry_id}`, payload);
  return res.data;
}
export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  const {
    mutate: updateInquiryMutate,
    error: updateInquiryError,
    ...rest
  } = useMutation({
    mutationFn: ({ inquiry_id, payload }) => updateInquiry(inquiry_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRIES] });
    },
  });
  return { updateInquiryMutate, updateInquiryError, ...rest };
}
// const { updateInquiryMutate, updateInquiryError } = useUpdateInquiry();
// updateInquiryMutate({ id: 3, payload: { "title": "문의 수정", "message": "문의 수정하겠습니다." }})

// !- - - - 자기 문의 수정 (pending 상태일 때만 가능) - - - -
export async function updateInquiryMe(inquiry_id, payload) {
  const res = await api.patch(`/inquiries/me/${inquiry_id}`, payload);
  return res.data;
}
export function useUpdateInquiryMe() {
  const queryClient = useQueryClient();
  const {
    mutate: updateInquiryMeMutate,
    error: updateInquiryMeError,
    ...rest
  } = useMutation({
    mutationFn: ({ inquiry_id, payload }) => updateInquiryMe(inquiry_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRIES] });
    },
  });
  return { updateInquiryMeMutate, updateInquiryMeError, ...rest };
}
// const { updateInquiryMutate, updateInquiryError } = useUpdateInquiry();
// updateInquiryMutate({ id: 3, payload: { "title": "문의 수정", "message": "문의 수정하겠습니다." }})

// !- - - - 문의 삭제 (pending 상태일 때만 가능) - - - -
export async function deleteInquiry(inquiry_id) {
  const res = await api.delete(`/inquiries/${inquiry_id}`);
  return res.data;
}
export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteInquiryMutate,
    error: deleteInquiryError,
    ...rest
  } = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INQUIRIES] });
    },
  });
  return { deleteInquiryMutate, deleteInquiryError, ...rest };
}
// const { deleteInquiryMutate, deleteInquiryError } = useDeleteInquiry();
// deleteInquiryMutate(id)
