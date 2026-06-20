<script lang="ts" setup>
import OverviewItemComponent from '../components/OverviewItem.vue'
defineOptions({
  name: 'OverviewPage',
})
const overviewData = [
  { title: 'To Do', count: 5, color: '#595687a6' },
  { title: 'In Progress', count: 3, color: '#595687a6' },
  { title: 'Done', count: 2, color: '#595687a6' },
  { title: 'Total', count: 10, color: '#595687a6' },
]
</script>
<template>
  <div class="py-4 pr-4">
    <h2>Overview</h2>
    <div class="flex flex-wrap gap-4 mt-4">
      <!-- todo -->
      <OverviewItemComponent
        v-for="(item, index) in overviewData"
        :key="index"
        :title="item.title"
        :count="item.count"
        :color="item.color"
      />
    </div>
  </div>
</template>
