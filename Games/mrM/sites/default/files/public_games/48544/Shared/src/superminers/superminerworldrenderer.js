const MINING_DISPLAY_TYPE_NONE = 0;
const MINING_DISPLAY_TYPE_CALCULATE = 1;
const MINING_DISPLAY_TYPE_FAKE = 2;

class WanderingSuperMinerRenderer
{
    // CUSTOMIZABLE PROPERTIES

    // override default values set in worldConfig
    heightFraction;
    yOffset;
    leftBound;
    rightBound;

    flipHorizontal = false;

    minMiningTime = 5;
    maxMiningTime = 12;
    walkSpeed = 65;     // pixels per second

    drillingSpritesheet;
    walkingSpritesheet;

    // PRIVATE
    parent;
    facingRight = true;

    currentPos;
    targetPos;
    moveTime;
    currentStateTimer = 0;
    isWalking = false;
    hasStartedStateAnimation = false;
    miningDisplayType = MINING_DISPLAY_TYPE_NONE;
    mineralsFound = [];

    constructor(parent)
    {
        this.parent = parent;

        if(typeof (this.heightFraction) == "undefined") this.heightFraction = worldConfig.superMiners.height;
        if(typeof (this.yOffset) == "undefined") this.yOffset = worldConfig.superMiners.yOffset;
        if(typeof (this.leftBound) == "undefined") this.leftBound = worldConfig.superMiners.leftBound;
        if(typeof (this.rightBound) == "undefined") this.rightBound = worldConfig.superMiners.rightBound;

        this.currentPos = (this.rightBound - this.leftBound) * Math.random();
    }

    getSpritePosition()
    {
        let x = 0;
        let y = worldConfig.topBound +
            worldConfig.levelHeight *
            (this.parent.currentDepth -
                (currentlyViewedDepth + partialDepthOffset - worldConfig.numberOfDepthsVisible) -
                this.heightFraction + this.yOffset);

        if(this.isWalking)
        {
            let percentTowardsLocation = 1 - this.currentStateTimer / this.moveTime;
            x = lerp(this.currentPos, this.targetPos, percentTowardsLocation) * worldConfig.levelWidth;
        }
        else
        {
            x = worldConfig.levelWidth * this.currentPos;
        }
        x += worldConfig.leftBound;
        return {x: x, y: y};
    }

    updateSpriteState(dt)
    {
        if(this.currentStateTimer <= 0)
        {
            if(!this.isWalking)
            {
                this.isWalking = true;
                this.setNewTargetPosition();
                this.currentStateTimer = this.moveTime;
                this.hasStartedStateAnimation = false;
            }
            else
            {
                this.isWalking = false;
                this.currentStateTimer = this.minMiningTime + Math.random() * (this.maxMiningTime - this.minMiningTime);
                this.currentPos = this.targetPos;
                this.hasStartedStateAnimation = false;
            }
        }
        else
        {
            this.currentStateTimer -= dt;
        }
    }

    setNewTargetPosition()
    {
        this.targetPos = this.leftBound + Math.random() * (this.rightBound - this.leftBound);
        this.moveTime = (worldConfig.levelWidth * Math.abs(this.currentPos - this.targetPos) / this.walkSpeed);
        this.facingRight = this.targetPos > this.currentPos;
    }

