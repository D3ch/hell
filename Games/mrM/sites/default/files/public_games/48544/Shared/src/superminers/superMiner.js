

const superMinerRarities = {
    common: {
        id: 0,
        name: _("Common"),
        scaleFactor: 1,
        smallFrame: commonSmallFrame,
        smallFrameNoFill: commonSmallFrameNoFill,
        mediumFrame: commonMediumFrame,
        largeFrame: commonLargeFrame,
        popupFrame: commonPopupFrame,
        flatButton: commonFlat,
        button: commonButton
    },
    uncommon: {
        id: 1,
        name: _("Uncommon"),
        scaleFactor: 1.33,
        smallFrame: uncommonSmallFrame,
        smallFrameNoFill: uncommonSmallFrameNoFill,
        mediumFrame: uncommonMediumFrame,
        largeFrame: uncommonLargeFrame,
        popupFrame: uncommonPopupFrame,
        flatButton: uncommonFlat,
        button: uncommonButton
    },
    rare: {
        id: 2,
        name: _("Rare"),
        scaleFactor: 1.83,
        smallFrame: new SpritesheetAnimation(rareSmallFrame, 15, 10),
        smallFrameNoFill: new SpritesheetAnimation(rareSmallFrameNoFill, 15, 10),
        mediumFrame: rareMediumFrame,
        largeFrame: rareLargeFrame,
        popupFrame: rarePopupFrame,
        flatButton: rareFlat,
        button: rareButton
    },
    legendary: {
        id: 3,
        name: _("Legendary"),
        scaleFactor: 2.5,
        smallFrame: new SpritesheetAnimation(legendarySmallFrame, 15, 10),
        smallFrameNoFill: new SpritesheetAnimation(legendarySmallFrameNoFill, 15, 10),
        mediumFrame: legendaryMediumFrame,
        largeFrame: legendaryLargeFrame,
        popupFrame: legendaryPopupFrame,
        flatButton: legendaryFlat,
        button: legendaryButton
    }
};

const superMinerTypes = {
    BASE: 0,
    DRILL: 1,
    MINER: 2,
    BUFF: 3,
    SELLER: 4,
    EGG: 5,
    CHEST: 6,
    DEPOSIT: 7,
    BOOSTER: 8,
    REWARD: 9
}

class SuperMiner
{
    id;
    uniqueId;
    name;
    baseCost = 30;
    level = 1;
    experience = 0;
    maxLevel = 0;
    rarity;
    portrait;
    renderContext;
    lastUpdate = 0;
    renderer;
    boostAmount = 1;
    boostDuration = 0;
    hasButton = false;
    needsProgressBar = false;

    saveDataMap = {};
    type = superMinerTypes.BASE;

    init()
    {
        this.uniqueId = this.id + "-" + currentTime();
        this.level = 1;
        this.lastUpdate = 0;
        superMinerManager.dirtyCache();

        if(this.currentDepth && this.currentDepth < 0)
        {
            this.setToRandomDepth(1, depth);
        }
    }

    update(dt)
    {
        if(this.boostDuration > 0)
        {
            this.boostDuration -= dt;
        }
        else
        {
            this.boostDuration = 0;
            this.boostAmount = 1;
        }
    }

    clone()
    {
        var clone = new this.constructor();
        Object.assign(clone, this);
        if(clone.renderer)
        {
            // Copy the renderer explicitly to avoid a full deep clone
            var rendererClone = new clone.renderer.constructor(clone);
            Object.assign(rendererClone, clone.renderer);
            rendererClone.parent = clone;
            clone.renderer = rendererClone;
        }
        return clone;
    }

    canLevel()
    {
        return worldResources[SUPER_MINER_SOULS_INDEX].numOwned >= this.getLevelCost() && !this.isMaxLevel();
    }

    isMaxLevel()
    {
        return this.level >= this.maxLevel;
    }

    getLevelCost()
    {
        return Math.round(((this.baseCost * (this.level + 1)) ** 1.2) / 5) * 5;
    }

