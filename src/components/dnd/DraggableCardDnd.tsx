import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableCardDndProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  onResize: (width: number, height: number) => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 80;
const MIN_HEIGHT = 40;

const DraggableCardDnd: React.FC<DraggableCardDndProps> = ({
  id,
  x,
  y,
  width,
  height,
  isDragging,
  onResize,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // Handle resize
  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth + moveEvent.clientX - startX);
      const newHeight = Math.max(MIN_HEIGHT, startHeight + moveEvent.clientY - startY);
      onResize(newWidth, newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: transform ? x + transform.x : x,
    top: transform ? y + transform.y : y,
    width,
    height,
    background: "purple",
    color: "#fff",
    border: "2px solid red",
    borderRadius: 8,
    boxShadow: isDragging
      ? "0 4px 16px rgba(0,0,0,0.2)"
      : "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "move",
    zIndex: isDragging ? 2 : 1,
    userSelect: "none",
    overflow: "visible",
  };

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    background: "#fff",
    border: "2px solid #888",
    borderRadius: "0 0 8px 0",
    cursor: "nwse-resize",
    zIndex: 10,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag area: covers the whole card except the resize handle */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 2, // Make sure this is above the content
        }}
        {...attributes}
        {...listeners}
      />
      {/* Card content */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1, // Below the drag area
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      {/* Resize handle (not draggable) */}
      <div
        style={handleStyle}
        onMouseDown={handleResize}
      />
    </div>
  );
};

export default DraggableCardDnd;