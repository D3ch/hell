// ##############################################################
// ###################### QUOTE MANAGEMENT ######################
// ##############################################################

const MIN_TIME_BETWEEN_QUOTES_SECONDS = 120;
const MAX_TIME_BETWEEN_QUOTES_SECONDS = 240;
const TIME_BETWEEN_QUOTES_IN_A_CONVERSATION_MSECS = 2000;
var timeUntilNextQuote = (MIN_TIME_BETWEEN_QUOTES_SECONDS + MAX_TIME_BETWEEN_QUOTES_SECONDS) / 2;
var areQuotesEnabled = false;

function setTimeUntilNextQuote()
{
    timeUntilNextQuote = rand(MIN_TIME_BETWEEN_QUOTES_SECONDS, MAX_TIME_BETWEEN_QUOTES_SECONDS);
}

function isQuoteBeingShown()
{
    return activeMinerTexts.length > 0;
}

function updateQuotes(seconds)
{
    if(!areQuotesEnabled || isTimelapseOn || isSimulating || isOfflineProgressActive)
    {
        return;
    }

    timeUntilNextQuote -= seconds;
    if(timeUntilNextQuote <= 0)
    {
        setTimeUntilNextQuote();
        generateIdleQuote();
    }
}

function getQuoteId(queriedDepth, minerNum)
{
    var candidateQuotes = [];
    var candidateQuotesWeightSum = 0;
    for(var i = 0; i < workerQuotes.length; i++)
    {
        if(workerQuotes[i].canShow(queriedDepth, minerNum))
        {
            candidateQuotes.push(workerQuotes[i]);
            candidateQuotesWeightSum += workerQuotes[i].weight;
        }
    }
    var quoteSelectorValue = rand(0, candidateQuotesWeightSum - 1);
    for(var i = 0; i < candidateQuotes.length; i++)
    {
        if(quoteSelectorValue < candidateQuotes[i].weight)
        {
            return candidateQuotes[i].id;
        }
        else
        {
            quoteSelectorValue -= candidateQuotes[i].weight;
        }
    }
    return -1;
}

function generateIdleQuote()
{
    return;
    var quoteDepth = Math.max(0, currentlyViewedDepth - rand(0, 4));
    var workersAtQuoteDepth = workersHiredAtDepth(quoteDepth);
    if(workersAtQuoteDepth == 0) return;
    var minerNumber = rand(1, workersAtQuoteDepth);
    if(!isDepthWithoutWorkers(quoteDepth) && !isBossLevel(quoteDepth))
    {
        var quoteToSayId = getQuoteId(quoteDepth, minerNumber);
        sayQuoteWithId(quoteToSayId, quoteDepth, minerNumber);
    }
}

function sayQuoteWithId(id, quoteDepth, minerNumber)
{
    var silentMiners = [];
    for(var i = 0; i < workersHiredAtDepth(quoteDepth); i++)
    {
        if(i != minerNumber)
        {
            silentMiners.push(i);
        }
    }
    if(workerQuotes[id].nextIdsToShow.length > silentMiners.length)
    {
        return false;
    }

    for(var i = 0; i < workerQuotes[id].nextIdsToShow.length; i++)
    {
        var nextMinerNum = shuffleArray(silentMiners)[0];
        silentMiners.shift();
        setTimeout(sayQuoteWithId.bind(null, workerQuotes[id].nextIdsToShow[i], quoteDepth, nextMinerNum), TIME_BETWEEN_QUOTES_IN_A_CONVERSATION_MSECS);
    }
    addWorkerQuote(id, quoteDepth, minerNumber);
}

function addWorkerQuoteFromClick(workerScreenDepth, workerNum)
{
    var workerWorldDepth = currentlyViewedDepth - (5 - workerScreenDepth);
    var quoteToSayId = getQuoteId(workerWorldDepth, workerNum);
    addWorkerQuote(quoteToSayId, workerWorldDepth, workerNum);
    if(isJeb(workerWorldDepth, workerNum))
    {
        questManager.getQuest(90).markComplete();
    }
}

function addWorkerQuoteFromClickByDepth(workerWorldDepth, workerNum)
{
    var quoteToSayId = getQuoteId(workerWorldDepth, workerNum);
    addWorkerQuote(quoteToSayId, workerWorldDepth, workerNum);
    if(isJeb(workerWorldDepth, workerNum))
    {
        questManager.getQuest(90).markComplete();
    }
}