    levelUp()
    {
        worldResources[SUPER_MINER_SOULS_INDEX].numOwned -= this.getLevelCost();
        this.level++;
        superMinerManager.dirtyCache();
    }

    scrapAmount()
    {
        let rarityMultiplier = 1 + Math.log10(this.rarity.scaleFactor);
        let levelMultiplier = ((this.level * (this.level + 1)) / 2) ** 1.1; // increases the effect level plays
        return Math.floor(rarityMultiplier * this.baseCost * levelMultiplier)
    }

    handleMovement()
    {

        if(this.targetDepth == -1)
        {
            let minDepth = Math.max(2, this.currentDepth - 40);
            let maxDepth = Math.min(depth - 2, this.currentDepth + 40);
            this.targetDepth = getRandomMineableDepthInRange(minDepth, maxDepth, .8);
        }

        if(this.currentDepth < this.targetDepth)
        {
            this.currentDepth++;
        }
        else if(this.currentDepth > this.targetDepth)
        {
            this.currentDepth--;
        }
        else
        {
            //need to be 2 off from 0 and max depth due to some super miners effecting 2 depths above and below
            let minDepth = Math.max(2, this.currentDepth - 40);
            let maxDepth = Math.min(depth - 2, this.currentDepth + 40);
            this.targetDepth = getRandomMineableDepthInRange(minDepth, maxDepth, .8);
        }

        //if the depth selected cant be mined, call self again to get a new depth.
        if(isDepthWithoutWorkers(this.currentDepth))
        {
            this.handleMovement();
        }

        superMinerManager.dirtyCache();
    }

    setToRandomDepth(min, max)
    {
        this.currentDepth = getRandomMineableDepthInRange(min, max, .8)
    }

    scrap()
    {
        superMinerManager.removeSuperMinerById(this.uniqueId);
        worldResources[SUPER_MINER_SOULS_INDEX].numOwned += this.scrapAmount();
        superMinerManager.dirtyCache();
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight, textAlign);
    }

    render()
    {
        if(this.renderer)
        {
            this.renderer.render(this.renderContext);
        }
    }


    canPressButton()
    {
        return false;
    }

    percentageUntilAction()
    {
        return 1; //assume it's constant. Override otherwise
    }

    onButtonPress()
    {
        return true; //do nothing. Override otherwise
    }

    restore(saveData)
    {
        this.init();
        for(var key in this.saveDataMap)
        {
            this[key] = saveData[this.saveDataMap[key].index];
            if(this.saveDataMap[key].parseFunction)
            {
                this[key] = this.saveDataMap[key].parseFunction(this[key]);
            }
        }
    }

    getSaveString()
    {
        var saveArray = [this.id];
        for(var key in this.saveDataMap)
        {
            saveArray[this.saveDataMap[key].index] = this[key];
        }
        return saveArray.join("!")
    }
}

class DrillMiner extends SuperMiner
{
    drillingSpritesheet;
    spriteYOffset = 0.1;
    statId = 7;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
    };
    type = superMinerTypes.DRILL;

    constructor()
    {
        super();
        this.renderer = new DrillMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_NONE;
    }

    update(dt)
    {
        super.update(dt)
    }

    init()
    {
        super.init();
    }

    get statBonuses()
    {
        return [
            {
                id: 7,
                amount: () =>
                {
                    let baseSpeed = 10 * this.boostAmount;
                    return Math.round((this.rarity.scaleFactor * baseSpeed * (this.level ** 0.6)) / 5) * 5;
                }
            }
        ]
    }

    getbaseDescription()
    {
        return _("Increasing drill speed by {0}%", this.statBonuses[0].amount())
    }

    get buttonIcon()
    {
        return superIcon1;
    }
}

