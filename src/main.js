import { createApp } from "vue";
import App from "./App.vue";

import 'mdui/mdui.css';
import 'mdui';

const app = createApp(App);
app.config.compilerOptions.ignoredElements = [/^mdui-icon-.+$/];
app.mount("#app");