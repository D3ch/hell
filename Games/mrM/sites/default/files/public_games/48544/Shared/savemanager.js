// ##############################################################
// ####################### VARIABLE REGISTRY ####################
// ##############################################################
const INTEGER_SAVE_VALUE = 1;
const FLOAT_SAVE_VALUE = 2;
const STRING_SAVE_VALUE = 3;
const INT_ARRAY_SAVE_VALUE = 4;
const STRING_ARRAY_SAVE_VALUE = 5;
const BOOLEAN_SAVE_VALUE = 6;
const BOOL_ARRAY_SAVE_VALUE = 7;
const BIG_INTEGER_SAVE_VALUE = 8;
const RAW_INTEGER_SAVE_VALUE = 9;
const JSON_SAVE_VALUE = 10;

var variableRegistry = [];

function registerVariable(variableName, variableFormat)
{
    variableRegistry.push([variableName, variableFormat]);
}

function registerInteger(variableName)
{
    registerVariable(variableName, INTEGER_SAVE_VALUE);
}

function registerFloat(variableName)
{
    registerVariable(variableName, FLOAT_SAVE_VALUE);
}

function registerString(variableName)
{
    registerVariable(variableName, STRING_SAVE_VALUE);
}

function registerIntArray(variableName)
{
    registerVariable(variableName, INT_ARRAY_SAVE_VALUE);
}

function registerStringArray(variableName)
{
    registerVariable(variableName, STRING_ARRAY_SAVE_VALUE);
}

function registerBoolean(variableName)
{
    registerVariable(variableName, BOOLEAN_SAVE_VALUE);
}

function registerBooleanArray(variableName)
{
    registerVariable(variableName, BOOL_ARRAY_SAVE_VALUE);
}

function registerBigInteger(variableName)
{
    registerVariable(variableName, BIG_INTEGER_SAVE_VALUE);
}

function registerRawInteger(variableName)
{
    registerVariable(variableName, RAW_INTEGER_SAVE_VALUE);
}

function registerJson(variableName)
{
    registerVariable(variableName, JSON_SAVE_VALUE);
}

function getVariableFormat(variableName)
{
    for(var i = 0; i < variableRegistry.length; i++)
    {
        if(variableRegistry[i][0] == variableName)
        {
            return variableRegistry[i][1];
        }
    }
}

//Parse the variable and populate the variables value with this parsed value
function loadVariable(chosenSave, index)
{
    if(variableRegistry.length > index && saves[chosenSave].length > index)
    {
        var variableName = variableRegistry[index][0];
        var variableFormat = variableRegistry[index][1];
        var loadedValue = saves[chosenSave][index];
        loadedValue = migrateVariable(loadedValue);

        switch(variableFormat)
        {
            case INTEGER_SAVE_VALUE:
                console.log(variableName + " = " + parseInt(loadedValue));
                eval(variableName + " = " + parseInt(loadedValue));
                break;
            case FLOAT_SAVE_VALUE:
                eval(variableName + " = " + parseFloat(loadedValue));
                break;
            case STRING_SAVE_VALUE:
                console.log(variableName + " = " + loadedValue);
                eval(variableName + " = \"" + loadedValue + "\"");
                break;
            case INT_ARRAY_SAVE_VALUE:
                var newValue = loadedValue.split("!");
                eval(variableName + " = [" + loadedValue.split("!") + "]");
                for(var i = 0; i < newValue.length; i++)
                {
                    if(newValue[i] != null && newValue != "")
                    {
                        console.log(variableName + "[" + i + "] = " + newValue[i]);
                        //eval(variableName + "[" + i + "] = " + parseInt(newValue[i]));
                        eval(variableName + "[" + i + "] = " + newValue[i]);
                    }
                }
                break;
            case STRING_ARRAY_SAVE_VALUE:
                eval(variableName + " = [\"" + loadedValue.split("!").join('","') + "\"]");
                break;
            case BOOLEAN_SAVE_VALUE:
                var newValue = (loadedValue == "1" || loadedValue == 1);
                console.log(variableName + " = " + newValue);
                eval(variableName + " = " + newValue);
                break;
            case BOOL_ARRAY_SAVE_VALUE:
                var newValue = loadedValue.split("");
                eval(variableName + " = [" + loadedValue.split("") + "]");
                for(var i = 0; i < newValue.length; i++)
                {
                    if(newValue[i] != null && newValue != "")
                    {
                        eval(variableName + "[" + i + "] = " + (newValue[i] == "1" || newValue[i] == 1));
                    }
                }
                break;
            case BIG_INTEGER_SAVE_VALUE:
                if(loadedValue.includes("e"))
                {
                    var base = loadedValue.split("e")[0];
                    var exponent = loadedValue.split("e")[1];
                    var exponentiatedMultiplier = 10n ** BigInt(exponent);
                    loadedValue = doBigIntDecimalMultiplication(exponentiatedMultiplier, base);
                }
                else if(loadedValue.includes("."))
                {
                    loadedValue = loadedValue.substring(0, loadedValue.indexOf('.'));
                }
                console.log(variableName + " = " + BigInt(loadedValue));
                eval(variableName + " = BigInt(" + loadedValue + ")");
                break;
            case RAW_INTEGER_SAVE_VALUE:
                console.log(variableName + " = " + loadedValue + "");
                eval(variableName + " = " + loadedValue + "");
                /*if(isNaN(variableName))
                {
                    variableName = 0;
                }
                console.log(variableName + " = Math.floor(" + variableName + ")");
                eval(variableName + " = Math.floor(" + variableName + ")");*/
                break;
            case JSON_SAVE_VALUE:
                console.log(variableName + " =  " + loadedValue);
                eval(variableName + " = " + loadedValue);
                break;
            default:
                console.warn("Unrecognized variable type @ " + index);
                alert("Unrecognized variable type");
                return "";
        }
    }
    else if(variableRegistry.length <= index)
    {
        console.warn("Was unable to load save value at index: " + index + " (Registry is not long enough, register the variable to save it)");
    }
    else if(saves[chosenSave].length <= index)
    {
        console.warn("Was unable to load save value at index: " + index + " (Save data does not contain it, this may be fixed after the next load and is likely due to a variable being added and the save being out of date)");
    }
    else
    {
        console.warn("An error occured @ index: " + index);
    }
}

//Serialize the variable
function getFormattedVariableForSave(variableName)
{
    var variableFormat = getVariableFormat(variableName);
    switch(variableFormat)
    {
        case INTEGER_SAVE_VALUE:
            return String(eval(variableName));
        case FLOAT_SAVE_VALUE:
            return String(eval(variableName));
        case STRING_SAVE_VALUE:
            return eval(variableName);
        case INT_ARRAY_SAVE_VALUE:
            return String(eval(variableName + ".join('!')"));
        case STRING_ARRAY_SAVE_VALUE:
            return String(eval(variableName + ".join('!')"));
        case BOOLEAN_SAVE_VALUE:
            if(eval(variableName))
            {
                return "1";
            }
            else
            {
                return "0";
            }
        case BOOL_ARRAY_SAVE_VALUE:
            var value = eval(variableName);
            var result = "";
            for(var i = 0; i < value.length; i++)
            {
                if(value[i])
                {
                    result += "1";
                }
                else
                {
                    result += "0";
                }
            }
            return result;
        case BIG_INTEGER_SAVE_VALUE:
            return String(eval(variableName));
        case RAW_INTEGER_SAVE_VALUE:
            return String(eval(variableName));
        case JSON_SAVE_VALUE:
            return JSON.stringify(eval(variableName));
        default:
            console.warn("Unrecognized variable type");
            alert("Unrecognized variable type");
            return "";
    }
}

function migrateVariable(variableValue)
{
    return replaceAll(variableValue, '"', "");
}

function loadAllVariables(chosenIndex)
{
    for(var i = 0; i < variableRegistry.length; i++)
    {
        try
        {
            loadVariable(chosenIndex, i);
        }
        catch(e)
        {
            console.log("Error ocurred with loading variable at index: " + chosenIndex);
            (console.error || console.log).call(console, e.stack || e);
        }
    }
    runPostLoadingFixes();
}

