import { create } from 'zustand';

interface AppState {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

/**
 * Example global client store. Keep server data in TanStack Query — Zustand is
 * for genuinely client-owned state (UI, drafts, ephemeral flags).
 */
export const useAppStore = create<AppState>((set) => ({
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sidebarOpen: false,
}));
