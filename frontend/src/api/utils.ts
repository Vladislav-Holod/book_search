import { ref } from "vue";

export const useApi = () => {
  const isLoading = ref(false);
  const error = ref("");

  const handleError = (err: any) => {
    if (err.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("access_token");
      window.location.href = "/auth";
    }
    error.value = err.response?.data?.detail || err.message || "An error occurred";
  };

  return {
    isLoading,
    error,
    handleError,
  };
};
