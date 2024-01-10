import { useSelector } from "react-redux";
import { Button } from "@mui/material";

interface PopupProps {
  properties: {
    [key: string]: string | number;
    id: number;
    mill_name: string;
    mill_eq_id: string;
    mill_long: string;
    mill_lat: string;
  };
  feature_id: number;
}

const Popup = ({ properties, feature_id }: PopupProps) => {
  const state = useSelector((state) => state.drawnPolygon);
  const propertyElements = properties
    ? Object.entries(properties).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))
    : null;

  const handleDeleteCategory = (properties, feature_id) => {
    console.log(properties, feature_id);
  };
  const handleEditCategory = (properties, feature_id) => {
    console.log(properties, feature_id);
  };
  return (
    <>
      {properties ? (
        <div>
          <div>{propertyElements}</div>
          <div style={{ display: "flex", gap: 15 }}>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleDeleteCategory(properties, feature_id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",

                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleEditCategory(properties, feature_id)}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Popup;
