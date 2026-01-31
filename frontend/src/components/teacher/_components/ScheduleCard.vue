<template>
  <div
    class="schedule-card"
    :class="{ 'is-other-teacher': isOtherTeacher }"
    :style="cardStyle"
  >
    <div class="card-header">
      <div class="header-left">
        <span class="type-badge" :class="schedule.type?.toLowerCase() || 'lecture'">
          {{ schedule.type || 'Lecture' }}
        </span>
        <span class="subject-name" :style="{ color: isOtherTeacher ? '#9ca3af' : schedule.color }">
          {{ schedule.subjectName }}
        </span>
      </div>
      <div v-if="!isOtherTeacher" class="card-actions">
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
        <span>{{ schedule.teacherName || schedule.teacher?.fullName }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  schedule: {
    type: Object,
    required: true,
  },
  isOtherTeacher: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['edit', 'delete']);

const cardStyle = computed(() => {
  if (props.isOtherTeacher) {
    return {
      backgroundColor: '#f3f4f6',
      borderLeftColor: '#d1d5db',
    };
  }
  return {
    backgroundColor: props.schedule.color + '15',
    borderLeftColor: props.schedule.color,
  };
});
</script>

<style scoped>
.schedule-card {
  border-radius: 10px;
  padding: 8px 10px;
  border-left: 4px solid;
  height: 100%;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.schedule-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.schedule-card.is-other-teacher {
  opacity: 0.7;
}

.schedule-card.is-other-teacher:hover {
  transform: none;
  box-shadow: none;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 4px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.type-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  width: fit-content;
}

.type-badge.lecture {
  background: #dbeafe;
  color: #1d4ed8;
}

.type-badge.practical {
  background: #dcfce7;
  color: #15803d;
}

.type-badge.lab {
  background: #fef3c7;
  color: #b45309;
}

.subject-name {
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.schedule-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  background: white;
  border: none;
  padding: 3px;
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
  gap: 3px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #6b7280;
}

.info-row svg {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
}

.is-other-teacher .info-row {
  color: #9ca3af;
}
</style>
