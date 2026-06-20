import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification, NotificationType } from '../types/notification'

const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function notify(type: NotificationType, message: string, duration = 3000) {
    const id = crypto.randomUUID()
    notifications.value.push({ id, type, message })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, notify, dismiss }
})

export default useNotificationStore
