// Payment/Reward types
const TRADE_TYPE_ORE = 0;
const TRADE_TYPE_MONEY = 1;
const TRADE_TYPE_CHEST = 2;
const TRADE_TYPE_BLUEPRINT = 3;
const TRADE_TYPE_RELIC = 4;
const TRADE_TYPE_BUFF = 5;

// Trade offer array indices
const TRADE_INDEX_START_TIME = 0;       // Playtime value when trade is created
const TRADE_INDEX_DURATION = 1;         // Duration for which trade is available
const TRADE_INDEX_PAYMENT_TYPE = 2;     // One of the trade types defined above
const TRADE_INDEX_PAYMENT_SUBTYPE = 3;  // Specific thing required (e.g., ore ID)
const TRADE_INDEX_PAYMENT_AMOUNT = 4;   // Required quantity of the payment type
const TRADE_INDEX_REWARD_TYPE = 5;      // One of the trade types defined above
const TRADE_INDEX_REWARD_SUBTYPE = 6;   // Specific thing awarded (blueprint ID, basic/gold chest flag, etc.)
const TRADE_INDEX_REWARD_AMOUNT = 7;    // Quantity of the reward
const TRADE_INDEX_TRADER = 8;           // Index of trader defined in traders array

const tradeConfig = {
    tradingPosts: [
        {
            depth: 15, //make sure to update the depth in structures.js if you change this value
            image: tradingPostLevel,
            unbuiltImage: tradingPostLevelBroken,
            buildingTextCoords: new ScaledPosition(.33, .053),
            playerHasSeenNewTrade: false
        },
        {
            depth: 1047, //make sure to update the depth in structures.js if you change this value
            image: lunarTradingPostLevel,
            unbuiltImage: lunarTradingPostLevelBroken,
            buildingTextCoords: new ScaledPosition(.291, .046),
            playerHasSeenNewTrade: false
        }
    ],
    duration: 1500,                     // Duration trade is available in seconds
    medianValueGain: 1.1,               // Median time saved for completing a trade (e.g., 1 hour of coal yields 2 hours of gold)
    valueSpread: .1,                   // Std dev for value gain calculation
    medianTimeBetweenTrades: 3600,      // Median time after the current trade ends that the next one will be generated
    timeBetweenTradesSpread: 3600,      // Std dev for time calculation
    minTimeForTradesAfterTimelapse: 120 // The minimum remaining time that a timelapse can reduce the duration of a trade to 
};

var tradingPostStructures = [tradingPostStructure, moonTradingPostStructure];

var totalCompletedTrades = 0;

var nextTradeTimeEarth = 0;
var earthTradeOffer1 = [];
var earthTradeOffer2 = [];

var nextTradeTimeMoon = 0;
var moonTradeOffer1 = [];
var moonTradeOffer2 = [];
var timeBetweenTradesTestMultiplier = 1;


// ##################################################################
// ##################### TRADE GENERATION ###########################
// ##################################################################

function checkForNewTrade()
{
    for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
    {
        if(depth >= tradeConfig.tradingPosts[0].depth &&
            tradingPostStructures[i].level > 0 &&
            playtime >= getNextTradeTimeForWorld(i) &&
            (!isTradeAvailable(getTradesForWorld(i)[0]) ||
                !isTradeAvailable(getTradesForWorld(i)[1]))
        )
        {
            generateTrade(i);
        }
    }
}

function getTradesForWorld(worldIndex)
{
    if(depth < tradeConfig.tradingPosts[worldIndex].depth) return [[], []];
    switch(parseInt(worldIndex))
    {
        case 0:
            return [earthTradeOffer1, earthTradeOffer2];
        case 1:
            return [moonTradeOffer1, moonTradeOffer2];
        default:
            throw "Error: No trades exist for World " + worldIndex;
    }
}

function getNextTradeTimeForWorld(worldIndex)
{
    if(depth < tradeConfig.tradingPosts[worldIndex].depth) return;
    switch(parseInt(worldIndex))
    {
        case 0:
            if(isNaN(nextTradeTimeEarth)) nextTradeTimeEarth = 0;
            return nextTradeTimeEarth;
        case 1:
            if(isNaN(nextTradeTimeMoon)) nextTradeTimeMoon = 0;
            return nextTradeTimeMoon;
        default:
            throw "Error: No trades exist for World " + worldIndex;
    }
}

function setNextTradeTimeForWorld(worldIndex, time)
{
    if(depth < tradeConfig.tradingPosts[worldIndex].depth) return;
    switch(parseInt(worldIndex))
    {
        case 0:
            nextTradeTimeEarth = time;
            break;
        case 1:
            nextTradeTimeMoon = time;
            break;
        default:
            throw "Error: No trades exist for World " + worldIndex;
    }
}

