class CaveSystem
{
    isActive = true;
    isExplored = false;
    totalDuration = 0;
    remainingSeconds = 0;
    currentFuel;
    kmDepth;
    caveTreeDepth;
    rootNode;
    rewards = [];

    initialVisibleDepth = 2;

    hasAnyRewards = false;
    hasScientist = false;
    hasGoldChest = false;
    hasDroneBlueprint = false;
    droneBlueprintRewardId = -1;

    maxNodesPerDepth;
    currentLeaves = [];

    activeDrones = [];

    constructor(kmDepth, caveTreeDepth, maxNodesPerDepth)
    {
        this.kmDepth = kmDepth;
        this.caveTreeDepth = caveTreeDepth;
        this.maxNodesPerDepth = maxNodesPerDepth;
        this.currentFuel = caveMaxFuelStructure.statValueForCurrentLevel();
        this.buildTree();

        this.totalDuration = Math.max(CAVE_MINIMUM_LIFETIME_SECONDS, CAVE_SYSTEM_DURATION_PER_NODE_SECONDS * this.numNodes());
        this.remainingSeconds = this.totalDuration;
    }

    set serializedSaveValue(value)
    {
        //Load in the value
        var values = value === '' ? [] : value.split("!");

        this.currentLeaves = [];
        this.activeDrones = [];
        this.rewards = [];

        this.isActive = values[0] === 'true';
        this.kmDepth = parseInt(values[1]);
        this.caveTreeDepth = parseInt(values[2]);
        this.remainingSeconds = parseInt(values[3]);
        this.totalDuration = parseInt(values[4]);
        this.currentFuel = parseInt(values[5]);
        if(values[6] !== 'true' && values[6] !== 'false')
        {
            // Insert isExplored flag if it's missing
            // Only needed to keep dev build saves from breaking
            // Can probably delete this with the next update
            this.isExplored = false;
            values.splice(6, 0, 'false');
        }
        else
        {
            this.isExplored = values[6] === 'true';
        }

        //############# BUILD SAVED SYSTEM TREE #################
        var nodeSaveValues = values[7].split(",");
        var nodesToAssign = [];
        for(var j = 0; j < nodeSaveValues.length; j += 8)
        {
            var newNode = eval("new " + nodeSaveValues[j] + "()");
            newNode.x = parseFloat(nodeSaveValues[j + 1]);
            newNode.y = parseFloat(nodeSaveValues[j + 2]);
            newNode.depth = parseInt(nodeSaveValues[j + 3]);
            newNode.difficulty = parseFloat(nodeSaveValues[j + 4]);
            newNode.id = nodeSaveValues[j + 5];
            newNode.currentHealth = nodeSaveValues[j + 6];
            newNode.isRevealed = nodeSaveValues[j + 7];
            nodesToAssign.push(newNode);
        }

        for(var j = 0; j < nodesToAssign.length; j++)
        {
            var parentNode = nodesToAssign[j];
            for(var k = 0; k < nodesToAssign.length; k++)
            {
                if(nodesToAssign[k].id.length == parentNode.id.length + 1 &&
                    nodesToAssign[k].id.indexOf(parentNode.id) == 0)
                {
                    nodesToAssign[k].parent = parentNode;
                    parentNode.children.push(nodesToAssign[k]);
                }
            }
        }
        this.rootNode = nodesToAssign[0];

        //############# BUILD REWARDS #############
        var rewardSaveValues = values[8].split(",");
        if(rewardSaveValues.length > 1)
        {
            for(var j = 0; j < rewardSaveValues.length; j += 5)
            {
                var newReward = eval("new " + rewardSaveValues[j] + "()");
                newReward.locationNode = this.getNodeById(rewardSaveValues[j + 1]);
                newReward.loadRewardAmount(rewardSaveValues[j + 2]);
                newReward.caveDepth = rewardSaveValues[j + 3];
                newReward.isClaimed = rewardSaveValues[j + 4] === "true";
                this.rewards.push(newReward);
            }
        }

        //############# LOAD ACTIVE DRONES #############
        var droneSaveValues = values[9].split(",");
        if(droneSaveValues.length > 1)
        {
            for(var j = 0; j < droneSaveValues.length; j += 12)
            {
                var baseDrone = getDroneById(droneSaveValues[j + 0]);
                var dronePath = this.getPathToNode(this.getNodeById(droneSaveValues[j + 1]));
                var level = droneSaveValues[j + 9]
                var newActiveDrone = new ActiveDrone(baseDrone, this, dronePath, level);
                newActiveDrone.lastReachedNodeIndex = parseInt(droneSaveValues[j + 2]);
                newActiveDrone.progressToNextNode = parseFloat(droneSaveValues[j + 3]);
                newActiveDrone.isMovingForward = droneSaveValues[j + 4] === 'true';
                newActiveDrone.currentHealth = parseFloat(droneSaveValues[j + 5]);
                newActiveDrone.currentFuel = parseFloat(droneSaveValues[j + 6]);
                newActiveDrone.waitAtNodeTime = parseFloat(droneSaveValues[j + 7]);
                newActiveDrone.elapsedTime = parseFloat(droneSaveValues[j + 8]);
                newActiveDrone.inventory = droneSaveValues[j + 10].split("*");
                if(newActiveDrone.inventory.length == 1 && newActiveDrone.inventory[0] == "")
                {
                    newActiveDrone.inventory = [];
                }
                newActiveDrone.claimedRewards = droneSaveValues[j + 11].split("*");
                if(newActiveDrone.claimedRewards.length == 1 && newActiveDrone.claimedRewards[0] == "")
                {
                    newActiveDrone.claimedRewards = [];
                }
                this.activeDrones.push(newActiveDrone);
            }
        }
    }

