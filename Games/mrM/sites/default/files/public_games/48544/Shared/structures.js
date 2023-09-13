var structures = [];

class Structure
{
    id;
    translatedName;
    level = 0;
    maxLevel;
    icon;
    structureDescription = "";
    depthAvailable = 0;

    leveledStats = [];

    constructor(structureId, startingLevel)
    {
        this.id = structureId;
        this.level = startingLevel;
    }

    isMaxLevel()
    {
        return this.level >= this.maxLevel;
    }

    statValueForCurrentLevel(statIndex = 0)
    {
        return this.leveledStats[statIndex].perLvlValue[this.level - 1];
    }

    statValueForNextLevel(statIndex = 0)
    {
        if(this.level != this.maxLevel)
        {
            return this.leveledStats[statIndex].perLvlValue[this.level];
        }
        return 0;
    }
}

var tradingPostStructure = new Structure(0, 0);
tradingPostStructure.translatedName = _("Trading Post");
tradingPostStructure.maxLevel = 5;
tradingPostStructure.icon = tradingPostIcon;
tradingPostStructure.structureDescription = [_("Trade for minerals, chests, and more!"), ""];
tradingPostStructure.leveledStats = [
    {
        name: _("Trade Improvement"),
        perLvlValue: ["0%", "50%", "100%", "150%", "200%"]  //we should refactor this to not use strings so we can actually grab these values in a non jank way
    }
]
tradingPostStructure.depthAvailable = 0;
structures.push(tradingPostStructure);

var metalDetectorStructure = new Structure(1, 0);
metalDetectorStructure.translatedName = _("Metal Detector");
metalDetectorStructure.maxLevel = 6;
metalDetectorStructure.icon = metalDetectorIcon;
metalDetectorStructure.structureDescription = [
    _("Helps find chests within the mine."),
    _("Displays chest locations on scrollbar. Displays Gold chest expiration time."),
    _("Displays chests and gold chest locations on scrollbar. Displays Gold chest expiration time and location."),
    _("Pressing spacebar will jump to the top most chest"),
    _("Clicking anywhere on a level will open any chest on that level."),
    _("Natural chest spawns can be sent to the chest collector.")
];
metalDetectorStructure.leveledStats = [];
metalDetectorStructure.depthAvailable = 0;
structures.push(metalDetectorStructure);

var managerStructure = new Structure(2, 0);
managerStructure.translatedName = _("Manager");
managerStructure.maxLevel = 3;
managerStructure.icon = managerIcon;
managerStructure.structureDescription = [_("Manages your mine when you are offline and allows you to lock minerals"), ""];
managerStructure.leveledStats = [
    {
        name: _("Offline Efficiency"),
        perLvlValue: ["25%", "50%", "100%"]
    }
]
managerStructure.depthAvailable = 0;
structures.push(managerStructure);

var gemForgeStructure = new Structure(3, 1);
gemForgeStructure.translatedName = _("Gem Forge");
gemForgeStructure.maxLevel = 10;
gemForgeStructure.icon = gemforgeIcon;
gemForgeStructure.structureDescription = [_("Produces various valuable gems."), ""];
gemForgeStructure.leveledStats = [
    {
        name: _("Max Queue"),
        perLvlValue: [6, 8, 12, 20, 25, 30, 35, 40, 45, 50]
    }
]
gemForgeStructure.depthAvailable = 303;
structures.push(gemForgeStructure);

var oilrigStructure = new Structure(4, 0);
oilrigStructure.translatedName = _("Oil Rig");
oilrigStructure.maxLevel = 16;
oilrigStructure.icon = oilRigIcon;
oilrigStructure.structureDescription = [_("Produces oil at a certain rate."), ""];
oilrigStructure.leveledStats = [
    {
        name: _("Oil Capacity"),
        perLvlValue: [2, 4, 16, 32, 100, 200, 400, 1000, 2000, 4000, 8000, 12000, 16000, 20000, 25000, 30000]
    }
]
oilrigStructure.depthAvailable = 303;
structures.push(oilrigStructure);

var moonTradingPostStructure = new Structure(5, 0);
moonTradingPostStructure.translatedName = _("Moon Trading Post");
moonTradingPostStructure.maxLevel = 5;
moonTradingPostStructure.icon = moonTradingPostIcon;
moonTradingPostStructure.structureDescription = [_("Trade for minerals, chests, and more."), ""];
moonTradingPostStructure.leveledStats = [
    {
        name: _("Trade Improvement"),
        perLvlValue: ["0%", "50%", "100%", "150%", "200%"]
    }
]
moonTradingPostStructure.depthAvailable = 1047;
structures.push(moonTradingPostStructure);

var buffLabStructure = new Structure(6, 1);
buffLabStructure.translatedName = _("Buff Lab");
buffLabStructure.maxLevel = 5;
buffLabStructure.icon = buffLabIcon;
buffLabStructure.structureDescription = [_("Converts energy into buffs!"), ""];
buffLabStructure.leveledStats = [
    {
        name: _("Buff Discount"),
        perLvlValue: ["0%", "10%", "20%", "25%", "30%"]
    }
]
buffLabStructure.depthAvailable = 1135;
structures.push(buffLabStructure);

var reactorStructure = new Structure(7, 1);
reactorStructure.translatedName = _("Reactor");
reactorStructure.maxLevel = 5;
reactorStructure.icon = reactorIcon;
reactorStructure.structureDescription = [_("Converts resources into stored energy."), ""];
reactorStructure.leveledStats = [
    {
        name: _("Grid Cells"),
        perLvlValue: [9, 15, 25, 45, 81]
    }
]
reactorStructure.depthAvailable = 1133;
structures.push(reactorStructure);