function generateTrade(worldIndex)
{
    if(worldIndex == 0 && totalCompletedTrades == 0 && playtime < 21600)
    {
        setFirstTrade();
        totalCompletedTrades++;
        return;
    }

    var traderIndex = selectTrader(worldIndex);
    var trader = traders[worldIndex][traderIndex];
    var tradeArrays = getTradesForWorld(worldIndex);
    if(!generateTradeOffer(trader, tradeArrays[0], worldIndex) ||
        isTradeAvailable(tradeArrays[0]) !== true ||
        tradeArrays[0][TRADE_INDEX_PAYMENT_AMOUNT] == 0 ||
        Number.isNaN(tradeArrays[0][TRADE_INDEX_PAYMENT_AMOUNT]) ||
        !isFinite(Number(tradeArrays[0][TRADE_INDEX_PAYMENT_AMOUNT])) ||
        tradeArrays[0][TRADE_INDEX_REWARD_AMOUNT] == 0 ||
        Number.isNaN(tradeArrays[0][TRADE_INDEX_REWARD_AMOUNT]) ||
        !isFinite(Number(tradeArrays[0][TRADE_INDEX_REWARD_AMOUNT]))
    )
    {
        // If a trade fails, clear it
        tradeArrays[0].length = 0;
        tradeArrays[1].length = 0;
        console.log("TRADE FAILED - " + traderIndex);
        // Set nextTradeTime to 0 so a new trade is generated at the next check
        setNextTradeTimeForWorld(worldIndex, 0);
        return null;
    }
    if(!generateTradeOffer(trader, tradeArrays[1], worldIndex) ||
        isTradeAvailable(tradeArrays[1]) !== true ||
        tradeArrays[1][TRADE_INDEX_PAYMENT_AMOUNT] == 0 ||
        Number.isNaN(tradeArrays[1][TRADE_INDEX_PAYMENT_AMOUNT]) ||
        !isFinite(Number(tradeArrays[1][TRADE_INDEX_PAYMENT_AMOUNT])) ||
        tradeArrays[1][TRADE_INDEX_REWARD_AMOUNT] == 0 ||
        Number.isNaN(tradeArrays[1][TRADE_INDEX_REWARD_AMOUNT]) ||
        !isFinite(Number(tradeArrays[1][TRADE_INDEX_REWARD_AMOUNT]))
    )
    {
        // If a trade fails, clear it
        tradeArrays[0].length = 0;
        tradeArrays[1].length = 0;
        console.log("TRADE FAILED - " + traderIndex);
        // Set nextTradeTime to 0 so a new trade is generated at the next check
        setNextTradeTimeForWorld(worldIndex, 0);
        return null;
    }
    tradeArrays[0][TRADE_INDEX_TRADER] = traderIndex;
    tradeArrays[1][TRADE_INDEX_TRADER] = traderIndex;
    setNextTradeTimeForWorld(
        worldIndex,
        Math.floor(
            playtime +
            tradeConfig.duration +
            getTimeBetweenTrades(worldIndex)
        )
    );
    if(depth >= tradeConfig.tradingPosts[1].depth)
    {
        newNews(_("A new trader has arrived at the {0} trading post!", worlds[worldIndex].name), true);
    }
    else
    {
        newNews(_("A new trader has arrived at the trading post!"), true);
    }
    tradeConfig.tradingPosts[worldIndex].playerHasSeenNewTrade = isTradingPostWindowShown(worldIndex) || false;
}

function getTimeBetweenTrades(worldIndex)
{
    var leveledStatsValue = tradingPostStructures[worldIndex].statValueForCurrentLevel();
    return 1500 * timeBetweenTradesTestMultiplier * (((worldIndex * 4) + 1) + (parseInt(leveledStatsValue) / 100));
}

function isTradingPostWindowShown(worldIndex)
{
    return windowState[15] == worldIndex + 1;
}

function generateTradeOffer(trader, tradeOfferArray, worldIndex)
{
    var traderPaymentInfo = selectTradePaymentType(trader, worldIndex);
    if(!traderPaymentInfo)
    {
        return null;
    }
    var traderRewardInfo = selectTradeRewardType(trader, traderPaymentInfo.paymentType, worldIndex, (traderPaymentInfo.paymentType == TRADE_TYPE_MONEY));
    if(!traderRewardInfo)
    {
        return null;
    }
    var paymentType = traderPaymentInfo.paymentType;
    var paymentSubtype = traderPaymentInfo.paymentSubtype;
    var rewardType = traderRewardInfo.rewardType;
    var rewardSubtype = traderRewardInfo.rewardSubtype;
    var tradeAmounts = determineTradeAmounts(paymentType, paymentSubtype, rewardType, rewardSubtype, worldIndex);
    if(tradeAmounts == null)
    {
        return null;
    }
    tradeOfferArray[TRADE_INDEX_START_TIME] = currentTime() / 1000;
    tradeOfferArray[TRADE_INDEX_DURATION] = getTimeBetweenTrades(worldIndex);
    tradeOfferArray[TRADE_INDEX_PAYMENT_TYPE] = paymentType;
    tradeOfferArray[TRADE_INDEX_PAYMENT_SUBTYPE] = paymentSubtype;
    tradeOfferArray[TRADE_INDEX_PAYMENT_AMOUNT] = tradeAmounts.paymentAmount;
    tradeOfferArray[TRADE_INDEX_REWARD_TYPE] = rewardType;
    tradeOfferArray[TRADE_INDEX_REWARD_SUBTYPE] = rewardSubtype;
    tradeOfferArray[TRADE_INDEX_REWARD_AMOUNT] = tradeAmounts.rewardAmount;
    return tradeOfferArray;
}

function selectTrader(worldIndex)
{
    return tradeRoller.rand(0, traders[worldIndex].length - 1);
}

