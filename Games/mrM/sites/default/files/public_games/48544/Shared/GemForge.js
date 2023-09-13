const FORGE_MAX_LEVEL = 10;
const FORGE_LEVEL_STATS = [
    {},
    {
        "level": 1,
        "load": 6,
        "upgradeMoneyCost": 1000000000000, //1t
        "upgradeOilCost": 16
    },
    {
        "level": 2,
        "load": 8,
        "upgradeMoneyCost": 4000000000000, //4t
        "upgradeOilCost": 200
    },
    {
        "level": 3,
        "load": 12,
        "upgradeMoneyCost": 50000000000000, //50t
        "upgradeOilCost": 2000
    },
    {
        "level": 4,
        "load": 20,
        "upgradeMoneyCost": 500000000000000, //500t
        "upgradeOilCost": 4500
    },
    {
        "level": 5,
        "load": 25,
        "upgradeMoneyCost": 6000000000000000, //6q
        "upgradeOilCost": 6000
    },
    {
        "level": 6,
        "load": 30,
        "upgradeMoneyCost": 100000000000000000, //100q
        "upgradeOilCost": 8000
    },
    {
        "level": 7,
        "load": 35,
        "upgradeMoneyCost": 1000000000000000000, //1Q
        "upgradeOilCost": 11000
    },
    {
        "level": 8,
        "load": 40,
        "upgradeMoneyCost": 50000000000000000000, //50Q
        "upgradeOilCost": 15000
    },
    {
        "level": 9,
        "load": 45,
        "upgradeMoneyCost": 1000000000000000000000, //1s
        "upgradeOilCost": 20000
    },
    {
        "level": 10,
        "load": 50,
        "upgradeMoneyCost": 0,
        "upgradeOilCost": 0
    }
];
const CATALYST_CRAFT_RATE = 0.8;

var forgeGemBlueprintsById = [];
forgeGemBlueprintsById[RED_FORGED_GEM_INDEX] = getBlueprintById(4, 0);
forgeGemBlueprintsById[BLUE_FORGED_GEM_INDEX] = getBlueprintById(4, 1);
forgeGemBlueprintsById[GREEN_FORGED_GEM_INDEX] = getBlueprintById(4, 2);
forgeGemBlueprintsById[PURPLE_FORGED_GEM_INDEX] = getBlueprintById(4, 3);
forgeGemBlueprintsById[YELLOW_FORGED_GEM_INDEX] = getBlueprintById(4, 4);
forgeGemBlueprintsById[FORGE_CATALYST_INDEX] = getBlueprintById(4, 5);
function getGemBlueprintForGemId(gemId)
{
    return forgeGemBlueprintsById[gemId];
}

class QueuedGem
{
    gemResourceId;
    totalTime;
    remainingTime;
    blueprint;
    forgeWorkloadBase;
    icon;
    numCatalystsApplied = 0;

    constructor(gemResourceId)
    {
        this.gemResourceId = gemResourceId;
        this.blueprint = getGemBlueprintForGemId(gemResourceId);
        this.totalTime = this.blueprint.forgeTimeSeconds * STAT.gemSpeedMultiplier();
        this.remainingTime = this.totalTime;
        this.forgeWorkloadBase = this.blueprint.forgeCost;
        this.icon = this.blueprint.craftedItem.item.getIcon();
    }

    catalystAdjustedForgeSpeed()
    {
        return 1 / Math.pow(CATALYST_CRAFT_RATE, this.numCatalystsApplied);
    }

    remainingTimeAfterCatalysts()
    {
        return this.remainingTime / this.catalystAdjustedForgeSpeed();
    }

    forgeWorkload()
    {
        return this.forgeWorkloadBase + this.numCatalystsApplied;
    }

    percentComplete()
    {
        return 1 - (this.remainingTime / this.totalTime);
    }

    isComplete()
    {
        return this.remainingTime <= 0;
    }

    update(seconds)
    {
        this.remainingTime -= (seconds * this.catalystAdjustedForgeSpeed());
    }

    grant()
    {
        this.blueprint.craftedItem.item.onForged();
        newNews(_("{0} crafting complete", worldResources[this.gemResourceId].name));
    }

