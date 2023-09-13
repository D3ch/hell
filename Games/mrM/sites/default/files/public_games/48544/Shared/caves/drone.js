var droneMovement = {
    ground: 0,
    air: 1,
    water: 2
}

class BaseDrone
{
    id;
    icon;
    spritesheet;
    level;
    maxLevel;
    totalHealth;
    totalFuel;
    fuelUsePerSecond;
    speedMultiplier;
    rewardCapacity;
    visionDistance;
    movementType;
    damagePerSecond;
    resistances = [];
    weaknesses = [];

    onEnterNode(node) { }
    onExitNode(node) { }
    specialUpdate(deltaTime) { }
}

class ActiveDrone extends BaseDrone
{
    baseDroneId;
    caveSystem;
    nodePath = []; // Array of CaveNode
    lastReachedNodeIndex = 0;
    progressToNextNode = 0;
    isAlive = true;
    isMovingForward = true;
    isFinished = false;
    isTakingDamage = false;
    isHealing = false;
    isActing = false;
    currentHealth;
    speed;
    currentFuel;
    inventory = []; // Array of CaveReward
    claimedRewards = []; // Array of CaveReward
    waitAtNodeTime = 0;
    totalWaitTime = 0;
    logStatus = false;
    totalTimeEstimate;
    elapsedTime = 0;
    flickerFrames = {};
    status = "";
    hasInitializedValues = false;

    constructor(baseDrone, caveSystem, nodePath, level = -1)
    {
        super();
        if(!isSimulating) this.setStatus(_("Moving through chamber"));
        Object.assign(this, baseDrone); // Copy base class values
        if(level >= 0) this.level = level;
        this.totalHealth = this.totalHealthLevels[this.level];
        this.fuelUsePerSecond = this.fuelUseLevels[this.level];
        this.speedMultiplier = this.speedMultiplierLevels[this.level];
        this.rewardCapacity = this.rewardCapacityLevels[this.level];
        this.caveSystem = caveSystem;
        this.baseDroneId = baseDrone.id;
        this.nodePath = nodePath;
        this.currentHealth = this.totalHealth;
        this.speed = this.speedMultiplier / TRAVEL_TIME_BETWEEN_NODES;
        this.currentFuel = this.totalFuel;
        this.totalTimeEstimate = this.getEstimatedTimeRemaining();

        var flickerFramePhaseShift = rand(0, 4);
        this.createDroneFlickerFrame('acting', '#FFFFFF', flickerFramePhaseShift);
        this.createDroneFlickerFrame('damage', '#FF0000', flickerFramePhaseShift + 1);
        this.createDroneFlickerFrame('healing', '#5EB65D', flickerFramePhaseShift + 2);

        this.revealNearbyNodes(this.nodePath[0], this.visionDistance);
        this.startCollectingRewardsOnNode(this.nodePath[0]);
        this.onEnterNode(this.nodePath[0]);
        this.nodePath[0].onDroneEnter(this);
    }

