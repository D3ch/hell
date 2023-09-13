class BackpackWindow extends PopupWindow
{
    layerName = "backpack";
    domElementId = "PACKD";
    context = PACK;
    zIndex = 3;
    itemScrollbox;
    isFirstRender = true;
    draggedSlot = -1;
    animationLayerLoop;
    
    constructor(boundingBox, domElement)
    {
        super(boundingBox, domElement);
        if (!boundingBox)
        {
            this.setBoundingBox();  
        }
        // Close button
        this.addHitbox(new Button(
            closei, "","", "",
            {
                x: this.boundingBox.width*.94,
                y: this.boundingBox.height*.01,
                width: this.boundingBox.width*.05,
                height: this.boundingBox.height*.05
            },
            {
                onmousedown: function ()
                {
                    closeUi(this.parent);
                }
            },
            'pointer',
            "closeButton"
        ));
        this.itemScrollbox = new Scrollbox(
            this.boundingBox.width * 0.95,
            1000,
            PACK,
            this.boundingBox.width * 0.025,
            this.boundingBox.height * 0.07,
            this.boundingBox.width * 0.95,
            this.boundingBox.height * 0.905,
            15
        );
        this.itemScrollbox.context.font = "32px Verdana";
        this.addHitbox(this.itemScrollbox);
    }
    
    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.drawImage(sellbg,0,0,640,405,0,0,this.boundingBox.width,this.boundingBox.height);
        if (isBackpackDirty || this.isFirstRender)
        {
            this.isFirstRender = false;
            this.generateScrollboxContents();
        }
        super.render();
        this.context.restore();
    }
    
    renderAnimationLayer(iconSize, slotSize)
    {
        var itemInSlot;
        if (itemInSlot = getItemInBackpackSlot(this.draggedSlot))
        {
            PACKANIMATION.clearRect(0, 0, packanimationdw, packanimationdh);
            var item = getItemById(itemInSlot.id);
            var draggedIconRelativeOffset = 0.25;
            drawImageFitInBox(
                PACKANIMATION,
                item.icon,
                (mouseX / uiScaleX) - iconSize * draggedIconRelativeOffset,
                (mouseY / uiScaleY) - iconSize * draggedIconRelativeOffset,
                iconSize,
                iconSize
            );
            PACKANIMATION.fillStyle = "#FFFFFF";
            PACKANIMATION.font = "16px Verdana";
            PACKANIMATION.textBaseline = "bottom";
            fillTextWrap(
                PACKANIMATION,
                itemInSlot.quantity,
                (mouseX / uiScaleX) - iconSize * draggedIconRelativeOffset,
                (mouseY / uiScaleY) + slotSize - iconSize * draggedIconRelativeOffset,
                slotSize,
                "right"
            );    
        }
    }

    generateScrollboxContents()
    {
        var box = this.itemScrollbox;
        var slotSize = 60;
        var iconSize = 55;
        var padding = 10;
        if (this.draggedSlot >= 0)
        {
            renderUiOnSubinterval(this.layerName, this.renderAnimationLayer.bind(this), 10, this.animationLayerLoop, iconSize, slotSize);
        }
        console.log("REDRAWING BACKPACK");
        box.context.save();
        box.context.clearRect(0, 0, box.contentWidth, box.contentWidth);
        if (isBackpackDirty)
        {
            console.log("CLEARING OLD HITBOXES");
            box.clearHitboxes();
        }
        var slotsPerRow = Math.floor((box.contentWidth - padding * 2) / slotSize);
        var totalRows = Math.ceil(getBackpackSize() / slotsPerRow);
        var slotSpacing = ((box.contentWidth - padding * 2) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        box.contentHeight = totalRows * (slotSize + slotSpacing) + 2 * padding;
        box.canvas.height = box.contentHeight;
        box.setScale();
        for (var i = 0; i < getBackpackSize(); ++i)
        {
            var indexInRow = i % slotsPerRow;
            var slotX = padding + indexInRow * (slotSize + slotSpacing);
            var slotY = padding + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
            box.context.fillStyle = "#555555";
            box.context.globalAlpha = 0.8;
            box.context.fillRect(slotX, slotY, slotSize, slotSize);
            box.context.globalAlpha = 1;
            var itemInSlot, item;
            if (itemInSlot = getItemInBackpackSlot(i))
            {
                item = getItemById(itemInSlot.id);
                if (this.draggedSlot != i)
                {
                    drawImageFitInBox(box.context, item.icon, slotX + (slotSize - iconSize) / 2, slotY + (slotSize - iconSize) / 2, iconSize, iconSize);
                    box.context.fillStyle = "#FFFFFF";
                    box.context.textBaseline = "bottom";
                    box.context.font = "16px Verdana";
                    fillTextWrap(box.context, itemInSlot.quantity, slotX, slotY + slotSize, slotSize, "right");
                    box.addHitbox(new Hitbox(
                        {
                            x: slotX,
                            y: slotY,
                            width: slotSize,
                            height: slotSize,
                        },
                        {
                            onmousedown: function (itemInSlot)
                            {
                                hideTooltip();
                                this.draggedSlot = itemInSlot.slot;
                                showDiv("PACKANIMATIOND", 4);
                                this.generateScrollboxContents();
                                this.render();
                                return;
                            }.bind(this, itemInSlot),
                            onmouseup: function (itemInSlot)
                            {
                                this.draggedSlot = -1;
                                var coords = this.itemScrollbox.getLocalCoordinates(mouseX / uiScaleX, mouseY / uiScaleY);
                                if (activeLayers.backpack && box.isMouseInLayer())
                                {
                                    var x = coords.x;
                                    var y = coords.y;
                                    var column = Math.max(0, Math.floor((x - padding * this.itemScrollbox.scale) / ((slotSize + slotSpacing) * this.itemScrollbox.scale)));
                                    var row = Math.max(0, Math.floor((y - padding * this.itemScrollbox.scale) / ((slotSize + slotSpacing) * this.itemScrollbox.scale)));
                                    var i = slotsPerRow * row + column;
                                    if (row >= 0 && column >= 0 && i >= 0 && i < getBackpackSize())
                                    {
                                        moveItemInBackpack(itemInSlot.slot, i);
                                    }
                                    else
                                    {
                                        this.generateScrollboxContents();
                                    }
                                }
                                else
                                {
                                    this.generateScrollboxContents();
                                }
                                hideDiv("PACKANIMATIOND");
                                PACKANIMATION.clearRect(0, 0, packanimationdw, packanimationdh);
                                if (activeLayers.backpack)
                                {
                                    this.render();
                                }
                                return;
                            }.bind(this, itemInSlot),
                            onmouseenter: function (itemInSlot, slotX, slotY)
                            {
                                if (!isMouseDown)
                                {
                                    var item = getItemById(itemInSlot.id);
                                    var description = item.description || "";
                                    var coords = this.itemScrollbox.getGlobalCoordinates(slotX * this.itemScrollbox.scale, slotY * this.itemScrollbox.scale);
                                    showTooltip(
                                        item.name,
                                        description,
                                        coords.x * uiScaleX,
                                        (coords.y + iconSize * this.itemScrollbox.scale - this.itemScrollbox.currentScrollY * this.itemScrollbox.scale) * uiScaleY
                                    );
                                }
                            }.bind(this, itemInSlot, slotX, slotY),
                            onmouseexit: function (event) { hideTooltip(); }.bind(item)
                        },
                        "pointer"
                        )
                    );
                }
            }
        }
        isBackpackDirty = false;
        box.context.restore();
    }
}