    get serializedSaveValue()
    {
        //Provide parsed value for save
        let toSave = [];
        toSave.push(this.isActive);
        toSave.push(this.kmDepth);
        toSave.push(this.caveTreeDepth);
        toSave.push(Math.round(this.remainingSeconds));
        toSave.push(this.totalDuration);
        toSave.push(Math.round(this.currentFuel));
        toSave.push(this.isExplored);

        //############# SAVE SYSTEM TREE #################
        var nodeSaveValues = [];
        var allNodes = this.getAllChildNodesFromRoot();
        for(var i = 0; i < allNodes.length; i++)
        {
            nodeSaveValues.push(allNodes[i].constructor.name);
            nodeSaveValues.push(allNodes[i].x);
            nodeSaveValues.push(allNodes[i].y);
            nodeSaveValues.push(allNodes[i].depth);
            nodeSaveValues.push(allNodes[i].difficulty);
            nodeSaveValues.push(allNodes[i].id);
            if(typeof (allNodes[i].currentHealth) != "undefined")
            {
                nodeSaveValues.push(allNodes[i].currentHealth);
            }
            else
            {
                nodeSaveValues.push("");
            }
            nodeSaveValues.push(allNodes[i].isRevealed);
        }
        toSave.push(nodeSaveValues.join(","));

        //############# SAVE REWARDS #################
        var rewardSaveValues = [];
        for(var i = 0; i < this.rewards.length; i++)
        {
            rewardSaveValues.push(this.rewards[i].constructor.name);
            if(this.rewards[i].locationNode == null)
            {
                rewardSaveValues.push("");
            }
            else
            {
                rewardSaveValues.push(this.rewards[i].locationNode.id);
            }
            rewardSaveValues.push(this.rewards[i].rewardAmount);
            rewardSaveValues.push(this.rewards[i].caveDepth);
            rewardSaveValues.push(this.rewards[i].isClaimed);
        }
        toSave.push(rewardSaveValues.join(","));

        //############# SAVE ACTIVE DRONES #################
        var droneSaveValues = [];
        for(var i = 0; i < this.activeDrones.length; i++)
        {
            droneSaveValues.push(this.activeDrones[i].baseDroneId);
            droneSaveValues.push(this.activeDrones[i].idOfFinalNodeInPath());
            droneSaveValues.push(this.activeDrones[i].lastReachedNodeIndex);

            droneSaveValues.push(this.activeDrones[i].progressToNextNode);
            droneSaveValues.push(this.activeDrones[i].isMovingForward);
            droneSaveValues.push(this.activeDrones[i].currentHealth);

            droneSaveValues.push(this.activeDrones[i].currentFuel);
            droneSaveValues.push(this.activeDrones[i].waitAtNodeTime);
            droneSaveValues.push(this.activeDrones[i].elapsedTime);

            droneSaveValues.push(this.activeDrones[i].level);
            droneSaveValues.push(this.activeDrones[i].inventory.join("*"));
            droneSaveValues.push(this.activeDrones[i].claimedRewards.join("*"));
        }
        toSave.push(droneSaveValues.join(","));

        return toSave.join("!");
    }

