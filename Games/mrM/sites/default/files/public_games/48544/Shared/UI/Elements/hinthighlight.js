class HintHighlight extends Hitbox
{
    image;
    root;
    rootContext;
    allowBubbling = true;

    pulsePeriod = 24;     // Pulse period in frames
    highlightColor = "#76E374";
    highlightBlur = 6;
    lineWidth = 3;
    minAlpha = 0.2;
    maxAlpha = 0.6;

    fillRelativeAlpha = 0.6;
    isFilled = true;

    phaseShift = 0;
    isCircle = false;

    constructor(boundingBox)
    {
        super(boundingBox, {}, "");
    }

    render()
    {
        if(showHintArrows)
        {
            if(!this.root)
            {
                this.root = this.getFirstElementWithContext();
                this.rootContext = this.root.context;
            }
            var coords = this.getRelativeCoordinates(0, 0, this.root, false);
            this.rootContext.save();
            this.rootContext.lineWidth = this.lineWidth;
            this.rootContext.strokeStyle = this.highlightColor;
            this.rootContext.shadowColor = this.highlightColor;
            this.rootContext.fillColor = this.highlightColor;
            this.rootContext.shadowBlur = 1 + this.minAlpha + (this.maxAlpha - this.minAlpha) * this.highlightBlur * oscillate(this.phaseShift + numFramesRendered, this.pulsePeriod / 2);
            this.rootContext.lineJoin = "round";
            this.rootContext.globalAlpha = this.minAlpha + (this.maxAlpha - this.minAlpha) * oscillate(this.phaseShift + numFramesRendered, this.pulsePeriod / 2)
            if(!this.isCircle)
            {
                this.rootContext.strokeRect(coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
                if(this.isFilled)
                {
                    this.rootContext.globalAlpha = this.fillRelativeAlpha * (this.maxAlpha - this.minAlpha) * oscillate(this.phaseShift + numFramesRendered, this.pulsePeriod / 2);
                    this.rootContext.fillRect(coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
                }
            }
            else
            {
                this.rootContext.beginPath();
                this.rootContext.arc(
                    coords.x + this.boundingBox.width / 2,
                    coords.y + this.boundingBox.height / 2,
                    Math.sqrt(Math.pow(this.boundingBox.width, 2) + Math.pow(this.boundingBox.height, 2)) / 2,
                    // Math.max(this.boundingBox.width, this.boundingBox.height) / 2,  
                    0,
                    2 * Math.PI
                );
                this.rootContext.stroke();
                this.rootContext.globalAlpha = this.fillRelativeAlpha * (this.maxAlpha - this.minAlpha) * oscillate(this.phaseShift + numFramesRendered, this.pulsePeriod / 2);
                this.rootContext.fill();
            }
            this.rootContext.restore();
        }
    }

    isVisible()
    {
        // override with hint condition
        return true;
    }

    isEnabled()
    {
        return false;
    }
}

class EasyHintHighlight extends HintHighlight
{
    sizeReduction = 0;

    constructor(isVisibleFunction)
    {
        var boundingBox = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        }
        super(boundingBox);
        this.phaseShift = rand(0, this.pulsePeriod);
        this.isVisible = isVisibleFunction;
    }

    onBecomeChild(parent)
    {
        this.boundingBox.x = this.sizeReduction / 2;
        this.boundingBox.y = this.sizeReduction / 2;
        this.boundingBox.width = parent.boundingBox.width - this.sizeReduction;
        this.boundingBox.height = parent.boundingBox.height - this.sizeReduction;
    }
}