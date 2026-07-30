import { create } from 'zustand';

interface ReaderState {
  // Empty for this phase
}

export const useReaderStore = create<ReaderState>((set) => ({}));
