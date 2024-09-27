export const TimeDelegationAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxTimestamp",
        type: "uint256",
      },
    ],
    name: "initDelegation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
