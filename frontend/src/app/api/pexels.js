// frontend/api/pexels.js
import axios from "axios";

const pexelsApi = axios.create({
  baseURL: "https://api.pexels.com/v1",
  headers: {
    Authorization: "3jfydhlEs0SRxIHF4ALxd6UEHtxkPksKnbABoRv32uJzgPaR3xb6vfLh", // sua chave Pexels
  },
});

export default pexelsApi;
