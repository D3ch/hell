const VARIANTS_PER_PARTICLE_EFFECT = 7;

class Particles extends UiLayer
{
    layerName = "Particles";
    zIndex = 2;
    isRendered = true;
    isPopup = false;
    allowBubbling = true;
    overrideRendering = true;
    context = PARTICLES;
    frameCount = 0;
    previousNumFramesRendered = 0;
    previousBoundingBox;
    renderedParticles = false;
    renderedCoordinates = [];

    constructor(boundingBox)
    {
        super(boundingBox);
        if(this.context)
        {
            this.context.canvas.style.x = boundingBox.x;
            this.context.canvas.style.y = boundingBox.y;
            this.context.canvas.style.width = boundingBox.width;
            this.context.canvas.style.height = boundingBox.height;
        }
    }

    setBoundingBox()
    {
        this.boundingBox = this.context.canvas.getBoundingClientRect();
        this.boundingBox.x /= uiScaleX;
        this.boundingBox.y /= uiScaleY;
        this.boundingBox.width /= uiScaleX;
        this.boundingBox.height /= uiScaleY;
    }

    render()
    {
        return;
        /*for(var i=0; i<5; i++)
        {
            for(var j=0; j<10; j++)
            {
                for(var k=0; k<20; k++)
                {
                    this.context.clearRect(j*100 + (k*6), i*150, 5, 5);
                    this.context.drawImage(darkdot, 0, 0, 1, 1, j*100 + (k*6), i*150, 5, 5);
                }
            }
        }
        return;*/
        if(quality == 0 && !this.renderedParticles)
        {
            return;
        }

        this.frameCount++;
        if(this.previousNumFramesRendered != numFramesRendered)
        {
            var floatingFramesRendered = (numFramesRendered + ((interval - expectedTimeUntilNextRepaintMsec()) / interval));
            this.frameCount = floatingFramesRendered * (100 / 17);
            this.previousNumFramesRendered = numFramesRendered;
        }

        if(this.renderedParticles)
        {
            for(var i = 0; i < this.renderedCoordinates.length; i++)
            {
                this.context.clearRect(this.renderedCoordinates[i][0], this.renderedCoordinates[i][1], this.renderedCoordinates[i][2], this.renderedCoordinates[i][3]);
            }
            this.renderedParticles = false;
            this.renderedCoordinates = [];
        }
        if(quality == 0)
        {
            return;
        }
        for(var i = 0; i < 5; i++)
        {
            var depthToRender = (currentlyViewedDepth - 4) + i;
            //Render
            var worldAtWorkerDepth = worldAtDepth(depthToRender);
            if(worldAtWorkerDepth)
            {
                var workerLevelAtDepth = workerLevelAtWorld(worldAtWorkerDepth.index);
                if(existsParticlesForMinerType(worldAtWorkerDepth.index, workerLevelAtDepth))
                {
                    var yCoordinateOfLevelTop = Math.round(mainh * .111 + ((4 - (currentlyViewedDepth - depthToRender)) * .178 * mainh));
                    if(!isDepthWithoutWorkers(depthToRender) && !isBossLevel(depthToRender) && !isCapacityFull())
                    {
                        var particleFrames = getNumFramesInParticleAnimation(worldAtWorkerDepth.index, workerLevelAtDepth);
                        var particlePrefix = getParticleCachePrefixForMinerType(worldAtWorkerDepth.index, workerLevelAtDepth);

                        for(var j = 1; j <= workersHiredAtDepth(depthToRender); j++)
                        {
                            var frameSyncIndex = (i * 5) + (j - 1);

                            var frameOffset = 8 + (5.882 * (frameSyncIndex % 4)); //needed to align the 60fps particles with the 10fps miners
                            var frameToRender = Math.round(this.frameCount + frameOffset) % particleFrames;
                            var numLoopsRendered = Math.floor(Math.round(this.frameCount + frameOffset) / particleFrames);
                            var particleIndex = (depthToRender + j + numLoopsRendered) % VARIANTS_PER_PARTICLE_EFFECT;

                            if(frameToRender >= 0)
                            {
                                this.renderedParticles = true;
                                this.context.drawImage(assetCache.get(particlePrefix + particleIndex)[frameToRender], 0, 0, 200, 200, Math.ceil(mainw * (.045 + ((j - 1) * .072))), yCoordinateOfLevelTop - Math.floor(mainh * .004), Math.ceil(mainw * .08), Math.floor(mainh * .15));
                                this.renderedCoordinates.push([Math.ceil(mainw * (.045 + ((j - 1) * .072))), yCoordinateOfLevelTop - Math.floor(mainh * .004), Math.ceil(mainw * .08), Math.floor(mainh * .15)]);
                            }
                        }
                    }
                }
            }
        }

        if(this.renderedParticles)
        {
            this.context.clearRect(0, mainh * .10, Math.floor(mainw * .083), mainh * .9);
        }
    }
}


