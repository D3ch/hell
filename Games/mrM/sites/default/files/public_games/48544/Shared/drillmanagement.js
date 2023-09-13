// ############################################################
// ######################## SAVED VALUES ######################
// ############################################################

var depth = 0;
var progressTowardsNextDepth = 0n;
var inventory = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1]
];
var hasLaunched = 0;

// ############################################################
// ######################## DRILL EQUIPS ######################
// ############################################################

const ENGINE_TYPE = 0;
const DRILL_TYPE = 1;
const DRILL_FAN_TYPE = 2;
const CARGO_TYPE = 3;

class DrillState
{
    equippedDrillEquips = []; //Was drill[]
    levelsTowardNextUpgrades = [0, 0, 0, 0];
    cachedWattage = 0n;
    isDirty = true;

    constructor()
    {
        this.equippedDrillEquips[ENGINE_TYPE] = 1;
        this.equippedDrillEquips[DRILL_TYPE] = 2;
        this.equippedDrillEquips[DRILL_FAN_TYPE] = 3;
        this.equippedDrillEquips[CARGO_TYPE] = 4;
    }

    engine()
    {
        return this.equipFromType(ENGINE_TYPE);
    }

    drill()
    {
        return this.equipFromType(DRILL_TYPE);
    }

    fan()
    {
        return this.equipFromType(DRILL_FAN_TYPE);
    }

    cargo()
    {
        return this.equipFromType(CARGO_TYPE);
    }

    equipFromType(type)
    {
        return getDrillEquipById(this.equippedDrillEquips[type]);
    }

    statForType(type, levelsTowardNextUpgrade, stat)
    {
        var currentUpgrade = this.equipFromType(type);
        var currentUpgradeStat = BigInt(currentUpgrade[stat]);

        if(levelsTowardNextUpgrade == 0)
        {
            return currentUpgradeStat;
        }
        else
        {
            var precentTowardNextUpgrade = levelsTowardNextUpgrade / 10;
            var percentOfMultiplierAddedPerLevel = 0.05;
            var percentOfMultiplierFromNextLevel = percentOfMultiplierAddedPerLevel * levelsTowardNextUpgrade;
            var percentOfMultiplierFromCurrentUpgrade = 1 - percentOfMultiplierFromNextLevel;

            currentMultiplier = doBigIntDecimalMultiplication(currentUpgradeStat, percentOfMultiplierFromCurrentUpgrade);

            var nextUpgrade = getDrillEquipByLevel(currentUpgrade.type, currentUpgrade.level + 1);
            if(typeof (nextUpgrade) === 'undefined')
            {
                nextUpgrade = currentUpgrade;
            }
            var nextUpgradeStat = BigInt(nextUpgrade[stat]);
            var nextMultiplier = doBigIntDecimalMultiplication(nextUpgradeStat, percentOfMultiplierFromNextLevel);


            if(precentTowardNextUpgrade < 1)
            {
                return currentMultiplier + nextMultiplier;
            }
            else
            {
                return nextUpgradeStat;
            }
        }
    }

    totalBaseWattage()
    {
        return this.statForType(ENGINE_TYPE, this.levelsTowardNextUpgrades[ENGINE_TYPE], "baseWatts") +
            this.statForType(DRILL_TYPE, this.levelsTowardNextUpgrades[DRILL_TYPE], "baseWatts") +
            this.statForType(DRILL_FAN_TYPE, this.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "baseWatts");
    }

    totalWattMultiplier()
    {
        return this.statForType(ENGINE_TYPE, this.levelsTowardNextUpgrades[ENGINE_TYPE], "wattMultiplier") *
            this.statForType(DRILL_TYPE, this.levelsTowardNextUpgrades[DRILL_TYPE], "wattMultiplier") *
            this.statForType(DRILL_FAN_TYPE, this.levelsTowardNextUpgrades[DRILL_FAN_TYPE], "wattMultiplier");
    }

    totalWattage()
    {
        if(this.isDirty)
        {
            this.cachedWattage = this.totalBaseWattage() * this.totalWattMultiplier();
            this.isDirty = false;
        }
        return this.cachedWattage;
    }
}
var drillState = new DrillState();


var drillEquips = [];
class DrillEquip
{
    id;
    translatedName;
    icon;
    worldAsset;

    type;
    level;
    baseWatts = 0n;
    wattMultiplier = 1n;
    capacity = 0;
    isVariant = false;

    isCrafted = false; //was Blueprints[x][10]
    //Blueprints[blueprintIndex][8] is isBlueprintKnown(1, blueprintIndex)
    //equipstats
    //[0] mult, [1] add, [2] worldAsset, [3] icon, [4] name, [5] level

    constructor(drillEquipId)
    {
        this.id = drillEquipId;
    }

    craftAndEquip()
    {
        this.isCrafted = true;

        //Equip
        if(drillState.equippedDrillEquips[this.type] < this.id)
        {
            drillState.equippedDrillEquips[this.type] = this.id;
            drillState.isDirty = true;

            newNews(_("{0} was automatically equipped", this.translatedName));
            trackeEvent_upgradeDrill(this.id);
            questManager.getQuest(36).markComplete();
        }
    }

    wattageWhenEquipped()
    {
        var equippedDrillEquipWithSameType = drillState.equipFromType(this.type);
        var newBaseWattage = drillState.totalBaseWattage() - equippedDrillEquipWithSameType.baseWatts + this.baseWatts;
        var newWattMultiplier = (drillState.totalWattMultiplier() / equippedDrillEquipWithSameType.wattMultiplier) * this.wattMultiplier;
        return newBaseWattage * newWattMultiplier;
    }

    wattagePercentIncrease()
    {
        return divideBigIntToDecimalNumber(this.wattageWhenEquipped() - drillState.totalWattage(), drillState.totalWattage(), 2) * 100;
    }

    increasedCapacityWhenEquipped()
    {
        if(this.capacity > 0)
        {
            return this.capacity - drillState.cargo();
        }
        else
        {
            return 0;
        }
    }
}

// #################################################################
// ######################## SELECTION HELPERS ######################
// #################################################################

function getDrillEquipById(id)
{
    for(var i = 0; i < drillEquips.length; i++)
    {
        if(drillEquips[i].id == id)
        {
            return drillEquips[i];
        }
    }
}

function getDrillEquipByLevel(type, level)
{
    var upgradeToSend;
    drillEquips.forEach((upgrade) =>
    {
        if(upgrade.type == type && upgrade.level == level)
        {
            upgradeToSend = upgrade;
        }
    });

    return upgradeToSend;
}


function getDrillEquipByBlueprintId(id)
{
    var drillBlueprintCraftedItemId = getBlueprintById(1, id).craftedItem.item.id;
    return getDrillEquipById(drillBlueprintCraftedItemId);
}

function getDrillBlueprintByEquipId(id)
{
    for(var i = 0; i < drillBlueprints.length; ++i)
    {
        if(drillBlueprints[i].craftedItem.item.id == id)
        {
            return drillBlueprints[i];
        }
    }
    return null;
}

//Level starts at 1
function getUnknownBlueprintsOfDrillEquipLevel(level, type = null)
{
    return filterBlueprints(
        drillBlueprints,
        function (blueprint)
        {
            return getDrillEquipById(blueprint.craftedItem.item.id).level == level &&
                !isBlueprintKnown(1, blueprint.id) &&
                (type == null || getDrillEquipById(blueprint.craftedItem.item.id).type == type)
        }
    );
}

function getUnknownBlueprintsAboveDrillEquipLevel(level, type = null)
{
    return filterBlueprints(
        drillBlueprints,
        function (blueprint)
        {
            return getDrillEquipById(blueprint.craftedItem.item.id).level > level &&
                !isBlueprintKnown(1, blueprint.id) &&
                (type == null || getDrillEquipById(blueprint.craftedItem.item.id).type == type)
        }
    );
}

