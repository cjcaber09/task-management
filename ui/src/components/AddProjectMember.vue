<script lang="ts" setup>
import AddAssignee from './ui/AddAssignee.vue'
import { normalizeText, lowerCaseText, isValidEmail } from '@/utils/stringUtils.ts'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import useNotificationStore from '@/stores/notificationStore'
const assignees = ref<
  {
    email: string
  }[]
>([])
const emailInput = ref('')

const projectStore = useProjectStore()
const notificationStore = useNotificationStore()

const checkUserAuth = async () => {
  const email = normalizeText(emailInput.value)
  // check if the user is already assigned to the project, if so return error
  if (assignees.value.some((assignee) => lowerCaseText(assignee.email) === lowerCaseText(email))) {
    notificationStore.notify('error', 'User is already added to the assignees list.')
    return
  }
  // check if the email format is valid
  if (!isValidEmail(email)) {
    notificationStore.notify('error', 'Invalid email format.')
    return
  }
  // run a check if the user is active in the system, if not return error
  const userExists = await projectStore.searchUsersByEmail(email)
  if (!userExists || userExists.length === 0) {
    notificationStore.notify('error', 'User does not exist in the system.')
    return
  }
  if (projectStore.isUserAMemberOfActiveProject({ email })) {
    notificationStore.notify('error', 'User is already a member of the project.')
    return
  }
  // check if the user exists in the system, if not return error
  // if the user exists, add them to the assignees list
  assignees.value.push({ email })
  emailInput.value = ''
}

const removeAssignee = (index: number) => {
  assignees.value = assignees.value.filter((_, i) => i !== index)
}

const addMembers = async () => {
  if (assignees.value.length === 0) {
    notificationStore.notify(
      'error',
      'No assignees to add. Please enter at least one email and press Enter.',
    )
    return
  }
  if (!projectStore.activeProject) {
    notificationStore.notify('error', 'No active project selected. Cannot add members.')
    return
  }

  await projectStore.addMembersToProject(projectStore.activeProject.guid, assignees.value)
  //   notify the user of the successful addition of members to the project
  notificationStore.notify('success', 'Members added to the project successfully.')
  //  reset the assignees list after adding members to the project
  assignees.value = []
}
</script>

<template>
  <!-- Add users to the project -->
  <AddAssignee
    v-model="emailInput"
    :assignees="assignees"
    @add="checkUserAuth"
    @remove="removeAssignee"
  />
  <slot name="footer" :assignees="assignees" :add-members="addMembers">
    <div class="mt-3 flex justify-end">
      <button class="btn btn-primary" @click="addMembers">Add Members</button>
    </div>
  </slot>
</template>