    update(deltaTime)
    {
        if(!this.isActive) return;

        for(var i = this.activeDrones.length - 1; i >= 0; --i)
        {
            try
            {
                this.activeDrones[i].update(deltaTime);
            }
            catch(e)
            {
                console.warn("Drone " + i + " (" + this.kmDepth + "km) failed to update.");
                console.warn(e);
            }
            if(!this.activeDrones[i].isAlive || this.activeDrones[i].isFinished)
            {
                this.activeDrones.splice(i, 1);
            }
        }
        this.addFuel((deltaTime / 60) * caveFuelRegenStructure.statValueForCurrentLevel());
        this.remainingSeconds -= deltaTime;
        if(this.remainingSeconds <= 0)
        {
            this.isActive = false;
        }
    }

    addFuel(fuelAmount)
    {
        this.currentFuel = Math.min(caveMaxFuelStructure.statValueForCurrentLevel(), this.currentFuel + fuelAmount);
    }

    startDroneOnPath(baseDrone, nodePath)
    {
        if(this.canCraftDrone(baseDrone))
        {
            this.currentFuel -= baseDrone.totalFuel;
            var newDrone = new ActiveDrone(baseDrone, this, nodePath);
            this.activeDrones.push(newDrone);
            if(!this.isExplored)
            {
                this.isExplored = true;
                ++numberOfCavesExplored;
            }
            return newDrone;
        }
        return null;
    }

    canCraftDrone(baseDrone)
    {
        return this.currentFuel >= baseDrone.totalFuel;
    }

    buildTree()
    {
        this.rootNode = new CaveNode();
        this.rootNode.x = 0;
        this.rootNode.y = 0.5;
        this.rootNode.depth = 0;
        this.rootNode.isRevealed = true;
        this.currentLeaves.push(this.rootNode);

        var currentDepth = 0;
        while(currentDepth < this.caveTreeDepth)
        {
            this.addNodeDepth(currentDepth + 1);
            currentDepth++;
        }
        this.forEachNode(this.populateNode.bind(this), true);
    }

