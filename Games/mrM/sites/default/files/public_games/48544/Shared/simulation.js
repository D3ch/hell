var isSimulating = false;

var simDepth = 0;
var totalSims = 0;
var currentSim = -1;
var rows = [];

class GameSimulator
{
    // Sim config
    minutesBetweenInteractions = 10;
    maxSteps = -1;
    chestOpenChance = 1;
    goldChestOpenChanceWithMetalDetector = 1;
    chestOpenPeriod = 10;
    autosellAll = true;
    allowSleep = false;
    csvOutput = "";
    isLoggingCsv = false;
    useDynamicInteractions = false;

    runTime = 0;
    totalTime = 0;
    lastChestOpenTime = 0;

    constructor(minutesBetweenInteractions)
    {
        this.minutesBetweenInteractions = minutesBetweenInteractions;
    }

    runForTime(time)
    {
        isSimulating = true;
        this.totalTime = time;
        bossesDefeated = 99999;
        hasLaunched = 2;
        this.runTime = 0;
        this.csvOutput = "TIME MIN,DEPTH\r\n";
        while(this.runTime < time)
        {
            this.runStep();

            if(this.isLoggingCsv)
            {
                this.csvOutput += this.runTime + "," + depth + "\r\n";
            }
            console.log((100 * this.runTime / time).toFixed(2) + "%");
        }
        isSimulating = false;
    }

    runUntilCondition(conditionCheckFunction)
    {
        rows = JSON.parse(localStorage.getItem("simData"));

        let fixedRows = rows.map(row =>
        {
            return JSON.parse(row);
        })
        rows = fixedRows;

        if(rows[0])
        {
            if(rows[0][totalSims - currentSim - 1])
            {
                rows[0][totalSims - currentSim - 1] = Math.floor(currentTime() / 1000);
            }
        }

        isSimulating = true;
        bossesDefeated = 99999;
        hasLaunched = 2;
        this.runTime = 0;
        var steps = 0;
        var simDepth = parseInt(localStorage["simDepth"]);
        var lastPrecentage = 0;

        while(!conditionCheckFunction() && (this.maxSteps < 0 || steps < this.maxSteps))
        {
            ++steps;
            this.runStep();

            let currentPercantage = ((depth / simDepth).toFixed(2) * 100);
            if(currentPercantage > lastPrecentage + 2)
            {
                lastPrecentage = currentPercantage;
                console.log(`sim ${totalSims - currentSim}/${totalSims} - depth ${depth}/${simDepth} - ${currentPercantage}% completed - steps until failure ${steps}/${Math.floor(simDepth ** 1.4)}`);
            }
        }

        isSimulating = false;

        if(rows[1])
        {
            if(rows[1][totalSims - currentSim - 1])
            {
                rows[1][totalSims - currentSim - 1] = Math.floor(currentTime() / 1000);
            }
        }


        fixedRows = rows.map(row =>
        {
            if(row)
            {
                for(var i = 0; i < row.length; i++)
                {
                    if(typeof row[i] == "undefined")
                    {
                        row[i] == "";
                    }

                }
            }

            return JSON.stringify(row);
        })

        if(localStorage["numSims"] == "0")
        {
            //console.log("time to complete: " + shortenedFormattedTime((rows[1][rows[1].length - 1] - rows[0][0]) / 1000));
            console.log("***********************");
            console.log(`SIM COMPLETED - MET CONDITION = ${depth >= simDepth}`);
            console.log("***********************");
            this.downloadCsv();
        }
        else
        {
            rows = fixedRows;
            localStorage.setItem('simData', JSON.stringify(rows));
            setTimeout(() => {location.reload();}, 3000);
        }
    }

