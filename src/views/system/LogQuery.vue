<template>
  <div class="log-query">
    <div class="page-header">
      <h2>日志查询</h2>
    </div>
    
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="searchText"
          placeholder="搜索操作内容"
          style="width: 250px"
          clearable
          :prefix-icon="Search"
        />
        <el-select v-model="logTypeFilter" placeholder="日志类型" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="登录日志" value="login" />
          <el-option label="操作日志" value="operation" />
          <el-option label="系统日志" value="system" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>
      
      <el-table :data="logs" style="width: 100%; margin-top: 20px">
        <el-table-column prop="time" label="操作时间" width="180" />
        <el-table-column prop="user" label="操作用户" width="120" />
        <el-table-column prop="type" label="操作类型" width="120">
          <template #default="scope">
            <el-tag :type="getLogType(scope.row.type)">{{ scope.row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" min-width="300" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.result === '成功' ? 'success' : 'danger'">
              {{ scope.row.result }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="100"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'

const searchText = ref('')
const logTypeFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const logs = ref([
  {
    time: '2023-11-05 10:30:25',
    user: '系统管理员',
    type: 'login',
    typeName: '登录日志',
    content: '用户登录系统',
    ip: '192.168.1.100',
    result: '成功'
  },
  {
    time: '2023-11-05 10:25:15',
    user: '张三',
    type: 'operation',
    typeName: '操作日志',
    content: '审核报装申请 20231101001',
    ip: '192.168.1.101',
    result: '成功'
  },
  {
    time: '2023-11-05 10:20:10',
    user: '李四',
    type: 'operation',
    typeName: '操作日志',
    content: '分配施工任务 20231101002',
    ip: '192.168.1.102',
    result: '成功'
  },
  {
    time: '2023-11-05 10:15:05',
    user: '王五',
    type: 'operation',
    typeName: '操作日志',
    content: '记录安装信息 20231101003',
    ip: '192.168.1.103',
    result: '成功'
  },
  {
    time: '2023-11-05 10:10:00',
    user: '系统',
    type: 'system',
    typeName: '系统日志',
    content: '系统自动备份数据',
    ip: '127.0.0.1',
    result: '成功'
  }
])

const getLogType = (type) => {
  const typeMap = {
    login: 'success',
    operation: 'primary',
    system: 'info'
  }
  return typeMap[type] || 'info'
}
</script>

<style scoped>
.log-query {
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

.log-query :deep(.el-card) {
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

.log-query :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.log-query :deep(.el-tag) {
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
  border-top: 1px solid #f0f0f0;
}
</style>