    addNodeDepth(newNodeDepth)
    {
        var leaves = shuffleArray(this.currentLeaves.slice());
        this.currentLeaves = [];
        var nodesForThisDepth = caveRoller.rand(1, this.maxNodesPerDepth);
        var remainingOptionalNodes = nodesForThisDepth;
        for(var i = 0; i < leaves.length; i++)
        {
            var maxAllowedToConnect = Math.max(0, remainingOptionalNodes - Math.floor((this.currentLeaves.length - i) / 4));
            var numChildrenToConnect = 0;
            if(maxAllowedToConnect > 0)
            {
                numChildrenToConnect = caveRoller.rand(1, maxAllowedToConnect);
            }
            for(var j = 0; j < numChildrenToConnect; j++)
            {
                var newNode = new CaveNode();
                newNode.x = newNodeDepth / this.caveTreeDepth;
                newNode.depth = newNodeDepth;
                newNode.id = j;
                newNode.parent = leaves[i];
                newNode.parent.children.push(newNode);
                newNode.id = newNode.parent.id + j;
                if(newNodeDepth <= this.initialVisibleDepth)
                {
                    newNode.isRevealed = true;
                }
                this.currentLeaves.push(newNode);
            }
            remainingOptionalNodes -= numChildrenToConnect;
        }

        leaves.sort(function (a, b)
        {
            if(a.y > b.y) return 1;
            if(a.y < b.y) return -1;
            return 0;
        });

        var numProcessedLeaves = 0;
        var nodeYOffset = 1 / Math.pow(2, this.currentLeaves.length);
        var nodePlacementNoise = 1; //A percent representing the maximum amount nodes may move within their acceptable region (1 representing 100% would mean nodes *could* touch) 
        var normalizedNoise = nodePlacementNoise / 6; //limit the nodes so they don't cross
        for(var i = 0; i < leaves.length; i++)
        {
            for(var j = 0; j < leaves[i].children.length; j++)
            {
                leaves[i].children[j].y = (numProcessedLeaves / this.currentLeaves.length) + nodeYOffset;
                leaves[i].children[j].y += ((1 - (caveRoller.rand(0, 2))) * normalizedNoise / 2) / (this.currentLeaves.length + nodeYOffset);
                leaves[i].children[j].x += ((1 - (caveRoller.rand(0, 2))) * normalizedNoise / 2) / this.caveTreeDepth;
                // leaves[i].children[j].x = Math.round(leaves[i].children[j].x * 1000) / 1000;
                // leaves[i].children[j].y = Math.round(leaves[i].children[j].y * 1000) / 1000;
                numProcessedLeaves++;
            }
        }
    }

    populateNode(node)
    {
        if(node == this.rootNode) return;
        var nodeType;
        if(!this.hasAnyRewards && node.depth == this.caveTreeDepth)
        {
            // Prevent caves from spawning with 0 rewards
            nodeType = "reward";
        }
        else if(node.isTerminal())
        {
            nodeType = this.selectWeightedRandomType(caveConfig.terminalNodeTypeChances);
        }
        else
        {
            nodeType = this.selectWeightedRandomType(caveConfig.nonterminalNodeTypeChances);
        }
        switch(nodeType)
        {
            case "obstacle":
                var newNode = this.createRandomObstacle();
                this.replaceNode(node, newNode);
                break;
            case "reward":
                this.createRewardOnNode(node);
                break;
        }
    }

    createRandomObstacle()
    {
        var possibleObstacleTypes = {};
        var foundPossibleObstacle = false;
        for(var i in caveConfig.obstacles)
        {
            if(this.kmDepth >= caveConfig.obstacles[i].minKmDepth)
            {
                possibleObstacleTypes[i] = caveConfig.obstacles[i];
                foundPossibleObstacle = true;
            }
        }
        if(!foundPossibleObstacle) return;
        var obstacleType = this.selectWeightedRandomType(possibleObstacleTypes);
        var obstacle = new possibleObstacleTypes[obstacleType].constructor();
        return obstacle;
    }

    createRewardOnNode(node)
    {
        var possibleRewardTypes = {};
        var foundPossibleReward = false;
        var pathDifficulty = this.getPathDifficulty(this.getPathToNode(node));
        var droneId;
        for(var i in caveConfig.rewards)
        {
            if(pathDifficulty >= caveConfig.rewards[i].difficultyThreshold &&
                (i != "scientist" || !this.hasScientist) &&
                (i != "goldChest" || !this.hasGoldChest) &&
                (i != "drone" || (!this.hasBlueprint && (droneId = this.selectDroneBlueprintRewardId()) >= 0)))
            {
                possibleRewardTypes[i] = caveConfig.rewards[i];
                foundPossibleReward = true;
            }
        }
        if(!foundPossibleReward) return;
        var rewardType = this.selectWeightedRandomType(possibleRewardTypes);
        var reward;
        if(rewardType != "drone")
        {
            reward = new possibleRewardTypes[rewardType].constructor(node, this.kmDepth);
            reward.setRewardAmount(pathDifficulty, node.depth, this.kmDepth);
            node.difficulty -= reward.difficultyReduction;
            if(rewardType == "scientist") this.hasScientist = true;
            else if(rewardType == "goldChest") this.hasGoldChest = true;
        }
        else
        {
            reward = new possibleRewardTypes[rewardType].constructor(node);
            reward.setRewardAmount(droneId);
            this.hasBlueprint = true;
            this.droneBlueprintRewardId = droneId;
        }
        this.rewards.push(reward);
        this.hasAnyRewards = true;
        return reward;
    }

