import { useEffect, useRef } from "react";

export default function SpineCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let lastFrameTime = Date.now() / 1000;
    let canvas, context, skeletonRenderer, assetManager, skeleton, animationState, bounds;

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
      animationState = new window.spine.AnimationState(animationStateData);

      // Set initial animation
      animationState.setAnimation(0, "run", true);

      // Add click listener
      canvas.addEventListener("click", (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.x - canvasRect.x;
        const mouseY = event.y - canvasRect.y;

        const skelBounds = new window.spine.SkeletonBounds();
        skelBounds.update(skeleton);

        if (skelBounds.containsPoint(mouseX, mouseY)) {
          animationState.setAnimation(0, "jump", false);
          animationState.addAnimation(0, "run", true);
        }
      });

      requestAnimationFrame(render);
    };

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

      animationState.update(delta);
      animationState.apply(skeleton);
      skeleton.updateWorldTransform(window.spine.Physics.update);
      skeletonRenderer.draw(skeleton);

      requestAnimationFrame(render);
    };

    const loadSpineCanvas = () => {
      const script = document.createElement("script");
      script.src = "/libs/spine-canvas.js";
      script.onload = load;
      document.body.appendChild(script);
    };

    loadSpineCanvas();

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
