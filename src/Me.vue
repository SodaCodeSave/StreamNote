<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { StorageErrorHandler } from './utils/errorHandler.js';

// 用户信息
const userInfo = ref({
    name: '用户',
    bio: '此人甚懒，未著一字',
    joinDate: new Date().toLocaleDateString('zh-CN')
});

// 应用统计信息
const appStats = ref({
    totalNotes: 0,
});

// 加载用户数据
const loadUserData = () => {
    // 从本地存储加载用户信息
    const storedUserInfo = StorageErrorHandler.getItem('userInfo', {
        name: '用户',
        bio: '此人甚懒，未著一字',
        joinDate: new Date().toLocaleDateString('zh-CN')
    });
    userInfo.value = storedUserInfo;

    // 计算统计数据
    updateStats();
};

// 更新统计数据
const updateStats = () => {
    try {
        const storedNotes = localStorage.getItem('notes');

        appStats.value.totalNotes = storedNotes ? JSON.parse(storedNotes).length : 0;
    } catch (error) {
        console.error('更新统计数据失败:', error);
    }
};

// 保存用户信息
const saveUserInfo = () => {
    // 限制用户名和简介的长度
    userInfo.value.name = userInfo.value.name.substring(0, 50);
    userInfo.value.bio = userInfo.value.bio.substring(0, 200);

    StorageErrorHandler.setItem('userInfo', userInfo.value);
};

// 重置所有数据
const resetAllData = () => {
    if (confirm('确定要删除所有数据吗？此操作不可逆！')) {
        try {
            StorageErrorHandler.removeItem('notes');
            StorageErrorHandler.removeItem('userInfo');

            // 重置状态
            appStats.value.totalNotes = 0;
            userInfo.value = {
                name: '用户',
                bio: '这个人很懒，什么都没写',
                joinDate: new Date().toLocaleDateString('zh-CN')
            };

            // 触发全局更新
            window.dispatchEvent(new CustomEvent('dataUpdate'));

            alert('所有数据已重置');
        } catch (error) {
            console.error('重置数据失败:', error);
            alert('重置数据失败，请重试');
        }
    }
};

// 监听storage事件以更新统计数据
const storageListener = () => {
    updateStats();
};

onMounted(() => {
    loadUserData();

    // 监听storage事件，以便当其他窗口中的数据发生变化时更新统计
    window.addEventListener('storage', storageListener);

    // 监听自定义事件以更新统计数据
    window.addEventListener('dataUpdate', updateStats);
});

onUnmounted(() => {
    window.removeEventListener('storage', storageListener);
    window.removeEventListener('dataUpdate', updateStats);
});
</script>

<template>
    <div class="profile-container">
        <mdui-card class="profile-card">
            <div class="profile-header">
                <mdui-avatar class="profile-avatar">{{ userInfo.name.charAt(0) }}</mdui-avatar>
                <div class="profile-info">
                    <h2>{{ userInfo.name }}</h2>
                    <p>{{ userInfo.bio }}</p>
                </div>
            </div>

            <mdui-divider></mdui-divider>

            <div class="profile-stats">
                <div class="stat-item">
                    <mdui-icon name="sticky_note_2" class="stat-icon"></mdui-icon>
                    <h3>{{ appStats.totalNotes }}</h3>
                    <p>笔记</p>
                </div>
                <div class="stat-item">
                    <mdui-icon name="data_object" class="stat-icon"></mdui-icon>
                    <h3>{{ appStats.totalNotes }}</h3>
                    <p>总数</p>
                </div>
            </div>
        </mdui-card>

        <mdui-card class="settings-card">
            <h3>身世设置</h3>
            <mdui-text-field
            style="margin-bottom: 10px;"
                label="姓名"
                v-model="userInfo.name"
                @blur="saveUserInfo"
                variant="outlined"
            ></mdui-text-field>
            <mdui-text-field
                label="简介"
                v-model="userInfo.bio"
                type="textarea"
                rows="2"
                @blur="saveUserInfo"
                variant="outlined"
            ></mdui-text-field>
            <div class="join-date">入会之日: {{ userInfo.joinDate }}</div>
        </mdui-card>

        <mdui-card class="danger-zone">
            <h3>禁地</h3>
            <p>复归初始将删去所有笔记与事件，此乃不可逆之操作也。</p>
            <mdui-button
                variant="tonal"
                color="error"
                @click="resetAllData"
            >
                复归初始
            </mdui-button>
        </mdui-card>
    </div>
</template>

<style scoped>
.profile-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.profile-card {
    padding: 32px 24px;
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
    background: linear-gradient(135deg, rgb(var(--mdui-color-primary-container)), rgb(var(--mdui-color-secondary-container)));
    color: rgb(var(--mdui-color-on-primary-container));
    border-radius: 20px;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.profile-avatar {
    width: 96px;
    height: 96px;
    font-size: 36px;
    margin-bottom: 16px;
    background-color: rgb(var(--mdui-color-primary));
    color: rgb(var(--mdui-color-on-primary));
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-info h2 {
    margin: 8px 0;
    color: inherit;
}

.profile-info p {
    margin: 8px 0;
    color: rgba(var(--mdui-color-on-primary-container), 0.9);
}

mdui-divider {
    background-color: rgba(var(--mdui-color-on-primary-container), 0.2);
}

.profile-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 24px;
}

.stat-item {
    text-align: center;
}

.stat-icon {
    font-size: 28px;
    color: rgb(var(--mdui-color-primary));
    margin-bottom: 8px;
}

.stat-item h3 {
    margin: 0 0 4px 0;
    font-size: 28px;
    color: inherit;
}

.stat-item p {
    margin: 0;
    color: rgba(var(--mdui-color-on-primary-container), 0.8);
}

.settings-card {
    padding: 24px;
    margin-bottom: 20px;
    background-color: rgb(var(--mdui-color-surface-container));
    border-radius: 16px;
}

.settings-card h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: rgb(var(--mdui-color-on-surface));
}

.join-date {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(var(--mdui-color-outline), 0.1);
    color: rgba(var(--mdui-color-on-surface), 0.7);
}

.danger-zone {
    padding: 24px;
    background-color: rgb(var(--mdui-color-error-container));
    color: rgb(var(--mdui-color-on-error-container));
    border-radius: 16px;
}

.danger-zone h3,
.danger-zone p {
    color: inherit;
}

.danger-zone mdui-button {
    margin-top: 16px;
}
</style>