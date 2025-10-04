import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../store/useUser';
// import { useGoogleCallback } from '../api/auth';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getUser } = useUser();
  // const { googleCallbackMutate, googleCallbackError } = useGoogleCallback();

  useEffect(() => {
    (async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        await getUser();
        navigate('/main');
      } catch (err) {
        console.error(err);
        alert('로그인 실패');
        navigate('/');
      }
    })();
  }, []);

  // if (googleCallbackError) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-red-500 text-lg">
  //       오류 발생: {googleCallbackError.message}
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center items-center h-screen text-white text-lg">
      구글 로그인 중...
    </div>
  );
}
