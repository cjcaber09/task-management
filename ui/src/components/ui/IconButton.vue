<script lang="ts" setup>
import type { PropType } from 'vue'

defineOptions({
  name: 'IconButton',
})
defineProps({
  icon: {
    type: String,
  },
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
})
</script>

<template>
  <button
    class="icon-button cursor-pointer hover:bg-gray-800 hover:rounded hover:rounded-full p-3"
    @click="onClick"
  >
    <slot name="icon"> </slot>
  </button>
</template>
