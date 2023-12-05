import React from "react";

interface PopupProps {
  properties: {
    [key: string]: string | number;
    id: number;
    mill_name: string;
    mill_eq_id: string;
    mill_long: string;
    mill_lat: string;
  };
  trace: boolean;
}

const Popup = ({ properties, trace }: PopupProps) => {
  const propertyElements = properties
    ? Object.entries(properties).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))
    : null;

  return (
    <>
      {properties ? (
        <div className="maplibregl-ctrl-layer-control">
          <div>{propertyElements}</div>
        </div>
      ) : null}
    </>
  );
};

export default Popup;
