<script setup>
import { onMounted } from 'vue';
import notesStore from './stores/notesStore.js';

// 监听回车键添加笔记
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    addNote();
  }
};

// 添加笔记的函数
const addNote = () => {
  const noteInput = document.getElementById('note-input');
  if (!noteInput || !noteInput.value.trim()) return; // 空内容不添加

  notesStore.addNote(noteInput.value.trim());
  noteInput.value = ''; // 清空输入框

  // 触发全局更新事件，通知其他组件更新统计数据
  window.dispatchEvent(new CustomEvent('dataUpdate'));
};
</script>
<template>
  <div id="note-content">
    <div v-for="note in notesStore.getAllNotes()" :key="note.id" class="note-item">
      <div class="note-text">{{ note.note }}</div>
      <div class="note-time">{{ note.time }}</div>
    </div>
    <div v-if="notesStore.notes.value.length === 0" class="empty-state">
      <mdui-icon name="note_add" size="48"></mdui-icon>
      <p>尚无笔记</p>
      <p class="empty-subtitle">记录所思乎</p>
    </div>
  </div>
  <mdui-text-field rows="1" placeholder="记述所思..." id="note-input" @keydown="handleKeyDown">
    <mdui-button-icon slot="end-icon" icon="add_circle" @click="addNote"></mdui-button-icon>
  </mdui-text-field>
</template>

<style scoped>
#note-input {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 600px;
  box-sizing: border-box;
  transition: bottom 0.5s ease;
}

#note-input:focus {
  z-index: 1000;
  bottom: calc(50% + env(safe-area-inset-bottom, 0px));
}

#note-content {
  width: 100%;
  word-wrap: break-word;
  overflow-y: auto;
  padding: 10px 0;
  scrollbar-width: none;
  height: calc(100% - 96px);
}

.note-item {
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  padding-left: 32px;
  margin-bottom: 8px;
  background-color: rgb(var(--mdui-color-surface-container));
  transition: background-color 0.2s ease;
}

.note-item:hover {
  background-color: rgb(var(--mdui-color-surface-container-high));
}

.note-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 4px;
  color: rgb(var(--mdui-color-on-surface));
}

.note-item::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 20px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--mdui-color-primary));
  z-index: 1;
}

.note-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 14px;
  top: 26px;
  width: 2px;
  height: calc(100% + 8px);
  background: rgba(var(--mdui-color-on-surface), 0.2);
  z-index: 100;
}

.note-item:first-child::after {
  top: 35px;
  height: calc(100% - 8px);
}

.note-time {
  font-size: 12px;
  color: rgba(var(--mdui-color-on-surface), 0.6);
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(var(--mdui-color-on-surface), 0.5);
  text-align: center;
}

.empty-subtitle {
  margin-top: 8px;
  font-size: 14px;
  color: rgba(var(--mdui-color-on-surface), 0.4);
}
</style>