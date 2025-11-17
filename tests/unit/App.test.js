// tests/unit/App.test.js
import { mount } from '@vue/test-utils'
import App from '../../src/App.vue'  
import { describe, it, expect, vi } from 'vitest'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('App Component', () => {
  it('should fetch users on mount', async () => {
    const mockUsers = [{ itemid: 1, firstname: 'John', lastname: 'Doe' }]
    const axios = await import('axios')
    axios.default.get.mockResolvedValue({ data: { data: mockUsers } })
    
    const wrapper = mount(App)
    await wrapper.vm.fetchUsers()
    
    expect(wrapper.vm.users).toEqual(mockUsers)
  })

  it('should open modal in view mode when view button clicked', async () => {
    const wrapper = mount(App)
    const testUser = { itemid: 1, firstname: 'Test', lastname: 'User' }
    
    wrapper.vm.fetchdetail_user(testUser)
    
    expect(wrapper.vm.viewMode).toBe(true)
    expect(wrapper.vm.selectedUser).toEqual(testUser)
    expect(wrapper.vm.showModal).toBe(true)
  })

  it('should format date correctly', () => {
    const wrapper = mount(App)
    const testDate = '2023-12-25'
    
    const formatted = wrapper.vm.format_date(testDate)
    
    expect(formatted).toBe('25/12/2023')
  })
})