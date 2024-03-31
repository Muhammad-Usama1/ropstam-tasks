import { defineStore } from "pinia";
import axios from "axios";
import { baseUrl } from "@/baseUrl";
import Cookies from "js-cookie"; // Assuming you have a function to get cookies

export const useCategories = defineStore({
  id: "category",
  state: () => ({
    categories: [],
    text: "",
  }),
  actions: {
    async fetchCategory() {
      try {
        const token = Cookies.get("token"); // Retrieve token from cookies
        const response = await axios.get(`${baseUrl}/category/get`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set token in request headers
          },
        });
        console.log("all categories", response.data);
        console.log("Token is", token);
        this.categories = response.data.categories;
      } catch (e) {
        console.log(e);
      }
    },
    async addCategory(newCategory) {
      try {
        const token = Cookies.get("token"); // Retrieve token from cookies
        const response = await axios.post(
          `${baseUrl}/category/add`,
          newCategory,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set token in request headers
            },
          }
        );
        console.log("category added :", response.data);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteCategory(id) {
      try {
        const token = Cookies.get("token"); // Retrieve token from cookies
        const response = await axios.delete(
          `${baseUrl}/category/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set token in request headers
            },
          }
        );
        console.log("Deleted", response.data);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async updateCategory(updatedVehicle) {
      try {
        const response = await axios.put(
          `${baseUrl}/category/update/${updatedVehicle._id}`,
          updatedVehicle
        );
        console.log("Updated", response.data);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
