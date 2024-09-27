import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { ConnectButton } from "@particle-network/connectkit";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import IconVVText from "../assets/images/logo/vv_text_logo.png";
import { FAUCET_URL, BRIDGE_URL, CHAIN_NAME } from "../constants";

export const Main = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-right"
        style={{
          backgroundImage: "url(assets/images/bg/mainpage_bg.webp)",
          filter: "brightness(50%)", // Use filter to adjust transparency
          opacity: 0.6,
        }}
      />
      {/* Content */}
      <div className="relative z-10 -mt-10">
        <img src={IconVVText} className="w-[50vw] -mt-10" alt="logo" />
      </div>
      <div className="relative z-10">
        <ConnectButton />
        {isConnected && (
          <button
            className="p-4 bg-orange-400 text-white text-xl rounded-xl cursor-pointer mt-2"
            onClick={() => navigate("/lobby")}
          >
            PRESS START GAME
          </button>
        )}
      </div>
      <div className="relative z-10 mt-2">
        <a href={FAUCET_URL} target="_blank">
          <span>FAUCET&nbsp;&nbsp; | &nbsp;&nbsp;</span>
        </a>
        <a href={BRIDGE_URL} target="_blank">
          <span>BRIDGE</span>
        </a>
      </div>
      <div className="relative z-10 mt-2">
        <span>Lived on {CHAIN_NAME}</span>
      </div>
    </div>
  );
};
