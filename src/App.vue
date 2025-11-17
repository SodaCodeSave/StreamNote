<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { LazyNote, LazyEvent, LazyMe, LazyAI } from './components/LazyComponents.js'

// 初始化路由
const routes = {
  '/note': LazyNote,
  // '/event': LazyEvent,
  '/ai': LazyAI,
  '/me': LazyMe
}

const currentPath = ref(window.location.hash || '#/note')

// 监听hash变化
const handleHashChange = () => {
  // 确保路径有效
  const hash = window.location.hash || '#/note';
  currentPath.value = hash;
}

window.addEventListener('hashchange', handleHashChange)

// 计算当前显示的组件
const currentView = computed(() => {
  const path = currentPath.value.slice(1) || '/note';
  return routes[path] || LazyNote;
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <component :is="currentView"></component>
    </div>
    <mdui-navigation-bar value="item-1" style="position: fixed; bottom: 0; left: 0; right: 0;">
      <mdui-navigation-bar-item icon="notes" value="item-1" href="#/note">笔记</mdui-navigation-bar-item>
      <!-- <mdui-navigation-bar-item icon="event_note" value="item-2" href="#/event">事件</mdui-navigation-bar-item> -->
      <mdui-navigation-bar-item icon="auto_awesome" value="item-2" href="#/ai">AI</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="people" value="item-3" href="#/me">我的</mdui-navigation-bar-item>
    </mdui-navigation-bar>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: rgb(var(--mdui-color-surface));
  color: rgb(var(--mdui-color-on-surface));
}

.app-wrapper {
  height: 100%;
  padding-bottom: 80px;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  height: 100%;
  max-width: 600px;
  box-sizing: border-box;
  padding: 20px;
  padding-bottom: 0;
  padding-top: 72px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background-color: rgb(var(--mdui-color-surface));
}
</style>