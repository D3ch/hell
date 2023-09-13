/*
Split test values are randomly pulled from the options array
Tests are run at game start after game loads
Change the latestTestNumber value in app.js to
Do not remove existing test values from runSplitTestSetup()
*/
var splitTestValue1Options = [0, 10, 11, 12];
var splitTestValue1 = splitTestValue1Options[rand(0, splitTestValue1Options.length - 1)];
//The below no longer runs
function runSplitTestSetup()
{
    //###### Split Test 1 ######
    switch(splitTestValue1)
    {
        case 0:
            //do nothing (base case)
            break;
        case 1:
            //change starting minerals (slightly with sudden ramp)
            levels[0] = [[1, 200]];
            levels[1] = [[1, 305]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 20]];
            levels[5] = [[1, 500], [2, 70]];
            levels[6] = [[1, 487], [2, 100]];
            levels[7] = [[1, 500], [2, 150]];
            levels[8] = [[1, 510], [2, 250], [3, 1]];
            levels[9] = [[1, 520], [2, 200], [3, 2]];
            levels[10] = [[1, 530], [2, 216], [3, 5]];
            levels[11] = [[1, 540], [2, 253], [3, 10]];
            levels[12] = [[1, 550], [2, 290], [3, 10], [4, 2]];
            levels[13] = [[1, 560], [2, 300], [3, 20], [4, 1]];
            levels[14] = [[1, 570], [2, 335], [3, 21], [4, 1]];
            levels[15] = [[1, 580], [2, 360], [3, 32]];
            levels[16] = [[1, 100], [2, 330], [3, 190]];
            levels[17] = [[2, 480], [3, 230], [4, 2]];
            levels[18] = [[2, 480], [3, 280], [4, 10]];
            levels[19] = [[2, 490], [3, 310], [4, 10]];
            break;
        case 2:
            //change starting minerals (more)
            levels[0] = [[1, 500]];
            levels[1] = [[1, 505]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 50]];
            levels[5] = [[1, 570], [2, 60]];
            levels[6] = [[1, 587], [2, 90]];
            levels[7] = [[1, 600], [2, 110]];
            levels[8] = [[1, 610], [2, 160], [3, 3]];
            levels[9] = [[1, 620], [2, 180], [3, 5]];
            levels[10] = [[1, 630], [2, 216], [3, 7]];
            levels[11] = [[1, 640], [2, 253], [3, 5]];
            levels[12] = [[1, 650], [2, 290], [3, 2], [4, 4]];
            levels[13] = [[1, 660], [2, 300], [3, 2], [4, 2]];
            levels[14] = [[1, 670], [2, 335], [3, 50], [4, 2]];
            levels[15] = [[1, 680], [2, 360], [3, 52]];
            levels[16] = [[1, 200], [2, 330], [3, 290]];
            levels[17] = [[2, 580], [3, 230], [4, 4]];
            levels[18] = [[2, 580], [3, 280], [4, 16]];
            levels[19] = [[2, 590], [3, 310], [4, 20]];
            break;
        case 3:
            //change starting hire cost
            getEarth().workerHireCosts[0] = 20n;
            getEarth().workerHireCosts[1] = 250n;
            break;
        case 4:
            //change starting hire cost
            getEarth().workerHireCosts[0] = 30n;
            getEarth().workerHireCosts[1] = 250n;
            break;
        case 5:
            //change level difficulty for early levels
            depthDifficultyTable[0] = 120n;
            depthDifficultyTable[1] = 120n;
            depthDifficultyTable[2] = 120n;
            depthDifficultyTable[3] = 130n;
            depthDifficultyTable[4] = 155n;
            depthDifficultyTable[5] = 190n;
            depthDifficultyTable[6] = 220n;
            depthDifficultyTable[7] = 283n;
            depthDifficultyTable[8] = 320n;
            depthDifficultyTable[9] = 386n;
            depthDifficultyTable[10] = 450n;
            depthDifficultyTable[11] = 503n;
            depthDifficultyTable[12] = 605n;
            depthDifficultyTable[13] = 755n;
            depthDifficultyTable[14] = 1000n;
            depthDifficultyTable[15] = 1350n;
            depthDifficultyTable[16] = 1850n;
            depthDifficultyTable[17] = 2000n;
            depthDifficultyTable[18] = 3000n;
            depthDifficultyTable[19] = 4000n;
            break;
        case 6:
            //change level difficulty for early levels
            depthDifficultyTable[0] = 140n;
            depthDifficultyTable[1] = 140n;
            depthDifficultyTable[2] = 140n;
            depthDifficultyTable[3] = 140n;
            depthDifficultyTable[4] = 140n;
            depthDifficultyTable[5] = 140n;
            depthDifficultyTable[6] = 200n;
            depthDifficultyTable[7] = 250n;
            depthDifficultyTable[8] = 300n;
            depthDifficultyTable[9] = 400n;
            depthDifficultyTable[10] = 500n;
            break;
        case 7:
            //no hint arrows
            showHintArrows = false;
            break;

        case 8:
            //Combine tests 3 & 5

            //## Test 3 ##
            getEarth().workerHireCosts[0] = 20n;
            getEarth().workerHireCosts[1] = 250n;

            //## Test 5 ##
            depthDifficultyTable[0] = 120n;
            depthDifficultyTable[1] = 120n;
            depthDifficultyTable[2] = 120n;
            depthDifficultyTable[3] = 130n;
            depthDifficultyTable[4] = 155n;
            depthDifficultyTable[5] = 190n;
            depthDifficultyTable[6] = 220n;
            depthDifficultyTable[7] = 283n;
            depthDifficultyTable[8] = 320n;
            depthDifficultyTable[9] = 386n;
            depthDifficultyTable[10] = 450n;
            depthDifficultyTable[11] = 503n;
            depthDifficultyTable[12] = 605n;
            depthDifficultyTable[13] = 755n;
            depthDifficultyTable[14] = 1000n;
            depthDifficultyTable[15] = 1350n;
            depthDifficultyTable[16] = 1850n;
            depthDifficultyTable[17] = 2000n;
            depthDifficultyTable[18] = 3000n;
            depthDifficultyTable[19] = 4000n;
            break;

        case 9:
            //Combine tests 2, 3, 5

            //## Test 2 ##
            levels[0] = [[1, 500]];
            levels[1] = [[1, 505]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 50]];
            levels[5] = [[1, 570], [2, 60]];
            levels[6] = [[1, 587], [2, 90]];
            levels[7] = [[1, 600], [2, 110]];
            levels[8] = [[1, 610], [2, 160], [3, 3]];
            levels[9] = [[1, 620], [2, 180], [3, 5]];
            levels[10] = [[1, 630], [2, 216], [3, 7]];
            levels[11] = [[1, 640], [2, 253], [3, 5]];
            levels[12] = [[1, 650], [2, 290], [3, 2], [4, 4]];
            levels[13] = [[1, 660], [2, 300], [3, 2], [4, 2]];
            levels[14] = [[1, 670], [2, 335], [3, 50], [4, 2]];
            levels[15] = [[1, 680], [2, 360], [3, 52]];
            levels[16] = [[1, 200], [2, 330], [3, 290]];
            levels[17] = [[2, 580], [3, 230], [4, 4]];
            levels[18] = [[2, 580], [3, 280], [4, 16]];
            levels[19] = [[2, 590], [3, 310], [4, 20]];

            //## Test 5 ##
            depthDifficultyTable[0] = 120n;
            depthDifficultyTable[1] = 120n;
            depthDifficultyTable[2] = 120n;
            depthDifficultyTable[3] = 130n;
            depthDifficultyTable[4] = 155n;
            depthDifficultyTable[5] = 190n;
            depthDifficultyTable[6] = 220n;
            depthDifficultyTable[7] = 283n;
            depthDifficultyTable[8] = 320n;
            depthDifficultyTable[9] = 386n;
            depthDifficultyTable[10] = 450n;
            depthDifficultyTable[11] = 503n;
            depthDifficultyTable[12] = 605n;
            depthDifficultyTable[13] = 755n;
            depthDifficultyTable[14] = 1000n;
            depthDifficultyTable[15] = 1350n;
            depthDifficultyTable[16] = 1850n;
            depthDifficultyTable[17] = 2000n;
            depthDifficultyTable[18] = 3000n;
            depthDifficultyTable[19] = 4000n;

            //## Test 3 ##
            getEarth().workerHireCosts[0] = 20n;
            getEarth().workerHireCosts[1] = 250n;
            break;

        case 10:
            //do nothing (base case A/A)
            break;

        case 11:
            drillBlueprints[12].ingredients[1] = {item: new MineralCraftingItem(COAL_INDEX), quantity: 5000};
            break;

        case 12:
            mainMusic = "Shared/Audio/music.mp3";
            headerFont = "KanitM";
            break;
    }
}

