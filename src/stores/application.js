import { defineStore } from 'pinia'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applications: []
  }),
  
  actions: {
    addApplication(application) {
      const newApp = {
        id: Date.now().toString(),
        ...application,
        status: '待审核',
        createDate: new Date().toISOString().split('T')[0],
        progress: []
      }
      this.applications.unshift(newApp)
      this.saveToStorage()
      return newApp
    },
    
    updateApplication(id, updates) {
      const index = this.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        this.applications[index] = { ...this.applications[index], ...updates }
        this.saveToStorage()
      }
    },
    
    deleteApplication(id) {
      this.applications = this.applications.filter(app => app.id !== id)
      this.saveToStorage()
    },
    
    addProgress(id, progressItem) {
      const app = this.applications.find(app => app.id === id)
      if (app) {
        if (!app.progress) app.progress = []
        app.progress.push({
          ...progressItem,
          timestamp: new Date().toISOString()
        })
        this.saveToStorage()
      }
    },
    
    saveToStorage() {
      localStorage.setItem('applications', JSON.stringify(this.applications))
    },
    
    loadFromStorage() {
      const data = localStorage.getItem('applications')
      if (data) {
        this.applications = JSON.parse(data)
      } else {
        // 初始化示例数据
        this.applications = [
          {
            id: '20231101001',
            applicantName: '张三',
            phone: '13800138000',
            idCard: '310101199001011234',
            waterType: '居民用水',
            usageType: '生活用水',
            estimatedUsage: '5吨/月',
            province: '上海市',
            city: '上海市',
            district: '浦东新区',
            street: '陆家嘴街道',
            address: '世纪大道100号',
            status: '待审核',
            createDate: '2023-11-01',
            progress: [
              {
                status: '待审核',
                operator: '系统',
                timestamp: '2023-11-01T10:00:00'
              }
            ]
          }
        ]
        this.saveToStorage()
      }
    }
  },
  
  getters: {
    getApplicationById: (state) => (id) => {
      return state.applications.find(app => app.id === id)
    },
    
    pendingApplications: (state) => {
      return state.applications.filter(app => app.status === '待审核')
    },
    
    approvedApplications: (state) => {
      return state.applications.filter(app => app.status === '审核通过')
    }
  }
})
