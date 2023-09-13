const TOUCH_MOVE_MAX_DIST = 20;
var touchMoveDist = 0;

var activeLayers = {};

var currentTargetHitbox = {};
var candidateHitboxes = [];
var enteredHitboxes = [];
var hitboxMouseUpFunction;
// On mobile, if onmouseup isn't defined, the onmousedown function is called on mouse up
var isMouseUpFunctionReal = false;

var isMouseDown = false;
var isDragging = false;
var prevMouseX, prevMouseY;
var mouseX, mouseY;
var relativePrevMouseX, relativePrevMouseY;
var relativeMouseX, relativeMouseY;
var mouseDeltaBuffer = [];
var mouseDeltaBufferLength = 10;
var mouseDeltaBufferIndex = 0;

// DP: Attach these to a separate div once all UI elements are moved to the new system 
bindMouseHandlers(window);
document.getElementById('SIMPLEINPUTFIELD').onmousedown = function (e) {e.stopPropagation();};
document.getElementById('SIMPLEINPUTFIELD').onmousemove = function (e)
{
    prevMouseX = mouseX; // Global vars
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(document.body.style.cursor)
    {
        document.body.style.cursor = "";
    }
    e.stopPropagation();
};

document.getElementById('LANGUAGESELECTIOND').onmousedown = function (e) {e.stopPropagation();};
document.getElementById('LANGUAGESELECTIOND').onmousemove = function (e)
{
    prevMouseX = mouseX; // Global vars
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(document.body.style.cursor)
    {
        document.body.style.cursor = "";
    }
    e.stopPropagation();
};

function bindMouseHandlers(targetElement)
{
    if(!isMobile() || typeof (cordova) === "undefined")
    {
        targetElement.addEventListener('mousemove', mouseMoveHandler);
        targetElement.addEventListener('mousedown', mouseDownHandler);
        targetElement.addEventListener('mouseup', mouseUpHandler);
    }
    else
    {
        targetElement.addEventListener('touchmove', mouseMoveHandler);
        targetElement.addEventListener('touchstart', mouseDownHandler);
        targetElement.addEventListener('touchend', mouseUpHandler);
    }
    targetElement.addEventListener('wheel', mouseWheelHandler, {passive: false});
}