function selectTradePaymentType(trader, worldIndex)
{
    var paymentTypes = [...trader.paymentTypes];
    var paymentSubtype = null;
    // Randomly select payment types until we find a valid one
    while(paymentTypes.length > 0 && paymentSubtype === null)
    {
        var paymentTypeIndex = selectWeightedRandomType(trader.paymentTypes);
        var paymentType = paymentTypes[paymentTypeIndex];
        switch(paymentType.type)
        {
            case TRADE_TYPE_ORE:
                if(!paymentType.subtypes)
                {
                    // Choose a random ore if specific ones aren't given
                    // Create a shallow copy of mineralIdsToSell
                    var paymentSubtypes = [...worlds[worldIndex].mineralIdsToSell];
                    while(paymentSubtype === null && paymentSubtypes.length > 0)
                    {
                        var randomOreIndex = tradeRoller.rand(0, paymentSubtypes.length - 1);
                        var indexOfHighestOre = paymentSubtypes.indexOf(highestOreUnlocked);
                        if(indexOfHighestOre < 0) indexOfHighestOre = paymentSubtypes.length;

                        var candidateMinerals = worlds[worldIndex].mineralIdsToSell.filter(mineral => estimateTotalMineralsMinedPerSecond()[mineral]);
                        var randomOreId = candidateMinerals[tradeRoller.rand(Math.max(0, candidateMinerals.length - 3), candidateMinerals.length - 1)];

                        if(randomOreId <= highestOreUnlocked && worldResources[randomOreId].isTradable)
                        {
                            paymentSubtype = randomOreId;
                        }
                        else
                        {
                            paymentSubtypes.splice(randomOreIndex, 1);
                        }

                    }
                    if(paymentSubtype === null)
                    {
                        paymentSubtype = worlds[worldIndex].mineralIdsToSell[tradeRoller.rand(0, 2)];
                    }
                }
                else
                {
                    // Disallow ores that the player hasn't found yet 
                    var paymentSubtypes = [...paymentType.subtypes];
                    while(paymentSubtype === null && paymentSubtypes.length > 0)
                    {
                        var randomOreIndex = selectWeightedRandomType(paymentSubtypes);
                        var randomOreId = paymentSubtypes[randomOreIndex].type;
                        if(randomOreId <= highestOreUnlocked && worldResources[randomOreId].isTradable)
                        {
                            paymentSubtype = randomOreId;
                        }
                        else
                        {
                            paymentSubtypes.splice(randomOreIndex, 1);
                        }
                    }
                }
                break;
            case TRADE_TYPE_MONEY:
                paymentSubtype = 0;
                break;
            default:
                return null;
        }
        if(paymentSubtype === null)
        {
            paymentTypes.splice(paymentTypeIndex, 1);
            paymentType = null;
        }
    }
    if(paymentType === null || paymentSubtype === null)
    {
        return null;
    }
    return {
        "paymentType": paymentType.type,
        "paymentSubtype": paymentSubtype
    }
}

function selectTradeRewardType(trader, paymentType, worldIndex, disallowMoney = false)
{
    var rewardTypes = [...trader.rewardTypes];
    var rewardSubtype = null;
    // Randomly select reward types until we find a valid one
    while(rewardTypes.length > 0 && rewardSubtype === null)
    {
        var rewardTypeIndex = selectWeightedRandomType(rewardTypes);
        var rewardType = rewardTypes[rewardTypeIndex];
        if(!disallowMoney || rewardType.type != TRADE_TYPE_MONEY)
        {
            switch(rewardType.type)
            {
                // Handle special cases where subtypes are defined elsewhere
                case TRADE_TYPE_BLUEPRINT:
                    if(paymentType != TRADE_TYPE_ORE)
                    {
                        rewardSubtype = rollForBlueprint();
                    }
                    break;
                case TRADE_TYPE_RELIC:
                    if(hasUnlockedScientists)
                    {
                        rewardSubtype = rollForRelic();
                    }
                    break;
                case TRADE_TYPE_CHEST:
                    var goldenChestChance = Math.round(1580 * STAT.goldChestSpawnFrequencyMultiplier()); //1 in 158
                    rewardSubtype = (tradeRoller.rand(0, goldenChestChance) <= 10) ? 1 : 0;
                    break;
                case TRADE_TYPE_BUFF:
                    var buffId = buffs.getChestAndTradeBuffs()[tradeRoller.rand(0, buffs.getChestAndTradeBuffs().length - 1)].id;
                    rewardSubtype = buffId;
                    break;
                case TRADE_TYPE_ORE:
                    if(!rewardType.subtypes)
                    {
                        // Choose a random ore if specific ones aren't given
                        // Create a shallow copy of mineralIdsToSell
                        var rewardSubtypes = [...worlds[worldIndex].mineralIdsToSell];
                        while(rewardSubtype === null && rewardSubtypes.length > 0)
                        {
                            var randomOreIndex = tradeRoller.rand(0, rewardSubtypes.length - 1);
                            var randomOreId = rewardSubtypes[randomOreIndex];
                            if(randomOreId <= highestOreUnlocked && worldResources[randomOreId].isTradable)
                            {
                                rewardSubtype = randomOreId;
                            }
                            else
                            {
                                rewardSubtypes.splice(randomOreIndex, 1);
                            }
                        }
                        if(rewardSubtype === null)
                        {
                            rewardSubtype = worlds[worldIndex].mineralIdsToSell[tradeRoller.rand(0, 2)];
                        }
                    }
                    else
                    {
                        // Disallow ores that the player hasn't found yet 
                        var rewardSubtypes = [...rewardType.subtypes];
                        while(rewardSubtype === null && rewardSubtypes.length > 0)
                        {
                            var randomOreIndex = selectWeightedRandomType(rewardSubtypes);
                            if(rewardSubtypes[randomOreIndex].type <= highestOreUnlocked)
                            {
                                rewardSubtype = rewardSubtypes[randomOreIndex].type;
                            }
                            else
                            {
                                rewardSubtypes.splice(randomOreIndex, 1);
                            }
                        }
                    }
                    break;
                case TRADE_TYPE_MONEY:
                    rewardSubtype = 0;
                    break;
                default:
                    return null;
            }
        }
        if(rewardSubtype === null)
        {
            rewardTypes.splice(rewardTypeIndex, 1);
            rewardType = null;
        }
    }
    if(rewardType === null || rewardSubtype === null)
    {
        return null;
    }
    return {
        "rewardType": rewardType.type,
        "rewardSubtype": rewardSubtype
    }
}

function rollForRelic()
{
    var possibleRelics = [];
    for(rewardId in excavationRewards)
    {
        if(excavationRewards[rewardId].isRelic && excavationRewards[rewardId].isCandidateFunction())
        {
            possibleRelics.push(rewardId);
        }
    }
    possibleRelics.sort(function (a, b) {return excavationRewards[a].rarity - excavationRewards[b].rarity;});
    var rand = Math.random(); // Need better distribution
    for(var i = 0; i < possibleRelics.length - 1; ++i)
    {
        if(excavationRewards[possibleRelics[i + 1]].rarity > rand)
        {
            return possibleRelics[i];
        }
    }
    return possibleRelics[i];
}

