<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import { ref, watch } from 'vue'
const props = defineProps<{
  data: {
    email: string
    guid: string
    name: string
    // firstName: string
    // lastName: string
    // address: {
    //   city: string
    //   state: string
    //   zipCode: string
    //   street: string
    // }
    // contact_info: {
    //   phone: string
    //   email: string
    // }
  } | null
}>()

const inputs = ref(
  props.data
    ? {
        ...props.data,
        firstName: '',
        lastName: '',
        address: {
          city: '',
          state: '',
          zipCode: '',
          street: '',
        },
        contact_info: { phone: '', email: '' },
      }
    : null,
  // props.data ? { ...props.data, firstName: '', lastName: '', address
)

watch(
  () => props.data,
  (newData) => {
    console.log('props.data changed:', newData)
    inputs.value = newData
      ? {
          ...newData,
          firstName: '',
          lastName: '',
          address: { city: '', state: '', zipCode: '', street: '' },
          contact_info: { phone: '', email: '' },
        }
      : null
  },
  { immediate: true },
)

defineExpose({
  inputs,
})
</script>

<template>
  <div class="user-info flex-1">
    <h2>Account Details</h2>
    <div class="flex flex-row mt-4 gap-2" v-if="inputs">
      <div class="flex-1 gap-1 flex flex-col">
        <Input
          v-model="inputs.email"
          placeholder="Enter your email"
          label="Email"
          class="text-sm"
        />
        <Input
          v-model="inputs.guid"
          placeholder="Enter your GUID"
          label="GUID"
          class="text-sm"
          disabled
        />
      </div>
      <div class="flex-1 gap-1 flex flex-col">
        <Input v-model="inputs.name" placeholder="Enter your name" label="Name" class="text-sm" />
        <Input
          v-model="inputs.firstName"
          placeholder="Enter your first name"
          label="First Name"
          class="text-sm"
        />
        <Input
          v-model="inputs.lastName"
          placeholder="Enter your last name"
          label="Last Name"
          class="text-sm"
        />
      </div>
    </div>
    <h2 class="mt-4">Address Information</h2>
    <div class="flex flex-row mt-4 gap-2" v-if="inputs">
      <div class="flex-1 gap-1 flex flex-row flex-wrap">
        <Input
          v-model="inputs.address.street"
          placeholder="Enter your street"
          label="Street"
          class="text-sm"
        />
        <Input
          v-model="inputs.address.city"
          placeholder="Enter your city"
          label="City"
          class="text-sm"
        />
      </div>
      <div class="flex-1 gap-1 flex flex-row flex-wrap">
        <Input
          v-model="inputs.address.state"
          placeholder="Enter your state"
          label="State"
          class="text-sm"
        />
        <Input
          v-model="inputs.address.zipCode"
          placeholder="Enter your zip code"
          label="Zip Code"
          class="text-sm"
        />
      </div>
    </div>
    <h2 class="mt-4">Contact Information</h2>
    <div class="flex flex-row mt-4 gap-2" v-if="inputs">
      <div class="flex-1 gap-4 flex flex-row">
        <div>
          <Input
            v-model="inputs.contact_info.phone"
            placeholder="Enter your phone number"
            label="Phone"
            class="text-sm"
          />
        </div>
        <div>
          <Input
            v-model="inputs.contact_info.email"
            placeholder="Enter your contact email"
            label="Contact Email"
            class="text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
