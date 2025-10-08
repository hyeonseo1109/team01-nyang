import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법

const MY_PROFILE = 'myProfile';
const MY_LOCATION = 'myLocation';
const PASSWORD = 'password';

// !- - - - 내 프로필 조회 - - - -
export async function getMyProfile() {
  const res = await api.get('/users/me');
  return res.data;
}
export function useGetMyProfile() {
  const {
    data: getMyProfileData,
    isLoading: getMyProfileIsLoading,
    isError: getMyProfileIsError,
    error: getMyProfileError,
    ...rest
  } = useQuery({
    queryKey: [MY_PROFILE],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
  });
  return {
    getMyProfileData,
    getMyProfileIsLoading,
    getMyProfileIsError,
    getMyProfileError,
    ...rest,
  };
  //useQuery: 서버에서 데이터 가져올 때. (GET 요청 보낼 때)
  //queryKey: 호출에 이름을 지음, 같은 호출을 두 번 할 때 새롭게 불러오지 않고 기존에 있던 호출 결과를 불러옴.
}
// const { getMyProfileData, getMyProfileIsLoading, getMyProfileIsError } = useGetMyProfile();

// !- - - - 내 프로필 수정 - - - -
export async function updateMyProfile(payload) {
  const res = await api.patch('/users/me', payload);
  return res.data;
}
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  //queryClient : 캐시를 무효화해서 새로 불러옴
  const {
    mutate: updateMyProfileMutate,
    error: updateMyProfileError,
    ...rest
  } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () =>
      // mutation(요청)이 성공했을 때 실행되는 콜백 함수.
      queryClient.invalidateQueries({ queryKey: [MY_PROFILE] }),
  });
  return { updateMyProfileMutate, updateMyProfileError, ...rest };
}
// const { updateMyProfileMutate, updateMyProfileError } = useUpdateMyProfile();
// updateMyProfileMutate({
//   username: "new_username",
//   email: "newEmail@example.com",
// })
// !- - - - 프로필사진 수정용 유저 정보 수정 - - - -
export async function updateProfileImage(fileUrl) {
  const res = await api.put('/users/me', {
    profile_image: fileUrl,
  });
  return res.data;
}

// !- - - - 사용자 삭제 - - - -
export async function deleteMyAccount() {
  const res = await api.delete('/users/me');
  return res.data;
}
export function useDeleteMyAccount() {
  const {
    mutate: deleteMyAccountMutate,
    error: deleteMyAccountError,
    ...rest
  } = useMutation({
    mutationFn: deleteMyAccount,
  });
  return { deleteMyAccountMutate, deleteMyAccountError, ...rest };
}
// const { deleteMyAccountMutate, deleteMyAccountError } = useDeleteMyAccount();
// deleteMyAccountMutate();

// !- - - - 비밀번호 변경 - - - -
export async function passwordChange(payload) {
  const res = await api.post('users/password/change', payload);
  return res.data;
}
export function usePasswordChange() {
  const queryClient = useQueryClient();
  const {
    mutate: passwordChangeMutate,
    error: passwordChangeError,
    ...rest
  } = useMutation({
    mutationFn: passwordChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PASSWORD] });
    },
  });
  return { passwordChangeMutate, passwordChangeError, ...rest };
}

// // !- - - - 위치 조회 - - - -
// export async function getMyLocation() {
//   const res = await api.get('/users/me/location');
//   return res.data;
// }
// export function useGetMyLocation() {
//   const {
//     data: getMyLocationData,
//     isLoading: getMyLocationIsLoading,
//     isError: getMyLocationIsError,
//     error: getMyLocationError,
//     ...rest
//   } = useQuery({
//     queryKey: [MY_LOCATION],
//     queryFn: getMyLocation,
//   });
//   return {
//     getMyLocationData,
//     getMyLocationIsLoading,
//     getMyLocationIsError,
//     getMyLocationError,
//     ...rest,
//   };
// }
// // const { getMyLocationData, getMyLocationIsLoading, getMyLocationIsError } = useGetMyLocation();

// !- - - - 위치 수정 - - - -
export async function updateMyLocation(payload) {
  const res = await api.patch('/users-locations/', payload);
  return res.data;
}
export function useUpdateMyLocation() {
  const queryClient = useQueryClient();
  const {
    mutate: updateMyLocationMutate,
    error: updateMyLocationError,
    ...rest
  } = useMutation({
    mutationFn: updateMyLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MY_LOCATION] }),
  });
  return { updateMyLocationMutate, updateMyLocationError, ...rest };
}
// const { updateMyLocationMutate, updateMyLocationError } = useUpdateMyLocation();
// updateMyLocationMutate({
//   "latitude": 37.5665,
//   "longitude": 126.9780,
//   "location_name": "서울"
// })
