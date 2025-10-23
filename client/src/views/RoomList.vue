
<!-- file: client/src/views/RoomList.vue -->
<template>
  <aside class="sidebar">
    <h2 class="room-list-header">Chat Rooms</h2>
    <ul class="room-list">
      <li v-for="room in rooms" :key="room.id" class="room-list-item">
        <router-link :to="`/chat/${room.id}`">
          <span># {{ room.name }}</span>
          <span v-if="store.newMessageCounts[room.id] > 0" class="new-message-badge">
            {{ store.newMessageCounts[room.id] }}
          </span>
        </router-link>
      </li>
    </ul>
    <form @submit.prevent="createNewRoom" class="new-room-form">
      <input v-model="newRoomName" placeholder="Create new room" required />
      <button type="submit">+</button>
    </form>
  </aside>
</template>

<script setup lang="ts">
// --- NEW: Import watch ---
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { store } from '@/common/store';
import { api, type ChatRoom } from '@/common/api';
import { webSocketService } from '@/common/useWebSocket.js';

const rooms = ref<ChatRoom[]>([]);
const newRoomName = ref('');
let roomSubscription: any = null;

const fetchRooms = async () => {
  try {
    rooms.value = await api.getChatRooms();
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
  }
};

const createNewRoom = async () => {
  if (!newRoomName.value.trim()) return;
  try {
    await api.createChatRoom(newRoomName.value.trim());
    newRoomName.value = '';
  } catch (error) {
    console.error('Failed to create room:', error);
    alert('A room with this name may already exist.');
  }
};

// --- NEW REACTIVE APPROACH ---
// We watch the 'connected' state from our WebSocket service.
watch(webSocketService.connected, (isConnected) => {
  // This function will run whenever the connection status changes.
  if (isConnected) {
    console.log('Connection is ready. Subscribing to room updates...');
    // If we are not already subscribed, create the subscription.
    if (!roomSubscription) {
      roomSubscription = webSocketService.subscribe('/topic/rooms', () => {
        console.log('Received room update signal. Refetching list...');
        fetchRooms();
      });
    }
  } else {
    // If the connection drops, we can clean up the old subscription.
    if (roomSubscription) {
      roomSubscription.unsubscribe();
      roomSubscription = null;
      console.log('Connection lost. Unsubscribed from room updates.');
    }
  }
}, { immediate: true }); // 'immediate: true' makes it run once on component load.


// We still need onMounted to fetch the initial list.
onMounted(() => {
  fetchRooms();
});

// We still need onUnmounted to clean up when we leave the page.
onUnmounted(() => {
  if (roomSubscription) {
    roomSubscription.unsubscribe();
  }
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}
.form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
.room-list li {
  margin: 0.5rem 0;
}
</style>