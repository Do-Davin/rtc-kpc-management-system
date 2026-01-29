<template>
  <div class="teacher-report-wrapper">
    <div class="report-header">
      <div class="header-content">
        <div class="header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <h1 class="report-title">Teaching Report</h1>
          <p class="report-subtitle">Insights and observations for your classes</p>
        </div>
      </div>
      <button class="download-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Report
      </button>
    </div>

    <!-- Class Insights Section with Pie Charts -->
    <section class="report-section insights-section">
      <div class="section-header">
        <h2 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
            <rect x="15" y="5" width="4" height="12" rx="1"/>
            <rect x="7" y="8" width="4" height="9" rx="1"/>
          </svg>
          Class Insights
        </h2>
        <span class="section-badge">Live Data</span>
      </div>
      <div class="insights-grid">
        <div class="insight-card" v-for="insight in classInsights" :key="insight.id">
          <div class="pie-chart-container">
            <svg class="pie-chart" viewBox="0 0 36 36">
              <circle
                class="pie-bg"
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke-width="3"
              />
              <circle
                class="pie-progress"
                :style="{ stroke: insight.color, strokeDasharray: `${insight.percentage} ${100 - insight.percentage}` }"
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <div class="pie-center">
              <span class="pie-value">{{ insight.percentage }}%</span>
            </div>
          </div>
          <div class="insight-content">
            <h3 class="insight-label">{{ insight.label }}</h3>
            <p class="insight-value">{{ insight.value }}</p>
            <p class="insight-description">{{ insight.description }}</p>
            <div class="insight-trend" :class="insight.trend">
              <svg
                v-if="insight.trend === 'up'"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <svg
                v-else-if="insight.trend === 'down'"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>{{ insight.trendText }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Student Signals Section with Drag & Drop -->
    <section class="report-section signals-section">
      <div class="section-header">
        <h2 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Student Signals
        </h2>
        <p class="drag-hint">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="5 9 2 12 5 15"></polyline>
            <polyline points="9 5 12 2 15 5"></polyline>
            <polyline points="15 19 12 22 9 19"></polyline>
            <polyline points="19 9 22 12 19 15"></polyline>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
          Drag students between groups
        </p>
      </div>
      <p class="section-description">
        Students who may need attention or recognition
      </p>

      <div class="signals-container">
        <!-- At Risk -->
        <div
          class="signal-group at-risk-group"
          @dragover.prevent="handleDragOver($event, 'atRisk')"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, 'atRisk')"
          :class="{ 'drag-over': dragOverGroup === 'atRisk' }"
        >
          <div class="signal-group-header">
            <h3 class="signal-group-title">
              <span class="status-dot at-risk"></span>
              At Risk
            </h3>
            <span class="student-count">{{ atRiskStudents.length }}</span>
          </div>
          <div class="student-cards" :class="{ 'no-transitions': disableTransitions }">
            <TransitionGroup name="card-list">
              <div
                class="student-card"
                v-for="student in atRiskStudents"
                :key="student.id"
                draggable="true"
                @dragstart="handleDragStart($event, student, 'atRisk')"
                @dragend="handleDragEnd"
                :class="{ 'dragging': draggedStudent?.id === student.id }"
              >
                <div class="drag-handle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="9" cy="6" r="1.5"></circle>
                    <circle cx="15" cy="6" r="1.5"></circle>
                    <circle cx="9" cy="12" r="1.5"></circle>
                    <circle cx="15" cy="12" r="1.5"></circle>
                    <circle cx="9" cy="18" r="1.5"></circle>
                    <circle cx="15" cy="18" r="1.5"></circle>
                  </svg>
                </div>
                <div class="student-avatar" :style="{ background: student.gradient }">
                  {{ student.initials }}
                </div>
                <div class="student-info">
                  <p class="student-name">{{ student.name }}</p>
                  <span class="status-badge at-risk">{{ student.status }}</span>
                </div>
              </div>
            </TransitionGroup>
            <div v-if="atRiskStudents.length === 0" class="empty-group">
              <span>No students at risk</span>
            </div>
          </div>
        </div>

        <!-- Inconsistent -->
        <div
          class="signal-group inconsistent-group"
          @dragover.prevent="handleDragOver($event, 'inconsistent')"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, 'inconsistent')"
          :class="{ 'drag-over': dragOverGroup === 'inconsistent' }"
        >
          <div class="signal-group-header">
            <h3 class="signal-group-title">
              <span class="status-dot inconsistent"></span>
              Inconsistent
            </h3>
            <span class="student-count">{{ inconsistentStudents.length }}</span>
          </div>
          <div class="student-cards" :class="{ 'no-transitions': disableTransitions }">
            <TransitionGroup name="card-list">
              <div
                class="student-card"
                v-for="student in inconsistentStudents"
                :key="student.id"
                draggable="true"
                @dragstart="handleDragStart($event, student, 'inconsistent')"
                @dragend="handleDragEnd"
                :class="{ 'dragging': draggedStudent?.id === student.id }"
              >
                <div class="drag-handle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="9" cy="6" r="1.5"></circle>
                    <circle cx="15" cy="6" r="1.5"></circle>
                    <circle cx="9" cy="12" r="1.5"></circle>
                    <circle cx="15" cy="12" r="1.5"></circle>
                    <circle cx="9" cy="18" r="1.5"></circle>
                    <circle cx="15" cy="18" r="1.5"></circle>
                  </svg>
                </div>
                <div class="student-avatar" :style="{ background: student.gradient }">
                  {{ student.initials }}
                </div>
                <div class="student-info">
                  <p class="student-name">{{ student.name }}</p>
                  <span class="status-badge inconsistent">{{ student.status }}</span>
                </div>
              </div>
            </TransitionGroup>
            <div v-if="inconsistentStudents.length === 0" class="empty-group">
              <span>No inconsistent students</span>
            </div>
          </div>
        </div>

        <!-- Excelling -->
        <div
          class="signal-group excelling-group"
          @dragover.prevent="handleDragOver($event, 'excelling')"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, 'excelling')"
          :class="{ 'drag-over': dragOverGroup === 'excelling' }"
        >
          <div class="signal-group-header">
            <h3 class="signal-group-title">
              <span class="status-dot excelling"></span>
              Excelling
            </h3>
            <span class="student-count">{{ excellingStudents.length }}</span>
          </div>
          <div class="student-cards" :class="{ 'no-transitions': disableTransitions }">
            <TransitionGroup name="card-list">
              <div
                class="student-card"
                v-for="student in excellingStudents"
                :key="student.id"
                draggable="true"
                @dragstart="handleDragStart($event, student, 'excelling')"
                @dragend="handleDragEnd"
                :class="{ 'dragging': draggedStudent?.id === student.id }"
              >
                <div class="drag-handle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="9" cy="6" r="1.5"></circle>
                    <circle cx="15" cy="6" r="1.5"></circle>
                    <circle cx="9" cy="12" r="1.5"></circle>
                    <circle cx="15" cy="12" r="1.5"></circle>
                    <circle cx="9" cy="18" r="1.5"></circle>
                    <circle cx="15" cy="18" r="1.5"></circle>
                  </svg>
                </div>
                <div class="student-avatar" :style="{ background: student.gradient }">
                  {{ student.initials }}
                </div>
                <div class="student-info">
                  <p class="student-name">{{ student.name }}</p>
                  <span class="status-badge excelling">{{ student.status }}</span>
                </div>
              </div>
            </TransitionGroup>
            <div v-if="excellingStudents.length === 0" class="empty-group">
              <span>No excelling students</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Teaching Notes Section -->
    <section class="report-section notes-section">
      <div class="section-header">
        <h2 class="section-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-notebook-pen-icon lucide-notebook-pen"
          >
            <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/>
            <path d="M2 6h4"/>
            <path d="M2 10h4"/>
            <path d="M2 14h4"/>
            <path d="M2 18h4"/>
            <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
          </svg>
          Teaching Notes
        </h2>
        <span class="last-saved" v-if="lastSaved">Last saved: {{ lastSaved }}</span>
      </div>
      <p class="section-description">
        Your observations and reflections on recent lessons
      </p>
      <div class="notes-container">
        <textarea
          v-model="teachingNotes"
          class="notes-textarea"
          placeholder="Record your observations, reflections, and insights here...&#10;&#10;
          Example:&#10;
          • Students showed strong understanding of conditional statements&#10;
          • Need to revisit loop concepts next week&#10;
          • Group activities were particularly effective today&#10;
          • Consider pairing struggling students with high performers"
        ></textarea>
        <div class="notes-footer">
          <div class="notes-meta">
            <span class="character-count">{{ teachingNotes.length }} characters</span>
            <span class="word-count">{{ wordCount }} words</span>
          </div>
          <button class="save-notes-btn" @click="saveNotes">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Notes
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const disableTransitions = ref(false);

