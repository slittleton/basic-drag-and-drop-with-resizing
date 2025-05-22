import React, { useState } from "react";
import DraggableCard from "./DraggableCardRnd";

const CARD_WIDTH = 200;
const CARD_HEIGHT = 100;
const SNAP_DISTANCE = 5;
const SNAP_GAP = 10;

const DropAreaRnd: React.FC = () => {
  const [cardPositions, setCardPositions] = useState([
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ]);

  // Snap logic for dragging
  const handleDrag = (index: number, e: any, d: any) => {
    setCardPositions((prev) => {
      let newPos = { x: d.x, y: d.y };

      prev.forEach((otherPos, i) => {
        if (i === index) return;

        // Snap right edge of other to left edge of this
        if (
          Math.abs(otherPos.x + CARD_WIDTH + SNAP_GAP - newPos.x) < SNAP_DISTANCE &&
          Math.abs(otherPos.y - newPos.y) < CARD_HEIGHT
        ) {
          newPos.x = otherPos.x + CARD_WIDTH + SNAP_GAP;
          newPos.y = otherPos.y;
        }
        // Snap left edge of other to right edge of this
        else if (
          Math.abs(otherPos.x - (newPos.x + CARD_WIDTH + SNAP_GAP)) < SNAP_DISTANCE &&
          Math.abs(otherPos.y - newPos.y) < CARD_HEIGHT
        ) {
          newPos.x = otherPos.x - CARD_WIDTH - SNAP_GAP;
          newPos.y = otherPos.y;
        }
        // Snap bottom edge of other to top edge of this
        else if (
          Math.abs(otherPos.y + CARD_HEIGHT + SNAP_GAP - newPos.y) < SNAP_DISTANCE &&
          Math.abs(otherPos.x - newPos.x) < CARD_WIDTH
        ) {
          newPos.y = otherPos.y + CARD_HEIGHT + SNAP_GAP;
          newPos.x = otherPos.x;
        }
        // Snap top edge of other to bottom edge of this
        else if (
          Math.abs(otherPos.y - (newPos.y + CARD_HEIGHT + SNAP_GAP)) < SNAP_DISTANCE &&
          Math.abs(otherPos.x - newPos.x) < CARD_WIDTH
        ) {
          newPos.y = otherPos.y - CARD_HEIGHT - SNAP_GAP;
          newPos.x = otherPos.x;
        }
      });

      return prev.map((p, i) => (i === index ? newPos : p));
    });
  };

  // Keep setCardPosition for drag stop (final correction)
  const setCardPosition = (index: number, pos: { x: number; y: number }) => {
    setCardPositions((prev) => prev.map((p, i) => (i === index ? pos : p)));
  };

  return (
    <div
      style={{
        width: 800,
        height: 800,

        borderRadius: 12,
        position: "relative",
        margin: "40px auto",
        background: "#f9f9f9",
      }}
    >
      {cardPositions.map((position, idx) => (
        <DraggableCard
          key={idx}
          position={position}
          setPosition={(pos) => setCardPosition(idx, pos)}
          onDrag={(e, d) => handleDrag(idx, e, d)}
        />
      ))}
    </div>
  );
};

export default DropAreaRnd;