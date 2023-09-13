const FONT_SIZE_REGEX = new RegExp('^([0-9]+)px');

function getCanvasTextHeightCenterOffset(canvas, text)
{
    var textMeasurement = canvas.measureText(text);
    return (textMeasurement.actualBoundingBoxAscent - textMeasurement.actualBoundingBoxDescent) / 2;
}

function renderButton(canvas, buttonImage, buttonText, buttonX, buttonY, buttonW, buttonH, textFont, textFillColor)
{
    canvas.save();
    canvas.drawImage(buttonImage, 0, 0, buttonImage.width, buttonImage.height, buttonX, buttonY, buttonW, buttonH);
    canvas.fillStyle = textFillColor;
    canvas.font = textFont;
    canvas.textBaseline = "middle";
    fillTextShrinkToFit(canvas, buttonText, buttonX + Math.round(buttonW * .1), buttonY + buttonH / 2, Math.round(buttonW * .8), "center", 0.15);
    canvas.restore();
}

function renderButtonScaled(canvas, buttonImage, buttonText, buttonX, buttonY, buttonW, buttonH, textFont, textFillColor)
{
    var previousFont = canvas.font;
    var previousFill = canvas.fillStyle;
    canvas.drawImage(buttonImage, 0, 0, buttonImage.width, buttonImage.height, buttonX, buttonY, buttonW, buttonH);
    canvas.fillStyle = textFillColor;
    setFontToFit(canvas, buttonText, buttonW, buttonH, textFont);

    canvas.fillText(
        buttonText,
        buttonX + (buttonW / 2) - (canvas.measureText(buttonText).width / 2),
        buttonY + (buttonH / 2) + getCanvasTextHeightCenterOffset(canvas, buttonText)
    );
    canvas.font = previousFont;
    canvas.fillStyle = previousFill;
}

function setFontToFit(canvas, text, width, height, font)
{
    let fittingFont = font;
    let fontMatcher = font.match(FONT_SIZE_REGEX);

    if(fontMatcher)
    {
        let paddedWidth = width * 0.9;
        let paddedHeight = height * 0.95;
        let fontSize = parseInt(fontMatcher[1]);
        let metrics = canvas.measureText(text);
        let textHeight = metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent;

        if(metrics.width > paddedWidth || textHeight > paddedHeight)
        {
            widthFontSize = Math.floor(fontSize * Math.min(1.0, paddedWidth / metrics.width));
            heightFontSize = Math.floor(fontSize * Math.min(1.0, paddedHeight / textHeight));

            fittingFont = fittingFont.replace(FONT_SIZE_REGEX, Math.min(widthFontSize, heightFontSize) + 'px');
        }
    }

    canvas.font = fittingFont;
}

function renderCheckbox(canvas, boxX, boxY, boxW, boxH, boxFillColor, boxStrokeColor, isFilled)
{
    var previousFill = canvas.fillStyle;
    var previousStroke = canvas.strokeStyle;
    canvas.strokeStyle = boxStrokeColor;
    canvas.fillStyle = boxFillColor;
    canvas.fillRect(boxX, boxY, boxW, boxH);
    canvas.strokeRect(boxX, boxY, boxW, boxH);
    if(isFilled)
    {
        canvas.drawImage(checkmark2b, 0, 0, checkmark2b.width, checkmark2b.height, boxX, boxY, boxW, boxH);
    }
    canvas.fillStyle = previousFill;
    canvas.strokeStyle = previousStroke;
}

function relativeWidth(asset, madeForWidth = 1280) 
{
    return (asset.width / madeForWidth) * window.innerWidth;
}

function relativeHeight(asset, madeForHeight = 720) 
{
    return (asset.height / madeForHeight) * window.innerHeight;
}

function renderCheckboxWithText(canvas, text, textFont, textFillColor, boxX, boxY, boxW, boxH, boxFillColor, boxStrokeColor, isFilled)
{
    renderCheckbox(canvas, boxX, boxY, boxW, boxH, boxFillColor, boxStrokeColor, isFilled);

    var previousFont = canvas.font;
    var previousFill = canvas.fillStyle;
    canvas.fillStyle = textFillColor;
    canvas.font = textFont;
    canvas.fillText(text, boxX + (boxW) + (boxW * .1), boxY + (boxH / 2) + getCanvasTextHeightCenterOffset(canvas, text));
    canvas.font = previousFont;
    canvas.fillStyle = previousFill;
}

var keepCopy = [];
function modifyImageWithNewText(image, text, textFont, textFillColor, textYShift, textXCenter)
{
    var canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    ctx.font = textFont;
    ctx.fillStyle = textFillColor;
    ctx.fillText(text, textXCenter - (ctx.measureText(text).width / 2), canvas.height / 2 + textYShift);
    var canvasDataUrl = canvas.toDataURL();
    image.src = canvasDataUrl;
    keepCopy.push(canvasDataUrl);
}

function drawImageLoop(context, image, x, y, width, height, xOffsetFraction)
{
    // Draw 0% to (1 - offset)% of image at x + offset%
    context.drawImage(
        image,
        0,
        0,
        image.width * (1 - xOffsetFraction),
        image.height,
        x + width * xOffsetFraction,
        y,
        width * (1 - xOffsetFraction),
        height
    );
    // Draw (1 - offset)% to 100% of image at x
    context.drawImage(
        image,
        image.width * (1 - xOffsetFraction),
        0,
        image.width * xOffsetFraction,
        image.height,
        x,
        y,
        width * xOffsetFraction,
        height
    );
}

function drawVerticalImageLoop(context, image, x, y, width, height, yOffsetFraction)
{
    // Draw 0% to (1 - offset)% of image at x + offset%
    context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height * (1 - yOffsetFraction),
        x,
        y + height * yOffsetFraction,
        width,
        height * (1 - yOffsetFraction)
    );
    // Draw (1 - offset)% to 100% of image at x
    context.drawImage(
        image,
        0,
        image.height * (1 - yOffsetFraction),
        image.width,
        image.height * yOffsetFraction,
        x,
        y,
        width,
        height * yOffsetFraction
    );
}

