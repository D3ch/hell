function setNewDialogue(text, image, speakerName, popupId, extraImage = null)
{
    if(!activeLayers.MainUILayer.activeDialogue.isActive ||
        activeLayers.MainUILayer.activeDialogue.dialoguePartyName != speakerName)
    {
        activeLayers.MainUILayer.addPopupDialogueAttachment(text, image, speakerName, popupId, extraImage);
        activeLayers.MainUILayer.render();
    }
}

function showMechanicDialogue()
{
    var textOptions = [
        _("Look at that drill she sure is a beaut'. I can help upgrade her if you give me the right resources.  Buy the blueprints and use the right amount of minerals to craft the pieces.")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, Mechanic, _("Mechanic"), "crafting", Mechanic_blink);
}

function showSellerDialogue()
{
    var textOptions = [
        _("Do you have max capacity yet? If so, come on in and I can sell your ores at the best prices.")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, Seller, _("Seller"), "SELL", Seller_blink);
}

function showHirerDialogue()
{
    var textOptions = [
        _("I can manage our team of diggers.  Hire more diggers and upgrade them with shiny new tools.  They'll need it!")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, Hirer, _("Manager"), "Hire", Hirer_blink);
}

function showTyrusDialogue()
{
    var textOptions = [
        _("Use equips to destroy monsters below 303km!!!"),
        _("Your fighting Max Health increases as you progress") + ". <br> " + _("Complete quests and dig deep to increase it") + ".",
        _("Find mo equips from chests and monsters!")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, Tyrus, _("Tyrus III"), "weaponcrafting", Tyrus_blink);
}

function showGolemDialogue()
{
    var textOptions = [
        _("Buy Something...")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, golem, _("Golem"), "crafting", golem_blink);
}

function showGidgetDialogue()
{
    var textOptions = [
        _("B-B-Buy something. P-Please I need m-money to get f-fixed.")
    ];
    var textToShow = textOptions[rand(0, textOptions.length - 1)];
    setNewDialogue(textToShow, gidget, _("Gidget"), "crafting", gidget_blink);
}