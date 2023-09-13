const DEFAULT_PIXEL_DISTANCE_TO_TREAT_AS_DRAGGING = 6;
var numDragDropSprites = 0;
var activeDraggingInstance;
var activeDroppableInstance;

/*
* Make sure to set:
* - .type of this display
* - whether this .isDraggable and .isDropRegion
* - .dropTypes accepted by this display if .isDropRegion is true
* Set new constants at the top for new types of displays
*/
class DragDropUIComponent extends Hitbox
{
    displayType;

    isDropRegion = false;
    dropTypesAccepted = [];

    isDraggable = false;
    mouseDistanceThresholdBeforeTreatedAsDragged = DEFAULT_PIXEL_DISTANCE_TO_TREAT_AS_DRAGGING;
    parentBeforeDrag;
    xPositionDisplayBeforeDrag;
    yPositionDisplayBeforeDrag;
    xPositionMouseBeforeDrag = -1;
    yPositionMouseBeforeDrag = -1;
    isDropCandidate = false;

    constructor(boundingBox)
    {
        numDragDropSprites++;

        super(boundingBox, {}, "pointer", "DD_" + numDragDropSprites);

        this.allowBubbling = true;
    }

    onmouseenter(e)
    {
        //If this display accepts a drop, something is dragging, and it accepts this type of drop
        if(this.isDropRegion && activeDraggingInstance != null && this != activeDraggingInstance && this.dropTypesAccepted.indexOf(activeDraggingInstance.displayType) > -1)
        {
            activeDroppableInstance = this;
            //e.stopImmediatePropagation();
            this.onSelectedAsDropCandidate(activeDraggingInstance);
        }
    }

    onmouseexit(e)
    {
        //If this display is the current drop candidate
        if(activeDraggingInstance != null && activeDroppableInstance == this)
        {
            activeDroppableInstance = null;
            this.onUnselectedAsDropCandidate();
        }
        else if(this.isDraggable && activeDraggingInstance == null && this.xPositionMouseBeforeDrag > -1)
        {
            this.beginDrag();
        }
    }

    onmousedown(e)
    {
        if(this.isDraggable && activeDraggingInstance == null)
        {
            this.xPositionMouseBeforeDrag = mouseX;
            this.yPositionMouseBeforeDrag = mouseY;

            this.onmousemove(e);
        }
    }

    onmouseup = function (e)
    {
        //A drag failed to execute as the total distance dragged was less then the
        //distance required to initiate a drag event
        if(this.isDraggable && activeDraggingInstance == null)
        {
            this.xPositionMouseBeforeDrag = -1;
            this.yPositionMouseBeforeDrag = -1;
        }
    }.bind(this);

    onmousemove(e)
    {
        if(this.isDraggable && activeDraggingInstance == null && this.xPositionMouseBeforeDrag > -1)
        {
            //Small optimization for draggables that have no distance before being treated as dragged
            var shouldBeginDrag = this.mouseDistanceThresholdBeforeTreatedAsDragged <= 0;
            if(!shouldBeginDrag)
            {
                var xDistanceMoved = Math.pow(this.xPositionMouseBeforeDrag - mouseX, 2);
                var yDistanceMoved = Math.pow(this.yPositionMouseBeforeDrag - mouseY, 2);
                var distanceMoved = Math.sqrt(xDistanceMoved + yDistanceMoved);
                shouldBeginDrag = distanceMoved >= this.mouseDistanceThresholdBeforeTreatedAsDragged;
            }

            if(shouldBeginDrag)
            {
                this.beginDrag();
            }
        }
    }

    beginDrag()
    {
        //Save prior state
        this.xPositionDisplayBeforeDrag = this.boundingBox.x;
        this.yPositionDisplayBeforeDrag = this.boundingBox.y;
        this.parentBeforeDrag = this.parent;
        this.parent.deleteHitboxWithId(this.id);
        this.parent.onChildRemoved();
        this.parent = activeLayers.Stage;
        activeLayers.Stage.addHitbox(this);

        activeDraggingInstance = this;
        document.addEventListener("mousemove", this.onStageMouseMove);
        document.addEventListener("mouseup", this.onStageMouseUp);
        activeLayers.Stage.showStage();

        this.boundingBox.x = mouseX - this.boundingBox.width / 2;
        this.boundingBox.y = mouseY - this.boundingBox.height / 2;

        this.onDragStarted();
    }

    //##################################################
    //################## STAGE EVENTS ##################
    //##################################################

    onStageMouseMove(e)
    {
        if(activeDraggingInstance)
        {
            activeDraggingInstance.boundingBox.x = mouseX - activeDraggingInstance.boundingBox.width / 2;
            activeDraggingInstance.boundingBox.y = mouseY - activeDraggingInstance.boundingBox.height / 2;
        }
    }

    onStageMouseUp(e)
    {
        document.removeEventListener("mousemove", activeDraggingInstance.onStageMouseMove);
        document.removeEventListener("mouseup", activeDraggingInstance.onStageMouseUp);
        activeLayers.Stage.hideStage();

        if(activeDroppableInstance != null)
        {
            //Add child it to the droppable region
            if(typeof parentBeforeDrag === 'DragDropUIComponent')
            {
                parentBeforeDrag.onDropRemoved(activeDraggingInstance);
            }
            activeDroppableInstance.onAcceptDrop(activeDraggingInstance);
            activeDroppableInstance.onUnselectedAsDropCandidate();
        }
        else
        {
            activeDraggingInstance.onDropFailed();
        }

        //Reset some state values
        activeDraggingInstance.onDragEnded();
        activeDraggingInstance.xPositionMouseBeforeDrag = -1;
        activeDraggingInstance.yPositionMouseBeforeDrag = -1;

        activeDraggingInstance = null;
        activeDroppableInstance = null;
    }

    onDropFailed()
    {
        //Drop failed move back to original location
        this.parent = this.parentBeforeDrag;
        this.parent.addHitbox(this);
        this.boundingBox.x = this.xPositionDisplayBeforeDrag;
        this.boundingBox.y = this.yPositionDisplayBeforeDrag;

        this.xPositionMouseBeforeDrag = -1;
        this.yPositionMouseBeforeDrag = -1;
    }

    /*
     * When a drop which was initially attached to this display
     * is removed and attached to the stage this will fire
     */
    onChildRemoved()
    {
        //override
    }

    //############################################################
    //################## HANDLE SUCCESSFUL DROP ##################
    //############################################################

    /*
     * Override this to manage placement of the display
     * It is up to the function overriding this to add this display to a parent
     */
    onAcceptDrop()
    {
        //override
        activeLayers.Stage.deleteHitboxWithId(activeDraggingInstance.id);
    }

    /*
     * When a drop which was initially attached to this display
     * is removed and dropped somewhere else this function fires
     * Override this to manage updating of models associated with
     * placement of the previously attached child display
     */
    onDropRemoved()
    {
        //override
    }

    //############################################################
    //################## HANDLE SUCCESSFUL DRAG ##################
    //############################################################		

    /*
     * When this sprite is selected as the new dragging sprite
     * this will fire, override this for type specific functionality
     */
    onDragStarted()
    {
        //override
    }

    /*
     * When this sprite is dropped
     * this will fire, override this for type specific functionality
     */
    onDragEnded()
    {
        //override
    }

    //#############################################################
    //################## HOOKS FOR HOVER VISUALS ##################
    //#############################################################

    onSelectedAsDropCandidate()
    {
        //override
        this.isDropCandidate = true;
    }

    onUnselectedAsDropCandidate()
    {
        //override
        this.isDropCandidate = false;
    }

    render()
    {
        //override
        super.render();
    }
}