function rollForBlueprint()
{
    var possibleBlueprints = [];
    var currentLevel;
    for(var blueprintIndex = drillBlueprints.length - 1; blueprintIndex >= 0; --blueprintIndex)
    {
        // Find the last owned blueprint
        var blueprintId = drillBlueprints[blueprintIndex].id;
        if(isBlueprintKnown(1, blueprintId))
        {
            currentLevel = getDrillEquipByBlueprintId(blueprintId).level;
            break;
        }
    }
    for(blueprintIndex = 0; blueprintIndex < drillBlueprints.length; ++blueprintIndex)
    {
        // Select any unowned blueprints in the same tier as the last owned blueprint
        // Plus all blueprints in the next tier
        var blueprintId = drillBlueprints[blueprintIndex].id;
        if(!isBlueprintKnown(1, blueprintId) &&
            !drillBlueprints[blueprintIndex].isFromShop &&
            (getDrillEquipByBlueprintId(blueprintId).level == currentLevel ||
                getDrillEquipByBlueprintId(blueprintId).level == currentLevel + 1))
        {
            possibleBlueprints.push(blueprintIndex);
        }
        else if(getDrillEquipByBlueprintId(blueprintId).level > currentLevel + 1)
        {
            break;
        }
    }
    if(possibleBlueprints.length == 0)
    {
        return null;
    }
    var rewardBlueprintIndex = tradeRoller.rand(0, possibleBlueprints.length - 1);
    return possibleBlueprints[rewardBlueprintIndex];
}

// ##################################################################
// ######################## TRADE VALUATION #########################
// ##################################################################

function determineTradeAmounts(paymentType, paymentSubtype, rewardType, rewardSubtype, worldIndex)
{
    var paymentTimeValue, rewardTimeValue;
    var paymentAmount, rewardAmount;
    var leveledStatsValue = tradingPostStructures[worldIndex].statValueForCurrentLevel();
    var medianValue = tradeConfig.medianValueGain + (parseInt(leveledStatsValue) / 100);
    var stdValue = tradeConfig.valueSpread + (parseInt(leveledStatsValue) / 100);
    var valueGain = gaussianRand(medianValue, stdValue);
    if(rewardType == TRADE_TYPE_CHEST || rewardType == TRADE_TYPE_BLUEPRINT ||
        rewardType == TRADE_TYPE_BUFF || rewardType == TRADE_TYPE_RELIC)
    {
        rewardTimeValue = determineTimeValueOfTradeType(rewardType, rewardSubtype);
        paymentTimeValue = doBigIntDecimalMultiplication(rewardTimeValue, 1 / valueGain);
        if(rewardType == TRADE_TYPE_BLUEPRINT)
        {
            var blueprintPrice = craftingBlueprints[1][rewardSubtype].price;
            paymentTimeValue = parseInt(getMoneyBasedTimeValue(paymentTimeValue, valueGain, blueprintPrice, 1n));
        }
    }
    else
    {
        paymentTimeValue = determineTimeValueOfTradeType(paymentType, paymentSubtype);
        rewardTimeValue = doBigIntDecimalMultiplication(paymentTimeValue, valueGain);
    }
    paymentAmount = calculateAmountOfTradeType(paymentType, paymentSubtype, paymentTimeValue, true, rewardType, rewardSubtype);
    rewardAmount = calculateAmountOfTradeType(rewardType, rewardSubtype, rewardTimeValue, false, paymentType, paymentSubtype, paymentAmount);
    if(paymentAmount <= 0 || rewardAmount <= 0)
    {
        return null;
    }

    return {
        paymentAmount: paymentAmount,
        rewardAmount: rewardAmount
    };
}

function getMoneyBasedTimeValue(paymentTimeValue, valueGain, rewardSubtypeValue, valueFraction)
{
    var value1 = valueOfMineralsPerSecond() * doBigIntDecimalMultiplication(paymentTimeValue, 1 / valueGain);
    var value2 = rewardSubtypeValue * valueFraction;
    var value3 = bigIntMax(money + getValueOfMinerals(), BigInt(value2)) / 2n;
    var minValue = bigIntMin(value1, value2, value3);
    var maxValue = bigIntMax(value1, value2, value3);
    var middleValue = value1 + value2 + value3 - minValue - maxValue;
    var timeValue = tradeRoller.randBigInt(middleValue, maxValue) / valueOfMineralsPerSecond();
    return timeValue;
}

function determineTimeValueOfTradeType(tradeType, tradeSubtypeIndex = null)
{
    // "Time Value" refers to the amount of time the player must invest to collect the payment amount
    // For example, a player is expected to save 1 hr of coal to get 1 hr of gold,
    // But only 10 minutes of coal to get a basic chest
    var resultTimeValue = 0n;
    switch(tradeType)
    {
        case TRADE_TYPE_ORE:
            resultTimeValue = 3600n;
            break;
        case TRADE_TYPE_CHEST:
            if(tradeSubtypeIndex == 0)
            {
                // Basic chest
                resultTimeValue = 600n;
            }
            else
            {
                // Gold chest
                resultTimeValue = 7200n;
            }
            break;
        case TRADE_TYPE_MONEY:
            resultTimeValue = 3600n;
            break;
        case TRADE_TYPE_BLUEPRINT:
            resultTimeValue = 14400n;
            break;
        case TRADE_TYPE_BUFF:
            resultTimeValue = 900n;
            break;
        case TRADE_TYPE_RELIC:
            if(tradeSubtypeIndex)
            {
                resultTimeValue = doBigIntDecimalMultiplication(36000n, Math.pow(excavationRewards[tradeSubtypeIndex].rarity, 2.5));
            }
            break;
        default:
            throw "Invalid trade type";
    }

    if(resultTimeValue > playtime / 2)
    {
        return BigInt(parseInt(playtime / 2));
    }
    return resultTimeValue;
}

