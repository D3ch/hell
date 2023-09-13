var mineralsSacrificed = 0;
var isCoreWarped = 0;
var isCoreBlessed = 0;
const BOOK_OF_SECRETS_ID = 45;
const WARPED_BOOK_OF_SECRETS_ID = 80;
const DIVINE_BOOK_OF_SECRETS_ID = 113;

class Pit
{
    makeSacrifice(sacrificeType, sacrificeSubtype, quantity)
    {
        // Check that the user can make the sacrifice
        switch(sacrificeType)
        {
            case PitConfig.sacrificeTypes.ore:
                if(worldResources[sacrificeSubtype].numOwned < quantity) return false;
                break;
            case PitConfig.sacrificeTypes.relic:
                if(equippedRelics[sacrificeSubtype] == -1) return false;
                break;
            case PitConfig.sacrificeTypes.scientist:
                if(sacrificeSubtype > aliveScientists().length) return false;
                break;
            default:
                throw "Error: Invalid sacrifice type";
        }
        var value = this.getSacrificeValue(sacrificeType, sacrificeSubtype, quantity);
        var reward = this.getSacrificeReward(sacrificeType, sacrificeSubtype, value);
        this.showSacrificeNews(sacrificeType, sacrificeSubtype, quantity, reward);
        switch(sacrificeType)
        {
            case PitConfig.sacrificeTypes.ore:
                worldResources[sacrificeSubtype].numOwned -= quantity;
                break;
            case PitConfig.sacrificeTypes.relic:
                deleteEquippedRelic(sacrificeSubtype);
                break;
            case PitConfig.sacrificeTypes.scientist:
                if (reward)
                {
                    deleteScientistAtIndex(indexOfScientist(aliveScientists()[sacrificeSubtype]));
                }
                else
                {
                    // Allow scientists to be resurrected on failure
                    killScientistAtIndex(indexOfScientist(aliveScientists()[sacrificeSubtype]));
                }
                numScientistsSacrificed++;
                break;
            default:
                throw "Error: Invalid sacrifice type";
        }
        if(reward)
        {
            this.grantSacrificeReward(reward);
        }
        mineralsSacrificed += quantity;
    }

    getSacrificeValue(sacrificeType, sacrificeSubtype, quantity)
    {
        switch(sacrificeType)
        {
            case PitConfig.sacrificeTypes.ore:
                return parseInt(worldResources[sacrificeSubtype].sellValue) * quantity; //this will need to change if we add higher up minerals
            case PitConfig.sacrificeTypes.gem:
                return quantity * PitConfig.sacrificeValueModifiers.gem;
            case PitConfig.sacrificeTypes.relic:
                return PitConfig.sacrificeValueModifiers.relic;
            case PitConfig.sacrificeTypes.scientist:
                return PitConfig.sacrificeValueModifiers.scientist;
            default:
                throw "Error: Invalid sacrifice type";
        }
    }

    getSacrificeReward(sacrificeType, sacrificeSubtype, sacrificeValue)
    {
        var isBookOfSecrets = (
            sacrificeType == PitConfig.sacrificeTypes.relic &&
            (equippedRelics[sacrificeSubtype] == BOOK_OF_SECRETS_ID || equippedRelics[sacrificeSubtype] == WARPED_BOOK_OF_SECRETS_ID || equippedRelics[sacrificeSubtype] == DIVINE_BOOK_OF_SECRETS_ID)
        );

        if(sacrificeType == PitConfig.sacrificeTypes.ore && coreMineralRoller.randFloat() > PitConfig.rewardConfig.sacrificeSuccessChance)
        {
            return null;
        }
        else if(sacrificeType == PitConfig.sacrificeTypes.relic && !(isCoreWarped || isCoreBlessed) && coreRelicRoller.randFloat() > PitConfig.rewardConfig.sacrificeSuccessChance && !isBookOfSecrets)
        {
            return null;
        }
        else if(sacrificeType == PitConfig.sacrificeTypes.scientist && !(isCoreWarped || isCoreBlessed) && coreScientistRoller.randFloat() > PitConfig.rewardConfig.sacrificeSuccessChance)
        {
            return null;
        }

        var rewardType;
        var rewardValue;
        var rewardSubtype;
        var rewardQuantity = 0;

        if(sacrificeType == PitConfig.sacrificeTypes.ore)
        {
            var possibleRewards = this.getPossibleOreRewardsArray(sacrificeType);
            rewardType = PitConfig.sacrificeTypes.ore;
            rewardValue = gaussianRand(PitConfig.rewardConfig.medianValue, PitConfig.rewardConfig.valueSpread);
            rewardSubtype = possibleRewards[coreMineralRoller.rand(0, possibleRewards.length - 1)];
            rewardQuantity = randRoundToInteger(rewardValue * sacrificeValue / parseInt(worldResources[rewardSubtype].sellValue));
        }
        if(sacrificeType == PitConfig.sacrificeTypes.relic)
        {
            var sacrificialRelic = excavationRewards[equippedRelics[sacrificeSubtype]];

            if(sacrificialRelic.id == BOOK_OF_SECRETS_ID && !isCoreWarped)
            {
                return {
                    type: PitConfig.sacrificeTypes.special,
                    subtype: 1,
                    quantity: 1
                };
            }
            else if((sacrificialRelic.id == WARPED_BOOK_OF_SECRETS_ID || sacrificialRelic.id == DIVINE_BOOK_OF_SECRETS_ID) && !isCoreBlessed)
            {
                return {
                    type: PitConfig.sacrificeTypes.special,
                    subtype: 2,
                    quantity: 1
                };
            }

            if(sacrificialRelic.relatedIndexesForSacrifice.length > 0)
            {
                if(isCoreWarped)
                {
                    rewardType = PitConfig.sacrificeTypes.relic;
                    rewardSubtype = sacrificialRelic.warpId;
                    rewardQuantity = 1;
                    isCoreWarped = false;
                    isCoreBlessed = false;
                }
                else if(isCoreBlessed)
                {
                    rewardType = PitConfig.sacrificeTypes.relic;
                    rewardSubtype = sacrificialRelic.divineId;
                    rewardQuantity = 1;
                    isCoreWarped = false;
                    isCoreBlessed = false;
                }
                else
                {
                    var candidateRelicIndex = sacrificialRelic.relatedIndexesForSacrifice[coreRelicRoller.rand(0, sacrificialRelic.relatedIndexesForSacrifice.length - 1)];
                    var candidateRelic = excavationRewards[candidateRelicIndex];
                    var maximumIncreaseInRarity = (-.29 + Math.pow(coreRelicRoller.randFloat(), 3));
                    if(candidateRelic.rarity < sacrificialRelic.rarity + maximumIncreaseInRarity)
                    {
                        //grant the new relic
                        rewardType = PitConfig.sacrificeTypes.relic;
                        rewardSubtype = candidateRelicIndex;
                        rewardQuantity = 1;
                    }
                }
            }
        }

        if(sacrificeType == PitConfig.sacrificeTypes.scientist)
        {
            var sacrificialScientist = scientists[aliveScientists()[sacrificeSubtype][0]];

            if(isCoreWarped || isCoreBlessed)
            {
                //maybe give a warped scientist reset level to 0
                if(coreScientistRoller.boolean(0.5))
                {
                    rewardType = PitConfig.sacrificeTypes.scientist;
                    rewardSubtype = sacrificialScientist.warpedId;
                    rewardQuantity = 1;
                    isCoreWarped = false;
                    isCoreBlessed = false;
                }
            }
            else
            {
                //maybe give a different normal scientist reset level to 0
                if(coreScientistRoller.boolean(0.5))
                {
                    rewardType = PitConfig.sacrificeTypes.scientist;
                    rewardSubtype = getRandomScientistId();
                    rewardQuantity = 1;
                }
            }
        }

        if(rewardQuantity <= 0) return null;
        return {
            type: rewardType,
            subtype: rewardSubtype,
            quantity: rewardQuantity
        }
    }

