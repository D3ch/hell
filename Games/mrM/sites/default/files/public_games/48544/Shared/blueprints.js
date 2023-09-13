var knownBlueprints = [];
var unseenBlueprints = [""];
var availableBlueprints = [];
var isKnownBlueprintsDirty = false;

var craftingCategories = {
    "components": 0,
    "drill": 1,
    "weapons": 2,
    "structures": 3,
    "gems": 4,
    "reactorLevels": 5,
    "reactorComponents": 6,
    "drones": 7,
    "droneUpgrades": 8
};

var componentBlueprints = [
    {
        id: 0,
        name: _("Copper Ingot"),
        category: 0,
        subcategory: _("T1 Resources"),
        craftedItem: {item: new BackpackCraftingItem(1), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(1), quantity: 1},
            {item: new MineralCraftingItem(2), quantity: 10}
        ]
    },
    {
        id: 1,
        name: _("Copper Pipe"),
        category: 0,
        subcategory: _("T2 Resources"),
        craftedItem: {item: new BackpackCraftingItem(18), quantity: 1},
        ingredients: [
            {item: new BackpackCraftingItem(1), quantity: 5},
        ]
    }
];

var drillBlueprints = [
    //################## STARTER ##################
    {
        id: 0,
        name: _("Steam Engine"),
        category: 1,
        price: 150n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(5), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150n}
        ],
        isFromShop: true
    },
    {
        id: 1,
        name: _("Copper Drill"),
        category: 1,
        price: 250n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(6), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 250n}
        ],
        isFromShop: true
    },
    {
        id: 2,
        name: _("Double Fan"),
        category: 1,
        price: 700n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(7), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 700n}
        ],
        isFromShop: true
    },
    {
        id: 3,
        name: _("Nano Cargo"),
        category: 1,
        price: 1400n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(8), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1400n},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 200},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 1}
        ],
        isFromShop: true
    },
    {
        id: 4,
        name: _("2 Cylinder Engine"),
        category: 1,
        price: 3500n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(9), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 3500n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 300},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 100},
        ],
        isFromShop: true
    },
    {
        id: 5,
        name: _("Silver Drill"),
        category: 1,
        price: 5500n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(10), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 5500n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 300},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 50},
        ],
        isFromShop: true
    },
    {
        id: 6,
        name: _("Triple Fan"),
        category: 1,
        price: 15000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(11), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 15000n},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 900},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 200},
        ],
        isFromShop: true
    },
    {
        id: 7,
        name: _("Micro Cargo"),
        category: 1,
        price: 15000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(12), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 15000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 125},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 15},
        ],
        isFromShop: true
    },
    {
        id: 8,
        name: _("4 Cylinder Engine"),
        category: 1,
        price: 50000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(13), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 50000n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 4000},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 1500},
        ],
        isFromShop: true
    },
    {
        id: 9,
        name: _("Platinum Drill"),
        category: 1,
        price: 50000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(14), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 50000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 200},
        ],
        isFromShop: true
    },
    {
        id: 10,
        name: _("Quad Fan"),
        category: 1,
        price: 100000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(15), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 100000n},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 5000}
        ],
        isFromShop: true
    },
    {
        id: 11,
        name: _("Small Cargo"),
        category: 1,
        price: 150000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(16), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 500},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 200},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 50},
        ],
        isFromShop: true
    },
    {
        id: 12,
        name: _("6 Cylinder Engine"),
        category: 1,
        price: 300000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(17), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 300000n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 3000},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 1000},
        ],
        isFromShop: true
    },
    {
        id: 13,
        name: _("Triplatinum Drill"),
        category: 1,
        price: 600000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(18), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 600000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 6000},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 200},
        ],
        isFromShop: true
    },
    {
        id: 14,
        name: _("Partitioned Fan"),
        category: 1,
        price: 600000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(19), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 600000n},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 8000},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 3000},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 1000},
        ],
        isFromShop: true
    },
    {
        id: 15,
        name: _("Decent Cargo"),
        category: 1,
        price: 1000000n,
        shopSubcategory: _("Starter Blueprints"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(20), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1000000n},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 25},
        ],
        isFromShop: true
    },

    //###########################################
    //################## GOLEM ##################
    //###########################################
    {
        id: 16,
        name: _("Basic Nuclear Engine"),
        category: 1,
        price: 10000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(21), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 10000000n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 300}
        ],
        isFromShop: true
    },
    {
        id: 17,
        name: _("Spike Drill"),
        category: 1,
        price: 20000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(22), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 20000000n},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 10000}
        ],
        isFromShop: true
    },
    {
        id: 18,
        name: _("Multi Partitioned Fan"),
        category: 1,
        price: 25000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(23), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 25000000n},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 100000}
        ],
        isFromShop: true
    },
    {
        id: 19,
        name: _("Large Cargo"),
        category: 1,
        price: 20000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(24), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 20000000n},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 50000}
        ],
        isFromShop: true
    },
    {
        id: 20,
        name: _("Intermediate Nuclear Engine"),
        category: 1,
        price: 150000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(25), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150000000n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 200}
        ],
        isFromShop: true
    },
    {
        id: 21,
        name: _("Barbaric Drill"),
        category: 1,
        price: 200000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(26), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 200000000n},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 150000},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 100000}
        ],
        isFromShop: true
    },
    {
        id: 22,
        name: _("Heat Pump"),
        category: 1,
        price: 300000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(27), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 300000000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 250000},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 50000}
        ],
        isFromShop: true
    },
    {
        id: 23,
        name: _("Huge Cargo"),
        category: 1,
        price: 300000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(28), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 300000000n},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 600},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 500}
        ],
        isFromShop: true
    },
    {
        id: 24,
        name: _("Advanced Nuclear Engine"),
        category: 1,
        price: 1500000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(29), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1500000000n},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 500},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 50},
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 5}
        ],
        isFromShop: true
    },
    {
        id: 25,
        name: _("Monster Drill"),
        category: 1,
        price: 1750000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(30), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1750000000n},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 100},
        ],
        isFromShop: true
    },
    {
        id: 26,
        name: _("Segmented Heat Pump"),
        category: 1,
        price: 1350000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(31), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1350000000n},
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 150000},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 10000}
        ],
        isFromShop: true
    },
    {
        id: 27,
        name: _("Giant Cargo"),
        category: 1,
        price: 3500000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(32), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 3500000000n},
            {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 250}
        ],
        isFromShop: true
    },
    {
        id: 28,
        name: _("Fission Engine"),
        category: 1,
        price: 10000000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(33), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 10000000000n},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 3000},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 1500},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 500}
        ],
        isFromShop: true
    },
    {
        id: 29,
        name: _("Sifting Drill"),
        category: 1,
        price: 8000000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(34), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 8000000000n},
            {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 1500000},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 150000},
        ],
        isFromShop: true
    },
    {
        id: 30,
        name: _("Hydrogen Coolant System"),
        category: 1,
        price: 8000000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(35), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 8000000000n},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 30000},
        ],
        isFromShop: true
    },
    {
        id: 31,
        name: _("Enormous Cargo"),
        category: 1,
        price: 20000000000n,
        shopSubcategory: _("Golem"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(36), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 6000000000n},
            {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 30000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 500}
        ],
        isFromShop: true
    },

    //############################################
    //############### BROKEN ROBOT ###############
    //############################################
    {
        id: 32,
        name: _("Drill King Engine"),
        category: 1,
        price: 55000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(37), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 55000000000n},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 1000}
        ],
        isFromShop: true
    },
    {
        id: 33,
        name: _("Drill Smasher"),
        category: 1,
        price: 45000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(38), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 45000000000n},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 100},
        ],
        isFromShop: true
    },
    {
        id: 34,
        name: _("Bihydrogen Coolant System"),
        category: 1,
        price: 40000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(39), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 40000000000n},
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 300000},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 100000}
        ],
        isFromShop: true
    },
    {
        id: 35,
        name: _("Extreme Industrial Cargo"),
        category: 1,
        price: 50000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(40), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 50000000000n},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 100}
        ],
        isFromShop: true
    },
    {
        id: 36,
        name: _("Drill Lord Engine"),
        category: 1,
        price: 180000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(41), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 180000000000n},
            {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 3000},
            {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 75}
        ],
        isFromShop: true
    },
    {
        id: 37,
        name: _("Smasher Drill"),
        category: 1,
        price: 160000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(42), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 160000000000n},
            {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 250000},
            {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 100},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 60000}
        ],
        isFromShop: true
    },
    {
        id: 38,
        name: _("Trihydrogen Coolant System"),
        category: 1,
        price: 150000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(43), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150000000000n},
            {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 150000},
            {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 15000}
        ],
        isFromShop: true
    },
    {
        id: 39,
        name: _("Gold King Cargo"),
        category: 1,
        price: 200000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(44), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 200000000000n},
            {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 150000}
        ],
        isFromShop: true
    },
    {
        id: 40,
        name: _("Seismic Resonance Engine"),
        category: 1,
        price: 1200000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(45), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1200000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 5},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 75}
        ],
        isFromShop: true
    },
    {
        id: 41,
        name: _("Lava Drill"),
        category: 1,
        price: 1200000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(46), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1200000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 30},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 5000000},
        ],
        isFromShop: true
    },
    {
        id: 42,
        name: _("Liquid Nitrogen Fan"),
        category: 1,
        price: 1000000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(47), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1000000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 10},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 4000000}
        ],
        isFromShop: true
    },
    {
        id: 43,
        name: _("City Capacity"),
        category: 1,
        price: 1000000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(48), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1000000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 32},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 40000}
        ],
        isFromShop: true
    },
    {
        id: 44,
        name: _("Gravity Engine"),
        category: 1,
        price: 7500000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(49), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 5500000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 200},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1500000},
            {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 100}
        ],
        isFromShop: true
    },
    {
        id: 45,
        name: _("Gravity Drill"),
        category: 1,
        price: 5000000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(50), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 5000000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 300},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 15000000}
        ],
        isFromShop: true
    },
    {
        id: 46,
        name: _("Pressure Cooled Fan"),
        category: 1,
        price: 4000000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(51), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 4000000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 100},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 10000000}
        ],
        isFromShop: true
    },
    {
        id: 47,
        name: _("Country Capacity"),
        category: 1,
        price: 3000000000000n,
        shopSubcategory: _("Broken Robot"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(52), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 3000000000000n},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 150},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 20000}
        ],
        isFromShop: true
    },
    //#####################################################
    //############### CHESTS ONLY CURRENTLY ###############
    //#####################################################
    {
        id: 48,
        name: _("Core Reactor Engine"),
        category: 1,
        price: 10000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(53), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 125}
        ],
        isFromShop: false
    },
    {
        id: 49,
        name: _("Irradiated Drill"),
        category: 1,
        price: 10000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(54), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000}
        ],
        isFromShop: false
    },
    {
        id: 50,
        name: _("9M PSI Pressure Fan"),
        category: 1,
        price: 10000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(55), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 500}
        ],
        isFromShop: false
    },
    {
        id: 51,
        name: _("Planet Capacity"),
        category: 1,
        price: 20000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(56), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
        ],
        isFromShop: false
    },
    {
        id: 52,
        name: _("Pressurized Reactor Engine"),
        category: 1,
        price: 25000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(57), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 100}
        ],
        isFromShop: false
    },
    {
        id: 53,
        name: _("Enhanced Irradiated Drill"),
        category: 1,
        price: 25000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(58), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 20000000},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 10000}
        ],
        isFromShop: false
    },
    {
        id: 54,
        name: _("Liquid Neon Coolant System"),
        category: 1,
        price: 25000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(59), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 500},
            {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 12500000},
            {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 7500000}
        ],
        isFromShop: false
    },
    {
        id: 55,
        name: _("Robo Anthropomorphic Engine"),
        category: 1,
        price: 50000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(60), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 3000000},
            {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 100}
        ],
        isFromShop: false
    },
    {
        id: 56,
        name: _("Dual Mantle Destoryer Drill"),
        category: 1,
        price: 50000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(61), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 750000000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000}
        ],
        isFromShop: false
    },
    {
        id: 57,
        name: _("Helium Coolant System"),
        category: 1,
        price: 50000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(62), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 30000}
        ],
        isFromShop: false
    },
    {
        id: 58,
        name: _("Rocket Engine"),
        category: 1,
        price: 100000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(63), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 4000},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 1000000000},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 3000}
        ],
        isFromShop: false
    },
    {
        id: 59,
        name: _("Temperature Hardened Drill"),
        category: 1,
        price: 100000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(64), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 4000}
        ],
        isFromShop: false
    },
    {
        id: 60,
        name: _("Vacuum Chilled Coolant System"),
        category: 1,
        price: 100000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(65), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
        ],
        isFromShop: false
    },

    //#####################################################
    //################### WORLD 2 (MOON) ##################
    //#####################################################
    {
        id: 61,
        name: _("Rocket Engine T2"),
        category: 1,
        price: 250000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(66), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 125000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
        ],
        isFromShop: true
    },
    {
        id: 62,
        name: _("Temperature Hardened Drill T2"),
        category: 1,
        price: 250000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(67), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 125000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(COAL_INDEX), quantity: 5000000},
            {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 5}
        ],
        isFromShop: true
    },
    {
        id: 63,
        name: _("Vacuum Chilled Coolant System T2"),
        category: 1,
        price: 250000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(68), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 125000000000000n},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 1000}
        ],
        isFromShop: true
    },
    {
        id: 64,
        name: _("Rocket Engine T3"),
        category: 1,
        price: 300000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(69), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 300000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 200000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 4000},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 40000}
        ],
        isFromShop: true
    },
    {
        id: 65,
        name: _("Temperature Hardened Drill T3"),
        category: 1,
        price: 250000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(70), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 250000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 10}
        ],
        isFromShop: true
    },
    {
        id: 66,
        name: _("Vacuum Chilled Coolant System T3"),
        category: 1,
        price: 150000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(71), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150000000000000n},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 100000}
        ],
        isFromShop: true
    },
    {
        id: 67,
        name: _("Rocket Engine T4"),
        category: 1,
        price: 500000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(72), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 500000000000000n},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(NITROGEN2_INDEX), quantity: 5}
        ],
        isFromShop: true
    },
    {
        id: 68,
        name: _("Temperature Hardened Drill T4"),
        category: 1,
        price: 250000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(73), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 250000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 5},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 2000000}
        ],
        isFromShop: true
    },
    {
        id: 69,
        name: _("Vacuum Chilled Coolant System T4"),
        category: 1,
        price: 300000000000000n,
        shopSubcategory: _("Lunar Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(74), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 300000000000000n},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 5000}
        ],
        isFromShop: true
    },
    {
        id: 70,
        name: _("Solid Fuel Rocket Engine T1"),
        category: 1,
        price: 1200000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(75), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 75},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 250},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 10000000},
        ],
        isFromShop: false
    },
    {
        id: 71,
        name: _("Vibration Drill T1"),
        category: 1,
        price: 1400000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(76), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 2000000},
            {item: new MineralCraftingItem(NITROGEN2_INDEX), quantity: 350},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 2500}
        ],
        isFromShop: false
    },
    {
        id: 72,
        name: _("Low Gravity Coolant System T1"),
        category: 1,
        price: 1500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(77), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 3500000},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 5000}
        ],
        isFromShop: false
    },
    {
        id: 73,
        name: _("Solid Fuel Rocket Engine T2"),
        category: 1,
        price: 2500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(78), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 5},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 75},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 10000}
        ],
        isFromShop: false
    },
    {
        id: 74,
        name: _("Vibration Drill T2"),
        category: 1,
        price: 3000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(79), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 10},
            {item: new MineralCraftingItem(NITROGEN2_INDEX), quantity: 400},
            {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 20000000},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 2500}
        ],
        isFromShop: false
    },
    {
        id: 75,
        name: _("Low Gravity Coolant System T2"),
        category: 1,
        price: 3500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(80), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 20},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 3500}
        ],
        isFromShop: false
    },
    {
        id: 76,
        name: _("Solid Fuel Rocket Engine T3"),
        category: 1,
        price: 5000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(81), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 15000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
        ],
        isFromShop: false
    },
    {
        id: 77,
        name: _("Vibration Drill T3"),
        category: 1,
        price: 7000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(82), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 15000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 1000},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
        ],
        isFromShop: false
    },
    {
        id: 78,
        name: _("Low Gravity Coolant System T3"),
        category: 1,
        price: 9000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(83), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 20000},
            {item: new MineralCraftingItem(HELIUM2_INDEX), quantity: 4000},
            {item: new MineralCraftingItem(HELIUM3_INDEX), quantity: 20}
        ],
        isFromShop: false
    },

    //###################### ROBOT MK2 ##############################
    {
        id: 79,
        name: _("Bipropellant Rocket Engine T1"),
        category: 1,
        price: 6000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(84), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 6000000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(HELIUM3_INDEX), quantity: 50}
        ],
        isFromShop: true
    },
    {
        id: 80,
        name: _("Mounded Drill T1"),
        category: 1,
        price: 7000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(85), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 7000000000000000n},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(HELIUM3_INDEX), quantity: 25},
        ],
        isFromShop: true
    },
    {
        id: 81,
        name: _("Conductive Heat Disperser T1"),
        category: 1,
        price: 9000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(86), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 9000000000000000n},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(HELIUM3_INDEX), quantity: 25},
        ],
        isFromShop: true
    },
    {
        id: 82,
        name: _("Bipropellant Rocket Engine T2"),
        category: 1,
        price: 40000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(87), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 40000000000000000n},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 35000000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 50000}
        ],
        isFromShop: true
    },
    {
        id: 83,
        name: _("Mounded Drill T2"),
        category: 1,
        price: 30000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(88), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 30000000000000000n},
            {item: new MineralCraftingItem(CARBON_INDEX), quantity: 35000000},
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 50000}
        ],
        isFromShop: true
    },
    {
        id: 84,
        name: _("Conductive Heat Disperser T2"),
        category: 1,
        price: 40000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(89), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 40000000000000000n},
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 35000000},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 35000}
        ],
        isFromShop: true
    },
    {
        id: 85,
        name: _("Bipropellant Rocket Engine T3"),
        category: 1,
        price: 110000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(90), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 110000000000000000n},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 2000000},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 100},
        ],
        isFromShop: true
    },
    {
        id: 86,
        name: _("Mounded Drill T3"),
        category: 1,
        price: 140000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(91), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 140000000000000000n},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 200000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 100},
        ],
        isFromShop: true
    },
    {
        id: 87,
        name: _("Conductive Heat Disperser T3"),
        category: 1,
        price: 120000000000000000n,
        shopSubcategory: _("Robot MK2"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(92), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 120000000000000000n},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 30000000},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 100},
        ],
        isFromShop: true
    },

    //###################### DISCOVERED MOON DRILLS #################################
    {
        id: 88,
        name: _("Reaction Mass Engine T1"),
        category: 1,
        price: 48750000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(93), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 487500000000000000n},
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 4000000000000},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 100}
        ],
        isFromShop: false
    },
    {
        id: 89,
        name: _("Regolith Agitator Drill T1"),
        category: 1,
        price: 37500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(94), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 375000000000000000n},
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 2000000000000},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 75}
        ],
        isFromShop: false
    },
    {
        id: 90,
        name: _("Thermal Balancer T1"),
        category: 1,
        price: 41250000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(95), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 412500000000000000n},
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 2000000000000},
            {item: new MineralCraftingItem(SILICON_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 75}
        ],
        isFromShop: false
    },
    {
        id: 91,
        name: _("Reaction Mass Engine T2"),
        category: 1,
        price: 167500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(96), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1675000000000000000n},
            {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 5000},
            {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 10}
        ],
        isFromShop: false
    },
    {
        id: 92,
        name: _("Regolith Agitator Drill T2"),
        category: 1,
        price: 135000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(97), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1350000000000000000n},
            {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 50000},
            {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 10}
        ],
        isFromShop: false
    },
    {
        id: 93,
        name: _("Thermal Balancer T2"),
        category: 1,
        price: 10500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(98), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 105000000000000000n},
            {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 5}
        ],
        isFromShop: false
    },
    {
        id: 94,
        name: _("Reaction Mass Engine T3"),
        category: 1,
        price: 150000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(99), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1500000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 100},
            {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 10},
        ],
        isFromShop: false
    },
    {
        id: 95,
        name: _("Regolith Agitator Drill T3"),
        category: 1,
        price: 112500000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(100), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1125000000000000000n},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 20000000},
            {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 20000000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 100},
        ],
        isFromShop: false
    },
    {
        id: 96,
        name: _("Thermal Balancer T3"),
        category: 1,
        price: 765000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(101), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 7650000000000000000n},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 10000000000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 100},
        ],
        isFromShop: false
    },
    {
        id: 97,
        name: _("Laser Powered Engine T1"),
        category: 1,
        price: 5400000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(102), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 54000000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 10},
            {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 3},
        ],
        isFromShop: false
    },
    {
        id: 98,
        name: _("Laser Assisted Drill T1"),
        category: 1,
        price: 1150000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(103), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 11500000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 400000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 10},
            {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 3},
        ],
        isFromShop: false
    },
    {
        id: 99,
        name: _("Radiant Heat Disperser T1"),
        category: 1,
        price: 1002000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(104), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 10020000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 300000},
            {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 5},
        ],
        isFromShop: false
    },
    {
        id: 100,
        name: _("Laser Powered Engine T2"),
        category: 1,
        price: 20000000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(105), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 200000000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 5},
        ],
        isFromShop: false
    },
    {
        id: 101,
        name: _("Laser Assisted Drill T2"),
        category: 1,
        price: 6000000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(106), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 60000000000000000000n},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 20000000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 80000},
            {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 5},
        ],
        isFromShop: false
    },
    {
        id: 102,
        name: _("Radiant Heat Disperser T2"),
        category: 1,
        price: 5520000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(107), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 55200000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 4000000},
            {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 8},
        ],
        isFromShop: false
    },
    {
        id: 103,
        name: _("Laser Powered Engine T3"),
        category: 1,
        price: 40200000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(108), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 402000000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 5000000},
            {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 2},
        ],
        isFromShop: false
    },
    {
        id: 104,
        name: _("Laser Assisted Drill T3"),
        category: 1,
        price: 44000000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(109), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 440000000000000000000n},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 30000000},
            {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 100000000},
            {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 1},
        ],
        isFromShop: false
    },
    {
        id: 105,
        name: _("Radiant Heat Disperser T3"),
        category: 1,
        price: 36600000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(110), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 366000000000000000000n},
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 100000000},
            {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 1},
        ],
        isFromShop: false
    },
    {
        id: 106,
        name: _("Vacuum Packed Cargo"),
        category: 1,
        price: 15000000000000000n,
        shopSubcategory: _("Discovered"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(111), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 150000000000000000n},
            {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 300},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50},
        ],
        isFromShop: false
    },

    //########################################
    //####### TITAN STARTER BLUEPRINTS #######
    //########################################

    {
        id: 107,
        name: _("Submersive Engine T1"),
        category: 1,
        price: 650000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(112), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 5000000},
            {item: new MineralCraftingItem(TIN_INDEX), quantity: 1000},
        ],
        isFromShop: true
    },
    {
        id: 108,
        name: _("Submersive Drill T1"),
        category: 1,
        price: 480000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(113), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(TIN_INDEX), quantity: 10000},

        ],
        isFromShop: true
    },
    {
        id: 109,
        name: _("Submersive Heat Disperser T1"),
        category: 1,
        price: 320000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(114), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TIN_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 30},
        ],
        isFromShop: true
    },
    {
        id: 110,
        name: _("Submersive Engine T2"),
        category: 1,
        price: 920000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(115), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(TIN_INDEX), quantity: 200000},
            {item: new MineralCraftingItem(SULFUR_INDEX), quantity: 15000},
            {item: new MineralCraftingItem(HYDROGEN1_INDEX), quantity: 5000},
        ],
        isFromShop: true
    },
    {
        id: 111,
        name: _("Submersive Drill T2"),
        category: 1,
        price: 750000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(116), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(SULFUR_INDEX), quantity: 200000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
            {item: new MineralCraftingItem(HYDROGEN2_INDEX), quantity: 2000},

        ],
        isFromShop: true
    },
    {
        id: 112,
        name: _("Submersive Heat Disperser T2"),
        category: 1,
        price: 650000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(117), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(SULFUR_INDEX), quantity: 500000},
            {item: new MineralCraftingItem(HYDROGEN3_INDEX), quantity: 1000},
        ],
        isFromShop: true
    },
    {
        id: 113,
        name: _("Double Vacuum Packed Cargo"),
        category: 1,
        price: 75000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Cargo"),
        craftedItem: {item: new DrillCraftingItem(118), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 750000000000000000000n},
            {item: new MineralCraftingItem(SULFUR_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 15},
            {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
        ],
        isFromShop: true
    },
    {
        id: 114,
        name: _("Submersive Engine T3"),
        category: 1,
        price: 30200000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(119), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1500000000000000000000n},
            {item: new MineralCraftingItem(LITHIUM_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(HYDROGEN1_INDEX), quantity: 50000},
        ],
        isFromShop: true
    },
    {
        id: 115,
        name: _("Submersive Drill T3"),
        category: 1,
        price: 33000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(120), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1300000000000000000000n},
            {item: new MineralCraftingItem(TIN_INDEX), quantity: 2000000},
            {item: new MineralCraftingItem(OXYGEN1_INDEX), quantity: 500}
        ],
        isFromShop: true
    },
    {
        id: 116,
        name: _("Submersive Heat Disperser T3"),
        category: 1,
        price: 27600000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(121), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 1000000000000000000000n},
            {item: new MineralCraftingItem(SULFUR_INDEX), quantity: 2000000},
            {item: new MineralCraftingItem(OXYGEN2_INDEX), quantity: 50}
        ],
        isFromShop: true
    },
    {
        id: 117,
        name: _("Submersive Engine T4"),
        category: 1,
        price: 30200000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Engines"),
        craftedItem: {item: new DrillCraftingItem(122), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 3000000000000000000000n},
            {item: new MineralCraftingItem(HYDROGEN1_INDEX), quantity: 200000},
            {item: new MineralCraftingItem(HYDROGEN2_INDEX), quantity: 100000},
            {item: new MineralCraftingItem(OXYGEN3_INDEX), quantity: 5},
        ],
        isFromShop: true
    },
    {
        id: 118,
        name: _("Submersive Drill T4"),
        category: 1,
        price: 33000000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Drills"),
        craftedItem: {item: new DrillCraftingItem(123), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 2800000000000000000000n},
            {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(OXYGEN3_INDEX), quantity: 5},
        ],
        isFromShop: true
    },
    {
        id: 119,
        name: _("Submersive Heat Disperser T4"),
        category: 1,
        price: 27600000000000000000n,
        shopSubcategory: _("Titan Starter"),
        subcategory: _("Fans"),
        craftedItem: {item: new DrillCraftingItem(124), quantity: 1},
        ingredients: [
            {item: new MoneyCraftingItem(), quantity: 2700000000000000000000n},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 200},
            {item: new MineralCraftingItem(OXYGEN3_INDEX), quantity: 5},
        ],
        isFromShop: true
    },
    //!!!!!!!!!!!!!!!!! AS NEW DRILL EQUIPS ARE ADDED SAVE THEM IN SAVE MANAGER !!!!!!!!!!!!!!!!!
];

