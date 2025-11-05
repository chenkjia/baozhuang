<template>
  <div class="account-detail">
    <div class="page-header">
      <h2>账户详情</h2>
      <el-button @click="goBack">返回</el-button>
    </div>
    
    <el-card shadow="hover" v-if="account">
      <el-descriptions title="账户基本信息" :column="2" border>
        <el-descriptions-item label="账户编号">{{ account.accountNumber }}</el-descriptions-item>
        <el-descriptions-item label="账户名称">{{ account.accountName }}</el-descriptions-item>
        <el-descriptions-item label="用户类型">{{ account.userType }}</el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ account.setupDate }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ account.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ account.phone }}</el-descriptions-item>
        <el-descriptions-item label="账单地址" :span="2">{{ account.billingAddress }}</el-descriptions-item>
        <el-descriptions-item label="缴费方式">{{ account.paymentMethod }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag type="success">正常</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      
      <el-divider />
      
      <div class="section-header">
        <h3>水表信息</h3>
      </div>
      
      <el-table :data="[account]" style="width: 100%">
        <el-table-column prop="meterNumber" label="水表编号" width="150" />
        <el-table-column prop="meterModel" label="水表型号" width="150" />
        <el-table-column prop="installLocation" label="安装位置" min-width="200" />
        <el-table-column prop="installationDate" label="安装日期" width="120" />
        <el-table-column prop="initialReading" label="当前读数" width="120">
          <template #default="scope">
            {{ scope.row.initialReading || 0 }} m³
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default>
            <el-tag type="success">正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <el-divider />
      
      <div class="section-header">
        <h3>账单记录</h3>
      </div>
      
      <el-table :data="mockBills" style="width: 100%">
        <el-table-column prop="billNumber" label="账单编号" width="150" />
        <el-table-column prop="period" label="账单周期" width="200" />
        <el-table-column prop="usage" label="用水量(m³)" width="120" />
        <el-table-column prop="waterFee" label="水费(元)" width="120" />
        <el-table-column prop="sewageFee" label="污水处理费(元)" width="150" />
        <el-table-column prop="totalAmount" label="总金额(元)" width="120" />
        <el-table-column prop="status" label="缴费状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已缴费' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentDate" label="缴费日期" width="120" />
      </el-table>
    </el-card>
    
    <el-empty v-else description="账户不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApplicationStore } from '../../stores/application'

const router = useRouter()
const route = useRoute()
const applicationStore = useApplicationStore()

const account = ref(null)
const mockBills = ref([
  {
    billNumber: 'BILL20231101001',
    period: '2023-10-01 至 2023-10-31',
    usage: 5.5,
    waterFee: 22.0,
    sewageFee: 5.5,
    totalAmount: 27.5,
    status: '已缴费',
    paymentDate: '2023-11-05'
  },
  {
    billNumber: 'BILL20231001001',
    period: '2023-09-01 至 2023-09-30',
    usage: 6.0,
    waterFee: 24.0,
    sewageFee: 6.0,
    totalAmount: 30.0,
    status: '已缴费',
    paymentDate: '2023-10-05'
  }
])

onMounted(() => {
  const id = route.params.id
  account.value = applicationStore.getApplicationById(id)
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.account-detail {
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

.account-detail :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.account-detail :deep(.el-card__body) {
  padding: 32px;
}

.account-detail :deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.account-detail :deep(.el-divider) {
  margin: 32px 0;
}

.section-header {
  margin: 32px 0 16px 0;
}

.section-header h3 {
  font-size: 16px;
  color: #262626;
  margin: 0;
  font-weight: 600;
}

.account-detail :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.account-detail :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}
</style>
