<template>
    <div class="v-container">
        <div class="loader" v-if="loading">
            <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-card title="Search Category" v-else>
            <template v-slot:text>
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </template>
            <v-data-table :search="search" :headers="headers" :items="categories"
                :sort-by="[{ key: 'title', order: 'asc' }]" v-model:page="page" :items-per-page="itemsPerPage"
                v-model="page">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Categories</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ props }">
                                <v-btn variant="outlined" class="mb-2" dark v-bind="props">
                                    Add New Category
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="12" sm="6">
                                                <v-text-field v-model="category.title" label="Title"
                                                    variant="outlined"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="outlined" @click="dialog = false">Cancel</v-btn>
                                    <v-btn :loading="process" variant="outlined" :disabled="isSaveDisabled"
                                        @click="saveCategory">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card class="py-10">
                                <v-card-title class="text-h6 mb-5">Are you sure you want to delete this item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="outlined" @click="dialogDelete = false">Cancel</v-btn>
                                    <v-btn variant="outlined" :loading="process"
                                        @click="deleteCategoryConfirm">OK</v-btn>
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
    <v-snackbar v-model="snackbar" :timeout="timeout" location="top" >
        {{ text }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import moment from 'moment';

import { useCategories } from '@/stores/categories/addnew'
const categoryStore = useCategories();

// general
const loading = ref(true)
const process = ref(false)
const search = ref('');
const dialog = ref(false);
const dialogDelete = ref(false);
const snackbar = ref(false)
const text = ref('')
// Table header
const headers = [
    {
        title: 'Name',
        align: 'start',
        key: 'title',
    },
    { title: 'createdAt', key: 'formattedCreatedAt' },
    { title: 'Actions', key: 'actions', sortable: false },
];
// Data format
const formatCreatedAt = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Customize the format as needed
};

// Getting categories from pinia
const categories = ref([])
const fetchCategories = async () => {
    await categoryStore.fetchCategory();
    categories.value = categoryStore.categories.map(category => ({
        ...category,
        formattedCreatedAt: formatCreatedAt(category.createdAt)
    })).reverse(); // Reverse the array to show newly added data on top
    loading.value = false;
};
onMounted(fetchCategories);


// Add new Category
const category = reactive({
    title: '',
});
const isNewcategory = ref(true);
const saveCategory = async () => {
    process.value = true
    if (isNewcategory.value) {
        await categoryStore.addCategory(category);
        text.value = categoryStore.text
    } else {
        await categoryStore.updateCategory(category);
        text.value = categoryStore.text
    }
    process.value = false
    snackbar.value = true
    dialog.value = false;
    clearForm();
    await fetchCategories(); // Update table data after saving category
};


// Delete Category
const deleteCategoryId = ref()
const deleteVehicle = (item) => {
    deleteCategoryId.value = item._id
    dialogDelete.value = true
}
const deleteCategoryConfirm = async () => {
    process.value = true
    if (deleteCategoryId.value) {
        await categoryStore.deleteCategory(deleteCategoryId.value);
        text.value = categoryStore.text
        await fetchCategories(); // Update table data after deleting category
        deleteCategoryId.value = null;
        process.value = false
        snackbar.value = true
    }
    dialogDelete.value = false;
};


// Update Category
const updateCategoryId = ref()
const editItem = (item) => {
    isNewcategory.value = false;
    updateCategoryId.value = item._id;
    const foundCategory = categories.value.find(v => v._id === item._id);
    if (foundCategory) {
        Object.assign(category, foundCategory);
        dialog.value = true;
    } else {
        console.error("Category not found");
    }
};

const clearForm = () => {
    isNewcategory.value = true;
    category._id = null;
    category.title = '';
};

// Pagination
const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => Math.ceil(categories.value.length / itemsPerPage.value));

// Computed property to check if Save button should be disabled
const isSaveDisabled = computed(() => {
    return category.title.trim() === '';
});

// Watch for changes in category title to enable/disable Save button accordingly
watch(() => category.title, () => {
    // Validate if the title is empty and enable/disable the Save button accordingly
    if (category.title.trim() === '') {
        // Title is empty, disable Save button
        isSaveDisabled.value = true;
    } else {
        // Title is not empty, enable Save button
        isSaveDisabled.value = false;
    }
});
</script>