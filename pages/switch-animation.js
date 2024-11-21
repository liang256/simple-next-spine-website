import React, { useState } from "react";
import SpineCharacter from "./components/SpineCharacter";
import AnimationSelector from "./components/AnimationSelector";

export default function Home() {
  const [currentAnimation, setCurrentAnimation] = useState("run");

  return (
    <div>
      <AnimationSelector onAnimationChange={setCurrentAnimation} />
      <SpineCharacter currentAnimation={currentAnimation} />
    </div>
  );
}
