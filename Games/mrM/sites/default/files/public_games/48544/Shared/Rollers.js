//PRNG Rollers

var chestSpawnRoller = new Random();
var chestSpawnRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var chestSpawnRollerSeed = chestSpawnRollerSeedCandidates[rand(0, chestSpawnRollerSeedCandidates.length - 1)];
chestSpawnRoller.srand(chestSpawnRollerSeed);

var basicChestRewardRoller = new Random();
var basicChestRewardRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var basicChestRewardRollerSeed = basicChestRewardRollerSeedCandidates[rand(0, basicChestRewardRollerSeedCandidates.length - 1)];
basicChestRewardRoller.srand(basicChestRewardRollerSeed);

var goldenChestRewardRoller = new Random();
var goldenChestRewardRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var goldenChestRewardRollerSeed = goldenChestRewardRollerSeedCandidates[rand(0, goldenChestRewardRollerSeedCandidates.length - 1)];
goldenChestRewardRoller.srand(goldenChestRewardRollerSeed);

var blackChestRewardRoller = new Random();
var blackChestRewardRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var blackChestRewardRollerSeed = blackChestRewardRollerSeedCandidates[rand(0, blackChestRewardRollerSeedCandidates.length - 1)];
blackChestRewardRoller.srand(blackChestRewardRollerSeed);

var wizardRoller = new Random();
var wizardRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var wizardRollerSeed = wizardRollerSeedCandidates[rand(0, wizardRollerSeedCandidates.length - 1)];
wizardRoller.srand(wizardRollerSeed);

var scientistRoller = new Random();

var tradeRoller = new Random();
var tradeRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var tradeRollerSeed = tradeRollerSeedCandidates[rand(0, tradeRollerSeedCandidates.length - 1)];
tradeRoller.srand(tradeRollerSeed);

var caveRoller = new Random();
var caveRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var caveRollerSeed = caveRollerSeedCandidates[rand(0, caveRollerSeedCandidates.length - 1)];
caveRoller.srand(caveRollerSeed);

var coreMineralRoller = new Random();
var coreRelicRoller = new Random();
var coreScientistRoller = new Random();
var battleSpawnRoller = new Random();

var clickableRoller = new Random();
var clickableRollerSeedCandidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var clickableRollerSeed = clickableRollerSeedCandidates[rand(0, clickableRollerSeedCandidates.length - 1)];
clickableRoller.srand(clickableRollerSeed);

var relicFunctionalityRoller = new Random();

var userExperienceRoller = new Random();
var uxSeedCandidates = [5, 5, 21, 22];
var uxSeed = rand(0, uxSeedCandidates.length - 1);
userExperienceRoller.srand(uxSeedCandidates[uxSeed]);