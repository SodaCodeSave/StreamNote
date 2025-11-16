import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { compression } from 'vite-plugin-compression2';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 所有以 mdui- 开头的标签名都是 mdui 组件
          isCustomElement: (tag) => tag.startsWith('mdui-'),
        },
      },
    }),
    // 添加压缩插件以减小包大小
    compression()
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  build: {
    // 启用压缩以减小包大小
    rollupOptions: {
      output: {
        // 代码分割配置
        manualChunks: {
          vue: ['vue'],
          mdui: ['mdui'],
        }
      }
    },
    // 启用压缩
    cssCodeSplit: true,
    sourcemap: true, // 生产环境可设置为false以减小体积
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'mdui']
  }
}));
