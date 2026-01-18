<template>
  <div class="dashboard-content">
    <header class="page-header">
      <h1>ទិដ្ឋភាពទូទៅ</h1>
      <p>សួស្ដី, សូមស្វាគមន៍សារជាថ្មី 🙏</p>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon-box blue">🎓</div>
        <div class="stat-info">
          <p>សិស្សសរុប</p>
          <h3>2000</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-box orange">👥</div>
        <div class="stat-info">
          <p>បុគ្គលិកសរុប</p>
          <h3>350</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-box green">📚</div>
        <div class="stat-info">
          <p>វគ្គសិក្សា</p>
          <h3>20</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-box red">📊</div>
        <div class="stat-info">
          <p>មធ្យមភាគវត្តមាន</p>
          <h3>85%</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 { color: #5d5fef; margin-bottom: 8px; }
p { color: #888; margin-bottom: 32px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.blue { background: #eef2ff; }
.orange { background: #fff7ed; }
.green { background: #f0fdf4; }
.red { background: #fef2f2; }

.stat-info p { margin: 0; font-size: 0.9rem; color: #888; }
.stat-info h3 { margin: 4px 0 0 0; font-size: 1.5rem; }
</style>