    update(deltaTime)
    {
        if(this.elapsedTime == 0 && this.logStatus) console.log("Drone " + this.id + " is starting path of length " + this.nodePath.length);
        this.elapsedTime += deltaTime;
        this.isTakingDamage = false;
        this.isHealing = false;
        if(!this.isFinished && this.isAlive)
        {
            this.currentFuel -= this.fuelUsePerSecond * deltaTime;
            if(this.waitAtNodeTime > 0)
            {
                this.waitAtNodeTime -= deltaTime;
                if(this.waitAtNodeTime > 0)
                {
                    this.nodePath[this.lastReachedNodeIndex].update(deltaTime, this);
                    if(this.logStatus) console.log("Drone " + this.id + " is waiting at node " + this.nodePath[this.lastReachedNodeIndex].id);
                }
                else
                {
                    this.totalWaitTime = 0;
                    this.isActing = false;
                    this.nodePath[this.lastReachedNodeIndex].onDroneExit(this);
                    this.onExitNode(this.nodePath[this.lastReachedNodeIndex]);
                    this.pickUpClaimedRewards();
                    if(this.lastReachedNodeIndex == 0 && !this.isMovingForward)
                    {
                        this.handlePathCompletion();
                    }
                }
            }
            else
            {
                if(this.nodePath.length == 1)
                {
                    // Special handling to end paths that only include the root node
                    this.handlePathCompletion();
                    return true;
                }
                this.move(deltaTime);
                var hasReachedNewNode = this.updateCurrentNode();
                if(hasReachedNewNode)
                {
                    this.nodePath[this.lastReachedNodeIndex].onDroneEnter(this);
                    this.onEnterNode(this.nodePath[this.lastReachedNodeIndex]);
                    if(this.lastReachedNodeIndex == 0)
                    {
                        // Immediately finish the path if there are no rewards on the root node
                        // this.handlePathCompletion();
                    }
                    else if(this.isMovingForward || this.lastReachedNodeIndex == this.nodePath.length - 1)
                    {
                        this.revealNearbyNodes(this.nodePath[this.lastReachedNodeIndex], this.visionDistance);
                    }
                }
                else
                {
                    if(this.isMovingForward)
                    {
                        if(this.logStatus) console.log("Drone " + this.id + " is moving to node " + this.nodePath[this.lastReachedNodeIndex + 1].id);
                    }
                    else
                    {
                        if(this.logStatus) console.log("Drone " + this.id + " is moving to node " + this.nodePath[this.lastReachedNodeIndex - 1].id);
                    }
                }
            }
            if(this.currentHealth <= 0 || this.currentFuel <= 0)
            {
                this.die();
            }
        }
        this.specialUpdate(deltaTime);
    }

    move(deltaTime)
    {
        this.progressToNextNode += this.speed * deltaTime;
    }

    updateCurrentNode()
    {
        if(this.progressToNextNode >= 1)
        {
            if(!isSimulating) this.setStatus(_("Moving through chamber"));
            this.progressToNextNode = 0;
            if(this.isMovingForward)
            {
                if(this.nodePath.length > 1)
                {
                    this.lastReachedNodeIndex++;
                    if(this.lastReachedNodeIndex == this.nodePath.length - 1)
                    {
                        this.isMovingForward = false;
                    }
                }
            }
            else
            {
                this.lastReachedNodeIndex--;
            }
            this.startCollectingRewardsOnNode(this.nodePath[this.lastReachedNodeIndex]);
            return true;
        }
        if(!isSimulating) this.setStatus(_("Moving through tunnel"));
        return false;
    }

    nextNodeIndex()
    {
        if(this.isMovingForward)
        {
            return this.lastReachedNodeIndex + 1;
        }
        else
        {
            return Math.max(0, this.lastReachedNodeIndex - 1);
        }
    }

    idOfFinalNodeInPath()
    {
        return this.nodePath[this.nodePath.length - 1].id;
    }

    pickUpClaimedRewards()
    {
        for(var i = this.claimedRewards.length - 1; i >= 0; --i)
        {
            var rewardToCollect = this.caveSystem.rewards[this.claimedRewards[i]];
            rewardToCollect.isClaimed = false;
            if(rewardToCollect.activateOnPickup)
            {
                rewardToCollect.pickUp(this);
                rewardToCollect.grant(this)
            }
            else if(!this.isInventoryFull())
            {
                this.inventory.push(this.claimedRewards[i]);
                rewardToCollect.pickUp();
            }
            this.claimedRewards.splice(i, 1);
        }
    }

    collectRewardsFromNode()
    {
        var node = this.nodePath[this.lastReachedNodeIndex];
        var rewards = this.caveSystem.getIndexOfRewardsOnNode(node);
        for(var i in rewards)
        {
            var rewardToCollect = this.caveSystem.rewards[rewards[i]];
            if(rewardToCollect.activateOnPickup)
            {
                rewardToCollect.pickUp(this);
                rewardToCollect.grant(this)
            }
            else if(!this.isInventoryFull())
            {
                this.inventory.push(rewards[i]);
                if(this.logStatus) console.log("Drone " + this.id + " collected a reward from node " + node.id);
                rewardToCollect.pickUp();
            }
        }
    }

