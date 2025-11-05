<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" :icon="Plus" @click="addUser">添加用户</el-button>
    </div>
    
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索用户名或姓名"
          style="width: 250px"
          clearable
          :prefix-icon="Search"
        />
        <el-select v-model="roleFilter" placeholder="角色" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="客服专员" value="customer_service" />
          <el-option label="市场部专员" value="market" />
          <el-option label="安装人员" value="installer" />
          <el-option label="系统管理员" value="admin" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>
      
      <el-table :data="users" style="width: 100%; margin-top: 20px">
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="部门" width="150" />
        <el-table-column prop="roleName" label="角色" width="150" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="email" label="电子邮箱" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" text>编辑</el-button>
            <el-button size="small" type="warning" text>重置密码</el-button>
            <el-button
              size="small"
              :type="scope.row.status === '启用' ? 'danger' : 'success'"
              text
            >
              {{ scope.row.status === '启用' ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'

const searchText = ref('')
const roleFilter = ref('')

const users = ref([
  {
    username: 'admin',
    name: '系统管理员',
    department: '技术部',
    roleName: '系统管理员',
    phone: '13800138001',
    email: 'admin@example.com',
    status: '启用'
  },
  {
    username: 'kefu001',
    name: '张三',
    department: '客服部',
    roleName: '客服专员',
    phone: '13800138002',
    email: 'zhangsan@example.com',
    status: '启用'
  },
  {
    username: 'market001',
    name: '李四',
    department: '市场部',
    roleName: '市场部专员',
    phone: '13800138003',
    email: 'lisi@example.com',
    status: '启用'
  },
  {
    username: 'installer001',
    name: '王五',
    department: '安装队',
    roleName: '安装人员',
    phone: '13800138004',
    email: 'wangwu@example.com',
    status: '启用'
  }
])

const addUser = () => {
  ElMessage.info('添加用户功能开发中')
}
</script>

<style scoped>
.user-management {
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
}

.user-management :deep(.el-card) {
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

.user-management :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.user-management :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}
</style>
