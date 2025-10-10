// src/components/Mypage/Mypage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useGetMyProfile, useUpdateMyProfile } from '../../api/users';

import MypageHeaderBar from './features/MypageHeaderBar';
import MypageMain from './features/MypageMain';
import MypageProfileEdit from './features/MypageProfileEdit';
import MypagePasswordChangeEdit from './features/MypagePasswordChangeEdit';
import Leave from './Leave';
import Modal from '../ui/Modal';
import Contact from './Contact/Contact';
import { useTicketsStore } from '../../store/useTicketsStore';

export default function MyPage({ open, onClose }) {
  const { getMyProfileData } = useGetMyProfile();
  const me = getMyProfileData;
  const [mode, setMode] = useState('main'); // 'main' | 'profile' | 'password' | 'leave'

  // 공통 알림 모달
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: '확인',
    cancelLabel: '닫기',
    onConfirm: null,
    onCancel: null,
  });

  // ★ 고객센터 모달
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState('ask'); // 'ask' | 'inbox' | 'reply'
  const tickets = useTicketsStore((s) => s.tickets);
  const setTickets = useTicketsStore((s) => s.setTickets);
  const [expandedId, setExpandedId] = useState(null);

  function openModal(opts) {
    const defaults = {
      title: '알림',
      message: '',
      confirmLabel: '확인',
      cancelLabel: '닫기',
      onConfirm: null,
      onCancel: null,
    };
    const o = { ...defaults, ...(opts || {}) };
    setModal({ open: true, ...o });
  }
  function closeModal(which) {
    const confirmFn = modal.onConfirm;
    const cancelFn = modal.onCancel;
    setModal({
      open: false,
      title: '',
      message: '',
      confirmLabel: '확인',
      cancelLabel: '닫기',
      onConfirm: null,
      onCancel: null,
    });
    if (which === 'confirm' && typeof confirmFn === 'function') confirmFn();
    if (which === 'cancel' && typeof cancelFn === 'function') cancelFn();
  }

  useEffect(() => {
    if (!open) setMode('main');
  }, [open]);

  const { updateMyProfileMutate } = useUpdateMyProfile();
  const [meLocal, setMeLocal] = useState(me);
  useEffect(() => {
    setMeLocal(me);
  }, [me]);
  function handleChangeProfile(patch) {
    // 1) 즉시 UI 반영
    setMeLocal((prev) => ({ ...(prev || {}), ...(patch || {}) }));
    // 2) 서버 반영
    updateMyProfileMutate(patch, {
      onSuccess: (next) => {
        // 서버 응답 병합. birthday 누락 방지
        const merged = { ...(meLocal || {}), ...(next || {}), ...(patch || {}) };
        setMeLocal(merged);
      },
    });
  }

  const showBack = useMemo(() => mode !== 'main', [mode]);

  function handleContact() {
    setContactOpen(true);
    setContactTab('ask'); // 처음엔 문의하기 탭으로
    setExpandedId(null); // 펼친 카드 초기화
  }
  function handleLogout() {
    openModal({ title: '로그아웃', message: '로그아웃 되었습니다.' });
  }
  function goMain() {
    setMode('main');
  }
  function goProfile() {
    setMode('profile');
  }
  function goPassword() {
    setMode('password');
  }
  function goLeave() {
    setMode('leave');
  }
  function notify(msg, title) {
    openModal({ title: title || '알림', message: msg });
  }

  // body
  function renderBody() {
    if (mode === 'main') {
      return (
        <MypageMain
          me={meLocal}
          onEdit={goProfile}
          onPassword={goPassword}
          onContact={handleContact}
          onLogout={handleLogout}
        />
      );
    }
    if (mode === 'profile') {
      return (
        <MypageProfileEdit
          me={meLocal}
          onChange={handleChangeProfile}
          onLogout={handleLogout}
          onLeave={goLeave}
          onNotify={notify}
          onDone={goMain}
        />
      );
    }
    if (mode === 'password') {
      return <MypagePasswordChangeEdit onDone={goMain} onNotify={notify} />;
    }
    if (mode === 'leave') {
      return <Leave onCancel={goMain} />;
    }
    return <div className="text-white">잘못된 상태입니다.</div>;
  }

  // modal footer
  function renderModalFooter() {
    if (typeof modal.onConfirm === 'function') {
      return (
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn-secondary" onClick={() => closeModal('cancel')}>
            {modal.cancelLabel}
          </button>
          <button type="button" className="btn" onClick={() => closeModal('confirm')}>
            {modal.confirmLabel}
          </button>
        </div>
      );
    }
    return (
      <div className="flex justify-end mt-4">
        <button type="button" className="btn" onClick={() => closeModal('cancel')}>
          {modal.cancelLabel}
        </button>
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[40] pointer-events-auto">
      {/* dim */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* panel */}
      <div className="absolute inset-0 p-2 sm:p-3 md:p-4">
        <div className="relative h-full w-full rounded-lg bg-[#121212] shadow-3d overflow-hidden flex flex-col">
          {/* sticky header */}
          <div className="sticky top-0 z-20 bg-[#121212] p-3 sm:p-4 border-b border-white/10">
            <MypageHeaderBar
              title="마이페이지"
              onClose={onClose}
              showBack={showBack}
              onBack={goMain}
              username={me?.username}
              email={me?.email}
              birthday={me?.birthday ? String(me.birthday).slice(0, 10) : undefined}
              image={me?.profile_image}
            />
          </div>

          {/* body */}
          <div className="flex-1 overflow-auto custom-scroll p-2 sm:p-4">{renderBody()}</div>
        </div>
      </div>

      {/* 공통 알림 모달 */}
      {modal.open ? (
        <div className="fixed inset-0 z-[100]">
          <Modal
            openModal={modal.open}
            title={modal.title}
            onClose={() => closeModal('cancel')}
            footer={renderModalFooter()}
          >
            <p className="mt-3 text-white">{modal.message}</p>
          </Modal>
        </div>
      ) : null}

      <Contact
        open={contactOpen}
        tab={contactTab}
        setTab={setContactTab}
        onClose={() => setContactOpen(false)}
        tickets={tickets}
        setTickets={setTickets}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        isAdmin={me?.is_superuser === true}
        adminOnlyReply={false}
      />
    </div>
  );
}
