import { create } from 'zustand';

interface LibraryState {
  // Empty for this phase
}

export const useLibraryStore = create<LibraryState>((set) => ({}));
