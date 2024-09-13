![image](https://github.com/yuri2peter/picx-images-hosting/raw/master/logo_banner.2h89fgamei.webp)

<h3 align="center">
---- 启发您创意的笔记。
</h3>
<p  align="center"><a href="./README.md">English</a></p>

## 📖 目录

- [💡 简介](#-简介)
- [🔮 功能](#-功能)
- [🚀 部署](#-部署)
- [🧰 维护](#-维护)
- [❓ 常见问题](#-常见问题)
- [🙏 感谢](#-感谢)

## 💡 简介

**AIgnition** 是一款直观、开源的笔记应用，由 AI 提供支持，旨在简化和增强您的笔记体验。

## ✨ 功能

### 编辑器

- Markdown WYSIWYG
- 实时预览
- 代码块语法高亮

### AI 引擎

- 支持 OpenAI API 和 Gemini API
- 问答聊天
- 自动补全
- 重写

### 访客模式

- 与他人分享笔记
- 评论系统

### 自托管

- 隐私优先
- 纯 JS 构建
- 使用 Docker 部署

### 多设备支持

- 桌面
- 平板电脑
- 移动设备

## 🚀 部署

Docker compose 是部署 AIgnition 的最简单方法。

```yml
# /YOUR_PATH/aignition/docker-compose.yml
version: '3.8'
services:
  aignition:
  image: 'yuri2/aignition'
  restart: unless-stopped
  volumes:
    - ./runtime:/dist/runtime
  environment:
    # The port that the web server listens on.
    - SERVER_PORT=3000
  ports:
    - 3000:3000
```

## 🧰 维护

### 软件更新

```bash
cd /YOUR_PATH/aignition
docker-compose pull
docker-compose up -d
```

### 数据备份

- `runtime` 是 AIgnition 存储数据的目录。请勿丢失它。
- 使用“导出数据 > 保存存档”和“导入数据 > 从存档”功能，在“数据”面板中备份和恢复数据。

### 日志文件

您可以在 `runtime/logs` 中查看日志文件（这对于故障排除和密码恢复会很有用）。

## ❓ 常见问题

### 如果不小心删除了重要的笔记，没有备份怎么办？

您的数据每 30 分钟自动备份一次。您可以在 `runtime/data/db/main_backup` 目录中找到这些备份。要恢复您的数据，只需将 `main.db` 文件的内容替换为所需备份文件的内容，然后手动重新启动应用程序。

> 上传的文件不会自动备份。

### AIgnition 是开源的吗？

AIgnition 是完全开源的，欢迎贡献代码。

### 我需要付费使用吗？

所有功能都免费，即使用于商业用途。

## 🙏 感谢

AIgnition 的诞生离不开许多开源项目和贡献者的帮助，请参阅 `package.json` 文件。

欢迎加入我们，共同为 AIgnition 贡献代码。
