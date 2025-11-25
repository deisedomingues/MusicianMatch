import axios from "axios";

const api = axios.create({
  //baseURL: "http://192.168.0.15:3000",
  baseURL: "http://localhost:3000", // IP da sua máquina
});

export default api;
