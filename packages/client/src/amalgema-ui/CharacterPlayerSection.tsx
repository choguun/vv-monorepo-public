import { useState, useRef } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Group } from "three";

import { characterModels } from "../constants";
import { useAmalgema } from "../hooks/useAmalgema";
import { addressToEntityID } from "../mud/setupNetwork";

import { useExternalAccount } from "./hooks/useExternalAccount";
import { Button } from "./Theme/SkyStrife/Button";

interface ModelProps {
  url: string;
}

type VoxelCoord = {
  x: number;
  y: number;
  z: number;
};

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
      group.current.position.y = -3 + Math.sin(positionOffset) * 0.1; // Adjust the amplitude of the motion
    }
  });

  scene.rotation.y = Math.PI; // Rotate 180 degrees around the y-axis
  scene.position.y = -15; // Lower the model by 1 unit
  scene.scale.set(12, 12, 12); // Increase the size by a factor of 2

  return <primitive object={scene} ref={group} />;
};

export function CharacterPlayerSection({
  setOpenCharacterModal,
}: {
  setOpenCharacterModal: (open: boolean) => void;
}) {
  const {
    network: {
      components: { Character },
    },
    executeSystemWithExternalWallet,
  } = useAmalgema() as any;

  const { address } = useExternalAccount();
  const navigate = useNavigate();

  const character =
    useComponentValue(
      Character,
      address ? addressToEntityID(address) : ("0" as Entity)
    )?.value ?? 0;

  // TODO: Login to the game
  // TODO: go to main game page
  const handlePlaytoLogin = () => {
    try {
      const position: VoxelCoord = { x: 1, y: 1, z: 1 };

      executeSystemWithExternalWallet({
        systemCall: "loginPlayer",
        systemId: "login",
        args: [[position], { account: address }],
      });

      localStorage.setItem("character-id", character.toString());

      setInterval(() => {
        navigate("/world");
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="mt-5">
        <span className="text-xl font-black">CHARACTERS</span>
        <div className="w-full h-[300px]">
          <div className="grid grid-cols-3 gap-4 mt-2">
            {character === 0 ? (
              <div
                onClick={() => setOpenCharacterModal(true)}
                className="border border-black border-solid rounded-xl w-full h-[300px] text-center flex justify-center items-center hover:bg-slate-300 cursor-pointer"
              >
                <span className="text-3xl font-black">+</span>
              </div>
            ) : (
              <div className="border border-black border-solid rounded-xl">
                <Canvas>
                  <ambientLight />
                  <pointLight position={[10, 10, 10]} />
                  <Model url={characterModels[character as number]} />
                  <OrbitControls
                    enableRotate={true}
                    enableZoom={false}
                    enablePan={true}
                  />
                </Canvas>
              </div>
            )}
            <div className="border border-black border-solid rounded-xl w-full h-[300px] text-center flex justify-center items-center">
              <span className="text-3xl font-black">N/A</span>
            </div>
            <div className="border border-black border-solid rounded-xl w-full h-[300px] text-center flex justify-center items-center">
              <span className="text-3xl font-black">N/A</span>
            </div>
            <Button
              buttonType="primary"
              className="cursor-pointer"
              onClick={handlePlaytoLogin}
              disabled={!character}
            >
              PLAY
            </Button>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
