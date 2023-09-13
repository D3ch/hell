const CAVE_UPDATE_DELTA_TIME_SECONDS = 0.1;
const CAVE_MINIMUM_LIFETIME_SECONDS = 1500;
const CAVE_SYSTEM_DURATION_PER_NODE_SECONDS = 100;
const MAX_CAVE_SYSTEMS_AT_A_TIME = 7;
const CAVE_BUILDING_DEPTH = 45;
const MIN_CAVE_SYSTEM_SPAWN_DEPTH = 46;
const CAVE_DEPTH_SCALE_EXPONENT = 0.444;
const TRAVEL_TIME_BETWEEN_NODES = 100;

var caves = [];
var treasureStorage = new TreasureStorage();

var numberOfCavesExplored = 0;
var numCavesCompleted = 0;
var numberOfRewardsCollected = 0;
var hasFirstCaveSpawned = false;
var hasCollectedTreasure = false;
var hasSeenCaveTutorial = false;

//Setup initial state so this can be loaded into
for(var i = 0; i < MAX_CAVE_SYSTEMS_AT_A_TIME; i++)
{
    caves.push(createCaveSystem(0, 0, 1));
    caves[i].isActive = false;
}

function minSpawnableCaveDepth(maxDepth)
{
    return Math.max(MIN_CAVE_SYSTEM_SPAWN_DEPTH, maxDepth / 2);
}

//###########################################################
//###################### FUNCTIONALITY ######################
//###########################################################

function getActiveCaves()
{
    var result = [];
    for(var i = 0; i < caves.length; i++)
    {
        if(caves[i].isActive)
        {
            result.push(caves[i]);
        }
    }
    return result;
}

function getCaveAtDepth(caveDepth)
{
    for(var i = 0; i < caves.length; i++)
    {
        if(caves[i].kmDepth == caveDepth)
        {
            return caves[i];
        }
    }
    return null;
}

function numActiveCaves()
{
    return getActiveCaves().length;
}

function createCaveSystem(kmDepth, caveTreeDepth, maxNodesPerDepth)
{
    var newCave = new CaveSystem(kmDepth, caveTreeDepth, maxNodesPerDepth);
    if(caveTreeDepth > 0)
    {
        newNews(_("A cave entrance has opened at {0}km!", kmDepth));
        if(!mutebuttons) caveAppearsAudio.play();
    }
    return newCave;
}
//###########################################################
//######################### UPDATE ##########################
//###########################################################

function caveUpdate(deltaTime, spawnNewCaves = true)
{
    if(depth >= MIN_CAVE_SYSTEM_SPAWN_DEPTH)
    {
        for(var i = 0; i < caves.length; i++)
        {
            try
            {
                caves[i].update(deltaTime);
            }
            catch(e)
            {
                console.warn("Cave " + i + " failed to update.");
                console.warn(e);
            }

            //Collapse finished or inactive caves
            if(caves[i].caveTreeDepth > 0 && (!caves[i].isActive || caves[i].remainingSeconds <= 0))
            {
                newNews(_("The cave at {0}km has collapsed", caves[i].kmDepth));
                caves[i] = createCaveSystem(0, 0, 1);
                caves[i].isActive = false;
            }
        }
        if(spawnNewCaves)
        {
            rollForCaveSystemSpawn();
        }
    }
}

//###########################################################

