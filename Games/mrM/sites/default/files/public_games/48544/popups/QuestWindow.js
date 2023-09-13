class QuestWindow extends TabbedPopupWindow
{
    layerName = "Quests"; // Used as key in activeLayers
    domElementId = "QUESTSD"; // ID of dom element that gets shown or hidden
    context = QUESTS;         // Canvas rendering context for popup

    headerHeightFraction = 0.2;
    questScrollbox;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }
        this.setFrameImagesByWorldIndex(0);
        this.initializeTabs([]);
        this.initializeHitboxes();
    }

    render()
    {
        this.clearCanvas();
        this.questScrollbox.clearCanvas();
        this.questScrollbox.renderChildren();
        this.renderChildren();
        this.renderHeader();
    }

    initializeHitboxes()
    {
        this.questScrollbox = new Scrollbox(
            this.bodyContainer.boundingBox.width - 30,
            this.bodyContainer.boundingBox.height * 3,
            this.context,
            this.bodyContainer.boundingBox.x + 15,
            this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * this.headerHeightFraction,
            this.bodyContainer.boundingBox.width - 15,
            this.bodyContainer.boundingBox.height * (1 - this.headerHeightFraction),
            15
        );
        this.questScrollbox.isUsingOptimizedRerender = true;
        this.addHitbox(this.questScrollbox);

        var slotSize = Math.min(60, this.questScrollbox.contentWidth / 2);
        var padding = 3;
        var slotsPerRow = Math.floor((this.questScrollbox.boundingBox.width - padding * 2 - 15) / slotSize);
        var totalRows = Math.ceil(questManager.quests.length / slotsPerRow);
        var slotSpacing;
        if(slotsPerRow > 1)
        {
            slotSpacing = ((this.questScrollbox.boundingBox.width - padding * 2 - 15) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        }
        else
        {
            slotSpacing = 0;
        }

        var questsAdded = -1; 
        for(var i in questManager.quests)
        {
            if(questManager.getQuest(i))
            {
                questsAdded++;
                var indexInRow = questsAdded % slotsPerRow;
                var slotX = padding + indexInRow * (slotSize + slotSpacing);
                var slotY = Math.floor(padding + Math.floor(questsAdded / slotsPerRow) * (slotSize + slotSpacing));
                var questButton = new QuestButton(
                    questManager.quests[i],
                    {
                        x: slotX,
                        y: slotY,
                        width: slotSize,
                        height: slotSize
                    }
                );
                this.questScrollbox.addHitbox(questButton);
            }
        }
        this.questScrollbox.setContentHeightToIncludeLastChild(7);
        this.questScrollbox.scrollTo(0);
    }

    renderHeader()
    {
        this.context.save();
        var fontSize = Math.round(0.3 * this.bodyContainer.boundingBox.height * this.headerHeightFraction);
        this.context.font = fontSize + "px KanitM";
        this.context.textBaseline = "top";
        this.context.fillStyle = "#FFFFFF";
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 4;

        this.context.drawImage(darkdot, 0, 0, 1, 1, this.bodyContainer.boundingBox.x, this.bodyContainer.boundingBox.y, this.bodyContainer.boundingBox.width, this.bodyContainer.boundingBox.height * this.headerHeightFraction - graySeparator.height / 2);

        strokeTextWrap(
            this.context,
            _("QUESTS"),
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y + fontSize / 2.5,
            this.bodyContainer.boundingBox.width,
            "center"
        );
        fillTextWrap(
            this.context,
            _("QUESTS"),
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y + fontSize / 2.5,
            this.bodyContainer.boundingBox.width,
            "center"
        );
        var completedQuestCount = questManager.getCompletedQuestCount();
        var progressBarWidthFraction = 0.8;
        var progressBarHeight = 0.30 * this.bodyContainer.boundingBox.height * this.headerHeightFraction;
        renderFancyProgressBar(
            this.context,
            completedQuestCount + " / " + questManager.quests.length,
            completedQuestCount / questManager.quests.length,
            this.bodyContainer.boundingBox.x + this.bodyContainer.boundingBox.width * (1 - progressBarWidthFraction) / 2,
            this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * this.headerHeightFraction - progressBarHeight - 12,
            this.bodyContainer.boundingBox.width * progressBarWidthFraction,
            progressBarHeight,
            "#76E374",
            "#000000",
            "#FFFFFF",
            timerFrame
        );

        var separator = graySeparator;
        this.context.drawImage(
            separator,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * this.headerHeightFraction - separator.height / 2,
            this.bodyContainer.boundingBox.width,
            separator.height
        );
        this.context.restore();
    }

    generateDummyQuests(number)
    {
        this.quests = [];
        for(var i = 0; i < number; ++i)
        {
            var quest = new Quest();
            quest.id = i;
            quest.icon = questguy;
            quest.name = "QUEST " + i;
            quest.description = "Quest description";
            quest.isVisible = i < number * 0.65;
            if(quest.isVisible && Math.random() < 0.25)
            {
                quest.markComplete();
            }
            this.quests.push(quest);
        }
    }
}