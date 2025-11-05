<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" fill="#3b7fc4" />
            <circle cx="60" cy="60" r="35" fill="#ffffff" />
            <path d="M 60 25 Q 35 45, 60 60 Q 85 45, 60 25" fill="#3b7fc4" />
          </svg>
        </div>
        <h1 class="system-title">安信报装系统</h1>
      </div>
      
      <!-- 表单区域 -->
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            clearable
          >
            <template #suffix>
              <el-icon color="#bfbfbf"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            show-password
            clearable
          >
            <template #suffix>
              <el-icon color="#bfbfbf"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="role">
          <el-select
            v-model="loginForm.role"
            placeholder="选择角色"
            size="large"
            style="width: 100%"
          >
            <el-option label="客服专员" value="customer_service" />
            <el-option label="市场部专员" value="market" />
            <el-option label="安装人员" value="installer" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        
        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <el-link type="primary" :underline="false" @click="handleForgotPassword">忘记密码?</el-link>
        </div>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择登录角色', trigger: 'change' }
  ]
}

const handleLogin = async () => {
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      setTimeout(() => {
        const roleNames = {
          customer_service: '客服专员',
          market: '市场部专员',
          installer: '安装人员',
          admin: '系统管理员'
        }
        
        userStore.login({
          username: loginForm.username,
          role: loginForm.role,
          name: roleNames[loginForm.role]
        })
        
        ElMessage.success('登录成功')
        loading.value = false
        router.push('/')
      }, 800)
    }
  })
}

const handleForgotPassword = () => {
  ElMessage.info('请联系系统管理员重置密码')
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e8e8e8;
  overflow: hidden;
}

.login-box {
  width: 420px;
  padding: 50px 40px 40px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo-icon {
  margin-bottom: 20px;
}

.logo-icon svg {
  display: block;
}

.system-title {
  font-size: 22px;
  color: #3b7fc4;
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
}

/* 表单区域 */
.login-form {
  margin-top: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input__wrapper) {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: none;
  padding: 5px 15px;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #3b7fc4;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3b7fc4;
  background: #ffffff;
  box-shadow: none;
}

.login-form :deep(.el-input__inner) {
  color: #333;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
}

.login-form :deep(.el-select .el-input__wrapper) {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.login-form :deep(.el-select .el-input__wrapper:hover) {
  border-color: #3b7fc4;
}

/* 登录选项 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-options :deep(.el-checkbox__label) {
  color: #666;
}

.login-options :deep(.el-link) {
  font-size: 14px;
  color: #3b7fc4;
}

/* 登录按钮 */
.login-form :deep(.el-button--primary) {
  background: #3b7fc4;
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: normal;
  border-radius: 4px;
  letter-spacing: 2px;
}

.login-form :deep(.el-button--primary:hover) {
  background: #5396d8;
}

.login-form :deep(.el-button--primary:active) {
  background: #2d6ba3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    margin: 20px;
    padding: 40px 30px 30px;
  }
  
  .system-title {
    font-size: 20px;
  }
}
</style>
