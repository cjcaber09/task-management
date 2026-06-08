<script lang="ts" setup>
defineOptions({
  name: 'TextareaFieldComponent',
})
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: 'textarea-field',
  },
  label: {
    type: String,
    default: 'Textarea Field',
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: 'Enter text here...',
  },
  cols: {
    type: Number,
    default: 40,
  },
  rows: {
    type: Number,
    default: 6,
  },
  data: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label v-if="showLabel" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{
    label
  }}</label>
  <textarea
    :id="id"
    class="input-field border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    :placeholder="placeholder"
    :value="props.modelValue"
    @input="onInput"
    :cols="cols"
    :rows="rows"
  ></textarea>
</template>
