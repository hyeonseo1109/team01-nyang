import ScheduleList from './ScheduleList';
import { useSchedule } from '../../store/useSchedule';
import { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

export default function ScheduleForm({
  setOpenSchedule,
  openAdminDashboard,
  openAdminPage,
  openSchedule,
}) {
  const { form, list, isEditing, setForm, addSchedule, deleteSchedule, startEdit, cancelEdit } =
    useSchedule();

  const [errors, setErrors] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredList = filterDate
    ? list.filter((item) => filterDate >= item.dateStart && filterDate <= item.dateEnd)
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
    setErrors('');
  };

  const toISO = (d, t) => {
    const [Y, M, D] = d.split('-').map(Number);
    const [h = 0, m = 0] = (t || '00:00').split(':').map(Number);
    const dt = new Date(Y, M - 1, D, h, m, 0);
    return dt.toISOString();
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const { dateStart, timeStart, dateEnd, timeEnd, title, memo } = form;

    if (!dateStart || !dateEnd || !title) {
      setErrors('날짜와 제목은 필수입니다.');
      return;
    }

    const isAllDayInput = !timeStart && !timeEnd;

    if (!isAllDayInput) {
      if (!timeStart || !timeEnd) {
        setErrors('시작/종료 시간을 모두 입력해주세요.');
        return;
      }

      const start_time = toISO(dateStart, timeStart);
      const end_time = toISO(dateEnd, timeEnd);

      if (new Date(start_time) >= new Date(end_time)) {
        setErrors('종료시간은 시작시간보다 뒤여야 합니다.');
        return;
      }
    }

    addSchedule(form);
  };

  const onBack = () => setOpenSchedule(false);

  return (
    <div className="rounded-xl bg-[#1c1c1c] border border-[#333] p-4 space-y-3 h-full flex flex-col relative overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-sm"
      >
        <VscChromeClose />
      </button>

      {/* 일정 리스트 */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="text-center py-2 font-semibold mb-2">
          {isEditing ? '일정 수정' : '일정 리스트'}
        </div>

        {/* 날짜 필터 */}
        <div className="px-2 mb-2 flex gap-2 items-center lg:flex-row flex-col flex-shrink-0">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 rounded-lg px-3 py-1 text-sm border border-[#555] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 "
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-[#3e6f97] hover:text-[#1b4567]"
            >
              전체
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
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

      <form onSubmit={handleAdd} className="space-y-3 flex-shrink-0">
        <div className="text-center py-2 font-semibold">일정추가</div>
        {/* 시작 날짜/시간 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">시작</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="dateStart"
              value={form.dateStart || ''}
              onChange={handleChange}
              className="w-full rounded-xl px-3 py-2 border border-[#555] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 "
              required
            />
            <input
              type="time"
              name="timeStart"
              value={form.timeStart || ''}
              onChange={handleChange}
              placeholder="선택사항"
              className="w-full rounded-xl px-3 py-2 border border-[#555] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">종료</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="dateEnd"
              value={form.dateEnd || ''}
              onChange={handleChange}
              className="w-full rounded-xl px-3 py-2 border border-[#555] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 "
              required
            />
            <input
              type="time"
              name="timeEnd"
              value={form.timeEnd || ''}
              onChange={handleChange}
              placeholder="선택사항"
              className="w-full rounded-xl px-3 py-2 border border-[#555] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200"
            />
          </div>
        </div>
        <div className="h-10">
          {isAllDay && (
            <p className="text-xs text-[#777] px-3 py-2">
              시간을 입력하지 않으면 종일 일정으로 등록됩니다.
            </p>
          )}
        </div>
        <input
          type="text"
          name="title"
          placeholder="제목"
          value={form.title || ''}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 border border-[#555]"
          required
        />
        <textarea
          name="memo"
          placeholder="메모"
          value={form.memo || ''}
          onChange={handleChange}
          className="w-full rounded-xl px-3 py-2 border border-[#555]  resize-none"
        />
        {errors && (
          <p className="text-red-700 text-sm rounded-xl px-3 py-2 border border-red-200">
            {errors}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!form.dateStart || !form.dateEnd || !form.title}
            className={`flex-1 rounded-lg px-4 py-3 font-medium text-sm
              ${
                !form.dateStart || !form.dateEnd || !form.title
                  ? 'bg-[#555] cursor-not-allowed'
                  : 'bg-[#2d5b81] hover:bg-[#1b4567]'
              }`}
          >
            {isEditing ? '수정완료' : '등록'}
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