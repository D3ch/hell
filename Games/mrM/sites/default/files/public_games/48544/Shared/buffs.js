class StaticBuff
{
    id;
    stat;
    name;
    image;
    pausedDuringTimelapse;
    isSaved = true;
    canGetFromChestsAndTrades = true;

    onStartFunction;
    updateFunction;
    endingFunction;
    canStartFunction = function ()
    {
        return true;
    }

    constructor(id)
    {
        this.id = id;
    }
}

class Buff extends StaticBuff
{
    statBuffAmount;
    durationSeconds;
    millisecondsRemaining;
    startSource;
    tier;

    constructor(id)
    {
        super(id);

        //Warning this only copies reference value if property is non-primitive
        Object.assign(this, buffs.getStaticBuffById(id));
    }

    secondsElapsed()
    {
        return this.durationSeconds - Math.floor(this.millisecondsRemaining / 1000);
    }

    formattedDescription()
    {
        return _(this.description, this.statBuffAmount, Math.round(this.durationSeconds / 60));
    }

    getSaveString()
    {
        return [
            this.id,
            this.statBuffAmount,
            this.durationSeconds,
            this.millisecondsRemaining,
            this.startSource,
            this.tier
        ].join("!");
    }

    createFromSaveString(saveString)
    {
        var saveArray = saveString.split("!");
        this.id = parseInt(saveArray[0]);
        Object.assign(this, buffs.getStaticBuffById(this.id));
        this.statBuffAmount = parseFloat(saveArray[1]);
        this.durationSeconds = parseInt(saveArray[2]);
        this.millisecondsRemaining = parseInt(saveArray[3]);
        this.startSource = saveArray[4];
        this.tier = parseInt(saveArray[5]);
    }
}

class Buffs
{
    //References to base buffs
    staticBuffs = [];

    //Save the below
    activeBuffs = [];

    //get save state of buffs
    get saveState()
    {
        var buffSaveStateArray = [];
        for(var i = 0; i < this.activeBuffs.length; i++)
        {
            if(this.activeBuffs[i].isSaved)
            {
                buffSaveStateArray.push(this.activeBuffs[i].getSaveString());
            }
        }
        return buffSaveStateArray.join("*");
    }

    //load state of buffs
    set saveState(value)
    {
        if(value != "")
        {
            var saveArray = value.split("*");
            for(var i = 0; i < saveArray.length; i++)
            {
                var loadedBuff = new Buff();
                loadedBuff.createFromSaveString(saveArray[i]);
                if(!isNaN(loadedBuff.id))
                {
                    this.activeBuffs.push(loadedBuff);
                }
            }
        }
    }

    getChestAndTradeBuffs()
    {
        return this.staticBuffs.filter(buff => buff.canGetFromChestsAndTrades);
    }

    //###### Static references ######

    getStaticBuffById(id)
    {
        return this.staticBuffs[id];
    }

    registerStaticBuff(staticBuff)
    {
        this.staticBuffs[staticBuff.id] = staticBuff;
    }


    //###############################

    update()
    {
        var isBuffLabBuffRunning = false;
        for(var i = this.activeBuffs.length - 1; i >= 0; i--)
        {
            if(!isTimelapseOn || !this.activeBuffs[i].pausedDuringTimelapse)
            {
                this.activeBuffs[i].millisecondsRemaining -= 1000;

                if(this.activeBuffs[i].updateFunction != null)
                {
                    this.activeBuffs[i].updateFunction();
                }
            }

            if(this.activeBuffs[i].startSource == "BuffLab")
            {
                isBuffLabBuffRunning = true;
                bufflab.totalSecsBuffed++;
            }

            if(this.getBuffTimeRemaining(i) <= 0)
            {
                if(this.activeBuffs[i].endingFunction != null)
                {
                    this.activeBuffs[i].endingFunction();
                }
                this.activeBuffs.splice(i, 1);
            }
        }

        if(isBuffLabBuffRunning)
        {
            bufflab.maxConsecutiveSecondsBuffed++;
        }
        else
        {
            bufflab.maxConsecutiveSecondsBuffed = 0;
        }
    }