function addWorkerQuote(quoteId, workerWorldDepth, workerNum)
{
    if(!areQuotesEnabled || workerWorldDepth == depth + 1) return;
    for(var i = activeMinerTexts.length - 1; i >= 0; i--)
    {
        if(activeMinerTexts[i].workerDepth == workerWorldDepth && activeMinerTexts[i].workerNum == workerNum)
        {
            activeMinerTexts.splice(i, 1);
        }
    }

    var workerHitbox = null;
    if(activeLayers.WorldLayer && activeLayers.WorldLayer.getMinerAtLevel)
    {
        workerHitbox = activeLayers.WorldLayer.getMinerAtLevel(workerWorldDepth, workerNum);
    }

    activeMinerTexts.push(
        {
            "text": workerQuotes[quoteId].quote,
            "clickTime": currentTime(),
            "workerDepth": workerWorldDepth,
            "workerNum": workerNum,
            "workerHitbox": workerHitbox
        }
    );

    setTimeUntilNextQuote();
}

// ########################################################
// ###################### QUOTE DATA ######################
// ########################################################

const SHOW_INFREQUENT = 1;
const SHOW_STANDARD_FREQUENCY = 3;
const SHOW_FREQUENT = 8;
const SHOW_EXTREMELY_FREQUENT = 100;
const SHOW_NEVER_EXCEPT_AS_REPLY = 0;

