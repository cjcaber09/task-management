<script lang="ts" setup>
defineOptions({
  name: 'InputFieldComponent',
})
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  id: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter text here...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  preventEnter: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input-enter', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onEnter = (event: KeyboardEvent) => {
  if (props.preventEnter) {
    event.preventDefault()
    event.stopPropagation()
  }
  const target = event.target as HTMLInputElement
  emit('input-enter', target.value)
}
</script>

<template>
  <label v-if="label" :for="id ? id : label" class="block text-sm font-medium text-gray-700 mb-1">{{
    label
  }}</label>
  <input
    :id="id ? id : label"
    :type="type"
    :class="[props.class, 'input-field  rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500']"
    :placeholder="placeholder"
    :value="props.modelValue"
    :disabled="props.disabled"
    @input="onInput"
    @keydown.enter="onEnter"
  />
</template>
<style scoped>
.input-field {
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  border: 2px solid var(--border-color);
}
.input-field:focus {
  border-color: var(--border-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Tailwind's blue-500 with opacity */
  ring: 2px solid rgba(59, 130, 246, 0.5);
}
.input-field:disabled {
  background-color: rgba(42, 50, 82, 0.4);
  cursor: not-allowed;
}
</style>
