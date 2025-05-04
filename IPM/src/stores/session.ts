import { defineStore } from 'pinia'

export const useSessionStorage = defineStore('session', {
  state: () => ({
    id: '',
    name: '',
    type: '',
    email: '',
  }),
  actions: {
    login(id: string, name: string, type: string, email: string) {
      this.id = id
      this.name = name
      this.type = type
      this.email = email
    },
    logout() {
      this.id = ''
      this.name = ''
      this.type = ''
      this.email = ''
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.id && state.name && state.type && state.email
    },
  },
  persist: true,
})
