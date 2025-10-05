import ScheduleList from "./ScheduleList";
import { useSchedule } from "../../store/useSchedule";
import { useState } from "react";

export default function ScheduleForm({
  setOpenSchedule,
  openAdminDashboard,
  openAdminPage,
  openSchedule,
}) {
  const {
    form,
    list,
    isEditing,
    setForm,
    addSchedule,
    deleteSchedule,
    startEdit,
    cancelEdit,
  } = useSchedule();

  const [errors, setErrors] = useState("");
  const [filterDate, setFilterDate] = useState("");
  
  const filteredList = filterDate
    ? list.filter(item => filterDate >= item.dateStart && filterDate <= item.dateEnd)
    : list;

  const showList = [...filteredList].sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return dateA - dateB;
  });

  const isAllDay = !form.timeStart && !form.timeEnd;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors("");
  };

  const toISO = (d, t) => {
    const [Y, M, D] = d.split("-").map(Number);
    const [h = 0, m = 0] = (t || "00:00").split(":").map(Number);
    const dt = new Date(Y, M - 1, D, h, m, 0);
    return dt.toISOString();
  };

  const handleAdd = (e) => {
    e.preventDefault();
    
    const { dateStart, timeStart, dateEnd, timeEnd, title, memo } = form;

    if (!dateStart || !title) {
      setErrors("시작 날짜와 제목은 필수입니다.");
      return;
    }

    const finalDateEnd = dateEnd || dateStart;
    const isAllDayInput = !timeStart && !timeEnd;

    if (!isAllDayInput) {
      if (!timeStart || !timeEnd) {
        setErrors("시작/종료 시간을 모두 입력해주세요.");
        return;
      }

      const start_time = toISO(dateStart, timeStart);
      const end_time = toISO(finalDateEnd, timeEnd);

      if (new Date(start_time) >= new Date(end_time)) {
        setErrors("종료시간은 시작시간보다 뒤여야 합니다.");
        return;
      }
    }

    addSchedule(form);
  };

  const onBack = () => setOpenSchedule(false);

  return (
    <div className="rounded-xl bg-gray-200 p-4 space-y-3 text-black h-full flex flex-col relative">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-800 text-lg z-10 shadow-sm border border-gray-300"
      >
        X
      </button>

      {/* 일정 리스트 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="text-center py-2 font-semibold mb-2">
          {isEditing ? "일정 수정" : "일정 리스트"}
        </div>

        {/* 날짜 필터 */}
        <div className="px-2 mb-2 flex gap-2 items-center">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 rounded-lg px-3 py-1 text-sm bg-white border border-gray-400"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-blue-600"
            >
              전체
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <ScheduleList
            openAdminDashboard={openAdminDashboard}
            openAdminPage={openAdminPage}
            openSchedule={openSchedule}
            list={showList}
            handleDelete={deleteSchedule}
            handleEdit={startEdit}
          />
        </div>
      </div>

      <form onSubmit={handleAdd} className="space-y-3">
        <div className="text-center py-2 font-semibold text-gray-800">
          일정추가
        </div>

        {/* 시작 날짜/시간 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">시작</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="dateStart"
              value={form.dateStart || ""}
              onChange={handleChange}
              className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
              required
            />
            <input
              type="time"
              name="timeStart"
              value={form.timeStart || ""}
              onChange={handleChange}
              placeholder="선택사항"
              className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">종료</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="dateEnd"
              value={form.dateEnd || ""}
              onChange={handleChange}
              placeholder="미입력시 시작일과 동일"
              className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
            />
            <input
              type="time"
              name="timeEnd"
              value={form.timeEnd || ""}
              onChange={handleChange}
              placeholder="선택사항"
              className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
            />
          </div>
        </div>

        {isAllDay && (
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
            시간을 입력하지 않으면 종일 일정으로 등록됩니다.
          </p>
        )}

        <input
          type="text"
          name="title"
          placeholder="제목"
          value={form.title || ""}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
          required
        />

        <textarea
          name="memo"
          placeholder="메모"
          value={form.memo || ""}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 bg-white border border-gray-400"
        />

        {errors && (
          <p className="text-red-600 text-sm bg-white rounded-xl px-3 py-2 border border-red-200">
            {errors}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!form.dateStart || !form.title}
            className={`flex-1 rounded-xl py-2 font-semibold text-white 
              ${!form.dateStart || !form.title 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-800 hover:bg-black"}`}
          >
            {isEditing ? "수정완료" : "등록"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 rounded-xl bg-gray-500 hover:bg-gray-600 py-2 font-semibold text-white"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}