    runStep()
    {
        var stepTime = 0;
        var isAsleep = this.runTime % 1440 > 960;
        if(this.useDynamicInteractions)
        {
            this.minutesBetweenInteractions = Math.max(1, Math.floor(depth ** 0.42));
        }
        if(!this.allowSleep || !isAsleep)
        {
            if(this.totalTime > 0)
            {
                var timelapseTime = Math.min(this.minutesBetweenInteractions, this.totalTime - this.runTime);
            }
            else
            {
                var timelapseTime = this.minutesBetweenInteractions;
            }
            while(stepTime < timelapseTime)
            {
                //this.initSnapshot();
                timelapse(1, false);
                //this.finishSnapshot(1);
                for(var i = 0; i < 60; i++)
                {
                    updateUserExperience();
                };
                simulateCavesForTime(60);
                this.simulateChestSpawns();
                this.openAnyChests();
                spawnWorldClickables();
                battlerand();
                spawnWorldClickables();
                battlerand();
                this.craftGems();

                for(var i = highestOreUnlocked; i < worldResources.length; i++)
                {
                    if(!worldResources[i].isIsotope && worldResources[i].isOnHeader && worldResources[i].numOwned > 0 && highestOreUnlocked < i)
                    {
                        highestOreUnlocked = i;
                    }
                }
                checkForNewTrade();
                stepTime += 1;

                //changed scientist to reference this instead of current time
                savetime += 60;
            }
            this.runTime += timelapseTime;
            //console.log(`Play time: ${playtime} adding ${playtime + (timelapseTime * 60)}`)
            playtime += timelapseTime * 60;

            buffs.update();
            if(buffs.activeBuffs.length > 0)
            {
                buffs.activeBuffs.forEach(buff =>
                {
                    if(buff.pausedDuringTimelapse && buff.id != 4)
                    {
                        buff.millisecondsRemaining = 0;
                    }
                })
            }
        }
        else
        {
            //console.log("********************SLEEP********************");
            var sleepTime = 480; //Math.min(480, this.totalTime - this.runTime);
            timelapse(sleepTime, false);
            //console.log(`Play time: ${playtime} sleep adding ${playtime + (sleepTime * 60)}`)
            playtime += sleepTime * 60;
            this.runTime += sleepTime;
        }

        if(depth >= 50)
        {
            hasFoundGolem = 1;
            hasFoundGidget = 1;
            initAvailableBlueprints();
        }

        questManager.update();
        questManager.grantRewardsForCompletedQuests();

        this.cachedBlueprints = getKnownBlueprints().filter((bp) => bp.category != 6);

        if(depth > 1135) this.simulateReactor(this.minutesBetweenInteractions);
        this.clickAllClickables();
        this.updateCaves();
        this.checkTrades();
        this.updateScientists();
        this.craftAllUpgrades();
        this.purchaseAllUpgrades();
        this.checkBattles();
        this.simulateCompressor();
        this.updateSuperMiners();
        this.sellMineralsToReachCapacity();
    }

    updateSuperMiners()
    {
        //test impacts of super miners
        let unlocks = [
            // {
            //     depth: 1,
            //     superMinerId: 13
            // },
            // {
            //     depth: 1,
            //     superMinerId: 13
            // },
            // {
            //     depth: 1,
            //     superMinerId: 13
            // }
        ]

        if(depth >= 10 && !superMinerManager.recievedInitialSuperMiner)
        {
            blackChestRewards.rollForRandomReward();
            chestService.totalBlackChestsOpened++;
            superMinerManager.recievedInitialSuperMiner = true;
        }

        for(var i = superMinerManager.numSuperMiners(); i < unlocks.length; i++)
        {
            if(depth < unlocks[i].depth) break;

            superMinerManager.slots++;

            if(unlocks[i].superMinerId)
            {
                let miner = superMinerManager.getSuperMinerById(unlocks[i].superMinerId)
                superMinerManager.addSuperMiner(miner);
            }
            else if(unlocks[i].type)
            {
                let minersOfType = superMinerManager.baseSuperMiners.filter(miner => miner.type == unlocks[i].type);
                if(unlocks[i].rarity) minersOfType = minersOfType.filter(miner => miner.rarity == unlocks[i].rarity);
                let miner = minersOfType[rand(0, minersOfType.length - 1)];
                superMinerManager.addSuperMiner(miner);
            }
            else if(unlocks[i].rarity)
            {
                let minersOfRarity = superMinerManager.baseSuperMiners.filter(miner => miner.rarity == unlocks[i].rarity);
                let miner = minersOfRarity[rand(0, minersOfRarity.length - 1)];

                superMinerManager.addSuperMiner(miner);
            }
        }

        let sortedMiners = superMinerManager.currentSuperMiners.length > 2 ? superMinerManager.currentSuperMiners.sort((a, b) => a.rarity.id - b.rarity.id) : superMinerManager.currentSuperMiners;

        if(superMinerManager.pendingSuperMiner)
        {
            let pendingMiner = superMinerManager.getSuperMinerById(superMinerManager.pendingSuperMiner);

            if(pendingMiner.type == superMinerTypes.CHEST) // I dont want to figure out how to simulate these chest spawns
            {
                pendingMiner.scrap();
                superMinerManager.removePendingSuperMiner();
                return;
            }
            else
            {

                if(superMinerManager.slots > superMinerManager.numSuperMiners())
                {
                    //console.log('adding miner')
                    superMinerManager.addSuperMiner(pendingMiner);
                    superMinerManager.removePendingSuperMiner();
                }
                else if(superMinerManager.canUpgradeSlot())
                {
                    //console.log('upgrading slots')
                    superMinerManager.upgradeSlots();
                    superMinerManager.addSuperMiner(pendingMiner);
                    superMinerManager.removePendingSuperMiner();
                }
                else if(sortedMiners.length > 2 && pendingMiner.rarity.id > sortedMiners[0].rarity.id)
                {
                    //console.log('removing lowest rarity to make room')
                    superMinerManager.currentSuperMiners[0].scrap();
                    superMinerManager.addSuperMiner(pendingMiner);
                    superMinerManager.removePendingSuperMiner();
                }
                else
                {
                    //console.log('scrapping because theres no room')
                    pendingMiner.scrap();
                    superMinerManager.removePendingSuperMiner();
                }
            }
        }

        for(var i = superMinerManager.numSuperMiners() - 1; i >= 0; i--)
        {
            let miner = sortedMiners[i];
            if(Math.random() < 0.05) miner.onButtonPress();
            if(miner.canLevel() &&
                miner.getLevelCost() < (superMinerManager.nextSlotCost() / 4) &&
                miner.type != superMinerTypes.EGG &&
                miner.rarity != superMinerRarities.common)
            {
                miner.levelUp();
            }

            if(miner.type == superMinerTypes.EGG && miner.level == 10)
            {
                miner.scrap();
            }
        }
    }