    grantSacrificeReward(reward)
    {
        switch(reward.type)
        {
            case PitConfig.sacrificeTypes.ore:
                worldResources[reward.subtype].numOwned += reward.quantity;
                break;
            case PitConfig.sacrificeTypes.relic:
                equipRelic(reward.subtype);
                break;
            case PitConfig.sacrificeTypes.special:
                if(reward.subtype == 1)
                {
                    isCoreWarped = true;
                    isCoreBlessed = false;
                }
                else if(reward.subtype == 2)
                {
                    isCoreWarped = false;
                    isCoreBlessed = true;
                }
                break;
            case PitConfig.sacrificeTypes.scientist:
                unlockScientistOfId(reward.subtype);
                break;
            default:
                throw "Error: Invalid sacrifice type";
        }
    }

    getPossibleOreRewardsArray(sacrificeType)
    {
        // All earth ores + isotopes
        var resourceRewards = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
        ];
        return resourceRewards;
    }

    showSacrificeNews(sacrificeType, sacrificeSubtype, quantity, reward)
    {
        var sacrificeString, rewardString;
        switch(sacrificeType)
        {
            case PitConfig.sacrificeTypes.ore:
                sacrificeString = beautifynum(quantity) + " " + worldResources[sacrificeSubtype].name;
                break;
            case PitConfig.sacrificeTypes.relic:
                sacrificeString = excavationRewards[equippedRelics[sacrificeSubtype]].name;
                break;
            case PitConfig.sacrificeTypes.scientist:
                sacrificeString = scientists[aliveScientists()[sacrificeSubtype][0]].name;
                break;
            default:
                throw "Error: Invalid sacrifice type";
        }
        if(reward)
        {
            switch(reward.type)
            {
                case PitConfig.sacrificeTypes.ore:
                    rewardString = beautifynum(reward.quantity) + " " + worldResources[reward.subtype].name;
                    break;
                case PitConfig.sacrificeTypes.relic:
                    rewardString = excavationRewards[reward.subtype].name;
                    break;
                case PitConfig.sacrificeTypes.special:
                    if(reward.subtype == 1)
                    {
                        newNews(_("You sacrificed Book of Secrets"));
                        newNews(_("Corruption spreads through the core"));
                        if(!mutebuttons) sacrificeWarped.play();
                        return;
                    }
                    else if(reward.subtype == 2)
                    {
                        newNews(_("You sacrificed Book of Secrets+"));
                        newNews(_("The core emits a golden hue"));
                        if(!mutebuttons) sacrificeDivine.play();
                        return;
                    }
                    break;
                case PitConfig.sacrificeTypes.scientist:
                    rewardString = scientists[reward.subtype].name;
                    break;
                default:
                    throw "Error: Invalid reward type";
            }
            newNews(_("You sacrificed {0} and received {1}!", sacrificeString, rewardString), true);
            if(!mutebuttons) sacrificeMineralAudio.play();
        }
        else
        {
            newNews(_("You sacrificed {0}... but nothing happened.", sacrificeString), true);
            if(!mutebuttons) sacrificeMineralAudio.play();
        }
    }
}

var pit = new Pit();