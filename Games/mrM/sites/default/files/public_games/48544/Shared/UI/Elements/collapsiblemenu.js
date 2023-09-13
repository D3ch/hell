class CollapsibleMenu extends Hitbox
{
    titleText;
    collapsedHeight;
    expandedHeight;
    canvas;
    context;
    targetContext;
    cursor = "";

    isCollapsed = true;

    constructor(targetCanvasContext, x, y, width, collapsedHeight, expandedHeight, titleText, font, fontColor)
    {
        var boundingBox = {x: x, y: y, width: width, height: collapsedHeight};
        super(boundingBox, {}, "")
        this.titleText = titleText;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = expandedHeight;
        this.context = this.canvas.getContext('2d');
        // this.context.imageSmoothingEnabled = false;
        this.targetContext = targetCanvasContext;
        this.boundingBox = boundingBox;
        this.collapsedHeight = collapsedHeight;
        this.expandedHeight = expandedHeight;
        this.font = font;
        this.fontColor = fontColor;
        this.addHitbox(new Hitbox(
            {
                x: 0,
                y: 0,
                width: width,
                height: collapsedHeight
            },
            {
                onmousedown: this.toggle.bind(this)
            },
            "pointer",
            "titleBox"
        ), false)
    }

    render()
    {
        this.targetContext.save();
        // this.targetContext.imageSmoothingEnabled = false;
        this.targetContext.clearRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.collapsedHeight + this.expandedHeight);
        this.targetContext.fillStyle = "#070707";
        this.targetContext.globalAlpha = 0.7;
        this.targetContext.fillRect(
            this.boundingBox.x,
            this.boundingBox.y,
            this.boundingBox.width,
            this.collapsedHeight
        );
        this.targetContext.clearRect(
            this.boundingBox.x + 1,
            this.boundingBox.y + 1,
            this.boundingBox.width - 2,
            this.collapsedHeight - 2
        );
        this.targetContext.fillStyle = "#111111";
        this.targetContext.fillRect(
            this.boundingBox.x + 1,
            this.boundingBox.y + 1,
            this.boundingBox.width - 2,
            this.collapsedHeight - 2
        );
        this.targetContext.globalAlpha = 1;
        this.targetContext.fillStyle = this.fontColor;
        this.targetContext.font = this.font;
        this.targetContext.textBaseline = "middle";
        var expandIcon = this.isCollapsed ? "+ " : "- ";
        fillTextWrap(
            this.targetContext,
            expandIcon,
            this.boundingBox.x + 5,
            this.boundingBox.y + this.collapsedHeight / 2,
            15,
            "center"
        );
        fillTextShrinkToFit(
            this.targetContext,
            this.titleText,
            this.boundingBox.x + 25,
            this.boundingBox.y + this.collapsedHeight / 2,
            this.boundingBox.width - 20,
            "left"
        );
        if(!this.isCollapsed)
        {
            this.targetContext.drawImage(
                this.canvas,
                this.boundingBox.x,
                this.boundingBox.y + this.collapsedHeight,
                this.boundingBox.width,
                this.expandedHeight - this.collapsedHeight
            )
        }
        if(this.showNotificationIcon)
        {
            var markerSize = 5;
            this.targetContext.fillStyle = "#FF0000";
            this.targetContext.strokeStyle = "#FFFFFF";
            this.targetContext.lineWidth = 2;
            this.targetContext.beginPath();
            this.targetContext.arc(
                this.boundingBox.x + this.boundingBox.width - 2 * markerSize,
                this.boundingBox.y + 2 * markerSize,
                markerSize,
                0,
                2 * Math.PI
            );
            this.targetContext.fill();
            this.targetContext.stroke();
        }
        this.targetContext.restore();
        super.render();
    }

    toggle()
    {
        this.parent.isDirty = true;
        if(this.isCollapsed)
        {
            this.expand();
        }
        else
        {
            this.collapse();
        }
    }

    collapse()
    {
        this.parent.isDirty = true;
        this.isCollapsed = true;
        this.boundingBox.height = this.collapsedHeight;
        this.disableAllHitboxes();
        this.getHitboxById("titleBox").setEnabled(true)
    }

    expand()
    {
        this.parent.isDirty = true;
        this.isCollapsed = false;
        this.boundingBox.height = this.expandedHeight;
        this.enableAllHitboxes();
    }

    addHitbox(hitbox, isChild = true)
    {
        hitbox.setEnabled(!this.isCollapsed || !isChild)
        super.addHitbox(hitbox);
    }

    setCanvasHeight(newHeight)
    {
        this.canvas.height = newHeight;
    }
}