    simulateCompressor()
    {
        if(depth > 100 && chestCollectorChanceStructure.level < 1)
        {
            chestCollectorChanceStructure.level = 1;
            chestCollectorStorageStructure.level = 1;
            learnRangeOfBlueprints(3, 8, 9);
        }

        if(chestCompressorStructure.level > 0)
        {
            if(chestCompressor.canQueueChest(ChestType.black))
            {
                chestCompressor.addChestToQueue(ChestType.black);
            }
            else if(chestCompressor.canQueueChest(ChestType.gold))
            {
                chestCompressor.addChestToQueue(ChestType.gold);
            }
        }
    }

    craftAllUpgrades()
    {
        var weapons = filterBlueprintsByCategory(this.cachedBlueprints, 2);
        var weaponsCompleted = filterBlueprints(weapons, (bp) => !bp.craftedItem.item.isAtMaxLevel()).length > 0;
        var blueprints = this.cachedBlueprints;

        if(weaponsCompleted)
        {
            blueprints.filter(bp => bp.category != 2);
        }

        for(var i = blueprints.length - 1; i >= 0; --i)
        {
            let blueprint = blueprints[i];

            if(blueprint.levels && blueprint.levels.length > 1)
            {
                for(var level = 0; level < blueprint.levels.length; level++)
                {
                    let bpLevel = blueprint.craftedItem.item.getCurrentLevel();

                    if(bpLevel < level)
                    {
                        let discountedIngredients = getIngredientListWithDiscounts(blueprint.levels[bpLevel].ingredients);
                        craftBlueprint(blueprint.category, blueprint.id, level, discountedIngredients);
                    }
                }
            }
            else if(canCraftBlueprint(blueprint.category, blueprint.id, 0, null, true))
            {
                craftBlueprint(blueprint.category, blueprint.id);
                flagBlueprintAsSeen(blueprint.category, blueprint.id);
            }
            else if(blueprint.category == 0)
            {
                //some blueprints require trickery that I dont want to simulate
                if(depth > 1400)
                {
                    let numIngredients = discountedIngredients.length;
                    let numIngredientsQuantityFor = 0;
                    let hasRequirementHigherThanCapacity = false;
                    for(var i = 0; i < numIngredients; i++)
                    {
                        if(ingredient.item.hasQuantity(ingredient.quantity)) numIngredientsQuantityFor++;
                        if(ingredient.item instanceof MineralCraftingItem)
                        {
                            if(worldResources[worldingredient.item.id] > maxHoldingCapacity())
                            {
                                hasRequirementHigherThanCapacity = true;
                            }
                        }
                    }

                    if(numIngredients - numIngredientsQuantityFor == 1 && hasRequirementHigherThanCapacity)
                    {
                        console.log("crafted a wonk drill part that has a higher requirement than capacity")
                        for(var i in ingredients)
                        {
                            ingredients[i].item.spendQuantity(ingredients[i].quantity);
                        }

                        blueprint.craftedItem.item.grantQuantity(blueprint.craftedItem.quantity);
                    }
                }
            }
        }
    }