function getBlueprintsAboveDrillEquipLevel(level, type = null)
{
    return filterBlueprints(
        drillBlueprints,
        function (blueprint)
        {
            return getDrillEquipById(blueprint.craftedItem.item.id).level > level &&
                (type == null || getDrillEquipById(blueprint.craftedItem.item.id).type == type)
        }
    );
}

function learnNonVariantDrillBlueprintsOfLevel(level, notifyPlayer = false)
{
    var unknownBlueprintsOfLevel = getUnknownBlueprintsOfDrillEquipLevel(level);
    for(var i = 0; i < unknownBlueprintsOfLevel.length; i++)
    {
        if(!getDrillEquipByBlueprintId(unknownBlueprintsOfLevel[i]).isVariant)
        {
            learnBlueprint(1, unknownBlueprintsOfLevel[i].id, notifyPlayer);
        }
    }
}

//Get discoverable non-shop blueprints
function getDiscoverableBlueprintsAboveLevelEquippedForEachType()
{
    var result = [];
    for(var i = 0; i < 4; i++)
    {
        var equipLevel = getDrillEquipById(drillState.equippedDrillEquips[i]).level;
        result = result.concat(getUnknownBlueprintsAboveDrillEquipLevel(equipLevel, i));
    }

    var filteredResult = [];
    for(var i = 0; i < result.length; i++)
    {
        if(!result[i].isFromShop)
        {
            filteredResult.push(result[i]);
        }
    }
    return filteredResult;
}

function sortBlueprintsByEquipLevelInAscendingOrder(blueprints)
{
    return blueprints.sort(function (a, b)
    {
        return getDrillEquipById(a.craftedItem.item.id).level - getDrillEquipById(b.craftedItem.item.id).level;
    });
}

function getLowestLevelDrillBlueprint()
{
    var lowestLevelEquipIndex = 0;
    var lowestLevelEquip = drillState.equippedDrillEquips[lowestLevelEquipIndex];
    for(var i = 0; i < drillState.equippedDrillEquips.length; i++)
    {
        if(getDrillEquipById(drillState.equippedDrillEquips[i]).level < getDrillEquipById(lowestLevelEquip).level &&
            getBlueprintsAboveDrillEquipLevel(getDrillEquipById(lowestLevelEquip).level, lowestLevelEquipIndex).length > 0)
        {
            lowestLevelEquipIndex = i;
            lowestLevelEquip = drillState.equippedDrillEquips[lowestLevelEquipIndex];
        }
    }
    return getDrillBlueprintByEquipId(lowestLevelEquip)
}

function getNextDrillBlueprintUpgrade()
{
    var lowestLevelEquipIndex = 0;
    var lowestLevelEquip = drillState.equippedDrillEquips[lowestLevelEquipIndex];
    for(var i = 0; i < drillState.equippedDrillEquips.length; i++)
    {
        if(getDrillEquipById(drillState.equippedDrillEquips[i]).level < getDrillEquipById(lowestLevelEquip).level &&
            getBlueprintsAboveDrillEquipLevel(getDrillEquipById(lowestLevelEquip).level, lowestLevelEquipIndex).length > 0)
        {
            lowestLevelEquipIndex = i;
            lowestLevelEquip = drillState.equippedDrillEquips[lowestLevelEquipIndex];
        }
    }
    return getBlueprintsAboveDrillEquipLevel(getDrillEquipById(lowestLevelEquip).level, lowestLevelEquipIndex)[0];
}

// #################################################################
// ######################## EQUIP DEFINITIONS ######################
// #################################################################

//Starting Equips
var junkEngine = new DrillEquip(1);
junkEngine.translatedName = _("Junk Engine");
junkEngine.icon = icone0;
junkEngine.worldAsset = drilltop0;
junkEngine.type = ENGINE_TYPE;
junkEngine.level = 1;
junkEngine.baseWatts = 1n;
junkEngine.wattMultiplier = 1n;
junkEngine.isCrafted = true;
drillEquips.push(junkEngine);

var tinyDrill = new DrillEquip(2);
tinyDrill.translatedName = _("Tiny Drill");
tinyDrill.icon = icond0;
tinyDrill.worldAsset = drillbit0;
tinyDrill.type = DRILL_TYPE;
tinyDrill.level = 1;
tinyDrill.baseWatts = 2n;
tinyDrill.wattMultiplier = 1n;
tinyDrill.isCrafted = true;
drillEquips.push(tinyDrill);

var basicFan = new DrillEquip(3);
basicFan.translatedName = _("Basic Fan");
basicFan.icon = iconr0;
basicFan.type = DRILL_FAN_TYPE;
basicFan.level = 1;
basicFan.baseWatts = 2n;
basicFan.wattMultiplier = 1n;
basicFan.isCrafted = true;
drillEquips.push(basicFan);

var junkCargo = new DrillEquip(4);
junkCargo.translatedName = _("Junk Cargo");
junkCargo.icon = iconc0;
junkCargo.type = CARGO_TYPE;
junkCargo.level = 1;
junkCargo.capacity = 1500;
junkCargo.isCrafted = true;
drillEquips.push(junkCargo);

//Standard Equips
var engine2 = new DrillEquip(5);
engine2.translatedName = _("Steam Engine");
engine2.icon = icone1;
engine2.worldAsset = drilltop1;
engine2.type = ENGINE_TYPE;
engine2.level = 2;
engine2.baseWatts = 5n;
engine2.wattMultiplier = 1n;
drillEquips.push(engine2);

var drill2 = new DrillEquip(6);
drill2.translatedName = _("Copper Drill");
drill2.icon = icond1;
drill2.worldAsset = drillbit1;
drill2.type = DRILL_TYPE;
drill2.level = 2;
drill2.baseWatts = 5n;
drill2.wattMultiplier = 1n;
drillEquips.push(drill2);

var fan2 = new DrillEquip(7);
fan2.translatedName = _("Double Fan");
fan2.icon = iconr1;
fan2.type = DRILL_FAN_TYPE;
fan2.level = 2;
fan2.baseWatts = 5n;
fan2.wattMultiplier = 1n;
drillEquips.push(fan2);

var cargo2 = new DrillEquip(8);
cargo2.translatedName = _("Nano Cargo");
cargo2.icon = iconc1;
cargo2.type = CARGO_TYPE;
cargo2.level = 2;
cargo2.capacity = 7500;
drillEquips.push(cargo2);

var engine3 = new DrillEquip(9);
engine3.translatedName = _("2 Cylinder Engine");
engine3.icon = icone2;
engine3.worldAsset = drilltop2;
engine3.type = ENGINE_TYPE;
engine3.level = 3;
engine3.baseWatts = 5n;
engine3.wattMultiplier = 2n;
drillEquips.push(engine3);

var drill3 = new DrillEquip(10);
drill3.translatedName = _("Silver Drill");
drill3.icon = icond2;
drill3.worldAsset = drillbit2;
drill3.type = DRILL_TYPE;
drill3.level = 3;
drill3.baseWatts = 40n;
drill3.wattMultiplier = 1n;
drillEquips.push(drill3);

var fan3 = new DrillEquip(11);
fan3.translatedName = _("Triple Fans");
fan3.icon = iconr2;
fan3.type = DRILL_FAN_TYPE;
fan3.level = 3;
fan3.baseWatts = 35n;
fan3.wattMultiplier = 1n;
drillEquips.push(fan3);

