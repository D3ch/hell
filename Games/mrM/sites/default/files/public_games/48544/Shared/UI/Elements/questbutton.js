class QuestButton extends Hitbox
{
    quest;
    glowEffect;

    parentElement;
    parentContext;

    constructor(quest, boundingBox)
    {
        super(boundingBox, {}, "pointer");
        this.quest = quest;
        this.glowEffect = new EasyHintHighlight(
            () => this.quest.isCollectable() || this.quest.requiresInteraction()
        )
        this.glowEffect.highlightColor = "#F2C948";
        this.glowEffect.highlightBlur = 12;
        this.glowEffect.fillRelativeAlpha = 0.1;
        this.glowEffect.lineWidth = 6;
        this.glowEffect.sizeReduction = 6;
        this.glowEffect.minAlpha = 0.1;
        this.addHitbox(this.glowEffect);
    }

    onmousedown()
    {
        if(this.quest.isCollectable())
        {
            this.quest.collect();
        }
        else if(this.quest.additionalOnClick && this.quest.isVisible())
        {
            hideTooltip();
            this.quest.additionalOnClick()
        }
    }

    onmouseenter()
    {
        var globalCoordinates = this.getGlobalCoordinates(0, this.boundingBox.height);
        showUpdatingTooltip(
            this.quest.getFormattedTooltip.bind(this.quest),
            globalCoordinates.x * uiScaleX,
            globalCoordinates.y * uiScaleY,
            mainw * 0.2
        );
    }

    onmouseexit()
    {
        hideTooltip();
    }

    render()
    {
        this.glowEffect.highlightColor = this.quest.requiresInteraction() ? "#F248E4" : "#F2C948";
        this.parentContext.save();
        var coords = this.getRelativeCoordinates(0, 0, this.parent, false);
        var icon = this.quest.getIcon();
        if(typeof (icon) == "undefined") icon = questguy;
        this.parentContext.drawImage(icon, coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
        this.parentContext.restore();
        this.renderChildren();
    }

    onBecomeChild()
    {
        this.parent = this.getFirstElementWithContext();
        if(this.parent)
        {
            this.parentContext = this.parent.context;
        }
    }
}