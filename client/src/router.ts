import { createRouter, createWebHistory } from 'vue-router'
import ChatRoom from '@/components/ChatRoom.vue'

const routes = [
  {
    path: '/',
    component: {
      template: '<div class="chat-welcome">Select a room to start chatting</div>'
    }
  },
  {
    path: '/chat/:roomId',
    name: 'ChatRoom',
    component: ChatRoom,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