function calculateAmountOfTradeType(tradeType, tradeSubtype, timeValue, isPayment, otherType = null, otherSubtype = null, otherAmount = null)
{
    timeValue = parseInt(timeValue);
    otherAmount = parseInt(otherAmount);
    switch(tradeType)
    {
        case TRADE_TYPE_CHEST:
            return 1n;
        case TRADE_TYPE_BLUEPRINT:
            return 1n;
        case TRADE_TYPE_BUFF:
            return 1n;
        case TRADE_TYPE_RELIC:
            return 1n;
        case TRADE_TYPE_ORE:
            if(!isPayment && otherType == TRADE_TYPE_MONEY)
            {
                return (valueOfMineralsPerSecond() * BigInt(timeValue)) / worldResources[tradeSubtype].sellValue;
            }
            else if(!isPayment && otherType == TRADE_TYPE_ORE)
            {
                var otherValue = BigInt(timeValue) * valueOfMineralsPerSecond();
                var quantity = otherValue / worldResources[tradeSubtype].sellValue;
                if(quantity <= 0n) quantity = 1n;
                return quantity;
            }
            else if(isPayment && otherType == TRADE_TYPE_RELIC)
            {
                var otherValue = BigInt(timeValue) * valueOfMineralsPerSecond();
                var quantity = otherValue / worldResources[tradeSubtype].sellValue;
                if(quantity <= 0n) quantity = 1n;
                return quantity;
            }
            else
            {
                let time = Math.max(1, timeValue);
                let mineral = Math.max(1, estimateTotalMineralsMinedPerSecond()[tradeSubtype]);
                //console.log(`time ${time} | mineral ${mineral} | subtype ${worldResources[tradeSubtype].name}`);
                return doBigIntDecimalMultiplication(BigInt(time), mineral);
            }
        case TRADE_TYPE_MONEY:
            return valueOfMineralsPerSecond() * BigInt(timeValue);
        default:
            throw "Invalid trade type";
    }
}

// ##################################################################
// ################## TRADE INTERFACE FUNCTIONALITY #################
// ##################################################################

function isTradeAvailable(tradeOffer)
{
    return tradeOffer.length > 0 &&
        tradeOffer[TRADE_INDEX_START_TIME] &&
        tradeOffer[TRADE_INDEX_START_TIME] + tradeOffer[TRADE_INDEX_DURATION] > currentTime() / 1000;
}

function canMakeTrade(tradeOffer, showMessageOnFail = false)
{
    var canMakeTrade, message;
    if(tradeOffer[TRADE_INDEX_PAYMENT_TYPE] == TRADE_TYPE_ORE)
    {
        canMakeTrade = isTradeAvailable(tradeOffer) &&
            worldResources[tradeOffer[TRADE_INDEX_PAYMENT_SUBTYPE]].numOwned >= tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT];
        message = _("You can't afford that trade.");
    }
    else if(tradeOffer[TRADE_INDEX_PAYMENT_TYPE] == TRADE_TYPE_MONEY)
    {
        canMakeTrade = isTradeAvailable(tradeOffer) &&
            money >= tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT];
        message = _("You can't afford that trade.");
    }

    if(canMakeTrade && tradeOffer[TRADE_INDEX_REWARD_TYPE] == TRADE_TYPE_RELIC)
    {
        if(isRelicInventoryFull())
        {
            canMakeTrade = false;
            message = _("You can't make that trade because your relic inventory is full.");
        }
    }

    if(!canMakeTrade && showMessageOnFail && !isSimulating)
    {
        newNews(_(message));
    }
    return canMakeTrade;
}

function makeTrade(worldIndex, tradeOffer)
{
    if(!canMakeTrade(tradeOffer, true))
    {
        return false;
    }
    if(tradeOffer[TRADE_INDEX_PAYMENT_TYPE] == TRADE_TYPE_ORE)
    {
        worldResources[tradeOffer[TRADE_INDEX_PAYMENT_SUBTYPE]].numOwned -= parseInt(tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]);
    }
    else if(tradeOffer[TRADE_INDEX_PAYMENT_TYPE] == TRADE_TYPE_MONEY)
    {
        subtractMoney(tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]);
    }
    switch(tradeOffer[TRADE_INDEX_REWARD_TYPE])
    {
        case TRADE_TYPE_ORE:
            worldResources[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].numOwned += parseInt(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]);
            let value = BigInt(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]) * worldResources[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].sellValue;
            trackEvent_GainedMoney(value, 4, true);
            break;
        case TRADE_TYPE_MONEY:
            addMoney(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]);
            trackEvent_GainedMoney(tradeOffer[TRADE_INDEX_REWARD_AMOUNT], 4);
            break;
        case TRADE_TYPE_CHEST: // grant chest function
            if(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE])
            {
                openGoldChest();
            }
            else
            {
                openBasicChest();
            }
            break;
        case TRADE_TYPE_RELIC:
            equipRelic(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]);
            break;
        case TRADE_TYPE_BUFF:
            //AO: This is jank as hell, fix this later

            let buff = buffs.staticBuffs[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]];

            if(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE] != 6)
            {
                buffs.startBuff(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE], 600, "trade", 50);
            }
            else
            {
                buffs.startBuff(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE], 30, "trade", 50);
            }
            break;
        case TRADE_TYPE_BLUEPRINT:
            learnBlueprint(1, tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]);
            break;
        default:
            return false;
    }
    //tradingpostui(0);
    var tradeStrings = generateTradeOfferStrings(tradeOffer);
    newNews(_("You traded {0} for {1}", tradeStrings.paymentString, tradeStrings.rewardString), true);
    if(!mutebuttons)
    {
        tradeAudio.play();
    }
    var trades = getTradesForWorld(worldIndex);
    trades[0].length = 0;
    trades[1].length = 0;
    totalCompletedTrades++

    // Reset next trade time on completion so that prolonged trades don't negatively affect the time between trades
    setNextTradeTimeForWorld(
        worldIndex,
        Math.floor(
            playtime +
            getTimeBetweenTrades(worldIndex)
        )
    );
    return true;
}

