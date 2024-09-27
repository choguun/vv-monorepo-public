import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  deploy: {
    upgradeableWorldImplementation: true,
  },
  codegen: {
    outputDirectory: "codegen",
  },
  enums: {
    TerrainTypes: ["Unknown", "Grass", "Mountain", "Forest"],
    StructureTypes: ["Unknown", "Settlement", "SpawnSettlement", "WoodenWall", "GoldMine", "GoldCache"],
    CharacterTypes: ["Unknown", "Male1", "Male2", "Male3", "Female1", "Female2", "Female3", "Pirate1"],
    // WorldResourceTypes: ["Unknown", "God", "Artifact", "Mystical", "Rare", "Common"],
    QuestTypes: [
      "DAILY_CHECK_IN",
      "DAILY_LOG_IN",
      "GATHER_RESOURCE",
      "COMMON_RESOURCE",
      "RARE_RESOURCE",
      "MYSTICAL_RESOURCE",
      "ARTIFACT_RESOURCE",
      "GOD_RESOURCE",
    ],
  },
  tables: {
    /**
     * SkyPool settings:
     * - Creation cost of SkyPool matches.
     * - Window (in seconds) to determine match rewards.
     * - Token that is used in SkyPool rewards.
     */
    SkyPoolConfig: {
      key: [],
      schema: {
        locked: "bool",
        cost: "uint256",
        window: "uint256",
        orbToken: "address",
        seasonPassToken: "address",
        skyKeyToken: "address",
      },
    },

    /**
     * Marks an entity as an admin. Used on address entities.
     */
    Admin: "bool",

    /**
     * Stores players chosen names.
     */
    Name: "string",
    /**
     * Used to check if a name is already taken.
     */
    NameExists: {
      key: ["nameData"],
      schema: {
        nameData: "bytes32",
        value: "bool",
      },
    },

    SeasonConfig: {
      key: [],
      schema: {
        season: "uint16",
        start: "uint256",
        end: "uint256",
      },
    },

    WorldResourceS1: {
      key: [],
      schema: {
        god: "uint32",
        artifact: "uint32",
        mystical: "uint32",
        rare: "uint32",
        common: "uint32",
        maxGod: "uint32",
        maxArtifact: "uint32",
        maxMystical: "uint32",
        maxRare: "uint32",
        maxCommon: "uint32",
      },
      codegen: {
        dataStruct: false,
      },
    },

    WorldQuestS1: {
      key: [],
      schema: {
        checkin: "uint32",
        login: "uint32",
        gather: "uint32",
        common: "uint32",
        rare: "uint32",
        mystical: "uint32",
        artifact: "uint32",
        god: "uint32",
      },
      codegen: {
        dataStruct: false,
      },
    },

    PlayersActivity: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        lastCheckin: "uint256",
        lastLogin: "uint256",
        lastGather: "uint256",
        lastCommon: "uint256",
        lastRare: "uint256",
        lastMystical: "uint256",
        lastArtifact: "uint256",
        lastGod: "uint256",
      },
      codegen: {
        dataStruct: false,
      },
    },

    PlayerPointS1: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        value: "uint256",
      },
    },

    PlayerQuestS1: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        checkin: "uint32",
        login: "uint32",
        gather: "uint32",
        common: "uint32",
        rare: "uint32",
        mystical: "uint32",
        artifact: "uint32",
        god: "uint32",
      },
    },

    PlayerTreasureS1: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        god: "uint32",
        artifact: "uint32",
        mystical: "uint32",
        rare: "uint32",
        common: "uint32",
      },
    },

    PlayerQuestFinishedS1: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        checkin: "bool",
        login: "bool",
        gather: "bool",
        common: "bool",
        rare: "bool",
        mystical: "bool",
        artifact: "bool",
        god: "bool",
      },
      codegen: {
        dataStruct: false,
      },
    },
    /*

    */
    Character: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        value: "CharacterTypes",
      },
    },

    Recipes: {
      schema: {
        recipeId: "bytes32",
        stationObjectTypeId: "uint8",
        outputObjectTypeId: "uint8",
        outputObjectTypeAmount: "uint8",
        inputObjectTypeIds: "uint8[]",
        inputObjectTypeAmounts: "uint8[]",
      },
      key: ["recipeId"],
      codegen: {
        storeArgument: true,
      },
    },

    ReversePosition: {
      schema: {
        x: "int16",
        y: "int16",
        z: "int16",
        entityId: "bytes32",
      },
      key: ["x", "y", "z"],
      codegen: {
        storeArgument: true,
      },
    },

    InventoryTool: {
      schema: {
        toolEntityId: "bytes32",
        ownerEntityId: "bytes32",
      },
      key: ["toolEntityId"],
      codegen: {
        storeArgument: true,
      },
    },

    ReverseInventoryTool: {
      schema: {
        ownerEntityId: "bytes32",
        toolEntityIds: "bytes32[]",
      },
      key: ["ownerEntityId"],
      codegen: {
        storeArgument: true,
      },
    },

    InventoryCount: {
      schema: {
        ownerEntityId: "bytes32",
        objectTypeId: "uint8",
        count: "uint16",
      },
      key: ["ownerEntityId", "objectTypeId"],
      codegen: {
        storeArgument: true,
      },
    },

    InventoryObjects: {
      schema: {
        ownerEntityId: "bytes32",
        objectTypeIds: "uint8[]",
      },
      key: ["ownerEntityId"],
      codegen: {
        storeArgument: true,
      },
    },

    InventorySlots: {
      schema: {
        ownerEntityId: "bytes32",
        numSlotsUsed: "uint16",
      },
      key: ["ownerEntityId"],
      codegen: {
        storeArgument: true,
      },
    },

    Equipped: {
      schema: {
        ownerEntityId: "bytes32",
        toolEntityId: "bytes32",
      },
      key: ["ownerEntityId"],
      codegen: {
        storeArgument: true,
      },
    },

    Stamina: {
      schema: {
        entityId: "bytes32",
        lastUpdatedTime: "uint256",
        stamina: "uint32",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    Health: {
      schema: {
        entityId: "bytes32",
        lastUpdatedTime: "uint256",
        health: "uint16",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    PlayerActivity: {
      schema: {
        entityId: "bytes32",
        lastActionTime: "uint256",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    LastKnownPosition: {
      schema: {
        entityId: "bytes32",
        x: "int16",
        y: "int16",
        z: "int16",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    PlayerMetadata: {
      schema: {
        entityId: "bytes32",
        isLoggedOff: "bool",
        lastHitTime: "uint256",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    Player: {
      schema: {
        player: "address",
        entityId: "bytes32",
      },
      key: ["player"],
      codegen: {
        storeArgument: true,
      },
    },

    /**
     * The incrementing token ID of season passes
     */
    SeasonPassIndex: {
      key: [],
      schema: {
        tokenIndex: "uint256",
      },
    },
    /**
     * - Initial price of season pass
     * - price decreases by this per second
     * - price is multiplied by this on each purchase
     */
    SeasonPassConfig: {
      key: [],
      schema: {
        minPrice: "uint256",
        startingPrice: "uint256",
        rate: "uint256",
        multiplier: "uint256",
        mintCutoff: "uint256",
      },
    },

    /**
     * Store timing information for a season.
     * This is separate from SeasonPassConfig because adding columns
     * to an existing World is not well-supported in MUD yet.
     */
    SeasonTimes: {
      key: [],
      schema: {
        seasonStart: "uint256",
        seasonEnd: "uint256",
      },
    },

    /**
     * Timestamp for the last sale of a season pass.
     * Used to calculate price decrease over time.
     */
    SeasonPassLastSaleAt: {
      key: [],
      schema: {
        lastSaleAt: "uint256",
      },
    },

    /**
     * Record of season pass sales.
     * Used for analytics and tax purposes.
     */
    SeasonPassSale: {
      type: "offchainTable",
      key: ["buyer", "tokenId"],
      schema: {
        buyer: "address",
        tokenId: "uint256",
        price: "uint256",
        purchasedAt: "uint256",
        tokenAddress: "address",
      },
    },

    SeasonPass_Balances: {
      key: ["account"],
      schema: {
        account: "address",
        value: "uint256",
      },
    },

    Position: {
      schema: {
        entityId: "bytes32",
        x: "int16",
        y: "int16",
        z: "int16",
      },
      key: ["entityId"],
      codegen: {
        storeArgument: true,
      },
    },

    GameToken: {
      schema: {
        entityId: "bytes32",
        amount: "uint64",
      },
      key: ["entityId"],
    },
  },
});
