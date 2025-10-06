import { useState } from 'react';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { IoSearch } from 'react-icons/io5';
import { useDebounce } from '../../hook/useDebounce';
// import { useUserSearch } from '../../api/admin';
import { VscChromeClose } from 'react-icons/vsc';
import { VscCircleLarge } from 'react-icons/vsc';
import { formatDate } from '../../hook/useFormatDate';
import { useDeleteUser, useUsers, useUserSearch } from '../../api/admin';
import { isArray } from 'chart.js/helpers';

export default function Admin() {
  const [mode, setMode] = useState('all');
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue);

  const { userSearchData, userSearchIsLoading, userSearchIsError } = useUserSearch(debouncedValue);

  const { usersData } = useUsers();

  const { deleteUserMutate, deleteUserError } = useDeleteUser();

  const filteredUsers =
    mode === 'connecting' ? usersData?.users.filter((u) => u.is_active) : usersData?.users;

  const searchedUser = debouncedValue ? (userSearchData ?? []) : filteredUsers;

  const tableHead = ['이름', '활성화여부', '관리자', '이름', '이메일', '가입일시', '계정차단'];

  return (
    <>
      <div className="flex flex-col gap-3 w-full h-full justify-center items-center">
        <div className="flex justify-between w-full">
          <div className="flex">
            <label className="sr-only">조건 선택</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full border rounded px-3 py-1"
            >
              <option value="" disabled hidden>
                조건 선택
              </option>
              <option value="all">전체 유저 조회</option>
              <option value="connecting">접속 중인 유저 조회</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Input
              label="유저 검색"
              type="text"
              placeholder="유저를 검색하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              classNames="rounded-sm border px-3 py-1"
            />
            {/* rounded-sm border px-3 */}
            <IoSearch />
          </div>
        </div>
        <div className="w-full overflow-auto">
          <div className="rounded-lg  shadow-md border border-table min-w-[50rem]  h-[20rem] overflow-y-auto ">
            <table className="w-full rounded-lg border ">
              <thead className="sticky top-0 bg-[#222]">
                <tr>
                  {tableHead.map((name, idx) => (
                    <th key={idx} className="border border-table p-2 text-center whitespace-nowrap">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userSearchIsLoading ? (
                  <tr>
                    <td colSpan={tableHead.length} className="text-center py-4 text-gray-500">
                      ...
                    </td>
                  </tr>
                ) : userSearchIsError ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      error
                    </td>
                  </tr>
                ) : !searchedUser ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      조회된 유저가 없습니다.
                    </td>
                  </tr>
                ) : isArray(searchedUser) ? (
                  searchedUser.map((user) => (
                    <tr key={user.id}>
                      <td className="border border-table p-2 text-center bg-[#222222] whitespace-nowrap">
                        {user.id}
                      </td>
                      <td className="border border-table whitespace-nowrap">
                        {user.is_active ? (
                          <div className="m-auto border  rounded-2xl bg-[#34cf20] w-3.5 h-3.5 shadow-[0_0_5px_#34cf20]"></div>
                        ) : (
                          <div className="m-auto border  rounded-2xl bg-[#cf2020] w-3.5 h-3.5 shadow-[0_0_5px_#909090]"></div>
                        )}
                      </td>
                      <td
                        className={`border p-2 text-center border-table ${user.is_superuser && 'text-red-500'}`}
                      >
                        {user.is_superuser ? <VscCircleLarge /> : <VscChromeClose />}
                      </td>
                      <td className="border border-table p-2 text-center whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="border border-table p-2 text-center  whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="border border-table p-2 text-center whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="border border-table text-center align-middle p-1">
                        <Button size="vsm" variant="common">
                          차단
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>{searchedUser.id}</td>
                    <td className="border border-table whitespace-nowrap">
                      {searchedUser.is_active ? (
                        <div className="m-auto border  rounded-2xl bg-[#34cf20] w-3.5 h-3.5 shadow-[0_0_5px_#34cf20]"></div>
                      ) : (
                        <div className="m-auto border  rounded-2xl bg-[#cf2020] w-3.5 h-3.5 shadow-[0_0_5px_#909090]"></div>
                      )}
                    </td>
                    <td
                      className={`border p-2 text-center border-table ${searchedUser.is_superuser && 'text-red-500'}`}
                    >
                      {searchedUser.is_superuser ? <VscCircleLarge /> : <VscChromeClose />}
                    </td>
                    <td className="border border-table p-2 text-center whitespace-nowrap">
                      {searchedUser.username}
                    </td>
                    <td className="border border-table p-2 text-center  whitespace-nowrap">
                      {searchedUser.email}
                    </td>
                    <td className="border border-table p-2 text-center whitespace-nowrap">
                      {formatDate(searchedUser.created_at)}
                    </td>
                    <td className="border border-table text-center align-middle p-1">
                      <Button size="vsm" variant="common">
                        차단
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
