import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.BASE_URL,
  // baseURL: "http://localhost:5500/api",
  withCredentials: true,
});

export default apiRequest;
