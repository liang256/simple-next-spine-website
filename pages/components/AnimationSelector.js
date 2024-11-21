import React from "react";

const AnimationSelector = ({ onAnimationChange }) => {
  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
      <select onChange={(e) => onAnimationChange(e.target.value)}>
        <option value="run">Run</option>
        <option value="jump">Jump</option>
        <option value="idle">Idle</option>
        <option value="death">Death</option>
        <option value="hit">Hit</option>
      </select>
    </div>
  );
};

export default AnimationSelector;
