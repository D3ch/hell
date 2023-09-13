var capacity = 0;
var highestOreUnlocked = 1;
var highestIsotopeUnlocked = 18;


//###########################################################
//##################### WORLD RESOURCES #####################
//###########################################################

const COAL_INDEX = 1;
const COPPER_INDEX = 2;
const SILVER_INDEX = 3;
const GOLD_INDEX = 4;
const PLATINUM_INDEX = 5;
const DIAMOND_INDEX = 6;
const COLTAN_INDEX = 7;
const PAINITE_INDEX = 8;
const BLACK_OPAL_INDEX = 9;
const RED_DIAMOND_INDEX = 10;
const BLUE_OBSIDIAN_INDEX = 11;
const CALIFORNIUM_INDEX = 12;
const CARBON_INDEX = 13;
const IRON_INDEX = 14;
const ALUMINUM_INDEX = 15;
const MAGNESIUM_INDEX = 16;
const TITANIUM_INDEX = 17;
const URANIUM1_INDEX = 18;
const URANIUM2_INDEX = 19;
const URANIUM3_INDEX = 20;
const PLUTONIUM1_INDEX = 21;
const PLUTONIUM2_INDEX = 22;
const PLUTONIUM3_INDEX = 23;
const POLONIUM1_INDEX = 24;
const POLONIUM2_INDEX = 25;
const POLONIUM3_INDEX = 26;
const NITROGEN1_INDEX = 27;
const NITROGEN2_INDEX = 28;
const NITROGEN3_INDEX = 29;
const HELIUM1_INDEX = 30;
const HELIUM2_INDEX = 31;
const HELIUM3_INDEX = 32;
const OIL_INDEX = 33;
const SILICON_INDEX = 34;
const PROMETHIUM_INDEX = 35;
const NEODYMIUM_INDEX = 36;
const YTTERBIUM_INDEX = 37;
const RED_FORGED_GEM_INDEX = 38;
const BLUE_FORGED_GEM_INDEX = 39;
const GREEN_FORGED_GEM_INDEX = 40;
const PURPLE_FORGED_GEM_INDEX = 41;
const YELLOW_FORGED_GEM_INDEX = 42;
const FORGE_CATALYST_INDEX = 43;
const NUCLEAR_ENERGY_INDEX = 44;
const EINSTEINIUM1_INDEX = 45;
const EINSTEINIUM2_INDEX = 46;
const EINSTEINIUM3_INDEX = 47;
const BUILDING_MATERIALS_INDEX = 48;
const FERMIUM1_INDEX = 49;
const FERMIUM2_INDEX = 50;
const FERMIUM3_INDEX = 51;
const TIN_INDEX = 52;
const SULFUR_INDEX = 53;
const LITHIUM_INDEX = 54;
const MANGANESE_INDEX = 55;
const MERCURY_INDEX = 56;
const NICKEL_INDEX = 57;
const ALEXANDRITE_INDEX = 58;
const BENITOITE_INDEX = 59;
const COBALT_INDEX = 60;
const HYDROGEN1_INDEX = 61;
const HYDROGEN2_INDEX = 62;
const HYDROGEN3_INDEX = 63;
const OXYGEN1_INDEX = 64;
const OXYGEN2_INDEX = 65;
const OXYGEN3_INDEX = 66;
const SUPER_MINER_SOULS_INDEX = 67;

var worldResources = [];

var mineralIds = [
    COAL_INDEX,
    COPPER_INDEX,
    SILVER_INDEX,
    GOLD_INDEX,
    PLATINUM_INDEX,
    DIAMOND_INDEX,
    COLTAN_INDEX,
    PAINITE_INDEX,
    BLACK_OPAL_INDEX,
    RED_DIAMOND_INDEX,
    BLUE_OBSIDIAN_INDEX,
    CALIFORNIUM_INDEX,
    CARBON_INDEX,
    IRON_INDEX,
    ALUMINUM_INDEX,
    MAGNESIUM_INDEX,
    TITANIUM_INDEX,
    SILICON_INDEX,
    PROMETHIUM_INDEX,
    NEODYMIUM_INDEX,
    YTTERBIUM_INDEX,
    TIN_INDEX,
    SULFUR_INDEX,
    LITHIUM_INDEX,
    MANGANESE_INDEX,
    MERCURY_INDEX,
    NICKEL_INDEX,
    ALEXANDRITE_INDEX,
    BENITOITE_INDEX,
    COBALT_INDEX
];

var isotopeIds = [
    URANIUM1_INDEX,
    URANIUM2_INDEX,
    URANIUM3_INDEX,
    PLUTONIUM1_INDEX,
    PLUTONIUM2_INDEX,
    PLUTONIUM3_INDEX,
    POLONIUM1_INDEX,
    POLONIUM2_INDEX,
    POLONIUM3_INDEX,
    NITROGEN1_INDEX,
    NITROGEN2_INDEX,
    NITROGEN3_INDEX,
    HELIUM1_INDEX,
    HELIUM2_INDEX,
    HELIUM3_INDEX,
    EINSTEINIUM1_INDEX,
    EINSTEINIUM2_INDEX,
    EINSTEINIUM3_INDEX,
    FERMIUM1_INDEX,
    FERMIUM2_INDEX,
    FERMIUM3_INDEX,
    HYDROGEN1_INDEX,
    HYDROGEN2_INDEX,
    HYDROGEN3_INDEX,
    OXYGEN1_INDEX,
    OXYGEN2_INDEX,
    OXYGEN3_INDEX
];

class WorldResource 
{
    //Static
    index;
    name;
    sellValue;
    isIsotope;
    isotopeIndex;
    indexOfWorldEncountered;
    isOnHeader = true;
    smallIcon;
    smallIconHidden;
    largeIcon;
    largeIconHidden;
    isTradable;
    countsTowardsCapacityAndValue = false;

    //Dynamic
    numOwned = 0;
    level = 0;

    totalValue()
    {
        return this.sellValue * BigInt(parseInt(this.numOwned));
    }
}

var coal = new WorldResource();
coal.index = COAL_INDEX;
coal.name = _("Coal");
coal.sellValue = 1n;
coal.isIsotope = false;
coal.indexOfWorldEncountered = EARTH_INDEX;
coal.smallIcon = coalIcon;
coal.smallIconHidden = coalIconHidden;
coal.largeIcon = coalHD;
coal.largeIconHidden = coalIconHiddenHD;
coal.isTradable = true;
coal.countsTowardsCapacityAndValue = true;
worldResources[COAL_INDEX] = coal;

var copper = new WorldResource();
copper.index = COPPER_INDEX;
copper.name = _("Copper");
copper.sellValue = 2n;
copper.isIsotope = false;
copper.indexOfWorldEncountered = EARTH_INDEX;
copper.smallIcon = copperIcon;
copper.smallIconHidden = copperIconHidden;
copper.largeIcon = copperHD;
copper.largeIconHidden = copperIconHiddenHD;
copper.isTradable = true;
copper.countsTowardsCapacityAndValue = true;
worldResources[COPPER_INDEX] = copper;

var silver = new WorldResource();
silver.index = SILVER_INDEX;
silver.name = _("Silver");
silver.sellValue = 4n;
silver.isIsotope = false;
silver.indexOfWorldEncountered = EARTH_INDEX;
silver.smallIcon = silverIcon;
silver.smallIconHidden = silverIconHidden;
silver.largeIcon = silverHD;
silver.largeIconHidden = silverIconHiddenHD;
silver.isTradable = true;
silver.countsTowardsCapacityAndValue = true;
worldResources[SILVER_INDEX] = silver;

var gold = new WorldResource();
gold.index = GOLD_INDEX;
gold.name = _("Gold");
gold.sellValue = 16n;
gold.isIsotope = false;
gold.indexOfWorldEncountered = EARTH_INDEX;
gold.smallIcon = goldIcon;
gold.smallIconHidden = goldIconHidden;
gold.largeIcon = goldHD;
gold.largeIconHidden = goldIconHiddenHD;
gold.isTradable = true;
gold.countsTowardsCapacityAndValue = true;
worldResources[GOLD_INDEX] = gold;

var platinum = new WorldResource();
platinum.index = GOLD_INDEX;
platinum.name = _("Platinum");
platinum.sellValue = 32n;
platinum.isIsotope = false;
platinum.indexOfWorldEncountered = EARTH_INDEX;
platinum.smallIcon = platinumIcon;
platinum.smallIconHidden = platinumIconHidden;
platinum.largeIcon = platinumHD;
platinum.largeIconHidden = platinumIconHiddenHD;
platinum.isTradable = true;
platinum.countsTowardsCapacityAndValue = true;
worldResources[PLATINUM_INDEX] = platinum;

var diamond = new WorldResource();
diamond.index = DIAMOND_INDEX;
diamond.name = _("Diamond");
diamond.sellValue = 64n;
diamond.isIsotope = false;
diamond.indexOfWorldEncountered = EARTH_INDEX;
diamond.smallIcon = diamondIcon;
diamond.smallIconHidden = diamondIconHidden;
diamond.largeIcon = diamondHD;
diamond.largeIconHidden = diamondIconHiddenHD;
diamond.isTradable = true;
diamond.countsTowardsCapacityAndValue = true;
worldResources[DIAMOND_INDEX] = diamond;

