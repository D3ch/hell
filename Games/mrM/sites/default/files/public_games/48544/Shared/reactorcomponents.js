//######################### CONSTANTS #########################

const FAN_TYPE = 1;
const FUEL_ROD_TYPE_1 = 2;
const FUEL_ROD_TYPE_2 = 3;
const FUEL_ROD_TYPE_3 = 4;
const FUEL_ROD_TYPE_4 = 5;
const FUEL_ROD_TYPE_5 = 6;
const FUEL_ROD_TYPE_6 = 7;
const FUEL_ROD_TYPE_7 = 8;
const FUEL_ROD_TYPE_8 = 9;
const FUEL_ROD_TYPE_9 = 10;
const BATTERY_TYPE_1 = 11;
const BATTERY_TYPE_2 = 12;
const BATTERY_TYPE_3 = 13;
const DUCT_TYPE = 14;
const BUFF_TYPE_1 = 15;
const BUFF_TYPE_2 = 16;
const BUFF_TYPE_3 = 17;
const BUFF_TYPE_4 = 18;
const FUEL_ROD_TYPE_10 = 19;
const FUEL_ROD_TYPE_11 = 20;
const FUEL_ROD_TYPE_12 = 21;
const FUEL_ROD_TYPE_13 = 22;
const FUEL_ROD_TYPE_14 = 23;
const FUEL_ROD_TYPE_15 = 24;
const FUEL_ROD_TYPE_16 = 25;
const FUEL_ROD_TYPE_17 = 26;
const FUEL_ROD_TYPE_18 = 27;
const FUEL_ROD_TYPE_19 = 28;

var BATTERY_TYPES = [
    BATTERY_TYPE_1,
    BATTERY_TYPE_2,
    BATTERY_TYPE_3
];

var FUEL_ROD_TYPES = [
    FUEL_ROD_TYPE_1,
    FUEL_ROD_TYPE_2,
    FUEL_ROD_TYPE_3,
    FUEL_ROD_TYPE_4,
    FUEL_ROD_TYPE_5,
    FUEL_ROD_TYPE_6,
    FUEL_ROD_TYPE_7,
    FUEL_ROD_TYPE_8,
    FUEL_ROD_TYPE_9,
    FUEL_ROD_TYPE_10,
    FUEL_ROD_TYPE_11,
    FUEL_ROD_TYPE_12,
    FUEL_ROD_TYPE_13,
    FUEL_ROD_TYPE_14,
    FUEL_ROD_TYPE_15,
    FUEL_ROD_TYPE_16,
    FUEL_ROD_TYPE_17,
    FUEL_ROD_TYPE_18,
    FUEL_ROD_TYPE_19
];

var BUFF_TYPES = [
    BUFF_TYPE_1,
    BUFF_TYPE_2,
    BUFF_TYPE_3,
    BUFF_TYPE_4
];

var CONNECTING_TYPES = [
    DUCT_TYPE,
    FUEL_ROD_TYPE_1,
    FUEL_ROD_TYPE_2,
    FUEL_ROD_TYPE_3,
    FUEL_ROD_TYPE_4,
    FUEL_ROD_TYPE_5,
    FUEL_ROD_TYPE_6,
    FUEL_ROD_TYPE_7,
    FUEL_ROD_TYPE_8,
    FUEL_ROD_TYPE_9,
    FUEL_ROD_TYPE_10,
    FUEL_ROD_TYPE_11,
    FUEL_ROD_TYPE_12,
    FUEL_ROD_TYPE_13,
    FUEL_ROD_TYPE_14,
    FUEL_ROD_TYPE_15,
    FUEL_ROD_TYPE_16,
    FUEL_ROD_TYPE_17,
    FUEL_ROD_TYPE_18,
    FUEL_ROD_TYPE_19
];

function getBombardmentForIsotope(isotope)
{
    var bombardment;
    FUEL_ROD_TYPES.forEach((fuelRod) =>
    {
        if(reactorComponents[fuelRod].totalEnergyOutput < 0)
        {
            reactorComponents[fuelRod].rewardOutput.forEach((reward) =>
            {
                if(reward.item.id == isotope)
                {
                    bombardment = reactorComponents[fuelRod];
                }
            })
        }
    })
    return bombardment;
}

