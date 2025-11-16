import { ref } from 'vue';
import { StorageErrorHandler } from '../utils/errorHandler.js';

// 笔记存储
const notes = ref([]);

// 从本地存储加载笔记
const loadNotes = () => {
  const storedNotes = StorageErrorHandler.getItem('notes', []);
  notes.value = storedNotes;
};

// 保存笔记到本地存储
const saveNotes = () => {
  StorageErrorHandler.setItem('notes', notes.value);
};

// 添加笔记
const addNote = (noteText) => {
  if (!noteText?.trim()) return;

  // 验证笔记内容
  if (noteText.trim().length > 1000) {
    console.error('笔记内容冗长，已截断');
    noteText = noteText.trim().substring(0, 1000);
  }

  const newNote = {
    note: noteText.trim(),
    time: new Date().toLocaleString(),
    id: Date.now() + Math.random() // 确保唯一ID
  };

  notes.value.push(newNote);
  saveNotes();
};

// 删除笔记
const deleteNote = (id) => {
  notes.value = notes.value.filter(note => note.id !== id);
  saveNotes();
};

// 编辑笔记
const editNote = (id, newNoteText) => {
  if (!newNoteText?.trim()) return;

  // 验证笔记内容
  if (newNoteText.trim().length > 1000) {
    console.error('笔记内容冗长，已截断');
    newNoteText = newNoteText.trim().substring(0, 1000);
  }

  const noteIndex = notes.value.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    notes.value[noteIndex].note = newNoteText.trim();
    notes.value[noteIndex].time = new Date().toLocaleString();
    saveNotes();
  }
};

// 获取所有笔记
const getAllNotes = () => {
  return [...notes.value].reverse(); // 返回倒序副本
};

// 清空所有笔记
const clearAllNotes = () => {
  notes.value = [];
  saveNotes();
};

// 获取笔记数量
const getNotesCount = () => {
  return notes.value.length;
};

// 初始化时加载笔记
loadNotes();

export default {
  notes, // 导出响应式引用
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  clearAllNotes,
  getNotesCount,
  loadNotes
};