class SuperBooster extends SuperMiner
{
    walkingSpritesheet;
    boostingDuration = 60;
    currentDepth = -1;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
    };
    type = superMinerTypes.BOOSTER;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_NONE;
    }

    getBoostAmount()
    {
        //doesn't use rarity should add if we need
        return 1 + (this.level * .25)
    }

    update(dt)
    {
        super.update(dt)

        this.lastUpdate++;
        if(this.lastUpdate > 30)
        {
            this.handleMovement();
            this.lastUpdate = 0;
        }

        let superMinersOnDepth = superMinerManager.superMinersOnDepth(this.currentDepth);

        if(superMinersOnDepth.length > 1)
        {

            for(var i = 0; i < superMinersOnDepth.length; i++)
            {
                if(superMinersOnDepth[i].type != superMinerTypes.BOOSTER)
                {
                    superMinersOnDepth[i].boostAmount = this.getBoostAmount();
                    superMinersOnDepth[i].boostDuration = this.boostingDuration;
                }
            }
            this.handleMovement();
        }
    }

    init()
    {
        super.init();
    }

    getbaseDescription()
    {
        return _("After colliding with other super miners it boost their effects by {0}% for {1}",
            Math.floor((this.getBoostAmount() - 1) * 100),
            shortenedFormattedTime(this.boostingDuration));
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} seconds", 30), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    get buttonIcon()
    {
        return superIcon9;
    }

    render()
    {
        for(var i = 0; i < superMinerManager.numSuperMiners(); i++)
        {
            let buffedMiner = superMinerManager.currentSuperMiners[i];
            if(buffedMiner.boostDuration)
            {
                if(isDepthVisible(buffedMiner.currentDepth))
                {
                    var x = worldConfig.leftBound;

                    let depthToRender = buffedMiner.currentDepth;
                    let y = worldConfig.topBound +
                        (depthToRender - 1 - (currentlyViewedDepth + partialDepthOffset - worldConfig.numberOfDepthsVisible))
                        * worldConfig.levelHeight;

                    let starAnimationDuration = 1500;
                    var dist = Math.abs(1);
                    var maxOpacity = 0.4 + 0.5 * (1 - (dist / 1));
                    var phaseShift = -1000 * dist / 1;
                    this.renderContext.globalAlpha = maxOpacity * (1 - oscillate(currentTime() + phaseShift, starAnimationDuration));
                    this.renderContext.drawImage(
                        purplesparkles1,
                        x,
                        y - 1,
                        worldConfig.levelWidth,
                        worldConfig.levelHeight
                    );
                    this.renderContext.globalAlpha = (maxOpacity * 0.8) * oscillate(currentTime() + phaseShift, starAnimationDuration);
                    this.renderContext.drawImage(
                        purplesparkles2,
                        x,
                        y - 1,
                        worldConfig.levelWidth,
                        worldConfig.levelHeight
                    );
                    this.renderContext.globalAlpha = 1;

                }
            }
        }
        super.render();
    }
}


class EggMiner extends SuperMiner
{
    experience = 0;
    hatchedPortrait;
    needsProgressBar = true;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        experience: {index: 3, parseFunction: parseInt},
    };

    type = superMinerTypes.EGG;

    update(dt)
    {
        super.update(dt)

        if(this.level < this.maxLevel)
        {
            this.experience += (dt * this.boostAmount);
        }

        if(this.experience >= this.getLevelExperience())
        {
            this.level++;
            this.experience = 0;
        }

        if(this.level >= this.maxLevel && this.portrait != this.hatchedPortrait)
        {
            this.portrait = this.hatchedPortrait;
        }
    }

    levelUp()
    {
        worldResources[SUPER_MINER_SOULS_INDEX].numOwned -= this.getLevelCost();
        this.level++;
        this.experience = 0;
    }

    getLevelCost()
    {
        return Math.floor(super.getLevelCost() * (1 - this.percentageUntilAction()));
    }

    getLevelExperience()
    {
        let rarityCost = ((this.level + 1) ** 1.2) * this.baseCost;
        return rarityCost * 7000;
    }

    scrapAmount()
    {
        return Math.floor(super.scrapAmount() * 1.4);
    }

    percentageUntilAction()
    {
        return Math.min(1, this.experience / this.getLevelExperience());
    }

    getbaseDescription()
    {
        return _("Passively gains experience and levels up for free, increasing its scrap amount.");
    }

    get buttonIcon()
    {
        return superIcon6;
    }
}

