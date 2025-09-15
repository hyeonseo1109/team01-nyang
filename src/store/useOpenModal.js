import { create } from "zustand";

export const useOpenModal = create((set) => ({
openModal: '',
setOpenModal: (openModal)=>set({openModal}),
}))