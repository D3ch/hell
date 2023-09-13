class WebPlatform extends Platform
{
    pendingOrder;
    domain;

    constructor()
    {
        super();
        this.language = this.getSystemLanguage();

        if(languageOverride != "" && translations.hasOwnProperty(languageOverride))
        {
            this.language = languageOverride;
        }
    }

    initMusic()
    {
        this.music = new Audio(mainMusic);
        this.music.volume = 0;
        this.music.loop = true;
        return this.music;
    }

    toggleMusic()
    {
        this.music.volume = (mute == 0) ? musicFadeInVolume : 0;
    }

    playMusic()
    {
        this.music.play();
    }

    initPurchases()
    {
        return;
        playsaurusPayments.createPopup().then(function ()
        {
            playsaurusPayments.initializePaypal("ATTJm7-432QyQzMBX0HXcCb1r-xY_gEdK0mFV5gab9WiHeWIIFQJ6SAqFqUV3iL5u9EbWbdGCfkqvoL7");
            playsaurusPayments.initializeStripe("pk_live_51LXY6dCnj0k6kn1bSZh8iTuuwSCatikN7phnZliGCtUFNbYbt5fbd9kASEpkUrIRKJq3s3XpFP2FsJTw7pvxL8qm00gem4z1vJ");
            // playsaurusPayments.initializePaypalSandbox();
            // playsaurusPayments.initializeStripeSandbox();
            playsaurusPayments.registerProducts(this.buildProducts());
            playsaurusPayments.setPurchaseSuccessCallback(
                function (product)
                {
                    console.log("Purchased " + product.name)
                    this.completePurchase(product.packNum);
                }.bind(this)
            )
        }.bind(this));
    }

    buildProducts()
    {
        var packs = [];
        var ticketImages = [v5Tix10, v5Tix55, v5Tix120, v5Tix250, v5Tix650, v5Tix1400]
        for(var i = 0; i < purchasePacks.length; ++i)
        {
            if(Object.values(purchasePacks[i]).length == 0)
            {
                packs.push({
                    packNum: i,
                    sku: "",
                    name: "",
                    image: "",
                    price: 0,
                    description: ""
                });
            }
            else
            {
                packs.push({
                    packNum: i,
                    sku: purchasePacks[i].ag_sku,
                    name: purchasePacks[i].description,
                    image: ticketImages[i - 1].src,
                    price: purchasePacks[i].priceCents,
                    description: ""
                });
            }
        }
        return packs;
    }

    buyPack(packNum)
    {
        if(this.domain == "armorgames")
        {
            window.parent.postMessage({
                type: "purchase",
                sku: purchasePacks[packNum].ag_sku
            }, "https://19230.cache.armorgames.com");
        }
        else if(playsaurusPayments)
        {
            playsaurusPayments.startPurchase(packNum)
        }
    }

    completePurchase(packNum)
    {
        console.log(packNum);
        alert("Transaction complete. Thank you for your purchase!");
        var ticketsToAdd = purchasePacks[packNum].tickets;
        trackEvent_PurchasedTickets(ticketsToAdd, purchasePacks[packNum].priceCents);
        tickets += ticketsToAdd;
        console.log("Added " + ticketsToAdd + " tickets");
        centsSpent += purchasePacks[packNum].priceCents;

        var ticketPackId = "mrmine_" + ticketsToAdd + "tickets";
        logRevenue(purchasePacks[packNum].priceCents, ticketPackId);

        var centPrice = (purchasePacks[packNum].priceCents / 100);

        // ajax(
        //     "backend/logtransaction.php",
        //     {
        //         paymentAmount: purchasePacks[packNum].priceCents / 100,
        //         ticketsPurchased: ticketsToAdd,
        //         uid: platform.getUserId()
        //     },
        //     "POST",
        //     () => handleNameSubmission()
        // );
        if(fbq)
        {
            fbq('track', 'Purchase', {currency: "USD", value: (purchasePacks[packNum].priceCents / 100)});
        }

        if(typeof gtag != "undefined" && gtag != null)
        {
            gtag('event', 'purchase', {
                "transaction_id": rand(0, 10000000000),
                "value": centPrice,
                "currency": "USD",
                "shipping": 0,
                "items": [
                    {
                        "id": 'tickets_' + tickets,
                        "name": 'tickets_' + tickets,
                        "quantity": 1,
                        "price": centPrice
                    }
                ]
            });
        }

        platform.pendingOrder = null;
    }

    setQuestData()
    {
        questManager.getQuest(20).name = _("JOIN THE COMMUNITY");
        questManager.getQuest(20).description = _("Join the Mr.Mine discord for news, promo codes, and more!");
        questManager.getQuest(20).additionalOnClick = function () {openDiscord(); checkReview();};

        window["a20"] = window["a20v2"];
        window["a20g"] = window["a20gv2"];

        //questManager.getQuest(1).additionalOnClick = function () {showSimpleInput(_("Send this message to a friend to share the game with them!"), _("Copy Message"), generateShareText(), () => {copyShareText(); shareMouseDown();}, _("Cancel"));};
    }

    getUserId()
    {
        if(typeof (localStorage["uid"]) === "undefined")
        {
            localStorage["uid"] = rand(100, Number.MAX_SAFE_INTEGER);
        }
        return localStorage["uid"];
    }

    getSystemLanguage()
    {
        return getLanguageFromCode(window.navigator.userLanguage || window.navigator.language);
    }

    openSurvey()
    {
        if(depth > 20 && !hasTakenSurvey && !localStorage["isSurveyPending"] && !localStorage["hasTakenSurvey"] && document.getElementById("surveyDiv") == null)
        {
            var surveyDiv = document.createElement('div');
            surveyDiv.id = "surveyDiv";
            surveyDiv.style.cssText = 'position:absolute;left:20%;top:10%;width:60%;height:80%;z-index:100;background:#000;border: 1px solid black;';
            surveyDiv.innerHTML = '<iframe src="./Shared/survey.html?UID=' + UID + '&version=' + version + '&depth=' + depth + '" frameBorder="0" style="width: 100%; height: 100%; boder:0;"></iframe>';

            var surveyExitButton = document.createElement("div");
            surveyExitButton.id = "surveyExitButton";
            surveyExitButton.style.position = "absolute";
            surveyExitButton.style.top = "0px";
            surveyExitButton.style.right = "0px";
            surveyExitButton.style.width = "25px";
            surveyExitButton.style.height = "25px";
            surveyExitButton.style.zIndex = 4;
            surveyExitButton.style.background = "url('Shared/Assets/UI/closei.webp') no-repeat center";
            surveyExitButton.style.backgroundSize = "contain";
            surveyExitButton.style.color = "white";
            surveyExitButton.style.display = "block";
            surveyExitButton.style.padding = "0px";
            surveyExitButton.style.cursor = "pointer";
            surveyExitButton.onclick = function () {document.getElementById("surveyDiv").visibility = "hidden"; document.body.removeChild(document.getElementById("surveyDiv"));};
            surveyDiv.appendChild(surveyExitButton);

            document.body.appendChild(surveyDiv);
        }
    }
}

