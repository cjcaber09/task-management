<script lang="ts" setup>
import ProfileAvatar from '@/components/ui/ProfileAvatar.vue'

defineOptions({
  name: 'ProfilePage',
})
</script>

<template>
  <div class="py-4 pr-4 flex flex-row gap-4">
    <div class="account-info">
      <h2>Account Information</h2>
      <ProfileAvatar
        :user="{ name: 'John Doe', profileImage: '', guid: '12345', email: 'john.doe@example.com' }"
        :width="24"
        :height="24"
      />
    </div>
    <div class="user-info"></div>
  </div>
</template>
