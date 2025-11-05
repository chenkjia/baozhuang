<template>
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <h2>安信报装系统</h2>
      </div>
      
      <div class="header-right">
        <el-badge :value="5" class="notification-badge">
          <el-icon class="header-icon" :size="20"><Bell /></el-icon>
        </el-badge>
        
        <el-dropdown @command="handleCommand" class="user-dropdown">
          <div class="user-info">
            <el-icon class="header-icon" :size="20"><User /></el-icon>
            <span class="user-role">{{ userStore.name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="isCollapse ? '64px' : '180px'" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :router="true"
          background-color="#ffffff"
          text-color="#666666"
          active-text-color="#4a7bb8"
        >
          <el-menu-item index="/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <template #title>工作台</template>
          </el-menu-item>
          
          <el-menu-item index="/applications" v-if="hasPermission(['customer_service', 'admin'])">
            <el-icon><Document /></el-icon>
            <template #title>报装申请管理</template>
          </el-menu-item>
          
          <el-menu-item index="/review" v-if="hasPermission(['customer_service', 'admin'])">
            <el-icon><Check /></el-icon>
            <template #title>申请审核</template>
          </el-menu-item>
          
          <el-menu-item index="/construction" v-if="hasPermission(['market', 'admin'])">
            <el-icon><Tools /></el-icon>
            <template #title>施工管理</template>
          </el-menu-item>
          
          <el-menu-item index="/installation" v-if="hasPermission(['installer', 'admin'])">
            <el-icon><SetUp /></el-icon>
            <template #title>安装管理</template>
          </el-menu-item>
          
          <el-menu-item index="/account-setup" v-if="hasPermission(['customer_service', 'admin'])">
            <el-icon><User /></el-icon>
            <template #title>立户管理</template>
          </el-menu-item>
          
          <el-menu-item index="/accounts" v-if="hasPermission(['customer_service', 'admin'])">
            <el-icon><Wallet /></el-icon>
            <template #title>账户管理</template>
          </el-menu-item>
          
          <el-sub-menu index="system" v-if="hasPermission(['admin'])">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/users">用户管理</el-menu-item>
            <el-menu-item index="/system/roles">角色权限</el-menu-item>
            <el-menu-item index="/system/settings">系统设置</el-menu-item>
            <el-menu-item index="/system/logs">日志查询</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Bell } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const hasPermission = (roles) => {
  return roles.includes(userStore.role)
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出系统吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('已退出登录')
    }).catch(() => {})
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中')
  } else if (command === 'changePassword') {
    ElMessage.info('修改密码功能开发中')
  }
}
</script>

<style scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #4a7bb8, #3b6ba3);
  border-bottom: none;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h2 {
  font-size: 18px;
  color: #ffffff;
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-role {
  font-size: 14px;
  color: #ffffff;
}

.header-icon {
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.3s;
}

.header-icon:hover {
  opacity: 0.8;
}

.notification-badge {
  cursor: pointer;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #ff4d4f;
  border: none;
}

.user-dropdown {
  margin-left: 16px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar {
  background-color: #ffffff;
  transition: width 0.3s;
  overflow-x: hidden;
  border-right: 1px solid #e8e8e8;
}

.el-menu {
  border: none;
}

.sidebar :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  padding-left: 20px !important;
}

.sidebar :deep(.el-menu-item .el-icon) {
  color: #4a7bb8;
  font-size: 18px;
}

.sidebar :deep(.el-menu-item:hover) {
  background-color: #f0f7ff !important;
}

.sidebar :deep(.el-menu-item.is-active) {
  background-color: #e6f2ff !important;
  color: #4a7bb8;
  font-weight: 500;
}

.sidebar :deep(.el-menu-item.is-active .el-icon) {
  color: #4a7bb8;
}

.sidebar :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  padding-left: 20px !important;
}

.sidebar :deep(.el-sub-menu__title .el-icon) {
  color: #4a7bb8;
}

.sidebar :deep(.el-sub-menu__title:hover) {
  background-color: #f0f7ff !important;
}

.main-content {
  background-color: #f0f2f5;
  padding: 0;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f0f2f5;
}

.main-content::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #8c8c8c;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
