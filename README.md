# StreamNote

像发消息一样记录日常

## 简介

StreamNote是一款简洁高效的笔记应用，让你能够像发送消息一样轻松记录日常生活。无论是一闪而过的灵感，还是重要的待办事项，你都可以通过简单的消息式界面快速捕捉并保存。

## 特性

- **消息式记录** - 采用类似聊天的界面，让记笔记像发消息一样自然流畅
- **跨平台支持** - 基于Tauri构建，支持Windows, macOS, Linux等平台
- **即时保存** - 所有记录自动保存，无需手动保存
- **简洁界面** - 专注记录本身，避免不必要的干扰

## 技术栈

- **前端** - Vue 3 + mdui (Material Design UI)
- **后端** - Tauri (Rust-based desktop framework)
- **构建工具** - Vite

## 安装与使用

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 构建应用

```bash
# 构建应用
npm run tauri build
```

## 项目结构

```
StreamNote/
├── src/                    # 前端源代码
├── src-tauri/              # Tauri后端代码
├── public/                 # 静态资源
├── package.json            # 项目配置
└── tauri.conf.json         # Tauri配置
```

## 贡献

欢迎提交Issue或Pull Request来帮助改进StreamNote。

## 许可证

GNU GENERAL PUBLIC LICENSE - 详情请参见 [LICENSE](./license) 文件。