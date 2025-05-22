import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/core";
import DraggableCardDnd from "./DraggableCardDnd";

const SNAP_DISTANCE = 10;
const SNAP_GAP = 7;
const CORNER_SNAP_DISTANCE = 10;
const DROPAREA_WIDTH = 800;
const DROPAREA_HEIGHT = 800;
const MIN_WIDTH = 40;
const MIN_HEIGHT = 40;

const initialPositions = [
  { id: "card-1", x: 0, y: 0, width: 200, height: 100 },
  { id: "card-2", x: 100, y: 100, width: 200, height: 100 },
  { id: "card-3", x: 200, y: 200, width: 200, height: 100 },
];

const DropAreaDnd: React.FC = () => {
  const [cardPositions, setCardPositions] = useState(initialPositions);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Snap logic on drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const idx = cardPositions.findIndex((c) => c.id === active.id);
    if (idx === -1) return;

    let newPos = {
      ...cardPositions[idx],
      x: cardPositions[idx].x + delta.x,
      y: cardPositions[idx].y + delta.y,
    };

    // Snap to other cards
    cardPositions.forEach((other, i) => {
      if (i === idx) return;

      // Snap left edge of dragged to right edge of other
      if (
        Math.abs(newPos.x - (other.x + other.width + SNAP_GAP)) < SNAP_DISTANCE &&
        newPos.y + newPos.height > other.y &&
        newPos.y < other.y + other.height
      ) {
        newPos.x = other.x + other.width + SNAP_GAP;
        // Snap y only if close to top/bottom
        if (Math.abs(newPos.y - other.y) < CORNER_SNAP_DISTANCE) {
          newPos.y = other.y;
        } else if (
          Math.abs(newPos.y + newPos.height - (other.y + other.height)) <
          CORNER_SNAP_DISTANCE
        ) {
          newPos.y = other.y + other.height - newPos.height;
        }
      }

      // Snap right edge of dragged to left edge of other
      else if (
        Math.abs(newPos.x + newPos.width + SNAP_GAP - other.x) < SNAP_DISTANCE &&
        newPos.y + newPos.height > other.y &&
        newPos.y < other.y + other.height
      ) {
        newPos.x = other.x - newPos.width - SNAP_GAP;
        // Snap y only if close to top/bottom
        if (Math.abs(newPos.y - other.y) < CORNER_SNAP_DISTANCE) {
          newPos.y = other.y;
        } else if (
          Math.abs(newPos.y + newPos.height - (other.y + other.height)) <
          CORNER_SNAP_DISTANCE
        ) {
          newPos.y = other.y + other.height - newPos.height;
        }
      }

      // Snap top edge of dragged to bottom edge of other
      if (
        Math.abs(newPos.y - (other.y + other.height + SNAP_GAP)) < SNAP_DISTANCE &&
        newPos.x + newPos.width > other.x &&
        newPos.x < other.x + other.width
      ) {
        newPos.y = other.y + other.height + SNAP_GAP;
        // Snap x only if close to left/right
        if (Math.abs(newPos.x - other.x) < CORNER_SNAP_DISTANCE) {
          newPos.x = other.x;
        } else if (
          Math.abs(newPos.x + newPos.width - (other.x + other.width)) <
          CORNER_SNAP_DISTANCE
        ) {
          newPos.x = other.x + other.width - newPos.width;
        }
      }

      // Snap bottom edge of dragged to top edge of other
      else if (
        Math.abs(newPos.y + newPos.height + SNAP_GAP - other.y) < SNAP_DISTANCE &&
        newPos.x + newPos.width > other.x &&
        newPos.x < other.x + other.width
      ) {
        newPos.y = other.y - newPos.height - SNAP_GAP;
        // Snap x only if close to left/right
        if (Math.abs(newPos.x - other.x) < CORNER_SNAP_DISTANCE) {
          newPos.x = other.x;
        } else if (
          Math.abs(newPos.x + newPos.width - (other.x + other.width)) <
          CORNER_SNAP_DISTANCE
        ) {
          newPos.x = other.x + other.width - newPos.width;
        }
      }
    });

    // Clamp position so card stays inside the drop area
    // --- clamp to drop area ---
    newPos.x = Math.max(0, Math.min(newPos.x, DROPAREA_WIDTH - newPos.width));
    newPos.y = Math.max(0, Math.min(newPos.y, DROPAREA_HEIGHT - newPos.height));

    setCardPositions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, x: newPos.x, y: newPos.y } : c))
    );
    setActiveId(null);
  };

  // Handle resize for a card
  const handleResize = (id: string, width: number, height: number) => {
    setCardPositions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Clamp width/height so card stays inside the area
        const maxWidth = DROPAREA_WIDTH - c.x;
        const maxHeight = DROPAREA_HEIGHT - c.y;
        return {
          ...c,
          width: Math.max(MIN_WIDTH, Math.min(width, maxWidth)),
          height: Math.max(MIN_HEIGHT, Math.min(height, maxHeight)),
        };
      })
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          width: 800,
          height: 800,
          border: "2px dashed #aaa",
          borderRadius: 12,
          position: "relative",
          padding: "40px auto",
          background: "#f9f9f9",
        }}
      >
        {cardPositions.map((card) => (
          <DraggableCardDnd
            key={card.id}
            id={card.id}
            x={card.x}
            y={card.y}
            width={card.width}
            height={card.height}
            isDragging={activeId === card.id}
            onResize={(w, h) => handleResize(card.id, w, h)}
          >
            Drag Me!
          </DraggableCardDnd>
        ))}
      </div>
      <DragOverlay>
        {activeId && (() => {
          const card = cardPositions.find(c => c.id === activeId);
          if (!card) return null;
          return (
            <div
              style={{
                width: card.width,
                height: card.height,
                background: "green",
                color: "#fff",
                border: "2px solid red",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              Drag Me!
            </div>
          );
        })()}
      </DragOverlay>
    </DndContext>
  );
};

export default DropAreaDnd;