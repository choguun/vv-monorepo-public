import { useBurnerBalance } from "./hooks/useBalance";
import { SessionWalletManager } from "./SessionWalletManager";

export function SessionWalletSection() {
  const burnerBalance = useBurnerBalance();
  return (
    <>
      <div className="h-2" />
      {burnerBalance?.danger && <SessionWalletManager />}
    </>
  );
}
