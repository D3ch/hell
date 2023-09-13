const SUPER_MINER_DEPTH = 10;

class SuperMinerManager
{
    baseSuperMiners = [];
    currentSuperMiners = [];
    slots = 2;
    pendingSuperMiner;
    statBonusCache = {};
    cacheTime; //used for determining if cached stat needs to be refreshed.
    recievedInitialSuperMiner = false;

    constructor()
    {

    }

    numSuperMiners()
    {
        return this.currentSuperMiners.length;
    }

    update(dt)
    {
        for(var i = this.numSuperMiners() - 1; i >= 0; i--)
        {
            this.currentSuperMiners[i].update(dt);
        }
    }

    render()
    {
        for(var i = this.numSuperMiners() - 1; i >= 0; i--)
        {
            if(this.currentSuperMiners[i] && this.currentSuperMiners[i].render)
            {
                this.currentSuperMiners[i].render();
            }
        }
    }

    registerBaseMiner(baseMiner)
    {
        this.baseSuperMiners.push(baseMiner);
    }

    addSuperMiner(baseMiner)
    {
        if(!this.isFull() && baseMiner)
        {
            var miner = baseMiner.clone();
            miner.init();
            this.currentSuperMiners.push(miner);
            return miner;
        }
        return null;
    }

    removePendingSuperMiner()
    {
        if(this.pendingSuperMiner)
        {
            this.pendingSuperMiner = null;
            return true;
        }
        return false;
    }

    superMinersOnDepth(d)
    {
        let minersOnDepth = [];

        for(var i = this.numSuperMiners() - 1; i >= 0; i--)
        {
            let miner = this.currentSuperMiners[i];
            if(miner.currentDepth == d) minersOnDepth.push(miner);
        }

        return minersOnDepth;
    }

    buffsForDepth(d)
    {
        let buffs = {
            minerals: 0,
            isotopes: 0
        };

        if(d < 0) return buffs;

        for(var i = this.numSuperMiners() - 1; i >= 0; i--)
        {
            let miner = this.currentSuperMiners[i];

            if(miner.type == superMinerTypes.MINER)
            {
                if(miner.affectedDepth == d)
                {
                    if(miner.subType == "mineral")
                    {
                        buffs.minerals += miner.getMiningSpeed();
                    }
                    else if(miner.subType == "isotope")
                    {
                        buffs.isotopes += miner.getMiningSpeed();
                    }
                }
            }
        }

        return buffs;
    }

    // Filters based on the properties of the base super miner object. isOwned can be filtered for as well.
    // Base super miners that match values in negativeFilters will be excluded
    // E.g., filters = {type: superMinerTypes.MINER, isOwned: false}
    filterBaseSuperMiners(filters, negativeFilters = {}, getAllResults = true)
    {
        if(filters == null) return this.baseSuperMiners;

        var filterFunction = function (miner)
        {
            for(var i in filters)
            {
                if(i == "isOwned")
                {
                    var isOwned = this.isSuperMinerOwned(miner.id);
                    if(isOwned != filters[i])
                    {
                        return false;
                    }
                }
                else if(typeof (miner[i]) == "undefined" || miner[i] != filters[i])
                {
                    // baseSuperMiner value is not defined or does not match the filter value
                    return false;
                }
            }
            for(var i in negativeFilters)
            {
                if(i == "isOwned")
                {
                    var isOwned = this.isSuperMinerOwned(miner.id);
                    if(isOwned == filters[i])
                    {
                        return false;
                    }
                }
                else if(typeof (miner[i]) != "undefined" && miner[i] == negativeFilters[i])
                {
                    // baseSuperMiner value is defined and matches the filter value
                    return false;
                }
            }
            return true;
        }.bind(this)

        var searchFunction = getAllResults ? "filter" : "find";
        let possibleMiners = this.baseSuperMiners[searchFunction](filterFunction);

        return possibleMiners;
    }

    isSuperMinerOwned(id)
    {
        return typeof (this.currentSuperMiners.find((ownedMiner) => ownedMiner.id == id)) != "undefined";
    }

    getRandomBaseSuperMiner(filters = null, negativeFilters = {})
    {
        let possibleMiners = this.filterBaseSuperMiners(filters, negativeFilters);
        return possibleMiners[blackChestRewardRoller.rand(0, possibleMiners.length - 1)];
    }

    removeSuperMinerById(id)
    {
        this.currentSuperMiners = this.currentSuperMiners.filter(miner => miner.uniqueId != id);
    }

    getSuperMinerById(id)
    {
        return this.filterBaseSuperMiners({id: id}, {}, false);
    }

    isFull()
    {
        return this.numSuperMiners() >= this.slots;
    }

    nextSlotCost()
    {
        let slotNum = this.slots;
        return Math.round((((slotNum ** 1.5) * Math.log10(slotNum)) * 35) / 5) * 5;
    }

    canUpgradeSlot()
    {
        return worldResources[SUPER_MINER_SOULS_INDEX].numOwned >= this.nextSlotCost();
    }

    upgradeSlots()
    {
        worldResources[SUPER_MINER_SOULS_INDEX].numOwned -= this.nextSlotCost();
        this.slots++;
    }

    dirtyCache()
    {
        this.cacheTime = currentTime();
    }

    //figured this function may cause some lag with timelapse/offline progress/simulating so decided to cache it. It was one of the most performance intensive things when profiling
    getStatBonus(id)
    {
        if(typeof this.statBonusCache[id] == "undefined" || this.statBonusCache[id].cacheTime < this.cacheTime)
        {
            let bonusAmount = 0;

            for(var i = 0; i < this.numSuperMiners(); i++)
            {
                let miner = this.currentSuperMiners[i];

                if(miner.statBonuses)
                {
                    for(var n = 0; n < miner.statBonuses.length; n++)
                    {
                        let stat = miner.statBonuses[n];

                        if(stat.id == id)
                        {
                            bonusAmount += stat.amount();
                        }
                    }
                }
            }

            this.statBonusCache[id] = {
                "amount": bonusAmount,
                "cacheTime": currentTime()
            }
        }

        return this.statBonusCache[id].amount;
    }

    get saveState()
    {
        var saveArray = [this.slots];
        for(var i = 0; i < this.numSuperMiners(); i++)
        {
            saveArray.push(this.currentSuperMiners[i].getSaveString());
        }
        return saveArray.join("*");
    }

    set saveState(value)
    {
        if(value != "")
        {
            var saveArray = value.split("*");
            this.slots = parseInt(saveArray[0]);
            for(var i = 1; i < saveArray.length; i++)
            {
                var minerStats = saveArray[i].split("!");
                var baseMiner = this.getSuperMinerById(minerStats[0]);
                var miner = this.addSuperMiner(baseMiner);
                miner.restore(minerStats);
            }
        }
    }

    debugAddRandomSuperMiner(filters = null)
    {
        var miner = this.getRandomBaseSuperMiner(filters);
        if(miner)
        {
            if(this.isFull()) this.slots++;
            this.addSuperMiner(miner);
            return true;
        }
        return false;
    }

    addAllSuperMiners()
    {
        this.currentSuperMiners = [];
        this.baseSuperMiners.forEach(miner =>
        {
            this.addSuperMiner(miner);
            this.slots++;
        })

        this.currentSuperMiners.sort((a, b) => a.rarity.id - b.rarity.id)
    }
}

var superMinerManager = new SuperMinerManager();