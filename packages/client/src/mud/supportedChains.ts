/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - Redstone, our production blockchain (https://redstone.xyz/)
 * - Garnet, our test blockchain (https://garnetchain.com/))
 *
 */

import {
  MUDChain,
  mudFoundry,
  redstone,
  garnet,
} from "@latticexyz/common/chains";
import { Chain } from "viem/chains";

const sourceId = 97; // bsc testnet

export const opBNBTestnet: any = {
  id: 5611, // Your custom chain ID
  name: "opBNB Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://opbnb-testnet-rpc.bnbchain.org"],
      webSocket: ["wss://opbnb-testnet.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "opBNBscan",
      url: "https://testnet.opbnbscan.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 3705108,
    },
    l2OutputOracle: {
      [sourceId]: {
        address: "0xFf2394Bb843012562f4349C6632a0EcB92fC8810",
      },
    },
    portal: {
      [sourceId]: {
        address: "0x4386C8ABf2009aC0c263462Da568DD9d46e52a31",
      },
    },
    l1StandardBridge: {
      [sourceId]: {
        address: "0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840",
      },
    },
  },
  testnet: true,
  sourceId,
  indexerUrl: "http://18.139.116.171:3005",
  bridgeUrl: "https://opbnb-testnet-bridge.bnbchain.org/deposit",
};

export const avaxTestnet: any = {
  id: 43113, // Your custom chain ID
  name: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://avalanche-fuji-c-chain-rpc.publicnode.com"],
      webSocket: ["wss://avalanche-fuji-c-chain-rpc.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "AvaxFujiScan",
      url: "https://testnet.snowtrace.io/",
    },
  },
  testnet: true,
  indexerUrl: "http://18.139.116.171:3006",
  bridgeUrl: "https://core.app/en/tools/testnet-faucet",
};

export const zetaTestnet: any = {
  id: 7001, // Your custom chain ID
  name: "ZETA Testnet",
  nativeCurrency: {
    name: "ZETA",
    symbol: "ZETA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://zeta-chain-testnet.drpc.org"],
      webSocket: [
        "wss://zetachain-athens.blockpi.network/rpc/v1/public/websocket",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "ZetatestnetScan",
      url: "https://athens.explorer.zetachain.com",
    },
  },
  testnet: true,
  bridgeUrl: "",
};

export const BNBTestnet: any = {
  id: 97, // Your custom chain ID
  name: "BNB Testnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://quick-greatest-sailboat.bsc-testnet.quiknode.pro/84e5105026493e0e7f39982c4c8763b25eb16541",
      ],
      webSocket: [
        "wss://quick-greatest-sailboat.bsc-testnet.quiknode.pro/84e5105026493e0e7f39982c4c8763b25eb16541",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "BNBtestnetScan",
      url: "https://testnet.bscscan.com",
    },
  },
  testnet: true,
  bridgeUrl: "",
};

export const baseTestnet: any = {
  id: 84532, // Your custom chain ID
  name: "Base Sepolia",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
      webSocket: ["wss://base-sepolia-rpc.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://sepolia.basescan.org/",
    },
  },
  testnet: true,
  sourceId: 1,
};

/*
 * See https://mud.dev/guides/hello-world/add-chain-client
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [
  mudFoundry,
  redstone,
  garnet,
  opBNBTestnet,
  avaxTestnet,
  zetaTestnet,
  BNBTestnet,
  baseTestnet,
];
