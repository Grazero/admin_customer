import { mount } from '@vue/test-utils'
import InputField from '../../src/components/widget/input.vue' 

describe('Input Component', () => {
  it('should emit update event on input', async () => {
    const wrapper = mount(InputField, {
      props: { modelValue: '' }
    })
    
    await wrapper.find('input').setValue('test value')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
  })

  it('should apply disabled state', () => {
    const wrapper = mount(InputField, {
      props: { disabled: true }
    })
    
    // ✅ ตรวจสอบ property disabled แทน attribute
    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  it('should not be disabled by default', () => {
    const wrapper = mount(InputField, {
      props: { disabled: false }
    })
    
    expect(wrapper.find('input').element.disabled).toBe(false)
  })

  it('should display correct placeholder', () => {
    const wrapper = mount(InputField, {
      props: { txt_placeholder: 'Test Placeholder' }
    })
    
    expect(wrapper.find('input').attributes('placeholder')).toBe('Test Placeholder')
  })

  it('should display initial value', () => {
    const wrapper = mount(InputField, {
      props: { modelValue: 'Initial Value' }
    })
    
    expect(wrapper.find('input').element.value).toBe('Initial Value')
  })
})