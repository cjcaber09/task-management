<script lang="ts" setup>
import { computed, ref } from 'vue'
import { MoreVertical, Plus } from '@lucide/vue'
import { useProjectStore } from '@/stores/projectStore'
import Modal from './ui/Modal.vue'
import AddTaskForm from './AddTaskForm.vue'
import type { ProjectType } from '@shared/types/project'
import IconButton from './ui/IconButton.vue'
import DropdownMenu from './ui/DropdownMenu.vue'
import ProfileAvatar from './ui/ProfileAvatar.vue'
import { useModalStore } from '@/stores/modalStore'
import AddMemberContent from './AddProjectMember.vue'
defineOptions({
  name: 'ProjectTitle',
})

const addTaskModal = ref<boolean>(false)
const projectStore = useProjectStore()

const activeProject = computed<ProjectType | null>(() => {
  return projectStore.activeProject
})
const titleText = computed(() => {
  return activeProject.value ? activeProject.value.name : 'All Tasks'
})
const subtitleText = computed(() => {
  return activeProject.value ? activeProject.value.description : 'All tasks across all projects'
})

const showDropdown = ref(false)

const addTask = () => {
  addTaskModal.value = true
}

const archiveConfirmation = ref(false)
const archiveProject = () => {
  // show confirmation modal before archiving project
  projectStore
    .archiveProject(activeProject.value!.guid)
    .then(() => {
      archiveConfirmation.value = false
      showDropdown.value = false
    })
    .catch((error) => {
      console.error('Error archiving project: ', error)
    })
}

const modalStore = useModalStore()

const AddMember = () => {
  // open Modal
  modalStore.openModal(AddMemberContent, {
    settings: { width: 30, noCloseButton: false, footer: false },
  })
}
</script>

<template>
  <div class="project-title flex items-center justify-between">
    <div class="project-details">
      <h2>{{ titleText }}</h2>
      <small>{{ subtitleText }}</small>
      <div class="members-list flex flex-row mt-2">
        <div v-for="member in activeProject?.members || []" :key="member.guid" class="flex">
          <ProfileAvatar :user="member" />
        </div>
        <div
          class="add-member p-1 ml-1 justify-center flex rounded rounded-full items-center border-2 border-gray-300 cursor-pointer"
          v-if="activeProject"
          @click="AddMember"
        >
          <Plus class="w-3 h-3 cursor-pointer" />
        </div>
      </div>
    </div>
    <div v-if="activeProject" class="flex items-center gap-2">
      <button class="btn flex items-center" @click="addTask">
        <Plus class="mr-2 w-4 h-4" />Add Task
      </button>
      <div class="relative">
        <IconButton @click.stop="() => (showDropdown = !showDropdown)">
          <template #icon>
            <MoreVertical class="w-4 h-4" />
          </template>
        </IconButton>
        <DropdownMenu
          :showing="showDropdown"
          @close="showDropdown = false"
          :items="[
            { label: 'Edit Project', action: () => console.log('Edit project') },
            { label: 'Archive Project', action: () => archiveProject() },
          ]"
        >
        </DropdownMenu>
      </div>
    </div>
  </div>
  <Modal v-if="addTaskModal" @close="addTaskModal = false" :height="45">
    <template #header>
      <h3 class="text-lg font-semibold">Add New Task</h3>
    </template>
    <template #content>
      <div class="h-full min-h-0 overflow-hidden">
        <AddTaskForm />
      </div>
    </template>
    <template #footer> </template>
  </Modal>
  <Modal v-if="archiveConfirmation" @close="archiveConfirmation = false" :height="15">
    <template #header>
      <h3 class="text-lg font-semibold">Confirm Archive</h3>
    </template>
    <template #content>
      <p>Are you sure you want to archive this project?</p>
    </template>
    <template #footer>
      <button class="btn-outline btn-danger" @click="archiveProject">Archive</button>
    </template>
  </Modal>
</template>
