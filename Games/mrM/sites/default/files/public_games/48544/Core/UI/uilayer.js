class UiLayer
{
    layerName = "";
    boundingBox;
    hitboxes;

    hitboxXOffset = 0;
    hitboxYOffset = 0;
    scale = 1;
    isPopup = false;
    _isEnabled = true;   // Used for mouse interactions
    _isVisible = true;   // Used for rendering

    initialUiScaleX;
    initialUiScaleY;

    onOpen = new EventHook();
    onClose = new EventHook();

    constructor(boundingBox, hitboxes = [])
    {
        this.boundingBox = boundingBox;
        this.hitboxes = hitboxes;
        this.initialUiScaleX = uiScaleX;
        this.initialUiScaleY = uiScaleY;
    }

    update(deltaTime)
    {
        this.updateChildren(deltaTime);
    }

    render()
    {
        this.renderChildren();
    }

    updateChildren(deltaTime)
    {
        if(this.hitboxes)
        {
            for(var i = 0; i < this.hitboxes.length; ++i)
            {
                if(this.hitboxes[i].update)
                {
                    this.hitboxes[i].update(deltaTime);
                }
            }
        }
    }

    renderChildren()
    {
        // Render all children, even if this layer has nothing to render
        if(this.hitboxes)
        {
            for(var i = 0; i < this.hitboxes.length; ++i)
            {
                if(this.hitboxes[i].isVisible() && this.hitboxes[i].render)
                {
                    this.hitboxes[i].render();
                }
            }
        }
    }

    addHitbox(hitbox, scaled = true, index = -1)
    {
        if(scaled)
        {
            // Not great, but this simplifies adding hitboxes to scaled scrollboxes
            var scale = this.getAbsoluteScale();
            hitbox.boundingBox.x *= scale;
            hitbox.boundingBox.y *= scale;
            hitbox.boundingBox.width *= scale;
            hitbox.boundingBox.height *= scale;
        }
        if (index < 0)
        {
            this.hitboxes.push(hitbox);
        }
        else
        {
            this.hitboxes.splice(index, 0, hitbox);
        }
        hitbox.parent = this;
        hitbox.onBecomeChild(this);
        return hitbox;
    }

    onBecomeChild(parent)
    {

    }

    getHitboxById(hitboxId)
    {
        for(var i in this.hitboxes)
        {
            if(this.hitboxes[i].id == hitboxId)
            {
                return this.hitboxes[i];
            }
        }
        return null;
    }

    getHitboxIndexById(hitboxId)
    {
        for(var i in this.hitboxes)
        {
            if(this.hitboxes[i].id == hitboxId)
            {
                return parseInt(i);
            }
        }
        return null;
    }

    deleteHitboxWithId(hitboxId)
    {
        var index = this.getHitboxIndexById(hitboxId);
        if(index || index === 0)
        {
            this.deleteHitboxAtIndex(index);
        }
    }

    deleteHitboxAtIndex(hitboxIndex)
    {
        if(hitboxIndex >= 0 && hitboxIndex < this.hitboxes.length)
        {
            this.hitboxes.splice(hitboxIndex, 1);
        }
    }

    enableAllHitboxes()
    {
        for(var i in this.hitboxes)
        {
            this.hitboxes[i]._isEnabled = true;
        }
    }

    disableAllHitboxes()
    {
        for(var i in this.hitboxes)
        {
            this.hitboxes[i]._isEnabled = false;
        }
    }

    clearHitboxes()
    {
        var newHitboxes = [];
        for(var i = 0; i < this.hitboxes.length; ++i)
        {
            if(this.hitboxes[i].isPermanent)
            {
                newHitboxes.push(this.hitboxes[i]);
            }
        }
        this.hitboxes = newHitboxes;
    }

    isMouseInLayer()
    {
        var globalBoundingBox = {};
        var topLeft = this.getGlobalCoordinates(0, 0);
        var bottomRight = this.getGlobalCoordinates(this.boundingBox.width, this.boundingBox.height);
        globalBoundingBox.x = topLeft.x;
        globalBoundingBox.y = topLeft.y;
        globalBoundingBox.width = bottomRight.x - topLeft.x;
        globalBoundingBox.height = bottomRight.y - topLeft.y;
        return isMouseWithinBounds(globalBoundingBox)
    }

    findMatchingHitboxInLayer()
    {
        if(!this.hitboxes || this.hitboxes.length == 0) return null;
        var matchingHitBox = null;
        for(var j = 0; j < this.hitboxes.length; ++j)
        {
            if(!this.hitboxes[j].isEnabled()) continue;
            var globalBoundingBox = this.getGlobalCoordinates(this.hitboxes[j].boundingBox.x, this.hitboxes[j].boundingBox.y);
            globalBoundingBox.x += this.hitboxXOffset;
            globalBoundingBox.y += this.hitboxYOffset;
            globalBoundingBox.width = this.hitboxes[j].boundingBox.width;
            globalBoundingBox.height = this.hitboxes[j].boundingBox.height;
            if(isMouseWithinBounds(globalBoundingBox))
            {
                matchingHitBox = this.hitboxes[j];
                return matchingHitBox;
            }
        }
        return null;
    }

    findMatchingHitboxes()
    {
        if(!this.hitboxes || this.hitboxes.length == 0) return [];
        var matchingHitBoxes = [];
        for(var j = 0; j < this.hitboxes.length; ++j)
        {
            if(!this.hitboxes[j].isEnabled() ||
                typeof (worldConfig) !== 'undefined' &&
                typeof (this.hitboxes[j].kmDepth) !== 'undefined' &&
                (this.hitboxes[j].kmDepth > currentlyViewedDepth + 1 ||
                    this.hitboxes[j].kmDepth < currentlyViewedDepth - worldConfig.numberOfDepthsVisible - 1))
            {
                // Ignore any hitboxes that aren't enabled or are off-screen
                continue;
            }
            var globalBoundingBox = this.getGlobalCoordinates(this.hitboxes[j].boundingBox.x, this.hitboxes[j].boundingBox.y);
            globalBoundingBox.x += this.hitboxXOffset;
            globalBoundingBox.y += this.hitboxYOffset;
            globalBoundingBox.width = this.hitboxes[j].boundingBox.width;
            globalBoundingBox.height = this.hitboxes[j].boundingBox.height;
            if(isMouseWithinBounds(globalBoundingBox))
            {
                matchingHitBoxes.push(this.hitboxes[j]);
                matchingHitBoxes = matchingHitBoxes.concat(this.hitboxes[j].findMatchingHitboxes());
            }
        }
        return matchingHitBoxes;
    }

    getLayerOffset(includeAdditionalOffsets = true)
    {
        var xOffset = this.boundingBox.x;
        var yOffset = this.boundingBox.y;
        if(this.hitboxXOffset && includeAdditionalOffsets)
        {
            xOffset += this.hitboxXOffset;
        }
        if(this.hitboxYOffset && includeAdditionalOffsets)
        {
            yOffset += this.hitboxYOffset;
        }
        return {x: xOffset, y: yOffset};
    }

    getGlobalCoordinates(localX, localY, includeAdditionalOffsets = true)
    {
        var offsets;
        var xOffset = this.boundingBox.x;
        var yOffset = this.boundingBox.y;
        var layer = this;
        while(layer.parent)
        {
            offsets = layer.parent.getLayerOffset(includeAdditionalOffsets);
            xOffset += offsets.x;
            yOffset += offsets.y;
            layer = layer.parent;
        }
        return {x: localX + xOffset, y: localY + yOffset};
    }

    getLocalCoordinates(globalX, globalY)
    {
        var offsets = this.getLayerOffset();
        var xOffset = offsets.x;
        var yOffset = offsets.y;
        var layer = this;
        while(layer.parent)
        {
            offsets = layer.parent.getLayerOffset();
            xOffset += offsets.x;
            yOffset += offsets.y;
            layer = layer.parent;
        }
        return {x: globalX - xOffset, y: globalY - yOffset};
    }

    getRelativeCoordinates(localX, localY, otherLayer, includeAdditionalOffsets = true)
    {
        var localOffset = this.getGlobalCoordinates(0, 0, includeAdditionalOffsets);
        var otherOffset = otherLayer.getGlobalCoordinates(0, 0, includeAdditionalOffsets);
        return {x: Math.floor(localX + (localOffset.x - otherOffset.x)), y: Math.floor(localY + (localOffset.y - otherOffset.y))};
    }

    getContext()
    {
        var element = this.getFirstElementWithContext();
        if(element)
        {
            return element.context;
        }
        return null;
    }

    getFirstElementWithContext()
    {
        if(this.context) return this;
        var parent = this.parent;
        while(parent)
        {
            if(parent.context) return parent;
            parent = parent.parent;
        }
        return null;
    }

    getRootLayer()
    {
        var layer = this;
        while(layer.parent)
        {
            layer = layer.parent;
        }
        return layer;
    }

    getAbsoluteScale()
    {
        var scale = this.scale;
        var layer = this;
        while(layer.parent)
        {
            scale *= layer.parent.scale;
            layer = layer.parent;
        }
        return scale;
    }

    rescaleBoundingBoxOnResize()
    {
        this.boundingBox.x *= this.initialUiScaleX / uiScaleX;
        this.boundingBox.y *= this.initialUiScaleY / uiScaleY;
        this.boundingBox.width *= this.initialUiScaleX / uiScaleX;
        this.boundingBox.height *= this.initialUiScaleY / uiScaleY;
        this.initialUiScaleX = uiScaleX;
        this.initialUiScaleY = uiScaleY;
        for(var i in this.hitboxes)
        {
            this.hitboxes[i].rescaleBoundingBoxOnResize();
        }
    }

    getBoundingBoxForAllChildren()
    {
        var minX = this.boundingBox.x;
        var maxX = this.boundingBox.x + this.boundingBox.width;
        var minY = this.boundingBox.y;
        var maxY = this.boundingBox.y + this.boundingBox.height;

        for(var i in this.hitboxes)
        {
            minX = Math.min(this.hitboxes[i].boundingBox.x);
            maxX = Math.max(this.hitboxes[i].boundingBox.x + this.hitboxes[i].boundingBox.width);
            minY = Math.min(this.hitboxes[i].boundingBox.y);
            maxY = Math.max(this.hitboxes[i].boundingBox.y + this.hitboxes[i].boundingBox.height);
        }
        return {
            "x": minX,
            "y": minY,
            "width": maxX - minX,
            "height": maxY - minY
        };
    }

    clearCanvas()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    isVisible()
    {
        return this._isVisible;
    }

    isEnabled()
    {
        return this._isEnabled;
    }

    setVisible(isVisible)
    {
        this._isVisible = isVisible;
    }

    setEnabled(isEnabled)
    {
        this._isEnabled = isEnabled;
    }

    isDescendantOf(otherLayer)
    {
        var layer = this;
        while (layer = layer.parent)
        {
            if (layer == otherLayer)
            {
                return true;
            }
        }
        return false;
    }

    isAncestorOf(otherLayer)
    {
        var layer = otherLayer;
        while (layer = layer.parent)
        {
            if (layer == this)
            {
                return true;
            }
        }
        return false;
    }
}