//##############################################################
//#################### PARTICLE EFFECT GEN #####################
//##############################################################

class CachableParticle
{
    context;
    x;
    y;
    width;
    height;
    lifeSpanFrames;
    numFramesRemaining;
    velX = 0;
    velY = 0;
    accX = 0;
    accY = 0;
    rgb1 = [71, 60, 43];
    rgb2 = [71, 60, 43];

    constructor(context, x, y, width, height, lifeSpanFrames)
    {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lifeSpanFrames = lifeSpanFrames;
        this.numFramesRemaining = lifeSpanFrames;
    }

    percentComplete()
    {
        return this.numFramesRemaining / this.lifeSpanFrames;
    }

    renderFunction()
    {
        this.context.strokeStyle = rgbToHex(57, 49, 36);
        this.context.lineWidth = 1;
        var r = (this.rgb1[0] * (1 - this.percentComplete())) + (this.rgb2[0] * this.percentComplete());
        var g = (this.rgb1[1] * (1 - this.percentComplete())) + (this.rgb2[1] * this.percentComplete());
        var b = (this.rgb1[2] * (1 - this.percentComplete())) + (this.rgb2[2] * this.percentComplete());
        this.context.fillStyle = rgbToHex(r, g, b);
        this.context.globalAlpha = Math.pow(this.percentComplete(), .3);
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.strokeRect(this.x, this.y, this.width, this.height);
        this.context.globalAlpha = 1;
    }

    update()
    {
        this.renderFunction();
        this.velX += this.accX;
        this.velY += this.accY;
        this.x += this.velX;
        this.y += this.velY;
        this.numFramesRemaining--;
    }
}

class ParticleGroup
{
    particles = [];
    frames = [];

    constructor()
    {

    }

    addParticle(particle)
    {
        this.particles.push(particle);
    }

    update()
    {
        for(var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].update();
        }
        this.cacheFrame();
    }

    cacheFrame()
    {
        var cachedImage = new Image();
        var frameData = this.particles[0].context.canvas.toDataURL();
        cachedImage.src = frameData;
        this.frames.push(cachedImage);
    }

    reset()
    {
        this.particles = [];
        this.frames = [];
    }
}