var cargo3 = new DrillEquip(12);
cargo3.translatedName = _("Micro Cargo");
cargo3.icon = iconc2;
cargo3.type = CARGO_TYPE;
cargo3.level = 3;
cargo3.capacity = 15000;
drillEquips.push(cargo3);

var engine4 = new DrillEquip(13);
engine4.translatedName = _("4 Cylinder Engine");
engine4.icon = icone3;
engine4.worldAsset = drilltop3;
engine4.type = ENGINE_TYPE;
engine4.level = 4;
engine4.baseWatts = 10n;
engine4.wattMultiplier = 4n;
drillEquips.push(engine4);

var drill4 = new DrillEquip(14);
drill4.translatedName = _("Platinum Drill");
drill4.icon = icond3;
drill4.worldAsset = drillbit3;
drill4.type = DRILL_TYPE;
drill4.level = 4;
drill4.baseWatts = 300n;
drill4.wattMultiplier = 1n;
drillEquips.push(drill4);

var fan4 = new DrillEquip(15);
fan4.translatedName = _("Quad Fan");
fan4.icon = iconr3;
fan4.type = DRILL_FAN_TYPE;
fan4.level = 4;
fan4.baseWatts = 250n;
fan4.wattMultiplier = 1n;
drillEquips.push(fan4);

var cargo4 = new DrillEquip(16);
cargo4.translatedName = _("Small Cargo");
cargo4.icon = iconc3;
cargo4.type = CARGO_TYPE;
cargo4.level = 4;
cargo4.capacity = 50000;
drillEquips.push(cargo4);

var engine5 = new DrillEquip(17);
engine5.translatedName = _("6 Cylinder Engine");
engine5.icon = icone4;
engine5.worldAsset = drilltop4;
engine5.type = ENGINE_TYPE;
engine5.level = 5;
engine5.baseWatts = 10n;
engine5.wattMultiplier = 10n;
drillEquips.push(engine5);

var drill5 = new DrillEquip(18);
drill5.translatedName = _("TriPlatinum Drill");
drill5.icon = icond4;
drill5.worldAsset = drillbit4;
drill5.type = DRILL_TYPE;
drill5.level = 5;
drill5.baseWatts = 700n;
drill5.wattMultiplier = 1n;
drillEquips.push(drill5);

var fan5 = new DrillEquip(19);
fan5.translatedName = _("Partitioned Fan");
fan5.icon = iconr4;
fan5.type = DRILL_FAN_TYPE;
fan5.level = 5;
fan5.baseWatts = 1000n;
fan5.wattMultiplier = 1n;
drillEquips.push(fan5);

var cargo5 = new DrillEquip(20);
cargo5.translatedName = _("Decent Cargo");
cargo5.icon = iconc4;
cargo5.type = CARGO_TYPE;
cargo5.level = 5;
cargo5.capacity = 150000;
drillEquips.push(cargo5);

var engine6 = new DrillEquip(21);
engine6.translatedName = _("Basic Nuclear Engine");
engine6.icon = icone5;
engine6.worldAsset = drilltop5;
engine6.type = ENGINE_TYPE;
engine6.level = 6;
engine6.baseWatts = 20n;
engine6.wattMultiplier = 30n;
drillEquips.push(engine6);

var drill6 = new DrillEquip(22);
drill6.translatedName = _("Spike Drill");
drill6.icon = icond5;
drill6.worldAsset = drillbit5;
drill6.type = DRILL_TYPE;
drill6.level = 6;
drill6.baseWatts = 1500n;
drill6.wattMultiplier = 1n;
drillEquips.push(drill6);

var fan6 = new DrillEquip(23);
fan6.translatedName = _("Multi Partitioned Fan");
fan6.icon = iconr5;
fan6.type = DRILL_FAN_TYPE;
fan6.level = 6;
fan6.baseWatts = 1400n;
fan6.wattMultiplier = 1n;
drillEquips.push(fan6);

var cargo6 = new DrillEquip(24);
cargo6.translatedName = _("Large Cargo");
cargo6.icon = iconc5;
cargo6.type = CARGO_TYPE;
cargo6.level = 6;
cargo6.capacity = 500000;
drillEquips.push(cargo6);

var engine7 = new DrillEquip(25);
engine7.translatedName = _("Intermediate Nuclear Engine");
engine7.icon = icone6;
engine7.worldAsset = drilltop6;
engine7.type = ENGINE_TYPE;
engine7.level = 7;
engine7.baseWatts = 30n;
engine7.wattMultiplier = 150n;
drillEquips.push(engine7);

var drill7 = new DrillEquip(26);
drill7.translatedName = _("Barbaric Drill");
drill7.icon = icond6;
drill7.worldAsset = drillbit6;
drill7.type = DRILL_TYPE;
drill7.level = 7;
drill7.baseWatts = 5500n;
drill7.wattMultiplier = 1n;
drillEquips.push(drill7);

var fan7 = new DrillEquip(27);
fan7.translatedName = _("Heat Pump");
fan7.icon = iconr6;
fan7.type = DRILL_FAN_TYPE;
fan7.level = 7;
fan7.baseWatts = 3700n;
fan7.wattMultiplier = 1n;
drillEquips.push(fan7);

var cargo7 = new DrillEquip(28);
cargo7.translatedName = _("Huge Cargo");
cargo7.icon = iconc6;
cargo7.type = CARGO_TYPE;
cargo7.level = 7;
cargo7.capacity = 1000000;
drillEquips.push(cargo7);

var engine8 = new DrillEquip(29);
engine8.translatedName = _("Advanced Nuclear Engine");
engine8.icon = icone7;
engine8.worldAsset = drilltop7;
engine8.type = ENGINE_TYPE;
engine8.level = 8;
engine8.baseWatts = 50n;
engine8.wattMultiplier = 650n;
drillEquips.push(engine8);

var drill8 = new DrillEquip(30);
drill8.translatedName = _("Monster Drill");
drill8.icon = icond7;
drill8.worldAsset = drillbit7;
drill8.type = DRILL_TYPE;
drill8.level = 8;
drill8.baseWatts = 15000n;
drill8.wattMultiplier = 1n;
drillEquips.push(drill8);

var fan8 = new DrillEquip(31);
fan8.translatedName = _("Segmented Heat Pump");
fan8.icon = iconr7;
fan8.type = DRILL_FAN_TYPE;
fan8.level = 8;
fan8.baseWatts = 13000n;
fan8.wattMultiplier = 1n;
drillEquips.push(fan8);

var cargo8 = new DrillEquip(32);
cargo8.translatedName = _("Giant Cargo");
cargo8.icon = iconc7;
cargo8.type = CARGO_TYPE;
cargo8.level = 8;
cargo8.capacity = 1500000;
drillEquips.push(cargo8);

var engine9 = new DrillEquip(33);
engine9.translatedName = _("Fission Engine");
engine9.icon = icone8;
engine9.worldAsset = drilltop8;
engine9.type = ENGINE_TYPE;
engine9.level = 9;
engine9.baseWatts = 70n;
engine9.wattMultiplier = 3300n;
drillEquips.push(engine9);

var drill9 = new DrillEquip(34);
drill9.translatedName = _("Sifting Drill");
drill9.icon = icond8;
drill9.worldAsset = drillbit8;
drill9.type = DRILL_TYPE;
drill9.level = 9;
drill9.baseWatts = 25000n;
drill9.wattMultiplier = 1n;
drillEquips.push(drill9);

var fan9 = new DrillEquip(35);
fan9.translatedName = _("Hydrogen Coolant System");
fan9.icon = iconr8;
fan9.type = DRILL_FAN_TYPE;
fan9.level = 9;
fan9.baseWatts = 20000n;
fan9.wattMultiplier = 1n;
drillEquips.push(fan9);

