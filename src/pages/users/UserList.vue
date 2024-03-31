<template>

    <v-container>
        <div class="loader" v-if="loading">
            <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-card v-else>
            <v-card title="Search Users">
                <template v-slot:text>
                    <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="users" :search="search" v-model:page="page"
                    :items-per-page="itemsPerPage" v-model="page">
                    <template v-slot:bottom>
                    <div class="text-center pt-2">
                        <v-pagination v-model="page" :length="pageCount"></v-pagination>
                    </div>
                </template>

                </v-data-table>
            </v-card>
        </v-card>
    </v-container>
</template>
<script setup>
import { ref, onMounted,computed } from 'vue'
import { useUserList } from "@/stores/users/userList"
const userListStore = useUserList()

// General
const users = ref([])
const loading = ref(true)

// TableW
const search = ref('')
const headers = ref(
    [
        {
            align: 'start',
            key: 'name',
            sortable: false,
            title: 'UserName',
        },
        { title: 'Email', key: 'email' },
    ],
)

// Mounting User
onMounted(async () => {
    await userListStore.fetchUsers()
    users.value = userListStore.users
    loading.value = false
})



// Pagination
const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => Math.ceil(users.value.length / itemsPerPage.value));

</script>