var chestCollectorStorageStructure = new Structure(8, 0);
chestCollectorStorageStructure.translatedName = _("Chest Collector Storage");
chestCollectorStorageStructure.maxLevel = 10;
chestCollectorStorageStructure.icon = metalDetectorCollectorIcon;
chestCollectorStorageStructure.structureDescription = [_("Automatically collect and store chests."), ""];
chestCollectorStorageStructure.leveledStats = [
    {
        name: _("Chests Storage"),
        perLvlValue: [10, 25, 50, 75, 100, 120, 140, 160, 180, 200]
    }
]
chestCollectorStorageStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(chestCollectorStorageStructure);

var chestCollectorChanceStructure = new Structure(9, 0);
chestCollectorChanceStructure.translatedName = _("Chest Collector Chance");
chestCollectorChanceStructure.maxLevel = 10;
chestCollectorChanceStructure.icon = metalDetectorCollectorChanceIcon;
chestCollectorChanceStructure.structureDescription = [_("Chance of a chest being collected."), ""];
chestCollectorChanceStructure.leveledStats = [
    {
        name: _("Chest Storage Chance"),
        perLvlValue: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    }
]
chestCollectorChanceStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(chestCollectorChanceStructure);

var caveMaxFuelStructure = new Structure(10, 1);
caveMaxFuelStructure.translatedName = _("Max Drone Fuel");
caveMaxFuelStructure.maxLevel = 10;
caveMaxFuelStructure.icon = fuelIcon;
caveMaxFuelStructure.structureDescription = [_("Max fuel available in caves"), ""];
caveMaxFuelStructure.leveledStats = [
    {
        name: _("Max Fuel"),
        perLvlValue: [300, 350, 400, 450, 550, 600, 650, 700, 750, 800]
    }
]
caveMaxFuelStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(caveMaxFuelStructure);

var caveFuelRegenStructure = new Structure(11, 1);
caveFuelRegenStructure.translatedName = _("Drone Fuel Regen");
caveFuelRegenStructure.maxLevel = 10;
caveFuelRegenStructure.icon = fuelregenIcon;
caveFuelRegenStructure.structureDescription = [_("Speed of fuel regeneration"), ""];
caveFuelRegenStructure.leveledStats = [
    {
        name: _("Fuel Per Minute"),
        perLvlValue: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
    }
]
caveFuelRegenStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(caveFuelRegenStructure);

var chestCompressorStructure = new Structure(12, 0);
chestCompressorStructure.translatedName = _("Chest Compressor");
chestCompressorStructure.maxLevel = 8;
chestCompressorStructure.icon = compressorIcon;
chestCompressorStructure.structureDescription = [_("Conversion Rate"), ""];
chestCompressorStructure.leveledStats = [
    {
        name: _("Basics per gold chest"),
        perLvlValue: [18, 16, 14, 12, 10, 8, 7, 6]
    },
    {
        name: _("Golds per Ethereal chest"),
        perLvlValue: [6, 6, 5, 5, 4, 4, 3, 3]
    }
]
chestCompressorStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(chestCompressorStructure);

var chestCompressorTimeStructure = new Structure(13, 0);
chestCompressorTimeStructure.translatedName = _("Chest Compressor Time");
chestCompressorTimeStructure.maxLevel = 10;
chestCompressorTimeStructure.icon = compressorIcon;
chestCompressorTimeStructure.structureDescription = [_("Reduces chest compressor duration"), ""];
chestCompressorTimeStructure.leveledStats = [
    {
        name: _("Gold Chest Hours"),
        perLvlValue: [24, 22, 20, 18, 16, 14, 12, 10, 8, 6] //hours
    },
    {
        name: _("Ethereal Chest Hours"),
        perLvlValue: [48, 45, 42, 39, 36, 32, 28, 24, 20, 16] //hours
    }
]
chestCompressorTimeStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(chestCompressorTimeStructure);

var chestCompressorSlotStructure = new Structure(14, 0);
chestCompressorSlotStructure.translatedName = _("Chest Compressor Slots");
chestCompressorSlotStructure.maxLevel = 10;
chestCompressorSlotStructure.icon = compressorIcon;
chestCompressorSlotStructure.structureDescription = [_("Increases the number of chests you can convert at once."), ""];
chestCompressorSlotStructure.leveledStats = [
    {
        name: _("Compressor Queue slots"),
        perLvlValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //hours
    }
]
chestCompressorSlotStructure.depthAvailable = Number.MAX_SAFE_INTEGER;
structures.push(chestCompressorSlotStructure);


function learnReachedStructures()
{
    for(var i = 0; i < structures.length; i++)
    {
        if(depth >= structures[i].depthAvailable)
        {
            learnBlueprint(3, i, (depth > 0));
        }
    }

    if(depth > 700 && chestCompressorStructure.level < 1)
    {
        chestCompressorStructure.level = 1;
        learnBlueprint(3, 12);


        newNews(_("Discovered the Chest Compressor!"));
    }

    if(depth > 700 && chestCompressorSlotStructure.level < 1)
    {
        chestCompressorTimeStructure.level = 1;
        learnBlueprint(3, 13);
        chestCompressorSlotStructure.level = 1;
        learnBlueprint(3, 14);
    }
}