function generateParticleEffects()
{
    //generate n particles
    //each has physics, color tweens, and alpha tweens

    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;
    tempCanvas.height = 200;
    tempCanvas.style.width = 200;
    tempCanvas.style.height = 200;
    tempCanvas.style.zIndex = 10000;
    tempCanvas.style.position = "absolute";
    tempCanvas.style.x = 0;
    tempCanvas.style.y = 0;

    //Type 0
    for(var i = 0; i < VARIANTS_PER_PARTICLE_EFFECT; i++)
    {
        var particleGroup = new ParticleGroup();
        var numFrames = 24;
        for(var j = 0; j < rand(7, 15); j++)
        {
            var newParticle = new CachableParticle(tempCanvas.getContext("2d"), 100, 193, rand(2, 5), rand(2, 5), numFrames);
            newParticle.velX = (rand(0, 1) == 0 ? 1 : -1) * Math.pow((rand(1000, 1900) / 1000), 3);
            newParticle.velY = -0.5 * rand(120, 200) / 10;
            newParticle.accY = 1.1 * rand(900, 1100) / 1000;
            particleGroup.addParticle(newParticle);
        }

        for(var k = 0; k < numFrames; k++)
        {
            tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
            particleGroup.update();
        }

        assetCache.set("particles_0_" + i, particleGroup.frames);
        tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
        particleGroup.reset();
    }

    //Type 1
    for(var i = 0; i < VARIANTS_PER_PARTICLE_EFFECT; i++)
    {
        var particleGroup = new ParticleGroup();
        var numFrames = 12;
        for(var j = 0; j < rand(12, 20); j++)
        {
            var newParticle = new CachableParticle(tempCanvas.getContext("2d"), 110, 197, rand(2, 3), rand(2, 3), numFrames);
            newParticle.velX = (rand(0, 1) == 0 ? 1 : -1) * Math.pow((rand(1000, 1400) / 1000), 3);
            newParticle.velY = -0.60 * rand(120, 200) / 10;
            newParticle.accY = 1.4 * rand(900, 1100) / 1000;
            particleGroup.addParticle(newParticle);
        }

        for(var k = 0; k < numFrames; k++)
        {
            tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
            particleGroup.update();
        }

        assetCache.set("particles_1_" + i, particleGroup.frames);
        tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
        particleGroup.reset();
    }

    //Type 2
    for(var i = 0; i < VARIANTS_PER_PARTICLE_EFFECT; i++)
    {
        var particleGroup = new ParticleGroup();
        var numFrames = 12;
        for(var j = 0; j < rand(7, 15); j++)
        {
            var newParticle = new CachableParticle(tempCanvas.getContext("2d"), 104, 193, rand(2, 5), rand(2, 5), numFrames);
            newParticle.rgb1 = [rand(120, 200), 60, 43];
            newParticle.velX = (rand(0, 1) == 0 ? 1 : -1) * Math.pow((rand(1000, 1900) / 1000), 3);
            newParticle.velY = -0.5 * rand(120, 200) / 10;
            newParticle.accY = 1.1 * rand(900, 1100) / 1000;
            particleGroup.addParticle(newParticle);
        }

        for(var k = 0; k < numFrames; k++)
        {
            tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
            particleGroup.update();
        }

        assetCache.set("particles_2_" + i, particleGroup.frames);
        tempCanvas.getContext("2d").clearRect(0, 0, tempCanvas.getContext("2d").canvas.width, tempCanvas.getContext("2d").canvas.height);
        particleGroup.reset();
    }
}

generateParticleEffects();

//################ GETTERS FOR PARTICLES ################

var particlesPerMinerTypeSettings = [];
particlesPerMinerTypeSettings[EARTH_INDEX] = [];
particlesPerMinerTypeSettings[EARTH_INDEX][0] = "particles_0_";
particlesPerMinerTypeSettings[EARTH_INDEX][1] = "particles_0_";
particlesPerMinerTypeSettings[EARTH_INDEX][2] = "particles_0_";
particlesPerMinerTypeSettings[EARTH_INDEX][3] = "particles_1_";
particlesPerMinerTypeSettings[EARTH_INDEX][4] = "particles_1_";
particlesPerMinerTypeSettings[EARTH_INDEX][6] = "particles_2_";
particlesPerMinerTypeSettings[EARTH_INDEX][8] = "particles_1_";
particlesPerMinerTypeSettings[EARTH_INDEX][10] = "particles_1_";
particlesPerMinerTypeSettings[MOON_INDEX] = [];
particlesPerMinerTypeSettings[TITAN_INDEX] = [];

function existsParticlesForMinerType(worldIndex, minerLevel)
{
    return particlesPerMinerTypeSettings[worldIndex].hasOwnProperty(minerLevel);
}

function getNumFramesInParticleAnimation(worldIndex, minerLevel)
{
    return assetCache.get(getParticleCachePrefixForMinerType(worldIndex, minerLevel) + "0").length;
}

function getParticleCachePrefixForMinerType(worldIndex, minerLevel)
{
    return particlesPerMinerTypeSettings[worldIndex][minerLevel];
}