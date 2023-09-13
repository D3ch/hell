// ####################################################
// #################### SCIENTISTS ####################
// ####################################################
var highestLevelScientist = 0;
var deadScientists = 0;
var numExcavationsCompleted = 0;
var numScientistsSacrificed = 0;

//Constants
const START_EXP_FIRST_LEVEL = 120;
const DIFFICULTY_INCREASE_PER_LEVEL = 1.045;

//Randomly sample the quest rewards using the skewed random number from below choosing the number out of some amt of selections (based on quest duration * level) that is closest to the skewed random number
var excavationRewards = [
    {"id": 0, "name": _("Endless Miner Speed Potion"), "statType": MINER_SPEED_MULTIPLIER, "amount": 6, "image": speedPotion1, "rarity": .55, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [33, 25, 18, 12], "renderFunction": standardRelicRenderFunction, "warpId": 54, "divineId": 87, "hasRewardScaling": false},
    {"id": 1, "name": _("Golden Shovel"), "statType": SELL_PRICE_MULTIPLIER, "amount": 6, "image": goldShovel, "rarity": .56, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [38, 19], "renderFunction": standardRelicRenderFunction, "warpId": 55, "divineId": 88, "hasRewardScaling": false},
    {"id": 2, "name": _("Key of Luck"), "statType": CHEST_SPAWN_FREQUENCY, "amount": 5, "image": whiteKey, "rarity": .71, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [29, 13], "renderFunction": standardRelicRenderFunction, "warpId": 56, "divineId": 89, "hasRewardScaling": false},
    {"id": 3, "name": _("Sword of War"), "statType": BATTLE_DAMAGE_MULTIPLIER, "amount": 5, "image": goldSword, "rarity": .5, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [22, 21], "renderFunction": standardRelicRenderFunction, "warpId": 57, "divineId": 90, "hasRewardScaling": false},
    {"id": 4, "name": _("Basic Treasure Chest"), "description": _("Basic Treasure Chest"), "image": basicChest, "rarity": .10, "isRelic": false, "grantFunction": openBasicChest, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 5, "name": _("Golden Treasure Chest"), "description": _("Gold Treasure Chest"), "image": goldChest, "rarity": .92, "isRelic": false, "grantFunction": openGoldChest, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 6, "name": _("2x Tickets"), "description": _("2 Tickets"), "image": ticketicon, "rarity": .67, "isRelic": false, "grantFunction": function () {tickets += 2;}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 7, "name": _("Large bag of money"), "description": _("{0} minutes worth of money"), "image": goldBag, "rarity": .35, "isRelic": false, "grantFunction": function () {return {"function": grantMoneyMinutes, "baseReward": 15}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 8, "name": _("Small bag of money"), "description": _("{0} minutes worth of money"), "image": brownBag, "rarity": .10, "isRelic": false, "grantFunction": function () {return {"function": grantMoneyMinutes, "baseReward": 4}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 9, "name": _("Big Cheese"), "description": _("Double all current minerals in inventory (capped at 2x capacity)"), "image": cheese, "rarity": .94, "isRelic": false, "grantFunction": grantBigCheese, "isCandidateFunction": mineralsUnderTwoWeekCap, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 10, "name": _("The Golden Pike"), "statType": PIKE_HOURS, "amount": 12, "image": goldPike, "rarity": .97, "isRelic": true, "grantFunction": null, "isCandidateFunction": pikesUnder36hrs, "relatedIndexesForSacrifice": [38, 28], "renderFunction": standardRelicRenderFunction, "warpId": 58, "divineId": 91, "hasRewardScaling": false},
    {"id": 11, "name": _("New Contract"), "description": _("Unlocks another scientist"), "image": scrollRelic, "rarity": .57, "isRelic": false, "grantFunction": unlockRandomScientist, "isCandidateFunction": function () {return !isActiveScientistsFull();}, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 12, "name": _("Endless Scientist Experience Potion"), "statType": SCIENTIST_EXPERIENCE_MULTIPLIER, "amount": 15, "image": speedPotion2, "rarity": .75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [33, 25, 18, 0, 20], "renderFunction": standardRelicRenderFunction, "warpId": 59, "divineId": 92, "hasRewardScaling": false},
    {"id": 13, "name": _("Key of Gold"), "statType": GOLD_CHEST_SPAWN_FREQUENCY_MULTIPLIER, "amount": 5, "image": goldKey, "rarity": .91, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [29, 2], "renderFunction": standardRelicRenderFunction, "warpId": 60, "divineId": 93, "hasRewardScaling": false},
    {"id": 14, "name": _("Relic Bag"), "description": _("Increases max relic slots by 1"), "image": backpack, "rarity": .72, "isRelic": false, "grantFunction": expandRelicInventory, "isCandidateFunction": isRelicInventoryExpandable, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 15, "name": _("Medium bag of money"), "description": _("{0} minutes worth of money"), "image": brownBag, "rarity": .20, "isRelic": false, "grantFunction": function () {return {"function": grantMoneyMinutes, "baseReward": 8}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 16, "name": _("Large Mineral Pile"), "description": _("{0} minutes worth of income as a random mineral"), "image": mineralPileLarge, "rarity": .12, "isRelic": false, "grantFunction": function () {return {"function": scientistsGrantMineralsForMinutes, "baseReward": 10}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 17, "name": _("Medium Mineral Pile"), "description": _("{0} minutes worth of income as a random mineral"), "image": mineralPileMedium, "rarity": .05, "isRelic": false, "grantFunction": function () {return {"function": scientistsGrantMineralsForMinutes, "baseReward": 7}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 18, "name": _("Endless Drill Speed Potion"), "statType": DRILL_SPEED_MULTIPLIER, "amount": 10, "image": speedPotion3, "rarity": .70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [33, 25, 0, 12], "renderFunction": standardRelicRenderFunction, "warpId": 61, "divineId": 94, "hasRewardScaling": false},
    {"id": 19, "name": _("Sparkly Distraction"), "statType": BLUEPRINT_PRICE_MULTIPLIER, "amount": 6, "image": yellowGem, "rarity": .60, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [27, 1], "renderFunction": standardRelicRenderFunction, "warpId": 62, "divineId": 95, "hasRewardScaling": false},
    {"id": 20, "name": _("Book of Success"), "statType": INCREASED_EXCAVATION_SUCCESS_RATE_PERCENT, "amount": 10, "image": yellowBook, "rarity": .90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [12, 36], "renderFunction": standardRelicRenderFunction, "warpId": 63, "divineId": 96, "hasRewardScaling": false},
    {"id": 21, "name": _("Steel Shield"), "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 5, "image": shield2, "rarity": .55, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [35], "renderFunction": standardRelicRenderFunction, "warpId": 64, "divineId": 97, "hasRewardScaling": false},
    {"id": 22, "name": _("Light Golden Boots"), "statType": WEAPON_SPEED_MULTIPLIER, "amount": 5, "image": goldBoot, "rarity": .55, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [3, 21], "renderFunction": standardRelicRenderFunction, "warpId": 65, "divineId": 98, "hasRewardScaling": false},
    {"id": 23, "name": _("Golden Scythe"), "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 5, "image": scytheGold, "rarity": .80, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [36, 37], "renderFunction": standardRelicRenderFunction, "warpId": 66, "divineId": 99, "hasRewardScaling": false},
    {"id": 24, "name": _("Small Mineral Pile"), "description": _("{0} minutes worth of income as a random mineral"), "image": mineralPileSmall, "rarity": 0, "isRelic": false, "grantFunction": function () {return {"function": scientistsGrantMineralsForMinutes, "baseReward": 4}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 25, "name": _("Endless Gem Speed Potion"), "statType": GEM_SPEED_MULTIPLIER, "amount": 5, "image": speedPotion4, "rarity": .55, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [26, 31, 33, 0, 18, 12], "renderFunction": standardRelicRenderFunction, "warpId": 67, "divineId": 100, "hasRewardScaling": false},
    {"id": 26, "name": _("Book of Ingenuity"), "statType": BUILDING_MATERIAL_CHANCE_MULTIPLIER, "amount": 6, "image": blueBook, "rarity": .65, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [25, 31], "renderFunction": standardRelicRenderFunction, "warpId": 68, "divineId": 101, "hasRewardScaling": false},
    {"id": 27, "name": _("Midas Touch"), "statType": PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE, "amount": 5, "image": goldHand, "rarity": .85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [20], "renderFunction": standardRelicRenderFunction, "warpId": 69, "divineId": 102, "hasRewardScaling": false},
    {"id": 28, "name": _("Elemental Pike"), "statType": ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER, "amount": 15, "image": basicPike, "rarity": .85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [38, 10], "renderFunction": standardRelicRenderFunction, "warpId": 70, "divineId": 103, "hasRewardScaling": false},
    {"id": 29, "name": _("Nugget of Attraction"), "statType": CHEST_MONEY_MULTIPLIER, "amount": 10, "image": goldRock, "rarity": .70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [2, 13], "renderFunction": standardRelicRenderFunction, "warpId": 71, "divineId": 104, "hasRewardScaling": false},
    {"id": 30, "name": _("Book of Time"), "statType": TIMELAPSE_DURATION_MULTIPLIER, "amount": 10, "image": purpleBook, "rarity": .65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [25, 18, 12], "renderFunction": standardRelicRenderFunction, "warpId": 72, "divineId": 105, "hasRewardScaling": false},
    {"id": 31, "name": _("Wider Well"), "statType": OIL_GENERATION_MULTIPLIER, "amount": 5, "image": OIL_icon, "rarity": .50, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [25, 26], "renderFunction": standardRelicRenderFunction, "warpId": 73, "divineId": 106, "hasRewardScaling": false},
    {"id": 32, "name": _("Unlock a New Weapon"), "description": _("Unlocks a new battle weapon"), "image": swordUnlock, "rarity": .50, "isRelic": false, "grantFunction": unlockRandomWeapon, "isCandidateFunction": function () {return userReachedUnderground() && !alreadyUnlockedAllEquips();}, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 33, "name": _("Pay Cut"), "statType": MINER_UPGRADE_AND_HIRE_COST_MULTIPLIER, "amount": 5, "image": ateCookie, "rarity": .45, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [0, 25, 18, 12], "renderFunction": standardRelicRenderFunction, "warpId": 74, "divineId": 107, "hasRewardScaling": false},
    {"id": 34, "name": _("Oil"), "description": _("Some Oil"), "image": OIL_icon, "rarity": .40, "isRelic": false, "grantFunction": function () {worldResources[OIL_INDEX].numOwned += Math.ceil(oilRigStats[oilrigStructure.level][1] / 4);}, "isCandidateFunction": function () {return userReachedUnderground() && !isOilRigFull()}, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 35, "name": _("Wooden Shield"), "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 3, "image": shield1, "rarity": .42, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [21], "renderFunction": standardRelicRenderFunction, "warpId": 75, "divineId": 108, "hasRewardScaling": false},
    {"id": 36, "name": _("Copper Scythe"), "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 3, "image": scytheCopper, "rarity": .65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [23, 37], "renderFunction": standardRelicRenderFunction, "warpId": 76, "divineId": 109, "hasRewardScaling": false},
    {"id": 37, "name": _("Scythe"), "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 2, "image": scytheBasic, "rarity": .40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [23, 36], "renderFunction": standardRelicRenderFunction, "warpId": 77, "divineId": 110, "hasRewardScaling": false},
    {"id": 38, "name": _("Copper Pike"), "statType": PIKE_HOURS, "amount": 3, "image": copperPike, "rarity": .90, "isRelic": true, "grantFunction": null, "isCandidateFunction": pikesUnder36hrs, "relatedIndexesForSacrifice": [10, 28, 1], "renderFunction": standardRelicRenderFunction, "warpId": 78, "divineId": 111, "hasRewardScaling": false},
    {"id": 39, "name": _("Light Boot"), "statType": WEAPON_SPEED_MULTIPLIER, "amount": 1, "image": basicBoot, "rarity": .40, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [49, 50, 51], "renderFunction": standardRelicRenderFunction, "warpId": 79, "divineId": 112, "hasRewardScaling": false},
    {"id": 40, "name": _("1 Ticket"), "description": _("1 Ticket"), "image": ticketicon, "rarity": .45, "isRelic": false, "grantFunction": function () {tickets++;}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 41, "name": _("Carrot of Time"), "description": _("{0} minutes of timelapse"), "image": carrotOfTime, "rarity": .22, "isRelic": false, "grantFunction": function () {return {"function": timelapse, "baseReward": 6}}, "isCandidateFunction": isTimelapseAvailable, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 42, "name": _("Strawberry of Time"), "description": _("{0} minutes of timelapse"), "image": strawberryOfTime, "rarity": .3, "isRelic": false, "grantFunction": function () {return {"function": timelapse, "baseReward": 12}}, "isCandidateFunction": isTimelapseAvailable, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 43, "name": _("Banana of Time"), "description": _("{0} minutes of timelapse"), "image": bananaOfTime, "rarity": .05, "isRelic": false, "grantFunction": function () {return {"function": timelapse, "baseReward": 3.5}}, "isCandidateFunction": isTimelapseAvailable, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 44, "name": _("Chocolate of Time"), "description": _("{0} minutes of timelapse"), "image": chocolateOfTime, "rarity": .45, "isRelic": false, "grantFunction": function () {return {"function": timelapse, "baseReward": 16}}, "isCandidateFunction": isTimelapseAvailable, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
    {"id": 45, "name": _("Book of Secrets"), "statType": UNUSED_STAT, "description": _("Doesn't seem to do anything"), "image": blackBook, "rarity": .94, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [20, 26, 30], "renderFunction": standardRelicRenderFunction, "warpId": 80, "divineId": 113, "hasRewardScaling": false},
    {"id": 46, "name": _("1km Depth"), "description": _("Gain 1km depth"), "image": depthBomb, "rarity": .55, "isRelic": false, "grantFunction": function () {addDepth(1);}, "isCandidateFunction": isBelow600km, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 47, "name": _("Sack of Endurance"), "statType": BUFF_DURATION_MULTIPLIER, "amount": 7, "image": greenBag, "rarity": .50, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [48], "renderFunction": standardRelicRenderFunction, "warpId": 81, "divineId": 114, "hasRewardScaling": false},
    {"id": 48, "name": _("Cargo Expansion"), "statType": CARGO_CAPACITY_MULTIPLIER, "amount": 15, "image": purpleBag, "rarity": .40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [47, 52], "renderFunction": standardRelicRenderFunction, "warpId": 82, "divineId": 115, "hasRewardScaling": false},
    {"id": 49, "name": _("Bullseye"), "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 5, "image": bowRelic1, "rarity": .30, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [50, 51], "renderFunction": standardRelicRenderFunction, "warpId": 83, "divineId": 116, "hasRewardScaling": false},
    {"id": 50, "name": _("Eagle Eye"), "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 7, "image": bowRelic2, "rarity": .45, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [49, 51], "renderFunction": standardRelicRenderFunction, "warpId": 84, "divineId": 117, "hasRewardScaling": false},
    {"id": 51, "name": _("Golden Bow"), "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 10, "image": bowRelic3, "rarity": .70, "isRelic": true, "grantFunction": null, "isCandidateFunction": userReachedUnderground, "relatedIndexesForSacrifice": [49, 50], "renderFunction": standardRelicRenderFunction, "warpId": 85, "divineId": 118, "hasRewardScaling": false},
    {"id": 52, "name": _("Egg of Incubation"), "statType": OFFLINE_PROGRESS_DURATION_MULTIPLIER, "amount": 10, "image": eggRelic, "rarity": .75, "isRelic": true, "grantFunction": null, "isCandidateFunction": userHasManager, "relatedIndexesForSacrifice": [48], "renderFunction": standardRelicRenderFunction, "warpId": 86, "divineId": 119, "hasRewardScaling": false},
    {"id": 53, "name": _("Unlock a New Weapon"), "description": _("Unlocks a new battle weapon"), "image": swordUnlock, "rarity": .45, "isRelic": false, "grantFunction": unlockRandomWeapon, "isCandidateFunction": function () {return userReachedUnderground() && !alreadyUnlockedAllEquips() && isOnBossLevel();}, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction},

    //Warped Relics Below
    {"id": 54, "name": _("Endless Miner Speed Potion") + "+", "statType": MINER_SPEED_MULTIPLIER, "amount": 8, "image": speedPotion1, "rarity": 1.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [74, 67, 61, 59], "renderFunction": warpedRelicRenderFunction, "warpId": 54, "divineId": 87, "hasRewardScaling": false},
    {"id": 55, "name": _("Golden Shovel") + "+", "statType": SELL_PRICE_MULTIPLIER, "amount": 8, "image": goldShovel, "rarity": 1.76, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [78, 62], "renderFunction": warpedRelicRenderFunction, "warpId": 55, "divineId": 88, "hasRewardScaling": false},
    {"id": 56, "name": _("Key of Luck") + "+", "statType": CHEST_SPAWN_FREQUENCY, "amount": 7, "image": whiteKey, "rarity": 1.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [71, 60], "renderFunction": warpedRelicRenderFunction, "warpId": 56, "divineId": 89, "hasRewardScaling": false},
    {"id": 57, "name": _("Sword of War") + "+", "statType": BATTLE_DAMAGE_MULTIPLIER, "amount": 8, "image": goldSword, "rarity": 1.5, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [65, 66], "renderFunction": warpedRelicRenderFunction, "warpId": 57, "divineId": 90, "hasRewardScaling": false},
    {"id": 58, "name": _("The Golden Pike") + "+", "statType": PIKE_HOURS, "amount": 16, "image": goldPike, "rarity": 1.97, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [78, 70], "renderFunction": warpedRelicRenderFunction, "warpId": 58, "divineId": 91, "hasRewardScaling": false},
    {"id": 59, "name": _("Endless Scientist Experience Potion") + "+", "statType": SCIENTIST_EXPERIENCE_MULTIPLIER, "amount": 20, "image": speedPotion2, "rarity": 1.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [74, 67, 61, 54, 63], "renderFunction": warpedRelicRenderFunction, "warpId": 59, "divineId": 92, "hasRewardScaling": false},
    {"id": 60, "name": _("Key of Gold") + "+", "statType": GOLD_CHEST_SPAWN_FREQUENCY_MULTIPLIER, "amount": 6.5, "image": goldKey, "rarity": 1.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [71, 56], "renderFunction": warpedRelicRenderFunction, "warpId": 60, "divineId": 93, "hasRewardScaling": false},
    {"id": 61, "name": _("Endless Drill Speed Potion") + "+", "statType": DRILL_SPEED_MULTIPLIER, "amount": 15, "image": speedPotion3, "rarity": 1.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [74, 67, 54, 59], "renderFunction": warpedRelicRenderFunction, "warpId": 61, "divineId": 94, "hasRewardScaling": false},
    {"id": 62, "name": _("Sparkly Distraction") + "+", "statType": BLUEPRINT_PRICE_MULTIPLIER, "amount": 8, "image": yellowGem, "rarity": 1.60, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [69, 55], "renderFunction": warpedRelicRenderFunction, "warpId": 62, "divineId": 95, "hasRewardScaling": false},
    {"id": 63, "name": _("Book of Success") + "+", "statType": INCREASED_EXCAVATION_SUCCESS_RATE_PERCENT, "amount": 12.5, "image": yellowBook, "rarity": 1.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [59, 76], "renderFunction": warpedRelicRenderFunction, "warpId": 63, "divineId": 96, "hasRewardScaling": false},
    {"id": 64, "name": _("Steel Shield") + "+", "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 10, "image": shield2, "rarity": 1.55, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [75], "renderFunction": warpedRelicRenderFunction, "warpId": 64, "divineId": 97, "hasRewardScaling": false},
    {"id": 65, "name": _("Light Golden Boots") + "+", "statType": WEAPON_SPEED_MULTIPLIER, "amount": 8, "image": goldBoot, "rarity": 1.55, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [57, 66], "renderFunction": warpedRelicRenderFunction, "warpId": 65, "divineId": 98, "hasRewardScaling": false},
    {"id": 66, "name": _("Golden Scythe") + "+", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 7, "image": scytheGold, "rarity": 1.80, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [76, 77], "renderFunction": warpedRelicRenderFunction, "warpId": 66, "divineId": 99, "hasRewardScaling": false},
    {"id": 67, "name": _("Endless Gem Speed Potion") + "+", "statType": GEM_SPEED_MULTIPLIER, "amount": 10, "image": speedPotion4, "rarity": 1.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [68, 73, 74, 54, 61, 59], "renderFunction": warpedRelicRenderFunction, "warpId": 67, "divineId": 100, "hasRewardScaling": false},
    {"id": 68, "name": _("Book of Ingenuity") + "+", "statType": BUILDING_MATERIAL_CHANCE_MULTIPLIER, "amount": 12, "image": blueBook, "rarity": 1.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [67, 73], "renderFunction": warpedRelicRenderFunction, "warpId": 68, "divineId": 101, "hasRewardScaling": false},
    {"id": 69, "name": _("Midas Touch") + "+", "statType": PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE, "amount": 7, "image": goldHand, "rarity": 1.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [63], "renderFunction": warpedRelicRenderFunction, "warpId": 69, "divineId": 102, "hasRewardScaling": false},
    {"id": 70, "name": _("Elemental Pike") + "+", "statType": ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER, "amount": 20, "image": basicPike, "rarity": 1.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [78, 58], "renderFunction": warpedRelicRenderFunction, "warpId": 70, "divineId": 103, "hasRewardScaling": false},
    {"id": 71, "name": _("Nugget of Attraction") + "+", "statType": CHEST_MONEY_MULTIPLIER, "amount": 15, "image": goldRock, "rarity": 1.80, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [56, 60], "renderFunction": warpedRelicRenderFunction, "warpId": 71, "divineId": 104, "hasRewardScaling": false},
    {"id": 72, "name": _("Book of Time") + "+", "statType": TIMELAPSE_DURATION_MULTIPLIER, "amount": 12, "image": purpleBook, "rarity": 1.65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [67, 61, 59], "renderFunction": warpedRelicRenderFunction, "warpId": 72, "divineId": 105, "hasRewardScaling": false},
    {"id": 73, "name": _("Wider Well") + "+", "statType": OIL_GENERATION_MULTIPLIER, "amount": 8, "image": OIL_icon, "rarity": 1.50, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [67, 68], "renderFunction": warpedRelicRenderFunction, "warpId": 73, "divineId": 106, "hasRewardScaling": false},
    {"id": 74, "name": _("Pay Cut") + "+", "statType": MINER_UPGRADE_AND_HIRE_COST_MULTIPLIER, "amount": 8, "image": ateCookie, "rarity": 1.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [54, 67, 61, 59], "renderFunction": warpedRelicRenderFunction, "warpId": 74, "divineId": 107, "hasRewardScaling": false},
    {"id": 75, "name": _("Wooden Shield") + "+", "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 6, "image": shield1, "rarity": 1.42, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [66], "renderFunction": warpedRelicRenderFunction, "warpId": 75, "divineId": 108, "hasRewardScaling": false},
    {"id": 76, "name": _("Copper Scythe") + "+", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 5, "image": scytheCopper, "rarity": 1.65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [66, 77], "renderFunction": warpedRelicRenderFunction, "warpId": 76, "divineId": 109, "hasRewardScaling": false},
    {"id": 77, "name": _("Scythe") + "+", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 4, "image": scytheBasic, "rarity": 1.40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [66, 76], "renderFunction": warpedRelicRenderFunction, "warpId": 77, "divineId": 110, "hasRewardScaling": false},
    {"id": 78, "name": _("Copper Pike") + "+", "statType": PIKE_HOURS, "amount": 7, "image": copperPike, "rarity": 1.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [58, 70, 55], "renderFunction": warpedRelicRenderFunction, "warpId": 78, "divineId": 111, "hasRewardScaling": false},
    {"id": 79, "name": _("Light Boot") + "+", "statType": WEAPON_SPEED_MULTIPLIER, "amount": 3, "image": basicBoot, "rarity": 1.40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [83, 84, 85], "renderFunction": warpedRelicRenderFunction, "warpId": 79, "divineId": 112, "hasRewardScaling": false},
    {"id": 80, "name": _("Book of Secrets") + "+", "statType": UNUSED_STAT, "description": _("Doesn't seem to do anything"), "image": blackBook, "rarity": 1.94, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [63, 68, 72], "renderFunction": warpedRelicRenderFunction, "warpId": 80, "divineId": 113, "hasRewardScaling": false},
    {"id": 81, "name": _("Sack of Endurance") + "+", "statType": BUFF_DURATION_MULTIPLIER, "amount": 10, "image": greenBag, "rarity": 1.60, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [82], "renderFunction": warpedRelicRenderFunction, "warpId": 81, "divineId": 114, "hasRewardScaling": false},
    {"id": 82, "name": _("Cargo Expansion") + "+", "statType": CARGO_CAPACITY_MULTIPLIER, "amount": 30, "image": purpleBag, "rarity": 1.50, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [81, 86], "renderFunction": warpedRelicRenderFunction, "warpId": 82, "divineId": 115, "hasRewardScaling": false},
    {"id": 83, "name": _("Bullseye") + "+", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 7, "image": bowRelic1, "rarity": 1.30, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [84, 85], "renderFunction": warpedRelicRenderFunction, "warpId": 83, "divineId": 116, "hasRewardScaling": false},
    {"id": 84, "name": _("Eagle Eye") + "+", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 10, "image": bowRelic2, "rarity": 1.45, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [83, 85], "renderFunction": warpedRelicRenderFunction, "warpId": 84, "divineId": 117, "hasRewardScaling": false},
    {"id": 85, "name": _("Golden Bow") + "+", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 15, "image": bowRelic3, "rarity": 1.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [83, 84], "renderFunction": warpedRelicRenderFunction, "warpId": 85, "divineId": 118, "hasRewardScaling": false},
    {"id": 86, "name": _("Egg of Incubation") + "+", "statType": OFFLINE_PROGRESS_DURATION_MULTIPLIER, "amount": 20, "image": eggRelic, "rarity": 1.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [82], "renderFunction": warpedRelicRenderFunction, "warpId": 86, "divineId": 119},

    //Divine Relics Below
    {"id": 87, "name": _("Endless Miner Speed Potion") + "++", "statType": MINER_SPEED_MULTIPLIER, "amount": 13, "image": speedPotion1, "rarity": 2.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [107, 100, 94, 92], "renderFunction": divineRelicRenderFunction, "warpId": 87, "divineId": 87, "hasRewardScaling": false},
    {"id": 88, "name": _("Golden Shovel") + "++", "statType": SELL_PRICE_MULTIPLIER, "amount": 13, "image": goldShovel, "rarity": 2.76, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [111, 95], "renderFunction": divineRelicRenderFunction, "warpId": 88, "divineId": 88, "hasRewardScaling": false},
    {"id": 89, "name": _("Key of Luck") + "++", "statType": CHEST_SPAWN_FREQUENCY, "amount": 10, "image": whiteKey, "rarity": 2.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [104, 93], "renderFunction": divineRelicRenderFunction, "warpId": 89, "divineId": 89, "hasRewardScaling": false},
    {"id": 90, "name": _("Sword of War") + "++", "statType": BATTLE_DAMAGE_MULTIPLIER, "amount": 12, "image": goldSword, "rarity": 2.5, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [98, 99], "renderFunction": divineRelicRenderFunction, "warpId": 90, "divineId": 90, "hasRewardScaling": false},
    {"id": 91, "name": _("The Golden Pike") + "++", "statType": PIKE_HOURS, "amount": 18, "image": goldPike, "rarity": 2.97, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [111, 103], "renderFunction": divineRelicRenderFunction, "warpId": 91, "divineId": 91, "hasRewardScaling": false},
    {"id": 92, "name": _("Endless Scientist Experience Potion") + "++", "statType": SCIENTIST_EXPERIENCE_MULTIPLIER, "amount": 25, "image": speedPotion2, "rarity": 2.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [107, 100, 94, 87, 96], "renderFunction": divineRelicRenderFunction, "warpId": 92, "divineId": 92, "hasRewardScaling": false},
    {"id": 93, "name": _("Key of Gold") + "++", "statType": GOLD_CHEST_SPAWN_FREQUENCY_MULTIPLIER, "amount": 8, "image": goldKey, "rarity": 2.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [104, 89], "renderFunction": divineRelicRenderFunction, "warpId": 93, "divineId": 93, "hasRewardScaling": false},
    {"id": 94, "name": _("Endless Drill Speed Potion") + "++", "statType": DRILL_SPEED_MULTIPLIER, "amount": 20, "image": speedPotion3, "rarity": 2.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [107, 100, 87, 92], "renderFunction": divineRelicRenderFunction, "warpId": 94, "divineId": 94, "hasRewardScaling": false},
    {"id": 95, "name": _("Sparkly Distraction") + "++", "statType": BLUEPRINT_PRICE_MULTIPLIER, "amount": 10, "image": yellowGem, "rarity": 2.60, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [102, 88], "renderFunction": divineRelicRenderFunction, "warpId": 95, "divineId": 95, "hasRewardScaling": false},
    {"id": 96, "name": _("Book of Success") + "++", "statType": INCREASED_EXCAVATION_SUCCESS_RATE_PERCENT, "amount": 15, "image": yellowBook, "rarity": 2.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [92, 109], "renderFunction": divineRelicRenderFunction, "warpId": 96, "divineId": 96, "hasRewardScaling": false},
    {"id": 97, "name": _("Steel Shield") + "++", "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 15, "image": shield2, "rarity": 2.55, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [108], "renderFunction": divineRelicRenderFunction, "warpId": 97, "divineId": 97, "hasRewardScaling": false},
    {"id": 98, "name": _("Light Golden Boots") + "++", "statType": WEAPON_SPEED_MULTIPLIER, "amount": 10, "image": goldBoot, "rarity": 2.55, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [90, 99], "renderFunction": divineRelicRenderFunction, "warpId": 98, "divineId": 98, "hasRewardScaling": false},
    {"id": 99, "name": _("Golden Scythe") + "++", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 10, "image": scytheGold, "rarity": 2.80, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [109, 110], "renderFunction": divineRelicRenderFunction, "warpId": 99, "divineId": 99, "hasRewardScaling": false},
    {"id": 100, "name": _("Endless Gem Speed Potion") + "++", "statType": GEM_SPEED_MULTIPLIER, "amount": 15, "image": speedPotion4, "rarity": 2.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [101, 106, 107, 87, 94, 92], "renderFunction": divineRelicRenderFunction, "warpId": 100, "divineId": 100, "hasRewardScaling": false},
    {"id": 101, "name": _("Book of Ingenuity") + "++", "statType": BUILDING_MATERIAL_CHANCE_MULTIPLIER, "amount": 16, "image": blueBook, "rarity": 2.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [100, 106], "renderFunction": divineRelicRenderFunction, "warpId": 101, "divineId": 101, "hasRewardScaling": false},
    {"id": 102, "name": _("Midas Touch") + "++", "statType": PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE, "amount": 10, "image": goldHand, "rarity": 2.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [99], "renderFunction": divineRelicRenderFunction, "warpId": 102, "divineId": 102, "hasRewardScaling": false},
    {"id": 103, "name": _("Elemental Pike") + "++", "statType": ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER, "amount": 25, "image": basicPike, "rarity": 2.85, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [111, 91], "renderFunction": divineRelicRenderFunction, "warpId": 103, "divineId": 103, "hasRewardScaling": false},
    {"id": 104, "name": _("Nugget of Attraction") + "++", "statType": CHEST_MONEY_MULTIPLIER, "amount": 20, "image": goldRock, "rarity": 2.80, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [89, 93], "renderFunction": divineRelicRenderFunction, "warpId": 104, "divineId": 104, "hasRewardScaling": false},
    {"id": 105, "name": _("Book of Time") + "++", "statType": TIMELAPSE_DURATION_MULTIPLIER, "amount": 15, "image": purpleBook, "rarity": 2.65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [100, 94, 92], "renderFunction": divineRelicRenderFunction, "warpId": 105, "divineId": 105, "hasRewardScaling": false},
    {"id": 106, "name": _("Wider Well") + "++", "statType": OIL_GENERATION_MULTIPLIER, "amount": 12, "image": OIL_icon, "rarity": 2.50, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [100, 101], "renderFunction": divineRelicRenderFunction, "warpId": 106, "divineId": 106, "hasRewardScaling": false},
    {"id": 107, "name": _("Pay Cut") + "++", "statType": MINER_UPGRADE_AND_HIRE_COST_MULTIPLIER, "amount": 10, "image": ateCookie, "rarity": 2.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [87, 100, 94, 92], "renderFunction": divineRelicRenderFunction, "warpId": 107, "divineId": 107, "hasRewardScaling": false},
    {"id": 108, "name": _("Wooden Shield") + "++", "statType": BATTLE_HEALTH_MULTIPLIER, "amount": 12, "image": shield1, "rarity": 2.42, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [99], "renderFunction": divineRelicRenderFunction, "warpId": 108, "divineId": 108, "hasRewardScaling": false},
    {"id": 109, "name": _("Copper Scythe") + "++", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 7, "image": scytheCopper, "rarity": 2.65, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [99, 110], "renderFunction": divineRelicRenderFunction, "warpId": 109, "divineId": 109, "hasRewardScaling": false},
    {"id": 110, "name": _("Scythe") + "++", "statType": SCIENTIST_RESURRECTION_PERCENT_CHANCE, "amount": 5, "image": scytheBasic, "rarity": 2.40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [99, 109], "renderFunction": divineRelicRenderFunction, "warpId": 110, "divineId": 110, "hasRewardScaling": false},
    {"id": 111, "name": _("Copper Pike") + "++", "statType": PIKE_HOURS, "amount": 10, "image": copperPike, "rarity": 2.90, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [91, 103, 88], "renderFunction": divineRelicRenderFunction, "warpId": 111, "divineId": 111, "hasRewardScaling": false},
    {"id": 112, "name": _("Light Boot") + "++", "statType": WEAPON_SPEED_MULTIPLIER, "amount": 6, "image": basicBoot, "rarity": 2.40, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [116, 117, 118], "renderFunction": divineRelicRenderFunction, "warpId": 112, "divineId": 112, "hasRewardScaling": false},
    {"id": 113, "name": _("Book of Secrets") + "++", "statType": UNUSED_STAT, "description": _("Doesn't seem to do anything"), "image": blackBook, "rarity": 2.94, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [96, 101, 105], "renderFunction": divineRelicRenderFunction, "warpId": 113, "divineId": 113, "hasRewardScaling": false},
    {"id": 114, "name": _("Sack of Endurance") + "++", "statType": BUFF_DURATION_MULTIPLIER, "amount": 15, "image": greenBag, "rarity": 2.60, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [115], "renderFunction": divineRelicRenderFunction, "warpId": 114, "divineId": 114, "hasRewardScaling": false},
    {"id": 115, "name": _("Cargo Expansion") + "++", "statType": CARGO_CAPACITY_MULTIPLIER, "amount": 45, "image": purpleBag, "rarity": 2.50, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [114, 119], "renderFunction": divineRelicRenderFunction, "warpId": 115, "divineId": 115, "hasRewardScaling": false},
    {"id": 116, "name": _("Bullseye") + "++", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 10, "image": bowRelic1, "rarity": 2.30, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [117, 118], "renderFunction": divineRelicRenderFunction, "warpId": 116, "divineId": 116, "hasRewardScaling": false},
    {"id": 117, "name": _("Eagle Eye") + "++", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 15, "image": bowRelic2, "rarity": 2.45, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [116, 118], "renderFunction": divineRelicRenderFunction, "warpId": 117, "divineId": 117, "hasRewardScaling": false},
    {"id": 118, "name": _("Golden Bow") + "++", "statType": BATTLE_CRIT_CHANCE_PERCENT, "amount": 20, "image": bowRelic3, "rarity": 2.70, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [116, 117], "renderFunction": divineRelicRenderFunction, "warpId": 118, "divineId": 118, "hasRewardScaling": false},
    {"id": 119, "name": _("Egg of Incubation") + "++", "statType": OFFLINE_PROGRESS_DURATION_MULTIPLIER, "amount": 30, "image": eggRelic, "rarity": 2.75, "isRelic": true, "grantFunction": null, "isCandidateFunction": alwaysFalse, "relatedIndexesForSacrifice": [115], "renderFunction": divineRelicRenderFunction, "warpId": 119, "divineId": 119, "hasRewardScaling": false},
    {"id": 120, "name": _("Pile of Building Materials"), "description": _("2x Building Materials"), "image": buildingMaterialsIcon, "rarity": .18, "isRelic": false, "grantFunction": function () {worldResources[BUILDING_MATERIALS_INDEX].numOwned += 2; newNews(_("You gained {0} building materials from excavation", 2), true);}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},
    {"id": 121, "name": _("Stack of Building Materials"), "description": _("10x Building Materials"), "image": buildingMaterialsIcon, "rarity": .49, "isRelic": false, "grantFunction": function () {worldResources[BUILDING_MATERIALS_INDEX].numOwned += 10; newNews(_("You gained {0} building materials from excavation", 10), true);}, "isCandidateFunction": isBelow600km, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": false},

    //New Rewards
    {"id": 122, "name": _("Super Miner Souls"), "description": _("{0} Super Miner Souls"), "image": superMinerSoulHD, "rarity": .45, "isRelic": false, "grantFunction": function () {return {"function": addSuperMinerSouls, "baseReward": 2}}, "isCandidateFunction": alwaysTrue, "relatedIndexesForSacrifice": [], "renderFunction": standardRelicRenderFunction, "hasRewardScaling": true},
];
//increase spawn rate of deposits
//increase amt in deposits
//cave relics
//ability to see hidden scientist rewards

//[240, 360, 720, 1440]
var excavations = [
    {"difficulty": _("Easy"), "names": [_("Sift Surface Dirt"), _("Metal Detect Surface"), _("Lidar Artifact Scan")], "numericDifficultyRange": [0, 0], "durationOptionsInMinutes": [30, 60, 90, 120], "rewardSkew": 12, "minimumValue": 0, "maximumValue": 0.40}, //gamma curve Math.pow(Math.random(), 12); with min minimumValue
    {"difficulty": _("Medium"), "names": [_("Explore Shallow Cave"), _("Sift Crater Top Soil"), _("Utilize Magnetometer At 40km")], "numericDifficultyRange": [5, 10], "durationOptionsInMinutes": [30, 60, 90, 120], "rewardSkew": 6, "minimumValue": .15, "maximumValue": 0.51}, //gamma curve Math.pow(Math.random(), 6); with min minimumValue
    {"difficulty": _("Hard"), "names": [_("Explore Lost Tomb"), _("Excavate Crater"), _("Dredge Groundwater")], "numericDifficultyRange": [25, 50], "durationOptionsInMinutes": [120, 150, 180, 210], "rewardSkew": 2, "minimumValue": .50, "maximumValue": 0.85}, //gamma curve Math.pow(Math.random(), 2); with min minimumValue
    {"difficulty": _("Nightmare"), "names": [_("Explore Deep Cavern"), _("Excavate Ancient Cave"), _("Excavate Deep Pit")], "numericDifficultyRange": [50, 99], "durationOptionsInMinutes": [180, 240, 300, 360], "rewardSkew": 1, "minimumValue": .80, "maximumValue": 1.00} //gamma curve Math.pow(Math.random(), 1); with min minimumValue
];
//numericDifficultyRange = chance out of 100 that scientist will die per during the quest (gets multiplied by scientist.deathChanceMultiple)

var scientists = [
    //Normal Scientists
    {"id": 0, "warpedId": 19, "name": "Jank", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch2, "blinkImage": arch2_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 1, "warpedId": 20, "name": "Jank", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch2, "blinkImage": arch2_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 2, "warpedId": 21, "name": "Mrs. Marge", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch3, "blinkImage": arch3_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 3, "warpedId": 22, "name": "Taylor", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch4, "blinkImage": arch4_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 4, "warpedId": 23, "name": "Ziggy", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch8, "blinkImage": arch8_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 5, "warpedId": 24, "name": "Ziggy", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch8, "blinkImage": arch8_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 6, "warpedId": 25, "name": "The Aussie", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch9, "blinkImage": arch9_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 7, "warpedId": 26, "name": "Dallas", "rarity": _("Uncommon"), "deathChanceMultiple": 0.90, "image": arch10, "blinkImage": arch10_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 8, "warpedId": 27, "name": "Ernie", "rarity": _("Uncommon"), "deathChanceMultiple": 0.90, "image": arch7, "blinkImage": null, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 9, "warpedId": 28, "name": "Dr. Gilbert", "rarity": _("Uncommon"), "deathChanceMultiple": 0.90, "image": arch11, "blinkImage": null, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 10, "warpedId": 29, "name": "Mr. Mustache", "rarity": _("Rare"), "deathChanceMultiple": 0.75, "image": arch5, "blinkImage": null, "additionalRewardCandidates": 1, "isNormal": true},
    {"id": 11, "warpedId": 30, "name": "Mr. Mustachio", "rarity": _("Rare"), "deathChanceMultiple": 0.75, "image": arch6, "blinkImage": null, "additionalRewardCandidates": 1, "isNormal": true},
    {"id": 12, "warpedId": 31, "name": "Dr. Archibald", "rarity": _("Legendary"), "deathChanceMultiple": 0.45, "image": arch1, "blinkImage": arch1_blink, "additionalRewardCandidates": 3, "isNormal": true},
    {"id": 13, "warpedId": 32, "name": "Lt. Ramirez", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch16, "blinkImage": arch16_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 14, "warpedId": 33, "name": "Layla", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch3, "blinkImage": arch3_blink, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 15, "warpedId": 34, "name": "Dr. Franduzle", "rarity": _("Uncommon"), "deathChanceMultiple": 0.90, "image": arch12, "blinkImage": null, "additionalRewardCandidates": 0, "isNormal": true},
    {"id": 16, "warpedId": 35, "name": "Professor Zany", "rarity": _("Rare"), "deathChanceMultiple": 0.75, "image": arch13, "blinkImage": arch13_blink, "additionalRewardCandidates": 1, "isNormal": true},
    {"id": 17, "warpedId": 36, "name": "James The BEAR", "rarity": _("Legendary"), "deathChanceMultiple": 0.45, "image": arch14, "blinkImage": null, "additionalRewardCandidates": 3, "isNormal": true},
    {"id": 18, "warpedId": 37, "name": "Dennis", "rarity": _("Common"), "deathChanceMultiple": 1, "image": arch17, "blinkImage": arch17_blink, "additionalRewardCandidates": 0, "isNormal": true},

    //Warped Scientists
    {"id": 19, "warpedId": 19, "name": unicodeToStringCode(warpedJankName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch2w, "blinkImage": arch2w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 20, "warpedId": 20, "name": unicodeToStringCode(warpedJankName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch2w, "blinkImage": arch2w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 21, "warpedId": 21, "name": unicodeToStringCode(warpedMrsMargeName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch3w, "blinkImage": arch3w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 22, "warpedId": 22, "name": unicodeToStringCode(warpedTaylorName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch4w, "blinkImage": arch4w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 23, "warpedId": 23, "name": unicodeToStringCode(warpedZiggyName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch8w, "blinkImage": arch8w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 24, "warpedId": 24, "name": unicodeToStringCode(warpedZiggyName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch8w, "blinkImage": arch8w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 25, "warpedId": 25, "name": unicodeToStringCode(warpedTheAussieName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch9w, "blinkImage": arch9w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 26, "warpedId": 26, "name": unicodeToStringCode(warpedDallasName), "rarity": _("Warped"), "deathChanceMultiple": 0.675, "image": arch10w, "blinkImage": arch10w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 27, "warpedId": 27, "name": unicodeToStringCode(warpedErnieName), "rarity": _("Warped"), "deathChanceMultiple": 0.675, "image": arch7w, "blinkImage": arch7w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 28, "warpedId": 28, "name": unicodeToStringCode(warpedDrGilbertName), "rarity": _("Warped"), "deathChanceMultiple": 0.675, "image": arch11w, "blinkImage": arch11w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 29, "warpedId": 29, "name": unicodeToStringCode(warpedMrMustacheName), "rarity": _("Warped+"), "deathChanceMultiple": 0.40, "image": arch5w, "blinkImage": arch5w_blink, "additionalRewardCandidates": 2, "isNormal": false},
    {"id": 30, "warpedId": 30, "name": unicodeToStringCode(warpedMrMustachioName), "rarity": _("Warped+"), "deathChanceMultiple": 0.40, "image": arch6w, "blinkImage": arch6w_blink, "additionalRewardCandidates": 2, "isNormal": false},
    {"id": 31, "warpedId": 31, "name": unicodeToStringCode(warpedDrArchibaldName), "rarity": _("Warped++"), "deathChanceMultiple": 0.30, "image": arch1w, "blinkImage": arch1w_blink, "additionalRewardCandidates": 4, "isNormal": false},
    {"id": 32, "warpedId": 32, "name": unicodeToStringCode(warpedLtRamirezName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch16w, "blinkImage": arch16w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 33, "warpedId": 33, "name": unicodeToStringCode(warpedLaylaName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch3w, "blinkImage": arch3w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 34, "warpedId": 34, "name": unicodeToStringCode(warpedDrFranduzleName), "rarity": _("Warped"), "deathChanceMultiple": 0.675, "image": arch12w, "blinkImage": arch12w_blink, "additionalRewardCandidates": 1, "isNormal": false},
    {"id": 35, "warpedId": 35, "name": unicodeToStringCode(warpedProfessorZanyName), "rarity": _("Warped+"), "deathChanceMultiple": 0.40, "image": arch13w, "blinkImage": arch13w_blink, "additionalRewardCandidates": 2, "isNormal": false},
    {"id": 36, "warpedId": 36, "name": unicodeToStringCode(warpedJamesTheBearName), "rarity": _("Warped++"), "deathChanceMultiple": 0.30, "image": arch14w, "blinkImage": arch14w_blink, "additionalRewardCandidates": 4, "isNormal": false},
    {"id": 37, "warpedId": 37, "name": unicodeToStringCode(warpedDennisName), "rarity": _("Warped"), "deathChanceMultiple": 0.75, "image": arch17w, "blinkImage": arch17w_blink, "additionalRewardCandidates": 1, "isNormal": false}
];

var deathReasons = [
    _("Decided to explore without you"),
    _("Returned to the periodic table"),
    _("Invented hover boots - never seen again"),
    _("Victim of a cave-in")
];

var absoluteMaxRelicSlots = 15; //not upgradeable
var scientistSlots = 3; //not upgradeable

//###############################################
//############ SAVE THE BELOW VALUES ############
//###############################################
var hasUnlockedScientists = 0;
var maxRelicSlots = 10; //upgradeable
var equippedRelics = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
var activeScientists = [
    [],
    [],
    []
];
//static id, minutes excavated (for exp & level calculation), isDead

var excavationChoices = [
    [
        [],
        []
    ],
    [
        [],
        []
    ],
    [
        [],
        []
    ]
];
//id, duration, difficulty, isRewardShown, reward, nameIndex

var activeExcavations = [
    [],
    [],
    []
];
//reward id, totalTime, startTime, deathTime (0 if not), deathReason index, difficultyIndex, nameIndex, isRewardShown, wasNewsDisplayed
//###############################################

function checkForCompletedExcavations()
{
    activeScientists.forEach((activeScientist, scientistIndex) =>
    {
        if(activeScientist.length && isOnActiveExcavation(scientistIndex) && !activeExcavations[scientistIndex][8])
        {
            let staticScientist = scientists[activeScientist[0]];
            let excavationRewardValues = getActiveExcavationRewardValues(scientistIndex);
            if(isScientistDead(scientistIndex))
            {
                activeExcavations[scientistIndex][8] = 1;
                newNews(staticScientist.name + ' ' + getDeathReason(scientistIndex), true);
            }
            else if(isExcavationDone(scientistIndex))
            {
                activeExcavations[scientistIndex][8] = 1;
                newNews(_("Excavation Complete"));
                newNews(_("{0} found a {1}", staticScientist.name, excavationRewardValues.name), true);
            }
        }
    });
}

function getRandomScientistId()
{
    var candidateIndexes = [];
    for(var i = 0; i < scientists.length; i++)
    {
        if(scientists[i].isNormal)
        {
            candidateIndexes.push(i);
        }
    }

    return candidateIndexes[scientistRoller.rand(0, candidateIndexes.length - 1)];
}

function unlockScientistOfId(scientistId)
{
    var newScientist = scientists[scientistId];
    var slotToAdd = firstOpenScientistSlot();
    if(slotToAdd >= scientistSlots)
    {
        //error
        return {"success": false, "reason": _("Scientists Inventory Full")};
    }
    activeScientists[slotToAdd] = [scientistId, 0, 0];
    generateExcavationChoices(slotToAdd);
    return {"success": true, "reason": newScientist.name};
}

function unlockRandomScientist()
{
    var randomId = getRandomScientistId();
    return unlockScientistOfId(randomId);
}

function unlockUncommonOrRarerScientist()
{
    var candidateIndexes = [];
    for(var i = 0; i < scientists.length; i++)
    {
        if(scientists[i].isNormal && (scientists[i].rarity == _("Legendary") || scientists[i].rarity == _("Rare")))
        {
            candidateIndexes.push(i);
        }
    }

    var randomId = candidateIndexes[scientistRoller.rand(0, candidateIndexes.length - 1)];
    return unlockScientistOfId(randomId);
}

function firstOpenScientistSlot()
{
    for(var i = 0; i < scientistSlots; i++)
    {
        if(activeScientists[i].length == 0) return i;
    }
    return scientistSlots; //error
}

function numActiveScientists()
{
    for(var i = 0; i < scientistSlots; i++)
    {
        if(activeScientists[i].length == 0) return i;
    }
    return 3;
}

function aliveScientists()
{
    var aliveScientists = [];
    for(var i = 0; i < numActiveScientists(); i++)
    {
        if(!isScientistDead([i]))
        {
            aliveScientists.push(activeScientists[i]);
        }
    }
    return aliveScientists;
}


function isActiveScientistsFull()
{
    return firstOpenScientistSlot() >= scientistSlots;
}

function indexOfScientist(scientist)
{
    for(var i = 0; i < numActiveScientists(); i++)
    {
        if(scientist == activeScientists[i]) return i;
    }
}

function deleteScientistAtIndex(index)
{
    excavationChoices.splice(index, 1);
    excavationChoices.push([
        [],
        []
    ]);
    activeExcavations.splice(index, 1);
    activeExcavations.push([]);
    activeScientists.splice(index, 1);
    activeScientists.push([]);
}

function killScientistAtIndex(index)
{
    activeExcavations[index] =
        [
            0,
            Number.MAX_SAFE_INTEGER,    // Excavation duration
            savetime,                   // Current time
            -1,                         // Death time - set to -1 to flag instant death
            6,                          // Death reason index
            3,                          // Difficulty index
            2,                          // Excavation name index
            false,                      // isRewardShown
            100                         // Excavation difficulty
        ]
}

function startExcavation(scientistIndex, excavationChoiceIndex)
{
    //get choice info, generate new excavation and fill active, clear choices
    var deathResult = determineDeathForExcavationChoice(scientistIndex, excavationChoiceIndex);
    var chosenExcavation = excavationChoices[scientistIndex][excavationChoiceIndex];
    var currentTimeInSeconds = savetime;
    var newActiveExcavation = [chosenExcavation[4], chosenExcavation[1], currentTimeInSeconds, deathResult.time, deathResult.reasonIndex, chosenExcavation[0], chosenExcavation[5], chosenExcavation[3], chosenExcavation[2]];

    activeExcavations[scientistIndex] = newActiveExcavation;
    excavationChoices[scientistIndex] = [
        [],
        []
    ];
}

function generateExcavationChoices(scientistIndex)
{
    var scientistLevel = getScientistLevel(scientistIndex);

    for(var i = 0; i < 2; i++)
    {
        var difficultyIndex = 0;
        var isRewardShown = scientistRoller.rand(0, 2); //1 in 3 chance it isn't shown
        if(isRewardShown == 2) isRewardShown = 1;
        if(i == 0)
        {
            if(scientistLevel > 40)
            {
                difficultyIndex = scientistRoller.rand(0, 2);
            }
            else if(scientistLevel > 30)
            {
                difficultyIndex = scientistRoller.rand(0, scientistRoller.rand(1, 2));
            }
            else if(scientistLevel > 3)
            {
                difficultyIndex = scientistRoller.rand(0, 1);
            }
            else
            {
                difficultyIndex = 0;
            }
        }
        else
        {
            if(scientistLevel > 3)
            {
                var chanceOfNightmareDifficulty = (45 + (scientistLevel / 5)) / 100;
                if(scientistRoller.boolean(chanceOfNightmareDifficulty))
                {
                    difficultyIndex = 3;
                }
                else
                {
                    difficultyIndex = 2;
                }
            }
            else
            {
                var minDifficultyIndex = Math.min(2, scientistLevel);
                var maxDifficultyIndex = Math.min(3, scientistLevel + 1);
                difficultyIndex = scientistRoller.rand(minDifficultyIndex, maxDifficultyIndex);
            }
        }
        var staticExcavation = excavations[difficultyIndex];
        var excavationDifficulty = scientistRoller.rand(staticExcavation.numericDifficultyRange[0], staticExcavation.numericDifficultyRange[1]);
        var excavationDurationMins = Math.round(staticExcavation.durationOptionsInMinutes[scientistRoller.rand(0, staticExcavation.durationOptionsInMinutes.length - 1)]);
        var excavationNameIndex = scientistRoller.rand(0, staticExcavation.names.length - 1);
        excavationChoices[scientistIndex][i] = [difficultyIndex, excavationDurationMins, excavationDifficulty, isRewardShown, 0, excavationNameIndex];
        assignRewardForExcavationChoice(scientistIndex, i);
    }
}

function determineDeathForExcavationChoice(scientistIndex, excavationIndex)
{
    var activeScientist = activeScientists[scientistIndex];
    var excavationChoice = excavationChoices[scientistIndex][excavationIndex];
    var staticScientist = scientists[activeScientist[0]];
    var chanceOfDeath = Math.round(staticScientist.deathChanceMultiple * excavationChoice[2]) * STAT.increasedExcavationSuccessRatePercent();
    var deathRoller = scientistRoller.rand(0, 100);
    var willDie = deathRoller < chanceOfDeath;

    if(!willDie)
    {
        return {"time": 0, "reasonIndex": 0};
    } else
    {
        var deathTime = scientistRoller.rand(1, excavationChoice[1] - 1);
        return {"time": deathTime, "reasonIndex": scientistRoller.rand(0, deathReasons.length - 1)};
    }
}

function assignRewardForExcavationChoice(scientistIndex, excavationChoiceIndex)
{
    var activeScientist = activeScientists[scientistIndex];
    var staticScientist = scientists[activeScientist[0]];
    var excavationChoice = excavationChoices[scientistIndex][excavationChoiceIndex];
    var excavationDurationHours = excavationChoice[1] / 60;
    var scientistLevel = getScientistLevel(scientistIndex);
    var numCandidateRewardsToGenerate = Math.max(1, Math.round(staticScientist.additionalRewardCandidates + (Math.sqrt(scientistLevel) * excavationDurationHours / 6)));
    if(excavationChoice[3] == 0)
    {
        numCandidateRewardsToGenerate++;
    } //If reward is not shown make it a little better

    var skewForRandomNumberGeneration = excavations[excavationChoice[0]].rewardSkew; //power for gamma curve
    var minimumValue = excavations[excavationChoice[0]].minimumValue;
    var maximumValue = excavations[excavationChoice[0]].maximumValue;
    if(staticScientist.rarity == _("Warped"))
    {
        maximumValue *= 1.1;
    }
    else if(staticScientist.rarity == _("Warped+"))
    {
        maximumValue *= 1.15;
    }
    else if(staticScientist.rarity == _("Warped++"))
    {
        maximumValue *= 1.2;
    }
    var rewardResultRange = maximumValue - minimumValue;
    var randomSelectionNumber = minimumValue + (rewardResultRange * Math.pow(scientistRoller.randFloat(), skewForRandomNumberGeneration));
    randomSelectionNumber += Math.min(0.1, Math.sqrt(scientistLevel) / 100); //level reward skew

    var candidatesFound = 0;
    var maximumQualifyingRewardRarityValue = -1;
    var maximumQualifyingRewardIndex = 0;
    while(candidatesFound < numCandidateRewardsToGenerate)
    {
        var randomIndex = scientistRoller.rand(0, excavationRewards.length - 1);
        if(excavationRewards[randomIndex].isCandidateFunction() && excavationRewards[randomIndex].rarity <= randomSelectionNumber)
        {
            candidatesFound++;
            if(excavationRewards[randomIndex].rarity > maximumQualifyingRewardRarityValue)
            {
                maximumQualifyingRewardIndex = randomIndex;
                maximumQualifyingRewardRarityValue = excavationRewards[randomIndex].rarity;
            }
            else if(excavationRewards[randomIndex].rarity == maximumQualifyingRewardRarityValue && scientistRoller.rand(0, 1) == 0)
            {
                maximumQualifyingRewardIndex = randomIndex;
            }
        }
    }
    excavationChoices[scientistIndex][excavationChoiceIndex][4] = maximumQualifyingRewardIndex;

    //override duration if it's a scaling reward
    var excavationReward = excavationRewards[maximumQualifyingRewardIndex];
    if(excavationReward.hasRewardScaling)
    {
        var rewardAmount = getScalingRewardAmount(scientistIndex, excavationReward.grantFunction()["baseReward"]);
        var durationMultiplier = (Math.log(2.1) / Math.log(rewardAmount)) * 10;
        var roundedDuration = Math.round((rewardAmount * durationMultiplier) / 5) * 5; //rounded to nearest 5 mins so excavation time isn't super weird
        excavationChoices[scientistIndex][excavationChoiceIndex][1] = roundedDuration;
    }
}

function getScientistLevel(scientistIndex)
{
    var minutesExcavated = activeScientists[scientistIndex][1];

    //geometric series Sn =  a1(1−r^n) / 1−r   (r != n)
    //Do some algebra to solve for n for a given Sn

    return Math.min(100, 1 + Math.floor(Math.log(-1 * (-1 + ((minutesExcavated * (1 - DIFFICULTY_INCREASE_PER_LEVEL)) / START_EXP_FIRST_LEVEL))) / Math.log(DIFFICULTY_INCREASE_PER_LEVEL)));
}

function getScientistImage(scientistId)
{
    var scientistBlinkPeriod = CHARACTER_BLINK_PERIOD;
    var scientist = scientists[scientistId];
    if(scientist.blinkImage && (numFramesRendered + scientistId) % scientistBlinkPeriod <= 1)
    {
        return scientist.blinkImage;
    }
    return scientist.image;
}

function getScientistPercentToNextLevel(scientistIndex)
{
    var scientistLevel = getScientistLevel(scientistIndex);
    var currentLevelExp = getTotalXpNeededForScientistLevel(scientistLevel);
    return (activeScientists[scientistIndex][1] - currentLevelExp) / (getTotalXpNeededForScientistLevel(scientistLevel + 1) - currentLevelExp);
}

function getTotalXpNeededForScientistLevel(level)
{
    return Math.floor((START_EXP_FIRST_LEVEL * (1 - Math.pow(DIFFICULTY_INCREASE_PER_LEVEL, level - 1)) / (1 - DIFFICULTY_INCREASE_PER_LEVEL)));
}

function excavationTimeRemainingSeconds(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var currentTimeInSeconds = savetime;
    var timeStartedExcavation = activeExcavation[2];
    var elapsedTimeInSeconds = currentTimeInSeconds - timeStartedExcavation;
    var deathTime = activeExcavation[3];
    var deathTimeAfterStartingInSeconds = deathTime * 60
    if(elapsedTimeInSeconds > deathTimeAfterStartingInSeconds && deathTimeAfterStartingInSeconds > 0)
    {
        elapsedTimeInSeconds = deathTimeAfterStartingInSeconds; //stop if they died
    }
    var totalExcavationTimeSeconds = activeExcavation[1] * 60;
    var timeRemaining = totalExcavationTimeSeconds - elapsedTimeInSeconds;
    return Math.max(0, timeRemaining);
}

function excavationPercentComplete(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var totalExcavationTimeSeconds = activeExcavation[1] * 60;
    var secondsRemaining = excavationTimeRemainingSeconds(scientistIndex);
    var percentComplete = 1 - (secondsRemaining / totalExcavationTimeSeconds);
    return Math.max(0, Math.min(1, percentComplete));
}

function isExcavationDone(scientistIndex)
{
    return excavationPercentComplete(scientistIndex) == 1;
}

function getActiveExcavationText(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var staticExcavation = excavations[activeExcavation[5]];
    var difficultyText = staticExcavation.difficulty;
    var nameIndex = activeExcavation[6];
    var excavationName = staticExcavation.names[nameIndex];

    return excavationName + " (" + _("Difficulty") + " " + difficultyText + ")";
}

function getActiveExcavationRewardValues(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var staticExcavation = excavations[activeExcavation[5]];
    var isRewardShown = activeExcavation[7];
    var rewardId = activeExcavation[0];
    var rewardStaticData = excavationRewards[rewardId];
    var rewardName = rewardStaticData.name;
    var rewardDescription = getRewardDescription(rewardId, scientistIndex);
    var rewardImagecurrentlyViewedDepth = rewardStaticData.image;

    if(isRewardShown || isExcavationDone(scientistIndex))
    {
        return {"name": rewardName, "description": rewardDescription, "image": rewardImagecurrentlyViewedDepth, "id": rewardId};
    } else
    {
        return {"name": "???", "description": _("Unknown"), "image": darkdot, "id": -1};
    }
}

function getRewardDescription(id, scientistIndex = null)
{
    var description;

    if(excavationRewards[id].isRelic)
    {
        description = _("Rarity:");
        if(excavationRewards[id].rarity <= .5)
        {
            description += _("Common");
        }
        else if(excavationRewards[id].rarity <= .7)
        {
            description += _("Uncommon");
        }
        else if(excavationRewards[id].rarity <= .85)
        {
            description += _("Rare");
        }
        else if(excavationRewards[id].rarity <= 1)
        {
            description += _("Legendary");
        }
        else if(excavationRewards[id].rarity <= 2)
        {
            description += "<span class='jittery'>" + _("Warped") + "</span>";
        }
        else if(excavationRewards[id].rarity <= 3)
        {
            description += "<span class='glowRelic'>" + _("Divine") + "</span>";
        }

        if(excavationRewards[id].hasOwnProperty("description"))
        {
            description += "<br></br>" + excavationRewards[id].description;
        }
        else
        {
            description += "<br></br>" + excavationRewards[id].statType.getTooltip(excavationRewards[id].amount) + "<br></br>" + excavationRewards[id].statType.getStatInfo();
        }
    }
    else
    {
        if(excavationRewards[id].hasRewardScaling && scientistIndex != null)
        {
            description = _(excavationRewards[id].description, getScalingRewardAmount(scientistIndex, excavationRewards[id].grantFunction()["baseReward"]));
        }
        else
        {
            description = excavationRewards[id].description;
        }
    }

    return description;
}

function getExcavationChoiceRewardValues(scientistIndex, choiceIndex)
{
    var excavationChoice = excavationChoices[scientistIndex][choiceIndex];
    var excavationStaticData = excavations[excavationChoice[0]];
    var isRewardShown = excavationChoice[3];
    var rewardId = excavationChoice[4];
    var rewardStaticData = excavationRewards[rewardId];
    var rewardName = rewardStaticData.name;
    var rewardDescription = getRewardDescription(rewardId, scientistIndex);
    var rewardImagecurrentlyViewedDepth = rewardStaticData.image;

    if(isRewardShown)
    {
        return {"name": rewardName, "description": rewardDescription, "image": rewardImagecurrentlyViewedDepth};
    }
    else
    {
        return {"name": "???", "description": _("Unknown"), "image": darkdot};
    }
}

function isScientistDead(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var currentTimeInSeconds = savetime;
    var timeStartedExcavation = activeExcavation[2];
    var elapsedTimeInSeconds = currentTimeInSeconds - timeStartedExcavation;
    var deathTime = activeExcavation[3];
    if(deathTime < 0)
    {
        return true;
    }
    var deathTimeAfterStartingInSeconds = deathTime * 60
    if(elapsedTimeInSeconds > deathTimeAfterStartingInSeconds && deathTimeAfterStartingInSeconds > 0)
    {
        return true;
    }
    return false;
}

function getDeathReason(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var deathReason = deathReasons[activeExcavation[4]];
    return deathReason;
}

function isOnActiveExcavation(scientistIndex)
{
    return activeExcavations[scientistIndex].length > 0;
}

function forfeitRewardForFinishedExcavation(scientistIndex, grantExp)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var activeScientist = activeScientists[scientistIndex];
    if(grantExp == true)
    {
        activeScientist[1] += activeExcavation[1]; //grant exp
    }

    // -- Don't grant reward --

    //generate new choices for next quest
    activeExcavations[scientistIndex] = [];
    generateExcavationChoices(scientistIndex);
}

function canClaimRewardForFinishedExcavation(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var rewardId = activeExcavation[0];
    if(excavationRewards[rewardId].isRelic)
    {
        if(!isRelicInventoryFull())
        {
            return {"success": true};
        } else
        {
            return {"success": false, "reason": _("Relic Inventory Is Full, Delete a Relic to claim")};
        }
    }
    return {"success": true};
}

function claimRewardForFinishedExcavation(scientistIndex)
{
    var activeExcavation = activeExcavations[scientistIndex];
    var activeScientist = activeScientists[scientistIndex];
    var staticScientist = scientists[activeScientist[0]];
    var experienceMultiplier = 2 - staticScientist.deathChanceMultiple;
    activeScientist[1] += activeExcavation[1] * experienceMultiplier * STAT.scientistExperienceMultiplier(); //grant exp

    //grant reward
    var rewardId = activeExcavation[0];
    if(excavationRewards[rewardId].isRelic)
    {
        equipRelic(rewardId);
    }
    else if(excavationRewards[rewardId].hasRewardScaling)
    {
        var reward = excavationRewards[rewardId].grantFunction();
        var rewardAmount = getScalingRewardAmount(scientistIndex, reward["baseReward"]);

        reward["function"](rewardAmount);

    }
    else if(excavationRewards[rewardId].grantFunction != null)
    {
        excavationRewards[rewardId].grantFunction();
    }

    //generate new choices for next quest
    activeExcavations[scientistIndex] = [];
    generateExcavationChoices(scientistIndex);
}

function getScalingRewardAmount(scientistIndex, baseReward)
{
    //quickly ramps up and then slows down as scientist gets higher level
    //rewards scale on scientist level, rarity, and the depth of the player.

    var scientistLevel = getScientistLevel(scientistIndex);
    var activeScientist = activeScientists[scientistIndex];
    var staticScientist = scientists[activeScientist[0]];
    var rewardMultiplier = 2 - staticScientist.deathChanceMultiple;
    return Math.floor((Math.log(scientistLevel + 1) / Math.log(2) * baseReward * depthMultiplier() * rewardMultiplier));
}

function onClickBuryScientist(scientistIndex)
{
    var activeScientist = activeScientists[scientistIndex];
    var staticScientist = scientists[activeScientist[0]];

    if(isOnActiveExcavation(scientistIndex))
    {
        if(isScientistDead(scientistIndex))
        {
            deadScientists++;
            var chanceOfResurrection = STAT.percentChanceScientistResurrection();
            if(scientistRoller.rand(1, 100) > chanceOfResurrection)
            {
                deleteScientistAtIndex(scientistIndex);
                savegame();
            }
            else
            {
                newNews(_("{0} was miraculously rescued", staticScientist.name), true);
                forfeitRewardForFinishedExcavation(scientistIndex, false);
                savegame();
            }
        }
    }
}

function getCostToResurrect(scientistIndex)
{
    var scientistLevel = getScientistLevel(scientistIndex);

    return Math.round(Math.pow(scientistLevel, .75));
}


function onClickResurrect(scientistIndex)
{
    var costToResurrect = getCostToResurrect(scientistIndex);
    var activeScientist = activeScientists[scientistIndex];
    var staticScientist = scientists[activeScientist[0]];

    if(isOnActiveExcavation(scientistIndex))
    {
        if(isScientistDead(scientistIndex))
        {
            if(tickets >= costToResurrect)
            {

                showConfirmationPrompt(
                    _("Are you sure you want to pay {0} tickets to rescue {1}?", costToResurrect, staticScientist.name),
                    _("Yes"),
                    function ()
                    {
                        hideSimpleInput();
                        trackEvent_SpentTickets(costToResurrect, "RESCUED SCIENTIST");
                        tickets -= costToResurrect;
                        newNews(_("{0} was miraculously rescued", staticScientist.name), true);
                        forfeitRewardForFinishedExcavation(scientistIndex, false);
                        savegame();
                    },
                    _("Cancel"));

            }
            else
            {
                showAlertPrompt(_("You don't have enough tickets"), _("Ok"))
            }
        }
    }
}

function onClickClaimExcavationReward(scientistIndex)
{
    if(isOnActiveExcavation(scientistIndex))
    {
        if(isExcavationDone(scientistIndex))
        {
            var canCollectInfo = canClaimRewardForFinishedExcavation(scientistIndex);
            if(canCollectInfo.success == true)
            {
                hideSimpleInput(); // Close Forfeit window if user collects reward
                //do collection
                claimRewardForFinishedExcavation(scientistIndex);
                numExcavationsCompleted++;
                if(!mutebuttons) scientistCollectAudio.play();
                savegame();
            }
            else
            {
                //show them error for why they cannot collect
                alert(canCollectInfo.reason);
            }
        }
    }
}

function isRelicInventoryExpandable()
{
    return maxRelicSlots < absoluteMaxRelicSlots;
}

function isRelicInventoryFull()
{
    return equippedRelics[maxRelicSlots - 1] != -1;
}

function numRelicsEquipped()
{
    for(var i = 0; i < maxRelicSlots; i++)
    {
        if(equippedRelics[i] == -1)
        {
            return i;
        }
    }
    return maxRelicSlots;
}

function equipRelic(relicId)
{
    for(var i = 0; i < maxRelicSlots; i++)
    {
        if(equippedRelics[i] == -1)
        {
            equippedRelics[i] = relicId;
            return;
        }
    }
}

function deleteEquippedRelic(equippedRelicIndex)
{
    equippedRelics.splice(equippedRelicIndex, 1);
    equippedRelics.push(-1);
}

function progressScientistExcavations(seconds)
{
    for(var i = 0; i < activeExcavations.length; i++)
    {
        if(activeExcavations[i].length > 0)
        {
            let excavationDone = isExcavationDone(i);
            let scientistDead = isScientistDead(i);

            if(!excavationDone && !scientistDead)
            {
                activeExcavations[i][2] -= seconds;

                if(excavationDone)
                {
                    trackEvent_FinishExcavation(1);
                } else if(scientistDead)
                {
                    trackEvent_FinishExcavation(0);
                }
            }
        }
    }
}

// ####################### Relic stat value functions #############################

function getRelicEffect(relicId, multiplier)
{
    return getNumOfEquippedRelicsWithId(relicId) * multiplier;
}

function getPercentChance(relicId, percent)
{
    return (getNumOfEquippedRelicsWithId(relicId) * percent);
}

function getNumOfEquippedRelicsWithId(relicId)
{
    var result = 0;
    for(var i = 0; i < maxRelicSlots; i++)
    {
        if(equippedRelics[i] == relicId) result++;
    }
    result += buffs.getBuffValue(relicId);
    return result;
}

// ####################### Excavation grant functions #############################
function openBasicChest()
{
    chestService.spawnChest(0, Chest.excavation);
    chestService.presentChest(0);
}

function openGoldChest()
{
    chestService.spawnChest(0, Chest.excavation, ChestType.gold);
    chestService.presentChest(0);
}

function openEtherealChest()
{
    chestService.spawnChest(0, Chest.excavation, ChestType.black);
    chestService.presentChest(0);
}

function grantMoneyMinutes(minutes)
{
    var hours = minutes / 60;
    var rewardMoney = doBigIntDecimalMultiplication(60n * valueOfMineralsPerSecond() * 60n, hours);
    trackEvent_GainedMoney(rewardMoney, 0);
    addMoney(rewardMoney);
    newNews(_("You gained ${0} from excavation", beautifynum(rewardMoney)), true);
}

function grantMineralsForHour(mineralId, hours, displayNews = true)
{
    var moneyMadeInTime = doBigIntDecimalMultiplication(60n * valueOfMineralsPerSecond() * 60n, hours);
    var valuePerMineral = worldResources[mineralId].sellValue;
    var mineralName = worldResources[mineralId].name;
    var numMineralsToReward = moneyMadeInTime / valuePerMineral;
    trackEvent_GainedMoney(moneyMadeInTime, 0, true);
    worldResources[mineralId].numOwned += Number(numMineralsToReward);

    if(displayNews)
    {
        newNews(_("You gained {0} x {1}", beautifynum(numMineralsToReward), mineralName), true);
    }

    return {"name": mineralName, "amount": numMineralsToReward};
}

function scientistsGrantMineralsForMinutes(minutes)
{
    var minimumMineralToGrant = highestOreUnlocked;
    var hours = minutes / 60;
    var moneyMadeInTime = doBigIntDecimalMultiplication(60n * valueOfMineralsPerSecond() * 60n, hours);
    var valuePerMineral = 0n;
    var numMineralsToReward = 0n;

    for(var i = 0; i < mineralIds.length; i++)
    {
        valuePerMineral = worldResources[mineralIds[i]].sellValue;
        numMineralsToReward = moneyMadeInTime / valuePerMineral;

        if(numMineralsToReward < maxHoldingCapacity())
        {
            minimumMineralToGrant = mineralIds[i];
            break;
        }
    }

    var mineralToGrant = mineralIds[scientistRoller.rand(mineralIds.indexOf(minimumMineralToGrant), mineralIds.indexOf(highestOreUnlocked))];

    //probably a better way to do this but for some reason mineralToGrant can return undefined and I'm not sure why
    if(mineralToGrant)
    {
        grantMineralsForHour(mineralToGrant, hours, true)
    }
    else
    {
        grantMineralsForHour(highestOreUnlocked, hours, true)
    }
}

function grantBigCheese()
{
    for(var i = mineralIds.length - 1; i >= 0; i--)
    {
        if(capacity + worldResources[mineralIds[i]].numOwned <= maxHoldingCapacity() * 2)
        {
            worldResources[mineralIds[i]].numOwned *= 2;
        }
    }
}

function expandRelicInventory()
{
    if(isRelicInventoryExpandable())
    {
        maxRelicSlots++;
    }
    else
    {
        newNews(_("Your relic inventory is already at the max of {0} slots", absoluteMaxRelicSlots));
    }
}

function unlockRandomWeapon()
{
    var candidates = [];
    for(var i in weaponStats)
    {
        if(!hasEquip(i))
        {
            candidates.push(i);
        }
    }
    if(candidates.length > 0)
    {
        var randomIndex = scientistRoller.rand(0, candidates.length - 1);
        getEquip(candidates[randomIndex]);
    }
    else
    {
        newNews(_("You already have all the equips"));
    }
}

function alreadyUnlockedAllEquips()
{
    for(var i in weaponStats)
    {
        if(!hasEquip(i))
        {
            return false;
        }
    }
    return true;
}

function isOnBossLevel()
{
    return isBossLevel(depth);
}

// ####################### Excavation reward candidate functions #############################
function alwaysTrue() {return true;}
function alwaysFalse() {return false;}

function userReachedUnderground() {return depth >= 303;}
function isBelow600km() {return depth < 600;}

function pikesUnder36hrs() {return STAT.getPikeHours() < 36;}

function mineralsUnderTwoWeekCap()
{
    var mineralsMinedPerSecond = estimateTotalMineralsMinedPerSecond();
    var indexOfHighestOre = mineralIds.indexOf(highestOreUnlocked) + 1;

    indexOfHighestOre = Math.max(indexOfHighestOre, 3);
    for(var i = indexOfHighestOre - 3; i < indexOfHighestOre; i++)
    {
        if(worldResources[mineralIds[i]].numOwned > mineralsMinedPerSecond[mineralIds[i]] * 60 * 60 * 24 * 14)
        {
            return false;
        }
    }
    return true;
}

function userHasManager() {return managerStructure.level > 0;}

function isTimelapseAvailable()
{
    var numOfScientistsOnTimeLapseExcavation = 0;

    for(var i = 0; i < activeExcavations.length; i++)
    {
        if(activeExcavations[i][0] == 41 || activeExcavations[i][0] == 42 || activeExcavations[i][0] == 43 || activeExcavations[i][0] == 44)
        {
            numOfScientistsOnTimeLapseExcavation++;
        }
    }

    //chance is = (1/scientists on timelapse excavation)
    var chanceForTimelapse = scientistRoller.rand(0, numOfScientistsOnTimeLapseExcavation);
    return chanceForTimelapse == 0;
}

// ######################## Test functions ###############################################

function testScientistExcavationRewards(scientistIndex, upToLevel, tests = 1000)
{
    var avgLeftRarities = [];
    var avgRightRarities = [];

    for(var level = 2; level <= upToLevel + 1; level++)
    {
        activeScientists[scientistIndex][1] = getTotalXpNeededForScientistLevel(level);
        var left = [];
        var right = [];

        for(var i = 0; i < tests; i++)
        {
            generateExcavationChoices(scientistIndex);

            var leftRewardId = excavationChoices[scientistIndex][0][4];
            var leftRewardRarity = excavationRewards[leftRewardId].rarity;
            var rightRewardId = excavationChoices[scientistIndex][1][4];
            var rightRewardRarity = excavationRewards[rightRewardId].rarity;
            left.push(leftRewardRarity);
            right.push(rightRewardRarity);
        }

        var avgLeft = calculateAverageOfArray(left).toFixed(2);
        var avgRight = calculateAverageOfArray(right).toFixed(2);
        avgLeftRarities.push(avgLeft);
        avgRightRarities.push(avgRight);

        // console.log("Avg left rarity for level " + getScientistLevel(scientistIndex) + ": " + avgLeft);
        // console.log("Avg right rarity for level " + getScientistLevel(scientistIndex) + ": " + avgRight);
    }

    console.log(avgLeftRarities);
    console.log(avgRightRarities);
}