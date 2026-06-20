import { defineStore } from 'pinia'
import { ref, shallowRef, type Component } from 'vue'

type ModalProps = {
  data?: {
    title: string
    description: string
  }
  settings?: {
    width?: number
    height?: number
    noCloseButton?: boolean
    footer?: boolean
  }
}

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const content = shallowRef<Component | null>(null)
  const props = ref<ModalProps>({})

  function openModal(component: Component, modalProps: ModalProps = {}) {
    content.value = component
    props.value = modalProps
    isOpen.value = true
  }
  function closeModal() {
    content.value = null
    props.value = {}
    isOpen.value = false
  }
  return { isOpen, content, props, openModal, closeModal }
})