var cargo9 = new DrillEquip(36);
cargo9.translatedName = _("Enormous Cargo");
cargo9.icon = iconc8;
cargo9.type = CARGO_TYPE;
cargo9.level = 9;
cargo9.capacity = 3000000;
drillEquips.push(cargo9);

var engine10 = new DrillEquip(37);
engine10.translatedName = _("Drill King Engine");
engine10.icon = icone9;
engine10.worldAsset = drilltop9;
engine10.type = ENGINE_TYPE;
engine10.level = 10;
engine10.baseWatts = 70n;
engine10.wattMultiplier = 25000n;
drillEquips.push(engine10);

var drill10 = new DrillEquip(38);
drill10.translatedName = _("Drill Smasher");
drill10.icon = icond9;
drill10.worldAsset = drillbit9;
drill10.type = DRILL_TYPE;
drill10.level = 10;
drill10.baseWatts = 50000n;
drill10.wattMultiplier = 1n;
drillEquips.push(drill10);

var fan10 = new DrillEquip(39);
fan10.translatedName = _("Bihydrogen Coolant System");
fan10.icon = iconr9;
fan10.type = DRILL_FAN_TYPE;
fan10.level = 10;
fan10.baseWatts = 30000n;
fan10.wattMultiplier = 1n;
drillEquips.push(fan10);

var cargo10 = new DrillEquip(40);
cargo10.translatedName = _("Extreme Industrial Cargo");
cargo10.icon = iconc9;
cargo10.type = CARGO_TYPE;
cargo10.level = 10;
cargo10.capacity = 5000000;
drillEquips.push(cargo10);

var engine11 = new DrillEquip(41);
engine11.translatedName = _("Drill Lord Engine");
engine11.icon = icone10;
engine11.worldAsset = drilltop10;
engine11.type = ENGINE_TYPE;
engine11.level = 11;
engine11.baseWatts = 75n;
engine11.wattMultiplier = 100000n;
drillEquips.push(engine11);

var drill11 = new DrillEquip(42);
drill11.translatedName = _("Smasher Drill");
drill11.icon = icond10;
drill11.worldAsset = drillbit10;
drill11.type = DRILL_TYPE;
drill11.level = 11;
drill11.baseWatts = 80000n;
drill11.wattMultiplier = 1n;
drillEquips.push(drill11);

var fan11 = new DrillEquip(43);
fan11.translatedName = _("Trihydrogen Coolant System");
fan11.icon = iconr10;
fan11.type = DRILL_FAN_TYPE;
fan11.level = 11;
fan11.baseWatts = 45000n;
fan11.wattMultiplier = 1n;
drillEquips.push(fan11);

var cargo11 = new DrillEquip(44);
cargo11.translatedName = _("Gold King Cargo");
cargo11.icon = iconc10;
cargo11.type = CARGO_TYPE;
cargo11.level = 11;
cargo11.capacity = 10000000;
drillEquips.push(cargo11);

var engine12 = new DrillEquip(45);
engine12.translatedName = _("Seismic Resonance Engine");
engine12.icon = icone11;
engine12.worldAsset = drilltop11;
engine12.type = ENGINE_TYPE;
engine12.level = 12;
engine12.baseWatts = 200n;
engine12.wattMultiplier = 200000n;
drillEquips.push(engine12);

var drill12 = new DrillEquip(46);
drill12.translatedName = _("Lava Drill");
drill12.icon = icond11;
drill12.worldAsset = drillbit11;
drill12.type = DRILL_TYPE;
drill12.level = 12;
drill12.baseWatts = 160000n;
drill12.wattMultiplier = 1n;
drillEquips.push(drill12);

var fan12 = new DrillEquip(47);
fan12.translatedName = _("Liquid Nitrogen Fan");
fan12.icon = iconr11;
fan12.type = DRILL_FAN_TYPE;
fan12.level = 12;
fan12.baseWatts = 90000n;
fan12.wattMultiplier = 1n;
drillEquips.push(fan12);

var cargo12 = new DrillEquip(48);
cargo12.translatedName = _("City Capacity");
cargo12.icon = iconc11;
cargo12.type = CARGO_TYPE;
cargo12.level = 12;
cargo12.capacity = 25000000;
drillEquips.push(cargo12);

var engine13 = new DrillEquip(49);
engine13.translatedName = _("Gravity Engine");
engine13.icon = icone12;
engine13.worldAsset = drilltop12;
engine13.type = ENGINE_TYPE;
engine13.level = 13;
engine13.baseWatts = 1000n;
engine13.wattMultiplier = 375000n;
drillEquips.push(engine13);

var drill13 = new DrillEquip(50);
drill13.translatedName = _("Gravity Drill");
drill13.icon = icond12;
drill13.worldAsset = drillbit12;
drill13.type = DRILL_TYPE;
drill13.level = 13;
drill13.baseWatts = 275000n;
drill13.wattMultiplier = 1n;
drillEquips.push(drill13);

var fan13 = new DrillEquip(51);
fan13.translatedName = _("Pressure Cooled Fan");
fan13.icon = iconr12;
fan13.type = DRILL_FAN_TYPE;
fan13.level = 13;
fan13.baseWatts = 200000n;
fan13.wattMultiplier = 1n;
drillEquips.push(fan13);

var cargo13 = new DrillEquip(52);
cargo13.translatedName = _("Country Capacity");
cargo13.icon = iconc12;
cargo13.type = CARGO_TYPE;
cargo13.level = 13;
cargo13.capacity = 100000000;
drillEquips.push(cargo13);

var engine14 = new DrillEquip(53);
engine14.translatedName = _("Core Reactor Engine");
engine14.icon = icone13;
engine14.worldAsset = drilltop13;
engine14.type = ENGINE_TYPE;
engine14.level = 14;
engine14.baseWatts = 5000n;
engine14.wattMultiplier = 520000n;
drillEquips.push(engine14);

var drill14 = new DrillEquip(54);
drill14.translatedName = _("Irradiated Drill");
drill14.icon = icond13;
drill14.worldAsset = drillbit13;
drill14.type = DRILL_TYPE;
drill14.level = 14;
drill14.baseWatts = 500000n;
drill14.wattMultiplier = 1n;
drillEquips.push(drill14);

var fan14 = new DrillEquip(55);
fan14.translatedName = _("9M PSI Pressure Fan");
fan14.icon = iconr13;
fan14.type = DRILL_FAN_TYPE;
fan14.level = 14;
fan14.baseWatts = 370000n;
fan14.wattMultiplier = 1n;
drillEquips.push(fan14);

var cargo14 = new DrillEquip(56);
cargo14.translatedName = _("Planet Capacity");
cargo14.icon = iconc13;
cargo14.type = CARGO_TYPE;
cargo14.level = 14;
cargo14.capacity = 200000000;
drillEquips.push(cargo14);

var engine15 = new DrillEquip(57);
engine15.translatedName = _("Pressurized Reactor Engine");
engine15.icon = icone14;
engine15.worldAsset = drilltop14;
engine15.type = ENGINE_TYPE;
engine15.level = 15;
engine15.baseWatts = 5000n;
engine15.wattMultiplier = 950000n;
drillEquips.push(engine15);

var drill15 = new DrillEquip(58);
drill15.translatedName = _("Enhanced Irradiated Drill");
drill15.icon = icond14;
drill15.worldAsset = drillbit14;
drill15.type = DRILL_TYPE;
drill15.level = 15;
drill15.baseWatts = 950000n;
drill15.wattMultiplier = 1n;
drillEquips.push(drill15);