    purchaseAllUpgrades()
    {

        if(depth >= 1257) learnRangeOfBlueprints(1, 79, 87); //robot MK2;

        var worldReference;
        for(var i = 0; i <= Math.floor(depth / 1032); ++i)
        {
            worldReference = worlds[i];
            if(worldReference.workersHired < worldReference.workerHireCosts.length - 1 && worldReference.workerHireCost())
            {
                if(this.canAffordUpgradeWithMineralValue(worldReference.workerHireCost()))
                {
                    hireMiner(i);
                }
            }
            else if(
                worldReference.workersHired >= 10 &&
                worldReference.workerLevel + 1 <= worldReference.workerLevelCosts.length &&
                worldReference.workerUpgradeCost()
            )
            {
                if(this.canAffordUpgradeWithMineralValue(worldReference.workerUpgradeCost()))
                {
                    upgradeMiners(i);
                }

            }
        }
        if(depth >= 303) oilrigStructure.level = 12;
    }


    //need to look into if this is working correctly
    simulateChestSpawns()
    {
        //optimized combination of many chest service functions
        var maxTenthOfDepth = Math.floor(depth / 5); //this is normally 10, but the function is called twice normally as well. This is faster/better?

        for(var x = 3; x <= maxTenthOfDepth; x++)
        {
            if(this.canOpenBasicChest() && chestService.rollForBasicChest())
            {
                let chestType = chestService.rollForSpecialChest()

                if(!chestService.isChestCollectorFull() && chestSpawnRoller.rand(1, 100) <= chestService.getStoredChestsChance())
                {
                    chestService.storeChest(chestType);
                }
                else
                {
                    if(chestType == ChestType.basic)
                    {
                        basicChestRewards.rollForRandomReward();
                        chestService.totalBasicChestsOpened++;
                    }
                    else if(this.canOpenGoldenChest() && chestType == ChestType.gold)
                    {
                        goldChestRewards.rollForRandomReward();
                        chestService.totalGoldChestsOpened++;
                    }
                    else if(chestType == ChestType.black)
                    {
                        blackChestRewards.rollForRandomReward();
                        chestService.totalBlackChestsOpened++;
                    }
                }
            }
        }

        // I guess this is why simulating chest spawns and collection seperately would be a good idea. This might be too strong
        this.sellMineralsToReachCapacity();

    }

    openAnyChests()
    {
        var openChest = (type) =>
        {
            if(type == ChestType.gold)
            {
                goldChestRewards.rollForRandomReward();
                chestService.totalGoldChestsOpened++;
                chestService.storedChests[ChestType.gold]--;
            }
            else if(type == ChestType.black)
            {
                blackChestRewards.rollForRandomReward();
                chestService.totalBlackChestsOpened++;
                chestService.storedChests[ChestType.black]--;
            }
            else
            {
                basicChestRewards.rollForRandomReward();
                chestService.totalBasicChestsOpened++;
                chestService.storedChests[ChestType.basic]--;
            }
        }

        if(chestService.storedChests[0] > 30) openChest(0);
        if(chestService.storedChests[1] > 15) openChest(1);
        if(chestService.storedChests[2] > 0) openChest(2);
    }

    canOpenGoldenChest()
    {
        return metalDetectorStructure.level > 0 && Math.random() < this.goldChestOpenChanceWithMetalDetector;
    }

    canOpenBasicChest()
    {
        return Math.random() < this.chestOpenChance;
    }

    clickAllClickables()
    {
        removeExpiredClickables();
        for(var i in worldClickables)
        {
            while(worldClickables[i])
            {
                onClickedMineralDeposit(worldClickables[i]);
            }
        }
    }

    checkTrades()
    {
        let tradeOffers = [[earthTradeOffer1, earthTradeOffer2], [moonTradeOffer1, moonTradeOffer2]];

        tradeOffers.forEach((trade, worldTradeIndex) =>
        {
            //this is only checking the first trade since its currently impossible to compare the values of each trade without doing string comparisons
            if(isTradeAvailable(trade[0]))
            {
                //trades are almost always worth it now so should just make them?
                if(canMakeTrade(trade[0]) && trade[0][TRADE_INDEX_REWARD_TYPE] != TRADE_TYPE_RELIC)
                {
                    if(trade[0][TRADE_INDEX_PAYMENT_TYPE] == TRADE_TYPE_ORE)
                    {
                        if(lockedMineralAmtsToSave[trade[0][TRADE_INDEX_PAYMENT_SUBTYPE]] > 0)
                        {
                            return;
                        }
                    }

                    totalCompletedTrades++;
                    makeTrade(worldTradeIndex, trade[0]);
                    return;
                }
            }
        })
    }

