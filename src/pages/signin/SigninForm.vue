<template>
    <div class="auth-form ">
        <div class=" my-6 text-center">
            <h1>Ropstam Solution Task</h1>
        </div>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field v-model="email" density="compact" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined"
                @click:append-inner="visible = !visible"></v-text-field>
            <v-btn :loading="loading" class="mb-8" color="blue" size="large" variant="outlined" block @click="signin"
                :disabled="!isFormValid">
                Sign In
            </v-btn>

            <v-card-text class="text-center">
                <a @click="signup" class="text-blue text-decoration-none">
                    Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout" location="top" >
        {{ text }}
        <template v-slot:actions>
            <v-btn color="blue" variant="outlined" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios';
import { baseUrl } from '@/baseUrl'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()

const text = ref('')
const snackbar = ref(false)
const timeout = ref(2000)
const loading = ref(false)

const email = ref('')
const password = ref('')
const visible = ref(false)

const isFormValid = computed(() => {
    return email.value.trim() !== '' && password.value.trim() !== '' && isValidEmail(email.value)
})

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const signin = async () => {
    try {
        loading.value = true
        const fd = {
            email: email.value,
            password: password.value
        }
        const response = await axios.post(`${baseUrl}/user/sign-in`, fd)
        console.log("signin details :", response.data)
        Cookies.set('token', response.data.token)
        loading.value = false
        text.value = response.data.message
        snackbar.value = true
        router.push({ name: 'dashboard' })
    } catch (e) {
        console.log(e)
        loading.value = false
        text.value = e.response.data.message
        snackbar.value = true
    }
}

const signup = () => {
    router.push({ name: 'signup' })
}
</script>