    applyCatalyst()
    {
        if(numforgeCatalystsOwned() > 0)
        {
            worldResources[FORGE_CATALYST_INDEX].numOwned--;
            this.numCatalystsApplied++;
        }
    }
}

class GemForgeQueue
{
    queuedGems = [];

    constructor()
    {

    }

    updateQueuedGems(seconds)
    {
        this.forEachQueuedGem((queuedGem, index) =>
        {
            queuedGem.update(seconds);
        });

        this.forEachQueuedGem((queuedGem, index) =>
        {
            if(queuedGem.isComplete())
            {
                queuedGem.grant();
                this.dequeuFinishedGems(index);
            }
        });
    }

    dequeuFinishedGems(index)
    {
        this.queuedGems.splice(index, 1);
    }

    addGemToQueue(gemId)
    {
        var queuedGem = new QueuedGem(gemId);
        this.queuedGems.push(queuedGem);
    }

    forEachQueuedGem(callback)
    {
        this.queuedGems.forEach(callback);
    }

    currentLoad()
    {
        var result = 0;
        this.forEachQueuedGem((queuedGem, index) =>
        {
            result += queuedGem.forgeWorkload();
        });
        return result;
    }
}

class GemForge
{
    forgeQueue = null;

    constructor()
    {
        this.forgeQueue = new GemForgeQueue();
    }

    set queueSaveValue(value)
    {
        //Load in the value
        this.forgeQueue.queuedGems = [];
        var values = value === '' ? [] : value.split("!"); //gemId, remainingTime, numCatalysts
        for(var i = 0; i < values.length; i += 3)
        {
            var gemId = parseInt(values[i]);
            var remainingTime = parseInt(values[i + 1]);
            var numCatalystsApplied = parseInt(values[i + 2]);

            var newQueuedGem = new QueuedGem(gemId);
            newQueuedGem.remainingTime = remainingTime;
            newQueuedGem.numCatalystsApplied = numCatalystsApplied;
            this.forgeQueue.queuedGems.push(newQueuedGem);
        }
    }

    get queueSaveValue()
    {
        //Provide parsed value for save
        let toSave = [];

        for(var i = 0; i < this.forgeQueue.queuedGems.length; i++)
        {
            toSave.push(this.forgeQueue.queuedGems[i].gemResourceId);
            toSave.push(this.forgeQueue.queuedGems[i].remainingTime);
            toSave.push(this.forgeQueue.queuedGems[i].numCatalystsApplied);
        }

        return toSave.join("!");
    }

    isAtMaxLevel()
    {
        return gemForgeStructure.level >= FORGE_MAX_LEVEL;
    }

    levelUpMoneyCost()
    {
        return FORGE_LEVEL_STATS[gemForgeStructure.level].upgradeMoneyCost;
    }

    levelUpOilCost()
    {
        return FORGE_LEVEL_STATS[gemForgeStructure.level].upgradeOilCost;
    }

    levelUpWorkloadIncrease()
    {
        if(!gemForgeStructure.isMaxLevel())
        {
            return FORGE_LEVEL_STATS[gemForgeStructure.level + 1].load - this.currentMaxLoad();
        }
        else
        {
            return 0;
        }
    }

    update(seconds)
    {
        this.forgeQueue.updateQueuedGems(seconds);
    }

    currentMaxLoad()
    {
        return FORGE_LEVEL_STATS[gemForgeStructure.level].load;
    }

    currentLoad()
    {
        return this.forgeQueue.currentLoad();
    }

    potentialAdditionalLoad()
    {
        return this.currentMaxLoad() - this.currentLoad();
    }

    canApplyCatalyst()
    {
        return this.potentialAdditionalLoad() > 0 && numforgeCatalystsOwned() > 0;
    }

    canQueueGem(gemId)
    {
        var gemBlueprint = getGemBlueprintForGemId(gemId);
        return gemBlueprint.forgeCost <= this.potentialAdditionalLoad() && canCraftBlueprint(gemBlueprint.category, gemBlueprint.id);
    }

    addGemToQueue(gemId)
    {
        if(this.canQueueGem(gemId))
        {
            var gemBlueprint = getGemBlueprintForGemId(gemId);
            if(craftBlueprint(gemBlueprint.category, gemBlueprint.id))
            {
                this.forgeQueue.addGemToQueue(gemId);
            }
        }
    }
}
var GemForger = new GemForge();