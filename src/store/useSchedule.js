import { create } from "zustand";

const initialForm = {
  dateStart: "",
  timeStart: "",
  dateEnd: "",
  timeEnd: "",
  title: "",
  memo: "",
};

const toISO = (d, t) => {
  const [Y, M, D] = (d || "").split("-").map(Number);
  const [h = 0, m = 0] = (t || "00:00").split(":").map(Number);
  const dt = new Date(Y, M - 1, D, h, m, 0);
  return dt.toISOString();
};

export const useSchedule = create((set, get) => ({
  list: [],
  form: { ...initialForm },
  isEditing: false,
  editingId: null,

  setForm: (patch) => set({ form: { ...get().form, ...patch } }),
  resetForm: () => set({ form: { ...initialForm } }),

  addSchedule: (payload) =>
    set((state) => {
      const src = payload || state.form;

      if (!src.title?.trim() || !src.dateStart) return state;

      const finalDateEnd = src.dateEnd || src.dateStart;
      const hasTimeStart = src.timeStart && src.timeStart.trim() !== '';
      const hasTimeEnd = src.timeEnd && src.timeEnd.trim() !== '';
      const isAllDay = !hasTimeStart && !hasTimeEnd;
      
      let start_time, end_time;
      
      if (isAllDay) {
        start_time = toISO(src.dateStart, "00:00");
        end_time = toISO(finalDateEnd, "23:59");
      } else {
        let useStartTime = src.timeStart;
        let useEndTime = src.timeEnd;
        
        if (!hasTimeEnd && hasTimeStart) {
          useEndTime = src.timeStart;
        }
        
        start_time = toISO(src.dateStart, useStartTime);
        end_time = toISO(finalDateEnd, useEndTime);
        
        if (hasTimeStart && hasTimeEnd) {
          if (new Date(start_time) >= new Date(end_time)) return state;
        }
      }

      const base = {
        title: src.title.trim(),
        memo: src.memo || "",
        dateStart: src.dateStart,
        dateEnd: finalDateEnd,
        timeStart: isAllDay ? "" : src.timeStart,
        timeEnd: isAllDay ? "" : src.timeEnd,
        start_time,
        end_time,
        all_day: isAllDay,
      };

      if (state.isEditing && state.editingId !== null) {
        return {
          list: state.list.map((it) =>
            it.id === state.editingId ? { ...it, ...base } : it
          ),
          form: { ...initialForm },
          isEditing: false,
          editingId: null,
        };
      }

      const newItem = { id: Date.now(), ...base };
      return {
        list: [...state.list, newItem],
        form: { ...initialForm },
      };
    }),

  deleteSchedule: (id) =>
    set((state) => ({
      list: state.list.filter((item) => item.id !== id),
    })),

  startEdit: (item) =>
    set(() => {
      return {
        form: {
          dateStart: item.dateStart,
          timeStart: item.all_day ? "" : item.timeStart,
          dateEnd: item.all_day ? "" : item.dateEnd,
          timeEnd: item.all_day ? "" : item.timeEnd,
          title: item.title,
          memo: item.memo || "",
        },
        isEditing: true,
        editingId: item.id,
      };
    }),

  cancelEdit: () =>
    set({
      isEditing: false,
      editingId: null,
      form: { ...initialForm },
    }),
}));