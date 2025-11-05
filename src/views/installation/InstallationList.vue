<template>
  <div class="installation-list">
    <div class="page-header">
      <h2>安装管理</h2>
    </div>
    
    <el-card shadow="hover" class="main-card">
      <!-- 状态筛选标签 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待安装" name="pending">
          <div class="filter-bar">
            <el-input
              v-model="searchText"
              placeholder="搜索申请编号或申请人"
              style="width: 250px"
              clearable
              :prefix-icon="Search"
            />
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
            <el-button type="primary" :icon="Search" @click="handleSearch">筛选</el-button>
            <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
          </div>
          
          <el-table :data="pendingInstallations" style="width: 100%; margin-top: 20px" stripe>
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column prop="constructionFinishDate" label="施工完成日期" width="130">
              <template #default="scope">
                {{ scope.row.scheduledDate || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="installer" label="安装人员" width="100">
              <template #default="scope">
                {{ userStore.name }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag type="warning">待安装</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button size="small" type="primary" @click="startInstallation(scope.row)">
                  开始安装
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="安装中" name="installing">
          <div class="filter-bar">
            <el-input
              v-model="searchText"
              placeholder="搜索申请编号或申请人"
              style="width: 250px"
              clearable
              :prefix-icon="Search"
            />
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
            <el-button type="primary" :icon="Search" @click="handleSearch">筛选</el-button>
            <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
          </div>
          
          <el-table :data="installingTasks" style="width: 100%; margin-top: 20px" stripe>
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column prop="installStartDate" label="开始安装日期" width="130" />
            <el-table-column prop="installer" label="安装人员" width="100">
              <template #default="scope">
                {{ userStore.name }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag type="primary">安装中</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button size="small" type="success" @click="confirmInstallation(scope.row)">
                  确认安装
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="已完成" name="completed">
          <div class="filter-bar">
            <el-input
              v-model="searchText"
              placeholder="搜索申请编号或申请人"
              style="width: 250px"
              clearable
              :prefix-icon="Search"
            />
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
            <el-button type="primary" :icon="Search" @click="handleSearch">筛选</el-button>
            <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
          </div>
          
          <el-table :data="completedInstallations" style="width: 100%; margin-top: 20px" stripe>
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column label="安装地址" min-width="200">
              <template #default="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column prop="installationDate" label="安装日期" width="130" />
            <el-table-column prop="installer" label="安装人员" width="100">
              <template #default="scope">
                {{ userStore.name }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag type="success">已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button size="small" type="primary" text @click="viewInstallationDetail(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="currentTabTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
    
    <!-- 安装信息记录对话框 -->
    <el-dialog
      v-model="installDialogVisible"
      title="安装信息记录"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="installForm" :rules="installRules" ref="installFormRef" label-width="120px">
        <el-divider content-position="left">申请人信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请编号">
              <el-input v-model="currentInstallation.id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人姓名">
              <el-input v-model="currentInstallation.applicantName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="currentInstallation.phone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装地址">
              <el-input :value="getFullAddress(currentInstallation)" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">安装信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="安装日期" prop="installationDate">
              <el-date-picker
                v-model="installForm.installationDate"
                type="date"
                placeholder="选择安装日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水表型号" prop="meterModel">
              <el-select v-model="installForm.meterModel" placeholder="请选择水表型号" style="width: 100%">
                <el-option label="DN15 普通水表" value="DN15-A" />
                <el-option label="DN20 普通水表" value="DN20-A" />
                <el-option label="DN25 普通水表" value="DN25-A" />
                <el-option label="DN15 智能水表" value="DN15-S" />
                <el-option label="DN20 智能水表" value="DN20-S" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="水表编号" prop="meterNumber">
              <el-input v-model="installForm.meterNumber" placeholder="请输入水表编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始读数" prop="initialReading">
              <el-input-number
                v-model="installForm.initialReading"
                :min="0"
                :precision="2"
                placeholder="请输入初始读数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">安装详情</el-divider>
        
        <el-form-item label="安装位置" prop="installLocation">
          <el-input v-model="installForm.installLocation" placeholder="请输入具体安装位置" />
        </el-form-item>
        
        <el-form-item label="安装说明" prop="installDescription">
          <el-input
            v-model="installForm.installDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入安装说明、注意事项等"
          />
        </el-form-item>
        
        <el-divider content-position="left">现场照片</el-divider>
        
        <el-form-item label="水表照片" prop="meterPhotos">
          <el-upload
            v-model:file-list="installForm.meterPhotos"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="水龙头照片">
          <el-upload
            v-model:file-list="installForm.faucetPhotos"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="管道连接照片">
          <el-upload
            v-model:file-list="installForm.pipePhotos"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-divider content-position="left">用户签名</el-divider>
        
        <el-form-item label="用户签名" prop="signature">
          <div class="signature-box">
            <canvas
              ref="signatureCanvas"
              width="600"
              height="200"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
            ></canvas>
            <el-button size="small" @click="clearSignature" style="margin-top: 10px">清除签名</el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="installDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitInstallation">确认安装</el-button>
      </template>
    </el-dialog>
    
    <!-- 安装详情查看对话框 -->
    <el-dialog v-model="detailDialogVisible" title="安装详情" width="800px">
      <div v-if="viewingInstallation">
        <el-descriptions title="申请人信息" :column="2" border>
          <el-descriptions-item label="申请编号">{{ viewingInstallation.id }}</el-descriptions-item>
          <el-descriptions-item label="申请人姓名">{{ viewingInstallation.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ viewingInstallation.phone }}</el-descriptions-item>
          <el-descriptions-item label="安装地址">{{ getFullAddress(viewingInstallation) }}</el-descriptions-item>
        </el-descriptions>
        
        <el-descriptions title="安装信息" :column="2" border style="margin-top: 20px">
          <el-descriptions-item label="安装日期">{{ viewingInstallation.installationDate }}</el-descriptions-item>
          <el-descriptions-item label="水表型号">{{ viewingInstallation.meterModel }}</el-descriptions-item>
          <el-descriptions-item label="水表编号">{{ viewingInstallation.meterNumber }}</el-descriptions-item>
          <el-descriptions-item label="初始读数">{{ viewingInstallation.initialReading }}</el-descriptions-item>
          <el-descriptions-item label="安装位置" :span="2">{{ viewingInstallation.installLocation }}</el-descriptions-item>
        </el-descriptions>
        
        <div style="margin-top: 20px" v-if="viewingInstallation.installDescription">
          <h4>安装说明</h4>
          <p>{{ viewingInstallation.installDescription }}</p>
        </div>
        
        <div style="margin-top: 20px" v-if="viewingInstallation.signature">
          <h4>用户签名</h4>
          <img :src="viewingInstallation.signature" alt="用户签名" style="border: 1px solid #ddd; padding: 10px" />
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import { useApplicationStore } from '../../stores/application'
import { useUserStore } from '../../stores/user'

const applicationStore = useApplicationStore()
const userStore = useUserStore()

const activeTab = ref('pending')
const searchText = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const installDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentInstallation = ref({})
const viewingInstallation = ref(null)

const installFormRef = ref(null)
const signatureCanvas = ref(null)
let isDrawing = false
let ctx = null

const installForm = reactive({
  installationDate: new Date(),
  meterModel: '',
  meterNumber: '',
  initialReading: 0,
  installLocation: '',
  installDescription: '',
  meterPhotos: [],
  faucetPhotos: [],
  pipePhotos: [],
  signature: ''
})

const installRules = {
  installationDate: [{ required: true, message: '请选择安装日期', trigger: 'change' }],
  meterModel: [{ required: true, message: '请选择水表型号', trigger: 'change' }],
  meterNumber: [{ required: true, message: '请输入水表编号', trigger: 'blur' }],
  installLocation: [{ required: true, message: '请输入安装位置', trigger: 'blur' }]
}

const pendingInstallations = computed(() => {
  return applicationStore.applications.filter(app => app.status === '施工中')
})

const installingTasks = computed(() => {
  return applicationStore.applications.filter(app => app.status === '安装中')
})

const completedInstallations = computed(() => {
  return applicationStore.applications.filter(app => app.status === '已完成')
})

const currentTabTotal = computed(() => {
  if (activeTab.value === 'pending') return pendingInstallations.value.length
  if (activeTab.value === 'installing') return installingTasks.value.length
  return completedInstallations.value.length
})

const handleTabChange = () => {
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchText.value = ''
  dateRange.value = []
  currentPage.value = 1
}

const getFullAddress = (row) => {
  return `${row.province}${row.city}${row.district}${row.street || ''}${row.address}`
}

const startInstallation = (row) => {
  applicationStore.updateApplication(row.id, {
    status: '安装中',
    installStartDate: new Date().toISOString().split('T')[0]
  })
  
  applicationStore.addProgress(row.id, {
    status: '安装中',
    operator: userStore.name,
    remark: '开始安装'
  })
  
  ElMessage.success('已开始安装任务')
}

const confirmInstallation = (row) => {
  currentInstallation.value = row
  
  // 重置表单
  Object.assign(installForm, {
    installationDate: new Date(),
    meterModel: '',
    meterNumber: '',
    initialReading: 0,
    installLocation: '',
    installDescription: '',
    meterPhotos: [],
    faucetPhotos: [],
    pipePhotos: [],
    signature: ''
  })
  
  installDialogVisible.value = true
  
  // 初始化签名画布
  setTimeout(() => {
    if (signatureCanvas.value) {
      ctx = signatureCanvas.value.getContext('2d')
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
    }
  }, 100)
}

const startDrawing = (e) => {
  isDrawing = true
  const rect = signatureCanvas.value.getBoundingClientRect()
  ctx.beginPath()
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
}

const draw = (e) => {
  if (!isDrawing) return
  const rect = signatureCanvas.value.getBoundingClientRect()
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
  ctx.stroke()
}

const stopDrawing = () => {
  isDrawing = false
}

const clearSignature = () => {
  if (ctx && signatureCanvas.value) {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
  }
}

const submitInstallation = async () => {
  await installFormRef.value.validate((valid) => {
    if (valid) {
      // 保存签名
      if (signatureCanvas.value) {
        installForm.signature = signatureCanvas.value.toDataURL()
      }
      
      // 更新申请状态
      applicationStore.updateApplication(currentInstallation.value.id, {
        status: '已完成',
        installationDate: installForm.installationDate.toISOString().split('T')[0],
        meterModel: installForm.meterModel,
        meterNumber: installForm.meterNumber,
        initialReading: installForm.initialReading,
        installLocation: installForm.installLocation,
        installDescription: installForm.installDescription,
        signature: installForm.signature
      })
      
      applicationStore.addProgress(currentInstallation.value.id, {
        status: '已完成',
        operator: userStore.name,
        remark: `水表编号：${installForm.meterNumber}，安装完成`
      })
      
      ElMessage.success('安装信息已记录')
      installDialogVisible.value = false
    }
  })
}

const viewInstallationDetail = (row) => {
  viewingInstallation.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
.installation-list {
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

.main-card {
  min-height: calc(100vh - 180px);
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.main-card :deep(.el-tabs__header) {
  background: #fafafa;
  padding: 0 20px;
  margin: 0;
}

.main-card :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
}

.main-card :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.main-card :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 3px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.filter-bar .el-input,
.filter-bar .el-date-picker {
  min-width: 200px;
}

.filter-bar .el-button--primary {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}

.installation-list :deep(.el-table) {
  font-size: 14px;
}

.installation-list :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.installation-list :deep(.el-table td) {
  padding: 16px 0;
}

.installation-list :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafafa;
}

.installation-list :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}

.installation-list :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}

.installation-list :deep(.el-button--success) {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border: none;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.installation-list :deep(.el-dialog) {
  border-radius: 8px;
}

.installation-list :deep(.el-dialog__header) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

.installation-list :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.installation-list :deep(.el-divider__text) {
  background-color: #fff;
  font-weight: 600;
  color: #1890ff;
}

.signature-box {
  border: 2px dashed #d9d9d9;
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
}

.signature-box canvas {
  border: 2px solid #e8e8e8;
  background: white;
  cursor: crosshair;
  display: block;
  border-radius: 4px;
}

.installation-list :deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
  transition: all 0.3s;
}

.installation-list :deep(.el-upload--picture-card:hover) {
  border-color: #1890ff;
}
</style>
