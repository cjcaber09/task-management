<template>
  <select
    class="select select-bordered w-full max-w-xs text-sm"
    @change="$emit('change', ($event.target as HTMLSelectElement).value)"
  >
    <option v-for="option in options" :key="option" :value="option" :selected="selected === option">
      {{ option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ') }}
    </option>
  </select>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'SelectInput',
})
defineProps<{
  options: string[]
  selected: string
}>()
defineEmits<{
  change: [value: string]
}>()
</script>
