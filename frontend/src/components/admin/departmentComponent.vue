<script setup>
import { ref, computed, onMounted } from 'vue';
import adminService from '@/services/admin.service';
import { Plus, Search, Building2, Users, Edit2, Trash2 } from 'lucide-vue-next';

const departments = ref([]);
const showModal = ref(false);
const isEditing = ref(false); // Restore editing state
const editId = ref(null);
const searchQuery = ref('');
const form = ref({ name: '', code: '', status: 'Active' });
const loading = ref(false);
const submitting = ref(false);

const fetchDepartments = async () => {
  loading.value = true;
  try {
    const res = await adminService.getDepartments();
    departments.value = res.data;
  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
};

const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value;
  const lower = searchQuery.value.toLowerCase();
  return departments.value.filter(d => d.name.toLowerCase().includes(lower) || d.code.toLowerCase().includes(lower));
});

const openCreate = () => {
  isEditing.value = false;
  form.value = { name: '', code: '', status: 'Active' };
  showModal.value = true;
};

// RESTORED: Edit Function
const openEdit = (dept) => {
  isEditing.value = true;
  editId.value = dept.id;
  form.value = { 
    name: dept.name, 
    code: dept.code, 
    status: dept.status || 'Active' 
  };
  showModal.value = true;
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (isEditing.value) {
       // Update existing
       await adminService.updateDepartment(editId.value, form.value);
    } else {
       // Create new
       await adminService.createDepartment(form.value);
    }
    showModal.value = false;
    await fetchDepartments();
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving department');
  } finally {
    submitting.value = false;
  }
};

// RESTORED: Delete Function
const handleDelete = async (id) => {
  if (!confirm('Are you sure? This cannot be undone.')) return;
  try {
    await adminService.deleteDepartment(id);
    await fetchDepartments();
  } catch (err) {
    alert('Cannot delete: Department in use');
  }
};

onMounted(fetchDepartments);
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div><h2 class="page-title">Departments</h2><p class="page-subtitle">Manage faculties and majors</p></div>
      <div class="header-actions">
        <span class="badge">{{ departments.length }} Total</span>
        <button @click="openCreate" class="btn-primary"><Plus size="18" /> Add New</button>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <Search size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Search departments..." />
      </div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loading-state">Loading...</div>
      <table v-else-if="filteredDepartments.length > 0" class="custom-table">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Code</th>
            <th>Teachers</th>
            <th>Status</th>
            <th class="text-right">Actions</th> </tr>
        </thead>
        <tbody>
          <tr v-for="dept in filteredDepartments" :key="dept.id">
            <td>
                <div class="dept-name">
                    <div class="icon-box"><Building2 size="16"/></div>
                    <span>{{ dept.name }}</span>
                </div>
            </td>
            <td><span class="code-badge">{{ dept.code }}</span></td>
            <td>
                <div class="teachers-list" v-if="dept.teachers && dept.teachers.length > 0">
                    <div v-for="teacher in dept.teachers" :key="teacher.id" class="teacher-pill">
                        <Users size="12" /> {{ teacher.fullName }}
                    </div>
                </div>
                <span v-else class="text-gray-400 text-sm">No teachers assigned</span>
            </td>
            <td>
                <span :class="['status-badge', dept.status === 'Active' ? 'active' : 'inactive']">
                    {{ dept.status || 'Active' }}
                </span>
            </td>
            <td class="text-right">
              <button @click="openEdit(dept)" class="btn-icon edit" title="Edit"><Edit2 size="18" /></button>
              <button @click="handleDelete(dept.id)" class="btn-icon delete" title="Delete"><Trash2 size="18" /></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No departments found.</div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Department' : 'Add Department' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group"><label>Name</label><input v-model="form.name" required /></div>
          <div class="form-group"><label>Code</label><input v-model="form.code" required /></div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-text">Cancel</button>
            <button type="submit" :disabled="submitting" class="btn-primary">
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Re-use previous styles */
.page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.page-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0; }
.page-subtitle { color: #64748b; margin-top: 0.25rem; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.badge { background: #e2e8f0; color: #475569; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; }
.btn-primary { background: #2563eb; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.controls-bar { margin-bottom: 1.5rem; }
.search-box { position: relative; max-width: 300px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; }
.table-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
.custom-table { width: 100%; border-collapse: collapse; }
.custom-table th { background: #f8fafc; text-align: left; padding: 1rem; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
.custom-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.dept-name { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
.icon-box { width: 32px; height: 32px; background: #eff6ff; color: #2563eb; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.code-badge { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; color: #475569; border: 1px solid #e2e8f0; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 50; }
.modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 400px; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.4rem; font-size: 0.9rem; font-weight: 500; color: #475569; }
.form-group input, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
.btn-text { background: none; border: none; color: #64748b; cursor: pointer; font-weight: 500; }
.loading-state, .empty-state { padding: 3rem; text-align: center; color: #94a3b8; }
.teachers-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.teacher-pill { background: #f0f9ff; color: #0284c7; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; border: 1px solid #e0f2fe; }
.status-badge { padding: 4px 10px; border-radius: 99px; font-size: 0.8rem; font-weight: 600; }
.status-badge.active { background: #dcfce7; color: #15803d; }
.status-badge.inactive { background: #f1f5f9; color: #64748b; }
.text-gray-400 { color: #9ca3af; }
.text-right { text-align: right; }
.btn-icon.edit { color: #2563eb; background: none; border: none; cursor: pointer; margin-right: 0.5rem; }
.btn-icon.delete { color: #ef4444; background: none; border: none; cursor: pointer; }
</style>