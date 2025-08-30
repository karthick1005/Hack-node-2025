import axios from "axios";

const api = axios.create({
  baseURL: "/api", // auto-prefixed for internal API calls
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