function getCurrentWindow()
{
    return window;
}

window.addEventListener("message", function (event)
{
    if(event.origin != "https://files.armorgames.com" && event.origin != "https://19230.cache.armorgames.com")
    {
        return;
    }
    switch(event.data.type)
    {
        case "purchase":
            var packNum = getPurchasePackIndexBySku(event.data.data.sku);
            platform.completePurchase(packNum);
            break;
        case "consumeOldPurchase":
            var packNum = getPurchasePackIndexBySku(event.data.data.sku);
            platform.completePurchase(packNum);
            break;
        case "loginStatus":
            platform.isLoginRequired = true;
            platform.isLoggedInToHost = event.data.value;
            break;
        default:
            break;
    }
});

var platform = new WebPlatform();
language = platform.language;

const SUBSCRIPTION_ENDPOINT = "https://mrmine.com/subscribe.php";
const CODE_REDEMPTION_ENDPOINT = "https://mrmine.com/redemption.php";

// var assetLoader = new AssetLoader();
// assetLoader.setEndpoint("https://playsaurus.com/MrMineCMG/desktop/");
// //assetLoader.setEndpoint("file:///D:/MrMineCMG/desktop/"); //steam is empty, web is the above
// loadAssets();

// window.addEventListener("load", function ()
// {
//     if(platform.domain != "armorgames")
//     {
//         platform.initPurchases();
//     }
// });