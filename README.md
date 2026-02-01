# Allen 的專案

個人開發項目的集合，運行在 GitHub Codespace 上。

## 📋 專案列表

### 1. 📝 TODO List
待辦事項應用 - 簡單但功能完整的任務管理系統。

**功能：**
- ✅ 新增、編輯、刪除任務
- ✅ 標記完成/未完成
- ✅ 過濾視圖（全部、待做、已完成）
- ✅ 統計信息
- ✅ 本地存儲（服務器端）
- ✅ 響應式設計

**技術棧：**
- 後端：Node.js + Express
- 前端：HTML5 + CSS3 + Vanilla JavaScript
- 存儲：JSON 文件

**位置：** `projects/todo-app/`

---

## 🚀 運行

### 方式 1：運行主首頁（推薦）
```bash
npm install
npm start
```

訪問：http://localhost:3000（或 Codespace URL）

這會啟動首頁，你可以看到所有項目並點擊進入各個項目。

### 方式 2：運行 TODO App（獨立）
```bash
cd projects/todo-app
npm install
npm start
```

訪問：http://localhost:3001

---

## 📁 目錄結構

```
allen-openclaw/
├── server.js              # 主首頁服務器
├── package.json           # 根目錄依賴
├── public/                # 首頁靜態文件
│   ├── index.html         # 首頁
│   ├── app.js             # 首頁邏輯
│   └── styles.css         # 首頁樣式
│
└── projects/              # 各個項目資料夾
    └── todo-app/          # TODO 應用
        ├── server.js      # Express 服務器
        ├── package.json   # 項目依賴
        ├── public/        # 靜態文件
        │   ├── index.html
        │   ├── app.js
        │   └── styles.css
        └── todos.json     # 數據文件
```

---

## 🌐 Codespace 訪問

- **首頁**：https://reimagined-space-robot-w44756rjvpp35xxj-3000.app.github.dev
- **TODO 應用**：https://reimagined-space-robot-w44756rjvpp35xxj-3000.app.github.dev/projects/todo

---

## 📌 定時任務

- **台北市天氣** ⏰ 每隔 1 小時自動發送
  - Job ID: `d0aee34e-3fee-4eb3-b874-bd96f863105d`
  - 通過 OpenClaw Cron 定時執行

---

## 開發者

Created with ❤️ in GitHub Codespace | Allen

## License

MIT
