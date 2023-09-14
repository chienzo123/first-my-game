import * as BABYLON from "babylonjs";
import { useEffect, useRef, useState } from "react";

const GameScreen = () => {
  const canvasRef = useRef(null);
  const [scores, setScores] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const engine = new BABYLON.Engine(canvas, true);
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(0, 5, -10),
        scene
      );
      camera.setTarget(BABYLON.Vector3.Zero());

      const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );

      const fadeOutAnimation = new BABYLON.Animation(
        "fadeOutAnimation",
        "material.alpha",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      const fadeOutKeys = [
        { frame: 0, value: 1 },
        { frame: 100, value: 1 }
      ];
      fadeOutAnimation.setKeys(fadeOutKeys);

      const animation = new BABYLON.Animation(
        "animation",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      const keys = [
        { frame: 0, value: -10 },
        { frame: 100, value: 10 },
        { frame: 200, value: -10 }
      ];
      animation.setKeys(keys);

      const particleSystem = new BABYLON.ParticleSystem(
        "particles",
        2000,
        scene
      );
      particleSystem.particleTexture = new BABYLON.Texture(
        "path/to/particle-texture.png",
        scene
      );
      particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
      particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1);
      particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
      particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1);
      particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
      particleSystem.minSize = 0.1;
      particleSystem.maxSize = 0.5;
      particleSystem.minLifeTime = 0.5;
      particleSystem.maxLifeTime = 2;
      particleSystem.emitRate = 1000;
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
      particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
      particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
      particleSystem.minAngularSpeed = 0;
      particleSystem.maxAngularSpeed = Math.PI;
      particleSystem.minEmitPower = 1;
      particleSystem.maxEmitPower = 3;
      particleSystem.updateSpeed = 0.01;
      // Tạo quả cầu và hiệu ứng cho nó
      function createSphere() {
        const sphere = BABYLON.MeshBuilder.CreateSphere(
          "sphere",
          { diameter: 2 },
          scene
        );

        sphere.position = new BABYLON.Vector3(Math.random() * 20 - 5, -10, 5);
        sphere.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material.alpha = 1;
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere?.actionManager?.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnLeftPickTrigger,
            function (event) {
              const pickResult = scene.pick(event.pointerX, event.pointerY);
              particleSystem.emitter = pickResult.pickedPoint;
              plusScore();
              particleSystem.start();
              sphere.dispose();
              setTimeout(() => {
                particleSystem.stop();
              }, 100);
            }
          )
        );
        sphere.animations.push(fadeOutAnimation);
        sphere.animations.push(animation);
        scene.beginAnimation(sphere, 0, 200, true);
        scene.beginAnimation(sphere, 0, 100, false, 1, () => {
          sphere.dispose();
        });
      }

      setInterval(() => {
        createSphere();
      }, 500);

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });
    }
  }, [canvasRef]);

  const plusScore = () => {
    setScores(prev => {
      const newCounter = prev + 1;
      return newCounter;
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        position: "relative"
      }}
    >
      <div style={{ position: "absolute" }}>Score: {scores}</div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GameScreen;
