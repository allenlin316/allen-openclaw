# Allen 的專案

個人開發項目的集合。所有應用都採用 **無後端架構**，可直接託管在 GitHub Pages 上。

## 📋 專案列表

### 1. 📝 TODO List
待辦事項應用 - 簡單但功能完整的任務管理系統。

**功能：**
- ✅ 新增、編輯、刪除任務
- ✅ 標記完成/未完成
- ✅ 過濾視圖（全部、待做、已完成）
- ✅ 統計信息
- ✅ 本地存儲（LocalStorage）
- ✅ 響應式設計

**技術棧：**
- 前端：HTML5 + CSS3 + Vanilla JavaScript
- 存儲：LocalStorage（瀏覽器本地）
- **無後端依賴** ✨

**位置：** `projects/todo-app/`

---

### 2. 📰 財經科技新聞
每日最新的財經和科技新聞聚合平台。

**功能：**
- ✅ 財經新聞（Bloomberg、Reuters）
- ✅ 科技新聞（TechCrunch、The Verge）
- ✅ 台灣股票新聞
- ✅ 分類篩選
- ✅ 6 小時新聞快取
- ✅ 點擊連結進入原網站
- ✅ 響應式設計

**技術棧：**
- 前端：HTML5 + CSS3 + Vanilla JavaScript
- 數據來源：RSS2JSON API（免費公開服務）
- 存儲：LocalStorage（快取）
- **無後端依賴** ✨

**位置：** `projects/news-aggregator/`

---

## 🚀 運行

### 本地開發

所有應用都是前端式，可以用簡單的 HTTP 服務器運行：

**方式 1：使用 Python（推薦）**
```bash
# 在根目錄運行首頁
cd /workspaces/allen-openclaw
python -m http.server 8000

# 在單獨的終端運行 TODO App
cd projects/todo-app
python -m http.server 8001

# 在單獨的終端運行新聞應用
cd projects/news-aggregator
python -m http.server 8002
```

**方式 2：使用 Node.js http-server**
```bash
npm install -g http-server

# 在根目錄運行首頁
http-server -p 8000

# 在 projects/todo-app 運行
http-server -p 8001

# 在 projects/news-aggregator 運行
http-server -p 8002
```

訪問：http://localhost:8000（首頁）

---

## 📁 目錄結構

```
allen-openclaw/
├── package.json           # 根目錄依賴
├── public/                # 首頁靜態文件
│   ├── index.html         # 首頁儀表板
│   ├── app.js             # 首頁邏輯
│   └── styles.css         # 首頁樣式
│
└── projects/              # 各個項目資料夾
    ├── todo-app/          # TODO List 應用
    │   ├── package.json
    │   └── public/
    │       ├── index.html
    │       ├── app.js
    │       └── styles.css
    │
    └── news-aggregator/   # 新聞應用
        ├── package.json
        └── public/
            ├── index.html
            ├── app.js
            └── styles.css
```

---

## 🌐 GitHub Pages 部署

### 準備部署

所有應用都已改造為無後端版本，可以直接託管在 GitHub Pages 上。

### 部署步驟

1. **Push 到 GitHub**（已完成）
```bash
git push origin main
```

2. **在個人網站倉庫上啟用 GitHub Pages**
- 進入 https://github.com/allenlin316/allenlin316.github.io
- Settings → Pages
- 選擇分支和目錄
- 啟用 GitHub Pages

3. **複製項目到個人網站**
```bash
# 在 allenlin316.github.io 倉庫中
cp -r allen-openclaw/* ./allen-openclaw/
```

4. **訪問應用**
- 首頁：https://allenlin316.github.io/allen-openclaw/
- TODO List：https://allenlin316.github.io/allen-openclaw/projects/todo-app/
- 新聞應用：https://allenlin316.github.io/allen-openclaw/projects/news-aggregator/

---

## 開發者

Created with ❤️ | Allen

## License

MIT
