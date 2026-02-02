<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>កំពុងផ្ទុក...</p>
          </div>

          <template v-else>
          <!-- Hero Header with Gradient -->
          <div class="profile-hero">
            <button class="close-btn" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Profile Image with Status -->
            <div class="profile-image-container">
              <div class="image-wrapper" :class="{ 'editing': isEditing }">
                <img v-if="!isEditing && profileData.imageUrl"
                     :src="profileData.imageUrl"
                     alt="Profile"
                     class="profile-image" />
                <img v-else-if="isEditing && editData.imageUrl"
                     :src="editData.imageUrl"
                     alt="Profile"
                     class="profile-image" />
                <div v-else class="profile-placeholder">
                  <span class="placeholder-initials">{{ getInitials }}</span>
                </div>
                <label v-if="isEditing" class="image-upload-overlay">
                  <input type="file" accept="image/*" @change="handleImageUpload" hidden ref="fileInput" />
                  <div class="upload-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span class="upload-text">ជ្រើសរើសរូបភាព</span>
                  </div>
                </label>
              </div>
              <div class="online-status"></div>
              <button v-if="isEditing && editData.imageUrl" class="remove-image-btn" @click="removeImage" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Name & Role -->
            <h2 class="profile-name">{{ profileData.fullName }}</h2>
            <div class="profile-badges">
              <span class="badge badge-role">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                គ្រូបង្រៀន
              </span>
              <span class="badge badge-department">{{ profileData.department }}</span>
            </div>
          </div>

          <div class="modal-body">
            <!-- Stats Cards -->
            <div class="stats-row">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ profileData.studentCount }}</span>
                  <span class="stat-label">សិស្ស</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon courses">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ profileData.departmentCode || '-' }}</span>
                  <span class="stat-label">កូដផ្នែក</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon experience">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="stat-info">
                  <span class="stat-value" :class="{ 'active': profileData.status === 'ACTIVE', 'inactive': profileData.status === 'INACTIVE' }">
                    {{ profileData.status === 'ACTIVE' ? 'សកម្ម' : 'អសកម្ម' }}
                  </span>
                  <span class="stat-label">ស្ថានភាព</span>
                </div>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div class="info-card">
              <div class="card-header">
                <div class="header-left">
                  <div class="header-icon personal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 class="card-title">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                    <p class="card-subtitle">គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</p>
                  </div>
                </div>
                <button v-if="!isEditing" class="edit-btn" @click="startEdit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  កែសម្រួល
                </button>
                <div v-else class="edit-actions">
                  <button class="cancel-btn" @click="cancelEdit">បោះបង់</button>
                  <button class="save-btn" @click="saveChanges">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    រក្សាទុក
                  </button>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ឈ្មោះពេញ
                  </label>
                  <input
                    :value="isEditing ? editData.fullName : profileData.fullName"
                    @input="editData.fullName = $event.target.value"
                    type="text"
                    class="form-input"
                    :class="{ 'editable': isEditing }"
                    :disabled="!isEditing"
                    placeholder="បញ្ចូលឈ្មោះពេញ"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ថ្ងៃខែឆ្នាំកំណើត
                  </label>
                  <input
                    :value="isEditing ? editData.dateOfBirth : profileData.dateOfBirth"
                    @input="editData.dateOfBirth = $event.target.value"
                    type="date"
                    class="form-input"
                    :class="{ 'editable': isEditing }"
                    :disabled="!isEditing"
                  />
                </div>

                <div class="form-group full-width">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    អ៊ីមែល
                    <span class="field-locked">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                  </label>
                  <!-- Email is read-only -->
                  <input
                    :value="profileData.email"
                    type="email"
                    class="form-input"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Professional Information Section -->
            <div class="info-card professional">
              <div class="card-header">
                <div class="header-left">
                  <div class="header-icon professional">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="card-title">ព័ត៌មានវិជ្ជាជីវៈ</h3>
                    <p class="card-subtitle">ព័ត៌មានដែលគ្រប់គ្រងដោយអ្នកគ្រប់គ្រង</p>
                  </div>
                </div>
                <span class="readonly-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  មិនអាចកែប្រែ
                </span>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="13" x2="15" y2="13"></line>
                      <line x1="9" y1="17" x2="11" y2="17"></line>
                    </svg>
                    លេខសម្គាល់
                  </label>
                  <input
                    :value="profileData.teacherId"
                    type="text"
                    class="form-input"
                    disabled
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    នាយកដ្ឋាន
                  </label>
                  <input
                    :value="profileData.department"
                    type="text"
                    class="form-input"
                    disabled
                  />
                </div>

                <div class="form-group full-width">
                  <label class="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ជំនាញឯកទេស
                  </label>
                  <input
                    :value="profileData.specialization"
                    type="text"
                    class="form-input"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getTeacherProfile, updateTeacherProfile } from '@/services/teacher-dashboard.api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)

// Profile data from API
const profileData = reactive({
  id: '',
  imageUrl: '',
  fullName: '',
  dateOfBirth: '',
  email: '',
  teacherId: '',
  department: '',
  departmentCode: '',
  specialization: '',
  phoneNumber: '',
  studentCount: 0,
  status: ''
})

