<script lang="ts" setup>
import ProgressStatus from './ProgressStatus.vue'
import ProjectTitle from './ProjectTitle.vue'
import StatusBar from './StatusBar.vue'
import TaskList from './TaskList.vue'
defineOptions({
  name: 'ContentMain',
})
</script>
<template>
  <div class="content-main px-4">
    <ProjectTitle />
    <StatusBar />
    <div class="project-tasks mt-6">
      <ProgressStatus />
      <TaskList />
    </div>
  </div>
</template>