function generateTradeOfferStrings(tradeOffer)
{
    var paymentString, rewardString;
    var paymentValueString = "";
    var rewardValueString = "";
    switch(tradeOffer[TRADE_INDEX_PAYMENT_TYPE])
    {
        case TRADE_TYPE_MONEY:
            paymentString = "$" + beautifynum(tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]).toLowerCase();
            paymentValueString = "$" + beautifynum(tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]);
            break;
        case TRADE_TYPE_ORE:
            paymentString = beautifynum(tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]).toLowerCase() + " " + worldResources[tradeOffer[TRADE_INDEX_PAYMENT_SUBTYPE]].name;
            paymentValueString = "$" + beautifynum(worldResources[tradeOffer[TRADE_INDEX_PAYMENT_SUBTYPE]].sellValue * tradeOffer[TRADE_INDEX_PAYMENT_AMOUNT]);
            break;
    }
    switch(tradeOffer[TRADE_INDEX_REWARD_TYPE])
    {
        case TRADE_TYPE_MONEY:
            rewardString = "$" + beautifynum(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]).toLowerCase();
            rewardValueString = "$" + beautifynum(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]);
            break;
        case TRADE_TYPE_ORE:
            rewardString = beautifynum(tradeOffer[TRADE_INDEX_REWARD_AMOUNT]).toLowerCase() + " " + worldResources[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].name;
            rewardValueString = "$" + beautifynum(worldResources[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].sellValue * tradeOffer[TRADE_INDEX_REWARD_AMOUNT]);
            break;
        case TRADE_TYPE_CHEST:
            if(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE] == 0)
            {
                rewardString = _("Basic Chest");
            }
            else
            {
                rewardString = _("Gold Chest");
            }
            rewardValueString = _("Unknown");
            break;
        case TRADE_TYPE_BLUEPRINT:
            var blueprintReward = getDrillEquipByBlueprintId(tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]).translatedName;
            var article = "";//getIndefiniteArticleForString(blueprintReward);
            rewardString = article + blueprintReward + " Blueprint";
            rewardValueString = _("Unknown");
            break;
        case TRADE_TYPE_RELIC:
            var relicReward = excavationRewards[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].name;
            var article = "";//getIndefiniteArticleForString(relicReward);
            rewardString = article + relicReward;
            rewardValueString = _("Unknown");
            break;
        case TRADE_TYPE_BUFF:
            var buffReward = buffs.staticBuffs[tradeOffer[TRADE_INDEX_REWARD_SUBTYPE]].name;
            var article = "";//getIndefiniteArticleForString(buffReward);
            rewardString = article + buffReward + " buff";
            rewardValueString = _("Unknown");
            break;
    }
    // paymentString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur, sem vitae consequat placerat, erat lacus.";
    // rewardString = paymentString;
    return {
        paymentString: paymentString,
        rewardString: rewardString,
        paymentValueString: paymentValueString,
        rewardValueString: rewardValueString
    };
}

function handleTradeTimelapse(timeInMinutes)
{
    for(var i = 0; i < tradeConfig.tradingPosts.length; ++i)
    {
        var trades = getTradesForWorld(i);
        if(trades[0].length > 0)
        {
            var startTime = trades[0][TRADE_INDEX_START_TIME];
            var duration = trades[0][TRADE_INDEX_DURATION];
            var remainingTime = duration - ((currentTime() / 1000) - startTime);
            var timeInSeconds = timeInMinutes * 60;
            // Ensure that the timelapse doesn't reduce the remaining time below minTimeForTradesAfterTimelapse
            if(isSimulating || remainingTime > tradeConfig.minTimeForTradesAfterTimelapse)
            {
                if(!isSimulating && remainingTime - timeInSeconds < tradeConfig.minTimeForTradesAfterTimelapse) 
                {
                    timeInSeconds = (remainingTime - tradeConfig.minTimeForTradesAfterTimelapse);
                }
                trades[0][TRADE_INDEX_START_TIME] -= timeInSeconds;
                trades[1][TRADE_INDEX_START_TIME] -= timeInSeconds;
            }
        }
        var nextTradeTime = getNextTradeTimeForWorld(i);
        setNextTradeTimeForWorld(i, nextTradeTime - timeInMinutes * 60);
    }
}

function extendTradeDuration(worldIndex, additionalSeconds)
{
    var tradeArrays = getTradesForWorld(worldIndex);
    for(var i in tradeArrays)
    {
        tradeArrays[i][TRADE_INDEX_DURATION] += additionalSeconds;
    }
    setNextTradeTimeForWorld(worldIndex, getNextTradeTimeForWorld(worldIndex) + additionalSeconds);
}

