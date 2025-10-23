      
<template>
  <div class="chat-room-container">
    <div class="messages-list" ref="messagesContainer">
      <div v-for="msg in messages" :key="msg.id" 
           class="message" 
           :class="{'my-message': msg.sender === store.username, 'other-message': msg.sender !== store.username}">
        <div class="message-bubble">
          <div v-if="msg.sender !== store.username" class="message-sender">{{ msg.sender }}</div>
          <p class="message-content">{{ msg.content }}</p>
          <div class="message-meta">{{ formatTimestamp(msg.timestamp) }}</div>
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="message-form">
      <input v-model="newMessage" placeholder="Type a message..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { store } from '@/store';
import { api, type ChatMessage } from '@/services/api';
import { webSocketService } from '@/services/useWebSocket.js';
import { useRoute } from 'vue-router';

const props = defineProps<{ roomId: string }>();
const route = useRoute();

const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
let subscription: any = null;

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const fetchMessages = async (id: string) => {
  try {
    messages.value = await api.getRoomMessages(Number(id));
    scrollToBottom();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const sendMessage = () => {
  if (newMessage.value.trim() && store.username) {
    const chatMessage = {
      sender: store.username,
      content: newMessage.value.trim(),
    };
    webSocketService.sendMessage(`/app/chat/${props.roomId}/sendMessage`, chatMessage);
    newMessage.value = '';
  }
};

const setupSubscription = (id: string) => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = webSocketService.subscribe(`/topic/chatrooms/${id}`, (message: ChatMessage) => {
      messages.value.push(message);
      scrollToBottom();
    });
};

// When the component mounts or the route changes...
watch(() => props.roomId, (newRoomId) => {
  if (newRoomId) {
    fetchMessages(newRoomId);
    store.resetNewMessageCount(Number(newRoomId));
    if (webSocketService.connected) {
      setupSubscription(newRoomId);
    }
  }
}, { immediate: true });

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});
</script>

    