var coltan = new WorldResource();
coltan.index = COLTAN_INDEX;
coltan.name = _("Coltan");
coltan.sellValue = 500n;
coltan.isIsotope = false;
coltan.indexOfWorldEncountered = EARTH_INDEX;
coltan.smallIcon = coltanIcon;
coltan.smallIconHidden = coltanIconHidden;
coltan.largeIcon = coltanHD;
coltan.largeIconHidden = coltanIconHiddenHD;
coltan.isTradable = true;
coltan.countsTowardsCapacityAndValue = true;
worldResources[COLTAN_INDEX] = coltan;

var painite = new WorldResource();
painite.index = PAINITE_INDEX;
painite.name = _("Painite");
painite.sellValue = 1000n;
painite.isIsotope = false;
painite.indexOfWorldEncountered = EARTH_INDEX;
painite.smallIcon = painiteIcon;
painite.smallIconHidden = painiteIconHidden;
painite.largeIcon = painiteHD;
painite.largeIconHidden = painiteIconHiddenHD;
painite.isTradable = true;
painite.countsTowardsCapacityAndValue = true;
worldResources[PAINITE_INDEX] = painite;

var blackOpal = new WorldResource();
blackOpal.index = BLACK_OPAL_INDEX;
blackOpal.name = _("Black Opal");
blackOpal.sellValue = 2000n;
blackOpal.isIsotope = false;
blackOpal.indexOfWorldEncountered = EARTH_INDEX;
blackOpal.smallIcon = blackOpalIcon;
blackOpal.smallIconHidden = blackOpalIconHidden;
blackOpal.largeIcon = blackOpalHD;
blackOpal.largeIconHidden = blackOpalIconHiddenHD;
blackOpal.isTradable = true;
blackOpal.countsTowardsCapacityAndValue = true;
worldResources[BLACK_OPAL_INDEX] = blackOpal;

var redDiamond = new WorldResource();
redDiamond.index = RED_DIAMOND_INDEX;
redDiamond.name = _("Red Diamond");
redDiamond.sellValue = 10000n;
redDiamond.isIsotope = false;
redDiamond.indexOfWorldEncountered = EARTH_INDEX;
redDiamond.smallIcon = redDiamondIcon;
redDiamond.smallIconHidden = redDiamondIconHidden;
redDiamond.largeIcon = redDiamondHD;
redDiamond.largeIconHidden = redDiamondIconHiddenHD;
redDiamond.isTradable = true;
redDiamond.countsTowardsCapacityAndValue = true;
worldResources[RED_DIAMOND_INDEX] = redDiamond;

var blueObsidian = new WorldResource();
blueObsidian.index = BLUE_OBSIDIAN_INDEX;
blueObsidian.name = _("Blue Obsidian");
blueObsidian.sellValue = 20000n;
blueObsidian.isIsotope = false;
blueObsidian.indexOfWorldEncountered = EARTH_INDEX;
blueObsidian.smallIcon = blueObsidianIcon;
blueObsidian.smallIconHidden = blueObsidianIconHidden;
blueObsidian.largeIcon = blueObsidianHD;
blueObsidian.largeIconHidden = blueObsidianIconHiddenHD;
blueObsidian.isTradable = true;
blueObsidian.countsTowardsCapacityAndValue = true;
worldResources[BLUE_OBSIDIAN_INDEX] = blueObsidian;

var californium = new WorldResource();
californium.index = CALIFORNIUM_INDEX;
californium.name = _("Californium");
californium.sellValue = 100000n;
californium.isIsotope = false;
californium.indexOfWorldEncountered = EARTH_INDEX;
californium.smallIcon = californiumIcon;
californium.smallIconHidden = californiumIconHidden;
californium.largeIcon = californiumHD;
californium.largeIconHidden = californiumIconHiddenHD;
californium.isTradable = true;
californium.countsTowardsCapacityAndValue = true;
worldResources[CALIFORNIUM_INDEX] = californium;

var carbon = new WorldResource();
carbon.index = CARBON_INDEX;
carbon.name = _("Carbon");
carbon.sellValue = 500000n;
carbon.isIsotope = false;
carbon.indexOfWorldEncountered = MOON_INDEX;
carbon.smallIcon = carbonIcon;
carbon.smallIconHidden = carbonIconHidden;
carbon.largeIcon = carbonHD;
carbon.largeIconHidden = carbonIconHiddenHD;
carbon.isTradable = true;
carbon.countsTowardsCapacityAndValue = true;
worldResources[CARBON_INDEX] = carbon;

var iron = new WorldResource();
iron.index = IRON_INDEX;
iron.name = _("Iron");
iron.sellValue = 1000000n;
iron.isIsotope = false;
iron.indexOfWorldEncountered = MOON_INDEX;
iron.smallIcon = ironIcon;
iron.smallIconHidden = ironIconHidden;
iron.largeIcon = ironHD;
iron.largeIconHidden = ironIconHiddenHD;
iron.isTradable = true;
iron.countsTowardsCapacityAndValue = true;
worldResources[IRON_INDEX] = iron;

var aluminum = new WorldResource();
aluminum.index = ALUMINUM_INDEX;
aluminum.name = _("Aluminum");
aluminum.sellValue = 2000000n;
aluminum.isIsotope = false;
aluminum.indexOfWorldEncountered = MOON_INDEX;
aluminum.smallIcon = aluminumIcon;
aluminum.smallIconHidden = aluminumIconHidden;
aluminum.largeIcon = aluminumHD;
aluminum.largeIconHidden = aluminumIconHiddenHD;
aluminum.isTradable = true;
aluminum.countsTowardsCapacityAndValue = true;
worldResources[ALUMINUM_INDEX] = aluminum;

var magnesium = new WorldResource();
magnesium.index = MAGNESIUM_INDEX;
magnesium.name = _("Magnesium");
magnesium.sellValue = 5000000n;
magnesium.isIsotope = false;
magnesium.indexOfWorldEncountered = MOON_INDEX;
magnesium.smallIcon = magnesiumIcon;
magnesium.smallIconHidden = magnesiumIconHidden;
magnesium.largeIcon = magnesiumHD;
magnesium.largeIconHidden = magnesiumIconHiddenHD;
magnesium.isTradable = true;
magnesium.countsTowardsCapacityAndValue = true;
worldResources[MAGNESIUM_INDEX] = magnesium;

var titanium = new WorldResource();
titanium.index = TITANIUM_INDEX;
titanium.name = _("Titanium");
titanium.sellValue = 750000000n;
titanium.isIsotope = false;
titanium.indexOfWorldEncountered = MOON_INDEX;
titanium.smallIcon = titaniumIcon;
titanium.smallIconHidden = titaniumIconHidden;
titanium.largeIcon = titaniumHD;
titanium.largeIconHidden = titaniumIconHiddenHD;
titanium.isTradable = true;
titanium.countsTowardsCapacityAndValue = true;
worldResources[TITANIUM_INDEX] = titanium;

var silicon = new WorldResource();
silicon.index = SILICON_INDEX;
silicon.name = _("Silicon");
silicon.sellValue = 100000000n;
silicon.isIsotope = false;
silicon.indexOfWorldEncountered = MOON_INDEX;
silicon.smallIcon = siliconIcon;
silicon.smallIconHidden = siliconIconHidden;
silicon.largeIcon = siliconHD;
silicon.largeIconHidden = siliconIconHiddenHD;
silicon.isTradable = true;
silicon.countsTowardsCapacityAndValue = true;
worldResources[SILICON_INDEX] = silicon;

var promethium = new WorldResource();
promethium.index = PROMETHIUM_INDEX;
promethium.name = _("Promethium");
promethium.sellValue = 1400000000n;
promethium.isIsotope = false;
promethium.indexOfWorldEncountered = MOON_INDEX;
promethium.smallIcon = promethiumIcon;
promethium.smallIconHidden = promethiumIconHidden;
promethium.largeIcon = promethiumHD;
promethium.largeIconHidden = promethiumIconHiddenHD;
promethium.isTradable = true;
promethium.countsTowardsCapacityAndValue = true;
worldResources[PROMETHIUM_INDEX] = promethium;

var neodymium = new WorldResource();
neodymium.index = NEODYMIUM_INDEX;
neodymium.name = _("Neodymium");
neodymium.sellValue = 10000000000n;
neodymium.isIsotope = false;
neodymium.indexOfWorldEncountered = MOON_INDEX;
neodymium.smallIcon = neodymiumIcon;
neodymium.smallIconHidden = neodymiumIconHidden;
neodymium.largeIcon = neodymiumHD;
neodymium.largeIconHidden = neodymiumIconHiddenHD;
neodymium.isTradable = true;
neodymium.countsTowardsCapacityAndValue = true;
worldResources[NEODYMIUM_INDEX] = neodymium;