//migration
function runPostLoadingFixes()
{
    if(typeof (paidForMinerName) != 'boolean')
    {
        paidForMinerName = false;
        if(customMinerDatabaseIndex >= 0)
        {
            paidForMinerName = true;
        }
        else if(centsSpent >= 5000)
        {
            handleNameSubmission();
        }
    }
    if(isNaN(specialUpgrades[0]))
    {
        specialUpgrades[0] = 0;
    }
    if(Number.isNaN(money) || money < 0)
    {
        money = 0n;
    }
    for(var key in worldResources)
    {
        if(isNaN(worldResources[key].numOwned) || worldResources[key].numOwned < 0)
        {
            worldResources[key].numOwned = 0;
        }
        if(isNaN(lockedMineralAmtsToSave[key]))
        {
            lockedMineralAmtsToSave[key] = 0;
        }
    }
    if(isNaN(totalCompletedTrades))
    {
        totalCompletedTrades = 0;
        earthTradeOffer1 = [];
        earthTradeOffer2 = [];
        singleMiningLoopValueSnapshot = [];
        nextTradeTimeEarth = Math.floor(playtime + 120);
    }
    while(lockedMineralAmtsToSave.length < worldResources.length)
    {
        lockedMineralAmtsToSave.push(0);
    }
    if(drillEquips[64].isCrafted > 1)
    {
        drillEquips[64].isCrafted = false;
    }
    for(var key in quest)
    {
        if(isNaN(quest[key]))
        {
            quest[key] = 0;
        }
    }

    unseenBlueprints = filterLowLevelDrillBlueprints(unseenBlueprints);

    //########################### 0.16 MIGRATION ###########################
    //0.15 to 0.16 blueprint $ migration

    //If the user's previous game version was < 116
    //and they had paid for a blueprint but it was not yet crafted
    //and the blueprint was available from shops
    //then give them the purchase value of the blueprint & alert this in the news
    if(oldversion < 116)
    {
        var blueprints = getKnownBlueprints();
        var blueprintsInCategory = filterBlueprintsByCategory(blueprints, 1);
        var purchasedBlueprints = filterBlueprints(blueprintsInCategory, function (blueprint) {return blueprint.isFromShop && blueprint.craftedItem.item.canCraft();});
        for(var i = 0; i < purchasedBlueprints.length; i++)
        {
            addMoney(purchasedBlueprints[i].price);
            newNews(_("You were credited the ${0} you spent on {1} as money is now part of crafting", purchasedBlueprints[i].price, purchasedBlueprints[i].name), true);
        }
    }

    //######################################################################

    learnReachedStructures();

    //########################### 0.18 MIGRATION ###########################
    //0.17 to 0.18 structure migration

    //If the user's previous game version was < 118
    //and they had a metal detector or manager
    //then give them the same level for that structure
    console.log("old version: " + oldversion);
    if(oldversion < 118)
    {
        var metalDetectorLevel = specialUpgrades[0];
        var managerLevel = specialUpgrades[1];

        if(metalDetectorStructure.level < metalDetectorLevel)
        {
            metalDetectorStructure.level = metalDetectorLevel;
        }

        if(managerStructure.level < managerLevel)
        {
            managerStructure.level = managerLevel;
        }

        if(depth >= 20 && tradingPostStructure.level == 0)
        {
            tradingPostStructure.level = 1;
        }
        if(depth >= 1052 && moonTradingPostStructure.level == 0)
        {
            moonTradingPostStructure.level = 1;
        }

        if(oldversion == 117)
        {
            if(depth >= buffLabStructure.depthAvailable)
            {
                buffLabStructure.level++;
            }
        }
        console.log(buffLabStructure.level);
        if(buffLabStructure.level == 0)
        {
            buffLabStructure.level = 1;
            console.log("Updating");
        }

        var buildingMaterialsToGrant = Math.floor(depth / 10);
        if(buildingMaterialsToGrant > 0)
        {
            worldResources[BUILDING_MATERIALS_INDEX].numOwned += buildingMaterialsToGrant;
            newNews(_("Structures are now upgraded through crafting."), true);
            newNews(_("You received {0} building materials", buildingMaterialsToGrant), true);
        }
    }
    //######################################################################

    //########################### 0.19 MIGRATION ###########################

    if(oldversion == 119)
    {
        for(var i = 0; i < buffs.activeBuffs.length; i++)
        {
            if(buffs.activeBuffs[i].id == 4)
            {
                if(buffs.activeBuffs[i].statBuffAmount == 20)
                {
                    buffs.activeBuffs[i].statBuffAmount = 100;
                }
            }
        }
    }

    //######################################################################
    // Make sure the trade values are big integer v0.24 change

    if(earthTradeOffer1.length > 7 && earthTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT] !== undefined && earthTradeOffer1[TRADE_INDEX_REWARD_AMOUNT] !== undefined)
    {
        earthTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT] = makeBigInt(earthTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT]);
        earthTradeOffer1[TRADE_INDEX_REWARD_AMOUNT] = makeBigInt(earthTradeOffer1[TRADE_INDEX_REWARD_AMOUNT]);
    }
    if(earthTradeOffer2.length > 7 && earthTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT] !== undefined && earthTradeOffer2[TRADE_INDEX_REWARD_AMOUNT] !== undefined)
    {
        earthTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT] = makeBigInt(earthTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT]);
        earthTradeOffer2[TRADE_INDEX_REWARD_AMOUNT] = makeBigInt(earthTradeOffer2[TRADE_INDEX_REWARD_AMOUNT]);
    }
    if(moonTradeOffer1.length > 7 && moonTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT] !== undefined && moonTradeOffer1[TRADE_INDEX_REWARD_AMOUNT] !== undefined)
    {
        moonTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT] = makeBigInt(moonTradeOffer1[TRADE_INDEX_PAYMENT_AMOUNT]);
        moonTradeOffer1[TRADE_INDEX_REWARD_AMOUNT] = makeBigInt(moonTradeOffer1[TRADE_INDEX_REWARD_AMOUNT]);
    }
    if(moonTradeOffer2.length > 7 && moonTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT] !== undefined && moonTradeOffer2[TRADE_INDEX_REWARD_AMOUNT] !== undefined)
    {
        moonTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT] = makeBigInt(moonTradeOffer2[TRADE_INDEX_PAYMENT_AMOUNT]);
        moonTradeOffer2[TRADE_INDEX_REWARD_AMOUNT] = makeBigInt(moonTradeOffer2[TRADE_INDEX_REWARD_AMOUNT]);
    }

    //########################### 0.24 QUEST MIGRATION ###########################

    if(oldversion < 124)
    {
        for(var i = 0; i < quest.length; i++)
        {
            if(quest[i] >= 1)
            {
                questManager.getQuest(i).isComplete = true;
            }
            if(quest[i] == 2)
            {
                questManager.getQuest(i).isCollected = true;
            }
        }

        chestService.migrateDeprecatedChestStorage();

        if(reactorComponents[25].numOwned > 100)
        {
            reactorComponents[25].numOwned = Math.floor(reactorComponents[25].numOwned / 2.5);
        }

        if(depth > 1132 && chestCompressorStructure.level < 1)
        {
            chestCompressorStructure.level = 1;
            learnBlueprint(3, 12);
            newNews(_("Discovered the Chest Compressor!"));
        }
    }

    initAvailableBlueprints();

    for(var i = 0; i < DeprecatedBlueprints.length; i++)
    {
        if(DeprecatedBlueprints[i][8] > 0)
        {
            // Blueprint is already owned
            learnBlueprint(1, i, false);
        }
        if(drillEquips[(i + 4)].isCrafted)
        {
            hasCraftedABlueprint = true;
        }
    }

    //Learn blueprints for weapons you own
    for(var i = 0; i < battleInventory.length; i++)
    {
        if(battleInventory[i].length > 0)
        {
            //Upgrade currently upgrading ones (from prev version of game)
            if(battleInventory[i][6] == 1)
            {
                battleInventory[i][5] = 0;
                battleInventory[i][6] = 0;
                battleInventory[i][4]++;
                newNews(battleEquipStats[battleInventory[i][0]][3] + " " + _("Upgraded to Lvl") + " " + battleInventory[i][4], true);
            }

            var weaponType = battleInventory[i][0];
            try
            {
                makeBlueprintAvailable(2, weaponType);
                learnBlueprint(2, weaponType);
            }
            catch(e)
            {
                // Delete any invalid weapons
                console.warn(e);
                battleInventory[i] = [];
            }
        }
    }

    if(isNaN(hasUnlockedScientists))
    {
        hasUnlockedScientists = 1;
    }

    if(oilrigStructure.level > oilrigStructure.maxLevel)
    {
        oilrigStructure.level = oilrigStructure.maxLevel;
    }

    // updateCaveSystemSpawns();

    oldversion = version;
    previousPlatform = lastPlatform;
    lastPlatform = platformName();

    if(UID == null || UID < 100 || isNaN(UID))
    {
        UID = platform.getUserId();
    }

    for(var i = 0; i < superMinerManager.numSuperMiners(); i++)
    {
        let superMiner = superMinerManager.currentSuperMiners[i];
        let superMinerDepth = superMinerManager.currentSuperMiners[i].currentDepth;
        let targetedDepth = superMinerManager.currentSuperMiners[i].targetDepth;
        if((superMiner && typeof (superMinerDepth) !== "undefined" && typeof (targetedDepth) !== "undefined") &&
            ((superMinerDepth > depth || superMinerDepth < -1 || isNaN(superMinerDepth)) ||
                (targetedDepth > depth || targetedDepth < -1 || isNaN(targetedDepth))))
        {
            superMinerManager.currentSuperMiners[i].setToRandomDepth(0, depth);
            superMinerManager.currentSuperMiners[i].targetDepth = -1; //tells their handle movement to reset this
            superMinerManager.currentSuperMiners[i].handleMovement();
        }
    }

    for(var i = 0; i < buffs.activeBuffs.length; i++)
    {
        if(buffs.activeBuffs[i].startSource == "BuffMiner")
        {
            if(buffs.activeBuffs[i].id == 0 && buffs.activeBuffs[i].millisecondsRemaining > 60000)
            {
                buffs.activeBuffs[i].millisecondsRemaining = 60000;
            }
            else if(buffs.activeBuffs[i].id == 9 && buffs.activeBuffs[i].millisecondsRemaining > 300000)
            {
                buffs.activeBuffs[i].millisecondsRemaining = 300000;
            }
        }
    }
}