var workerQuotes = [
    {
        "id": 0,
        "quote": "When will I get promoted to lower level??",
        "canShow": showIfInFirstHalfOfDepths,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 1,
        "quote": "I haven't seen my family for years",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 2,
        "quote": "When do I get a break?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 3,
        "quote": "Just digging my little hole looking for something shiny",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 4,
        "quote": "I wish I could get a drink but the bar doesn't serve miners.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 5,
        "quote": "Here I am just mining my own business.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 6,
        "quote": "She called me a gold digger and left.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 7,
        "quote": "The hats make me light headed.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 8,
        "quote": "The bathroom? Up three levels and just past Jimmy Hoffa.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 9,
        "quote": "What's mine is mine and what's your is mine, it's just all mine.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 10,
        "quote": "Stand in the other direction? Tried it once, weirded me out.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 11,
        "quote": "Level 50 is the worst! Those eyes just blinking at you all day, gave me the creeps.",
        "canShow": showIfNearGolem,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 12,
        "quote": "Just sitting in a lawn chair all day like he owns the place. Ain't right.",
        "canShow": showIfNearSurface,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 13,
        "quote": "No I don't think we all look the same.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 14,
        "quote": "Lonnie got promoted? He's really moving down in the world!",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 15,
        "quote": "If you call me 'Dopey', 'Sleepy', or 'Grumpy' again I'll end you.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 16,
        "quote": "There are no ladders or elevators, what does that tell ya about time off?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 17,
        "quote": "I'm just saying if we unionized we could at least get a fourth light in here.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 18,
        "quote": "Unless you find a chest they won't even look at ya.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 19,
        "quote": "I'm telling you, those scientists are suicidal.",
        "canShow": hasScientist,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 20,
        "quote": "What do you mean 'what am I doing tomorrow'!?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 21,
        "quote": "I'm telling ya, if you bring up multiple mines again you'll end up like Tucker.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 22,
        "quote": "Today I'm feeling a number 3 pick axe with walnut stock.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 23,
        "quote": "Are you standing closer to me today? I feel like you're standing closer.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 24,
        "quote": "$1Bil here $2Tril there, pretty soon you're talking real money!",
        "canShow": hasOverOneTrillionMoney,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 25,
        "quote": "I feel like most of the time no one up there is even paying attention.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 26,
        "quote": "Why aren't there more women in the mines? My mom said I need to meet someone.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 27,
        "quote": "The new uniforms are nice.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 28,
        "quote": "Eventually won't we technically be mining upward?",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 29,
        "quote": "Did you hear? Miner 306km #5 got attacked again last week, awful luck Miner 306km #5.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 30,
        "quote": "They can build an interstellar drill but can't give us wifi.",
        "canShow": isOnMoon,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 31,
        "quote": "A game about mining? That'd never work.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 32,
        "quote": "This is the craziest place I've been....probably because it's the only place I've been.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 33,
        "quote": "Didn't I see you yesterday?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 34,
        "quote": "The underground city is alright as far as lost underground civilizations go.",
        "canShow": showIfNearUndergroundCity,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 35,
        "quote": "Will someone tell Phil to stop saying 'ding!' every time he finds an isotope?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 36,
        "quote": "I'm telling the truth, I once found a never ending treasure chest!",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 37,
        "quote": "How is he levitating and spinning that chest!? Am I the only one seeing this!?",
        "canShow": showIfNearChest,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 38,
        "quote": "How do you figure the scientists end up in those chests?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 39,
        "quote": "I'm getting swole.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 40,
        "quote": "I swear to god that broken robot is dancing.",
        "canShow": showIfNearRobot,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 41,
        "quote": "The hottub at 500km is a bit intense.",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 42,
        "quote": "I'm anti-metal detector and pro-scroll wheel.",
        "canShow": hasMetalDetector,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 43,
        "quote": "It's always crunch time here.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 44,
        "quote": "Take one guess what's in those endless miner speed potions.",
        "canShow": hasScientist,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 45,
        "quote": "I just like saying polonium...polonium....p-o-l-o-n-i-u-m.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 46,
        "quote": "Before offline progression we could at least sneak off once in a while.",
        "canShow": hasManager,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 47,
        "quote": "How does a golem know how to make an advanced nuclear engine!?",
        "canShow": showIfNearGolem,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 48,
        "quote": "Yup, that tastes like gold",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 49,
        "quote": "Are we digging north to south or west to east?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 50,
        "quote": "You know, I actually saw the sun once.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 51,
        "quote": "c'mon jeb what are you doing...",
        "canShow": nearJeb,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 52,
        "quote": "We're all brothers. We're decamillilets. You should have seen our mom.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 53,
        "quote": "I've got diamond hands.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 54,
        "quote": "Are you keeping 6 feet?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 55,
        "quote": "The TNT at the trading post seems a tad unsafe.",
        "canShow": showIfNearTradingPost,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 56,
        "quote": "I have a name you know!",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 57,
        "quote": "They say Liam has never moved from day one.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 58,
        "quote": "They say we are in the cloud now. I don't get it.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 59,
        "quote": "Do you think we'll ever get last names?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 60,
        "quote": "It's all in the hips.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 61,
        "quote": "I'm having an existential crisis.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 62,
        "quote": "Why do we have to change outfits for chests?",
        "canShow": showIfNearChest,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 63,
        "quote": "Fruit flies last longer than scientists around here.",
        "canShow": hasScientist,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 64,
        "quote": "I'm spending my pay check on Bitcoin this month.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 65,
        "quote": "I'm spending my pay check on my medical bills this month.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 66,
        "quote": "Doctor said I'm in remission. Now I just need to pay off the bills by working a few years.",
        "canShow": alwaysShow,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 67,
        "quote": "I wanna mine bitcoin not rocks",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 68,
        "quote": "Mike took credit for the chest I found and he got promoted. I hate that guy.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 69,
        "quote": "Do you think anyone is listening to our pain?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 70,
        "quote": "If you don't survive can I have your socks?",
        "canShow": showIfNearBattle,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 71,
        "quote": "I don't think Jeb's brain is getting enough oxygen",
        "canShow": nearJeb,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 72,
        "quote": "Watch out for the septic tank",
        "canShow": showIfNearEndOfWorld,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 73,
        "quote": "I didn't sign up to be monster bait",
        "canShow": showIfNearBattle,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 74,
        "quote": "I dare you to jump in there, how hot could it be?",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 75,
        "quote": "Don't even think about stealing that or you will end up like Tucker.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": [76]
    },
    {
        "id": 76,
        "quote": "Tucker? What Tucker?",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": [77]
    },
    {
        "id": 77,
        "quote": "Exactly..",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 78,
        "quote": "If we all fight together maybe we can take that monster down",
        "canShow": showIfNearBattle,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": [79, 80]
    },
    {
        "id": 79,
        "quote": "I don't get paid enough for that, besides I never really liked him",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 80,
        "quote": "I have quotas to fill, you are on your own",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 81,
        "quote": "Hey I'm new here, you guys doing anything fun after work?",
        "canShow": showIfIsFurthestDepth,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": [82]
    },
    {
        "id": 82,
        "quote": "There is no.. after",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 83,
        "quote": "Oh thank god finally a break, its been days since I got one.",
        "canShow": isCapacityFull,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 84,
        "quote": "The manager really thinks he is a hot shot. Can't stand him.",
        "canShow": hasManager,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 85,
        "quote": "Bill keeps flinging dirt at me, how do I get in contact with HR?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 86,
        "quote": "They said it was a space cruise, they said it was relaxing..",
        "canShow": isOnMoon,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 87,
        "quote": "What do you think he is doing in that hole?",
        "canShow": showIfNearGolem,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": [88]
    },
    {
        "id": 88,
        "quote": "I think he just counts his money all day",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": [89]
    },
    {
        "id": 89,
        "quote": "Regardless, is it that hard to install a door?",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 90,
        "quote": "Yeah that black lung is no joke",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 91,
        "quote": "I want to explore the crack",
        "canShow": showIfNearGolem,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 92,
        "quote": "I think we've reached rock bottom",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 93,
        "quote": "Does it feel like we are going up to anyone else?",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 94,
        "quote": "Yes I am half a kilometer tall, what about it?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 95,
        "quote": "We need to dig up some dirt on Mr.Mine",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 96,
        "quote": "The only way Mr.Mine runs on Steam is with coal.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 97,
        "quote": "I heard that some people pay $50 to be put in the mines",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 98,
        "quote": "Anyone want to make a run for the city?",
        "canShow": showIfNearUndergroundCity,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 99,
        "quote": "I'm not sure what everyone is complaining about, I love it here.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 100,
        "quote": "I got a diamond what did you get?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": [101]
    },
    {
        "id": 101,
        "quote": "I got a rock",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 102,
        "quote": "If we all scoot an inch over maybe we'll find something good.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 103,
        "quote": "Why are you all upside down?",
        "canShow": isJeb,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 104,
        "quote": "Mining this way is way easier on the wrists",
        "canShow": isJeb,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 105,
        "quote": "Are we there yet?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 106,
        "quote": "It's been 2 months and the company still has not realised I pushed Bob over the side",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 107,
        "quote": "Strange things are happening in this mine.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 108,
        "quote": "A whole floor of miners has gone missing. Bob was written on the wall in blood. Backwards.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 109,
        "quote": "When you need to pee just go over the edge.",
        "canShow": isTenthMiner,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 110,
        "quote": "I miss my wife",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 111,
        "quote": "I love rocks",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 112,
        "quote": "I feel like I'm not getting anywhere ..",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 113,
        "quote": "DIGGY DIGGY, HOLE IM DIGGING A HOLE",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 114,
        "quote": "Are we any more free than the bones trapped down here?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 115,
        "quote": "These are the corridors of madness.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 116,
        "quote": "Can't fall off the edge... can't fall off the edge..",
        "canShow": isTenthMiner,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 117,
        "quote": "How have I not dug through the ground yet?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 118,
        "quote": "If we mined through the planet, shouldn't we be upside down?",
        "canShow": showIfNearEndOfWorld,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 119,
        "quote": "I always wanted to be a dancer, not a dirty dancer",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 120,
        "quote": "Why was I placed on the ugly level",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": [121]
    },
    {
        "id": 121,
        "quote": "-_-",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 122,
        "quote": "I don't get paid enough for this",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": [123]
    },
    {
        "id": 123,
        "quote": "Wait, you get paid?",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 124,
        "quote": "Ahhh my feet are burning",
        "canShow": fullyUpgradedEarthMiner,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 125,
        "quote": "They need to give us better tools I'm getting sick of this pickaxe",
        "canShow": hasTenMinersButNotUpgraded,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 126,
        "quote": "Sometimes I feel like I am mining for no reason, where's the appreciation",
        "canShow": alwaysShow,
        "weight": SHOW_INFREQUENT,
        "nextIdsToShow": [127]
    },
    {
        "id": 127,
        "quote": "Stop complaining, at least you aren't a game developer or something",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 128,
        "quote": "I hope they don't sacrifice us to The Core",
        "canShow": showIfNearCore,
        "weight": SHOW_EXTREMELY_FREQUENT,
        "nextIdsToShow": []
    },
    {
        "id": 129,
        "quote": "What is that giant white arrow and why is it hitting us?",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 130,
        "quote": "I'm living my best life. I love the smell of sweat and dirt under dim lighting.",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 131,
        "quote": "Wow look at this it is amazing! Look what I found!",
        "canShow": isFirst30DepthOfEarth,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": [132]
    },
    {
        "id": 132,
        "quote": "Let me guess, is it coal .. again?",
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 133,
        "quote": "You all might want to wait if you plan to light a match",
        "canShow": alwaysShow,
        "weight": SHOW_STANDARD_FREQUENCY,
        "nextIdsToShow": []
    },
    {
        "id": 134,
        "quote": "Mine Boys! Deeper! Faster! Harder!",
        "canShow": alwaysShow,
        "weight": SHOW_INFREQUENT,
        "nextIdsToShow": [135, 136]
    },
    {
        "id": 135,
        "quote": String.fromCharCode(3232) + "_" + String.fromCharCode(3232),
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 136,
        "quote": String.fromCharCode(9684) + "_" + String.fromCharCode(9684),
        "canShow": neverShowExceptAsReply,
        "weight": SHOW_NEVER_EXCEPT_AS_REPLY,
        "nextIdsToShow": []
    },
    {
        "id": 137,
        "quote": "Join us on Discord!",
        "canShow": isDiscordMods,
        "weight": SHOW_FREQUENT,
        "nextIdsToShow": []
    }
];

