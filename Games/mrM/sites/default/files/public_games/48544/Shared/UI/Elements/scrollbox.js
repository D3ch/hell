class Scrollbox extends Hitbox
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
    currentScrollY = 0;
    isDraggingBar = false;
    isScrollbarInitialized = false;
    isDirty = true;
    isUsingOptimizedRerender = false;

    constructor(contentWidth, contentHeight, targetCanvasContext, x, y, width, height, scrollbarWidth)
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
        this.scrollbarWidth = scrollbarWidth;
        this.setScale();
        this.onwheel = function (event)
        {
            this.scroll(event.deltaY);
        }.bind(this);
    }

    render()
    {
        this.targetContext.save();
        this.targetContext.drawImage(
            this.canvas,
            0,
            this.currentScrollY,
            this.contentWidth,
            this.boundingBox.height / this.scale,
            this.boundingBox.x,
            this.boundingBox.y,
            this.boundingBox.width - this.scrollbarWidth,
            this.boundingBox.height
        )
        this.renderScrollBar(this.targetContext, this.scrollbarWidth);
        if(this.isDirty)
        {
            super.render();
            this.isDirty = false;
        }
        this.targetContext.restore();
        this.postRender();
    }

    postRender()
    {
        
    }

    renderScrollBar(targetCanvasContext, scrollbarWidth)
    {
        if(this.checkIfScrollbarIsVisible())
        {
            var barWidth = scrollbarWidth;
            var barHeight = this.boundingBox.height * (this.boundingBox.height / this.scale) / this.contentHeight;
            if(this.isDraggingBar)
            {
                this.scrollTo(this.contentHeight * (this.getLocalCoordinates(mouseX / uiScaleX, mouseY / uiScaleX + this.hitboxYOffset, this).y - barHeight / 2) / this.boundingBox.height);
            }
            var barX = this.boundingBox.x + this.boundingBox.width - scrollbarWidth;
            var barY = this.boundingBox.y + this.boundingBox.height * (this.currentScrollY / this.contentHeight);
            targetCanvasContext.save();
            targetCanvasContext.strokeStyle = this.scrollbarTroughColor;
            targetCanvasContext.lineCap = "round";
            targetCanvasContext.lineWidth = this.scrollbarWidth / 2;
            targetCanvasContext.beginPath();
            targetCanvasContext.moveTo(this.boundingBox.x + this.boundingBox.width - scrollbarWidth / 2, this.boundingBox.y + scrollbarWidth / 2);
            targetCanvasContext.lineTo(this.boundingBox.x + this.boundingBox.width - scrollbarWidth / 2, this.boundingBox.y + this.boundingBox.height - scrollbarWidth / 2);
            targetCanvasContext.stroke();
            targetCanvasContext.strokeStyle = this.scrollbarColor;
            targetCanvasContext.beginPath();
            targetCanvasContext.moveTo(this.boundingBox.x + this.boundingBox.width - scrollbarWidth / 2, barY + scrollbarWidth / 2);
            targetCanvasContext.lineTo(this.boundingBox.x + this.boundingBox.width - scrollbarWidth / 2, barY + barHeight - scrollbarWidth / 2);
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
        if(this.currentScrollY + this.boundingBox.height > this.contentHeight)
        {
            this.currentScrollY = this.contentHeight - this.boundingBox.height;
        }
        var barHeight = this.boundingBox.height * (this.boundingBox.height / this.scale) / this.contentHeight;
        var scrollbarHitbox = new Hitbox(
            {
                x: (this.boundingBox.width - this.scrollbarWidth) / this.scale,
                y: 0,
                width: this.scrollbarWidth / this.scale,
                height: this.contentHeight,
            },
            {
                onmousedown: function ()
                {
                    if(this.checkIfScrollbarIsVisible())
                    {
                        this.isDraggingBar = true;
                        this.scrollTo(this.contentHeight * (this.getLocalCoordinates(mouseX, mouseY + this.hitboxYOffset, this).y - barHeight / 2) / this.boundingBox.height);
                        this.scrollbarColor = this.scrollbarDragColor;
                    }
                }.bind(this),
                onmousemove: function ()
                {
                    if(this.checkIfScrollbarIsVisible() && this.isDraggingBar)
                    {
                        this.scrollTo(this.contentHeight * (this.getLocalCoordinates(mouseX, mouseY + this.hitboxYOffset, this).y - barHeight / 2) / this.boundingBox.height);
                        if(this.isUsingOptimizedRerender)
                        {
                            this.clearCanvas();
                            this.render();
                        }
                        else
                        {
                            animate();
                        }
                    }
                }.bind(this),
                onmouseup: function ()
                {
                    this.isDraggingBar = false;
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

    scroll(deltaY)
    {
        this.scrollTo(this.currentScrollY + deltaY);

        if(this.isUsingOptimizedRerender)
        {
            this.clearCanvas();
            this.render();
        }
        else
        {
            animate();
        }
    }

    scrollTo(y)
    {
        if(!this.checkIfScrollbarIsVisible())
        {
            this.currentScrollY = 0;
            this.hitboxYOffset = 0;
            return;
        }
        this.currentScrollY = y;
        if(this.currentScrollY < 0)
        {
            this.currentScrollY = 0;
        }
        else if(this.currentScrollY > this.contentHeight - (this.boundingBox.height / this.scale))
        {
            this.currentScrollY = this.contentHeight - (this.boundingBox.height / this.scale);
        }
        this.hitboxYOffset = -this.currentScrollY * this.scale;
    }

    scrollToTop()
    {
        this.scrollTo(0);
    }

    scrollToBottom()
    {
        this.scrollTo(this.contentHeight);
    }

    setContentHeightToIncludeLastChild(bottomPadding = 0)
    {
        var lowestY = -1;
        for(var i in this.hitboxes)
        {
            if(this.hitboxes[i].boundingBox.y + this.hitboxes[i].boundingBox.height > lowestY)
            {
                lowestY = this.hitboxes[i].boundingBox.y + this.hitboxes[i].boundingBox.height;
            }
        }
        this.contentHeight = lowestY + bottomPadding;
        this.canvas.height = this.contentHeight;
        this.initializeScrollbar();
    }

    setScale()
    {
        this.scale = (this.boundingBox.width - this.scrollbarWidth) / this.contentWidth;
        if(Math.floor(this.canvas.width) != Math.floor(this.contentWidth))
        {
            this.canvas.width = this.contentWidth;
        }
        if(Math.floor(this.canvas.height) < Math.floor(this.contentHeight))
        {
            this.canvas.height = this.contentHeight;
        }
    }

    checkIfScrollbarIsVisible()
    {
        return this.contentHeight * this.scale > this.boundingBox.height;
    }

    getScrollbarWidth()
    {
        return this.checkIfScrollbarIsVisible() ? this.scrollbarWidth : 0;
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