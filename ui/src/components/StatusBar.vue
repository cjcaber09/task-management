<script lang="ts" setup>
defineOptions({
  name: 'StatusBar',
})
</script>
<template>
  <div class="project-progress mt-4">
    <h6 class="font-semibold text-gray-400">Progress</h6>
    <div class="progress-bar bg-gray-700 rounded-full h-1 w-full mt-2">
      <div class="progress bg-blue-400 h-1 rounded-full" style="width: 50%"></div>
    </div>
  </div>
</template>