//#####################################################
//################ CANDIDATE FUNCTIONS ################
//#####################################################

function alwaysShow(queriedDepth, minerNum)
{
    return true;
}

function showIfNearBattle(queriedDepth, minerNum)
{
    return (battleWaiting.length > 0 && Math.abs(battleWaiting[1] - queriedDepth) < 2);
}

function showIfNearSurface(queriedDepth, minerNum)
{
    return queriedDepth == 0;
}

function showIfNearMoonSurface(queriedDepth, minerNum)
{
    return queriedDepth == 1032;
}

function showIfNearTradingPost(queriedDepth, minerNum)
{
    return queriedDepth == 21;
}

function showIfNearGolem(queriedDepth, minerNum)
{
    return queriedDepth == 50;
}

function showIfNearRobot(queriedDepth, minerNum)
{
    return queriedDepth == 225;
}

function showIfNearUndergroundCity(queriedDepth, minerNum)
{
    return queriedDepth == 299 || queriedDepth == 304;
}

function showIfNearUndergroundCity(queriedDepth, minerNum)
{
    return queriedDepth == 299 || queriedDepth == 304;
}

function showIfNearMime(queriedDepth, minerNum)
{
    return queriedDepth == 112 && minerNum < 5;
}

function showIfNearEndOfWorld(queriedDepth, minerNum)
{
    return queriedDepth == 999;
}