function setFirstTrade()
{
    var traderIndex = 2; //Red Jack Cowboy
    var tradeArrays = getTradesForWorld(0);

    tradeArrays[0][TRADE_INDEX_TRADER] = traderIndex;
    tradeArrays[0][TRADE_INDEX_START_TIME] = currentTime() / 1000;
    tradeArrays[0][TRADE_INDEX_DURATION] = tradeConfig.duration;
    tradeArrays[0][TRADE_INDEX_PAYMENT_TYPE] = TRADE_TYPE_ORE;
    tradeArrays[0][TRADE_INDEX_PAYMENT_SUBTYPE] = COAL_INDEX;
    tradeArrays[0][TRADE_INDEX_PAYMENT_AMOUNT] = 1000n;
    tradeArrays[0][TRADE_INDEX_REWARD_TYPE] = TRADE_TYPE_ORE;
    tradeArrays[0][TRADE_INDEX_REWARD_SUBTYPE] = GOLD_INDEX;
    tradeArrays[0][TRADE_INDEX_REWARD_AMOUNT] = 20n;

    tradeArrays[1][TRADE_INDEX_TRADER] = traderIndex;
    tradeArrays[1][TRADE_INDEX_START_TIME] = currentTime() / 1000;
    tradeArrays[1][TRADE_INDEX_DURATION] = tradeConfig.duration;
    tradeArrays[1][TRADE_INDEX_PAYMENT_TYPE] = TRADE_TYPE_ORE;
    tradeArrays[1][TRADE_INDEX_PAYMENT_SUBTYPE] = COPPER_INDEX;
    tradeArrays[1][TRADE_INDEX_PAYMENT_AMOUNT] = 2000n;
    tradeArrays[1][TRADE_INDEX_REWARD_TYPE] = TRADE_TYPE_CHEST;
    tradeArrays[1][TRADE_INDEX_REWARD_SUBTYPE] = 0;
    tradeArrays[1][TRADE_INDEX_REWARD_AMOUNT] = 1n;


    setNextTradeTimeForWorld(
        0,
        Math.floor(
            playtime +
            tradeConfig.duration +
            getTimeBetweenTrades(EARTH_INDEX)
        )
    );
}

// ##################################################################
// ###################### UTILITY FUNCTIONS #########################
// ##################################################################

function selectWeightedRandomType(typesFromTrader)
{
    var probabilitySum = 0;
    for(var i in typesFromTrader)
    {
        probabilitySum += typesFromTrader[i].probability;
    }
    var random = Math.random();
    var runningTotal = 0;
    for(var i in typesFromTrader)
    {
        runningTotal += typesFromTrader[i].probability / probabilitySum;
        if(random <= runningTotal)
        {
            return i;
        }
    }
    return null;
}

function getTraderImage(worldIndex, traderIndex)
{
    var traderBlinkPeriod = CHARACTER_BLINK_PERIOD;
    var trader = traders[worldIndex][traderIndex];
    if(trader.blinkPortrait && (numFramesRendered + traderIndex) % traderBlinkPeriod <= 1)
    {
        return trader.blinkPortrait;
    }
    return trader.portrait;
}

// ##################################################################
// ##################### TRADERS DEFINITION #########################
// ##################################################################

