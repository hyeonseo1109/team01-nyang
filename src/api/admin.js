import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const adminInquiries = "adminInquiries";
const adminUsers = "adminUsers";


// !- - - - 유저 목록 검색 - - - -
export async function getUsers (params) {
  const res = await api.get("/users", { params });
  // params: 쿼리스트링으로 url 뒤에 붙는 형태. (주로 GET 요청에서 사용)
  // getUsers ({ email: "abc@test.com", is_active; true }); 
  // 라는 요청을 보내면
  // GET /users?email=abc@test.com&is_active=true
  // 실제로 가는 요청은 이거임
  // - - - -
  // 반면 payload는 Request Body로 보내는 데이터. (보통 POST, PATCH, PUT 요청에서 사용함)
  // updateUser(5, { is_active: false, is_superuser: true });
  // 라는 요청을 보내면
  // PATCH /users/5
  // Content-Type: application/json

  // {
  //   "is_active": false,
  //   "is_superuser": true
  // }
  // 실제로 가는 요청은 위와 같음. 

  return res.data;
}
export function useUsers (params) {
  const {
    data: usersData,
    isLoading: usersIsLoading,
    isError: usersIsError, 
    ...rest
  } = useQuery ({
    queryKey: adminUsers [adminUsers, params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
    // 유저 목록은 자주 바뀌지 않으니 짧게 캐싱해 두었음.
  });
  return { usersData, usersIsLoading, usersIsError, ...rest };
}
// const  { usersData, usersIsLoading, usersIsError } = useUsers();
// if (usersIsLoading) return <p>불러오는 중...</p>;



// !- - - - 특정 유저 수정 (관리자) - - - -
export async function updateUser(userId, payload) {
  const res = await api.patch(`/users/${userId}`, payload);
  return res.data;
}
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { 
    mutate: updateUserMutate, 
    error: updateUserError, 
    ...rest 
  } = useMutation({
    // useMutation에서 실행할 함수 별칭을 미리 지정해두기 
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsers [adminUsers] });
    },
  });
  return { updateUserMutate, updateUserError, ...rest }
}
// const { updateUserMutate, updateUserError, isSuccess } = useUpdateUser();
// -- 이런 식으로 지어준 별칭을 가져와서 쓰면 됨, 별칭짓지 않은 ...rest에 담겨 있던 것들도 가져와서 쓸 수 있음. 

// <button onClick={() => 
//    updateUserMutate({ userId: 5, payload: { is_active: false } })}
// > 수정 </button>
// -- 이렇게 수정할 userId와 payload(내용)을 함수에 넣어서 실행시킴



// !- - - - 특정 유저 삭제 (관리자) - - - -
export async function deleteUser(userId) {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
}
export function useDeleteUser () {
  const queryClient = useQueryClient();
  const { 
    mutate: deleteUserMutate,
    error: deleteUserError, 
    ...rest
  } = useMutation ({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsers [adminUsers] });
    },
  });
  return { deleteUserMutate, deleteUserError, ...rest };
}
// const { deleteUserMutate, deleteUserError } = useDeleteUser();
// <button onClick={() => deleteUserMutate(user.id)}>삭제</button>



// !- - - - 전체 문의 검색 - - - -
export async function getAllInquiries () {
  const res = await api.get("/admin/inquiries");
  return res.data;
}
export function useAllInquiries() {
  const {
    data: allInquiriesData,
    isLoading: allInquiriesIsLoading,
    isError: allInquiriesIsError,
    ...rest
  } = useQuery({
    queryKey: [adminInquiries],
    queryFn: getAllInquiries,
  });
  return { allInquiriesData, allInquiriesIsLoading, allInquiriesIsError, ...rest };
}
//const { allInquiriesData, allInquiriesIsLoading, allInquiriesIsError } = useAllInquiries();




// !- - - - 문의 상태 변경 - - - -
export async function updateInquiryStatus (id, payload) {
  const res = await api.patch(`/admin/inquiries/${id}/status`, payload);
  return res.data;
}
export function useUpdateInquiry () {
  const queryClient = useQueryClient();
  const {
    mutate: updateInquiryMutate,
    error: updateInquiryError, 
    ...rest
  } = useMutation ({
    mutationFn: ({ id, payload }) => updateInquiryStatus(id, payload), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adminInquiries] });
    },
  });
  return { updateInquiryMutate, updateInquiryError, ...rest};
}
// const { updateInquiryMutate, updateInquiryError } = useUpdateInquiry();
// const handleUpdateInquiry =()=> { updateInquiryMutate({
//   id: inquiryId,
//   payload: { status: "in_progress" },
// })}



// !- - - - 관리자 답변 등록 / 수정 - - - - 
export async function adminInquiriesReply (id, payload) {
  const res = await api.post(`/admin/inquiries/${id}/reply`, payload);
  return res.data;
}
export function useAdminInquiriesReply () {
  const queryClient = useQueryClient();
  const {
    mutate: adminInquiriesReplyMutate,
    error: adminInquiriesReplyError,
    ...rest
  } = useMutation ({
    mutationFn: ({ id, payload }) => adminInquiriesReply(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInquiriesReply"] });
    },
  });
  return { adminInquiriesReplyMutate, adminInquiriesReplyError, ...rest };
}
// const { adminInquiriesMutate, adminInquiriesError } = useAdminInquiriesReply()