    startBuff(id, durationSeconds, startingSource, statBuffAmount = 0, tier = 0)
    {
        var newBuff = new Buff(id);
        if(newBuff.canStartFunction())
        {
            durationSeconds *= STAT.buffDurationMultiplier();
            newBuff.durationSeconds = durationSeconds;
            newBuff.millisecondsRemaining = durationSeconds * 1000;
            newBuff.startSource = startingSource;
            newBuff.statBuffAmount = statBuffAmount;
            newBuff.tier = tier;

            var existingMatchingBuff = this.getExistingMatchingBuff(newBuff);
            if(existingMatchingBuff != null)
            {
                existingMatchingBuff.millisecondsRemaining += durationSeconds * 1000;
                existingMatchingBuff.durationSeconds += durationSeconds;
            }
            else
            {
                this.activeBuffs.push(newBuff);
                if(!isSimulating) activeLayers.MainUILayer.displayNewBuff(this.activeBuffs.length - 1);
            }
        }
    }

    getExistingMatchingBuff(newBuff)
    {
        for(var i = 0; i < this.activeBuffs.length; i++)
        {
            if(this.activeBuffs[i].id == newBuff.id &&
                this.activeBuffs[i].tier == newBuff.tier &&
                this.activeBuffs[i].startingSource == newBuff.startingSource)
            {
                return this.activeBuffs[i];
            }
        }
        return null;
    }

    endAllBuffs()
    {
        for(var i = this.activeBuffs.length - 1; i >= 0; i--)
        {
            if(this.activeBuffs[i].endingFunction != null)
            {
                this.activeBuffs[i].endingFunction();
            }
        }
        this.activeBuffs = [];
    }

    numActiveBuffs()
    {
        return this.activeBuffs.length;
    }

    numActiveChestBuffs()
    {
        var activeChestBuffs = 0;

        this.activeBuffs.forEach(buff =>
        {
            if(buff.startSource == "Chest")
            {
                activeChestBuffs++;
            }
        });

        return activeChestBuffs;
    }

    isBuffWithIdRunning(id)
    {
        for(var i = this.activeBuffs.length - 1; i >= 0; i--)
        {
            if(this.activeBuffs[i].id == id)
            {
                return true;
            }
        }
        return false;
    }

    getBuffValue(statId)
    {
        var buffValue = 0;
        for(var i = 0; i < this.activeBuffs.length; i++)
        {
            if(this.activeBuffs[i].stat.id == statId)
            {
                if(!isTimelapseOn || !this.activeBuffs[i].pausedDuringTimelapse)
                {
                    buffValue += this.activeBuffs[i].statBuffAmount; //add multiplier value
                }
            }
        }
        return buffValue;
    }

    getBuffTimeRemaining(index)
    {
        return this.activeBuffs[index].millisecondsRemaining;
    }

    getBuffPercentComplete(index)
    {
        return Math.min(1, 1 - ((this.activeBuffs[index].millisecondsRemaining / 1000) / this.activeBuffs[index].durationSeconds));
    }

    showBuffTooltip(index, x, y)
    {
        if(this.numActiveBuffs() > index)
        {
            showUpdatingTooltip(
                function (index)
                {
                    if(this.numActiveBuffs() > index)
                    {
                        var buffReference = this.activeBuffs[index];
                        var description = buffReference.formattedDescription();
                        var remainingTime = this.getBuffTimeRemaining(index);
                        var timelapseText = (buffReference.pausedDuringTimelapse) ? _("Paused during timelapse") : _("Active during timelapse");
                        description += "<br>" + timelapseText + "<br><center>" + formattedCountDown(remainingTime / 1000) + "</center>";
                        return {
                            header: buffReference.name,
                            body: "<center>" + description + "</center>"
                        };
                    }
                    return {header: "", body: ""}
                }.bind(this, index),
                x,
                y
            );
        }
    }

    //this is in trades too
    showInactiveBuffTooltip(index, x, y, percent, duration)
    {
        var name = this.staticBuffs[index].name;
        var description = _(this.staticBuffs[index].description, percent, duration);
        showTooltip(name, description, x, y);
    }
}
var buffs = new Buffs();

