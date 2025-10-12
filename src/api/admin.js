import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const ADMIN_USERS = 'adminUsers';
const USER_SEARCH = 'userSearch';

// !- - - - 유저 목록 검색(관리자용) - - - -
export async function getUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}
export function useUsers() {
  const {
    data: usersData,
    isLoading: usersIsLoading,
    isError: usersIsError,
    error: usersError,
    refetch,
    ...rest
  } = useQuery({
    queryKey: [ADMIN_USERS],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5,
    // 유저 목록은 자주 바뀌지 않으니 짧게 캐싱해 두었음.
  });
  return { usersData, usersIsLoading, usersIsError, usersError, refetch, ...rest };
}
// const  { usersData, usersIsLoading, usersIsError } = useUsers();   :   전체 목록

// const { usersData } = useUsers({ email: "search@example.com" });   :   이메일로 찾기
// --이렇게 params로 넘겨야 할 때는 객체 형태로 넘김.
// GET요청 시의 useQuery에서는 params를  api요청함수를 호출하는 TanStack Query 훅 자체에서 넘겨줌.
// 그 외 요청의 useMutation에서는 params를  생성된 mutate에서 넘겨줌.

// if (usersIsLoading) return <p>불러오는 중...</p>;

//! - - - - 특정 유저 조회 - - - -
export async function getUserSearch(search) {
  const res = await api.get(`/admin/users/search`, {
    params: { search },
  });
  return res.data;
}
export function useUserSearch(search) {
  const {
    data: userSearchData,
    isLoading: userSearchIsLoading,
    isError: userSearchIsError,
    error: userSearchError,
    ...rest
  } = useQuery({
    queryKey: [USER_SEARCH, search],
    queryFn: () => getUserSearch(search),
    enabled: !!search,
  });
  return { userSearchData, userSearchIsLoading, userSearchIsError, userSearchError, ...rest };
}
//const {userSearchData, userSearchIsLoading, userSearchIsError } = userUserSearch(userId);

// !- - - - 유저 계정 차단 (관리자) - - - -
export async function updateUser({ user_id, is_active }) {
  const res = await api.patch(`/admin/users/${user_id}/status`, {}, { params: { is_active } });
  return res.data;
}
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {
    mutate: updateUserMutate,
    error: updateUserError,
    ...rest
  } = useMutation({
    mutationFn: updateUser,
    // mutate에서 받은 인자를 그대로 updateUser에 전달함.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS] });
      queryClient.invalidateQueries({ queryKey: [USER_SEARCH] });
    },
  });
  return { updateUserMutate, updateUserError, ...rest };
}
// const { updateUserMutate, updateUserError, isSuccess } = useUpdateUser();
// -- 이런 식으로 지어준 별칭을 가져와서 쓰면 됨, 별칭짓지 않은 ...rest에 담겨 있던 것들도 가져와서 쓸 수 있음.

// <button onClick={() =>
//    updateUserMutate({ user_Id: 5, is_active: false  })}
// > 수정 </button>
// -- 이렇게 수정할 userId와 payload(내용)을 함수에 넣어서 실행시킴

// !- - - - 특정 유저 삭제 (관리자) - - - -
export async function deleteUser(user_Id) {
  const res = await api.delete(`/admin/users/${user_Id}`);
  //얘는 객체로 넘기지 않고 있음. 숫자로 넣어도 됨.
  return res.data;
}
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteUserMutate,
    error: deleteUserError,
    ...rest
  } = useMutation({
    mutationFn: deleteUser,
    // mutationFn이 단일 인자를 받게 만들어졌으면, mutate도 단일 인자를 넘기면 됨.
    // deleteUser를 호출하면서 params로 id만 받음 => mutate로 넘겨서 받는 것도 id뿐.
    // 즉 객체로 쓰지 않고 숫자 id 자체를 넘기면 됨.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS] });
      queryClient.invalidateQueries({ queryKey: [USER_SEARCH] });
    },
  });
  return { deleteUserMutate, deleteUserError, ...rest };
}
// const { deleteUserMutate, deleteUserError } = useDeleteUser();
// <button onClick={() => deleteUserMutate(user.id)}>삭제</button>
