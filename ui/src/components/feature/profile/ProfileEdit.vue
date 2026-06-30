<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import ProfileAvatar from '@/components/ui/ProfileAvatar.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { useUsersStore } from '@/stores/usersStore'
import type { ChangePasswordPayload } from '@/types/user'
import { z } from 'zod'
import useNotificationStore from '@/stores/notificationStore'
defineOptions({
  name: 'ProfilePage',
})
const profileImagePreview = ref('')
let previewObjectUrl = ''
const changingPassword = ref(false)
const profileImageInput = ref<File | null>(null)

const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, 'Old password is required')
      .min(6, 'Old password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordFormInput = z.infer<typeof passwordSchema>

const { handleSubmit, resetForm, errors } = useForm<PasswordFormInput>({
  validationSchema: toTypedSchema(passwordSchema),
  initialValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const { value: oldPassword } = useField<string>('oldPassword')
const { value: newPassword } = useField<string>('newPassword')
const { value: confirmPassword } = useField<string>('confirmPassword')
const usersStore = useUsersStore()
const toastStore = useNotificationStore()
const sending = ref(false)
const handleProfileImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl)
  }

  previewObjectUrl = URL.createObjectURL(file)
  profileImagePreview.value = previewObjectUrl
  profileImageInput.value = file
}

onBeforeUnmount(() => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl)
  }
})

const savePasswordChanges = handleSubmit(async (values: ChangePasswordPayload) => {
  sending.value = true
  // Implement the logic to save password changes to backend here
  // Example:
  const { error, success } = await usersStore.updatePassword(values)
  if (error) {
    toastStore.notify('error', error)
  } else {
    changingPassword.value = false
    resetForm()
    if (!success) return
    toastStore.notify('success', success)
  }
  sending.value = false
})

const cancelPasswordChange = () => {
  changingPassword.value = false
  resetForm()
}

defineExpose({
  oldPassword,
  newPassword,
  confirmPassword,
  profileImageInput,
})
</script>

<template>
  <div class="account-info flex flex-col gap-2 items-center">
    <h2>Account Information</h2>
    <div class="flex-col justify-center text-center items-center gap-2 profile-avatar">
      <ProfileAvatar
        :user="{
          name: 'John Doe',
          profileImage: profileImagePreview,
          guid: '12345',
          email: 'john.doe@example.com',
        }"
        :width="45"
        :height="45"
      />
      <input
        id="profileImageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleProfileImageChange"
      />
      <label
        for="profileImageInput"
        class="cursor-pointer text-sm btn btn-primary hover:bg-blue-400 rounded px-2 py-2 mt-4"
      >
        Change Profile Image
      </label>
    </div>
    <div class="user-security mt-8">
      <form @submit.prevent="savePasswordChanges" class="flex flex-col gap-2">
        <h2>Security</h2>
        <span v-if="!changingPassword" class="text-gray-600 text-sm">Password: ********</span>
        <div v-else class="text-sm flex gap-2 flex-col mt-2">
          <div>
            <Input v-model="oldPassword" type="password" placeholder="Old Password" />
            <span v-if="errors.oldPassword" class="text-red-500 text-xs mt-1 block">
              {{ errors.oldPassword }}
            </span>
          </div>
          <div>
            <Input v-model="newPassword" type="password" placeholder="New Password" />
            <span v-if="errors.newPassword" class="text-red-500 text-xs mt-1 block">
              {{ errors.newPassword }}
            </span>
          </div>
          <div>
            <Input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
            <span v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 block">
              {{ errors.confirmPassword }}
            </span>
          </div>
        </div>

        <Button
          v-if="!changingPassword"
          label="Change Password"
          @click="changingPassword = !changingPassword"
          btnUI="btn-secondary"
          class="mt-2"
        />
        <div v-if="changingPassword" class="flex gap-2">
          <Button label="Cancel" @click="cancelPasswordChange" btnUI="btn-secondary" class="mt-2" />
          <Button
            label="Save Password"
            type="submit"
            btnUI="btn-secondary"
            class="mt-2"
            :isLoading="sending"
          />
        </div>
      </form>
    </div>
  </div>
</template>
