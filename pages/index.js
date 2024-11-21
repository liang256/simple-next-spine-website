import dynamic from "next/dynamic";

// Disable SSR for SpineCanvas component
const SpineCanvas = dynamic(() => import("./components/SpineCanvas"), { ssr: false });

export default function SpineExample() {
  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white" }}>Spine Canvas Example</h1>
      <SpineCanvas />
    </div>
  );
}
