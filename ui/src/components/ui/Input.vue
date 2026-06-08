<script lang="ts" setup>
defineOptions({
  name: 'InputFieldComponent',
})
const props = defineProps({
  modelValue: {
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
    default: 'Input Field',
  },
  placeholder: {
    type: String,
    default: 'Enter text here...',
  },

})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
  <input :id="id" :type="type"
    class="input-field border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    :placeholder="placeholder" :value="props.modelValue" @input="onInput" />
</template>