    render(context)
    {
        this.updateSpriteState(renderDeltaTime / 1000);
        var levelPadding = 2;
        if(currentlyViewedDepth + partialDepthOffset - levelPadding - worldConfig.numberOfDepthsVisible <= this.parent.currentDepth &&
            this.parent.currentDepth <= currentlyViewedDepth + partialDepthOffset + levelPadding)
        {
            var pos = this.getSpritePosition();
            context.save();

            var spritesheet;

            if(!this.isWalking && this.drillingSpritesheet)
            {
                spritesheet = this.drillingSpritesheet;

                if(quality == 1 && !isCapacityFull())
                {
                    if(this.miningDisplayType == MINING_DISPLAY_TYPE_CALCULATE)
                    {
                        for(var i = this.mineralsFound.length - 1; i >= 0; i--)
                        {
                            this.mineralsFound[i].frames--;

                            if(this.mineralsFound[i].frames <= 0)
                            {
                                this.mineralsFound.splice(i, 1);
                            }
                        }

                        var mineralsWithSuperMiner = estimatedMineralsPerMinuteAtLevel(this.parent.currentDepth, true).reduce((a, b) => a + b, 0);
                        var mineralsWithoutSuperMiner = estimatedMineralsPerMinuteAtLevel(this.parent.currentDepth, false).reduce((a, b) => a + b, 0);
                        var superMinerMineralsPerMinute = mineralsWithSuperMiner - mineralsWithoutSuperMiner;
                        var framesToAnimate = 12;
                        var totalFrameTimeMsec = framesToAnimate * 1000 / 20;
                        var numMineralsToDisplay = Math.round(totalFrameTimeMsec * superMinerMineralsPerMinute / 60000);
                        var maxMineralsToDisplay = 20;
                        if(Math.min(numMineralsToDisplay, maxMineralsToDisplay) > this.mineralsFound.length)
                        {
                            if(rand(0, 2) == 0)
                            {
                                var mineralToAdd = getSingleRandomMineralTypeAtDepthByWeight(this.parent.currentDepth);
                                var xVel = ((rand(0, 250) - 125) / 50);
                                this.mineralsFound.push({"mineralType": mineralToAdd, "frames": framesToAnimate, "xVel": xVel});
                            }
                        }

                        for(var i = 0; i < this.mineralsFound.length; i++)
                        {
                            var framesRemainingToShow = this.mineralsFound[i].frames;
                            var mineralIndex = this.mineralsFound[i].mineralType;
                            var xOffset = (framesToAnimate - framesRemainingToShow) * this.mineralsFound[i].xVel;
                            context.globalAlpha = MINERAL_COLLECTED_POPUP_ALPHA_SEQUENCE[framesRemainingToShow];
                            var yOffsetForSequence = MINERAL_COLLECTED_POPUP_OFFSET_SEQUENCE[framesRemainingToShow] * 2;
                            context.drawImage(
                                worldResources[mineralIndex].smallIcon,
                                pos.x + xOffset + (worldConfig.levelHeight * this.heightFraction / 2) - (Math.ceil(mainw * .012) / 2),
                                pos.y + yOffsetForSequence,
                                Math.floor(mainh * .021),
                                Math.floor(mainh * .021)
                            );
                            context.globalAlpha = 1;
                        }
                    }
                    else if(this.miningDisplayType == MINING_DISPLAY_TYPE_FAKE)
                    {
                        for(var i = this.mineralsFound.length - 1; i >= 0; i--)
                        {
                            this.mineralsFound[i].frames--;

                            if(this.mineralsFound[i].frames <= 0)
                            {
                                this.mineralsFound.splice(i, 1);
                            }
                        }

                        var mineralsWithSuperMiner = estimatedMineralsPerMinuteAtLevel(this.parent.currentDepth, true).reduce((a, b) => a + b, 0);
                        var superMinerMineralsPerMinute = mineralsWithSuperMiner / 2;
                        var framesToAnimate = 12;
                        var totalFrameTimeMsec = framesToAnimate * 1000 / 20;
                        var numMineralsToDisplay = Math.round(totalFrameTimeMsec * superMinerMineralsPerMinute / 60000);
                        var maxMineralsToDisplay = 20;
                        if(Math.min(numMineralsToDisplay, maxMineralsToDisplay) > this.mineralsFound.length)
                        {
                            if(rand(0, 2) == 0)
                            {
                                var mineralToAdd = getSingleRandomMineralTypeAtDepthByWeight(this.parent.currentDepth);
                                var xVel = ((rand(0, 250) - 125) / 50);
                                this.mineralsFound.push({"mineralType": mineralToAdd, "frames": framesToAnimate, "xVel": xVel});
                            }
                        }

                        for(var i = 0; i < this.mineralsFound.length; i++)
                        {
                            var framesRemainingToShow = this.mineralsFound[i].frames;
                            var mineralIndex = this.mineralsFound[i].mineralType;
                            var xOffset = (framesToAnimate - framesRemainingToShow) * this.mineralsFound[i].xVel;
                            context.globalAlpha = MINERAL_COLLECTED_POPUP_ALPHA_SEQUENCE[framesRemainingToShow];
                            var yOffsetForSequence = MINERAL_COLLECTED_POPUP_OFFSET_SEQUENCE[framesRemainingToShow] * 2;
                            context.drawImage(
                                worldResources[mineralIndex].smallIcon,
                                pos.x + xOffset + (worldConfig.levelHeight * this.heightFraction / 2) - (Math.ceil(mainw * .012) / 2),
                                pos.y + yOffsetForSequence,
                                Math.floor(mainh * .021),
                                Math.floor(mainh * .021)
                            );
                            context.globalAlpha = 1;
                        }
                    }
                }
            }
            else
            {
                spritesheet = this.walkingSpritesheet;
            }

            if(this.facingRight ^ this.flipHorizontal)
            {
                var spriteDimensions = fitBoxInBox(
                    spritesheet.frameWidth,
                    spritesheet.spritesheet.height,
                    pos.x,
                    pos.y,
                    worldConfig.levelHeight * this.heightFraction,
                    worldConfig.levelHeight * this.heightFraction,
                );

                context.scale(-1, 1);
                pos.x = -(spriteDimensions.x + spriteDimensions.width);
            }

            if(!this.hasStartedStateAnimation)
            {
                this.hasStartedStateAnimation = true;
                spritesheet.goToFrame(0);
            }

            var box = spritesheet.drawAnimation(
                context,
                pos.x,
                pos.y,
                worldConfig.levelHeight * this.heightFraction,
                worldConfig.levelHeight * this.heightFraction,
                true
            )

            // context.globalAlpha = 0.2;
            // context.fillStyle = "#0000FF";
            // context.fillRect(
            //     pos.x,
            //     pos.y,
            //     worldConfig.levelHeight * this.heightFraction,
            //     worldConfig.levelHeight * this.heightFraction
            // )

            // context.fillStyle = "#FFFF00";
            // context.fillRect(...Object.values(box));

            context.restore();
        }
    }
}

class DrillMinerRenderer
{
    parent;

    drillingSpritesheet;

    constructor(parent)
    {
        this.parent = parent;
    }

    update() { }

    render(context)
    {
        if(currentlyViewedDepth >= depth - 2)
        {
            var minerWidth = worldConfig.levelHeight;
            var minerHeight = minerWidth;
            var x, y;

            if (!isMobile())
            {
                x = mainw * 0.818;
                y = worldConfig.topBound + worldConfig.levelHeight *
                    (worldConfig.numberOfDepthsVisible - 1 + depth - currentlyViewedDepth) -
                    this.drillingSpritesheet.spritesheet.height;
            }
            else
            {
                x = (mainw - minerWidth) * 0.5;
                y = worldConfig.topBound + worldConfig.levelHeight *
                    (worldConfig.numberOfDepthsVisible - 1 + depth - currentlyViewedDepth + 0.1); 
            }
    
            this.drillingSpritesheet.drawAnimation(
                context,
                x,
                y,
                minerWidth,
                minerHeight
            );
        }
    }
}