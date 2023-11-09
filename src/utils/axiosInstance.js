import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    Authorization: "Token " + localStorage.getItem("token"), // Include the API token from localStorage in the 'Authorization' header
  },
});

export default axiosInstance;
