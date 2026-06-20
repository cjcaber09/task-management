<script lang="ts" setup>
import { CircleCheck, CircleX, Info, X } from '@lucide/vue'
import useNotificationStore from '../../stores/notificationStore'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'ToastNotification' })

const store = useNotificationStore()
const { notifications } = storeToRefs(store)

const icons = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
}

const colors = {
  success: 'toast--success',
  error: 'toast--error',
  info: 'toast--info',
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id" class="toast" :class="colors[n.type]">
          <component :is="icons[n.type]" class="toast__icon" />
          <span class="toast__message">{{ n.message }}</span>
          <button class="toast__close" @click="store.dismiss(n.id)">
            <X class="w-3 h-3" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.toast-stack {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  min-width: 220px;
  max-width: 360px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  color: #fff;
}

.toast--success {
  background-color: #16a34a;
}
.toast--error {
  background-color: #dc2626;
}
.toast--info {
  background-color: #2563eb;
}

.toast__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.toast__message {
  flex: 1;
}

.toast__close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0;
  display: flex;
}
.toast__close:hover {
  opacity: 1;
}

/* transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
