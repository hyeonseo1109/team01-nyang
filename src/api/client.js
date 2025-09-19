import axios from "axios";


// - - - - axios 인스턴스 생성 - - - -
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, //쿠키 포함 요청 허용
});


// - - - - 리프레시 토큰 자동 갱신 - - - -
api.interceptors.response.use(
  (response) => response,
  // 성공 응답은 아직 세션이 만료되지 않은 거니까 그냥 통과시킴.

  async (error) => {
    const originalRequest = error.config;
    // error.config: api요청 실패해서 에러 생겼을 때 그 객체 안에 사용된 요청관련 설정 정보. (url, method, headers, data 등) = 실패했던 원래 요청의 설정정보 객체 
    // ? 401 에러(=세션 만료) 오류 발생 시, 원래 실패했던 요청의 설정을 가져와서 똑같이 다시 요청 보내기 위함임. 

    if (error.response?.status === 401 && !originalRequest.retry) {
      //? 401 에러이면서, 아직 재시도 안 한 요청일 때. = 401오류 떴을 때 한번만 리프레시 시도함.
      // 객체에 retry라는 속성이 없어도 밑에처럼 바로 할당해서 새 속성 만들 수 있음. 
      // = 속성을 미리 정의하지 않아도 바로 새로운 속성을 추가할 수 있음. 
      originalRequest.retry = true;
      // 만약 retry라는 속성이 없으면 = 재시도한 적이 없으면
      // retry라는 속성을 만들어서 그 값을 true로 만들겠다. = 재시도 한 요청이구나!

      try {
        await api.post("/auth/refresh");
        // 새로운 액세스 토큰 등록
        return api(originalRequest);
        // 리프레시 하면 원래 실패했던 요청을 다시 호출함. 
        //? 위에서 만든 axios 인스턴스는 함수처럼 호출할 수 있음. 
        //? 그래서 api(config) 하면, 그 config 객체를 기준으로 HTTP 요청을 보낼 수 있음. 
      } catch (refreshError) {
        return Promise.reject(refreshError);
        //무조건 실패하는 Promise를 만들어냄. 
      }
    }

    return Promise.reject(error);
    // 401 에러가 아니거나  재시도를 했었다면 ? 바로 에러 반환
  }
);









// localStorage에 토큰 저장할 시, 토큰 가져와서 헤더에 싣는 방법.
// - - - - 요청 인터셉터 - - - - 
// api명세서에서 Header가 Authorization인 거는 토큰을 필요로 함, 인터셉터로 토큰까지 넣어서 보내주기
// api.interceptors.request.use((config) => {
  // 요청 전 단계에서 config가 들어오면 거기에 토큰을 실어서 return으로 돌려주면, 최종적으로 axios가 서버에 보냄. 
  // const token = localStorage.getItem("access_token"); 
  // 로그인할 때 저장해둔 토큰
  // if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    // 꺼내온 토큰을 자동으로 헤더에 붙여줌
    // api.get("/users/me") 이 코드가 실행되면 axios 내부적으로 아래 같은 config 객체를 만듦.
    // {
    //   method: "get",
    //   url: "/users/me",
    //   baseURL: "http://localhost:3000/api/v1",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // }
//   }
//   return config;
// });



// - - - - - - - - - - - - - - - - - -
// GET 예시

// const { data, isLoading, isError } = useNews();

// if(isLoading) return <p>불러오는 중...</p>
// if(isError) return <p>에러 발생</p>
// - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - -
// POST 예시

// const mutation = useCreateTodo();

// const handleAdd = () =>  {
//   mutation.mutate({
//     title: "POST 예시",
//     description: "POST 예시 설명",
//   });
// }

// return (
//   <button onClick={handleAdd} disabled={mutation.isLoading}>
//     {mutation.isLoading ? "로딩 중..." : "추가 완료"}
//   </button>
// )
// - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - -
// PATCH, DELETE 예시
// const updateMutation = useUpdateTodo();
// const deleteMutation = useDeleteTodo();

// const handleToggle = () => {
//   updateMutation.mutate({
//     id: todo.id,
//     payload: { is_completed: !todo.is_completed },
//   });
// };
// const handleDelete = () => {
//   deleteMutation.mutate(todo.id);
// };
// <button onClick={handleToggle}>
//   {todo.is_completed ? "되돌리기" : "완료" }
// </button>
// <button onClick={handleDelete}>
//   삭제
// </button>
// - - - - - - - - - - - - - - - - - -