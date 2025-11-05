<template>
  <div class="construction-list">
    <div class="page-header">
      <h2>施工管理</h2>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待分配" name="pending">
        <el-card shadow="hover">
          <el-table :data="pendingTasks" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column prop="address" label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleAssign(scope.row)">分配</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="已分配" name="assigned">
        <el-card shadow="hover">
          <el-table :data="assignedTasks" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="constructionTeam" label="施工队伍" width="120" />
            <el-table-column prop="scheduledDate" label="预计施工日期" width="130" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag type="info">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" type="primary" text @click="viewDetail(scope.row)">详情</el-button>
                <el-button size="small" type="warning" text @click="handleAdjust(scope.row)">调整</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 分配对话框 -->
    <el-dialog v-model="assignDialogVisible" title="分配施工任务" width="600px">
      <el-form :model="assignForm" label-width="120px">
        <el-form-item label="施工队伍">
          <el-select v-model="assignForm.team" placeholder="请选择施工队伍" style="width: 100%">
            <el-option label="第一施工队" value="第一施工队" />
            <el-option label="第二施工队" value="第二施工队" />
            <el-option label="第三施工队" value="第三施工队" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="预计施工日期">
          <el-date-picker
            v-model="assignForm.scheduledDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="施工要求">
          <el-input
            v-model="assignForm.requirements"
            type="textarea"
            :rows="3"
            placeholder="请输入施工要求和注意事项"
          />
        </el-form-item>
        
        <el-form-item label="通知方式">
          <el-checkbox-group v-model="assignForm.notifyMethods">
            <el-checkbox label="短信通知申请人" />
            <el-checkbox label="电话通知申请人" />
            <el-checkbox label="通知施工队伍" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确认分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useApplicationStore } from '../../stores/application'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const applicationStore = useApplicationStore()
const userStore = useUserStore()

const activeTab = ref('pending')
const assignDialogVisible = ref(false)
const currentTask = ref(null)

const assignForm = ref({
  team: '',
  scheduledDate: '',
  requirements: '',
  notifyMethods: []
})

const pendingTasks = computed(() => {
  return applicationStore.applications.filter(app => app.status === '审核通过')
})

const assignedTasks = computed(() => {
  return applicationStore.applications.filter(app => app.status === '施工中')
})

const handleAssign = (row) => {
  currentTask.value = row
  assignForm.value = {
    team: '',
    scheduledDate: '',
    requirements: '',
    notifyMethods: []
  }
  assignDialogVisible.value = true
}

const submitAssign = () => {
  applicationStore.updateApplication(currentTask.value.id, {
    status: '施工中',
    constructionTeam: assignForm.value.team,
    scheduledDate: assignForm.value.scheduledDate?.toISOString().split('T')[0] || ''
  })
  
  applicationStore.addProgress(currentTask.value.id, {
    status: '施工中',
    operator: userStore.name,
    remark: `分配给${assignForm.value.team}，预计施工日期：${assignForm.value.scheduledDate?.toISOString().split('T')[0] || ''}`
  })
  
  ElMessage.success('施工任务分配成功')
  assignDialogVisible.value = false
}

const handleAdjust = (row) => {
  ElMessage.info('调整功能开发中')
}

const viewDetail = (row) => {
  router.push(`/applications/${row.id}`)
}
</script>

<style scoped>
.construction-list {
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 22px;
  color: #262626;
  margin: 0;
  font-weight: 600;
}

.construction-list :deep(.el-tabs__header) {
  background: #fff;
  padding: 0 24px;
}

.construction-list :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
}

.construction-list :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.construction-list :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 3px;
}

.construction-list :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.construction-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.construction-list :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}
</style>
