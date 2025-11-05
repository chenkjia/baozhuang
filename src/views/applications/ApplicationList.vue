<template>
  <div class="application-list">
    <div class="page-header">
      <h2>报装申请管理</h2>
      <el-button type="primary" :icon="Plus" @click="createApplication">新建申请</el-button>
    </div>
    
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索申请编号或申请人"
          style="width: 300px"
          clearable
          :prefix-icon="Search"
        />
        <el-select v-model="statusFilter" placeholder="申请状态" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="待审核" />
          <el-option label="审核通过" value="审核通过" />
          <el-option label="审核驳回" value="审核驳回" />
          <el-option label="施工中" value="施工中" />
          <el-option label="安装中" value="安装中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
      </div>
      
      <el-table :data="filteredApplications" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="申请编号" width="150" />
        <el-table-column prop="applicantName" label="申请人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="address" label="安装地址" min-width="200">
          <template #default="scope">
            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="申请日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" text @click="viewDetail(scope.row)">查看</el-button>
            <el-button
              size="small"
              type="warning"
              text
              @click="editApplication(scope.row)"
              v-if="scope.row.status === '待审核'"
            >
              修改
            </el-button>
            <el-button
              size="small"
              type="danger"
              text
              @click="cancelApplication(scope.row)"
              v-if="scope.row.status === '待审核'"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import { useApplicationStore } from '../../stores/application'

const router = useRouter()
const applicationStore = useApplicationStore()

const searchText = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const filteredApplications = computed(() => {
  let result = applicationStore.applications
  
  if (searchText.value) {
    result = result.filter(app => 
      app.id.includes(searchText.value) || 
      app.applicantName.includes(searchText.value)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(app => app.status === statusFilter.value)
  }
  
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    result = result.filter(app => {
      const appDate = new Date(app.createDate)
      return appDate >= start && appDate <= end
    })
  }
  
  return result.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

const total = computed(() => applicationStore.applications.length)

const getStatusType = (status) => {
  const typeMap = {
    '待审核': 'warning',
    '审核通过': 'success',
    '审核驳回': 'danger',
    '施工中': 'info',
    '安装中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return typeMap[status] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchText.value = ''
  statusFilter.value = ''
  dateRange.value = []
  currentPage.value = 1
}

const createApplication = () => {
  router.push('/applications/create')
}

const viewDetail = (row) => {
  router.push(`/applications/${row.id}`)
}

const editApplication = (row) => {
  router.push({ name: 'CreateApplication', query: { id: row.id, mode: 'edit' } })
}

const cancelApplication = (row) => {
  ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    applicationStore.updateApplication(row.id, { status: '已取消' })
    applicationStore.addProgress(row.id, {
      status: '已取消',
      operator: '申请人',
      remark: '申请人主动取消'
    })
    ElMessage.success('申请已取消')
  })
}
</script>

<style scoped>
.application-list {
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 22px;
  color: #262626;
  margin: 0;
  font-weight: 600;
}

.page-header .el-button--primary {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  padding: 12px 24px;
  font-size: 15px;
}

.page-header .el-button--primary:hover {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.application-list :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-bar .el-input,
.search-bar .el-select,
.search-bar .el-date-picker {
  min-width: 200px;
}

.search-bar .el-button--primary {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}

.application-list :deep(.el-table) {
  font-size: 14px;
}

.application-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.application-list :deep(.el-table td) {
  padding: 16px 0;
}

.application-list :deep(.el-table .el-button--text) {
  padding: 4px 8px;
  font-size: 14px;
}

.application-list :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
}
</style>
