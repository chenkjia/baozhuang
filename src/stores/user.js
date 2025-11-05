import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    role: '',
    name: ''
  }),
  
  actions: {
    login(userData) {
      this.username = userData.username
      this.role = userData.role
      this.name = userData.name
      localStorage.setItem('user', JSON.stringify(userData))
    },
    
    logout() {
      this.username = ''
      this.role = ''
      this.name = ''
      localStorage.removeItem('user')
    },
    
    loadUser() {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        this.username = user.username
        this.role = user.role
        this.name = user.name
      }
    }
  },
  
  getters: {
    isLoggedIn: (state) => !!state.username,
    userRole: (state) => state.role
  }
})
