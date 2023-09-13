class HintArrow extends Hitbox
{
    image;
    root;
    context;

    bounceDistance = 0.35; // Bounce distance as fraction of arrow length
    bouncePeriod = 32;     // Bounce period in frames
    phaseShift;

    constructor(direction, boundingBox)
    {
        super(boundingBox, {}, "");
        this.direction = direction;
        if(direction == "left")
        {
            this.image = arrowleft;
        }
        else if(direction == "right")
        {
            this.image = arrowright;
        }
        else
        {
            this.image = arrow;
        }
        this.phaseShift = rand(0, this.bouncePeriod);
    }

    render()
    {
        if(showHintArrows)
        {
            if(!this.root)
            {
                this.root = this.getRootLayer();
                this.context = this.root.context;
            }
            var coords = this.getRelativeCoordinates(0, 0, this.root);
            var xOffset = 0;
            var yOffset = 0;
            if(this.direction == "left")
            {
                xOffset = oscillate(this.phaseShift + numFramesRendered, this.bouncePeriod / 2) * this.bounceDistance * this.boundingBox.width;
            }
            else if(this.direction == "right")
            {
                xOffset = -oscillate(this.phaseShift + numFramesRendered, this.bouncePeriod / 2) * this.bounceDistance * this.boundingBox.width;
            }
            else
            {
                yOffset = -oscillate(this.phaseShift + numFramesRendered, this.bouncePeriod / 2) * this.bounceDistance * this.boundingBox.width;
            }
            this.context.drawImage(
                this.image,
                coords.x + xOffset,
                coords.y + yOffset,
                this.boundingBox.width,
                this.boundingBox.height
            );
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

class EasyHintArrow extends HintArrow
{
    fractionalPadding;
    xOffset;
    yOffset;

    constructor(direction, isVisibleFunction, fractionalPadding = 0, xOffset = 0, yOffset = 0)
    {
        var fractionalWidth = 0.08;
        var fractionalHeight = 0.075;
        var width, height;
        if(direction == "left" || direction == "right")
        {
            width = fractionalWidth * mainw;
            height = width * 0.7;
        }
        else
        {
            height = fractionalHeight * mainh;
            width = height * 0.7;
        }
        var boundingBox = {
            x: 0,
            y: 0,
            width: width,
            height: height,
        }
        super(direction, boundingBox);
        this.isVisible = isVisibleFunction;
        this.fractionalPadding = fractionalPadding;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    onBecomeChild(parent)
    {
        var padding;
        if(this.direction == "left")
        {
            padding = this.fractionalPadding * parent.boundingBox.width;
            this.boundingBox.x = parent.boundingBox.width + padding + this.xOffset;
            this.boundingBox.y = (parent.boundingBox.height - this.boundingBox.height) / 2 + this.yOffset;
        }
        else if(this.direction == "right")
        {
            padding = this.fractionalPadding * parent.boundingBox.width;
            this.boundingBox.x = -this.boundingBox.width - padding + this.xOffset;
            this.boundingBox.y = (parent.boundingBox.height - this.boundingBox.height) / 2 + this.yOffset;
        }
        else
        {
            padding = this.fractionalPadding * parent.boundingBox.height;
            this.boundingBox.x = (parent.boundingBox.width - this.boundingBox.width) / 2 + this.xOffset;
            this.boundingBox.y = -this.boundingBox.height - padding + this.yOffset;
        }
    }
}