function drawTiledImage(context, image, regionX, regionY, regionWidth, regionHeight, tileWidth, tileHeight)
{
    var tileX = regionX;
    var tileY = regionY;
    while(tileY < regionY + regionHeight)
    {
        var fractionalWidth = Math.max(1, 1 - Math.abs(tileX + tileWidth - regionWidth) / tileWidth);
        var fractionalHeight = Math.max(1, 1 - Math.abs(tileY + tileHeight - regionHeight) / tileHeight);
        context.drawImage(
            image,
            0,
            0,
            image.width * fractionalWidth,
            image.height * fractionalHeight,
            tileX,
            tileY,
            tileWidth * fractionalWidth,
            tileHeight * fractionalHeight
        );
        tileX += tileWidth;
        if(tileX >= regionX + regionWidth)
        {
            tileX = regionX;
            tileY += tileHeight;
        }
    }
}

function setupButtons()
{
    document.getElementById("fontLoader1").style.display = "none";
    document.getElementById("fontLoader1").style.visibility = "hidden";
    document.getElementById("fontLoader2").style.display = "none";
    document.getElementById("fontLoader2").style.visibility = "hidden";
    document.getElementById("fontLoader3").style.display = "none";
    document.getElementById("fontLoader3").style.visibility = "hidden";
    document.getElementById("fontLoader4").style.display = "none";
    document.getElementById("fontLoader4").style.visibility = "hidden";

    //paypalhtml = generateShopHtml();

    modifyImageWithNewText(document.getElementById("cng"), _("CREATE"), "14px Verdana", "#000000", 3, document.getElementById("cng").width / 2);
    modifyImageWithNewText(document.getElementById("cngc"), _("CANCEL"), "14px Verdana", "#000000", 3, document.getElementById("cngc").width / 2);
    /*document.getElementById("gameNameInstructions").innerHTML = _(document.getElementById("gameNameInstructions").innerHTML);
    if(language == "english")
    {
        document.getElementById("gameNameInstructions").innerHTML = "Game name should be one word (letters and numbers only)<br>(Do not use an existing game name)";
    }*/
    document.getElementById("gameNameText").innerHTML = _(document.getElementById("gameNameText").innerHTML);
}

