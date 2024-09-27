/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo } from "react";

import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, http, createConfig } from "wagmi";

import { ParticleConnectkit } from "../../containers/ParticleConnectkit";
import { useNetworkLayer } from "../../hooks/useNetworkLayer";
import { useStore } from "../../hooks/useStore";
import { getNetworkConfig } from "../../mud/getBrowserNetworkConfig";
import {
  particleGoogleWallet,
  particleTwitterWallet,
  particleWallet,
} from "../particleWallet";

import { ExternalWalletProvider } from "./ExternalWalletProvider";

export const queryClient = new QueryClient();

export type Props = {
  children: React.ReactNode;
};

export function MudProvider({ children }: Props) {
  const networkConfig = useMemo(() => getNetworkConfig(), []);

  // Define the connectors using connectorsForWallets
  const connectors = useMemo(() => {
    return connectorsForWallets(
      [
        {
          groupName: "Recommended",
          wallets: [
            particleGoogleWallet,
            particleTwitterWallet,
            particleWallet,
            metaMaskWallet,
            rainbowWallet,
            walletConnectWallet,
          ],
        },
      ],
      {
        appName: "VoxelWorld",
        projectId: "b51d72eb412a883de942cfdd73536605",
      }
    );
  }, []);

  // Use createConfig to create wagmiConfig
  const wagmiConfig = useMemo(() => {
    return createConfig({
      connectors,
      chains: [networkConfig.chain],
      transports: {
        [networkConfig.chain.id]: http(),
      },
      ssr: true,
    });
  }, [networkConfig, connectors]);

  const networkLayer = useNetworkLayer(networkConfig);
  useEffect(() => {
    if (networkLayer) {
      useStore.setState({ networkLayer });
    }
  }, [networkLayer]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ExternalWalletProvider networkConfig={networkConfig}>
            {children}
          </ExternalWalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