class Hitbox extends UiLayer
{
    isFixed = false;
    isPermanent = false;

    constructor(boundingBox, mouseEventFunctions, cursor, id = null)
    {
        super(boundingBox);
        for(const [eventName, handlerFunction] of Object.entries(mouseEventFunctions)) 
        {
            this[eventName] = handlerFunction;
        }
        this.cursor = cursor;
        if(id)
        {
            this.id = id;
        }
        else
        {
            this.id = "hitbox_" + rand(0, 9999999);
        }
    }

    render()
    {
        super.render();
    }

    getRelativeBoundingBoxCoordinates()
    {
        return {
            x: (this.boundingBox.x / this.getRootLayer().boundingBox.width).toFixed(4),
            y: (this.boundingBox.y / this.getRootLayer().boundingBox.height).toFixed(4),
            width: (this.boundingBox.width / this.getRootLayer().boundingBox.width).toFixed(4),
            height: (this.boundingBox.height / this.getRootLayer().boundingBox.height).toFixed(4),
        }
    }

    stringifyRelativeBoundingBox()
    {
        var output = "{\n";
        var boundingBox = this.getRelativeBoundingBoxCoordinates();
        output += "    x: " + boundingBox.x + " * this.boundingBox.width,\n";
        output += "    y: " + boundingBox.y + " * this.boundingBox.height,\n";
        output += "    width: " + boundingBox.width + " * this.boundingBox.width,\n";
        output += "    height: " + boundingBox.height + " * this.boundingBox.height\n";
        output += "}";
        return output;
    }