var ytterbium = new WorldResource();
ytterbium.index = YTTERBIUM_INDEX;
ytterbium.name = _("Ytterbium");
ytterbium.sellValue = 50000000000n;
ytterbium.isIsotope = false;
ytterbium.indexOfWorldEncountered = MOON_INDEX;
ytterbium.smallIcon = ytterbiumIcon;
ytterbium.smallIconHidden = ytterbiumIconHidden;
ytterbium.largeIcon = ytterbiumHD;
ytterbium.largeIconHidden = ytterbiumIconHiddenHD;
ytterbium.isTradable = true;
ytterbium.countsTowardsCapacityAndValue = true;
worldResources[YTTERBIUM_INDEX] = ytterbium;

var uranium1 = new WorldResource();
uranium1.index = URANIUM1_INDEX;
uranium1.name = _("Uranium") + "1";
uranium1.sellValue = 100n;
uranium1.isIsotope = true;
uranium1.isotopeIndex = 0;
uranium1.indexOfWorldEncountered = EARTH_INDEX;
uranium1.smallIcon = uranium1Icon;
uranium1.smallIconHidden = isotopeIconHidden;
uranium1.largeIcon = uranium1HD;
uranium1.largeIconHidden = isotopeIconHiddenHD;
uranium1.isTradable = true;
uranium1.countsTowardsCapacityAndValue = true;
worldResources[URANIUM1_INDEX] = uranium1;

var uranium2 = new WorldResource();
uranium2.index = URANIUM2_INDEX;
uranium2.name = _("Uranium") + "2";
uranium2.sellValue = 2000n;
uranium2.isIsotope = true;
uranium2.isotopeIndex = 1;
uranium2.indexOfWorldEncountered = EARTH_INDEX;
uranium2.smallIcon = uranium2Icon;
uranium2.smallIconHidden = isotopeIconHidden;
uranium2.largeIcon = uranium2HD;
uranium2.largeIconHidden = isotopeIconHiddenHD;
uranium2.isTradable = false;
uranium2.countsTowardsCapacityAndValue = false;
worldResources[URANIUM2_INDEX] = uranium2;

var uranium3 = new WorldResource();
uranium3.index = URANIUM3_INDEX;
uranium3.name = _("Uranium") + "3";
uranium3.sellValue = 50000n;
uranium3.isIsotope = true;
uranium3.isotopeIndex = 2;
uranium3.indexOfWorldEncountered = EARTH_INDEX;
uranium3.smallIcon = uranium3Icon;
uranium3.smallIconHidden = isotopeIconHidden;
uranium3.largeIcon = uranium3HD;
uranium3.largeIconHidden = isotopeIconHiddenHD;
uranium3.isTradable = false;
uranium3.countsTowardsCapacityAndValue = false;
worldResources[URANIUM3_INDEX] = uranium3;

var plutonium1 = new WorldResource();
plutonium1.index = PLUTONIUM1_INDEX;
plutonium1.name = _("Plutonium") + "1";
plutonium1.sellValue = 1000n;
plutonium1.isIsotope = true;
plutonium1.isotopeIndex = 0;
plutonium1.indexOfWorldEncountered = EARTH_INDEX;
plutonium1.smallIcon = plutonium1Icon;
plutonium1.smallIconHidden = isotopeIconHidden;
plutonium1.largeIcon = plutonium1HD;
plutonium1.largeIconHidden = isotopeIconHiddenHD;
plutonium1.isTradable = true;
plutonium1.countsTowardsCapacityAndValue = true;
worldResources[PLUTONIUM1_INDEX] = plutonium1;

var plutonium2 = new WorldResource();
plutonium2.index = PLUTONIUM2_INDEX;
plutonium2.name = _("Plutonium") + "2";
plutonium2.sellValue = 20000n;
plutonium2.isIsotope = true;
plutonium2.isotopeIndex = 1;
plutonium2.indexOfWorldEncountered = EARTH_INDEX;
plutonium2.smallIcon = plutonium2Icon;
plutonium2.smallIconHidden = isotopeIconHidden;
plutonium2.largeIcon = plutonium2HD;
plutonium2.largeIconHidden = isotopeIconHiddenHD;
plutonium2.isTradable = false;
plutonium2.countsTowardsCapacityAndValue = false;
worldResources[PLUTONIUM2_INDEX] = plutonium2;

var plutonium3 = new WorldResource();
plutonium3.index = PLUTONIUM3_INDEX;
plutonium3.name = _("Plutonium") + "3";
plutonium3.sellValue = 500000n;
plutonium3.isIsotope = true;
plutonium3.isotopeIndex = 2;
plutonium3.indexOfWorldEncountered = EARTH_INDEX;
plutonium3.smallIcon = plutonium3Icon;
plutonium3.smallIconHidden = isotopeIconHidden;
plutonium3.largeIcon = plutonium3HD;
plutonium3.largeIconHidden = isotopeIconHiddenHD;
plutonium3.isTradable = false;
plutonium3.countsTowardsCapacityAndValue = false;
worldResources[PLUTONIUM3_INDEX] = plutonium3;

var polonium1 = new WorldResource();
polonium1.index = POLONIUM1_INDEX;
polonium1.name = _("Polonium") + "1";
polonium1.sellValue = 5000n;
polonium1.isIsotope = true;
polonium1.isotopeIndex = 0;
polonium1.indexOfWorldEncountered = EARTH_INDEX;
polonium1.smallIcon = polonium1Icon;
polonium1.smallIconHidden = isotopeIconHidden;
polonium1.largeIcon = polonium1HD;
polonium1.largeIconHidden = isotopeIconHiddenHD;
polonium1.isTradable = true;
polonium1.countsTowardsCapacityAndValue = true;
worldResources[POLONIUM1_INDEX] = polonium1;

var polonium2 = new WorldResource();
polonium2.index = POLONIUM2_INDEX;
polonium2.name = _("Polonium") + "2";
polonium2.sellValue = 250000n;
polonium2.isIsotope = true;
polonium2.isotopeIndex = 1;
polonium2.indexOfWorldEncountered = EARTH_INDEX;
polonium2.smallIcon = polonium2Icon;
polonium2.smallIconHidden = isotopeIconHidden;
polonium2.largeIcon = polonium2HD;
polonium2.largeIconHidden = isotopeIconHiddenHD;
polonium2.isTradable = false;
polonium2.countsTowardsCapacityAndValue = false;
worldResources[POLONIUM2_INDEX] = polonium2;

var polonium3 = new WorldResource();
polonium3.index = POLONIUM3_INDEX;
polonium3.name = _("Polonium") + "3";
polonium3.sellValue = 50000000n;
polonium3.isIsotope = true;
polonium3.isotopeIndex = 2;
polonium3.indexOfWorldEncountered = EARTH_INDEX;
polonium3.smallIcon = polonium3Icon;
polonium3.smallIconHidden = isotopeIconHidden;
polonium3.largeIcon = polonium3HD;
polonium3.largeIconHidden = isotopeIconHiddenHD;
polonium3.isTradable = false;
polonium3.countsTowardsCapacityAndValue = false;
worldResources[POLONIUM3_INDEX] = polonium3;

var nitrogen1 = new WorldResource();
nitrogen1.index = NITROGEN1_INDEX;
nitrogen1.name = _("Nitrogen") + "1";
nitrogen1.sellValue = 50000000n;
nitrogen1.isIsotope = true;
nitrogen1.isotopeIndex = 0;
nitrogen1.indexOfWorldEncountered = MOON_INDEX;
nitrogen1.smallIcon = nitrogen1Icon;
nitrogen1.smallIconHidden = isotopeIconHidden;
nitrogen1.largeIcon = nitrogen1HD;
nitrogen1.largeIconHidden = isotopeIconHiddenHD;
nitrogen1.isTradable = true;
nitrogen1.countsTowardsCapacityAndValue = true;
worldResources[NITROGEN1_INDEX] = nitrogen1;

var nitrogen2 = new WorldResource();
nitrogen2.index = NITROGEN2_INDEX;
nitrogen2.name = _("Nitrogen") + "2";
nitrogen2.sellValue = 150000000n;
nitrogen2.isIsotope = true;
nitrogen2.isotopeIndex = 1;
nitrogen2.indexOfWorldEncountered = MOON_INDEX;
nitrogen2.smallIcon = nitrogen2Icon;
nitrogen2.smallIconHidden = isotopeIconHidden;
nitrogen2.largeIcon = nitrogen2HD;
nitrogen2.largeIconHidden = isotopeIconHiddenHD;
nitrogen2.isTradable = false;
nitrogen2.countsTowardsCapacityAndValue = false;
worldResources[NITROGEN2_INDEX] = nitrogen2;

var nitrogen3 = new WorldResource();
nitrogen3.index = NITROGEN3_INDEX;
nitrogen3.name = _("Nitrogen") + "3";
nitrogen3.sellValue = 300000000n;
nitrogen3.isIsotope = true;
nitrogen3.isotopeIndex = 2;
nitrogen3.indexOfWorldEncountered = MOON_INDEX;
nitrogen3.smallIcon = nitrogen3Icon;
nitrogen3.smallIconHidden = isotopeIconHidden;
nitrogen3.largeIcon = nitrogen3HD;
nitrogen3.largeIconHidden = isotopeIconHiddenHD;
nitrogen3.isTradable = false;
nitrogen3.countsTowardsCapacityAndValue = false;
worldResources[NITROGEN3_INDEX] = nitrogen3;