function generateSaveText()
{
    var result = [];
    for(var i = 0; i < variableRegistry.length; i++)
    {
        result.push(getFormattedVariableForSave(variableRegistry[i][0]));
    }
    return result.join("|");
}

function generateDiffTest()
{
    var newSave = utf8_to_b64(generateSaveText());
    var oldSave = getB64SaveText();
    console.log(newSave);
    console.log(oldSave);
    if(newSave == oldSave)
    {
        console.log("same");
    }
    else
    {
        console.log("different");
    }
}

// #########################################################################
// ####################### REGISTER ALL SAVED VARIABLES ####################
// #########################################################################
var isSaveMappingSet = false;
var NO_LONGER_IN_USE;

// !!! WARNING !!! The order variables are registered in matters, do not change order of variables or saves will break !!!
function registerVariablesToSave()
{
    registerBigInteger("money");
    registerInteger("depth");
    registerBigInteger("progressTowardsNextDepth");
    registerInteger("UID");
    registerInteger("drillState.equippedDrillEquips[0]");
    registerInteger("drillState.equippedDrillEquips[1]");
    registerInteger("drillState.equippedDrillEquips[2]");
    registerInteger("drillState.equippedDrillEquips[3]");
    registerInteger("worlds[0].workersHired");
    registerInteger("oldversion");
    registerInteger("worldResources[1].numOwned"); //10
    registerInteger("worldResources[2].numOwned");
    registerInteger("worldResources[3].numOwned");
    registerInteger("worldResources[4].numOwned");
    registerInteger("worldResources[5].numOwned");
    registerInteger("worldResources[6].numOwned");
    registerInteger("worldResources[7].numOwned");
    registerInteger("worldResources[8].numOwned");
    registerInteger("worldResources[9].numOwned");
    registerInteger("worldResources[10].numOwned");
    registerInteger("worldResources[11].numOwned"); //20
    registerInteger("worldResources[12].numOwned");
    registerInteger("worldResources[13].numOwned");
    registerInteger("worldResources[14].numOwned");
    registerInteger("worldResources[15].numOwned");
    registerInteger("worldResources[16].numOwned");
    registerInteger("worldResources[17].numOwned");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("NO_LONGER_IN_USE"); //30
    registerInteger("worldResources[18].numOwned");
    registerInteger("worldResources[19].numOwned");
    registerInteger("worldResources[20].numOwned");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("worldResources[21].numOwned");
    registerInteger("worldResources[22].numOwned");
    registerInteger("worldResources[23].numOwned");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("worldResources[24].numOwned");
    registerInteger("worldResources[25].numOwned"); //40
    registerInteger("worldResources[26].numOwned");
    registerIntArray("inventory[0]");
    registerIntArray("inventory[1]");
    registerIntArray("inventory[2]");
    registerIntArray("inventory[3]");
    registerIntArray("inventory[4]");
    registerInteger("DeprecatedBlueprints[0][8]");
    registerBoolean("drillEquips[4].isCrafted");
    registerInteger("DeprecatedBlueprints[1][8]");
    registerBoolean("drillEquips[5].isCrafted"); //50
    registerInteger("DeprecatedBlueprints[2][8]");
    registerBoolean("drillEquips[6].isCrafted");
    registerInteger("DeprecatedBlueprints[3][8]");
    registerBoolean("drillEquips[7].isCrafted");
    registerInteger("DeprecatedBlueprints[4][8]");
    registerBoolean("drillEquips[8].isCrafted");
    registerInteger("DeprecatedBlueprints[5][8]");
    registerBoolean("drillEquips[9].isCrafted");
    registerInteger("DeprecatedBlueprints[6][8]");
    registerBoolean("drillEquips[10].isCrafted"); //60
    registerInteger("DeprecatedBlueprints[7][8]");
    registerBoolean("drillEquips[11].isCrafted");
    registerInteger("DeprecatedBlueprints[8][8]");
    registerBoolean("drillEquips[12].isCrafted");
    registerInteger("DeprecatedBlueprints[9][8]");
    registerBoolean("drillEquips[13].isCrafted");
    registerInteger("DeprecatedBlueprints[10][8]");
    registerBoolean("drillEquips[14].isCrafted");
    registerInteger("DeprecatedBlueprints[11][8]");
    registerBoolean("drillEquips[15].isCrafted"); //70
    registerInteger("DeprecatedBlueprints[12][8]");
    registerBoolean("drillEquips[16].isCrafted");
    registerInteger("DeprecatedBlueprints[13][8]");
    registerBoolean("drillEquips[17].isCrafted");
    registerInteger("DeprecatedBlueprints[14][8]");
    registerBoolean("drillEquips[18].isCrafted");
    registerInteger("DeprecatedBlueprints[15][8]");
    registerBoolean("drillEquips[19].isCrafted");
    registerInteger("DeprecatedBlueprints[16][8]");
    //AO: Make sure we change these indexes once they exist
    registerBoolean("drillEquips[20].isCrafted"); //80
    registerInteger("playtime");
    registerIntArray("quest"); //DEPRECATED FOR questManager.saveState
    registerInteger("DeprecatedBlueprints[17][8]");
    registerBoolean("drillEquips[21].isCrafted");
    registerInteger("DeprecatedBlueprints[18][8]");
    registerBoolean("drillEquips[22].isCrafted");
    registerInteger("DeprecatedBlueprints[19][8]");
    registerBoolean("drillEquips[23].isCrafted");
    registerInteger("DeprecatedBlueprints[20][8]");
    registerBoolean("drillEquips[24].isCrafted"); //90
    registerInteger("DeprecatedBlueprints[21][8]");
    registerBoolean("drillEquips[25].isCrafted");
    registerInteger("DeprecatedBlueprints[22][8]");
    registerBoolean("drillEquips[26].isCrafted");
    registerInteger("DeprecatedBlueprints[23][8]");
    registerBoolean("drillEquips[27].isCrafted");
    registerInteger("DeprecatedBlueprints[24][8]");
    registerBoolean("drillEquips[28].isCrafted");
    registerInteger("DeprecatedBlueprints[25][8]");
    registerBoolean("drillEquips[29].isCrafted"); //100
    registerInteger("DeprecatedBlueprints[26][8]");
    registerBoolean("drillEquips[30].isCrafted");
    registerInteger("DeprecatedBlueprints[27][8]");
    registerBoolean("drillEquips[31].isCrafted");
    registerInteger("DeprecatedBlueprints[28][8]");
    registerBoolean("drillEquips[32].isCrafted");
    registerInteger("DeprecatedBlueprints[29][8]");
    registerBoolean("drillEquips[33].isCrafted");
    registerInteger("DeprecatedBlueprints[30][8]");
    registerBoolean("drillEquips[34].isCrafted"); //110
    registerInteger("DeprecatedBlueprints[31][8]");
    registerBoolean("drillEquips[35].isCrafted");
    registerInteger("worlds[0].workerLevel");
    registerIntArray("specialUpgrades");
    registerInteger("tickets");
    registerInteger("DeprecatedBlueprints[32][8]");
    registerBoolean("drillEquips[36].isCrafted");
    registerInteger("DeprecatedBlueprints[33][8]");
    registerBoolean("drillEquips[37].isCrafted");
    registerInteger("DeprecatedBlueprints[34][8]"); //110
    registerBoolean("drillEquips[38].isCrafted");
    registerInteger("DeprecatedBlueprints[35][8]");
    registerBoolean("drillEquips[39].isCrafted");
    registerInteger("DeprecatedBlueprints[36][8]");
    registerBoolean("drillEquips[40].isCrafted");
    registerInteger("DeprecatedBlueprints[37][8]");
    registerBoolean("drillEquips[41].isCrafted");
    registerInteger("DeprecatedBlueprints[38][8]");
    registerBoolean("drillEquips[42].isCrafted");
    registerInteger("DeprecatedBlueprints[39][8]"); //120
    registerBoolean("drillEquips[43].isCrafted");
    registerInteger("camefrom");
    registerInteger("savetime");
    registerInteger("story");
    registerInteger("worldResources[33].numOwned");
    registerInteger("monsterskilled");
    registerIntArray("battleInventory[0]");
    registerIntArray("battleInventory[1]");
    registerIntArray("battleInventory[2]");
    registerIntArray("battleInventory[3]"); //130
    registerIntArray("battleInventory[4]");
    registerIntArray("battleInventory[5]");
    registerIntArray("battleInventory[6]");
    registerIntArray("battleInventory[7]");
    registerIntArray("battleInventory[8]");
    registerIntArray("battleInventory[9]");
    registerIntArray("battleInventory[10]");
    registerIntArray("battleInventory[11]");
    registerIntArray("battleInventory[12]");
    registerIntArray("battleInventory[13]"); //140
    registerIntArray("battleInventory[14]");
    registerInteger("oilrigStructure.level");
    registerInteger("oilRigTime");
    registerInteger("hasUnlockedScientists");
    registerInteger("maxRelicSlots");
    registerIntArray("equippedRelics");
    registerIntArray("activeScientists[0]");
    registerIntArray("activeScientists[1]");
    registerIntArray("activeScientists[2]");
    registerIntArray("activeExcavations[0]"); //150
    registerIntArray("activeExcavations[1]");
    registerIntArray("activeExcavations[2]");
    registerIntArray("excavationChoices[0][0]");
    registerIntArray("excavationChoices[0][1]");
    registerIntArray("excavationChoices[1][0]");
    registerIntArray("excavationChoices[1][1]");
    registerIntArray("excavationChoices[2][0]");
    registerIntArray("excavationChoices[2][1]");
    registerInteger("highestLevelScientist");
    registerInteger("deadScientists"); //160
    registerInteger("numExcavationsCompleted");
    registerInteger("bossesDefeated");
    registerInteger("hasFoundGolem");
    registerInteger("DeprecatedBlueprints[40][8]");
    registerBoolean("drillEquips[44].isCrafted");
    registerInteger("DeprecatedBlueprints[41][8]");
    registerBoolean("drillEquips[45].isCrafted");
    registerInteger("DeprecatedBlueprints[42][8]");
    registerBoolean("drillEquips[46].isCrafted");
    registerInteger("DeprecatedBlueprints[43][8]"); //170
    registerBoolean("drillEquips[47].isCrafted");
    registerInteger("DeprecatedBlueprints[44][8]");
    registerBoolean("drillEquips[48].isCrafted");
    registerInteger("DeprecatedBlueprints[45][8]");
    registerBoolean("drillEquips[49].isCrafted");
    registerInteger("DeprecatedBlueprints[46][8]");
    registerBoolean("drillEquips[50].isCrafted");
    registerInteger("DeprecatedBlueprints[47][8]");
    registerBoolean("drillEquips[51].isCrafted");
    registerInteger("DeprecatedBlueprints[48][8]"); //180
    registerBoolean("drillEquips[52].isCrafted");
    registerInteger("DeprecatedBlueprints[49][8]");
    registerBoolean("drillEquips[53].isCrafted");
    registerInteger("DeprecatedBlueprints[50][8]");
    registerBoolean("drillEquips[54].isCrafted");
    registerInteger("DeprecatedBlueprints[51][8]");
    registerBoolean("drillEquips[55].isCrafted");
    registerIntArray("lockedMineralAmtsToSave");
    registerStringArray("redeemedCodes");
    registerInteger("highestOreUnlocked"); //190
    registerInteger("highestIsotopeUnlocked");
    registerBooleanArray("userExperienceBranchesTriggered");
    registerInteger("totalCompletedTrades");
    registerIntArray("earthTradeOffer1");
    registerIntArray("singleMiningLoopValueSnapshot");
    registerInteger("DeprecatedBlueprints[52][8]");
    registerBoolean("drillEquips[56].isCrafted");
    registerInteger("DeprecatedBlueprints[53][8]");
    registerBoolean("drillEquips[57].isCrafted");
    registerInteger("DeprecatedBlueprints[54][8]");
    registerBoolean("drillEquips[58].isCrafted");
    registerInteger("DeprecatedBlueprints[55][8]");
    registerBoolean("drillEquips[59].isCrafted");
    registerInteger("DeprecatedBlueprints[56][8]");
    registerBoolean("drillEquips[60].isCrafted");
    registerInteger("DeprecatedBlueprints[57][8]");
    registerBoolean("drillEquips[61].isCrafted");
    registerInteger("DeprecatedBlueprints[58][8]");
    registerBoolean("drillEquips[62].isCrafted");
    registerInteger("DeprecatedBlueprints[59][8]");
    registerBoolean("drillEquips[63].isCrafted");
    registerInteger("DeprecatedBlueprints[60][8]");
    registerBoolean("drillEquips[64].isCrafted");
    registerIntArray("earthTradeOffer2");
    registerInteger("nextTradeTimeEarth");
    registerBoolean("tradeConfig.tradingPosts[0].playerHasSeenNewTrade");
    registerIntArray("backpack");
    registerStringArray("knownBlueprints");
    registerInteger("worlds[1].workersHired");
    registerInteger("worlds[1].workerLevel");
    registerStringArray("availableBlueprints");
    registerStringArray("unseenBlueprints");
    registerInteger("hasLaunched");
    registerBoolean("hasCraftedABlueprint");
    registerInteger("hasFoundGidget");
    registerInteger("DeprecatedBlueprints[61][8]");
    registerBoolean("drillEquips[65].isCrafted");
    registerInteger("DeprecatedBlueprints[62][8]");
    registerBoolean("drillEquips[66].isCrafted");
    registerInteger("DeprecatedBlueprints[63][8]");
    registerBoolean("drillEquips[67].isCrafted");
    registerInteger("DeprecatedBlueprints[64][8]");
    registerBoolean("drillEquips[68].isCrafted");
    registerInteger("DeprecatedBlueprints[65][8]");
    registerBoolean("drillEquips[69].isCrafted");
    registerInteger("DeprecatedBlueprints[66][8]");
    registerBoolean("drillEquips[70].isCrafted");
    registerInteger("DeprecatedBlueprints[67][8]");
    registerBoolean("drillEquips[71].isCrafted");
    registerInteger("DeprecatedBlueprints[68][8]");
    registerBoolean("drillEquips[72].isCrafted");
    registerInteger("DeprecatedBlueprints[69][8]");
    registerBoolean("drillEquips[73].isCrafted");
    registerInteger("DeprecatedBlueprints[70][8]");
    registerBoolean("drillEquips[74].isCrafted");
    registerInteger("DeprecatedBlueprints[71][8]");
    registerBoolean("drillEquips[75].isCrafted");
    registerInteger("DeprecatedBlueprints[72][8]");
    registerBoolean("drillEquips[76].isCrafted");
    registerInteger("DeprecatedBlueprints[73][8]");
    registerBoolean("drillEquips[77].isCrafted");
    registerInteger("DeprecatedBlueprints[74][8]");
    registerBoolean("drillEquips[78].isCrafted");
    registerInteger("DeprecatedBlueprints[75][8]");
    registerBoolean("drillEquips[79].isCrafted");
    registerInteger("DeprecatedBlueprints[76][8]");
    registerBoolean("drillEquips[80].isCrafted");
    registerInteger("DeprecatedBlueprints[77][8]");
    registerBoolean("drillEquips[81].isCrafted");
    registerInteger("DeprecatedBlueprints[78][8]");
    registerBoolean("drillEquips[82].isCrafted");
    registerInteger("DeprecatedBlueprints[79][8]");
    registerBoolean("drillEquips[83].isCrafted");
    registerInteger("DeprecatedBlueprints[80][8]");
    registerBoolean("drillEquips[84].isCrafted");
    registerInteger("DeprecatedBlueprints[81][8]");
    registerBoolean("drillEquips[85].isCrafted");
    registerInteger("DeprecatedBlueprints[82][8]");
    registerBoolean("drillEquips[86].isCrafted");
    registerInteger("DeprecatedBlueprints[83][8]");
    registerBoolean("drillEquips[87].isCrafted");
    registerInteger("DeprecatedBlueprints[84][8]");
    registerBoolean("drillEquips[88].isCrafted");
    registerInteger("DeprecatedBlueprints[85][8]");
    registerBoolean("drillEquips[89].isCrafted");
    registerInteger("DeprecatedBlueprints[86][8]");
    registerBoolean("drillEquips[90].isCrafted");
    registerInteger("DeprecatedBlueprints[87][8]");
    registerBoolean("drillEquips[91].isCrafted");
    registerInteger("DeprecatedBlueprints[88][8]");
    registerBoolean("drillEquips[92].isCrafted");
    registerInteger("DeprecatedBlueprints[89][8]");
    registerBoolean("drillEquips[93].isCrafted");
    registerInteger("DeprecatedBlueprints[90][8]");
    registerBoolean("drillEquips[94].isCrafted");
    registerInteger("DeprecatedBlueprints[91][8]");
    registerBoolean("drillEquips[95].isCrafted");
    registerInteger("DeprecatedBlueprints[92][8]");
    registerBoolean("drillEquips[96].isCrafted");
    registerInteger("DeprecatedBlueprints[93][8]");
    registerBoolean("drillEquips[97].isCrafted");
    registerInteger("DeprecatedBlueprints[94][8]");
    registerBoolean("drillEquips[98].isCrafted");
    registerInteger("DeprecatedBlueprints[95][8]");
    registerBoolean("drillEquips[99].isCrafted");
    registerInteger("DeprecatedBlueprints[96][8]");
    registerBoolean("drillEquips[100].isCrafted");
    registerInteger("worldResources[27].numOwned");
    registerInteger("worldResources[28].numOwned");
    registerInteger("worldResources[29].numOwned");
    registerInteger("worldResources[30].numOwned");
    registerInteger("worldResources[31].numOwned");
    registerInteger("worldResources[32].numOwned");
    registerInteger("numGameLaunches");
    registerStringArray("promosClicked");
    registerInteger("lastTimeSeenPromo");
    registerInteger("centsSpent");
    registerInteger("quality");
    registerInteger("customMinerDatabaseIndex");
    registerInteger("nextTradeTimeMoon");
    registerIntArray("moonTradeOffer1");
    registerIntArray("moonTradeOffer2");
    registerInteger("worldResources[34].numOwned");
    registerInteger("worldResources[35].numOwned");
    registerInteger("worldResources[36].numOwned");
    registerInteger("worldResources[37].numOwned");
    registerInteger("worldResources[38].numOwned");
    registerInteger("worldResources[39].numOwned");
    registerInteger("worldResources[40].numOwned");
    registerInteger("worldResources[41].numOwned");
    registerInteger("worldResources[42].numOwned");
    registerInteger("worldResources[43].numOwned");
    registerInteger("gemForgeStructure.level");
    registerString("GemForger.queueSaveValue");
    registerBoolean("areQuotesEnabled");
    registerBoolean("tradeConfig.tradingPosts[1].playerHasSeenNewTrade");
    registerInteger("mineralsSacrificed");
    registerInteger("worldResources[44].numOwned");
    registerBoolean("isCoreWarped");
    registerBoolean("isCoreBlessed");
    registerInteger("buffLabStructure.level");
    registerInteger("reactorStructure.level");
    registerIntArray("reactor.grid.grid[0]");
    registerIntArray("reactor.grid.grid[1]");
    registerIntArray("reactor.grid.grid[2]");
    registerIntArray("reactor.grid.grid[3]");
    registerIntArray("reactor.grid.grid[4]");
    registerIntArray("reactor.grid.grid[5]");
    registerIntArray("reactor.grid.grid[6]");
    registerIntArray("reactor.grid.grid[7]");
    registerIntArray("reactor.grid.grid[8]");
    registerJson("reactor.grid.fuelCellRemainingEnergy");
    registerInteger("reactorComponents[1].numOwned");
    registerInteger("reactorComponents[2].numOwned");
    registerInteger("reactorComponents[3].numOwned");
    registerInteger("reactorComponents[4].numOwned");
    registerInteger("reactorComponents[5].numOwned");
    registerInteger("reactorComponents[6].numOwned");
    registerInteger("reactorComponents[7].numOwned");
    registerInteger("reactorComponents[8].numOwned");
    registerInteger("reactorComponents[9].numOwned");
    registerInteger("reactorComponents[10].numOwned");
    registerInteger("reactorComponents[11].numOwned");
    registerInteger("reactorComponents[12].numOwned");
    registerInteger("reactorComponents[13].numOwned");
    registerInteger("reactorComponents[14].numOwned");
    registerInteger("reactorComponents[15].numOwned");
    registerInteger("reactorComponents[16].numOwned");
    registerInteger("reactorComponents[17].numOwned");
    registerInteger("reactorComponents[18].numOwned");
    registerInteger("worldResources[45].numOwned");
    registerInteger("worldResources[46].numOwned");
    registerInteger("worldResources[47].numOwned");
    registerInteger("reactorComponents[19].numOwned");
    registerInteger("reactorComponents[20].numOwned");
    registerInteger("reactorComponents[21].numOwned");
    registerInteger("chestService.totalBasicChestsOpened");
    registerInteger("chestService.totalGoldChestsOpened");
    registerInteger("totalMineralsMined");
    registerInteger("DeprecatedBlueprints[97][8]");
    registerBoolean("drillEquips[101].isCrafted");
    registerInteger("DeprecatedBlueprints[98][8]");
    registerBoolean("drillEquips[102].isCrafted");
    registerInteger("DeprecatedBlueprints[99][8]");
    registerBoolean("drillEquips[103].isCrafted");
    registerInteger("DeprecatedBlueprints[100][8]");
    registerBoolean("drillEquips[104].isCrafted");
    registerInteger("DeprecatedBlueprints[101][8]");
    registerBoolean("drillEquips[105].isCrafted");
    registerInteger("DeprecatedBlueprints[102][8]");
    registerBoolean("drillEquips[106].isCrafted");
    registerInteger("DeprecatedBlueprints[103][8]");
    registerBoolean("drillEquips[107].isCrafted");
    registerInteger("DeprecatedBlueprints[104][8]");
    registerBoolean("drillEquips[108].isCrafted");
    registerInteger("DeprecatedBlueprints[105][8]");
    registerBoolean("drillEquips[109].isCrafted");
    registerInteger("totalTimeLapsedMinutes");
    registerInteger("reactorComponents[22].numOwned");
    registerInteger("reactorComponents[23].numOwned");
    registerInteger("reactorComponents[24].numOwned");
    registerInteger("reactorComponents[25].numOwned");
    registerString("buffs.saveState");
    registerInteger("whackosKilled");
    registerInteger("reactor.totalRuntimeSecs");
    registerInteger("bufflab.totalBuffsCasted");
    registerInteger("bufflab.totalSecsBuffed");
    registerInteger("worldResources[48].numOwned");
    registerInteger("tradingPostStructure.level");
    registerInteger("managerStructure.level");
    registerInteger("metalDetectorStructure.level");
    registerInteger("moonTradingPostStructure.level");
    registerInteger("bufflab.maxConsecutiveSecondsBuffed");
    registerInteger("chestCollectorStorageStructure.level");
    registerInteger("chestCollectorChanceStructure.level");
    registerInteger("chestService.chestsStored");
    registerBoolean("paidForMinerName");
    registerBoolean("drillEquips[110].isCrafted");
    registerInteger("worldResources[49].numOwned");
    registerInteger("worldResources[50].numOwned");
    registerInteger("worldResources[51].numOwned");
    registerInteger("reactorComponents[26].numOwned");
    registerInteger("reactorComponents[27].numOwned");
    registerInteger("reactorComponents[28].numOwned");
    registerInteger("secondsSinceOrangeFishSpawn");
    registerInteger("secondsUntilNextOrangeFishSpawn");
    registerInteger("orangeFishCollected");
    registerInteger("chestSpawnRoller.seed");
    registerInteger("basicChestRewardRoller.seed");
    registerInteger("goldenChestRewardRoller.seed");
    registerInteger("scientistRoller.seed");
    registerInteger("tradeRoller.seed");
    registerInteger("caveRoller.seed");
    registerInteger("coreMineralRoller.seed");
    registerInteger("battleSpawnRoller.seed");
    registerInteger("clickableRoller.seed");
    registerInteger("relicFunctionalityRoller.seed");
    registerInteger("userExperienceRoller.seed");
    registerInteger("uxSeed"); //use for split testing start game
    registerString("caves[0].serializedSaveValue");
    registerString("caves[1].serializedSaveValue");
    registerString("caves[2].serializedSaveValue");
    registerString("caves[3].serializedSaveValue");
    registerString("caves[4].serializedSaveValue");
    registerString("caves[5].serializedSaveValue");
    registerString("caves[6].serializedSaveValue");
    registerString("NO_LONGER_IN_USE");
    registerString("NO_LONGER_IN_USE");
    registerString("NO_LONGER_IN_USE");
    registerString("NO_LONGER_IN_USE");
    registerString("treasureStorage.serializedSaveValue");
    registerInteger("caveMaxFuelStructure.level");
    registerInteger("caveFuelRegenStructure.level");
    registerString("currentDroneLevels.serializedSaveValue");
    registerBoolean("hasFirstCaveSpawned");
    registerInteger("numberOfRewardsCollected");
    registerInteger("numberOfCavesExplored");
    registerBoolean("hasCollectedTreasure");
    registerInteger("splitTestValue1");
    registerInteger("earliestVersion");
    registerInteger("firstTimePlayed");
    registerBoolean("isDevUser");
    registerInteger("activePlayTimeMinutes");
    registerInteger("totalPlayMinutes");
    registerInteger("testNumber");
    registerBoolean("drillEquips[111].isCrafted");
    registerBoolean("drillEquips[112].isCrafted");
    registerBoolean("drillEquips[113].isCrafted");
    registerBoolean("drillEquips[114].isCrafted");
    registerBoolean("drillEquips[115].isCrafted");
    registerBoolean("drillEquips[116].isCrafted");
    registerBoolean("drillEquips[117].isCrafted");
    registerBoolean("drillEquips[118].isCrafted");
    registerBoolean("drillEquips[119].isCrafted");
    registerBoolean("drillEquips[120].isCrafted");
    registerBoolean("drillEquips[121].isCrafted");
    registerBoolean("drillEquips[122].isCrafted");
    registerBoolean("drillEquips[123].isCrafted");
    registerInteger("worldResources[52].numOwned");
    registerInteger("worldResources[53].numOwned");
    registerInteger("worldResources[54].numOwned");
    registerInteger("worldResources[55].numOwned");
    registerInteger("worldResources[56].numOwned");
    registerInteger("worldResources[57].numOwned");
    registerInteger("worldResources[58].numOwned");
    registerInteger("worldResources[59].numOwned");
    registerInteger("worldResources[60].numOwned");
    registerInteger("worlds[2].workersHired");
    registerInteger("worlds[2].workerLevel");
    registerInteger("worldResources[61].numOwned");
    registerInteger("worldResources[62].numOwned");
    registerInteger("worldResources[63].numOwned");
    registerInteger("worldResources[64].numOwned");
    registerInteger("worldResources[65].numOwned");
    registerInteger("worldResources[66].numOwned");
    registerInteger("worldResources[66].numOwned");
    registerIntArray("chestService.storedChests");
    registerInteger("chestCompressorStructure.level");
    registerInteger("numCavesCompleted");
    registerInteger("numScientistsSacrificed");
    registerString("questManager.saveState");
    registerInteger("hasFoundUfo");
    registerIntArray("savedReactorLayouts[0]");
    registerIntArray("savedReactorLayouts[1]");
    registerIntArray("savedReactorLayouts[2]");
    registerIntArray("savedReactorLayouts[3]");
    registerIntArray("savedReactorLayouts[4]");
    registerIntArray("savedReactorLayouts[5]");
    registerIntArray("savedReactorLayouts[6]");
    registerIntArray("savedReactorLayouts[7]");
    registerIntArray("savedReactorLayouts[8]");
    registerIntArray("savedReactorLayouts[9]");
    registerStringArray("savedReactorLayoutNames");
    registerInteger("coreRelicRoller.seed");
    registerInteger("coreScientistRoller.seed");
    //Split test seeds below (Roller.js)
    registerInteger("basicChestRewardRollerSeed");
    registerInteger("goldenChestRewardRollerSeed");
    registerInteger("tradeRollerSeed");
    registerInteger("caveRollerSeed");
    registerInteger("clickableRollerSeed");
    registerInteger("chestSpawnRollerSeed");
    registerString("lastPlatform");
    registerBoolean("chestService.chestPopupEnabled");
    registerString("superMinerManager.saveState");
    registerInteger("NO_LONGER_IN_USE");
    registerInteger("chestService.totalBlackChestsOpened");
    registerInteger("worldResources[67].numOwned");
    registerBoolean("hasSeenCaveTutorial");
    registerInteger("superMinerManager.pendingSuperMiner");
    registerInteger("chestCompressorTimeStructure.level");
    registerInteger("chestCompressorSlotStructure.level");
    registerString("chestCompressor.saveState");
    registerInteger("blackChestRewardRoller.seed");
    registerInteger("wizardRoller.seed");
    registerBoolean("hasTakenSurvey");
    registerBoolean("hasOpenedPurchaseWindow");
    registerBoolean("superMinerManager.recievedInitialSuperMiner")

    console.log("Registered Save Mapping");
    isSaveMappingSet = true;
}
registerVariablesToSave();
// !!! WARNING !!! The order variables are registered in matters, do not change order of variables or saves will break !!!