class ChestMiner extends SuperMiner
{
    walkingSpritesheet;
    currentDepth = -1; //need to save
    targetDepth = -1;
    effectRange = 2;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        currentDepth: {index: 4, parseFunction: parseInt},
        targetDepth: {index: 5, parseFunction: parseInt}
    };
    type = superMinerTypes.CHEST;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_NONE;
    }

    getChestMultiplier()
    {
        let baseSpeed = 2.5 * this.boostAmount;
        return (Math.round(this.rarity.scaleFactor * baseSpeed * (this.level ** 0.25) / 0.1) * 0.1);
    }

    init()
    {
        super.init();
    }

    //doesn't use dt because it ignores timelapse?
    update(dt)
    {
        super.update(dt) //this isn't right 

        if((currentTime() - this.lastUpdate) > 60000) 
        {
            this.handleMovement();
            this.lastUpdate = currentTime();

            //normal chest spawns happen twice a minute
            this.spawnChests();
            this.spawnChests();
        }
    }

    spawnChests()
    {
        //allow super miner chest spawns to go over the cap for chest spawns in the world by 2x.
        if(chestService.chests.length > (depth / 5)) return;
        for(var i = 0; i < 5; i++)
        {
            if(chestService.rollForBasicChest(this.getChestMultiplier()))
            {
                var spawnDepth = this.currentDepth - this.effectRange + i;
                var availableMiners = chestService.getAvailableMiners(spawnDepth);
                var miner = availableMiners[rand(0, availableMiners.length - 1)];

                if(!isDepthWithoutWorkers(spawnDepth) && !isBossLevel(spawnDepth) && miner)
                {
                    chestService.spawnChest(spawnDepth, Chest.superminer, chestService.rollForSpecialChest(), miner);
                }
            }
        }
    }

    getbaseDescription()
    {
        if(this.currentDepth < 0 && this.lastUpdate <= 0)
        {
            return _("Increases chest spawns for 5 depths around it by {0}%",
                Math.floor(this.getChestMultiplier() * 100)
            );
        }
        else
        {
            return _("Increasing the chest spawns between {0}km and {1}km by {2}%",
                this.currentDepth - this.effectRange,
                this.currentDepth + this.effectRange,
                Math.floor(this.getChestMultiplier() * 100)
            );
        }
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} min", 1), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    get buttonIcon()
    {
        return superIcon3;
    }

    render()
    {
        if(isDepthVisible(this.currentDepth - this.effectRange) || isDepthVisible(this.currentDepth + this.effectRange))
        {
            var x = worldConfig.leftBound;

            for(var i = 0; i < 1 + 2 * this.effectRange; i++)
            {
                let depthToRender = this.currentDepth - this.effectRange + i;
                let y = worldConfig.topBound +
                    (depthToRender - 1 - (currentlyViewedDepth + partialDepthOffset - worldConfig.numberOfDepthsVisible))
                    * worldConfig.levelHeight;

                let starAnimationDuration = 1500;
                var dist = Math.abs(i - this.effectRange);
                var maxOpacity = 0.4 + 0.5 * (1 - (dist / this.effectRange));
                var phaseShift = -1000 * dist / this.effectRange;
                this.renderContext.globalAlpha = maxOpacity * (1 - oscillate(currentTime() + phaseShift, starAnimationDuration));
                this.renderContext.drawImage(
                    sparkles1,
                    x,
                    y - 1,
                    worldConfig.levelWidth,
                    worldConfig.levelHeight
                );
                this.renderContext.globalAlpha = (maxOpacity * 0.8) * oscillate(currentTime() + phaseShift, starAnimationDuration);
                this.renderContext.drawImage(
                    sparkles2,
                    x,
                    y - 1,
                    worldConfig.levelWidth,
                    worldConfig.levelHeight
                );
                this.renderContext.globalAlpha = 1;
            }
        }
        super.render();
    }
}

