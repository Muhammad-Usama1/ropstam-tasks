<template>
    <div class="v-container">
        <div class="pa-4 text-center">
            <v-dialog v-model="dialog" max-width="600">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Add New Category"
                        variant="outlined" v-bind="activatorProps"></v-btn>
                </template>
                <v-card class="px-4" prepend-icon="mdi-account" title="User Profile">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field label="First name*" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-text-field hint="example of helper text only on focus"
                                    label="Middle name"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-text-field hint="example of persistent helper text" label="Last name*"
                                    persistent-hint required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-text-field label="Email*" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-text-field label="Password*" type="password" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" sm="6">
                                <v-text-field label="Confirm Password*" type="password" required></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-autocomplete
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="Interests" auto-select-first multiple></v-autocomplete>
                            </v-col>
                        </v-row>

                        <small class="text-caption text-medium-emphasis">*indicates required field</small>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Close" variant="outlined" @click="dialog = false"></v-btn>

                        <v-btn color="primary" text="Save" variant="outlined" @click="dialog = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>



        <v-card >
            <v-divider></v-divider>
            <v-card title="Nutrition">
                <template v-slot:text>
                    <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line></v-text-field>
                </template>

                <v-data-table :headers="headers" :items="desserts" :search="search" v-model:page="page"
                    :items-per-page="itemsPerPage" v-model="page">
                    <template v-slot:bottom>
                        <div class="text-center pt-2">
                            <v-pagination v-model="page" :length="pageCount"></v-pagination>
                        </div>
                    </template>

                </v-data-table>
            </v-card>
        </v-card>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const search = ref('')
const dialog = ref(false)

const headers = ref(
    [
        {
            align: 'start',
            key: 'name',
            sortable: false,
            title: 'Dessert (100g serving)',
        },
        { title: 'Calories', key: 'calories' },
        { title: 'Fat (g)', key: 'fat' },
        { title: 'Carbs (g)', key: 'carbs' },
        { title: 'Protein (g)', key: 'protein' },
        { title: 'Iron (%)', key: 'iron' },
    ],
)
const desserts = ref([
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: 1,
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: 1,
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: 7,
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: 8,
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: 16,
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: 0,
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: 2,
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: 45,
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: 22,
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: 6,
    },
],
)


// Pagination
const page = ref(1)
const itemsPerPage = ref(5)
const pageCount = Math.ceil(desserts.value.length / itemsPerPage.value);

</script>