<script setup>
import { ref, onMounted } from 'vue';
import TypeIt from 'typeit';

const typeitElement = ref(null);

onMounted(() => {
    new TypeIt(typeitElement.value, {
        strings: ['帮我整理一下日记', '帮我计算5月20日的消费', '帮我设计前往北京的旅游计划', '帮我写一下今天的感受', '帮我推荐一些好的书籍', '帮我优化一下日记', "八月我去哪里旅游了？", "三月的旅游持续了多少天？"],
        speed: 200, // 打字速度
        loop: true, // 循环播放
        breakLines: false, // 禁止换行
    }).go();
});
</script>
<template>
    <h1 style="margin-bottom: 5px;"><span class="ai-name">流记AI</span>，<span ref="typeitElement"></span></h1>
    <span>现在免费开通<span class="ai-name">流记AI</span>，免费还好用</span>

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