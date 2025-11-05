<template>
  <div class="role-management">
    <div class="page-header">
      <h2>角色权限管理</h2>
      <el-button type="primary" :icon="Plus">添加角色</el-button>
    </div>
    
    <el-card shadow="hover">
      <el-table :data="roles" style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="200" />
        <el-table-column prop="description" label="描述" min-width="300" />
        <el-table-column prop="userCount" label="用户数量" width="120" />
        <el-table-column prop="createDate" label="创建日期" width="150" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button size="small" type="primary" text>编辑</el-button>
            <el-button size="small" type="warning" text>权限设置</el-button>
            <el-button size="small" type="danger" text>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const roles = ref([
  {
    name: '系统管理员',
    description: '拥有系统所有权限',
    userCount: 1,
    createDate: '2023-01-01'
  },
  {
    name: '客服专员',
    description: '负责申请审核和用户立户',
    userCount: 5,
    createDate: '2023-01-01'
  },
  {
    name: '市场部专员',
    description: '负责施工分配和管理',
    userCount: 3,
    createDate: '2023-01-01'
  },
  {
    name: '安装人员',
    description: '负责水表安装',
    userCount: 10,
    createDate: '2023-01-01'
  }
])
</script>

<style scoped>
.role-management {
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

.role-management :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.role-management :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}
</style>
