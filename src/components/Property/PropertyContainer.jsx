import { useEffect } from "react";
import PropTypes from "prop-types";
import { setproperties } from "../../reducers/Property";
import { useDispatch, useSelector } from "react-redux";
import PropertyCard from "./PropertyCard";
import { useGetRasterDataByProjectIdQuery } from "../../api/rasterDataApi";
import axios from "axios";

export default function PropertyContainer({ project_id }) {
  const dispatch = useDispatch();
  // const properties = useSelector((state) => state.property.properties);
  const { data: properties, refetch: refetchProperties } =
    useGetRasterDataByProjectIdQuery(
      { project: project_id },
      { pollingInterval: 10000 }
    );

  // useEffect(() => {
  //   refetchProperties()
  //     .then((res) => {
  //       dispatch(setproperties(res?.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [refetchProperties, dispatch, project_id]);

  // useEffect(() => {
  //   const fetchData = () => {
  //     axios
  //       .get(
  //         `${
  //           import.meta.env.VITE_API_DASHBOARD_URL
  //         }/raster-data/?project=${project_id}`
  //       )
  //       .then((res) => {
  //         dispatch(setproperties(res.data));
  //       });
  //   };
  //   fetchData();
  //   const interval = setInterval(fetchData, 10000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [project_id, dispatch]);

  // #Remaning things to work on

  // const handleOpenMap = () => {
  //   navigate(`/map/${project_id}`);
  // };

  return (
    <div>
      {properties
        ? properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              name={property.name}
              status={property.status}
              file_size={property.file_size}
              progress={property.progress}
              created_at={property.created_at}
              task_id={property.task_id}
              file_name={property.file_name}
              projection={property.projection}
              thumbnail={property.screenshot_image}
              client_name={property.client_name}
              project_name={property.project_name}
            />
          ))
        : null}
    </div>
  );
}

PropertyContainer.propTypes = {
  project_id: PropTypes.string,
};