var helium1 = new WorldResource();
helium1.index = HELIUM1_INDEX;
helium1.name = _("Helium") + "1";
helium1.sellValue = 500000000n;
helium1.isIsotope = true;
helium1.isotopeIndex = 0;
helium1.indexOfWorldEncountered = MOON_INDEX;
helium1.smallIcon = helium1Icon;
helium1.smallIconHidden = isotopeIconHidden;
helium1.largeIcon = helium1HD;
helium1.largeIconHidden = isotopeIconHiddenHD;
helium1.isTradable = true;
helium1.countsTowardsCapacityAndValue = true;
worldResources[HELIUM1_INDEX] = helium1;

var helium2 = new WorldResource();
helium2.index = HELIUM2_INDEX;
helium2.name = _("Helium") + "2";
helium2.sellValue = 5000000000n;
helium2.isIsotope = true;
helium2.isotopeIndex = 1;
helium2.indexOfWorldEncountered = MOON_INDEX;
helium2.smallIcon = helium2Icon;
helium2.smallIconHidden = isotopeIconHidden;
helium2.largeIcon = helium2HD;
helium2.largeIconHidden = isotopeIconHiddenHD;
helium2.isTradable = false;
helium2.countsTowardsCapacityAndValue = false;
worldResources[HELIUM2_INDEX] = helium2;

var helium3 = new WorldResource();
helium3.index = HELIUM3_INDEX;
helium3.name = _("Helium") + "3";
helium3.sellValue = 500000000000n;
helium3.isIsotope = true;
helium3.isotopeIndex = 2;
helium3.indexOfWorldEncountered = MOON_INDEX;
helium3.smallIcon = helium3Icon;
helium3.smallIconHidden = isotopeIconHidden;
helium3.largeIcon = helium3HD;
helium3.largeIconHidden = isotopeIconHiddenHD;
helium3.isTradable = false;
helium3.countsTowardsCapacityAndValue = false;
worldResources[HELIUM3_INDEX] = helium3;

var oilResource = new WorldResource();
oilResource.index = OIL_INDEX;
oilResource.name = _("Oil");
oilResource.sellValue = 0n;
oilResource.isIsotope = false;
oilResource.isOnHeader = false;
oilResource.indexOfWorldEncountered = EARTH_INDEX;
oilResource.smallIcon = OIL_icon;
oilResource.smallIconHidden = OIL_icon;
oilResource.largeIcon = OIL_icon;
oilResource.largeIconHidden = OIL_icon;
oilResource.isTradable = false;
worldResources[OIL_INDEX] = oilResource;

var redForgedGem = new WorldResource();
redForgedGem.index = RED_FORGED_GEM_INDEX;
redForgedGem.name = _("Red Forged Gem");
redForgedGem.sellValue = 0n;
redForgedGem.isIsotope = false;
redForgedGem.isOnHeader = false;
redForgedGem.indexOfWorldEncountered = EARTH_INDEX;
redForgedGem.smallIcon = forgedRedGem;
redForgedGem.smallIconHidden = forgedRedGem;
redForgedGem.largeIcon = forgedRedGem;
redForgedGem.largeIconHidden = forgedRedGem;
redForgedGem.isTradable = false;
worldResources[RED_FORGED_GEM_INDEX] = redForgedGem;

var blueForgedGem = new WorldResource();
blueForgedGem.index = BLUE_FORGED_GEM_INDEX;
blueForgedGem.name = _("Blue Forged Gem");
blueForgedGem.sellValue = 0n;
blueForgedGem.isIsotope = false;
blueForgedGem.isOnHeader = false;
blueForgedGem.indexOfWorldEncountered = EARTH_INDEX;
blueForgedGem.smallIcon = forgedBlueGem;
blueForgedGem.smallIconHidden = forgedBlueGem;
blueForgedGem.largeIcon = forgedBlueGem;
blueForgedGem.largeIconHidden = forgedBlueGem;
blueForgedGem.isTradable = false;
worldResources[BLUE_FORGED_GEM_INDEX] = blueForgedGem;

var greenForgedGem = new WorldResource();
greenForgedGem.index = GREEN_FORGED_GEM_INDEX;
greenForgedGem.name = _("Green Forged Gem");
greenForgedGem.sellValue = 0n;
greenForgedGem.isIsotope = false;
greenForgedGem.isOnHeader = false;
greenForgedGem.indexOfWorldEncountered = EARTH_INDEX;
greenForgedGem.smallIcon = forgedGreenGem;
greenForgedGem.smallIconHidden = forgedGreenGem;
greenForgedGem.largeIcon = forgedGreenGem;
greenForgedGem.largeIconHidden = forgedGreenGem;
greenForgedGem.isTradable = false;
worldResources[GREEN_FORGED_GEM_INDEX] = greenForgedGem;

var purpleForgedGem = new WorldResource();
purpleForgedGem.index = PURPLE_FORGED_GEM_INDEX;
purpleForgedGem.name = _("Purple Forged Gem");
purpleForgedGem.sellValue = 0n;
purpleForgedGem.isIsotope = false;
purpleForgedGem.isOnHeader = false;
purpleForgedGem.indexOfWorldEncountered = EARTH_INDEX;
purpleForgedGem.smallIcon = forgedPurpleGem;
purpleForgedGem.smallIconHidden = forgedPurpleGem;
purpleForgedGem.largeIcon = forgedPurpleGem;
purpleForgedGem.largeIconHidden = forgedPurpleGem;
purpleForgedGem.isTradable = false;
worldResources[PURPLE_FORGED_GEM_INDEX] = purpleForgedGem;

var yellowForgedGem = new WorldResource();
yellowForgedGem.index = YELLOW_FORGED_GEM_INDEX;
yellowForgedGem.name = _("Yellow Forged Gem");
yellowForgedGem.sellValue = 0n;
yellowForgedGem.isIsotope = false;
yellowForgedGem.isOnHeader = false;
yellowForgedGem.indexOfWorldEncountered = EARTH_INDEX;
yellowForgedGem.smallIcon = forgedYellowGem;
yellowForgedGem.smallIconHidden = forgedYellowGem;
yellowForgedGem.largeIcon = forgedYellowGem;
yellowForgedGem.largeIconHidden = forgedYellowGem;
yellowForgedGem.isTradable = false;
worldResources[YELLOW_FORGED_GEM_INDEX] = yellowForgedGem;

var forgeCatalystResource = new WorldResource();
forgeCatalystResource.index = FORGE_CATALYST_INDEX;
forgeCatalystResource.name = _("Forge Catalyst");
forgeCatalystResource.sellValue = 0n;
forgeCatalystResource.isIsotope = false;
forgeCatalystResource.isOnHeader = false;
forgeCatalystResource.indexOfWorldEncountered = EARTH_INDEX;
forgeCatalystResource.smallIcon = forgeCatalystAsset;
forgeCatalystResource.smallIconHidden = forgeCatalystAsset;
forgeCatalystResource.largeIcon = forgeCatalystAsset;
forgeCatalystResource.largeIconHidden = forgeCatalystAsset;
forgeCatalystResource.isTradable = false;
worldResources[FORGE_CATALYST_INDEX] = forgeCatalystResource;

var storedNuclearEnergy = new WorldResource();
storedNuclearEnergy.index = NUCLEAR_ENERGY_INDEX;
storedNuclearEnergy.name = _("Stored Nuclear Energy");
storedNuclearEnergy.sellValue = 0n;
storedNuclearEnergy.isIsotope = false;
storedNuclearEnergy.isOnHeader = false;
storedNuclearEnergy.indexOfWorldEncountered = MOON_INDEX;
storedNuclearEnergy.smallIcon = energyIcon;
storedNuclearEnergy.smallIconHidden = energyIcon;
storedNuclearEnergy.largeIcon = energyIcon;
storedNuclearEnergy.largeIconHidden = energyIcon;
storedNuclearEnergy.isTradable = false;
worldResources[NUCLEAR_ENERGY_INDEX] = storedNuclearEnergy;

var einsteinium1 = new WorldResource();
einsteinium1.index = EINSTEINIUM1_INDEX;
einsteinium1.name = _("Einsteinium") + "1";
einsteinium1.sellValue = 550000000000n;
einsteinium1.isIsotope = true;
einsteinium1.isotopeIndex = 0;
einsteinium1.indexOfWorldEncountered = MOON_INDEX;
einsteinium1.smallIcon = einsteinium1Icon;
einsteinium1.smallIconHidden = isotopeIconHidden;
einsteinium1.largeIcon = einsteinium1HD;
einsteinium1.largeIconHidden = isotopeIconHiddenHD;
einsteinium1.isTradable = false;
worldResources[EINSTEINIUM1_INDEX] = einsteinium1;

