import { useComponentValue } from "@latticexyz/react";

import { useMUD } from "../../hooks/useMUD";

export const useAdmin = () => {
  const {
    networkLayer: {
      components: { Admin },
      network: { playerEntity: playerAddress },
    },
  } = useMUD() as any;

  const isAdmin = useComponentValue(Admin, playerAddress)?.value;

  return isAdmin;
};
