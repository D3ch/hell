class ChestCompressor
{
    queuedChests = [];

    chestStats = {
        [ChestType.gold]: {
            paymentType: ChestType.basic,
            cost: () => chestCompressorStructure.statValueForCurrentLevel(0),
            time: () => chestCompressorTimeStructure.statValueForCurrentLevel(0) * 60 * 60
        },
        [ChestType.black]: {
            paymentType: ChestType.gold,
            cost: () => chestCompressorStructure.statValueForCurrentLevel(1),
            time: () => chestCompressorTimeStructure.statValueForCurrentLevel(1) * 60 * 60
        }
    }

    update(dt)
    {
        for(var i = this.queuedChests.length; i > 0; i--)
        {
            this.queuedChests[i - 1][1] -= dt;

            if(this.queuedChests[i - 1][1] <= 0)
            {
                this.grantChestAndRemoveFromQueue(i - 1);
            }
        }
    }

    ticketCost(index)
    {
        let seconds = this.queuedChests[index][1]
        if(seconds < 604800)
        {
            return Math.round((-0.000000000026 * Math.pow(seconds, 2)) + (0.000031940559 * seconds) + 1)
        }
        else
        {
            return Math.round(10.8 * math.sqrt(seconds / 604800))
        }
    }

    grantChestAndRemoveFromQueue(index)
    {
        let chestType = this.queuedChests[index][0];
        chestService.storeChest(chestType);

        if(chestType == 1)
        {
            newNews(_("A Gold Chest finished compressing and has been added to your chest storage"));
        }
        else if(chestType == 2)
        {
            newNews(_("An Ethereal Chest finished compressing and has been added to your chest storage"));
        }

        this.queuedChests.splice(index, 1);
    }

    canQueueChest(type)
    {
        let stats = this.chestStats[type];

        return chestService.storedChests[stats.paymentType] >= stats.cost() && this.queuedChests.length < this.getSlotCount();
    }

    addChestToQueue(type)
    {
        let stats = this.chestStats[type];

        if(this.canQueueChest(type))
        {
            chestService.storedChests[stats.paymentType] -= stats.cost();
            this.queuedChests.push([type, stats.time()])

            questManager.getQuest(72).markComplete();
        }
    }

    getSlotCount()
    {
        return chestCompressorSlotStructure.statValueForCurrentLevel();
    }

    get saveState()
    {
        var saveArray = [];
        for(var i = 0; i < this.queuedChests.length; i++)
        {
            saveArray.push(this.queuedChests[i].join("!"));
        }
        return saveArray.join("*");
    }

    set saveState(value)
    {
        if(value != "")
        {
            var saveArray = value.split("*");
            for(var i = 0; i < saveArray.length; i++)
            {
                this.queuedChests.push(saveArray[i].split("!"))
            }
        }
    }
}

var chestCompressor = new ChestCompressor();