var einsteinium2 = new WorldResource();
einsteinium2.index = EINSTEINIUM2_INDEX;
einsteinium2.name = _("Einsteinium") + "2";
einsteinium2.sellValue = 5500000000000n;
einsteinium2.isIsotope = true;
einsteinium2.isotopeIndex = 1;
einsteinium2.indexOfWorldEncountered = MOON_INDEX;
einsteinium2.smallIcon = einsteinium2Icon;
einsteinium2.smallIconHidden = isotopeIconHidden;
einsteinium2.largeIcon = einsteinium2HD;
einsteinium2.largeIconHidden = isotopeIconHiddenHD;
einsteinium2.isTradable = false;
worldResources[EINSTEINIUM2_INDEX] = einsteinium2;

var einsteinium3 = new WorldResource();
einsteinium3.index = EINSTEINIUM3_INDEX;
einsteinium3.name = _("Einsteinium") + "3";
einsteinium3.sellValue = 550000000000000n;
einsteinium3.isIsotope = true;
einsteinium3.isotopeIndex = 2;
einsteinium3.indexOfWorldEncountered = MOON_INDEX;
einsteinium3.smallIcon = einsteinium3Icon;
einsteinium3.smallIconHidden = isotopeIconHidden;
einsteinium3.largeIcon = einsteinium3HD;
einsteinium3.largeIconHidden = isotopeIconHiddenHD;
einsteinium3.isTradable = false;
worldResources[EINSTEINIUM3_INDEX] = einsteinium3;

var buildingMaterials = new WorldResource();
buildingMaterials.index = BUILDING_MATERIALS_INDEX;
buildingMaterials.name = _("Building Materials");
buildingMaterials.sellValue = 0n;
buildingMaterials.isIsotope = false;
buildingMaterials.isOnHeader = false;
buildingMaterials.isotopeIndex = 0;
buildingMaterials.indexOfWorldEncountered = EARTH_INDEX;
buildingMaterials.smallIcon = buildingMaterialsIcon;
buildingMaterials.smallIconHidden = buildingMaterialsIcon;
buildingMaterials.largeIcon = buildingMaterialsIcon;
buildingMaterials.largeIconHidden = buildingMaterialsIcon;
buildingMaterials.isTradable = false;
worldResources[BUILDING_MATERIALS_INDEX] = buildingMaterials;


var fermium1 = new WorldResource();
fermium1.index = FERMIUM1_INDEX;
fermium1.name = _("Fermium") + "1";
fermium1.sellValue = 66600000000000n;
fermium1.isIsotope = true;
fermium1.isotopeIndex = 0;
fermium1.indexOfWorldEncountered = MOON_INDEX;
fermium1.smallIcon = fermium1Icon;
fermium1.smallIconHidden = isotopeIconHidden;
fermium1.largeIcon = fermium1HD;
fermium1.largeIconHidden = isotopeIconHiddenHD;
fermium1.isTradable = false;
worldResources[FERMIUM1_INDEX] = fermium1;

var fermium2 = new WorldResource();
fermium2.index = FERMIUM2_INDEX;
fermium2.name = _("Fermium") + "2";
fermium2.sellValue = 246000000000000n;
fermium2.isIsotope = true;
fermium2.isotopeIndex = 1;
fermium2.indexOfWorldEncountered = MOON_INDEX;
fermium2.smallIcon = fermium2Icon;
fermium2.smallIconHidden = isotopeIconHidden;
fermium2.largeIcon = fermium2HD;
fermium2.largeIconHidden = isotopeIconHiddenHD;
fermium2.isTradable = false;
worldResources[FERMIUM2_INDEX] = fermium2;

var fermium3 = new WorldResource();
fermium3.index = FERMIUM3_INDEX;
fermium3.name = _("Fermium") + "3";
fermium3.sellValue = 6960000000000000n;
fermium3.isIsotope = true;
fermium3.isotopeIndex = 2;
fermium3.indexOfWorldEncountered = MOON_INDEX;
fermium3.smallIcon = fermium3Icon;
fermium3.smallIconHidden = isotopeIconHidden;
fermium3.largeIcon = fermium3HD;
fermium3.largeIconHidden = isotopeIconHiddenHD;
fermium3.isTradable = false;
worldResources[FERMIUM3_INDEX] = fermium3;

var hydrogen1 = new WorldResource();
hydrogen1.index = HYDROGEN1_INDEX;
hydrogen1.name = _("Hydrogen") + "1";
hydrogen1.sellValue = 50000000000000n;
hydrogen1.isIsotope = true;
hydrogen1.isotopeIndex = 0;
hydrogen1.indexOfWorldEncountered = TITAN_INDEX;
hydrogen1.smallIcon = hydrogen1Icon;
hydrogen1.smallIconHidden = isotopeIconHidden;
hydrogen1.largeIcon = hydrogen1HD;
hydrogen1.largeIconHidden = isotopeIconHiddenHD;
hydrogen1.isTradable = false;
hydrogen1.countsTowardsCapacityAndValue = true;
worldResources[HYDROGEN1_INDEX] = hydrogen1;

var hydrogen2 = new WorldResource();
hydrogen2.index = HYDROGEN2_INDEX;
hydrogen2.name = _("Hydrogen") + "2";
hydrogen2.sellValue = 500000000000000n;
hydrogen2.isIsotope = true;
hydrogen2.isotopeIndex = 1;
hydrogen2.indexOfWorldEncountered = TITAN_INDEX;
hydrogen2.smallIcon = hydrogen2Icon;
hydrogen2.smallIconHidden = isotopeIconHidden;
hydrogen2.largeIcon = hydrogen2HD;
hydrogen2.largeIconHidden = isotopeIconHiddenHD;
hydrogen2.isTradable = false;
hydrogen2.countsTowardsCapacityAndValue = false;
worldResources[HYDROGEN2_INDEX] = hydrogen2;

var hydrogen3 = new WorldResource();
hydrogen3.index = HYDROGEN3_INDEX;
hydrogen3.name = _("Hydrogen") + "3";
hydrogen3.sellValue = 500000000000000n;
hydrogen3.isIsotope = true;
hydrogen3.isotopeIndex = 2;
hydrogen3.indexOfWorldEncountered = TITAN_INDEX;
hydrogen3.smallIcon = hydrogen3Icon;
hydrogen3.smallIconHidden = isotopeIconHidden;
hydrogen3.largeIcon = hydrogen3HD;
hydrogen3.largeIconHidden = isotopeIconHiddenHD;
hydrogen3.isTradable = false;
hydrogen3.countsTowardsCapacityAndValue = false;
worldResources[HYDROGEN3_INDEX] = hydrogen3;

var oxygen1 = new WorldResource();
oxygen1.index = OXYGEN1_INDEX;
oxygen1.name = _("Oxygen") + "1";
oxygen1.sellValue = 66600000000000n;
oxygen1.isIsotope = true;
oxygen1.isotopeIndex = 0;
oxygen1.indexOfWorldEncountered = TITAN_INDEX;
oxygen1.smallIcon = oxygen1Icon;
oxygen1.smallIconHidden = isotopeIconHidden;
oxygen1.largeIcon = oxygen1HD;
oxygen1.largeIconHidden = isotopeIconHiddenHD;
oxygen1.isTradable = false;
oxygen1.countsTowardsCapacityAndValue = true;
worldResources[OXYGEN1_INDEX] = oxygen1;

var oxygen2 = new WorldResource();
oxygen2.index = OXYGEN2_INDEX;
oxygen2.name = _("Oxygen") + "2";
oxygen2.sellValue = 66600000000000n;
oxygen2.isIsotope = true;
oxygen2.isotopeIndex = 1;
oxygen2.indexOfWorldEncountered = TITAN_INDEX;
oxygen2.smallIcon = oxygen2Icon;
oxygen2.smallIconHidden = isotopeIconHidden;
oxygen2.largeIcon = oxygen2HD;
oxygen2.largeIconHidden = isotopeIconHiddenHD;
oxygen2.isTradable = false;
oxygen2.countsTowardsCapacityAndValue = false;
worldResources[OXYGEN2_INDEX] = oxygen2;

var oxygen3 = new WorldResource();
oxygen3.index = OXYGEN3_INDEX;
oxygen3.name = _("Oxygen") + "3";
oxygen3.sellValue = 66600000000000n;
oxygen3.isIsotope = true;
oxygen3.isotopeIndex = 2;
oxygen3.indexOfWorldEncountered = TITAN_INDEX;
oxygen3.smallIcon = oxygen3Icon;
oxygen3.smallIconHidden = isotopeIconHidden;
oxygen3.largeIcon = oxygen3HD;
oxygen3.largeIconHidden = isotopeIconHiddenHD;
oxygen3.isTradable = false;
oxygen3.countsTowardsCapacityAndValue = false;
worldResources[OXYGEN3_INDEX] = oxygen3;

var tin = new WorldResource();
tin.index = TIN_INDEX;
tin.name = _("Tin");
tin.sellValue = 500000000000n;
tin.isIsotope = false;
tin.indexOfWorldEncountered = TITAN_INDEX;
tin.smallIcon = tinIcon;
tin.smallIconHidden = tinIconHidden;
tin.largeIcon = tinHD;
tin.largeIconHidden = tinIconHiddenHD;
tin.isTradable = false;
tin.countsTowardsCapacityAndValue = true;
worldResources[TIN_INDEX] = tin;

