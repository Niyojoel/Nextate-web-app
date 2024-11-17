import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://nextate-api.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
