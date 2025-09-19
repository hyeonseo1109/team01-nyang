import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./apiClient";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법


// !- - - - 내 문의 목록 조회 (쿼리: status=pending 등) - - - - 
export async function getInquiries(params = {}) {
  const res = await api.get("/inquiries", { params });
  return res.data;
}
export function useInquiries(params) {
  return useQuery({
    queryKey: ["inquiries", params],
    queryFn: () => getInquiries(params),
    staleTime: 1000 * 60 * 5,
    // 문의 달았을 때 createInquiry에서 캐시 초기화가 발생하기 때문에 새로고침돼서 바로바로 잘 나타나고, 그렇기에 오래 캐싱할 필요도 없음. 
  });
}



// !- - - - 문의 등록 - - - - 
export async function createInquiry(payload) {
  const res = await api.post("/inquiries", payload);
  return res.data;
}
export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}



// !- - - - 문의 상세 조회 - - - - 
export async function getInquiryById(id) {
  const res = await api.get(`/inquiries/${id}`);
  return res.data;
}
export function useInquiry(id) {
  return useQuery({
    queryKey: ["inquiries", id],
    queryFn: () => getInquiryById(id),
    enabled: !!id,
  });
}



// !- - - - 문의 수정 (pending 상태일 때만 가능) - - - - 
export async function updateInquiry(id, payload) {
  const res = await api.patch(`/inquiries/${id}`, payload);
  return res.data;
}
export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateInquiry(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}



// !- - - - 문의 삭제 (pending 상태일 때만 가능) - - - - 
export async function deleteInquiry(id) {
  const res = await api.delete(`/inquiries/${id}`);
  return res.data;
}
export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