var weaponBlueprints = [
    {
        id: 0,
        name: _("Fist"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(0), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 3}
                ]
            }
        ]
    },
    {
        id: 1,
        name: _("Rock"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(1), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 4}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 8}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 4}
                ]
            }
        ]
    },
    {
        id: 2,
        name: _("Mallet"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(2), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 6}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 3},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 8}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 8},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 15}
                ]
            }
        ]
    },
    {
        id: 3,
        name: _("Bow and Arrow"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(3), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 3}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 20}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 3}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 500},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 300}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 150},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 15}
                ]
            }
        ]
    },
    {
        id: 4,
        name: _("Pickaxe"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(4), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 15}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 100},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 500},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 300}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 150},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 15}
                ]
            }
        ]
    },
    {
        id: 5,
        name: _("Small Bomb"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(5), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 3},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 100},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 20}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 175},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 150},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 15}
                ]
            }
        ]
    },
    {
        id: 6,
        name: _("Sword"),
        category: 2,
        subcategory: _("Simple Weapons"),
        craftedItem: {item: new WeaponCraftingItem(6), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 12}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 15}
                ]
            },
        ]
    },
    {
        id: 7,
        name: _("Big Bomb"),
        category: 2,
        subcategory: _("Advanced Weapons"),
        craftedItem: {item: new WeaponCraftingItem(7), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 3}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 3},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 3}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 100},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 20}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000},
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 175},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 150},
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 15}
                ]
            }
        ]
    },
    {
        id: 8,
        name: _("Gun"),
        category: 2,
        subcategory: _("Advanced Weapons"),
        craftedItem: {item: new WeaponCraftingItem(8), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 5},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 150}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 3}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                ]
            }
        ]
    },
    {
        id: 9,
        name: _("Plasma Gun"),
        category: 2,
        subcategory: _("Advanced Weapons"),
        craftedItem: {item: new WeaponCraftingItem(9), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 5},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 200}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 2},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 250}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 2},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 500}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 12},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 20},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 35},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 500},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 10000000}
                ]
            }
        ]
    },
    {
        id: 10,
        name: _("Heal HP"),
        category: 2,
        subcategory: _("Utility"),
        craftedItem: {item: new WeaponCraftingItem(10), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 5},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 200}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 4},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 250}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 500}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 20},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
                ]
            }
        ]
    },
    {
        id: 11,
        name: _("Time Travel"),
        category: 2,
        subcategory: _("Utility"),
        craftedItem: {item: new WeaponCraftingItem(11), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 200}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 250}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 5},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 10},
                    {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 25},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
                ]
            },
            {
                ingredients: [
                    {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 40},
                    {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 4000}
                ]
            }
        ]
    }
];