var newStaticBuff = new StaticBuff(0);
newStaticBuff.stat = MINER_SPEED_MULTIPLIER;
newStaticBuff.name = _("Miner Speed Potion");
newStaticBuff.description = _("Increases the speed miners find minerals by {0}% for {1} minutes"); //50%
newStaticBuff.image = speedPotion1;
newStaticBuff.pausedDuringTimelapse = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(1);
newStaticBuff.stat = CHEST_SPAWN_FREQUENCY;
newStaticBuff.name = _("Key of Luck");
newStaticBuff.description = _("Increases chest spawn frequency by {0}% for {1} minutes"); //100%
newStaticBuff.image = whiteKey;
newStaticBuff.pausedDuringTimelapse = true;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(2);
newStaticBuff.stat = PERCENT_CHANCE_OF_SELLING_FOR_DOUBLE;
newStaticBuff.name = _("Midas Touch");
newStaticBuff.description = _("Increases chance of selling for 2x the price when selling minerals and isotopes by {0}% for {1} minutes"); //50%
newStaticBuff.image = goldHand;
newStaticBuff.pausedDuringTimelapse = true;
newStaticBuff.isSaved = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(3);
newStaticBuff.stat = ISOTOPE_DISCOVERY_CHANCE_MULTIPLIER;
newStaticBuff.name = _("Elemental Pike");
newStaticBuff.description = _("Increases the chance of finding isotopes by {0}% for {1} minutes"); //50%
newStaticBuff.image = basicPike;
newStaticBuff.pausedDuringTimelapse = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(4);
newStaticBuff.stat = CHEST_MONEY_MULTIPLIER;
newStaticBuff.name = _("Nugget of Attraction");
newStaticBuff.description = _("Increases money from treasure chests by {0}% for {1} minutes"); //50%
newStaticBuff.image = goldRock;
newStaticBuff.pausedDuringTimelapse = true;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(5);
newStaticBuff.stat = DRILL_SPEED_MULTIPLIER;
newStaticBuff.name = _("Drill Speed Potion");
newStaticBuff.description = _("Increases drill speed by {0}% for {1} minutes"); //200%
newStaticBuff.image = speedPotion3;
newStaticBuff.pausedDuringTimelapse = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(6);
newStaticBuff.stat = UNUSED_STAT;
newStaticBuff.name = _("Raining Chests");
newStaticBuff.description = _("Drastically increases the rate treasure chests spawn for 30 seconds. (All chest despawn when the time is up)");
newStaticBuff.image = basicChest;
newStaticBuff.pausedDuringTimelapse = true;
newStaticBuff.isSaved = false;
newStaticBuff.updateFunction = function ()
{
    if(this.millisecondsRemaining != null && this.millisecondsRemaining >= 5000)
    {
        chestService.spawnChestAtRandomDepth(Chest.buff)
    }
};
newStaticBuff.endingFunction = function ()
{
    chestService.removeChestsBySource(Chest.buff);
};
newStaticBuff.canStartFunction = function ()
{
    return !buffs.isBuffWithIdRunning(6);
}
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(7);
newStaticBuff.stat = CARGO_CAPACITY_MULTIPLIER;
newStaticBuff.name = _("Cargo Expansion");
newStaticBuff.description = _("Increases cargo capacity by {0}% for {1} minutes"); //50%
newStaticBuff.image = purpleBag;
newStaticBuff.pausedDuringTimelapse = false;
newStaticBuff.canGetFromChestsAndTrades = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(8);
newStaticBuff.stat = GEM_SPEED_MULTIPLIER;
newStaticBuff.name = _("Endless Gem Speed Potion");
newStaticBuff.description = _("Decrease gem crafting time by {0}% for {1} minutes"); //50%
newStaticBuff.image = speedPotion4;
newStaticBuff.pausedDuringTimelapse = false;
newStaticBuff.canGetFromChestsAndTrades = false;
buffs.registerStaticBuff(newStaticBuff);

var newStaticBuff = new StaticBuff(9);
newStaticBuff.stat = RELIC_MULTIPLIER;
newStaticBuff.name = _("Relic Effectiveness");
newStaticBuff.description = _("Increases the effectiveness of your relics by {0}% for {1} minutes"); //50%
newStaticBuff.image = superIcon7;
newStaticBuff.pausedDuringTimelapse = false;
newStaticBuff.canGetFromChestsAndTrades = false;
buffs.registerStaticBuff(newStaticBuff);

