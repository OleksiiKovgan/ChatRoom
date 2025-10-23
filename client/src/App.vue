
<template>
  <div v-if="!store.username" class="username-prompt">
    <h2>Enter your name to join</h2>
    <input v-model="inputUsername" @keyup.enter="joinChat" placeholder="Your name..." />
    <button @click="joinChat">Join</button>
  </div>
  <template v-else>
    <ChatRoomList />
    <main class="main-content">
      <router-view :key="$route.fullPath"></router-view>
    </main>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChatRoomList from '@/components/ChatRoomList.vue';
import { store } from '@/store';
import { webSocketService } from '@/services/useWebSocket.js';
import { useRoute } from 'vue-router';

const inputUsername = ref('');
const route = useRoute();

const joinChat = () => {
  if(inputUsername.value.trim()){
    store.setUsername(inputUsername.value.trim());
    connectWebSocket();
  }
};

const connectWebSocket = () => {
  webSocketService.connect(() => {
    // Subscribe to global activity once connected
    webSocketService.subscribe('/topic/activity', (notification: any) => {
      // Don't show notification for your own messages
      if (notification.sender === store.username) return;

      const isViewingRoom = String(route.params.roomId) === String(notification.roomId);

      if (!isViewingRoom) {
        store.incrementNewMessageCount(notification.roomId);
      }
    });
  });
};

onMounted(() => {
  if (store.username) {
    connectWebSocket();
  }
});
</script>


