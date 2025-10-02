// src/components/Mypage/Contact/useTicketActions.jsx
import { useEffect, useRef, useState } from 'react';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { formatSeoul } from './dateUtil';
import {
  getAllInquiries, // 관리자: 전체 목록
  getInquiries, // 사용자: 내 목록
  createInquiry, // POST /inquiries
  updateInquiry, // PATCH /inquiries/{id}  (status, admin_reply, replied_at)
  deleteInquiry, // DELETE /inquiries/{id}
} from '../../../api/inquiries';
import { api } from '../../../api/client'; // 사용자 편집: PATCH /inquiries/me/{id}

function mapApiInquiryToUiTicket(apiInquiry) {
  return {
    id: apiInquiry.id,
    status: apiInquiry.status ?? null, // 'pending' | 'resolved'
    title: apiInquiry.title,
    body: apiInquiry.message,
    answer: apiInquiry.admin_reply ?? null,
    time: formatSeoul(apiInquiry.created_at || new Date()),
  };
}

export default function useTicketActions({ isAdmin = false } = {}) {
  // 전역 목록
  const tickets = useTicketsStore((state) => state.tickets);
  const setTickets = useTicketsStore((state) => state.setTickets);

  // 사용자 편집 상태
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  // 관리자 답변 draft
  const [replyDrafts, setReplyDrafts] = useState({}); // { [inquiryId]: string }

  // 알림 모달 상태(브라우저 alert 금지)
  const [noticeModal, setNoticeModal] = useState({ open: false, title: '알림', message: '' });
  const showInfo = (message, title = '알림') => setNoticeModal({ open: true, title, message });

  const isMountedRef = useRef(true);

  // 목록 로드: 관리자=전체, 사용자=내 목록
  useEffect(() => {
    isMountedRef.current = true;
    (async () => {
      try {
        const response = isAdmin ? await getAllInquiries() : await getInquiries();
        if (!isMountedRef.current) return;
        const inquiriesArray = Array.isArray(response) ? response : response?.inquiries || [];
        setTickets(inquiriesArray.map(mapApiInquiryToUiTicket));
      } catch {
        if (!isMountedRef.current) return;
        showInfo('문의 목록을 불러오지 못했습니다.');
      }
    })();
    return () => {
      isMountedRef.current = false;
    };
  }, [isAdmin, setTickets]);

  // 생성: { title, message } (body 호환)
  const submitAsk = async ({ title, body, message }) => {
    const messageValue = typeof message === 'string' ? message : body;
    if (!title?.trim() || !messageValue?.trim()) {
      showInfo('제목과 내용을 입력해 주세요.');
      return null;
    }
    try {
      const createdInquiry = await createInquiry({ title, message: messageValue });
      const createdTicket = mapApiInquiryToUiTicket(createdInquiry);
      setTickets((prev) => [createdTicket, ...prev]);
      showInfo('문의가 접수되었습니다.', '완료');
      return createdTicket;
    } catch {
      showInfo('문의 접수에 실패했습니다.');
      return null;
    }
  };

  // 사용자 편집: PATCH /inquiries/me/{id}
  const startEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditTitle(ticket.title || '');
    setEditBody(ticket.body || '');
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
  };
  const saveEdit = async (ticket) => {
    const nextTitle = (editTitle || '').trim();
    const nextMessage = (editBody || '').trim();
    if (!nextTitle) return showInfo('제목을 입력해 주세요.');
    if (!nextMessage) return showInfo('내용을 입력해 주세요.');
    try {
      const { data: updated } = await api.patch(`/inquiries/me/${ticket.id}`, {
        title: nextTitle,
        message: nextMessage,
      });
      setTickets((prev) =>
        prev.map((item) =>
          item.id === ticket.id
            ? { ...item, title: updated?.title ?? nextTitle, body: updated?.message ?? nextMessage }
            : item,
        ),
      );
      setEditingId(null);
      showInfo('수정이 반영되었습니다.', '완료');
    } catch {
      showInfo('수정에 실패했습니다.');
    }
  };

  // 삭제: 관리자만 실제 삭제. 사용자 삭제는 TODO(/inquiries/me/{id})
  const [confirm, setConfirm] = useState({ open: false, target: null });
  const askDelete = (ticket) => setConfirm({ open: true, target: ticket });
  const cancelDelete = () => setConfirm({ open: false, target: null });
  const confirmDelete = async () => {
    const targetTicket = confirm.target;
    if (!targetTicket) return cancelDelete();

    if (isAdmin) {
      try {
        await deleteInquiry(targetTicket.id);
        setTickets((prev) => prev.filter((item) => item.id !== targetTicket.id));
        showInfo('문의가 삭제되었습니다.', '완료');
      } catch {
        showInfo('삭제에 실패했습니다.');
      } finally {
        cancelDelete();
      }
      return;
    }

    showInfo('사용자 문의 삭제는 준비 중입니다.');
    cancelDelete();
  };

  // 관리자: 상태 변경
  const adminSetStatus = async (inquiryId, nextStatus, repliedAtISO) => {
    if (!isAdmin) return showInfo('관리자 전용 기능입니다.');
    try {
      const payload = { status: nextStatus };
      if (repliedAtISO) payload.replied_at = repliedAtISO;
      const updated = await updateInquiry(inquiryId, payload);
      setTickets((prev) =>
        prev.map((item) =>
          item.id === inquiryId ? { ...item, status: updated.status ?? nextStatus } : item,
        ),
      );
      showInfo('상태가 변경되었습니다.', '완료');
    } catch {
      showInfo('상태 변경에 실패했습니다.');
    }
  };

  // 관리자: 답변 등록/수정
  const submitReply = async (inquiryId, markResolved = true) => {
    if (!isAdmin) return showInfo('관리자 전용 기능입니다.');
    const draftText = (replyDrafts[inquiryId] || '').trim();
    if (!draftText) return showInfo('답변 내용을 입력해 주세요.');
    try {
      const nowIso = new Date().toISOString();
      const payload = { admin_reply: draftText, replied_at: nowIso };
      if (markResolved) payload.status = 'resolved';
      const updated = await updateInquiry(inquiryId, payload);
      setTickets((prev) =>
        prev.map((item) =>
          item.id === inquiryId
            ? {
                ...item,
                answer: updated.admin_reply ?? draftText,
                status: updated.status ?? (markResolved ? 'resolved' : item.status),
              }
            : item,
        ),
      );
      setReplyDrafts((prev) => ({ ...prev, [inquiryId]: '' }));
      showInfo('답변이 저장되었습니다.', '완료');
    } catch {
      showInfo('답변 저장에 실패했습니다.');
    }
  };

  return {
    // 데이터
    tickets,
    setTickets,

    // 생성
    submitAsk,

    // 사용자 편집
    startEdit,
    cancelEdit,
    saveEdit,
    editingId,
    editTitle,
    setEditTitle,
    editBody,
    setEditBody,

    // 삭제
    confirm,
    askDelete,
    cancelDelete,
    confirmDelete,

    // 관리자
    adminSetStatus,
    submitReply,
    replyDrafts,
    setReplyDrafts,

    // 알림 모달
    noticeModal,
    setNoticeModal,
    showInfo,
  };
}