//########################################################

var reactorComponents = [];

class ReactorComponent 
{
    //Static
    index;
    name;
    heat;
    energyStorage;
    energyProductionPerSecond;
    buffDirections;
    buffAmountMultiplierPerDirection;
    totalEnergyOutput;
    ingredients;
    rewardOutput;
    craftDescription;

    //Dynamic
    numOwned = 0;

    showTooltip; //override
    render; //override
}

class FuelRodComponent extends ReactorComponent
{
    showTooltip = function (reactorComponentUI)
    {
        var description = this.craftDescription;

        if(reactorComponentUI.isOnGrid)
        {
            var remainingEnergy = reactor.grid.getFuelCellRemainingEnergy(reactorComponentUI.gridSlotX, reactorComponentUI.gridSlotY);
            description += "<br><br>" + _("Time Remaining: {0}", formattedCountDown(remainingEnergy / this.energyProductionPerSecond));
            description += "<br>" + _("Energy Remaining: {0}", beautifynum(remainingEnergy));
            var heatInSystem = reactor.grid.getSystemHeatForFuelCell(reactorComponentUI.gridSlotX, reactorComponentUI.gridSlotY);
            if(heatInSystem > 0)
            {
                description += "<br><font color='red'>" + _("System Heat: <b>{0}</b>", heatInSystem) + "</font>";
                description += "<br><i>" + _("This system is not sufficently cooled.") + "</i>";
            }
            else
            {
                description += "<br>" + _("System Heat: {0}", heatInSystem);
            }
        }
        else
        {
            description += "<br>" + _("Total Burn Duration: {0}", formattedCountDown(this.totalEnergyOutput / this.energyProductionPerSecond));
        }
        description += "<br><br><b>" + _("Decay Rewards:") + "</b><br>";
        description += generateHtmlForIngredients(this.rewardOutput, false);
        showTooltip(
            _(reactorComponents[this.index].name),
            description,
            mouseX,
            mouseY,
            240
        );
    }

    render = function (componentReference, canvas, x, y, width, height)
    {
        canvas.drawImage(this.craftIcon, x, y, width, height);

        if(componentReference.isOnGrid)
        {
            var percentFuelRemaining = reactor.grid.getFuelCellRemainingEnergy(componentReference.gridSlotX, componentReference.gridSlotY) / this.totalEnergyOutput;
            drawTinyProgressBar(canvas, x + 3, y + height - 8, width - 6, 4, 2, "#CC3333", "#000000", "#222222", percentFuelRemaining);
        }
    }
}

class BatteryComponent extends ReactorComponent
{
    showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }

    render = function (componentReference, canvas, x, y, width, height)
    {
        if(componentReference.isOnGrid)
        {
            drawTinyProgressBar(canvas, x + 3, y + height - 8, width - 6, 4, 2, "#33CC33", "#000000", "#222222", Math.min(1, reactor.currentBatteryCharge() / reactor.grid.maxBatteryCapacity()));
        }
        return canvas.drawImage(this.craftIcon, x, y, width, height);
    }
}


//##################################################################
//##################### COMPONENT DEFINITIONS ######################

//############################## FANS ##############################