var fan15 = new DrillEquip(59);
fan15.translatedName = _("Liquid Neon Coolant System");
fan15.icon = iconr14;
fan15.type = DRILL_FAN_TYPE;
fan15.level = 15;
fan15.baseWatts = 820000n;
fan15.wattMultiplier = 1n;
drillEquips.push(fan15);

var engine16 = new DrillEquip(60);
engine16.translatedName = _("Robo Anthropomorphic Engine");
engine16.icon = icone15;
engine16.worldAsset = drilltop15;
engine16.type = ENGINE_TYPE;
engine16.level = 16;
engine16.baseWatts = 5000n;
engine16.wattMultiplier = 1500000n;
drillEquips.push(engine16);

var drill16 = new DrillEquip(61);
drill16.translatedName = _("Dual Mantle Destroyer Drill");
drill16.icon = icond15;
drill16.worldAsset = drillbit15;
drill16.type = DRILL_TYPE;
drill16.level = 16;
drill16.baseWatts = 1250000n;
drill16.wattMultiplier = 1n;
drillEquips.push(drill16);

var fan16 = new DrillEquip(62);
fan16.translatedName = _("Helium Coolant System");
fan16.icon = iconr15;
fan16.type = DRILL_FAN_TYPE;
fan16.level = 16;
fan16.baseWatts = 1000000n;
fan16.wattMultiplier = 1n;
drillEquips.push(fan16);

var engine17 = new DrillEquip(63);
engine17.translatedName = _("Rocket Engine");
engine17.icon = icone16;
engine17.worldAsset = drilltop16;
engine17.type = ENGINE_TYPE;
engine17.level = 17;
engine17.baseWatts = 5000n;
engine17.wattMultiplier = 3250000n;
drillEquips.push(engine17);

var drill17 = new DrillEquip(64);
drill17.translatedName = _("Temperature Hardened Drill");
drill17.icon = icond16;
drill17.worldAsset = drillbit16;
drill17.type = DRILL_TYPE;
drill17.level = 17;
drill17.baseWatts = 2750000n;
drill17.wattMultiplier = 1n;
drillEquips.push(drill17);

var fan17 = new DrillEquip(65);
fan17.translatedName = _("Vacuum Chilled Coolant System");
fan17.icon = iconr16;
fan17.type = DRILL_FAN_TYPE;
fan17.level = 17;
fan17.baseWatts = 2250000n;
fan17.wattMultiplier = 1n;
drillEquips.push(fan17);

var engine18 = new DrillEquip(66);
engine18.translatedName = _("Lunar Rocket Engine") + " T2";
engine18.icon = icone17;
engine18.worldAsset = drilltop17;
engine18.type = ENGINE_TYPE;
engine18.level = 18;
engine18.baseWatts = 5000n;
engine18.wattMultiplier = 6750000n;
drillEquips.push(engine18);

var drill18 = new DrillEquip(67);
drill18.translatedName = _("Lunar Temperature Hardened Drill") + " T2";
drill18.icon = icond17;
drill18.worldAsset = drillbit17;
drill18.type = DRILL_TYPE;
drill18.level = 18;
drill18.baseWatts = 6250000n;
drill18.wattMultiplier = 1n;
drillEquips.push(drill18);

var fan18 = new DrillEquip(68);
fan18.translatedName = _("Lunar Vacuum Chilled Coolant System") + " T2";
fan18.icon = iconr17;
fan18.type = DRILL_FAN_TYPE;
fan18.level = 18;
fan18.baseWatts = 5000000n;
fan18.wattMultiplier = 1n;
drillEquips.push(fan18);

var engine19 = new DrillEquip(69);
engine19.translatedName = _("Lunar Rocket Engine") + " T3";
engine19.icon = icone18;
engine19.worldAsset = drilltop18;
engine19.type = ENGINE_TYPE;
engine19.level = 19;
engine19.baseWatts = 5000n;
engine19.wattMultiplier = 20250000n;
drillEquips.push(engine19);

var drill19 = new DrillEquip(70);
drill19.translatedName = _("Lunar Temperature Hardened Drill") + " T3";
drill19.icon = icond18;
drill19.worldAsset = drillbit18;
drill19.type = DRILL_TYPE;
drill19.level = 19;
drill19.baseWatts = 31250000n;
drill19.wattMultiplier = 1n;
drillEquips.push(drill19);

var fan19 = new DrillEquip(71);
fan19.translatedName = _("Lunar Vacuum Chilled Coolant System") + " T3";
fan19.icon = iconr18;
fan19.type = DRILL_FAN_TYPE;
fan19.level = 19;
fan19.baseWatts = 25000000n;
fan19.wattMultiplier = 1n;
drillEquips.push(fan19);

var engine20 = new DrillEquip(72);
engine20.translatedName = _("Lunar Rocket Engine") + " T4";
engine20.icon = icone19;
engine20.worldAsset = drilltop19;
engine20.type = ENGINE_TYPE;
engine20.level = 20;
engine20.baseWatts = 5000n;
engine20.wattMultiplier = 40500000n;
drillEquips.push(engine20);

var drill20 = new DrillEquip(73);
drill20.translatedName = _("Lunar Temperature Hardened Drill") + " T4";
drill20.icon = icond19;
drill20.worldAsset = drillbit19;
drill20.type = DRILL_TYPE;
drill20.level = 20;
drill20.baseWatts = 200000000n;
drill20.wattMultiplier = 1n;
drillEquips.push(drill20);

var fan20 = new DrillEquip(74);
fan20.translatedName = _("Lunar Vacuum Chilled Coolant System") + " T4";
fan20.icon = iconr19;
fan20.type = DRILL_FAN_TYPE;
fan20.level = 20;
fan20.baseWatts = 217500000n;
fan20.wattMultiplier = 1n;
drillEquips.push(fan20);

var engine21 = new DrillEquip(75);
engine21.translatedName = _("Solid Fuel Rocket Engine") + " T1";
engine21.icon = icone20;
engine21.worldAsset = drilltop20;
engine21.type = ENGINE_TYPE;
engine21.level = 21;
engine21.baseWatts = 5000n;
engine21.wattMultiplier = 165000000n;
drillEquips.push(engine21);

var drill21 = new DrillEquip(76);
drill21.translatedName = _("Vibration Drill") + " T1";
drill21.icon = icond20;
drill21.worldAsset = drillbit20;
drill21.type = DRILL_TYPE;
drill21.level = 21;
drill21.baseWatts = 620000000n;
drill21.wattMultiplier = 1n;
drillEquips.push(drill21);

var fan21 = new DrillEquip(77);
fan21.translatedName = _("Low Gravity Coolant System") + " T1";
fan21.icon = iconr20;
fan21.type = DRILL_FAN_TYPE;
fan21.level = 21;
fan21.baseWatts = 850000000n;
fan21.wattMultiplier = 1n;
drillEquips.push(fan21);

var engine22 = new DrillEquip(78);
engine22.translatedName = _("Solid Fuel Rocket Engine") + " T2";
engine22.icon = icone21;
engine22.worldAsset = drilltop21;
engine22.type = ENGINE_TYPE;
engine22.level = 22;
engine22.baseWatts = 5000n;
engine22.wattMultiplier = 400000000n;
drillEquips.push(engine22);

var drill22 = new DrillEquip(79);
drill22.translatedName = _("Vibration Drill") + " T2";
drill22.icon = icond21;
drill22.worldAsset = drillbit21;
drill22.type = DRILL_TYPE;
drill22.level = 22;
drill22.baseWatts = 5000000000n;
drill22.wattMultiplier = 1n;
drillEquips.push(drill22);

var fan22 = new DrillEquip(80);
fan22.translatedName = _("Low Gravity Coolant System") + " T2";
fan22.icon = iconr21;
fan22.type = DRILL_FAN_TYPE;
fan22.level = 22;
fan22.baseWatts = 4000000000n;
fan22.wattMultiplier = 1n;
drillEquips.push(fan22);