    takeDamage(damageAmount, damageType)
    {
        if(this.resistances.includes(damageType)) damageAmount /= 2;
        else if(this.weaknesses.includes(damageType)) damageAmount *= 2;
        this.currentHealth -= damageAmount;
        if(damageAmount > 0)
        {
            this.isTakingDamage = true;
        }
        if(this.currentHealth < 0) this.currentHealth = 0;
    }

    heal(healAmount)
    {
        if(healAmount > 0)
        {
            this.isHealing = true;
            this.currentHealth = Math.min(this.totalHealth, this.currentHealth + healAmount);
        }
    }

    wait(waitTime)
    {
        // DP: Need a better fix for drones leaving 1 second early
        waitTime += 1;
        if(this.waitAtNodeTime < 0) this.waitAtNodeTime = 0;
        waitTime /= this.speedMultiplier;
        this.waitAtNodeTime += waitTime;
        this.totalWaitTime += waitTime;
    }

    resume()
    {
        this.waitAtNodeTime = 0;
    }

    claimRewardsOnNode()
    {
        if(!this.isInventoryFull())
        {
            var node = this.nodePath[this.lastReachedNodeIndex];
            var rewards = this.caveSystem.getIndexOfRewardsOnNode(node);
            for(var i in rewards)
            {
                var rewardToCollect = this.caveSystem.rewards[rewards[i]];
                if(rewardToCollect.activateOnPickup)
                {
                    rewardToCollect.pickUp(this);
                    rewardToCollect.grant(this)
                }
                else if(!this.isInventoryFull())
                {
                    this.inventory.push(rewards[i]);
                    if(this.logStatus) console.log("Drone " + this.id + " collected a reward from node " + node.id);
                    rewardToCollect.pickUp();
                }
            }
        }
        return false;
    }

    claimReward(rewardIndex)
    {
        var reward = this.caveSystem.rewards[rewardIndex];
        reward.distanceFromNode = 0;
        reward.isClaimed = true;
        this.claimedRewards.push(rewardIndex);
    }

    releaseReward(claimedRewardIndex)
    {
        var rewardIndex = this.claimedRewards[claimedRewardIndex];
        var reward = this.caveSystem.rewards[rewardIndex];
        reward.isClaimed = false;
        this.claimedRewards.splice(claimedRewardIndex, 1);
    }

    startCollectingRewardsOnNode(node)
    {
        var rewards = this.caveSystem.getIndexOfRewardsOnNode(node);
        var isCollectingReward = false;
        for(var i = 0; i < rewards.length; ++i)
        {
            var reward = this.caveSystem.rewards[rewards[i]];
            if((reward.activateOnPickup || this.claimedRewards.length < this.rewardCapacity - this.inventory.length) &&
                reward.canBeCollected(this))
            {
                this.isActing = true;
                this.claimReward(rewards[i]);
                this.wait(reward.collectionTime);
                if(!isSimulating) this.setStatus(_("Collecting treasure"));
                isCollectingReward = true;
            }
        }
        return isCollectingReward;
    }

    getEstimatedTimeRemaining()
    {
        // NOT ACCURATE YET
        var remainingTime = Math.max(0, this.waitAtNodeTime) + this.progressToNextNode * this.speedMultiplier;
        var multiplier;
        for(var i = 1; i < this.nodePath.length; ++i)
        {
            if(this.isMovingForward && i > this.lastReachedNodeIndex && i != this.nodePath.length - 1)
            {
                // Nodes that we'll cross through forward and backward
                multiplier = 2;
            }
            else if(!this.isMovingForward && i >= this.lastReachedNodeIndex)
            {
                // Nodes that have already been entered on the return trip
                multiplier = 0;
            }
            else
            {
                multiplier = 1;
            }
            remainingTime += multiplier * (this.speedMultiplier + this.nodePath[i].getDurationForDrone(this));
        }
        return remainingTime;
    }

