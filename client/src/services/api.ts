import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3310/api",
  withCredentials: true,
});

export default api;
