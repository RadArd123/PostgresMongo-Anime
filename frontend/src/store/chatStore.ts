import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  anime_id?: number | null;
  created_at: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  anime_title?: string;
  img_url_icon?: string;
  img_url_banner?: string;
  rating?: number;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isConnected: boolean;
  initSocket: () => void;
  disconnectSocket: () => void;
  fetchMessages: () => Promise<void>;
  sendMessage: (message: string, animeId?: number | null) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,

  initSocket: () => {
    const existingSocket = get().socket;
    if (existingSocket && existingSocket.connected) return;

    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to live chat socket');
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from live chat socket');
      set({ isConnected: false });
    });

    newSocket.on('new_message', (msg: ChatMessage) => {
      set((state) => {
        // Prevent duplicates
        if (state.messages.some((m) => m.id === msg.id)) {
          return state;
        }
        return { messages: [...state.messages, msg] };
      });
    });

    newSocket.on('delete_message', (deletedId: number) => {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== Number(deletedId))
      }));
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/chat/messages');
      set({ messages: response.data.messages || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (message: string, animeId?: number | null) => {
    try {
      const response = await axiosInstance.post('/chat/send', {
        message,
        animeId: animeId || null
      });
      // Fallback in case socket didn't catch it
      const newMsg = response.data.chatMessage;
      if (newMsg) {
        set((state) => {
          if (state.messages.some((m) => m.id === newMsg.id)) return state;
          return { messages: [...state.messages, newMsg] };
        });
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      throw err;
    }
  },

  deleteMessage: async (id: number) => {
    try {
      await axiosInstance.delete(`/chat/delete/${id}`);
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id)
      }));
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }
}));
