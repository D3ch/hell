var droneBlueprints = [
    {
        id: 0,
        name: _("Basic Drone"),
        category: craftingCategories.drones,
        price: 0,
        craftedItem: {item: new DroneCraftingItem(0), quantity: 1},
        ingredients: []
    },
    {
        id: 1,
        name: _("Magnetic Drone"),
        category: craftingCategories.drones,
        price: 0,
        craftedItem: {item: new DroneCraftingItem(1), quantity: 1},
        ingredients: []
    },
    {
        id: 2,
        name: _("Aerial Drone"),
        category: craftingCategories.drones,
        price: 0,
        craftedItem: {item: new DroneCraftingItem(2), quantity: 1},
        ingredients: []
    },
    {
        id: 3,
        name: _("Healing Drone"),
        category: craftingCategories.drones,
        price: 0,
        craftedItem: {item: new DroneCraftingItem(3), quantity: 1},
        ingredients: []
    },
]

var droneUpgradeBlueprints = [
    {
        id: 0,
        name: _("Basic Drone Upgrade"),
        category: craftingCategories.droneUpgrades,
        price: 150,
        craftedItem: {item: new DroneUpgradeCraftingItem(0), quantity: 1},
        levels: [
            {
                ingredients: []
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 15000000000n},
                    {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 100000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 150000000000n},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 3000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 3000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 500},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 1000000000000000n},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 50},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 10000000000000000n},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 500000},
                ]
            }
        ]
    },
    {
        id: 1,
        name: _("Magnetic Drone Upgrade"),
        category: craftingCategories.droneUpgrades,
        price: 150,
        craftedItem: {item: new DroneUpgradeCraftingItem(1), quantity: 1},
        levels: [
            {
                ingredients: []
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 10000000000n},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 100000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 10000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 500},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 50000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 500000000000000n},
                    {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 50000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 50000000000000000000n},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 50000},
                ]
            }
        ]
    },
    {
        id: 2,
        name: _("Aerial Drone Upgrade"),
        category: craftingCategories.droneUpgrades,
        price: 150,
        craftedItem: {item: new DroneUpgradeCraftingItem(2), quantity: 1},
        levels: [
            {
                ingredients: []
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 50000000000n},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 200000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 100000000000n},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 300000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 2500000000000000n},
                    {item: new MineralCraftingItem(SILICON_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 75000000000000000000n},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 50000},
                ]
            }
        ]
    },
    {
        id: 3,
        name: _("Healing Drone Upgrade"),
        category: craftingCategories.droneUpgrades,
        price: 150,
        craftedItem: {item: new DroneUpgradeCraftingItem(3), quantity: 1},
        levels: [
            {
                ingredients: []
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 50000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 500000000000n},
                    {item: new MineralCraftingItem(IRON_INDEX), quantity: 1000000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 500000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 15000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 25000000000000000n},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MoneyCraftingItem(), quantity: 750000000000000000000n},
                    {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 10000000},
                ]
            }
        ]
    }
]

craftingBlueprints[craftingCategories.drones] = droneBlueprints;
craftingBlueprints[craftingCategories.droneUpgrades] = droneUpgradeBlueprints;

function learnReachedDroneBlueprints()
{
    // Learn relevant drone blueprints for the current depth
    if(depth >= CAVE_BUILDING_DEPTH && !isBlueprintKnown(craftingCategories.drones, 0))
    {
        learnRangeOfBlueprints(craftingCategories.drones, 0, 2);
        learnRangeOfBlueprints(craftingCategories.droneUpgrades, 0, 2);
        learnRangeOfBlueprints(craftingCategories.structures, 10, 11);
    }
}