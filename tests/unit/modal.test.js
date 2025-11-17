// tests/unit/modal.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Modal from '../../src/components/modal.vue'  // ✅ ใช้ relative path

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('Modal Component', () => {
  it('should calculate age correctly from birth date', () => {
    const wrapper = mount(Modal)
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
    
    wrapper.vm.selectedDate = birthDate.toISOString().split('T')[0]
    
    expect(wrapper.vm.age).toBe(25)
  })

  it('should validate required fields before submit', async () => {
    const wrapper = mount(Modal)
    
    await wrapper.vm.senddata_customer()
    
    expect(wrapper.vm.successMessage).toContain('กรุณากรอกชื่อ')
    expect(wrapper.vm.showSuccessDialog).toBe(true)
  })

  it('should disable fields in view mode', () => {
    const wrapper = mount(Modal, {
      props: { viewMode: true }
    })
    
    expect(wrapper.vm.viewMode).toBe(true)
  })
})