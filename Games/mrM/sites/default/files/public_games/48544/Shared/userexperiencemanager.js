/*
This is used to help smooth one off user experience issues
*/

var userExperienceBranchesTriggered = [false, false, false, false, false, false, false, false, false, false];

function setBranchToTriggered(branchId)
{
    userExperienceBranchesTriggered[branchId] = true;
}

function hasBranchTriggered(branchId)
{
    return userExperienceBranchesTriggered[branchId];
}

//Called once per 1 second
function updateUserExperience()
{
    //Probably should move this to worldclickables.js
    //Spawn mineral deposits if the player is < 100km
    var maxClickables;
    if(depth < 20)
    {
        maxClickables = Math.floor(Math.sqrt(depth + 5));
    }
    else
    {
        maxClickables = 1;
    }
    var shouldSpawnDeposit =
        numClickablesOfType(MINERAL_DEPOSIT_ID) < maxClickables && (
            (depth < 50 && Math.floor(userExperienceRoller.rand(0, Math.max(2, Math.pow(depth, .75)))) == 0) ||
            (depth >= 50 && depth < 100 && Math.floor(userExperienceRoller.rand(0, (depth * 2))) == 0) ||
            (depth == 0 && numCoalOwned() == 0) ||
            (depth <= 1 && numCoalOwned() < 10 && userExperienceRoller.rand(0, 1) == 0)
        );

    if(shouldSpawnDeposit)
    {
        var depthToSpawn = userExperienceRoller.rand(depth / 2, depth);
        if(depthToSpawn == 20)
        {
            return;
        }
        var mineralTypeToSpawn = getMineralDepositType(depthToSpawn + 5);
        var numMineralsPerMinute = estimatedMineralsPerMinuteAtLevel(depthToSpawn + 5);
        var mineralsSpawnPerMinuteForType = numMineralsPerMinute[mineralTypeToSpawn];
        var numMineralPerClick = Math.max(1, Math.floor(mineralsSpawnPerMinuteForType / 3));
        if(depth >= 10 && !isNaN(numMineralPerClick) && !isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
        {
            var newClickable = getNewMineralDeposit(++clickablesSpawned, mineralTypeToSpawn, numMineralPerClick, depthToSpawn, userExperienceRoller.rand(1, 9));
            worldClickables.push(newClickable);
        }
        else if(!isClickableAtDepth(depthToSpawn) && isSpawnableAtDepth(depthToSpawn))
        {
            if(mineralTypeToSpawn == 1)
            {
                // Minimum of 2 coal per click
                numMineralPerClick = Math.max(2, depth)
            }
            else
            {
                numMineralPerClick = Math.max(1, depth)
            }
            var newClickable = getNewMineralDeposit(++clickablesSpawned, mineralTypeToSpawn, numMineralPerClick, depthToSpawn, userExperienceRoller.rand(1, 9));
            worldClickables.push(newClickable);
        }
    }
}