var engine23 = new DrillEquip(81);
engine23.translatedName = _("Solid Fuel Rocket Engine") + " T3";
engine23.icon = icone22;
engine23.worldAsset = drilltop22;
engine23.type = ENGINE_TYPE;
engine23.level = 23;
engine23.baseWatts = 5000n;
engine23.wattMultiplier = 1225000000n;
drillEquips.push(engine23);

var drill23 = new DrillEquip(82);
drill23.translatedName = _("Vibration Drill") + " T3";
drill23.icon = icond22;
drill23.worldAsset = drillbit22;
drill23.type = DRILL_TYPE;
drill23.level = 23;
drill23.baseWatts = 15000000000n;
drill23.wattMultiplier = 1n;
drillEquips.push(drill23);

var fan23 = new DrillEquip(83);
fan23.translatedName = _("Low Gravity Coolant System") + " T3";
fan23.icon = iconr22;
fan23.type = DRILL_FAN_TYPE;
fan23.level = 23;
fan23.baseWatts = 24000000000n;
fan23.wattMultiplier = 1n;
drillEquips.push(fan23);

var engine24 = new DrillEquip(84);
engine24.translatedName = _("Bipropellant Rocket Engine") + " T1";
engine24.icon = icone23;
engine24.worldAsset = drilltop23;
engine24.type = ENGINE_TYPE;
engine24.level = 24;
engine24.baseWatts = 5000n;
engine24.wattMultiplier = 3675000000n;
drillEquips.push(engine24);

var drill24 = new DrillEquip(85);
drill24.translatedName = _("Mounded Drill") + " T1";
drill24.icon = icond23;
drill24.worldAsset = drillbit23;
drill24.type = DRILL_TYPE;
drill24.level = 24;
drill24.baseWatts = 70000000000n;
drill24.wattMultiplier = 1n;
drillEquips.push(drill24);

var fan24 = new DrillEquip(86);
fan24.translatedName = _("Conductive Heat Disperser") + " T1";
fan24.icon = iconr23;
fan24.type = DRILL_FAN_TYPE;
fan24.level = 24;
fan24.baseWatts = 100000000000n;
fan24.wattMultiplier = 1n;
drillEquips.push(fan24);

var engine25 = new DrillEquip(87);
engine25.translatedName = _("Bipropellant Rocket Engine") + " T2";
engine25.icon = icone24;
engine25.worldAsset = drilltop24;
engine25.type = ENGINE_TYPE;
engine25.level = 25;
engine25.baseWatts = 5000n;
engine25.wattMultiplier = 18000000000n;
drillEquips.push(engine25);

var drill25 = new DrillEquip(88);
drill25.translatedName = _("Mounded Drill") + " T2";
drill25.icon = icond24;
drill25.worldAsset = drillbit24;
drill25.type = DRILL_TYPE;
drill25.level = 25;
drill25.baseWatts = 230000000000n;
drill25.wattMultiplier = 1n;
drillEquips.push(drill25);

var fan25 = new DrillEquip(89);
fan25.translatedName = _("Conductive Heat Disperser") + " T2";
fan25.icon = iconr24;
fan25.type = DRILL_FAN_TYPE;
fan25.level = 25;
fan25.baseWatts = 350000000000n;
fan25.wattMultiplier = 1n;
drillEquips.push(fan25);

var engine26 = new DrillEquip(90);
engine26.translatedName = _("Bipropellant Rocket Engine") + " T3";
engine26.icon = icone25;
engine26.worldAsset = drilltop25;
engine26.type = ENGINE_TYPE;
engine26.level = 26;
engine26.baseWatts = 5000n;
engine26.wattMultiplier = 90000000000n;
drillEquips.push(engine26);

var drill26 = new DrillEquip(91);
drill26.translatedName = _("Mounded Drill") + " T3";
drill26.icon = icond25;
drill26.worldAsset = drillbit25;
drill26.type = DRILL_TYPE;
drill26.level = 26;
drill26.baseWatts = 821000000000n;
drill26.wattMultiplier = 1n;
drillEquips.push(drill26);

var fan26 = new DrillEquip(92);
fan26.translatedName = _("Conductive Heat Disperser") + " T3";
fan26.icon = iconr25;
fan26.type = DRILL_FAN_TYPE;
fan26.level = 26;
fan26.baseWatts = 875000000000n;
fan26.wattMultiplier = 1n;
drillEquips.push(fan26);

var engine27 = new DrillEquip(93);
engine27.translatedName = _("Reaction Mass Engine") + " T1";
engine27.icon = icone26;
engine27.worldAsset = drilltop26;
engine27.type = ENGINE_TYPE;
engine27.level = 27;
engine27.baseWatts = 5000n;
engine27.wattMultiplier = 450000000000n;
drillEquips.push(engine27);

var drill27 = new DrillEquip(94);
drill27.translatedName = _("Regolith Agitator Drill") + " T1";
drill27.icon = icond26;
drill27.worldAsset = drillbit26;
drill27.type = DRILL_TYPE;
drill27.level = 27;
drill27.baseWatts = 3063000000000n;
drill27.wattMultiplier = 1n;
drillEquips.push(drill27);

var fan27 = new DrillEquip(95);
fan27.translatedName = _("Thermal Balancer") + " T1";
fan27.icon = iconr26;
fan27.type = DRILL_FAN_TYPE;
fan27.level = 27;
fan27.baseWatts = 5025000000000n;
fan27.wattMultiplier = 1n;
drillEquips.push(fan27);

var engine28 = new DrillEquip(96);
engine28.translatedName = _("Reaction Mass Engine") + " T2";
engine28.icon = icone27;
engine28.worldAsset = drilltop27;
engine28.type = ENGINE_TYPE;
engine28.level = 28;
engine28.baseWatts = 5000n;
engine28.wattMultiplier = 2600000000000n;
drillEquips.push(engine28);

var drill28 = new DrillEquip(97);
drill28.translatedName = _("Regolith Agitator Drill") + " T2";
drill28.icon = icond27;
drill28.worldAsset = drillbit27;
drill28.type = DRILL_TYPE;
drill28.level = 28;
drill28.baseWatts = 24000000000000n;
drill28.wattMultiplier = 1n;
drillEquips.push(drill28);

var fan28 = new DrillEquip(98);
fan28.translatedName = _("Thermal Balancer") + " T2";
fan28.icon = iconr27;
fan28.type = DRILL_FAN_TYPE;
fan28.level = 28;
fan28.baseWatts = 21500000000000n;
fan28.wattMultiplier = 1n;
drillEquips.push(fan28);

var engine29 = new DrillEquip(99);
engine29.translatedName = _("Reaction Mass Engine") + " T3";
engine29.icon = icone28;
engine29.worldAsset = drilltop28;
engine29.type = ENGINE_TYPE;
engine29.level = 29;
engine29.baseWatts = 5000n;
engine29.wattMultiplier = 21000000000000n;
drillEquips.push(engine29);

var drill29 = new DrillEquip(100);
drill29.translatedName = _("Regolith Agitator Drill") + " T3";
drill29.icon = icond28;
drill29.worldAsset = drillbit28;
drill29.type = DRILL_TYPE;
drill29.level = 29;
drill29.baseWatts = 336000000000000n;
drill29.wattMultiplier = 1n;
drillEquips.push(drill29);

var fan29 = new DrillEquip(101);
fan29.translatedName = _("Thermal Balancer") + " T3";
fan29.icon = iconr28;
fan29.type = DRILL_FAN_TYPE;
fan29.level = 29;
fan29.baseWatts = 220000000000000n;
fan29.wattMultiplier = 1n;
drillEquips.push(fan29);