class DepositMiner extends SuperMiner
{
    walkingSpritesheet;
    drillingSpritesheet;
    currentDepth = -1; //need to save
    targetDepth = -1;


    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        currentDepth: {index: 4, parseFunction: parseInt},
        targetDepth: {index: 5, parseFunction: parseInt}
    };
    type = superMinerTypes.DEPOSIT;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_NONE;
    }

    init()
    {
        super.init();
    }

    update(dt)
    {
        super.update(dt);

        this.lastUpdate += dt;

        if(this.lastUpdate > 360)
        {
            this.handleMovement();
            this.lastUpdate = 0;
        }
    }

    get statBonuses()
    {
        return [
            {
                id: 25,
                amount: () => Math.floor((Math.round(this.rarity.scaleFactor * this.boostAmount * (this.level * 0.3) / 0.1) * 0.1) * 100)
            },
            {
                id: 26,
                amount: () => 1 + Math.floor(this.level / 3)
            },
        ];
    }

    getbaseDescription()
    {
        return _("Increases mineral deposit spawns by {0}% and increases the maximum number of mineral deposits in the world by {1}",
            this.statBonuses[0].amount(),
            this.statBonuses[1].amount()
        )
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} mins", 6), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    get buttonIcon()
    {
        return superIcon5;
    }
}

class MiningSuperMiner extends SuperMiner
{
    renderer;
    walkingSpritesheet;
    drillingSpritesheet;
    currentDepth = -1; //need to save
    targetDepth = -1;

    subType = "mineral";
    baseSpeed = 12.5;
    affectedDepth = -1;
    autoSell = false;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        currentDepth: {index: 4, parseFunction: parseInt},
        targetDepth: {index: 5, parseFunction: parseInt}
    };
    type = superMinerTypes.MINER;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_CALCULATE;
    }

    getMiningSpeed()
    {
        var value = this.rarity.scaleFactor * this.baseSpeed * this.boostAmount * (this.level ** 0.6)
        if(this.subType == "isotope") value /= 2;
        return Math.round(value / 0.5) * 0.5;
    }

    init()
    {
        super.init();
    }

    update(dt)
    {
        super.update(dt)

        this.lastUpdate += dt;

        if(this.affectedDepth <= 0) this.updateAffectedDepth();
        if(this.lastUpdate > 360)
        {
            this.handleMovement();
            this.lastUpdate = 0;
            this.updateAffectedDepth();
        }
    }

    updateAffectedDepth()
    {
        if(this.subType == "isotope")
        {
            var foundDepth = false;

            for(var i = 0; i < 50; i++)
            {
                var depthBelow = this.currentDepth + i;
                var depthAbove = this.currentDepth - i;

                if(depthBelow <= depth && this.checkIsotopesOnDepth(depthBelow))
                {
                    this.affectedDepth = depthBelow;
                    foundDepth = true;
                    break;
                }
                else if(depthAbove > 0 && this.checkIsotopesOnDepth(depthAbove))
                {
                    this.affectedDepth = depthAbove;
                    foundDepth = true;
                    break;
                }
            }

            if(!foundDepth) this.affectedDepth = this.currentDepth;
        }
        else
        {
            this.affectedDepth = this.currentDepth;
        }
    }

    checkIsotopesOnDepth(depthToCheck)
    {
        let minerals = estimatedMineralsPerMinuteAtLevel(depthToCheck);
        for(var n = 1; n < minerals.length; n++)
        {
            if(worldResources[n].isIsotope && minerals[n] > 0)
            {
                return true;
            }
        }
        return false;
    }

    getbaseDescription()
    {
        var description;
        if(this.subType == "mineral")
        {
            if(this.currentDepth < 0 && this.lastUpdate <= 0)
            {
                description = _("Increases mining speed at a depth by {0}%.",
                    Math.floor(this.getMiningSpeed() * 100)
                )
            }
            else
            {
                description = _("Increasing mining speed at {0}km by {1}%.",
                    this.currentDepth,
                    Math.floor(this.getMiningSpeed() * 100)
                )
            }
        }
        else
        {
            if(this.currentDepth < 0 && this.lastUpdate <= 0)
            {
                description = _("Increases the number of isotopes mined at a depth by {1}%.",
                    Math.floor(this.getMiningSpeed() * 100)
                )
            }
            else
            {
                description = _("Increasing the number of isotopes mined at {0}km by {1}%.",
                    this.currentDepth,
                    Math.floor(this.getMiningSpeed() * 100)
                )
            }
        }

        if(this.autoSell)
        {
            description += _(" Automatically sells any minerals mined.");
        }

        return description;
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} mins", 6), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    get buttonIcon()
    {
        return this.subType == "mineral" ? superIcon2 : superIcon4;
    }
}

