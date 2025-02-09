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

const fetchProjectsByClientIdAndIds = async (client_id, ids) => {
  const result = ids.join(",");
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/projects/?client=${client_id}&id=${result}`,
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
  return await response.data;
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

const deletePropertyPolygonByPolygonId = async (polygon_id) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/project-polygon/${polygon_id}/`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const fetchGeojsonByCategoryId = async ({
  type_of_geometry,
  client_id,
  project_id,
  category_id,
}) => {
  if (type_of_geometry === "Polygon") {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/category-polygon-geojson/?client=${client_id}&project=${
        project_id === "All" ? "" : project_id
      }&category=${category_id}`,
      {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  }
  if (type_of_geometry === "LineString") {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/category-linestring-geojson/?client=${client_id}&project=${
        project_id === "All" ? "" : project_id
      }&category=${category_id}`,
      {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  }
  if (type_of_geometry === "Point") {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_DASHBOARD_URL
      }/category-point-geojson/?client=${client_id}&project=${
        project_id === "All" ? "" : project_id
      }&category=${category_id}`,
      {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  }
};

const fetchMeasuringTableSummation = async ({ client_id, project_id }) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/measuring-table-summation/?client=${client_id}&project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
};

const fetchMeasuringPieSummation = async ({ client_id, project_id }) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/measuring-table-pie-summation/?client=${client_id}&project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
};

const fetchMeasuringsUploadStatus = async ({ client_id, project_id }) => {
  console.log(client_id, project_id);
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/measuring-file-upload/?client=${client_id}&project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
};

const fetchRoleByUserId = async (user_id) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_API_DASHBOARD_URL
    }/roles-for-projects/?user=${user_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const updateRoleById = async ({ id, data }) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/roles/${id}/`,
    data,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const updateProjectById = async (project_id, data) => {
  const response = await axios.patch(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/projects/${project_id}/`,
    data,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const createIndoorByProjectId = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/indoor/`,
    data,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const fetchIndoorsByProjectId = async (project_id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/indoor/?project=${project_id}`,
    {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

const deleteIndoorById = async (indoor_id) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_DASHBOARD_URL}/indoor/${indoor_id}/`,
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
  fetchProjectsByClientIdAndIds,
  fetchClientDetailsByClientId,
  fetchTifDataByProjectId,
  fetchProjectPolygonGeojsonByClientIdAndProjectId,
  fetchMeasuringCategories,
  fetchBoundingBoxByTifId,
  fetchTifDataByClientId,
  deletePropertyPolygonByPolygonId,
  fetchGeojsonByCategoryId,
  fetchMeasuringTableSummation,
  fetchMeasuringPieSummation,
  fetchMeasuringsUploadStatus,
  fetchRoleByUserId,
  updateRoleById,
  updateProjectById,
  createIndoorByProjectId,
  fetchIndoorsByProjectId,
  deleteIndoorById,
};
