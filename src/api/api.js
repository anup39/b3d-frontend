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

const fetchTifDataByProjectId = async (project_id) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/raster-data/?project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const fetchProjectPolygonGeojsonByClientIdAndProjectId = async ({
  client_id,
  project_id,
}) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/project-polygon/?client=${client_id}&project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const fetchMeasuringCategories = async (client_id) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/map-measurings/?client=${client_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
};

const fetchBoundingBoxByTifId = async (tif_id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_RASTER_URL}/bounds/${tif_id}`
  );

  return response.data.bounds;
};

const fetchTifDataByClientId = async (client_id) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/raster-data/?client=${client_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

export {
  fetchProjectsByClientId,
  fetchClientDetailsByClientId,
  fetchTifDataByProjectId,
  fetchProjectPolygonGeojsonByClientIdAndProjectId,
  fetchMeasuringCategories,
  fetchBoundingBoxByTifId,
  fetchTifDataByClientId,
};