const classInsights = ref([
  {
    id: 1,
    label: 'Learning Pace',
    value: 'Steady Progress',
    percentage: 72,
    description: 'Most students keeping up with curriculum',
    color: '#4c6ef5',
    trend: 'up',
    trendText: '+5% from last week'
  },
  {
    id: 2,
    label: 'Engagement Level',
    value: 'High',
    percentage: 85,
    description: 'Active participation in discussions',
    color: '#40c057',
    trend: 'up',
    trendText: '+12% improvement'
  },
  {
    id: 3,
    label: 'Class Difficulty',
    value: 'Moderate',
    percentage: 58,
    description: 'Appropriately challenging content',
    color: '#fab005',
    trend: 'stable',
    trendText: 'Stable level'
  }
]);

const atRiskStudents = ref([
  { id: 1, name: 'Do Davin', initials: 'DD', status: 'Low attendance', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' },
  { id: 2, name: 'Chan Dara', initials: 'CD', status: 'Struggling', gradient: 'linear-gradient(135deg, #ff8787, #fa5252)' },
  { id: 3, name: 'Bun Ra', initials: 'BR', status: 'Missed assignments', gradient: 'linear-gradient(135deg, #ffa8a8, #ff6b6b)' }
]);

const inconsistentStudents = ref([
  { id: 4, name: 'Van Na', initials: 'VN', status: 'Variable performance', gradient: 'linear-gradient(135deg, #ffd43b, #fab005)' },
  { id: 5, name: 'Sok Leng', initials: 'SL', status: 'Irregular attendance', gradient: 'linear-gradient(135deg, #ffe066, #fcc419)' },
  { id: 6, name: 'Meng Houy', initials: 'MH', status: 'Fluctuating grades', gradient: 'linear-gradient(135deg, #ffec99, #ffd43b)' }
]);

const excellingStudents = ref([
  { id: 7, name: 'Mong Kol', initials: 'MK', status: 'Outstanding work', gradient: 'linear-gradient(135deg, #40c057, #2f9e44)' },
  { id: 8, name: 'Dara Rith', initials: 'DR', status: 'High achiever', gradient: 'linear-gradient(135deg, #51cf66, #40c057)' },
  { id: 9, name: 'Bun Leng', initials: 'BL', status: 'Consistent excellence', gradient: 'linear-gradient(135deg, #69db7c, #51cf66)' },
  { id: 10, name: 'Meng Kong', initials: 'MK', status: 'Top performer', gradient: 'linear-gradient(135deg, #8ce99a, #69db7c)' }
]);

const draggedStudent = ref(null);
const dragSourceGroup = ref(null);
const dragOverGroup = ref(null);

const handleDragStart = (event, student, sourceGroup) => {
  draggedStudent.value = student;
  dragSourceGroup.value = sourceGroup;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', student.id);
};

const handleDragEnd = () => {
  draggedStudent.value = null;
  dragSourceGroup.value = null;
  dragOverGroup.value = null;
};

const handleDragOver = (event, targetGroup) => {
  event.preventDefault();
  dragOverGroup.value = targetGroup;
};

const handleDragLeave = () => {
  dragOverGroup.value = null;
};

const handleDrop = async (event, targetGroup) => {
  event.preventDefault();

  if (!draggedStudent.value || dragSourceGroup.value === targetGroup) {
    dragOverGroup.value = null;
    return;
  }

  const student = draggedStudent.value;
  const sourceGroupName = dragSourceGroup.value;

  // Disable transitions during the operation to prevent glitches
  disableTransitions.value = true;

  // Update student status based on target group
  const updatedStudent = { ...student };
  if (targetGroup === 'atRisk') {
    updatedStudent.status = 'Needs attention';
    updatedStudent.gradient = 'linear-gradient(135deg, #ff6b6b, #ee5a5a)';
  } else if (targetGroup === 'inconsistent') {
    updatedStudent.status = 'Variable performance';
    updatedStudent.gradient = 'linear-gradient(135deg, #ffd43b, #fab005)';
  } else {
    updatedStudent.status = 'High achiever';
    updatedStudent.gradient = 'linear-gradient(135deg, #40c057, #2f9e44)';
  }

  // Remove from source group
  const sourceArray = getGroupArray(sourceGroupName);
  const index = sourceArray.value.findIndex(s => s.id === student.id);
  if (index > -1) {
    sourceArray.value.splice(index, 1);
  }

  // Add to target group
  const targetArray = getGroupArray(targetGroup);
  targetArray.value.push(updatedStudent);

  dragOverGroup.value = null;

  // Re-enable transitions after DOM update
  await nextTick();
  requestAnimationFrame(() => {
    disableTransitions.value = false;
  });
};

const getGroupArray = (groupName) => {
  switch (groupName) {
    case 'atRisk': return atRiskStudents;
    case 'inconsistent': return inconsistentStudents;
    case 'excelling': return excellingStudents;
    default: return atRiskStudents;
  }
};

// Teaching notes
const teachingNotes = ref('');
const lastSaved = ref('');

const wordCount = computed(() => {
  if (!teachingNotes.value.trim()) return 0;
  return teachingNotes.value.trim().split(/\s+/).length;
});

const saveNotes = () => {
  const now = new Date();
  lastSaved.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.teacher-report-wrapper {
  width: 100%;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #4c6ef5, #748ffc);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.report-title {
  font-size: 1.75rem;
  font-weight: 800;

  /* Gradient custom primary color ឲ look modern */
  background: linear-gradient(135deg, #5B55F3, #7C78FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* cross-browser safety ឲស្អាតក្នុង Firefox too */
  letter-spacing: -0.02em;
}

.report-subtitle {
  font-size: 0.95rem;
  /* color: #64748b; */
  color: var(--purple-300);
  margin: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #4c6ef5, #5c7cfa);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(76, 110, 245, 0.25);
}

.download-btn:hover {
  background: linear-gradient(135deg, #4263eb, #5c7cfa);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 110, 245, 0.35);
}

.download-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(76, 110, 245, 0.25);
}

.report-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.report-section:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 10px 24px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.35rem;
  font-weight: 700;
  background: linear-gradient(135deg, #5B55F3, #7C78FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title svg {
  color: var(--purple-500);
}

.section-badge {
  padding: 0.35rem 0.85rem;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #059669;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-description {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.insight-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.75rem;
  background: linear-gradient(135deg, #fafbfc, #f8fafc);
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.insight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.pie-chart-container {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.pie-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.pie-bg {
  stroke: #e2e8f0;
}

.pie-progress {
  stroke-dashoffset: 0;
  transition: stroke-dasharray 1s ease-in-out;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
}

.insight-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.insight-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 0.35rem 0;
}

.insight-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.35rem 0;
}

.insight-description {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.insight-trend {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  width: fit-content;
  margin-top: auto;
}

.insight-trend.up {
  background: #ecfdf5;
  color: #059669;
}

.insight-trend.down {
  background: #fef2f2;
  color: #dc2626;
}

.insight-trend.stable {
  background: #fefce8;
  color: #ca8a04;
}

/* Student Signals with Drag & Drop (New Observation) */
.drag-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.signals-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.signal-group {
  background: linear-gradient(135deg, #fafbfc, #f8fafc);
  border-radius: 14px;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 200px;
}

.signal-group.drag-over {
  border-color: #4c6ef5;
  background: linear-gradient(135deg, #f1f5ff, #eef2ff);
  box-shadow: 0 0 0 4px rgba(76, 110, 245, 0.1);
}

.at-risk-group.drag-over {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fff1f2);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.inconsistent-group.drag-over {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.excelling-group.drag-over {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.signal-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.signal-group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.student-count {
  background: #e2e8f0;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.at-risk {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.status-dot.inconsistent {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.status-dot.excelling {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
}

.student-cards {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.student-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.student-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.student-card:active {
  cursor: grabbing;
}

.student-card.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.drag-handle {
  color: #cbd5e1;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.student-card:hover .drag-handle {
  color: #94a3b8;
}

.student-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.85rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.student-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* (...) make overflow text look good */
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-badge.at-risk {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #dc2626;
}

.status-badge.inconsistent {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  color: #d97706;
}

.status-badge.excelling {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  color: #16a34a;
}

.empty-group {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.9rem;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
}

.card-list-move {
  transition: transform 0.2s ease;
}

.card-list-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.card-list-leave-active {
  transition: none;
  display: none;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.card-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Disable all transitions during drag-drop (Important Noted) */
.no-transitions .student-card,
.no-transitions .card-list-move,
.no-transitions .card-list-enter-active,
.no-transitions .card-list-leave-active {
  transition: none !important;
}

.notes-section .section-header {
  margin-bottom: 0.5rem;
}

.last-saved {
  font-size: 0.8rem;
  color: #22c55e;
  font-weight: 500;
}

.notes-container {
  margin-top: 1rem;
}

.notes-textarea {
  width: 100%;
  min-height: 220px;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1e293b;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.7;
  background: #fafbfc;
}

.notes-textarea:focus {
  outline: none;
  border-color: #4c6ef5;
  box-shadow: 0 0 0 4px rgba(76, 110, 245, 0.1);
  background: white;
}

.notes-textarea::placeholder {
  color: #94a3b8;
}

.notes-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.notes-meta {
  display: flex;
  gap: 1rem;
}

.character-count,
.word-count {
  font-size: 0.8rem;
  color: #94a3b8;
  padding: 0.25rem 0.6rem;
  background: #f1f5f9;
  border-radius: 6px;
}

.save-notes-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--purple-500);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.save-notes-btn:hover {
  background-color: var(--purple-700);
  scale: 1.025;
  box-shadow: 0 6px 16px rgba(92, 124, 250, 0.3);
}

.save-notes-btn:active {
  scale: 1;
  box-shadow: none;
}

@media (max-width: 768px) {
  .teacher-report-wrapper {
    padding: 1rem;
  }

  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
  }

  .insights-grid,
  .signals-container {
    grid-template-columns: 1fr;
  }

  .insight-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .insight-trend {
    margin: 0 auto;
  }

  .report-section {
    padding: 1.25rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .notes-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .save-notes-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