// #########################################################################
// #########################################################################
// #########################################################################

function exportgame()
{
    var text = getB64SaveText();
    var cname = sids[chosen];
    prompt(_("Copy this text and keep it somewhere safe! Make sure you get all the text."), cname + "|" + utf8_to_b64(text));
}

function exportgametext()
{
    var text = getB64SaveText();
    var cname = sids[chosen];
    return "" + cname + "|" + utf8_to_b64(text);
}

function importgame()
{
    if(RSc < 3 && lgame == 0)
    {
        var importg = prompt(_("Please enter your export game save string"), '');
        importg = importg.replace(" ", "");
        importg = importg.replace("/(\r\n|\n|\r)/gm", "");
        var sect = importg.split("|");

        if(sect[0].indexOf(" ") == -1 && sect[0].indexOf("|") == -1 && sect[0].indexOf(",") == -1 && sect[0].indexOf(";") == -1 && sect[0].indexOf("_") == -1 && sect[1] !== "" && sect[1] !== null && sect[2] !== "" && sect[2] !== null && sect.length == 3)
        {
            if(RS.indexOf(sect[0] + "|") == -1)
            {
                createCookie(sect[0], sect[1] + "|" + sect[2], 30);
                createCookie("R", RS + sect[0] + "|", 30);
                RSc++;
                lgame = 1;
                if(!hasImported)
                {
                    localStorage["importedList"] = sect[0] + "|";
                }
                else
                {
                    localStorage["importedList"] = localStorage["importedList"] + sect[0] + "|";
                }
                trackGenericEvent("imported", RSc);

                location.reload();
            }
            else
            {
                alert(_("There is already a savegame with the name {0}.  Please use another.", sect[0]));
            }
        }
        else
        {
            alert(_("There is something wrong with your import code."));
        }
    }
}

