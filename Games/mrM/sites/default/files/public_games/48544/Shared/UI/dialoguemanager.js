class DialogueManager
{
    isDirty = false;
    currentDialogueIndex = 0;
    dialogueId = null;
    speakers = {}; // {speakerKey: {name, image?, spritesheet?}, ...}
    dialogue = []; // [{speakerKey, text, entryKey?, clickToContinue?, onStart?, onEnd?, position?}, ...]
    onEndFunction = null;

    initialize(dialogueId, speakers, dialogue)
    {
        this.onEnd();
        this.dialogueId = dialogueId;
        this.speakers = speakers;
        this.dialogue = dialogue;
        this.currentDialogueIndex = 0;
        this.isDirty = true;
    }

    next(dialogueId = null)
    {
        this.goTo(this.currentDialogueIndex + 1, dialogueId)
    }

    previous(dialogueId = null)
    {
        this.goTo(this.currentDialogueIndex - 1, dialogueId)
    }

    goTo(index, dialogueId = null)
    {
        if(dialogueId != null && dialogueId != this.dialogueId)
        {
            // Ignore commands if they're trying to advance the wrong dialogue
            // We may want smarter handling if we consistently have multiple simulatneous dialogues
            console.warn("DialogueManager: Attempting to advance invalid dialogue")
            return;
        }
        this.isDirty = true;

        if(index < 0)
        {
            index = 0;
        }

        if(index >= this.dialogue.length)
        {
            this.finish();
            return;
        }

        if(this.getCurrentDialogue().onEnd)
        {
            this.getCurrentDialogue().onEnd();
        }

        this.currentDialogueIndex = index;

        if(this.getCurrentDialogue().onStart)
        {
            this.getCurrentDialogue().onStart();
        }
    }

    goToEntryWithKey(entryKey, dialogueId = null)
    {
        for(var i = 0; i < this.dialogue.length; ++i)
        {
            if(this.dialogue[i].entryKey == entryKey)
            {
                return this.goTo(i, dialogueId);
            }
        }
        throw "DialogueManager: Attempted to go to invalid dialogue entry";
    }

    finish()
    {
        if(this.dialogue[this.dialogue.length - 1].onEnd)
        {
            this.dialogue[this.dialogue.length - 1].onEnd();
        }
        this.currentDialogueIndex = 0;
        this.hide();
    }

    getCurrentDialogue()
    {
        return this.dialogue[this.currentDialogueIndex];
    }

    getCurrentSpeaker()
    {
        return this.speakers[this.dialogue[this.currentDialogueIndex].speaker];
    }

    compareDialogueId(dialogueId)
    {
        return dialogueId == this.dialogueId;
    }

    compareEntryKey(entryKey)
    {
        return this.dialogue[this.currentDialogueIndex].entryKey &&
            (Array.isArray(entryKey) && entryKey.includes(this.dialogue[this.currentDialogueIndex].entryKey)) ||
            this.dialogue[this.currentDialogueIndex].entryKey == entryKey;
    }

    show()
    {
        openUiWithoutClosing(DialogueWindow);
    }

    hide()
    {
        closeUiByName("DialogueWindow");
        this.onEnd();
    }

    setOnEndFunction(onEndFunction)
    {
        this.onEndFunction = onEndFunction;
    }

    onEnd()
    {
        if(this.onEndFunction)
        {
            this.onEndFunction();
            this.onEndFunction = null;
        }
    }

    initTestDialogue()
    {
        dialogueManager.initialize(
            "testDialogue",
            {
                testSpeaker: {
                    name: _("Test"),
                    spritesheet: new SpritesheetAnimation(
                        unicornDrilling,
                        7,
                        20
                    )
                }
            },
            [
                {
                    entryKey: "test1",
                    speaker: "testSpeaker",
                    text: "This is some test dialogue!",
                    clickToContinue: true
                },
                {
                    entryKey: "test1",
                    speaker: "testSpeaker",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    clickToContinue: true
                },
                {
                    entryKey: "test1",
                    speaker: "testSpeaker",
                    text: "Goodbye!",
                    clickToContinue: true
                },
            ]
        );
    }
}

var dialogueManager = new DialogueManager();