# PDF Merger

一个现代、安全且易于使用的在线 PDF 合并工具。完全在浏览器端运行，无需将文件上传到服务器，确保您的数据隐私安全。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)

## ✨ 特性

-   🔒 **隐私优先**：所有 PDF 处理都在您的浏览器本地完成，文件不会上传到任何服务器。
-   🚀 **快速高效**：基于 WebAssembly 和现代浏览器技术，合并速度极快。
-   🖱️ **拖拽排序**：直观的拖拽界面，轻松调整 PDF 文件的合并顺序。
-   🎨 **现代界面**：简洁美观的 UI 设计，提供流畅的用户体验。
-   📱 **响应式设计**：适配各种屏幕尺寸，随时随地使用。

## 🛠️ 技术栈

本项目使用以下技术构建：

-   [React 19](https://react.dev/) - 用于构建用户界面的 JavaScript 库
-   [Vite](https://vitejs.dev/) - 下一代前端构建工具
-   [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，提供静态类型检查
-   [Tailwind CSS 4](https://tailwindcss.com/) - 实用优先的 CSS 框架
-   [pdf-lib](https://pdf-lib.js.org/) - 用于在 JavaScript 中创建和修改 PDF 文档
-   [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - 强大的拖拽库
-   [Lucide React](https://lucide.dev/) - 漂亮的开源图标库

## 📦 安装与运行

### 前置要求

确保您的环境已安装 [Node.js](https://nodejs.org/) (建议 v18+)。

### 步骤

1.  克隆仓库

    ```bash
    git clone https://github.com/xiaochenwin/pdf-merged.git
    cd pdf-merged
    ```

2.  安装依赖

    ```bash
    npm install
    ```

3.  启动开发服务器

    ```bash
    npm run dev
    ```

4.  构建生产版本

    ```bash
    npm run build
    ```

## 📖 使用指南

1.  点击上传区域或直接将 PDF 文件拖入虚线框内。
2.  上传后，您可以拖动文件卡片左侧的手柄图标来调整合并顺序。
3.  点击文件右侧的 "X" 按钮可以移除不需要的文件。
4.  确认顺序无误后，点击底部的 "开始合并 PDF" 按钮。
5.  合并完成后，会出现下载提示，点击 "下载文件" 即可保存合并后的 PDF。

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
