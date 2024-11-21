import React, { useState } from "react";
import SpineCharacter from "./components/SpineCharacter";

export default function Home() {
  const [currentAnimation, setCurrentAnimation] = useState("run");
  const [speed, setSpeed] = useState(1);

  return (
    <div className="text-black bg-white">
      <p>Choose an animation:</p>
      <select onChange={(e) => setCurrentAnimation(e.target.value)}>
          <option value="run">Run</option>
          <option value="jump">Jump</option>
          <option value="idle">Idle</option>
          <option value="death">Death</option>
          <option value="hit">Hit</option>
      </select>
      <p>Speed:</p>
      <input type="number" min="0.1" max="2" step="0.1" value={speed} onChange={(e) => setSpeed(e.target.value)} />
      <SpineCharacter currentAnimation={currentAnimation} animationSpeed={speed}/>
    </div>
  );
}
