class ChestService
{
    chests = [];
    numChests = 0;
    chestRewardText = "";
    foundGoldChest = false;
    chestsStored = 0; // DEPRECATED
    storedChests = [];
    totalBasicChestsOpened = 0;
    totalGoldChestsOpened = 0;
    totalBlackChestsOpened = 0;
    totalMoneyFromChests = 0n;
    baseBasicChestsPerGoldChest = 50;
    chestPopupEnabled = true;

    getTotalChests()
    {
        return this.chests.reduce(total => ++total, 0);
    }

    hasUnclaimedChests()
    {
        return this.getTotalChests() > 0;
    }

    getChestsAtDepth(worldDepth)
    {
        return this.chests.filter(chest => chest.depth == worldDepth);
    }

    getChest(worldDepth, worker = -1)
    {
        for(var i = 0; i < this.chests.length; i++)
        {
            let chest = this.chests[i];
            if(chest.depth == worldDepth && (worker == -1 || chest.worker == worker))
            {
                return chest;
            }
        }
    }

    chestExistsAtDepth(worldDepth)
    {
        return this.getChestsAtDepth(worldDepth).length > 0;
    }

    removeAllChests()
    {
        this.chests = [];
    }

    removeChestsBySource(source)
    {
        this.chests = this.chests.filter((chest) => chest.source != source.name);
    }

    removeChest(depth, worker)
    {
        this.chests = this.chests.filter((chest) => chest.depth != depth || chest.worker != worker);
    }

    forEachChest(callback)
    {
        this.chests.forEach(callback);
    }

    userHasFoundGoldenChest()
    {
        return this.foundGoldChest;
    }

    getChestRewardText()
    {
        return this.chestRewardText;
    }

    getAvailableMiners(spawnDepth)
    {
        var availableMiners = [];

        for(var i = workersHiredAtDepth(spawnDepth); i > 0; i--)
        {
            if(!this.getChest(spawnDepth, i))
            {
                availableMiners.push(i);
            }
        }
        return availableMiners;
    }

    spawnRandomChests()
    {
        var maxTenthOfDepth = Math.floor(depth / 10);

        for(var x = 3; x <= maxTenthOfDepth; x++)
        {
            if(this.rollForBasicChest())
            {
                this.spawnChestAtRandomDepth(Chest.natural);
                console.log("spawnChestAtRandomDepth");
            }
        }
    }

    rollForBasicChest(multiplier = 0) //runs for every 10 depth
    {
        let baseRand = 3000;
        var chanceAtDepth; //higher = lower chance of spawn

        if(depth < 1000)
        {
            chanceAtDepth = baseRand + ((depth - 300) / 2);
        }
        else
        {
            chanceAtDepth = (baseRand + ((1000 - 300) / 2)) * (depth / 1000);
        }
        let chestRoller = Math.floor(chestSpawnRoller.randFloat() * chanceAtDepth);
        let chestThreshold = ((worldAtDepth(0).workersHired * 2) + 1) * (STAT.chestSpawnFrequencyMultiplier() + multiplier); //21

        return chestRoller < chestThreshold;
    }

    spawnChestAtRandomDepth(source)
    {
        var spawnDepth = rand(1, depth);
        var availableMiners = this.getAvailableMiners(spawnDepth);
        var miner = availableMiners[rand(0, availableMiners.length - 1)];
        var isValidSpawnSettings = !isDepthWithoutWorkers(spawnDepth) && !isBossLevel(spawnDepth) && miner;

        if(isValidSpawnSettings)
        {
            this.spawnChest(spawnDepth, source, this.rollForSpecialChest(), miner);
            console.log("spawnChest");
        }
        else if(rand(0,2) != 0) //allow an out to prevent infinite recursion
        {
            //reroll
            this.spawnChestAtRandomDepth(source);
            console.log("reroll");
        }
    }

    spawnChest(spawnDepth, source = Chest.natural, type = ChestType.basic, miner = -1)
    {
        var isCollectable = (source == Chest.natural || source == Chest.superminer) && !this.isChestCollectorFull();
        var collectionRoll = (chestSpawnRoller.rand(1, 100) <= this.getStoredChestsChance());
        let chanceOfCollision = (this.chests.length + 1) / (depth / 10); //this is here to simulate how chest spawns acted in the old system.
        var canSpawnInWorld = source != Chest.natural || !chestSpawnRoller.boolean(chanceOfCollision);

        
        console.log("spawnChest - "+canSpawnInWorld+" - "+chanceOfCollision+" - "+collectionRoll);

        if(isCollectable && collectionRoll)
        {
            this.storeChest(type);
            return true;
        }
        else if(canSpawnInWorld)
        {
            //check if miner already has a chest or is an invalid index
            if(miner < 0 || this.getChest(spawnDepth, miner) || miner > workersHiredAtDepth(spawnDepth))
            {
                var availableMiners = this.getAvailableMiners(spawnDepth);
                var minerIndex = rand(0, availableMiners.length - 1);
                miner = availableMiners[minerIndex];
            }
            var newChest = source.new(source, spawnDepth, miner, type);
            this.chests.push(newChest);
            return newChest;
        }

        return false;
    }

