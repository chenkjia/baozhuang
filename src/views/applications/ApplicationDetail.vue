<template>
  <div class="application-detail">
    <div class="page-header">
      <h2>申请详情</h2>
      <el-button @click="goBack">返回</el-button>
    </div>
    
    <el-card shadow="hover" v-if="application">
      <div class="detail-header">
        <div class="detail-title">
          <h3>申请编号：{{ application.id }}</h3>
          <el-tag :type="getStatusType(application.status)" size="large">{{ application.status }}</el-tag>
        </div>
      </div>
      
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="申请人姓名">{{ application.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ application.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ application.idCard }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{ application.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ application.createDate }}</el-descriptions-item>
      </el-descriptions>
      
      <el-descriptions title="用水信息" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="用水性质">{{ application.waterType }}</el-descriptions-item>
        <el-descriptions-item label="用水类型">{{ application.usageType }}</el-descriptions-item>
        <el-descriptions-item label="预计用水量">{{ application.estimatedUsage }}</el-descriptions-item>
        <el-descriptions-item label="管径要求">{{ application.pipeDiameter || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <el-descriptions title="安装地址" :column="1" border style="margin-top: 20px">
        <el-descriptions-item label="详细地址">
          {{ application.province }}{{ application.city }}{{ application.district }}{{ application.street }}{{ application.address }}
        </el-descriptions-item>
      </el-descriptions>
      
      <el-descriptions title="缴费信息" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="缴费方式">{{ application.paymentMethod || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发票类型">{{ application.invoiceType || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <div style="margin-top: 20px" v-if="application.remark">
        <h4>备注信息</h4>
        <p>{{ application.remark }}</p>
      </div>
      
      <div style="margin-top: 30px">
        <h4>处理进度</h4>
        <el-timeline style="margin-top: 20px">
          <el-timeline-item
            v-for="(item, index) in application.progress"
            :key="index"
            :timestamp="formatTime(item.timestamp)"
            placement="top"
          >
            <p><strong>{{ item.status }}</strong></p>
            <p v-if="item.operator">操作人：{{ item.operator }}</p>
            <p v-if="item.remark">{{ item.remark }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
    
    <el-empty v-else description="申请不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApplicationStore } from '../../stores/application'

const router = useRouter()
const route = useRoute()
const applicationStore = useApplicationStore()

const application = ref(null)

onMounted(() => {
  const id = route.params.id
  application.value = applicationStore.getApplicationById(id)
})

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

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.application-detail {
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

.application-detail :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.application-detail :deep(.el-card__body) {
  padding: 32px;
}

.detail-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title h3 {
  margin: 0;
  font-size: 20px;
  color: #262626;
  font-weight: 600;
}

.application-detail :deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.application-detail :deep(.el-descriptions__label) {
  font-weight: 500;
  color: #595959;
}

.application-detail :deep(.el-timeline-item__timestamp) {
  color: #8c8c8c;
  font-size: 13px;
}

.application-detail :deep(.el-tag) {
  border-radius: 4px;
  padding: 6px 16px;
  border: none;
  font-weight: 500;
  font-size: 14px;
}
</style>