    handlePathCompletion()
    {
        for(var i in this.inventory)
        {
            try
            {
                // this.caveSystem.rewards[this.inventory[i]].grant();
                treasureStorage.store(this.caveSystem.rewards[this.inventory[i]]);
            }
            catch(e)
            {
                console.warn(e);
            }
        }
        if(this.isInventoryFull() && (this.currentHealth / this.totalHealth) <= 0.05)
        {
            questManager.getQuest(52).markComplete();
        }

        this.isFinished = true;
        this.inventory = [];
        this.caveSystem.addFuel(this.currentFuel);
        if(this.logStatus) console.log("Drone " + this.id + " completed its path");
        newNews(_("A drone at {0}km has returned!", this.caveSystem.kmDepth));
        if(!mutebuttons) droneReturnAudio.play();
        if(this.caveSystem.isFinished())
        {
            numCavesCompleted++;
            trackEvent_CompletedCave(this.caveSystem.kmDepth);
            this.caveSystem.collapse();
            if(this.caveSystem.caveTreeDepth >= 15)
            {
                questManager.getQuest(51).markComplete();
            }
        }
    }

    die()
    {
        this.isAlive = false;
        for(var i = this.claimedRewards.length - 1; i >= 0; --i)
        {
            this.releaseReward(i);
        }
        for(var i in this.inventory)
        {
            this.caveSystem.rewards[this.inventory[i]].drop(this.nodePath[this.lastReachedNodeIndex]);
        }
        var otherDrones = this.caveSystem.getDronesOnNode(this.nodePath[this.lastReachedNodeIndex]);
        for(var i = 0; i < otherDrones.length; ++i)
        {
            // Let other drones waiting on the node collect any treasure this drone dropped/was collecting
            if(otherDrones[i].waitAtNodeTime > 0)
            {
                otherDrones[i].startCollectingRewardsOnNode(this.nodePath[this.lastReachedNodeIndex]);
            }
        }
        this.inventory = [];
        if(this.logStatus) console.log("Drone " + this.id + " died");
        newNews(_("A drone at {0}km has died", this.caveSystem.kmDepth));
    }

    isInventoryFull()
    {
        return this.inventory.length >= this.rewardCapacity;
    }

    revealNearbyNodes(startNode, maxDistance)
    {
        startNode.isRevealed = true;
        if(maxDistance > 0)
        {
            for(var i in startNode.children)
            {
                this.revealNearbyNodes(startNode.children[i], maxDistance - 1);
            }
        }
    }

