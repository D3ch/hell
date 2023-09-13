/*
AO: This class has not been extensively used and should be used with caution in production
The framebuffer cropping and scaling may have an issue
*/

class HorizontalScrollbox extends Hitbox
{
    contentWidth;
    contentHeight;
    canvas;
    context;
    targetContext;
    scale;

    cursor = "";

    // Can change these, but they're identical by default
    scrollbarColor = "#519650";
    scrollbarDefaultColor = "#519650";
    scrollbarHoverColor = "#51AA50";
    scrollbarDragColor = "#51AA50";
    scrollbarTroughColor = "#151515";
    currentScrollX = 0;
    isDraggingBar = false;
    isScrollbarInitialized = false;
    isDirty = true;

    constructor(contentWidth, contentHeight, targetCanvasContext, x, y, width, height, scrollbarHeight)
    {
        var boundingBox = {x: x, y: y, width: width, height: height};
        super(boundingBox, {}, "")
        this.canvas = document.createElement('canvas');
        this.canvas.width = contentWidth;
        this.canvas.height = Math.max(1000, contentHeight);
        this.context = this.canvas.getContext('2d');
        // this.context.imageSmoothingEnabled = false;
        this.targetContext = targetCanvasContext;
        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;
        this.boundingBox = boundingBox;
        this.scrollbarHeight = scrollbarHeight;
        this.setScale();
        this.onwheel = function (event)
        {
            this.scroll(event.deltaY);
        }.bind(this);
    }

    render()
    {
        if(!this.isVisible()) return;
        this.targetContext.drawImage(
            this.canvas,
            this.currentScrollX,
            0,
            this.boundingBox.width / this.scale,
            this.contentHeight,
            this.boundingBox.x,
            this.boundingBox.y,
            this.boundingBox.width,
            this.boundingBox.height - this.scrollbarHeight
        )
        this.renderScrollBar(this.targetContext, this.scrollbarHeight);
        if(this.isDirty)
        {
            super.render();
            this.isDirty = false;
        }
        this.postRender();
    }

    postRender()
    {
        
    }

    renderScrollBar(targetCanvasContext, scrollbarHeight)
    {
        if(this.checkIfScrollbarIsVisible())
        {
            var barWidth = this.boundingBox.width * (this.boundingBox.width / this.scale) / this.contentWidth;
            if(this.isDraggingBar)
            {
                this.scrollTo(this.contentWidth * (this.getLocalCoordinates(mouseX / uiScaleX + this.hitboxXOffset, mouseY / uiScaleX, this).x - barWidth / 2) / this.boundingBox.width);
            }
            var barX = this.boundingBox.x + this.boundingBox.width * (this.currentScrollX / this.contentWidth);
            var barY = this.boundingBox.y + this.boundingBox.height - scrollbarHeight;
            targetCanvasContext.save();
            targetCanvasContext.strokeStyle = this.scrollbarTroughColor;
            targetCanvasContext.lineCap = "round";
            targetCanvasContext.lineWidth = this.scrollbarHeight / 2;
            targetCanvasContext.beginPath();
            targetCanvasContext.moveTo(this.boundingBox.x + scrollbarHeight / 2, this.boundingBox.y + this.boundingBox.height - scrollbarHeight / 2);
            targetCanvasContext.lineTo(this.boundingBox.x + this.boundingBox.width - scrollbarHeight / 2, this.boundingBox.y + this.boundingBox.height - scrollbarHeight / 2);
            targetCanvasContext.stroke();
            targetCanvasContext.strokeStyle = this.scrollbarColor;
            targetCanvasContext.beginPath();
            targetCanvasContext.moveTo(barX + scrollbarHeight / 2, this.boundingBox.y + this.boundingBox.height - scrollbarHeight / 2);
            targetCanvasContext.lineTo(barX + barWidth - scrollbarHeight / 2, this.boundingBox.y + this.boundingBox.height - scrollbarHeight / 2);
            targetCanvasContext.stroke();
            if(!this.isScrollbarInitialized)
            {
                this.initializeScrollbar();
            }
            targetCanvasContext.restore();
        }
        else
        {
            if(this.isScrollbarInitialized)
            {
                this.getHitboxById("scrollbar").setEnabled(false)
                this.isScrollbarInitialized = false;
            }
            targetCanvasContext.save();
            targetCanvasContext.fillStyle = "#777777";
            // targetCanvasContext.fillRect(this.boundingBox.x + this.boundingBox.width - scrollbarWidth, this.boundingBox.y, scrollbarWidth, this.boundingBox.height);
            targetCanvasContext.restore();
        }
    }