var traders = [
    [
        {
            "id": 0,
            "name": "Dennis",
            "portrait": trader1,
            "blinkPortrait": null,
            "introDialogue": [
                _("Hmmmm yes let's see, what have you got there?"),
                _("This looks to be a rare specimen. I shall have to add it to my collection."),
                _("My collection is nearing completion can you help me?")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1,
                    subtypes: [
                        {type: 1, probability: 1},
                        {type: 2, probability: 1},
                        {type: 3, probability: 1},
                        {type: 4, probability: 2},
                        {type: 5, probability: 2},
                        {type: 6, probability: 2},
                        {type: 7, probability: 2},
                        {type: 8, probability: 3},
                        {type: 9, probability: 3},
                        {type: 10, probability: 3},
                        {type: 11, probability: 3},
                        {type: 12, probability: 3},
                        {type: 13, probability: 4},
                        {type: 14, probability: 4},
                        {type: 15, probability: 4},
                        {type: 16, probability: 4},
                        {type: 17, probability: 4},
                        {type: 18, probability: 5},
                        {type: 19, probability: 5},
                        {type: 20, probability: 5},
                    ]
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 1,
            "name": "Cornelius",
            "portrait": trader2,
            "blinkPortrait": null,
            "introDialogue": [
                _("Ooooh what have we here?"),
                _("I need specimens for my research. You have something to sell me, yes?"),
                _("I'm nearly done with my research, but I'm missing something. Would you be willing to trade?")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 2,
            "name": "Red Jack",
            "portrait": trader3,
            "blinkPortrait": trader3_blink,
            "introDialogue": [
                _("Well shoot! Hang me up and put a diaper on me, it's a traveler! Wanna trade?"),
                _("Ooh boy, we got a live one here! Need any sundries? I'm willing to trade anything."),
                _("Howdy partner! Ol' Sally says I best be getting rid of this stuff now."),
                _("Aint here to give ya'll a tear squeezer but I'm 'bout darn near down to the blanket."),
                _("'bout Yee'd my last Haw partner, just trying to sell some goods and settle down."),
                _("Ain't here to be jawing around, either you buying or you ain't.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1,
                    subtypes: [
                        {type: 3, probability: 1},
                        {type: 4, probability: 2},
                        {type: 6, probability: 0.5},
                    ]
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 3,
            "name": "Humphrey",
            "portrait": trader4,
            "blinkPortrait": trader4_blink,
            "introDialogue": [
                _("Hello old chap. Would you mind trading a few things with this footsore trader?"),
                _("Golly, I haven't seen anyone for days down here. I have some excellent wares for sale."),
                _("This mine is looking mighty spiffy, old chap. I'd be willing to trade for something"),
                _("Gee willikers, I've been looking for that. Would be interested in trading?")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 4,
            "name": "Karen",
            "portrait": trader5,
            "blinkPortrait": trader5_blink,
            "introDialogue": [
                _("Excuse me! Hello!! I lost my lipstick and I can't find it. One of your workers stole it and I need it back, like NOW."),
                _("Can you keep it down? We've gotten a few complaints from nearby mines."),
                _("Hey! We're doing a fund raiser are you interested in any of this garbage?"),
                _("You need to add more grass.  This place is a nightmare."),
                _("Can you hurry up and make up your mind on whether you want this? I have places to go."),
                _("I am very important, please don't waste my time."),
                _("Where is your manager!? This is horrible service.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 5,
            "name": "Sylvia",
            "portrait": trader6,
            "blinkPortrait": trader6_blink,
            "introDialogue": [
                _("Hi! All these big miner men have nothing but talk. I got the real stuff here."),
                _("Don't listen to anyone else now, honey. I promise to give you the best prices."),
                _("I am the real deal. You better treat me right if you want to do future business.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 6,
            "name": "Skeeter",
            "portrait": trader7,
            "blinkPortrait": trader7_blink,
            "introDialogue": [
                _("Wha? Why is it so dark here? I think I fell through a hole but I can't remember."),
                _("I got some rocks, I got some rocks. You, uh, need them? I'm desperate man!"),
                _("Come on man, stop looking so hard. I swear it's legit, just buy it already"),
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 7,
            "name": "Kai",
            "portrait": trader8,
            "blinkPortrait": trader8_blink,
            "introDialogue": [
                _("Yep, yep this be the best mine ever. Can't beat this scenery."),
                _("You got a kleenex? This dust is making me...achoo!"),
                _("Ahh bro this mine is the dopest. Mind if I trade you for a souvenir?")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 8,
            "name": "Ivan",
            "portrait": trader9,
            "blinkPortrait": null,
            "introDialogue": [
                _("Welcome! I've got a few items you may want.  Perhaps a trade?"),
                _("I have come from very far and have things of great value."),
                _("I see those bags you're carrying are heavy. Maybe we can come to an arrangement?"),
                _("You sure these are legitimate? You will not sneak one past me!")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 9,
            "name": "Hex",
            "portrait": trader10,
            "blinkPortrait": trader10_blink,
            "introDialogue": [
                _("Hey yo, you got any 'special gems' know what I mean?"),
                _("I need more gold for my grill. It's only half done you know. Chicks dig that golden smile.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50,
                    subtypes: [
                        {type: 4, probability: 1},
                    ]
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 10,
            "name": "Bala",
            "portrait": trader11,
            "blinkPortrait": trader11_blink,
            "introDialogue": [
                _("Harumph.  Quickly now, I don't have much time."),
                _("I hate being down here in these mines. My beard gets dirt in it and I can never get it out."),
                _("There are mysteries below this earth you would never believe. I will not speak of them.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 11,
            "name": "Lil' Lila",
            "portrait": trader12,
            "blinkPortrait": trader12_blink,
            "introDialogue": [
                _("Hiya! Aren't these gems so pretty? Oh I just love all the colors and shapes!"),
                _("I can't wait to see what you have for me!! I'm sure you have something good right?"),
                _("Oh boy! Oh Boy! What do you have for me today darling?")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 12,
            "name": "Gus",
            "portrait": trader13,
            "blinkPortrait": trader13_blink,
            "introDialogue": [
                _("I only trade in the finest materials. Don't waste my time."),
                _("Let me inspect that. I must make sure it is real first."),
                _("I'm looking for quality. Either you have it or you don't.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 13,
            "name": "Yarmouth",
            "portrait": trader14,
            "blinkPortrait": trader14_blink,
            "introDialogue": [
                _("Whatcha doing down here? You come here for the rocks too?"),
                _("Be careful when you test the rocks. I've broken a lot of teeth heehee."),
                _("I don't know about you, but I love rooting around in the dirt. So many treasures to be had.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 14,
            "name": "Maynard",
            "portrait": trader15,
            "blinkPortrait": trader15_blink,
            "introDialogue": [
                _("Errr... I dunno maybe I got a few minerals in my pockets."),
                _("What do ya know? I found a rock here under my foot ... It's a red diamond you say? Guess it's my lucky day!"),
                _("I found this all by myself! Want to trade?"),
                _("I always wanted to be a dancer but they said I was naturally too stinky."),
                _("If I strike it rich I am going to get the nicest haircut.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 15,
            "name": _("Granny G"),
            "portrait": trader17,
            "blinkPortrait": trader17_blink,
            "introDialogue": [
                _("Give granny something nice."),
                _("Come give granny a little kiss."),
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 50
                },
                {
                    type: TRADE_TYPE_ORE,
                    probability: 50
                }
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        }
    ],
    [
        {
            "id": 0,
            "name": "French Fry",
            "portrait": moonTrader1,
            "blinkPortrait": moonTrader1_blink,
            "introDialogue": [
                _("Me and King have the best prices. We have the only prices."),
                _("Ever since we settled here we've become insanely wealthy. All it took was a little monopoly."),
                _("Monopoly profits are the best profits."),
                _("Our business is our business, you better stay out of it if you know what's good for you.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
        {
            "id": 1,
            "name": "King Coal",
            "portrait": moonTrader2,
            "blinkPortrait": moonTrader2_blink,
            "introDialogue": [
                _("Hi there Ol' Chap. You won't find a better price here. We are the only shop in town."),
                _("Nobody will move in on our territory, Nuggz makes sure of that."),
                _("Sure you can cry about the prices but there are no laws here."),
                _("There used to be three of us but Nuggz wanted an extra 16%."),
                _("We are not a monopoly, the other traders are just out of town.")
            ],
            "paymentTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
            ],
            "rewardTypes": [
                {
                    type: TRADE_TYPE_ORE,
                    probability: 1
                },
                {
                    type: TRADE_TYPE_MONEY,
                    probability: 1,
                },
                {
                    type: TRADE_TYPE_BLUEPRINT,
                    probability: 0.1,
                },
                {
                    type: TRADE_TYPE_CHEST,
                    probability: 0.5,
                },
                {
                    type: TRADE_TYPE_BUFF,
                    probability: 0.15,
                },
                {
                    type: TRADE_TYPE_RELIC,
                    probability: 0.1,
                }
            ]
        },
    ]
];