<script setup>
import { onMounted, ref } from 'vue';
import notesStore from './stores/notesStore.js';

// 编辑相关状态
const isEditing = ref(false);
const editingNoteId = ref(null);
const editContent = ref('');

// 删除确认相关状态
const showDeleteConfirm = ref(false);

// 长按相关状态
const longPressTimer = ref(null);
const currentNoteId = ref(null);
const menuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const isLongPressing = ref(false);
const longPressNoteId = ref(null);

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

// 开始长按
const startLongPress = (id, event) => {
  console.log('长按开始检测', id);
  // 不阻止默认事件，避免影响正常交互
  currentNoteId.value = id;
  longPressNoteId.value = id;
  isLongPressing.value = true;

  // 清除之前可能存在的计时器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
  }

  longPressTimer.value = setTimeout(() => {
    console.log('长按触发，显示底部窗口');
    // 底部弹窗不需要精确位置，直接显示即可
    menuVisible.value = true;
    isLongPressing.value = false;
  }, 500); // 500ms长按触发
};

// 取消长按
const cancelLongPress = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
    console.log('长按取消');
  }
  isLongPressing.value = false;
  longPressNoteId.value = null;
};

// 关闭菜单
const closeMenu = () => {
  menuVisible.value = false;
  currentNoteId.value = null;
  isLongPressing.value = false;
  longPressNoteId.value = null;
  console.log('菜单已关闭');
};

// 编辑笔记
const editNote = (id) => {
  const note = notesStore.getAllNotes().find(n => n.id === id);
  if (note) {
    editingNoteId.value = id;
    editContent.value = note.note;
    isEditing.value = true;
    closeMenu();
  }
};

// 保存编辑
const saveEdit = () => {
  if (editingNoteId.value && editContent.value.trim()) {
    notesStore.editNote(editingNoteId.value, editContent.value);
    // 触发全局更新事件
    window.dispatchEvent(new CustomEvent('dataUpdate'));
  }
  cancelEdit();
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  editingNoteId.value = null;
  editContent.value = '';
};

// 打开删除确认对话框
const confirmDelete = (id) => {
  currentNoteId.value = id;
  showDeleteConfirm.value = true;
  closeMenu();
};

// 执行删除操作
const deleteNote = () => {
  if (currentNoteId.value) {
    notesStore.deleteNote(currentNoteId.value);
    // 触发全局更新事件
    window.dispatchEvent(new CustomEvent('dataUpdate'));
  }
  showDeleteConfirm.value = false;
  currentNoteId.value = null;
};

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  currentNoteId.value = null;
};

// 监听全局更新事件
onMounted(() => {
  window.addEventListener('dataUpdate', () => {
    // 重新从本地存储加载笔记，实现实时更新
    notesStore.loadNotes();
  });

  // 点击外部关闭菜单
  document.addEventListener('click', (event) => {
    const menu = document.getElementById('note-menu');
    const noteItems = document.querySelectorAll('.note-item');

    if (menu && !menu.contains(event.target) &&
      !Array.from(noteItems).some(item => item.contains(event.target))) {
      closeMenu();
    }
  });
});
</script>
<template>
  <div id="note-content">
    <div v-for="note in notesStore.getAllNotes()" :key="note.id" class="note-item"
      :class="{ 'long-pressing': isLongPressing && longPressNoteId === note.id }"
      @mousedown="startLongPress(note.id, $event)" @mouseup="cancelLongPress" @mouseleave="cancelLongPress"
      @touchstart="startLongPress(note.id, $event)" @touchend="cancelLongPress" @touchcancel="cancelLongPress">
      <div class="note-text">{{ note.note }}</div>
      <div class="note-time">{{ note.time }}</div>
    </div>
    <div v-if="notesStore.notes.value.length === 0" class="empty-state">
      <mdui-icon name="note_add" size="48"></mdui-icon>
      <p>尚无笔记</p>
      <p class="empty-subtitle">记录所思乎</p>
    </div>
  </div>

  <!-- 底部弹出窗口 -->
  <mdui-dialog :open="menuVisible" @close="closeMenu" transition="bottom"
    style="width: 100%; max-width: none; border-radius: 16px 16px 0 0;">
    <mdui-dialog-content class="py-4">
      <div class="flex flex-col space-y-3">
        <mdui-button type="outlined" icon="edit" @click="editNote(currentNoteId)" class="justify-start">
          编辑笔记
        </mdui-button>
        <mdui-button type="outlined" icon="delete" @click="confirmDelete(currentNoteId)" class="justify-start">
          删除笔记
        </mdui-button>
      </div>
    </mdui-dialog-content>
    <mdui-dialog-actions>
      <mdui-button @click="closeMenu" full-width type="text">取消</mdui-button>
    </mdui-dialog-actions>
  </mdui-dialog>

  <!-- 编辑对话框 -->
  <mdui-dialog :open="isEditing" headline="编辑笔记" close-on-overlay-click @close="cancelEdit">
    <mdui-text-field v-model="editContent" label="笔记内容" rows="4" full-width
      @keydown.enter.ctrl="saveEdit"></mdui-text-field>
    <div slot="action">
      <mdui-button variant="text" @click="cancelEdit">取消</mdui-button>
      <mdui-button variant="filled" @click="saveEdit">保存</mdui-button>
    </div>
  </mdui-dialog>

  <!-- 删除确认对话框 -->
  <mdui-dialog :open="showDeleteConfirm" headline="确认删除" close-on-overlay-click>
    <p>确定要删除这条笔记吗？此操作无法撤销。</p>
    <div slot="action">
      <mdui-button variant="text" @click="cancelDelete">取消</mdui-button>
      <mdui-button variant="filled" color="error" @click="deleteNote">删除</mdui-button>
    </div>
  </mdui-dialog>

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
  bottom: calc(40% + env(safe-area-inset-bottom, 0px));
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

.note-item.long-pressing {
  background-color: rgb(var(--mdui-color-surface-container-highest));
  transform: scale(0.98);
  transition: all 0.1s ease;
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