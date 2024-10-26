import { useState } from "react";

import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { NATIVE_SYMBOL } from "../../constants";
import { useAmalgema } from "../../hooks/useAmalgema";
import { useExternalAccount } from "../hooks/useExternalAccount";
import { Modal } from "../Modal";

export function GoldShopModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    network: {
      components: { GoldRate },
    },
    executeSystemWithExternalWallet,
  } = useAmalgema();

  const unit = 0.0001;
  const goldRate = Number(useComponentValue(GoldRate, singletonEntity).rate);

  const [amount, setAmount] = useState(0);
  const [gold, setGold] = useState(0);

  const { address } = useExternalAccount();

  return (
    <div className="uppercase w-fit px-4 flex items-center">
      <Modal isOpen={open} title="Gold Shop" setOpen={setOpen}>
        <div>
          <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
            <label className="block text-sm font-medium text-black mb-1">
              You send
            </label>
            <div className="relative mb-4">
              <input
                type="number"
                id="amount"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg border border-red-500 focus:outline-none focus:border-red-600"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setGold(goldRate * Number(e.target.value));
                }}
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-teal-400">
                {NATIVE_SYMBOL}
              </span>
            </div>
            {/* <p className="text-red-500 text-sm mb-6">Required field</p> */}

            <label className="block text-sm font-medium text-black mb-1">
              You get
            </label>
            <div className="relative mb-4">
              <input
                type="text"
                id="get"
                disabled
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg border border-gray-600 focus:outline-none"
                value={gold}
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-orange-500">
                GOLD
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Current rate:{" "}
              <span className="font-bold text-orange-500">
                {unit} {NATIVE_SYMBOL} ≈ {(goldRate * unit).toLocaleString()}{" "}
                GOLD
              </span>
            </p>

            <button
              className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg disabled:opacity-50"
              disabled={gold <= 0}
              onClick={async () => {
                await executeSystemWithExternalWallet({
                  systemCall: "buyGold",
                  systemId: "buy Gold",
                  args: [
                    [],
                    { account: address, value: BigInt(amount * 10 ** 18) },
                  ],
                });
                setOpen(false);

                setInterval(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              BUY
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
