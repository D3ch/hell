class SpritesheetAnimation
{
    /*
    Notes

    - Add methods:
        - loopFrames(startFrame, endFrame)
        - setFPS()
        - playBackwards()
        - playOscillate()
        - setRotation()
        - setScaleX()
        - setScaleY()
        - Move getAnimationFrameIndex() here
        - numPixelsDrawnLastFrame()
        - numAssetsDrawnLastFrame()
        - setSize(width, height, maintainAspectRatio) -> sets scaleX, scaleY, renderWidth, renderHeight
    - Add data:
        - renderWidth -> sets scaleX
        - renderheight -> sets scaleY
        - firstFrameIndex
        - lastFrameIndex
        - rotation
        - scaleX
        - scaleY
        - isOscillating
        - isPlayingBackwards
        - timeUntilNextFrame
        - numFramesInSequence
    */

    spritesheet;
    frameCount;
    fps;
    phaseShift;
    frameSpacing;
    frameSequence = [];
    frameWidth = 0;

    currentFrame = 0;

    isPaused = false;
    _pauseOnFinish = false;

    targetScreenWidth = 1280;
    targetScreenHeight = 720;

    horizontalAlign = "center";
    verticalAlign = "center";

    constructor(spritesheet, frameCount, fps, frameSpacing = 0, phaseShift = 0, frameSequence = [])
    {
        this.spritesheet = spritesheet;
        this.frameCount = frameCount;
        this.fps = fps;
        this.frameSpacing = frameSpacing;
        this.frameSequence = frameSequence;
        this.phaseShift = phaseShift;
        if(this.spritesheet.complete && this.spritesheet.naturalHeight !== 0)
        {
            this.updateFrameWidth();
        }
        else
        {
            this.spritesheet.addEventListener("load", this.updateFrameWidth.bind(this));
        }
    }

    updateFrameWidth()
    {
        this.frameWidth = this.spritesheet.width / this.frameCount - this.frameSpacing * (this.frameCount - 1);
    }

    drawAnimation(context, x, y, width, height, maintainAspectRatio = true)
    {
        var frameToRender;
        if(!this.isPaused)
        {
            frameToRender = getAnimationFrameIndex(this.frameCount, this.fps, this.phaseShift);
        }
        else
        {
            frameToRender = this.currentFrame;
        }
        var box = this.drawFrame(
            context,
            x,
            y,
            width,
            height,
            frameToRender,
            maintainAspectRatio
        );
        if(frameToRender == this.frameCount - 1 && this._pauseOnFinish)
        {
            this._pauseOnFinish = false;
            this.pause();
        }
        this.currentFrame = frameToRender;
        return box;
    }

    drawScaledAnimation(context, x, y, scale = 1)
    {
        this.drawAnimation(
            context,
            x,
            y,
            (relativeWidth(this.spritesheet) / this.frameCount) * scale,
            relativeHeight(this.spritesheet) * scale,
            false
        );
    }

    drawFrame(context, x, y, width, height, frameToRender, maintainAspectRatio = true)
    {
        if(maintainAspectRatio)
        {
            var dimensions = fitBoxInBox(
                this.frameWidth,
                this.spritesheet.height,
                x,
                y,
                width,
                height,
                this.horizontalAlign,
                this.verticalAlign
            );
            x = dimensions.x;
            y = dimensions.y;
            width = dimensions.width;
            height = dimensions.height;
        }

        context.drawImage(
            this.spritesheet,
            frameToRender * (this.frameWidth + this.frameSpacing),
            0,
            this.frameWidth,
            this.spritesheet.height,
            x,
            y,
            width,
            height
        );
        return {x: x, y: y, width: width, height: height};
    }

    pause()
    {
        this.isPaused = true;
    }

    play()
    {
        this.isPaused = false;
    }

    playUntilFinished()
    {
        this._pauseOnFinish = true;
    }

    // Updates the phase shift so that the animation will skip to frameNumber
    goToFrame(frameNumber)
    {
        this.phaseShift = Math.ceil(-numFramesRendered + frameNumber * IDLE_FRAMERATE / this.fps);
    }

    gotoAndPlay(frameNumber)
    {
        this.goToFrame(frameNumber);
        this.play();
    }

    gotoAndStop(frameNumber)
    {
        this.goToFrame(frameNumber);
        this.pause();
    }

    getScaleFromScreenWidth()
    {
        return this.targetScreenWidth / window.innerWidth;
    }

    getScaleFromScreenHeight()
    {
        return this.targetScreenHeight / window.innerHeight;
    }
}