    // Check if the player can afford an upgrade, selling all minerals if necessary
    canAffordUpgradeWithMineralValue(targetPrice)
    {
        if(money >= targetPrice)
        {
            return true;
        }
        else if(money + this.getValueOfMineralsExcludingLocked() >= targetPrice)
        {
            this.sellMineralsToReachMoneyAmount(targetPrice);
            return true;
        }
        return false;
    }

    getValueOfMineralsExcludingLocked()
    {
        var value = 0n;
        for(var i = 1; i < worldResources.length; i++)
        {
            let lockAmt = lockedMineralAmtsToSave[i] ? lockedMineralAmtsToSave[i] : 0;
            value += BigInt(Math.max(0, parseInt(worldResources[i].numOwned - lockAmt))) * worldResources[i].sellValue;
        }
        return value;
    }

    getValueOfLockedMinerals()
    {
        var value = 0n;
        for(var i = 1; i < worldResources.length; i++)
        {
            if(lockedMineralAmtsToSave[i])
            {
                value += BigInt(lockedMineralAmtsToSave[i]) * worldResources[i].sellValue;
            }
        }
        return value;
    }

    cachedLockedBlueprints = [];
    cachedForDepth = -1;
    lockMineralsForBlueprints()
    {
        for(var i = 0; i < lockedMineralAmtsToSave.length; i++)
        {
            lockedMineralAmtsToSave[i] = 0;
        }

        var blueprints;

        //dont over sell isotopes
        for(var i = 1; i < worldResources.length; i++)
        {
            if(worldResources[i].isIsotope)
            {
                lockedMineralAmtsToSave[i] = Math.floor(maxHoldingCapacity() / 125);
            }
        }

        if(depth > this.cachedForDepth)
        {
            blueprints = filterBlueprintsByCategoryAndLevel(this.cachedBlueprints, 1);

            //filters out blueprints where ingredients aren't owned
            blueprints = blueprints.filter(bp =>
            {
                var hasUnlockedMineral = true;
                bp.ingredients.forEach(ingredient =>
                {
                    if(ingredient.item instanceof MineralCraftingItem)
                    {
                        let worldResource = worldResources[ingredient.item.id];
                        if(
                            (worldResource.isIsotope && worldResource.index > highestIsotopeUnlocked) ||
                            (!worldResource.isIsotope && worldResource.index > highestOreUnlocked)
                        )
                        {
                            hasUnlockedMineral = false;
                        }
                    }
                })
                return hasUnlockedMineral;
            })

            //tries to sort blueprints by most cost effective
            if(depth > 1000)
            {
                blueprints = blueprints
                    .filter((bp) =>
                    {
                        depth < 1000 || getDrillEquipByBlueprintId(bp.id).wattagePercentIncrease() > 40 || getDrillEquipByBlueprintId(bp.id).capacity > 0;
                    })
                    .sort((a, b) =>
                    {
                        Number(a.craftedItem.item.getCostRelativeToIncrease()) - Number(b.craftedItem.item.getCostRelativeToIncrease())
                    });

                //if the last blueprint is cargo move to the front
                if(blueprints.length > 0)
                {
                    if(getDrillEquipByBlueprintId(blueprints[blueprints.length - 1].id).capacity > 0)
                    {
                        blueprints = [blueprints.pop()].concat(blueprints);
                    }
                }
            }
        }
        else
        {
            blueprints = this.cachedLockedBlueprints;
        }

        //limit the locked blueprints to the cheapest ones relative to performance gain
        var blueprintsToFocusOn = depth < 1300 ? blueprints.length : Math.min(3, blueprints.length)
        for(var i = 0; i < blueprintsToFocusOn; i++)  
        {
            var totalIngredients = 0n;
            var startingIndex = blueprints[0].ingredients[0].item instanceof MoneyCraftingItem ? 1 : 0;
            var ingredientsLength = blueprints[i].ingredients.length;

            for(var j = startingIndex; j < ingredientsLength; j++)
            {
                if(blueprints[i].ingredients[j].quantity)
                {
                    totalIngredients += BigInt(blueprints[i].ingredients[j].quantity);
                }
            }

            if(totalIngredients < maxHoldingCapacity())
            {
                for(var j = startingIndex; j < blueprints[i].ingredients.length; j++)
                {
                    let id = blueprints[i].ingredients[j].item.id;
                    let canLock = true;

                    if(id)
                    {
                        if(money < blueprints[0].ingredients[0].quantity && !worldResources[id].isIsotope)
                        {
                            if(worldResources[id].totalValue() > doBigIntDecimalMultiplication(blueprints[0].ingredients[0].quantity, .1))
                            {
                                canLock = false;
                            }
                        }
                    }

                    if(canLock)
                    {
                        if(worldResources[id])
                        {
                            let amount = Math.max(Number(blueprints[i].ingredients[j].quantity), lockedMineralAmtsToSave[id]);
                            //console.log(`locking ${worldResources[id]?.name} for ${amount}`);
                            lockedMineralAmtsToSave[id] = amount;
                        }
                    }
                }
                break;
            }

        }


        var worldReference = currentWorld();
        // var workerCost = BigInt(Number.MAX_VALUE);


        // if(worldReference.workersHired >= 10)
        // {
        //     let cost = worldReference.workerHireCost();
        //     workerCost = cost ? cost : workerCost;
        // }
        // else
        // {
        //     let cost = worldReference.workerUpgradeCost();
        //     workerCost = cost ? cost : workerCost;
        // }

        // if(this.getValueOfLockedMinerals() > workerCost * 4n) //don't allow locking so much that early workers are skipped
        // {
        //     //unlock all so we can get the miner upgrade

        //     console.log("unlocking resources to purchase miners");
        //     for(var i = 0; i < lockedMineralAmtsToSave.length; i++)
        //     {
        //         //if(worldResources[i].isIsotope) lockedMineralAmtsToSave[i] = Math.floor(maxHoldingCapacity() * (0.005 * (worldResources[i].indexOfWorldEncountered + 1)));
        //         lockedMineralAmtsToSave[i] = 0;
        //     }
        // }
    }

