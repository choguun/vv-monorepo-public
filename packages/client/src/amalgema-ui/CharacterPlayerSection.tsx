/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from "react";

import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { encodeSystemCallFrom } from "@latticexyz/world/internal";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Group } from "three";
import { encodeFunctionData, maxUint256 } from "viem";

import { TimeDelegationAbi } from "../abis";
import { LOGIN_SYSTEM_ID, TIMEBOUND_DELEGATION } from "../constants";
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
    externalWorldContract,
    network: {
      components: { Character, Name },
      worldContract,
      waitForTransaction,
      walletClient,
    },
    externalWalletClient,
    utils: { refreshBalance, hasTimeDelegation },
  } = useAmalgema() as any;

  const { address } = useExternalAccount();
  const hasDelegation = hasTimeDelegation(
    externalWalletClient.account.address,
    walletClient.account.address
  );
  const navigate = useNavigate();

  const character =
    useComponentValue(
      Character,
      address ? addressToEntityID(address) : ("0" as Entity)
    )?.value ?? 0;

  const name =
    useComponentValue(
      Name,
      address ? addressToEntityID(address) : ("0" as Entity)
    )?.value ?? 0;

  const handlePlaytoLogin = async () => {
    try {
      const position: VoxelCoord = { x: 1, y: 1, z: 1 };
      toast.loading("Login...");
      const hash = await worldContract.write.callFrom(
        encodeSystemCallFrom({
          abi: IWorldAbi,
          from: externalWalletClient.account.address,
          systemId: LOGIN_SYSTEM_ID,
          functionName: "loginPlayer",
          args: [position],
        })
      );
      await waitForTransaction(hash);
      toast.success("Login");
      localStorage.setItem("vv-character-id", character.toString());
      localStorage.setItem("vv-username", name.toString());

      setInterval(() => {
        navigate("/world");
      }, 2000);
    } catch (e) {
      toast.error(e.message);
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
            {!hasDelegation ? (
              <Button
                buttonType="secondary"
                className="ml-5"
                onClick={async () => {
                  await externalWorldContract.write.registerDelegation(
                    [
                      walletClient.account.address,
                      TIMEBOUND_DELEGATION,
                      encodeFunctionData({
                        abi: TimeDelegationAbi,
                        functionName: "initDelegation",
                        args: [walletClient.account.address, maxUint256],
                      }),
                    ],
                    {
                      account: externalWalletClient.account.address,
                    }
                  );

                  setInterval(() => {
                    window.location.reload();
                  }, 1000);
                }}
              >
                Delegate
              </Button>
            ) : (
              <Button
                buttonType="primary"
                className="cursor-pointer"
                onClick={handlePlaytoLogin}
                disabled={!character}
              >
                PLAY
              </Button>
            )}
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