class BuffMiner extends SuperMiner
{
    walkingSpritesheet;
    drillingSpritesheet;
    hasButton = true;
    needsProgressBar = true;

    //cant do generic level/rarity multipliers for this class because we may want different miners
    //to earn buffs at different rates or grant different percentage buffs
    //or grant different buffs which would be too difficult to generically quantify their value
    //100% of one buff might be equal to 50% of another buff

    mineralsBetweenBuffByLevel = [];
    buffPercentageByLevel = [];
    buffId = -1;
    buffDuration = 60;

    //need to save
    currentMineralsMined = 0;
    currentDepth = -1;
    targetDepth = -1;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        currentDepth: {index: 4, parseFunction: parseInt},
        currentMineralsMined: {index: 5, parseFunction: parseInt},
        targetDepth: {index: 6, parseFunction: parseInt}
    };
    type = superMinerTypes.BUFF;

    animationLoopTime = 40;
    miningTime = 6;
    spriteYOffset = -0.2;
    spriteHeightFraction = 0.65;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_FAKE;
    }

    init()
    {
        super.init();
    }

    update(dt)
    {
        super.update(dt)

        this.lastUpdate += dt;

        if(this.percentageUntilAction() != 1)
        {
            let mineralsPerSecond = Math.ceil(estimatedMineralsPerMinuteAtLevel(this.currentDepth).reduce((a, b) => a + b, 0) / 60);
            this.currentMineralsMined += (mineralsPerSecond * dt * this.boostAmount);
        }

        if(this.lastUpdate > 360)
        {
            this.handleMovement();
            this.lastUpdate = 0;
        }
    }

    percentageUntilAction()
    {
        return Math.min(1, this.currentMineralsMined / this.mineralsBetweenBuffByLevel[this.level - 1]);
    }

    canPressButton()
    {
        return (this.percentageUntilAction() == 1);
    }

    onButtonPress()
    {
        if(this.canPressButton())
        {
            buffs.startBuff(this.buffId, this.buffDuration, "BuffMiner", this.buffPercentageByLevel[this.level - 1]);
            this.currentMineralsMined = 0;
        }
    }

    getbaseDescription()
    {
        return _("Every {0} minerals mined by {1} grants a {2}% {3} buff for {4}",
            this.mineralsBetweenBuffByLevel[this.level - 1],
            this.name,
            this.buffPercentageByLevel[this.level - 1],
            buffs.getStaticBuffById(this.buffId).name,
            shortenedFormattedTime(this.buffDuration)
        )
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} mins", 6), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    get buttonIcon()
    {
        if(this.buffId > -1)
        {
            return buffs.staticBuffs[this.buffId].image;
        }
    }

    buttonTooltip()
    {
        return {
            "header": _("Currently mined"),
            "body": "<center>" + _("{0} / {1}", this.currentMineralsMined, this.mineralsBetweenBuffByLevel[this.level - 1]) + "</center>"
        };
    }
}

class SuperSeller extends SuperMiner
{
    lastSold = 0;
    hasButton = true;
    needsProgressBar = true;

    //need to save
    attachedMineralId = 0;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        attachedMineralId: {index: 4}
    };
    type = superMinerTypes.SELLER;

    getSellAmount()
    {
        let baseSell = 10;
        return Math.floor(this.rarity.scaleFactor * baseSell * this.level);
    }

    update(dt)
    {
        if(this.attachedMineralId > 0)
        {
            sellMineralAmount(this.attachedMineralId, Math.floor(this.getSellAmount() * dt));
            this.lastSold = currentTime();
        }
    }

    percentageUntilAction()
    {
        return Math.min(1, (currentTime() - this.lastSold) / 1000);
    }

    canPressButton()
    {
        return true;
    }

    onButtonPress()
    {
        openUi(SuperSellerWindow, null, this);
    }

    getbaseDescription()
    {
        return _("Automatically sell {0} minerals every second",
            this.getSellAmount()
        )
    }

    get buttonIcon()
    {
        if(worldResources[this.attachedMineralId])
        {
            return worldResources[this.attachedMineralId].largeIcon;
        }
    }
}

