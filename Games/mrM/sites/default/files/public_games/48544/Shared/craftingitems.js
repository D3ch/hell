// Interface for crafting items
// Crafting items act as ingredients or rewards in crafting
class CraftingItem
{
    id;
    constructor() { }

    getQuantityOwned() { }
    hasQuantity() { }
    canCraft() { }
    getNotCraftableReason() { }
    spendQuantity() { }
    grantQuantity() { }
    upgradeToLevel() { }
    getCurrentLevel() { }
    getMaxLevel() { }
    getIcon() { }
    getName() { }
    getDescription() { }
    getFormattedQuantity() { }
}

class BackpackCraftingItem extends CraftingItem
{
    id;

    constructor(backpackItemId)
    {
        super();
        this.id = backpackItemId;
    }

    getQuantityOwned()
    {
        return getQuantityOfItemInBackpack(this.id);
    }

    hasQuantity(quantity)
    {
        return quantity <= getQuantityOfItemInBackpack(this.id, quantity);
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        if(this.hasQuantity(quantity))
        {
            removeItemFromBackpackById(this.id, quantity);
            return true;
        }
        return false;
    }

    grantQuantity(quantity)
    {
        addItemToBackpack(this.id, quantity);
    }

    getIcon()
    {
        return getItemById(this.id).icon;
    }

    getName()
    {
        return _(getItemById(this.id).name);
    }

