<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import Modal from './ui/Modal.vue'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'
import { z } from 'zod'
import { useProjectStore } from '@/stores/projectStore'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'
import { useUsersStore } from '@/stores/usersStore.ts'
import type { AddProjectType } from '@/types/projects'
import { onUnmounted, ref } from 'vue'
import Button from './ui/Button.vue'
import AddAssignee from './ui/AddAssignee.vue'
defineOptions({
  name: 'AddProjectForm',
})

defineProps({
  showCreateProjectModal: {
    type: Boolean,
    default: false,
  },
})

const { defineField, errors, handleSubmit } = useForm<AddProjectType>({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1, 'Project name is required'),
      description: z.string().optional(),
    }),
  ),
  initialValues: {
    name: '',
    description: '',
  },
})

const [name] = defineField('name')
const [description] = defineField('description')

const projectStore = useProjectStore()
const companyStore = useCompanyStore()
const userStore = useUsersStore()
const authStore = useAuthStore()
const sending = ref(false)

type AssigneeType = {
  email: string
}[]

const emailInput = ref('')
const assignees = ref<AssigneeType>([])
const searchError = ref('')

const createProject = async (values: AddProjectType) => {
  sending.value = true
  const company = companyStore.getCompany()
  if (!company) {
    sending.value = false
    console.error('No active company selected. Cannot create project.')
    return
  }

  // assume data is true, vee-validate will handle validation and populate errors if any
  // status is always true by default no point on creating task if it is false, but we can add more complex validation logic here if needed
  try {
    await projectStore.addProject({
      name: values.name,
      description: values.description,
      status: 'active',
      company_guid: company.guid,
      members: assignees.value,
    })
    // Project created successfully, close the modal
    // fetch the updated list of projects to reflect the new project in the UI
    await projectStore.fetchProjects()
  } catch (error) {
    sending.value = false
    console.error('Error creating project:', error)
    // Handle error (e.g., show an error message to the user)
  } finally {
    sending.value = false
  }
}

const updateMembers = async () => {
  const inputValue = emailInput.value
  // normalize the input
  const normalized = inputValue.trim().toLowerCase()

  // validate emails and update assignees array, we can use a simple regex for email validation here, but for simplicity we will just split the string by comma and trim the emails

  if (!normalized) {
    emailInput.value = ''
    searchError.value = 'Please enter at least one email address.'
    return
  }
  if (!/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(normalized.replace(/\s/g, ''))) {
    emailInput.value = ''
    searchError.value =
      'Invalid email format. Please enter valid email addresses separated by commas.'
    return
  }
  // Find if the email exists in the assignees array, if it does, remove it, otherwise add it to the array
  const emailExists = assignees.value.some((assignee) => assignee.email === normalized)

  if (emailExists) {
    // error message for duplicate email
    searchError.value = 'Email already added. Please enter a different email address.'
    emailInput.value = ''
    return
  }
  const results = await userStore.fetchUserByEmail(normalized)

  // check if the email is users email, a user cant add themselves they are automatically added as a member of the project, so we can show an error message if they try to add themselves
  const user = authStore.getUser
  if (results?.email?.trim().toLowerCase() === user?.email.trim().toLowerCase()) {
    searchError.value =
      'You are automatically added as a member of the project. You cannot add yourself again.'
    emailInput.value = ''
    return
  }
  const exactMatch = results?.email?.trim().toLowerCase() === normalized

  if (!exactMatch) {
    searchError.value = 'No user found with the provided email. Please enter a valid email address.'
    emailInput.value = ''
    return
  }
  // if the email is valid, push it to the assignees array
  assignees.value = [...assignees.value, { email: normalized }]
  // reset the input value after processing
  emailInput.value = ''
  // reset search error
  searchError.value = ''
}

const removeAssignee = (index: number) => {
  assignees.value = assignees.value.filter((_, i) => i !== index)
}

let timer: ReturnType<typeof setTimeout> | null = null
const searchUsersByEmailQuery = (value: string) => {
  // normalize the input
  value = value.trim().toLowerCase()
  if (!value || value.length < 3) {
    return
  }
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    projectStore.searchUsersByEmail(value)
  }, 300)
}

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
const onSubmit = handleSubmit(createProject)
</script>
<template>
  <Modal
    v-if="showCreateProjectModal"
    :showModal="showCreateProjectModal"
    @close="$emit('close')"
    :height="40"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold">Create New Project</h3>
      </div>
    </template>
    <template #content>
      <form id="create-project-form" class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div>
          <Input
            id="project-name"
            type="text"
            label="Project Name"
            placeholder="Enter project name"
            v-model="name"
          />
          <span class="text-red-500 text-sm mt-1" v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div>
          <span class="text-red-500 text-sm mt-1" v-if="errors.description">{{
            errors.description
          }}</span>
          <Textarea
            id="project-description"
            label="Project Description"
            placeholder="Enter project description"
            v-model="description"
          />
        </div>
        <AddAssignee
          v-model="emailInput"
          :assignees="assignees"
          @input-change="searchUsersByEmailQuery"
          @add="updateMembers"
          @remove="removeAssignee"
          :error="searchError"
        />
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :isLoading="sending" label="Create Project"> </Button>
      </div>
    </template>
  </Modal>
</template>