    exportToJsCode()
    {
        var parent;
        var parentString;
        var varName;
        var root = this.getRootLayer();
        var output = "";
        if(!this.layerName)
        {
            if(this.parent && !this.parent.layerName)
            {
                parent = this.parent;
                parentString = this.parent.id;
                if(typeof (root[parentString]) !== "undefined")
                {
                    // Hitbox is property of root
                    parentString = "this." + parentString;
                }
            }
            else
            {
                parent = root;
                parentString = "this";
            }
            if(typeof (root[this.id]) !== "undefined")
            {
                // Hitbox is property of root
                varName = "this." + this.id;
            }
            else
            {
                varName = this.id;
                output += "var "
            }

            output += varName + " = new Hitbox(\n";
            output += "    " + this.stringifyRelativeBoundingBox() + ",\n";
            output += "    {},\n"; // Have to skip mouse functions
            output += "    \"" + this.cursor + "\",\n";
            output += "    \"" + this.id + "\"\n";
            output += "}\n";
            output += parentString + ".addHitbox(" + varName + ");\n";
        }
        for(var i in this.hitboxes)
        {
            output += this.hitboxes[i].exportToJsCode();
        }
        return output;
    }
}

class WorldEntityHitbox extends Hitbox
{
    kmDepth;

    constructor(kmDepth, boundingBox, mouseEventFunctions, cursor, id = "")
    {
        boundingBox.y += (mainh * .111 + ((kmDepth + 4) * .178 * mainh)) / uiScaleY;
        super(boundingBox, mouseEventFunctions, cursor, id);
        this.kmDepth = kmDepth;
    }
}