    getDescription()
    {
        var item = getItemById(this.id);
        if(item && item.description)
        {
            return item.description;
        }
        return "";
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class MineralCraftingItem extends CraftingItem
{
    id;

    constructor(mineralId)
    {
        super();
        this.id = mineralId;
    }

    getQuantityOwned()
    {
        return worldResources[this.id].numOwned;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned();
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        if(this.hasQuantity(quantity))
        {
            worldResources[this.id].numOwned -= quantity;
            return true;
        }
        return false;
    }

    grantQuantity(quantity)
    {
        worldResources[this.id].numOwned += quantity;
    }

    getIcon()
    {
        if(worldResources[this.id].isIsotope)
        {
            if(this.id > highestIsotopeUnlocked)
            {
                return worldResources[this.id].largeIconHidden;
            }
            else
            {
                return worldResources[this.id].largeIcon;
            }
        }
        else
        {
            if(this.id > highestOreUnlocked)
            {
                return worldResources[this.id].largeIconHidden;
            }
            else
            {
                return worldResources[this.id].largeIcon;
            }
        }
    }

    getName()
    {
        return getLockedMineralName(this.id);
    }

    getDescription()
    {
        if(!worldResources[this.id].isIsotope && this.id > highestOreUnlocked && worldResources[this.id].sellValue > 0n)
        {
            return "<br><br>" + _("Found around depth {0}km", beautifynum(Math.ceil(getDepthMineralIsFoundAt(this.id) / 5) * 5));
        }
        else if(worldResources[this.id].isIsotope)
        {
            var description = ""
            FUEL_ROD_TYPES.forEach((fuelRod) =>
            {
                reactorComponents[fuelRod].rewardOutput.forEach((reward) =>
                {
                    if(reactorComponents[fuelRod].totalEnergyOutput < 0)
                    {
                        if(reward.item.id == this.id)
                        {
                            description = "<br><br>" + _("Rewarded from {0} in the Reactor", reactorComponents[fuelRod].name)
                        }
                    }
                })
            })
            return description;
        }
        else
        {
            return "";
        }
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }

}

class DrillCraftingItem extends CraftingItem
{
    id;

    constructor(drillPartId)
    {
        super();
        this.id = drillPartId;
    }

    getQuantityOwned()
    {
        if(getDrillEquipById(this.id).isCrafted)
        {
            return 1;
        }
        return 0;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned();
    }

    canCraft()
    {
        return !this.hasQuantity(1);
    }

    getNotCraftableReason()
    {
        return _("You already own this drill part");
    }

    spendQuantity(quantity)
    {
        return false;
    }

    grantQuantity(quantity)
    {
        getDrillEquipById(this.id).craftAndEquip();
    }

    getIcon()
    {
        return getDrillEquipById(this.id).icon;
    }

    getName()
    {
        return getDrillEquipById(this.id).translatedName;
    }

    getCostRelativeToIncrease()
    {
        var drillEquipStats = getDrillEquipById(this.id);
        var percentageIncrease = drillEquipStats.wattagePercentIncrease();
        var moneyCost = getDrillBlueprintByEquipId(this.id).price;

        return doBigIntDecimalMultiplication(moneyCost, percentageIncrease / 100);
    }

    getDescription()
    {
        var drillEquipStats = getDrillEquipById(this.id);
        var level = drillEquipStats.level;
        var baseWatts = drillEquipStats.baseWatts;
        var wattMultiplier = drillEquipStats.wattMultiplier;
        var capacity = drillEquipStats.capacity;
        var description = "";

        var wattageChange = parseFloat(drillEquipStats.wattagePercentIncrease().toFixed(2));
        if(wattageChange != 0)
        {
            description += _("Drill speed {0}%", (wattageChange >= 0 ? "+" : "") + beautifynum(wattageChange)) + " <br> ";
        }

        if(level)
        {
            description += _("Level: {0}", level) + " <br> ";
        }
        if(baseWatts)
        {
            description += _("Base Watts: {0}", beautifynum(baseWatts)) + " <br> ";
        }
        if(wattMultiplier > 1)
        {
            description += _("Total Watts Multiplier: {0}", beautifynum(wattMultiplier)) + " <br> ";
        }
        if(capacity)
        {
            description += _("Capacity: {0}", beautifynum(capacity));
        }
        return description;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class WeaponCraftingItem extends CraftingItem
{
    id;

    constructor(weaponId)
    {
        super();
        this.id = weaponId;
    }

    getNotCraftableReason()
    {
        return _("You already own this weapon");
    }

    getQuantityOwned()
    {
        return battleInventory[this.id].length > 0 ? 1 : 0;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned();
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        if(this.hasQuantity(quantity))
        {
            battleInventory[this.id] = [];
            return true;
        }
        return false;
    }

    grantQuantity(quantity)
    {
        getEquip(this.id);
    }

    upgradeToLevel(level)
    {
        var weaponLevelIndex = 4;
        var inventorySlot = getInventoryWeaponIndexById(this.id);
        if(inventorySlot < 0) throw new "Error: Cannot upgrade a weapon that isn't owned.";
        battleInventory[inventorySlot][weaponLevelIndex] = level;
    }

    getCurrentLevel()
    {
        var weaponLevelIndex = 4;
        var inventorySlot = getInventoryWeaponIndexById(this.id);
        if(inventorySlot < 0) return -1;
        return battleInventory[inventorySlot][weaponLevelIndex];
    }

    getMaxLevel()
    {
        return weaponStats[this.id].maxLevel + 1;
    }

    isAtMaxLevel()
    {
        return this.getCurrentLevel() + 1 >= this.getMaxLevel();
    }

    getIcon()
    {
        return weaponStats[this.id].icon;
    }

    getName()
    {
        return _(weaponStats[this.id].translatedName);
    }

    getDps()
    {
        var currentLevel = this.getCurrentLevel();
        var weaponStatsCurrentLevel = getEquipStats(this.id, currentLevel);
        var weaponAttackCurrentLevel = weaponStatsCurrentLevel.attack;
        var weaponSpeedCurrentLevel = weaponStatsCurrentLevel.speed;
        var secondsToAttack = weaponSpeedCurrentLevel / 1000;
        var damagePerSecond = weaponAttackCurrentLevel / secondsToAttack;
        return damagePerSecond;
    }

    getAttack()
    {
        var currentLevel = this.getCurrentLevel();
        var weaponStatsCurrentLevel = getEquipStats(this.id, currentLevel);
        return weaponStatsCurrentLevel.attack;
    }

    getCooldown()
    {
        var currentLevel = this.getCurrentLevel();
        var weaponStatsCurrentLevel = getEquipStats(this.id, currentLevel);
        return weaponStatsCurrentLevel.speed;
    }

    getDescription()
    {
        var description = "";
        var currentLevel = this.getCurrentLevel();
        var weaponStatsCurrentLevel = getEquipStats(this.id, currentLevel);
        var weaponAttackCurrentLevel = weaponStatsCurrentLevel.attack;
        var weaponSpeedCurrentLevel = weaponStatsCurrentLevel.speed;

        if(this.getCurrentLevel() + 1 >= this.getMaxLevel())
        {
            description += _("MAX LEVEL") + " <br> ";
            description += _("Level: {0}", currentLevel + 1) + " <br> ";
            description += _("Attack: {0}", beautifynum(weaponAttackCurrentLevel)) + " <br> ";
            description += _("Cooldown: {0}ms", beautifynum(weaponSpeedCurrentLevel)) + " <br> ";
        }
        else
        {
            var nextLevel = this.getCurrentLevel() + 1;
            var weaponStatsNextLevel = getEquipStats(this.id, nextLevel);
            var weaponAttackNextLevel = weaponStatsNextLevel.attack;
            var weaponSpeedNextLevel = weaponStatsNextLevel.speed;

            var attackDifference = weaponAttackNextLevel - weaponAttackCurrentLevel;
            var speedDifference = weaponSpeedNextLevel - weaponSpeedCurrentLevel;

            if(nextLevel)
            {
                description += _("Level: {0}", currentLevel + 1) + String.fromCharCode(8201) + String.fromCharCode(8594) + String.fromCharCode(8201) + (nextLevel + 1) + " <br> ";
            }
            if(weaponAttackNextLevel)
            {
                description += _("Attack: {0}", beautifynum(weaponAttackCurrentLevel)) + String.fromCharCode(8201) + String.fromCharCode(8594) + String.fromCharCode(8201) + beautifynum(weaponAttackNextLevel) + " <br> ";
            }
            if(weaponSpeedNextLevel)
            {
                description += _("Cooldown: {0}ms", beautifynum(weaponSpeedCurrentLevel)) + String.fromCharCode(8201) + String.fromCharCode(8594) + String.fromCharCode(8201) + beautifynum(weaponSpeedNextLevel) + "ms <br> ";
            }
        }
        return description;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class GemCraftingItem extends MineralCraftingItem
{
    grantQuantity(quantity)
    {
        //do nothing
    }

    onForged()
    {
        worldResources[this.id].numOwned++;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class MoneyCraftingItem extends CraftingItem
{
    constructor()
    {
        super();
    }

    getNotCraftableReason()
    {
        return _("You don't have enough money");
    }

    getQuantityOwned()
    {
        return money;
    }

    hasQuantity(quantity)
    {
        return quantity <= money;
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        if(this.hasQuantity(quantity))
        {
            subtractMoney(quantity);
            return true;
        }
        return false;
    }

    grantQuantity(quantity)
    {
        addMoney(quantity);
    }

    getIcon()
    {
        return moneyicon;
    }

    getName()
    {
        return _("Money");
    }

    getDescription()
    {
        return "";
    }

    getFormattedQuantity(quantity)
    {
        return "$" + shortenNum(quantity);
    }
}

class ReactorCraftingItem extends CraftingItem
{
    id;

    constructor(componentId)
    {
        super();
        this.id = componentId;
    }

    getQuantityOwned()
    {
        return reactorComponents[this.id].numOwned;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned() && quantity <= reactor.numOfTypeInInventory(this.id);
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        if(this.hasQuantity(quantity))
        {
            reactorComponents[this.id].numOwned -= quantity;
            return true;
        }
        return false;
    }

    grantQuantity(quantity)
    {
        reactorComponents[this.id].numOwned += quantity;
    }

    getIcon()
    {
        return reactorComponents[this.id].craftIcon;
    }

    getName()
    {
        return _(reactorComponents[this.id].name);
    }

    getDescription()
    {
        return reactorComponents[this.id].craftDescription;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class StructureCraftingItem extends CraftingItem
{
    id;

    constructor(structureId)
    {
        super();
        this.id = structureId;
    }

    getNotCraftableReason()
    {
        return _("Not enough materials");
    }

    getQuantityOwned()
    {
        return 1;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned();
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        return false;
    }

    grantQuantity(quantity)
    {
        //structures[this.id].level += quantity;
        return false;
    }

    upgradeToLevel(level)
    {
        if(this.hasQuantity(1))
        {
            structures[this.id].level = level;
        }
    }

    getCurrentLevel()
    {
        return structures[this.id].level;
    }

    getMaxLevel()
    {
        return structures[this.id].maxLevel;
    }

    isAtMaxLevel()
    {
        return this.getCurrentLevel() >= this.getMaxLevel();
    }

    getIcon()
    {
        return structures[this.id].icon;
    }

    getName()
    {
        return _(structures[this.id].translatedName);
    }

    getDescription()
    {
        var currentLevel = this.getCurrentLevel();

        var description = "";
        if(structures[this.id].structureDescription[currentLevel])
        {
            description = structures[this.id].structureDescription[currentLevel];
        }
        else
        {
            description = structures[this.id].structureDescription[0]
        }

        if(description != "")
        {
            description += " <br> ";
        }

        let arrowString = String.fromCharCode(8201) + String.fromCharCode(8594) + String.fromCharCode(8201);
        if(this.getCurrentLevel() >= this.getMaxLevel())
        {
            description += _("MAX LEVEL") + " <br> ";
            description += _("Level: {0}", currentLevel) + " <br> ";

            structures[this.id].leveledStats.forEach((stat, index) =>
            {
                if(stat.name && stat.perLvlValue)
                {
                    description += stat.name + ": " + structures[this.id].statValueForCurrentLevel(index);
                }
            })

        }
        else
        {
            var nextLevel = this.getCurrentLevel() + 1;
            if(this.getCurrentLevel() == 0)
            {
                description += _("Level: {0}", nextLevel) + " <br> ";

                structures[this.id].leveledStats.forEach((stat, index) =>
                {
                    if(stat.name && stat.perLvlValue)
                    {
                        description += stat.name + ": " + structures[this.id].statValueForNextLevel(index);
                    }
                })
            }
            else if(nextLevel)
            {
                description += _("Level: {0}", currentLevel) + arrowString + nextLevel + " <br> ";

                structures[this.id].leveledStats.forEach((stat, index) =>
                {
                    if(stat.name && stat.perLvlValue)
                    {
                        description += stat.name + ": " + structures[this.id].statValueForCurrentLevel(index) + arrowString + structures[this.id].statValueForNextLevel(index) + " <br> ";
                    }
                })
            }
        }
        return description;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}


class ReactorLevelCraftingItem extends StructureCraftingItem
{
    upgradeToLevel(level)
    {
        super.upgradeToLevel(level);

        craftBlueprint(5, 0, reactorStructure.level);
        reactor.grid.isGridDirty = true;
        reactor.learnReactorBlueprintsForLevel();
        newNews(_("New components are available in your reactor"), true);
    }
}

class DroneCraftingItem extends CraftingItem
{
    id;

    constructor(droneId)
    {
        super();
        this.id = droneId;
    }

    getNotCraftableReason()
    {
        return _("Not enough materials");
    }

    getQuantityOwned()
    {
        return 1;
    }

    hasQuantity(quantity)
    {
        return quantity <= this.getQuantityOwned();
    }

    canCraft()
    {
        return true;
    }

    spendQuantity(quantity)
    {
        return false;
    }

    grantQuantity(quantity)
    {
        return false;
    }

    upgradeToLevel(level)
    {
        if(this.hasQuantity(1))
        {
            drones[this.id].level = level;
        }
    }

    getCurrentLevel()
    {
        return parseInt(drones[this.id].level);
    }

    getMaxLevel()
    {
        return drones[this.id].maxLevel;
    }

    isAtMaxLevel()
    {
        return this.getCurrentLevel(this.statName) >= this.getMaxLevel(this.statName);
    }

    getIcon()
    {
        return drones[this.id].icon;
    }

    getName()
    {
        return _(drones[this.id].translatedName);
    }

    getDescription()
    {
        var description = drones[this.id].description;
        var currentLevel = this.getCurrentLevel();
        if(description != "")
        {
            description += " <br> ";
        }

        if(currentLevel >= this.getMaxLevel())
        {
            description += _("MAX LEVEL") + " <br> ";
        }
        else
        {
            description += _("Level: {0}", currentLevel) + " <br> ";
        }
        var currentLevel = this.getCurrentLevel();
        var totalHealth = drones[this.id].totalHealthLevels[currentLevel];
        var totalFuel = drones[this.id].totalFuel;
        var fuelUse = drones[this.id].fuelUseLevels[currentLevel];
        var speedMultiplier = drones[this.id].speedMultiplierLevels[currentLevel];
        var rewardCapacity = drones[this.id].rewardCapacityLevels[currentLevel];
        description += _("Health: {0}", totalHealth) + " <br> ";
        description += _("Total Fuel: {0}", totalFuel) + " <br> ";
        description += _("Fuel Use: {0}", fuelUse) + " <br> ";
        description += _("Speed Multiplier: {0}", speedMultiplier) + " <br> ";
        description += _("Capacity: {0}", rewardCapacity) + " <br> ";
        return description;
    }

    getFormattedQuantity(quantity)
    {
        return shortenNum(quantity);
    }
}

class DroneUpgradeCraftingItem extends DroneCraftingItem
{
    getDescription()
    {
        var description = drones[this.id].description;
        var currentLevel = this.getCurrentLevel();
        var currentLevel = this.getCurrentLevel();
        var totalHealth = drones[this.id].totalHealthLevels[currentLevel];
        var fuelUse = drones[this.id].fuelUseLevels[currentLevel];
        var speedMultiplier = drones[this.id].speedMultiplierLevels[currentLevel];
        var rewardCapacity = drones[this.id].rewardCapacityLevels[currentLevel];
        if(description != "")
        {
            description += " <br> ";
        }

        if(this.getCurrentLevel() >= this.getMaxLevel())
        {
            description += _("MAX LEVEL") + " <br> ";
            description += _("Level: {0}", currentLevel) + " <br> ";
            description += _("Health: {0}", totalHealth) + " <br> ";
            description += _("Fuel Use: {0}", fuelUse) + " <br> ";
            description += _("Speed Multiplier: {0}", speedMultiplier) + " <br> ";
            description += _("Capacity: {0}", rewardCapacity);
        }
        else
        {
            var nextLevel = this.getCurrentLevel() + 1;
            var nextTotalHealth = drones[this.id].totalHealthLevels[nextLevel];
            var nextFuelUse = drones[this.id].fuelUseLevels[nextLevel];
            var nextSpeedMultiplier = drones[this.id].speedMultiplierLevels[nextLevel];
            var nextRewardCapacity = drones[this.id].rewardCapacityLevels[nextLevel];
            var arrowText = String.fromCharCode(8201) + String.fromCharCode(8594) + String.fromCharCode(8201);
            description += _("Level: {0}", currentLevel) + arrowText + nextLevel + " <br> ";
            description += _("Health: {0}", totalHealth) + arrowText + nextTotalHealth + this.getPercentageUpgrade(totalHealth, nextTotalHealth) + " <br> ";
            description += _("Fuel Use: {0}", fuelUse) + arrowText + nextFuelUse + this.getPercentageUpgrade(fuelUse, nextFuelUse) + " <br> ";
            description += _("Speed Multiplier: {0}", speedMultiplier) + arrowText + nextSpeedMultiplier + this.getPercentageUpgrade(speedMultiplier, nextSpeedMultiplier) + " <br> ";
            description += _("Capacity: {0}", rewardCapacity) + arrowText + nextRewardCapacity + this.getPercentageUpgrade(rewardCapacity, nextRewardCapacity) + " <br> ";
        }
        return description;
    }

    getPercentageUpgrade(currentLevel, nextLevel)
    {
        if(currentLevel == 0) return "";
        var percentage = (((nextLevel / currentLevel) - 1) * 100).toFixed(1);
        var text = "(" + percentage + "%)";

        if(percentage != 0)
        {
            return text;
        }
        else
        {
            return "";
        }
    }
}