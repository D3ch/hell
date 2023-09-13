function drawEffects()
{
    if(isSimulating) return;
    TransientEffectsC.clearRect(0, 0, transientEffectContainerW, transientEffectContainerH);

    // Draw and prune TextEffect objects
    for(var i = textEffects.length - 1; i >= 0; i--)
    {
        if(textEffects[i].isComplete())
        {
            textEffects.splice(i, 1);
        }
        else
        {
            textEffects[i].draw();
        }
    }

    // News
    renderFadingNews();

    if(!isTimelapseOn)
    {
        //renderMinerQuotes();
        renderMinerName();
    }
}

//###########################################################
//####################### TEXT EFFECTS ######################
//###########################################################

var textEffects = [];

class TextEffect
{
    constructor(text, font, color, startScreenX, startScreenY, durationMsec, isHorizontallyCentered, fadeFunction, movementFunction)
    {
        this.text = text;
        this.font = font;
        this.color = color;
        this.startScreenX = startScreenX;
        this.startScreenY = startScreenY;
        this.durationMsec = durationMsec;
        this.isHorizontallyCentered = isHorizontallyCentered;
        this.fadeFunction = fadeFunction;
        this.movementFunction = movementFunction;
        this.startTime = currentTime();
    }

    draw()
    {
        if(!this.isComplete())
        {
            saveCanvasState(TransientEffectsC);

            var rgbColors = hexToRgb(this.color);
            var alpha = this.fadeFunction(this.percentComplete());

            TransientEffectsC.fillStyle = "rgba(" + rgbColors.r + ", " + rgbColors.g + ", " + rgbColors.b + ", " + alpha + ")";
            TransientEffectsC.font = this.font;

            var movementOffsets = this.movementFunction(this.percentComplete());
            var renderX = this.startScreenX + movementOffsets.x;
            var renderY = this.startScreenY + movementOffsets.y;
            if(this.isHorizontallyCentered)
            {
                renderX -= TransientEffectsC.measureText(this.text).width / 2;
            }

            TransientEffectsC.fillText(this.text, renderX, renderY);

            restoreCanvasState(TransientEffectsC);
        }
    }

    percentComplete()
    {
        return Math.min(1, (currentTime() - this.startTime) / this.durationMsec);
    }

    isComplete()
    {
        return this.percentComplete() == 1;
    }
}

function showFloatingText(text, font, color, screenX, screenY, durationMsec, isHorizontallyCentered, fadeFunction, movementFunction)
{
    var newEffect = new TextEffect(text, font, color, screenX, screenY, durationMsec, isHorizontallyCentered, fadeFunction, movementFunction);
    textEffects.push(newEffect);
}

function noFade(percentComplete)
{
    return 1;
}

function noMovement(percentComplete)
{
    return {"x": 0, "y": 0}
}

function getFunctionYMovementOnly(functionToApply, maxPixelMovement)
{
    return function (percentComplete)
    {
        return {"x": 0, "y": functionToApply(percentComplete) * maxPixelMovement};
    }
}

function getFunctionXMovementOnly(functionToApply, maxPixelMovement)
{
    return function (percentComplete)
    {
        return {"x": functionToApply(percentComplete) * maxPixelMovement, "y": 0};
    }
}

function easeInOutBack(percentComplete)
{
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    var result = percentComplete < 0.5
        ? (Math.pow(2 * percentComplete, 2) * ((c2 + 1) * 2 * percentComplete - c2)) / 2
        : (Math.pow(2 * percentComplete - 2, 2) * ((c2 + 1) * (percentComplete * 2 - 2) + c2) + 2) / 2;

    result = (result + .1) / 1.2;

    return result;
}

function easeInOutSine(percentComplete)
{
    return -(Math.cos(Math.PI * percentComplete) - 1) / 2;
}

function sin(percentComplete)
{
    return Math.sin(Math.PI * percentComplete);
}

function sinSquared(percentComplete)
{
    return Math.pow(sin(percentComplete), 2);
}

