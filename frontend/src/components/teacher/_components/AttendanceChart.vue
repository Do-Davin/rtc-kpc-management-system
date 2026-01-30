<template>
  <div class="chart-wrapper">
    <!-- Error State -->
    <div v-if="error" class="chart-state chart-error">
      <AlertCircle :size="40" />
      <p class="state-title">មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ</p>
      <p class="state-message">{{ error }}</p>
      <button class="retry-btn" @click="$emit('retry')">
        <RefreshCw :size="16" />
        សាកល្បងម្តងទៀត
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="chart-state chart-loading">
      <div class="spinner-medium"></div>
      <p class="state-title">កំពុងផ្ទុកទិន្នន័យ...</p>
      <p class="state-message">សូមរង់ចាំបន្តិច</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data || data.length === 0" class="chart-state chart-empty">
      <BarChart3 :size="48" />
      <p class="state-title">មិនមានទិន្នន័យនៅឡើយទេ</p>
      <p class="state-message">សូមជ្រើសរើសអំឡុងពេលផ្សេង ឬរង់ចាំទិន្នន័យថ្មី</p>
    </div>

    <!-- Chart -->
    <div v-else class="chart-content">
      <!-- Legend -->
      <div class="chart-legend">
        <div
          v-for="series in activeSeries"
          :key="series.key"
          class="legend-item"
          :class="{ active: visibleSeries[series.key] }"
          @click="toggleSeries(series.key)"
        >
          <span class="legend-color" :style="{ backgroundColor: series.color }"></span>
          <span class="legend-label">{{ series.label }}</span>
        </div>
      </div>

      <svg
        ref="chartSvg"
        class="line-chart"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Gradient Definitions -->
        <defs>
          <linearGradient
            v-for="series in seriesConfig"
            :key="'gradient-' + series.key"
            :id="'gradient-' + series.key"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" :stop-color="series.color" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="series.color" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="'grid-' + i"
            :x1="padding.left"
            :y1="getY((i - 1) * 25)"
            :x2="width - padding.right"
            :y2="getY((i - 1) * 25)"
            stroke="#e2e8f0"
            stroke-dasharray="4"
          />
        </g>

        <!-- Y Axis Labels -->
        <g class="y-labels">
          <text
            v-for="i in 5"
            :key="'y-label-' + i"
            :x="padding.left - 10"
            :y="getY((i - 1) * 25) + 4"
            text-anchor="end"
            class="axis-label"
          >
            {{ (i - 1) * 25 }}%
          </text>
        </g>

        <!-- Area Fills for each series -->
        <g class="area-fills">
          <transition-group name="fade">
            <path
              v-for="series in activeSeries"
              v-show="visibleSeries[series.key]"
              :key="'area-' + series.key"
              :d="getAreaPath(series.key)"
              :fill="`url(#gradient-${series.key})`"
              class="area-fill"
            />
          </transition-group>
        </g>

        <!-- Lines for each series -->
        <g class="trend-lines">
          <path
            v-for="series in activeSeries"
            v-show="visibleSeries[series.key]"
            :key="'line-' + series.key"
            :d="getLinePath(series.key)"
            :stroke="series.color"
            class="trend-line"
            fill="none"
          />
        </g>

        <!-- Data Points for each series -->
        <g class="data-points-group">
          <g
            v-for="series in activeSeries"
            v-show="visibleSeries[series.key]"
            :key="'points-' + series.key"
            class="series-points"
          >
            <circle
              v-for="(point, index) in getChartPoints(series.key)"
              :key="'point-' + series.key + '-' + index"
              :cx="point.x"
              :cy="point.y"
              r="5"
              :fill="series.color"
              class="data-point"
              @mouseenter="showTooltip($event, point, series)"
              @mouseleave="hideTooltip"
            />
          </g>
        </g>

        <!-- X Axis Labels -->
        <g class="x-labels">
          <text
            v-for="(label, index) in xLabels"
            :key="'x-label-' + index"
            :x="label.x"
            :y="height - padding.bottom + 20"
            text-anchor="middle"
            class="axis-label"
          >
            {{ label.text }}
          </text>
        </g>
      </svg>

      <!-- Tooltip -->
      <Transition name="tooltip">
        <div
          v-if="tooltip.visible"
          class="chart-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-header">
            <span class="tooltip-indicator" :style="{ backgroundColor: tooltip.color }"></span>
            <span class="tooltip-series">{{ tooltip.seriesLabel }}</span>
          </div>
          <div class="tooltip-date">{{ tooltip.date }}</div>
          <div class="tooltip-value">{{ tooltip.value }}{{ tooltip.unit }}</div>
          <div v-if="tooltip.detail" class="tooltip-detail">{{ tooltip.detail }}</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { BarChart3, AlertCircle, RefreshCw } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showPresent: {
    type: Boolean,
    default: true
  },
  showAbsent: {
    type: Boolean,
    default: true
  },
  showAttendancePercent: {
    type: Boolean,
    default: true
  },
  showCourseCompletion: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])

