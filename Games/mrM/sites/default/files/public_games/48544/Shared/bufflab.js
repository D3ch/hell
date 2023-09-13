class BuffLab
{
    totalBuffsCasted = 0;
    totalSecsBuffed = 0;
    maxConsecutiveSecondsBuffed = 0;
    buffLabLevels = [
        {},
        {
            cost: 0,
            buffDiscount: 0
        },
        {
            cost: 400000,
            buffDiscount: 0.1
        },
        {
            cost: 3000000,
            buffDiscount: 0.2
        },
        {
            cost: 5000000,
            buffDiscount: 0.25
        },
        {
            cost: 8000000,
            buffDiscount: 0.30
        }
    ];

    isMaxLevel()
    {
        return buffLabStructure.level >= this.buffLabLevels.length;
    }

    currentDiscount()
    {
        return this.buffLabLevels[buffLabStructure.level].buffDiscount;
    }

    nextLevelDiscount()
    {
        if(!this.isMaxLevel())
        {
            return this.buffLabLevels[buffLabStructure.level + 1].buffDiscount;
        }
        else
        {
            return this.buffLabLevels[buffLabStructure.level].buffDiscount;
        }
    }
}
var bufflab = new BuffLab();

class BuffPurchaseOption
{
    buffId;
    tier;
    durationSeconds;
    statBuffAmount;
    energyCost;

    staticBuff()
    {
        return buffs.getStaticBuffById(this.buffId);
    }

    modifiedEnergyCost()
    {
        return this.energyCost * (1 - bufflab.currentDiscount());
    }

    canPurchase()
    {
        return this.modifiedEnergyCost() <= numStoredNuclearEnergyOwned();
    }

    formattedDescription()
    {
        return _(this.staticBuff().description, this.statBuffAmount, Math.round(this.durationSeconds / 60));
    }

    purchase()
    {
        if(this.canPurchase())
        {
            worldResources[NUCLEAR_ENERGY_INDEX].numOwned -= this.modifiedEnergyCost();
            bufflab.totalBuffsCasted++;
            buffs.startBuff(this.buffId, this.durationSeconds, "BuffLab", this.statBuffAmount, this.tier);
        }
    }
}
var buffsPurchaseOptions = [];

//Miner speed buffs

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 0;
newBuff.durationSeconds = 300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 10000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 0;
newBuff.durationSeconds = 3300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 100000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 0;
newBuff.durationSeconds = 36300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 1000000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);


//Drill speed buffs

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 5;
newBuff.durationSeconds = 600;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 18000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 5;
newBuff.durationSeconds = 6600;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 180000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 5;
newBuff.durationSeconds = 72500;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 1800000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);


//Chests gold

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 4;
newBuff.durationSeconds = 60;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 30000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 4;
newBuff.durationSeconds = 660;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 300000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 4;
newBuff.durationSeconds = 7260;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 3000000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);


//Elemental Pike

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 3;
newBuff.durationSeconds = 300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 20000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 3;
newBuff.durationSeconds = 3300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 200000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 3;
newBuff.durationSeconds = 36300;
newBuff.statBuffAmount = 100;
newBuff.energyCost = 2000000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

//Cargo Capacity

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 7;
newBuff.durationSeconds = 3600;
newBuff.statBuffAmount = 50;
newBuff.energyCost = 500000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 7;
newBuff.durationSeconds = 12960;
newBuff.statBuffAmount = 50;
newBuff.energyCost = 1650000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 7;
newBuff.durationSeconds = 46680;
newBuff.statBuffAmount = 50;
newBuff.energyCost = 5500000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

//Endless Gem Speed Potion

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 8;
newBuff.durationSeconds = 900;
newBuff.statBuffAmount = 20;
newBuff.energyCost = 25000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 8;
newBuff.durationSeconds = 9900;
newBuff.statBuffAmount = 20;
newBuff.energyCost = 250000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);

var newBuff = new BuffPurchaseOption();
newBuff.buffId = 8;
newBuff.durationSeconds = 108900;
newBuff.statBuffAmount = 20;
newBuff.energyCost = 2500000;
newBuff.tier = 1;
buffsPurchaseOptions.push(newBuff);
