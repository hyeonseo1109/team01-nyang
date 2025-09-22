import { useState } from "react";
import Button from "../ui/Button";
import { adminData } from "./adminData";

export default function Admin () {
  const [mode, setMode] = useState("all");
  const filteredUsers = mode === "connecting"
    ? adminData.items.filter((u) => u.is_active)
    : adminData.items;

  return (<>
    <div className="flex flex-col gap-3">
      <div className="justify-start w-45">
        <label className="sr-only">조건 선택</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="" disabled hidden>조건 선택</option>
          <option value="all">전체 유저 조회</option>
          <option value="connecting">접속 중인 유저 조회</option>
        </select>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 w-full  max-w-[80rem] mx-auto  h-[20rem] overflow-y-scroll">
          <table className="rounded-lg overflow-hidden w-full border ">
            <thead>
              <tr className="bg-[#dbeaff]">
                <th className="border p-2 text-center">ID</th>
                <th className="border p-2 text-center">접속여부</th>
                <th className="border p-2 text-center">관리자</th>
                <th className="border p-2 text-center">이름</th>
                <th className="border p-2 text-center">이메일</th>
                <th className="border p-2 text-center">가입일시</th>
                <th className="border p-2 text-center">계정차단</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    접속 중인 유저가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                >
                  <td className="border p-2 text-center bg-[#f1f7ff]">{user.id}</td>
                  <td className="border">{user.is_active ? 
                  <div className="m-auto border border-white rounded-2xl bg-[#34cf20] w-3.5 h-3.5 shadow-[0_0_5px_#34cf20]"></div>
                  : <div className="m-auto border border-white rounded-2xl bg-[#cf2020] w-3.5 h-3.5 shadow-[0_0_5px_#909090]"></div>
                  }</td>
                  <td className={`border p-2 text-center ${user.is_superuser ? "text-red-500  border-black" : "text-black"}`}>{user.is_superuser ? "◯" : "✕" }</td>
                  <td className="border p-2 text-center">{user.username}</td>
                  <td className="border p-2 text-center overflow-hidden">{user.email}</td>
                  <td className="border p-2 text-center">{user.created_at.slice(2, -9).replace("T", "/").replace(/-/g,'/')}</td>
                  <td className="border w-[5rem] h-full text-center align-middle p-1">
                    <Button size="vsm" variant="common">차단</Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </>)
}