// Chart dimensions
const width = 800
const height = 300
const padding = { top: 30, right: 30, bottom: 50, left: 55 }

// Series configuration
const seriesConfig = [
  {
    key: 'present',
    label: 'វត្តមាន',
    color: '#10b981',
    unit: ' នាក់',
    dataKey: 'present',
    isPercentage: false
  },
  {
    key: 'absent',
    label: 'អវត្តមាន',
    color: '#ef4444',
    unit: ' នាក់',
    dataKey: 'absent',
    isPercentage: false
  },
  {
    key: 'attendancePercent',
    label: 'អត្រាវត្តមាន',
    color: '#6366f1',
    unit: '%',
    dataKey: 'percentage',
    isPercentage: true
  },
  {
    key: 'courseCompletion',
    label: 'វគ្គសិក្សាបានបញ្ចប់',
    color: '#f59e0b',
    unit: '%',
    dataKey: 'courseCompletion',
    isPercentage: true
  }
]

// Visibility state for each series
const visibleSeries = reactive({
  present: props.showPresent,
  absent: props.showAbsent,
  attendancePercent: props.showAttendancePercent,
  courseCompletion: props.showCourseCompletion
})

// Watch for prop changes
watch(() => props.showPresent, (val) => { visibleSeries.present = val })
watch(() => props.showAbsent, (val) => { visibleSeries.absent = val })
watch(() => props.showAttendancePercent, (val) => { visibleSeries.attendancePercent = val })
watch(() => props.showCourseCompletion, (val) => { visibleSeries.courseCompletion = val })

// Active series based on available data
const activeSeries = computed(() => {
  if (!props.data || props.data.length === 0) return []

  return seriesConfig.filter(series => {
    // Check if data exists for this series
    const hasData = props.data.some(item => item[series.dataKey] !== undefined)
    return hasData
  })
})

// Toggle series visibility
const toggleSeries = (key) => {
  visibleSeries[key] = !visibleSeries[key]
}

// Tooltip state
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  date: '',
  value: 0,
  unit: '',
  detail: '',
  seriesLabel: '',
  color: ''
})

// Calculate max value for scaling (for non-percentage values)
const maxValue = computed(() => {
  if (!props.data || props.data.length === 0) return 100

  let max = 0
  props.data.forEach(item => {
    if (item.present !== undefined) max = Math.max(max, item.present)
    if (item.absent !== undefined) max = Math.max(max, item.absent)
    if (item.total !== undefined) max = Math.max(max, item.total)
  })

  // Round up to nearest 10
  return Math.ceil(max / 10) * 10 || 100
})

// Calculate Y position based on value
const getY = (value, isPercentage = true) => {
  const chartHeight = height - padding.top - padding.bottom
  const maxVal = isPercentage ? 100 : maxValue.value
  return padding.top + chartHeight - (value / maxVal) * chartHeight
}

// Calculate X position based on index
const getX = (index, total) => {
  const chartWidth = width - padding.left - padding.right
  if (total <= 1) return padding.left + chartWidth / 2
  return padding.left + (index / (total - 1)) * chartWidth
}

