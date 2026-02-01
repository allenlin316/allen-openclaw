// Projects data
const projects = [
  {
    id: 'todo',
    emoji: '📝',
    title: 'TODO List',
    description: '簡單但功能完整的待辦事項應用',
    features: [
      '新增、刪除待辦事項',
      '標記完成狀態',
      '過濾視圖（全部、待做、已完成）',
      '統計信息'
    ],
    tech: 'Node.js + Express | HTML5 + CSS3 + Vanilla JS',
    status: 'active',
    url: '/projects/todo',
    github: 'https://github.com/allenlin316/allen-openclaw/tree/main/projects/todo-app'
  }
];

// Render projects
function renderProjects() {
  const grid = document.getElementById('projectsGrid');

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>還沒有項目</h2>
        <p>開始創建你的第一個項目吧！🚀</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects
    .map(
      project => `
        <div class="project-card">
          <div class="project-card-header">
            <div class="project-emoji">${project.emoji}</div>
            <div>
              <h2 class="project-title">${project.title}</h2>
              <span class="project-status ${project.status}">${project.status === 'active' ? '✨ 運行中' : '📌 開發中'}</span>
            </div>
          </div>

          <p class="project-description">${project.description}</p>

          ${
            project.features
              ? `
            <div class="project-features">
              <strong>功能：</strong>
              <ul>
                ${project.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }

          <div class="project-tech">
            <strong>技術：</strong> ${project.tech}
          </div>

          <div class="project-links">
            <a href="${project.url}" class="btn btn-primary">
              🚀 打開項目
            </a>
            <a href="${project.github}" target="_blank" class="btn btn-secondary">
              📄 GitHub
            </a>
          </div>
        </div>
      `
    )
    .join('');
}

// Load on page
window.addEventListener('DOMContentLoaded', renderProjects);
