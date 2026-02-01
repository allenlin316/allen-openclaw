# TODO List 應用

一個簡單但功能完整的待辦事項應用程式。

## 功能特性

✅ **新增待辦事項** - 輕鬆添加新的任務  
✅ **標記完成** - 勾選完成的項目  
✅ **刪除任務** - 移除不需要的項目  
✅ **過濾視圖** - 查看全部、待做或已完成的項目  
✅ **統計信息** - 顯示總數、已完成和待做任務數  
✅ **本地持久化** - 資料會被保存到服務器  
✅ **響應式設計** - 在手機、平板和桌面上完美運作  

## 技術棧

- **後端**：Node.js + Express
- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **數據存儲**：JSON 文件

## 安裝

```bash
npm install
```

## 運行

```bash
npm start
```

應用將在 `http://localhost:3000` 運行

## API 端點

- `GET /api/todos` - 獲取所有待辦事項
- `POST /api/todos` - 新增待辦事項
- `PUT /api/todos/:id` - 更新待辦事項
- `DELETE /api/todos/:id` - 刪除待辦事項

## 目錄結構

```
.
├── server.js          # Express 伺服器
├── package.json       # 專案配置
├── public/
│   ├── index.html     # HTML 模板
│   ├── styles.css     # 樣式表
│   ├── app.js         # 前端邏輯
│   └── ...
└── todos.json         # 數據存儲（自動生成）
```

## 開發者

Created with ❤️ in GitHub Codespace

## License

MIT
