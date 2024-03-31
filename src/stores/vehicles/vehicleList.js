// vehicleList.js

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
        this.vehicles = response.data.vehicles;
      } catch (e) {
        console.log(e);
      }
    },
    async addVehicle(newVehicle) {
      try {
        const response = await axios.post(`${baseUrl}/vehicle/add`, newVehicle);
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
    async deleteVehicle(id) {
      try {
        const response = await axios.delete(`${baseUrl}/vehicle/delete/${id}`);
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
        this.text = response.data.message;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
