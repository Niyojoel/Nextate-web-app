import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://nextate-api.onrender.com",
  withCredentials: true,
});

export default apiRequest;
