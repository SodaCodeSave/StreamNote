<script setup>
import { ref, computed } from 'vue'
import Note from './Note.vue'
import Event from './Event.vue'
import Me from './Me.vue'

const routes = {
  '/note': Note,
  '/event': Event,
  '/me': Me
}
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/note'] || Note
})
</script>
<template>
  <div class="app-wrapper">
    <div class="app-container">
      <component :is="currentView"></component>
    </div>
    <mdui-navigation-bar value="item-1" style="position: fixed; bottom: 0; left: 0; right: 0;">
      <mdui-navigation-bar-item icon="notes" value="item-1" href="#/note">记</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="event_note" value="item-2" href="#/event">事</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="people" value="item-3" href="#/me">私</mdui-navigation-bar-item>
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
  padding-bottom: 145px;
  padding-top: 72px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background-color: rgb(var(--mdui-color-surface));
}
</style>