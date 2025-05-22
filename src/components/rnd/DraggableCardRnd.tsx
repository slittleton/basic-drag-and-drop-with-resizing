import React from "react";
import { Rnd } from "react-rnd";
import type { RndDragCallback } from "react-rnd";

interface DraggableCardProps {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  onDrag?: RndDragCallback;
}

const DraggableCardDnd: React.FC<DraggableCardProps> = ({
  position,
  setPosition,
  onDrag,
}) => {
  return (
    <Rnd
      position={position}
      onDrag={onDrag}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      bounds="parent"
      style={{
        width: 200,
        height: 100,
        backgroundColor: "green",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
                border: "10px solid red",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        cursor: "move",
        
      }}
    >
      Drag Me!
    </Rnd>
  );
};

export default DraggableCardDnd;