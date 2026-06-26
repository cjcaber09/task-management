<script lang="ts" setup>
import type { UserType } from '@/types/index'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import Router from '@/router/index'
defineOptions({
  name: 'ProfileAvatar',
})

const props = defineProps({
  user: {
    type: Object as PropType<Pick<UserType, 'guid' | 'email' | 'name' | 'profileImage'> | null>,
    default: null,
  },
  width: {
    type: Number,
    default: 6,
  },
  height: {
    type: Number,
    default: 6,
  },
})

const widthValue = computed(() => props.width)
const heightValue = computed(() => props.height)

const hasProfile = computed(() => !!props.user?.profileImage)
const avatarStyle = computed(() => ({
  width: `${widthValue.value * 0.25}rem`,
  height: `${heightValue.value * 0.25}rem`,
}))

const dropdownVisibility = ref(false)
const dropdownItems = ref([
  // route to profile page or open profile modal
  { label: 'Profile', action: () => Router.push('/profile') },
  { label: 'Settings', action: () => console.log('Settings clicked') },
  { label: 'Logout', action: () => console.log('Logout clicked') },
])
const openDropdown = () => {
  // logic to open a dropdown menu for user profile actions
  dropdownVisibility.value = true
}
</script>

<template>
  <div v-if="hasProfile && props.user" class="flex relative" @click.stop="openDropdown">
    <img
      :src="props.user.profileImage || ''"
      alt="Profile"
      :style="avatarStyle"
      class="rounded-full border-2 border-gray-300"
    />
  </div>
  <div v-else class="flex relative" @click.stop="openDropdown">
    <div :style="avatarStyle" class="rounded-full bg-gray-300 flex items-center justify-center">
      <span :class="`text-gray-600 text-xs`">{{ props.user?.name?.charAt(0) || 'U' }}</span>
    </div>
  </div>
  <DropdownMenu
    :showing="dropdownVisibility"
    :items="dropdownItems"
    @close="dropdownVisibility = false"
  />
</template>

<style scoped></style>
