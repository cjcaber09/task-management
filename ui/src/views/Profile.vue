<script lang="ts" setup>
// import { onBeforeUnmount, ref } from 'vue'
import { useTemplateRef } from 'vue'
// import ProfileAvatar from '@/components/ui/ProfileAvatar.vue'
import { ArrowLeft } from '@lucide/vue'
import Button from '@/components/ui/Button.vue'
// import Input from '@/components/ui/Input.vue'
import ProfileEdit from '@/components/feature/profile/ProfileEdit.vue'
import UserDetails from '@/components/feature/profile/UserDetails.vue'
import useNotificationStore from '@/stores/notificationStore'
import { useUsersStore } from '@/stores/usersStore'
import { useAuthStore } from '@/stores/authStore'
const toastStore = useNotificationStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()
type ExposedProfileEdit = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
  profileImageInput: File | null
}

type ExposedUserDetails = {
  inputs: {
    email: string
    guid: string
    name: string
    firstName: string
    lastName: string
    address: {
      city: string
      state: string
      zipCode: string
      street: string
    }
    contact_info: {
      phone: string
      email: string
    }
  } | null
}

const ProfileEditRef = useTemplateRef<ExposedProfileEdit>('ProfileEditRef')
const UserDetailsRef = useTemplateRef<ExposedUserDetails>('UserDetailsRef')
const currentUser = authStore.getUser
defineOptions({
  name: 'ProfilePage',
})

const saveProfileChanges = async () => {
  const profileEdit = ProfileEditRef.value
  const userDetails = UserDetailsRef.value

  if (profileEdit && userDetails) {
    try {
      const profileImageFile = profileEdit.profileImageInput
      // send an upload request to the server with the profile image file and password data
      console.log('Profile changes saved successfully', userDetails.inputs)
      if (!userDetails.inputs) {
        return toastStore.notify('error', 'User details are missing. Cannot save profile changes.')
      }
      await usersStore.updateUserData(userDetails.inputs.guid, profileImageFile, userDetails.inputs)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save profile changes'
      toastStore.notify('error', message)
      console.error('saveProfileChanges failed:', error)
    }
  }
}
</script>

<template>
  <div class="flex items-center cursor-pointer mt-4" @click="$router.back()">
    <ArrowLeft class="w-4 h-4 text-gray-600" />
    <span class="ml-2 text-gray-600 text-md font-semibold">Back</span>
  </div>
  <div class="flex flex-col gap-4">
    <div class="pr-4 flex flex-col xl:flex-row gap-6">
      <ProfileEdit ref="ProfileEditRef" :data="currentUser" />
      <UserDetails ref="UserDetailsRef" :data="currentUser" />
    </div>
    <!-- Save Button -->
    <div class="flex justify-end">
      <Button label="Save" @click="saveProfileChanges" btnUI="btn-primary" />
    </div>
  </div>
</template>
