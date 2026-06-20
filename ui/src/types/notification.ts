const notificationTypes = ['success', 'error', 'info'] as const

export type NotificationType = (typeof notificationTypes)[number]

export type Notification = {
  id: string
  type: NotificationType
  message: string
}
