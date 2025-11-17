<script setup>
import { ref, onMounted } from 'vue';
import TypeIt from 'typeit';

const typeitElement = ref(null);

const aiEnabled = localStorage.getItem('aiEnabled') === 'true';

if (!aiEnabled) {
    onMounted(() => {
        new TypeIt(typeitElement.value, {
            strings: ['帮我整理一下日记', '帮我计算5月20日的消费', '帮我设计前往北京的旅游计划', '帮我写一下今天的感受', '帮我推荐一些好的书籍', '帮我优化一下日记', "八月我去哪里旅游了？", "三月的旅游持续了多少天？"],
            speed: 200, // 打字速度
            loop: true, // 循环播放
            breakLines: false, // 禁止换行
        }).go();
    })
};

const dialog = ref(null);

function openPremium() {
    if (dialog.value) {
        dialog.value.open = true;
    }
}

function closePremium() {
    if (dialog.value) {
        dialog.value.open = false;
    }
    // 将开通状态写入 localStorage
    localStorage.setItem('aiEnabled', 'true');
}

onMounted(() => {
    // 关闭按钮点击事件
    const closeBtn = dialog.value?.querySelector('mdui-button[slot="close"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePremium);
    }
});
</script>

<template>
    <div id="no-ai" style="height: 100%; width: 100%; position: relative;" v-if="!aiEnabled">
        <mdui-dialog ref="dialog" class="premium-dialog">
            <h2 style="margin: 0;">免费开通<span class="ai-name">流记AI</span></h2>
            <p>是否继续免费开通？</p>
            <mdui-button @click="closePremium">确认开通</mdui-button>
        </mdui-dialog>
        <h1 style="margin-bottom: 5px;"><span class="ai-name">流记AI</span>，<span ref="typeitElement"></span></h1>
        <span>现在免费开通<span class="ai-name">流记AI</span>，免费还好用</span>
        <mdui-icon name="auto_awesome" class="ai-name"
            style="position: absolute; top: calc(50% - 100px); left: calc(50% - 100px); font-size: 180px;"></mdui-icon>
        <mdui-button style="width: calc(100% - 60px); position: absolute; bottom: 20px; left: 30px;"
            @click="openPremium">免费开通</mdui-button>
    </div>
    <div id="ai" v-if="aiEnabled">
    </div>
</template>
<style>
.ai-name {
    font-weight: bold;
    background: linear-gradient(to right, #feac5e, #c779d0, #4bc0c8);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>