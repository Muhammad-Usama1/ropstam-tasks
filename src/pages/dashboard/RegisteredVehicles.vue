<template>
    <div class="vehicles-record">
        <div class="loader" v-if="loading">
            <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <div v-else class="vehicles-record">
            <v-card variant="outlined" v-for="card in dashboard" :key="card.title">
                <v-card-item>
                    <div>
                        <div class="record-data">{{card.value }}</div>
                        <div class="text-h6 mb-1">
                            {{card.title}}
                        </div>
                    </div>
                </v-card-item>
            </v-card>
        </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserList } from "@/stores/users/userList"

const recordStore = useUserList()
const loading = ref(true)
const dashboard=ref([])

// Mounting data
onMounted(async () => {
    await recordStore.vehicleRecord()
    dashboard.value=recordStore.registeredVehicles
    loading.value = false
})
</script>

<style scoped>
.record-data {
    font-weight: 900;
    font-size: 2rem
}

.vehicles-record {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 20px;
}

.vehicles-record .v-card {
    min-height: 100px;
    min-width: 320px;
    text-align: center;
}
</style>