var sulfur = new WorldResource();
sulfur.index = SULFUR_INDEX;
sulfur.name = _("Sulfur");
sulfur.sellValue = 2500000000000n;
sulfur.isIsotope = false;
sulfur.indexOfWorldEncountered = TITAN_INDEX;
sulfur.smallIcon = sulpherIcon;
sulfur.smallIconHidden = sulpherIconHidden;
sulfur.largeIcon = sulpherHD;
sulfur.largeIconHidden = sulpherHD;
sulfur.isTradable = false;
sulfur.countsTowardsCapacityAndValue = true;
worldResources[SULFUR_INDEX] = sulfur;

var lithium = new WorldResource();
lithium.index = LITHIUM_INDEX;
lithium.name = _("Lithium");
lithium.sellValue = 10000000000000n;
lithium.isIsotope = false;
lithium.indexOfWorldEncountered = TITAN_INDEX;
lithium.smallIcon = lithiumIcon;
lithium.smallIconHidden = lithiumIconHidden;
lithium.largeIcon = lithiumHD;
lithium.largeIconHidden = lithiumIconHiddenHD;
lithium.isTradable = false;
lithium.countsTowardsCapacityAndValue = true;
worldResources[LITHIUM_INDEX] = lithium;

var manganese = new WorldResource();
manganese.index = MANGANESE_INDEX;
manganese.name = _("Manganese");
manganese.sellValue = 5000000000000n;
manganese.isIsotope = false;
manganese.indexOfWorldEncountered = TITAN_INDEX;
manganese.smallIcon = manganeseIcon;
manganese.smallIconHidden = manganeseIconHidden;
manganese.largeIcon = manganeseHD;
manganese.largeIconHidden = manganeseIconHiddenHD;
manganese.isTradable = false;
manganese.countsTowardsCapacityAndValue = true;
worldResources[MANGANESE_INDEX] = manganese;

var mercury = new WorldResource();
mercury.index = MERCURY_INDEX;
mercury.name = _("Mercury");
mercury.sellValue = 5000000000000n;
mercury.isIsotope = false;
mercury.indexOfWorldEncountered = TITAN_INDEX;
mercury.smallIcon = mercuryIcon;
mercury.smallIconHidden = mercuryIconHidden;
mercury.largeIcon = mercuryHD;
mercury.largeIconHidden = mercuryIconHiddenHD;
mercury.isTradable = false;
mercury.countsTowardsCapacityAndValue = true;
worldResources[MERCURY_INDEX] = mercury;

var nickel = new WorldResource();
nickel.index = NICKEL_INDEX;
nickel.name = _("nickel");
nickel.sellValue = 5000000000000n;
nickel.isIsotope = false;
nickel.indexOfWorldEncountered = TITAN_INDEX;
nickel.smallIcon = nickelIcon;
nickel.smallIconHidden = nickelIconHidden;
nickel.largeIcon = nickelHD;
nickel.largeIconHidden = nickelIconHiddenHD;
nickel.isTradable = false;
nickel.countsTowardsCapacityAndValue = true;
worldResources[NICKEL_INDEX] = nickel;

var alexandrite = new WorldResource();
alexandrite.index = ALEXANDRITE_INDEX;
alexandrite.name = _("Alexandrite");
alexandrite.sellValue = 5000000000000n;
alexandrite.isIsotope = false;
alexandrite.indexOfWorldEncountered = TITAN_INDEX;
alexandrite.smallIcon = alexandriteIcon;
alexandrite.smallIconHidden = alexandriteIconHidden;
alexandrite.largeIcon = alexandriteHD;
alexandrite.largeIconHidden = alexandriteIconHiddenHD;
alexandrite.isTradable = false;
alexandrite.countsTowardsCapacityAndValue = true;
worldResources[ALEXANDRITE_INDEX] = alexandrite;

var benitoite = new WorldResource();
benitoite.index = BENITOITE_INDEX;
benitoite.name = _("Benitoite");
benitoite.sellValue = 5000000000000n;
benitoite.isIsotope = false;
benitoite.indexOfWorldEncountered = TITAN_INDEX;
benitoite.smallIcon = benitoiteIcon;
benitoite.smallIconHidden = benitoiteIconHidden;
benitoite.largeIcon = benitoiteHD;
benitoite.largeIconHidden = benitoiteIconHiddenHD;
benitoite.isTradable = false;
benitoite.countsTowardsCapacityAndValue = true;
worldResources[BENITOITE_INDEX] = benitoite;

var cobalt = new WorldResource();
cobalt.index = COBALT_INDEX;
cobalt.name = _("Cobalt");
cobalt.sellValue = 5000000000000n;
cobalt.isIsotope = false;
cobalt.indexOfWorldEncountered = TITAN_INDEX;
cobalt.smallIcon = cobaltIcon;
cobalt.smallIconHidden = cobaltIconHidden;
cobalt.largeIcon = cobaltHD;
cobalt.largeIconHidden = cobaltIconHiddenHD;
cobalt.isTradable = false;
cobalt.countsTowardsCapacityAndValue = true;
worldResources[COBALT_INDEX] = cobalt;

var superMinerSouls = new WorldResource();
superMinerSouls.index = SUPER_MINER_SOULS_INDEX;
superMinerSouls.name = _("Super Miner Souls");
superMinerSouls.sellValue = 0n;
superMinerSouls.isIsotope = false;
superMinerSouls.isOnHeader = false;
superMinerSouls.isotopeIndex = 0;
superMinerSouls.indexOfWorldEncountered = EARTH_INDEX;
superMinerSouls.smallIcon = superMinerSoul;
superMinerSouls.smallIconHidden = superMinerSoul;
superMinerSouls.largeIcon = superMinerSoulHD;
superMinerSouls.largeIconHidden = superMinerSoulHD;
superMinerSouls.isTradable = false;
worldResources[SUPER_MINER_SOULS_INDEX] = superMinerSouls;


var lockedMineralAmtsToSave = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0
];

//############################################################
//####################### MINING LOGIC #######################
//############################################################


var cachedCountsTowardsCapacityAndValue = worldResources.filter(resource => resource.countsTowardsCapacityAndValue);

//LOGGING VALUES
var timesSinceSnapshot = 0;
var isTakingSnapshot = false;
var valueBefore = 0;
var invalidateSnapshot = false;
var mineralsMined = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var totalMineralsMined = 0;
var mineralsMinedValue = 0n;
var mineralsSoldValue = 0n;