var engine30 = new DrillEquip(102);
engine30.translatedName = _("Laser Powered Engine") + " T1";
engine30.icon = icone29;
engine30.worldAsset = drilltop29;
engine30.type = ENGINE_TYPE;
engine30.level = 30;
engine30.baseWatts = 5000n;
engine30.wattMultiplier = 122000000000000n;
drillEquips.push(engine30);

var drill30 = new DrillEquip(103);
drill30.translatedName = _("Laser Assisted Drill") + " T1";
drill30.icon = icond29;
drill30.worldAsset = drillbit29;
drill30.type = DRILL_TYPE;
drill30.level = 30;
drill30.baseWatts = 1510000000000000n;
drill30.wattMultiplier = 1n;
drillEquips.push(drill30);

var fan30 = new DrillEquip(104);
fan30.translatedName = _("Radiant Heat Disperser") + " T1";
fan30.icon = iconr26;
fan30.type = DRILL_FAN_TYPE;
fan30.level = 30;
fan30.baseWatts = 1875000000000000n;
fan30.wattMultiplier = 1n;
drillEquips.push(fan30);

var engine31 = new DrillEquip(105);
engine31.translatedName = _("Laser Powered Engine") + " T2";
engine31.icon = icone30;
engine31.worldAsset = drilltop30;
engine31.type = ENGINE_TYPE;
engine31.level = 31;
engine31.baseWatts = 5000n;
engine31.wattMultiplier = 1440000000000000n;
drillEquips.push(engine31);

var drill31 = new DrillEquip(106);
drill31.translatedName = _("Laser Assisted Drill") + " T2";
drill31.icon = icond30;
drill31.worldAsset = drillbit30;
drill31.type = DRILL_TYPE;
drill31.level = 31;
drill31.baseWatts = 5800000000000000n;
drill31.wattMultiplier = 1n;
drillEquips.push(drill31);

var fan31 = new DrillEquip(107);
fan31.translatedName = _("Radiant Heat Disperser") + " T2";
fan31.icon = iconr27;
fan31.type = DRILL_FAN_TYPE;
fan31.level = 31;
fan31.baseWatts = 6800000000000000n;
fan31.wattMultiplier = 1n;
drillEquips.push(fan31);

var engine32 = new DrillEquip(108);
engine32.translatedName = _("Laser Powered Engine") + " T3";
engine32.icon = icone31;
engine32.worldAsset = drilltop31;
engine32.type = ENGINE_TYPE;
engine32.level = 32;
engine32.baseWatts = 5000n;
engine32.wattMultiplier = 16200000000000000n;
drillEquips.push(engine32);

var drill32 = new DrillEquip(109);
drill32.translatedName = _("Laser Assisted Drill") + " T3";
drill32.icon = icond31;
drill32.worldAsset = drillbit31;
drill32.type = DRILL_TYPE;
drill32.level = 32;
drill32.baseWatts = 58000000000000000n;
drill32.wattMultiplier = 1n;
drillEquips.push(drill32);

var fan32 = new DrillEquip(110);
fan32.translatedName = _("Radiant Heat Disperser") + " T3";
fan32.icon = iconr28;
fan32.type = DRILL_FAN_TYPE;
fan32.level = 32;
fan32.baseWatts = 80000000000000000n;
fan32.wattMultiplier = 1n;
drillEquips.push(fan32);

var cargo27 = new DrillEquip(111);
cargo27.translatedName = _("Vacuum Packed Cargo");
cargo27.icon = iconc14;
cargo27.type = CARGO_TYPE;
cargo27.level = 27;
cargo27.capacity = 500000000;
drillEquips.push(cargo27);

var engine33 = new DrillEquip(112);
engine33.translatedName = _("Submersive Engine") + " T1";
engine33.icon = icone32;
engine33.worldAsset = drilltop32;
engine33.type = ENGINE_TYPE;
engine33.level = 33;
engine33.baseWatts = 5000n;
engine33.wattMultiplier = 1020000000000000000n;
drillEquips.push(engine33);

var drill33 = new DrillEquip(113);
drill33.translatedName = _("Submersive Drill") + " T1";
drill33.icon = icond32;
drill33.worldAsset = drillbit32;
drill33.type = DRILL_TYPE;
drill33.level = 33;
drill33.baseWatts = 900000000000000000n;
drill33.wattMultiplier = 1n;
drillEquips.push(drill33);

var fan33 = new DrillEquip(114);
fan33.translatedName = _("Submersive Heat Disperser") + " T1";
fan33.icon = iconr29;
fan33.type = DRILL_FAN_TYPE;
fan33.level = 33;
fan33.baseWatts = 950000000000000000n;
fan33.wattMultiplier = 1n;
drillEquips.push(fan33);

var engine34 = new DrillEquip(115);
engine34.translatedName = _("Submersive Engine") + " T2";
engine34.icon = icone33;
engine34.worldAsset = drilltop33;
engine34.type = ENGINE_TYPE;
engine34.level = 34;
engine34.baseWatts = 5000n;
engine34.wattMultiplier = 2240000000000000000n;
drillEquips.push(engine34);

var drill34 = new DrillEquip(116);
drill34.translatedName = _("Submersive Drill") + " T2";
drill34.icon = icond33;
drill34.worldAsset = drillbit33;
drill34.type = DRILL_TYPE;
drill34.level = 34;
drill34.baseWatts = 1900000000000000000n;
drill34.wattMultiplier = 1n;
drillEquips.push(drill34);

var fan34 = new DrillEquip(117);
fan34.translatedName = _("Submersive Heat Disperser") + " T2";
fan34.icon = iconr30;
fan34.type = DRILL_FAN_TYPE;
fan34.level = 34;
fan34.baseWatts = 1950000000000000000n;
fan34.wattMultiplier = 1n;
drillEquips.push(fan34);

var cargo28 = new DrillEquip(118);
cargo28.translatedName = _("Double Vacuum Packed Cargo");
cargo28.icon = iconc15;
cargo28.type = CARGO_TYPE;
cargo28.level = 28;
cargo28.capacity = 1000000000;
drillEquips.push(cargo28);

var engine35 = new DrillEquip(119);
engine35.translatedName = _("Submersive Engine") + " T3";
engine35.icon = icone34;
engine35.worldAsset = drilltop34;
engine35.type = ENGINE_TYPE;
engine35.level = 35;
engine35.baseWatts = 5000n;
engine35.wattMultiplier = 4100000000000000000n;
drillEquips.push(engine35);

var drill35 = new DrillEquip(120);
drill35.translatedName = _("Submersive Drill") + " T3";
drill35.icon = icond34;
drill35.worldAsset = drillbit34;
drill35.type = DRILL_TYPE;
drill35.level = 35;
drill35.baseWatts = 3700000000000000000n;
drill35.wattMultiplier = 1n;
drillEquips.push(drill35);

var fan35 = new DrillEquip(121);
fan35.translatedName = _("Submersive Heat Disperser") + " T3";
fan35.icon = iconr31;
fan35.type = DRILL_FAN_TYPE;
fan35.level = 35;
fan35.baseWatts = 3800000000000000000n;
fan35.wattMultiplier = 1n;
drillEquips.push(fan35);

var engine36 = new DrillEquip(122);
engine36.translatedName = _("Submersive Engine") + " T4";
engine36.icon = icone35;
engine36.worldAsset = drilltop35;
engine36.type = ENGINE_TYPE;
engine36.level = 36;
engine36.baseWatts = 5000n;
engine36.wattMultiplier = 6500000000000000000n;
drillEquips.push(engine36);

