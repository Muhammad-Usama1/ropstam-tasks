<template>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item nav>
            <template v-slot:append>
                <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" @click="navigateTo('dashboard')"
                value="dashboard"></v-list-item>
            <v-list-item prepend-icon="mdi-shape-plus" title="Categories" @click="navigateTo('category')"
                value="category"></v-list-item>
            <v-list-item prepend-icon="mdi-car-back" title="Vehicles" @click="navigateTo('vehicle-details')"
                value="vehicle"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group-outline" title="Users" @click="navigateTo('users')"
                value="users"></v-list-item>
            <v-list-item prepend-icon="mdi-logout" title="Log out" @click="logout" value="users"></v-list-item>
        </v-list>
    </v-navigation-drawer>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie';
// Sidebar Drawer
const drawer = ref(true)
const rail = ref(true)


// Routing
const router = useRouter()
const navigateTo = (dashboard) => {
    router.push({ name: dashboard })
}

// logout 
const text = ref('')
const snackbar = ref(false)
const logout = () => {
    Cookies.remove('token')
    text.value = "Logged out Successfuly"
    snackbar.value = true
    router.push('/')
}
</script>