// #################################################
function showImportPopup()
{
    if(RSc < 3)
    {
        showSimpleInput(_("Paste your import code below"), _("Import Game"), "", processImportCode.bind(this, isMobile()), "Exit");
    }
    else
    {
        alert(_("You have too many saves, delete one first."));
    }
}

function processImportCode(enforceSingleSave = false)
{
    var importedCode = document.getElementById("simpleInputFieldText").value;
    document.getElementById("simpleInputFieldText").value = "";
    processImport(importedCode, enforceSingleSave);
}

function processImport(importSaveData, enforceSingleSave = false)
{
    if(RSc < 3 || enforceSingleSave)
    {
        var splitCode = importSaveData.split("|");
        var cname = splitCode.splice(0, 1);
        var saveData = splitCode.join("|");

        if(saveData.length > 0 && cname != "" && (enforceSingleSave || localStorage.getItem(cname) === null) || localStorage.getItem(cname) == "")
        {
            if(b64_to_utf8(saveData).length == 0)
            {
                alert(_("Error, import code is malformed. If this code was not from Steam MrMine it will not be compatible."));
                return;
            }

            var versionInImport = b64_to_utf8(b64_to_utf8(saveData)).split("|")[9];
            if(isNaN(versionInImport))
            {
                alert(_("Error, import does not have a version number."));
                return;
            }
            else if(parseInt(versionInImport) > version)
            {
                alert(_("Error, the import version is from a newer version of the game, importing would result in loss of data. Import version: {0} Current version: {1}", versionInImport, version));
                return;
            }

            localStorage[cname] = saveData;
            if(!enforceSingleSave)
            {
                localStorage["R"] = cname + "|" + localStorage["R"];
                if(platformName() == "steam")
                {
                    getCurrentWindow().reload();
                }
                else
                {
                    location.reload();
                }
            }
            else
            {
                localStorage["R"] = cname + "|";
                window.location.reload(true);
            }
        }
        else
        {
            alert(_("You already have a save with the name {0} delete that one first", cname));
        }
    }
    else
    {
        alert(_("You have too many saves, delete one first."));
    }
}

