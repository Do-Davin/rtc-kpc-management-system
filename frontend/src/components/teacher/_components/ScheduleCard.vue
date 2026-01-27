<template>
  <div
    class="schedule-card"
    :style="{ backgroundColor: schedule.color + '15', borderLeftColor: schedule.color }"
  >
    <div class="card-header">
      <span class="subject-name" :style="{ color: schedule.color }">
        {{ schedule.subjectName }}
      </span>
      <div class="card-actions">
        <button class="action-btn edit-btn" @click="$emit('edit', schedule)" title="កែប្រែ">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', schedule.id)" title="លុប">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="info-row">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>{{ schedule.teacherName }}</span>
      </div>
      <div class="info-row">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>{{ schedule.group }} - {{ schedule.year }}</span>
      </div>
      <div class="info-row">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span>{{ schedule.room }}</span>
      </div>
      <div class="info-row time-row">
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        <span>{{ schedule.startTime }} - {{ schedule.endTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  schedule: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>

<style scoped>
.schedule-card {
  border-radius: 10px;
  padding: 10px 12px;
  border-left: 4px solid;
  height: 100%;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.schedule-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.subject-name {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.3;
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.schedule-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  background: white;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn {
  color: #5B55F3;
}

.edit-btn:hover {
  background: #5B55F3;
  color: white;
}

.delete-btn {
  color: #EF4444;
}

.delete-btn:hover {
  background: #EF4444;
  color: white;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
}

.info-row svg {
  flex-shrink: 0;
}

.time-row {
  margin-top: auto;
  padding-top: 6px;
  font-weight: 500;
  color: #374151;
}
</style>
