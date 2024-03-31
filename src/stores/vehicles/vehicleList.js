import { defineStore } from "pinia";
import axios from "axios";
import { baseUrl } from "@/baseUrl";

export const useVehicleList = defineStore({
  id: "vehile",
  state: () => ({
    vehicles: [],
    text: "",
  }),
  actions: {
    async fetchVehicle() {
      try {
        const response = await axios.get(`${baseUrl}/vehicle/get`);
        console.log("all vehicles", response.data);
        this.vehicles = response.data.vehicles;
      } catch (e) {
        console.log(e);
      }
    },
    async addVehicle(newVehicle) {
      try {
        const response = await axios.post(`${baseUrl}/vehicle/add`, newVehicle);
        console.log("vehicle added :", response.data);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteVehicle(id) {
      try {
        const response = await axios.delete(`${baseUrl}/vehicle/delete/${id}`);
        console.log("Deleted", response.data);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async updateVehicle(updatedVehicle) {
      try {
        const response = await axios.put(
          `${baseUrl}/vehicle/update/${updatedVehicle._id}`,
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
