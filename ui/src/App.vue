<script setup lang="ts">
import ToastNotification from './components/ui/ToastNotification.vue'
import ModalContainer from './components/ui/ModalContainer.vue'
</script>

<template>
  <router-view />
  <ToastNotification />
  <!-- <Modal /> -->
  <ModalContainer />
</template>

<style scoped></style>
