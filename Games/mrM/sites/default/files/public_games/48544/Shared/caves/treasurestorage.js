const MAX_STORED_TREASURE = 36;

class TreasureStorage
{
    treasure = []; // Array of CaveReward

    store(caveReward)
    {
        if(!this.isFull())
        {
            this.treasure.push(caveReward);
            ++numberOfRewardsCollected;
        }
        else
        {
            newNews(_("You could not collect a reward because your treasure storage is full!"));
        }
    }

    grantAndRemove(rewardIndex)
    {
        hasCollectedTreasure = true;
        if(this.treasure.length > rewardIndex)
        {
            this.treasure[rewardIndex].grant();
            this.treasure.splice(rewardIndex, 1);
        }
    }

    isFull()
    {
        return this.treasure.length >= MAX_STORED_TREASURE;
    }

    set serializedSaveValue(value)
    {
        //Load in the value
        var values = value === '' ? [] : value.split(",");
        this.treasure = [];


        //############# BUILD REWARDS #############
        if(values.length > 1)
        {
            for(var j = 0; j < values.length; j += 3)
            {
                var newReward = eval("new " + values[j] + "()");
                newReward.loadRewardAmount(values[j + 1]);
                newReward.caveDepth = values[j + 2];
                newReward.locationNode = null;
                this.treasure.push(newReward);
            }
        }
    }

    get serializedSaveValue()
    {
        //Provide parsed value for save
        let toSave = [];
        for(var i = 0; i < this.treasure.length; i++)
        {
            toSave.push(this.treasure[i].constructor.name);
            toSave.push(this.treasure[i].rewardAmount);
            toSave.push(this.treasure[i].caveDepth);
        }
        return toSave.join(",");
    }
}