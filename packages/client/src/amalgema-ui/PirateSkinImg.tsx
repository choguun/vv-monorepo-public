import React, { useRef, useEffect, useState } from "react";

import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { twMerge } from "tailwind-merge";
import { Group } from "three";

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);

  const [positionOffset, setPositionOffset] = useState(0);

  useFrame((state, delta) => {
    if (group.current) {
      // Update the position offset to create a smooth back-and-forth motion
      setPositionOffset((prevOffset) => {
        const newOffset = prevOffset + delta * 0.5; // Adjust the speed of the motion
        return newOffset % (Math.PI * 2); // Loop the motion
      });

      // Apply the position offset to the model's position
      group.current.position.y = -2 + Math.sin(positionOffset) * 0.1; // Adjust the amplitude of the motion
    }
  });

  // useEffect(() => {
  //   // Debug: Print all object names in the scene
  //   scene.traverse((object) => {
  //     if (object.name) {
  //       console.log(object.name);
  //     }
  //   });
  // }, [scene]);

  scene.rotation.y = Math.PI; // Rotate 180 degrees around the y-axis
  scene.scale.set(12, 12, 12); // Increase the size by a factor of 2

  return <primitive object={scene} ref={group} />;
};

export function PirateSkinImg({
  colored = true,
  className,
}: {
  colored?: boolean;
  className?: string;
}) {
  const imgName = colored ? "starter-pack" : "starter-pack";

  return (
    <div className={twMerge(className)}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model url="./assets/models/pirate_model.glb" />
        <OrbitControls
          enableRotate={true}
          enableZoom={false}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}
