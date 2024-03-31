import { defineStore } from "pinia";
import axios from "axios";
import { baseUrl } from "@/baseUrl";

export const useUserList = defineStore({
  id: "users",
  state: () => ({
    users: [], // Define any other user-related state properties if needed
    registeredVehicles: [],
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${baseUrl}/user/get-users`);
        this.users = response.data.users;
      } catch (e) {
        console.log(e);
      }
    },
    async vehicleRecord() {
      try {
        const response = await axios.get(`${baseUrl}/user/dashboard`);
        this.registeredVehicles = response.data.dashboard;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
