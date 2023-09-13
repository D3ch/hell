function workersHiredAtWorld(worldIndex)
{
    return worlds[worldIndex].workersHired;
}

function workerLevelAtWorld(worldIndex)
{
    return worlds[worldIndex].workerLevel;
}

function workersHiredAtDepth(depthToCheck)
{
    return worldAtDepth(depthToCheck).workersHired;
}

function workersLevelAtDepth(depthToCheck)
{
    return worldAtDepth(depthToCheck).workerLevel;
}

function hireMiner(worldIndex)
{
    var worldReference = worlds[worldIndex];
    if(worldReference.canHireWorker())
    {
        worldReference.hireWorker();

        trackEvent_HireMiner(worldReference.workersHired);
        newNews(_("You hired worker #{0}", worldReference.workersHired), true);
        if(!mutebuttons) hireAudio.play();
        return true;
    }
    else
    {
        if(worldReference.workersHired >= 10)
        {
            newNews(_("You already hired the maximum amount of workers."));
        }
        else
        {
            newNews(_("Oops..You don't have enough money."));
        }
        return false;
    }
}

function upgradeMiners(worldIndex)
{
    var worldReference = worlds[worldIndex];
    if(worldReference.canUpgradeWorkersLevel())
    {
        worldReference.upgradeWorkers();

        trackEvent_UpgradeMiners(worldReference.workerLevel);
        newNews(_("You upgraded your workers to lvl{0}", worldReference.workerLevel), true);
        if(!mutebuttons) hireAudio.play();
        return true;
    }
    else
    {
        newNews(_("Oops..You don't have enough money."));
        return false;
    }
}

function onWorkerClicked(d, workerNum)
{
    var depthToCheck = (currentlyViewedDepth - (5 - d));
    if(depthToCheck < 0 || isDepthWithoutWorkers(depthToCheck)) return;
    if(workersHiredAtDepth(depthToCheck) < workerNum) return;

    if(chestService.chestExistsAtDepth(depthToCheck))
    {
        let chest = chestService.getChest(depthToCheck, workerNum);
        if(chest)
        {
            chestService.presentChest(depthToCheck, workerNum);
        }
        else
        {
            addWorkerQuoteFromClick(d, workerNum);
        }
    }
    else if(battleWaiting[0] == workerNum && battleWaiting[1] == depthToCheck)
    {
        battleui(battleWaiting[2], battleWaiting[3]);
        depthOfMonster = battleWaiting[1]
        battleWaiting = [];
    }
    else
    {
        addWorkerQuoteFromClick(d, workerNum)
    }
}