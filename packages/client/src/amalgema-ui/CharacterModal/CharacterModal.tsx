/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useEffect, useState } from "react";

import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { twMerge } from "tailwind-merge";
import { Group } from "three";

import { useAmalgema } from "../../hooks/useAmalgema";
import { addressToEntityID } from "../../mud/setupNetwork";
import { useExternalAccount } from "../hooks/useExternalAccount";
import { Modal } from "../Modal";
import { Button } from "../Theme/SkyStrife/Button";

// interface CharacterModalProps {
//   open?: boolean;
// }

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  // const { actions } = useAnimations(animations, group);

  // useEffect(() => {
  //   if (actions && actions[0]) {
  //     actions[0].play();
  //   }
  // }, [actions]);

  // useFrame((state, delta) => {
  //   if (group.current) {
  //     group.current.rotation.y += delta; // Rotate the model around the y-axis
  //   }
  // });

  const [positionOffset, setPositionOffset] = useState(0);

  useFrame((state, delta) => {
    if (group.current) {
      // Update the position offset to create a smooth back-and-forth motion
      setPositionOffset((prevOffset) => {
        const newOffset = prevOffset + delta * 0.5; // Adjust the speed of the motion
        return newOffset % (Math.PI * 2); // Loop the motion
      });

      // Apply the position offset to the model's position
      group.current.position.y = -3 + Math.sin(positionOffset) * 0.1; // Adjust the amplitude of the motion
    }
  });

  const [keysPressed, setKeysPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const [walkCycle, setWalkCycle] = useState(0);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key.toLowerCase()]: true }));
  //   };

  //   const handleKeyUp = (event: KeyboardEvent) => {
  //     setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key.toLowerCase()]: false }));
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   window.addEventListener('keyup', handleKeyUp);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //     window.removeEventListener('keyup', handleKeyUp);
  //   };
  // }, []);

  useEffect(() => {
    // Debug: Print all object names in the scene
    scene.traverse((object) => {
      if (object.name) {
        // console.log(object.name);
      }
    });
  }, [scene]);

  // useFrame((state, delta) => {
  //   if (group.current) {
  //     const speed = 0.1;
  //     const rotationSpeed = 0.05;

  //     if (keysPressed.w) {
  //       group.current.position.z -= speed;
  //       setWalkCycle((prevCycle) => (prevCycle + delta) % (Math.PI * 2));
  //     }
  //     if (keysPressed.s) {
  //       group.current.position.z += speed;
  //       setWalkCycle((prevCycle) => (prevCycle + delta) % (Math.PI * 2));
  //     }
  //     if (keysPressed.a) {
  //       group.current.rotation.y += rotationSpeed;
  //     }
  //     if (keysPressed.d) {
  //       group.current.rotation.y -= rotationSpeed;
  //     }

  //     // console.log(group.current);
  //     // Animate legs
  //     // const leg1 = group.current.getObjectByName('Knee_L') as Object3D | undefined;
  //     // const leg2 = group.current.getObjectByName('Knee_R') as Object3D | undefined;
  //     // if (leg1 && leg2) {
  //     //   leg1.rotation.x = Math.sin(walkCycle) * 0.5;
  //     //   leg2.rotation.x = -Math.sin(walkCycle) * 0.5;
  //     // }
  //   }
  // });

  scene.rotation.y = Math.PI; // Rotate 180 degrees around the y-axis
  scene.position.y = -15; // Lower the model by 1 unit
  scene.scale.set(12, 12, 12); // Increase the size by a factor of 2

  return <primitive object={scene} ref={group} />;
};

interface CharacterModalProps {
  setOpen: (open: boolean) => void;
  isOpen: boolean;
}

enum CharacterTypes {
  Unknown = 0,
  Male1 = 1,
  Male2 = 2,
  Male3 = 3,
  Female1 = 4,
  Female2 = 5,
  Female3 = 6,
}

export function CharacterModal({ setOpen, isOpen }: CharacterModalProps) {
  const {
    network: {
      components: { Character },
    },
    executeSystemWithExternalWallet,
  } = useAmalgema() as any;

  const [character, setCharacter] = useState<CharacterTypes>(
    CharacterTypes.Unknown
  );

  const { address } = useExternalAccount();

  const chooseCharacter = (character: CharacterTypes) => () => {
    setCharacter(character);
  };

  const registerCharacter = async (type: CharacterTypes) => {
    // console.log('registerCharacter');
    // console.log(type);
    await executeSystemWithExternalWallet({
      systemCall: "registerCharacter",
      systemId: "Create Character",
      args: [[type], { account: address }],
    });
    setOpen(false);
  };

  return (
    <Modal
      footer={
        <Button
          className="mx-auto"
          buttonType="primary"
          disabled={character === CharacterTypes.Unknown}
          onClick={() => registerCharacter(character)}
        >
          Choose this character
        </Button>
      }
      title="Choose your character"
      isOpen={isOpen}
      setOpen={setOpen}
      trigger={<></>}
    >
      <div className="">
        <div className="w-full h-[400px]">
          <div className="grid grid-cols-3 gap-4">
            <div
              className={twMerge(
                character === CharacterTypes.Male1
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Male1)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/male1_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
            <div
              className={twMerge(
                character === CharacterTypes.Male2
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Male2)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/male2_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
            <div
              className={twMerge(
                character === CharacterTypes.Male3
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Male3)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/male3_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
            <div
              className={twMerge(
                character === CharacterTypes.Female1
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Female1)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/female1_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
            <div
              className={twMerge(
                character === CharacterTypes.Female2
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Female2)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/female2_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
            <div
              className={twMerge(
                character === CharacterTypes.Female3
                  ? "border-red-400"
                  : "border-black",
                "border-4 border-solid rounded-md p-2"
              )}
              onClick={chooseCharacter(CharacterTypes.Female3)}
            >
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model url="./assets/models/female3_model.glb" />
                <OrbitControls
                  enableRotate={true}
                  enableZoom={false}
                  enablePan={true}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