function rollForCaveSystemSpawn()
{
    var maxConcurrentCaveSystems = Math.min(4, (depth - MIN_CAVE_SYSTEM_SPAWN_DEPTH) / 100);
    var averageCaveSystemDuration = getNumSecondsBetweenSpawnsAtCurrentDepth();
    var canSpawnFirstCave = depth >= MIN_CAVE_SYSTEM_SPAWN_DEPTH && !hasFirstCaveSpawned && !isSimulating;
    if(canSpawnFirstCave || (caveRoller.rand(0, Math.floor(averageCaveSystemDuration / CAVE_UPDATE_DELTA_TIME_SECONDS)) == 1 && numActiveCaves() < maxConcurrentCaveSystems))
    {
        var minDepth = minSpawnableCaveDepth(depth);
        var depthToSpawn = caveRoller.rand(minDepth, depth);
        if(canSpawnFirstCave)
        {
            depthToSpawn = MIN_CAVE_SYSTEM_SPAWN_DEPTH;
        }
        if(!isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
        {
            if(canSpawnFirstCave)
            {
                hasFirstCaveSpawned = true;
            }
            //Spawn a cave with a given depth
            //console.log(`spawned cave at ${depthToSpawn}`)
            startCaveAtDepth(depthToSpawn);
            updateCaveSystemSpawns();
        }
    }
}

function getCaveTreeDepthForCaveGameWorldDepth(gameDepth)
{
    return Math.round(Math.pow(gameDepth, CAVE_DEPTH_SCALE_EXPONENT));
}

function getMaxNodesPerDepthBasedOnCaveGameWorldDepth(gameDepth)
{
    var caveTreeDepth = getCaveTreeDepthForCaveGameWorldDepth(gameDepth);
    return Math.ceil(Math.sqrt(caveTreeDepth));
}

function startCaveAtDepth(caveGameDepth)
{
    //Find an inactive cave
    for(var i = 0; i < caves.length; i++)
    {
        if(!caves[i].isActive)
        {
            var caveTreeDepth = getCaveTreeDepthForCaveGameWorldDepth(caveGameDepth);
            var maxNodes = getMaxNodesPerDepthBasedOnCaveGameWorldDepth(caveGameDepth);
            caves[i] = createCaveSystem(caveGameDepth, caveTreeDepth, maxNodes);
            caves[i].isActive = true;
            caves.sort((a, b) => a.kmDepth < b.kmDepth ? -1 : 1);
            return;
        }
    }
    console.log("No inactive cave");
}

function simulateCavesForTime(timeInSeconds)
{
    var minRemainingTimeForCaveSpawns = CAVE_MINIMUM_LIFETIME_SECONDS / 2;
    var time = 0;
    while(time < timeInSeconds)
    {
        var allowCaveSpawns = timeInSeconds - time < minRemainingTimeForCaveSpawns;
        var deltaTime = allowCaveSpawns ? 0.1 : 3;
        if(getActiveCaves().length > 0 || allowCaveSpawns)
        {
            caveUpdate(deltaTime, allowCaveSpawns);
        }
        time += deltaTime;
    }
}

function spawnTestCaves()
{
    var maxIterations = 100;
    for(var i in caves) caves[i].isActive = false;
    for(var i = 0; getActiveCaves().length < MAX_CAVE_SYSTEMS_AT_A_TIME && i < maxIterations; ++i)
    {
        var minDepth = Math.max(MIN_CAVE_SYSTEM_SPAWN_DEPTH, depth / 2);
        var depthToSpawn = caveRoller.rand(minDepth, depth);
        if(!isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
        {
            //Spawn a cave with a given depth
            startCaveAtDepth(depthToSpawn);
            updateCaveSystemSpawns();
        }
    }
}

var cachedSampledCaveDuration = {};
function getAverageSampledCaveDurationToDepth(maxDepth)
{
    if(cachedSampledCaveDuration.hasOwnProperty(maxDepth))
    {
        return cachedSampledCaveDuration[maxDepth];
    }

    var minDepth = minSpawnableCaveDepth(maxDepth);
    var numSamplesPerDepth = 4;
    var samples = 0;
    var totalSpawnedNodes = 0;

    for(var i = minDepth; i <= maxDepth; i++)
    {
        for(var j = 0; j < numSamplesPerDepth; j++)
        {
            var sampledCaveDepth = i;
            var caveTreeDepth = getCaveTreeDepthForCaveGameWorldDepth(sampledCaveDepth);

            for(k = 0; k < caveTreeDepth; k++)
            {
                var maxNodes = getMaxNodesPerDepthBasedOnCaveGameWorldDepth(sampledCaveDepth);
                var parentLeaves = 1;
                var nodesForThisDepth = rand(1, maxNodes);
                var remainingOptionalNodes = nodesForThisDepth;
                var numCurrentLeaves = 0;
                for(var L = 0; L < parentLeaves; L++)
                {
                    var maxAllowedToConnect = Math.max(0, remainingOptionalNodes - Math.floor((numCurrentLeaves - L) / 4));
                    if(maxAllowedToConnect > 0)
                    {
                        numChildrenToConnect = rand(1, maxAllowedToConnect);
                    }
                    totalSpawnedNodes += numChildrenToConnect;
                    numCurrentLeaves += numChildrenToConnect;
                }
                parentLeaves = numCurrentLeaves;
            }
            samples++;
        }
    }
    var returnValue = Math.max(CAVE_MINIMUM_LIFETIME_SECONDS, (totalSpawnedNodes / samples) * CAVE_SYSTEM_DURATION_PER_NODE_SECONDS);
    cachedSampledCaveDuration[maxDepth] = returnValue;
    return returnValue;
}

var cachedAtDepth = -1;
var cachedNumCaves = -1;
var cachedNumSecs = -1;

var spawnRateMultiplier = 1;
function getNumSecondsBetweenSpawnsAtCurrentDepth()
{
    var currentNumActiveCaves = numActiveCaves();

    if(depth == cachedAtDepth && cachedNumCaves == currentNumActiveCaves)
    {
        return cachedNumSecs;
    }

    var idealNumCaves = 0;

    //logarithmic fit (50, 0.5), (150, 1), (500, 1.25)
    if(depth < 500)
    {
        idealNumCaves = 0.323839 * Math.log(0.109139 * depth);
    }
    else if(depth < 600) //interpolate between both log fit curves as they connect at 500km
    {
        var easePercent = (depth - 500) / 100;
        var firstPart = 0.323839 * Math.log(0.109139 * depth) * (1 - easePercent);
        var secondPart = 0.721348 * Math.log(0.0100794 * depth) * (easePercent);
        idealNumCaves = firstPart + secondPart;
    }
    else //logarithmic fit (500, 1.25), (1000, 1.5), (2000, 2.25)
    {
        idealNumCaves = 0.721348 * Math.log(0.0100794 * depth);
    }

    var averageCaveDuration = getAverageSampledCaveDurationToDepth(depth);

    //If they have more caves than ideal slow spawn rate down, if they don't have enough speed it up
    var differenceInCavesFromTargetNumber = currentNumActiveCaves - idealNumCaves;
    var spawnMultiplier = 2;
    if(currentNumActiveCaves == 0)
    {
        spawnMultiplier = 0.25; //0.09 -> 0.20 -> 0.25
    }
    else if(differenceInCavesFromTargetNumber < 0)
    {
        //Messy formula
        spawnMultiplier = Math.max(0.1, 2 - (Math.pow((Math.max(Math.abs(differenceInCavesFromTargetNumber), 1) * 10), 0.75) / 10));
    }
    else
    {
        spawnMultiplier = 2 + (2 * differenceInCavesFromTargetNumber);
    }

    let time = spawnMultiplier * averageCaveDuration * spawnRateMultiplier;

    cachedNumSecs = time;
    cachedAtDepth = depth;
    cachedNumCaves = currentNumActiveCaves;

    return time;
}

var caveTips = [
    _("TIP: Use magnetic drones to pull multiple treasures onto a single location"),
    _("TIP: A magnetic drone won't pull treasure from its own path"),
    _("TIP: Be careful collecting treasure from hazardous locations"),
    _("TIP: Any remaining fuel will be regained when a drone returns"),
    _("TIP: Drones drop their inventory when they die"),
    _("TIP: Flying drones avoid ground-based obstacles like boulders and lava"),
    _("TIP: Drones normally take 2 minutes to travel between locations"),
    _("TIP: There's no cost to send out a drone"),
    _("TIP: Treasure will be collected when drones return"),
    _("TIP: Stored treasure can be collected in the cave building"),
    _("TIP: Drones can be upgraded in the cave building"),
    _("TIP: Cave fuel can be upgraded in the Structures tab of the craft menu"),
    _("TIP: Flying drones can see further than other drones"),
    _("TIP: Magnetic drones can save treasure from hazardous locations"),
    _("TIP: Boulders can be destroyed by all land based drones")
];