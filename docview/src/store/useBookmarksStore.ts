import { create } from 'zustand';

interface BookmarksState {
  // Empty for this phase
}

export const useBookmarksStore = create<BookmarksState>((set) => ({}));