// #################################################
// ####################### SAVE ####################
// #################################################

function createCookie(name, data, days)
{
    localStorage[name] = data;
}

function getCookie(name)
{
    return localStorage[name];
}

function savegame()
{
    if(isSimulating) return;
    if(chosen > -1)
    {
        savetime = servertime;
        var text = getB64SaveText();
        createCookie(sids[chosen], utf8_to_b64(text), 30);
        if(platform.saveLocalStorageToFile && typeof (cordova) !== "undefined")
        {
            platform.saveLocalStorageToFile();
        }
    }
}

function getB64SaveText()
{
    return utf8_to_b64(generateSaveText())
}

function showExportPopup()
{
    var text = getB64SaveText();
    var cname = sids[chosen];
    var exportCode = cname + "|" + utf8_to_b64(text);
    showSimpleInput(_("Copy your export code below"), _("Copy And Close"), exportCode, copyExportCodeAndClose, "Exit");
}

function copyExportCodeAndClose()
{
    copyTextToClipboard(document.getElementById("simpleInputFieldText").value);
    hideSimpleInput();
}


// #################################################
// ####################### LOAD ####################
// #################################################

var chosen = -1;
var sids;
var RS;
var RSc;
var saves;

loadSaves();
function loadSaves()
{
    if(localStorage["R"] !== undefined)
    {
        sids = localStorage["R"].split("|");
        saves = [];
        for(var i = 0; i < sids.length; i++)
        {
            if(sids[i] != "")
            {
                saves[i] = b64_to_utf8(b64_to_utf8(localStorage[sids[i]])).split("|");
            }
        }

        RS = localStorage["R"] !== undefined ? localStorage["R"] : "0";
        RSc = localStorage["R"] !== undefined ? localStorage["R"].split("|").length - 1 : "0";
        if(RSc > 3) {RSc = 3;}
    }
    else
    {
        sids = [];
        RS = "0";
        RSc = "0";
        saves = [];
    }
}


