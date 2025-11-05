<template>
  <div class="system-settings">
    <div class="page-header">
      <h2>系统设置</h2>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本设置" name="basic">
        <el-card shadow="hover">
          <el-form :model="basicSettings" label-width="150px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" style="width: 400px" />
            </el-form-item>
            
            <el-form-item label="系统Logo">
              <el-upload list-type="picture-card" :auto-upload="false">
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            
            <el-form-item label="系统描述">
              <el-input
                v-model="basicSettings.description"
                type="textarea"
                :rows="4"
                style="width: 400px"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="通知设置" name="notification">
        <el-card shadow="hover">
          <el-form :model="notificationSettings" label-width="150px">
            <el-form-item label="短信通知">
              <el-switch v-model="notificationSettings.sms" />
            </el-form-item>
            
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.email" />
            </el-form-item>
            
            <el-form-item label="系统消息通知">
              <el-switch v-model="notificationSettings.system" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="安全设置" name="security">
        <el-card shadow="hover">
          <el-form :model="securitySettings" label-width="150px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.minPasswordLength" :min="6" :max="20" />
            </el-form-item>
            
            <el-form-item label="登录失败次数限制">
              <el-input-number v-model="securitySettings.maxLoginAttempts" :min="3" :max="10" />
            </el-form-item>
            
            <el-form-item label="会话超时时间(分钟)">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="30" :max="480" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeTab = ref('basic')

const basicSettings = reactive({
  systemName: '安信报装系统',
  description: '自来水公司报装管理系统'
})

const notificationSettings = reactive({
  sms: true,
  email: true,
  system: true
})

const securitySettings = reactive({
  minPasswordLength: 6,
  maxLoginAttempts: 5,
  sessionTimeout: 120
})

const saveSettings = () => {
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.system-settings {
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

.system-settings :deep(.el-tabs__header) {
  background: #fff;
  padding: 0 24px;
}

.system-settings :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 500;
}

.system-settings :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.system-settings :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 3px;
}

.system-settings :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.system-settings :deep(.el-button--primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
}
</style>
