<template>
  <div class="flex">
    <button
      :class="`btn mt-2 ${btnUI} ${classes}`"
      type="submit"
      @click="$emit('click')"
      form="create-project-form"
      :disabled="isLoading ? true : false"
    >
      <iconComponent
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
})
</script>