    createDroneFlickerFrame(name, color, frameIndex = -1)
    {
        if(isSimulating) return;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var droneAnimationFrames = 4;
        var droneWidth = this.spritesheet.width / droneAnimationFrames;
        if(frameIndex < 0)
        {
            frameIndex = rand(0, droneAnimationFrames - 1);
        }
        frameIndex %= 4;
        canvas.width = droneWidth;
        canvas.height = droneWidth;
        context.drawImage(
            this.spritesheet,
            droneWidth * frameIndex,
            0,
            droneWidth,
            this.spritesheet.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
        context.globalCompositeOperation = "source-atop";
        context.globalAlpha = 0.3;
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        this.flickerFrames[name] = {image: frame, frameIndex: frameIndex};
    }

    setStatus(statusString)
    {
        this.status = statusString;
    }
}

function runDroneTest(baseDrone, caveSystem = null, deltaTime = 1)
{
    if(!caveSystem)
    {
        if(activeLayers.caveWindow)
        {
            caveSystem = activeLayers.caveWindow.caveSystem;
        }
        else
        {
            caveSystem = new CaveSystem(25, 7);
        }
    }
    var newDrone = new ActiveDrone(baseDrone, caveSystem, caveSystem.getRandomPath());
    newDrone.logStatus = true;
    while(newDrone.isAlive && !newDrone.isFinished)
    {
        newDrone.update(deltaTime);
    }
}


// ############## DRONE STATS DEFINITIONS ##############

// Save all drone levels as a single array
var currentDroneLevels = {
    get serializedSaveValue()
    {
        var saveValue = [];
        for(var i in drones)
        {
            saveValue[i] = drones[i].level;
        }
        return saveValue.join("!");
    },
    set serializedSaveValue(value)
    {
        var loadValue = value.split("!");
        for(var i in drones)
        {
            if(loadValue[i])
            {
                drones[i].level = parseInt(loadValue[i]);
            }
            else
            {
                console.warn("WARNING: Failed to load level for drone with ID " + drones[i].id)
            }
        }
    }
}

var drones = [];
var basicDrone;

basicDrone = new BaseDrone();
basicDrone.id = 0;
basicDrone.icon = groundDrone1_icon;
basicDrone.translatedName = _("BASIC DRONE");
basicDrone.description = _("A basic drone.");
basicDrone.movementType = droneMovement.ground;
basicDrone.spritesheet = groundDrone1_spritesheet;
basicDrone.maxLevel = 5;
basicDrone.totalFuel = 100;
basicDrone.level = 0;
basicDrone.totalHealthLevels = [200, 230, 260, 290, 320, 350];
basicDrone.fuelUseLevels = [0.08, 0.07, 0.06, 0.05, 0.05, 0.05];
basicDrone.speedMultiplierLevels = [1, 1.3, 1.6, 1.9, 2.2, 2.5];
basicDrone.rewardCapacityLevels = [3, 3, 4, 4, 5, 5];
basicDrone.visionDistance = 1;
basicDrone.damagePerSecond = 1;
drones[basicDrone.id] = basicDrone

magneticDrone = new BaseDrone();
magneticDrone.id = 1;
magneticDrone.icon = groundDrone2_icon;
magneticDrone.translatedName = _("MAGNETIC DRONE");
magneticDrone.description = _("Pulls rewards from branching paths on to its location.");
magneticDrone.movementType = droneMovement.ground;
magneticDrone.spritesheet = groundDrone2_spritesheet;
magneticDrone.maxLevel = 5;
magneticDrone.totalFuel = 200;
magneticDrone.level = 0;
magneticDrone.totalHealthLevels = [350, 400, 450, 500, 550, 600];
magneticDrone.fuelUseLevels = [0.3, 0.27, 0.24, 0.21, 0.18, 0.15];
magneticDrone.speedMultiplierLevels = [2.5, 2.7, 2.9, 3.1, 3.3, 3.5];
magneticDrone.rewardCapacityLevels = [0, 0, 0, 0, 0, 0];
magneticDrone.visionDistance = 1;
magneticDrone.damagePerSecond = 1;
magneticDrone.specialUpdate = function (deltaTime)
{
    if(this.claimedRewards.length > 0)
    {
        for(var i in this.claimedRewards)
        {
            // Animate reward to the drone
            if(!this.caveSystem.rewards[this.claimedRewards[i]].activateOnPickup)
            {
                this.caveSystem.rewards[this.claimedRewards[i]].distanceFromNode = this.waitAtNodeTime / this.totalWaitTime;
            }
        }
    }
}
magneticDrone.onEnterNode = function (node)
{
    if(this.isMovingForward || this.lastReachedNodeIndex == this.nodePath.length - 1)
    {
        for(var i in node.children)
        {
            if(node.children[i] != this.nodePath[this.nextNodeIndex()])
            {
                var rewardIndices = this.caveSystem.getIndexOfRewardsOnNode(node.children[i]);
                for(var j in rewardIndices)
                {
                    if(this.caveSystem.rewards[rewardIndices[j]].activateOnPickup) continue;
                    this.isActing = true;
                    this.claimReward(rewardIndices[j]);
                    if(!isSimulating) this.setStatus(_("Pulling in nearby treasure"));
                    this.wait(this.caveSystem.rewards[rewardIndices[j]].collectionTime);
                }
            }
        }
    }
}
magneticDrone.onExitNode = function (node)
{
    this.isActing = false;
    for(var j in this.claimedRewards)
    {
        var reward = this.caveSystem.rewards[this.claimedRewards[j]];
        reward.isClaimed = false;
        reward.locationNode = node;
    }
}
drones[magneticDrone.id] = magneticDrone

basicFlyingDrone = new BaseDrone();
basicFlyingDrone.id = 2;
basicFlyingDrone.icon = airDrone1_icon;
basicFlyingDrone.translatedName = _("AERIAL DRONE");
basicFlyingDrone.description = _("A basic flying drone. Avoids land based obstacles.");
basicFlyingDrone.movementType = droneMovement.air;
basicFlyingDrone.spritesheet = airDrone1_spritesheet;
basicFlyingDrone.maxLevel = 5;
basicFlyingDrone.level = 0;
basicFlyingDrone.totalFuel = 150;
basicFlyingDrone.totalHealthLevels = [100, 120, 140, 160, 180, 200];
basicFlyingDrone.fuelUseLevels = [0.3, 0.28, 0.26, 0.24, 0.22, 0.2];
basicFlyingDrone.speedMultiplierLevels = [3, 3.2, 3.4, 3.6, 3.8, 4];
basicFlyingDrone.rewardCapacityLevels = [1, 1, 2, 2, 3, 3];
basicFlyingDrone.visionDistance = 3;
basicFlyingDrone.damagePerSecond = 1;
drones[basicFlyingDrone.id] = basicFlyingDrone

healingDrone = new BaseDrone();
healingDrone.id = 3;
healingDrone.icon = healingDrone_icon;
healingDrone.translatedName = _("HEALING DRONE");
healingDrone.description = _("Gradually heals nearby drones after reaching its target location");
healingDrone.movementType = droneMovement.ground;
healingDrone.spritesheet = healingDrone_spritesheet;
healingDrone.maxLevel = 5;
healingDrone.level = 0;
healingDrone.totalFuel = 200;
healingDrone.totalHealthLevels = [20, 30, 40, 50, 60, 70];
healingDrone.fuelUseLevels = [0.7, .65, .6, .55, .5, .45];
healingDrone.speedMultiplierLevels = [6, 6.2, 6.4, 6.6, 6.8, 7];
healingDrone.rewardCapacityLevels = [0, 0, 0, 0, 0, 0];
healingDrone.visionDistance = 1;
healingDrone.damagePerSecond = 1;
healingDrone.healingPerSecond = 8;
drones[healingDrone.id] = healingDrone
healingDrone.specialUpdate = function (deltaTime)
{
    if(this.lastReachedNodeIndex == this.nodePath.length - 1)
    {
        this.isActing = false;
        var myNode = this.nodePath[this.lastReachedNodeIndex];
        if(!this.hasInitializedValues)
        {
            if(!isSimulating) this.setStatus(_("Healing nearby drones"));
            myNode.startEffect(this, "#5EB65D");
            if(myNode.parent)
            {
                myNode.parent.startEffect(this, "#5EB65D");
            }
            for(var i in myNode.children)
            {
                myNode.children[i].startEffect(this, "#5EB65D");
            }
            hasInitializedValues = true;
        }
        for(var i in this.caveSystem.activeDrones)
        {
            var drone = this.caveSystem.activeDrones[i];
            var droneNode = drone.nodePath[drone.lastReachedNodeIndex];
            if(droneNode == myNode ||
                (droneNode == myNode.parent && (drone.progressToNextNode == 0 || drone.isMovingForward)) ||
                (myNode.children.includes(droneNode) && (drone.progressToNextNode == 0 || !drone.isMovingForward)))
            {
                if(drone.currentHealth < drone.totalHealth)
                {
                    this.isActing = true;
                    drone.heal(this.healingPerSecond * deltaTime);
                }
            }
        }
    }
}
healingDrone.onEnterNode = function (node)
{
    if(this.lastReachedNodeIndex == this.nodePath.length - 1)
    {
        this.wait(Infinity);
        if(!isSimulating) this.setStatus(_("Healing nearby drones"));
    }
}

drones[healingDrone.id] = healingDrone

function getDroneById(id)
{
    if(drones[id] && drones[id].id == id)
    {
        return drones[id];
    }
    for(var i = 0; i < drones.length; ++i)
    {
        if(drones[i].id == id)
        {
            return drones[i];
        }
    }
    throw "Invalid drone ID";
}