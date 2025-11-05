<template>
  <div class="review-list">
    <div class="page-header">
      <h2>申请审核</h2>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待审核" name="pending">
        <el-card shadow="hover">
          <el-table :data="pendingApplications" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column prop="address" label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="申请日期" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleReview(scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="审核历史" name="history">
        <el-card shadow="hover">
          <el-table :data="reviewedApplications" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column prop="reviewDate" label="审核日期" width="120" />
            <el-table-column prop="status" label="审核结果" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === '审核通过' ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewer" label="审核人" width="100" />
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="primary" text @click="viewDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialogVisible" title="审核申请" width="600px">
      <div v-if="currentApplication">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="申请编号">{{ currentApplication.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentApplication.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentApplication.phone }}</el-descriptions-item>
          <el-descriptions-item label="用水性质">{{ currentApplication.waterType }}</el-descriptions-item>
          <el-descriptions-item label="安装地址">
            {{ currentApplication.province }}{{ currentApplication.city }}{{ currentApplication.district }}{{ currentApplication.address }}
          </el-descriptions-item>
        </el-descriptions>
        
        <el-form :model="reviewForm" style="margin-top: 20px">
          <el-form-item label="审核结果">
            <el-radio-group v-model="reviewForm.result">
              <el-radio label="通过">审核通过</el-radio>
              <el-radio label="驳回">审核驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="审核意见" v-if="reviewForm.result === '驳回'">
            <el-input
              v-model="reviewForm.opinion"
              type="textarea"
              :rows="4"
              placeholder="请输入驳回原因"
            />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input
              v-model="reviewForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交审核</el-button>
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
const reviewDialogVisible = ref(false)
const currentApplication = ref(null)

const reviewForm = ref({
  result: '通过',
  opinion: '',
  remark: ''
})

const pendingApplications = computed(() => {
  return applicationStore.applications.filter(app => app.status === '待审核')
})

const reviewedApplications = computed(() => {
  return applicationStore.applications.filter(app => 
    app.status === '审核通过' || app.status === '审核驳回'
  ).map(app => ({
    ...app,
    reviewDate: app.progress?.find(p => p.status === '审核通过' || p.status === '审核驳回')?.timestamp?.split('T')[0] || '-',
    reviewer: app.progress?.find(p => p.status === '审核通过' || p.status === '审核驳回')?.operator || '-'
  }))
})

const handleReview = (row) => {
  currentApplication.value = row
  reviewForm.value = {
    result: '通过',
    opinion: '',
    remark: ''
  }
  reviewDialogVisible.value = true
}

const submitReview = () => {
  const newStatus = reviewForm.value.result === '通过' ? '审核通过' : '审核驳回'
  
  applicationStore.updateApplication(currentApplication.value.id, {
    status: newStatus
  })
  
  applicationStore.addProgress(currentApplication.value.id, {
    status: newStatus,
    operator: userStore.name,
    remark: reviewForm.value.result === '驳回' ? reviewForm.value.opinion : reviewForm.value.remark
  })
  
  ElMessage.success('审核完成')
  reviewDialogVisible.value = false
}

const viewDetail = (row) => {
  router.push(`/applications/${row.id}`)
}
</script>

<style scoped>
.review-list {
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

.review-list :deep(.el-tabs__header) {
  background: #fff;
  padding: 0 24px;
  margin: 0;
}

.review-list :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
}

.review-list :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.review-list :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 3px;
}

.review-list :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.review-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.review-list :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}

.review-list :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}

.review-list :deep(.el-dialog__header) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}
</style>