var pushUpdateText1 = "Your mine needs attention!";
var shopVariantId = 0;
var purchaseWindowTabOrder = 0;
var showShopButtonOnBottom = false;
var showGarageSparkles = true;
var unlockScientistsEarly = false;

function initializeTests()
{
    return;
    if(UID == "" || UID == 0)
    {
        console.error("NO UID!");
    }
    console.log(UID);
    console.log(statsigUser);
    console.log(statsig.instance.getCurrentUser().custom);

    //###################### This will be PC and Mobile ######################

    var userExperienceSeedTest = statsig.getExperiment("ux_roller_seed");
    var userExperienceSeedValueFromTest = userExperienceSeedTest.get("value", rand(1, 9999));
    console.log(userExperienceSeedValueFromTest);
    userExperienceRoller.srand(userExperienceSeedValueFromTest);

    var chestRewardSeedTest = statsig.getExperiment("chest_reward_roller_seed");
    var chestRewardSeedValueFromTest = chestRewardSeedTest.get("value", rand(1, 9999));
    console.log(chestRewardSeedValueFromTest);
    basicChestRewardRoller.srand(chestRewardSeedValueFromTest);

    /*
    Seed results:
    2 - gertrude
    3 - rose
    4 - autumn
    5 - jess
    6 - bruce
    7 - walter
    11 - Hank
    */
    var firstBlackChestSeedPool = [2, 3, 4, 5, 6, 7, 11];
    var randomOfflineSeed = firstBlackChestSeedPool[rand(0, firstBlackChestSeedPool.length - 1)];
    var blackChestRewardSeedTest = statsig.getExperiment("black_chest_reward_roller_seed");
    var blackChestRewardSeedValueFromTest = blackChestRewardSeedTest.get("value", randomOfflineSeed);
    console.log(blackChestRewardSeedValueFromTest);
    blackChestRewardRoller.srand(blackChestRewardSeedValueFromTest);

    var tradeSeedTest = statsig.getExperiment("trade_roller_seed");
    var tradeSeedValueFromTest = tradeSeedTest.get("value", rand(1, 9999));
    console.log(tradeSeedValueFromTest);
    tradeRoller.srand(tradeSeedValueFromTest);

    var shopVariantIdTest = statsig.getExperiment("shop_variants_2");
    var shopVariantIdResult = shopVariantIdTest.get("Value", 4);
    console.log(shopVariantIdResult);
    shopVariantId = shopVariantIdResult;
    if(shopVariantId == 2 || shopVariantId == 3 || shopVariantId == 5) //tickets are gold, replace references
    {
        ticketicon = ticketIconGold;
        smallShopTicket = smallShopTicketGold;
        chest1 = chest1gold;
        chest2 = chest2gold;
        chest3 = chest3gold;
    }

    var shopTabOrderTest = statsig.getExperiment("shop_tab_order");
    var shopTabOrderResult = shopTabOrderTest.get("Value", 0);
    //0 -> "BUY" FIRST
    //1 -> "USE" FIRST
    console.log(shopTabOrderResult);
    purchaseWindowTabOrder = shopTabOrderResult;

    var populateCavesOnGameStart = statsig.getExperiment("caves_on_game_start");
    var populateCavesOnGameStartResult = populateCavesOnGameStart.get("Value", 0);
    console.log(populateCavesOnGameStartResult);
    cavesSpawnDuringOfflineProgress = populateCavesOnGameStartResult;

    var earlyGameScientistsUnlock = statsig.getExperiment("early_game_scientists");
    var earlyGameScientistsUnlockResult = earlyGameScientistsUnlock.get("Value", 0);
    console.log(earlyGameScientistsUnlockResult);
    unlockScientistsEarly = earlyGameScientistsUnlockResult == 1;

    //#########################################################################


    //#########################################################################


    //######################### This will be Mobile Only ######################



    //########################## FINISHED TESTS ################################

    //re-initialize the push updates
    if(platform.setupPushUpdates)
    {
        platform.setupPushUpdates();
    }
    spawnRateMultiplier = 1;
    timeBetweenTradesTestMultiplier = 0.9;
}


/*
Test ideas:

Multivariate:
- Test old music track and music off by default
- Test diff font for header
- Test arrow on new game button if no saves exist (check new game setup completion rates)

Other tests:
- Remove the first hire, make them start with a miner by default
- Introduce scientists and chests significantly earlier
- Test having all quests visible from the start

More involved tests:
- The drill level up upgrading
- Progress bars for quests and other stuff
- Test no language selection on first game startup
- Different first and second trades
- Test auto creating a game when player first starts the game up
  - Or a different screen with just a new game and import button
- Test hints provided by Mr.Mine in speech bubbles
*/