import { defineStore } from "pinia";
import { api } from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("access_token") || "",
    refreshToken: localStorage.getItem("refresh_token") || "",
  }),

  actions: {
    async login(email: string, password: string) {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await api.post("/users/token", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      this.accessToken = res.data.access_token;
      this.refreshToken = res.data.refresh_token;

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("refresh_token", this.refreshToken);
    },

    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});