function rootSin(percentComplete)
{
    return Math.pow(sin(percentComplete), 0.5);
}

function easeInCubic(percentComplete)
{
    return Math.pow(percentComplete, 3);
}

function easeInPowerFunction(power)
{
    return function (percentComplete)
    {
        return Math.pow(percentComplete, power);
    }
}


// ##################################################
// ###################### NEWS ######################
// ##################################################

function renderFadingNews()
{
    if(news.length > 0)
    {
        for(var i = 0; i < news.length; i++)
        {
            var newsDeltaTime = currentTime() - news[i][1];
            if(newsDeltaTime >= NEWS_FADE_OUT_DURATION_MSECS)
            {
                news.splice(i, 1);
            }
            else
            {
                var alpha = 1 - Math.pow((newsDeltaTime / NEWS_FADE_OUT_DURATION_MSECS), 10);

                TransientEffectsC.font = "20px KanitM";
                TransientEffectsC.fillStyle = "#FFFFFF";
                TransientEffectsC.strokeStyle = "#000000";
                TransientEffectsC.globalAlpha = alpha / 2;
                TransientEffectsC.lineWidth = 8;
                TransientEffectsC.strokeText(news[i][0], transientEffectContainerW * .5 - (TransientEffectsC.measureText(news[i][0]).width / 2), transientEffectContainerH * ((.025 * (i + 1)) + .11));
                TransientEffectsC.globalAlpha = alpha;
                TransientEffectsC.lineWidth = 5;
                TransientEffectsC.strokeText(news[i][0], transientEffectContainerW * .5 - (TransientEffectsC.measureText(news[i][0]).width / 2), transientEffectContainerH * ((.025 * (i + 1)) + .11));
                TransientEffectsC.fillText(news[i][0], transientEffectContainerW * .5 - (TransientEffectsC.measureText(news[i][0]).width / 2), transientEffectContainerH * ((.025 * (i + 1)) + .11));

                if(news[i][2])
                {
                    TransientEffectsC.drawImage(flair, getAnimationFrameIndex(3) * 200, 0, 200, 200, transientEffectContainerW * .42, transientEffectContainerH * .105, transientEffectContainerW * .16, transientEffectContainerH * .16);
                    TransientEffectsC.drawImage(worldResources[news[i][2]].largeIcon, 0, 0, worldResources[news[i][2]].largeIcon.width, worldResources[news[i][2]].largeIcon.height, transientEffectContainerW * .46, transientEffectContainerH * .15, transientEffectContainerW * .08, transientEffectContainerH * .08);
                }
            }
        }
        TransientEffectsC.globalAlpha = 1.0;
    }
}

// ##########################################################
// ###################### MINER FLAVOR ######################
// ##########################################################


// ########################### QUOTES ###########################

var activeMinerTexts = [];
var speechBubbleBoundingBoxCache = {};
var bubblePadding = 3;
function renderSpeechBubble(context, text, x, y)
{
    var boundingBox;
    if(speechBubbleBoundingBoxCache.hasOwnProperty(text))
    {
        boundingBox = speechBubbleBoundingBoxCache[text];
    }
    else
    {
        context.save();
        context.textBaseline = "top";
        context.font = "11px Verdana";
        context.globalAlpha = 0;
        boundingBox = fillTextWrap(context, text, x, y, 200);
        context.restore();

        boundingBox.x1 -= x;
        boundingBox.x2 -= x;
        boundingBox.y1 -= y;
        boundingBox.y2 -= y;
        speechBubbleBoundingBoxCache[text] = boundingBox;
    }

    context.save();
    renderRoundedRectangle(context, boundingBox.x1 + x - bubblePadding, boundingBox.y1 + y - bubblePadding - (boundingBox.height + (bubblePadding * 2)), boundingBox.width + (bubblePadding * 2), boundingBox.height + (bubblePadding * 2), 5, "#000000", "#FFFFFF", 1);
    context.restore();

    context.save();
    context.textBaseline = "top";
    context.font = "11px Verdana";
    context.fillStyle = "#000000";
    fillTextWrap(context, text, x, y - (boundingBox.height + (bubblePadding * 2)), 200);
    context.drawImage(speechBubbleTail, 0, 0, speechBubbleTail.width, speechBubbleTail.height, boundingBox.x1 + x + 5, boundingBox.y1 + y - bubblePadding - 1, 8, 8);
    context.restore();
}

