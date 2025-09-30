import { useEffect, useRef, useState } from 'react';
import { useTicketsStore } from '../../../store/useTicketsStore';
import { formatSeoul } from './dateUtil';
import { getInquiries, createInquiry, updateInquiry } from '../../../api/inquiries';

function mapApiTicketToUi(apiTicket) {
  const createdAtValue = apiTicket.createdAt || new Date();
  const uiTicket = {
    id: apiTicket.id,
    status: apiTicket.status || '처리중',
    title: apiTicket.title,
    body: apiTicket.message,
    answer: typeof apiTicket.answer === 'string' ? apiTicket.answer : null,
    time: formatSeoul(createdAtValue),
  };
  return uiTicket;
}

export default function useTicketActions() {
  // Zustand tickets
  const tickets = useTicketsStore((state) => state.tickets);
  const setTickets = useTicketsStore((state) => state.setTickets);

  // 편집/답변 draft/알림 상태
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({}); // { [id]: string }
  const [alert, setAlert] = useState({ open: false, title: '알림', message: '' });
  const showInfo = (message, title = '알림') => setAlert({ open: true, title, message });

  const isComponentAliveRef = useRef(true);

  useEffect(() => {
    isComponentAliveRef.current = true;
    (async () => {
      try {
        const response = await getInquiries(); // ← 교체
        if (!isComponentAliveRef.current) return;
        const items = Array.isArray(response) ? response : [];
        setTickets(items.map(mapApiTicketToUi));
      } catch {
        if (!isComponentAliveRef.current) return;
        showInfo('문의 목록을 불러오지 못했습니다.');
      }
    })();
    return () => {
      isComponentAliveRef.current = false;
    };
  }, [setTickets]);

  // 제출
  const submitAsk = async ({ title, message }) => {
    try {
      const created = await createInquiry({ title, message });
      const uiTicket = mapApiTicketToUi(created);
      setTickets((prev) => [uiTicket, ...prev]);
      showInfo('문의가 접수되었습니다.');
      return uiTicket;
    } catch {
      showInfo('문의 접수에 실패했습니다.');
      return null;
    }
  };

  // 편집
  const startEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditTitle(ticket.title);
    setEditBody(ticket.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
  };

  const saveEdit = async (ticket) => {
    const titleTrimmed = typeof editTitle === 'string' ? editTitle.trim() : '';
    const bodyTrimmed = typeof editBody === 'string' ? editBody.trim() : '';
    if (!titleTrimmed) {
      showInfo('제목을 입력해 주세요.');
      return;
    }
    if (!bodyTrimmed) {
      showInfo('내용을 입력해 주세요.');
      return;
    }

    try {
      await updateInquiry(ticket.id, { title: titleTrimmed, message: bodyTrimmed }); // ← message로 전송
      setTickets((prev) =>
        prev.map((it) =>
          it.id === ticket.id ? { ...it, title: titleTrimmed, body: bodyTrimmed } : it,
        ),
      );
      setEditingId(null);
      showInfo('수정이 반영되었습니다.');
    } catch {
      showInfo('수정에 실패했습니다.');
    }
  };

  // 답변
  const submitReply = async () => {
    showInfo('답변 API가 제공되지 않습니다.');
  };

  return {
    tickets,
    setTickets,
    submitAsk,
    startEdit,
    cancelEdit,
    saveEdit,
    submitReply,
    editingId,
    editTitle,
    setEditTitle,
    editBody,
    setEditBody,
    replyDrafts,
    setReplyDrafts,
    alert,
    setAlert,
    showInfo,
  };
}
