import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { describe, it, expect } from 'vitest'
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

describe('App.vue', () => {
  it('renders router-view', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    await router.isReady()
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })
})
