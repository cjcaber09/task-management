<script lang="ts" setup>
import SidebarComponent from '../layouts/Sidebar.vue'
import ContentComponent from '../layouts/Content.vue'
import OverviewComponent from '../layouts/Overview.vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
defineOptions({
  name: 'DashboardPage',
})

const companyStore = useCompanyStore()
const authStore = useAuthStore()
const projectStore = useProjectStore()
onMounted(async () => {
  // fetch Projects
  projectStore.fetchProjects()
  if (!authStore.isAuthenticated) {
    console.error('User is not authenticated. Cannot fetch company data.')
    return
  }
  try {
    console.log('Fetching user data...', authStore.user)
    if (!authStore.user) {
      // refresh data ONLY
      await authStore.validateUser()
      const user = authStore.getUser
      if (!user) {
        console.error('User data is still not available after validation. Cannot fetch company data.')
        return
      }
      companyStore.fetchCompanyByUser(user.guid)
    }
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
})
</script>
<template>
  <div class="dashboard flex h-screen mx-auto lg:mx-12 2xl:mx-24">
    <SidebarComponent />
    <div class="main-content flex-1 flex flex-row gap-6">
      <div class="content flex-1 min-w-[300px]">
        <ContentComponent />
      </div>
      <div>
        <OverviewComponent />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