    //not really simulating, just giving the player power since it's need for blueprints.
    simulateReactor(time)
    {
        reactorStructure.level = 5;

        //make reactor grid all batteries
        if(reactor.grid.cachedMaxBatteryCapacity == 0)
        {
            reactor.learnReactorBlueprintsForLevel();
            getKnownBlueprints(6)[12].craftedItem.item.grantQuantity(81)

            reactor.grid.grid = [
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13],
                [13, 13, 13, 13, 13, 13, 13, 13, 13]
            ];

            reactor.grid.cachedMaxBatteryCapacity = reactor.grid.maxBatteryCapacity();
        }

        //fill up reactor with energy
        worldResources[NUCLEAR_ENERGY_INDEX].numOwned += (100000 * time);

        //have a chance to grant isotopes
        if(depth > 1320)
        {
            let roller = Math.random();

            if(roller > .9) einsteinium1.numOwned += 10;
            if(roller > .95) einsteinium2.numOwned += 10;

            if(depth > 1400 && roller > .97)
            {
                einsteinium3.numOwned += 10;
                fermium1.numOwned++;

                if(depth > 1550)
                {
                    fermium2.numOwned++;
                    if(depth > 1600 && roller > .99) fermium3.numOwned++;
                }
            }
        }


        let possibleBuffs = buffsPurchaseOptions.filter(buff => buff.buffId == 0 || buff.buffId == 4 || buff.buffId == 5 && buff.energyCost >= 700000);
        while(worldResources[NUCLEAR_ENERGY_INDEX].numOwned > 10000000 && possibleBuffs.length > 0)
        {
            let buff = possibleBuffs[rand(0, possibleBuffs.length - 1)];
            if(buff.canPurchase())
            {
                buff.purchase();
            }
        }

    }

    sellMineralsToReachMoneyAmount(targetAmount)
    {
        if(this.autosellAll)
        {
            this.sellAllMinerals();
        }
        else
        {
            this.lockMineralsForBlueprints();
            var i = 1;
            while(money < targetAmount && i < worldResources.length)
            {
                if(worldResources[i].sellValue > 0n)
                {
                    sellMineral(i);
                }
                ++i;
            }
        }
    }

    sellMineralsToReachCapacity()
    {
        if(this.autosellAll)
        {
            if(maxHoldingCapacity() <= capacity) this.sellAllMinerals();
        }
        else
        {
            this.lockMineralsForBlueprints();
            var i = 1;
            while(maxHoldingCapacity() <= capacity && i < worldResources.length)
            {
                if(worldResources[i].sellValue > 0n)
                {
                    sellMineral(i);
                }
                ++i;
            }
        }
    }

    sellAllMinerals()
    {
        this.lockMineralsForBlueprints();
        for(var i in worldResources) sellMineral(i);
    }

    has15Relics = false;
    divinedRelics = 0;
    updateScientists()
    {
        if(depth > 1000)
        {
            for(var i = 0; i < 10; i++)
            {
                equippedRelics[i] = 19;
            }
        }
        var isTrashRelic = (relicid) =>
        {
            //most of these are situationally good, but sim too dumb. I should've of made this 'isGoodRelic', but this list started out small and kept growing
            var trashRelics = [3, 10, 12, 13, 21, 22, 23, 25, 26, 27, 28, 31, 33, 35, 36, 37, 38, 39, 45, 47, 48, 49, 50, 51, 52];
            return trashRelics.includes(relicid);
        }

        for(var scientistIndex = 0; scientistIndex < numActiveScientists(); scientistIndex++)
        {
            if(isOnActiveExcavation(scientistIndex))
            {
                if(isScientistDead(scientistIndex))
                {
                    onClickBuryScientist(scientistIndex);
                }
                else if(isExcavationDone(scientistIndex))
                {
                    if(excavationRewards[activeExcavations[scientistIndex][0]].isRelic)
                    {
                        let relicid = excavationRewards[activeExcavations[scientistIndex][0]].id;
                        if(isRelicInventoryFull() || getNumOfEquippedRelicsWithId(relicid) >= 5 || isTrashRelic(relicid))
                        {
                            forfeitRewardForFinishedExcavation(scientistIndex, true);
                        }
                        else
                        {
                            claimRewardForFinishedExcavation(scientistIndex);
                        }

                    }
                    else
                    {
                        claimRewardForFinishedExcavation(scientistIndex);
                    }
                }
            }
            else
            {
                let maxDifficulty = this.has15Relics ? 25 : 85;
                if(excavationChoices[scientistIndex][1][2] > maxDifficulty)
                {
                    startExcavation(scientistIndex, 0);
                }
                else
                {
                    startExcavation(scientistIndex, rand(0, 1));
                }
            }
        }

        //should actually simulate Book of secrets to do this right
        if(!this.has15Relics)
        {
            this.has15Relics = equippedRelics.filter(id => id != -1).length == 15;
        }
        else
        {
            let numDivinesShouldHave = Math.floor((depth - 1000) / (100 / (depth / 1000)));

            while(this.divinedRelics < numDivinesShouldHave)
            {
                if(excavationRewards[equippedRelics[numDivinesShouldHave - 1]].divineId)
                {
                    equippedRelics[numDivinesShouldHave - 1] = excavationRewards[equippedRelics[numDivinesShouldHave - 1]].divineId;
                }
            }
        }
    }

    caveRewards = 0;
    updateCaves()
    {

        let caves = getActiveCaves();

        for(var i = 0; i < caves.length; i++)
        {
            let cave = caves[i];

            //filters and sorts nodes that have rewards based on distance
            let nodes = cave.getAllChildNodesFromRoot()
                .filter(node => getActiveCaves()[0].getIndexOfRewardsOnNode(node).length > 0)
                .sort((a, b) => a.depth - b.depth)

            while(cave.currentFuel >= 200 && nodes.length > 0)
            {
                var blueprints = [droneBlueprints[0], droneBlueprints[2]];
                var drone = getDroneById(blueprints[rand(0, 1)].craftedItem.item.id);
                var speed = drone.speedMultiplierLevels[drone.level];
                var fuel = drone.totalFuel;
                var fuelUse = drone.fuelUseLevels[drone.level];
                var maxTravelDistance = ((fuel / fuelUse) / CAVE_SYSTEM_DURATION_PER_NODE_SECONDS) * speed;

                //checks whether the stats of the drone are high enough to make it to the node and back;
                var nodesWithinRange = nodes.filter(node => Math.floor(node.depth / 2) < maxTravelDistance);

                //if there are no nodes within the distance just picking any reward node
                var firstChoice = nodesWithinRange[Math.max(0, rand(0, nodesWithinRange.length - 1))];
                var backupnode = nodes[Math.max(0, rand(0, nodes.length - 1))];
                var selectedNode = firstChoice ? firstChoice : backupnode;

                var selectedPath = cave.getPathToNode(selectedNode);
                cave.startDroneOnPath(drone, selectedPath);
                nodes = nodes.filter(node => node != selectedNode);
            }
        }

        treasureStorage.treasure.forEach((treasure, index) => {treasureStorage.grantAndRemove(index); this.caveRewards++})
    }

    checkBattles()
    {
        if(battleWaiting.length > 0)
        {
            depthOfMonster = battleWaiting[1];
            preparebattle(battleWaiting[2], battleWaiting[3]);
            var timeToKillMonster = monsterMaxHP / getTotalDps();
            var timeToKillPlayer = userMaxHP / monsterAtk;
            if(timeToKillMonster < timeToKillPlayer)
            {
                wonBattle();
                battleWaiting = [];
            }
            else
            {
                battleWaiting = [];
            }

        }
    }

    craftGems()
    {
        if(depth < 304) return;

        var blueprintsInCategory = filterBlueprintsByCategory(this.cachedBlueprints, 2);
        blueprintsInCategory = filterBlueprints(blueprintsInCategory, (bp) => !bp.craftedItem.item.isAtMaxLevel());

        if(blueprintsInCategory.length != 0)
        {
            var gemIds = [RED_FORGED_GEM_INDEX, BLUE_FORGED_GEM_INDEX, GREEN_FORGED_GEM_INDEX, PURPLE_FORGED_GEM_INDEX, YELLOW_FORGED_GEM_INDEX];

            for(var i = 0; i < gemIds.length; i++)
            {
                if(worldResources[gemIds[i]].numOwned < 50 && GemForger.canQueueGem(gemIds[i])) 
                {
                    GemForger.addGemToQueue(gemIds[i]);
                }
            }
        }
    }

    initSnapshot()
    {
        getUsedMineralCapacity();
        this.mineralsBeforeMine = BigInt(capacity);
        if(!isCapacityFull())
        {
            isTakingSnapshot = true;
            valueBefore = BigInt(getValueOfMineralsExcludingHe3());
        }
    }

    finishSnapshot(snapshotLengthInMinutes)
    {
        getUsedMineralCapacity();
        mineralsMined.shift();
        mineralsMined.push((BigInt(capacity) - this.mineralsBeforeMine) / BigInt(snapshotLengthInMinutes * 600));
        var valueDelta = (BigInt(getValueOfMineralsExcludingHe3()) - BigInt(valueBefore)) / BigInt(snapshotLengthInMinutes * 600);
        singleMiningLoopValueSnapshot.push(valueDelta);
        if(singleMiningLoopValueSnapshot.length > 10)
        {
            singleMiningLoopValueSnapshot.splice(0, 1);
        }
        timesSinceSnapshot = 0;
        valueBefore = 0n;
        isTakingSnapshot = false;
    }

    downloadCsv()
    {
        let fixedRows = [];
        for(var i = 0; i < rows.length; i++)
        {
            if(rows[i])
            {
                fixedRows[i] = rows[i];
            }
            else
            {
                fixedRows[i] = [];
            }
        }
        //fixedRows.push([exportgametext()]);
        let csvContent = fixedRows.map(e => e.join(",")).join("\n");

        saveContentToFile(`dist/D${simDepth}-S${totalSims}-T${Math.floor(currentTime() / 1000 / 60)}.csv`, csvContent);
    }
}

function runDepthSim(toDepth, numSims)
{
    if(typeof localStorage["numSims"] == "undefined" || localStorage["numSims"] == 0)
    {
        localStorage["totalSims"] = numSims;
        localStorage["numSims"] = numSims;
        localStorage["simDepth"] = toDepth;
        localStorage["simData"] = JSON.stringify(new Array(toDepth + 4).fill(JSON.stringify(new Array(numSims).fill("0"))));
    }

    if(numSims > 0)
    {
        simDepth = toDepth
        totalSims = localStorage["totalSims"];
        currentSim = numSims - 1;
        localStorage["numSims"] = currentSim;
        deleteGame(0)
        createNewGame("sim");

        var sim = new GameSimulator()
        sim.autosellAll = false;
        sim.isLoggingCsv = true;
        sim.allowSleep = false;
        sim.maxSteps = Math.floor(toDepth ** 1.4);
        sim.useDynamicInteractions = true;
        sim.chestOpenChance = 1;
        sim.runUntilCondition(() => {if(depth >= toDepth) {return true;} })
    }
}
