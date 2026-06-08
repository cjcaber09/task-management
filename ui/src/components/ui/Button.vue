<template>
  <div class="flex">
    <button
      class="btn btn-primary"
      type="submit"
      @click="$emit('click')"
      form="create-project-form"
      :disabled="isLoading ? true : false"
    >
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
})
</script>