    rollForSpecialChest()
    {
        let goldenChestChance = randRoundToInteger(1580 * STAT.goldChestSpawnFrequencyMultiplier()); //1 in 158
        let canSpawnGoldenChest = chestSpawnRoller.rand(0, goldenChestChance) <= 10;

        let canSpawnBlackChest = chestSpawnRoller.rand(0, 7900) <= 10;

        if(canSpawnBlackChest)
        {
            return ChestType.black;
        }
        else if(canSpawnGoldenChest)
        {
            return ChestType.gold;
        }
        else
        {
            return ChestType.basic;
        }
    }

    presentChest(spawnDepth, workerNum = -1)
    {
        let chest = this.getChest(spawnDepth, workerNum);
        if(typeof chest == "undefined" && metalDetectorStructure.level >= 5)
        {
            chest = this.getChestsAtDepth(spawnDepth)[0];
        }

        if(!isSimulating && !keysPressed["Shift"] && chestService.chestPopupEnabled)
        {
            openUiWithoutClosing(ChestWindow, null, chest);
        }
        else
        {
            this.giveChestReward(chest);
            newNews(_("You got {0} from a Chest!", chestService.getChestRewardText()), true);
        }

        trackEvent_FoundChest(chest.type)
    }

    giveChestReward(chest, saveGameOnOpen = true)
    {

        if(chest.type == ChestType.gold)
        {
            this.foundGoldChest = true;
            this.chestRewardText = goldChestRewards.rollForRandomReward();
            this.totalGoldChestsOpened++;
        }
        else if(chest.type == ChestType.black)
        {
            this.chestRewardText = blackChestRewards.rollForRandomReward();
            this.totalBlackChestsOpened++;
        }
        else if(chest.type == ChestType.basic)
        {
            this.chestRewardText = basicChestRewards.rollForRandomReward();
            this.totalBasicChestsOpened++;
        }

        this.removeChest(chest.depth, chest.worker);

        if(saveGameOnOpen)
        {
            savegame();
        }
    }

    // CHEST STORAGE

    storeChest(chestType)
    {
        if(this.storedChests[chestType])
        {
            this.storedChests[chestType]++;
        }
        else
        {
            this.storedChests[chestType] = 1;
        }
    }

    grantStoredChest(chestType)
    {
        if(this.storedChests[chestType] > 0)
        {
            this.storedChests[chestType]--;
        }
        else
        {
            return;
        }
        chestService.spawnChest(0, Chest.metaldetector, chestType);
        chestService.presentChest(0);
    }

    getMaxStoredChests()
    {
        if(chestCollectorStorageStructure.level > 0)
        {
            return chestCollectorStorageStructure.statValueForCurrentLevel();
        }
        return 0;
    }

    getTotalStoredChests()
    {
        var total = 0;
        for(var i in this.storedChests)
        {
            total += this.storedChests[i];
        }
        return total;
    }

    getStoredChestsOfType(chestType)
    {
        if(this.storedChests[chestType])
        {
            return this.storedChests[chestType];
        }
        return 0;
    }

    isChestCollectorFull()
    {
        return this.getMaxStoredChests() <= this.getTotalStoredChests();
    }

    getStoredChestsChance()
    {
        if(chestCollectorStorageStructure.level > 0)
        {
            return chestCollectorChanceStructure.statValueForCurrentLevel();
        }
        return 0;
    }

    migrateDeprecatedChestStorage()
    {
        for(var i = 0; i < this.chestsStored; ++i)
        {
            this.storeChest(this.rollForGoldenChest() ? ChestType.gold : ChestType.basic);
        }
        this.chestsStored = 0;
    }

    testChestCollector(chestsToSpawn)
    {
        var chestsSpawned = 0;
        this.storedChests = [];
        for(var i = 0; i < chestsToSpawn; ++i)
        {
            chestsSpawned++;
            this.spawnChestAtRandomDepth(Chest.natural);
            if(this.isChestCollectorFull())
            {
                break;
                // chestsCollected += this.getTotalStoredChests();
                // this.storedChests = {};
            }
        }
        console.log(this.storedChests);
        console.log(this.getTotalStoredChests() / chestsSpawned);
        this.removeChestsBySource(Chest.natural);
    }

    testChestSpawnsForTime(minutes)
    {
        //runs 1000 tests of natural spawn ticks over the given period of time
        var chestResults = [[], [], []];
        chestCollectorChanceStructure.level = 10;
        chestCollectorChanceStructure.leveledStats[0].perLvlValue[9] = 100;
        chestCollectorStorageStructure.level = 10;
        chestCollectorStorageStructure.leveledStats[0].perLvlValue[9] = 10000;
        var expectedSpawnTicks = minutes * 2;

        for(var testNumber = 0; testNumber < 200; testNumber++)
        {
            this.chests = [];
            this.storedChests[0] = 0;
            this.storedChests[1] = 0;
            this.storedChests[2] = 0;
            for(var i = 0; i < expectedSpawnTicks; i++)
            {
                this.spawnRandomChests();
            }

            chestResults[0][testNumber] = this.storedChests[0];
            chestResults[1][testNumber] = this.storedChests[1];
            chestResults[2][testNumber] = this.storedChests[2];
        }

        console.log("average chest spawns for " + minutes + " minutes")
        console.log("basic chests: " + calculateAverageOfArray(chestResults[0]));
        console.log("golden chests: " + calculateAverageOfArray(chestResults[1]));
        console.log("ethereal chests: " + calculateAverageOfArray(chestResults[2]));

    }
}

const chestService = new ChestService();