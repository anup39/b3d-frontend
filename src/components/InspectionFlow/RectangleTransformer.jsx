import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

const RectTransformer = ({ editModeGeom, selectedShapeName = "" }) => {
  const transRef = useRef();

  useEffect(() => {
    const checkNode = () => {
      const stage = transRef.current.getStage();
      const selectedNode = stage.findOne(`.${selectedShapeName}`);
      if (selectedNode === transRef.current.node()) {
        return;
      }

      if (selectedNode) {
        transRef.current.attachTo(selectedNode);
      } else {
        transRef.current.detach();
      }
    };
    if (editModeGeom) {
      checkNode();
    }
  }, [editModeGeom, selectedShapeName]);

  return <Transformer ref={transRef} rotateEnabled={false} ignoreStroke />;
};

export default RectTransformer;
