[github.com:yuri2peter/AIgnition](https://github.com/yuri2peter/AIgnition)

![image](https://github.com/yuri2peter/picx-images-hosting/raw/master/logo_banner.2h89fgamei.webp)

<h3>
---- Notes that spark your creativity.
</h3>
<p><a href="https://github.com/yuri2peter/AIgnition/blob/main/README_zh_CN.md">中文</a></p>

## 📖 Table of Contents

- 💡 Introduction
- 🔮 Features
- 🚀 Deployment
- 📘 User Guide
- 🧰 Maintenance
- ❓ FAQ
- 🙏 Acknowledgement

## 💡 Introduction

**AIgnition** is an intuitive, open-source note-taking web app, powered by AI to simplify and enhance your note-taking experience.

![multi-mockup](https://github.com/yuri2peter/picx-images-hosting/raw/master/multi-mockup.5c0xn7y36a.webp)

## ✨ Features

### Editor

- Markdown WYSIWYG
- Live preview
- Code block syntax highlighting

### AI Engine

- Support OpenAI API and Gemini API
- Q/A chat
- Autocomplete
- Rewrite

### Guest Mode

- Share your notes with others
- Comment system

### Self-Hosted

- Privacy first
- Pure JS based
- Deploy with Docker

### Multi Devices Support

- Desktop
- Tablet
- Mobile

## 🚀 Deployment

Docker compose is the simplest way to deploy AIgnition.

```yml
# https://hub.docker.com/repository/docker/yuri2/aignition/general
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

## 📘 User Guide

Please visit the [User Guide](https://github.com/yuri2peter/AIgnition/blob/main/assets/server/📘%20AIgnition%20User%20Guide/1.%20🎉%20Quick%20Start/1.1.%20⚙%EF%B8%8F%20Basic%20Setups.md) for more details.

## 🧰 Maintenance

### Software Update

```bash
cd /YOUR_PATH/aignition
docker-compose pull
docker-compose up -d
```

### Backup Data

- `runtime` is the data that AIgnition stores. DO NOT lose it.
- Use `Export data > Save archive` and `Import data > From archive` to backup and restore data in the `Data` panel.

### Log File

You can check the log file(useful for troubleshooting and password recovery) in the `runtime/logs`.

## ❓ FAQ

### What if I deleted some important notes without backups?

Your data is automatically backed up every 30 minutes. You can find these backups in the `runtime/data/db/main_backup` directory. To restore your data, simply replace the contents of the `main.db` file with the contents of the desired backup file, then restart the app manually.

> Uploads are NOT backup automatically.

### Is AIgnition open source?

AIgnition is completely open source, and contributions are welcome.

### Do I need to pay for it?

All features are free, even for commercial use.

## 🙏 Acknowledgement

The birth of AIgnition is inseparable from many open source projects and contributors, please refer to the `package.json`.

Welcome to join us and contribute code to AIgnition together.
