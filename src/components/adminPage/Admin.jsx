import { adminData } from "./adminData";

export default function Admin () {
  
  return (<>
    <div className="text-black w-full mx-auto">
      <table className=" min-w-[35rem] w-full max-w-[47rem]">
        <thead>
          <tr>
            <th className="border p-2 text-center">ID</th>
            <th className="border p-2 text-center">이름</th>
            <th className="border p-2 text-center">이메일</th>
            <th className="border p-2 text-center">생년월일</th>
            <th className="border p-2 text-center">관리자</th>
            <th className="border p-2 text-center">가입일시</th>
            <th className="border p-2 text-center">/</th>
          </tr>
        </thead>
        <tbody>
          {adminData.data.users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2 text-center">{user.id}</td>
              <td className="border p-2 text-center">{user.username}</td>
              <td className="border p-2 text-center">{user.email}</td>
              <td className="border p-2 text-center">{user.birth_date.slice(2).replace(/-/g,'/')}</td>
              <td className="border p-2 text-center">{user.is_active ? "◯" : "✕" }</td>
              <td className="border p-2 text-center">{user.created_at.slice(2, -4).replace("T", "/").replace(/-/g,'/')}</td>
              <td className="border w-[5rem] h-full text-center align-middle">
                <button >계정 차단</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>)
}
