const STAT_OPERATION_DECIMAL_ADD = 1;
const STAT_OPERATION_DECIMAL_SUBTRACT = 2;
const STAT_OPERATION_INTEGER_ADD = 3;

class stat
{
    id;
    description;
    operation;
    maximumImpact;

    constructor(id, description, operation, maximumImpact = Number.MAX_SAFE_INTEGER)
    {
        this.id = id;
        this.description = description;
        this.operation = operation;
        this.maximumImpact = maximumImpact;
    }

    getTooltip(amount)
    {
        return _(this.description, amount);
    }

    getStatInfo()
    {
        let desc = '';

        if(this.operation == STAT_OPERATION_DECIMAL_ADD || this.operation == STAT_OPERATION_DECIMAL_SUBTRACT)
        {
            let value = Math.floor(Math.abs(STAT.totalValue(this)) * 100)
            desc = _("Current Amount: {0}%", value)

            if(this.maximumImpact != Number.MAX_SAFE_INTEGER)
            {
                desc += _("<br>Maximum Amount: {0}%", Math.floor(this.maximumImpact * 100))
            }
        }
        else
        {
            let value = Math.floor(Math.abs(STAT.totalValue(this)))
            desc = _("Current Amount: {0}", value)

            if(this.maximumImpact != Number.MAX_SAFE_INTEGER)
            {
                desc += _("<br>Maximum Amount: {0}", this.maximumImpact)
            }
        }

        return desc;
    }
}