var drill36 = new DrillEquip(123);
drill36.translatedName = _("Submersive Drill") + " T4";
drill36.icon = icond35;
drill36.worldAsset = drillbit35;
drill36.type = DRILL_TYPE;
drill36.level = 36;
drill36.baseWatts = 6000000000000000000n;
drill36.wattMultiplier = 1n;
drillEquips.push(drill36);

var fan36 = new DrillEquip(124);
fan36.translatedName = _("Submersive Heat Disperser") + " T4";
fan36.icon = iconr32;
fan36.type = DRILL_FAN_TYPE;
fan36.level = 36;
fan36.baseWatts = 6100000000000000000n;
fan36.wattMultiplier = 1n;
drillEquips.push(fan36);

//!!!!!!!!!!!!!!!!! AS NEW DRILL EQUIPS ARE ADDED SAVE THEM IN SAVE MANAGER !!!!!!!!!!!!!!!!!

// ############################################################
// ########################### LOGIC ##########################
// ############################################################

function isWaitingForLiftoff()
{
    var isWaitingForLiftOff1 = decimalDepth() >= 1000.9999 && depth < 1100 && hasLaunched == 0;
    var isWaitingForLiftOff2 = decimalDepth() >= 1783.9999 && depth < 1800 && hasLaunched == 1;
    return isWaitingForLiftOff1 || isWaitingForLiftOff2;
}

function decimalDepth()
{
    return depth + Math.min(.99999, parseFloat(divideBigIntToDecimalNumber(progressTowardsNextDepth, depthDifficultyTable[depth], 4)));
}

var lastTickTime = 0;
var cachedProgressDepth = -1;
var cachedProgress = -1;
var cachedDrillSpeedMultiplier = STAT.drillSpeedMultiplier();
var cachedDigWattage = 0;
var cachedDifficultyDepth = -1;
var cachedDepthDifficulty = 0;
// Logic for the drill digging deeper
function dig(dt)
{
    if(depth != cachedDifficultyDepth)
    {
        cachedDifficultyDepth = depth;
        cachedDepthDifficulty = depthDifficultyTable[depth];
    }

    if(progressTowardsNextDepth >= cachedDepthDifficulty && !isWaitingForLiftoff())
    {
        progressTowardsNextDepth = 0n;
        addDepth(1);
        newNews(_("You dug to {0}km!", depth), true);
        trackEvent_DepthIncrease(depth);
        for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
        {
            if(depth == tradeConfig.tradingPosts[i].depth)
            {
                newNews(_("You have discovered a broken trading post at {0}km!", tradeConfig.tradingPosts[i].depth));
            }
        }
        if(depth == 12 && workersHiredAtDepth(12) > 0 && unlockScientistsEarly)
        {
            chestService.spawnChest(12, Chest.natural, ChestType.basic, 1);
        }
        if(depth == 50)
        {
            newNews(_("Check out 50km to purchase from the golem"), true);
        }
        if(isStalledDueToBoss())
        {
            newNews(_("Your drill is stalled, defeat the boss to continue digging deeper!"), true);
        }
        var hoursToGrant = STAT.getPikeHours();
        if(hoursToGrant > 0)
        {
            if(highestOreUnlocked > 0)
            {
                var numMineralsPerMinute = estimateTotalMineralsMinedPerSecond()[highestOreUnlocked] * 60;
                var numMineralsToGrant = Math.floor(numMineralsPerMinute * hoursToGrant * 60);
                if(!isNaN(numMineralsToGrant))
                {
                    worldResources[highestOreUnlocked].numOwned += numMineralsToGrant;
                    newNews(_("Your pike relics gained you {0}x {1}", beautifynum(numMineralsToGrant), worldResources[highestOreUnlocked].name));
                }
            }
        }

        if(depth >= 303 && story == 0 && !isSimulating)
        {
            startUndergroundCityStory();
        }

        if(depth >= 1032 && !isBlueprintKnown(1, 61)) 
        {
            learnRangeOfBlueprints(1, 61, 69);
            newNews(_("You reached the moon!"));
            newNews(_("New blueprints are for sale in the drill center."));
        }


        if(depth >= 1814 && !isBlueprintKnown(1, 107)) 
        {
            learnRangeOfBlueprints(1, 107, 119);
            newNews(_("You reached Titan!"));
            newNews(_("New blueprints are for sale in the drill center."));
        }

        learnReachedStructures();
        learnReachedDroneBlueprints();
    }
    else
    {
        if(depth < (levels.length - 1) && !isStalledDueToBoss())
        {
            let drillSpeedMultiplier = STAT.drillSpeedMultiplier();
            var progressToAdd = 0n;

            if(cachedProgress > -1 && cachedDrillSpeedMultiplier == drillSpeedMultiplier && drillWattage() == cachedDigWattage && cachedProgressDepth == depth)
            {
                progressToAdd = cachedProgress;
            }
            else
            {
                cachedDigWattage = drillWattage();
                progressToAdd = doBigIntDecimalMultiplication(cachedDigWattage, drillSpeedMultiplier);
                cachedProgressDepth = depth;
                cachedProgress = progressToAdd;
                cachedDrillSpeedMultiplier = drillSpeedMultiplier;
            }

            if(isSimulating && dt > 0)
            {
                let maxDt = ((cachedDepthDifficulty - progressTowardsNextDepth) / progressToAdd) + 1n;

                if(BigInt(dt) > maxDt)
                {
                    progressTowardsNextDepth += progressToAdd * maxDt;
                    let remainingDt = dt - Number(maxDt + 1n);

                    if(remainingDt > 1)
                    {
                        dig(1); //call once to handle depth increase. Then again for remaining ticks. too lazy to do this right. only matters for sim
                        dig(remainingDt - 1);
                    }
                }
                else
                {
                    progressTowardsNextDepth += (progressToAdd * BigInt(dt));
                }
            }
            else
            {
                progressTowardsNextDepth += progressToAdd;
            }
        }
    }
    lastTickTime = savetime;
    if(numFramesRendered > 100000) {numFramesRendered = 0;}
    if(framesRendered2 > 100000) {framesRendered2 = 0;}
}



function getBlueprintCount()
{
    return getKnownBlueprints().length;
}

function drillWattage()
{
    return drillState.totalWattage();
}

function estimatedTimeUntilNextDepth()
{
    var wattage = drillWattage();
    wattage = doBigIntDecimalMultiplication(wattage, STAT.drillSpeedMultiplier());
    var timeUntilNextDepth = ((depthDifficultyTable[depth] - progressTowardsNextDepth) / wattage);
    return timeUntilNextDepth;
}

function totalEstimatedTimeForCurrentDepth()
{
    var wattage = drillWattage();
    wattage = doBigIntDecimalMultiplication(wattage, STAT.drillSpeedMultiplier());
    var timeUntilNextDepth = ((depthDifficultyTable[depth]) / wattage);
    return timeUntilNextDepth;
}

function subTickDistancePercent()
{
    if(isStalledDueToBoss() || isWaitingForLiftoff())
    {
        return 0;
    }
    var progressToAdd = drillWattage();
    var perTickDepthIncrease = doBigIntDecimalMultiplication(progressToAdd, STAT.drillSpeedMultiplier());
    var totalTicksForDepthIncrease = (depthDifficultyTable[depth] / perTickDepthIncrease) + 1n;
    var ticksSoFarInDepth = progressTowardsNextDepth / perTickDepthIncrease;
    var percentToNextTick = Math.min(1, ((savetime - lastTickTime) / 1000));

    return Math.min(1, (percentToNextTick + Number(ticksSoFarInDepth)) / Number(totalTicksForDepthIncrease));
}