var structureBlueprints = [
    {
        id: 0,
        name: _("Trading Post"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(0), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(COPPER_INDEX), quantity: 800},
                    {item: new MineralCraftingItem(SILVER_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(GOLD_INDEX), quantity: 2}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 5},
                    {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 50000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(COAL_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 50000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 80},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 200},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 200},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 5000},
                ]
            }
        ]
    },
    {
        id: 1,
        name: _("Metal Detector"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(1), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1},
                    {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 4},
                    {item: new MineralCraftingItem(PAINITE_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 100000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 100},

                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 8000},
                    {item: new MineralCraftingItem(LITHIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(HYDROGEN1_INDEX), quantity: 1000000},
                ]
            }
        ]
    },
    {
        id: 2,
        name: _("Manager"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(2), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1},
                    {item: new MineralCraftingItem(DIAMOND_INDEX), quantity: 100}

                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 50},
                ]
            }
        ]
    },
    {
        id: 3,
        name: _("Gem Forge"),
        category: 3,
        subcategory: _("Underground City"),
        craftedItem: {item: new StructureCraftingItem(3), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 5},
                    {item: new MoneyCraftingItem(), quantity: 1000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 16}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 15},
                    {item: new MoneyCraftingItem(), quantity: 4000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 30},
                    {item: new MoneyCraftingItem(), quantity: 40000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 2000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 80},
                    {item: new MoneyCraftingItem(), quantity: 400000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 4000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 160},
                    {item: new MoneyCraftingItem(), quantity: 5000000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 6000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 320},
                    {item: new MoneyCraftingItem(), quantity: 100000000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 8000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MoneyCraftingItem(), quantity: 1000000000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 11000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MoneyCraftingItem(), quantity: 50000000000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 15000}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MoneyCraftingItem(), quantity: 1000000000000000000000n},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 20000}
                ]
            }
        ]
    },
    {
        id: 4,
        name: _("Oil Rig"),
        category: 3,
        subcategory: _("Underground City"),
        craftedItem: {item: new StructureCraftingItem(4), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 5},
                    {item: new MoneyCraftingItem(), quantity: 100000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 7},
                    {item: new MoneyCraftingItem(), quantity: 250000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                    {item: new MoneyCraftingItem(), quantity: 500000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 15},
                    {item: new MoneyCraftingItem(), quantity: 1000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 20},
                    {item: new MoneyCraftingItem(), quantity: 2000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 30},
                    {item: new MoneyCraftingItem(), quantity: 3000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 40},
                    {item: new MoneyCraftingItem(), quantity: 5000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MoneyCraftingItem(), quantity: 8000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 75},
                    {item: new MoneyCraftingItem(), quantity: 40000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 90},
                    {item: new MoneyCraftingItem(), quantity: 80000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MoneyCraftingItem(), quantity: 400000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 150},
                    {item: new MoneyCraftingItem(), quantity: 2000000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MoneyCraftingItem(), quantity: 40000000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MoneyCraftingItem(), quantity: 500000000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MoneyCraftingItem(), quantity: 20000000000000000000n}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MoneyCraftingItem(), quantity: 600000000000000000000n}
                ]
            }
        ]
    },
    {
        id: 5,
        name: _("Moon Trading Post"),
        category: 3,
        subcategory: _("Moon"),
        craftedItem: {item: new StructureCraftingItem(5), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(IRON_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 75},
                    {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 100000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 50000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 150},
                    {item: new MineralCraftingItem(SILICON_INDEX), quantity: 100000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 200},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 400},
                    {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 20},
                ]
            }
        ]
    },
    {
        id: 6,
        name: _("Buff Lab"),
        category: 3,
        subcategory: _("Deep Moon"),
        craftedItem: {item: new StructureCraftingItem(6), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 400000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 3000000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 200},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 400},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 8000000},
                ]
            }
        ]
    },
    {
        id: 7,
        name: _("Reactor"),
        category: 3,
        subcategory: _("Deep Moon"),
        craftedItem: {item: new ReactorLevelCraftingItem(7), quantity: 1},
        levels: [
            {},
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 25},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 200000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 100}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 750000},
                    {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1500000},
                    {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 30}
                ]
            }
        ]
    },
    {
        id: 8,
        name: _("Chest Collector Storage"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(8), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 5},
                    {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 15000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 200},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 80},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 150},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 125},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 200},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 75},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 300},
                    {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 50000000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 100},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 200},
                ]
            }
        ]
    },
    {
        id: 9,
        name: _("Chest Collector Chance"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(9), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 15000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 20},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 200},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 150},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 500},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 25000000},
                    {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 25}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1500},
                    {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
                ]
            }
        ]
    },
    {
        id: 10,
        name: _("Max Drone Fuel"),
        category: 3,
        subcategory: _("Cave"),
        craftedItem: {item: new StructureCraftingItem(10), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 200000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 25},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 2000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 150},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 120},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 500},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 25000000},
                    {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 25}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1500},
                    {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
                ]
            }
        ]
    },
    {
        id: 11,
        name: _("Drone Fuel Regen"),
        category: 3,
        subcategory: _("Cave"),
        craftedItem: {item: new StructureCraftingItem(11), quantity: 1},
        levels: [
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 10},
                    {item: new MineralCraftingItem(BLACK_OPAL_INDEX), quantity: 200000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 25},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 20000},
                    {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 2000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 150},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 120},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 5000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 500},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(CARBON_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 25000000},
                    {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 25}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(NEODYMIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 10}
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1500},
                    {item: new MineralCraftingItem(YTTERBIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
                ]
            }
        ]
    },
    {
        id: 12,
        name: _("Chest Compressor"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(12), quantity: 1},
        levels: [
            {
                //free
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 50},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 100000},
                    {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 200},
                    {item: new MineralCraftingItem(IRON_INDEX), quantity: 50000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 400},
                    {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 600},
                    {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 500000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1400},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 50000000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50},
                ]
            }
        ]
    },
    {
        id: 13,
        name: _("Chest Compressor Time"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(13), quantity: 1},
        levels: [
            {
                //free
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
                    {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 200},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 20000000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 15000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 300},
                    {item: new MineralCraftingItem(CARBON_INDEX), quantity: 750000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 400},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 50000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 600},
                    {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(NITROGEN2_INDEX), quantity: 50000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1400},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 50000000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 2000},
                    {item: new MineralCraftingItem(TIN_INDEX), quantity: 100000000},
                    {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 3000},
                    {item: new MineralCraftingItem(LITHIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
                ]
            }
        ]
    },
    {
        id: 14,
        name: _("Chest Compressor Slots"),
        category: 3,
        subcategory: _("Top Level"),
        craftedItem: {item: new StructureCraftingItem(14), quantity: 1},
        levels: [
            {
                //free
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 100},
                    {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 20000000},
                    {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 250},
                    {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 20000000},
                    {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 1000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(IRON_INDEX), quantity: 500000},
                    {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 750},
                    {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(OIL_INDEX), quantity: 10000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 1000},
                    {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 5000000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 2000},
                    {item: new MineralCraftingItem(TITANIUM_INDEX), quantity: 5000000},
                    {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 500000},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 3000},
                    {item: new MineralCraftingItem(PROMETHIUM_INDEX), quantity: 50000000},
                    {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 500},
                    {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 50},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 4000},
                    {item: new MineralCraftingItem(TIN_INDEX), quantity: 100000000},
                    {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 10},
                ]
            },
            {
                ingredients: [
                    {item: new MineralCraftingItem(BUILDING_MATERIALS_INDEX), quantity: 5000},
                    {item: new MineralCraftingItem(LITHIUM_INDEX), quantity: 10000000},
                    {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 5},
                ]
            }
        ]
    },
];

