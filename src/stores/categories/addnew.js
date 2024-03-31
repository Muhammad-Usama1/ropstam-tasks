import { defineStore } from "pinia";
import axios from "axios";
import { baseUrl } from "@/baseUrl";
import Cookies from "js-cookie";

export const useCategories = defineStore({
  id: "category",
  state: () => ({
    categories: [],
    text: "",
    token: null, 
  }),
  actions: {
    getToken() {
      if (!this.token) {
        this.token = Cookies.get("token"); 
      }
      return this.token;
    },
    async fetchCategory() {
      try {
        const token = this.getToken(); 
        const response = await axios.get(`${baseUrl}/category/get`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        this.categories = response.data.categories;
      } catch (e) {
        console.log(e);
      }
    },
    async addCategory(newCategory) {
      try {
        const token = this.getToken(); 
        const response = await axios.post(
          `${baseUrl}/category/add`,
          newCategory,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteCategory(id) {
      try {
        const token = this.getToken(); 
        const response = await axios.delete(
          `${baseUrl}/category/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async updateCategory(updatedVehicle) {
      try {
        const token = this.getToken();
        const response = await axios.put(
          `${baseUrl}/category/update/${updatedVehicle._id}`,
          updatedVehicle,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