const editData = reactive({
  fullName: '',
  dateOfBirth: '',
  phoneNumber: '',
  imageUrl: ''
})

// Fetch profile when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await fetchProfile()
  }
})

const fetchProfile = async () => {
  isLoading.value = true
  error.value = null
  try {
    const profile = await getTeacherProfile()
    Object.assign(profileData, {
      id: profile.id,
      imageUrl: profile.imageUrl || '',
      fullName: profile.fullName || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      email: profile.email || '',
      teacherId: profile.employeeId || '',
      department: profile.department?.name || profile.department || '',
      departmentCode: profile.department?.code || profile.departmentCode || '',
      specialization: profile.specialization || '',
      phoneNumber: profile.phoneNumber || '',
      studentCount: profile.studentCount || 0,
      status: profile.status || ''
    })
  } catch (err) {
    console.error('Failed to fetch profile:', err)
    error.value = err.response?.data?.message || 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
}

const getInitials = computed(() => {
  const name = profileData.fullName || ''
  const words = name.split(' ').filter(w => w.length > 0)
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase() || '??'
})

const close = () => {
  if (isEditing.value) {
    if (confirm('តើអ្នកចង់បោះបង់ការផ្លាស់ប្តូរដែរឬទេ?')) {
      isEditing.value = false
      emit('close')
    }
  } else {
    emit('close')
  }
}

const startEdit = () => {
  editData.fullName = profileData.fullName
  editData.dateOfBirth = profileData.dateOfBirth
  editData.phoneNumber = profileData.phoneNumber
  editData.imageUrl = profileData.imageUrl
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveChanges = async () => {
  // Validate
  if (!editData.fullName.trim()) {
    alert('សូមបញ្ចូលឈ្មោះពេញ')
    return
  }

  isSaving.value = true
  error.value = null

  try {
    const updatedProfile = await updateTeacherProfile({
      fullName: editData.fullName,
      dateOfBirth: editData.dateOfBirth || undefined,
      phoneNumber: editData.phoneNumber || undefined,
      imageUrl: editData.imageUrl || undefined
    })

    // Update local profile data
    Object.assign(profileData, {
      fullName: updatedProfile.fullName,
      dateOfBirth: updatedProfile.dateOfBirth ? updatedProfile.dateOfBirth.split('T')[0] : '',
      phoneNumber: updatedProfile.phoneNumber || '',
      imageUrl: updatedProfile.imageUrl || ''
    })

    emit('update', updatedProfile)
    isEditing.value = false
    alert('រក្សាទុកព័ត៌មានបានជោគជ័យ!')
  } catch (err) {
    console.error('Failed to save profile:', err)
    error.value = err.response?.data?.message || 'Failed to save profile'
    alert(error.value)
  } finally {
    isSaving.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ទំហំរូបភាពធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('សូមជ្រើសរើសឯកសាររូបភាពប៉ុណ្ណោះ!')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      editData.imageUrl = e.target.result
    }
    reader.onerror = () => {
      alert('មានបញ្ហាក្នុងការអានឯកសារ!')
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  editData.imageUrl = ''
  // Reset file input
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>

<style scoped>
/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-container p {
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Status colors */
.stat-value.active {
  color: #16a34a;
}

.stat-value.inactive {
  color: #ef4444;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: #f8fafc;
  border-radius: 24px;
  max-width: 720px;
  width: 100%;
  max-height: 92vh;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 80px rgba(99, 102, 241, 0.15);
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.profile-hero {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 32px 32px 48px;
  position: relative;
  text-align: center;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

/* Profile Image */
.profile-image-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.image-wrapper {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

.image-wrapper.editing {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.2);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
}

.placeholder-initials {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 50%;
  color: white;
}

.image-wrapper:hover .image-upload-overlay {
  opacity: 1;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.upload-text {
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.online-status {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: #22c55e;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
}

/* Profile Name & Badges */
.profile-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-badges {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-role {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.badge-department {
  background: rgba(255, 255, 255, 0.95);
  color: #6366f1;
}

/* Modal Body */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  background: #f8fafc;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0 8px 24px;
  position: relative;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
  flex-shrink: 0;
}

.stat-icon.courses {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.stat-icon.experience {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
}

.header-icon.professional {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px;
}

.card-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.field-locked {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #fef3c7;
  border-radius: 50%;
  margin-left: 6px;
  color: #d97706;
}

/* Buttons */
.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.save-btn {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.readonly-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 10px;
}

.form-label svg {
  color: #94a3b8;
}

.form-input {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-input:not(:disabled):hover {
  border-color: #cbd5e1;
}

.form-input:not(:disabled):focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-input.editable {
  background: white;
  border-color: #6366f1;
}

.form-input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
  border-color: transparent;
}

.readonly-field {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 12px;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(30px);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .profile-hero {
    padding: 24px 20px 40px;
  }

  .stats-row {
    grid-template-columns: 1fr;
    margin: 0 4px 20px;
  }

  .stat-card {
    padding: 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 16px;
  }

  .info-card {
    padding: 20px;
    border-radius: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .edit-btn,
  .readonly-badge {
    align-self: flex-start;
  }
}
</style>
