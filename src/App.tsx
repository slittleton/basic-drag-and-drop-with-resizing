import React from "react";
import DropAreaRnd from "./components/rnd/DropAreaRnd";
import DropAreaDnd from "./components/dnd/DropAreaDnd";
;

function App() {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Drag the card into the area below</h2>
      <DropAreaDnd />
    </div>
  );
}

export default App;