function showIfNearBoss(queriedDepth, minerNum)
{
    return isBossLevel(queriedDepth + 1);
}

function showIfNearCore(queriedDepth, minerNum)
{
    return queriedDepth == 500 || queriedDepth == 502;
}

function showIfNearChest(queriedDepth, minerNum)
{
    return chestService.chestExistsAtDepth(queriedDepth);
}

function showIfIsFurthestDepth(queriedDepth, minerNum)
{
    return queriedDepth == depth;
}

function nearJeb(queriedDepth, minerNum)
{
    return queriedDepth == 1089 && (minerNum == 7 || minerNum == 9);
}

function isJeb(queriedDepth, minerNum)
{
    return queriedDepth == 1089 && minerNum == 8;
}

function hasScientist(queriedDepth, minerNum)
{
    return numActiveScientists() > 0;
}

function hasManager(queriedDepth, minerNum)
{
    return managerStructure.level > 0;
}

function hasMetalDetector(queriedDepth, minerNum)
{
    return metalDetectorStructure.level > 0;
}

function showIfCapacityIsFull(queriedDepth, minerNum)
{
    return isCapacityFull();
}

function hasOverOneTrillionMoney(queriedDepth, minerNum)
{
    return money >= 1000000000000;
}

function isOnMoon(queriedDepth, minerNum)
{
    return queriedDepth >= 1032;
}

function neverShowExceptAsReply()
{
    return false;
}

function isTenthMiner(queriedDepth, minerNum)
{
    return minerNum == 10;
}

function fullyUpgradedEarthMiner(queriedDepth, minerNum)
{
    return queriedDepth < 1032 && workerLevelAtWorld(0) == 10;
}

function hasTenMinersButNotUpgraded(queriedDepth, minerNum)
{
    return queriedDepth < 1032 && workersHiredAtWorld(0) == 10 && workerLevelAtWorld(0) == 1;
}

function isFirst30DepthOfEarth(queriedDepth, minerNum)
{
    return queriedDepth <= 30;
}

function showIfInFirstHalfOfDepths(queriedDepth, minerNum)
{
    return depth > queriedDepth * 2;
}

function isDiscordMods(queriedDepth, minerNum)
{
    return queriedDepth == 200 && minerNum > 1 && minerNum < 7;
}