import { useEffect, useRef } from "react";

export default function SpineCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let lastFrameTime = Date.now() / 1000;
    let context, skeletonRenderer, skeleton, animationState, bounds, assetManager;

    const load = async () => {
      const canvas = canvasRef.current;
      context = canvas.getContext("2d");

      skeletonRenderer = new window.spine.SkeletonRenderer(context);
      skeletonRenderer.triangleRendering = true;

      // Load assets
      assetManager = new window.spine.AssetManager("/spine-assets/");
      assetManager.loadBinary("spineboy-pro.skel");
      assetManager.loadTextureAtlas("spineboy.atlas");
      await assetManager.loadAll();

      // Set up skeleton
      const atlas = assetManager.require("spineboy.atlas");
      const atlasLoader = new window.spine.AtlasAttachmentLoader(atlas);
      const skeletonBinary = new window.spine.SkeletonBinary(atlasLoader);
      const skeletonData = skeletonBinary.readSkeletonData(assetManager.require("spineboy-pro.skel"));

      skeleton = new window.spine.Skeleton(skeletonData);
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform(window.spine.Physics.update);
      bounds = skeleton.getBoundsRect();

      const animationStateData = new window.spine.AnimationStateData(skeleton.data);
      animationStateData.defaultMix = 0.2;
      animationState = new window.spine.AnimationState(animationStateData);

      // Set animation
      animationState.setAnimation(0, "run", true);

      // Start rendering
      requestAnimationFrame(render);
    };

    const render = () => {
      const canvas = canvasRef.current;
      const now = Date.now() / 1000;
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      // Resize canvas
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Center skeleton
      skeleton.x = canvas.width / 2;
      skeleton.y = canvas.height - canvas.height * 0.1;
      const scale = (canvas.height / bounds.height) * 0.8;
      skeleton.scaleX = scale;
      skeleton.scaleY = -scale;

      animationState.update(delta);
      animationState.apply(skeleton);
      skeleton.updateWorldTransform(window.spine.Physics.update);
      skeletonRenderer.draw(skeleton);

      requestAnimationFrame(render);
    };

    // Load spine-canvas.js dynamically if not bundled
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "/libs/spine-canvas.js"; // Update this if hosted elsewhere
      script.onload = load;
      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      window.cancelAnimationFrame(render);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#333", margin: 0, padding: 0 }}
    />
  );
}
