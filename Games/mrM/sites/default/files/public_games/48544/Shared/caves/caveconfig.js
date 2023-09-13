const caveConfig = {
    nonterminalNodeTypeChances: {
        reward: {probability: 0.33},
        obstacle: {probability: 0.33},
        default: {probability: 0.34}
    },
    terminalNodeTypeChances: {
        reward: {probability: 0.66},
        obstacle: {probability: 0.17},
        default: {probability: 0.17}
    },

    rewards: {
        basicChest: {
            constructor: CaveBasicChest,
            difficultyThreshold: 0,
            probability: 1
        },
        buff: {
            constructor: CaveBuff,
            difficultyThreshold: 0,
            probability: 1
        },
        buildingMaterials: {
            constructor: CaveBuildingMaterials,
            difficultyThreshold: 0,
            probability: 1
        },
        goldChest: {
            constructor: CaveGoldChest,
            difficultyThreshold: 10,
            probability: 1
        },
        healthPack: {
            constructor: CaveHealthPack,
            difficultyThreshold: 5,
            probability: 1
        },
        mineralPile: {
            constructor: CaveMineralPile,
            difficultyThreshold: 0,
            probability: 1
        },
        moneyBag: {
            constructor: CaveMoneyBag,
            difficultyThreshold: 0,
            probability: 1
        },
        scientist: {
            constructor: CaveScientist,
            difficultyThreshold: 5,
            probability: 1
        },
        timelapse: {
            constructor: CaveTimelapse,
            difficultyThreshold: 0,
            probability: 1
        },
        drone: {
            constructor: CaveDroneReward,
            difficultyThreshold: 11,
            probability: 1,
            possibleIds: [3]
        }
    },

    obstacles:
    {
        mud: {
            constructor: CaveTerrainMud,
            minKmDepth: 0,
            probability: 1
        },
        rock: {
            constructor: CaveBlockerRock,
            minKmDepth: 0,
            probability: 1
        },
        radiation: {
            constructor: CaveHazardRadiation,
            minKmDepth: 0,
            probability: 1
        },
        lava: {
            constructor: CaveHazardLava,
            minKmDepth: 300,
            probability: 1
        }
    }
}