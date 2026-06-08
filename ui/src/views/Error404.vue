<script lang="ts" setup>
defineOptions({
  name: 'Error404Page',
})
</script>

<template>
  <div class="error-page">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="button">Go back to Home</router-link>
  </div>
</template>
