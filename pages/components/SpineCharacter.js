import { useEffect, useRef } from "react";

export default function SpineCharacter({ currentAnimation, animationSpeed = 1 }) {
  const canvasRef = useRef(null);
  const animationStateRef = useRef(null); // Use a ref to hold animationState
  let renderRef = useRef(null); // Ref to hold the render function

  useEffect(() => {
    let lastFrameTime = Date.now() / 1000;
    let canvas, context, skeletonRenderer, assetManager, skeleton, bounds;

    const render = () => {
      const now = Date.now() / 1000;
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);

      skeleton.x = canvas.width / 2;
      skeleton.y = canvas.height - canvas.height * 0.1;
      const scale = (canvas.height / bounds.height) * 0.8;
      skeleton.scaleX = scale;
      skeleton.scaleY = -scale;

      animationStateRef.current.update(delta * animationStateRef.current.timeScale); // Apply timeScale
      animationStateRef.current.apply(skeleton);
      skeleton.updateWorldTransform(window.spine.Physics.update);
      skeletonRenderer.draw(skeleton);

      renderRef.current = requestAnimationFrame(render);
    };

    const load = async () => {
      canvas = canvasRef.current;
      context = canvas.getContext("2d");

      skeletonRenderer = new window.spine.SkeletonRenderer(context);
      skeletonRenderer.triangleRendering = true;

      // Load assets
      assetManager = new window.spine.AssetManager("/spine-assets/");
      assetManager.loadText("spineboy-ess.json");
      assetManager.loadTextureAtlas("spineboy.atlas");
      await assetManager.loadAll();

      // Create skeleton data
      const atlas = assetManager.require("spineboy.atlas");
      const atlasLoader = new window.spine.AtlasAttachmentLoader(atlas);
      const skeletonJson = new window.spine.SkeletonJson(atlasLoader);
      const skeletonData = skeletonJson.readSkeletonData(assetManager.require("spineboy-ess.json"));

      skeleton = new window.spine.Skeleton(skeletonData);
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform(window.spine.Physics.update);
      bounds = skeleton.getBoundsRect();

      // Attach bounding box for the head
      skeleton.setAttachment("head-bb", "head");

      // Setup animation state
      const animationStateData = new window.spine.AnimationStateData(skeleton.data);
      animationStateData.defaultMix = 0.2;
      const animationState = new window.spine.AnimationState(animationStateData);
      animationState.timeScale = animationSpeed; // Set initial animation speed

      animationStateRef.current = animationState; // Store in ref

      // Set initial animation
      animationState.setAnimation(0, currentAnimation, true);

      renderRef.current = requestAnimationFrame(render); // Start rendering
    };

    const loadSpineCanvas = () => {
      const script = document.createElement("script");
      script.src = "/libs/spine-canvas.js";
      script.onload = load;
      document.body.appendChild(script);
    };

    loadSpineCanvas();

    return () => {
      // Cancel animation frame when component unmounts
      if (renderRef.current) {
        window.cancelAnimationFrame(renderRef.current);
      }
    };
  }, [animationSpeed]); // Depend on animationSpeed

  // Handle animation change
  useEffect(() => {
    if (animationStateRef.current && currentAnimation) {
      animationStateRef.current.setAnimation(0, currentAnimation, true);
    }
  }, [currentAnimation]);

  // Update animation speed
  useEffect(() => {
    if (animationStateRef.current) {
      animationStateRef.current.timeScale = animationSpeed;
    }
  }, [animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#333", margin: 0, padding: 0 }}
    />
  );
}
