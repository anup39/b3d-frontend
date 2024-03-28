import axios from "axios";

const fetchProjectsByClientId = async (client_id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/projects/?client=${client_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const fetchClientDetailsByClientId = async (client_id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/clients/${client_id}/`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

export { fetchProjectsByClientId, fetchClientDetailsByClientId };