function mouseMoveHandler(event)
{
    mouseMoved = true;
    if((typeof(platform.treatClicksAsTouches) !== undefined && !platform.treatClicksAsTouches) || isMouseDown)
    {
        prevMouseX = mouseX; // Global vars
        prevMouseY = mouseY;
        if(event.touches)
        {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }
        else
        {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        writeToMouseDeltaBuffer(prevMouseX - mouseX, prevMouseY - mouseY);

        if(!isMobile() || !isDragging || !currentTargetHitbox)
        {
            updateCurrentTargetHitbox(event);
        }
        else
        {
            var hitbox = currentTargetHitbox.hitbox;
            if(hitbox.onmousemove)
            {
                hitbox.onmousemove(event);
            }
            else
            {
                while(hitbox.parent)
                {
                    if(hitbox.parent.onmousemove)
                    {
                        hitbox.parent.onmousemove(event);
                        break;
                    }
                    hitbox = hitbox.parent;
                }
            }
        }
        if(platform.treatClicksAsTouches || event.touches)
        {
            touchMoveDist += Math.sqrt(Math.pow((mouseX - prevMouseX), 2) + Math.pow((mouseY - prevMouseY), 2));
            if(!isMouseUpFunctionReal && touchMoveDist > TOUCH_MOVE_MAX_DIST)
            {
                hitboxMouseUpFunction = null;
            }
            if(activeLayers.WorldLayer &&
                (!currentTargetHitbox || (currentTargetHitbox.hitbox.getRootLayer().layerName == "WorldLayer" && !currentTargetHitbox.hitbox.onmousemove)))
            {
                // Special handling for scrolling through depths
                activeLayers.WorldLayer.onmousemove();
            }
        }
        isDragging = true;
    }
}

function writeToMouseDeltaBuffer(deltaX, deltaY)
{
    mouseDeltaBuffer[mouseDeltaBufferIndex] = {x: deltaX, y: deltaY};
    mouseDeltaBufferIndex++;
    if(mouseDeltaBufferIndex >= mouseDeltaBufferLength || mouseDeltaBufferIndex < 0)
    {
        mouseDeltaBufferIndex = 0;
    }
}

function mouseDownHandler(event)
{
    isMouseDown = true;
    if(event.touches)
    {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        // Touches on mobile will cause mouseX/Y to "teleport", so we need to call
        // The move handler before we process the mousedown event
        mouseMoveHandler(event);
    }
    else if(platform.treatClicksAsTouches)
    {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = event.clientX;
        mouseY = event.clientY;
        mouseMoveHandler(event);
    }
    if(hitboxMouseUpFunction)
    {
        console.log("mouseup1");
        // If we somehow clicked without triggering the previously stored mouseup function, call it and unset it
        hitboxMouseUpFunction(event);
        hitboxMouseUpFunction = null;
    }
    var hitbox = getTargetHitboxWithProperty('onmousedown');
    if(hitbox)
    {
        if(!hitbox.onmouseup && (event.touches || platform.treatClicksAsTouches))
        {
            hitboxMouseUpFunction = hitbox.onmousedown.bind(hitbox);
            isMouseUpFunctionReal = false;
        }
        else
        {
            hitbox.onmousedown(event);
            if(hitbox.onmouseup)
            {
                // Store a function to be called when the mouse button is released
                hitboxMouseUpFunction = hitbox.onmouseup;
                isMouseUpFunctionReal = true;
            }
        }
    }
    updateCurrentTargetHitbox();
}

function mouseUpHandler(event)
{
    isMouseDown = false;
    isDragging = false;
    touchMoveDist = 0;
    if(hitboxMouseUpFunction)
    {
        hitboxMouseUpFunction(event);
        hitboxMouseUpFunction = null;
    }
    else if((platform.treatClicksAsTouches || event.touches) &&
        activeLayers.WorldLayer &&
        (!currentTargetHitbox || (currentTargetHitbox.hitbox.getRootLayer().layerName == "WorldLayer" && !currentTargetHitbox.hitbox.onmousemove)))
    {
        activeLayers.WorldLayer.onmouseup();
    }
    mouseDeltaBuffer = [];
    mouseDeltaBufferIndex = 0;
}

function mouseWheelHandler(event)
{
    event.preventDefault();
    var hitbox = getTargetHitboxWithProperty("onwheel", true);
    if(hitbox)
    {
        hitbox.onwheel(event);
        updateCurrentTargetHitbox();
        return;
    }
    // Call default scroll function otherwise
    wheel(event);
}

function mouseEnterExitHandler(event)
{
    var tempEnteredHitboxes = getTopHitboxesWithProperty("onmouseenter");
    var newlyEnteredHitboxes = tempEnteredHitboxes.filter(x => !enteredHitboxes.includes(x));
    var newlyExitedHitboxes = enteredHitboxes.filter(x => !tempEnteredHitboxes.includes(x));
    for(var i in newlyExitedHitboxes)
    {
        if(newlyExitedHitboxes[i].onmouseexit)
        {
            newlyExitedHitboxes[i].onmouseexit(event);
        }
    }
    for(var i in newlyEnteredHitboxes)
    {
        newlyEnteredHitboxes[i].onmouseenter(event);
    }
    enteredHitboxes = tempEnteredHitboxes;
}

function isMouseWithinBounds(bounds, offsets = null)
{
    var xOffset = 0;
    var yOffset = 0;
    if(offsets)
    {
        xOffset = offsets.x;
        yOffset = offsets.y;
    }
    return (
        mouseX / uiScaleX >= (bounds.x + xOffset) &&
        mouseX / uiScaleX <= (bounds.x + bounds.width + xOffset) &&
        mouseY / uiScaleY >= (bounds.y + yOffset) &&
        mouseY / uiScaleY <= (bounds.y + bounds.height + yOffset)
    )
}

function updateCurrentTargetHitbox(event)
{
    // Search all layers for the matching hitbox with the highest priority
    var matchingHitbox;
    var matchingHitboxIndex;
    var layerNames = Object.keys(activeLayers);
    candidateHitboxes = [];
    for(var i = 0; i < layerNames.length; ++i)
    {
        var layer = activeLayers[layerNames[i]];
        if((layer.name && layer.name == "MainUILayer" || layer.name == "WorldLayer") || isMouseWithinBounds(layer.boundingBox))
        {
            if(!layer.isEnabled() && isMouseWithinBounds(layer.boundingBox))
            {
                if(document.body.style.cursor)
                {
                    document.body.style.cursor = '';
                }
                candidateHitboxes = [];
                continue;
            }
            relativePrevMouseX = prevMouseX - layer.boundingBox.x;
            relativePrevMouseY = prevMouseY - layer.boundingBox.y;
            relativeMouseX = mouseX - layer.boundingBox.x;
            relativeMouseY = mouseY - layer.boundingBox.y;
            var hitboxResults = layer.findMatchingHitboxes();
            candidateHitboxes = candidateHitboxes.concat(hitboxResults);
        }
    }
    if(candidateHitboxes.length > 0)
    {
        var matchingHitbox = candidateHitboxes[candidateHitboxes.length - 1];
        if(!currentTargetHitbox || matchingHitbox !== currentTargetHitbox.hitbox)
        {
            // Entered a new hitbox
            currentTargetHitbox = {
                layer: layer,
                layerName: layerNames[i],
                hitbox: matchingHitbox,
            }
        }
        if(matchingHitbox.onmousemove)
        {
            // Mouse moved within the same hitbox
            matchingHitbox.onmousemove(event);
        }
        // if (event && event.target.tagName != "CANVAS")
        // {
        //     document.body.style.cursor = '';
        //     return;
        // }
        // Whatever hitbox is triggered on mouse down is allowed to define the cursor
        var cursorDefiningHitbox = getTargetHitboxWithProperty("onmousedown") || getTargetHitboxWithProperty("cursor");
        if(cursorDefiningHitbox)
        {
            var cursor = cursorDefiningHitbox.cursor || "pointer";
            if(document.body.style.cursor != cursor)
            {
                document.body.style.cursor = cursor;
            }
        }
        else
        {
            document.body.style.cursor = '';
        }
    }
    else
    {
        if(document.body.style.cursor)
        {
            document.body.style.cursor = '';
        }
        currentTargetHitbox = null;
    }
    mouseEnterExitHandler();
}

function getTargetHitboxWithProperty(propertyName, forceBubbling = false)
{
    for(var i = candidateHitboxes.length - 1; i >= 0; --i)
    {
        if(candidateHitboxes[i][propertyName])
        {
            return candidateHitboxes[i];
        }
        if(!forceBubbling && !candidateHitboxes[i].allowBubbling)
        {
            return null;
        }
    }
    return null;
}

function getTopHitboxesWithProperty(propertyName, forceBubbling)
{
    var result = [];
    for(var i = candidateHitboxes.length - 1; i >= 0; --i)
    {
        if(candidateHitboxes[i][propertyName])
        {
            result.push(candidateHitboxes[i]);
        }
        if(!forceBubbling && !candidateHitboxes[i].allowBubbling)
        {
            return result;
        }
    }
    return result;
}

function dragDistance()
{
    return Math.sqrt(Math.pow(prevMouseX - mouseX, 2) + Math.pow(prevMouseY - mouseY, 2));
}

function mobilePcEventOverride()
{
    buildTarget = STEAM_BUILD;
    bindMouseHandlers(window);
}