function generateReactorComponents()
{
    var newComponent = new ReactorComponent();
    newComponent.index = FAN_TYPE;
    newComponent.name = "Fan";
    newComponent.heat = -12;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 0;
    newComponent.craftIcon = getImageFromMergedImages(
        "fan",
        reactorFan,
        {"x": 0, "y": 0, "width": reactorFan.width, "height": reactorFan.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorFanBlades,
        {"x": 0, "y": 0, "width": reactorFanBlades.width, "height": reactorFanBlades.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        var rotation = 0;
        if(reactor.isRunning && componentReference.isOnGrid &&
            reactor.grid.getSystemCellsToHighlightForCell(componentReference.gridSlotX, componentReference.gridSlotY).length > 0
        )
        {
            rotation = framesRendered2 * 7 % 360;
        }
        drawImageRot(canvas, reactorFanBlades, 0, 0, reactorFanBlades.width, reactorFanBlades.height, x, y, width, height, rotation, 5 * height / 70);
        canvas.drawImage(reactorFan, 0, 0, reactorFan.width, reactorFan.height, x, y, width, height);
    }
    newComponent.craftDescription = _("Cools a fuel rod reducing its heat by 12");
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    newComponent.numOwned = 2;
    reactorComponents[FAN_TYPE] = newComponent;

    //############################## FUEL RODS ##############################


    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_1;
    newComponent.name = "Highly Enriched Uranium Fuel Rod";
    newComponent.heat = 24; //2.4x energy (2 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 10;
    newComponent.totalEnergyOutput = 36000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 4500}, //1.5x Uranium 2 input
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 750},  //1.5x Uranium 3 input
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 2500},
        {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 500}
    ];
    newComponent.craftIcon = getFuelRodIcon("single", "HEUFuelRod", "#CC3333");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    newComponent.numOwned = 1;
    reactorComponents[FUEL_ROD_TYPE_1] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_2;
    newComponent.name = "Dual Highly Enriched Uranium  Fuel Rod";
    newComponent.heat = 66; //2.2x energy (5.5 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 30; //3x previous 
    newComponent.totalEnergyOutput = 108000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 9300},    //1.55x Uranium 2 input
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 1550},    //1.55x Uranium 3 input
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 5050},  //2.02x previous
        {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 1010}
    ];
    newComponent.craftIcon = getFuelRodIcon("dual", "HEUFuelRod", "#CC3333");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_2] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_3;
    newComponent.name = "Quad Highly Enriched Uranium Fuel Rod";
    newComponent.heat = 180; //2x energy (15 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 90; //3x previous
    newComponent.totalEnergyOutput = 324000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 19200},   //1.6x Uranium 2 input
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 3200},    //1.6x Uranium 3 input
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 10200},
        {item: new MineralCraftingItem(PLUTONIUM2_INDEX), quantity: 2040}
    ];
    newComponent.craftIcon = getFuelRodIcon("quad", "HEUFuelRod", "#CC3333");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_3] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_4;
    newComponent.name = "Enriched Uranium Fuel Rod";
    newComponent.heat = 18; //1.8x energy (1.5 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 10;
    newComponent.totalEnergyOutput = 144000; //4 hours
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 23000},  // 2x Uranium 2
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 17250} // .75x Uranium 2 drops        Value of outputs = 63,250,000
    ];
    newComponent.craftIcon = getFuelRodIcon("single", "LEUFuelRod", "#33CC33");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_4] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_5;
    newComponent.name = "Dual Enriched Uranium Fuel Rod";
    newComponent.heat = 48; //1.6x (4 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 30;
    newComponent.totalEnergyOutput = 432000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 46500},  // 2.02x Uranium 2
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 34900} // .75x Uranium 2 drops        Value of outputs = 127,900,000
    ];
    newComponent.craftIcon = getFuelRodIcon("dual", "LEUFuelRod", "#33CC33");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_5] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_6;
    newComponent.name = "Quad Enriched Uranium Fuel Rod";
    newComponent.heat = 126; //1.4x (10.5 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 90;
    newComponent.totalEnergyOutput = 1296000; //4 hours
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM2_INDEX), quantity: 94000},  // 2.04x Uranium 2
        {item: new MineralCraftingItem(PLUTONIUM1_INDEX), quantity: 70500} // .75x Uranium 2 drops        Value of outputs = 258,500,000
    ];
    newComponent.craftIcon = getFuelRodIcon("quad", "LEUFuelRod", "#33CC33");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_6] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_7;
    newComponent.name = "Mixed Oxide Fuel Rod";
    newComponent.heat = 21;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 8;
    newComponent.totalEnergyOutput = 288000; //10 hours
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 2000},       // .55x u3 input
        {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 1500}      //                         Value of outputs = 850,000,000
    ];
    newComponent.craftIcon = getFuelRodIcon("single", "MOXFuelRod", "#3333CC");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_7] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_8;
    newComponent.name = "Dual Mixed Oxide Fuel Rod";
    newComponent.heat = 54;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 24;
    newComponent.totalEnergyOutput = 864000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 4040},       // .56x Uranium 3 input
        {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 3030}      //                         Value of outputs = 1,717,000,000
    ];
    newComponent.craftIcon = getFuelRodIcon("dual", "MOXFuelRod", "#3333CC");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_8] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_9;
    newComponent.name = "Quad Mixed Oxide Fuel Rod";
    newComponent.heat = 144;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 72;
    newComponent.totalEnergyOutput = 2592000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(URANIUM3_INDEX), quantity: 8210},       // .57x Uranium 3 input
        {item: new MineralCraftingItem(PLUTONIUM3_INDEX), quantity: 6160}      //                         Value of outputs = 3,490,500,000
    ];
    newComponent.craftIcon = getFuelRodIcon("quad", "MOXFuelRod", "#3333CC");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_9] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_10;
    newComponent.name = "Californium Bombardment 1";
    newComponent.heat = 24; //(2 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -10;
    newComponent.totalEnergyOutput = -288000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(EINSTEINIUM1_INDEX), quantity: 10}
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "CaliforniunBombardment1", "#e2eb34");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_10] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_11;
    newComponent.name = "Californium Bombardment 2";
    newComponent.heat = 72; //(6 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -30;
    newComponent.totalEnergyOutput = -864000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(EINSTEINIUM2_INDEX), quantity: 10},
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "CaliforniunBombardment2", "#e2eb34");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_11] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_12;
    newComponent.name = "Californium Bombardment 3";
    newComponent.heat = 216; //(18 fans)
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -90;
    newComponent.totalEnergyOutput = -2592000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(EINSTEINIUM3_INDEX), quantity: 10}
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "CaliforniunBombardment3", "#e2eb34");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_12] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_13;
    newComponent.name = "Pu/Po Fuel Rod";
    newComponent.heat = 36;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 16;
    newComponent.totalEnergyOutput = 921600;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 2000},
    ];
    newComponent.craftIcon = getFuelRodIcon("single", "PuPoFuelRod", "#8f7ea3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_13] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_14;
    newComponent.name = "Dual Pu/Po Fuel Rod";
    newComponent.heat = 96;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 48;
    newComponent.totalEnergyOutput = 2764800;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 4040},
    ];
    newComponent.craftIcon = getFuelRodIcon("dual", "PuPoFuelRod", "#8f7ea3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_14] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_15;
    newComponent.name = "Quad Pu/Po Fuel Rod";
    newComponent.heat = 264;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 144;
    newComponent.totalEnergyOutput = 8294400;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(POLONIUM3_INDEX), quantity: 8160},
    ];
    newComponent.craftIcon = getFuelRodIcon("quad", "PuPoFuelRod", "#8f7ea3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_15] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_16;
    newComponent.name = "Polonium RTG Fuel Rod";
    newComponent.heat = 15;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 6;
    newComponent.totalEnergyOutput = 1036800;
    newComponent.rewardOutput = [];
    newComponent.craftIcon = getFuelRodIcon("single", "PoRTGFuelRod", "#780637");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_16] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_17;
    newComponent.name = "Einsteinium Bombardment 1";
    newComponent.heat = 30;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -20;
    newComponent.totalEnergyOutput = -1152000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(FERMIUM1_INDEX), quantity: 1}
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "EinsteiniumBombardment1", "#2491b3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_17] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_18;
    newComponent.name = "Einsteinium Bombardment 2";
    newComponent.heat = 90;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -60;
    newComponent.totalEnergyOutput = -3456000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(FERMIUM2_INDEX), quantity: 1},
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "EinsteiniumBombardment2", "#2491b3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_18] = newComponent;

    var newComponent = new FuelRodComponent();
    newComponent.index = FUEL_ROD_TYPE_19;
    newComponent.name = "Einsteinium Bombardment 3";
    newComponent.heat = 270;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = -180;
    newComponent.totalEnergyOutput = -10368000;
    newComponent.rewardOutput = [
        {item: new MineralCraftingItem(FERMIUM3_INDEX), quantity: 1}
    ];
    newComponent.craftIcon = getFuelRodIcon("bombardment", "EinsteiniumBombardment3", "#2491b3");
    newComponent.craftDescription = getFuelRodDescription(newComponent);
    reactorComponents[FUEL_ROD_TYPE_19] = newComponent;

    //############################## BATTERIES ##############################


    var newComponent = new BatteryComponent();
    newComponent.index = BATTERY_TYPE_1;
    newComponent.name = "Small Battery";
    newComponent.heat = 0;
    newComponent.energyStorage = 5000;
    newComponent.energyProductionPerSecond = 0;
    newComponent.craftIcon = reactorSingleBattery;
    newComponent.craftDescription = _("Stores {0} energy", beautifynum(newComponent.energyStorage));
    newComponent.numOwned = 1;
    reactorComponents[BATTERY_TYPE_1] = newComponent;

    var newComponent = new BatteryComponent();
    newComponent.index = BATTERY_TYPE_2;
    newComponent.name = "Large Battery";
    newComponent.heat = 0;
    newComponent.energyStorage = 50000;
    newComponent.energyProductionPerSecond = 0;
    newComponent.craftIcon = reactorDualBattery;
    newComponent.craftDescription = _("Stores {0} energy", beautifynum(newComponent.energyStorage));
    reactorComponents[BATTERY_TYPE_2] = newComponent;

    var newComponent = new BatteryComponent();
    newComponent.index = BATTERY_TYPE_3;
    newComponent.name = "Extra Large Battery";
    newComponent.heat = 0;
    newComponent.energyStorage = 250000;
    newComponent.energyProductionPerSecond = 0;
    newComponent.craftIcon = reactorQuadBattery;
    newComponent.craftDescription = _("Stores {0} energy", beautifynum(newComponent.energyStorage));
    reactorComponents[BATTERY_TYPE_3] = newComponent;

    //############################## DUCT ##############################

    var newComponent = new ReactorComponent();
    newComponent.index = DUCT_TYPE;
    newComponent.name = "Heat Duct";
    newComponent.heat = 0;
    newComponent.energyStorage = 0;
    newComponent.energyProductionPerSecond = 0;
    newComponent.craftIcon = getImageFromMergedImages(
        "Duct",
        reactorDuctCenter,
        {"x": 0, "y": 0, "width": reactorDuctCenter.width, "height": reactorDuctCenter.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorDuctLeftCapped,
        {"x": 0, "y": 0, "width": reactorDuctLeftCapped.width, "height": reactorDuctLeftCapped.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorDuctBottomCapped,
        {"x": 0, "y": 0, "width": reactorDuctBottomCapped.width, "height": reactorDuctBottomCapped.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorDuctTopCapped,
        {"x": 0, "y": 0, "width": reactorDuctTopCapped.width, "height": reactorDuctTopCapped.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorDuctRightCapped,
        {"x": 0, "y": 0, "width": reactorDuctRightCapped.width, "height": reactorDuctRightCapped.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        var sides = ["Top", "Bottom", "Right", "Left"];
        var sideCheckFunctions = [componentReference.cellTypeTop(), componentReference.cellTypeBottom(), componentReference.cellTypeRight(), componentReference.cellTypeLeft()];
        for(var i = 0; i < sides.length; i++)
        {
            var side = sides[i];
            var sideImage = window["reactorDuct" + side + "Capped"];
            var sideHasConnection = (sideCheckFunctions[i] == DUCT_TYPE || sideCheckFunctions[i] == FAN_TYPE || FUEL_ROD_TYPES.includes(sideCheckFunctions[i]));
            if(sideHasConnection) sideImage = (reactor.isRunning) ? window["reactorDuct" + side + "On"] : window["reactorDuct" + side + "Off"];
            canvas.drawImage(sideImage, 0, 0, sideImage.width, sideImage.height, x, y, width, height);
        }
        canvas.drawImage(reactorDuctCenter, 0, 0, reactorDuctCenter.width, reactorDuctCenter.height, x, y, width, height);
    }
    newComponent.craftDescription = _("Connects Ducts, Fans, and Fuel Rods together");
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    reactorComponents[DUCT_TYPE] = newComponent;

    //############################## BUFFS ##############################


    var newComponent = new ReactorComponent();
    newComponent.index = BUFF_TYPE_1;
    newComponent.name = "Copper Buff";
    newComponent.heat = 0;
    newComponent.energyStorage = 0;
    newComponent.buffDirections = [{"x": 0, "y": -1}, {"x": 0, "y": 1}];
    newComponent.buffAmountMultiplierPerDirection = .55;
    newComponent.craftIcon = getImageFromMergedImages(
        "Buff1",
        reactorCopperModifier,
        {"x": 0, "y": 0, "width": reactorCopperModifier.width, "height": reactorCopperModifier.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorArrowsUpDown,
        {"x": 0, "y": 0, "width": reactorArrowsUpDown.width, "height": reactorArrowsFourCorners.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        return canvas.drawImage(this.craftIcon, x, y, width, height);
    }
    newComponent.craftDescription = _("Boosts component above and below it by {0}%", Math.floor(newComponent.buffAmountMultiplierPerDirection * 100));
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    reactorComponents[BUFF_TYPE_1] = newComponent;

    var newComponent = new ReactorComponent();
    newComponent.index = BUFF_TYPE_2;
    newComponent.name = "Platinum Buff";
    newComponent.heat = 0;
    newComponent.energyStorage = 0;
    newComponent.buffDirections = [{"x": 0, "y": 1}, {"x": -1, "y": 0}];
    newComponent.buffAmountMultiplierPerDirection = .55;
    newComponent.craftIcon = getImageFromMergedImages(
        "Buff2",
        reactorPlatinumModifier,
        {"x": 0, "y": 0, "width": reactorPlatinumModifier.width, "height": reactorSilverModifier.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorArrowsLeftDown,
        {"x": 0, "y": 0, "width": reactorArrowsLeftDown.width, "height": reactorArrowsLeftDown.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        return canvas.drawImage(this.craftIcon, x, y, width, height);
    }
    newComponent.craftDescription = _("Boosts components to the left and below by {0}%", Math.floor(newComponent.buffAmountMultiplierPerDirection * 100));
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    reactorComponents[BUFF_TYPE_2] = newComponent;

    var newComponent = new ReactorComponent();
    newComponent.index = BUFF_TYPE_3;
    newComponent.name = "Silver Buff";
    newComponent.heat = 0;
    newComponent.energyStorage = 0;
    newComponent.buffDirections = [{"x": 0, "y": -1}, {"x": 1, "y": 0}];
    newComponent.buffAmountMultiplierPerDirection = .55;
    newComponent.craftIcon = getImageFromMergedImages(
        "Buff3",
        reactorSilverModifier,
        {"x": 0, "y": 0, "width": reactorSilverModifier.width, "height": reactorSilverModifier.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorArrowsUpRight,
        {"x": 0, "y": 0, "width": reactorArrowsUpRight.width, "height": reactorArrowsUpRight.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        return canvas.drawImage(this.craftIcon, x, y, width, height);
    }
    newComponent.craftDescription = _("Boosts components to the right and above by {0}%", Math.floor(newComponent.buffAmountMultiplierPerDirection * 100));
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    reactorComponents[BUFF_TYPE_3] = newComponent;

    var newComponent = new ReactorComponent();
    newComponent.index = BUFF_TYPE_4;
    newComponent.name = "Gold Buff";
    newComponent.heat = 0;
    newComponent.energyStorage = 0;
    newComponent.buffDirections = [{"x": -1, "y": -1}, {"x": 1, "y": 1}, {"x": 1, "y": -1}, {"x": -1, "y": 1}];
    newComponent.buffAmountMultiplierPerDirection = .3;
    newComponent.craftIcon = getImageFromMergedImages(
        "Buff4",
        reactorGoldModifier,
        {"x": 0, "y": 0, "width": reactorGoldModifier.width, "height": reactorGoldModifier.height},
        {"x": 0, "y": 0, "width": 50, "height": 50},
        reactorArrowsFourCorners,
        {"x": 0, "y": 0, "width": reactorArrowsFourCorners.width, "height": reactorArrowsFourCorners.height},
        {"x": 0, "y": 0, "width": 50, "height": 50}
    );
    newComponent.render = function (componentReference, canvas, x, y, width, height)
    {
        return canvas.drawImage(this.craftIcon, x, y, width, height);
    }
    newComponent.craftDescription = _("Boosts diagonal components by {0}%", Math.floor(newComponent.buffAmountMultiplierPerDirection * 100));
    newComponent.showTooltip = function (reactorComponentUI)
    {
        showTooltip(
            _(reactorComponents[this.index].name),
            this.craftDescription
        );
    }
    reactorComponents[BUFF_TYPE_4] = newComponent;


    //############################## HELPERS ##############################

    function getFuelRodDescription(reactorComponent)
    {
        return _("<b>Produces:</b> <br> Energy: {0}/sec ({1} energy/heat) <br> ", reactorComponent.energyProductionPerSecond, parseFloat((reactorComponent.energyProductionPerSecond / reactorComponent.heat).toFixed(2))) +
            _("Heat: {0}/sec ({1} fans) <br> ", reactorComponent.heat, parseFloat((reactorComponent.heat / 12).toFixed(2))) +
            _("Total Energy Production: {0} <br> ", beautifynum(reactorComponent.totalEnergyOutput)) +
            _("Total Duration: {0}", shortenedFormattedTime(reactorComponent.totalEnergyOutput / reactorComponent.energyProductionPerSecond));
    }

    function getFuelRodIcon(type, name, color)
    {
        if(type == "single")
        {
            return getImageFromMergedImages(
                name,
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 16, "y": 3, "width": 18, "height": 41},
                reactorFuelRodSingle,
                {"x": 0, "y": 0, "width": reactorFuelRodSingle.width, "height": reactorFuelRodSingle.height},
                {"x": 0, "y": 0, "width": 50, "height": 50}
            );
        }
        else if(type == "dual")
        {
            return getImageFromMergedImages(
                "Dual" + name,
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 6, "y": 6, "width": 13, "height": 34},
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 29, "y": 6, "width": 13, "height": 34},
                reactorFuelRodDual,
                {"x": 0, "y": 0, "width": reactorFuelRodSingle.width, "height": reactorFuelRodSingle.height},
                {"x": 0, "y": 0, "width": 50, "height": 50}
            );
        }
        else if(type == "quad")
        {
            return getImageFromMergedImages(
                "Quad" + name,
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 6, "y": 6, "width": 14, "height": 16},
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 29, "y": 6, "width": 14, "height": 16},
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 6, "y": 26, "width": 14, "height": 16},
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 29, "y": 26, "width": 14, "height": 16},
                reactorFuelRodQuad,
                {"x": 0, "y": 0, "width": reactorFuelRodSingle.width, "height": reactorFuelRodSingle.height},
                {"x": 0, "y": 0, "width": 50, "height": 50}
            );
        }
        else if(type == "bombardment")
        {
            return getImageFromMergedImages(
                name,
                getSingleColoredPixelImage(color, 1),
                {"x": 0, "y": 0, "width": 1, "height": 1},
                {"x": 16, "y": 3, "width": 18, "height": 41},
                reactorBombardmentRod,
                {"x": 0, "y": 0, "width": reactorBombardmentRod.width, "height": reactorBombardmentRod.height},
                {"x": 0, "y": 0, "width": 50, "height": 50}
            );
        }
    }
}