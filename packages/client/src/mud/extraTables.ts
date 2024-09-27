import { resourceToHex } from "@latticexyz/common";
import { defineTable } from "@latticexyz/store/config/v2";
import { SyncFilter } from "@latticexyz/store-sync";

// this is only a default used for development
export const SEASON_PASS_NAMESPACE = "Season1";

const ERC20RegistryTableId = resourceToHex({
  type: "table",
  namespace: "erc20-puppet",
  name: "ERC20Registry",
});
const UserDelegationControlTableId = resourceToHex({
  type: "table",
  namespace: "",
  name: "UserDelegationControl",
});
const SystemboundDelegationsTableId = resourceToHex({
  type: "table",
  namespace: "",
  name: "SystemboundDelegations",
});
const TimeboundDelegationsTableId = resourceToHex({
  type: "table",
  namespace: "",
  name: "TimeboundDelegationsTableId",
});

export const syncFilters = (seasonPassNamespace: string): SyncFilter[] => [
  {
    tableId: ERC20RegistryTableId,
  },
  {
    // generate tableId from SeasonPassNamespace table
    tableId: resourceToHex({
      type: "table",
      namespace: seasonPassNamespace,
      name: "Balances",
    }),
  },
  {
    tableId: UserDelegationControlTableId,
  },
  {
    tableId: SystemboundDelegationsTableId,
  },
  {
    tableId: TimeboundDelegationsTableId,
  },
];

export const tables = (seasonPassNamespace: string) =>
  ({
    ERC20Registry: defineTable({
      namespace: "erc20-puppet",
      name: "ERC20Registry",
      label: "ERC20Registry",
      tableId: ERC20RegistryTableId,
      key: ["namespaceId"],
      schema: {
        namespaceId: "bytes32",
        erc20Address: "address",
      },
    }),
    SeasonPass_Balances: defineTable({
      namespace: SEASON_PASS_NAMESPACE,
      name: "Balances",
      label: "SeasonPass_Balances",
      tableId: resourceToHex({
        type: "table",
        namespace: seasonPassNamespace,
        name: "Balances",
      }),
      key: ["account"],
      schema: {
        account: "address",
        value: "uint256",
      },
    }),
    UserDelegationControl: defineTable({
      namespace: "",
      name: "UserDelegationCo",
      label: "UserDelegationControl",
      tableId: UserDelegationControlTableId,
      key: ["delegator", "delegatee"],
      schema: {
        delegator: "address",
        delegatee: "address",
        delegationControlId: "bytes32",
      },
    }),
    SystemboundDelegations: defineTable({
      namespace: "",
      name: "SystemboundDeleg",
      label: "SystemboundDelegations",
      tableId: SystemboundDelegationsTableId,
      key: ["delegator", "delegatee", "systemId"],
      schema: {
        delegator: "address",
        delegatee: "address",
        systemId: "bytes32",
        availableCalls: "uint256",
      },
    }),
    TimeboundDelegations: defineTable({
      namespace: "",
      name: "TimeboundDeleg",
      label: "TimeboundDelegations",
      tableId: TimeboundDelegationsTableId,
      key: ["delegator", "delegatee"],
      schema: {
        delegator: "address",
        delegatee: "address",
        maxTimestamp: "uint256",
      },
    }),
  } as const);
