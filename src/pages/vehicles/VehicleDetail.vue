<template>
    <div class="v-container">
        <div class="loader" v-if="loading">
            <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-card title="Search Vehicles" v-else>
            <template v-slot:text>
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </template>

            <v-data-table :search="search" :headers="headers" :items="vehicles"
                :sort-by="[{ key: 'title', order: 'des' }]" v-model:page="page" :items-per-page="itemsPerPage"
                v-model="page">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Vehicles</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mb-2" variant="outlined" dark v-bind="props">
                                    Add New Vehicle
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ isNewVehicle ? 'Add New Vehicle' : 'Edit Vehicle' }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="12" sm="6">
                                                <!-- Dropdown for selecting category -->
                                                <v-select v-model="selectedCategory" :items="categoryStore.categories"
                                                    variant="outlined" label="Select Category" item-text="name"
                                                    item-value="id" outlined></v-select>
                                            </v-col>
                                            <v-col cols="12" md="12" sm="6">
                                                <v-text-field v-model="vehicle.title" label="Title"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="12" sm="6">
                                                <v-text-field v-model="vehicle.model" label="Model"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="12" sm="6">
                                                <v-text-field v-model="vehicle.color" label="Color"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="12" sm="6">
                                                <v-text-field v-model="vehicle.registrationNumber" label="Reg no"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="outlined" @click="dialog = false">Cancel</v-btn>

                                    <v-btn :loading="process" variant="outlined" :disabled="isSaveDisabled"
                                        @click="saveVehicle">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card class="py-10">
                                <v-card-title class="text-h6 text-center mb-5">Are you sure you want to delete this
                                    item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="outlined" @click="dialogDelete = false">Cancel</v-btn>
                                    <v-btn variant="outlined" @click="deleteVehicleConfirm"
                                        :loading="process">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon size="small" @click="deleteVehicle(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:bottom>
                    <div class="text-center pt-2">
                        <v-pagination v-model="page" :length="pageCount"></v-pagination>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout" location="top">
        {{ text }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchEffect } from 'vue';
import { useVehicleList } from '@/stores/vehicles/vehicleList';
import { useCategories } from '@/stores/categories/addnew';
const vehicleStore = useVehicleList();
const categoryStore = useCategories();

// General
const loading = ref(true);
const process = ref(false);
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const snackbar = ref(false);
const text = ref('');

// Table
const headers = [
    {
        title: 'Name',
        align: 'start',
        key: 'title',
    },
    { title: 'Category', key: 'category' },
    { title: 'Model', key: 'model' },
    { title: 'Color', key: 'color' },
    { title: 'Registration no', key: 'registrationNumber' },
    { title: 'Actions', key: 'actions', sortable: false },
];

// Fetching all the vehicles from Pinia
const vehicles = ref([]);
const fetchVehicles = async () => {
    await vehicleStore.fetchVehicle();
    vehicles.value = vehicleStore.vehicles;
    loading.value = false;
};
onMounted(fetchVehicles);

// Fetching categories from Pinia store
const categories = ref([]); // Store categories locally
const fetchCategories = async () => {
    await categoryStore.fetchCategory();
    categories.value = categoryStore.categories;
};
onMounted(fetchCategories);

// Selected category
const selectedCategory = ref(null);

// Adding new vehicle
const vehicle = reactive({
    title: '',
    color: '',
    model: '',
    registrationNumber: '',
});
const isNewVehicle = ref(true);
const saveVehicle = async () => {
    process.value = true;
    vehicle.category = selectedCategory.value;
    try {
        if (isNewVehicle.value) {
            await vehicleStore.addVehicle(vehicle);
            text.value = vehicleStore.text
        } else {
            await vehicleStore.updateVehicle(vehicle);
            text.value = vehicleStore.text
        }
        dialog.value = false;
        clearForm();
        await fetchVehicles();
        snackbar.value = true;
    } catch (error) {
        console.error('Error saving vehicle:', error);
    } finally {
        process.value = false;
    }
};

// Deleting a vehicle
const deleteVehicleId = ref();
const deleteVehicle = (item) => {
    deleteVehicleId.value = item._id;
    dialogDelete.value = true;
};
const deleteVehicleConfirm = async () => {
    process.value = true;
    if (deleteVehicleId.value) {
        await vehicleStore.deleteVehicle(deleteVehicleId.value);
        text.value = vehicleStore.text;
        await fetchVehicles();
        snackbar.value = true;
    }
    deleteVehicleId.value = null;
    dialogDelete.value = false;
    process.value = false;
};

// Updating the vehicle
const editItem = (item) => {
    isNewVehicle.value = false;
    const foundVehicle = vehicles.value.find((v) => v._id === item._id);
    if (foundVehicle) {
        Object.assign(vehicle, foundVehicle);
        selectedCategory.value = foundVehicle.category;
        dialog.value = true;
    } else {
        console.error('Vehicle not found');
    }
};

// Form Clear
const clearForm = () => {
    isNewVehicle.value = true;
    for (let key in vehicle) {
        vehicle[key] = '';
    }
};

// Pagination
const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => Math.ceil(vehicles.value.length / itemsPerPage.value));

// Form Validation
const isSaveDisabled = computed(() => {
    return vehicle.title.trim() === '';
});

// Watch for changes in the title field
watchEffect(() => {
    isSaveDisabled.value = vehicle.title.trim() === '';
});

</script>