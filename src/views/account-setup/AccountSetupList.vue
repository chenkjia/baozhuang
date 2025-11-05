<template>
  <div class="account-setup-list">
    <div class="page-header">
      <h2>立户管理</h2>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待立户" name="pending">
        <el-card shadow="hover">
          <el-table :data="pendingSetup" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column prop="installationDate" label="安装日期" width="120" />
            <el-table-column prop="meterNumber" label="水表编号" width="150" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleSetup(scope.row)">立户</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="已立户" name="completed">
        <el-card shadow="hover">
          <el-table :data="completedSetup" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="setupDate" label="立户日期" width="120" />
            <el-table-column prop="accountNumber" label="账户编号" width="150" />
            <el-table-column prop="meterNumber" label="水表编号" width="150" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" text @click="viewDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 立户对话框 -->
    <el-dialog v-model="setupDialogVisible" title="用户立户" width="700px">
      <el-form :model="setupForm" :rules="setupRules" ref="setupFormRef" label-width="120px">
        <el-divider content-position="left">账户信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户编号">
              <el-input v-model="setupForm.accountNumber" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType">
              <el-select v-model="setupForm.userType" placeholder="请选择用户类型" style="width: 100%">
                <el-option label="居民用户" value="居民用户" />
                <el-option label="商业用户" value="商业用户" />
                <el-option label="工业用户" value="工业用户" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户名称" prop="accountName">
              <el-input v-model="setupForm.accountName" placeholder="请输入账户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用代码">
              <el-input v-model="setupForm.creditCode" placeholder="选填，企业用户需填写" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">账单地址</el-divider>
        
        <el-form-item label="账单地址" prop="billingAddress">
          <el-input v-model="setupForm.billingAddress" placeholder="默认使用安装地址，可修改" />
        </el-form-item>
        
        <el-divider content-position="left">缴费信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缴费方式" prop="paymentMethod">
              <el-select v-model="setupForm.paymentMethod" placeholder="请选择缴费方式" style="width: 100%">
                <el-option label="自动扣款" value="自动扣款" />
                <el-option label="手动缴费" value="手动缴费" />
                <el-option label="定期转账" value="定期转账" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="setupForm.paymentMethod === '自动扣款' || setupForm.paymentMethod === '定期转账'">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input v-model="setupForm.bankAccount" placeholder="请输入银行账号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="setupForm.paymentMethod === '自动扣款' || setupForm.paymentMethod === '定期转账'">
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="setupForm.bankName" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注信息">
          <el-input
            v-model="setupForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="setupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSetup">确认立户</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useApplicationStore } from '../../stores/application'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const applicationStore = useApplicationStore()
const userStore = useUserStore()

const activeTab = ref('pending')
const setupDialogVisible = ref(false)
const currentApplication = ref(null)
const setupFormRef = ref(null)

const setupForm = reactive({
  accountNumber: '',
  userType: '',
  accountName: '',
  creditCode: '',
  billingAddress: '',
  paymentMethod: '',
  bankAccount: '',
  bankName: '',
  remark: ''
})

const setupRules = {
  userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  accountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
  billingAddress: [{ required: true, message: '请输入账单地址', trigger: 'blur' }],
  paymentMethod: [{ required: true, message: '请选择缴费方式', trigger: 'change' }]
}

const pendingSetup = computed(() => {
  return applicationStore.applications.filter(app => app.status === '已完成' && !app.accountNumber)
})

const completedSetup = computed(() => {
  return applicationStore.applications.filter(app => app.accountNumber)
})

const handleSetup = (row) => {
  currentApplication.value = row
  
  // 生成账户编号
  const accountNumber = 'ACC' + Date.now().toString().slice(-8)
  
  Object.assign(setupForm, {
    accountNumber: accountNumber,
    userType: '',
    accountName: row.applicantName,
    creditCode: '',
    billingAddress: `${row.province}${row.city}${row.district}${row.address}`,
    paymentMethod: '',
    bankAccount: '',
    bankName: '',
    remark: ''
  })
  
  setupDialogVisible.value = true
}

const submitSetup = async () => {
  await setupFormRef.value.validate((valid) => {
    if (valid) {
      applicationStore.updateApplication(currentApplication.value.id, {
        accountNumber: setupForm.accountNumber,
        setupDate: new Date().toISOString().split('T')[0],
        ...setupForm
      })
      
      applicationStore.addProgress(currentApplication.value.id, {
        status: '已立户',
        operator: userStore.name,
        remark: `账户编号：${setupForm.accountNumber}`
      })
      
      ElMessage.success('立户成功')
      setupDialogVisible.value = false
    }
  })
}

const viewDetail = (row) => {
  router.push(`/applications/${row.id}`)
}
</script>

<style scoped>
.account-setup-list {
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

.account-setup-list :deep(.el-tabs__header) {
  background: #fff;
  padding: 0 24px;
}

.account-setup-list :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
}

.account-setup-list :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.account-setup-list :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 3px;
}

.account-setup-list :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.account-setup-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.account-setup-list :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}

.account-setup-list :deep(.el-dialog__header) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.account-setup-list :deep(.el-divider__text) {
  background-color: #fff;
  font-weight: 600;
  color: #1890ff;
}
</style>
