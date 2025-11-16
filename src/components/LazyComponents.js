import { defineAsyncComponent } from 'vue';

// 懒加载笔记组件
export const LazyNote = defineAsyncComponent(() =>
  import('../Note.vue')
);

// 懒加载事件组件
export const LazyEvent = defineAsyncComponent(() =>
  import('../Event.vue')
);

// 懒加载个人页面组件
export const LazyMe = defineAsyncComponent(() =>
  import('../Me.vue')
);