// Gather minerals from all workers on each level
function mine()
{
    var mineralsBeforeMine = capacity;
    if(!isCapacityFull())
    {
        invalidateSnapshot = false;
        if(timesSinceSnapshot > 100 && (isSimulating || !isTimelapseOn))
        {
            isTakingSnapshot = true;
            valueBefore = getValueOfMineralsExcludingHe3();
        }
        else
        {
            timesSinceSnapshot++;
        }
        for(x = 0; x <= depth; x++)
        {
            var workerLevelForDepth = workersLevelAtDepth(x);
            if(((workersHiredAtDepth(x) * 2) + (workerLevelForDepth * 3)) > rand(0, 39))
            {
                for(y = 0; y < levels[x].length; y++)
                {
                    var mineralIndex = levels[x][y][0];
                    var mineralRarity = levels[x][y][1];
                    var findMultiplier = 1;
                    var superMinerAdditiveMiningMultiplier = superMinerManager.buffsForDepth(x);
                    var percentAttributedToSuperMiner = 0;

                    if(worldResources[mineralIndex].isIsotope)
                    {
                        findMultiplier = STAT.isotopeFindChanceMultiplier();
                        findMultiplier += superMinerAdditiveMiningMultiplier.isotopes;
                        percentAttributedToSuperMiner = superMinerAdditiveMiningMultiplier.isotopes / findMultiplier;
                    }
                    else
                    {
                        findMultiplier *= STAT.minerSpeedMultiplier(); //(speed up mining by 5%)
                        findMultiplier += superMinerAdditiveMiningMultiplier.minerals;
                        percentAttributedToSuperMiner = superMinerAdditiveMiningMultiplier.minerals / findMultiplier;
                    }

                    if(workerLevelForDepth > 7)
                    {
                        findMultiplier *= 1 + ((workerLevelForDepth - 7) * .05);
                    }

                    var threshold = randRoundToInteger(mineralRarity * findMultiplier);

                    if(rand(0, 999) < threshold)
                    {
                        worldResources[mineralIndex].numOwned++;
                        totalMineralsMined++;
                        mineralsMinedValue += worldResources[mineralIndex].sellValue;
                        capacity++;

                        if(managerStructure.level >= 2 && worldResources[mineralIndex].numOwned > lockedMineralAmtsToSave[mineralIndex])
                        {
                            //need to fix sell function to take the actual mineral id and not rely on window state and then have sell buttons go through
                            //a diff function when deciding which value to pass to the sell function
                            //sellMineral(mineralType)
                        }

                        //popup minerals
                        if(getArraySum(windowState) < 2 && quality == 1)
                        {
                            var numberOfDepthsVisible = 5;
                            if(typeof (worldConfig) != "undefined")
                            {
                                numberOfDepthsVisible = worldConfig.numberOfDepthsVisible;
                            }
                            if(x <= currentlyViewedDepth && x > currentlyViewedDepth - numberOfDepthsVisible)
                            {
                                if(Math.random() >= percentAttributedToSuperMiner)
                                {
                                    if(!isMobile())
                                    {
                                        var relativeDepth = currentlyViewedDepth - x;
                                        var putw = rand(0, workersHiredAtDepth(x) - 1);
                                        found[relativeDepth][0][putw] = mineralIndex - 1; //mineral
                                        found[relativeDepth][1][putw] = 12; //frames to animate
                                    }
                                    else
                                    {
                                        var relativeDepth = currentlyViewedDepth - x;
                                        var putw = rand(0, workersHiredAtDepth(x) - 1);
                                        found[relativeDepth][0][putw] = mineralIndex - 1; //mineral
                                        found[relativeDepth][1][putw] = numFramesRendered; //frames to animate
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if((isSimulating || !isTimelapseOn) && !invalidateSnapshot)
        {
            mineralsMined.shift();
            mineralsMined.push(capacity - mineralsBeforeMine);
        }
        if((isSimulating || !isTimelapseOn) && isTakingSnapshot && !invalidateSnapshot)
        {
            singleMiningLoopValueSnapshot.push(getValueOfMineralsExcludingHe3() - valueBefore);
            if(singleMiningLoopValueSnapshot.length > 10)
            {
                singleMiningLoopValueSnapshot.splice(0, 1);
            }
            timesSinceSnapshot = 0;
            valueBefore = 0n;
            isTakingSnapshot = false;
        }

        //Currently this logic is in the header render code for PC, it should be moved to here for all platforms and removed from header
        if(isMobile())
        {
            var numOresDiscovered = 0;
            for(var i = highestOreUnlocked; i < worldResources.length; i++)
            {
                if(!worldResources[i].isIsotope && worldResources[i].isOnHeader && worldResources[i].numOwned > 0 && highestOreUnlocked < i)
                {
                    highestOreUnlocked = i;
                    numOresDiscovered++;
                }
            }
            if(numOresDiscovered == 1)
            {
                newNews(_("Discovered") + " " + worldResources[highestOreUnlocked].name, _("Discovered") + " " + worldResources[highestOreUnlocked].name, highestOreUnlocked);
            }

            var numIsotopesDiscovered = 0;
            for(var i = highestIsotopeUnlocked; i < worldResources.length; i++)
            {
                if(worldResources[i].isIsotope && worldResources[i].isOnHeader && worldResources[i].numOwned > 0 && highestIsotopeUnlocked < i)
                {
                    if(worldResources[i].isotopeIndex == 0)
                    {
                        highestIsotopeUnlocked = i;
                        numIsotopesDiscovered++;
                    }
                }
            }
            if(numIsotopesDiscovered == 1)
            {
                newNews(_("Discovered") + " " + worldResources[highestIsotopeUnlocked].name, _("Discovered") + " " + worldResources[highestIsotopeUnlocked].name, highestIsotopeUnlocked);
            }
        }
    }
}

var cachedMineralsPerSecondDepth = -1;
var mineralsPerSecond = [];
function runOptimizedMiningForOneMinute()
{
    if(!isCapacityFull())
    {
        if(depth > cachedMineralsPerSecondDepth)
        {
            cachedMineralsPerSecondDepth = depth;
            mineralsPerSecond = estimateTotalMineralsMinedPerSecond();
        }

        for(var i = 0; i < mineralsPerSecond.length; i++)
        {
            if(worldResources[i] && !isNaN(mineralsPerSecond[i]))
            {
                var rewardAmount = randRoundToInteger(mineralsPerSecond[i] * 60);
                totalMineralsMined += rewardAmount;
                worldResources[i].numOwned += rewardAmount;
                capacity += rewardAmount;
            }
        }
    }
}

function estimatedMineralsPerMinuteAtLevel(depthToEstimate, useSuperMinerMultiplier = true)
{
    var workerLevelAtDepth = workersLevelAtDepth(depthToEstimate);
    var chanceOfMiningLevel = Math.min(1, ((workersHiredAtDepth(depthToEstimate) * 2) + (workerLevelAtDepth * 3)) / 40);
    var superMinerBuffs;
    if(useSuperMinerMultiplier)
    {
        superMinerBuffs = superMinerManager.buffsForDepth(depthToEstimate);
    }
    else
    {
        superMinerBuffs = {"isotopes": 0, "minerals": 0};
    }

    var results = [];
    for(var mineralAtDepth = 0; mineralAtDepth < levels[depthToEstimate].length; mineralAtDepth++)
    {
        var findMultiplier = 1;
        var mineralIndex = levels[depthToEstimate][mineralAtDepth][0];
        if(worldResources[mineralIndex].isIsotope)
        {
            findMultiplier *= (STAT.isotopeFindChanceMultiplier() + superMinerBuffs.isotopes);
        }
        if(workerLevelAtDepth > 7)
        {
            findMultiplier *= 1 + ((workerLevelAtDepth - 7) * .05);
        }

        findMultiplier *= (STAT.minerSpeedMultiplier() + superMinerBuffs.minerals); //(speed up mining by 5%)
        var threshold = levels[depthToEstimate][mineralAtDepth][1] * findMultiplier;
        var averageResources = threshold / 1000;
        results[levels[depthToEstimate][mineralAtDepth][0]] = (averageResources * chanceOfMiningLevel * 600);
    }
    return results;
}


var cachedEstimateTotalMineralsMinedPerSecond = [];
var cachedMinerSpeed = -1;
var cachedIsotopeSpeed = -1;
var cachedDepth = -1;
var cachedMinerLevels = [];
var cachedHiredMiners = [];
var cargoFullWhenCached = true;

function estimateTotalMineralsRequiresCacheUpdate()
{
    if(!isSimulating || cargoFullWhenCached) return true;

    worlds.forEach(world =>
    {
        if(world.workerLevel != cachedMinerLevels[world.index] || world.workersHired != cachedHiredMiners[world.index])
        {
            return true;
        }
    })

    return depth != cachedDepth || cachedMinerSpeed != STAT.minerSpeedMultiplier() || cachedIsotopeSpeed != STAT.isotopeFindChanceMultiplier();
}

//Copy pasta due to optimization requirements
function estimateTotalMineralsMinedPerSecond(useSuperMinerMultiplier = true)
{
    if(estimateTotalMineralsRequiresCacheUpdate())
    {
        cachedMinerSpeed = STAT.minerSpeedMultiplier();
        cachedIsotopeSpeed = STAT.isotopeFindChanceMultiplier();
        cachedDepth = depth;

        worlds.forEach(world =>
        {
            cachedHiredMiners[world.index] = world.workersHired;
            cachedMinerLevels[world.index] = world.workerLevel;
        })

        var results = [];
        var findMultiplier = 1;
        for(var depthIndex = 0; depthIndex <= depth; ++depthIndex)
        {
            var workerLevelAtDepth = workersLevelAtDepth(depthIndex);
            var chanceOfMiningLevel = Math.min(1, ((workersHiredAtDepth(depthIndex) * 2) + (workerLevelAtDepth * 3)) / 40);
            var superMinerBuffs = useSuperMinerMultiplier ? superMinerManager.buffsForDepth(depthIndex) : superMinerManager.buffsForDepth(-1);

            for(var mineralAtDepth = 0; mineralAtDepth < levels[depthIndex].length; ++mineralAtDepth)
            {
                findMultiplier = 1;
                var mineralIndex = levels[depthIndex][mineralAtDepth][0];
                if(worldResources[mineralIndex].isIsotope)
                {
                    findMultiplier *= (cachedIsotopeSpeed + superMinerBuffs.isotopes);
                }
                if(workerLevelAtDepth > 7)
                {
                    findMultiplier *= 1 + ((workerLevelAtDepth - 7) * .05);
                }
                findMultiplier *= (cachedMinerSpeed + superMinerBuffs.minerals);
                var threshold = levels[depthIndex][mineralAtDepth][1] * findMultiplier;
                var averageResources = threshold / 1000;

                if(!results[mineralIndex])
                {
                    results[mineralIndex] = 0;
                }
                results[mineralIndex] += (averageResources * chanceOfMiningLevel * 10);
            }
        }
        cargoFullWhenCached = isCapacityFull();
        cachedEstimateTotalMineralsMinedPerSecond = results;
    }

    return cachedEstimateTotalMineralsMinedPerSecond;
}

function timeUntilCapacityIsFullSeconds()
{
    if(isCapacityFull()) return 0;

    var numMineralsMinedPerSecond = totalNumMineralsMinedPerSecond();
    var remainingCapacity = maxHoldingCapacity() - capacity;
    return Math.ceil(remainingCapacity / numMineralsMinedPerSecond);
}

function totalNumMineralsMinedPerSecond()
{
    return getArraySum(estimateTotalMineralsMinedPerSecond());
}


//sim optimzations
var cachedMineralsPerSecond = -1;

function valueOfMineralsPerSecond(useSuperMinerMultiplier = true)
{
    if(!estimateTotalMineralsRequiresCacheUpdate() && cachedMineralsPerSecond > -1)
    {
        return cachedMineralsPerSecond;
    }

    var mineralsMined = estimateTotalMineralsMinedPerSecond();
    var mineralValue = 0n;

    for(var key in mineralsMined)
    {
        mineralValue += doBigIntDecimalMultiplication(worldResources[key].sellValue, mineralsMined[key]);
    }

    cachedMineralsPerSecond = mineralValue;
    return mineralValue;
}

function sellMineralAmount(x, amount)
{
    let lockedAmount = lockedMineralAmtsToSave[x] ? lockedMineralAmtsToSave[x] : 0;
    amount = Math.min(worldResources[x].numOwned - lockedAmount, amount); //dont sell more than the locked amount
    amount = worldResources[x].numOwned - amount > 0 ? amount : worldResources[x].numOwned; //dont sell more than you own

    if(amount > 0)
    {
        let sellPriceMultiplier = STAT.sellPriceMultiplier();
        let profit = doBigIntDecimalMultiplication(worldResources[x].sellValue * BigInt(amount), sellPriceMultiplier);

        if(relicFunctionalityRoller.rand(0, 100) < STAT.percentChanceOfSellingFor2x())
        {
            profit *= 2n;
        }

        addMoney(profit);
        capacity -= amount;
        worldResources[x].numOwned -= amount;
    }
}

function sellMineral(x)
{
    let sale = getMineralSaleStats(x);

    if(sale.amountToSell > 0)
    {
        if(relicFunctionalityRoller.rand(0, 100) < STAT.percentChanceOfSellingFor2x())
        {
            sale.profit *= 2n;
            newNews(_("{0} caused you to sell your {1} for 2x price", _("Midas Touch"), worldResources[x].name), true);
        }

        trackEvent_GainedMoney(sale.profit, 6);
        addMoney(sale.profit);
        mineralsSoldValue += sale.profit;
        capacity -= sale.amountToSell;
        worldResources[x].numOwned = sale.newTotal;
    }
}

function getMineralSaleStats(x)
{
    let sellPriceMultiplier = STAT.sellPriceMultiplier();
    let lockedAmount = lockedMineralAmtsToSave[x] ? lockedMineralAmtsToSave[x] : 0;
    let amountToSell = Math.max(0, worldResources[x].numOwned - lockedAmount);
    let saleProfit = doBigIntDecimalMultiplication(worldResources[x].sellValue * BigInt(amountToSell), sellPriceMultiplier);

    return {
        newTotal: lockedAmount,
        amountToSell: amountToSell,
        profit: saleProfit
    };
}

function sellAllMinerals(tab)
{
    //need to set up for isotopes?
    var moneyPriorToSale = money;

    if(tab == 0)
    {
        for(var i = 1; i < 13; i++)
        {
            sellMineral(i);
        }
    }
    else if(tab == 1)
    {
        for(var i = 18; i < 27; i++)
        {
            sellMineral(i);
        }
    }

    var totalSaleProceeds = money - moneyPriorToSale;
    if(totalSaleProceeds > 100000000000000000n)
    {
        questManager.getQuest(55).markComplete();
    }
}

function getSingleRandomMineralTypeAtDepthByWeight(depth)
{
    var mineralsAtDepth = estimatedMineralsPerMinuteAtLevel(depth, true);
    var totalMineralsAtDepth = mineralsAtDepth.reduce((a, b) => a + b, 0);
    var randomValue = rand(0, Math.floor(totalMineralsAtDepth));
    var cumulativeSum = 0;
    for(var i = 0; i < mineralsAtDepth.length; i++)
    {
        if(mineralsAtDepth[i])
        {
            cumulativeSum += mineralsAtDepth[i];
            if(randomValue <= cumulativeSum)
            {
                return i;
            }
        }
    }
    return null;
}

function addSuperMinerSouls(amount)
{
    worldResources[SUPER_MINER_SOULS_INDEX].numOwned += amount;
}

//############################################################
//######################### CAPACITY #########################
//############################################################

function maxHoldingCapacity()
{
    return drillState.cargo().capacity * STAT.cargoCapacityMultiplier();
}

function isCapacityFull()
{
    return capacity >= maxHoldingCapacity();
}

function getUsedMineralCapacity()
{
    capacity = cachedCountsTowardsCapacityAndValue.reduce((sum, resource) => sum + resource.numOwned, 0)

    if(!isSimulating)
    {
        if(mutecapacity == 0 && isCapacityFull())
        {
            capacityFullAudio.play();
        }
    }
}

function getDepthMineralIsFoundAt(mineralIndex)
{
    for(var i = 0; i < levels.length; i++)
    {
        for(var j = 0; j < levels[i].length; j++)
        {
            if(levels[i][j][0] == mineralIndex)
            {
                return i;
            }
        }
    }
    return 99999;
}


//#######################################################################
//############################# HELPERS #################################
//#######################################################################

function getValueOfMinerals()
{
    var sellPriceMultiplier = STAT.sellPriceMultiplier();
    var totalValue = 0n;

    for(var i = 1; i < worldResources.length; i++)
    {
        totalValue += worldResources[i].totalValue();
    }

    return doBigIntDecimalMultiplication(totalValue, sellPriceMultiplier);
}

function getValueOfMineralsExcludingHe3()
{
    var sellPriceMultiplier = STAT.sellPriceMultiplier();
    var totalValue = 0n;

    for(var i = 1; i < worldResources.length; i++)
    {
        if(i != HELIUM3_INDEX)
        {
            totalValue += worldResources[i].totalValue();
        }
    }

    return doBigIntDecimalMultiplication(totalValue, sellPriceMultiplier);
}

function getLockIconForMineralNumber(mineralNumber)
{
    if(managerStructure.level < 1)
    {
        return lockGray;
    }
    if(lockedMineralAmtsToSave[mineralNumber] == 0)
    {
        return unlock;
    }
    else
    {
        return lock;
    }
}

function getLockedMineralName(mineralId)
{
    if(worldResources[mineralId].isIsotope)
    {
        if(mineralId > highestIsotopeUnlocked)
        {
            return _("???");
        }
        else
        {
            return _(worldResources[mineralId].name);
        }
    }
    else if(worldResources[mineralId].isOnHeader)
    {
        if(mineralId > highestOreUnlocked)
        {
            return _("???");
        }
        else
        {
            return _(worldResources[mineralId].name);
        }
    }
    else
    {
        return _(worldResources[mineralId].name);
    }
}

function getMineralsForWorld(worldIndex)
{
    var results = [];
    for(var key in worldResources)
    {
        if(worldResources[key].indexOfWorldEncountered == worldIndex)
        {
            results.push(worldResources[key]);
        }
    }
    return results;
}

function numCoalOwned()
{
    return worldResources[COAL_INDEX].numOwned;
}

function numCopperOwned()
{
    return worldResources[COPPER_INDEX].numOwned;
}

function numSilverOwned()
{
    return worldResources[SILVER_INDEX].numOwned;
}

function numGoldOwned()
{
    return worldResources[GOLD_INDEX].numOwned;
}

function numPlatinumOwned()
{
    return worldResources[PLATINUM_INDEX].numOwned;
}

function numDiamondOwned()
{
    return worldResources[DIAMOND_INDEX].numOwned;
}

function numColtanOwned()
{
    return worldResources[COLTAN_INDEX].numOwned;
}

function numPainiteOwned()
{
    return worldResources[PAINITE_INDEX].numOwned;
}

function numBlackOpalOwned()
{
    return worldResources[BLACK_OPAL_INDEX].numOwned;
}

function numRedDiamondOwned()
{
    return worldResources[RED_DIAMOND_INDEX].numOwned;
}

function numBlueObsidianOwned()
{
    return worldResources[BLUE_OBSIDIAN_INDEX].numOwned;
}

function numCaliforniumOwned()
{
    return worldResources[CALIFORNIUM_INDEX].numOwned;
}

function numOilOwned()
{
    return worldResources[OIL_INDEX].numOwned;
}

function numRedForgedGemsOwned()
{
    return worldResources[RED_FORGED_GEM_INDEX].numOwned;
}

function numBlueForgedGemsOwned()
{
    return worldResources[BLUE_FORGED_GEM_INDEX].numOwned;
}

function numGreenForgedGemsOwned()
{
    return worldResources[GREEN_FORGED_GEM_INDEX].numOwned;
}

function numPurpleForgedGemsOwned()
{
    return worldResources[PURPLE_FORGED_GEM_INDEX].numOwned;
}

function numYellowForgedGemsOwned()
{
    return worldResources[YELLOW_FORGED_GEM_INDEX].numOwned;
}

function numforgeCatalystsOwned()
{
    return worldResources[FORGE_CATALYST_INDEX].numOwned;
}

function numStoredNuclearEnergyOwned()
{
    return worldResources[NUCLEAR_ENERGY_INDEX].numOwned;
}

function numBuildingMaterialsOwned()
{
    return worldResources[BUILDING_MATERIALS_INDEX].numOwned;
}