function renderMinerQuotes()
{
    for(var i = 0; i < activeMinerTexts.length; i++)
    {
        var quoteElapsedTime = currentTime() - activeMinerTexts[i].clickTime;
        if(quoteElapsedTime >= QUOTE_FADE_OUT_DURATION_MSECS)
        {
            activeMinerTexts.splice(i, 1);
            i--;
        }
        else
        {
            var alpha = 1 - Math.pow((quoteElapsedTime / QUOTE_FADE_OUT_DURATION_MSECS), 10);
            MAIN.globalAlpha = alpha;

            var yCoordinateOfLevelTop = mainh * .111 + ((4 - (currentlyViewedDepth - activeMinerTexts[i].workerDepth)) * .178 * mainh);

            var minerX = Math.ceil(mainw * (.085 + ((activeMinerTexts[i].workerNum - 1) * .072))) + (mainw * .02);
            var minerY = yCoordinateOfLevelTop + Math.floor(mainh * .075);
            if(minerY > mainh * .1)
            {
                renderSpeechBubble(MAIN, activeMinerTexts[i].text, minerX, minerY);
            }
            MAIN.globalAlpha = 1;
        }
    }
}

// ########################### NAMES ###########################

var activeMinerNames = [];
function renderMinerName()
{
    return;
    for(var i = 0; i < 10; i++)
    {
        for(var j = 0; j < 5; j++)
        {
            var yCoordinateOfLevelTop = mainh * .111 + ((4 - j) * .178 * mainh) / uiScaleY;
            var minerStartX = Math.ceil(mainw * (.085 + (i * .072))) / uiScaleX;
            var minerStartY = yCoordinateOfLevelTop + (Math.floor(mainh * .075) / uiScaleY);
            var minerWidth = Math.ceil(mainw * .025) / uiScaleX;
            var minerHeight = Math.floor(mainh * .071) / uiScaleY;
            var bounds = {"x": minerStartX, "y": minerStartY, "width": minerWidth, "height": minerHeight};
            var currentlyHoveredDepth = currentlyViewedDepth - j;

            if(!isDepthWithoutWorkers(currentlyHoveredDepth) && !isBossLevel(currentlyHoveredDepth) && workersHiredAtDepth(currentlyHoveredDepth) > i)
            {
                var isPremium = getPremiumMinerName((currentlyViewedDepth - j), i);
                if(isMouseWithinBounds(bounds) || isPremium)
                {
                    var name = getMinerName((currentlyViewedDepth - j), i);

                    TransientEffectsC.save();
                    TransientEffectsC.font = "12px Arial";
                    if(isPremium)
                    {
                        if(isMouseWithinBounds(bounds))
                        {
                            TransientEffectsC.fillStyle = "#FFAAAA";
                        }
                        else
                        {
                            TransientEffectsC.fillStyle = "#FF7777";
                        }
                    }
                    else
                    {
                        TransientEffectsC.fillStyle = "#FFFFFF";
                    }
                    TransientEffectsC.strokeStyle = "#000000";
                    TransientEffectsC.lineWidth = 4;
                    TransientEffectsC.strokeText(name, minerStartX + (minerWidth / 2) - TransientEffectsC.measureText(name).width / 2, minerStartY + minerHeight + 1);
                    TransientEffectsC.fillText(name, minerStartX + (minerWidth / 2) - TransientEffectsC.measureText(name).width / 2, minerStartY + minerHeight + 1);
                    TransientEffectsC.restore();
                }
            }
        }
    }
}