var MINER_SPEED_MULTIPLIER = new stat(0, "Increases miner speed by {0}%", STAT_OPERATION_DECIMAL_ADD);
var SELL_PRICE_MULTIPLIER = new stat(1, "Increases sell price of all minerals and isotopes by {0}%", STAT_OPERATION_DECIMAL_ADD);
var CHEST_SPAWN_FREQUENCY = new stat(2, "Increases chest spawn frequency by {0}%", STAT_OPERATION_DECIMAL_ADD);
var BATTLE_DAMAGE_MULTIPLIER = new stat(3, "Increases all battle damage by {0}%", STAT_OPERATION_DECIMAL_ADD);
var PIKE_HOURS = new stat(4, "Each new KM depth reached grants {0}hrs worth of your highest mineral unlocked", STAT_OPERATION_INTEGER_ADD, 48);
var SCIENTIST_EXPERIENCE_MULTIPLIER = new stat(5, "Increases the experience gain of scientist excavations by {0}%", STAT_OPERATION_DECIMAL_ADD);
var GOLD_CHEST_SPAWN_FREQUENCY_MULTIPLIER = new stat(6, "Increases the current spawn rate of golden chests by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, .8);
var DRILL_SPEED_MULTIPLIER = new stat(7, "Increases drill speed by {0}%", STAT_OPERATION_DECIMAL_ADD);
var BLUEPRINT_PRICE_MULTIPLIER = new stat(8, "Decreases blueprint purchase price by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, 0.8);

var INCREASED_EXCAVATION_SUCCESS_RATE_PERCENT = new stat(9, "Increases all excavation success rates by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, .75);

var BATTLE_HEALTH_MULTIPLIER = new stat(10, "Increases battle max health by {0}%", STAT_OPERATION_DECIMAL_ADD);
var WEAPON_SPEED_MULTIPLIER = new stat(11, "Increases battle weapon speed by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, 0.5);
var SCIENTIST_RESURRECTION_PERCENT_CHANCE = new stat(12, "Increases chance a scientist will immediately be rescued by {0}%", STAT_OPERATION_INTEGER_ADD);
var GEM_SPEED_MULTIPLIER = new stat(13, "Decrease gem crafting time by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, 0.75);
var BUILDING_MATERIAL_CHANCE_MULTIPLIER = new stat(14, "Increases the chance of finding building materials in basic chests by {0}%", STAT_OPERATION_DECIMAL_ADD);
var PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE = new stat(15, "Increases chance of selling for 2x the price when selling minerals and isotopes by {0}%", STAT_OPERATION_INTEGER_ADD);
var ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER = new stat(16, "Increases the chance of finding isotopes by {0}%", STAT_OPERATION_DECIMAL_ADD);
var CHEST_MONEY_MULTIPLIER = new stat(17, "Increases money from treasure chests by {0}%", STAT_OPERATION_DECIMAL_ADD);
var TIMELAPSE_DURATION_MULTIPLIER = new stat(18, "Increases all timelapse durations by {0}%", STAT_OPERATION_DECIMAL_ADD, 1);
var OIL_GENERATION_MULTIPLIER = new stat(19, "Increases the rate of oil generation by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, 0.8);
var MINER_UPGRADE_AND_HIRE_COST_MULTIPLIER = new stat(20, "Decreases miner upgrade and hire costs by {0}%", STAT_OPERATION_DECIMAL_SUBTRACT, 0.8);
var BUFF_DURATION_MULTIPLIER = new stat(21, "Increase the duration of buffs by {0}%", STAT_OPERATION_DECIMAL_ADD);
var CARGO_CAPACITY_MULTIPLIER = new stat(22, "Increases cargo capacity by {0}%", STAT_OPERATION_DECIMAL_ADD);
var BATTLE_CRIT_CHANCE_PERCENT = new stat(23, "Increase chance of a critical hit (2x damage) during battle by {0}%", STAT_OPERATION_INTEGER_ADD, 100);
var OFFLINE_PROGRESS_DURATION_MULTIPLIER = new stat(24, "Increases maximum duration of offline progress by {0}%", STAT_OPERATION_DECIMAL_ADD);
var MINERAL_DEPOSIT_CHANCE = new stat(25, "Increases Mineral Deposit spawn chance by {0}%", STAT_OPERATION_DECIMAL_ADD);
var ADDITIONAL_MINERAL_DEPOSITS = new stat(26, "Increases the maximum number of mineral deposits can be in the world by {0}", STAT_OPERATION_INTEGER_ADD);
var RELIC_MULTIPLIER = new stat(27, "Increases the effectiveness of your relics by {0}%", STAT_OPERATION_DECIMAL_ADD);

var UNUSED_STAT = new stat(900, "", STAT_OPERATION_DECIMAL_ADD);

class stats
{
    //Get Relics Value
    relicValue(type)
    {
        if(type == 27) return 0; //no recursion with relic multiplier
        var result = 0;
        for(var i = 0; i < maxRelicSlots; i++)
        {
            var relicId = equippedRelics[i];
            if(relicId > -1)
            {
                if(excavationRewards[relicId].statType.id == type)
                {
                    result += excavationRewards[relicId].amount;
                }
            }
        }
        return result * STAT.relicMultitiplier();
    }

    //Get Buffs Value
    buffValue(type)
    {
        return buffs.getBuffValue(type);
    }

    //Get Super Miner Value
    superMinerValue(type)
    {
        return superMinerManager.getStatBonus(type);
    }

    //Get Buff and Relic Value
    totalValue(stat)
    {

        var value = this.relicValue(stat.id) + this.buffValue(stat.id) + this.superMinerValue(stat.id);

        if(stat.operation == STAT_OPERATION_DECIMAL_ADD || stat.operation == STAT_OPERATION_DECIMAL_SUBTRACT)
        {
            value /= 100;
        }
        value = Math.min(stat.maximumImpact, value);

        if(stat.operation == STAT_OPERATION_DECIMAL_SUBTRACT)
        {
            value *= -1;
        }
        return value;
    }

    //###################### STAT GETTERS ######################

    minerSpeedMultiplier()
    {
        return 1 + this.totalValue(MINER_SPEED_MULTIPLIER);
    }

    sellPriceMultiplier()
    {
        return 1 + this.totalValue(SELL_PRICE_MULTIPLIER);
    }

    chestSpawnFrequencyMultiplier()
    {
        return 1 + this.totalValue(CHEST_SPAWN_FREQUENCY);
    }

    battleDamageMultiplier()
    {
        return 1 + this.totalValue(BATTLE_DAMAGE_MULTIPLIER);
    }

    getPikeHours()
    {
        return this.totalValue(PIKE_HOURS);
    }

    scientistExperienceMultiplier()
    {
        return 1 + this.totalValue(SCIENTIST_EXPERIENCE_MULTIPLIER);
    }

    goldChestSpawnFrequencyMultiplier()
    {
        return 1 + this.totalValue(GOLD_CHEST_SPAWN_FREQUENCY_MULTIPLIER);
    }

    drillSpeedMultiplier()
    {
        return 1 + this.totalValue(DRILL_SPEED_MULTIPLIER);
    }

    blueprintPriceMultiplier()
    {
        return 1 + this.totalValue(BLUEPRINT_PRICE_MULTIPLIER);
    }

    increasedExcavationSuccessRatePercent()
    {
        return 1 + this.totalValue(INCREASED_EXCAVATION_SUCCESS_RATE_PERCENT);
    }

    battleHealthMultiplier()
    {
        return 1 + this.totalValue(BATTLE_HEALTH_MULTIPLIER);
    }

    weaponSpeedMultiplier()
    {
        return 1 + this.totalValue(WEAPON_SPEED_MULTIPLIER);
    }

    percentChanceScientistResurrection()
    {
        return 1 + this.totalValue(SCIENTIST_RESURRECTION_PERCENT_CHANCE);
    }

    gemSpeedMultiplier()
    {
        return 1 + this.totalValue(GEM_SPEED_MULTIPLIER);
    }

    increasedRateOfFindingBuildingMaterials()
    {
        return 1 + this.totalValue(BUILDING_MATERIAL_CHANCE_MULTIPLIER);
    }

    percentChanceOfSellingFor2x()
    {
        return this.totalValue(PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE);
    }

    isotopeFindChanceMultiplier()
    {
        return 1 + this.totalValue(ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER);
    }

    chestMoneyMultiplier()
    {
        return 1 + this.totalValue(CHEST_MONEY_MULTIPLIER);
    }

    timelapseDurationMultiplier()
    {
        return 1 + this.totalValue(TIMELAPSE_DURATION_MULTIPLIER);
    }

    oilGenerationMultiplier()
    {
        return 1 + this.totalValue(OIL_GENERATION_MULTIPLIER);
    }

    minerUpgradeAndHireCostMultiplier()
    {
        return 1 + this.totalValue(MINER_UPGRADE_AND_HIRE_COST_MULTIPLIER);
    }

    buffDurationMultiplier()
    {
        return 1 + this.totalValue(BUFF_DURATION_MULTIPLIER);
    }

    cargoCapacityMultiplier()
    {
        return 1 + this.totalValue(CARGO_CAPACITY_MULTIPLIER);
    }

    battleCritChance()
    {
        return this.totalValue(BATTLE_CRIT_CHANCE_PERCENT);
    }

    offlineProgressMaxDurationMultiplier()
    {
        return 1 + this.totalValue(OFFLINE_PROGRESS_DURATION_MULTIPLIER);
    }

    additionalMineralDeposits()
    {
        return this.totalValue(ADDITIONAL_MINERAL_DEPOSITS);
    }

    mineralDepositMultiplier()
    {
        return 1 + this.totalValue(MINERAL_DEPOSIT_CHANCE);
    }

    relicMultitiplier()
    {
        return 1 + this.totalValue(RELIC_MULTIPLIER);
    }
}
var STAT = new stats();