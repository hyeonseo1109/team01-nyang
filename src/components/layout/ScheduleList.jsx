import ScheduleAdd from './ScheduleAdd';

export default function ScheduleList({ list, handleDelete, handleEdit }) {
  return (
    <div className="rounded-lg border border-[#555] p-4 h-full w-full overflow-hidden">
      <ScheduleAdd list={list} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}