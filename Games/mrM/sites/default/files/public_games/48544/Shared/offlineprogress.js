var isOfflineProgressActive = false;
var cavesSpawnDuringOfflineProgress = 0;

var managerStats = [
    {
        "efficiency": 0.25,
        "durationMins": (12 * 60)
    },
    {
        "efficiency": 0.50,
        "durationMins": (24 * 60)
    },
    {
        "efficiency": 1.00,
        "durationMins": (48 * 60)
    }
];

function timeSinceLastPlay()
{
    return servertime - savetime;
}

function runOfflineProgress()
{
    var secondsOffline = timeSinceLastPlay();

    var effectiveManagerLevel = Math.min(managerStats.length, managerStructure.level);
    var offlineEfficiency = managerStats[effectiveManagerLevel - 1].efficiency;
    var offlineDurationMins = managerStats[effectiveManagerLevel - 1].durationMins * STAT.offlineProgressMaxDurationMultiplier();

    //Do offline progress
    var offlineTimeMinutes = Math.floor(secondsOffline / 60);
    var usedMaxOfflineTimeAmount = offlineDurationMins < offlineTimeMinutes;
    var offlineTimeMinutesReceived = Math.min(offlineTimeMinutes, offlineDurationMins);

    var statsGained = {
        "depth": decimalDepth(),
        "mineralValue": getValueOfMinerals(),
        "secondsOffline": secondsOffline,
        "offlineEfficiency": offlineEfficiency,
        "offlineDurationMins": offlineTimeMinutesReceived,
        "usedMaxOfflineTimeAmount": usedMaxOfflineTimeAmount
    };

    var totalOfflineProgressTime = offlineTimeMinutesReceived * offlineEfficiency;

    isOfflineProgressActive = true;
    timelapse(totalOfflineProgressTime);


    if(chestCollectorStorageStructure.level > 0)
    {
        for(var i = 0; i < totalOfflineProgressTime; i += 0.5)
        {
            chestService.spawnRandomChests();
            if(chestService.isChestCollectorFull())
            {
                i = totalOfflineProgressTime;
            }
        }
        chestService.removeAllChests();
    }

    if(cavesSpawnDuringOfflineProgress == 1 && totalOfflineProgressTime >= 240 && depth >= MIN_CAVE_SYSTEM_SPAWN_DEPTH)
    {
        for(var i=0; i<100000; i++)
        {
            if(numActiveCaves() == 0)
            {
                rollForCaveSystemSpawn();
            }
            else
            {
                i = 100000;
            }
        }
    }

    isOfflineProgressActive = false;

    //Compute differences
    statsGained.depth = decimalDepth() - statsGained.depth;
    statsGained.mineralValue = getValueOfMinerals() - statsGained.mineralValue;

    //Return values to be passed to UI
    return statsGained;
}