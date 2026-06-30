<template>
  <div class="flex">
    <button
      :class="`btn mt-2 ${btnUI} ${classes}`"
      :type="type"
      @click="$emit('click')"
      :disabled="isLoading ? true : false"
    >
      <component
        v-if="iconComponent"
        :is="iconComponent"
        class="w-4 inline-block h-4 mr-1 mb-1 items-center justify-center"
      />
      {{ !isLoading ? label : 'Loading...' }}
    </button>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'ButtonComponent',
})
defineEmits(['click'])
defineProps({
  isLoading: {
    type: Boolean,
  },
  label: {
    type: String,
    default: 'Button',
  },
  btnUI: {
    type: String,
    default: 'btn-primary',
  },
  classes: {
    type: String,
    default: '',
  },
  iconComponent: {
    type: Function,
    default: null,
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button',
  },
})
</script>