// Get chart points for a specific series
const getChartPoints = (seriesKey) => {
  if (!props.data || props.data.length === 0) return []

  const series = seriesConfig.find(s => s.key === seriesKey)
  if (!series) return []

  return props.data.map((item, index) => {
    const value = item[series.dataKey] ?? 0
    return {
      x: getX(index, props.data.length),
      y: getY(value, series.isPercentage),
      date: item.date,
      value: value,
      present: item.present,
      absent: item.absent,
      total: item.total,
      courseCompletion: item.courseCompletion
    }
  })
}

// Get line path for a specific series
const getLinePath = (seriesKey) => {
  const points = getChartPoints(seriesKey)
  if (points.length === 0) return ''

  // Create smooth curve using cardinal spline
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  // Smooth curve with bezier
  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

// Get area path for a specific series
const getAreaPath = (seriesKey) => {
  const points = getChartPoints(seriesKey)
  if (points.length === 0) return ''

  const baseline = height - padding.bottom
  let path = `M ${points[0].x} ${baseline}`
  path += ` L ${points[0].x} ${points[0].y}`

  // Smooth curve matching the line
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  path += ` L ${points[points.length - 1].x} ${baseline}`
  path += ' Z'

  return path
}

// X axis labels
const xLabels = computed(() => {
  if (!props.data || props.data.length === 0) return []

  const step = Math.ceil(props.data.length / 7)
  const labels = []

  for (let i = 0; i < props.data.length; i += step) {
    const date = new Date(props.data[i].date)
    labels.push({
      x: getX(i, props.data.length),
      text: `${date.getDate()}/${date.getMonth() + 1}`
    })
  }

  return labels
})

// Format date for tooltip
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
                  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

// Tooltip handlers
const showTooltip = (event, point, series) => {
  const rect = event.target.getBoundingClientRect()
  const parentRect = event.target.closest('.chart-wrapper').getBoundingClientRect()

  tooltip.visible = true
  tooltip.x = rect.left - parentRect.left + 15
  tooltip.y = rect.top - parentRect.top - 85
  tooltip.date = formatDate(point.date)
  tooltip.value = point.value
  tooltip.unit = series.unit
  tooltip.seriesLabel = series.label
  tooltip.color = series.color

  // Build detail string
  if (series.key === 'present' || series.key === 'absent') {
    tooltip.detail = `សរុប: ${point.total} សិស្ស`
  } else if (series.key === 'attendancePercent') {
    tooltip.detail = `${point.present}/${point.total} សិស្ស`
  } else {
    tooltip.detail = ''
  }
}

const hideTooltip = () => {
  tooltip.visible = false
}
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.chart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  color: #64748b;
  gap: 12px;
  padding: 40px 20px;
  text-align: center;
}

.state-title {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin: 0;
}

.state-message {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.chart-error {
  color: #dc2626;
}

.chart-error .state-title {
  color: #dc2626;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.spinner-medium {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 16px;
  margin-bottom: 8px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  user-select: none;
}

.legend-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.legend-item.active {
  background: white;
  border-color: #94a3b8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.legend-item:not(.active) {
  opacity: 0.5;
}

.legend-item:not(.active) .legend-color {
  background-color: #94a3b8 !important;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  color: #475569;
  font-weight: 500;
}

.line-chart {
  flex: 1;
  width: 100%;
  min-height: 250px;
}

.axis-label {
  font-size: 11px;
  fill: #94a3b8;
  font-family: inherit;
}

.area-fill {
  transition: opacity 0.3s ease;
}

.trend-line {
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: opacity 0.3s ease;
}

.data-point {
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s;
}

.data-point:hover {
  r: 7;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.chart-tooltip {
  position: absolute;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  min-width: 140px;
}

.chart-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 12px;
  height: 12px;
  background: #334155;
  transform: rotate(45deg);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-indicator {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.tooltip-series {
  font-weight: 600;
  font-size: 0.8rem;
  color: #e2e8f0;
}

.tooltip-date {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.tooltip-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.tooltip-detail {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .chart-legend {
    gap: 8px;
    padding: 8px 12px;
  }

  .legend-item {
    padding: 4px 10px;
    font-size: 0.75rem;
  }

  .legend-color {
    width: 10px;
    height: 10px;
  }

  .chart-tooltip {
    font-size: 0.8rem;
    padding: 10px 12px;
  }
}
</style>
