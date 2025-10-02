// src/components/Mypage/Contact/TicketToolbar.jsx
export default function TicketToolbar({
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput,
  applySearch,
}) {
  return (
    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 ml-1">
        <select
          className="input w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="pending">처리중</option>
          <option value="resolved">완료</option>
        </select>
      </div>

      <div className="flex items-center gap-2 w-full md:w-[480px]">
        <input
          className="input"
          placeholder="제목+내용 검색어를 입력하세요"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applySearch()}
        />
        <button type="button" onClick={applySearch} className="btn w-24">
          검색
        </button>
      </div>
    </div>
  );
}