class RewardMiner extends SuperMiner
{
    walkingSpritesheet;
    drillingSpritesheet;
    hasButton = true;
    needsProgressBar = true;

    //need to save
    currentMineralsMined = 0;
    currentDepth = -1;
    targetDepth = -1;

    saveDataMap = {
        id: {index: 0},
        uniqueId: {index: 1},
        level: {index: 2, parseFunction: parseInt},
        lastUpdate: {index: 3, parseFunction: parseInt},
        currentDepth: {index: 4, parseFunction: parseInt},
        currentMineralsMined: {index: 5, parseFunction: parseInt},
        targetDepth: {index: 6, parseFunction: parseInt}
    };
    type = superMinerTypes.REWARD;

    constructor()
    {
        super();
        this.renderer = new WanderingSuperMinerRenderer(this);
        this.renderer.miningDisplayType = MINING_DISPLAY_TYPE_FAKE;
    }

    init()
    {
        super.init();
    }

    //I dont really like this. We should be scaling up cost if anything but then we need to scale rewards. Should do that when we rethink rewards.
    getMineralAmount()
    {
        return Math.round((50000 / (Math.log10(1 + (this.level * (this.rarity.scaleFactor ** .25))))) / 1000) * 1000;
    }

    update(dt)
    {
        super.update(dt);

        this.lastUpdate += dt;

        if(this.percentageUntilAction() != 1)
        {
            let mineralsPerSecond = Math.ceil(estimatedMineralsPerMinuteAtLevel(this.currentDepth).reduce((a, b) => a + b, 0) / 60);
            this.currentMineralsMined += (mineralsPerSecond * dt * this.boostAmount);
        }

        if(this.lastUpdate > 360)
        {
            this.handleMovement();
            this.lastUpdate = 0;
        }
    }

    percentageUntilAction()
    {
        return Math.min(1, this.currentMineralsMined / this.getMineralAmount());
    }

    canPressButton()
    {
        return (this.percentageUntilAction() >= 1);
    }

    onButtonPress()
    {
        if(this.canPressButton())
        {
            this.grantRandomReward();
            this.currentMineralsMined = 0;
        }
    }

    getbaseDescription()
    {
        return _("Every {0} minerals mined by {1} grants a random reward",
            this.getMineralAmount(),
            this.name
        );
    }

    renderDescription(context, x, y, maxWidth, maxHeight, textAlign = "left")
    {
        fillTextWrapWithHeightLimit(context, this.getbaseDescription(), x, y, maxWidth, maxHeight * .9, textAlign);
        fillTextWrapWithHeightLimit(context, _("Moves depths every {0} mins", 6), x, y + (maxHeight * .9), maxWidth, maxHeight * .1, textAlign);
    }

    grantRandomReward()
    {
        let roll = wizardRoller.rand(0, 1000);
        let rewardText = "";
        if(roll < 200) rewardText = grantMoneyMinutes(30);
        else if(roll < 400) rewardText = grantSuperMinerSouls(10);
        else if(roll < 600) rewardText = grantTwentyBuildingMaterials();
        else if(roll < 800) rewardText = grantStaticBuff();
        else if(roll < 950) scientistsGrantMineralsForMinutes(60);
        else if(roll < 1000) rewardText = grantTickets(1);

        if(rewardText != "") newNews(_("You gained {0} from the Wizard!", rewardText));

    }

    get buttonIcon()
    {
        return superIcon8;
    }

    buttonTooltip()
    {
        return {
            "header": _("Currently mined"),
            "body": "<center>" + _("{0} / {1}", this.currentMineralsMined, this.getMineralAmount()) + "</center>"
        };
    }
}