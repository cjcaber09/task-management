<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modalStore'
import { computed, ref, watch } from 'vue'
import { X } from '@lucide/vue'
defineOptions({
  name: 'ModalContainer',
})

const modalStore = useModalStore()
const { isOpen: showModal, content: modalContent, props: modalProps } = storeToRefs(modalStore)
const localShowModal = ref(showModal.value)

watch(
  () => showModal.value,
  (newVal) => {
    localShowModal.value = newVal
  },
)
const emit = defineEmits(['close'])
const closeModal = () => {
  localShowModal.value = false
}
const handleAfterLeave = () => {
  modalStore.closeModal()
  emit('close')
}

const settings = computed(() => modalProps.value?.settings)
</script>

<template>
  <Transition name="modal" appear @after-leave="handleAfterLeave">
    <div
      v-if="localShowModal"
      class="modal fixed inset-0 flex items-start pt-20 justify-center z-50"
    >
      <div
        class="modal-container p-6 rounded rounded-xl shadow-lg flex flex-col"
        :style="{
          width: `${settings?.width ?? 30}em`,
          //   only add height if it's explicitly set, otherwise let content dictate it
          height: settings?.height ? `${settings.height}em` : 'auto',
        }"
      >
        <div class="flex justify-end mb-2">
          <button
            class="text-gray-500 rounded rounded-full hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
            @click="closeModal"
          >
            <X />
          </button>
        </div>
        <component v-if="modalContent" :is="modalContent" />
        <div class="flex justify-end gap-2">
          <div class="" v-if="settings?.footer == false"></div>

          <div v-else class="flex gap-2">
            <button class="btn" @click="closeModal">Close</button>
            <slot name="footer"></slot>
          </div>
          <!-- <div v-if="!$slots.footer">
            <button class="btn" @click="closeModal">Close</button>
          </div>
          <div v-else-if="$slots.footer && settings?.noCloseButton">
            <slot name="footer"></slot>
          </div>
          <div v-else class="flex gap-2">
            <button class="btn" @click="closeModal">Close</button>
            <slot name="footer"></slot>
          </div> -->
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
