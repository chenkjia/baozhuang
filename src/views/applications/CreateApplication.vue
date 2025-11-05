<template>
  <div class="create-application">
    <div class="page-header">
      <h2>{{ isEdit ? '修改报装申请' : '新建报装申请' }}</h2>
      <el-button @click="goBack">返回</el-button>
    </div>
    
    <el-card shadow="hover">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请人姓名" prop="applicantName">
              <el-input v-model="formData.applicantName" placeholder="请输入申请人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">用水信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用水性质" prop="waterType">
              <el-select v-model="formData.waterType" placeholder="请选择用水性质" style="width: 100%">
                <el-option label="居民用水" value="居民用水" />
                <el-option label="工业用水" value="工业用水" />
                <el-option label="商业用水" value="商业用水" />
                <el-option label="特殊用水" value="特殊用水" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用水类型" prop="usageType">
              <el-select v-model="formData.usageType" placeholder="请选择用水类型" style="width: 100%">
                <el-option label="生活用水" value="生活用水" />
                <el-option label="生产用水" value="生产用水" />
                <el-option label="消防用水" value="消防用水" />
                <el-option label="绿化用水" value="绿化用水" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计用水量" prop="estimatedUsage">
              <el-input v-model="formData.estimatedUsage" placeholder="请输入预计用水量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管径要求" prop="pipeDiameter">
              <el-select v-model="formData.pipeDiameter" placeholder="请选择管径" style="width: 100%">
                <el-option label="DN15" value="DN15" />
                <el-option label="DN20" value="DN20" />
                <el-option label="DN25" value="DN25" />
                <el-option label="DN32" value="DN32" />
                <el-option label="DN40" value="DN40" />
                <el-option label="DN50" value="DN50" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">安装地址</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份" prop="province">
              <el-select v-model="formData.province" placeholder="请选择省份" style="width: 100%">
                <el-option label="上海市" value="上海市" />
                <el-option label="北京市" value="北京市" />
                <el-option label="广东省" value="广东省" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-select v-model="formData.city" placeholder="请选择城市" style="width: 100%">
                <el-option label="上海市" value="上海市" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县" prop="district">
              <el-select v-model="formData.district" placeholder="请选择区县" style="width: 100%">
                <el-option label="浦东新区" value="浦东新区" />
                <el-option label="黄浦区" value="黄浦区" />
                <el-option label="徐汇区" value="徐汇区" />
                <el-option label="长宁区" value="长宁区" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="街道" prop="street">
              <el-input v-model="formData.street" placeholder="请输入街道" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="formData.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">所需材料</el-divider>
        
        <el-form-item label="身份证照片" prop="idCardPhotos">
          <el-upload
            v-model:file-list="formData.idCardPhotos"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="产权证明" prop="propertyProof">
          <el-upload
            v-model:file-list="formData.propertyProof"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-divider content-position="left">缴费信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缴费方式" prop="paymentMethod">
              <el-select v-model="formData.paymentMethod" placeholder="请选择缴费方式" style="width: 100%">
                <el-option label="现金支付" value="现金支付" />
                <el-option label="银行转账" value="银行转账" />
                <el-option label="微信支付" value="微信支付" />
                <el-option label="支付宝" value="支付宝" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票类型" prop="invoiceType">
              <el-select v-model="formData.invoiceType" placeholder="请选择发票类型" style="width: 100%">
                <el-option label="电子发票" value="电子发票" />
                <el-option label="纸质发票" value="纸质发票" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交申请</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useApplicationStore } from '../../stores/application'

const router = useRouter()
const route = useRoute()
const applicationStore = useApplicationStore()

const formRef = ref(null)
const submitting = ref(false)
const isEdit = ref(false)

const formData = reactive({
  applicantName: '',
  phone: '',
  idCard: '',
  email: '',
  waterType: '',
  usageType: '',
  estimatedUsage: '',
  pipeDiameter: '',
  province: '',
  city: '',
  district: '',
  street: '',
  address: '',
  idCardPhotos: [],
  propertyProof: [],
  paymentMethod: '',
  invoiceType: '',
  remark: ''
})

const rules = {
  applicantName: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ],
  waterType: [{ required: true, message: '请选择用水性质', trigger: 'change' }],
  usageType: [{ required: true, message: '请选择用水类型', trigger: 'change' }],
  estimatedUsage: [{ required: true, message: '请输入预计用水量', trigger: 'blur' }],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  district: [{ required: true, message: '请选择区县', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

onMounted(() => {
  if (route.query.id && route.query.mode === 'edit') {
    isEdit.value = true
    const app = applicationStore.getApplicationById(route.query.id)
    if (app) {
      Object.assign(formData, app)
    }
  }
})

const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      
      setTimeout(() => {
        if (isEdit.value) {
          applicationStore.updateApplication(route.query.id, formData)
          ElMessage.success('申请修改成功')
        } else {
          applicationStore.addApplication(formData)
          ElMessage.success('申请提交成功')
        }
        
        submitting.value = false
        router.push('/applications')
      }, 500)
    }
  })
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.create-application {
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

.create-application :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.create-application :deep(.el-card__body) {
  padding: 32px;
}

.create-application :deep(.el-divider__text) {
  background-color: #fff;
  font-weight: 600;
  color: #1890ff;
  font-size: 15px;
}

.create-application :deep(.el-form-item__label) {
  font-weight: 500;
  color: #595959;
}

.create-application :deep(.el-input__wrapper) {
  border-radius: 6px;
}

.create-application :deep(.el-select) {
  border-radius: 6px;
}

.create-application :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  padding: 12px 32px;
  font-size: 15px;
}

.create-application :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.create-application :deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
}

.create-application :deep(.el-upload--picture-card:hover) {
  border-color: #1890ff;
}
</style>
