//Must land between previous threshold and defined threshold to trigger

const blackChestConfiguration = {
    rangeMax: 1000,
    type: 2,
    rewards: [
        {
            condition: () => chestService.totalBlackChestsOpened == 0,
            grantFunction: () => grantSuperMiner(superMinerRarities.common)
        },
        {
            rewards: [
                {
                    threshold: 400,
                    grantFunction: () => grantSuperMinerSouls(rand(35, 50))
                },
                {
                    threshold: 750,
                    grantFunction: () => grantSuperMiner(superMinerRarities.common)
                },
                {
                    threshold: 915,
                    grantFunction: () => grantSuperMiner(superMinerRarities.uncommon)
                },
                {
                    threshold: 990,
                    grantFunction: () => grantSuperMiner(superMinerRarities.rare)
                },
                {
                    threshold: 1000,
                    grantFunction: () => grantSuperMiner(superMinerRarities.legendary)
                }
            ]
        }
    ],
    defaultReward: () => grantSuperMinerSouls(rand(20, 25))
}

const goldChestConfiguration = {
    rangeMax: 1000,
    type: 1,
    rewards: [
        {
            condition: () => isCandidateForFirstChestBlueprint(),
            grantFunction: () => grantAcceptableDrillBlueprint()
        },
        {
            rewards: [
                {
                    threshold: 380,
                    grantFunction: () => grantMoney(130 * depthMultiplier(), 520 * depthMultiplier(), true, 2)
                },
                {
                    threshold: 700,
                    condition: () => rollForDrillBlueprint(),
                    grantFunction: () => grantAcceptableDrillBlueprint(),
                    defaultReward: () => grantMoney(130 * depthMultiplier(), 520 * depthMultiplier(), true, 2)
                },
                {
                    threshold: 850,
                    grantFunction: () => grantMineral(levels[depth][0][0], goldenChestRewardRoller.rand(4, 8) * depthMultiplier())
                },
                {
                    threshold: 885,
                    rewards: [
                        {
                            condition: () => depth >= 40 && depth < 899,
                            grantFunction: () => grantKmDepth(1)
                        },
                        {
                            rewards: [
                                {
                                    condition: () => depth < 899 && !isActiveScientistsFull(),
                                    grantFunction: grantRareScientist
                                },
                                {
                                    condition: () => !isOilRigFull(),
                                    grantFunction: grantOil(Math.ceil(oilGeneratedPerHour() * 4))
                                }
                            ],
                            defaultReward: () => grantTimelapse(240)
                        }
                    ]
                },
                {
                    threshold: 915,
                    condition: () => (needsBuildingMaterials() || goldenChestRewardRoller.boolean(0.20)),
                    grantFunction: grantTwentyBuildingMaterials,
                    defaultReward: () => grantMoney(130 * depthMultiplier(), 520 * depthMultiplier(), true, 2)
                },
                {
                    threshold: 945,
                    condition: () => metalDetectorStructure.level <= 3 && depth > 200 && (needsBuildingMaterials() || goldenChestRewardRoller.boolean(0.20)),
                    grantFunction: grantTwentyBuildingMaterials,
                    defaultReward: () => grantMoney(130 * depthMultiplier(), 520 * depthMultiplier(), true, 2)
                },
                {
                    threshold: 950,
                    condition: () => (needsBuildingMaterials() || goldenChestRewardRoller.boolean(0.20)),
                    grantFunction: grantFiftyBuildingMaterials,
                    defaultReward: () => grantTimelapse(360)
                },
                {
                    threshold: 975,
                    rewards: [
                        {
                            condition: () => !hasEquip(10),
                            grantFunction: () => grantEquipment(10),
                        },
                        {
                            condition: () => tickets < 10,
                            grantFunction: () => grantTickets(20)
                        }
                    ],
                    defaultReward: () => grantTimelapse(360)
                },
                {
                    grantFunction: () => grantEquipment(11),
                    defaultReward: () => grantTimelapse(360)
                }
            ]
        }
    ],
    defaultReward: () => grantTimelapse(180)
};

const basicChestConfiguration = {
    rangeMax: 1000,
    type: 0,
    rewards: [
        {
            condition: () => (depth >= 50 || (depth >= 12 && unlockScientistsEarly)) && hasUnlockedScientists == 0,
            grantFunction: grantRandomScientist
        },
        {
            condition: () => depth >= 50 && !isActiveScientistsFull() && basicChestRewardRoller.rand(0, 80) < 3 - numActiveScientists(),
            grantFunction: grantRandomScientist
        },
        {
            condition: () => depth >= 20 && (needsBuildingMaterials() || basicChestRewardRoller.boolean(0.20)) && basicChestRewardRoller.rand(0, 1000) < Math.round(80 * STAT.increasedRateOfFindingBuildingMaterials()),
            grantFunction: grantSingleBuildingMaterial
        },
        {
            condition: () => basicChestRewardRoller.rand(0, 100) < 3 - buffs.numActiveChestBuffs(),
            grantFunction: grantStaticBuff
        },
        {
            rewards: [
                {
                    threshold: 400,
                    condition: () => depth > 40 && playtime > 1800,
                    grantFunction: () => grantTimelapse(basicChestRewardRoller.rand(3, 10)),
                    defaultReward: () => grantTimelapse(basicChestRewardRoller.rand(3, 6))
                },
                {
                    threshold: 800,
                    condition: () => depth > 50 && playtime > 1800,
                    grantFunction: () => grantMoney(6 * depthMultiplier(), 11 * depthMultiplier(), false, 1),
                    defaultReward: () => grantMoney(3 * depthMultiplier(), 6 * depthMultiplier(), false, 1)
                },
                {
                    threshold: 900,
                    condition: () => depth > 60 && playtime > 3600,
                    grantFunction: () => grantMineral(getMineralDepositType(basicChestRewardRoller.rand(Math.floor(depth / 2), depth)), .36 * depthMultiplier()),
                    defaultReward: () => grantMineral(getMineralDepositType(basicChestRewardRoller.rand(Math.floor(depth / 2), depth)), .12 * depthMultiplier())
                },
                {
                    threshold: 970,
                    condition: () => depth >= 303 && !isOilRigFull(),
                    grantFunction: () => grantOil(Math.ceil(oilGeneratedPerHour()))
                },
                {
                    threshold: 992,
                    condition: () => depth >= 303,
                    grantFunction: () => grantEquipment(basicChestRewardRoller.rand(0, 8))
                }
            ]
        }
    ],
    defaultReward: () => grantTimelapse(basicChestRewardRoller.rand(3, 10))
};

const blackChestRewards = new Reward(blackChestConfiguration);
const goldChestRewards = new Reward(goldChestConfiguration);
const basicChestRewards = new Reward(basicChestConfiguration);