import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.API_ENDPOINT_BASE_URL,
  withCredentials: true,
});

export default apiRequest;
