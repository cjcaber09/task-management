<script lang="ts" setup>
import ContentHeader from '../components/ContentHeader.vue'
import ContentMain from '../components/ContentMain.vue'
defineOptions({
  name: 'ContentPage',
})
</script>
<template>
  <div class="main flex flex-col gap-4">
    <ContentHeader />
    <ContentMain />
  </div>
</template>