    initializeScrollbar()
    {
        this.clearCanvas();
        this.isDirty = true;
        this.setScale();
        var barWidth = this.boundingBox.width * (this.boundingBox.width / this.scale) / this.contentWidth;
        var scrollbarHitbox = new Hitbox(
            {
                x: 0,
                y: (this.boundingBox.height - this.scrollbarHeight) / this.scale,
                width: this.contentWidth,
                height: this.scrollbarHeight / this.scale,
            },
            {
                onmousedown: function ()
                {
                    if(this.checkIfScrollbarIsVisible())
                    {
                        this.isDraggingBar = true;
                        this.scrollTo(this.contentWidth * (this.getLocalCoordinates(mouseX + this.hitboxXOffset, mouseY, this).x - barWidth / 2) / this.boundingBox.width);
                        this.scrollbarColor = this.scrollbarDragColor;
                        this.render();
                    }
                }.bind(this),
                onmousemove: function ()
                {
                    if(this.checkIfScrollbarIsVisible() && this.isDraggingBar)
                    {
                        this.scrollTo(this.contentWidth * (this.getLocalCoordinates(mouseX + this.hitboxXOffset, mouseY, this).x - barWidth / 2) / this.boundingBox.width);
                        this.render();
                    }
                }.bind(this),
                onmouseup: function ()
                {
                    if(this.checkIfScrollbarIsVisible()) this.isDraggingBar = false;
                    this.scrollbarColor = this.scrollbarDefaultColor;
                }.bind(this),
                onmouseenter: function ()
                {
                    if(!this.isDraggingBar) this.scrollbarColor = this.scrollbarHoverColor;
                }.bind(this),
                onmouseexit: function ()
                {
                    if(!this.isDraggingBar) this.scrollbarColor = this.scrollbarDefaultColor;
                }.bind(this),
            },
            "pointer",
            "scrollbar"
        );
        scrollbarHitbox.setEnabled(true)
        scrollbarHitbox.isPermanent = true;
        this.deleteHitboxWithId('scrollbar');
        this.addHitbox(scrollbarHitbox);
        this.isScrollbarInitialized = true;
    }

    scroll(deltaX)
    {
        this.scrollTo(this.currentScrollX + deltaX);
        this.render();
    }

    scrollTo(x)
    {
        if(!this.checkIfScrollbarIsVisible())
        {
            this.currentScrollX = 0;
            this.hitboxXOffset = 0;
            return;
        }
        this.currentScrollX = x;
        if(this.currentScrollX < 0)
        {
            this.currentScrollX = 0;
        }
        else if(this.currentScrollX > this.contentWidth - (this.boundingBox.width / this.scale))
        {
            this.currentScrollX = this.contentWidth - (this.boundingBox.width / this.scale);
        }
        this.hitboxXOffset = -this.currentScrollX * this.scale;
    }

    setScale()
    {
        this.scale = (this.boundingBox.height - this.scrollbarHeight) / this.contentHeight;
        if(Math.floor(this.canvas.height) != Math.floor(this.contentHeight))
        {
            this.canvas.height = this.contentHeight;
        }
        if(Math.floor(this.canvas.width) < Math.floor(this.contentWidth))
        {
            this.canvas.width = this.contentWidth;
        }
    }

    checkIfScrollbarIsVisible()
    {
        return this.contentWidth * this.scale > this.boundingBox.width;
    }

    getScrollbarHeight()
    {
        return this.checkIfScrollbarIsVisible() ? this.scrollBarHeight : 0;
    }

    clearCanvas()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    generateTestPattern()
    {
        var y = 0;
        var barHeight = 55;
        while(y < this.contentHeight)
        {
            var x = 0;
            while(x < this.contentWidth)
            {
                this.context.fillStyle = (x + y) % 2 == 0 ? 'white' : 'black';
                this.context.fillRect(x, y, barHeight, barHeight);
                x += barHeight;
            }
            y += barHeight;
        }
    }
}