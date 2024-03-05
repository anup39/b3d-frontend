import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Rect } from "react-konva";

const Rectangle = (props) => {
  const rectRef = useRef();

  useLayoutEffect(() => {
    rectRef.current.getLayer().batchDraw();
  });

  const _onChange = (event) => {
    const shape = event.target;

    props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation(),
    });
  };

  const _onMouseEnter = (event) => {
    const shape = event.target;
    shape.stroke("#3DF6FF");
    shape.getStage().container().style.cursor = "move";
    rectRef.current.getLayer().draw();
  };

  const _onMouseLeave = (event) => {
    const shape = event.target;
    shape.stroke(props.stroke_color);
    if (props.mouseState) {
      shape.getStage().container().style.cursor = "pointer";
    } else {
      shape.getStage().container().style.cursor = "crosshair";
    }

    rectRef.current.getLayer().draw();
  };

  return (
    <Rect
      _useStrictMode
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      scaleX={1}
      scaleY={1}
      strokeScaleEnabled={false}
      fill={"transparent"}
      stroke={props.stroke_color}
      strokeWidth={props.stroke_width}
      name={props.name}
      onContextMenu={(e) => {
        const { standard_inspection, sub_inspection, inspection, cost, id } =
          props;
        props.onContextMenu(
          e,
          standard_inspection,
          sub_inspection,
          inspection,
          cost,
          id,
          props.created,
          props.x,
          props.y,
          props.height,
          props.width
        );
      }}
      //   onClick={(e) => props.onClick(e)}
      onDragEnd={_onChange}
      onTransformEnd={_onChange}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
      onDragMove={(e) => {
        const stage = e.target.getStage();

        e.target.x(
          Math.max(0, Math.min(e.target.x(), stage.width() - e.target.width()))
        );
        e.target.y(
          Math.max(
            0,
            Math.min(e.target.y(), stage.height() - e.target.height())
          )
        );
      }}
      draggable={props.draggable}
      ref={rectRef}
    />
  );
};

export default Rectangle;
