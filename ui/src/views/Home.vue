<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { z } from 'zod'
import type { LoginUserInput } from '../../../shared/types/user'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const { defineField, handleSubmit, errors } = useForm<LoginUserInput>({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email('Invalid email address').min(1, 'Email is required'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
  ),
})
defineOptions({
  name: 'HomePage',
})

const isLoading = ref(false)
const [email] = defineField('email')
const [password] = defineField('password')
const auth = useAuthStore()
const router = useRouter()
// TODO: Implement actual login logic
const onSubmit = handleSubmit(async (values) => {
  // Form validation can be added here
  // set the loading state, call the login API, and handle success or error responses
  isLoading.value = true
  try {
    const { user, token } = await fetch(import.meta.env.VITE_API_URI_DEV + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((res) => res.json())
    // TODO: Store the token and user info in a global state (e.g., Vuex or Pinia) and redirect to the dashboard
    auth.setUser(user)
    auth.storeToken(token)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
})

onMounted(() => {
  // Check if the user is already authenticated and redirect to dashboard if so
  if (auth.isAuthenticated) {
    // Redirect to dashboard
    // You can use Vue Router's `useRouter` to programmatically navigate
    router.push('/dashboard')
  }
})
</script>
<template>
  <div class="w-full h-full flex flex-col items-center justify-start gap-4 p-8">
    <p class="text-4xl font-bold mb-2">Welcome back</p>
    <p class="text-sm text-gray-600">Organize your tasks and boost your productivity!</p>
    <div class="container login-container flex flex-col gap-4">
      <label class="text-sm font-medium" for="username">Username / Email</label>
      <input
        type="text"
        id="username"
        placeholder="username"
        class="input"
        :class="errors.email ? 'border-red-400' : ''"
        v-model="email"
      />
      <span class="text-xs text-red-400">{{ errors.email }}</span>
      <label class="text-sm font-medium" for="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="password"
        class="input"
        :class="errors.password ? 'border-red-400' : ''"
        v-model="password"
      />
      <span class="text-xs text-red-400">{{ errors.password }}</span>
      <Button :isLoading="isLoading" @click="onSubmit" class="w-full" label="Login"> </Button>
      <RouterLink to="/register" class="text-sm text-blue-500 hover:underline mt-2"
        >Don't have an account? Register</RouterLink
      >
    </div>
  </div>
</template>
<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
}
</style>
