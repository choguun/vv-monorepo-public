/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { opBNBTestnet } from "@particle-network/connectkit/chains";
import {
  evmWalletConnectors,
  coinbaseWallet,
  injected,
  walletConnect,
} from "@particle-network/connectkit/evm";
import {
  wallet,
  type EntryPosition,
} from "@particle-network/connectkit/wallet";

import { APP_PROJECT_ID, APP_APP_ID, APP_CLIENT_KEY } from "@/src/env";

const config = createConfig({
  projectId: APP_PROJECT_ID,
  clientKey: APP_CLIENT_KEY,
  appId: APP_APP_ID,
  appearance: {
    recommendedWallets: [
      { walletId: "metaMask", label: "Recommended" },
      { walletId: "coinbaseWallet", label: "Popular" },
      { walletId: "okxWallet", label: "none" },
      { walletId: "phantom", label: "none" },
      { walletId: "trustWallet", label: "none" },
      { walletId: "bitKeep", label: "none" },
      { walletId: "walletConnect", label: "none" },
    ],
    theme: {
      "--pcm-font-family": "'__Poppins_68bcaa', '__Poppins_Fallback_68bcaa'",
      "--pcm-rounded-sm": "4px",
      "--pcm-rounded-md": "8px",
      "--pcm-rounded-lg": "11px",
      "--pcm-rounded-xl": "22px",
    },
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: false,
    connectorsOrder: ["social", "wallet"],
    language: "en-US",
    collapsePasskeyButton: true,
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: "My App" },
      connectorFns: [
        injected({ target: "metaMask" }),
        injected({ target: "okxWallet" }),
        injected({ target: "phantom" }),
        injected({ target: "trustWallet" }),
        injected({ target: "bitKeep" }),
        walletConnect({
          showQrModal: false,
        }),
        coinbaseWallet(),
      ],
      multiInjectedProviderDiscovery: true,
    }),

    authWalletConnectors({
      authTypes: [
        "google",
        "apple",
        "github",
        "facebook",
        "twitter",
        "microsoft",
        "discord",
        "twitch",
        "linkedin",
      ],
      fiatCoin: "USD",
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1,
        promptPaymentPasswordSettingWhenSign: 1,
      },
    }),
  ],
  plugins: [
    wallet({
      entryPosition: "bottom-right" as EntryPosition,
      visible: true,
      customStyle: {
        fiatCoin: "USD",
      },
    }),
  ],
  chains: [opBNBTestnet],
});

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
