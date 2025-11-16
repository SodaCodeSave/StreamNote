<script setup>
import { ref } from 'vue'
const notes = ref([]);
function editNote() {
  const noteInput = document.getElementById('note-input');
  if (!noteInput.value.trim()) return; // 空内容不添加
  notes.value.push({
    note: noteInput.value.trim(),
    time: new Date().toLocaleString()
  });
  noteInput.value = ''; // 清空输入框
}
</script>
<template>
  <div id="note-content">
    <div v-for="note in notes.slice().reverse()" :key="note.time" class="note-item">
      <div class="note-text">{{ note.note }}</div>
      <div class="note-time">{{ note.time }}</div>
    </div>
  </div>
  <mdui-text-field rows="1" placeholder="欲录之辞" id="note-input">
    <mdui-button-icon slot="end-icon" icon="edit_note" @click="editNote"></mdui-button-icon>
  </mdui-text-field>
</template>
<style>



#note-input {
  position: absolute;
  bottom: 90px;
  width: calc(100% - 40px);
  max-width: calc(600px - 40px);
  flex: 1;
  box-sizing: border-box;
}

#note-content {
  height: 100%;
  width: 100%;
  word-wrap: break-word;
  overflow-y: auto;
  scrollbar-width: none;
}
#note-content::-webkit-scrollbar {
  display: none;
}

.note-item {
  padding: 5px;
  border-radius: 5px;
  position: relative;
  padding-left: 20px;
}

.note-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.note-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 15px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--mdui-color-on-surface));
  border: 1px solid rgb(var(--mdui-color-on-surface));
  z-index: 1;
}

.note-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 15px;
  width: 2px;
  height: calc(100% + 6px);
  background: rgb(var(--mdui-color-on-surface));
}

.note-item:first-child::after {
  top: 30px;
  height: calc(100% - 6px);
}
.note-time {
  font-size: 10px;
  color: rgba(var(--mdui-color-on-surface), 0.7);
}
</style>