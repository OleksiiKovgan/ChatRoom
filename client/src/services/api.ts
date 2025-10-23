import axios from 'axios'

// apiClient is configured to use the proxy in vite.config.ts
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export interface ChatRoom {
  id: number;
  name: string;
}

export interface ChatMessage {
    id: number;
    chatRoom: ChatRoom;
    sender: string;
    content: string;
    timestamp: string; // ISO string from backend
}

export const api = {
  getChatRooms(): Promise<ChatRoom[]> {
    return apiClient.get('/chatrooms').then(res => res.data)
  },
  createChatRoom(name: string): Promise<ChatRoom> {
    return apiClient.post('/chatrooms', { name }).then(res => res.data)
  },
  getRoomMessages(roomId: number): Promise<ChatMessage[]> {
    return apiClient.get(`/chatrooms/${roomId}/messages`).then(res => res.data)
  },
}