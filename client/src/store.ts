import { reactive } from 'vue'

export const store = reactive({
  username: sessionStorage.getItem('username') || '',
  // Using Record for better type safety
  newMessageCounts: JSON.parse(localStorage.getItem('newMessageCounts') || '{}') as Record<number, number>,

  setUsername(name: string) {
    this.username = name;
    sessionStorage.setItem('username', name);
  },

  incrementNewMessageCount(roomId: number) {
    if (!this.newMessageCounts[roomId]) {
      this.newMessageCounts[roomId] = 0;
    }
    this.newMessageCounts[roomId]++;
    this.persistMessageCounts();
  },

  resetNewMessageCount(roomId: number) {
    this.newMessageCounts[roomId] = 0;
    this.persistMessageCounts();
  },

  persistMessageCounts() {
    localStorage.setItem('newMessageCounts', JSON.stringify(this.newMessageCounts));
  }
})