function loadGame(x)
{
    if(!isGameReady) return;

    if(x < RSc)
    {
        chosen = x;
        tutsection = -1;
        loadAllVariables(chosen);
        document.getElementById('WRAPPERD').style.background = 'url("Shared/Assets/UI/gui2.webp")'; document.getElementById('WRAPPERD').style.backgroundSize = '100% 100%';
        platform.playMusic();
        document.getElementById("TUTORIALD").style.visibility = "hidden"; document.getElementById("TUTORIALD").style.zIndex = -2;
        document.getElementById("TITLED").style.visibility = "hidden"; document.getElementById("TITLED").style.zIndex = -1;
        document.getElementById("TRANSIENTEFFECTSD").style.zIndex = 1;

        //Append World and UI Layers
        activeLayers["WorldLayer"] = new WorldLayer({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["Particles"] = new Particles({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["MainUILayer"] = new MainUILayer({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["Stage"] = new Stage({x: 0, y: 0, width: mainw, height: mainh});
        //activeLayers["PinnedBlueprintsLayer"] = new PinnedBlueprintsLayer({x: 0, y: 0, width: mainw, height: mainh});
        if(isMobile()) activeLayers["FooterUILayer"] = new FooterUILayer({x: 0, y: mainh - mobileFooterH, width: mobileFooterW, height: mobileFooterH});

        console.log("Seconds since last play: " + timeSinceLastPlay())
        if(timeSinceLastPlay() > 120)
        {
            if(specialUpgrades[1] > 0 || managerStructure.level > 0)
            {
                var offlineProgressResults = runOfflineProgress();
                openUi(OfflineProgress);
                getUiByName("offlineProgress").setOfflineProgressValues(offlineProgressResults);
            }
            else if(isMobile() && managerStructure.level == 0)
            {
                openUi(OfflineProgress);
            }
        }
        if(customMinerDatabaseIndex == -1 && paidForMinerName)
        {
            handleNameSubmission();
        }

        isSimulating = true;
        simulateCavesForTime(timeSinceLastPlay());
        isSimulating = false;

        updateCaveSystemSpawns();
        if(playtime > 60)
        {
            // Workaround to avoid counting initial reload due to language setting
            numGameLaunches++;
        }
        platform.onGameLoaded();
        trackEvent_LoadedGame();
        isDevUser = isDevUser || isDev();
        if(platform.domain == "armorgames")
        {
            window.parent.postMessage({
                type: "consumeAll"
            }, "https://19230.cache.armorgames.com");
        }

        if(isSteam())
        {
            updateDiscordRichPresence();
        }

        if(superMinerManager.pendingSuperMiner)
        {
            openUi(SuperMinerBlackWindow, null, superMinerManager.getSuperMinerById(superMinerManager.pendingSuperMiner));
        }

        return true;
    }
    return false;
}

// #####################################################
// ####################### DISPLAYS ####################
// #####################################################

var isFirstSession = false;
function createNewGame(name)
{
    if(name == "")
    {
        name = getFirstUnusedGameName();
    }

    if(RSc < 3 && name != "" && name != "R" && RS.indexOf(name + "|") == -1 && name.indexOf(" ") == -1 && name.indexOf("|") == -1 && name.indexOf(",") == -1 && name.indexOf(";") == -1 && name.indexOf("_") == -1)
    {
        hideDiv("NEWGAME");
        hideDiv("TITLED");
        chosen = 0; //change this to the place newgame will have
        platform.playMusic();
        if(RS != 0)
        {
            createCookie("R", RS + name + "|", 30);
        }
        else
        {
            createCookie("R", name + "|", 30);
        }
        sids[chosen] = name;
        initAvailableBlueprints();
        savegame(); //new game officially created
        newNews(_("New game started ({0})", name), true);
        document.getElementById('WRAPPERD').style.background = 'url("Shared/Assets/UI/gui2.webp")'; document.getElementById('WRAPPERD').style.backgroundSize = '100% 100%';
        document.getElementById("TRANSIENTEFFECTSD").style.zIndex = 1;

        //Append World and UI Layers
        activeLayers["WorldLayer"] = new WorldLayer({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["Particles"] = new Particles({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["MainUILayer"] = new MainUILayer({x: 0, y: 0, width: mainw, height: mainh});
        activeLayers["Stage"] = new Stage({x: 0, y: 0, width: mainw, height: mainh});
        //activeLayers["PinnedBlueprintsLayer"] = new PinnedBlueprintsLayer({x: 0, y: 0, width: mainw, height: mainh});
        //activeLayers["FooterUILayer"] = new FooterUILayer({x: 0, y: mainh * 0.95 + 1, width: mobileFooterW, height: mobileFooterH});
        testNumber = latestTestNumber;

        if(performance.now)
        {
            updateUserProperties();
            trackGenericEvent("createdGame", RSc, {"time": performance.now()});
        }
        else
        {
            updateUserProperties();
            trackGenericEvent("createdGame", RSc);
        }

        if(RSc == 0)
        {
            isFirstSession = true;
            logInstall();
        }
    }
    else
    {
        alert(_("Error, you cannot use that game name or the game may corrupt."));
    }
}

function getFirstUnusedGameName()
{
    var result = generateRandomeGameName();
    while(RS.indexOf(result + "|") != -1)
    {
        result = generateRandomeGameName();
    }
    return result;
}

function generateRandomeGameName()
{
    var adjective = adjectives[rand(0, adjectives.length - 1)];
    var noun = nouns[rand(0, nouns.length - 1)];
    return adjective.charAt(0).toUpperCase() + adjective.slice(1) + noun.charAt(0).toUpperCase() + noun.slice(1);
}

function onClickDeleteSaveSlot(x)
{
    if(x <= RSc)
    {
        pendingDeleteSlotIndex = x;
        document.getElementById("G" + x + "c").style.zIndex = 5;
    }
}

function hideDeletionConfirmationHitbox()
{
    document.getElementById("G1c").style.zIndex = -1;
    document.getElementById("G2c").style.zIndex = -1;
    document.getElementById("G3c").style.zIndex = -1;
}

function deleteGame(x)
{
    if(x < RSc)
    {
        createCookie(sids[x], "", -1);
        RS = RS.replace(sids[x] + "|", "");
        createCookie("R", RS, 30);
        sids.splice(x, 1);
        saves.splice(x, 1);
        sids[5] = "";
        saves[5] = "";
        RSc--;
    }
}

function checkUserCanSave()
{
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if(typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    if(cookieEnabled) {checks[2] = 1;}
    if(mainw >= mainh) {checks[3] = 1;}
    if(mainw > 500 && mainh > 500) {checks[5] = 1;}
    checks[6] = 1;
}

// ###################################################
// ####################### BACKUP ####################
// ###################################################

function getAllSaveNames()
{
    if(localStorage.getItem("R") != null)
    {
        var currentSaves = localStorage["R"].split("|");
        var saveNames = [];
        for(var i = 0; i < currentSaves.length; i++)
        {
            var saveName = currentSaves[i];
            if(saveName != "")
            {
                saveNames.push(saveName);
            }
        }
        return saveNames;
    }
    else
    {
        [];
    }
}

function updateBackup()
{
    if(needsFullBackup())
    {
        generateBackupOfAllSaves();
    }
}

function needsFullBackup()
{
    if(localStorage.getItem("backupDate") == null)
    {
        return true;
    }
    else if(currentTime() - parseInt(localStorage.getItem("backupDate")) > (1000 * 60 * 60 * 24))
    {
        return true;
    }
    return false;
}

function generateBackupOfAllSaves()
{
    var backupString = "";
    var currentSaves = getAllSaveNames();
    if(currentSaves == undefined || currentSaves.length == 0)
    {
        return;
    }
    for(var i = 0; i < currentSaves.length; i++)
    {
        var saveName = currentSaves[i];
        backupString += saveName + "|" + localStorage[saveName] + "|";
    }
    var compressedString = LZString.compress(backupString);
    console.log("All Saves Backed Up");

    localStorage["backup"] = compressedString;
    localStorage["backupDate"] = currentTime();

    backupSavesToCloud("longTerm");
}

//##################### STEAM CLOUD BACKUP #####################
var saveBackupFileName = "SaveBackup.txt";
var currentBackupTerm = "shortTerm";
var currentBackups = {
    "shortTerm": {},
    "longTerm": {}
};

function backupSavesToCloud(updateTerm = "shortTerm")
{
    if(!platform.isUserCloudEnabled()) return;
    currentBackupTerm = updateTerm;

    //Check steam cloud for a backup file
    //If one exists download it and save values to currentBackup variable
    downloadBackup(updateCloudBackup, updateCloudBackup);
}

function downloadBackup(onSuccessCallback = null, onErrorCallback = null)
{
    if(!platform.isUserCloudEnabled()) return;

    var onSuccess = function (saveValues)
    {
        console.log("Downloaded Backup Text");
        currentBackups = JSON.parse(saveValues);
        if(onSuccessCallback)
        {
            onSuccessCallback();
        }
    }
    var onError = function (e)
    {
        console.log("Error: " + e);
        if(onErrorCallback)
        {
            onErrorCallback();
        }
    }
    greenworks.readTextFromFile(saveBackupFileName, onSuccess, onError);
}

function updateCloudBackup()
{
    //Merge active saves with the save backups pulled from steam (if exists)
    var activeSaveNames = getAllSaveNames();
    if(activeSaveNames == undefined || activeSaveNames.length == 0)
    {
        return;
    }
    for(var i = 0; i < activeSaveNames.length; i++)
    {
        var saveName = activeSaveNames[i];
        if(currentBackups[currentBackupTerm].hasOwnProperty(saveName))
        {
            console.log("Updating Save Backup: " + saveName);
        }
        else
        {
            console.log("Adding Save To Backup: " + saveName);
        }
        currentBackups[currentBackupTerm][saveName] = saveName + "|" + localStorage[saveName];
        currentBackups[currentBackupTerm][saveName + "_time"] = currentTime();
    }
    //Instruct Steam to save this file to the cloud overwriting the existing file
    greenworks.saveTextToFile(saveBackupFileName,
        JSON.stringify(currentBackups),
        function ()
        {
            console.log("Saves (" + currentBackupTerm + ") Backed Up");
            currentBackupTerm = "shortTerm";
        },
        function (e)
        {
            console.log("ERROR! Saves (" + currentBackupTerm + ") Backed Up Failed");
            console.log("Details: " + e);
            currentBackupTerm = "shortTerm";
        }
    );
}

function displayCloudBackups()
{
    if(document.getElementById("cloudBackupsUI") == null)
    {
        var cloudBackupsUI = document.createElement("div");
        cloudBackupsUI.id = "cloudBackupsUI";
        cloudBackupsUI.style.position = "absolute";
        cloudBackupsUI.style.width = "500px";
        cloudBackupsUI.style.height = "400px";
        cloudBackupsUI.style.zIndex = 10;
        cloudBackupsUI.style.visibility = "visible";
        cloudBackupsUI.style.left = "50%";
        cloudBackupsUI.style.marginLeft = "-250px";
        cloudBackupsUI.style.top = "50%";
        cloudBackupsUI.style.marginTop = "-200px";
        cloudBackupsUI.style.border = "1px solid white";
        cloudBackupsUI.style.background = "black";
        cloudBackupsUI.style.color = "white";
        cloudBackupsUI.innerHTML = _("<center><u>Your Cloud Backups</u></center>");
        document.body.appendChild(cloudBackupsUI);

        var cloudBackupsUIExitButton = document.createElement("div");
        cloudBackupsUIExitButton.id = "cloudBackupsUIExitButton";
        cloudBackupsUIExitButton.style.position = "absolute";
        cloudBackupsUIExitButton.style.top = "0px";
        cloudBackupsUIExitButton.style.right = "0px";
        cloudBackupsUIExitButton.style.width = "25px";
        cloudBackupsUIExitButton.style.height = "25px";
        cloudBackupsUIExitButton.style.zIndex = 4;
        cloudBackupsUIExitButton.style.background = "url('Shared/Assets/UI/closei.webp') no-repeat center";
        cloudBackupsUIExitButton.style.color = "white";
        cloudBackupsUIExitButton.style.display = "block";
        cloudBackupsUIExitButton.style.padding = "0px";
        cloudBackupsUIExitButton.style.cursor = "pointer";
        cloudBackupsUIExitButton.onclick = function ()
        {
            document.getElementById("cloudBackupsUI").visibility = "hidden";
            document.body.removeChild(document.getElementById("cloudBackupsUI"));
        };
        cloudBackupsUI.appendChild(cloudBackupsUIExitButton);

        var backupOptionsHolder = document.createElement("div");
        backupOptionsHolder.id = "backupOptionsHolder";
        backupOptionsHolder.style.position = "absolute";
        backupOptionsHolder.style.top = "30px";
        backupOptionsHolder.style.left = "0px";
        backupOptionsHolder.style.width = "100%";
        backupOptionsHolder.style.height = "360px";
        backupOptionsHolder.style.overflowY = "scroll";
        backupOptionsHolder.style.zIndex = 3;
        cloudBackupsUI.appendChild(backupOptionsHolder);

        for(var key in currentBackups.shortTerm)
        {
            if(!key.includes("_time"))
            {
                addBackupEntry(key, currentBackups.shortTerm[key], currentBackups.shortTerm[key + "_time"]);
            }
        }
        for(var key in currentBackups.longTerm)
        {
            if(!key.includes("_time"))
            {
                addBackupEntry(key, currentBackups.longTerm[key], currentBackups.longTerm[key + "_time"]);
            }
        }
    }
}

function addBackupEntry(key, save, backupTime)
{
    var backupEntry = document.createElement("div");
    var entryDivId = "backupEntry_" + key + "_" + backupTime;
    backupEntry.id = entryDivId;
    backupEntry.style.width = "350px";
    backupEntry.style.height = "90px";
    backupEntry.style.padding = "0px 0px 0px 0px";
    backupEntry.style.display = "inline-block";
    backupEntry.style.marginTop = "3px";
    backupEntry.style.marginBottom = "3px";
    backupEntry.style.marginLeft = "5px";
    backupEntry.style.overflow = "hidden";
    backupEntry.style.border = "1px solid white";
    backupEntry.style.background = "#222222";
    backupEntry.style.color = "white";
    backupEntry.style.cursor = "pointer";
    backupEntry.style.opacity = 0.75;
    backupEntry.style.fontSize = "12px";
    backupEntry.onmouseover = function ()
    {
        this.style.opacity = 1;
        showTooltipForDiv(_("Click To Copy"), _("Click to copy save data which can then be used to import the game."), entryDivId);
    }
    backupEntry.onmouseout = function ()
    {
        this.style.opacity = 0.80;
        hideTooltip();
    }
    backupEntry.onclick = function ()
    {
        copyTextToClipboard(save);
        setTimeout(function () {alert(_("Save Import Text Copied To Clipboard"));}, 100);
    }

    var backupEntryDetails = document.createElement("div");
    backupEntryDetails.style.width = "340px";
    backupEntryDetails.style.height = "80px";
    backupEntryDetails.style.overflow = "hidden";
    backupEntryDetails.style.display = "inline-block";
    backupEntryDetails.style.padding = "3px 3px 3px 3px";
    var dateString = timeStampToDate(backupTime);
    var progressData = getSaveDetails(save);

    if(progressData.money.includes("e"))
    {
        var base = progressData.money.split("e")[0];
        var exponent = progressData.money.split("e")[1];
        var exponentiatedMultiplier = 10n ** BigInt(exponent);
        progressData.money = doBigIntDecimalMultiplication(exponentiatedMultiplier, base);
    }
    else if(progressData.money.includes("."))
    {
        progressData.money = progressData.money.substring(0, progressData.money.indexOf('.'));
    }

    var progressString = _("Depth") + ": " + progressData.depth + "km<br>" + _("Money") + ": " + beautifynum(BigInt(progressData.money));
    backupEntryDetails.innerHTML = key + "<br>" + progressString + "<br>" + dateString;

    var backupEntryButtons = document.createElement("div");
    backupEntryButtons.style.width = "80px";
    backupEntryButtons.style.height = "89px";
    backupEntryButtons.style.overflow = "hidden";
    backupEntryButtons.style.display = "inline-block";
    backupEntryButtons.style.padding = "1px 1px 1px 1px";
    backupEntryButtons.innerHTML = "<input type='button' style='cursor: pointer; font-size: 10px; background: url(\"Shared/Assets/UI/big_button.webp\") no-repeat scroll 0 0 transparent; border: 0px; background-size: 100% 100%; height: 34px; width: 78px; white-space: normal; word-wrap: break-word;' value='" + _('Import game') + "' onmouseover='showTooltip(\"" + _('Import game') + "\", \"\")' onmouseout='hideTooltip();' onmouseup='processImport(\"" + save + "\");'>";

    backupEntry.appendChild(backupEntryDetails);

    document.getElementById("backupOptionsHolder").appendChild(backupEntry);
    document.getElementById("backupOptionsHolder").appendChild(backupEntryButtons);
}

function onCloudSaveImportClicked(saveData)
{
    processImport(saveData);
}