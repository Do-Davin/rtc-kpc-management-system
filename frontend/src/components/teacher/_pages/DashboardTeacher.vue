<template>
  <div class="dashboard-content">
    <header class="page-header">
      <h1>ទិដ្ឋភាពទូទៅ</h1>
      <p>សួស្ដី, សូមស្វាគមន៍សារជាថ្មី 🙏</p>
    </header>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <!-- Loading State for Cards -->
      <template v-if="loadingStats">
        <div v-for="i in 4" :key="i" class="stat-card skeleton-card"></div>
      </template>

      <template v-else>
        <!-- Present Today -->
        <div class="stat-card">
          <div class="icon-box green">
            <Users :size="24" />
          </div>
          <div class="stat-info">
            <p>វត្តមានថ្ងៃនេះ</p>
            <h3>{{ stats.presentToday || 0 }} <span class="unit">នាក់</span></h3>
          </div>
        </div>

        <!-- Absent Today -->
        <div class="stat-card">
          <div class="icon-box red">
            <UserX :size="24" />
          </div>
          <div class="stat-info">
            <p>អវត្តមានថ្ងៃនេះ</p>
            <h3>{{ stats.absentToday || 0 }} <span class="unit">នាក់</span></h3>
          </div>
        </div>

        <!-- Attendance % -->
        <div class="stat-card">
          <div class="icon-box blue">
            <Percent :size="24" />
          </div>
          <div class="stat-info">
            <p>មធ្យមភាគវត្តមាន</p>
            <h3>{{ stats.attendanceRate || 0 }}%</h3>
          </div>
        </div>

        <!-- Course Completion -->
        <div class="stat-card">
          <div class="icon-box orange">
            <BookOpen :size="24" />
          </div>
          <div class="stat-info">
            <p>ការបញ្ចប់វគ្គសិក្សា</p>
            <h3>{{ stats.courseCompletion || 0 }}%</h3>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Content Grid (Chart + Sessions + Todos) -->
    <div class="content-grid">
      <!-- Left Column: Chart -->
      <div class="chart-section">
        <div class="section-header">
          <h2>ទិន្នន័យវត្តមាន</h2>
          <select class="filter-select" v-model="selectedRange" @change="fetchTrendData">
            <option value="7">7 ថ្ងៃចុងក្រោយ</option>
            <option value="30">ខែនេះ</option>
            <option value="365">ឆ្នាំនេះ</option>
          </select>
        </div>
        <div class="chart-container">
          <AttendanceChart
            :data="attendanceData"
            :loading="loadingChart"
            :error="chartError"
            :show-course-completion="true"
            @retry="fetchTrendData"
          />
        </div>
      </div>

      <!-- Right Column: Todo List -->
      <div class="todo-section">
        <div class="section-header">
          <h2><ListTodo :size="20" /> កិច្ចការរបស់ខ្ញុំ</h2>
          <button class="add-btn" @click="openTodoModal()">
            <Plus :size="18" />
            បន្ថែម
          </button>
        </div>

        <!-- Todo Loading -->
        <div v-if="loadingTodos" class="todo-loading">
          <div class="spinner-small"></div>
          <span>កំពុងផ្ទុក...</span>
        </div>

        <!-- Todo Empty -->
        <div v-else-if="todos.length === 0" class="todo-empty">
          <ClipboardList :size="40" />
          <p>មិនមានកិច្ចការនៅឡើយទេ</p>
          <button class="add-btn-secondary" @click="openTodoModal()">
            <Plus :size="16" /> បន្ថែមកិច្ចការ
          </button>
        </div>

        <!-- Todo List -->
        <div v-else class="todo-list">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="todo-item"
            :class="{ completed: todo.isCompleted }"
          >
            <button class="todo-checkbox" @click="handleToggleTodo(todo.id)">
              <Check v-if="todo.isCompleted" :size="14" />
            </button>
            <div class="todo-content">
              <span class="todo-title">{{ todo.title }}</span>
              <span v-if="todo.dueDate" class="todo-due">
                <Calendar :size="12" />
                {{ formatDueDate(todo.dueDate) }}
              </span>
            </div>
            <div class="todo-actions">
              <button class="action-btn edit" @click="openTodoModal(todo)">
                <Pencil :size="14" />
              </button>
              <button class="action-btn delete" @click="handleDeleteTodo(todo.id)">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Sessions Section -->
    <div class="sessions-section">
      <div class="section-header">
        <h2><CalendarDays :size="20" /> វគ្គសិក្សាថ្ងៃនេះ</h2>
        <router-link to="/teacher/attendance" class="view-all-link">
          មើលទាំងអស់ <ChevronRight :size="16" />
        </router-link>
      </div>

      <!-- Sessions Loading -->
      <div v-if="loadingSessions" class="sessions-loading">
        <div class="skeleton-row" v-for="i in 3" :key="i"></div>
      </div>

      <!-- Sessions Empty -->
      <div v-else-if="todaySessions.length === 0" class="sessions-empty">
        <Calendar :size="48" />
        <p>មិនមានវគ្គសិក្សាសម្រាប់ថ្ងៃនេះទេ</p>
      </div>

      <!-- Sessions Table -->
      <div v-else class="sessions-table-wrapper">
        <table class="sessions-table">
          <thead>
            <tr>
              <th>វគ្គសិក្សា</th>
              <th>នាយកដ្ឋាន</th>
              <th>ឆ្នាំ</th>
              <th>ម៉ោង</th>
              <th>ស្ថានភាព</th>
              <th>វត្តមាន</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in todaySessions" :key="session.id">
              <td class="course-name">
                <BookOpen :size="16" />
                {{ session.courseName }}
              </td>
              <td>{{ session.department || '-' }}</td>
              <td>{{ session.year || '-' }}</td>
              <td class="session-time">
                {{ formatSessionTime(session.sessionDate) }}
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(session.status)">
                  {{ getStatusLabel(session.status) }}
                </span>
              </td>
              <td class="attendance-counts">
                <span class="count present">{{ session.presentCount }}</span>
                <span class="count late">{{ session.lateCount }}</span>
                <span class="count absent">{{ session.absentCount }}</span>
              </td>
              <td class="actions-cell">
                <router-link
                  :to="`/teacher/attendance/${session.id}`"
                  class="action-link"
                >
                  <Eye :size="16" /> មើល
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Todo Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTodoModal" class="modal-overlay" @click.self="closeTodoModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ editingTodo ? 'កែប្រែកិច្ចការ' : 'បន្ថែមកិច្ចការ' }}</h3>
              <button class="close-btn" @click="closeTodoModal">
                <X :size="20" />
              </button>
            </div>
            <form @submit.prevent="handleSaveTodo" class="todo-form">
              <div class="form-group">
                <label>ចំណងជើង <span class="required">*</span></label>
                <input
                  v-model="todoForm.title"
                  type="text"
                  placeholder="បញ្ចូលចំណងជើង..."
                  required
                />
              </div>
              <div class="form-group">
                <label>ការពិពណ៌នា</label>
                <textarea
                  v-model="todoForm.description"
                  placeholder="បញ្ចូលការពិពណ៌នា..."
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label>កាលបរិច្ឆេទកំណត់</label>
                <input v-model="todoForm.dueDate" type="date" />
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeTodoModal">
                  បោះបង់
                </button>
                <button type="submit" class="btn-save" :disabled="savingTodo">
                  <span v-if="savingTodo" class="spinner-tiny"></span>
                  {{ editingTodo ? 'រក្សាទុក' : 'បន្ថែម' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Users, UserX, Percent, BookOpen, Plus, Check, Pencil, Trash2,
  Calendar, CalendarDays, Eye, ChevronRight, X, ListTodo, ClipboardList
} from 'lucide-vue-next'
import AttendanceChart from '../_components/AttendanceChart.vue'
import {
  getDashboardStats,
  getAttendanceTrend,
  getTodaySessions,
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo
} from '@/services/teacher-dashboard.api'

// ========== State ==========

// Stats
const loadingStats = ref(true)
const stats = ref({
  presentToday: 0,
  absentToday: 0,
  attendanceRate: 0,
  courseCompletion: 0
})

// Chart
const loadingChart = ref(true)
const chartError = ref('')
const selectedRange = ref('7')
const attendanceData = ref([])

// Sessions
const loadingSessions = ref(true)
const todaySessions = ref([])

// Todos
const loadingTodos = ref(true)
const todos = ref([])
const showTodoModal = ref(false)
const editingTodo = ref(null)
const savingTodo = ref(false)
const todoForm = reactive({
  title: '',
  description: '',
  dueDate: ''
})

// ========== Dashboard Stats ==========

const fetchStats = async () => {
  try {
    loadingStats.value = true
    const data = await getDashboardStats()
    stats.value = {
      presentToday: data.presentToday ?? 0,
      absentToday: data.absentToday ?? 0,
      attendanceRate: data.attendancePercentage ?? 0,
      courseCompletion: data.courseCompletion ?? 0
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    stats.value = { presentToday: 0, absentToday: 0, attendanceRate: 0, courseCompletion: 0 }
  } finally {
    loadingStats.value = false
  }
}

// ========== Attendance Trend ==========

const fetchTrendData = async () => {
  try {
    loadingChart.value = true
    chartError.value = ''
    const data = await getAttendanceTrend(parseInt(selectedRange.value))
    if (data && data.length > 0) {
      attendanceData.value = data
    } else {
      attendanceData.value = []
    }
  } catch (error) {
    console.error('Failed to fetch trend data:', error)
    chartError.value = 'បច្ចុប្បន្នមិនអាចទាញយកទិន្នន័យបានទេ។'
    attendanceData.value = []
  } finally {
    loadingChart.value = false
  }
}

// ========== Today's Sessions ==========

const fetchSessions = async () => {
  try {
    loadingSessions.value = true
    const data = await getTodaySessions()
    todaySessions.value = data || []
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    todaySessions.value = []
  } finally {
    loadingSessions.value = false
  }
}

const formatSessionTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = (status) => {
  const classes = {
    'ACTIVE': 'active',
    'STOPPED': 'stopped',
    'EXPIRED': 'expired',
    'PENDING': 'pending'
  }
  return classes[status] || 'pending'
}

const getStatusLabel = (status) => {
  const labels = {
    'ACTIVE': 'កំពុងដំណើរការ',
    'STOPPED': 'បានបញ្ឈប់',
    'EXPIRED': 'ផុតកំណត់',
    'PENDING': 'រង់ចាំ'
  }
  return labels[status] || status
}

// ========== Todo CRUD ==========

const fetchTodos = async () => {
  try {
    loadingTodos.value = true
    const data = await getTodos()
    todos.value = data || []
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    todos.value = []
  } finally {
    loadingTodos.value = false
  }
}

const openTodoModal = (todo = null) => {
  editingTodo.value = todo
  if (todo) {
    todoForm.title = todo.title
    todoForm.description = todo.description || ''
    todoForm.dueDate = todo.dueDate ? todo.dueDate.split('T')[0] : ''
  } else {
    todoForm.title = ''
    todoForm.description = ''
    todoForm.dueDate = ''
  }
  showTodoModal.value = true
}

const closeTodoModal = () => {
  showTodoModal.value = false
  editingTodo.value = null
  todoForm.title = ''
  todoForm.description = ''
  todoForm.dueDate = ''
}

const handleSaveTodo = async () => {
  if (!todoForm.title.trim()) return

  try {
    savingTodo.value = true
    const payload = {
      title: todoForm.title.trim(),
      description: todoForm.description.trim() || null,
      dueDate: todoForm.dueDate || null
    }

    if (editingTodo.value) {
      await updateTodo(editingTodo.value.id, payload)
    } else {
      await createTodo(payload)
    }

    await fetchTodos()
    closeTodoModal()
  } catch (error) {
    console.error('Failed to save todo:', error)
    alert('មានបញ្ហាក្នុងការរក្សាទុក។ សូមព្យាយាមម្តងទៀត។')
  } finally {
    savingTodo.value = false
  }
}

const handleToggleTodo = async (todoId) => {
  try {
    await toggleTodoComplete(todoId)
    await fetchTodos()
  } catch (error) {
    console.error('Failed to toggle todo:', error)
  }
}

const handleDeleteTodo = async (todoId) => {
  if (!confirm('តើអ្នកប្រាកដថាចង់លុបកិច្ចការនេះ?')) return

  try {
    await deleteTodo(todoId)
    await fetchTodos()
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}

const formatDueDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'ថ្ងៃនេះ'
  if (diffDays === 1) return 'ថ្ងៃស្អែក'
  if (diffDays === -1) return 'ម្សិលមិញ'
  if (diffDays < 0) return `${Math.abs(diffDays)} ថ្ងៃមុន`

  return `${date.getDate()}/${date.getMonth() + 1}`
}

// ========== Init ==========

onMounted(() => {
  fetchStats()
  fetchTrendData()
  fetchSessions()
  fetchTodos()
})
</script>

<style scoped>
/* ========== Base ========== */
h1 { color: #5d5fef; margin-bottom: 8px; font-size: 1.5rem; }
.page-header p { color: #64748b; margin-bottom: 24px; }

/* ========== Stats Grid ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skeleton-card {
  height: 88px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blue { background: #eef2ff; color: #6366f1; }
.orange { background: #fff7ed; color: #f59e0b; }
.green { background: #f0fdf4; color: #10b981; }
.red { background: #fef2f2; color: #ef4444; }

.stat-info p {
  margin: 0 0 4px 0;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.unit {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ========== Content Grid (Chart + Todos) ========== */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* ========== Section Common ========== */
.chart-section,
.todo-section,
.sessions-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.8rem;
  background: white;
  cursor: pointer;
}

.chart-container {
  height: 350px;
}

/* ========== Todo Section ========== */
.todo-section {
  display: flex;
  flex-direction: column;
  max-height: 450px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #4f46e5;
}

.todo-loading,
.todo-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 12px;
  padding: 40px 20px;
}

.todo-empty p {
  margin: 0;
  color: #64748b;
}

.add-btn-secondary {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: #f1f5f9;
  color: #6366f1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn-secondary:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.todo-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  transition: all 0.2s;
}

.todo-item:hover {
  background: #f1f5f9;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.todo-checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.todo-checkbox:hover {
  border-color: #6366f1;
}

.todo-item.completed .todo-checkbox {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  display: block;
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-due {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

.todo-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #eef2ff;
  color: #6366f1;
}

.action-btn.edit:hover {
  background: #c7d2fe;
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fecaca;
}

/* ========== Sessions Section ========== */
.sessions-section {
  margin-top: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6366f1;
  font-size: 0.85rem;
  text-decoration: none;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.sessions-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 48px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
}

.sessions-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  color: #94a3b8;
  gap: 12px;
}

.sessions-empty p {
  margin: 0;
  color: #64748b;
}

.sessions-table-wrapper {
  overflow-x: auto;
}

.sessions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.sessions-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.8rem;
  border-bottom: 1px solid #e2e8f0;
}

.sessions-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

.sessions-table tr:hover td {
  background: #f8fafc;
}

.course-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1e293b;
}

.session-time {
  font-family: 'SF Mono', monospace;
  color: #64748b;
}

.status-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.stopped {
  background: #f1f5f9;
  color: #64748b;
}

.status-badge.expired {
  background: #fef2f2;
  color: #dc2626;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.attendance-counts {
  display: flex;
  gap: 8px;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.count.present {
  background: #dcfce7;
  color: #15803d;
}

.count.late {
  background: #fef3c7;
  color: #d97706;
}

.count.absent {
  background: #fef2f2;
  color: #dc2626;
}

.actions-cell {
  text-align: center;
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  color: #6366f1;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-link:hover {
  background: #eef2ff;
}

/* ========== Modal ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.todo-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1e293b;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-tiny {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ========== Modal Transitions ========== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-10px);
}
</style>
