<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'DropdownMenu',
})
const props = defineProps<{
  items: { label: string; action: () => void }[]
  showing: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)

const handleOutsideClick = (event: MouseEvent) => {
  if (!props.showing || !dropdownRef.value) {
    return
  }

  const target = event.target as Node | null
  if (target && !dropdownRef.value.contains(target)) {
    emit('close')
  }
}

const handleItemClick = (action: () => void) => {
  action()
  emit('close')
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="dropdown-menu rounded shadow-md py-2 w-40"
    :style="{ display: props.showing ? 'block' : 'none' }"
  >
    <ul>
      <li
        v-for="(item, index) in props.items"
        :key="index"
        class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
        @click="handleItemClick(item.action)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* position dropdown menu few pixels below the button */
.dropdown-menu {
  position: absolute;
  z-index: 10;
  left: 0;
  background-color: #161e29; /* Tailwind's gray-800 */
  border: 1px solid #292f3a; /* Tailwind's gray-700 */
}
</style>