var forgeGemsBlueprints = [
    {
        id: 0,
        name: _("Red Forged Gem"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 600,
        forgeCost: 1,
        craftedItem: {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(RED_DIAMOND_INDEX), quantity: 2000}
        ]
    },
    {
        id: 1,
        name: _("Blue Forged Gem"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 1800,
        forgeCost: 2,
        craftedItem: {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(BLUE_OBSIDIAN_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1},
            {item: new MoneyCraftingItem(), quantity: 10000000000n}
        ]
    },
    {
        id: 2,
        name: _("Green Forged Gem"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 14400,
        forgeCost: 3,
        craftedItem: {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(COLTAN_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 10000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 4},
            {item: new MoneyCraftingItem(), quantity: 30000000000n}
        ]
    },
    {
        id: 3,
        name: _("Purple Forged Gem"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 57600,
        forgeCost: 4,
        craftedItem: {item: new GemCraftingItem(PURPLE_FORGED_GEM_INDEX), quantity: 1},
        ingredients: [
            {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 25},
            {item: new GemCraftingItem(BLUE_FORGED_GEM_INDEX), quantity: 25},
            {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 25},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 16},
            {item: new MoneyCraftingItem(), quantity: 500000000000n}
        ]
    },
    {
        id: 4,
        name: _("Yellow Forged Gem"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 172800,
        forgeCost: 6,
        craftedItem: {item: new GemCraftingItem(YELLOW_FORGED_GEM_INDEX), quantity: 1},
        ingredients: [
            {item: new GemCraftingItem(RED_FORGED_GEM_INDEX), quantity: 25},
            {item: new GemCraftingItem(GREEN_FORGED_GEM_INDEX), quantity: 25},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 200},
            {item: new MoneyCraftingItem(), quantity: 1500000000000n}
        ]
    },
    {
        id: 5,
        name: _("Forge Catalyst"),
        category: 4,
        subcategory: _("Gems"),
        forgeTimeSeconds: 300,
        forgeCost: 1,
        craftedItem: {item: new GemCraftingItem(FORGE_CATALYST_INDEX), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 4},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 150},
            {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 75},
            {item: new MoneyCraftingItem(), quantity: 5000000000n}
        ]
    }
];

