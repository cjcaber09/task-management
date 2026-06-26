<script lang="ts" setup>
import ContentHeader from '../components/ContentHeader.vue'
import ContentMain from '../components/ContentMain.vue'
import Profile from './Profile.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'ContentPage',
})

const route = useRoute()
const isProfileRoute = computed(() => route.path === '/profile')
</script>
<template>
  <div class="main flex flex-col gap-4">
    <Profile v-if="isProfileRoute" />
    <template v-else>
      <ContentHeader />
      <ContentMain />
    </template>
  </div>
</template>
