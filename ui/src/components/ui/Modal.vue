<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { X } from '@lucide/vue'
defineOptions({
  name: 'ModalComponent',
})

withDefaults(
  defineProps<{
    data?: {
      title?: string
      description?: string
    }
    width?: number
    height?: number
  }>(),
  {
    data: () => ({
      title: '',
      description: '',
    }),
    width: 30,
    height: 35,
  },
)
const emit = defineEmits(['close'])

const localShowModal = ref(false)
onMounted(() => {
  localShowModal.value = true
})
const closeModal = () => {
  localShowModal.value = false
}
</script>

<template>
  <Transition name="modal" appear @after-leave="emit('close')">
    <div
      v-if="localShowModal"
      class="modal fixed inset-0 flex items-start pt-20 justify-center z-50"
    >
      <div
        class="modal-container p-6 rounded rounded-xl shadow-lg flex flex-col"
        :style="{ width: `${width}em`, height: `${height}em` }"
      >
        <div class="flex justify-end">
          <button
            class="text-gray-500 rounded rounded-full hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
            @click="closeModal"
          >
            <X />
          </button>
        </div>
        <div class="">
          <slot name="header"></slot>
          <div v-if="!$slots.header">
            <h3 class="text-lg font-semibold">{{ data.title ?? '' }}</h3>
          </div>
        </div>
        <div class="mb-4 flex-1">
          <slot name="content"></slot>
          <div v-if="!$slots.content"></div>
        </div>
        <div class="flex justify-end gap-2">
          <div v-if="!$slots.footer">
            <button class="btn" @click="closeModal">Close</button>
          </div>
          <div v-else class="flex gap-2">
            <button class="btn" @click="closeModal">Close</button>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal {
  background-color: rgba(18, 22, 31, 0.315);
  backdrop-filter: blur(2px);
}

.modal-container {
  background-color: var(--background-color);
  border: 2px solid var(--muted-color);
}
</style>
