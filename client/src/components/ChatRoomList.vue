
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
import { ref, onMounted } from 'vue';
import { store } from '@/store';
import { api, type ChatRoom } from '@/services/api';

const rooms = ref<ChatRoom[]>([]);
const newRoomName = ref('');

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
    await fetchRooms(); // Refresh list
  } catch (error) {
    console.error('Failed to create room:', error);
    alert('A room with this name may already exist.');
  }
};

onMounted(fetchRooms);
</script>


