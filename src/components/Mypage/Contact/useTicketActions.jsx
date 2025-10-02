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
        // setTickets(items.map(mapApiTicketToUi));

        // 1) API → UI
        const apiUI = items.map(mapApiTicketToUi);

        // 2) 더미 데이터
        const DUMMY = [
          {
            id: 'dummy-1',
            status: '처리중',
            title: '샘플 문의 1',
            message: '본문 예시 1',
            answer: null,
            createdAt: new Date(),
          },
          {
            id: 'dummy-2',
            status: '완료',
            title: '샘플 문의 2',
            message: '본문 예시 2',
            answer: '처리 완료',
            createdAt: new Date(Date.now() - 86400000),
          },
        ];
        const dummyUI = DUMMY.map(mapApiTicketToUi);

        // 3) 중복 id 방지 후 합치기(API 우선)
        const byId = new Map(apiUI.map((t) => [String(t.id), t]));
        for (const t of dummyUI) {
          const key = String(t.id);
          if (!byId.has(key)) byId.set(key, t);
        }
        setTickets(Array.from(byId.values())); //여기까지 더미데이터+api
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

  // 삭제 확인 모달
  const [confirm, setConfirm] = useState({ open: false, target: null });
  const askDelete = (ticket) => setConfirm({ open: true, target: ticket });
  const cancelDelete = () => setConfirm({ open: false, target: null });
  const confirmDelete = () => {
    const t = confirm.target;
    if (t) {
      setTickets((prev) => prev.filter((x) => x.id !== t.id));
      showInfo('문의가 삭제되었습니다.');
    }
    cancelDelete();
  };

  // 답변
  const submitReply = async () => {
    showInfo('답변 API가 제공되지 않습니다.');
  };

  return {
    tickets,
    setTickets,
    confirm,
    askDelete,
    cancelDelete,
    confirmDelete,
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
