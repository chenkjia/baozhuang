<template>
  <div class="account-list">
    <div class="page-header">
      <h2>账户管理</h2>
    </div>
    
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索账户编号或账户名称"
          style="width: 300px"
          clearable
          :prefix-icon="Search"
        />
        <el-select v-model="userTypeFilter" placeholder="用户类型" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="居民用户" value="居民用户" />
          <el-option label="商业用户" value="商业用户" />
          <el-option label="工业用户" value="工业用户" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>
      
      <el-table :data="filteredAccounts" style="width: 100%; margin-top: 20px">
        <el-table-column prop="accountNumber" label="账户编号" width="150" />
        <el-table-column prop="accountName" label="账户名称" width="120" />
        <el-table-column prop="userType" label="用户类型" width="120" />
        <el-table-column prop="applicantName" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="setupDate" label="创建日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default>
            <el-tag type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" text @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { useApplicationStore } from '../../stores/application'

const router = useRouter()
const applicationStore = useApplicationStore()

const searchText = ref('')
const userTypeFilter = ref('')

const filteredAccounts = computed(() => {
  return applicationStore.applications.filter(app => app.accountNumber)
})

const viewDetail = (row) => {
  router.push(`/accounts/${row.id}`)
}
</script>

<style scoped>
.account-list {
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

.account-list :deep(.el-card) {
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

.account-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.account-list :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}
</style>
