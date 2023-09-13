const hitboxLabelMode = {
    pixels: 0,
    percent: 1,
    id: 2
}

var hitboxDebugSettings = {
    labelMode: hitboxLabelMode.id,
    showLines: true,
    showLabels: true,
    xLabelLocation: "top",
    onlyShowTopLayer: true,
    lineColor: "#FFFFFF",
    lineOutlineColor: "#000000",
    lineWidth: 2,
    lineOutlineWidth: 4,
    lineDash: [4, 8],
    lineAlpha: 0.5,
    boxOutlineWidth: 2,
    boxOutlineAlpha: 1,
    boxColors: ["#ff0000", "#ffaa00", "#ffff00", "#00ff00", "#0000ff", "#ff00ff"] // Colors cycle as depth increases
}

class HitboxDebug extends UiLayer
{
    layerName = "HitboxDebug";
    zIndex = 4;
    isRendered = true;
    isPopup = false;
    allowBubbling = true;
    context = null; // Set in this.open()

    debugCanvas;
    currenthitboxLabelType;

    constructor(boundingBox, labelMode = -1, onlyShowTopLayer = null)
    {
        super(boundingBox);
        if(labelMode >= 0)
        {
            hitboxDebugSettings.labelMode = labelMode;
        }
        if(onlyShowTopLayer !== null)
        {
            hitboxDebugSettings.onlyShowTopLayer = onlyShowTopLayer;
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

    open()
    {
        this.debugCanvas = document.createElement('canvas');
        this.debugCanvas.style.position = 'absolute';
        this.debugCanvas.style.left = 0;
        this.debugCanvas.style.top = 0;
        this.debugCanvas.style.zIndex = 999;
        document.body.appendChild(this.debugCanvas);
        this.debugCanvas.width = mainw;
        this.debugCanvas.height = mainh;
        this.context = this.debugCanvas.getContext('2d');
    }

    close()
    {
        document.body.removeChild(this.debugCanvas);
        return true;
    }

    onmousedown(e)
    {
        if(this.isRendered && e.shiftKey)
        {
            logMouseCoordinates();
        }
    }

    render()
    {
        var context = this.context;
        context.save();
        context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        // context.imageSmoothingEnabled = false;
        context.globalAlpha = hitboxDebugSettings.boxOutlineAlpha;
        context.lineWidth = hitboxDebugSettings.boxOutlineWidth;
        var layers = Object.values(activeLayers);
        if(hitboxDebugSettings.onlyShowTopLayer && layers.length > 5)
        {
            if(layers[layers.length - 1].layerName != this.layerName)
            {
                layers = [layers[layers.length - 1]];
            }
            else
            {
                layers = [layers[layers.length - 2]];
            }
            var topLayerName = layers[0].layerName;
        }
        for(var i = 0; i < layers.length; ++i)
        {
            var scaleX = layers[i].layerName ? uiScaleX : 1;
            var scaleY = layers[i].layerName ? uiScaleY : 1;
            context.beginPath();
            context.strokeStyle = hitboxDebugSettings.boxColors[0];
            context.strokeRect(
                layers[i].boundingBox.x * scaleX,
                layers[i].boundingBox.y * scaleY,
                layers[i].boundingBox.width * scaleX,
                layers[i].boundingBox.height * scaleY
            );
            context.stroke();
            this.drawHitboxDebugForLayer(context, layers[i]);
        }
        if(hitboxDebugSettings.showLines)
        {
            context.lineCap = "round";
            context.setLineDash(hitboxDebugSettings.lineDash);
            context.globalAlpha = hitboxDebugSettings.lineAlpha;
            if(hitboxDebugSettings.lineOutlineWidth > 0)
            {
                context.beginPath();
                context.strokeStyle = hitboxDebugSettings.lineOutlineColor;
                context.lineWidth = hitboxDebugSettings.lineOutlineWidth;
                context.moveTo(0, Math.round(mouseY));
                context.lineTo(mainw, Math.round(mouseY));
                context.moveTo(Math.round(mouseX), 0);
                context.lineTo(Math.round(mouseX), mainh);
                context.stroke();
            }
            if(hitboxDebugSettings.lineWidth > 0)
            {
                context.beginPath();
                context.strokeStyle = hitboxDebugSettings.lineColor;
                context.lineWidth = hitboxDebugSettings.lineWidth;
                context.moveTo(0, Math.round(mouseY));
                context.lineTo(mainw, Math.round(mouseY));
                context.moveTo(Math.round(mouseX), 0);
                context.lineTo(Math.round(mouseX), mainh);
                context.stroke();
            }
            context.setLineDash([]);
            context.globalAlpha = 1;
        }
        var hitboxesForLabels = candidateHitboxes.concat(Array.from(Object.values(activeLayers)));
        if(hitboxDebugSettings.showLabels)
        {
            for(var i in hitboxesForLabels)
            {
                var layer = hitboxesForLabels[i];
                if(layer.layerName == "WorldLayer" ||
                    (
                        hitboxDebugSettings.onlyShowTopLayer &&
                        layers.length == 1 &&
                        layer.getRootLayer().layerName != topLayerName
                    )
                )
                {
                    continue;
                }
                var coords = layer.getGlobalCoordinates(0, 0);
                var labels = {top: "", left: ""};
                if(hitboxDebugSettings.labelMode == hitboxLabelMode.pixels)
                {
                    var localCoords = layer.getLocalCoordinates(mouseX, mouseY);
                    labels.top = Math.round(localCoords.x);
                    labels.left = Math.round(localCoords.y);
                }
                else if(hitboxDebugSettings.labelMode == hitboxLabelMode.percent)
                {
                    var localCoords = layer.getLocalCoordinates(mouseX, mouseY);
                    labels.top = (100 * localCoords.x / layer.boundingBox.width).toFixed(1) + "%";
                    labels.left = (100 * localCoords.y / layer.boundingBox.height).toFixed(1) + "%";
                }
                else if(hitboxDebugSettings.labelMode == hitboxLabelMode.id)
                {
                    if(layer.id)
                    {
                        var id = layer.id;
                    }
                    else
                    {
                        var id = "";
                    }
                    labels.top = id;
                }
                var fontSize = Math.max(12, Math.min(24, Math.floor(layer.boundingBox.height * uiScaleY / 3)));
                context.font = "bold " + fontSize + "px Courier New";
                context.strokeStyle = "#000000";
                context.lineWidth = 3;
                context.textBaseline = "top";
                var xBoxYCoord;
                if(hitboxDebugSettings.xLabelLocation == "top")
                {
                    xBoxYCoord = coords.y * uiScaleY;
                }
                else if(hitboxDebugSettings.xLabelLocation == "bottom")
                {
                    xBoxYCoord = coords.y * uiScaleY + layer.boundingBox.height * uiScaleY - fontSize;
                }
                var yBox = strokeTextShrinkToFit(
                    context,
                    labels.left,
                    coords.x * uiScaleX,
                    coords.y * uiScaleY + layer.boundingBox.height * uiScaleY / 2,
                    layer.boundingBox.width * uiScaleX / 3,
                    "left"
                );
                var xBox = strokeTextShrinkToFit(
                    context,
                    labels.top,
                    coords.x * uiScaleX + layer.boundingBox.width * uiScaleX / 3,
                    xBoxYCoord,
                    layer.boundingBox.width * uiScaleX / 3,
                    "center"
                );
                if(layer.layerName)
                {
                    // context.fillStyle = "#000000";
                    // context.fillRect(xBox.x1, xBox.y1, xBox.width, fontSize);
                    // context.fillRect(yBox.x1, yBox.y1, yBox.width, fontSize);
                }
                context.fillStyle = "#FFFFFF";
                fillTextShrinkToFit(
                    context,
                    labels.left,
                    coords.x * uiScaleX,
                    coords.y * uiScaleY + layer.boundingBox.height * uiScaleY / 2,
                    layer.boundingBox.width * uiScaleX / 3,
                    "left"
                );
                fillTextShrinkToFit(
                    context,
                    labels.top,
                    coords.x * uiScaleX + layer.boundingBox.width * uiScaleX / 3,
                    xBoxYCoord,
                    layer.boundingBox.width * uiScaleX / 3,
                    "center"
                );
            }
        }
        context.restore();
    }

    drawHitboxDebugForLayer(context, layer, layerDepth = 0)
    {
        context.save();
        if(!layer.isVisible() && !layer.isEnabled()) return;
        context.strokeStyle = hitboxDebugSettings.boxColors[layerDepth % hitboxDebugSettings.boxColors.length];
        var coords = layer.getGlobalCoordinates(0, 0);
        context.strokeRect(
            coords.x * uiScaleX,
            coords.y * uiScaleY,
            layer.boundingBox.width * uiScaleX,
            layer.boundingBox.height * uiScaleY
        );
        context.stroke();
        if(layer.hitboxes)
        {
            for(var i = 0; i < layer.hitboxes.length; ++i)
            {
                var hitbox = layer.hitboxes[i];
                if(!hitbox.isVisible() && !hitbox.isEnabled()) continue;
                this.drawHitboxDebugForLayer(context, hitbox, layerDepth + 1);
            }
        }
        context.restore();
    }

    logMouseCoordinates()
    {
        var layers = Array.from(Object.values(activeLayers));
        console.log("LAYERS:");
        for(var i in layers)
        {
            var layer = layers[i]
            var pixelCoords = layer.getLocalCoordinates(mouseX, mouseY);
            pixelCoords.x = Math.round(pixelCoords.x);
            pixelCoords.y = Math.round(pixelCoords.y);
            percentCoords = {};
            percentCoords.x = (100 * pixelCoords.x / layer.boundingBox.width).toFixed(2) + "%";
            percentCoords.y = (100 * pixelCoords.y / layer.boundingBox.height).toFixed(2) + "%";
            console.log(layers[i].layerName + ": (" + pixelCoords.x + "px, " + pixelCoords.y + "px) | (" + percentCoords.x + ", " + percentCoords.y + ")")
        }
        if(candidateHitboxes.length > 0)
        {
            console.log("HITBOXES:");
            for(var i in candidateHitboxes)
            {
                var hitbox = candidateHitboxes[i]
                if(hitbox.id)
                {
                    var hitboxId = hitbox.id;
                }
                else
                {
                    var hitboxId = "No ID";
                }
                var pixelCoords = hitbox.getLocalCoordinates(mouseX, mouseY);
                pixelCoords.x = pixelCoords.x.toFixed(1);
                pixelCoords.y = pixelCoords.y.toFixed(1);
                var percentCoords = hitbox.getLocalCoordinates(mouseX, mouseY);
                percentCoords.x = (100 * percentCoords.x / hitbox.boundingBox.width).toFixed(1) + "%";
                percentCoords.y = (100 * percentCoords.y / hitbox.boundingBox.height).toFixed(1) + "%";
                console.log(hitboxId + ": (" + pixelCoords.x + "px, " + pixelCoords.y + "px) | (" + percentCoords.x + ", " + percentCoords.y + ")")
            }
        }
    }
}

function showHitboxDebug(labelMode = -1, onlyShowTopLayer = null)
{
    if(!activeLayers.HitboxDebug)
    {
        activeLayers.HitboxDebug = new HitboxDebug({x: 0, y: 0, width: mainw, height: mainh}, labelMode, onlyShowTopLayer);
        activeLayers.HitboxDebug.open();
    }
    else if(labelMode > 0 || onlyShowTopLayer !== null)
    {
        hitboxDebugSettings.labelMode = labelMode;
        hitboxDebugSettings.onlyShowTopLayer = onlyShowTopLayer;
    }
}

function hideHitboxDebug()
{
    if(activeLayers.HitboxDebug)
    {
        activeLayers.HitboxDebug.close();
        delete activeLayers.HitboxDebug;
    }
}

window.addEventListener('resize', function ()
{
    if(activeLayers.HitboxDebug)
    {
        hideHitboxDebug();
        showHitboxDebug();
    }
})