//DEPRECATED - NOW IN STRUCTURES BLUEPRINTS ABOVE
var reactorLevelBlueprints = [
    {
        id: 0,
        name: _("Level Up Reactor"),
        category: 5,
        subcategory: _("Reactor Level"),
        craftedItem: {item: new ReactorLevelCraftingItem(), quantity: 1},
        levels: []
    }
];

var reactorComponentBlueprints = [
    {
        id: 0,
        name: _("Highly Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_1), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 8000}, //
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 3000}, // Value of inputs = 31,800,000
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 500}
        ]
    },
    {
        id: 1,
        name: _("Dual Highly Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_2), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 16000}, //
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 6000},  // Value of inputs = 63,600,000
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 1000}   //
        ]
    },
    {
        id: 2,
        name: _("Quad Highly Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_3), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 32000},  //
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 12000},  // Value of inputs = 127,200,000
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 2000}
        ]
    },
    {
        id: 3,
        name: _("Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_4), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 72000}, // 3.3x Uranium over 6 hours
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 11500}  // .16x Uranium 1  
        ]
    },
    {
        id: 4,
        name: _("Dual Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_5), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 144000},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 23000}  // .16x Uranium 1 
        ]
    },
    {
        id: 5,
        name: _("Quad Enriched Uranium Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_6), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM1_INDEX), quantity: 288000},
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 46000}  // .16x Uranium 1  
        ]
    },
    {
        id: 6,
        name: _("Mixed Oxide Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_7), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 28800},     // 8x uranium2 in 10 hours
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 2880},      // 8x uranium3 in 10 hours
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 32700},   // 10 hours of Pu1
            {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 3270},    // 10 hours of Pu2
        ]
    },
    {
        id: 7,
        name: _("Dual Mixed Oxide Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_8), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 57600},
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 5760},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 65400},
            {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 6540},
        ]
    },
    {
        id: 8,
        name: _("Quad Mixed Oxide Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_9), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 115200},
            {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 11520},
            {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 130800},
            {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 13080},
        ]
    },
    {
        id: 9,
        name: _("Fan"),
        category: 6,
        subcategory: _("Fans"),
        craftedItem: {item: new ReactorCraftingItem(FAN_TYPE), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(ALUMINUM_INDEX), quantity: 2500000},
            {item: new MineralCraftingItem(OIL_INDEX), quantity: 1000}
        ]
    },
    {
        id: 10,
        name: _("Small Battery"),
        category: 6,
        subcategory: _("Batteries"),
        craftedItem: {item: new ReactorCraftingItem(BATTERY_TYPE_1), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 2500000}
        ]
    },
    {
        id: 11,
        name: _("Large Battery"),
        category: 6,
        subcategory: _("Batteries"),
        craftedItem: {item: new ReactorCraftingItem(BATTERY_TYPE_2), quantity: 1},
        ingredients: [
            {item: new ReactorCraftingItem(BATTERY_TYPE_1), quantity: 2},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 10000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 25000}
        ]
    },
    {
        id: 12,
        name: _("Extra Large Battery"),
        category: 6,
        subcategory: _("Batteries"),
        craftedItem: {item: new ReactorCraftingItem(BATTERY_TYPE_3), quantity: 1},
        ingredients: [
            {item: new ReactorCraftingItem(BATTERY_TYPE_2), quantity: 2},
            {item: new MineralCraftingItem(MAGNESIUM_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 400000}
        ]
    },
    {
        id: 13,
        name: _("Duct"),
        category: 6,
        subcategory: _("Ducts"),
        craftedItem: {item: new ReactorCraftingItem(DUCT_TYPE), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(IRON_INDEX), quantity: 15000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 2000}
        ]
    },
    {
        id: 14,
        name: _("Buff 1"),
        category: 6,
        subcategory: _("Buff"),
        craftedItem: {item: new ReactorCraftingItem(BUFF_TYPE_1), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(COPPER_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 200000}
        ]
    },
    {
        id: 15,
        name: _("Buff 2"),
        category: 6,
        subcategory: _("Buff"),
        craftedItem: {item: new ReactorCraftingItem(BUFF_TYPE_2), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(PLATINUM_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 500000}
        ]
    },
    {
        id: 16,
        name: _("Buff 3"),
        category: 6,
        subcategory: _("Buff"),
        craftedItem: {item: new ReactorCraftingItem(BUFF_TYPE_3), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(SILVER_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 500000}
        ]
    },
    {
        id: 17,
        name: _("Buff 4"),
        category: 6,
        subcategory: _("Buff"),
        craftedItem: {item: new ReactorCraftingItem(BUFF_TYPE_4), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(GOLD_INDEX), quantity: 50000000},
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1500000}
        ]
    },
    {
        id: 18,
        name: _("Californium Bombardment 1"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_10), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 15000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(HELIUM1_INDEX), quantity: 1000}
        ]
    },
    {
        id: 19,
        name: _("Californium Bombardment 2"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_11), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 150000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(HELIUM2_INDEX), quantity: 1000},
        ]
    },
    {
        id: 20,
        name: _("Californium Bombardment 3"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_12), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1500000},
            {item: new MineralCraftingItem(CALIFORNIUM_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(HELIUM3_INDEX), quantity: 1000},
        ]
    },
    {
        id: 21,
        name: _("Pu/Po Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_13), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 4000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 72500},
            {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 7250}, // Value of inputs = 4,175,000,000
        ]
    },
    {
        id: 22,
        name: _("Dual Pu/Po Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_14), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 8000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 145000},
            {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 14500},
        ]
    },
    {
        id: 23,
        name: _("Quad Pu/Po Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_15), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 16000},
            {item: new MineralCraftingItem(POLONIUM1_INDEX), quantity: 290000},
            {item: new MineralCraftingItem(POLONIUM2_INDEX), quantity: 29000},
        ]
    },
    {
        id: 24,
        name: _("Polonium RTG Fuel Rod"),
        category: 6,
        subcategory: _("Fuel Rods"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_16), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 2500},
        ]
    },
    {
        id: 25,
        name: _("Einsteinium Bombardment 1"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_17), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(NITROGEN1_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 10},
        ]
    },
    {
        id: 26,
        name: _("Einsteinium Bombardment 2"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_18), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 3000000},
            {item: new MineralCraftingItem(NITROGEN2_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 10},
        ]
    },
    {
        id: 27,
        name: _("Einsteinium Bombardment 3"),
        category: 6,
        subcategory: _("Neutron Bombardments"),
        craftedItem: {item: new ReactorCraftingItem(FUEL_ROD_TYPE_19), quantity: 1},
        ingredients: [
            {item: new MineralCraftingItem(NUCLEAR_ENERGY_INDEX), quantity: 9000000},
            {item: new MineralCraftingItem(NITROGEN3_INDEX), quantity: 1000000},
            {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 10},
        ]
    },
];



var craftingBlueprints = [
    componentBlueprints,
    drillBlueprints,
    weaponBlueprints,
    structureBlueprints,
    forgeGemsBlueprints,
    reactorLevelBlueprints,
    reactorComponentBlueprints
];

function hasUnseenDrillBlueprints()
{
    return hasUnseenBlueprints(1);
}

function hasUnseenStructureBlueprints()
{
    return hasUnseenBlueprints(3);
}

function hasUnseenWeaponBlueprints()
{
    return hasUnseenBlueprints(2);
}

function hasUnseenBlueprints(category)
{
    return unseenBlueprints.filter(bp => bp.startsWith(category + '.')).length;
}

