class Stage extends UiLayer
{
    layerName = "Stage";
    zIndex = 10;
    isRendered = false;
    isPopup = false;
    allowBubbling = true;
    context = STAGE;
    previousBoundingBox;

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

    showStage()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.isRendered = true;
        document.getElementById("STAGED").style.zIndex = 10;
    }

    hideStage()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.isRendered = false;
        this.clearHitboxes();
        document.getElementById("STAGED").style.zIndex = -1;
    }

    render()
    {
        if(this.previousBoundingBox)
        {
            this.context.clearRect(this.previousBoundingBox.x - 1, this.previousBoundingBox.y - 1, this.previousBoundingBox.width + 2, this.previousBoundingBox.height + 2);
        }
        this.renderChildren();
        this.previousBoundingBox = this.getBoundingBoxForAllChildren();
    }
}