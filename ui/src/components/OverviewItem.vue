<script lang="ts" setup>
defineOptions({
  name: 'OverviewItemComponent',
})
defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <div class="overview-item">
    <h3 class="text-lg font-semibold mb-2">{{ count }}</h3>
    <p class="text-sm text-gray-500">{{ title }}</p>
  </div>
</template>