    replaceNode(node, newNode)
    {
        newNode.children = node.children;
        newNode.id = node.id;
        newNode.parent = node.parent;
        newNode.x = node.x;
        newNode.y = node.y;
        newNode.depth = node.depth;
        newNode.isRevealed = node.isRevealed;
        if(node.parent)
        {
            node.parent.children[node.id[node.id.length - 1]] = newNode;
        }
        for(var i in node.children)
        {
            node.children[i].parent = newNode;
        }
    }

    isFinished()
    {
        for(var i in this.rewards)
        {
            if(!this.rewards[i].activateOnPickup && this.rewards[i].locationNode !== null)
            {
                return false;
            }
        }
        for(var i in this.activeDrones)
        {
            if(this.activeDrones[i].inventory.length > 0)
            {
                return false;
            }
        }
        return this.isFullyRevealed();
    }

    isFullyRevealed(node = null)
    {
        if(!node) node = this.rootNode;
        if(!node.isRevealed) return false;
        for(var i in node.children)
        {
            if(!this.isFullyRevealed(node.children[i]))
            {
                return false;
            }
        }
        return true;
    }

    collapse()
    {
        for(var i in caves)
        {
            if(caves[i].kmDepth == this.kmDepth)
            {
                // Set self to inactive so cave windows will close automatically
                this.isActive = false;
                caves[i] = createCaveSystem(0, 0, 1)
                caves[i].isActive = false;
                newNews(_("The cave at {0}km has collapsed", this.kmDepth));
                if(!mutebuttons) caveCollapseAudio.play();
            }
        }
    }

    //AO: Need to make the X & Y scale fixed
    //AO: This should be cached (memoized) if we use a large number of samples
    //AO: Premultiply all scaling prior to sampling loop
    getTravelDistanceBetweenParentAndChildNode(node, childNode, nodeScaleX, nodeScaleY)
    {
        var grandparentY = node.y;
        if(node.parent != null)
        {
            grandparentY = node.parent.y;
        }

        var parentX = node.x;
        var parentY = node.y;
        var childX = childNode.x;
        var childY = childNode.y;
        var childYDelta = childY - parentY;
        var parentYDelta = grandparentY - parentY;

        var curveControlPoint1X = node.x + (.25 / this.caveTreeDepth);
        var curveControlPoint1Y = parentY - (parentYDelta * .25);
        var curveControlPoint2X = node.x + (.75 / this.caveTreeDepth);
        var curveControlPoint2Y = childY - (childYDelta * .25);

        var numSamples = 500;
        var numPoints = numSamples + 1;
        var distance = 0;
        var point1 = {
            "x": parentX * nodeScaleX,
            "y": parentY * nodeScaleY
        };
        for(var i = 0; i < numSamples; i++)
        {
            var point2 = getBezierXY(
                (i + 1) / numPoints,
                (parentX * nodeScaleX),
                (parentY * nodeScaleY),
                (curveControlPoint1X * nodeScaleX),
                (curveControlPoint1Y * nodeScaleY),
                (curveControlPoint2X * nodeScaleX),
                (curveControlPoint2Y * nodeScaleY),
                (childX * nodeScaleX),
                (childY * nodeScaleY)
            );
            distance += Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));

