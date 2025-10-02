// src/components/Mypage/Contact/TicketCard.jsx
export default function TicketCard({
  ticket,
  isReplyTab,

  expandedId,
  setExpandedId,

  isAdmin = false,
  onDeleteTicket,

  editingId,
  editTitle,
  editBody,
  startEdit,
  cancelEdit,
  setEditTitle,
  setEditBody,
  saveEdit,

  replyDrafts = {},
  setReplyDrafts,
  submitReply,
}) {
  const isOpen = expandedId === ticket.id;
  const isEditing = editingId === ticket.id;
  const STATUS_LABEL = { pending: '처리중', resolved: '완료' };
  const status = ticket?.status ?? '';
  const statusLabel = STATUS_LABEL[status] ?? status;
  const isPending = ticket?.status === 'pending';
  const canUserEdit = !isReplyTab && isPending;
  const canUserDelete = !isReplyTab && isPending;
  const canAdminDelete = !!isAdmin || !!isReplyTab; // 관리자 탭이면 항상 삭제 가능

  const resultText = ticket.answer ?? '완료된 문의입니다.';
  const replyPlaceholder = '사용자에게 보낼 답변을 입력하세요.'; // 완료건은 입력창 자체를 렌더하지 않음
  const hasDraft = Object.prototype.hasOwnProperty.call(replyDrafts, ticket.id);
  const replyValue = (() => {
    if (hasDraft) return replyDrafts[ticket.id] ?? '';
    if (isPending) return ticket.answer ?? '';
    return '';
  })();

  // 편집 여부에 따른 제목/본문 텍스트 분기(삼항 제거)
  const titleText = isEditing ? editTitle : ticket.title;
  const bodyText = isEditing ? editBody : ticket.body;

  return (
    // 개별 문의
    <div className="border rounded p-3 border-[#404856]">
      {/* 헤더 */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`ticket-panel-${ticket.id}`}
        onClick={() => {
          if (editingId && editingId !== ticket.id) cancelEdit();
          if (isEditing && isOpen) return; // 편집 중일 때 닫힘 방지
          setExpandedId(isOpen ? null : ticket.id);
        }}
        className="w-full text-left cursor-pointer select-none rounded"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-sm font-semibold">
            [{statusLabel}] {titleText}
          </div>
          <div className="text-xs shrink-0">{ticket.time}</div>
        </div>
        <div className="text-sm mt-1 line-clamp-2 ">{bodyText}</div>
      </button>

      {(canUserEdit || canUserDelete || canAdminDelete) && (
        <div className="mt-2 flex justify-end gap-3">
          {canUserEdit && (
            <button
              className="text-xs underline"
              onClick={() => {
                if (!isOpen) setExpandedId(ticket.id);
                startEdit(ticket);
              }}
            >
              수정
            </button>
          )}
          {(canUserDelete || canAdminDelete) && (
            <button
              className="text-xs underline text-red-400"
              onClick={() => onDeleteTicket && onDeleteTicket(ticket)}
            >
              삭제
            </button>
          )}
        </div>
      )}

      {/* 바디 */}
      <div
        id={`ticket-panel-${ticket.id}`}
        className={[
          'mt-2 overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="pt-2 border-t text-sm">
          {(() => {
            // 편집 모드
            if (isEditing) {
              return (
                <form className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-xs">제목</label>
                    <input
                      className="input"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      placeholder="제목을 입력하세요."
                    />
                  </div>
                  <div className="space-y-1 flex-1 flex flex-col">
                    <label className="text-xs">내용</label>
                    <textarea
                      className="input min-h-[8rem]"
                      value={editBody}
                      onChange={(event) => setEditBody(event.target.value)}
                      placeholder="문의 내용을 입력하세요."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={cancelEdit}>
                      취소
                    </button>
                    <button type="button" className="btn" onClick={() => saveEdit(ticket)}>
                      완료
                    </button>
                  </div>
                </form>
              );
            }

            // 보기 모드 - 처리중
            if (isPending) {
              return (
                <div className="">
                  <div className="font-medium">답변 대기중입니다.</div>
                  <div>
                    영업시간은 <b>09:00 ~ 18:00</b> 입니다. 조금만 기다려주세요.
                  </div>

                  {/* 관리자 답변 영역: 패널 내부에 있어 패널 닫히면 같이 숨김 */}
                  {isAdmin && isReplyTab && (
                    <div className="mt-3 p-3 border rounded bg-neutral-900 border-white/10">
                      <div className="text-xs mb-2">관리자 답변</div>
                      <textarea
                        className="input min-h-[7rem]"
                        placeholder={replyPlaceholder}
                        value={replyValue}
                        onChange={(event) =>
                          setReplyDrafts((prev) => ({
                            ...prev,
                            [ticket.id]: event.target.value ?? '',
                          }))
                        }
                        onKeyDown={(event) => {
                          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                            const trimmed = (replyDrafts[ticket.id] ?? '').trim();
                            if (trimmed) submitReply(ticket.id);
                          }
                        }}
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setReplyDrafts((prev) => ({ ...prev, [ticket.id]: '' }))}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className="btn"
                          disabled={!(replyDrafts[ticket.id] ?? '').trim()}
                          onClick={() => submitReply(ticket.id)}
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 보기 모드 - 완료
            return (
              <div className="space-y-1">
                <div className=" font-semibold">처리 결과</div>
                <div className="opacity-50 whitespace-pre-wrap">{resultText}</div>

                {/* 완료 상태에서 안내도 패널 내부에 두어 함께 접힘 */}
                {isReplyTab && (
                  <div className="mt-3 p-3 border rounded bg-neutral-900 text-neutral-400 border-white/10">
                    이 답변은 이미 완료되었습니다.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