function generateShopHtml()
{
    return;
    modifyImageWithNewText(document.getElementById("buyticketsbutton1"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    modifyImageWithNewText(document.getElementById("buyticketsbutton2"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    modifyImageWithNewText(document.getElementById("buyticketsbutton3"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    modifyImageWithNewText(document.getElementById("buyticketsbutton4"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    modifyImageWithNewText(document.getElementById("buyticketsbutton5"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    modifyImageWithNewText(document.getElementById("buyticketsbutton6"), _("BUY"), "14px Verdana", "#000000", 3, document.getElementById("buyticketsbutton1").width / 2);
    return document.getElementById('buyoptions').innerHTML;
}

function drawDashedLine(canvas, x1, y1, x2, y2, color, lineWidth = 1, dashLength = 1, gapLength = 1)
{
    canvas.save();
    var prevStrokeColor = canvas.strokeStyle;
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.setLineDash([dashLength, gapLength]);
    canvas.moveTo(x1, y1);
    canvas.lineTo(x2, y2);
    canvas.stroke();
    canvas.strokeStyle = prevStrokeColor;
    canvas.restore();
}

function renderProgressBar(canvas, progressBarText, bgImage, barImage, x, y, width, height, fontColor, fillPercent)
{
    canvas.save();
    canvas.lineWidth = 1;
    canvas.textBaseline = "middle";
    canvas.strokeStyle = fontColor;
    canvas.fillStyle = fontColor;
    canvas.drawImage(bgImage, 0, 0, 1, 1, x, y, width, height);
    canvas.drawImage(barImage, 0, 0, 1, 1, x, y, width * fillPercent, height);
    canvas.drawImage(barImage, 0, 0, 1, 1, x, y, width * fillPercent, height);
    canvas.strokeRect(x, y, width, height);
    canvas.fillText(
        progressBarText,
        (x + (width / 2)) - (canvas.measureText(progressBarText).width / 2),
        y + (height / 2)
    );
    canvas.restore();
}

var gr = 0.4;
function renderFancyProgressBar(context, progressBarText, fillPercent, x, y, width, height, fillColor, emptyColor, fontColor, frameImage, drawGradient = true, frameImageInfo = null)
{
    var frameWidth, frameRightShadowWidth, frameBottomShadowHeight;
    if(frameImageInfo)
    {
        frameWidth = frameImageInfo.frameWidth;
        frameRightShadowWidth = frameImageInfo.frameRightShadowWidth;
        frameBottomShadowHeight = frameImageInfo.frameBottomShadowHeight;
    }
    else
    {
        frameWidth = 4;
        frameRightShadowWidth = 0;
        frameBottomShadowHeight = 0;
    }
    fillPercent = Math.max(0, Math.min(1, fillPercent));
    context.save();
    // context.imageSmoothingEnabled = false;
    context.font = "14px Verdana";
    context.textBaseline = "middle";
    context.fillStyle = emptyColor;
    context.fillRect(x + 1, y + 1, width - 2, height - 2);
    context.fillStyle = fillColor;
    context.fillRect(x + 1, y + 1, (width - 1) * fillPercent, height - 2);
    if(drawGradient)
    {
        var gradient = context.createLinearGradient(x + 1, y + 1 - height * gr, x + 1, y + 1 + height - 2 + height / 4);
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(0.4, fillColor);
        gradient.addColorStop(0.6, fillColor);
        gradient.addColorStop(1, "#000000");
        context.fillStyle = gradient;
        context.fillRect(x + 1, y + 1, (width - 1) * fillPercent, height - 2);
    }
    context.globalAlpha = 1;

    if(frameImage)
    {
        drawFrame(context, frameImage, x, y, width, height, frameWidth, frameWidth, frameRightShadowWidth, frameBottomShadowHeight)
    }
    context.fillStyle = fontColor;
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.textBaseline = "middle";
    strokeTextShrinkToFit(
        context,
        progressBarText,
        x + (width * .05),
        y + (height / 2) + 1,
        width * .9,
        "center"
    );
    fillTextShrinkToFit(
        context,
        progressBarText,
        x + (width * .05),
        y + (height / 2) + 1,
        width * .9,
        "center"
    );
    context.restore();
}

function generateFullMineScreenshot()
{
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = mainw - Math.ceil(mainw * .082);
    canvas.height = mainh - mainh * (.11);
    currentlyViewedDepth = 0;
    var html = "";
    while(currentlyViewedDepth < depth - 5)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(MAIN.canvas, Math.ceil(mainw * .082), Math.ceil(mainh * (.11)) + 1, mainw - Math.ceil(mainw * .082), mainh - (Math.ceil(mainh * (.11)) + 1), 0, 0, canvas.width, canvas.height);
        html += "<img src='" + canvas.toDataURL("image/png").replace("image/png", "image/octet-stream") + "'>";
        currentlyViewedDepth += 5;
        animate();
    }
    document.body.innerHTML = html;
}

var currentScroll = 0;
var totalHeight = 53000;
function smoothScroll()
{
    var scrollToAdd = Math.max(Math.min(totalHeight * .004, currentScroll * .025), 5);
    currentScroll += scrollToAdd;
    window.scroll({
        top: currentScroll,
        left: 0
    });
    if(currentScroll < totalHeight)
    {
        setTimeout(smoothScroll, 17);
    }
}

function drawImageRot(ctx, img, imgx, imgy, imgwidth, imgheight, x, y, width, height, deg, yPivotOffset = 0, xPivotOffset = 0)
{
    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate((xPivotOffset + x + width / 2), (y + height / 2));

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img, imgx, imgy, imgwidth, imgheight, xPivotOffset / 2 + (width / 2 * (-1)), yPivotOffset / 2 + (height / 2 * (-1)), width, height);

    //reset the canvas  
    ctx.rotate(rad * (-1));
    ctx.translate((xPivotOffset + x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawImageFitInBox(context, image, x, y, maxWidth, maxHeight, horizontalAlign = "center", verticalAlign = "center")
{
    var dim = fitBoxInBox(image.width, image.height, x, y, maxWidth, maxHeight, horizontalAlign, verticalAlign);
    context.drawImage(image, dim.x, dim.y, dim.width, dim.height);
    return dim;
}

//####################### FILTERS ########################
function greyScaleRect(canvas, decimalPercentGrey, screenX, screenY, screenWidth, screenHeight)
{
    colorSaturate(canvas, screenX, screenY, screenWidth, screenHeight, "#FFF", decimalPercentGrey);
}

function colorSaturate(canvas, screenX, screenY, screenWidth, screenHeight, color, decimalPercentSaturate)
{
    canvas.save();
    canvas.globalCompositeOperation = "saturation";
    canvas.fillStyle = "hsl(0," + Math.round(decimalPercentSaturate * 100) + "%,50%)"; // set a colour with saturation 0-100
    canvas.fillStyle = color;
    canvas.globalAlpha = decimalPercentSaturate;
    canvas.fillRect(screenX, screenY, screenWidth, screenHeight);
    canvas.restore();
}

function drawBlurredImage(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, blurAmountPixels)
{
    drawImageWithFilters(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, 'blur(' + blurAmountPixels + 'px)');
}

function drawInvertedImage(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight)
{
    drawImageWithFilters(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, 'invert(1)');
}

function drawHueRotatedImage(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, hueRotationDegrees)
{
    drawImageWithFilters(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, 'hue-rotate(' + hueRotationDegrees + 'deg)');
}

function drawContrastedImage(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, integerContrastPercent)
{
    drawImageWithFilters(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, 'contrast(' + integerContrastPercent + '%)');
}

function drawImageWithFilters(canvas, image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight, filters)
{
    canvas.save();
    canvas.filter = filters;
    canvas.drawImage(image, imageX, imageY, imageWidth, imageHeight, screenX, screenY, screenWidth, screenHeight);
    canvas.restore();
}

function drawWavy(canvas, img, canvasX, canvasY, canvasWidth, canvasHeight)
{
    var w = canvasWidth;
    var h = canvasHeight;
    var x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w;
    var imageWidthRatio = img.width / canvasWidth;
    var imageHeightRatio = img.height / canvasHeight;

    var vcanvas = document.createElement("canvas");
    var vctx = vcanvas.getContext("2d");
    vctx.filter = 'invert(1) contrast(200%) hue-rotate(180deg) grayscale(33%)';
    vctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

    var stepSize = 6;
    for(var y = 0; y < h; y += stepSize)
    {
        // segment positions
        var lx1 = x1 + Osc(numFramesRendered, y * .2, .05) * 1.25;
        var lx2 = x2 + Osc(numFramesRendered, y * .2, .03) * 1.25;
        var lx3 = x3 + Osc(numFramesRendered, y * .2, .06) * 1.25;

        // segment widths
        var w0 = lx1;
        var w1 = lx2 - lx1;
        var w2 = lx3 - lx2;
        var w3 = x4 - lx3;

        // draw image lines ---- source ----   --- destination ---
        canvas.drawImage(vcanvas, x0 * imageWidthRatio, y * imageHeightRatio, x1 * imageWidthRatio, imageHeightRatio * stepSize, canvasX, canvasY + y, w0, stepSize);
        canvas.drawImage(vcanvas, x1 * imageWidthRatio, y * imageHeightRatio, (x2 - x1) * imageWidthRatio, imageHeightRatio * stepSize, canvasX + lx1 - 0.5, canvasY + y, w1, stepSize);
        canvas.drawImage(vcanvas, x2 * imageWidthRatio, y * imageHeightRatio, (x3 - x2) * imageWidthRatio, imageHeightRatio * stepSize, canvasX + lx2 - 1, canvasY + y, w2, stepSize);
        canvas.drawImage(vcanvas, x3 * imageWidthRatio, y * imageHeightRatio, (x4 - x3) * imageWidthRatio, imageHeightRatio * stepSize, canvasX + lx3 - 1.5, canvasY + y, w3, stepSize);
    }
    canvas.restore();
}

function Osc(frame, y, speed)
{
    var frame = frame * 3 * speed;
    return Math.sin(frame + y * speed * 10);
}

const CHANNELS = ['r', 'g', 'b'];
const CHANNELS_INCLUDING_ALPHA = ['r', 'g', 'b', 'a'];
var chromaShiftChannelData = {};
function drawChromaShift(canvas, id, image, canvasX, canvasY, canvasWidth, canvasHeight)
{
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.width = canvasWidth;
    c.height = canvasHeight;

    id = id + "_" + canvasWidth;

    if(!chromaShiftChannelData.hasOwnProperty(id))
    {
        chromaShiftChannelData[id] = {};

        ctx.filter = 'invert(1) contrast(200%) hue-rotate(180deg) grayscale(33%)';
        ctx.drawImage(image, 0, 0, c.width, c.height);
        var imgData = ctx.getImageData(0, 0, c.width, c.height);
        ctx.filter = '';

        // Create and cache RGB channel data 
        CHANNELS.forEach(idx =>
        {
            chromaShiftChannelData[id][idx] = ctx.createImageData(imgData.width, imgData.height);
            const cdata = chromaShiftChannelData[id][idx].data
            const idata = imgData.data
            for(let i = 0; i < idata.length; i += 4)
            {
                cdata[i] = (idx === 'r') ? idata[i] : 0
                cdata[i + 1] = (idx === 'g') ? idata[i + 1] : 0
                cdata[i + 2] = (idx === 'b') ? idata[i + 2] : 0
                cdata[i + 3] = idata[i + 3]
            }
        });
    }

    canvas.save();
    canvas.globalCompositeOperation = 'screen';
    canvas.globalAlpha = 1;

    var channelDrift = {
        r: {x: oscillate(numFramesRendered, 9) * -1.33, y: oscillate(numFramesRendered, 5) * 1},
        g: {x: oscillate(numFramesRendered, 3) * 0.5, y: oscillate(numFramesRendered, 2) * 0.25},
        b: {x: oscillate(numFramesRendered, 11) * 1, y: oscillate(numFramesRendered, 7) * -1.5}
    };

    CHANNELS.forEach(idx =>
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.putImageData(chromaShiftChannelData[id][idx], 0, 0);

        canvas.drawImage(c, 0, 0, c.width, c.height, canvasX + channelDrift[idx].x, canvasY + channelDrift[idx].y, canvasWidth, canvasHeight);
    })
    canvas.restore();
}

function drawBlessedEffect(canvas, image, canvasX, canvasY, canvasW, canvasH, relicName = "")
{
    if(quality == 1)
    {
        canvas.save();
        for(var i = 2; i < 36; i++)
        {
            var oscillationPeriod = 14;
            var oscillationNumber = Math.floor((getAnimationFrameIndex(3000, 10) + i) / (oscillationPeriod * 2));
            var largeNumber1 = Math.pow(i, oscillationNumber) % 101;
            var largeNumber2 = Math.pow(i, oscillationNumber) % 49;
            var xPosition = canvasX + canvasW * Math.abs(Math.cos(largeNumber1));
            var yPosition = canvasY + canvasH * Math.abs(Math.sin(largeNumber2));

            canvas.globalAlpha = 1 - oscillate((getAnimationFrameIndex(3000, 10) + i), oscillationPeriod);
            canvas.fillStyle = "#FFFFFF";
            canvas.fillRect(xPosition, yPosition, 1, 1);
        }
        canvas.restore();
    }

    canvas.save();
    if(relicName != "???")
    {
        canvas.shadowBlur = 15;
        var shadowAlpha = 0.75 + oscillate(numFramesRendered, 18) * .22;
        canvas.shadowColor = "rgba(255, 255, 64, " + shadowAlpha + ")";
    }
    canvas.filter = 'brightness(' + (180 + (oscillate(numFramesRendered, 40) * 60)) + '%) saturate(200%)';

    canvas.globalAlpha = 1;

    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.width = canvasW;
    c.height = canvasH;

    if(getAnimationFrameIndex(32, 10) < 4)
    {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(shineOverlay, (shineOverlay.width / 4) * getAnimationFrameIndex(4, 10), 0, Math.floor(shineOverlay.width / 4), shineOverlay.height, 0, 0, canvasW, canvasH);
        ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasW, canvasH);
    canvas.drawImage(c, 0, 0, canvasW, canvasH, canvasX, canvasY, canvasW, canvasH);

    canvas.restore();
}

var cachedTintedAssetData = {};
function drawTintedImage(canvas, id, image, canvasX, canvasY, canvasWidth, canvasHeight, redTintDecimal, greenTintDecimal, blueTintDecimal)
{
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.width = canvasWidth;
    c.height = canvasHeight;

    id = id + "_" + Math.floor(canvasWidth);

    if(!cachedTintedAssetData.hasOwnProperty(id))
    {
        cachedTintedAssetData[id] = {};

        ctx.drawImage(image, 0, 0, c.width, c.height);
        var imgData = ctx.getImageData(0, 0, c.width, c.height);

        // Create and cache RGB channel data 
        CHANNELS_INCLUDING_ALPHA.forEach(idx =>
        {
            cachedTintedAssetData[id][idx] = ctx.createImageData(imgData.width, imgData.height);
            const cdata = cachedTintedAssetData[id][idx].data;
            const idata = imgData.data;
            for(let i = 0; i < idata.length; i += 4)
            {
                cdata[i] = (idx === 'r') ? idata[i] : 0
                cdata[i + 1] = (idx === 'g') ? idata[i + 1] : 0
                cdata[i + 2] = (idx === 'b') ? idata[i + 2] : 0
                cdata[i + 3] = idata[i + 3] / 2;
            }
        });
    }

    canvas.save();
    canvas.globalAlpha = 1;
    //ctx.globalCompositeOperation = 'copy';
    //canvas.drawImage(cachedTintedAssetData[id][3], 0, 0);

    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //ctx.putImageData(cachedTintedAssetData[id]["a"], 0, 0);
    //canvas.drawImage(c, 0, 0, c.width, c.height, canvasX, canvasY, canvasWidth, canvasHeight);

    canvas.globalCompositeOperation = 'lighter';
    ctx.globalCompositeOperation = 'lighter';
    if(redTintDecimal > 0)
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = redTintDecimal;
        ctx.putImageData(cachedTintedAssetData[id]["r"], 0, 0);
        canvas.drawImage(c, 0, 0, c.width, c.height, canvasX, canvasY, canvasWidth, canvasHeight);
    }
    if(greenTintDecimal > 0)
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = greenTintDecimal;
        ctx.putImageData(cachedTintedAssetData[id]["g"], 0, 0);
        canvas.drawImage(c, 0, 0, c.width, c.height, canvasX, canvasY, canvasWidth, canvasHeight);
    }
    if(blueTintDecimal > 0)
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = blueTintDecimal;
        ctx.putImageData(cachedTintedAssetData[id]["b"], 0, 0);
        canvas.drawImage(c, 0, 0, c.width, c.height, canvasX, canvasY, canvasWidth, canvasHeight);
    }
    canvas.restore();
}

//###################### RELIC RENDERING ##########################
function standardRelicRenderFunction(canvas, relicId, canvasX, canvasY, canvasW, canvasH)
{
    canvas.save();
    if(excavationRewards[relicId].name != "???")
    {
        canvas.shadowBlur = 11;
        var shadowAlpha = 0.2 + oscillate(numFramesRendered, 8) * .22;
        canvas.shadowColor = "rgba(164, 252, 166, " + shadowAlpha + ")";
    }

    var image = excavationRewards[relicId].image;
    canvas.drawImage(image, 0, 0, image.width, image.height, canvasX, canvasY, canvasW, canvasH);
    canvas.restore();
}

function warpedRelicRenderFunction(canvas, relicId, canvasX, canvasY, canvasW, canvasH)
{
    var image = excavationRewards[relicId].image;
    drawChromaShift(canvas, "reward_" + relicId, image, canvasX, canvasY, canvasW, canvasH);
}

function divineRelicRenderFunction(canvas, relicId, canvasX, canvasY, canvasW, canvasH)
{
    var image = excavationRewards[relicId].image;
    drawBlessedEffect(canvas, image, canvasX, canvasY, canvasW, canvasH, excavationRewards[relicId].name);
}

//###################### CONTRIB NEEDS REVIEW WHEN DOING LARGE REFACTOR #########################
// Discord: @EpicKnarvik97
function renderChestSliderDots()
{
    //Show mineral deposits
    for(var i = 0; i < worldClickables.length; i++)
    {
        if(
            worldClickables[i].type == MINERAL_DEPOSIT_ID ||
            worldClickables[i].type == CAVE_SYSTEM_ID ||
            (worldClickables[i].type == ORANGE_FISH_ID && metalDetectorStructure.level > 4))
        {
            if(metalDetectorStructure.level > 4)
            {
                var timeUntilExpire = worldClickables[i].expireTime - currentTime();
                if(timeUntilExpire < 120)
                {
                    var flickerRate = Math.max(3, ((timeUntilExpire / 60) * 8));
                    MAIN.globalAlpha = 0.25 + (oscillate(numFramesRendered, flickerRate) * .75);
                }
            }
            if(worldClickables[i].type == MINERAL_DEPOSIT_ID) {MAIN.drawImage(clickableDot, 0, 0, 6, 10, Math.ceil(mainw * .0544), Math.ceil(mainh * (.317 + (.490 * (Math.min(worldClickables[i].depth + 2, depth) / depth)))) - (Math.ceil(mainh * .007)), Math.floor(mainw * .0048), Math.ceil(mainh * .007));}
            else if(worldClickables[i].type == CAVE_SYSTEM_ID) {MAIN.drawImage(caveClickableDot, 0, 0, 10, 10, Math.ceil(mainw * .0544), Math.ceil(mainh * (.317 + (.490 * (Math.min(worldClickables[i].depth + 2, depth) / depth)))) - (Math.ceil(mainh * .007)), Math.floor(mainw * .0048), Math.ceil(mainh * .007));}
            else if(worldClickables[i].type == ORANGE_FISH_ID) {MAIN.drawImage(orangeClickableDot, 0, 0, 6, 10, Math.ceil(mainw * .0544), Math.ceil(mainh * (.317 + (.490 * (Math.min(worldClickables[i].depth + 2, depth) / depth)))) - (Math.ceil(mainh * .007)), Math.floor(mainw * .0048), Math.ceil(mainh * .007));}
            if(metalDetectorStructure.level > 4)
            {
                MAIN.globalAlpha = 1;
            }
        }
    }

    //Draw chest dots
    if(metalDetectorStructure.level > 1)
    {
        for(var i = chestService.chests.length; i > 0; i--)
        {
            let chest = chestService.chests[i - 1];
            let chestDot = sliderc;
            if(metalDetectorStructure.level > 2)
            {
                if(chest.type == ChestType.gold)
                {
                    chestDot = sliderg;
                }
                else if(chest.type == ChestType.black)
                {
                    chestDot = sliderblack;
                }
            }

            if(metalDetectorStructure.level > 4 && chest.source == Chest.natural.name && chest.timeToLive <= 120)
            {
                var flickerRate = Math.max(3, ((chest.timeToLive / 60) * 8));

                MAIN.globalAlpha = 0.25 + (oscillate(numFramesRendered, flickerRate) * .75);
            }

            MAIN.drawImage(chestDot, 0, 0, 6, 10, Math.ceil(mainw * .0544), Math.ceil(mainh * (.3165 + (.490 * (Math.min(chest.depth, depth) / depth)))) - (Math.ceil(mainh * .007)), Math.floor(mainw * .0048), Math.ceil(mainh * .007));
            if(metalDetectorStructure.level > 4)
            {
                MAIN.globalAlpha = 1;
            }
        };
    }

    if(battleWaiting.length > 0)
    {
        var battleDepth = battleWaiting[1];
        MAIN.drawImage(battleDot, 0, 0, 6, 10, Math.ceil(mainw * .0544), Math.ceil(mainh * (.3165 + (.490 * (Math.min(battleDepth + 2, depth) / depth)))) - (Math.ceil(mainh * .007)), Math.floor(mainw * .0048), Math.ceil(mainh * .007));
    }
}

function drawTradeAsSymbols(context, tradeOffer, x, y, width, height)
{
    context.save();
    var iconWidth = 55;
    var iconHeight = iconWidth;
    var arrowLength = width * 0.14;
    var arrowHeight = width * 0.12;
    var padding = 5;
    var tradeStrings = generateTradeOfferStrings(tradeOffer);
    TRADINGPOST.globalCompositeOperation = "destination-over";
    context.fillStyle = "#FFFFFF";
    context.textBaseline = "top";
    context.font = "14px Verdana";
    var paymentLabel = fillTextWrap(
        context,
        _("YOU PAY:"),
        x + width / 4 - arrowLength / 4 - (width / 2 - arrowLength / 2 - 2 * padding) / 2,
        y + padding,
        width / 2 - arrowLength / 2 - 2 * padding,
        "center",
        0.25
    );
    var paymentIcon = drawTradeIcon(
        context,
        tradeOffer[TRADE_INDEX_PAYMENT_TYPE],
        tradeOffer[TRADE_INDEX_PAYMENT_SUBTYPE],
        x + width / 4 - arrowLength / 4 - iconWidth / 2,
        paymentLabel.y2 + padding,
        iconWidth,
        iconHeight
    );
    var paymentString = fillTextWrap(
        context,
        tradeStrings.paymentString,
        x + width / 4 - arrowLength / 4 - (width / 2 - arrowLength / 2 - 2 * padding) / 2,
        paymentLabel.y2 + iconHeight + 2 * padding,
        width / 2 - arrowLength / 2 - 2 * padding,
        "center",
        0.25
    );
    var rewardLabel = fillTextWrap(
        context,
        _("YOU RECEIVE:"),
        x + 3 * width / 4 + arrowLength / 4 - (width / 2 - arrowLength / 2 - 2 * padding) / 2,
        y + padding,
        width / 2 - arrowLength / 2 - 2 * padding,
        "center",
        0.25
    );
    var rewardIcon = drawTradeIcon(
        context,
        tradeOffer[TRADE_INDEX_REWARD_TYPE],
        tradeOffer[TRADE_INDEX_REWARD_SUBTYPE],
        x + 3 * width / 4 + arrowLength / 4 - iconWidth / 2,
        rewardLabel.y2 + padding,
        iconWidth,
        iconHeight
    );
    var rewardString = fillTextWrap(
        context,
        tradeStrings.rewardString,
        x + 3 * width / 4 + arrowLength / 4 - (width / 2 - arrowLength / 2 - 2 * padding) / 2,
        rewardLabel.y2 + iconHeight + 2 * padding,
        width / 2 - arrowLength / 2 - 2 * padding,
        "center",
        0.25
    );
    if(paymentString.y2 > height)
    {
        height = paymentString.y2 - y + padding;
    }
    if(rewardString.y2 > height)
    {
        height = rewardString.y2 - y + padding;
    }
    // Draw arrow
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x + width / 2 - arrowLength / 2, y + height / 2 + arrowHeight / 4);  // Top left of stem
    context.lineTo(x + width / 2 + arrowLength / 12, y + height / 2 + arrowHeight / 4); // Top right of stem
    context.lineTo(x + width / 2 + arrowLength / 12, y + height / 2 + arrowHeight / 2); // Top of point
    context.lineTo(x + width / 2 + arrowLength / 2, y + height / 2);                    // End of point
    context.lineTo(x + width / 2 + arrowLength / 12, y + height / 2 - arrowHeight / 2); // Bottom of point
    context.lineTo(x + width / 2 + arrowLength / 12, y + height / 2 - arrowHeight / 4); // Bottom right of stem
    context.lineTo(x + width / 2 - arrowLength / 2, y + height / 2 - arrowHeight / 4);  // Bottom left of stem
    context.closePath();
    // context.stroke();
    context.fill();
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "#555555";
    context.fillRect(x, y, width, height);
    context.restore();
    return {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height,
        width: width,
        height: height,
        children: {
            paymentIcon: paymentIcon,
            rewardIcon: rewardIcon
        }
    }
}

function drawTradeIcon(context, tradeType, tradeSubtype, x, y, width = 20, height = 20)
{
    switch(tradeType)
    {
        case TRADE_TYPE_ORE:
            drawImageFitInBox(context, worldResources[tradeSubtype].largeIcon, x, y, width, height);
            break;
        case TRADE_TYPE_MONEY:
            drawImageFitInBox(context, moneyicon, x, y, width, height);
            break;
        case TRADE_TYPE_BUFF:
            drawImageFitInBox(context, buffs.staticBuffs[tradeSubtype].image, x, y, width, height);
            break;
        case TRADE_TYPE_RELIC:
            drawImageFitInBox(context, excavationRewards[tradeSubtype].image, x, y, width, height);
            break;
        case TRADE_TYPE_BLUEPRINT:
            drawImageFitInBox(context, getDrillEquipByBlueprintId(tradeSubtype).icon, x, y, width, height);
            break;
        case TRADE_TYPE_CHEST:
            if(tradeSubtype)
            {
                drawImageFitInBox(context, goldchesticon, x, y, width, height);
            }
            else
            {
                drawImageFitInBox(context, basicchesticon, x, y, width, height);
            }
            break;
        default:
            return null;
    }
    // Return bounding box for consistency with other trading post UI functions
    return {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + width,
        width: width,
        height: height
    }
}

function drawCircle(canvas, centerX, centerY, radius, fillColor, strokeColor, strokeWidth)
{
    saveCanvasState(canvas);

    canvas.beginPath();
    canvas.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    canvas.fillStyle = fillColor;
    canvas.fill();
    canvas.lineWidth = strokeWidth;
    canvas.strokeStyle = strokeColor;
    canvas.stroke();

    restoreCanvasState(canvas);
}

function getImageFromMergedImages(cacheId,
    image1, image1CropBoundingBox, image1DrawBoundingBox,
    image2, image2CropBoundingBox, image2DrawBoundingBox,
    image3 = null, image3CropBoundingBox = null, image3DrawBoundingBox = null,
    image4 = null, image4CropBoundingBox = null, image4DrawBoundingBox = null,
    image5 = null, image5CropBoundingBox = null, image5DrawBoundingBox = null
)
{
    if(!assetCache.exists(cacheId))
    {
        let tempCanvas = document.createElement('canvas');
        let tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = Math.max(image1DrawBoundingBox.x + image1DrawBoundingBox.width, image2DrawBoundingBox.x + image2DrawBoundingBox.width);
        tempCanvas.height = Math.max(image1DrawBoundingBox.y + image1DrawBoundingBox.height, image2DrawBoundingBox.y + image2DrawBoundingBox.height);
        if(image3 != null)
        {
            tempCanvas.width = Math.max(tempCanvas.width, image3DrawBoundingBox.x + image3DrawBoundingBox.width);
            tempCanvas.height = Math.max(tempCanvas.height, image3DrawBoundingBox.y + image3DrawBoundingBox.height);
        }
        if(image4 != null)
        {
            tempCanvas.width = Math.max(tempCanvas.width, image4DrawBoundingBox.x + image4DrawBoundingBox.width);
            tempCanvas.height = Math.max(tempCanvas.height, image4DrawBoundingBox.y + image4DrawBoundingBox.height);
        }
        if(image5 != null)
        {
            tempCanvas.width = Math.max(tempCanvas.width, image5DrawBoundingBox.x + image5DrawBoundingBox.width);
            tempCanvas.height = Math.max(tempCanvas.height, image5DrawBoundingBox.y + image5DrawBoundingBox.height);
        }

        tempContext.drawImage(image1, image1CropBoundingBox.x, image1CropBoundingBox.y, image1CropBoundingBox.width, image1CropBoundingBox.height, image1DrawBoundingBox.x, image1DrawBoundingBox.y, image1DrawBoundingBox.width, image1DrawBoundingBox.height);
        tempContext.drawImage(image2, image2CropBoundingBox.x, image2CropBoundingBox.y, image2CropBoundingBox.width, image2CropBoundingBox.height, image2DrawBoundingBox.x, image2DrawBoundingBox.y, image2DrawBoundingBox.width, image2DrawBoundingBox.height);
        if(image3 != null)
        {
            tempContext.drawImage(image3, image3CropBoundingBox.x, image3CropBoundingBox.y, image3CropBoundingBox.width, image3CropBoundingBox.height, image3DrawBoundingBox.x, image3DrawBoundingBox.y, image3DrawBoundingBox.width, image3DrawBoundingBox.height);
        }
        if(image4 != null)
        {
            tempContext.drawImage(image4, image4CropBoundingBox.x, image4CropBoundingBox.y, image4CropBoundingBox.width, image4CropBoundingBox.height, image4DrawBoundingBox.x, image4DrawBoundingBox.y, image4DrawBoundingBox.width, image4DrawBoundingBox.height);
        }
        if(image5 != null)
        {
            tempContext.drawImage(image5, image5CropBoundingBox.x, image5CropBoundingBox.y, image5CropBoundingBox.width, image5CropBoundingBox.height, image5DrawBoundingBox.x, image5DrawBoundingBox.y, image5DrawBoundingBox.width, image5DrawBoundingBox.height);
        }

        assetCache.set(cacheId, tempCanvas);
    }
    return assetCache.get(cacheId);
}

function getSingleColoredPixelImage(hexColor, alpha = 1)
{
    var cacheId = "singlePixelColor_" + hexColor + alpha;
    if(!assetCache.exists(cacheId))
    {
        let tempCanvas = document.createElement('canvas');
        let tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        tempContext.fillStyle = hexColor;
        tempContext.globalAlpha = alpha;
        tempContext.fillRect(0, 0, 1, 1);

        assetCache.set(cacheId, tempCanvas);
    }
    return assetCache.get(cacheId);
}

function drawColoredRect(canvas, x, y, width, height, hexColor, alpha)
{
    canvas.save();

    canvas.fillStyle = hexColor;
    canvas.globalAlpha = alpha;
    canvas.fillRect(x, y, width, height);

    canvas.restore();
}

function drawRgbColoredRect(canvas, x, y, width, height, r, g, b, alpha)
{
    canvas.save();

    canvas.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    canvas.globalAlpha = alpha;
    canvas.fillRect(x, y, width, height);

    canvas.restore();
}

function rgbToHex(r, g, b)
{
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function drawTinyProgressBar(canvas, x, y, width, height, borderPixels, fillColor, borderColor, bgColor, decimalFillPercent)
{
    canvas.save();

    canvas.strokeStyle = borderColor;
    canvas.fillStyle = bgColor;
    canvas.lineWidth = borderPixels;

    canvas.fillRect(x, y, width, height);
    canvas.strokeRect(x, y, width, height);
    canvas.fillStyle = fillColor;
    var fillPixels = width * decimalFillPercent;
    canvas.fillRect(x, y, fillPixels, height);

    canvas.restore();
}

//AO: This will be need to be moved to a separate buff UI layer shortly
function renderBuff(canvas, x, y, width, height, index)
{
    if(buffs.numActiveBuffs() > index)
    {
        var buff = buffs.activeBuffs[index];
        var icon = buff.image;
        var percentComplete = buffs.getBuffPercentComplete(index);
        if(buff.startSource == "Chest")
        {
            drawImageFitInBox(canvas, smallgoldchesticon, x, Math.floor(y + height / 8), Math.round(width / 3), Math.round(height / 3));
        }
        canvas.drawImage(icon, x, y, width, height);
        var oldFill = canvas.fillStyle;
        canvas.fillStyle = "#FFFFFF";
        canvas.fillRect(x, y + height - 5, width, 3);
        canvas.fillStyle = "#000000";
        canvas.fillRect(x + 1, y + height - 4, (width - 2) * percentComplete, 1);
        canvas.fillStyle = oldFill;
    }
}

//####################### INTERACTIVE COMPONENTS #######################

function renderRoundedRectangle(canvas, x, y, width, height, radius, strokeStyle, fillStyle, lineWidth = 1)
{
    saveCanvasState(canvas);

    var right = x + width;
    var bottom = y + height;

    canvas.beginPath();
    canvas.strokeStyle = strokeStyle;
    canvas.fillStyle = fillStyle;
    canvas.lineWidth = lineWidth;
    canvas.moveTo(x + radius, y);
    canvas.lineTo(right - radius, y);
    canvas.quadraticCurveTo(right, y, right, y + radius);
    canvas.lineTo(right, y + height - radius);
    canvas.quadraticCurveTo(right, bottom, right - radius, bottom);
    canvas.lineTo(x + radius, bottom);
    canvas.quadraticCurveTo(x, bottom, x, bottom - radius);
    canvas.lineTo(x, y + radius);
    canvas.quadraticCurveTo(x, y, x + radius, y);
    canvas.fill();
    canvas.stroke();

    restoreCanvasState(canvas);
}

function generateIconWithCooldownOverlay(icon, width, height, remainingFraction)
{
    let tempCanvas = document.createElement('canvas');
    let tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempContext.drawImage(icon, 0, 0, tempCanvas.width, tempCanvas.height);
    tempContext.globalCompositeOperation = 'source-atop';
    tempContext.globalAlpha = 0.6;
    tempContext.fillStyle = "#000000";
    tempContext.moveTo(tempCanvas.width / 2, tempCanvas.height / 2);
    tempContext.arc(
        tempCanvas.width / 2,
        tempCanvas.height / 2,
        tempCanvas.width,
        3 * Math.PI / 2,
        3 * Math.PI / 2 - (2 * Math.PI * remainingFraction),
        true
    );
    tempContext.closePath();
    tempContext.fill();
    return tempCanvas;
}

function renderCheckmark(context, x, y, width, height)
{
    context.save();
    context.strokeStyle = "#00FF00";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, y + height / 2);
    context.lineTo(x + width / 2, y + height);
    context.lineTo(x + width, y);
    context.stroke();
    context.restore();
}

function renderXMark(context, x, y, width, height)
{
    context.save();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y + height);
    context.moveTo(x + width, y);
    context.lineTo(x, y + height);
    context.stroke();
    context.restore();
}

function drawFrame(context, frameImage, x, y, width, height, frameWidth, baseFrameWidth = 24, bottomShadowHeight = 11, rightShadowWidth = 8)
{
    var scale = frameWidth / baseFrameWidth;
    // top left
    context.drawImage(frameImage, 0, 0, baseFrameWidth, baseFrameWidth, x, y, frameWidth, frameWidth);
    // top
    context.drawImage(frameImage, baseFrameWidth, 0, frameImage.width - 2 * baseFrameWidth - rightShadowWidth, baseFrameWidth, x + frameWidth, y, width - 2 * frameWidth, frameWidth);
    // top right
    context.drawImage(frameImage, frameImage.width - baseFrameWidth - rightShadowWidth, 0, baseFrameWidth + rightShadowWidth, baseFrameWidth, x + width - frameWidth, y, frameWidth + rightShadowWidth * scale, frameWidth);
    // right
    context.drawImage(frameImage, frameImage.width - baseFrameWidth - rightShadowWidth, baseFrameWidth, baseFrameWidth + rightShadowWidth, frameImage.height - 2 * baseFrameWidth - bottomShadowHeight, x + width - frameWidth, y + frameWidth, frameWidth + rightShadowWidth * scale, height - 2 * frameWidth);
    // bottom right
    context.drawImage(frameImage, frameImage.width - baseFrameWidth - rightShadowWidth, frameImage.height - baseFrameWidth - bottomShadowHeight, baseFrameWidth + rightShadowWidth, baseFrameWidth + bottomShadowHeight, x + width - frameWidth, y + height - frameWidth, frameWidth + rightShadowWidth * scale, frameWidth + bottomShadowHeight * scale);
    // bottom
    context.drawImage(frameImage, baseFrameWidth, frameImage.height - baseFrameWidth - bottomShadowHeight, frameImage.width - 2 * baseFrameWidth - rightShadowWidth, baseFrameWidth + bottomShadowHeight, x + frameWidth, y + height - frameWidth, width - 2 * frameWidth, frameWidth + bottomShadowHeight * scale);
    // bottom left
    context.drawImage(frameImage, 0, frameImage.height - baseFrameWidth - bottomShadowHeight, baseFrameWidth, baseFrameWidth + bottomShadowHeight, x, y + height - frameWidth, frameWidth, frameWidth + bottomShadowHeight * scale);
    // left
    context.drawImage(frameImage, 0, baseFrameWidth, baseFrameWidth, frameImage.height - 2 * baseFrameWidth - bottomShadowHeight, x, y + frameWidth, frameWidth, height - 2 * frameWidth);
}

function drawNineSlice(context, image, x, y, width, height, sliceWidth, sliceHeight, scaleCorners = false)
{
    // Round parameters to prevent seams in rendered image
    x = Math.ceil(x);
    y = Math.ceil(y);
    width = Math.ceil(width);
    height = Math.ceil(height);

    var hScale = width / image.width;
    var vScale = height / image.height;

    // rendered slice sizes
    var rCornerScale = Math.min(hScale, vScale, (scaleCorners ? Number.MAX_SAFE_INTEGER : 1));
    var rCornerWidth = Math.ceil(rCornerScale * sliceWidth);
    var rCornerHeight = Math.ceil(rCornerScale * sliceHeight);

    // Rescale if the rendered slices are more than half the size of the rendered image to prevent overlap
    if(rCornerWidth > width * 0.5 || rCornerHeight > height * 0.5)
    {
        let newSize = Math.ceil(Math.min(width * 0.5, height * 0.5));
        rCornerWidth = newSize;
        rCornerHeight = newSize;
    }

    // slice sizes for loops
    var imageWidths = [sliceWidth, image.width - 2 * sliceWidth, sliceWidth];
    var imageHeights = [sliceHeight, image.height - 2 * sliceHeight, sliceHeight];

    var renderedWidths = [rCornerWidth, width - 2 * rCornerWidth, rCornerWidth];
    var renderedHeights = [rCornerHeight, height - 2 * rCornerHeight, rCornerHeight];

    var imageX = 0, imageY = 0;
    var renderedX = 0, renderedY = 0;
    for(let i = 0; i < 3; ++i)
    {
        imageX = 0;
        renderedX = 0;

        for(let j = 0; j < 3; ++j)
        {
            context.drawImage(
                image,
                imageX,
                imageY,
                imageWidths[j],
                imageHeights[i],
                renderedX + x,
                renderedY + y,
                renderedWidths[j],
                renderedHeights[i]
            );
            imageX += imageWidths[j]
            renderedX += renderedWidths[j]
        }

        imageY += imageHeights[i];
        renderedY += renderedHeights[i];
    }
}

function getAnimationFrameIndex(framesInAnimation, framerate = IDLE_FRAMERATE, phaseShift = 0)
{
    return Math.floor((phaseShift + numFramesRendered) * (framerate / IDLE_FRAMERATE)) % framesInAnimation;
}