// For mobile. Uses sizes set in worldconfig.js instead of fixed numbers
class NewWorldEntityHitbox extends Hitbox
{
    kmDepth;
    // Max difference in depth between this and bottom or top of screen for this hitbox to be rendered
    maxDistanceFromViewportToRender = 6;

    constructor(kmDepth, boundingBox, mouseEventFunctions, cursor, id = "")
    {
        var topBound = worldConfig.topBound;
        var levelHeight = worldConfig.levelHeight;
        boundingBox.y += topBound + ((kmDepth + worldConfig.numberOfDepthsVisible - 1) * levelHeight) / uiScaleY;
        super(boundingBox, mouseEventFunctions, cursor, id);
        this.kmDepth = kmDepth;
    }

    isVisible()
    {
        var depthRange = getVisibleDepthRange();
        return this.kmDepth >= depthRange.min - this.maxDistanceFromViewportToRender &&
            this.kmDepth <= depthRange.max + this.maxDistanceFromViewportToRender
    }
}

class Button extends Hitbox
{
    text;
    image;
    font;
    color;
    context;

    constructor(image, text, font, color, boundingBox, mouseEventFunctions, cursor, id = "")
    {
        super(boundingBox, mouseEventFunctions, cursor, id);
        this.text = text;
        this.image = image;
        this.font = font;
        this.color = color;
    }

    render()
    {
        if(!this.context) 
        {
            this.root = this.getFirstElementWithContext();
            this.context = this.root.context;
        }
        var coords = this.getRelativeCoordinates(0, 0, this.root);
        renderButton(
            this.context,
            this.image,
            this.text,
            coords.x,
            coords.y,
            this.boundingBox.width,
            this.boundingBox.height,
            this.font,
            this.color
        );
        super.render();
    }
}

class TooltipImage extends Hitbox
{
    image;
    tooltipHeader;
    tooltipBody;

    constructor(image, imageX, imageY, imageHeight, imageWidth, tooltipHeader, tooltipBody, boundingBox, id = "")
    {
        var mouseEventFunctions = {
            onmouseenter: function ()
            {
                //var getGlobalCoordinates = this.getGlobalCoordinates(boundingBox.x, boundingBox.y);
                showTooltip(tooltipHeader, tooltipBody);
            },
            onmouseexit: function ()
            {
                hideTooltip();
            }
        };
        super(boundingBox, mouseEventFunctions, 'pointer', id);

        this.image = image;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.tooltipHeader = tooltipHeader;
        this.tooltipBody = tooltipBody;
    }

    render()
    {
        if(!this.parent.context)
        {
            // TooltipImage has to be directly childed to a layer with a canvas
            return;
        }
        this.parent.context.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        super.render();
    }
}