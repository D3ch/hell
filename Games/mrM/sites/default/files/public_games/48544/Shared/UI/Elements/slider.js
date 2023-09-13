class Slider extends Hitbox
{
    targetContext;
    cursor = "pointer";
    sliderHitbox;
    troughHeightFraction = 0.85;
    markerWidth = 10;
    markerColor = "#76E374";
    troughColor = "#252525";

    markerPosition = 0;
    minValue = 0;
    maxValue = 1;
    value = 0;
    mode = "exponential";

    isDraggingBar = false;
    onchange;

    constructor(targetCanvasContext, x, y, width, height)
    {
        var boundingBox = { x: x, y: y, width: width, height: height };
        super(boundingBox, {}, "")
        this.targetContext = targetCanvasContext;
        this.boundingBox = boundingBox;
        this.onwheel = function (event)
        {
            var scrollReduction = 5000;
            this.setPosition(this.markerPosition - event.deltaY/scrollReduction);
        }.bind(this);
        this.onmousedown = function ()
        {
            this.isDraggingBar = true;
            this.setPositionOnClick();
        }.bind(this);
        this.onmouseup = function ()
        {
            this.isDraggingBar = false;
        }.bind(this);
    }

    render()
    {
        if (this.isDraggingBar)
        {
            this.setPositionOnClick();
        }
        var layer = this.getRootLayer();
        var coords = this.getRelativeCoordinates(0, 0, layer);
        this.targetContext.save();
        this.targetContext.strokeStyle = this.troughColor;
        this.targetContext.lineCap = "round";
        this.targetContext.lineWidth = this.boundingBox.height * this.troughHeightFraction;
        var lineCapRadius = this.targetContext.lineWidth / 2;
        this.targetContext.beginPath();
        this.targetContext.moveTo(coords.x + lineCapRadius, coords.y + this.boundingBox.height/2);
        this.targetContext.lineTo(coords.x - lineCapRadius + this.boundingBox.width, coords.y + this.boundingBox.height/2);
        this.targetContext.stroke();
        this.targetContext.fillStyle = this.markerColor;
        this.targetContext.fillRect(
            coords.x + (this.boundingBox.width - 2 * lineCapRadius) * this.markerPosition - this.markerWidth/2 + lineCapRadius,
            coords.y,
            this.markerWidth, 
            this.boundingBox.height
        );
        this.targetContext.restore();
        super.render();
    }

    setPositionOnClick()
    {
        var x = (this.getLocalCoordinates(mouseX / uiScaleX - this.markerWidth, mouseY / uiScaleY, this).x) / (this.boundingBox.width-this.boundingBox.height);
        this.setPosition(x);
    }

    setPosition(x)
    {
        if(x < 0) x = 0;
        else if(x > 1) x = 1;
        if(x != this.markerPosition && this.onchange) this.onchange();
        this.markerPosition = x;
        switch(this.mode)
        {
            case "linear":
                this.value = this.minValue + this.markerPosition * this.maxValue;
                break;
            case "exponential":
                var minimumFraction = 0.0001;
                var minPosition = 0;
                var maxPosition = 1;
                var minValue = Math.log(minimumFraction); // Slider midpoint is 1/10 of max
                var maxValue = Math.log(1);
                var scale = (maxValue - minValue) / (maxPosition - minPosition);
                this.value = Math.exp(minValue + scale * (this.markerPosition - minPosition));
                break;
            default:
                this.value = this.minValue + this.markerPosition * this.maxValue;
                break;
        }
    }
}