            point1 = point2;
        }
        var straightLineDistance = Math.sqrt(Math.pow(((node.x - childNode.x) * nodeScaleX), 2) + Math.pow(((node.y - childNode.y) * nodeScaleY), 2));
        distance = Math.max(distance, straightLineDistance);
        return distance;
    }

    getRewardsOnNode(node)
    {
        var rewards = [];
        var rewardsOnNode = this.getIndexOfRewardsOnNode(node);
        for(var i = 0; i < rewardsOnNode.length; i++)
        {
            rewards.push(this.rewards[rewardsOnNode[i]]);
        }
        return rewards;
    }

    getDronesOnNode(node)
    {
        var drones = [];
        for(var i in this.activeDrones)
        {
            if(this.activeDrones[i].isAlive && this.activeDrones[i].nodePath[this.activeDrones[i].lastReachedNodeIndex] == node)
            {
                drones.push(this.activeDrones[i]);
            }
        }
        return drones;
    }

    getIndexOfRewardsOnNode(node)
    {
        var rewards = [];
        for(var i in this.rewards)
        {
            if(this.rewards[i].locationNode == node)
            {
                rewards.push(i);
            }
        }
        return rewards;
    }

    getNodeById(nodeId)
    {
        // Root node has ID 0. Each child node appends its index in parent.children to its parent's ID
        // Ex. A node with ID "021" would have the path root -> child node 2 -> child node 1
        if(nodeId == "") return null;
        var node = this.rootNode;
        for(var i = 1; i < nodeId.length; ++i)
        {
            if(isNaN(nodeId[i]) || nodeId[i] >= node.children.length)
            {
                throw "Invalid node ID";
            }
            node = node.children[nodeId[i]];
        }
        return node;
    }

    getAllChildNodesFromRoot()
    {
        return this.getAllChildNodesFromNode(this.rootNode);
    }

    getAllChildNodesFromNode(node)
    {
        var allNodes = [node];
        if(node.children.length > 0)
        {
            for(var i = 0; i < node.children.length; i++)
            {
                allNodes = allNodes.concat(this.getAllChildNodesFromNode(node.children[i]));
            }
        }
        return allNodes;
    }

    numNodes()
    {
        return this.getAllChildNodesFromRoot().length;
    }

    getPathToNode(node)
    {
        var nodePath = [];
        while(node != this.rootNode)
        {
            nodePath.unshift(node);
            node = node.parent;
        }
        nodePath.unshift(this.rootNode);
        return nodePath;
    }

    getPathDifficulty(nodePath)
    {
        var difficulty = 0;
        for(var i in nodePath)
        {
            difficulty += nodePath[i].difficulty;
        }
        return difficulty;
    }

    selectDroneBlueprintRewardId()
    {
        var activeCaves = getActiveCaves();
        var foundBlueprintInOtherCave;
        for(var droneIdIndex in caveConfig.rewards.drone.possibleIds)
        {
            var possibleId = caveConfig.rewards.drone.possibleIds[droneIdIndex];
            if(!isBlueprintKnown(craftingCategories.drones, possibleId))
            {
                foundBlueprintInOtherCave = false;
                for(var caveIndex in activeCaves)
                {
                    if(activeCaves[caveIndex].droneBlueprintRewardId == possibleId)
                    {
                        foundBlueprintInOtherCave = true;
                        break;
                    }
                }
                if(!foundBlueprintInOtherCave)
                {
                    return possibleId;
                }
            }
        }
        return -1;
    }

    forEachNode(callback, actOnParentBeforeChildren, node = null)
    {
        if(!node)
        {
            node = this.rootNode;
        }
        if(actOnParentBeforeChildren)
        {
            callback(node);
        }
        for(var i in node.children)
        {
            this.forEachNode(callback, actOnParentBeforeChildren, node.children[i]);
        }
        if(!actOnParentBeforeChildren)
        {
            callback(node);
        }
    }

    selectWeightedRandomType(types)
    {
        var probabilitySum = 0;
        for(var i in types)
        {
            probabilitySum += types[i].probability;
        }
        var random = caveRoller.randFloat();
        var runningTotal = 0;
        for(var i in types)
        {
            runningTotal += types[i].probability / probabilitySum;
            if(random < runningTotal)
            {
                return i;
            }
        }
        return null;
    }

    getRandomPath()
    {
        var node = this.rootNode;
        var nodePath = [node];
        while(node.children.length > 0)
        {
            node = node.children[caveRoller.rand(0, node.children.length - 1)];
            nodePath.push(node);
        }
        return nodePath;
    }
}