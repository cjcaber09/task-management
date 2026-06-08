<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import Modal from './ui/Modal.vue'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'
import { z } from 'zod'
import { useProjectStore } from '@/stores/projectStore'
import { useCompanyStore } from '@/stores/companyStore'
import type { AddProjectType } from '@/types/projects'
import { ref } from 'vue'
import Button from './ui/Button.vue'
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

const sending = ref(false)
const createProject = (values: AddProjectType) => {
  sending.value = true
  const company = companyStore.getCompany()
  if (!company) {
    console.error('No active company selected. Cannot create project.')
    return
  }

  // assume data is true, vee-validate will handle validation and populate errors if any
  // status is always true by default no point on creating task if it is false, but we can add more complex validation logic here if needed
  projectStore
    .addProject({
      name: values.name,
      description: values.description,
      status: 'active',
      company_guid: company.guid,
    })
    .then(() => {
      // Project created successfully, close the modal
      // fetch the updated list of projects to reflect the new project in the UI
      projectStore.fetchProjects()
      // wait 0.5 sec to change sending value
      setTimeout(() => {
        sending.value = !sending.value
      }, 500)
    })
    .catch((error) => {
      sending.value = !sending.value
      console.error('Error creating project:', error)
      // Handle error (e.g., show an error message to the user)
    })
}

const onSubmit = handleSubmit(createProject)
</script>
<template>
  <Modal v-if="showCreateProjectModal" :showModal="showCreateProjectModal" @close="$emit('close')">
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
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :isLoading="sending" label="Create Project"> </Button>
      </div>
    </template>
  </Modal>
</template>
