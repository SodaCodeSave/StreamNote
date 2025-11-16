import { reactive, toRefs } from 'vue';

// 创建全局应用状态
const state = reactive({
  // 应用加载状态
  isLoading: false,
  // 当前活跃的标签页
  activeTab: 'note',
  // 统计数据
  stats: {
    notesCount: 0,
    eventsCount: 0,
  }
});

// 显示加载状态
const showLoading = () => {
  state.isLoading = true;
};

// 隐藏加载状态
const hideLoading = () => {
  state.isLoading = false;
};

// 更新活跃标签页
const setActiveTab = (tab) => {
  state.activeTab = tab;
};

// 更新统计数据
const updateStats = (notesCount, eventsCount) => {
  state.stats.notesCount = notesCount;
  state.stats.eventsCount = eventsCount;
};

// 获取全局状态
const getGlobalState = () => {
  return {
    ...toRefs(state),
    showLoading,
    hideLoading,
    setActiveTab,
    updateStats
  };
};

export { getGlobalState };