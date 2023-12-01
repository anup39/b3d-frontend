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
        <div key={key} className="mb-2 truncate">
          <strong className="mr-1">{key}:</strong> {value}
        </div>
      ))
    : null;

  return (
    <>
      {properties ? (
        <div className="bg-white rounded shadow-md p-2 max-w-sm  md:max-w-md max-h-48 overflow-auto">
          <div className="divide-y divide-gray-200 mt-3">
            {propertyElements}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Popup;
