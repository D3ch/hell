var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var Controller = /** @class */ (function () {
        function Controller() {
        }
        Controller.prototype.destroy = function () {
            this.pawn = null;
            this.character = null;
        };
        Controller.prototype.tick = function () {
            return;
        };
        Controller.prototype.possess = function (_pawn) {
            if (this.pawn) {
                this.unPossess();
            }
            this.pawn = _pawn;
            this.character = _pawn instanceof TacticalWeaponPack.Character ? this.pawn : null;
            this.pawn.onPossess(this);
        };
        Controller.prototype.unPossess = function () {
            this.pawn = null;
        };
        Controller.prototype.onPawnTakeDamage = function (_damageAmount, _causer) {
            return;
        };
        Controller.prototype.onPawnDeath = function (_instigator, _causer, _damageType, _bHeadshot) {
            return;
        };
        Controller.prototype.onPawnKill = function (_killed, _causer, _damageType, _bHeadshot) {
            return;
        };
        Controller.prototype.onPawnSetTeam = function (_team) {
            return;
        };
        Controller.prototype.onEnemyHit = function () {
            return;
        };
        Controller.prototype.getPawn = function () {
            return this.pawn;
        };
        return Controller;
    }());
    TacticalWeaponPack.Controller = Controller;
    var PlayerController = /** @class */ (function (_super) {
        __extends(PlayerController, _super);
        function PlayerController() {
            var _this = _super.call(this) || this;
            _this.bInputEnabled = true;
            _this.bKeySwitchWeapon = true;
            _this.bKeyAction = true;
            _this.bKeyBarrel = true;
            _this.hud = new TacticalWeaponPack.HUD();
            TacticalWeaponPack.GameUtil.game.input.onDown.add(_this.onMouseDown, _this);
            TacticalWeaponPack.GameUtil.game.input.onUp.add(_this.onMouseUp, _this);
            return _this;
        }
        PlayerController.prototype.destroy = function () {
            TacticalWeaponPack.GameUtil.game.input.onDown.remove(this.onMouseDown, this);
            TacticalWeaponPack.GameUtil.game.input.onUp.remove(this.onMouseUp, this);
            this.hud.destroy();
            this.hud = null;
            _super.prototype.destroy.call(this);
        };
        PlayerController.prototype.tick = function () {
            this.hud.tick();
            _super.prototype.tick.call(this);
            if (this.canInput()) {
                var keyboard = TacticalWeaponPack.GameUtil.game.input.keyboard;
                var mouseX = TacticalWeaponPack.GameUtil.game.input.activePointer.worldX;
                var mouseY = TacticalWeaponPack.GameUtil.game.input.activePointer.worldY;
                mouseX /= TacticalWeaponPack.GameUtil.game.world.scale.x;
                mouseY /= TacticalWeaponPack.GameUtil.game.world.scale.y;
                if (this.pawn) {
                    if (!TacticalWeaponPack.GameUtil.GetGameState().getGameMode().matchHasEnded()) {
                        this.pawn.lookAt(mouseX, mouseY);
                        if (keyboard.addKey(Phaser.Keyboard.ONE).isDown) {
                            this.character.selectWeapon(0);
                        }
                        if (keyboard.addKey(Phaser.Keyboard.TWO).isDown) {
                            this.character.selectWeapon(1);
                        }
                        if (keyboard.addKey(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_RELOAD]).isDown) {
                            this.character.reload();
                        }
                        if (keyboard.addKey(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_SWITCH_WEAPON]).isDown) {
                            if (this.bKeySwitchWeapon) {
                                this.bKeySwitchWeapon = false;
                                this.character.switchWeapon();
                            }
                        }
                        else {
                            this.bKeySwitchWeapon = true;
                        }
                        if (keyboard.addKey(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_ACTION]).isDown) {
                            if (this.bKeyAction) {
                                this.bKeyAction = false;
                                if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode() instanceof TacticalWeaponPack.GameMode_Range) {
                                    TacticalWeaponPack.GameUtil.GetGameState().createTarget(mouseX, Math.min(mouseY, TacticalWeaponPack.GameUtil.game.world.height - 150), TacticalWeaponPack.Target.TYPE_DEFAULT);
                                }
                                else {
                                    if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                                        TacticalWeaponPack.GameUtil.GetGameState().getGameMode().endMatch();
                                    }
                                }
                            }
                        }
                        else {
                            this.bKeyAction = true;
                        }
                        if (keyboard.addKey(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_BARREL]).isDown) {
                            if (this.bKeyBarrel) {
                                this.bKeyBarrel = false;
                                this.character.triggerBarrel();
                            }
                        }
                        else {
                            this.bKeyBarrel = true;
                        }
                    }
                    else {
                        this.pawn.lookAt(this.pawn.x + 100, this.pawn.y);
                    }
                }
            }
        };
        PlayerController.prototype.onPawnKill = function (_killed, _causer, _damageType, _bHeadshot) {
            _super.prototype.onPawnKill.call(this, _killed, _causer, _damageType, _bHeadshot);
            var projectile = _causer instanceof TacticalWeaponPack.ProjectileBase ? _causer : null;
            if (projectile) {
                if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode() instanceof TacticalWeaponPack.RankedGameMode) {
                    var weapon = projectile.getData()["weapon"];
                    if (weapon) {
                        if (!TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["kills"]) {
                            TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["kills"] = 0;
                        }
                        TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["kills"]++;
                        if (_bHeadshot) {
                            TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["headshots"]++;
                        }
                        var kills = TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["kills"];
                        var unlocks = TacticalWeaponPack.WeaponDatabase.GetUnlocksForKills(weapon["id"], kills);
                        if (unlocks.length > 0) {
                            for (var i = 0; i < unlocks.length; i++) {
                                TacticalWeaponPack.PlayerUtil.AddNewUnlock("mod", unlocks[i], { weaponId: weapon["id"] });
                            }
                        }
                        var headshots = TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][weapon["id"]]["headshots"];
                        var unlocks = TacticalWeaponPack.WeaponDatabase.GetUnlocksForHeadshots(weapon["id"], headshots);
                        if (unlocks.length > 0) {
                            for (var i = 0; i < unlocks.length; i++) {
                                TacticalWeaponPack.PlayerUtil.AddNewUnlock("mod", unlocks[i], { weaponId: weapon["id"] });
                            }
                        }
                    }
                }
            }
            var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
            gameMode.addKills();
            if (_bHeadshot) {
                gameMode.addHeadshots();
            }
            if (gameMode.usesXP()) {
                if (_killed) {
                    var xp = 5 * (_bHeadshot ? 2 : 1) * this.character.getModifiers()[TacticalWeaponPack.Character.MODIFIER_XP];
                    var killedPawn = _killed.getPawn();
                    this.hud.addXPNotifier(killedPawn.x, killedPawn.y - 50, xp, _bHeadshot);
                    TacticalWeaponPack.PlayerUtil.AddXP(xp);
                }
            }
        };
        PlayerController.prototype.possess = function (_pawn) {
            _super.prototype.possess.call(this, _pawn);
            if (_pawn) {
                this.hud.setHasPawn(true);
            }
        };
        PlayerController.prototype.unPossess = function () {
            this.hud.setHasPawn(false);
        };
        PlayerController.prototype.getHUD = function () {
            return this.hud;
        };
        PlayerController.prototype.onMouseDown = function () {
            var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
            if (!gameMode.matchIsInProgress()) {
                return;
            }
            if (!this.canInput()) {
                return;
            }
            if (this.character) {
                if (this.character.isAlive()) {
                    this.character.triggerWeapon(true);
                }
            }
        };
        PlayerController.prototype.onMouseUp = function () {
            var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
            if (!gameMode.matchIsInProgress()) {
                return;
            }
            if (this.character) {
                if (this.character.isAlive()) {
                    this.character.triggerWeapon(false);
                }
            }
        };
        PlayerController.prototype.canInput = function () {
            return this.bInputEnabled;
        };
        return PlayerController;
    }(Controller));
    TacticalWeaponPack.PlayerController = PlayerController;
    var AIController = /** @class */ (function (_super) {
        __extends(AIController, _super);
        function AIController() {
            return _super.call(this) || this;
        }
        return AIController;
    }(Controller));
    TacticalWeaponPack.AIController = AIController;
    var AIController_Target = /** @class */ (function (_super) {
        __extends(AIController_Target, _super);
        function AIController_Target() {
            return _super.call(this) || this;
        }
        AIController_Target.prototype.destroy = function () {
            this.target = null;
            _super.prototype.destroy.call(this);
        };
        AIController_Target.prototype.possess = function (_pawn) {
            _super.prototype.possess.call(this, _pawn);
            this.target = _pawn;
        };
        AIController_Target.prototype.unPossess = function () {
            _super.prototype.unPossess.call(this);
            this.target = null;
        };
        AIController_Target.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.target) {
                if (this.target.isAlive()) {
                    if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
                        if (this.target.getType() == TacticalWeaponPack.Target.TYPE_ATTACKER) {
                            if (this.target.x < 50) {
                                var defender = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
                                defender.addDamage(10, this.target);
                                this.target.suicide();
                            }
                            else {
                                this.target.getBody().applyForce(-this.target.getSpeed(), 0);
                            }
                        }
                    }
                }
            }
        };
        return AIController_Target;
    }(AIController));
    TacticalWeaponPack.AIController_Target = AIController_Target;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var AchievementsDatabase = /** @class */ (function () {
        function AchievementsDatabase() {
        }
        AchievementsDatabase.Init = function () {
            AchievementsDatabase.achievements = [
                {
                    id: AchievementsDatabase.ACH_KILLS_1,
                    name: "Kills I",
                    desc: "Get 10 kills",
                    medalId: 55755
                },
                {
                    id: AchievementsDatabase.ACH_KILLS_2,
                    name: "Kills II",
                    desc: "Get 100 kills",
                    medalId: 55756
                },
                {
                    id: AchievementsDatabase.ACH_KILLS_3,
                    name: "Kills III",
                    desc: "Get 1,000 kills",
                    medalId: 55757
                },
                {
                    id: AchievementsDatabase.ACH_HEADSHOTS_1,
                    name: "Headshots I",
                    desc: "Get 10 headshots",
                    medalId: 55758
                },
                {
                    id: AchievementsDatabase.ACH_HEADSHOTS_2,
                    name: "Headshots II",
                    desc: "Get 50 headshots",
                    medalId: 55759
                },
                {
                    id: AchievementsDatabase.ACH_HEADSHOTS_3,
                    name: "Headshots III",
                    desc: "Get 100 headshots",
                    medalId: 55760
                },
                {
                    id: AchievementsDatabase.ACH_RANGE,
                    name: "Field Test",
                    desc: "Visit the firing range",
                    medalId: 55762
                },
                {
                    id: AchievementsDatabase.ACH_PRESTIGE,
                    name: "Royalty",
                    desc: "Prestige your ranked profile",
                    medalId: 55761
                }
            ];
        };
        AchievementsDatabase.GetAllIds = function () {
            return [
                AchievementsDatabase.ACH_KILLS_1,
                AchievementsDatabase.ACH_KILLS_2,
                AchievementsDatabase.ACH_KILLS_3,
                AchievementsDatabase.ACH_HEADSHOTS_1,
                AchievementsDatabase.ACH_HEADSHOTS_2,
                AchievementsDatabase.ACH_HEADSHOTS_3,
                AchievementsDatabase.ACH_RANGE,
                AchievementsDatabase.ACH_PRESTIGE
            ];
        };
        AchievementsDatabase.GetAchievement = function (_id) {
            var arr = AchievementsDatabase.achievements;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]["id"] == _id) {
                    return arr[i];
                }
            }
            return null;
        };
        AchievementsDatabase.GetAllAchievements = function () {
            return AchievementsDatabase.achievements;
        };
        AchievementsDatabase.GetAchievementProgress = function (_id) {
            var val = 0;
            var rankedData = TacticalWeaponPack.PlayerUtil.GetRankedData();
            if (_id == AchievementsDatabase.ACH_KILLS_1) {
                val = rankedData["kills"] / 10;
            }
            else if (_id == AchievementsDatabase.ACH_KILLS_2) {
                val = rankedData["kills"] / 100;
            }
            else if (_id == AchievementsDatabase.ACH_KILLS_3) {
                val = rankedData["kills"] / 1000;
            }
            else if (_id == AchievementsDatabase.ACH_HEADSHOTS_1) {
                val = rankedData["kills"] / 10;
            }
            else if (_id == AchievementsDatabase.ACH_HEADSHOTS_2) {
                val = rankedData["kills"] / 50;
            }
            else if (_id == AchievementsDatabase.ACH_HEADSHOTS_3) {
                val = rankedData["kills"] / 100;
            }
            else if (_id == AchievementsDatabase.ACH_PRESTIGE) {
                val = rankedData["rank"] / TacticalWeaponPack.PlayerUtil.MAX_RANK;
            }
            else {
                val = 0;
            }
            return Math.min(1, val);
        };
        AchievementsDatabase.ACH_KILLS_1 = "ACH_KILLS_1";
        AchievementsDatabase.ACH_KILLS_2 = "ACH_KILLS_2";
        AchievementsDatabase.ACH_KILLS_3 = "ACH_KILLS_3";
        AchievementsDatabase.ACH_HEADSHOTS_1 = "ACH_HEADSHOTS_1";
        AchievementsDatabase.ACH_HEADSHOTS_2 = "ACH_HEADSHOTS_2";
        AchievementsDatabase.ACH_HEADSHOTS_3 = "ACH_HEADSHOTS_3";
        AchievementsDatabase.ACH_RANGE = "ACH_RANGE";
        AchievementsDatabase.ACH_PRESTIGE = "ACH_PRESTIGE";
        return AchievementsDatabase;
    }());
    TacticalWeaponPack.AchievementsDatabase = AchievementsDatabase;
    var GameModeDatabase = /** @class */ (function () {
        function GameModeDatabase() {
        }
        GameModeDatabase.Init = function () {
            var modes = [
                {
                    id: GameModeDatabase.GAME_SHOOTER,
                    name: "Shooter",
                    desc: "Destroy the targets before they disappear.",
                    bCustom: true,
                    leaderboardsId: 8338,
                    statisticId: 135566,
                    ranks: [
                        50,
                        120,
                        180
                    ]
                },
                {
                    id: GameModeDatabase.GAME_SNIPER,
                    name: "Sniper",
                    desc: "Long distance target shooting.",
                    bCustom: true,
                    leaderboardsId: 8339,
                    statisticId: 135567,
                    ranks: [
                        50,
                        180,
                        220
                    ]
                },
                {
                    id: GameModeDatabase.GAME_TIME_ATTACK,
                    name: "Time Attack",
                    desc: "Destroy as many targets as you can in 30 seconds.",
                    bCustom: true,
                    leaderboardsId: 8340,
                    statisticId: 135568,
                    ranks: [
                        50,
                        100,
                        200
                    ]
                },
                {
                    id: GameModeDatabase.GAME_DEFENDER,
                    name: "Defender",
                    desc: "Prevent the targets from reaching the end of the screen for as long as possible.",
                    bCustom: true,
                    leaderboardsId: 8342,
                    statisticId: 135569,
                    ranks: [
                        100,
                        250,
                        400
                    ]
                },
                {
                    id: GameModeDatabase.GAME_RANGE,
                    name: "Firing Range",
                    desc: "Practice your aim and test any weapon at the firing range."
                },
                {
                    id: GameModeDatabase.GAME_TOTAL_KILLS,
                    name: "Total Kills",
                    desc: "Total kills in ranked game modes.",
                    leaderboardsId: 8359,
                    statisticId: 135644
                },
            ];
            GameModeDatabase.modes = modes;
        };
        GameModeDatabase.GetRankForScore = function (_gameId, _score) {
            if (_score <= 0) {
                return -1;
            }
            var modeData = GameModeDatabase.GetGameMode(_gameId);
            var placements = TacticalWeaponPack.GameUtil.GetPlacementColours().reverse();
            var ranks = modeData["ranks"];
            var placementIndex = ranks.length - 1;
            for (var i = 0; i < ranks.length; i++) {
                if (_score >= ranks[i]) {
                    continue;
                }
                else {
                    placementIndex = Math.max(0, i - 1);
                    break;
                }
            }
            return Math.min(placementIndex, ranks.length - 1);
        };
        GameModeDatabase.GetAllGameModes = function () {
            return GameModeDatabase.modes;
        };
        GameModeDatabase.GetAllRankedGameModes = function () {
            var arr = [];
            var modes = GameModeDatabase.modes;
            for (var i = 0; i < modes.length; i++) {
                if (modes[i]["bCustom"] == true) {
                    arr.push(modes[i]);
                }
            }
            return arr;
        };
        GameModeDatabase.GetGameMode = function (_id) {
            var modes = GameModeDatabase.modes;
            for (var i = 0; i < modes.length; i++) {
                if (modes[i]["id"] == _id) {
                    return modes[i];
                }
            }
            return null;
        };
        GameModeDatabase.GAME_RANGE = "game_range";
        GameModeDatabase.GAME_SHOOTER = "game_shooter";
        GameModeDatabase.GAME_SNIPER = "game_sniper";
        GameModeDatabase.GAME_DEFENDER = "game_defender";
        GameModeDatabase.GAME_TIME_ATTACK = "game_time_attack";
        GameModeDatabase.GAME_TOTAL_KILLS = "game_total_kills";
        return GameModeDatabase;
    }());
    TacticalWeaponPack.GameModeDatabase = GameModeDatabase;
    var SkillDatabase = /** @class */ (function () {
        function SkillDatabase() {
        }
        SkillDatabase.Init = function () {
            SkillDatabase.skills = [
                {
                    id: SkillDatabase.SKILL_AIM,
                    name: "Quickdraw",
                    desc: "Faster aim speed.",
                    unlockLevel: 1,
                    modifiers: [
                        {
                            id: TacticalWeaponPack.Character.MODIFIER_VIEW_SPEED,
                            value: 2.5
                        }
                    ]
                },
                {
                    id: SkillDatabase.SKILL_ACCURACY,
                    name: "Marksman",
                    desc: "Increased accuracy.",
                    modifiers: [
                        {
                            id: TacticalWeaponPack.Character.MODIFIER_ACCURACY,
                            value: 0.2
                        }
                    ]
                },
                {
                    id: SkillDatabase.SKILL_GREED,
                    name: "Greed",
                    desc: "Get double XP from kills and headshots.",
                    modifiers: [
                        {
                            id: TacticalWeaponPack.Character.MODIFIER_XP,
                            value: 2
                        }
                    ]
                },
                {
                    id: SkillDatabase.SKILL_RELOAD,
                    name: "Sleight of Hand",
                    desc: "Faster reload speed.",
                    modifiers: [
                        {
                            id: TacticalWeaponPack.Character.MODIFIER_RELOAD_SPEED,
                            value: 0.5
                        }
                    ]
                },
                {
                    id: SkillDatabase.SKILL_ROF,
                    name: "Rapid Fire",
                    desc: "Increased rate of fire.",
                    modifiers: [
                        {
                            id: TacticalWeaponPack.Character.MODIFIER_FIRE_RATE,
                            value: 0.5
                        }
                    ]
                }
            ];
            var numSkills = SkillDatabase.skills.length;
            for (var i = 0; i < SkillDatabase.skills.length; i++) {
                if (!SkillDatabase.skills[i]["unlockLevel"]) {
                    SkillDatabase.skills[i]["unlockLevel"] = Math.round(((i + 1) / numSkills) * TacticalWeaponPack.PlayerUtil.MAX_RANK);
                }
            }
            SkillDatabase.skills = SkillDatabase.skills.sort(TacticalWeaponPack.GameUtil.CompareUnlocks);
        };
        SkillDatabase.GetSkill = function (_id) {
            var search = [SkillDatabase.skills];
            for (var i = 0; i < search.length; i++) {
                var cur = search[i];
                for (var j = 0; j < cur.length; j++) {
                    if (cur[j]["id"] == _id) {
                        return cur[j];
                    }
                }
            }
            return null;
        };
        SkillDatabase.GetAllSkills = function () {
            return SkillDatabase.skills;
        };
        SkillDatabase.GetAllSkillsByUnlockLevel = function (_rank) {
            var arr = [];
            var search = [SkillDatabase.skills];
            for (var i = 0; i < search.length; i++) {
                var cur = search[i];
                for (var j = 0; j < cur.length; j++) {
                    if (cur[j]["unlockLevel"] == _rank) {
                        arr.push({ type: "skill", id: cur[j]["id"] });
                    }
                }
            }
            return arr;
        };
        SkillDatabase.SKILL_AIM = "skill_aim";
        SkillDatabase.SKILL_RELOAD = "skill_reload";
        SkillDatabase.SKILL_GREED = "skill_greed";
        SkillDatabase.SKILL_ACCURACY = "skill_accuracy";
        SkillDatabase.SKILL_ROF = "skill_rof";
        return SkillDatabase;
    }());
    TacticalWeaponPack.SkillDatabase = SkillDatabase;
    var WeaponDatabase = /** @class */ (function () {
        function WeaponDatabase() {
        }
        WeaponDatabase.Init = function () {
            var weapons = [
                {
                    id: WeaponDatabase.WEAPON_M9,
                    unlockLevel: 1,
                    name: "M9",
                    desc: "Semi-automatic with a high capacity.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 12,
                    accuracy: 5,
                    fireRate: 3,
                    magSize: 15,
                    reloadTime: 1,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -29,
                            y: 6.35
                        },
                        slide: {
                            x: 1.35,
                            y: -23.05
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_G17,
                    unlockLevel: 2,
                    name: "G17",
                    desc: "Semi-automatic with a high capacity.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 12,
                    accuracy: 3,
                    fireRate: 1,
                    magSize: 20,
                    reloadTime: 1,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -28.95,
                            y: 9.5
                        },
                        slide: {
                            x: 4.1,
                            y: -25.65
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_USP45,
                    name: "USP .45",
                    desc: "Semi-automatic with medium capacity and power.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 16,
                    accuracy: 4,
                    fireRate: 5,
                    magSize: 12,
                    reloadTime: 1.2,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -27.25,
                            y: 4.1
                        },
                        slide: {
                            x: 0.1,
                            y: -28.9
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_FIVESEVEN,
                    name: "Five-SeveN",
                    desc: "Semi-automatic with a high capacity.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 13,
                    accuracy: 2,
                    fireRate: 2,
                    magSize: 20,
                    reloadTime: 0.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -26.7,
                            y: 2.8
                        },
                        slide: {
                            x: 0.7,
                            y: -27.95
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M1911,
                    name: "M1911",
                    desc: "Semi-automatic with medium capacity and power.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 40,
                    accuracy: 1,
                    fireRate: 1,
                    magSize: 8,
                    reloadTime: 1.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -30.6,
                            y: 5.25
                        },
                        slide: {
                            x: 5.1,
                            y: -28.1
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_DEAGLE,
                    name: "Desert Eagle",
                    desc: "Semi-automatic with high power.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_50CAL,
                    damage: 90,
                    accuracy: 4,
                    fireRate: 10,
                    magSize: 7,
                    reloadTime: 1.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -32.95,
                            y: 12.85
                        },
                        slide: {
                            x: -1.35,
                            y: -23.2
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MAGNUM,
                    name: ".44 Magnum",
                    desc: "Semi-automatic with high power and good accuracy.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_PISTOL,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_44,
                    damage: 80,
                    accuracy: 2,
                    fireRate: 4,
                    magSize: 6,
                    reloadTime: 1.5,
                    bEjectShell: false,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M93R,
                    name: "M93R",
                    desc: "Semi-automatic with 3 round burst fire.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_MACHINE_PISTOL,
                    mode: WeaponDatabase.MODE_BURST,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 14,
                    accuracy: 4,
                    fireRate: 2,
                    burstFireRate: 15,
                    magSize: 15,
                    reloadTime: 1.3,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -34.6,
                            y: 13.25
                        },
                        slide: {
                            x: -3.15,
                            y: -23.3
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_G18,
                    name: "G18",
                    desc: "Fully automatic with a high rate of fire.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_MACHINE_PISTOL,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 13,
                    accuracy: 5,
                    fireRate: 3,
                    magSize: 20,
                    reloadTime: 1.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -33.7,
                            y: 31.5
                        },
                        slide: {
                            x: 4.1,
                            y: -25.65
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_USPM,
                    name: "USP Match",
                    desc: "Fully automatic with high accuracy.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_MACHINE_PISTOL,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 18,
                    accuracy: 2,
                    fireRate: 8,
                    magSize: 12,
                    reloadTime: 1.5,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -35.5,
                            y: 15.35
                        },
                        slide: {
                            x: -4.4,
                            y: -28.9
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MP1911,
                    name: "MP-1911",
                    desc: "Fully automatic with high power.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_MACHINE_PISTOL,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 23,
                    accuracy: 3,
                    fireRate: 5,
                    magSize: 20,
                    reloadTime: 1.7,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -48.05,
                            y: 30.5
                        },
                        slide: {
                            x: -4.4,
                            y: -28.1
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MP9,
                    name: "MP9",
                    desc: "Fully automatic with a high rate of fire.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_MACHINE_PISTOL,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 18,
                    accuracy: 2,
                    fireRate: 3,
                    magSize: 32,
                    reloadTime: 1.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: 18,
                            y: 33.9
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MP5,
                    unlockLevel: 1,
                    name: "MP5",
                    desc: "Fully automatic with good accuracy.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 15,
                    accuracy: 4,
                    fireRate: 5,
                    magSize: 30,
                    reloadTime: 1.2,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 1.05,
                            y: -25.75
                        },
                        mag: {
                            x: 31.95,
                            y: 27.15
                        },
                        laser: {
                            x: 54,
                            y: -30
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AUGPARA,
                    name: "AUG-PARA",
                    desc: "Fully automatic with low recoil.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 15,
                    accuracy: 3,
                    fireRate: 3,
                    magSize: 25,
                    reloadTime: 1.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 34.4,
                            y: -20.2
                        },
                        mag: {
                            x: -37.65,
                            y: 21.85
                        },
                        laser: {
                            x: 62,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_UMP45,
                    name: "UMP-45",
                    desc: "Fully automatic with high power.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 21,
                    accuracy: 2,
                    fireRate: 6,
                    magSize: 25,
                    reloadTime: 1.5,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 16.7,
                            y: -28.95
                        },
                        mag: {
                            x: 56.8,
                            y: 37.15
                        },
                        laser: {
                            x: 72,
                            y: -32
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MP7,
                    name: "MP7",
                    desc: "Fully automatic with a high rate of fire.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_9MM,
                    damage: 16,
                    accuracy: 4,
                    fireRate: 3,
                    magSize: 32,
                    reloadTime: 1.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 25.5,
                            y: -25
                        },
                        mag: {
                            x: 30.55,
                            y: 35.15
                        },
                        laser: {
                            x: 66,
                            y: -22
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_P90,
                    name: "P90",
                    desc: "Fully automatic with a high capacity.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_45ACP,
                    damage: 15,
                    accuracy: 3,
                    fireRate: 2,
                    magSize: 50,
                    reloadTime: 1.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 52.6,
                            y: -30.55
                        },
                        mag: {
                            x: 17,
                            y: -13.95
                        },
                        laser: {
                            x: 50,
                            y: -22
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AK74U,
                    name: "AK74u",
                    desc: "Fully automatic with high power.\nEffective at close to medium range.",
                    type: WeaponDatabase.TYPE_SMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 22,
                    accuracy: 5,
                    fireRate: 6,
                    magSize: 30,
                    reloadTime: 1.5,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -5.4,
                            y: -29.25
                        },
                        mag: {
                            x: 32.6,
                            y: 29.1
                        },
                        laser: {
                            x: 84,
                            y: -32
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M16A4,
                    unlockLevel: 1,
                    name: "M16A4",
                    desc: "Semi-automatic with 3 round burst fire.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_BURST,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 31,
                    accuracy: 3,
                    fireRate: 4,
                    burstFireRate: 20,
                    magSize: 30,
                    reloadTime: 1.7,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -46.25,
                            y: -27
                        },
                        mag: {
                            x: -24.4,
                            y: 23.15
                        },
                        laser: {
                            x: 80,
                            y: -32
                        },
                        m203: {
                            x: 8,
                            y: -6
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M4,
                    unlockLevel: 3,
                    name: "M4A1",
                    desc: "Fully automatic with low recoil.\nEffective at medium range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 22,
                    accuracy: 4,
                    fireRate: 5,
                    magSize: 30,
                    reloadTime: 1.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -31.5,
                            y: -27
                        },
                        mag: {
                            x: -9.35,
                            y: 23.15
                        },
                        laser: {
                            x: 48,
                            y: -32
                        },
                        m203: {
                            x: 19,
                            y: -6
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_G36C,
                    name: "G36C",
                    desc: "Fully automatic with low recoil.\nEffective at medium range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 25,
                    accuracy: 3,
                    fireRate: 6,
                    magSize: 30,
                    reloadTime: 1.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -1,
                            y: -32
                        },
                        mag: {
                            x: 16.25,
                            y: 25.8
                        },
                        laser: {
                            x: 60,
                            y: -24
                        },
                        m203: {
                            x: 32,
                            y: -2
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_LE6940,
                    name: "LE6940",
                    desc: "Fully automatic with high rate of fire.\nEffective at medium range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 20,
                    accuracy: 3,
                    fireRate: 4,
                    magSize: 30,
                    reloadTime: 1.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -18.5,
                            y: -29
                        },
                        mag: {
                            x: 4,
                            y: 18.15
                        },
                        laser: {
                            x: 48,
                            y: -32
                        },
                        m203: {
                            x: 18,
                            y: -10
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_SCARL,
                    name: "SCAR-L",
                    desc: "Fully automatic with high power.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 33,
                    accuracy: 4,
                    fireRate: 8,
                    magSize: 30,
                    reloadTime: 2.2,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -9.35,
                            y: -28.5
                        },
                        mag: {
                            x: 21.5,
                            y: 27.8
                        },
                        laser: {
                            x: 72,
                            y: -30
                        },
                        m203: {
                            x: 32,
                            y: -4
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_HK416,
                    name: "HK416",
                    desc: "Fully automatic with high accuracy.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 25,
                    accuracy: 1,
                    fireRate: 7,
                    magSize: 30,
                    reloadTime: 1.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -14.5,
                            y: -27.75
                        },
                        mag: {
                            x: 6,
                            y: 19.15
                        },
                        laser: {
                            x: 52,
                            y: -34
                        },
                        m203: {
                            x: 20,
                            y: -8
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AUG,
                    name: "AUG",
                    desc: "Fully automatic with a good balance of accuracy and damage.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 27,
                    accuracy: 2,
                    fireRate: 6,
                    magSize: 30,
                    reloadTime: 1.8,
                    bSmallM203: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 13.4,
                            y: -20.2
                        },
                        mag: {
                            x: -58.65,
                            y: 21.85
                        },
                        laser: {
                            x: 50,
                            y: -38
                        },
                        m203: {
                            x: 58,
                            y: -19
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AK47,
                    name: "AK47",
                    desc: "Fully automatic with high power.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 36,
                    accuracy: 4,
                    fireRate: 7,
                    magSize: 30,
                    reloadTime: 2,
                    bSmallM203: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -28.25,
                            y: -30.4
                        },
                        mag: {
                            x: 5.35,
                            y: 27.1
                        },
                        laser: {
                            x: 72,
                            y: -32
                        },
                        m203: {
                            x: 40,
                            y: -10
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_FAMAS,
                    name: "FAMAS",
                    desc: "Semi-automatic with 3 round burst fire.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_RIFLE,
                    mode: WeaponDatabase.MODE_BURST,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 33,
                    accuracy: 2,
                    fireRate: 3,
                    burstFireRate: 15,
                    magSize: 30,
                    reloadTime: 1.9,
                    bSmallM203: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 52.25,
                            y: -40.5
                        },
                        mag: {
                            x: -60.5,
                            y: 30.95
                        },
                        laser: {
                            x: 80,
                            y: -28
                        },
                        m203: {
                            x: 48,
                            y: -6
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M40A3,
                    unlockLevel: 1,
                    name: "M40A3",
                    desc: "Bolt-action sniper rifle.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_762MM,
                    bSingleRoundLoaded: true,
                    damage: 100,
                    accuracy: 1,
                    fireRate: 50,
                    magSize: 5,
                    reloadTime: 0.5,
                    bBoltAction: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -34.55,
                            y: -32.1
                        },
                        laser: {
                            x: 62,
                            y: -26
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_RSASS,
                    name: "RSASS",
                    desc: "Semi-automatic sniper rifle.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 60,
                    accuracy: 2,
                    fireRate: 12,
                    magSize: 10,
                    reloadTime: 2.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -15.2,
                            y: -35.5
                        },
                        mag: {
                            x: -27.2,
                            y: 15.75
                        },
                        laser: {
                            x: 54,
                            y: -42
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_SAMR,
                    name: "SAM-R",
                    desc: "Semi-automatic sniper rifle with a high capacity.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 40,
                    accuracy: 2,
                    fireRate: 6,
                    magSize: 30,
                    reloadTime: 3,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -15.2,
                            y: -33
                        },
                        mag: {
                            x: -27,
                            y: 15.15
                        },
                        laser: {
                            x: 72,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MSR,
                    name: "MSR",
                    desc: "Bolt-action sniper rifle with high power.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 150,
                    accuracy: 0,
                    fireRate: 40,
                    magSize: 5,
                    reloadTime: 3.1,
                    bBoltAction: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 11,
                            y: -33.6
                        },
                        mag: {
                            x: -32.8,
                            y: 2.4
                        },
                        laser: {
                            x: 72,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_HK417,
                    name: "HK417",
                    desc: "Semi-automatic sniper rifle with high power.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 70,
                    accuracy: 1,
                    fireRate: 10,
                    magSize: 10,
                    reloadTime: 2.7,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 19.5,
                            y: -34.5
                        },
                        mag: {
                            x: 2.75,
                            y: 14.75
                        },
                        laser: {
                            x: 62,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_TPR,
                    name: "TPR",
                    desc: "Fully automatic sniper rifle.\nEffective at long range.",
                    type: WeaponDatabase.TYPE_SNIPER,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 60,
                    accuracy: 2,
                    fireRate: 10,
                    magSize: 15,
                    reloadTime: 2.9,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 14.3,
                            y: -38.05
                        },
                        mag: {
                            x: 2.3,
                            y: 24.3
                        },
                        laser: {
                            x: 86,
                            y: -40
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MOSSBERG,
                    unlockLevel: 1,
                    name: "Mossberg",
                    desc: "Pump-action combat shotgun.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_SHOTGUN,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_12G,
                    bSingleRoundLoaded: true,
                    damage: 20,
                    accuracy: 10,
                    fireRate: 30,
                    magSize: 6,
                    reloadTime: 0.5,
                    bEjectShell: false,
                    bPump: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: 13.65,
                            y: -36.75
                        },
                        pump: {
                            x: 95.95,
                            y: -18.5
                        },
                        laser: {
                            x: 90,
                            y: -40
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M1014,
                    name: "M1014",
                    desc: "Semi-automatic combat shotgun with good accuracy.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_SHOTGUN,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_12G,
                    bSingleRoundLoaded: true,
                    damage: 19,
                    accuracy: 9,
                    fireRate: 10,
                    magSize: 7,
                    reloadTime: 0.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -12.2,
                            y: -31.5
                        },
                        laser: {
                            x: 78,
                            y: -34
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_SPAS12,
                    name: "SPAS-12",
                    desc: "Fully automatic combat shotgun.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_SHOTGUN,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_12G,
                    bSingleRoundLoaded: true,
                    damage: 22,
                    accuracy: 13,
                    fireRate: 10,
                    magSize: 8,
                    reloadTime: 0.5,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -59,
                            y: -29
                        },
                        laser: {
                            x: 60,
                            y: -32
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M3,
                    name: "M3",
                    desc: "Pump-action combat shotgun.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_SHOTGUN,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_12G,
                    bSingleRoundLoaded: true,
                    damage: 22,
                    accuracy: 12,
                    fireRate: 35,
                    magSize: 8,
                    reloadTime: 0.4,
                    bEjectShell: false,
                    bPump: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -6.35,
                            y: -33
                        },
                        pump: {
                            x: 98.7,
                            y: -12
                        },
                        laser: {
                            x: 84,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AA12,
                    name: "AA-12",
                    desc: "Fully automatic combat shotgun with a high rate of fire.\nEffective at close range.",
                    type: WeaponDatabase.TYPE_SHOTGUN,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_12G,
                    damage: 20,
                    accuracy: 14,
                    fireRate: 7,
                    magSize: 8,
                    reloadTime: 3.1,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -26,
                            y: -35.35
                        },
                        mag: {
                            x: -2.9,
                            y: 26.85
                        },
                        laser: {
                            x: 50,
                            y: -38
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_MG4,
                    unlockLevel: 1,
                    name: "MG4",
                    desc: "Fully automatic with a high rate of fire.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 15,
                    accuracy: 7,
                    fireRate: 5,
                    magSize: 100,
                    reloadTime: 3.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -22.25,
                            y: -36.5
                        },
                        mag: {
                            bFront: true,
                            x: 1.5,
                            y: 30
                        },
                        laser: {
                            x: 98,
                            y: -32
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M249,
                    name: "M249 SAW",
                    desc: "Fully automatic with a high rate of fire.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 17,
                    accuracy: 6,
                    fireRate: 3,
                    magSize: 100,
                    reloadTime: 4.1,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -28.75,
                            y: -31.85
                        },
                        mag: {
                            bFront: true,
                            x: -5.4,
                            y: 31.3
                        },
                        laser: {
                            x: 84,
                            y: -30
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_AUGHBAR,
                    name: "AUG-HBAR",
                    desc: "Fully automatic with good accuracy.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_556MM,
                    damage: 22,
                    accuracy: 2,
                    fireRate: 6,
                    magSize: 50,
                    reloadTime: 2.8,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -3.6,
                            y: -20.2
                        },
                        mag: {
                            x: -82.35,
                            y: 16.2
                        },
                        laser: {
                            x: 32,
                            y: -36
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_RPK,
                    name: "RPK",
                    desc: "Fully automatic with a high power.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 20,
                    accuracy: 6,
                    fireRate: 5,
                    magSize: 100,
                    reloadTime: 3.2,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -48.25,
                            y: -30.4
                        },
                        mag: {
                            x: -22.25,
                            y: 25.95
                        },
                        laser: {
                            x: 54,
                            y: -30
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_HAMR,
                    name: "HAMR",
                    desc: "Fully automatic with high power.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_AUTO,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 26,
                    accuracy: 4,
                    fireRate: 4,
                    magSize: 100,
                    reloadTime: 3.4,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -26.45,
                            y: -28.55
                        },
                        mag: {
                            x: 3.65,
                            y: 29.2
                        },
                        laser: {
                            x: 42,
                            y: -30
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_QBB95,
                    name: "QBB-95",
                    desc: "3-round burst with high power.\nEffective at medium to long range.",
                    type: WeaponDatabase.TYPE_LMG,
                    mode: WeaponDatabase.MODE_BURST,
                    round: WeaponDatabase.ROUND_762MM,
                    damage: 34,
                    accuracy: 3,
                    fireRate: 3,
                    burstFireRate: 18,
                    magSize: 60,
                    reloadTime: 3.1,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        optic: {
                            x: -21.5,
                            y: -38.7
                        },
                        mag: {
                            x: -79.75,
                            y: 28.75
                        },
                        laser: {
                            x: 54,
                            y: -26
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M203,
                    name: "M203",
                    desc: "Free-fire grenade launcher.\nEffective against groups of targets.",
                    type: WeaponDatabase.TYPE_LAUNCHER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_GRENADE,
                    projectileType: TacticalWeaponPack.ProjectileBase.TYPE_GRENADE,
                    damage: 200,
                    accuracy: 4,
                    fireRate: 30,
                    magSize: 1,
                    reloadTime: 2,
                    bEjectShell: false,
                    bEjectMag: false,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_XM25,
                    name: "XM-25",
                    desc: "Semi-automatic grenade lancher.\nEffective against groups of targets.",
                    type: WeaponDatabase.TYPE_LAUNCHER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_GRENADE,
                    projectileType: TacticalWeaponPack.ProjectileBase.TYPE_GRENADE,
                    damage: 200,
                    accuracy: 3,
                    fireRate: 20,
                    magSize: 3,
                    reloadTime: 2.9,
                    bEjectShell: false,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: -57.65,
                            y: 25.05
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_RPG,
                    name: "RPG-7",
                    desc: "Free-fire rocket launcher.\nEffective against groups of targets.",
                    type: WeaponDatabase.TYPE_LAUNCHER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_ROCKET,
                    projectileType: TacticalWeaponPack.ProjectileBase.TYPE_ROCKET,
                    damage: 300,
                    accuracy: 3,
                    fireRate: 30,
                    magSize: 1,
                    reloadTime: 3.2,
                    bEjectShell: false,
                    bEjectMag: false,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        },
                        mag: {
                            x: 193.35,
                            y: -11
                        }
                    }
                },
                {
                    id: WeaponDatabase.WEAPON_M32,
                    name: "M32",
                    desc: "Semi-automatic sticky grenade lancher.\nEffective against groups of targets.",
                    type: WeaponDatabase.TYPE_LAUNCHER,
                    mode: WeaponDatabase.MODE_SEMI,
                    round: WeaponDatabase.ROUND_GRENADE,
                    projectileType: TacticalWeaponPack.ProjectileBase.TYPE_GRENADE,
                    damage: 200,
                    accuracy: 2,
                    fireRate: 15,
                    magSize: 6,
                    reloadTime: 3.8,
                    bEjectShell: false,
                    bSticky: true,
                    points: {
                        base: {
                            x: 0,
                            y: 0
                        }
                    }
                }
            ];
            WeaponDatabase.weapons = weapons;
            var temp = {};
            for (var i = 0; i < weapons.length; i++) {
                var weapon = weapons[i];
                weapon["mag"] = weapon["magSize"];
                weapon["ammo"] = weapon["magSize"] * 4;
                weapon["ammoMax"] = weapon["ammo"];
                if (!weapon["projectileType"]) {
                    weapon["projectileType"] = TacticalWeaponPack.ProjectileBase.TYPE_BULLET;
                }
                if (weapon["mode"] == WeaponDatabase.MODE_BURST) {
                    weapon["bursts"] = 3;
                }
                if (!weapon["unlockLevel"]) {
                    if (!temp[weapon["type"]]) {
                        temp[weapon["type"]] = WeaponDatabase.GetAllWeaponsByType(weapon["type"]);
                    }
                    var arr = temp[weapon["type"]];
                    var numOfType = arr.length;
                    var index = arr.indexOf(weapon);
                    var percent = ((index + 1) / numOfType);
                    if (weapon["type"] == WeaponDatabase.TYPE_PISTOL) {
                        percent *= 0.6;
                    }
                    var value = (weapon["damage"] * 0.2) + (weapon["magSize"]) - (weapon["accuracy"]) - (weapon["reloadTime"] * 5);
                    var modifier = 10 / value;
                    if (weapon["type"] == WeaponDatabase.TYPE_SHOTGUN) {
                        modifier *= 0.1;
                    }
                    var unlockLevel = Math.min(Math.round(percent * TacticalWeaponPack.PlayerUtil.MAX_RANK) - Math.round(modifier), TacticalWeaponPack.PlayerUtil.MAX_RANK);
                    weapon["unlockLevel"] = unlockLevel;
                }
            }
            WeaponDatabase.weapons = weapons.sort(TacticalWeaponPack.GameUtil.CompareUnlocks);
            var optics = [
                {
                    id: WeaponDatabase.OPTIC_DEFAULT,
                    name: "None",
                    desc: "Use default sights.",
                    unlockKills: 0
                },
                {
                    id: WeaponDatabase.OPTIC_REFLEX_1,
                    name: "Red Dot",
                    desc: "Tactical red dot sight.",
                    unlockKills: 50
                },
                {
                    id: WeaponDatabase.OPTIC_REFLEX_2,
                    name: "Reflex",
                    desc: "Tactical reflex sight.",
                    unlockKills: 100
                },
                {
                    id: WeaponDatabase.OPTIC_EOTECH_2,
                    name: "Holographic",
                    desc: "Tactical holographic sight.",
                    unlockKills: 150
                },
                {
                    id: WeaponDatabase.OPTIC_ACOG_1,
                    name: "ACOG",
                    desc: "Advanced telescopic scope.",
                    unlockKills: 200
                }
            ];
            WeaponDatabase.optics = optics;
            var mags = [
                {
                    id: WeaponDatabase.MAG_DEFAULT,
                    name: "None",
                    desc: "Use default ammo.",
                    unlockKills: 0
                },
                {
                    id: WeaponDatabase.MAG_FMJ,
                    name: "FMJ",
                    desc: "Increased bullet damage.",
                    unlockKills: 100
                },
                {
                    id: WeaponDatabase.MAG_EXTENDED,
                    name: "Extended",
                    desc: "Larger magazine size.",
                    unlockKills: 200
                },
                {
                    id: WeaponDatabase.MAG_HOLLOWPOINT,
                    name: "Hollow Point",
                    desc: "Increased headshot damage.",
                    unlockKills: 300
                },
                {
                    id: WeaponDatabase.MAG_EXPLOSIVE,
                    name: "Explosive",
                    desc: "Explosive rounds.",
                    unlockKills: 400
                }
            ];
            WeaponDatabase.mags = mags;
            var barrels = [
                {
                    id: WeaponDatabase.BARREL_DEFAULT,
                    name: "None",
                    desc: "No barrel attachment.",
                    unlockHeadshots: 0
                },
                {
                    id: WeaponDatabase.BARREL_LASER,
                    name: "Laser",
                    desc: "Red laser guide for better aiming.",
                    unlockHeadshots: 50
                },
                {
                    id: WeaponDatabase.BARREL_MUZZLE,
                    name: "Muzzle Brake",
                    desc: "Reduces recoil.",
                    unlockHeadshots: 100
                },
                {
                    id: WeaponDatabase.BARREL_M203,
                    name: "M203",
                    desc: "Grenade launcher with 5 grenades.",
                    unlockHeadshots: 150
                }
            ];
            WeaponDatabase.barrels = barrels;
            var bases = [
                {
                    id: WeaponDatabase.BASE_DEFAULT,
                    name: "None",
                    desc: "No camo.",
                    unlockHeadshots: 0
                },
                {
                    id: WeaponDatabase.BASE_WOODLAND,
                    name: "Woodland",
                    desc: "Woodland camo.",
                    unlockHeadshots: 10
                },
                {
                    id: WeaponDatabase.BASE_DIGITAL,
                    name: "Digital",
                    desc: "Digital camo.",
                    unlockHeadshots: 25
                },
                {
                    id: WeaponDatabase.BASE_RED_TIGER,
                    name: "Red Tiger",
                    desc: "Red stripe camo.",
                    unlockHeadshots: 50
                },
                {
                    id: WeaponDatabase.BASE_BLUE_TIGER,
                    name: "Blue Tiger",
                    desc: "Blue stripe camo.",
                    unlockHeadshots: 100
                }
            ];
            WeaponDatabase.bases = bases;
        };
        WeaponDatabase.GetPrimaryWeaponTypes = function () {
            return [
                WeaponDatabase.TYPE_SMG,
                WeaponDatabase.TYPE_RIFLE,
                WeaponDatabase.TYPE_SNIPER,
                WeaponDatabase.TYPE_SHOTGUN,
                WeaponDatabase.TYPE_LMG
            ];
        };
        WeaponDatabase.GetSecondaryWeaponTypes = function () {
            return [
                WeaponDatabase.TYPE_PISTOL,
                WeaponDatabase.TYPE_MACHINE_PISTOL,
                WeaponDatabase.TYPE_LAUNCHER
            ];
        };
        WeaponDatabase.GetAllWeapons = function () {
            return WeaponDatabase.weapons;
        };
        WeaponDatabase.GetWeaponIndex = function (_id) {
            var weapons = WeaponDatabase.weapons;
            for (var i = 0; i < weapons.length; i++) {
                if (weapons[i]["id"] == _id) {
                    return i;
                }
            }
            return -1;
        };
        WeaponDatabase.GetFireModeName = function (_val) {
            if (_val == WeaponDatabase.MODE_AUTO) {
                return "AUTO";
            }
            else if (_val == WeaponDatabase.MODE_BURST) {
                return "BURST";
            }
            else if (_val == WeaponDatabase.MODE_SEMI) {
                return "SEMI";
            }
        };
        WeaponDatabase.GetAllWeaponsByType = function (_type) {
            var arr = [];
            var weapons = WeaponDatabase.weapons;
            for (var i = 0; i < weapons.length; i++) {
                if (weapons[i]["type"] == _type) {
                    arr.push(weapons[i]);
                }
            }
            return arr;
        };
        WeaponDatabase.GetAllWeaponsByUnlockLevel = function (_level) {
            var arr = [];
            var weapons = WeaponDatabase.weapons;
            for (var i = 0; i < weapons.length; i++) {
                if (weapons[i]["unlockLevel"] == _level) {
                    arr.push({ type: "weapon", id: weapons[i]["id"] });
                }
            }
            return arr;
        };
        WeaponDatabase.GetWeapon = function (_id) {
            var weapons = WeaponDatabase.weapons;
            for (var i = 0; i < weapons.length; i++) {
                if (weapons[i]["id"] == _id) {
                    return TacticalWeaponPack.GameUtil.CloneObject(weapons[i]);
                }
            }
            return null;
        };
        WeaponDatabase.GetRandomWeapon = function () {
            var weapons = WeaponDatabase.weapons;
            return TacticalWeaponPack.GameUtil.CloneObject(weapons[TacticalWeaponPack.MathUtil.Random(0, weapons.length - 1)]);
        };
        WeaponDatabase.GetUnlocksForKills = function (_weaponId, _kills) {
            var arr = [];
            var check = [
                WeaponDatabase.GetAllMags(),
                WeaponDatabase.GetAllOptics()
            ];
            for (var i = 0; i < check.length; i++) {
                var cur = check[i];
                for (var j = 0; j < cur.length; j++) {
                    var mod = cur[j];
                    if (mod["unlockKills"] == _kills) {
                        if (WeaponDatabase.CanHaveMod(_weaponId, mod["id"]) && !WeaponDatabase.IsDefaultMod(mod["id"])) {
                            if (arr.indexOf(mod["id"]) < 0) {
                                arr.push(mod["id"]);
                            }
                        }
                    }
                }
            }
            return arr;
        };
        WeaponDatabase.GetUnlocksForHeadshots = function (_weaponId, _kills) {
            var arr = [];
            var check = [
                WeaponDatabase.GetAllBarrels()
            ];
            for (var i = 0; i < check.length; i++) {
                var cur = check[i];
                for (var j = 0; j < cur.length; j++) {
                    var mod = cur[j];
                    if (mod["unlockHeadshots"] == _kills) {
                        if (WeaponDatabase.CanHaveMod(_weaponId, mod["id"]) && !WeaponDatabase.IsDefaultMod(mod["id"])) {
                            if (arr.indexOf(mod["id"]) < 0) {
                                arr.push(mod["id"]);
                            }
                        }
                    }
                }
            }
            return arr;
        };
        WeaponDatabase.GetAllOptics = function () {
            return WeaponDatabase.optics;
        };
        WeaponDatabase.GetAllMags = function () {
            return WeaponDatabase.mags;
        };
        WeaponDatabase.GetAllBarrels = function () {
            return WeaponDatabase.barrels;
        };
        WeaponDatabase.GetAllBases = function () {
            return WeaponDatabase.bases;
        };
        WeaponDatabase.GetMod = function (_id) {
            var search = [WeaponDatabase.optics, WeaponDatabase.mags, WeaponDatabase.barrels];
            for (var i = 0; i < search.length; i++) {
                var cur = search[i];
                for (var j = 0; j < cur.length; j++) {
                    if (cur[j]["id"] == _id) {
                        return cur[j];
                    }
                }
            }
            return null;
        };
        WeaponDatabase.GetModType = function (_id) {
            if (_id.indexOf(WeaponDatabase.MOD_OPTIC) >= 0) {
                return WeaponDatabase.MOD_OPTIC;
            }
            else if (_id.indexOf(WeaponDatabase.MOD_MAG) >= 0) {
                return WeaponDatabase.MOD_MAG;
            }
            else if (_id.indexOf(WeaponDatabase.MOD_BARREL) >= 0) {
                return WeaponDatabase.MOD_BARREL;
            }
            else if (_id.indexOf(WeaponDatabase.MOD_BASE) >= 0) {
                return WeaponDatabase.MOD_BASE;
            }
            return null;
        };
        WeaponDatabase.IsDefaultMod = function (_id) {
            if (!_id) {
                return true;
            }
            if (_id == WeaponDatabase.OPTIC_DEFAULT) {
                return true;
            }
            else if (_id == WeaponDatabase.MAG_DEFAULT) {
                return true;
            }
            else if (_id == WeaponDatabase.BASE_DEFAULT) {
                return true;
            }
            else if (_id == WeaponDatabase.BARREL_DEFAULT) {
                return true;
            }
            return false;
        };
        WeaponDatabase.IsSecondary = function (_weaponId) {
            var data = WeaponDatabase.GetWeapon(_weaponId);
            if (data) {
                if (data["type"] == WeaponDatabase.TYPE_PISTOL || data["type"] == WeaponDatabase.TYPE_MACHINE_PISTOL || data["type"] == WeaponDatabase.TYPE_LAUNCHER) {
                    return true;
                }
            }
            return false;
        };
        WeaponDatabase.CanHaveMod = function (_weaponId, _modId) {
            if (WeaponDatabase.IsDefaultMod(_modId)) {
                return true;
            }
            var weapon = WeaponDatabase.GetWeapon(_weaponId);
            var modType = WeaponDatabase.GetModType(_modId);
            if (_modId == WeaponDatabase.BARREL_M203) {
                if (weapon["type"] != WeaponDatabase.TYPE_RIFLE) {
                    return false;
                }
            }
            if (weapon["type"] == WeaponDatabase.TYPE_LAUNCHER) {
                return false;
            }
            if (WeaponDatabase.IsSecondary(_weaponId)) {
                if (modType == WeaponDatabase.MOD_OPTIC) {
                    return false;
                }
            }
            return true;
        };
        /* Weapons */
        WeaponDatabase.WEAPON_M9 = "m9";
        WeaponDatabase.WEAPON_USP45 = "usp45";
        WeaponDatabase.WEAPON_FIVESEVEN = "fiveseven";
        WeaponDatabase.WEAPON_G17 = "g17";
        WeaponDatabase.WEAPON_DEAGLE = "deagle";
        WeaponDatabase.WEAPON_MAGNUM = "magnum";
        WeaponDatabase.WEAPON_M1911 = "m1911";
        WeaponDatabase.WEAPON_M93R = "m93r";
        WeaponDatabase.WEAPON_G18 = "g18";
        WeaponDatabase.WEAPON_MP1911 = "mp1911";
        WeaponDatabase.WEAPON_USPM = "uspm";
        WeaponDatabase.WEAPON_MP9 = "mp9";
        WeaponDatabase.WEAPON_MP5 = "mp5";
        WeaponDatabase.WEAPON_MP7 = "mp7";
        WeaponDatabase.WEAPON_P90 = "p90";
        WeaponDatabase.WEAPON_AUGPARA = "augpara";
        WeaponDatabase.WEAPON_UMP45 = "ump45";
        WeaponDatabase.WEAPON_AK74U = "ak74u";
        WeaponDatabase.WEAPON_M16A4 = "m16a4";
        WeaponDatabase.WEAPON_M4 = "m4";
        WeaponDatabase.WEAPON_LE6940 = "le6940";
        WeaponDatabase.WEAPON_G36C = "g36c";
        WeaponDatabase.WEAPON_SCARL = "scarl";
        WeaponDatabase.WEAPON_HK416 = "hk416";
        WeaponDatabase.WEAPON_AUG = "aug";
        WeaponDatabase.WEAPON_AK47 = "ak47";
        WeaponDatabase.WEAPON_FAMAS = "famas";
        WeaponDatabase.WEAPON_M40A3 = "m40a3";
        WeaponDatabase.WEAPON_RSASS = "rsass";
        WeaponDatabase.WEAPON_SAMR = "samr";
        WeaponDatabase.WEAPON_MSR = "msr";
        WeaponDatabase.WEAPON_HK417 = "hk417";
        WeaponDatabase.WEAPON_TPR = "tpr";
        WeaponDatabase.WEAPON_M1014 = "m1014";
        WeaponDatabase.WEAPON_M3 = "m3";
        WeaponDatabase.WEAPON_SPAS12 = "spas12";
        WeaponDatabase.WEAPON_MOSSBERG = "mossberg";
        WeaponDatabase.WEAPON_AA12 = "aa12";
        WeaponDatabase.WEAPON_M249 = "m249";
        WeaponDatabase.WEAPON_HAMR = "hamr";
        WeaponDatabase.WEAPON_QBB95 = "qbb95";
        WeaponDatabase.WEAPON_AUGHBAR = "aughbar";
        WeaponDatabase.WEAPON_MG4 = "mg4";
        WeaponDatabase.WEAPON_RPK = "rpk";
        WeaponDatabase.WEAPON_RPG = "rpg";
        WeaponDatabase.WEAPON_M203 = "m203";
        WeaponDatabase.WEAPON_XM25 = "xm25";
        WeaponDatabase.WEAPON_M32 = "m32";
        /* Mods */
        WeaponDatabase.MOD_OPTIC = "optic";
        WeaponDatabase.MOD_MAG = "mag";
        WeaponDatabase.MOD_BARREL = "barrel";
        WeaponDatabase.MOD_BASE = "base";
        /* Base */
        WeaponDatabase.BASE_DEFAULT = "base0000";
        WeaponDatabase.BASE_WOODLAND = "base0001";
        WeaponDatabase.BASE_DIGITAL = "base0002";
        WeaponDatabase.BASE_RED_TIGER = "base0003";
        WeaponDatabase.BASE_BLUE_TIGER = "base0004";
        WeaponDatabase.BASE_FALL = "base0005";
        /* Optics */
        WeaponDatabase.OPTIC_DEFAULT = "optic0000";
        WeaponDatabase.OPTIC_REFLEX_1 = "optic0001";
        WeaponDatabase.OPTIC_REFLEX_2 = "optic0002";
        WeaponDatabase.OPTIC_EOTECH_1 = "optic0003";
        WeaponDatabase.OPTIC_EOTECH_2 = "optic0004";
        WeaponDatabase.OPTIC_ACOG_1 = "optic0005";
        WeaponDatabase.OPTIC_ACOG_2 = "optic0006";
        /* Mag */
        WeaponDatabase.MAG_DEFAULT = "mag0000";
        WeaponDatabase.MAG_FMJ = "mag0001";
        WeaponDatabase.MAG_EXTENDED = "mag0002";
        WeaponDatabase.MAG_HOLLOWPOINT = "mag0003";
        WeaponDatabase.MAG_EXPLOSIVE = "mag0004";
        /* Barrel */
        WeaponDatabase.BARREL_DEFAULT = "barrel0000";
        WeaponDatabase.BARREL_LASER = "barrel0001";
        WeaponDatabase.BARREL_M203 = "barrel0002";
        WeaponDatabase.BARREL_M203_SMALL = "barrel0003";
        WeaponDatabase.BARREL_MUZZLE = "barrel0004";
        /* Pump */
        WeaponDatabase.PUMP_DEFAULT = "pump0000";
        /* Slide */
        WeaponDatabase.SLIDE_DEFAULT = "slide0000";
        /* Types */
        WeaponDatabase.TYPE_PISTOL = "TYPE_PISTOL";
        WeaponDatabase.TYPE_MACHINE_PISTOL = "TYPE_MACHINE_PISTOL";
        WeaponDatabase.TYPE_SMG = "TYPE_SMG";
        WeaponDatabase.TYPE_RIFLE = "TYPE_RIFLE";
        WeaponDatabase.TYPE_SHOTGUN = "TYPE_SHOTGUN";
        WeaponDatabase.TYPE_SNIPER = "TYPE_SNIPER";
        WeaponDatabase.TYPE_LMG = "TYPE_LMG";
        WeaponDatabase.TYPE_LAUNCHER = "TYPE_LAUNCHER";
        /* Modes */
        WeaponDatabase.MODE_AUTO = "MODE_AUTO";
        WeaponDatabase.MODE_BURST = "MODE_BURST";
        WeaponDatabase.MODE_SEMI = "MODE_SEMI";
        /* Rounds */
        WeaponDatabase.ROUND_12G = "12g";
        WeaponDatabase.ROUND_9MM = "9mm";
        WeaponDatabase.ROUND_556MM = "556mm";
        WeaponDatabase.ROUND_762MM = "762mm";
        WeaponDatabase.ROUND_45ACP = "45acp";
        WeaponDatabase.ROUND_50CAL = "50cal";
        WeaponDatabase.ROUND_44 = "50cal";
        WeaponDatabase.ROUND_ROCKET = "rocket";
        WeaponDatabase.ROUND_GRENADE = "grenade";
        return WeaponDatabase;
    }());
    TacticalWeaponPack.WeaponDatabase = WeaponDatabase;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var Engine = /** @class */ (function (_super) {
        __extends(Engine, _super);
        function Engine() {
            var _this = _super.call(this, 1000, 600, Phaser.AUTO, "content", null) || this;
            _this.bInit = false;
            _this.keyMenu = null;
            _this.state.add("BootState", TacticalWeaponPack.State_Boot, true);
            _this.state.add("PreloaderState", TacticalWeaponPack.State_Preloader, false);
            _this.state.add("SponsorState", TacticalWeaponPack.State_Sponsor, false);
            _this.state.add("IntroState", TacticalWeaponPack.State_Intro, false);
            _this.state.add("MenuState", TacticalWeaponPack.State_Menu, false);
            _this.state.add("GameState", TacticalWeaponPack.State_Game, false);
            return _this;
        }
        Engine.prototype.initialize = function () {
            this.ui = this.add.group(null, "ui", true);
            this.achievements = this.add.group(null, "achievements", true);
            this.elements = [];
            this.pendingAchievements = [];
            TacticalWeaponPack.WeaponDatabase.Init();
            TacticalWeaponPack.SkillDatabase.Init();
            TacticalWeaponPack.GameModeDatabase.Init();
            TacticalWeaponPack.AchievementsDatabase.Init();
            TacticalWeaponPack.PlayerUtil.Init();
            this.initAPI();
            this.bInit = true;
        };
        Engine.prototype.initAPI = function () {
            if (this.desiredAPI == "armor_games") {
                if (this.ag) {
                    TacticalWeaponPack.APIUtil.CurrentAPI = TacticalWeaponPack.APIUtil.API_ARMOR_GAMES;
                }
            }
            else if (this.desiredAPI == "newgrounds") {
                if (this.ngio) {
                    TacticalWeaponPack.APIUtil.CurrentAPI = TacticalWeaponPack.APIUtil.API_NEWGROUNDS;
                }
            }
            else if (this.desiredAPI == "kongregate") {
                if (this.kong) {
                    TacticalWeaponPack.APIUtil.CurrentAPI = TacticalWeaponPack.APIUtil.API_KONGREGATE;
                }
            }
            else {
                console.log("Invalid API");
            }
            TacticalWeaponPack.APIUtil.Init();
        };
        Engine.prototype.onEvent = function (_name) {
            console.log("Engine::onEvent " + _name);
            if (_name == "SDK_GAME_START") {
                TacticalWeaponPack.AdUtil.OnResumeGame();
            }
            else if (_name == "SDK_GAME_PAUSE") {
                TacticalWeaponPack.AdUtil.OnPauseGame();
            }
            else if (_name == "AD_CANCELED") {
                TacticalWeaponPack.AdUtil.SetWasCancelled(true);
            }
            else if (_name == "SDK_GDPR_TRACKING") {
                //this event is triggered when your user doesn't want to be tracked
            }
            else if (_name == "SDK_GDPR_TARGETING") {
                //this event is triggered when your user doesn't want personalised targeting of ads and such
            }
        };
        Engine.prototype.restartGame = function () {
            if (this.state.getCurrentState() instanceof TacticalWeaponPack.State_Game) {
                var data = TacticalWeaponPack.GameUtil.GetGameState().getData();
                TacticalWeaponPack.GameUtil.GetGameState().destroyGame();
                this.startGameState(data);
            }
        };
        Engine.prototype.loadSponsor = function () {
            this.state.start("SponsorState", true, false);
            this.onStateChanged();
        };
        Engine.prototype.loadIntro = function () {
            this.state.start("IntroState", true, false);
            this.onStateChanged();
        };
        Engine.prototype.loadMenu = function (_menuId) {
            if (this.state.getCurrentState() instanceof TacticalWeaponPack.State_Game) {
                TacticalWeaponPack.GameUtil.GetGameState().destroyGame();
            }
            TacticalWeaponPack.GameUtil.game.savePlayerData();
            this.state.start("MenuState", true, false, _menuId);
            this.onStateChanged();
        };
        Engine.prototype.getMainMenu = function () {
            if (this.state.getCurrentState() instanceof TacticalWeaponPack.State_Menu) {
                var menuState = this.state.getCurrentState();
                if (menuState) {
                    return menuState.getMainMenu();
                }
            }
            return null;
        };
        Engine.prototype.getSplashMenu = function () {
            if (this.state.getCurrentState() instanceof TacticalWeaponPack.State_Menu) {
                var menuState = this.state.getCurrentState();
                if (menuState) {
                    return menuState.getSplashMenu();
                }
            }
            return null;
        };
        Engine.prototype.openSetKeyMenu = function (_id, _callback, _callbackContext) {
            if (this.keyMenu) {
                this.keyMenu.destroy();
            }
            this.keyMenu = new TacticalWeaponPack.SetKeyMenu(_id, _callback, _callbackContext);
            return this.keyMenu;
        };
        Engine.prototype.onSetKeyMenuDestroyed = function () {
            this.keyMenu = null;
        };
        Engine.prototype.createWindow = function (_data) {
            var window = new TacticalWeaponPack.Window();
            window.setFromData(_data);
            return window;
        };
        Engine.prototype.prepareGame = function (_data) {
            var mainMenu = this.getMainMenu();
            if (mainMenu) {
                mainMenu.setOnCloseCallback(this.createPreGameMenu, this, [_data]);
                mainMenu.close();
            }
        };
        Engine.prototype.createPreGameMenu = function (_data) {
            var menuState = this.state.getCurrentState();
            if (menuState) {
                menuState.loadPreGameMenu(_data);
            }
        };
        Engine.prototype.startGameState = function (_data) {
            this.ui.removeAll(true);
            this.state.start("GameState", true, false, _data);
            this.onStateChanged();
        };
        Engine.prototype.onStateChanged = function () {
            while (this.achievements.length > 0) {
                var child = this.achievements.getAt(0);
                if (child) {
                    child.destroy();
                }
            }
            this.pendingAchievements = [];
        };
        Engine.prototype.pushAchievement = function (_id) {
            this.pendingAchievements.push(_id);
            if (this.pendingAchievements.length == 1) {
                this.showNextAchivement();
            }
        };
        Engine.prototype.showNextAchivement = function () {
            var id = this.pendingAchievements[0];
            var bubble = new TacticalWeaponPack.AchievementBubble();
            var padding = 10;
            bubble.x = this.width - bubble.width - padding;
            bubble.y = padding;
            bubble.setAchievement(id);
            this.achievements.add(bubble);
        };
        Engine.prototype.onAchievementHidden = function () {
            this.pendingAchievements.splice(0, 1);
            if (this.pendingAchievements.length > 0) {
                this.showNextAchivement();
            }
        };
        Engine.prototype.addUIElement = function (_element) {
            this.ui.add(_element);
            this.elements.push(_element);
            this.updateUIBlurs();
        };
        Engine.prototype.updateUIBlurs = function () {
            if (this.ui) {
                var topChild;
                for (var i = 0; i < this.elements.length; i++) {
                    var child = this.elements[i];
                    var bBlur = true;
                    if (i == this.elements.length - 1) {
                        topChild = child;
                        bBlur = false;
                    }
                    this.setBlur(child, bBlur);
                }
                if (topChild) {
                    var curParent = topChild;
                    while (curParent) {
                        this.setBlur(curParent, false);
                        curParent = curParent.parent;
                    }
                }
            }
        };
        Engine.prototype.removeUIElement = function (_element) {
            this.ui.remove(_element);
            var index = this.elements.indexOf(_element);
            if (index >= 0) {
                this.elements.splice(this.elements.indexOf(_element), 1);
            }
            this.updateUIBlurs();
        };
        Engine.prototype.setBlur = function (_item, _bVal) {
            if (_bVal) {
                var blurX = this.add.filter("BlurX");
                var blurY = this.add.filter("BlurY");
                blurX.blur = 18;
                blurY.blur = blurX.blur;
                _item.filters = [blurX, blurY];
            }
            else {
                _item.filters = undefined;
            }
        };
        Engine.prototype.showMouse = function (_bVal) {
            var element = document.getElementById("content");
            if (element) {
                element.style.cursor = _bVal ? "default" : "none";
            }
        };
        Engine.prototype.mouseIsVisible = function () {
            var element = document.getElementById("content");
            if (element) {
                return element.style.cursor == "default";
            }
            return false;
        };
        Engine.prototype.savePlayerData = function () {
            console.log("Save player data");
            var string = JSON.stringify(TacticalWeaponPack.PlayerUtil.player);
            localStorage.setItem("player", string);
            if (TacticalWeaponPack.APIUtil.CanSaveData()) {
                TacticalWeaponPack.APIUtil.SaveData();
            }
        };
        Engine.prototype.getPlayerData = function () {
            return localStorage.getItem("player");
        };
        Engine.prototype.clearPlayerData = function () {
            console.log("Clear player data");
            localStorage.clear();
        };
        return Engine;
    }(Phaser.Game));
    TacticalWeaponPack.Engine = Engine;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var GameMode = /** @class */ (function () {
        function GameMode() {
            this.shotsFired = 0;
            this.shotsHit = 0;
            this.kills = 0;
            this.headshots = 0;
            this.time = 0;
            this.bTimeLimited = false;
            this.bUseXP = true;
            //...
        }
        GameMode.prototype.destroy = function () {
            this.data = null;
        };
        GameMode.prototype.getPlayerSpawnY = function () {
            return TacticalWeaponPack.GameUtil.game.world.height - 260;
        };
        GameMode.prototype.getTime = function () {
            return this.time;
        };
        GameMode.prototype.isTimeLimited = function () {
            return this.bTimeLimited;
        };
        GameMode.prototype.tick = function () {
            if (this.matchIsInProgress()) {
                if (this.bTimeLimited) {
                    if (this.time > 0) {
                        if (this.time <= 600) {
                            if (this.time % 60 == 0) {
                                TacticalWeaponPack.SoundManager.PlayUISound("ui_beep", 0.5);
                            }
                        }
                        this.time--;
                    }
                    else if (this.time == 0) {
                        this.endMatch();
                    }
                }
                else {
                    this.time++;
                }
                var hud = TacticalWeaponPack.GameUtil.GetGameState().getHUD();
                if (hud) {
                    if (this.getId() != TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                        hud.getMiddleInfo().updateTimeText(this.time / 60, this.bTimeLimited);
                    }
                }
            }
        };
        GameMode.prototype.usesXP = function () {
            return this.bUseXP;
        };
        GameMode.prototype.setFromData = function (_data) {
        };
        GameMode.prototype.setId = function (_val) {
            this.id = _val;
        };
        GameMode.prototype.getId = function () {
            return this.id;
        };
        GameMode.prototype.openClassSelectorMenu = function () {
            if (!this.classSelectorMenu) {
                this.classSelectorMenu = new TacticalWeaponPack.ClassSelectorMenu();
            }
            else {
                this.classSelectorMenu.show();
            }
        };
        GameMode.prototype.closeClassSelectorMenu = function () {
            if (this.classSelectorMenu) {
                this.classSelectorMenu.close();
            }
            this.classSelectorMenu.destroy();
            this.classSelectorMenu = null;
        };
        GameMode.prototype.openGameOverMenu = function () {
            if (!this.gameOverMenu) {
                this.gameOverMenu = new TacticalWeaponPack.GameOverMenu();
            }
            else {
                this.gameOverMenu.show();
            }
        };
        GameMode.prototype.closeGameOverMenu = function () {
            if (this.gameOverMenu) {
                this.gameOverMenu.close();
            }
            this.gameOverMenu.destroy();
            this.gameOverMenu = null;
        };
        GameMode.prototype.getShotsFired = function () {
            return this.shotsFired;
        };
        GameMode.prototype.addShotsFired = function () {
            this.shotsFired++;
            this.updateShotsFired();
            TacticalWeaponPack.PlayerUtil.GetRankedData()["shotsFired"]++;
        };
        GameMode.prototype.updateShotsFired = function () {
            if (this.getId() == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ shotsFired: this.shotsFired.toString() });
            }
            else {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: Math.round(this.getAccuracy() * 100) + "%" });
            }
        };
        GameMode.prototype.getShotsHit = function () {
            return this.shotsHit;
        };
        GameMode.prototype.addShotsHit = function () {
            this.shotsHit++;
            if (this.getId() != TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: Math.round(this.getAccuracy() * 100) + "%" });
            }
            TacticalWeaponPack.PlayerUtil.GetRankedData()["shotsHit"]++;
        };
        GameMode.prototype.getKills = function () {
            return this.kills;
        };
        GameMode.prototype.addKills = function () {
            this.kills++;
            if (this.getId() == TacticalWeaponPack.GameModeDatabase.GAME_SNIPER) {
                var sniper = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ targetsRemaining: sniper.getTargetsRemaining() });
            }
            else {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ kills: this.kills });
            }
            TacticalWeaponPack.PlayerUtil.GetRankedData()["kills"]++;
            var playerKills = TacticalWeaponPack.PlayerUtil.GetRankedData()["kills"];
            if (playerKills == 10) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_KILLS_1);
            }
            else if (playerKills == 100) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_KILLS_2);
            }
            else if (playerKills == 1000) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_KILLS_3);
            }
        };
        GameMode.prototype.getHeadshots = function () {
            return this.headshots;
        };
        GameMode.prototype.addHeadshots = function () {
            this.headshots++;
            TacticalWeaponPack.PlayerUtil.GetRankedData()["headshots"]++;
            var playerHeadshots = TacticalWeaponPack.PlayerUtil.GetRankedData()["headshots"];
            if (playerHeadshots == 10) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_HEADSHOTS_1);
            }
            else if (playerHeadshots == 50) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_HEADSHOTS_2);
            }
            else if (playerHeadshots == 100) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_HEADSHOTS_3);
            }
            if (playerHeadshots % TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS == 0) {
                TacticalWeaponPack.GameUtil.GetGameState().getHUD().addRankNotifier({
                    type: "challenge",
                    text: "Get " + TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS + " headshots"
                });
                var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                TacticalWeaponPack.GameUtil.GetGameState().getHUD().addXPNotifier(player.x, player.y, 100, false);
                TacticalWeaponPack.PlayerUtil.AddXP(100);
            }
        };
        GameMode.prototype.getAccuracy = function () {
            var accuracy = this.shotsHit / this.shotsFired;
            if (isNaN(accuracy)) {
                return 0;
            }
            return Math.min(accuracy, 1);
        };
        GameMode.prototype.setMatchIsWaitingToStart = function () {
            this.state = GameMode.STATE_WAITING_TO_START;
            this.handleMatchIsWaitingToStart();
        };
        GameMode.prototype.prepareGame = function () {
            this.state = GameMode.STATE_WAITING_PRE_MATCH;
            if (this.getId() == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ shotsFired: "0" });
            }
            else {
                TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ accuracy: "0%" });
            }
        };
        GameMode.prototype.startMatch = function () {
            this.state = GameMode.STATE_IN_PROGRESS;
            this.handleMatchHasStarted();
        };
        GameMode.prototype.endMatch = function () {
            this.state = GameMode.STATE_WAITING_POST_MATCH;
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().getCrosshair().hide();
            this.handleMatchHasEnded();
        };
        GameMode.prototype.handleMatchIsWaitingToStart = function () {
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().setBlockerVisible(true);
            this.updateShotsFired();
            TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ kills: "0" });
        };
        GameMode.prototype.handleMatchHasStarted = function () {
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().setBlockerVisible(false);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_game_start");
        };
        GameMode.prototype.handleMatchHasEnded = function () {
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().setBlockerVisible(true);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_game_end");
            var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn().onMatchEnded();
        };
        GameMode.prototype.matchIsInProgress = function () {
            return this.state == GameMode.STATE_IN_PROGRESS;
        };
        GameMode.prototype.matchHasEnded = function () {
            return this.state == GameMode.STATE_WAITING_POST_MATCH;
        };
        GameMode.STATE_WAITING_TO_START = "STATE_WAITING_TO_START";
        GameMode.STATE_WAITING_PRE_MATCH = "STATE_WAITING_PRE_MATCH";
        GameMode.STATE_IN_PROGRESS = "STATE_IN_PROGRESS";
        GameMode.STATE_WAITING_POST_MATCH = "STATE_WAITING_POST_MATCH";
        GameMode.RESULT_WIN = "RESULT_WIN";
        GameMode.RESULT_LOSS = "RESULT_LOSS";
        return GameMode;
    }());
    TacticalWeaponPack.GameMode = GameMode;
    var GameMode_Range = /** @class */ (function (_super) {
        __extends(GameMode_Range, _super);
        function GameMode_Range() {
            var _this = _super.call(this) || this;
            _this.bUseXP = false;
            return _this;
        }
        GameMode_Range.prototype.handleMatchIsWaitingToStart = function () {
            _super.prototype.handleMatchIsWaitingToStart.call(this);
            var char = TacticalWeaponPack.GameUtil.GetGameState().createPlayerCharacter(this.getPlayerSpawnY());
            var weapon = TacticalWeaponPack.WeaponDatabase.GetRandomWeapon();
            char.addInventoryItem(weapon);
            for (var i = 0; i < 6; i++) {
                TacticalWeaponPack.GameUtil.GetGameState().createTarget((char.x + 350) + (100 * i), char.y - 10, TacticalWeaponPack.Target.TYPE_ROPE);
            }
            TacticalWeaponPack.GameUtil.GetGameState().createTarget((char.x + 350) + 100, char.y - 250, TacticalWeaponPack.Target.TYPE_ROTATOR);
            TacticalWeaponPack.GameUtil.GetGameState().createTarget((char.x + 350) + 400, char.y - 250, TacticalWeaponPack.Target.TYPE_ROTATOR);
            this.startMatch();
        };
        GameMode_Range.prototype.handleMatchHasStarted = function () {
            _super.prototype.handleMatchHasStarted.call(this);
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().getKeyInfo().show();
        };
        return GameMode_Range;
    }(GameMode));
    TacticalWeaponPack.GameMode_Range = GameMode_Range;
    var RankedGameMode = /** @class */ (function (_super) {
        __extends(RankedGameMode, _super);
        function RankedGameMode() {
            var _this = _super.call(this) || this;
            _this.preTimer = 240;
            if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                _this.preTimer = 60;
            }
            return _this;
        }
        RankedGameMode.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.state == GameMode.STATE_WAITING_PRE_MATCH) {
                if (this.preTimer > 0) {
                    if (this.preTimer % 60 == 0) {
                        var seconds = this.preTimer / 60;
                        if (seconds <= 3) {
                            TacticalWeaponPack.GameUtil.GetGameState().getHUD().addCountdownText((this.preTimer / 60).toString());
                        }
                    }
                    this.preTimer--;
                }
                else if (this.preTimer == 0) {
                    TacticalWeaponPack.GameUtil.GetGameState().getHUD().addCountdownText("GO");
                    this.startMatch();
                }
            }
        };
        RankedGameMode.prototype.addShotsFired = function () {
            _super.prototype.addShotsFired.call(this);
            TacticalWeaponPack.PlayerUtil.GetRankedData()["shotsFired_ranked"]++;
            var playerShotsFired = TacticalWeaponPack.PlayerUtil.GetRankedData()["shotsFired_ranked"];
            if (playerShotsFired % TacticalWeaponPack.PlayerUtil.CHALLENGE_SHOTS_FIRED == 0) {
                TacticalWeaponPack.GameUtil.GetGameState().getHUD().addRankNotifier({
                    type: "challenge",
                    text: "Fire " + TacticalWeaponPack.PlayerUtil.CHALLENGE_SHOTS_FIRED + " shots"
                });
                TacticalWeaponPack.PlayerUtil.OnChallengeComplete();
            }
        };
        RankedGameMode.prototype.addKills = function () {
            _super.prototype.addKills.call(this);
            TacticalWeaponPack.PlayerUtil.GetRankedData()["kills_ranked"]++;
            var playerKills = TacticalWeaponPack.PlayerUtil.GetRankedData()["kills_ranked"];
            if (playerKills % TacticalWeaponPack.PlayerUtil.CHALLENGE_KILLS == 0) {
                TacticalWeaponPack.GameUtil.GetGameState().getHUD().addRankNotifier({
                    type: "challenge",
                    text: "Get " + TacticalWeaponPack.PlayerUtil.CHALLENGE_KILLS + " kills"
                });
                TacticalWeaponPack.PlayerUtil.OnChallengeComplete();
            }
        };
        RankedGameMode.prototype.addHeadshots = function () {
            _super.prototype.addHeadshots.call(this);
            TacticalWeaponPack.PlayerUtil.GetRankedData()["headshots_ranked"]++;
            var playerHeadshots = TacticalWeaponPack.PlayerUtil.GetRankedData()["headshots_ranked"];
            if (playerHeadshots % TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS == 0) {
                TacticalWeaponPack.GameUtil.GetGameState().getHUD().addRankNotifier({
                    type: "challenge",
                    text: "Get " + TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS + " kills"
                });
                TacticalWeaponPack.PlayerUtil.OnChallengeComplete();
            }
        };
        RankedGameMode.prototype.handleMatchIsWaitingToStart = function () {
            _super.prototype.handleMatchIsWaitingToStart.call(this);
            this.openClassSelectorMenu();
        };
        RankedGameMode.prototype.handleMatchHasEnded = function () {
            _super.prototype.handleMatchHasEnded.call(this);
            var timer = TacticalWeaponPack.GameUtil.game.time.create();
            timer.add(1000, this.openGameOverMenu, this);
            timer.start();
        };
        return RankedGameMode;
    }(GameMode));
    TacticalWeaponPack.RankedGameMode = RankedGameMode;
    var GameMode_MultiShooter = /** @class */ (function (_super) {
        __extends(GameMode_MultiShooter, _super);
        function GameMode_MultiShooter() {
            var _this = _super.call(this) || this;
            _this.ticker = 0;
            _this.creationMod = 45;
            _this.bTimeLimited = true;
            _this.time = 3600;
            return _this;
        }
        GameMode_MultiShooter.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.matchIsInProgress()) {
                this.ticker++;
                if (this.ticker >= this.creationMod) {
                    this.ticker = 0;
                    this.createTarget();
                }
            }
        };
        GameMode_MultiShooter.prototype.createTarget = function () {
            if (TacticalWeaponPack.GameUtil.GetGameState().getNumLivingTargets() < TacticalWeaponPack.GameUtil.GetGameState().getMaxPawns()) {
                var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                var targetType = TacticalWeaponPack.Target.TYPE_DEFAULT;
                var rand = TacticalWeaponPack.MathUtil.Random(1, 4);
                if (rand == 1) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROPE;
                }
                else if (rand == 2) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROTATOR;
                }
                var target = TacticalWeaponPack.GameUtil.GetGameState().createTarget(TacticalWeaponPack.MathUtil.Random(TacticalWeaponPack.GameUtil.game.world.width * 0.2, TacticalWeaponPack.GameUtil.game.world.width * 0.8), TacticalWeaponPack.MathUtil.Random(200, TacticalWeaponPack.GameUtil.game.world.height - 150), targetType);
                target.setDestroyTimer(TacticalWeaponPack.MathUtil.Random(10, 100) / 10);
                target.enableDestroyTimer();
            }
        };
        return GameMode_MultiShooter;
    }(RankedGameMode));
    TacticalWeaponPack.GameMode_MultiShooter = GameMode_MultiShooter;
    var GameMode_TimeAttack = /** @class */ (function (_super) {
        __extends(GameMode_TimeAttack, _super);
        function GameMode_TimeAttack() {
            var _this = _super.call(this) || this;
            _this.ticker = 0;
            _this.creationMod = 15;
            _this.bTimeLimited = true;
            _this.time = 1800;
            return _this;
        }
        GameMode_TimeAttack.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.matchIsInProgress()) {
                this.ticker++;
                if (this.ticker >= this.creationMod) {
                    this.ticker = 0;
                    this.createTarget();
                }
            }
        };
        GameMode_TimeAttack.prototype.createTarget = function () {
            if (TacticalWeaponPack.GameUtil.GetGameState().getNumLivingTargets() < TacticalWeaponPack.GameUtil.GetGameState().getMaxPawns()) {
                var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                var targetType = TacticalWeaponPack.Target.TYPE_DEFAULT;
                var rand = TacticalWeaponPack.MathUtil.Random(1, 7);
                if (rand == 1) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROPE;
                }
                else if (rand == 2) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROTATOR;
                }
                var target = TacticalWeaponPack.GameUtil.GetGameState().createTarget(TacticalWeaponPack.MathUtil.Random(TacticalWeaponPack.GameUtil.game.world.width * 0.2, TacticalWeaponPack.GameUtil.game.world.width * 0.8), TacticalWeaponPack.MathUtil.Random(200, TacticalWeaponPack.GameUtil.game.world.height - 150), targetType);
            }
        };
        return GameMode_TimeAttack;
    }(RankedGameMode));
    TacticalWeaponPack.GameMode_TimeAttack = GameMode_TimeAttack;
    var GameMode_Sniper = /** @class */ (function (_super) {
        __extends(GameMode_Sniper, _super);
        function GameMode_Sniper() {
            var _this = _super.call(this) || this;
            _this.ticker = 0;
            _this.creationMod = 60;
            _this.targetsRemaining = 0;
            _this.targetsSpawned = 0;
            TacticalWeaponPack.GameUtil.GetGameState().setMaxPawns(5);
            _this.targetsRemaining = GameMode_Sniper.NUM_TARGETS;
            return _this;
        }
        GameMode_Sniper.prototype.handleMatchIsWaitingToStart = function () {
            _super.prototype.handleMatchIsWaitingToStart.call(this);
            TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().getGameInfo().customUpdate({ targetsRemaining: this.getTargetsRemaining() });
        };
        GameMode_Sniper.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.matchIsInProgress()) {
                if (this.targetsRemaining > 0 && this.targetsSpawned < GameMode_Sniper.NUM_TARGETS) {
                    this.ticker++;
                    if (this.ticker >= this.creationMod) {
                        this.ticker = 0;
                        this.createTarget();
                    }
                }
            }
        };
        GameMode_Sniper.prototype.addKills = function () {
            this.targetsRemaining--;
            _super.prototype.addKills.call(this);
            if (this.targetsRemaining == 0) {
                this.endMatch();
            }
        };
        GameMode_Sniper.prototype.createTarget = function () {
            if (TacticalWeaponPack.GameUtil.GetGameState().getNumLivingTargets() < TacticalWeaponPack.GameUtil.GetGameState().getMaxPawns()) {
                var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                var targetType = TacticalWeaponPack.Target.TYPE_DEFAULT;
                var rand = TacticalWeaponPack.MathUtil.Random(1, 4);
                if (rand == 1) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROPE;
                }
                else if (rand == 2) {
                    targetType = TacticalWeaponPack.Target.TYPE_ROTATOR;
                }
                var target = TacticalWeaponPack.GameUtil.GetGameState().createTarget(TacticalWeaponPack.MathUtil.Random(TacticalWeaponPack.GameUtil.game.world.width * 0.6, TacticalWeaponPack.GameUtil.game.world.width * 0.9), TacticalWeaponPack.MathUtil.Random(200, TacticalWeaponPack.GameUtil.game.world.height - 150), targetType);
                this.targetsSpawned++;
            }
        };
        GameMode_Sniper.prototype.getTargetsRemaining = function () {
            return this.targetsRemaining;
        };
        GameMode_Sniper.NUM_TARGETS = 50;
        return GameMode_Sniper;
    }(RankedGameMode));
    TacticalWeaponPack.GameMode_Sniper = GameMode_Sniper;
    var GameMode_Defender = /** @class */ (function (_super) {
        __extends(GameMode_Defender, _super);
        function GameMode_Defender() {
            var _this = _super.call(this) || this;
            _this.ticker = 0;
            _this.creationMod = 60;
            _this.speedMin = 0;
            _this.speedMax = 0;
            _this.maxSpeed = 100;
            _this.health = 100;
            _this.healthMax = 100;
            _this.speedMin = 2;
            _this.speedMax = 15;
            TacticalWeaponPack.GameUtil.GetGameState().setMaxPawns(10);
            return _this;
        }
        GameMode_Defender.prototype.destroy = function () {
            this.baseImage = null;
            _super.prototype.destroy.call(this);
        };
        GameMode_Defender.prototype.addDamage = function (_val, _pawn) {
            if (this.matchIsInProgress()) {
                this.health = Math.max(0, this.health - _val);
                TacticalWeaponPack.GameUtil.GetGameState().shakeCamera(_val);
                TacticalWeaponPack.SoundManager.PlayWorldSound("explosion", _pawn.x, _pawn.y, 3);
                this.updateHealth();
                if (this.health <= 0) {
                    this.endMatch();
                }
            }
        };
        GameMode_Defender.prototype.updateHealth = function () {
            var healthPercentage = this.getHealthPercentage();
            TacticalWeaponPack.GameUtil.GetGameState().getHUD().getMiddleInfo().updateHealthBar(healthPercentage);
            if (this.baseImage) {
                var interp = Phaser.Color.linearInterpolation([0xCC0000, 0xFF9933, 0x00CC00], healthPercentage);
                this.baseImage.tint = interp;
            }
        };
        GameMode_Defender.prototype.getHealth = function () {
            return this.health;
        };
        GameMode_Defender.prototype.getHealthPercentage = function () {
            return Math.max(0, this.health / this.healthMax);
        };
        GameMode_Defender.prototype.getSpeedMin = function () {
            return this.speedMin;
        };
        GameMode_Defender.prototype.getSpeedMax = function () {
            return this.speedMax;
        };
        GameMode_Defender.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.matchIsInProgress()) {
                if (this.time % 900 == 0) {
                    this.speedMin = Math.min(this.maxSpeed, this.speedMin + 4);
                    this.speedMax = Math.min(this.maxSpeed, this.speedMax + 4);
                    this.creationMod = Math.max(1, this.creationMod - 1);
                }
                this.ticker++;
                if (this.ticker >= this.creationMod) {
                    this.ticker = 0;
                    this.createTarget();
                }
            }
        };
        GameMode_Defender.prototype.createTarget = function () {
            if (TacticalWeaponPack.GameUtil.GetGameState().getNumLivingTargets() < TacticalWeaponPack.GameUtil.GetGameState().getMaxPawns()) {
                var player = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                var target = TacticalWeaponPack.GameUtil.GetGameState().createTarget(TacticalWeaponPack.GameUtil.game.world.width * 0.9, TacticalWeaponPack.MathUtil.Random(200, TacticalWeaponPack.GameUtil.game.world.height - 150), TacticalWeaponPack.Target.TYPE_ATTACKER);
            }
        };
        GameMode_Defender.prototype.handleMatchIsWaitingToStart = function () {
            _super.prototype.handleMatchIsWaitingToStart.call(this);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 1);
            gfx.drawRect(0, 0, 50, TacticalWeaponPack.GameUtil.game.world.height);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(gfx, TacticalWeaponPack.State_Game.INDEX_WALLS);
            this.baseImage = TacticalWeaponPack.GameUtil.game.add.image(0, 0, gfx.generateTexture());
            this.baseImage.alpha = 0.2;
            gfx.destroy();
            var tween = TacticalWeaponPack.GameUtil.game.add.tween(this.baseImage).to({ alpha: 0.1 }, 500, Phaser.Easing.Exponential.InOut, true, 0, Number.MAX_VALUE, true);
            this.updateHealth();
        };
        GameMode_Defender.prototype.handleMatchHasEnded = function () {
            _super.prototype.handleMatchHasEnded.call(this);
            var pawns = TacticalWeaponPack.GameUtil.GetGameState().getPawns();
            for (var i = 0; i < pawns.length; i++) {
                var pawn = pawns[i];
                if (!pawn.isPlayer() && pawn.isAlive()) {
                    //pawn.triggerDestroy();
                    pawn.getBody().angularVelocity += TacticalWeaponPack.MathUtil.Random(-50, 50);
                    pawn.getBody().gravityScale = 1;
                }
            }
        };
        GameMode_Defender.prototype.getPlayerSpawnY = function () {
            return TacticalWeaponPack.GameUtil.game.world.height * 0.5;
        };
        return GameMode_Defender;
    }(RankedGameMode));
    TacticalWeaponPack.GameMode_Defender = GameMode_Defender;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var WorldObject = /** @class */ (function (_super) {
        __extends(WorldObject, _super);
        function WorldObject(_id, _x, _y, _rotation) {
            if (_rotation === void 0) { _rotation = 0; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.destroyTimerMax = 60;
            _this.destroyTimer = 60;
            _this.bDestroyTimerEnabled = false;
            _this.bPendingDestroy = false;
            _this.id = _id;
            _this.x = _x;
            _this.y = _y;
            _this.rotation = _rotation;
            _this.bodies = [];
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this);
            return _this;
        }
        WorldObject.prototype.destroy = function () {
            this.destroyAllBodies();
            this.bodies = null;
            TacticalWeaponPack.GameUtil.GetGameState().removeFromWorld(this);
            _super.prototype.destroy.call(this);
        };
        WorldObject.prototype.getDestroyTimer = function () {
            return this.destroyTimer;
        };
        WorldObject.prototype.getDestroyTimerMax = function () {
            return this.destroyTimerMax;
        };
        WorldObject.prototype.tick = function () {
            if (this.body) {
                this.x = this.body.x;
                this.y = this.body.y;
                if (!this.body.fixedRotation) {
                    this.rotation = this.body.rotation;
                }
            }
            if (this.bDestroyTimerEnabled) {
                if (this.destroyTimer > 0) {
                    this.destroyTimer--;
                }
                else {
                    this.triggerDestroy();
                }
            }
        };
        WorldObject.prototype.onMatchEnded = function () {
            return;
        };
        WorldObject.prototype.onHit = function (_obj, _data) {
            return;
        };
        WorldObject.prototype.rotateAroundPoint = function (_x, _y, angle, _bodies) {
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);
            for (var i = 0; i < _bodies.length; i++) {
                var body = _bodies[i];
                var distX = body.x - _x;
                var distY = body.y - _y;
                body.x = cosAngle * distX - sinAngle * distY + _x;
                body.y = cosAngle * distY + sinAngle * distX + _y;
                body.rotation = angle;
            }
        };
        WorldObject.prototype.addBody = function (_body, _data) {
            if (_data === void 0) { _data = null; }
            var obj = _data;
            if (!obj) {
                obj = {};
            }
            obj["worldObject"] = this;
            _body.data.SetUserData(obj);
            this.bodies.push(_body);
        };
        WorldObject.prototype.updateUserData = function (_body, _mc) {
            var obj = {};
            obj["worldObject"] = this;
            obj["mc"] = _mc;
            _body.data.SetUserData(obj);
        };
        WorldObject.prototype.destroyAllBodies = function () {
            while (this.bodies.length > 0) {
                this.removeBody(this.bodies[0]);
                this.bodies.splice(0, 1);
            }
            this.body = null;
        };
        WorldObject.prototype.bodyCallback = function (_body1, _body2, _fixture1, _fixture2, _begin, _contact) {
            if (!_begin) {
                return;
            }
            var objA = _body1.data.GetUserData() ? _body1.data.GetUserData()["worldObject"] : null;
            var objB = _body2.data.GetUserData() ? _body2.data.GetUserData()["worldObject"] : null;
            if (objA || objB) {
                //GameUtil.GetGameState().addCollisionToQueue(objA, objB);
                TacticalWeaponPack.GameUtil.GetGameState().addCollisionDataToQueue(_body1.data.GetUserData(), _body2.data.GetUserData());
            }
        };
        WorldObject.prototype.removeBody = function (_body) {
            if (!_body) {
                return;
            }
            if (_body.sprite) {
                _body.sprite.physicsEnabled = false;
                _body.sprite.destroy();
                _body.sprite = null;
            }
            TacticalWeaponPack.GameUtil.GetGameState().destroyBody(_body);
        };
        WorldObject.prototype.getBody = function () {
            return this.body;
        };
        WorldObject.prototype.triggerDestroy = function () {
            TacticalWeaponPack.GameUtil.GetGameState().flagObjectForDestruction(this);
        };
        WorldObject.prototype.enableDestroyTimer = function () {
            this.bDestroyTimerEnabled = true;
        };
        WorldObject.prototype.destroyTimerIsEnabled = function () {
            return this.bDestroyTimerEnabled;
        };
        WorldObject.prototype.setDestroyTimer = function (_seconds) {
            this.destroyTimer = Math.round(_seconds * 60);
            this.destroyTimerMax = this.destroyTimer;
        };
        WorldObject.prototype.setId = function (_val) {
            this.id = _val;
        };
        WorldObject.prototype.getId = function () {
            return this.id;
        };
        WorldObject.prototype.isPendingDestroy = function () {
            return this.bPendingDestroy;
        };
        WorldObject.prototype.setPendingDestroy = function () {
            this.bPendingDestroy = true;
            this.visible = false;
        };
        return WorldObject;
    }(Phaser.Group));
    TacticalWeaponPack.WorldObject = WorldObject;
    var Actor = /** @class */ (function (_super) {
        __extends(Actor, _super);
        function Actor(_id, _x, _y) {
            var _this = _super.call(this, _id, _x, _y) || this;
            _this.healthMax = 100;
            _this.health = 100;
            return _this;
        }
        Actor.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        Actor.prototype.takeDamage = function (_damageAmount, _instigator, _causer, _damageType, _bHeadshot) {
            this.onTakeDamage(_damageAmount, _instigator, _causer, _damageType, _bHeadshot);
            return _damageAmount;
        };
        Actor.prototype.onTakeDamage = function (_damageAmount, _instigator, _causer, _damageType, _bHeadshot) {
            if (!this.isAlive()) {
                return;
            }
            if (!TacticalWeaponPack.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
                return;
            }
            var realDamage = _damageAmount;
            if (_bHeadshot) {
                realDamage *= 2;
            }
            this.addHealth(-realDamage);
            if (this.health <= 0) {
                this.die(realDamage, _instigator, _causer, _damageType, _bHeadshot);
            }
        };
        Actor.prototype.die = function (_killingDamage, _killer, _causer, _damageType, _bHeadshot) {
            this.onDeath(_killingDamage, _killer, _causer, _damageType, _bHeadshot);
        };
        Actor.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
            return;
        };
        Actor.prototype.addHealth = function (_val) {
            this.health = Math.max(0, Math.min(this.health + _val, this.healthMax));
        };
        Actor.prototype.getHealthMax = function () {
            return this.healthMax;
        };
        Actor.prototype.getHealth = function () {
            return this.health;
        };
        Actor.prototype.getHealthPercent = function () {
            return this.health / this.healthMax;
        };
        Actor.prototype.isAlive = function () {
            return this.health > 0;
        };
        return Actor;
    }(WorldObject));
    TacticalWeaponPack.Actor = Actor;
    var Pawn = /** @class */ (function (_super) {
        __extends(Pawn, _super);
        function Pawn(_id, _x, _y, _controller) {
            var _this = _super.call(this, _id, _x, _y) || this;
            _this.team = 0;
            _this.speed = 1;
            _this.lookTarget = 0;
            _this.lookSpeed = 0.2;
            _this.bRegenHealth = true;
            _this.bWantsToMove = false;
            _this.bTargetable = true;
            _this.controller = _controller;
            if (_this.controller) {
                _this.controller.possess(_this);
            }
            if (_this.isPlayer()) {
                //...
            }
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this, TacticalWeaponPack.State_Game.INDEX_PAWNS);
            TacticalWeaponPack.GameUtil.GetGameState().onPawnAdded(_this);
            return _this;
        }
        Pawn.prototype.destroy = function () {
            TacticalWeaponPack.GameUtil.GetGameState().onPawnRemoved(this);
            this.onUnPossess();
            this.controller = null;
            this.groundSensor = null;
            _super.prototype.destroy.call(this);
        };
        Pawn.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
            _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
            _instigator.onPawnKill(this.controller, _causer, _damageType, _bHeadshot);
        };
        Pawn.prototype.suicide = function () {
            this.takeDamage(this.healthMax, this.controller, this, TacticalWeaponPack.DamageType.DAMAGE_TYPE_WORLD, false);
        };
        Pawn.prototype.getSpeed = function () {
            return this.speed;
        };
        Pawn.prototype.updateHUD = function () {
            return;
        };
        Pawn.prototype.createBody = function () {
            return;
        };
        Pawn.prototype.createDeadBody = function () {
            return;
        };
        Pawn.prototype.onPossess = function (_controller) {
            this.controller = _controller;
            var bIsPlayer = (_controller instanceof TacticalWeaponPack.PlayerController);
        };
        Pawn.prototype.onUnPossess = function () {
            if (this.controller && this.controller.getPawn() == this) {
                this.controller.unPossess();
            }
            this.controller = null;
        };
        Pawn.prototype.getController = function () {
            return this.controller;
        };
        Pawn.prototype.getPlayerController = function () {
            return this.controller instanceof TacticalWeaponPack.PlayerController ? this.controller : null;
        };
        Pawn.prototype.isPlayer = function () {
            return this.getPlayerController() != null;
        };
        Pawn.prototype.lookAt = function (_x, _y) {
            var distX = _x - this.x;
            var distY = _y - this.y;
            var angle = Math.atan2(distY, distX);
            this.lookTarget = angle;
            return angle;
        };
        Pawn.prototype.moveLeft = function () {
            if (this.body) {
                this.body.moveLeft(this.speed);
            }
        };
        Pawn.prototype.moveRight = function () {
            if (this.body) {
                this.body.moveRight(this.speed);
            }
        };
        Pawn.prototype.jump = function () {
            return;
        };
        return Pawn;
    }(Actor));
    TacticalWeaponPack.Pawn = Pawn;
    var Rope = /** @class */ (function (_super) {
        __extends(Rope, _super);
        function Rope(_x, _y, _type) {
            var _this = _super.call(this, null, _x, _y, 0) || this;
            _this.ropeType = _type;
            _this.createBody();
            _this.setDestroyTimer(5);
            return _this;
        }
        Rope.prototype.destroy = function () {
            this.rope = null;
            _super.prototype.destroy.call(this);
        };
        Rope.prototype.hide = function () {
            var tween = this.game.add.tween(this.rope).to({ alpha: TacticalWeaponPack.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Exponential.In, true);
            this.enableDestroyTimer();
            this.getBody().gravityScale = 1;
        };
        Rope.prototype.createBody = function () {
            if (this.ropeType == Rope.TYPE_DEFAULT) {
                /*
                var ropeHeight = Rope.HEIGHT;
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x4D4844, 1);
                gfx.lineStyle(1, 0x000000, 0.5);
                gfx.drawRect(0, 0, Rope.WIDTH, ropeHeight);
                this.rope = this.game.add.sprite(this.x, this.y, gfx.generateTexture());
                GameUtil.GetGameState().addToWorld(this.rope, State_Game.INDEX_WALLS);
                gfx.destroy();
                */
                this.rope = this.game.add.sprite(this.x, this.y, "atlas_objects", "rope_default");
                TacticalWeaponPack.GameUtil.GetGameState().addToWorld(this.rope, TacticalWeaponPack.State_Game.INDEX_WALLS);
            }
            else if (this.ropeType == Rope.TYPE_BASE) {
                var ropeHeight = Rope.HEIGHT;
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x222222);
                gfx.lineStyle(1, 0x000000, 0.5);
                gfx.drawCircle(0, 0, ropeHeight);
                this.rope = this.game.add.sprite(this.x, this.y, gfx.generateTexture());
                TacticalWeaponPack.GameUtil.GetGameState().addToWorld(this.rope, TacticalWeaponPack.State_Game.INDEX_WALLS);
                gfx.destroy();
            }
            else if (this.ropeType == Rope.TYPE_HOLDER) {
                /*
                var ropeHeight = Rope.HEIGHT * 3;
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x808080, 1);
                gfx.lineStyle(1, 0x000000, 0.5);
                gfx.drawRect(0, 0, Rope.WIDTH, ropeHeight);
                this.rope = this.game.add.sprite(this.x, this.y, gfx.generateTexture());
                GameUtil.GetGameState().addToWorld(this.rope, State_Game.INDEX_WALLS);
                gfx.destroy();
                */
                this.rope = this.game.add.sprite(this.x, this.y, "atlas_objects", "rope_holder");
                TacticalWeaponPack.GameUtil.GetGameState().addToWorld(this.rope, TacticalWeaponPack.State_Game.INDEX_WALLS);
            }
            this.game.physics.box2d.enable(this.rope, false);
            var ropeBody = this.rope.body;
            ropeBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_SHELLS);
            ropeBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_OBJECTS);
            ropeBody.linearDamping = 1;
            ropeBody.angularDamping = 1;
            ropeBody.restitution = 0;
            this.addBody(ropeBody);
            this.body = ropeBody;
        };
        Rope.TYPE_DEFAULT = "TYPE_DEFAULT";
        Rope.TYPE_HOLDER = "TYPE_HOLDER";
        Rope.TYPE_BASE = "TYPE_BASE";
        Rope.HEIGHT = 20;
        Rope.WIDTH = 5;
        return Rope;
    }(WorldObject));
    TacticalWeaponPack.Rope = Rope;
    var Target = /** @class */ (function (_super) {
        __extends(Target, _super);
        function Target(_id, _x, _y, _controller, _type) {
            var _this = _super.call(this, _id, _x, _y, _controller) || this;
            _this.targetType = null;
            _this.setType(_type);
            _this.createBody();
            _this.setDestroyTimer(5);
            return _this;
        }
        Target.prototype.destroy = function () {
            if (this.ropeBaseJoint) {
                TacticalWeaponPack.GameUtil.GetGameState().destroyJoint(this.ropeBaseJoint);
            }
            this.ropeBaseJoint = null;
            if (this.ropes) {
                this.hideRopes();
            }
            this.ropes = null;
            this.bodyHead = null;
            this.bodyBody = null;
            this.jointHead = null;
            _super.prototype.destroy.call(this);
        };
        Target.prototype.setType = function (_val) {
            this.targetType = _val;
            if (this.targetType == Target.TYPE_ATTACKER) {
                var defender = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
                this.speed = TacticalWeaponPack.MathUtil.Random(defender.getSpeedMin(), defender.getSpeedMax()) * 0.1;
            }
        };
        Target.prototype.getType = function () {
            return this.targetType;
        };
        Target.prototype.setRopeBaseJoint = function (_joint) {
            this.ropeBaseJoint = _joint;
        };
        Target.prototype.setRopes = function (_ropes) {
            this.ropes = _ropes;
        };
        Target.prototype.hideRopes = function () {
            this.ropes[0].getBody().static = false;
            for (var i = 0; i < this.ropes.length; i++) {
                this.ropes[i].hide();
            }
            this.ropes = null;
        };
        Target.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_target_hit", this.x, this.y, 5, 0.1);
        };
        Target.prototype.onDeath = function (_killingDamage, _instigator, _causer, _damageType, _bHeadshot) {
            _super.prototype.onDeath.call(this, _killingDamage, _instigator, _causer, _damageType, _bHeadshot);
            if (this.bPendingDestroy) {
                return;
            }
            this.setGravityScale(1);
            TacticalWeaponPack.GameUtil.GetGameState().destroyJoint(this.jointHead);
            var gib1;
            var gib2;
            var gib3;
            var tintColour = this.body.sprite.tint;
            if (_bHeadshot || !this.bodyBody) {
                gib1 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_1);
                gib2 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_2);
                gib3 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyHead.x, this.bodyHead.y, this.bodyHead.rotation, Debris.DEBRIS_TARGET_HEAD_GIB_3);
                this.removeBody(this.bodyHead);
            }
            else {
                gib1 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_1);
                gib2 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_2);
                gib3 = TacticalWeaponPack.GameUtil.GetGameState().createDebris(this.bodyBody.x, this.bodyBody.y, this.bodyBody.rotation, Debris.DEBRIS_TARGET_BODY_GIB_3);
                this.removeBody(this.bodyBody);
            }
            var gibs = [gib1, gib2, gib3];
            for (var i = 0; i < gibs.length; i++) {
                var gib = gibs[i];
                gib.getBody().sprite.tint = tintColour;
                gib.getBody().applyForce(20, -TacticalWeaponPack.MathUtil.Random(50, 200));
            }
            //this.destroyAllBodies();
            for (var i = 0; i < this.bodies.length; i++) {
                var body = this.bodies[i];
                body.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_SHELLS);
                body.setCollisionMask(TacticalWeaponPack.State_Game.MASK_OBJECTS);
                body.applyForce(TacticalWeaponPack.MathUtil.Random(5, 10), -TacticalWeaponPack.MathUtil.Random(25, 50));
                body.angularVelocity += TacticalWeaponPack.MathUtil.Random(5, 25) * TacticalWeaponPack.MathUtil.TO_RADIANS;
                var sprite = body.sprite;
                if (sprite) {
                    var tween = this.game.add.tween(sprite).to({ alpha: TacticalWeaponPack.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Linear.None, true);
                    TacticalWeaponPack.GameUtil.GetGameState().addToWorld(sprite, TacticalWeaponPack.State_Game.INDEX_WALLS);
                }
            }
            this.enableDestroyTimer();
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_crate_open", this.x, this.y, 2, 0.2);
            if (_bHeadshot) {
                TacticalWeaponPack.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
            }
            if (this.ropes) {
                this.hideRopes();
            }
            if (this.ropeBaseJoint) {
                this.ropeBaseJoint.EnableMotor(false);
                this.ropeBaseJoint = null;
            }
        };
        Target.prototype.createBody = function () {
            var startX = this.x;
            var startY = this.y;
            if (this.targetType != Target.TYPE_ATTACKER) {
                var bodySprite = this.game.add.sprite(startX, startY + 30, "atlas_objects", "target_body");
                TacticalWeaponPack.GameUtil.GetGameState().addToWorld(bodySprite, TacticalWeaponPack.State_Game.INDEX_PAWNS);
                this.game.physics.box2d.enable(bodySprite);
                bodySprite.body.setRectangleFromSprite(bodySprite);
                bodySprite.body.dynamic = true;
                bodySprite.body.linearDamping = 2;
                bodySprite.body.angularDamping = 1;
                bodySprite.body.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS);
                bodySprite.body.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PAWNS);
                bodySprite.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
                bodySprite.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
                this.addBody(bodySprite.body);
                this.bodyBody = bodySprite.body;
            }
            var headSprite = this.game.add.sprite(startX, startY - 30, "atlas_objects", "target_head");
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(headSprite, TacticalWeaponPack.State_Game.INDEX_PAWNS);
            this.game.physics.box2d.enable(headSprite);
            headSprite.body.setCircle(14);
            headSprite.body.dynamic = true;
            headSprite.body.linearDamping = 1;
            headSprite.body.angularDamping = 1;
            headSprite.body.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS);
            headSprite.body.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PAWNS);
            headSprite.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            headSprite.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
            this.addBody(headSprite.body, { bHead: true });
            this.bodyHead = headSprite.body;
            if (this.targetType == Target.TYPE_ATTACKER) {
                this.bodyHead.gravityScale = 0;
                this.bodyHead.linearDamping = 3;
                headSprite.body.angularDamping = 2;
            }
            if (bodySprite) {
                headSprite.tint = bodySprite.tint;
                this.jointHead = this.game.physics.box2d.revoluteJoint(bodySprite, headSprite, 0, -bodySprite.height * 0.5, 0, headSprite.height * 0.5, 0, 0, 0, -5, 5, true);
            }
            this.body = headSprite.body;
        };
        Target.prototype.getBodyHead = function () {
            return this.bodyHead;
        };
        Target.prototype.getBodyBody = function () {
            return this.bodyBody;
        };
        Target.prototype.setGravityScale = function (_val) {
            if (this.bodyHead) {
                this.bodyHead.gravityScale = _val;
            }
            if (this.bodyBody) {
                this.bodyBody.gravityScale = _val;
            }
        };
        Target.TYPE_DEFAULT = "TYPE_DEFAULT";
        Target.TYPE_ROPE = "TYPE_ROPE";
        Target.TYPE_ATTACKER = "TYPE_ATTACKER";
        Target.TYPE_ROTATOR = "TYPE_RAIL";
        return Target;
    }(Pawn));
    TacticalWeaponPack.Target = Target;
    var Character = /** @class */ (function (_super) {
        __extends(Character, _super);
        function Character(_id, _x, _y, _controller) {
            var _this = _super.call(this, _id, _x, _y, _controller) || this;
            _this.currentClassIndex = -1;
            _this.currentInventoryIndex = 0;
            _this.desiredLaserAlpha = 0.2;
            _this.bWantsToSprint = false;
            _this.bWantsToFire = false;
            _this.bFireHandler = false;
            _this.bBurstFireHandler = false;
            _this.bFireDelay = false;
            _this.bIsReloading = false;
            _this.bUnlimitedAmmo = true;
            _this.bLaserEnabled = true;
            _this.bShadowEnabled = false;
            _this.weapon = _this.game.add.group();
            _this.addChild(_this.weapon);
            _this.laser = _this.game.add.graphics();
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this.laser, TacticalWeaponPack.State_Game.INDEX_LASER);
            _this.skills = [];
            _this.modifiers = {};
            _this.resetModifiers();
            _this.updateLookSpeed();
            _this.inventory = [];
            _this.lastWeaponPosition = new Phaser.Point(_this.weapon.x, _this.weapon.y);
            return _this;
        }
        Character.prototype.destroy = function () {
            this.blurX = null;
            this.blurY = null;
            this.weapon = null;
            this.shadow = null;
            this.skills = null;
            this.recoilTween = null;
            this.inventory = null;
            this.modifiers = null;
            _super.prototype.destroy.call(this);
        };
        Character.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.isAlive()) {
                if (this.weapon) {
                    var desiredAngle = this.lookTarget;
                    var target = this.weapon.rotation - this.lookTarget;
                    if (target > 180 * TacticalWeaponPack.MathUtil.TO_RADIANS) {
                        target -= 360 * TacticalWeaponPack.MathUtil.TO_RADIANS;
                    }
                    else if (target < -180 * TacticalWeaponPack.MathUtil.TO_RADIANS) {
                        target += 360 * TacticalWeaponPack.MathUtil.TO_RADIANS;
                    }
                    this.weapon.rotation -= target * this.lookSpeed;
                    this.laser.clear();
                    if (this.bLaserEnabled) {
                        if (this.desiredLaserAlpha > 0) {
                            var muzzlePos = this.getWorldLaserPosition(); //this.getWorldMuzzlePosition();
                            var dist = 1500;
                            var rad = this.rotation + this.weapon.rotation;
                            var startX = muzzlePos.x + this.weapon.x;
                            var startY = muzzlePos.y + this.weapon.y;
                            var endX = this.x + (Math.cos(rad) * dist);
                            var endY = this.y + (Math.sin(rad) * dist);
                            var filterFunc = TacticalWeaponPack.State_Game.FilterRaycastHit;
                            var raycast = this.game.physics.box2d.raycast(startX, startY, endX, endY, false, TacticalWeaponPack.State_Game.FilterRaycastHit);
                            if (raycast.length > 0) {
                                var hit = raycast[0];
                                endX = hit.point.x;
                                endY = hit.point.y;
                            }
                            this.laser.alpha = this.desiredLaserAlpha;
                            this.laser.lineStyle(1, 0xFFFFFF, 1);
                            this.laser.moveTo(startX, startY);
                            this.laser.lineTo(endX, endY);
                            this.laser.lineStyle(5, 0xFF0000, 0.4);
                            this.laser.moveTo(startX, startY);
                            this.laser.lineTo(endX, endY);
                            this.laser.endFill();
                            this.laser.beginFill(0xFFFFFF, 1);
                            this.laser.drawCircle(endX, endY, 6);
                        }
                    }
                    if (this.shadow) {
                        var offset = 32;
                        this.shadow.x = this.x + this.weapon.x + offset;
                        this.shadow.y = this.y + this.weapon.y + offset;
                        this.shadow.rotation = this.rotation + this.weapon.rotation;
                        this.shadow.scale.y = this.weapon.scale.y * 0.8;
                    }
                }
                if (this.bFireHandler) {
                    this.fireHandler();
                }
                if (this.bBurstFireHandler) {
                    this.burstFireHandler();
                }
                if (this.bFireDelay) {
                    this.fireDelayHandler();
                }
                if (this.bIsReloading) {
                    this.reloadHandler();
                }
            }
            this.updateBlur();
            this.lastWeaponPosition.x = this.weapon.x;
            this.lastWeaponPosition.y = this.weapon.y;
        };
        Character.prototype.updateBlur = function () {
            var bBlurEnabled = false;
            if (bBlurEnabled) {
                if (!this.blurX) {
                    this.blurX = TacticalWeaponPack.GameUtil.game.add.filter("BlurX");
                }
                if (!this.blurY) {
                    this.blurY = TacticalWeaponPack.GameUtil.game.add.filter("BlurY");
                }
                var difX = Math.abs(Math.min(this.lastWeaponPosition.x, 0));
                var difY = Math.abs(Math.min(this.lastWeaponPosition.y, 0));
                var dif = (difX + difY) * 1.2;
                var maxBlur = 8;
                var minBlur = 4;
                var rot = this.weapon.rotation;
                if (this.weapon.scale.y != 1) {
                    rot += TacticalWeaponPack.MathUtil.ToRad(180);
                }
                var vx = Math.min(Math.abs(Math.cos(rot)) * dif, maxBlur);
                var vy = Math.min(Math.abs(Math.sin(rot)) * dif, maxBlur);
                this.blurX.blur = vx;
                this.blurY.blur = vy;
                var bBlurX = this.blurX.blur > minBlur;
                var bBlurY = this.blurY.blur > minBlur;
                if (bBlurX && bBlurY) {
                    this.weapon.filters = [this.blurX, this.blurY];
                }
                else if (bBlurX) {
                    this.weapon.filters = [this.blurX];
                }
                else if (bBlurY) {
                    this.weapon.filters = [this.blurY];
                }
                else {
                    this.weapon.filters = undefined;
                }
            }
        };
        Character.prototype.lookAt = function (_x, _y) {
            if (_x > this.x) {
                this.weapon.scale.y = 1;
            }
            else {
                this.weapon.scale.y = -1;
            }
            return _super.prototype.lookAt.call(this, _x, _y);
        };
        Character.prototype.onMatchEnded = function () {
            this.stopWeaponFire();
            this.cancelReload();
        };
        Character.prototype.setCurrentClassIndex = function (_val) {
            this.currentClassIndex = _val;
            if (_val >= 0) {
            }
        };
        Character.prototype.addSkill = function (_skill) {
            this.skills.push(_skill["id"]);
            this.applySkill(_skill);
            this.updateHUDSkills();
        };
        Character.prototype.applySkill = function (_skill) {
            var modifiers = _skill.modifiers;
            for (var i = 0; i < modifiers.length; i++) {
                this.modifiers[modifiers[i]["id"]] = modifiers[i]["value"];
                if (modifiers[i]["id"] == Character.MODIFIER_VIEW_SPEED) {
                    this.updateLookSpeed();
                }
            }
        };
        Character.prototype.updateLookSpeed = function () {
            this.lookSpeed = 0.1 * this.modifiers[Character.MODIFIER_VIEW_SPEED];
        };
        Character.prototype.resetModifiers = function () {
            var value = 1;
            this.modifiers[Character.MODIFIER_DAMAGE] = value;
            this.modifiers[Character.MODIFIER_VIEW_SPEED] = value;
            this.modifiers[Character.MODIFIER_FIRE_RATE] = value;
            this.modifiers[Character.MODIFIER_RELOAD_SPEED] = value;
            this.modifiers[Character.MODIFIER_ACCURACY] = value;
            this.modifiers[Character.MODIFIER_XP] = value;
        };
        Character.prototype.getModifiers = function () {
            return this.modifiers;
        };
        Character.prototype.fireHandler = function () {
            if (!this.bWantsToFire) {
                this.bFireHandler = false;
            }
            else {
                var cur = this.getCurrentInventoryItem();
                if (this.canFire()) {
                    if (cur) {
                        this.fire();
                        var fireMode = cur["mode"];
                        if (fireMode == TacticalWeaponPack.WeaponDatabase.MODE_SEMI) {
                            this.startFireDelay(cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]);
                            this.bFireHandler = false;
                        }
                        else if (fireMode == TacticalWeaponPack.WeaponDatabase.MODE_BURST) {
                            this.startFireDelay(cur["burstFireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]);
                            cur["bursts"] = 2;
                            this.burstTimer = cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE];
                            this.bBurstFireHandler = true;
                            this.bFireHandler = false;
                        }
                        else if (fireMode == TacticalWeaponPack.WeaponDatabase.MODE_AUTO) {
                            this.startFireDelay(Math.max(2, cur["fireRate"] * this.modifiers[Character.MODIFIER_FIRE_RATE]));
                        }
                    }
                }
                else if (this.isReloading()) {
                    if (this.getCurrentInventoryItem()) {
                        if (cur["bSingleRoundLoaded"] && cur["mag"] > 0) {
                            this.cancelReload();
                        }
                    }
                }
            }
        };
        Character.prototype.cancelReload = function () {
            this.bIsReloading = false;
            if (this.isPlayer()) {
                this.getPlayerController().getHUD().getCrosshair().setReloading(false);
            }
        };
        Character.prototype.startFireDelay = function (_delay) {
            this.bFireDelay = true;
            this.fireDelayTimer = _delay;
        };
        Character.prototype.startWeaponFire = function () {
            this.bWantsToFire = true;
            this.triggerFire();
        };
        Character.prototype.stopWeaponFire = function () {
            this.bWantsToFire = false;
        };
        Character.prototype.triggerFire = function () {
            var cur = this.getCurrentInventoryItem();
            if (cur) {
                if (cur["mag"] > 0) {
                    this.bFireHandler = true;
                }
                else {
                    if (this.isReloading()) {
                        if (cur["bSingleRoundLoaded"]) {
                            if (cur["mag"] > 0) {
                                this.cancelReload();
                            }
                        }
                    }
                    else {
                        if (this.canReload()) {
                            this.reload();
                        }
                        else {
                            if (cur["ammo"] <= 0) {
                                /*
                                SoundManager.PlayWorldSound("wpn_empty", this.x, this.y);
                                if (this.otherWeaponHasAmmo())
                                {
                                    this.switchWeapon();
                                }
                                */
                            }
                        }
                    }
                }
            }
        };
        Character.prototype.triggerBarrel = function () {
            var item = this.getCurrentInventoryItem();
            if (item["barrel"] == TacticalWeaponPack.WeaponDatabase.BARREL_M203) {
                if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode().matchIsInProgress()) {
                    if (item["grenades"] > 0) {
                        var weapon = TacticalWeaponPack.WeaponDatabase.GetWeapon(TacticalWeaponPack.WeaponDatabase.WEAPON_M203);
                        var data = {};
                        data["weapon"] = weapon;
                        var pos = this.getWorldMuzzlePosition();
                        var useAccuracy = weapon["accuracy"] * this.modifiers[Character.MODIFIER_ACCURACY];
                        var rot = this.weapon.rotation + (TacticalWeaponPack.MathUtil.Random(-useAccuracy, useAccuracy) * TacticalWeaponPack.MathUtil.TO_RADIANS);
                        if (this.isPlayer()) {
                            data["speed"] = TacticalWeaponPack.MathUtil.Dist(this.x, this.y, this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y + this.game.camera.y);
                        }
                        data["damage"] = weapon["damage"];
                        TacticalWeaponPack.GameUtil.GetGameState().createProjectile(pos.x, pos.y, rot, ProjectileBase.TYPE_GRENADE, this, this.controller, data);
                        TacticalWeaponPack.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weapon.rotation);
                        TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_fire_" + weapon["id"], this.x, this.y);
                        if (this.isPlayer()) {
                            TacticalWeaponPack.GameUtil.GetGameState().getGameMode().addShotsFired();
                        }
                        item["grenades"]--;
                        this.updateHUDGrenadeAmmo();
                        this.addRecoil(2);
                    }
                    else {
                        TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_empty", this.x, this.y);
                    }
                }
            }
            else if (item["barrel"] == TacticalWeaponPack.WeaponDatabase.BARREL_LASER) {
                this.desiredLaserAlpha = (this.desiredLaserAlpha > 0 ? 0 : 0.2);
                TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_foley", this.x, this.y, 3);
            }
        };
        Character.prototype.triggerWeapon = function (_bVal) {
            this.bWantsToFire = _bVal;
            if (_bVal) {
                this.startWeaponFire();
            }
            else {
                this.stopWeaponFire();
            }
        };
        Character.prototype.fire = function () {
            var weapon = this.getCurrentInventoryItem();
            var data = {};
            data["weapon"] = weapon;
            var pos = this.getWorldMuzzlePosition();
            var numBullets = weapon["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN ? 6 : 1;
            for (var i = 0; i < numBullets; i++) {
                var useAccuracy = weapon["accuracy"] * this.modifiers[Character.MODIFIER_ACCURACY];
                var rot = this.weapon.rotation + (TacticalWeaponPack.MathUtil.Random(-useAccuracy, useAccuracy) * TacticalWeaponPack.MathUtil.TO_RADIANS);
                var projType = weapon["projectileType"];
                if (projType) {
                    if (projType == ProjectileBase.TYPE_BULLET) {
                        var magModifier = 1;
                        var headshotMultiplier = 1;
                        if (weapon["magMod"] == TacticalWeaponPack.WeaponDatabase.MAG_FMJ) {
                            data["bBig"] = true;
                            magModifier = 1.25;
                        }
                        if (weapon["magMod"] == TacticalWeaponPack.WeaponDatabase.MAG_HOLLOWPOINT) {
                            data["bBig"] = true;
                            headshotMultiplier = 2;
                        }
                        if (weapon["magMod"] == TacticalWeaponPack.WeaponDatabase.MAG_EXPLOSIVE) {
                            data["bBig"] = true;
                            data["bExplosive"] = true;
                        }
                        data["damageMultiplier"] = this.modifiers[Character.MODIFIER_DAMAGE] * magModifier;
                        data["headshotMultiplier"] = headshotMultiplier;
                    }
                    else if (projType == ProjectileBase.TYPE_GRENADE) {
                        data["bSticky"] = weapon["bSticky"];
                    }
                    if (this.isPlayer()) {
                        data["speed"] = TacticalWeaponPack.MathUtil.Dist(this.x, this.y, this.game.input.activePointer.x + this.game.camera.x, this.game.input.activePointer.y + this.game.camera.y);
                    }
                }
                data["damage"] = weapon["damage"];
                TacticalWeaponPack.GameUtil.GetGameState().createProjectile(pos.x, pos.y, rot, projType, this, this.controller, data);
                if (this.isPlayer()) {
                    TacticalWeaponPack.GameUtil.GetGameState().getGameMode().addShotsFired();
                }
            }
            TacticalWeaponPack.GameUtil.GetGameState().createMuzzleFlash(pos.x, pos.y, this.weapon.rotation);
            if (weapon["bEjectShell"] != false) {
                this.createShell();
            }
            if (weapon["id"] == TacticalWeaponPack.WeaponDatabase.WEAPON_RPG) {
                this.setMagVisible(false);
            }
            if (weapon["bPump"] == true) {
                this.startPumpTween();
            }
            else {
                this.startSlideTween();
            }
            weapon["mag"]--;
            this.addRecoil();
            TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_fire_" + weapon["id"], this.x, this.y);
            this.updateHUDAmmo();
        };
        Character.prototype.addRecoil = function (_multiplier) {
            if (_multiplier === void 0) { _multiplier = 1; }
            var multiplier = _multiplier * this.modifiers[Character.MODIFIER_RECOIL];
            var item = this.getCurrentInventoryItem();
            var damage = item["damage"] * (item["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN ? 6 : 1);
            var recoil = -Math.max(damage * 0.35, 12) * multiplier;
            var rot = this.weapon.rotation + (TacticalWeaponPack.MathUtil.Random(-15, 15) * TacticalWeaponPack.MathUtil.TO_RADIANS);
            this.weapon.x += (Math.cos(rot) * recoil);
            this.weapon.y += (Math.sin(rot) * recoil);
            var rotRecoil = TacticalWeaponPack.MathUtil.Random(-3, 5) * (this.modifiers[Character.MODIFIER_RECOIL] * 0.6);
            if (item["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_PISTOL) {
                rotRecoil = TacticalWeaponPack.MathUtil.Random(damage * 0.5, damage) * 0.5;
            }
            else if (item["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_LAUNCHER) {
                rotRecoil = TacticalWeaponPack.MathUtil.Random(damage * 0.5, damage) * 0.2;
            }
            else if (item["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN) {
                rotRecoil = TacticalWeaponPack.MathUtil.Random(damage * 0.5, damage) * 0.2;
            }
            else if (item["bBoltAction"] == true) {
                rotRecoil = TacticalWeaponPack.MathUtil.Random(damage * 0.5, damage) * 0.15;
            }
            this.weapon.rotation += (rotRecoil * TacticalWeaponPack.MathUtil.TO_RADIANS) * (this.weapon.scale.y < 0 ? 1 : -1);
            if (this.recoilTween) {
                this.recoilTween.stop();
                this.recoilTween = null;
            }
            this.recoilTween = this.game.add.tween(this.weapon).to({ x: 0, y: 0 }, Math.min(500 + (damage * 10), 3000), Phaser.Easing.Elastic.Out, true);
            if (this.isPlayer()) {
                this.getPlayerController().getHUD().getCrosshair().addRecoil(damage * 0.5);
                TacticalWeaponPack.GameUtil.GetGameState().shakeCamera(recoil * 0.5);
            }
        };
        Character.prototype.createShell = function () {
            var item = this.getCurrentInventoryItem();
            var pos = this.getWorldShellPosition();
            var rot = this.weapon.rotation;
            if (this.weapon.scale.y != 1) {
                rot += TacticalWeaponPack.MathUtil.ToRad(180);
            }
            return TacticalWeaponPack.GameUtil.GetGameState().createShell(pos.x, pos.y, rot, item["round"]);
        };
        Character.prototype.burstFireHandler = function () {
            var item = this.getCurrentInventoryItem();
            if (item["bursts"] > 0) {
                if (this.burstTimer > 0) {
                    this.burstTimer--;
                }
                else {
                    if (item["mag"] > 0) {
                        if (item["bursts"] > 0) {
                            item["bursts"]--;
                        }
                        this.burstTimer = item["fireRate"];
                        this.fire();
                    }
                    else {
                        this.burstFireComplete();
                    }
                }
            }
            else {
                this.burstFireComplete();
            }
        };
        Character.prototype.burstFireComplete = function () {
            this.bBurstFireHandler = false;
        };
        Character.prototype.fireDelayHandler = function () {
            this.fireDelayTimer--;
            if (this.fireDelayTimer <= 0) {
                this.endFireDelay();
            }
        };
        Character.prototype.endFireDelay = function () {
            this.bFireDelay = false;
            var item = this.getCurrentInventoryItem();
            if (item["mag"] == 0) {
                if (this.canReload()) {
                    this.reload();
                }
            }
            if (!this.bWantsToFire) {
                TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_foley", this.x, this.y, 3, 0.5);
            }
        };
        Character.prototype.reloadHandler = function () {
            this.reloadTimer--;
            if (this.isPlayer()) {
                this.getPlayerController().getHUD().getCrosshair().setReloadingPercentage(1 - (this.reloadTimer / this.reloadTimerMax));
            }
            if (this.reloadTimer == 0) {
                this.onReloadComplete();
            }
        };
        Character.prototype.reload = function (_bAuto) {
            if (_bAuto === void 0) { _bAuto = false; }
            if (!this.canReload()) {
                return;
            }
            var firearm = this.getCurrentInventoryItem();
            var weaponId = firearm["id"];
            this.bIsReloading = true;
            this.reloadTimerMax = Math.ceil((firearm["reloadTime"] * 60) * this.modifiers[Character.MODIFIER_RELOAD_SPEED]);
            this.reloadTimer = this.reloadTimerMax;
            var crosshair = null;
            if (this.isPlayer()) {
                crosshair = this.getPlayerController().getHUD().getCrosshair();
            }
            if (!firearm["bSingleRoundLoaded"]) {
                TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_reload_start", this.x, this.y, 0, 1);
                if (crosshair) {
                    crosshair.setReloading(true);
                    crosshair.setCanFire(false);
                }
            }
            else {
                if (crosshair) {
                    crosshair.setReloading(true);
                    crosshair.setCanFire(firearm["mag"] > 0);
                }
            }
            var bHasMag = this.setMagVisible(false);
            if (bHasMag && firearm["bEjectMag"] != false) {
                TacticalWeaponPack.GameUtil.GetGameState().createMag(this.x, this.y, this.weapon.rotation, firearm["id"]);
            }
            this.lockSlideBack();
            if (firearm["id"] == TacticalWeaponPack.WeaponDatabase.WEAPON_MAGNUM) {
                var len = (firearm["magSize"] - firearm["mag"]);
                for (var i = 0; i < len; i++) {
                    this.createShell();
                }
            }
        };
        Character.prototype.setMagVisible = function (_bVal) {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var mag = group.getByName("mag");
                if (mag) {
                    mag.visible = _bVal;
                    var slide = group.getByName("slide");
                    this.updateShadow();
                    return true;
                }
            }
            return false;
        };
        Character.prototype.lockSlideBack = function () {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var slide = group.getByName("slide");
                if (slide) {
                    var item = this.getCurrentInventoryItem();
                    slide.x = Math.round(item["points"]["slide"]["x"] - (slide.width * 0.5)) + (group.getByName("base").width * 0.5);
                    var tweenTime = 50 + (item["damage"] * 0.25);
                    var slideX = 18 + (item["damage"] * 0.2);
                    if (this.slideTween) {
                        this.slideTween.stop();
                    }
                    slide.x = slide.x - slideX;
                    //this.slideTween = this.game.add.tween(slide).to({ x: slide.x - slideX }, tweenTime, Phaser.Easing.Exponential.InOut, true, 0, 0);
                    this.updateShadow();
                }
            }
        };
        Character.prototype.lockSlideDefault = function () {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var slide = group.getByName("slide");
                if (slide) {
                    var item = this.getCurrentInventoryItem();
                    var desiredX = Math.round(item["points"]["slide"]["x"] - (slide.width * 0.5)) + (group.getByName("base").width * 0.5);
                    var tweenTime = 50 + (item["damage"] * 0.25);
                    if (this.slideTween) {
                        this.slideTween.stop();
                    }
                    slide.x = desiredX;
                    //this.slideTween = this.game.add.tween(slide).to({ x: desiredX }, tweenTime, Phaser.Easing.Exponential.InOut, true, 0, 0);
                    this.updateShadow();
                }
            }
        };
        Character.prototype.startSlideTween = function () {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var slide = group.getByName("slide");
                if (slide) {
                    var item = this.getCurrentInventoryItem();
                    slide.x = Math.round(item["points"]["slide"]["x"] - (slide.width * 0.5)) + (group.getByName("base").width * 0.5);
                    var tweenTime = 50 + (item["damage"] * 0.25);
                    var slideX = 18 + (item["damage"] * 0.2);
                    if (this.slideTween) {
                        this.slideTween.stop();
                    }
                    this.slideTween = this.game.add.tween(slide).to({ x: slide.x - slideX }, tweenTime, Phaser.Easing.Exponential.Out, true, 0, 0, true);
                }
            }
        };
        Character.prototype.startPumpTween = function () {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var pump = group.getByName("pump");
                if (pump) {
                    var tweenTime = 120 + this.getCurrentInventoryItem()["fireRate"];
                    var tweenDelay = 150;
                    var tween = this.game.add.tween(pump).to({ x: pump.x - 30 }, tweenTime, Phaser.Easing.Exponential.InOut, true, tweenDelay, 0, true);
                    var timer = this.game.time.create();
                    timer.add(tweenDelay + (tweenTime * 0.5), this.createShell, this);
                    timer.start();
                }
            }
        };
        Character.prototype.onReloadComplete = function () {
            this.bIsReloading = false;
            var cur = this.getCurrentInventoryItem();
            if (cur["bSingleRoundLoaded"]) {
                if (!this.bUnlimitedAmmo) {
                    cur["ammo"] -= 1;
                }
                cur["mag"] += 1;
            }
            else {
                if (cur["mag"] >= cur["magSize"]) {
                    if (!this.bUnlimitedAmmo) {
                        cur["ammo"] -= cur["magSize"] - cur["mag"];
                    }
                    cur["mag"] = cur["magSize"];
                }
                else if ((cur["ammo"] + cur["mag"]) > cur["magSize"]) {
                    if (!this.bUnlimitedAmmo) {
                        cur["ammo"] -= cur["magSize"] - cur["mag"];
                    }
                    cur["mag"] += (cur["magSize"] - cur["mag"]);
                }
                else {
                    cur["mag"] += cur["ammo"];
                    if (!this.bUnlimitedAmmo) {
                        cur["ammo"] -= cur["ammo"];
                    }
                }
            }
            this.setMagVisible(true);
            if (this.isPlayer()) {
                var hud = this.getPlayerController().getHUD();
                hud.getCrosshair().setReloading(false);
                hud.getCrosshair().onReloadComplete();
            }
            this.updateHUDAmmo();
            if (cur["bSingleRoundLoaded"] && this.canReload()) {
                this.reload(true);
            }
            this.lockSlideDefault();
            TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_reload_end", this.x, this.y);
        };
        Character.prototype.getWorldLaserPosition = function () {
            if (this.weapon) {
                var group = this.weapon.getAt(0);
                var laser = group.getByName(TacticalWeaponPack.WeaponDatabase.BARREL_LASER);
                if (laser) {
                    var pos = laser.world.clone();
                    pos.x /= this.game.world.scale.x;
                    pos.y /= this.game.world.scale.y;
                    var offset = laser.width * 0.4;
                    var startX = pos.x + (Math.cos(this.weapon.rotation) * offset);
                    var startY = pos.y + (Math.sin(this.weapon.rotation) * offset);
                    return new Phaser.Point(startX, startY);
                }
            }
            return new Phaser.Point(this.x, this.y);
        };
        Character.prototype.getWorldMuzzlePosition = function () {
            var pos;
            var item = this.getCurrentInventoryItem();
            if (item) {
            }
            if (!pos) {
                var offset = this.weapon.width * 0.5;
                var startX = this.x + this.weapon.x + (Math.cos(this.weapon.rotation) * offset);
                var startY = this.y + this.weapon.y + (Math.sin(this.weapon.rotation) * offset);
                pos = new Phaser.Point(startX, startY);
            }
            return pos;
        };
        Character.prototype.getWorldShellPosition = function () {
            var pos;
            var item = this.getCurrentInventoryItem();
            if (item) {
            }
            if (!pos) {
                var offset = this.weapon.width * 0.1;
                var rot = this.weapon.rotation - TacticalWeaponPack.MathUtil.ToRad(135);
                if (this.weapon.scale.y != 1) {
                    rot += TacticalWeaponPack.MathUtil.ToRad(180);
                }
                var startX = this.x + this.weapon.x + (Math.cos(rot) * offset);
                var startY = this.y + this.weapon.y + (Math.sin(rot) * offset);
                pos = new Phaser.Point(startX, startY);
            }
            return pos;
        };
        Character.prototype.startSprinting = function () {
            this.bWantsToSprint = true;
        };
        Character.prototype.stopSprinting = function () {
            this.bWantsToSprint = false;
        };
        Character.prototype.isSprinting = function () {
            return this.bWantsToSprint;
        };
        Character.prototype.selectWeapon = function (_index) {
            if (this.bFireDelay) {
                return;
            }
            if (this.inventory) {
                if (_index <= this.inventory.length && this.currentInventoryIndex != _index) {
                    this.currentInventoryIndex = _index;
                    this.loadCurrentInventoryItem();
                    this.updateHUDInventory();
                }
            }
        };
        Character.prototype.switchWeapon = function () {
            if (this.bFireDelay) {
                return;
            }
            if (this.inventory) {
                if (this.inventory.length > 1) {
                    this.currentInventoryIndex = this.currentInventoryIndex ? 0 : 1;
                    this.loadCurrentInventoryItem();
                }
            }
            this.updateHUDInventory();
        };
        Character.prototype.addInventoryItem = function (_item) {
            this.inventory.push(_item);
            if (this.inventory.length == 1) {
                this.currentInventoryIndex = 0;
                this.loadCurrentInventoryItem();
                if (this.isPlayer()) {
                    TacticalWeaponPack.SoundManager.PlayUISound("ui_loadout_equip");
                }
            }
            this.updateHUDInventory();
        };
        Character.prototype.replaceInventoryItem = function (_item, _index) {
            if (this.inventory.length >= _index) {
                delete this.inventory[_index];
                this.inventory[_index] = _item;
                this.currentInventoryIndex = _index;
                this.loadCurrentInventoryItem();
            }
            this.updateHUDInventory();
        };
        Character.prototype.hasAnyAmmo = function () {
            return false;
        };
        Character.prototype.getInventory = function () {
            return this.inventory;
        };
        Character.prototype.updateHUDInventory = function () {
            if (this.isPlayer()) {
                var hud = this.getPlayerController().getHUD();
                hud.getInventoryInfo().updateInventory(this.inventory);
                hud.getInventoryInfo().updateInventoryIndex(this.currentInventoryIndex);
            }
        };
        Character.prototype.updateHUD = function () {
            if (this.isPlayer()) {
                var item = this.getCurrentInventoryItem();
                if (item) {
                    var hud = this.getPlayerController().getHUD();
                    hud.getInventoryInfo().updateWeapon(item);
                    hud.getCrosshair().setReloading(false);
                }
            }
        };
        Character.prototype.updateHUDSkills = function () {
            if (this.isPlayer()) {
                var item = this.getCurrentInventoryItem();
                if (item) {
                    var hud = this.getPlayerController().getHUD();
                    hud.getInventoryInfo().updateSkills(this.skills);
                }
            }
        };
        Character.prototype.updateHUDAmmo = function () {
            if (this.isPlayer()) {
                var item = this.getCurrentInventoryItem();
                if (item) {
                    var hud = this.getPlayerController().getHUD();
                    hud.getInventoryInfo().updateAmmo(item["mag"], item["magSize"]);
                    var crosshair = hud.getCrosshair();
                    crosshair.setCanFire(item["mag"] > 0);
                    if (this.isReloading()) {
                        crosshair.setNeedsReload(false);
                    }
                    else {
                        crosshair.setNeedsReload(item["mag"] < (item["magSize"] * 0.5));
                    }
                }
            }
        };
        Character.prototype.updateHUDGrenadeAmmo = function () {
            if (this.isPlayer()) {
                var item = this.getCurrentInventoryItem();
                if (item) {
                    if (item["grenades"] != undefined) {
                        var hud = this.getPlayerController().getHUD();
                        hud.getInventoryInfo().updateGrenadeAmmo(item["grenades"], item["grenadesMax"]);
                    }
                }
            }
        };
        Character.prototype.canReload = function () {
            var item = this.getCurrentInventoryItem();
            return item && !this.bIsReloading && (item["mag"] < item["magSize"]) && (item["ammo"] > 0);
        };
        Character.prototype.isReloading = function () {
            return this.bIsReloading;
        };
        Character.prototype.canFire = function () {
            var item = this.getCurrentInventoryItem();
            return item && !this.isSprinting() && !this.bIsReloading && !this.bFireDelay && item["mag"] > 0;
        };
        Character.prototype.loadCurrentInventoryItem = function () {
            var current = this.getCurrentInventoryItem();
            if (!current) {
                return;
            }
            this.weapon.removeAll(true);
            var item = TacticalWeaponPack.GameUtil.CreateWeapon(current);
            item.scale.set(0.5, 0.5);
            item.x = -item.width * 0.5;
            item.y = -item.height * 0.5;
            this.weapon.add(item);
            if (this.isReloading()) {
                this.cancelReload();
            }
            if (current["mag"] == 0 && current["ammo"] > 0) {
                this.reload();
            }
            else {
                this.getPlayerController().getHUD().getCrosshair().setCanFire(true);
            }
            this.bLaserEnabled = current["barrel"] == TacticalWeaponPack.WeaponDatabase.BARREL_LASER;
            this.modifiers[Character.MODIFIER_RECOIL] = current["barrel"] == TacticalWeaponPack.WeaponDatabase.BARREL_MUZZLE ? 0.5 : 1;
            this.weapon.rotation = -90 * TacticalWeaponPack.MathUtil.TO_RADIANS;
            this.updateHUD();
            TacticalWeaponPack.SoundManager.PlayWorldSound("wpn_deploy_firearm", this.x, this.y, 3);
            this.updateShadow();
            if (this.isPlayer()) {
                var viewModifier = 1;
                if (current["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SNIPER) {
                    viewModifier = 0.85;
                }
                else {
                    console.log(current);
                    if (!TacticalWeaponPack.WeaponDatabase.IsDefaultMod(current["optic"])) {
                        viewModifier = 0.9;
                    }
                }
                TacticalWeaponPack.GameUtil.GetGameState().setDesiredWorldScale(viewModifier);
            }
        };
        Character.prototype.updateShadow = function () {
            if (this.bShadowEnabled) {
                if (this.shadow) {
                    this.shadow.destroy();
                }
                this.shadow = this.game.add.image(0, 0, this.weapon.generateTexture());
                this.shadow.anchor.set(0.5, 0.5);
                this.shadow.scale.set(0.8, 0.8);
                this.shadow.tint = 0x000000;
                this.shadow.alpha = 0.05;
                TacticalWeaponPack.GameUtil.GetGameState().addToWorld(this.shadow, TacticalWeaponPack.State_Game.INDEX_WALLS);
            }
        };
        Character.prototype.getCurrentInventoryItem = function () {
            if (!this.inventory) {
                return null;
            }
            return this.inventory[this.currentInventoryIndex];
        };
        Character.MAX_INVENTORY_ITEMS = 2;
        Character.MODIFIER_DAMAGE = "damage";
        Character.MODIFIER_VIEW_SPEED = "view_speed";
        Character.MODIFIER_FIRE_RATE = "fire_rate";
        Character.MODIFIER_RELOAD_SPEED = "reload_speed";
        Character.MODIFIER_ACCURACY = "accuracy";
        Character.MODIFIER_XP = "xp";
        Character.MODIFIER_RECOIL = "recoil";
        return Character;
    }(Pawn));
    TacticalWeaponPack.Character = Character;
    var ProjectileBase = /** @class */ (function (_super) {
        __extends(ProjectileBase, _super);
        function ProjectileBase(_x, _y, _rotation, _causer, _instigator, _data) {
            var _this = _super.call(this, null, _x, _y) || this;
            _this.speed = 1;
            _this.damage = 0;
            _this.rotation = _rotation;
            _this.causer = _causer;
            _this.instigator = _instigator;
            _this.data = _data;
            _this.enableDestroyTimer();
            return _this;
        }
        ProjectileBase.prototype.destroy = function () {
            this.causer = null;
            this.instigator = null;
            this.data = null;
            _super.prototype.destroy.call(this);
        };
        ProjectileBase.prototype.getData = function () {
            return this.data;
        };
        ProjectileBase.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.x < 0 || this.x > this.game.world.width || this.y < 0 || this.y > this.game.world.height) {
                this.triggerDestroy();
            }
        };
        ProjectileBase.TYPE_BULLET = "TYPE_BULLET";
        ProjectileBase.TYPE_ROCKET = "TYPE_ROCKET";
        ProjectileBase.TYPE_GRENADE = "TYPE_GRENADE";
        return ProjectileBase;
    }(WorldObject));
    TacticalWeaponPack.ProjectileBase = ProjectileBase;
    var Grenade = /** @class */ (function (_super) {
        __extends(Grenade, _super);
        function Grenade(_x, _y, _rotation, _causer, _instigator, _data) {
            var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
            _this.detonationTimer = 90;
            _this.damage = _this.data["damage"];
            if (_this.data["damageMultiplier"] != undefined) {
                _this.damage *= _this.data["damageMultiplier"];
            }
            _this.speed = _this.data["speed"] ? (_this.data["speed"] * 5) : 1000;
            _this.speed = Math.min(2000, _this.speed);
            _this.grenade = _this.game.add.sprite(0, 0, "atlas_effects", "projectile_grenade");
            _this.grenade.anchor.set(0.5, 0.5);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this);
            _this.createBody();
            var offset = 5 * TacticalWeaponPack.MathUtil.TO_RADIANS;
            _this.body.velocity.x = Math.cos(_this.rotation + offset) * _this.speed;
            _this.body.velocity.y = Math.sin(_this.rotation + offset) * _this.speed;
            _this.body.angularVelocity += TacticalWeaponPack.MathUtil.Random(-20, 20);
            _this.setDestroyTimer((_this.detonationTimer / 60) + 1);
            return _this;
        }
        Grenade.prototype.destroy = function () {
            this.grenade = null;
            _super.prototype.destroy.call(this);
        };
        Grenade.prototype.tick = function () {
            _super.prototype.tick.call(this);
            if (this.detonationTimer > 0) {
                this.detonationTimer--;
            }
            else {
                TacticalWeaponPack.GameUtil.GetGameState().createExplosion(this.x, this.y, 375, this.instigator, this, this.data);
                this.triggerDestroy();
            }
        };
        Grenade.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_grenade_bounce", this.x, this.y, 0, 0.1);
            if (_obj instanceof Target) {
                if (this.data["bSticky"] == true) {
                    if (this.body && _obj.getBody()) {
                        if (!this.joint) {
                            this.body.setZeroRotation();
                            this.joint = this.game.physics.box2d.distanceJoint(this.body.sprite, _obj.getBody().sprite);
                            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_target_headshot", this.x, this.y, 3, 0.5);
                        }
                    }
                }
            }
        };
        Grenade.prototype.createBody = function () {
            //var grenadeBody: Phaser.Physics.Box2D.Body = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y);
            this.game.physics.box2d.enable(this.grenade, false);
            var grenadeBody = this.grenade.body;
            grenadeBody.x = this.x;
            grenadeBody.y = this.y;
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(this.grenade, TacticalWeaponPack.State_Game.INDEX_PAWNS);
            //var fixture = grenadeBody.setRectangleFromSprite(this.grenade);
            grenadeBody.dynamic = true;
            grenadeBody.rotation = this.rotation;
            grenadeBody.bullet = true;
            grenadeBody.restitution = 0.1;
            grenadeBody.linearDamping = 1;
            grenadeBody.angularDamping = 1;
            grenadeBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_PROJECTILES);
            grenadeBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PROJECTILES);
            grenadeBody.angularVelocity = TacticalWeaponPack.MathUtil.Random(-80, 80) * TacticalWeaponPack.MathUtil.TO_RADIANS;
            this.addBody(grenadeBody);
            this.body = grenadeBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        return Grenade;
    }(ProjectileBase));
    TacticalWeaponPack.Grenade = Grenade;
    var Rocket = /** @class */ (function (_super) {
        __extends(Rocket, _super);
        function Rocket(_x, _y, _rotation, _causer, _instigator, _data) {
            var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
            _this.damage = _this.data["damage"];
            if (_this.data["damageMultiplier"] != undefined) {
                _this.damage *= _this.data["damageMultiplier"];
            }
            _this.speed = 1500;
            _this.rocket = _this.game.add.image(0, 0, "atlas_effects", "projectile_rocket");
            _this.addChild(_this.rocket);
            _this.rocket.anchor.set(1, 0.5);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this);
            _this.createBody();
            _this.body.velocity.x = Math.cos(_this.rotation) * _this.speed;
            _this.body.velocity.y = Math.sin(_this.rotation) * _this.speed;
            return _this;
        }
        Rocket.prototype.destroy = function () {
            this.rocket = null;
            _super.prototype.destroy.call(this);
        };
        Rocket.prototype.tick = function () {
            _super.prototype.tick.call(this);
            TacticalWeaponPack.GameUtil.GetGameState().createSmoke(this.x, this.y, this.rotation + (TacticalWeaponPack.MathUtil.Random(45, 45) * TacticalWeaponPack.MathUtil.TO_RADIANS), Smoke.SMOKE_DEFAULT);
        };
        Rocket.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_body_fall", this.x, this.y);
            this.triggerDestroy();
            TacticalWeaponPack.GameUtil.GetGameState().createExplosion(this.x, this.y, 400, this.instigator, this, { damage: this.damage });
        };
        Rocket.prototype.createBody = function () {
            var rocketBody = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y);
            var fixture = rocketBody.setCircle(10);
            rocketBody.gravityScale = 0;
            rocketBody.dynamic = true;
            rocketBody.rotation = this.rotation;
            rocketBody.friction = 0;
            rocketBody.bullet = true;
            rocketBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_PROJECTILES);
            rocketBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PROJECTILES);
            this.addBody(rocketBody);
            this.body = rocketBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        return Rocket;
    }(ProjectileBase));
    TacticalWeaponPack.Rocket = Rocket;
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(_x, _y, _rotation, _causer, _instigator, _data) {
            var _this = _super.call(this, _x, _y, _rotation, _causer, _instigator, _data) || this;
            _this.damage = _this.data["damage"];
            if (_this.data["damageMultiplier"] != undefined) {
                _this.damage *= _this.data["damageMultiplier"];
            }
            _this.speed = TacticalWeaponPack.MathUtil.Random(8000, 12000);
            _this.bullet = _this.game.add.image(0, 0, "atlas_effects", "projectile_bullet");
            _this.addChild(_this.bullet);
            _this.bullet.anchor.set(1, 0.5);
            _this.bullet.scale.x = (TacticalWeaponPack.MathUtil.Random(10, 15) * 0.1);
            if (_this.data["bBig"] == true) {
                _this.bullet.scale.y = TacticalWeaponPack.MathUtil.Random(10, 20) * 0.1;
                _this.bullet.alpha = TacticalWeaponPack.MathUtil.Random(5, 10) * 0.1;
            }
            else {
                _this.bullet.alpha = TacticalWeaponPack.MathUtil.Random(1, 10) * 0.1;
            }
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this);
            _this.createBody();
            _this.body.velocity.x = Math.cos(_this.rotation) * _this.speed;
            _this.body.velocity.y = Math.sin(_this.rotation) * _this.speed;
            if (TacticalWeaponPack.MathUtil.Random(1, 4) == 1) {
                TacticalWeaponPack.SoundManager.PlayWorldSound("physics_bullet_flyby", _this.x, _this.y, 5, 0.5);
            }
            _this.game.add.tween(_this.bullet).from({ alpha: 0 }, 40, Phaser.Easing.Exponential.In, true);
            _this.setDestroyTimer(1);
            return _this;
        }
        Bullet.prototype.destroy = function () {
            this.bullet = null;
            _super.prototype.destroy.call(this);
        };
        Bullet.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            var bHeadshot = false;
            if (_data) {
                bHeadshot = _data["bHead"];
            }
            TacticalWeaponPack.GameUtil.GetGameState().createMuzzleFlash(this.x, this.y, this.rotation + (180 * TacticalWeaponPack.MathUtil.TO_RADIANS), "impact");
            if (_obj instanceof Actor) {
                var actor = _obj;
                var realDamage = this.damage;
                if (bHeadshot) {
                    realDamage *= this.data["headshotMultiplier"];
                }
                actor.takeDamage(realDamage, this.instigator, this, TacticalWeaponPack.DamageType.DAMAGE_TYPE_BULLET, bHeadshot);
                TacticalWeaponPack.GameUtil.GetGameState().getGameMode().addShotsHit();
                TacticalWeaponPack.SoundManager.PlayWorldSound("physics_body_impact_bullet", this.x, this.y, 3, 0.5);
            }
            else {
                TacticalWeaponPack.SoundManager.PlayWorldSound("physics_concrete_impact_bullet", this.x, this.y, 3, 0.5);
            }
            if (this.data["bExplosive"]) {
                TacticalWeaponPack.GameUtil.GetGameState().createExplosion(this.x, this.y, 100, this.instigator, this, { bRound: true, damage: (this.damage * 3) * (bHeadshot ? 1.5 : 1) });
            }
            this.triggerDestroy();
        };
        Bullet.prototype.createBody = function () {
            var bulletBody = new Phaser.Physics.Box2D.Body(this.game, null, this.x, this.y, 0);
            var mult = 1 + Math.min((this.damage * 0.025), 3);
            var fixture = bulletBody.setCircle(3 * mult);
            bulletBody.gravityScale = 0;
            bulletBody.dynamic = true;
            bulletBody.rotation = this.rotation;
            bulletBody.friction = 0;
            bulletBody.bullet = true;
            bulletBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_PROJECTILES);
            bulletBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PROJECTILES);
            this.addBody(bulletBody);
            this.body = bulletBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        return Bullet;
    }(ProjectileBase));
    TacticalWeaponPack.Bullet = Bullet;
    var Mag = /** @class */ (function (_super) {
        __extends(Mag, _super);
        function Mag(_x, _y, _rotation, _type) {
            var _this = _super.call(this, null, _x, _y, _rotation) || this;
            _this.mag = _this.game.add.sprite(0, 0, "atlas_" + _type, "mag0000");
            _this.mag.scale.set(0.5, 0.5);
            _this.mag.anchor.set(0.5, 0.5);
            _this.addChild(_this.mag);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this, TacticalWeaponPack.State_Game.INDEX_MAGS);
            _this.createBody();
            _this.setDestroyTimer(5);
            _this.enableDestroyTimer();
            return _this;
        }
        Mag.prototype.destroy = function () {
            this.mag = null;
            _super.prototype.destroy.call(this);
        };
        Mag.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_body_hit", this.x, this.y, 3, 0.2);
        };
        Mag.prototype.createBody = function () {
            var magBody = new Phaser.Physics.Box2D.Body(this.game, this.mag, this.x, this.y, 0);
            magBody.setRectangleFromSprite(this.mag);
            magBody.rotation = this.rotation;
            magBody.dynamic = true;
            magBody.restitution = 0.1;
            magBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS);
            magBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_PAWNS);
            magBody.angularVelocity = TacticalWeaponPack.MathUtil.Random(-2, 2);
            this.addBody(magBody);
            this.body = magBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        return Mag;
    }(WorldObject));
    TacticalWeaponPack.Mag = Mag;
    var Debris = /** @class */ (function (_super) {
        __extends(Debris, _super);
        function Debris(_x, _y, _rotation, _type) {
            var _this = _super.call(this, null, _x, _y, _rotation) || this;
            _this.timer = 0;
            _this.bCircle = false;
            _this.debris = _this.game.add.sprite(0, 0, "atlas_objects", _type);
            _this.debris.anchor.set(0.5, 0.5);
            _this.addChild(_this.debris);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this, TacticalWeaponPack.State_Game.INDEX_WALLS);
            if (_type == Debris.DEBRIS_STAR) {
                var scale = TacticalWeaponPack.MathUtil.Random(8, 10) * 0.1;
                _this.debris.scale.set(scale);
                _this.bCircle = true;
            }
            _this.createBody();
            _this.setDestroyTimer(TacticalWeaponPack.MathUtil.Random(5, 8));
            _this.timer = _this.destroyTimer;
            _this.enableDestroyTimer();
            var tween = _this.game.add.tween(_this.debris).to({ alpha: TacticalWeaponPack.State_Game.DEBRIS_ALPHA }, 250, Phaser.Easing.Exponential.In, true);
            return _this;
        }
        Debris.prototype.destroy = function () {
            this.debris = null;
            _super.prototype.destroy.call(this);
        };
        Debris.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_target_hit", this.x, this.y, 3, 0.1);
        };
        Debris.prototype.createBody = function () {
            var debrisBody = new Phaser.Physics.Box2D.Body(this.game, this.debris, this.x, this.y, 0);
            if (this.bCircle) {
                debrisBody.setCircle(this.debris.width * 0.5);
            }
            else {
                debrisBody.setRectangleFromSprite(this.debris);
            }
            debrisBody.rotation = this.rotation;
            debrisBody.dynamic = true;
            debrisBody.restitution = 0.5;
            debrisBody.linearDamping = 0.5;
            debrisBody.angularDamping = 0.5;
            debrisBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_SHELLS);
            debrisBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_OBJECTS);
            var rad = this.rotation + ((TacticalWeaponPack.MathUtil.Random(5, 30) - 90) * TacticalWeaponPack.MathUtil.TO_RADIANS);
            var speed = TacticalWeaponPack.MathUtil.Random(5, 25);
            debrisBody.applyForce(Math.cos(rad) * speed, Math.sin(rad) * speed);
            debrisBody.angularVelocity = TacticalWeaponPack.MathUtil.Random(-15, 15);
            this.addBody(debrisBody);
            this.body = debrisBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        Debris.DEBRIS_TARGET_HEAD = "target_head";
        Debris.DEBRIS_TARGET_HEAD_GIB_1 = "target_head_gib_1";
        Debris.DEBRIS_TARGET_HEAD_GIB_2 = "target_head_gib_2";
        Debris.DEBRIS_TARGET_HEAD_GIB_3 = "target_head_gib_3";
        Debris.DEBRIS_TARGET_NECK = "target_neck";
        Debris.DEBRIS_TARGET_BODY = "target_body";
        Debris.DEBRIS_TARGET_BODY_GIB_1 = "target_body_gib_1";
        Debris.DEBRIS_TARGET_BODY_GIB_2 = "target_body_gib_2";
        Debris.DEBRIS_TARGET_BODY_GIB_3 = "target_body_gib_3";
        Debris.DEBRIS_STAR = "star";
        return Debris;
    }(WorldObject));
    TacticalWeaponPack.Debris = Debris;
    var Shell = /** @class */ (function (_super) {
        __extends(Shell, _super);
        function Shell(_x, _y, _rotation, _type) {
            var _this = _super.call(this, null, _x, _y, _rotation) || this;
            _this.shellType = _type;
            _this.shell = _this.game.add.sprite(0, 0, "atlas_objects", "shell_" + _type);
            _this.shell.anchor.set(0.5, 0.5);
            _this.addChild(_this.shell);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this, TacticalWeaponPack.State_Game.INDEX_SHELLS);
            _this.createBody();
            _this.setDestroyTimer(5);
            _this.enableDestroyTimer();
            var bBlurEnabled = false;
            if (bBlurEnabled) {
                _this.blurX = TacticalWeaponPack.GameUtil.game.add.filter("BlurX");
                _this.blurY = TacticalWeaponPack.GameUtil.game.add.filter("BlurY");
                var tween = _this.game.add.tween(_this.blurX).to({ blur: 0 }, 200, Phaser.Easing.Linear.None, true);
                var tween = _this.game.add.tween(_this.blurY).to({ blur: 0 }, 200, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(_this.clearBlur, _this);
                _this.filters = [_this.blurX, _this.blurY];
            }
            return _this;
        }
        Shell.prototype.destroy = function () {
            this.blurX = null;
            this.blurY = null;
            this.shell = null;
            _super.prototype.destroy.call(this);
        };
        Shell.prototype.clearBlur = function () {
            this.filters = undefined;
            this.blurX = null;
            this.blurY = null;
        };
        Shell.prototype.onHit = function (_obj, _data) {
            _super.prototype.onHit.call(this, _obj, _data);
            var sfx = this.shellType == TacticalWeaponPack.WeaponDatabase.ROUND_12G ? "shotgun" : "generic";
            TacticalWeaponPack.SoundManager.PlayWorldSound("physics_shell_" + sfx, this.x, this.y, 3, 0.35);
        };
        Shell.prototype.createBody = function () {
            var shellBody = new Phaser.Physics.Box2D.Body(this.game, this.shell, this.x, this.y, 0);
            shellBody.setRectangleFromSprite(this.shell);
            shellBody.rotation = this.rotation;
            shellBody.dynamic = true;
            shellBody.restitution = 0.35;
            shellBody.setCollisionCategory(TacticalWeaponPack.State_Game.CATEGORY_SHELLS);
            shellBody.setCollisionMask(TacticalWeaponPack.State_Game.MASK_OBJECTS);
            var rad = this.rotation + ((TacticalWeaponPack.MathUtil.Random(-25, 5) - 90) * TacticalWeaponPack.MathUtil.TO_RADIANS);
            var speed = TacticalWeaponPack.MathUtil.Random(5, 15);
            shellBody.applyForce(Math.cos(rad) * speed, Math.sin(rad) * speed);
            shellBody.angularVelocity = TacticalWeaponPack.MathUtil.Random(-15, 30);
            this.addBody(shellBody);
            this.body = shellBody;
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_OBJECTS, this.bodyCallback, this);
            this.body.setCategoryContactCallback(TacticalWeaponPack.State_Game.CATEGORY_WALLS, this.bodyCallback, this);
        };
        return Shell;
    }(WorldObject));
    TacticalWeaponPack.Shell = Shell;
    var Smoke = /** @class */ (function (_super) {
        __extends(Smoke, _super);
        function Smoke(_type) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.alphaRate = -0.01;
            _this.scaleXRate = 0;
            _this.scaleYRate = 0;
            _this.rotationRate = 0;
            _this.xRate = 0;
            _this.smokeType = _type;
            var atlas = "atlas_effects";
            var atlasKey = "smoke";
            if (_this.smokeType == Smoke.SMOKE_DEFAULT) {
                _this.alpha = 0.3;
                _this.scale.set(TacticalWeaponPack.MathUtil.Random(25, 50) * 0.01, TacticalWeaponPack.MathUtil.Random(25, 50) * 0.01);
                _this.alphaRate = -0.004;
                _this.scaleXRate = TacticalWeaponPack.MathUtil.Random(1, 5) * 0.01;
                _this.scaleYRate = TacticalWeaponPack.MathUtil.Random(1, 5) * 0.01;
                _this.rotationRate = (TacticalWeaponPack.MathUtil.Random(-4, 4) * 0.1) * TacticalWeaponPack.MathUtil.TO_RADIANS;
            }
            else if (_this.smokeType == Smoke.SMOKE_DEBRIS) {
                _this.alpha = 0.2;
                _this.scale.set(0.2, 0.2);
                _this.alphaRate = -0.004;
                _this.scaleXRate = _this.scaleYRate = TacticalWeaponPack.MathUtil.Random(1, 2) * 0.01;
                _this.rotationRate = (TacticalWeaponPack.MathUtil.Random(-5, 5) * 0.1) * TacticalWeaponPack.MathUtil.TO_RADIANS;
            }
            else if (_this.smokeType == Smoke.SMOKE_MUZZLE) {
                _this.alpha = TacticalWeaponPack.MathUtil.Random(15, 25) * 0.01;
                _this.scale.set(0.35, 0.35);
                _this.alphaRate = -0.005;
                _this.scaleXRate = TacticalWeaponPack.MathUtil.Random(-1, 5) * 0.01;
                _this.scaleYRate = TacticalWeaponPack.MathUtil.Random(1, 5) * 0.01;
                _this.rotationRate = (TacticalWeaponPack.MathUtil.Random(-12, 12) * 0.1) * TacticalWeaponPack.MathUtil.TO_RADIANS;
                _this.xRate = TacticalWeaponPack.MathUtil.Random(1, 4);
            }
            else if (_this.smokeType == Smoke.SMOKE_IMPACT) {
                _this.alpha = TacticalWeaponPack.MathUtil.Random(15, 25) * 0.01;
                _this.scale.set(0.25, 0.25);
                _this.alphaRate = -0.008;
                _this.scaleXRate = TacticalWeaponPack.MathUtil.Random(2, 8) * 0.01;
                _this.scaleYRate = TacticalWeaponPack.MathUtil.Random(2, 8) * 0.01;
                _this.rotationRate = (TacticalWeaponPack.MathUtil.Random(-12, 12) * 0.1) * TacticalWeaponPack.MathUtil.TO_RADIANS;
                _this.xRate = TacticalWeaponPack.MathUtil.Random(1, 3);
            }
            _this.smoke = _this.game.add.image(0, 0, atlas, atlasKey);
            _this.smoke.anchor.set(0.5, 0.5);
            //this.smoke.rotation = WilkinUtil.GenerateRandomNumber(-180, 180) * WilkinUtil.TO_RADIANS;
            _this.add(_this.smoke);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(_this);
            return _this;
        }
        Smoke.prototype.destroy = function () {
            this.smoke = null;
            _super.prototype.destroy.call(this);
        };
        Smoke.prototype.update = function () {
            _super.prototype.update.call(this);
            if (!TacticalWeaponPack.GameUtil.GetGameState().isPaused()) {
                this.tick();
            }
        };
        Smoke.prototype.tick = function () {
            if (this.alpha <= 0 || this.smoke.scale.x <= 0 || this.smoke.scale.y <= 0) {
                TacticalWeaponPack.GameUtil.GetGameState().destroySmoke(this);
            }
            else {
                this.alpha += this.alphaRate;
                this.smoke.scale.x += this.scaleXRate;
                this.smoke.scale.y += this.scaleYRate;
                this.smoke.rotation += this.rotationRate;
                this.smoke.x += this.xRate;
            }
        };
        Smoke.SMOKE_DEFAULT = "SMOKE_DEFAULT";
        Smoke.SMOKE_MUZZLE = "SMOKE_MUZZLE";
        Smoke.SMOKE_IMPACT = "SMOKE_IMPACT";
        Smoke.SMOKE_DEBRIS = "SMOKE_DEBRIS";
        return Smoke;
    }(Phaser.Group));
    TacticalWeaponPack.Smoke = Smoke;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var GameUtil = /** @class */ (function () {
        function GameUtil() {
        }
        GameUtil.GetFullVersion = function () {
            var apiName = APIUtil.GetCurrentAPIName();
            return GameUtil.GetVersionNumber() + (apiName ? (" " + apiName) : "");
        };
        GameUtil.GetVersionNumber = function () {
            return "v1.0";
        };
        GameUtil.IsLocalHost = function () {
            return location.hostname == "localhost" || location.hostname == "127.0.0.1";
        };
        GameUtil.IsDebugging = function () {
            return GameUtil.IsLocalHost();
        };
        GameUtil.AdsEnabled = function () {
            if (!GameUtil.game.ads) {
                return false;
            }
            return APIUtil.AdsAreAllowed() && !GameUtil.IsLocalHost();
        };
        GameUtil.ForceStartAudio = function () {
            console.log("Force starting audio...");
            if (GameUtil.game) {
                try {
                    GameUtil.game.sound.context.resume();
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        GameUtil.GetRandomMenuImageId = function () {
            return "menu_" + MathUtil.Random(1, 8);
        };
        GameUtil.CompareUnlocks = function (_a, _b) {
            if (_a["unlockLevel"] < _b["unlockLevel"]) {
                return -1;
            }
            if (_a["unlockLevel"] > _b["unlockLevel"]) {
                return 1;
            }
            return 0;
        };
        GameUtil.CompareNewUnlocks = function (_a, _b) {
            if (_a["type"] < _b["type"]) {
                return -1;
            }
            if (_a["type"] > _b["type"]) {
                return 1;
            }
            return 0;
        };
        GameUtil.OpenAGHomepage = function () {
            window.open("http://armor.ag/MoreGames", "_blank");
        };
        GameUtil.OpenAGFacebook = function () {
            window.open("http://facebook.com/ArmorGames", "_blank");
        };
        GameUtil.OpenWilkinHomepage = function () {
            window.open("http://xwilkinx.com", "_blank");
        };
        GameUtil.OpenWilkinFacebook = function () {
            window.open("http://facebook.com/xwilkinx", "_blank");
        };
        GameUtil.OpenWilkinYoutube = function () {
            window.open("https://youtube.com/channel/UChk6XyAUFGtECyOOpEBnpiA", "_blank");
        };
        GameUtil.OpenTWPDownload = function () {
            window.open("http://xwilkinx.com/tactical-weapon-pack", "_blank");
        };
        GameUtil.OpenTWP2 = function () {
            window.open("http://xwilkinx.com/tactical-weapon-pack-2", "_blank");
        };
        GameUtil.OpenAWPDownload = function () {
            window.open("http://xwilkinx.com/adversity-weapon-pack", "_blank");
        };
        GameUtil.GetPlacementColours = function () {
            return [
                0xFFD662,
                0xBEC5CC,
                0x746752
            ];
        };
        GameUtil.CreateSocialButtons = function () {
            var buttons = this.game.add.group();
            var butPadding = 10;
            var xwilkinxButton = new TacticalWeaponPack.ImageButton("atlas_ui", "social_xwilkinx");
            xwilkinxButton.setCallback(GameUtil.OpenWilkinHomepage, GameUtil);
            buttons.add(xwilkinxButton);
            var downloadButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_download_small");
            downloadButton.setCallback(GameUtil.OpenTWPDownload, GameUtil);
            downloadButton.x = buttons.width + butPadding;
            buttons.add(downloadButton);
            var facebookButton = new TacticalWeaponPack.ImageButton("atlas_ui", "social_facebook");
            facebookButton.setCallback(GameUtil.OpenWilkinFacebook, GameUtil);
            facebookButton.x = buttons.width + butPadding;
            buttons.add(facebookButton);
            var youtubeButton = new TacticalWeaponPack.ImageButton("atlas_ui", "social_youtube");
            youtubeButton.setCallback(GameUtil.OpenWilkinYoutube, GameUtil);
            youtubeButton.x = buttons.width + butPadding;
            buttons.add(youtubeButton);
            return buttons;
        };
        GameUtil.OpenEditClasses = function () {
            if (GameUtil.game.getMainMenu()) {
                GameUtil.game.getMainMenu().loadMenu(TacticalWeaponPack.MainMenu.MENU_EDIT_CLASS, 0);
            }
        };
        GameUtil.GetGameState = function () {
            var state = GameUtil.game.state.getCurrentState();
            return state instanceof TacticalWeaponPack.State_Game ? state : null;
        };
        GameUtil.GetPreloaderState = function () {
            var state = GameUtil.game.state.getCurrentState();
            return state instanceof TacticalWeaponPack.State_Preloader ? state : null;
        };
        GameUtil.FormatNum = function (_num) {
            if (isNaN(_num)) {
                return "";
            }
            return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        GameUtil.GetKeySize = function (_id) {
            if (_id == Phaser.Keyboard.SPACEBAR) {
                return 100;
            }
            if (_id == Phaser.Keyboard.CONTROL || _id == Phaser.Keyboard.SHIFT || _id == Phaser.Keyboard.ALT || _id == Phaser.Keyboard.TAB) {
                return 64;
            }
            return 32;
        };
        GameUtil.GetKeyStringFromId = function (_id) {
            var keyCode = _id;
            if (keyCode == Phaser.KeyCode.LEFT) {
                return "Left";
            }
            else if (keyCode == Phaser.KeyCode.RIGHT) {
                return "Right";
            }
            else if (keyCode == Phaser.KeyCode.UP) {
                return "Up";
            }
            else if (keyCode == Phaser.KeyCode.DOWN) {
                return "Down";
            }
            else if (keyCode == Phaser.KeyCode.SHIFT) {
                return "Shift";
            }
            else if (keyCode == Phaser.KeyCode.CONTROL) {
                return "Ctrl";
            }
            else if (keyCode == Phaser.KeyCode.SPACEBAR) {
                return "Space";
            }
            else if (keyCode == Phaser.KeyCode.TAB) {
                return "Tab";
            }
            else if (keyCode == Phaser.KeyCode.ENTER) {
                return "Enter";
            }
            else if (keyCode == Phaser.KeyCode.ALT) {
                return "Alt";
            }
            else if (keyCode == Phaser.KeyCode.ESC) {
                return "Esc";
            }
            return String.fromCharCode(keyCode);
        };
        GameUtil.ConvertToTimeString = function (_seconds, _bAddMilliSeconds) {
            if (_bAddMilliSeconds === void 0) { _bAddMilliSeconds = false; }
            _seconds = Math.ceil(_seconds);
            var s = _seconds % 60;
            var ms = (_seconds % 1) * 100;
            var m = Math.floor((_seconds % 3600) / 60);
            var h = Math.floor(_seconds / (60 * 60));
            var hourStr = (h == 0) ? "" : doubleDigitFormat(h) + ":";
            var minuteStr = doubleDigitFormat(m) + ":";
            var secondsStr = doubleDigitFormat(s);
            var msStr = doubleDigitFormat(ms);
            function doubleDigitFormat(_num) {
                if (_num < 10) {
                    return ("0" + _num);
                }
                return String(_num);
            }
            return hourStr + minuteStr + secondsStr + (_bAddMilliSeconds ? ("." + msStr) : "");
        };
        GameUtil.CloneObject = function (_obj) {
            try {
                var obj = JSON.parse(JSON.stringify(_obj));
            }
            catch (e) {
                console.error(e);
                return _obj;
            }
            return obj;
        };
        GameUtil.GetRandomTip = function () {
            var tips = this.game.cache.getJSON("json_tips");
            var arr = tips["generic"];
            return "Tip: " + arr[MathUtil.Random(0, arr.length - 1)];
        };
        GameUtil.CreateWeapon = function (_data) {
            var id = _data["id"];
            var weapon = TacticalWeaponPack.WeaponDatabase.GetWeapon(id);
            if (weapon) {
                var padding = 2;
                var group = GameUtil.game.add.group();
                group.name = id;
                var basePoint = weapon["points"]["base"];
                if (basePoint) {
                    var base = GameUtil.game.add.image(basePoint.x, basePoint.y, "atlas_" + id, TacticalWeaponPack.WeaponDatabase.BASE_DEFAULT);
                    base.name = "base";
                    base.x = Math.round(base.x - (base.width * 0.5));
                    base.y = Math.round(base.y - (base.height * 0.5));
                    group.add(base);
                }
                var opticPoint = weapon["points"]["optic"];
                if (opticPoint) {
                    var optic = GameUtil.game.add.image(opticPoint.x, opticPoint.y + padding, "atlas_" + id, _data["optic"] ? _data["optic"] : TacticalWeaponPack.WeaponDatabase.OPTIC_DEFAULT);
                    optic.name = "optic";
                    optic.x = Math.round(optic.x - (optic.width * 0.5));
                    optic.y = Math.round(optic.y - (optic.height));
                    group.add(optic);
                }
                var magPoint = weapon["points"]["mag"];
                if (magPoint) {
                    var mag = GameUtil.game.add.image(magPoint.x, magPoint.y, "atlas_" + id, TacticalWeaponPack.WeaponDatabase.MAG_DEFAULT);
                    mag.name = "mag";
                    mag.x = Math.round(mag.x - (mag.width * 0.5));
                    mag.y = Math.round(mag.y - (mag.height * 0.5));
                    if (magPoint["bFront"] == true) {
                        group.add(mag);
                    }
                    else {
                        group.addAt(mag, 0);
                    }
                }
                var pumpPoint = weapon["points"]["pump"];
                if (pumpPoint) {
                    var pump = GameUtil.game.add.image(pumpPoint.x, pumpPoint.y, "atlas_" + id, TacticalWeaponPack.WeaponDatabase.PUMP_DEFAULT);
                    pump.name = "pump";
                    pump.x = Math.round(pump.x - (pump.width * 0.5));
                    pump.y = Math.round(pump.y - (pump.height * 0.5));
                    group.add(pump);
                }
                var slidePoint = weapon["points"]["slide"];
                if (slidePoint) {
                    var slide = GameUtil.game.add.image(slidePoint.x, slidePoint.y, "atlas_" + id, TacticalWeaponPack.WeaponDatabase.SLIDE_DEFAULT);
                    slide.name = "slide";
                    slide.x = Math.round(slide.x - (slide.width * 0.5));
                    slide.y = Math.round(slide.y - (slide.height * 0.5));
                    group.add(slide);
                }
                var m203Point = weapon["points"]["m203"];
                if (m203Point) {
                    var bSmallM203 = weapon["bSmallM203"];
                    var barrel = GameUtil.game.add.image(0, 0, "atlas_mods", bSmallM203 ? TacticalWeaponPack.WeaponDatabase.BARREL_M203_SMALL : TacticalWeaponPack.WeaponDatabase.BARREL_M203);
                    barrel.name = TacticalWeaponPack.WeaponDatabase.BARREL_M203;
                    barrel.scale.set(0.5, 0.5);
                    barrel.x = Math.round(m203Point.x);
                    barrel.y = Math.round(m203Point.y);
                    group.add(barrel);
                    if (_data["barrel"] != TacticalWeaponPack.WeaponDatabase.BARREL_M203) {
                        barrel.visible = false;
                    }
                }
                var laserPoint = weapon["points"]["laser"];
                if (laserPoint) {
                    var barrel = GameUtil.game.add.image(0, 0, "atlas_mods", TacticalWeaponPack.WeaponDatabase.BARREL_LASER);
                    barrel.name = TacticalWeaponPack.WeaponDatabase.BARREL_LASER;
                    barrel.scale.set(0.5, 0.5);
                    barrel.x = Math.round(laserPoint.x);
                    barrel.y = Math.round(laserPoint.y);
                    /*
                    barrel.x = Math.round(laserPoint.x - (barrel.width * 0.5));
                    barrel.y = Math.round(laserPoint.y - (barrel.height * 0.5));
                    */
                    group.add(barrel);
                    if (_data["barrel"] != TacticalWeaponPack.WeaponDatabase.BARREL_LASER) {
                        barrel.visible = false;
                    }
                }
                for (var i = 0; i < group.length; i++) {
                    var item = group.getAt(i);
                    item.x += base.width * 0.5;
                    item.y += (base.height * 0.5) + (optic != null ? (optic.height * 0.5) : 0);
                }
                var texture = group.generateTexture();
                return group;
            }
            return null;
        };
        GameUtil.CreateSpinner = function () {
            /*
            var spinner = this.game.add.image(0, 0, "atlas_ui", "icon_spinner");
            spinner.anchor.set(0.5, 0.5);
            */
            var spinner = this.game.add.group();
            var circle = this.game.add.graphics();
            circle.lineStyle(2, 0xFFFFFF, 0.2);
            circle.drawCircle(0, 0, 24);
            spinner.add(circle);
            var section = this.game.add.graphics();
            section.lineStyle(2, 0xFFFFFF, 1);
            section.arc(0, 0, 12, 0, 60 * MathUtil.TO_RADIANS, false);
            spinner.add(section);
            var tween = this.game.add.tween(section).to({ rotation: 360 * MathUtil.TO_RADIANS }, 1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
            return spinner;
        };
        GameUtil.CreateTree = function (_items) {
            var gfx = GameUtil.game.add.graphics();
            gfx.lineStyle(1, 0xFFFFFF, 0.2);
            var startX = 0;
            for (var i = 0; i < _items.length; i++) {
                var item = _items[i];
                if (i == 0) {
                    startX = item.x + 10;
                    gfx.moveTo(startX, item.y + item.height);
                }
                else {
                    item.x = startX + 20;
                    gfx.lineTo(startX, item.y + (item.height * 0.5));
                    gfx.lineTo(startX + 10, item.y + (item.height * 0.5));
                    gfx.moveTo(startX, item.y + (item.height * 0.5));
                }
            }
            return gfx;
        };
        GameUtil.OnOverSetText = function (_arg1, _arg2, _text, _val) {
            _text.setText(_val, true);
        };
        GameUtil.OnOutClearText = function (_arg1, _arg2, _text) {
            _text.setText("", true);
        };
        GameUtil.ConvertToNumeral = function (_val) {
            if (!+_val)
                return "?";
            var digits = String(+_val).split(""), key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"], roman = "", i = 3;
            while (i--)
                roman = (key[+digits.pop() + (i * 10)] || "") + roman;
            return Array(+digits.join("") + 1).join("M") + roman;
        };
        GameUtil.DestroyArray = function (_arr) {
            if (_arr) {
                while (_arr.length > 0) {
                    if ("destroy" in _arr[0]) {
                        _arr[0].destroy();
                    }
                    _arr.splice(0, 1);
                }
            }
        };
        GameUtil.SetTextShadow = function (_text) {
            _text.setShadow(2, 2, "rgba(0,0,0,0.45)", 0);
        };
        GameUtil.RECTANGLE_RADIUS = 8;
        return GameUtil;
    }());
    TacticalWeaponPack.GameUtil = GameUtil;
    var APIUtil = /** @class */ (function () {
        function APIUtil() {
        }
        APIUtil.Init = function () {
            console.log("Initializing API: " + APIUtil.CurrentAPI);
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.ag) {
                    return;
                }
                APIUtil.ag = GameUtil.game.ag;
                //APIUtil.ValidateSession(true);
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    return;
                }
                APIUtil.ngio = GameUtil.game.ngio;
                APIUtil.ngio.debug = GameUtil.IsDebugging();
                APIUtil.ValidateSession(false);
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                if (APIUtil.kong) {
                    return;
                }
                APIUtil.kong = GameUtil.game.kong;
                APIUtil.kong.services.addEventListener("login", APIUtil.OnLoggedIn);
            }
        };
        APIUtil.ValidateSession = function (_bPromptUser) {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.ag) {
                    if (!APIUtil.agUser) {
                        APIUtil.ag.authenticateUser().then(function (user) {
                            APIUtil.agUser = user;
                            var prevName = APIUtil.CurrentUserName;
                            APIUtil.CurrentUserName = user["username"];
                            if (prevName != APIUtil.CurrentUserName) {
                                APIUtil.OnLoggedIn();
                            }
                        }).catch(function (error) {
                            APIUtil.CurrentUserName = null;
                            if (_bPromptUser) {
                                APIUtil.ShowSignInFailedWindow();
                            }
                        });
                    }
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                APIUtil.ngio.getValidSession(function () {
                    if (APIUtil.ngio.user) {
                        APIUtil.CurrentUserName = APIUtil.ngio.user.name;
                    }
                    if (_bPromptUser) {
                        if (APIUtil.ngio.user) {
                            APIUtil.OnLoggedIn();
                        }
                        else {
                            APIUtil.ShowSignInWindow();
                        }
                    }
                });
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                if (_bPromptUser) {
                    APIUtil.ShowSignInWindow();
                }
            }
        };
        APIUtil.SaveData = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.ag) {
                    //...
                }
            }
        };
        APIUtil.LoadData = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.ag) {
                    //...
                }
            }
        };
        APIUtil.SubmitScore = function (_gameId, _score) {
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    var leaderboardsId = TacticalWeaponPack.GameModeDatabase.GetGameMode(_gameId)["leaderboardsId"];
                    APIUtil.ngio.callComponent("ScoreBoard.postScore", { id: leaderboardsId, value: _score }, APIUtil.OnScoreSubmitted);
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                if (APIUtil.kong) {
                    APIUtil.kong.stats.submit(TacticalWeaponPack.GameModeDatabase.GetGameMode(_gameId)["name"], _score);
                }
            }
        };
        APIUtil.OnScoreSubmitted = function (_result) {
            if (_result && _result.success) {
                //
            }
            else {
                GameUtil.game.createWindow({
                    titleText: "Submit Score",
                    type: TacticalWeaponPack.Window.TYPE_MESSAGE,
                    messageText: "Error submitting score!"
                });
            }
        };
        APIUtil.UnlockAchievement = function (_id) {
            var item = TacticalWeaponPack.AchievementsDatabase.GetAchievement(_id);
            if (!item) {
                return;
            }
            if (APIUtil.IsLoggedIn()) {
                if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                }
                else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                    if (APIUtil.ngio) {
                        APIUtil.ngio.callComponent("Medal.unlock", { id: item["medalId"] }, APIUtil.OnMedalUnlocked);
                    }
                }
            }
        };
        APIUtil.OnMedalUnlocked = function (_result) {
            console.log("Newgrounds medal unlocked!");
        };
        APIUtil.LoadLeaderboards = function (_gameId, _leaderboards) {
            APIUtil.CurrentLeaderboards = _leaderboards;
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    var leaderboardsId = TacticalWeaponPack.GameModeDatabase.GetGameMode(_gameId)["leaderboardsId"];
                    APIUtil.ngio.callComponent("ScoreBoard.getScores", { id: leaderboardsId }, APIUtil.OnNewgroundsLeaderboardsLoaded);
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                var statisticId = TacticalWeaponPack.GameModeDatabase.GetGameMode(_gameId)["statisticId"];
                var loader = GameUtil.game.load.json("kong_leaderboards", "https://api.kongregate.com/api/high_scores/lifetime/" + statisticId + ".json", true);
                loader.crossOrigin = true;
                loader.start();
                loader.onLoadComplete.add(APIUtil.OnKongLeaderboardsLoaded);
            }
        };
        APIUtil.OnKongLeaderboardsLoaded = function () {
            var json = GameUtil.game.cache.getJSON("kong_leaderboards");
            if (json) {
                var scores = json["lifetime_scores"];
                var playerList = [];
                var newItem;
                for (var i = 0; i < scores.length; i++) {
                    var item = scores[i];
                    newItem = {
                        name: item["username"],
                        score: item["score"],
                        url: "https://www.kongregate.com/accounts/" + item["username"]
                    };
                    playerList.push(newItem);
                }
                if (APIUtil.CurrentLeaderboards) {
                    APIUtil.CurrentLeaderboards.setScores(playerList);
                }
            }
            else {
                if (APIUtil.CurrentLeaderboards) {
                    APIUtil.CurrentLeaderboards.setError();
                }
            }
        };
        APIUtil.OnNewgroundsLeaderboardsLoaded = function (_result) {
            if (_result && _result.success) {
                var scoreboard = _result.scoreboard;
                var scores = _result.scores;
                var playerList = [];
                var newItem;
                for (var i = 0; i < scores.length; i++) {
                    var item = scores[i];
                    var user = item["user"];
                    newItem = {
                        name: user.name,
                        score: item["value"],
                        url: "http://" + user.name + ".newgrounds.com"
                    };
                    playerList.push(newItem);
                }
                if (APIUtil.CurrentLeaderboards) {
                    APIUtil.CurrentLeaderboards.setScores(playerList);
                }
            }
            else {
                if (APIUtil.CurrentLeaderboards) {
                    APIUtil.CurrentLeaderboards.setError();
                }
            }
        };
        APIUtil.ShowSignInWindow = function () {
            GameUtil.game.createWindow({
                titleText: "Sign In",
                type: TacticalWeaponPack.Window.TYPE_YES_NO,
                messageText: "Would you like to connect your " + APIUtil.GetCurrentAPIName() + " account?\n\nThis will allow you to submit your score, unlock achievements, and more.",
                highlights: [APIUtil.GetCurrentAPIName()],
                icon: GameUtil.game.add.image(0, 0, "atlas_ui", "icon_" + APIUtil.GetCurrentAPIId()),
                yesCallback: APIUtil.RequestLogin,
                yesCallbackContext: APIUtil
            });
        };
        APIUtil.ShowSignInFailedWindow = function () {
            GameUtil.game.createWindow({
                titleText: "Sign In Failed",
                type: TacticalWeaponPack.Window.TYPE_MESSAGE,
                messageText: "There was a problem connecting your " + APIUtil.GetCurrentAPIName() + " account!"
            });
        };
        APIUtil.GetCurrentAPIId = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                return "AG";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                return "NG";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                return "KONG";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_GAME_DISTRIBUTION) {
                return "GD";
            }
            return "N/A";
        };
        APIUtil.GetCurrentAPIName = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                return "Armor Games";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                return "Newgrounds";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                return "Kongregate";
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_GAME_DISTRIBUTION) {
                return "Game Distribution";
            }
            return null;
        };
        APIUtil.GetUserName = function () {
            if (APIUtil.CurrentUserName) {
                return APIUtil.CurrentUserName;
            }
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.agUser) {
                    return APIUtil.agUser["username"];
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio && APIUtil.ngio.user) {
                    return APIUtil.ngio.user.name;
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                if (APIUtil.kong) {
                    return APIUtil.kong.services.getUsername();
                }
            }
            if (APIUtil.CurrentAPI) {
                return APIUtil.GetCurrentAPIName() + " Player";
            }
            return "Player";
        };
        APIUtil.HasLeaderboards = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                return false;
            }
            else if (!APIUtil.CurrentAPI) {
                return false;
            }
            return true;
        };
        APIUtil.CanManuallyLogIn = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                return false;
            }
            return true;
        };
        APIUtil.OnLoggedIn = function () {
            PlayerUtil.player["name"] = APIUtil.GetUserName();
            var menu = GameUtil.game.getMainMenu();
            if (menu) {
                if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_PROFILE) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_PROFILE);
                }
                else if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_MAIN) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_MAIN);
                }
            }
            console.log("API logged in");
        };
        APIUtil.OnLoggedOut = function () {
            var menu = GameUtil.game.getMainMenu();
            if (menu) {
                if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_PROFILE) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_PROFILE);
                }
                else if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_MAIN) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_MAIN);
                }
            }
            APIUtil.ShowSignOutWindow();
        };
        APIUtil.OnLoginFailed = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    APIUtil.ShowSignInFailedWindow();
                }
            }
        };
        APIUtil.OnLoginCancelled = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    APIUtil.ShowSignInFailedWindow();
                }
            }
        };
        APIUtil.Logout = function () {
            APIUtil.CurrentUserName = null;
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    APIUtil.ngio.logOut(function () {
                        APIUtil.OnLoggedOut();
                    });
                }
            }
        };
        APIUtil.ShowSignOutWindow = function () {
            GameUtil.game.createWindow({
                titleText: "Signed Out",
                type: TacticalWeaponPack.Window.TYPE_MESSAGE,
                messageText: "Your " + APIUtil.GetCurrentAPIName() + " account has been disconnected."
            });
        };
        APIUtil.CanSaveData = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                return false;
            }
            return false;
        };
        APIUtil.AdsAreAllowed = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                return false;
            }
            return true;
        };
        APIUtil.RequestLogin = function () {
            if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    APIUtil.ngio.requestLogin(APIUtil.OnLoggedIn, APIUtil.OnLoginFailed, APIUtil.OnLoginCancelled);
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                try {
                    if (APIUtil.kong) {
                        APIUtil.kong.services.showRegistrationBox();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        };
        APIUtil.IsLoggedIn = function () {
            if (!APIUtil.CurrentAPI) {
                return false;
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.agUser) {
                    return true;
                }
            }
            APIUtil.ValidateSession(false);
            if (APIUtil.CurrentAPI == APIUtil.API_ARMOR_GAMES) {
                if (APIUtil.ag) {
                    if (APIUtil.CurrentUserName != null) {
                        return true;
                    }
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_NEWGROUNDS) {
                if (APIUtil.ngio) {
                    return APIUtil.ngio.user;
                }
            }
            else if (APIUtil.CurrentAPI == APIUtil.API_KONGREGATE) {
                if (APIUtil.kong) {
                    return !APIUtil.kong.services.isGuest();
                }
            }
            return false;
        };
        APIUtil.API_ARMOR_GAMES = "API_ARMOR_GAMES";
        APIUtil.API_NEWGROUNDS = "API_NEWGROUNDS";
        APIUtil.API_KONGREGATE = "API_KONGREGATE";
        APIUtil.API_GAME_DISTRIBUTION = "API_GAME_DISTRIBUTION";
        APIUtil.CurrentAPI = null;
        APIUtil.CurrentUserName = null;
        APIUtil.CurrentLeaderboards = null;
        return APIUtil;
    }());
    TacticalWeaponPack.APIUtil = APIUtil;
    var PlayerUtil = /** @class */ (function () {
        function PlayerUtil() {
        }
        PlayerUtil.Init = function () {
            PlayerUtil.player = {
                name: "Player",
                bTutorial: false,
                gameVersion: GameUtil.GetVersionNumber()
            };
            PlayerUtil.player["ranked"] = PlayerUtil.GetNewData();
            PlayerUtil.player["achievements"] = PlayerUtil.GetNewAchievements();
            PlayerUtil.player["settings"] = PlayerUtil.GetNewSettings();
            PlayerUtil.player["controls"] = PlayerUtil.GetNewControls();
            if (GameUtil.IsDebugging()) {
                //PlayerUtil.UnlockAll();
                //PlayerUtil.player["ranked"]["rank"] = PlayerUtil.MAX_RANK; //MathUtil.Random(1, PlayerUtil.MAX_LEVEL);
                //PlayerUtil.player["ranked"]["xp"] = PlayerUtil.GetRequiredXPForRank(PlayerUtil.player["ranked"]["rank"]) + MathUtil.Random(1, 99);
                //PlayerUtil.player["ranked"]["prestige"] = MathUtil.Random(0, PlayerUtil.MAX_PRESTIGE);
            }
        };
        PlayerUtil.SetFromData = function (_data) {
            if (_data) {
                PlayerUtil.player = _data;
            }
        };
        PlayerUtil.UnlockAll = function () {
            //PlayerUtil.AddPrestige();
            PlayerUtil.GetRankedData()["rank"] = PlayerUtil.MAX_RANK;
            PlayerUtil.GetRankedData()["xp"] = PlayerUtil.GetRequiredXPForRank(PlayerUtil.player["ranked"]["rank"] - 1) * 2;
            var weapons = PlayerUtil.GetRankedData()["weapons"];
            for (var id in weapons) {
                var obj = weapons[id];
                obj["kills"] = MathUtil.Random(300, 1000);
                obj["headshots"] = MathUtil.Random(300, 1000);
            }
            var bestScores = PlayerUtil.GetRankedData()["bestScores"];
            for (var id in bestScores) {
                var modeData = TacticalWeaponPack.GameModeDatabase.GetGameMode(id);
                if (modeData["ranks"]) {
                    bestScores[id] = modeData["ranks"][2];
                }
            }
            var menu = GameUtil.game.getMainMenu();
            if (menu) {
                if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_PROFILE) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_PROFILE);
                }
            }
        };
        PlayerUtil.GetAchievements = function () {
            return PlayerUtil.player["achievements"];
        };
        PlayerUtil.GetRankedData = function () {
            return PlayerUtil.player["ranked"];
        };
        PlayerUtil.GetSettingsData = function () {
            return PlayerUtil.player["settings"];
        };
        PlayerUtil.GetControlsData = function () {
            return PlayerUtil.player["controls"];
        };
        PlayerUtil.ResetData = function () {
            console.log("Reset player data");
            PlayerUtil.player["bTutorial"] = false;
            PlayerUtil.player["ranked"] = PlayerUtil.GetNewData();
            PlayerUtil.player["achievements"] = PlayerUtil.GetNewAchievements();
            PlayerUtil.player["settings"] = PlayerUtil.GetNewSettings();
            PlayerUtil.player["controls"] = PlayerUtil.GetNewControls();
            PlayerUtil.ClearNewUnlocks();
            PlayerUtil.ClearPendingItems();
            GameUtil.game.savePlayerData();
            SoundManager.UpdateMusicVolume();
            var menu = GameUtil.game.getMainMenu();
            if (menu) {
                if (menu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_PROFILE) {
                    menu.loadMenu(TacticalWeaponPack.MainMenu.MENU_PROFILE);
                }
            }
        };
        PlayerUtil.UnlockAchievement = function (_id) {
            console.log("Unlock achievement: " + _id);
            if (PlayerUtil.GetAchievements()[_id] != true) {
                PlayerUtil.GetAchievements()[_id] = true;
                GameUtil.game.pushAchievement(_id);
            }
            GameUtil.game.savePlayerData();
            APIUtil.UnlockAchievement(_id);
        };
        PlayerUtil.GetNumAchivementsUnlocked = function () {
            var count = 0;
            var achievements = PlayerUtil.GetAchievements();
            for (var key in achievements) {
                if (achievements[key] == true) {
                    count++;
                }
            }
            return count;
        };
        PlayerUtil.GetNewAchievements = function () {
            var data = {};
            var achievements = TacticalWeaponPack.AchievementsDatabase.GetAllIds();
            for (var i = 0; i < achievements.length; i++) {
                data[achievements[i]] = false;
            }
            return data;
        };
        PlayerUtil.GetNewData = function () {
            var weapons = {};
            var arr = TacticalWeaponPack.WeaponDatabase.GetAllWeapons();
            for (var i = 0; i < arr.length; i++) {
                weapons[arr[i]["id"]] = {
                    kills: 0,
                    headshots: 0
                };
            }
            var bestScores = {};
            var arr = TacticalWeaponPack.GameModeDatabase.GetAllRankedGameModes();
            for (var i = 0; i < arr.length; i++) {
                bestScores[arr[i]["id"]] = 0;
            }
            bestScores[TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS] = 0;
            return {
                rank: 1,
                prestige: 0,
                kills: 0,
                headshots: 0,
                shotsFired: 0,
                shotsHit: 0,
                kills_ranked: 0,
                headshots_ranked: 0,
                shotsFired_ranked: 0,
                shotsHit_ranked: 0,
                xp: 0,
                classes: ClassUtil.GetDefaultClasses(),
                weapons: weapons,
                bestScores: bestScores,
                newUnlocks: [],
                pendingItems: []
            };
        };
        PlayerUtil.GetNewSettings = function () {
            return {
                gameVolume: 1,
                musicVolume: 1
            };
        };
        PlayerUtil.SetGameVolume = function (_val) {
            PlayerUtil.GetSettingsData()["gameVolume"] = _val;
            SoundManager.UpdateAmbienceVolume();
            GameUtil.game.savePlayerData();
        };
        PlayerUtil.SetMusicVolume = function (_val) {
            PlayerUtil.GetSettingsData()["musicVolume"] = _val;
            SoundManager.UpdateMusicVolume();
            GameUtil.game.savePlayerData();
        };
        PlayerUtil.GetNewControls = function () {
            return {
                reload: Phaser.Keyboard.R,
                switchWeapon: Phaser.Keyboard.Q,
                action: Phaser.Keyboard.SPACEBAR,
                barrel: Phaser.Keyboard.F
            };
        };
        PlayerUtil.GetKeyDescription = function (_id) {
            if (_id == PlayerUtil.CONTROL_RELOAD) {
                return "Reload";
            }
            else if (_id == PlayerUtil.CONTROL_SWITCH_WEAPON) {
                return "Switch weapon";
            }
            else if (_id == PlayerUtil.CONTROL_BARREL) {
                return "Use barrel attachment";
            }
            else if (_id == PlayerUtil.CONTROL_ACTION) {
                return "Create target (firing range)";
            }
            return "Unknown";
        };
        PlayerUtil.GetCurrentAccuracy = function () {
            var data = PlayerUtil.GetRankedData();
            var accuracy = data["shotsHit"] / data["shotsFired"];
            if (isNaN(accuracy)) {
                return 0;
            }
            return Math.min(accuracy, 1);
        };
        PlayerUtil.GetRequiredXPForRank = function (_rank) {
            if (_rank <= 1) {
                return 0;
            }
            return this.GetRequiredXPForRank(_rank - 1) + (5 * (_rank * 15));
        };
        PlayerUtil.GetXPPercent = function (_xp, _rank) {
            var current = (_xp - this.GetRequiredXPForRank(_rank));
            var max = (this.GetRequiredXPForRank(_rank + 1) - this.GetRequiredXPForRank(_rank));
            return current / max;
        };
        PlayerUtil.GetCurrentXPPercent = function () {
            var data = PlayerUtil.GetRankedData();
            if (data["rank"] >= PlayerUtil.MAX_RANK) {
                return 1;
            }
            return PlayerUtil.GetXPPercent(data["xp"], data["rank"]);
        };
        PlayerUtil.GetFavouriteWeapon = function () {
            var cur = null;
            var max = 0;
            var weapons = PlayerUtil.GetRankedData()["weapons"];
            for (var id in weapons) {
                var obj = weapons[id];
                if (obj["kills"] > max) {
                    cur = id;
                    max = obj["kills"];
                }
            }
            return cur;
        };
        PlayerUtil.AddPrestige = function () {
            var rankedData = PlayerUtil.GetRankedData();
            rankedData["prestige"] = Math.min(rankedData["prestige"] + 1, PlayerUtil.MAX_PRESTIGE);
            rankedData["rank"] = 1;
            rankedData["xp"] = 0;
            rankedData["classes"] = ClassUtil.GetDefaultClasses();
            var weapons = PlayerUtil.GetRankedData()["weapons"];
            for (var id in weapons) {
                var obj = weapons[id];
                obj["kills"] = 0;
                obj["headshots"] = 0;
            }
            var mainMenu = GameUtil.game.getMainMenu();
            if (mainMenu) {
                if (mainMenu.getCurrentMenuId() == TacticalWeaponPack.MainMenu.MENU_RANKED) {
                    mainMenu.loadMenu(TacticalWeaponPack.MainMenu.MENU_RANKED);
                }
            }
            PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_PRESTIGE);
        };
        PlayerUtil.AddXP = function (_val) {
            var hud = GameUtil.GetGameState() ? GameUtil.GetGameState().getHUD() : null;
            var data = PlayerUtil.GetRankedData();
            data["xp"] += _val;
            var xp = data["xp"];
            var nextXP = PlayerUtil.GetRequiredXPForRank(data["rank"] + 1);
            if (data["rank"] < PlayerUtil.MAX_RANK && xp >= nextXP) {
                data["rank"]++;
                //data["xp"] = PlayerUtil.GetRequiredXPForRank(data["rank"]);
                if (hud) {
                    hud.addRankNotifier({
                        type: "rank"
                    });
                }
                var player = GameUtil.GetGameState().getPlayerPawn();
                for (var i = 0; i < 10; i++) {
                    var star = GameUtil.GetGameState().createDebris(player.x, player.y, 0, TacticalWeaponPack.Debris.DEBRIS_STAR);
                    star.getBody().applyForce(MathUtil.Random(-100, 100), -MathUtil.Random(100, 300));
                }
                var newUnlocks = PlayerUtil.GetUnlocksForRank(data["rank"]);
                for (var i = 0; i < newUnlocks.length; i++) {
                    var cur = newUnlocks[i];
                    PlayerUtil.AddNewUnlock(cur["type"], cur["id"]);
                }
                SoundManager.PlayUISound("ui_level_up", 0.5);
            }
            if (hud) {
                hud.getPlayerInfo().updateForCurrentPlayer();
            }
            SoundManager.PlayUISound("ui_point", 0.5);
        };
        PlayerUtil.OnChallengeComplete = function () {
            //SoundManager.PlayUISound("ui_challenge_complete");
            var player = GameUtil.GetGameState().getPlayerPawn();
            GameUtil.GetGameState().getHUD().addXPNotifier(player.x, player.y, 100, false);
            PlayerUtil.AddXP(100);
        };
        PlayerUtil.HasPendingSkill = function () {
            if (PlayerUtil.IsPendingNewItems()) {
                var items = PlayerUtil.GetPendingItems();
                for (var i = 0; i < items.length; i++) {
                    var cur = items[i];
                    if (cur["type"] == "skill") {
                        return true;
                    }
                }
            }
            return false;
        };
        PlayerUtil.IsPendingItem = function (_id) {
            if (PlayerUtil.IsPendingNewItems()) {
                var items = PlayerUtil.GetPendingItems();
                for (var i = 0; i < items.length; i++) {
                    var cur = items[i];
                    if (cur["id"] == _id) {
                        return true;
                    }
                }
            }
            return false;
        };
        PlayerUtil.HasPendingMod = function (_id, _weaponId) {
            if (PlayerUtil.IsPendingNewItems()) {
                var items = PlayerUtil.GetPendingItems();
                for (var i = 0; i < items.length; i++) {
                    var cur = items[i];
                    if (cur["type"] == "mod") {
                        if (cur["data"]["weaponId"] == _weaponId) {
                            var index = cur["id"].indexOf(_id);
                            if (index >= 0) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };
        PlayerUtil.HasPendingItemsForWeaponCategories = function (_categories) {
            if (PlayerUtil.IsPendingNewItems()) {
                var items = PlayerUtil.GetPendingItems();
                for (var i = 0; i < items.length; i++) {
                    var cur = items[i];
                    if (cur["type"] == "weapon") {
                        var wpn = TacticalWeaponPack.WeaponDatabase.GetWeapon(cur["id"]);
                        for (var j = 0; j < _categories.length; j++) {
                            if (wpn["type"] == _categories[j]) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };
        PlayerUtil.AddPendingItem = function (_data) {
            PlayerUtil.player["ranked"]["pendingItems"].push(_data);
        };
        PlayerUtil.ClearPendingItemById = function (_id) {
            if (PlayerUtil.IsPendingNewItems()) {
                var items = PlayerUtil.GetPendingItems();
                for (var i = items.length - 1; i >= 0; i--) {
                    var cur = items[i];
                    if (cur["id"] == _id) {
                        items.splice(i, 1);
                    }
                }
                GameUtil.game.savePlayerData();
            }
        };
        PlayerUtil.GetPendingItems = function () {
            return PlayerUtil.player["ranked"]["pendingItems"];
        };
        PlayerUtil.IsPendingNewItems = function () {
            console.log(PlayerUtil.player);
            try {
                return PlayerUtil.player["ranked"]["pendingItems"].length > 0;
            }
            catch (e) {
                return false;
            }
        };
        PlayerUtil.ClearPendingItems = function () {
            PlayerUtil.player["ranked"]["pendingItems"] = [];
            GameUtil.game.savePlayerData();
        };
        PlayerUtil.AddNewUnlock = function (_type, _id, _data) {
            if (_data === void 0) { _data = null; }
            if (_data) {
                var newUnlocks = PlayerUtil.player["ranked"]["newUnlocks"];
                for (var i = 0; i < newUnlocks.length; i++) {
                    if (newUnlocks[i]["data"]) {
                        if (newUnlocks[i]["id"] == _id && newUnlocks[i]["data"]["weaponId"] == _data["weaponId"]) {
                            return;
                        }
                    }
                    else {
                        if (newUnlocks[i]["id"] == _id) {
                            return;
                        }
                    }
                }
            }
            PlayerUtil.player["ranked"]["newUnlocks"].push({ type: _type, id: _id, data: _data });
            PlayerUtil.AddPendingItem({ type: _type, id: _id, data: _data });
        };
        PlayerUtil.GetNewUnlocks = function () {
            return PlayerUtil.player["ranked"]["newUnlocks"];
        };
        PlayerUtil.HasNewUnlocks = function () {
            return PlayerUtil.player["ranked"]["newUnlocks"].length > 0;
        };
        PlayerUtil.ClearNewUnlocks = function () {
            PlayerUtil.player["ranked"]["newUnlocks"] = [];
            GameUtil.game.savePlayerData();
        };
        PlayerUtil.GetCurrentRankId = function () {
            return "icon_rank_" + Math.ceil(PlayerUtil.GetRankedData()["rank"] / 3);
        };
        PlayerUtil.GetRankIdFor = function (_val) {
            return "icon_rank_" + Math.ceil(_val / 3);
        };
        PlayerUtil.GetRankTitle = function () {
            var id = PlayerUtil.GetCurrentRankId();
            if (id == "icon_rank_1") {
                return "Private";
            }
            else if (id == "icon_rank_2") {
                return "Private 1st Class";
            }
            else if (id == "icon_rank_3") {
                return "Corporal";
            }
            else if (id == "icon_rank_4") {
                return "Sergeant";
            }
            else if (id == "icon_rank_5") {
                return "Staff Sergeant";
            }
            else if (id == "icon_rank_6") {
                return "Sergeant 1st Class";
            }
            else if (id == "icon_rank_7") {
                return "Master Sergeant";
            }
            else if (id == "icon_rank_8") {
                return "First Sergeant";
            }
            else if (id == "icon_rank_9") {
                return "Sergeant Major";
            }
            else if (id == "icon_rank_10") {
                return "Commander";
            }
            return null;
        };
        PlayerUtil.HasKillstreak = function (_id) {
            var killstreaks = PlayerUtil.GetRankedData()["killstreaks"];
            for (var i = 0; i < killstreaks.length; i++) {
                if (killstreaks[i] == _id) {
                    return true;
                }
            }
            return false;
        };
        PlayerUtil.GetUnlocksForRank = function (_rank) {
            if (_rank <= 1) {
                return [];
            }
            var weapons = TacticalWeaponPack.WeaponDatabase.GetAllWeaponsByUnlockLevel(_rank);
            var skills = TacticalWeaponPack.SkillDatabase.GetAllSkillsByUnlockLevel(_rank);
            var arr = weapons;
            arr = arr.concat(skills);
            return arr;
        };
        PlayerUtil.GetAllUnlocksForRank = function (_rank) {
            if (_rank <= 1) {
                return [];
            }
            var arr = PlayerUtil.GetAllUnlocksForRank(_rank - 1);
            var weapons = TacticalWeaponPack.WeaponDatabase.GetAllWeaponsByUnlockLevel(_rank);
            var skills = TacticalWeaponPack.SkillDatabase.GetAllSkillsByUnlockLevel(_rank);
            arr = arr.concat(weapons);
            arr = arr.concat(skills);
            return arr;
        };
        PlayerUtil.MAX_PRESTIGE = 1;
        PlayerUtil.MAX_RANK = 30;
        PlayerUtil.CHALLENGE_KILLS = 100;
        PlayerUtil.CHALLENGE_HEADSHOTS = 50;
        PlayerUtil.CHALLENGE_SHOTS_FIRED = 500;
        PlayerUtil.CONTROL_RELOAD = "reload";
        PlayerUtil.CONTROL_SWITCH_WEAPON = "switchWeapon";
        PlayerUtil.CONTROL_ACTION = "action";
        PlayerUtil.CONTROL_BARREL = "barrel";
        return PlayerUtil;
    }());
    TacticalWeaponPack.PlayerUtil = PlayerUtil;
    var ClassUtil = /** @class */ (function () {
        function ClassUtil() {
        }
        ClassUtil.GetDefaultClasses = function () {
            var classes = [
                {
                    name: "Assault",
                    primary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_MP5
                    },
                    secondary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M9
                    },
                    perk_1: {
                        id: TacticalWeaponPack.SkillDatabase.SKILL_AIM
                    }
                },
                {
                    name: "Marksman",
                    primary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M16A4
                    },
                    secondary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M9
                    },
                    perk_1: {
                        id: TacticalWeaponPack.SkillDatabase.SKILL_AIM
                    }
                },
                {
                    name: "Close Quarters",
                    primary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_MOSSBERG
                    },
                    secondary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M9
                    },
                    perk_1: {
                        id: TacticalWeaponPack.SkillDatabase.SKILL_AIM
                    }
                },
                {
                    name: "Sniper",
                    primary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M40A3
                    },
                    secondary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M9
                    },
                    perk_1: {
                        id: TacticalWeaponPack.SkillDatabase.SKILL_AIM
                    }
                },
                {
                    name: "Heavy",
                    primary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_MG4
                    },
                    secondary: {
                        id: TacticalWeaponPack.WeaponDatabase.WEAPON_M9
                    },
                    perk_1: {
                        id: TacticalWeaponPack.SkillDatabase.SKILL_AIM
                    }
                }
            ];
            return classes;
        };
        return ClassUtil;
    }());
    TacticalWeaponPack.ClassUtil = ClassUtil;
    var ColourUtil = /** @class */ (function () {
        function ColourUtil() {
        }
        ColourUtil.GetHealthColours = function () {
            return [ColourUtil.COLOUR_RED, 0xFF9933, ColourUtil.COLOUR_GREEN];
        };
        ColourUtil.COLOUR_THEME = 0x6699CC;
        ColourUtil.COLOUR_GREEN = 0x00CC66; //0x43A047;
        ColourUtil.COLOUR_GREEN_STRING = "#00CC66";
        ColourUtil.COLOUR_RED = 0xDD3333;
        ColourUtil.COLOUR_RED_STRING = "#DD3333";
        ColourUtil.COLOUR_RED_QUIT = 0xDD3333;
        ColourUtil.COLOUR_XP = 0xFFD662; //0xFFCC33;
        ColourUtil.COLOUR_XP_STRING = "#FFD662";
        return ColourUtil;
    }());
    TacticalWeaponPack.ColourUtil = ColourUtil;
    var MathUtil = /** @class */ (function () {
        function MathUtil() {
        }
        MathUtil.Random = function (_min, _max) {
            return GameUtil.game.rnd.between(_min, _max);
        };
        MathUtil.RandomBoolean = function () {
            return Math.random() > 0.5;
        };
        MathUtil.RandomAngle = function () {
            return MathUtil.Random(0, 360) * MathUtil.TO_RADIANS;
        };
        MathUtil.Dist = function (_x1, _y1, _x2, _y2) {
            return Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
        };
        MathUtil.Angle = function (_x1, _y1, _x2, _y2) {
            var distX = _x2 - _x1;
            var distY = _y2 - _y1;
            return Math.atan2(distY, distX);
        };
        MathUtil.ToRad = function (_degrees) {
            return _degrees * MathUtil.TO_RADIANS;
        };
        MathUtil.TO_RADIANS = Math.PI / 180;
        MathUtil.TO_DEGREES = 180 / Math.PI;
        return MathUtil;
    }());
    TacticalWeaponPack.MathUtil = MathUtil;
    var FontUtil = /** @class */ (function () {
        function FontUtil() {
        }
        FontUtil.FONT = "Share Tech";
        FontUtil.FONT_HUD = "PT Mono";
        return FontUtil;
    }());
    TacticalWeaponPack.FontUtil = FontUtil;
    var SoundManager = /** @class */ (function () {
        function SoundManager() {
        }
        SoundManager.SetMute = function (_bVal) {
            SoundManager.bMute = _bVal;
            GameUtil.game.sound.mute = _bVal;
            if (!SoundManager.bMute) {
                if (SoundManager.CurrentMusic) {
                    SoundManager.UpdateMusicVolume();
                }
            }
        };
        SoundManager.IsMuted = function () {
            return SoundManager.bMute;
        };
        SoundManager.PlayMusic = function (_id) {
            if (SoundManager.CurrentMusic) {
                SoundManager.CurrentMusic.stop();
                SoundManager.CurrentMusic = null;
            }
            var sfx = GameUtil.game.add.audio(_id);
            sfx.loop = true;
            SoundManager.CurrentMusic = sfx;
            SoundManager.CurrentMusic.play();
            SoundManager.UpdateMusicVolume();
        };
        SoundManager.UpdateMusicVolume = function () {
            if (SoundManager.CurrentMusic) {
                var desiredVolume = PlayerUtil.GetSettingsData()["musicVolume"];
                if (SoundManager.bMute) {
                    desiredVolume = 0;
                }
                SoundManager.CurrentMusic.volume = desiredVolume;
            }
        };
        SoundManager.PlayAmbience = function (_id) {
            if (SoundManager.CurrentAmbience) {
                SoundManager.CurrentAmbience.stop();
                SoundManager.CurrentAmbience = null;
            }
            var sfx = GameUtil.game.add.audio(_id);
            sfx.loop = true;
            SoundManager.CurrentAmbience = sfx;
            SoundManager.CurrentAmbience.play();
            SoundManager.UpdateAmbienceVolume();
        };
        SoundManager.UpdateAmbienceVolume = function () {
            if (SoundManager.CurrentAmbience) {
                var desiredVolume = PlayerUtil.GetSettingsData()["gameVolume"] * 0.8;
                if (GameUtil.GetGameState()) {
                    if (GameUtil.GetGameState().isPaused()) {
                        desiredVolume = 0;
                    }
                }
                if (SoundManager.bMute) {
                    desiredVolume = 0;
                }
                SoundManager.CurrentAmbience.volume = desiredVolume;
            }
        };
        SoundManager.DestroyAmbience = function () {
            if (SoundManager.CurrentAmbience) {
                SoundManager.CurrentAmbience.stop();
                SoundManager.CurrentAmbience.destroy();
                SoundManager.CurrentAmbience = null;
            }
        };
        SoundManager.PlaySound = function (_id) {
            if (SoundManager.bMute) {
                return null;
            }
            var sfx = GameUtil.game.add.audio(_id);
            if (sfx) {
                sfx.play();
            }
            return sfx;
        };
        SoundManager.PlayUISound = function (_id, _volumeMultiplier) {
            if (_volumeMultiplier === void 0) { _volumeMultiplier = 1; }
            if (SoundManager.bMute) {
                return null;
            }
            var desiredVolume = PlayerUtil.GetSettingsData()["gameVolume"] * _volumeMultiplier;
            if (desiredVolume > 0) {
                var sfx = GameUtil.game.add.audio(_id);
                sfx.volume = desiredVolume;
                sfx.play();
                return sfx;
            }
            return null;
        };
        SoundManager.PlayWorldSound = function (_id, _x, _y, _randomMax, _volumeMultiplier) {
            if (_randomMax === void 0) { _randomMax = 0; }
            if (_volumeMultiplier === void 0) { _volumeMultiplier = 1; }
            if (SoundManager.bMute) {
                return null;
            }
            var desiredVolume = (SoundManager.GetVolForWorldPosition(_x, _y) * PlayerUtil.GetSettingsData()["gameVolume"] * _volumeMultiplier) * 0.6;
            var soundId = _id;
            if (_randomMax > 0) {
                soundId += "_" + MathUtil.Random(1, _randomMax).toString();
            }
            var sfx = GameUtil.game.add.audio(soundId);
            if (sfx) {
                var sound = sfx instanceof Phaser.Sound ? sfx : null;
                sfx.volume = desiredVolume;
                sfx.play();
                if (sfx._sound) {
                    try {
                        var bRandomize = soundId.indexOf("wpn") >= 0 || soundId.indexOf("physics") >= 0 || soundId.indexOf("explosion") >= 0;
                        if (bRandomize) {
                            var randMax = 130;
                            if (soundId.indexOf("wpn_fire") >= 0) {
                                randMax = 160;
                            }
                            sfx._sound.playbackRate.value = MathUtil.Random(100, randMax) * 0.01;
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                if (sound) {
                    if (SoundManager.sounds.length > SoundManager.MAX_SOUNDS) {
                        SoundManager.DestroySound(SoundManager.sounds[0], 0);
                    }
                    sound.onStop.addOnce(SoundManager.DestroySound, SoundManager, 0, [sound]);
                    SoundManager.sounds.push(sound);
                }
            }
            return sfx;
        };
        SoundManager.GetVolForWorldPosition = function (_x, _y) {
            var world = GameUtil.GetGameState();
            var stageWidthMid = GameUtil.game.scale.width * 0.5;
            var stageHeightMid = GameUtil.game.scale.height * 0.5;
            var global = new Phaser.Point(_x, _y);
            global.x -= GameUtil.game.camera.x;
            global.y -= GameUtil.game.camera.y;
            var dist = MathUtil.Dist(global.x, global.y, stageWidthMid, stageHeightMid);
            var volume = 1 - (dist * 0.0007);
            return Math.min(Math.max(0, volume), 1);
        };
        SoundManager.DestroySound = function (_sfx, _index) {
            if (_index === void 0) { _index = -1; }
            try {
                if (_sfx) {
                    var index = _index >= 0 ? _index : SoundManager.sounds.indexOf(_sfx);
                    if (index >= 0) {
                        SoundManager.sounds.splice(0, 1);
                    }
                    else {
                        console.error("Sound not in array: " + _sfx.name);
                    }
                    _sfx.onStop.removeAll(SoundManager);
                    _sfx.stop();
                    _sfx.destroy();
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        SoundManager.MAX_SOUNDS = 80;
        SoundManager.sounds = [];
        SoundManager.bMute = false;
        return SoundManager;
    }());
    TacticalWeaponPack.SoundManager = SoundManager;
    var DamageType = /** @class */ (function () {
        function DamageType() {
        }
        DamageType.DAMAGE_TYPE_BULLET = "DAMAGE_TYPE_BULLET";
        DamageType.DAMAGE_TYPE_EXPLOSIVE = "DAMAGE_TYPE_EXPLOSIVE";
        DamageType.DAMAGE_TYPE_WORLD = "DAMAGE_TYPE_WORLD";
        return DamageType;
    }());
    TacticalWeaponPack.DamageType = DamageType;
    var AdUtil = /** @class */ (function () {
        function AdUtil() {
        }
        AdUtil.OnPauseGame = function () {
            console.log("OnPauseGame");
            AdUtil.bGameWasMuted = SoundManager.IsMuted();
            SoundManager.SetMute(true);
            AdUtil.bPaused = true;
        };
        AdUtil.OnResumeGame = function () {
            console.log("OnResumeGame");
            GameUtil.ForceStartAudio();
            if (!AdUtil.bGameWasMuted) {
                SoundManager.SetMute(false);
            }
            AdUtil.bPaused = false;
            var preloader = GameUtil.GetPreloaderState();
            if (preloader) {
                if (preloader.isComplete()) {
                    preloader.startGame();
                }
            }
        };
        AdUtil.IsPaused = function () {
            return AdUtil.bPaused;
        };
        AdUtil.SetWasCancelled = function (_bVal) {
            AdUtil.bWasCancelled = _bVal;
        };
        AdUtil.WasCancelled = function () {
            return AdUtil.bWasCancelled;
        };
        AdUtil.ShowAd = function () {
            console.log("Attemping to show ad...");
            if (GameUtil.AdsEnabled()) {
                var ads = GameUtil.game.ads;
                if (ads) {
                    console.log("Show ad");
                    ads.showAd();
                }
                else {
                    console.warn("Invalid GameUtil.game.ads instance");
                }
            }
            else {
                console.log("Ads are not enabled");
            }
        };
        AdUtil.bPaused = false;
        AdUtil.bGameWasMuted = false;
        AdUtil.bWasCancelled = false;
        return AdUtil;
    }());
    TacticalWeaponPack.AdUtil = AdUtil;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var State_Boot = /** @class */ (function (_super) {
        __extends(State_Boot, _super);
        function State_Boot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fontIndex = 0;
            return _this;
        }
        State_Boot.prototype.init = function () {
            this.game.forceSingleUpdate = true;
            this.game.clearBeforeRender = false;
            this.game.stage.setBackgroundColor(0x000000);
            this.game.stage.disableVisibilityChange = true;
            this.game.renderer.renderSession.roundPixels = true;
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            TacticalWeaponPack.GameUtil.game = this.game;
            TacticalWeaponPack.GameUtil.game.initialize();
        };
        State_Boot.prototype.preload = function () {
        };
        State_Boot.prototype.create = function () {
            try {
                window.addEventListener("keydown", function (e) {
                    if ([32].indexOf(e.keyCode) > -1) {
                        e.preventDefault();
                    }
                }, false);
            }
            catch (e) {
                console.error(e);
            }
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
            this.game.time.advancedTiming = true;
            this.game.physics.startSystem(Phaser.Physics.BOX2D);
            this.game.physics.box2d.gravity.y = 1200;
            this.game.physics.box2d.velocityIterations = 4;
            this.game.physics.box2d.positionIterations = 3;
            this.verifyFonts();
        };
        State_Boot.prototype.verifyFonts = function () {
            this.fontIndex = 0;
            this.fonts = [
                TacticalWeaponPack.FontUtil.FONT,
                TacticalWeaponPack.FontUtil.FONT_HUD
            ];
            this.fontsText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, "Loading fonts...");
            this.fontsText.alpha = 0.2;
            this.fontsText.anchor.set(0.5, 0.5);
            this.loadNextFont();
        };
        State_Boot.prototype.loadNextFont = function () {
            if (this.fontIndex > this.fonts.length - 1) {
                var timer = this.game.time.create();
                timer.add(TacticalWeaponPack.GameUtil.IsDebugging() ? 50 : 500, this.startPreloader, this);
                timer.start();
            }
            else {
                this.fontsText.setStyle({ font: "12px " + this.fonts[this.fontIndex], fill: "#FFFFFF" }, true);
                this.fontsText.setText("Loading font: " + this.fonts[this.fontIndex], true);
                this.fontIndex++;
                var timer = this.game.time.create();
                timer.add(500, this.loadNextFont, this);
                timer.start();
            }
        };
        State_Boot.prototype.startPreloader = function () {
            this.game.state.start("PreloaderState");
        };
        return State_Boot;
    }(Phaser.State));
    TacticalWeaponPack.State_Boot = State_Boot;
    var State_Preloader = /** @class */ (function (_super) {
        __extends(State_Preloader, _super);
        function State_Preloader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.bComplete = false;
            return _this;
        }
        State_Preloader.prototype.init = function () {
            this.container = this.game.add.group();
            this.loadBar = new TacticalWeaponPack.UIBar({
                w: this.game.width * 0.8,
                h: 2,
                bInterpColour: true,
                colours: [0x999999, 0x999999, TacticalWeaponPack.ColourUtil.COLOUR_GREEN]
            });
            this.container.add(this.loadBar);
            var spinner = TacticalWeaponPack.GameUtil.CreateSpinner();
            spinner.x = this.loadBar.width * 0.5;
            this.loadBar.y = spinner.y + (spinner.height * 0.5) + 20;
            this.container.add(spinner);
            this.loadText = this.game.add.text(0, 0, "Loading, please wait...", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            this.loadText.x = (this.loadBar.width * 0.5) - (this.loadText.width * 0.5);
            this.loadText.y = this.loadBar.y + 20;
            this.container.add(this.loadText);
            this.fileText = this.game.add.text(0, 0, "", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            this.fileText.setTextBounds(0, 0, this.loadBar.width, 20);
            this.fileText.alpha = 0.2;
            this.fileText.y = this.loadText.y + 20;
            this.container.add(this.fileText);
            //var tween = this.game.add.tween(this.loadText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
            this.container.x = (this.game.width * 0.5) - (this.container.width * 0.5);
            this.container.y = (this.game.height * 0.5) - (this.container.height * 0.5) + 40;
            var titleText = this.game.add.text(0, 0, "Tactical Weapon Pack", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (this.game.width * 0.5) - (titleText.width * 0.5);
            titleText.y = this.container.y - titleText.height - 50;
            var versionInfo = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.GetVersionNumber(), { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            versionInfo.alpha = 0.2;
            versionInfo.x = (this.game.width * 0.5) - (versionInfo.width * 0.5);
            versionInfo.y = titleText.y + titleText.height - 2;
            this.load.onFileStart.add(this.fileUpdate, this);
            var copyrightText = this.game.add.text(0, 0, "\u00A9 2018 XWILKINX", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            copyrightText.alpha = 0.2;
            copyrightText.x = (this.game.width * 0.5) - (copyrightText.width * 0.5);
            copyrightText.y = this.game.height - copyrightText.height;
            this.load.onFileStart.add(this.fileUpdate, this);
        };
        State_Preloader.prototype.preload = function () {
            this.load.json("json_tips", "assets/json/tips.json");
            this.load.atlas("atlas_ui", "assets/images/ui/atlas_ui.png", "assets/images/ui/atlas_ui.json");
            this.load.atlas("atlas_weapons", "assets/images/ui/atlas_weapons.png", "assets/images/ui/atlas_weapons.json");
            this.load.atlas("atlas_mods", "assets/images/weapons/atlas_mods.png", "assets/images/weapons/atlas_mods.json");
            this.load.atlas("atlas_effects", "assets/images/game/atlas_effects.png", "assets/images/game/atlas_effects.json");
            this.load.atlas("atlas_objects", "assets/images/game/atlas_objects.png", "assets/images/game/atlas_objects.json");
            this.load.image("splash", "assets/images/bg/splash.jpg");
            for (var i = 0; i < 8; i++) {
                var numId = i + 1;
                this.load.image("menu_" + numId, "assets/images/bg/menu_" + numId + ".jpg");
            }
            this.load.image("smoke", "assets/images/bg/smoke.png");
            this.load.image("tiles", "assets/images/bg/tiles.jpg");
            this.load.image("blocker", "assets/images/bg/blocker.png");
            this.load.image("gradient", "assets/images/bg/gradient.png");
            this.load.image("world", "assets/images/bg/world.png");
            this.load.image("xwilkinx_logo_half", "assets/images/xwilkinx/xwilkinx_logo_half.png");
            this.load.image("sponsor_ag", "assets/images/sponsors/sponsor_ag.png");
            this.load.image("sponsor_ag_small", "assets/images/sponsors/sponsor_ag_small.png");
            this.load.image("sponsor_ag_button", "assets/images/sponsors/sponsor_ag_button.png");
            var weapons = TacticalWeaponPack.WeaponDatabase.GetAllWeapons();
            for (var i = 0; i < weapons.length; i++) {
                var id = weapons[i]["id"];
                var atlasId = "atlas_" + id;
                this.load.atlas(atlasId, "assets/images/weapons/" + atlasId + ".png", "assets/images/weapons/" + atlasId + ".json");
                this.load.audio("wpn_fire_" + id, "assets/sounds/weapons/wpn_fire_" + id + ".mp3");
            }
            this.load.audio("music_menu", "assets/sounds/music/music_menu.mp3");
            this.load.audio("music_game_1", "assets/sounds/music/music_game_1.mp3");
            this.load.audio("music_game_2", "assets/sounds/music/music_game_2.mp3");
            this.load.audio("music_game_3", "assets/sounds/music/music_game_3.mp3");
            this.load.audio("music_game_4", "assets/sounds/music/music_game_4.mp3");
            this.load.audio("music_ag", "assets/sounds/music/music_ag.mp3");
            this.load.audio("amb_room", "assets/sounds/ambience/amb_room.mp3");
            this.load.audio("ui_error", "assets/sounds/ui/ui_error.mp3");
            this.load.audio("ui_confirm", "assets/sounds/ui/ui_confirm.mp3");
            this.load.audio("ui_button_click", "assets/sounds/ui/ui_button_click.mp3");
            this.load.audio("ui_button_over", "assets/sounds/ui/ui_button_over.mp3");
            this.load.audio("ui_point", "assets/sounds/ui/ui_point.mp3");
            this.load.audio("ui_game_start", "assets/sounds/ui/ui_game_start.mp3");
            this.load.audio("ui_game_end", "assets/sounds/ui/ui_game_end.mp3");
            this.load.audio("ui_countdown", "assets/sounds/ui/ui_countdown.mp3");
            this.load.audio("ui_loadout_equip", "assets/sounds/ui/ui_loadout_equip.mp3");
            this.load.audio("ui_achievement", "assets/sounds/ui/ui_achievement.mp3");
            this.load.audio("ui_unlock", "assets/sounds/ui/ui_unlock.mp3");
            this.load.audio("ui_beep", "assets/sounds/ui/ui_beep.mp3");
            this.load.audio("ui_level_up", "assets/sounds/ui/ui_level_up.mp3");
            this.load.audio("ui_challenge_complete", "assets/sounds/ui/ui_challenge_complete.mp3");
            this.load.audio("ui_window_close", "assets/sounds/ui/ui_window_close.mp3");
            this.load.audio("ui_window_open", "assets/sounds/ui/ui_window_open.mp3");
            this.load.audio("ui_xwilkinx", "assets/sounds/ui/ui_xwilkinx.mp3");
            this.load.audio("wpn_empty", "assets/sounds/weapons/wpn_empty.mp3");
            this.load.audio("wpn_reload_start", "assets/sounds/weapons/wpn_reload_start.mp3");
            this.load.audio("wpn_reload_end", "assets/sounds/weapons/wpn_reload_start.mp3");
            this.load.audio("wpn_deploy_firearm_1", "assets/sounds/weapons/wpn_deploy_firearm_1.mp3");
            this.load.audio("wpn_deploy_firearm_2", "assets/sounds/weapons/wpn_deploy_firearm_2.mp3");
            this.load.audio("wpn_deploy_firearm_3", "assets/sounds/weapons/wpn_deploy_firearm_3.mp3");
            this.load.audio("wpn_foley_1", "assets/sounds/weapons/wpn_foley_1.mp3");
            this.load.audio("wpn_foley_2", "assets/sounds/weapons/wpn_foley_2.mp3");
            this.load.audio("wpn_foley_3", "assets/sounds/weapons/wpn_foley_3.mp3");
            this.load.audio("explosion_1", "assets/sounds/explosions/explosion_1.mp3");
            this.load.audio("explosion_2", "assets/sounds/explosions/explosion_2.mp3");
            this.load.audio("explosion_3", "assets/sounds/explosions/explosion_3.mp3");
            this.load.audio("explosion_round_1", "assets/sounds/explosions/explosion_round_1.mp3");
            this.load.audio("explosion_round_2", "assets/sounds/explosions/explosion_round_2.mp3");
            this.load.audio("explosion_round_3", "assets/sounds/explosions/explosion_round_3.mp3");
            this.load.audio("physics_grenade_bounce", "assets/sounds/physics/grenade/physics_grenade_bounce.mp3");
            this.load.audio("physics_target_hit_1", "assets/sounds/physics/target/physics_target_hit_1.mp3");
            this.load.audio("physics_target_hit_2", "assets/sounds/physics/target/physics_target_hit_2.mp3");
            this.load.audio("physics_target_hit_3", "assets/sounds/physics/target/physics_target_hit_3.mp3");
            this.load.audio("physics_target_hit_4", "assets/sounds/physics/target/physics_target_hit_4.mp3");
            this.load.audio("physics_target_hit_5", "assets/sounds/physics/target/physics_target_hit_5.mp3");
            this.load.audio("physics_target_headshot_1", "assets/sounds/physics/target/physics_target_headshot_1.mp3");
            this.load.audio("physics_target_headshot_2", "assets/sounds/physics/target/physics_target_headshot_2.mp3");
            this.load.audio("physics_target_headshot_3", "assets/sounds/physics/target/physics_target_headshot_3.mp3");
            this.load.audio("physics_crate_fall", "assets/sounds/physics/crate/physics_crate_fall.mp3");
            this.load.audio("physics_crate_open_1", "assets/sounds/physics/crate/physics_crate_open_1.mp3");
            this.load.audio("physics_crate_open_2", "assets/sounds/physics/crate/physics_crate_open_2.mp3");
            this.load.audio("physics_body_fall", "assets/sounds/physics/body/physics_body_fall.mp3");
            this.load.audio("physics_body_hit_1", "assets/sounds/physics/body/physics_body_hit_1.mp3");
            this.load.audio("physics_body_hit_2", "assets/sounds/physics/body/physics_body_hit_2.mp3");
            this.load.audio("physics_body_hit_3", "assets/sounds/physics/body/physics_body_hit_3.mp3");
            this.load.audio("physics_body_impact_bullet_1", "assets/sounds/physics/body/physics_body_impact_bullet_1.mp3");
            this.load.audio("physics_body_impact_bullet_2", "assets/sounds/physics/body/physics_body_impact_bullet_2.mp3");
            this.load.audio("physics_body_impact_bullet_3", "assets/sounds/physics/body/physics_body_impact_bullet_3.mp3");
            this.load.audio("physics_bullet_flyby_1", "assets/sounds/physics/bullet/physics_bullet_flyby_1.mp3");
            this.load.audio("physics_bullet_flyby_2", "assets/sounds/physics/bullet/physics_bullet_flyby_2.mp3");
            this.load.audio("physics_bullet_flyby_3", "assets/sounds/physics/bullet/physics_bullet_flyby_3.mp3");
            this.load.audio("physics_bullet_flyby_4", "assets/sounds/physics/bullet/physics_bullet_flyby_4.mp3");
            this.load.audio("physics_bullet_flyby_5", "assets/sounds/physics/bullet/physics_bullet_flyby_5.mp3");
            this.load.audio("physics_shell_generic_1", "assets/sounds/physics/shell/physics_shell_generic_1.mp3");
            this.load.audio("physics_shell_generic_2", "assets/sounds/physics/shell/physics_shell_generic_2.mp3");
            this.load.audio("physics_shell_generic_3", "assets/sounds/physics/shell/physics_shell_generic_3.mp3");
            this.load.audio("physics_shell_shotgun_1", "assets/sounds/physics/shell/physics_shell_shotgun_1.mp3");
            this.load.audio("physics_shell_shotgun_2", "assets/sounds/physics/shell/physics_shell_shotgun_2.mp3");
            this.load.audio("physics_shell_shotgun_3", "assets/sounds/physics/shell/physics_shell_shotgun_3.mp3");
            this.load.audio("physics_concrete_impact_bullet_1", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_1.mp3");
            this.load.audio("physics_concrete_impact_bullet_2", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_2.mp3");
            this.load.audio("physics_concrete_impact_bullet_3", "assets/sounds/physics/concrete/physics_concrete_impact_bullet_3.mp3");
            this.load.script("BlurX", "lib/filters/BlurX.js");
            this.load.script("BlurY", "lib/filters/BlurY.js");
            this.load.script("Gray", "lib/filters/Gray.js");
        };
        State_Preloader.prototype.loadUpdate = function () {
            this.loadBar.setValue(this.load.progress * 0.01);
        };
        State_Preloader.prototype.create = function () {
            this.bComplete = true;
            this.fileText.setText("Initializing...", true);
            var data = TacticalWeaponPack.GameUtil.game.getPlayerData();
            if (data) {
                console.log("Saved data found");
                try {
                    var obj = JSON.parse(data);
                    TacticalWeaponPack.PlayerUtil.SetFromData(obj);
                }
                catch (e) {
                    console.error(e);
                    TacticalWeaponPack.PlayerUtil.ResetData();
                }
            }
            else {
                console.log("No saved data found");
            }
            TacticalWeaponPack.APIUtil.ValidateSession(false);
            if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                this.startGame();
            }
            else {
                var timer = this.game.time.create();
                timer.add(500, this.showAd, this);
                timer.start();
            }
        };
        State_Preloader.prototype.isComplete = function () {
            return this.bComplete;
        };
        State_Preloader.prototype.showAd = function () {
            if (TacticalWeaponPack.GameUtil.AdsEnabled() && !TacticalWeaponPack.AdUtil.WasCancelled()) {
                TacticalWeaponPack.AdUtil.ShowAd();
                var timer = this.game.time.create();
                timer.add(2000, this.showStartButton, this);
                timer.start();
            }
            else {
                this.startGame();
            }
        };
        State_Preloader.prototype.showStartButton = function () {
            var startButton = new TacticalWeaponPack.MenuButton(300, "center", TacticalWeaponPack.ColourUtil.COLOUR_GREEN);
            startButton.setLabelText("Start Game");
            startButton.setCallback(this.startGame, this);
            startButton.x = (this.container.width * 0.5) - (startButton.width * 0.5);
            startButton.y = this.container.height + 40;
            this.container.add(startButton);
        };
        State_Preloader.prototype.startGame = function () {
            if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                TacticalWeaponPack.GameUtil.game.loadMenu(null);
            }
            else {
                TacticalWeaponPack.GameUtil.game.loadSponsor();
            }
        };
        State_Preloader.prototype.fileUpdate = function (_param1, _param2, _param3) {
            this.fileText.setText(_param3, true);
        };
        return State_Preloader;
    }(Phaser.State));
    TacticalWeaponPack.State_Preloader = State_Preloader;
    var State_Sponsor = /** @class */ (function (_super) {
        __extends(State_Sponsor, _super);
        function State_Sponsor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        State_Sponsor.prototype.create = function () {
            var gfx = this.game.add.graphics(0, 0);
            gfx.beginFill(0xFFFFFF, 1);
            gfx.drawRect(0, 0, this.game.width, this.game.height);
            this.bg = this.game.add.sprite(0, 0, gfx.generateTexture());
            this.bg.alpha = 0;
            gfx.destroy();
            this.logo = this.game.add.image(0, 0, "sponsor_ag");
            this.logo.anchor.set(0.5, 0.5);
            this.logo.x = this.game.width * 0.5;
            this.logo.y = this.game.height * 0.5;
            this.bg.inputEnabled = true;
            this.bg.events.onInputUp.add(this.onClicked, this);
            var tween = this.game.add.tween(this.logo).from({ y: this.logo.y + 200, alpha: 0 }, 3000, Phaser.Easing.Exponential.InOut, true);
            tween.onComplete.add(this.onTweenComplete, this);
            var tween = this.game.add.tween(this.bg).to({ alpha: 0.2 }, 1200, Phaser.Easing.Exponential.InOut, true, 1800, 0, true);
            TacticalWeaponPack.SoundManager.PlayUISound("music_ag");
        };
        State_Sponsor.prototype.onTweenComplete = function () {
            var tween = this.game.add.tween(this.logo).to({ alpha: 0 }, 2000, Phaser.Easing.Exponential.InOut, true, 800);
            tween.onComplete.add(this.onClose, this);
        };
        State_Sponsor.prototype.onClose = function () {
            TacticalWeaponPack.GameUtil.game.loadIntro();
        };
        State_Sponsor.prototype.onClicked = function () {
            TacticalWeaponPack.GameUtil.OpenAGHomepage();
        };
        return State_Sponsor;
    }(Phaser.State));
    TacticalWeaponPack.State_Sponsor = State_Sponsor;
    var State_Intro = /** @class */ (function (_super) {
        __extends(State_Intro, _super);
        function State_Intro() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        State_Intro.prototype.create = function () {
            this.container = this.game.add.group();
            var gfx = this.game.add.graphics(0, 0);
            gfx.beginFill(0x000000, 1);
            gfx.drawRect(0, 0, this.game.width, this.game.height);
            this.bg = this.game.add.sprite(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.container.add(this.bg);
            this.items = this.game.add.group();
            this.container.add(this.items);
            var xPadding = this.bg.width * 0.5;
            var yPadding = 18;
            this.logoTop = this.game.add.image(0, 0, "xwilkinx_logo_half");
            this.logoTop.alpha = 0;
            this.logoTop.anchor.set(0.5, 0.5);
            this.logoTop.x = (this.bg.width * 0.5) - xPadding;
            this.logoTop.y = (this.bg.height * 0.5) - yPadding;
            this.items.add(this.logoTop);
            this.logoBottom = this.game.add.image(0, 0, "xwilkinx_logo_half");
            this.logoBottom.alpha = 0;
            this.logoBottom.anchor.set(0.5, 0.5);
            this.logoBottom.rotation = 180 * TacticalWeaponPack.MathUtil.TO_RADIANS;
            this.logoBottom.x = (this.bg.width * 0.5) + xPadding;
            this.logoBottom.y = (this.bg.height * 0.5) + yPadding;
            this.items.add(this.logoBottom);
            this.wilkinText = this.game.add.text(0, 0, "XWILKINX", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            this.wilkinText.addColor("#999999", 0);
            this.wilkinText.addColor("#FFFFFF", 1);
            this.wilkinText.addColor("#999999", 7);
            this.wilkinText.alpha = 0;
            this.wilkinText.anchor.set(0.5, 0.5);
            this.wilkinText.x = this.bg.width * 0.5;
            this.wilkinText.y = this.game.height; //this.logoBottom.y + this.logoBottom.height + 30;
            this.items.add(this.wilkinText);
            this.gamesText = this.game.add.text(0, 0, "Game Development", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            this.gamesText.alpha = 0;
            this.gamesText.anchor.set(0.5, 0.5);
            this.gamesText.x = this.wilkinText.x;
            this.gamesText.y = this.wilkinText.y;
            this.items.add(this.gamesText);
            this.start();
            this.bg.inputEnabled = true;
            this.bg.events.onInputUp.add(this.onClicked, this);
        };
        State_Intro.prototype.onClicked = function () {
            TacticalWeaponPack.GameUtil.OpenWilkinHomepage();
        };
        State_Intro.prototype.start = function () {
            TacticalWeaponPack.SoundManager.PlayUISound("ui_xwilkinx");
            var speed = 1000;
            var delay = 250;
            var tween = this.game.add.tween(this.logoTop).to({ x: this.bg.width * 0.5 }, speed, Phaser.Easing.Exponential.Out, true);
            var tween = this.game.add.tween(this.logoTop).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true);
            var tween = this.game.add.tween(this.logoBottom).to({ x: this.bg.width * 0.5 }, speed, Phaser.Easing.Exponential.Out, true);
            var tween = this.game.add.tween(this.logoBottom).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true);
            var desiredWilkinTextY = (this.logoBottom.y + (this.logoBottom.height * 0.5)) + 24;
            var tween = this.game.add.tween(this.wilkinText).to({ alpha: 1 }, speed, Phaser.Easing.Exponential.Out, true, delay);
            var tween = this.game.add.tween(this.wilkinText).to({ y: desiredWilkinTextY }, speed, Phaser.Easing.Exponential.Out, true, delay);
            var tween = this.game.add.tween(this.gamesText).to({ alpha: 0.5 }, speed, Phaser.Easing.Exponential.Out, true, delay * 2);
            var tween = this.game.add.tween(this.gamesText).to({ y: desiredWilkinTextY + (this.wilkinText.height * 0.5) + 8 }, speed, Phaser.Easing.Exponential.Out, true, delay * 2);
            tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_3");
        };
        State_Intro.prototype.end = function () {
            var tween = this.game.add.tween(this.items).to({ alpha: 0 }, 3000, Phaser.Easing.Quintic.InOut, true);
            tween.onComplete.addOnce(this.onTweenComplete, this, 0, "tween_4");
        };
        State_Intro.prototype.onTweenComplete = function (_currentTarget, _currentTween, _id) {
            if (_id == "tween_3") {
                var timer = this.game.time.create(true);
                timer.add(500, this.end, this);
                timer.start();
            }
            else if (_id == "tween_4") {
                TacticalWeaponPack.GameUtil.game.loadMenu(null);
            }
        };
        return State_Intro;
    }(Phaser.State));
    TacticalWeaponPack.State_Intro = State_Intro;
    var State_Menu = /** @class */ (function (_super) {
        __extends(State_Menu, _super);
        function State_Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        State_Menu.prototype.init = function (_menuId) {
            this.menuId = _menuId;
        };
        State_Menu.prototype.create = function () {
            if (!this.menuId) {
                this.loadSplashMenu();
            }
            else {
                this.loadMainMenu(this.menuId);
            }
            TacticalWeaponPack.SoundManager.PlayMusic("music_menu");
        };
        State_Menu.prototype.loadSplashMenu = function () {
            if (this.mainMenu) {
                this.mainMenu.destroy();
                this.mainMenu = null;
            }
            this.splashMenu = new TacticalWeaponPack.SplashMenu();
            this.splashMenu.setOnCloseCallback(this.loadMainMenu, this);
        };
        State_Menu.prototype.loadMainMenu = function (_menuId) {
            if (this.splashMenu) {
                this.splashMenu.destroy();
                this.splashMenu = null;
            }
            this.mainMenu = new TacticalWeaponPack.MainMenu(_menuId);
        };
        State_Menu.prototype.loadPreGameMenu = function (_data) {
            if (this.mainMenu) {
                this.mainMenu.destroy();
                this.mainMenu = null;
            }
            this.preGameMenu = new TacticalWeaponPack.PreGameMenu(_data);
        };
        State_Menu.prototype.getMainMenu = function () {
            return this.mainMenu;
        };
        State_Menu.prototype.getSplashMenu = function () {
            return this.splashMenu;
        };
        State_Menu.prototype.getPreGameMenu = function () {
            return this.preGameMenu;
        };
        return State_Menu;
    }(Phaser.State));
    TacticalWeaponPack.State_Menu = State_Menu;
    var State_Game = /** @class */ (function (_super) {
        __extends(State_Game, _super);
        function State_Game() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.max = 0;
            _this.maxPawns = 1;
            _this.targetX = 0;
            _this.targetY = 0;
            _this.targetScale = 1;
            _this.targetScaleModifier = 1;
            _this.cameraMouseLookRatio = 0.5;
            _this.cameraMouseLookRatio2 = _this.cameraMouseLookRatio * 0.5;
            _this.cameraMouseLookRatioMultiplier = 1;
            _this.bPaused = false;
            _this.bPendingDestroy = false;
            return _this;
        }
        State_Game.prototype.init = function (_data) {
            _super.prototype.init.call(this, _data);
            this.data = _data;
            this.worldFilters = {
                blur: { bEnabled: false },
                gray: { bEnabled: false }
            };
            this.controllers = [];
            this.objects = [];
            this.shells = [];
            this.debris = [];
            this.objectsToDestroy = [];
            this.queue = [];
            this.muzzleFlashes = [];
            this.explosions = [];
            this.smokes = [];
            this.pawns = [];
            this.decals = [];
            this.emitters = [];
            this.layerWorld = this.game.add.group();
            this.layerWorld_0 = this.game.add.group();
            this.layerWorld.add(this.layerWorld_0);
            this.layerWorld_1 = this.game.add.group();
            this.layerWorld.add(this.layerWorld_1);
            this.layerWorld_2 = this.game.add.group();
            this.layerWorld.add(this.layerWorld_2);
            this.layerWorld_3 = this.game.add.group();
            this.layerWorld.add(this.layerWorld_3);
            this.layerWorld_4 = this.game.add.group();
            this.layerWorld.add(this.layerWorld_4);
            this.layerUI = this.game.add.group();
            this.layerPauseMenu = this.game.add.group();
            TacticalWeaponPack.GameUtil.game.ui.add(this.layerUI);
            TacticalWeaponPack.GameUtil.game.ui.add(this.layerPauseMenu);
        };
        State_Game.prototype.create = function () {
            this.game.physics.box2d.paused = false;
            this.buildWorld();
            this.setMaxPawns(30);
            var gameModeId = this.data["gameMode"];
            if (gameModeId == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                this.gameMode = new TacticalWeaponPack.GameMode_Range();
            }
            else if (gameModeId == TacticalWeaponPack.GameModeDatabase.GAME_SHOOTER) {
                this.gameMode = new TacticalWeaponPack.GameMode_MultiShooter();
            }
            else if (gameModeId == TacticalWeaponPack.GameModeDatabase.GAME_SNIPER) {
                this.gameMode = new TacticalWeaponPack.GameMode_Sniper();
            }
            else if (gameModeId == TacticalWeaponPack.GameModeDatabase.GAME_TIME_ATTACK) {
                this.gameMode = new TacticalWeaponPack.GameMode_TimeAttack();
            }
            else if (gameModeId == TacticalWeaponPack.GameModeDatabase.GAME_DEFENDER) {
                this.gameMode = new TacticalWeaponPack.GameMode_Defender();
            }
            else {
                this.gameMode = new TacticalWeaponPack.RankedGameMode();
            }
            if (this.gameMode) {
                this.gameMode.setId(gameModeId);
                this.createPlayerController();
                this.gameMode.setFromData(this.data);
                this.gameMode.setMatchIsWaitingToStart();
            }
            this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.onPauseKeyPressed, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.onPauseKeyPressed, this);
            this.bPendingDestroy = false;
            this.bPaused = false;
            TacticalWeaponPack.SoundManager.PlayMusic("music_game_" + TacticalWeaponPack.MathUtil.Random(1, 4));
            TacticalWeaponPack.SoundManager.PlayAmbience("amb_room");
        };
        State_Game.prototype.update = function () {
            if (this.bPaused || this.bPendingDestroy) {
                return;
            }
            while (this.muzzleFlashes.length > 0) {
                this.muzzleFlashes[0].destroy();
                this.muzzleFlashes.splice(0, 1);
            }
            var deadPawns = 0;
            var lastDeadPawn = null;
            for (var i = 0; i < this.controllers.length; i++) {
                this.controllers[i].tick();
                var pawn = this.controllers[i].getPawn();
                if (pawn) {
                    if (!pawn.isAlive()) {
                        deadPawns++;
                        lastDeadPawn = pawn;
                    }
                }
            }
            if (deadPawns > State_Game.MAX_DEAD_PAWNS) {
                lastDeadPawn.triggerDestroy();
            }
            for (i = 0; i < this.objects.length; i++) {
                this.objects[i].tick();
            }
            for (i = this.explosions.length - 1; i > 0; i--) {
                if (this.explosions[i].alpha <= 0) {
                    this.explosions[i].destroy();
                    this.explosions.splice(i, 1);
                }
            }
            if (this.gameMode) {
                this.gameMode.tick();
            }
            this.updateCamera();
            for (i = this.queue.length - 1; i >= 0; i--) {
                if (this.queue[i] instanceof box2d.b2Joint) {
                    this.game.physics.box2d.world.DestroyJoint(this.queue[i]);
                }
                else if (this.queue[i] instanceof Phaser.Physics.Box2D.Body) {
                    var bod = this.queue[i];
                    this.removeBody(bod);
                }
                else if (this.queue[i][0] instanceof TacticalWeaponPack.WorldObject) {
                    this.onCollide(this.queue[i][0], this.queue[i][1]);
                }
                else {
                    this.onCollideData(this.queue[i][0], this.queue[i][1]);
                }
                this.queue.splice(i, 1);
            }
            for (i = 0; i < this.objectsToDestroy.length; i++) {
                var cur = this.objectsToDestroy[i];
                if (cur instanceof TacticalWeaponPack.Pawn) {
                    this.pawns.splice(this.pawns.indexOf(cur), 1);
                }
                else if (cur instanceof TacticalWeaponPack.Shell) {
                    this.shells.splice(this.shells.indexOf(cur), 1);
                }
                else if (cur instanceof TacticalWeaponPack.Debris) {
                    this.debris.splice(this.debris.indexOf(cur), 1);
                }
                var indexObjects = this.objects.indexOf(cur);
                if (indexObjects >= 0) {
                    this.objects.splice(indexObjects, 1);
                }
                else {
                    console.error(cur);
                }
                cur.destroy();
            }
            this.objectsToDestroy = [];
            _super.prototype.update.call(this, this.game);
        };
        /*
        render()
        {
            this.game.debug.box2dWorld();
        }
        */
        State_Game.FilterRaycastHit = function (body, fixture, point, normal) {
            var filterData = fixture.GetFilterData();
            if (filterData.categoryBits == State_Game.CATEGORY_OBJECTS) {
                return true;
            }
            if (filterData.categoryBits == State_Game.CATEGORY_WALLS) {
                return true;
            }
            return false;
        };
        State_Game.prototype.getData = function () {
            return this.data;
        };
        State_Game.prototype.getMaxPawns = function () {
            return this.maxPawns;
        };
        State_Game.prototype.setMaxPawns = function (_val) {
            this.maxPawns = Math.max(_val, 1);
        };
        State_Game.prototype.getPawns = function () {
            return this.pawns;
        };
        State_Game.prototype.getNumLivingTargets = function () {
            var count = 0;
            for (var i = 0; i < this.pawns.length; i++) {
                if (!this.pawns[i].isPlayer() && this.pawns[i].isAlive()) {
                    count++;
                }
            }
            return count;
        };
        State_Game.prototype.isPaused = function () {
            return this.bPaused;
        };
        State_Game.prototype.onPauseKeyPressed = function () {
            if (this.player && !this.gameMode.matchHasEnded()) {
                if (!this.bPaused) {
                    this.setPaused(!this.bPaused);
                }
            }
        };
        State_Game.prototype.getPauseMenu = function () {
            return this.pauseMenu;
        };
        State_Game.prototype.setPaused = function (_bVal, _bUsePauseMenu) {
            if (_bUsePauseMenu === void 0) { _bUsePauseMenu = true; }
            if (_bVal) {
                this.bPaused = true;
                for (var i = 0; i < this.emitters.length; i++) {
                    this.emitters[i].visible = false;
                }
                if (this.pauseMenu) {
                    this.pauseMenu.destroy();
                }
                if (_bUsePauseMenu) {
                    this.pauseMenu = new TacticalWeaponPack.PauseMenu();
                    this.layerUI.visible = false;
                }
            }
            else {
                this.bPaused = false;
                for (var i = 0; i < this.emitters.length; i++) {
                    this.emitters[i].visible = true;
                }
                if (this.pauseMenu) {
                    this.pauseMenu.close();
                }
                this.layerUI.visible = true;
                var bShowMouse = false;
            }
            this.game.physics.box2d.paused = this.bPaused;
            TacticalWeaponPack.SoundManager.UpdateAmbienceVolume();
        };
        State_Game.prototype.buildWorld = function () {
            this.world.setBounds(0, 0, this.game.width * 1.35, this.game.height * 1.25);
            var background = this.game.add.group();
            var img = this.game.add.image(0, 0, "tiles");
            var numWidth = Math.ceil(this.game.world.width / img.width);
            var numHeight = Math.ceil(this.game.world.height / img.height);
            img.destroy();
            var curX = 0;
            var curY = 0;
            for (var i = 0; i < numHeight; i++) {
                for (var j = 0; j < numWidth; j++) {
                    var newImg = this.game.add.image(0, 0, "tiles");
                    newImg.x = img.width * curX;
                    newImg.y = img.height * curY;
                    background.add(newImg);
                    curX++;
                }
                curY++;
                curX = 0;
            }
            background.alpha = 0.5;
            this.addToWorld(background, State_Game.INDEX_WALLS);
            var gfx = this.game.add.graphics();
            gfx.lineStyle(1, 0x000000, 0.5);
            gfx.beginFill(0x33312E, 1);
            var groundOffset = 100;
            gfx.drawRect(0, 0, this.world.width, 50 + groundOffset);
            //gfx.lineStyle(0, 0, 0);
            gfx.beginFill(0x000000, 0.2);
            gfx.drawRect(0, 0, gfx.width, 10);
            var ground = this.game.add.sprite(0, 0, gfx.generateTexture());
            this.game.physics.box2d.enable(ground);
            ground.body.static = true;
            ground.body.x = this.world.width * 0.5;
            ground.body.y = this.world.height - (ground.height * 0.5) + groundOffset;
            this.addToWorld(ground, State_Game.INDEX_MAGS);
            var groundBody = ground.body;
            groundBody.setCollisionCategory(State_Game.CATEGORY_WALLS);
            gfx.destroy();
            var edges = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0);
            edges.addEdge(0, 0, this.world.width, 0);
            edges.addEdge(0, 0, 0, this.world.height);
            edges.addEdge(this.world.width, 0, this.world.width, this.world.height);
            edges.setCollisionCategory(State_Game.CATEGORY_WALLS);
            this.game.physics.box2d.setBoundsToWorld();
            this.game.physics.box2d.debugDraw.shapes = true;
            this.game.physics.box2d.debugDraw.joints = true;
            var emitter = this.game.add.emitter(this.game.width * 0.5, this.game.height * 0.5, 8);
            emitter.makeParticles("atlas_objects", "particle_dust");
            emitter.maxParticleScale = 1.0;
            emitter.minParticleScale = 0.2;
            emitter.setAlpha(0.2, 1);
            emitter.setYSpeed(-60, 60);
            emitter.gravity.set(0, 0);
            emitter.width = this.game.world.width;
            emitter.height = this.game.world.height;
            emitter.start(false, 8000, 12);
            this.addEmitter(emitter);
            for (var i = 0; i < 5; i++) {
                this.createDecal(TacticalWeaponPack.MathUtil.Random(0, this.game.width), TacticalWeaponPack.MathUtil.Random(0, this.game.height), "decal_crater");
            }
            this.targetScale = 1;
            this.targetScaleModifier = 1;
            this.game.world.scale.set(0.7, 0.7);
        };
        State_Game.prototype.addEmitter = function (_emitter) {
            this.addToWorld(_emitter, State_Game.INDEX_WALLS);
            this.emitters.push(_emitter);
        };
        State_Game.prototype.addToWorld = function (_item, _index) {
            if (_index === void 0) { _index = 0; }
            if (_index == State_Game.INDEX_WALLS) {
                this.layerWorld_0.add(_item);
            }
            else if (_index == State_Game.INDEX_MAGS) {
                this.layerWorld_1.add(_item);
            }
            else if (_index == State_Game.INDEX_PAWNS) {
                this.layerWorld_2.add(_item);
            }
            else if (_index == State_Game.INDEX_SHELLS) {
                this.layerWorld_3.add(_item);
            }
            else if (_index == State_Game.INDEX_LASER) {
                this.layerWorld_4.add(_item);
            }
            else {
                console.log("Invalid world index");
                this.layerWorld.add(_item);
            }
        };
        State_Game.prototype.onPawnAdded = function (_pawn) {
            var hud = this.getHUD();
            if (hud) {
                hud.onPawnAdded(_pawn);
            }
        };
        State_Game.prototype.onPawnRemoved = function (_pawn) {
            var hud = this.getHUD();
            if (hud) {
                hud.onPawnRemoved(_pawn);
            }
        };
        State_Game.prototype.removeFromWorld = function (_item) {
            this.layerWorld.remove(_item);
        };
        State_Game.prototype.removeBody = function (_body) {
            _body.data.SetUserData(null);
            _body.destroy();
            try {
                this.game.physics.box2d.world.DestroyBody(_body);
            }
            catch (e) {
                console.error(e);
            }
            //this.bodies.splice(this.bodies.indexOf(_body), 1);
        };
        State_Game.prototype.destroyJoint = function (_joint) {
            if (!this.queue || !_joint) {
                return;
            }
            this.queue.push(_joint);
        };
        State_Game.prototype.destroyGame = function () {
            this.bPendingDestroy = true;
            TacticalWeaponPack.SoundManager.DestroyAmbience();
            this.shells = null;
            this.debris = null;
            while (this.emitters.length > 0) {
                this.emitters[0].destroy();
                this.emitters.splice(0, 1);
            }
            this.emitters = null;
            while (this.objects.length > 0) {
                this.flagObjectForDestruction(this.objects[0]);
                this.objects[0].destroy();
                this.objects.splice(0, 1);
            }
            this.objects = null;
            this.explosions = null;
            while (this.controllers.length > 0) {
                this.controllers[0].destroy();
                this.controllers.splice(0, 1);
            }
            this.controllers = null;
            this.decals = null;
            this.pawns = null;
            this.gameMode.destroy();
            this.gameMode = null;
            this.cameraTarget = null;
            this.controllers = null;
            this.objectsToDestroy = null;
            this.queue = null;
            this.muzzleFlashes = null;
            this.smokes = null;
            this.worldFilters = null;
            this.player = null;
            this.playerController = null;
            if (this.pauseMenu) {
                this.pauseMenu.destroy();
                this.pauseMenu = null;
            }
            TacticalWeaponPack.GameUtil.game.ui.remove(this.layerUI);
            TacticalWeaponPack.GameUtil.game.ui.remove(this.layerPauseMenu);
            this.layerWorld.removeAll(true);
            this.layerWorld.destroy();
            this.layerWorld = null;
            this.layerUI.destroy();
            this.layerUI = null;
            this.layerPauseMenu.destroy();
            this.layerPauseMenu = null;
        };
        State_Game.prototype.shakeCamera = function (_val) {
            this.game.camera.x += TacticalWeaponPack.MathUtil.Random(-_val, _val);
            this.game.camera.y += TacticalWeaponPack.MathUtil.Random(-_val, _val);
            this.addWorldScale(_val * 0.0015);
        };
        State_Game.prototype.setDesiredWorldScale = function (_val) {
            this.targetScale = _val;
        };
        State_Game.prototype.setDesiredWorldScaleMultiplier = function (_val) {
            this.targetScaleModifier = _val;
        };
        State_Game.prototype.updateCamera = function () {
            if (this.cameraTarget) {
                this.targetX = this.cameraTarget.x - (this.game.scale.width * 0.1);
                this.targetY = this.cameraTarget.y - (this.game.scale.height * 0.6);
                if (this.cameraTarget == this.player) {
                    if (!this.gameMode.matchHasEnded()) {
                        if (this.player && this.player.isAlive() && this.playerController.canInput()) {
                            this.targetX -= -(this.game.input.x * this.cameraMouseLookRatio) + (this.game.width * this.cameraMouseLookRatio2);
                            this.targetY -= -(this.game.input.y * this.cameraMouseLookRatio) + (this.game.height * this.cameraMouseLookRatio2);
                        }
                    }
                }
                this.game.camera.x -= (this.game.camera.x - this.targetX) * State_Game.CAMERA_SPEED;
                this.game.camera.y -= (this.game.camera.y - this.targetY) * State_Game.CAMERA_SPEED;
            }
            var realTargetScale = this.targetScale * this.targetScaleModifier;
            this.game.world.scale.x -= (this.game.world.scale.x - realTargetScale) * 0.05;
            this.game.world.scale.y = this.game.world.scale.x;
        };
        State_Game.prototype.setCameraTarget = function (_target) {
            this.cameraTarget = _target;
        };
        State_Game.prototype.setPlayerAsCameraTarget = function () {
            if (this.player) {
                this.setCameraTarget(this.player);
            }
        };
        State_Game.prototype.removeController = function (_controller) {
            if (_controller) {
                _controller.destroy();
                this.controllers.splice(this.controllers.indexOf(_controller), 1);
            }
        };
        State_Game.prototype.createPlayerController = function () {
            if (!this.playerController) {
                this.playerController = new TacticalWeaponPack.PlayerController();
                this.controllers.push(this.playerController);
            }
            return this.playerController;
        };
        State_Game.prototype.createPlayerCharacter = function (_y) {
            this.player = new TacticalWeaponPack.Character("player", 180, _y, this.playerController);
            this.objects.push(this.player);
            this.pawns.push(this.player);
            this.setCameraTarget(this.player);
            return this.player;
        };
        State_Game.prototype.createTarget = function (_x, _y, _type) {
            if (_type === void 0) { _type = TacticalWeaponPack.Target.TYPE_DEFAULT; }
            if (this.pawns.length > 32) {
                this.pawns[1].triggerDestroy();
            }
            var controller = new TacticalWeaponPack.AIController_Target();
            this.controllers.push(controller);
            var target = new TacticalWeaponPack.Target(null, _x, _y, controller, _type);
            this.objects.push(target);
            this.pawns.push(target);
            var lastRope;
            var ropes;
            var baseJoint;
            if (_type == TacticalWeaponPack.Target.TYPE_ROPE) {
                ropes = [];
                var ropeHeight = TacticalWeaponPack.Rope.HEIGHT;
                var numRopes = 5;
                target.getBody().y += numRopes * ropeHeight;
                for (var i = 0; i < numRopes; i++) {
                    var x = _x;
                    var y = _y + (i * ropeHeight) - (ropeHeight * numRopes);
                    var newRope = new TacticalWeaponPack.Rope(x, y, i == 0 ? TacticalWeaponPack.Rope.TYPE_BASE : TacticalWeaponPack.Rope.TYPE_DEFAULT);
                    this.objects.push(newRope);
                    this.game.physics.box2d.enable(newRope, false);
                    var ropeBody = newRope.getBody();
                    if (i == 0) {
                        ropeBody.static = true;
                    }
                    else {
                        ropeBody.applyForce(TacticalWeaponPack.MathUtil.Random(-50, 50), 0);
                    }
                    if (lastRope) {
                        var joint = this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, ropeHeight * 0.5, 0, -ropeHeight * 0.5);
                    }
                    lastRope = newRope;
                    ropes.push(newRope);
                }
                var targetSprite = target.getBody().sprite;
                this.game.physics.box2d.revoluteJoint(lastRope, targetSprite, 0, ropeHeight * 0.5, 0, -ropeHeight * 0.5);
                target.setRopes(ropes);
            }
            else if (_type == TacticalWeaponPack.Target.TYPE_ROTATOR) {
                ropes = [];
                var ropeHeight = TacticalWeaponPack.Rope.HEIGHT;
                var numRopes = 3;
                target.getBody().y += numRopes * ropeHeight;
                for (var i = 0; i < numRopes; i++) {
                    if (i == 1) {
                        ropeHeight = TacticalWeaponPack.Rope.HEIGHT * 4;
                    }
                    else {
                        ropeHeight = TacticalWeaponPack.Rope.HEIGHT;
                    }
                    var x = _x;
                    var y = _y + (i * ropeHeight) - (ropeHeight * numRopes);
                    var ropeType = TacticalWeaponPack.Rope.TYPE_DEFAULT;
                    if (i == 0) {
                        ropeType = TacticalWeaponPack.Rope.TYPE_BASE;
                    }
                    else if (i == 1) {
                        ropeType = TacticalWeaponPack.Rope.TYPE_HOLDER;
                    }
                    var newRope = new TacticalWeaponPack.Rope(x, y, ropeType);
                    this.objects.push(newRope);
                    this.game.physics.box2d.enable(newRope, false);
                    var ropeBody = newRope.getBody();
                    if (i == 0) {
                        ropeBody.static = true;
                    }
                    else {
                        ropeBody.applyForce(TacticalWeaponPack.MathUtil.Random(-50, 50), 0);
                    }
                    if (lastRope) {
                        if (i == 1) {
                            var speed = TacticalWeaponPack.MathUtil.Random(50, 100);
                            if (TacticalWeaponPack.MathUtil.RandomBoolean()) {
                                speed = -speed;
                            }
                            baseJoint = this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, 0, 0, -newRope.getBody().sprite.height * 0.5, speed, 80, true);
                        }
                        else {
                            this.game.physics.box2d.revoluteJoint(lastRope, newRope, 0, lastRope.getBody().sprite.height * 0.5, 0, -newRope.getBody().sprite.height * 0.5);
                        }
                    }
                    lastRope = newRope;
                    ropes.push(newRope);
                }
                var targetSprite = target.getBody().sprite;
                this.game.physics.box2d.revoluteJoint(lastRope, targetSprite, 0, ropeHeight * 0.5, 0, -ropeHeight * 0.5);
                target.setRopes(ropes);
                if (baseJoint) {
                    target.setRopeBaseJoint(baseJoint);
                }
            }
            return target;
        };
        State_Game.prototype.createDebris = function (_x, _y, _rotation, _type) {
            var debris = new TacticalWeaponPack.Debris(_x, _y, _rotation, _type);
            this.objects.push(debris);
            this.debris.push(debris);
            if (this.debris.length > State_Game.MAX_DEBRIS) {
                this.debris[0].triggerDestroy();
            }
            return debris;
        };
        State_Game.prototype.createDecal = function (_x, _y, _type) {
            var decal = this.game.add.image(_x, _y, "atlas_objects", _type);
            decal.rotation = TacticalWeaponPack.MathUtil.ToRad(TacticalWeaponPack.MathUtil.Random(-180, 180));
            decal.anchor.set(0.5, 0.5);
            decal.alpha = 0.2;
            this.addToWorld(decal, State_Game.INDEX_WALLS);
            this.decals.push(decal);
            if (this.decals.length > State_Game.MAX_DECALS) {
                this.decals[0].destroy();
                this.decals.splice(0, 1);
            }
        };
        State_Game.prototype.createExplosion = function (_x, _y, _radius, _instigator, _causer, _data) {
            var damage = _data["damage"];
            var bRound = _data["bRound"];
            if (!bRound || TacticalWeaponPack.MathUtil.RandomBoolean()) {
                this.createDecal(_x, _y, "decal_crater");
            }
            this.createSmoke(_x, _y, -90 * TacticalWeaponPack.MathUtil.TO_RADIANS, TacticalWeaponPack.Smoke.SMOKE_DEFAULT);
            //this.createMuzzleFlash(_x, _y, -90 * MathUtil.TO_RADIANS);
            var rect = new Phaser.Rectangle(_x, _y, _radius * 2, _radius * 2);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFCC, 1);
            gfx.drawCircle(0, 0, _radius * 2);
            gfx.endFill();
            var explosion = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            explosion.alpha = bRound ? 0.4 : 1;
            explosion.x = rect.x;
            explosion.y = rect.y;
            explosion.anchor.set(0.5, 0.5);
            this.addToWorld(explosion, State_Game.INDEX_PAWNS);
            var tween = this.game.add.tween(explosion).to({ alpha: 0 }, 200, Phaser.Easing.Exponential.Out, true);
            var tween = this.game.add.tween(explosion.scale).from({ x: 0.8, y: 0.8 }, 200, Phaser.Easing.Back.Out, true);
            this.explosions.push(explosion);
            var bShotHit = false;
            var curActor = null;
            var curPawn = null;
            var distMult = 1;
            var distFromCenter = 0;
            for (var i = 0; i < this.objects.length; i++) {
                curActor = null;
                curPawn = null;
                var curObject = this.objects[i];
                if (curObject.getBody()) {
                    if (curObject instanceof TacticalWeaponPack.Actor) {
                        curActor = curObject;
                        if (curActor instanceof TacticalWeaponPack.Pawn) {
                            curPawn = curActor;
                        }
                        else if (curActor instanceof TacticalWeaponPack.ProjectileBase) {
                            break;
                        }
                    }
                    distMult = 1;
                    distFromCenter = TacticalWeaponPack.MathUtil.Dist(rect.x, rect.y, curObject.x, curObject.y);
                    if (distFromCenter <= _radius) {
                        distMult = 1 - (distFromCenter / _radius);
                        var damageAmount = damage * distMult;
                        var force = Math.min(damageAmount * 2, 500);
                        if (curActor instanceof TacticalWeaponPack.Grenade) {
                            force *= 0.01;
                        }
                        if (distFromCenter > _radius * 0.8) {
                            damageAmount *= 0.2;
                        }
                        if (distFromCenter > _radius * 0.5) {
                            damageAmount *= 0.5;
                        }
                        else if (distFromCenter > _radius * 0.2) {
                            damageAmount *= 0.8;
                        }
                        var distX = curObject.x - _causer.x;
                        var distY = curObject.y - _causer.y;
                        var rad = Math.atan2(distY, distX);
                        var vx = Math.cos(rad) * force;
                        var vy = Math.sin(rad) * force;
                        curObject.getBody().applyForce(vx, vy);
                        var rotAmount = damageAmount * 2;
                        if (TacticalWeaponPack.MathUtil.RandomBoolean()) {
                            curObject.getBody().rotateLeft(TacticalWeaponPack.MathUtil.Random(rotAmount * 0.1, rotAmount));
                        }
                        else {
                            curObject.getBody().rotateRight(TacticalWeaponPack.MathUtil.Random(rotAmount * 0.1, rotAmount));
                        }
                        if (curActor != null) {
                            curActor.takeDamage(damageAmount, _instigator, _causer, TacticalWeaponPack.DamageType.DAMAGE_TYPE_EXPLOSIVE, false);
                            if (!bShotHit) {
                                this.getGameMode().addShotsHit();
                                bShotHit = true;
                            }
                        }
                        /*
                        graphics.lineStyle(1, 0x00FF00, 0.5);
                        graphics.moveTo(rect.x, rect.y);
                        graphics.lineTo(curObject.x, curObject.y);
                        var pos = this.game.add.text(curObject.x, curObject.y, curObject.getId() + ": " + distFromCenter.toFixed(0) + " --> " + (distMult * 100).toFixed(0) + "%", { font: "12px " + GameUtil.FONT, fill: "#00FF00" });
                        this.layerWorld.add(pos);
                        */
                    }
                }
            }
            var sfx = bRound ? "explosion_round" : "explosion";
            TacticalWeaponPack.SoundManager.PlayWorldSound(sfx, _x, _y, 3, bRound ? 1 : 2);
            if (bRound) {
                this.addWorldScale(-0.001);
            }
            else {
                this.addWorldScale(-0.08);
            }
        };
        State_Game.prototype.addWorldScale = function (_val) {
            this.world.scale.x = Math.max(0.6, (this.world.scale.x + _val));
            this.world.scale.y = this.world.scale.x;
        };
        State_Game.prototype.createMuzzleFlash = function (_x, _y, _rotation, _type) {
            if (_type === void 0) { _type = "default"; }
            if (_type == "default") {
                if (TacticalWeaponPack.MathUtil.RandomBoolean()) {
                    var muzzleFlash = this.game.add.image(_x, _y, "atlas_effects", "muzzleFlash_" + TacticalWeaponPack.MathUtil.Random(1, 4));
                    muzzleFlash.anchor.set(0, 0.5);
                    muzzleFlash.scale.x = TacticalWeaponPack.MathUtil.Random(5, 15) * 0.1;
                    muzzleFlash.rotation = _rotation + (TacticalWeaponPack.MathUtil.Random(-3, 3) * TacticalWeaponPack.MathUtil.TO_RADIANS);
                    this.addToWorld(muzzleFlash);
                    this.muzzleFlashes.push(muzzleFlash);
                }
                this.createSmoke(_x, _y, _rotation, TacticalWeaponPack.Smoke.SMOKE_MUZZLE);
            }
            else if (_type == "impact") {
                this.createSmoke(_x, _y, _rotation, TacticalWeaponPack.Smoke.SMOKE_IMPACT);
            }
            var sparks = this.game.add.image(_x, _y, "atlas_effects", "sparks_" + TacticalWeaponPack.MathUtil.Random(1, 3));
            sparks.anchor.set(0, 0.5);
            sparks.rotation = _rotation + (TacticalWeaponPack.MathUtil.Random(-15, 15) * TacticalWeaponPack.MathUtil.TO_RADIANS);
            sparks.scale.x = TacticalWeaponPack.MathUtil.Random(10, 15) * 0.1;
            sparks.scale.y = TacticalWeaponPack.MathUtil.Random(10, 15) * 0.1;
            this.addToWorld(sparks);
            this.muzzleFlashes.push(sparks);
        };
        State_Game.prototype.createProjectile = function (_x, _y, _rotation, _type, _causer, _instigator, _data) {
            var projectile;
            if (_type == TacticalWeaponPack.ProjectileBase.TYPE_BULLET) {
                projectile = new TacticalWeaponPack.Bullet(_x, _y, _rotation, _causer, _instigator, _data);
            }
            else if (_type == TacticalWeaponPack.ProjectileBase.TYPE_ROCKET) {
                projectile = new TacticalWeaponPack.Rocket(_x, _y, _rotation, _causer, _instigator, _data);
            }
            else if (_type == TacticalWeaponPack.ProjectileBase.TYPE_GRENADE) {
                projectile = new TacticalWeaponPack.Grenade(_x, _y, _rotation, _causer, _instigator, _data);
            }
            if (!projectile) {
                return null;
            }
            this.objects.push(projectile);
            return projectile;
        };
        State_Game.prototype.createSmoke = function (_x, _y, _rotation, _type) {
            var smoke = new TacticalWeaponPack.Smoke(_type);
            smoke.position.set(_x, _y);
            smoke.rotation = _rotation;
            this.smokes.push(smoke);
            return smoke;
        };
        State_Game.prototype.destroySmoke = function (_smoke) {
            var index = this.smokes.indexOf(_smoke);
            this.smokes[index].destroy();
            this.smokes.splice(index, 1);
        };
        State_Game.prototype.createShell = function (_x, _y, _rotation, _type) {
            var shell = new TacticalWeaponPack.Shell(_x, _y, _rotation, _type);
            this.objects.push(shell);
            this.shells.push(shell);
            if (this.shells.length > State_Game.MAX_SHELLS) {
                this.shells[0].triggerDestroy();
            }
            return shell;
        };
        State_Game.prototype.createMag = function (_x, _y, _rotation, _type) {
            var mag = new TacticalWeaponPack.Mag(_x, _y, _rotation, _type);
            this.objects.push(mag);
            return mag;
        };
        State_Game.prototype.setWorldBlur = function (_bVal) {
            this.worldFilters["blur"]["bEnabled"] = _bVal;
            this.updateWorldFilters();
        };
        State_Game.prototype.setWorldGray = function (_bVal) {
            this.worldFilters["gray"]["bEnabled"] = _bVal;
            this.updateWorldFilters();
        };
        State_Game.prototype.updateWorldFilters = function () {
            var filters = [];
            var bEnableFilters = true;
            if (bEnableFilters) {
                if (this.worldFilters["blur"]["bEnabled"] == true) {
                    var blurX = this.add.filter("BlurX");
                    var blurY = this.add.filter("BlurY");
                    blurX.blur = blurY.blur = 24;
                    filters.push(blurX);
                    filters.push(blurY);
                }
                if (this.worldFilters["gray"]["bEnabled"] == true) {
                    var gray = this.add.filter("Gray");
                    //gray.gray = 0.9;
                    filters.push(gray);
                }
            }
            if (filters.length == 0) {
                this.layerWorld.filters = undefined;
            }
            else {
                this.layerWorld.filters = filters;
            }
        };
        State_Game.prototype.destroyBody = function (_body) {
            if (!this.queue || !_body) {
                return;
            }
            this.queue.push(_body);
        };
        State_Game.prototype.addCollisionToQueue = function (_objA, _objB) {
            if (!this.queue) {
                return;
            }
            this.queue.push([_objA, _objB]);
        };
        State_Game.prototype.addCollisionDataToQueue = function (_objA, _objB) {
            if (!this.queue) {
                return;
            }
            this.queue.push([_objA, _objB]);
        };
        State_Game.prototype.onCollide = function (_objA, _objB) {
            if (_objA) {
                if (!_objA.isPendingDestroy()) {
                    _objA.onHit(_objB, null);
                }
            }
            if (_objB) {
                if (!_objB.isPendingDestroy()) {
                    _objB.onHit(_objA, null);
                }
            }
        };
        State_Game.prototype.onCollideData = function (_objA, _objB) {
            var worldObjectA = null;
            var worldObjectB = null;
            if (_objA) {
                worldObjectA = _objA["worldObject"];
            }
            if (_objB) {
                worldObjectB = _objB["worldObject"];
            }
            if (worldObjectA) {
                if (!worldObjectA.isPendingDestroy()) {
                    worldObjectA.onHit(worldObjectB, _objB);
                }
            }
            if (worldObjectB) {
                if (!worldObjectB.isPendingDestroy()) {
                    worldObjectB.onHit(worldObjectA, _objA);
                }
            }
        };
        State_Game.prototype.flagObjectForDestruction = function (_obj) {
            var index = this.objects.indexOf(_obj);
            if (index >= 0) {
                if (!this.objects[index].isPendingDestroy()) {
                    this.objects[index].setPendingDestroy();
                    this.objectsToDestroy.push(this.objects[index]);
                }
            }
        };
        State_Game.prototype.getHUD = function () {
            return this.playerController.getHUD();
        };
        State_Game.prototype.getPlayerController = function () {
            return this.playerController;
        };
        State_Game.prototype.getPlayerPawn = function () {
            return this.playerController.getPawn();
        };
        State_Game.prototype.getGameMode = function () {
            return this.gameMode;
        };
        State_Game.MAX_SHELLS = 30;
        State_Game.MAX_DEBRIS = 8;
        State_Game.MAX_DEAD_PAWNS = 6;
        State_Game.MAX_DECALS = 20;
        State_Game.DEBRIS_ALPHA = 0.25;
        State_Game.CAMERA_SPEED = 0.1;
        State_Game.INDEX_WALLS = 0;
        State_Game.INDEX_MAGS = 1;
        State_Game.INDEX_SHELLS = 2;
        State_Game.INDEX_PAWNS = 3;
        State_Game.INDEX_LASER = 4;
        State_Game.INDEX_UI = 5;
        State_Game.CATEGORY_PROJECTILES = 1;
        State_Game.CATEGORY_OBJECTS = 2;
        State_Game.CATEGORY_SHELLS = 4;
        State_Game.CATEGORY_WALLS = 8;
        State_Game.MASK_PROJECTILES = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS;
        State_Game.MASK_OBJECTS = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS;
        State_Game.MASK_PAWNS = State_Game.CATEGORY_WALLS | State_Game.CATEGORY_OBJECTS | State_Game.CATEGORY_PROJECTILES;
        return State_Game;
    }(Phaser.State));
    TacticalWeaponPack.State_Game = State_Game;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var ButtonBase = /** @class */ (function (_super) {
        __extends(ButtonBase, _super);
        function ButtonBase(_key, _frame) {
            if (_key === void 0) { _key = null; }
            if (_frame === void 0) { _frame = null; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game, 0, 0, _key, _frame) || this;
            _this.baseAlpha = 0.5;
            _this.tweenTime = 400;
            _this.bSoundsEnabled = true;
            _this.bEnabled = true;
            _this.bSelected = false;
            _this.bMouseOver = false;
            _this.bAlphaWhenDisabled = true;
            _this.bCanClick = true;
            _this.setBaseAlpha(_this.baseAlpha);
            _this.inputEnabled = true;
            _this.ignoreChildInput = true;
            _this.signalOnUp = _this.events.onInputUp.add(_this.onUp, _this);
            _this.signalOnOver = _this.events.onInputOver.add(_this.onOver, _this);
            _this.signalOnOut = _this.events.onInputOut.add(_this.onOut, _this);
            return _this;
        }
        ButtonBase.prototype.destroy = function () {
            this.visible = false;
            this.bgUp = null;
            this.bgOver = null;
            this.key = null;
            this.buttonData = null;
            this.setEnabled(false);
            this.setTween(null);
            this.signalOnUp.detach();
            this.signalOnOver.detach();
            this.signalOnOut.detach();
            this.signalOnUp = null;
            this.signalOnOver = null;
            this.signalOnOut = null;
            this.inputEnabled = false;
            this.events.destroy();
            this.input.destroy();
            _super.prototype.destroy.call(this);
        };
        ButtonBase.prototype.setCallback = function (_func, _funcContext, _parameters) {
            if (_parameters === void 0) { _parameters = null; }
            this.callback = _func;
            this.callbackContext = _funcContext;
            this.parameters = _parameters;
        };
        ButtonBase.prototype.setCallbackParameters = function (_parameters) {
            this.parameters = _parameters;
        };
        ButtonBase.prototype.isSelected = function () {
            return this.bSelected;
        };
        ButtonBase.prototype.isEnabled = function () {
            return this.bEnabled;
        };
        ButtonBase.prototype.setEnabled = function (_bVal) {
            this.onOut();
            this.bEnabled = _bVal;
            this.inputEnabled = this.bEnabled;
            this.signalOnUp.active = this.bEnabled;
            this.signalOnOver.active = this.bEnabled;
            this.signalOnOut.active = this.bEnabled;
            if (this.tween) {
                this.tween.stop();
            }
            this.bMouseOver = false;
            if (!_bVal) {
                if (this.bAlphaWhenDisabled) {
                    this.alpha = this.baseAlpha * 0.35;
                }
                else {
                    this.alpha = this.baseAlpha;
                }
            }
            else {
                this.alpha = this.baseAlpha;
            }
        };
        ButtonBase.prototype.toggleSelected = function () {
            this.setSelected(!this.bSelected);
        };
        ButtonBase.prototype.setSelected = function (_bVal) {
            this.bSelected = _bVal;
            this.setEnabled(!_bVal);
            if (_bVal) {
                if (this.bgOver) {
                    this.bgOver.visible = true;
                    this.bgUp.visible = false;
                }
            }
            else {
                if (this.bgOver) {
                    this.bgOver.visible = false;
                    this.bgUp.visible = true;
                }
            }
        };
        ButtonBase.prototype.setBaseAlpha = function (_val) {
            if (this.tween) {
                this.tween.stop();
                this.tween = null;
            }
            this.baseAlpha = _val;
            this.alpha = this.baseAlpha;
            //this.onOut();
        };
        ButtonBase.prototype.getBaseAlpha = function () {
            return this.baseAlpha;
        };
        ButtonBase.prototype.onUp = function () {
            if (!this.bEnabled || !this.bCanClick) {
                return;
            }
            if (this.bSoundsEnabled) {
                TacticalWeaponPack.SoundManager.PlayUISound("ui_button_click");
            }
            if (this.callback) {
                this.callback.apply(this.callbackContext, this.parameters);
            }
            this.alpha = this.baseAlpha * 0.5;
            if (this.bMouseOver) {
                this.onOut();
            }
            else {
                this.onOut();
            }
            this.bMouseOver = false;
        };
        ButtonBase.prototype.onOver = function () {
            if (!this.bEnabled) {
                return;
            }
            if (this.bSoundsEnabled && !this.bMouseOver) {
                TacticalWeaponPack.SoundManager.PlayUISound("ui_button_over");
            }
            this.bMouseOver = true;
            this.setTween(this.game.add.tween(this).to({ alpha: 1 }, this.tweenTime, Phaser.Easing.Exponential.Out, true));
            if (this.bgOver) {
                this.bgOver.visible = true;
                this.bgUp.visible = false;
            }
        };
        ButtonBase.prototype.onOut = function () {
            if (!this.bEnabled) {
                return;
            }
            this.bMouseOver = false;
            this.setTween(this.game.add.tween(this).to({ alpha: this.baseAlpha }, this.tweenTime, Phaser.Easing.Exponential.Out, true));
            if (this.bgOver) {
                this.bgOver.visible = false;
                this.bgUp.visible = true;
            }
        };
        ButtonBase.prototype.setTween = function (_tween) {
            if (this.tween) {
                this.tween.stop();
            }
            this.tween = _tween;
        };
        ButtonBase.prototype.mouseIsOver = function () {
            return this.bMouseOver;
        };
        ButtonBase.prototype.setCanClick = function (_bVal) {
            this.bCanClick = _bVal;
        };
        ButtonBase.prototype.canClick = function () {
            return this.bCanClick;
        };
        ButtonBase.prototype.setButtonData = function (_data) {
            this.buttonData = _data;
        };
        ButtonBase.prototype.getButtonData = function () {
            return this.buttonData;
        };
        return ButtonBase;
    }(Phaser.Sprite));
    TacticalWeaponPack.ButtonBase = ButtonBase;
    var ImageButton = /** @class */ (function (_super) {
        __extends(ImageButton, _super);
        function ImageButton(_id, _frame) {
            if (_frame === void 0) { _frame = null; }
            return _super.call(this, _id, _frame) || this;
        }
        return ImageButton;
    }(ButtonBase));
    TacticalWeaponPack.ImageButton = ImageButton;
    var TextButton = /** @class */ (function (_super) {
        __extends(TextButton, _super);
        function TextButton(_text, _style) {
            if (_text === void 0) { _text = null; }
            if (_style === void 0) { _style = null; }
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 4, 4);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            _this.text = _this.game.add.text(0, 0);
            _this.addChild(_this.text);
            if (_text) {
                _this.setText(_text);
            }
            if (_style) {
                _this.setStyle(_style);
            }
            return _this;
        }
        TextButton.prototype.setText = function (_val) {
            this.text.setText(_val, true);
        };
        TextButton.prototype.setStyle = function (_style) {
            this.text.setStyle(_style);
            TacticalWeaponPack.GameUtil.SetTextShadow(this.text);
        };
        Object.defineProperty(TextButton.prototype, "width", {
            get: function () {
                return this.text.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextButton.prototype, "height", {
            get: function () {
                return this.text.height;
            },
            enumerable: true,
            configurable: true
        });
        TextButton.prototype.destroy = function () {
            this.text = null;
            _super.prototype.destroy.call(this);
        };
        return TextButton;
    }(ButtonBase));
    TacticalWeaponPack.TextButton = TextButton;
    var FiringRangeButton = /** @class */ (function (_super) {
        __extends(FiringRangeButton, _super);
        function FiringRangeButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 240, 50);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            var padding = 8;
            _this.labelText = _this.game.add.text(padding, 2, "Enter Firing Range", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.labelText.setTextBounds(0, 0, _this.width - (padding * 2), _this.height);
            _this.addChild(_this.labelText);
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.labelText);
            _this.onOut();
            return _this;
        }
        FiringRangeButton.prototype.destroy = function () {
            this.labelText = null;
            _super.prototype.destroy.call(this);
        };
        FiringRangeButton.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        FiringRangeButton.prototype.setLabelStyle = function (_style) {
            this.labelText.setStyle(_style, true);
        };
        return FiringRangeButton;
    }(ButtonBase));
    TacticalWeaponPack.FiringRangeButton = FiringRangeButton;
    var MenuButton = /** @class */ (function (_super) {
        __extends(MenuButton, _super);
        function MenuButton(_width, _boundsAlignH, _colour, _height) {
            if (_width === void 0) { _width = 220; }
            if (_boundsAlignH === void 0) { _boundsAlignH = "left"; }
            if (_colour === void 0) { _colour = TacticalWeaponPack.ColourUtil.COLOUR_THEME; }
            if (_height === void 0) { _height = 50; }
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, _width, _height);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, _colour, 0.8);
            gfx.beginFill(_colour, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            //gfx.lineStyle(1, 0xFFFFFF, 0.2);
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            var padding = 8;
            _this.labelText = _this.game.add.text(padding, 2, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: _boundsAlignH, boundsAlignV: "middle" });
            _this.labelText.setTextBounds(0, 0, _this.width - (padding * 2), _this.height);
            _this.addChild(_this.labelText);
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.labelText);
            _this.onOut();
            return _this;
        }
        MenuButton.prototype.destroy = function () {
            this.icon = null;
            this.labelText = null;
            _super.prototype.destroy.call(this);
        };
        MenuButton.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        MenuButton.prototype.setLabelStyle = function (_style) {
            this.labelText.setStyle(_style, true);
        };
        MenuButton.prototype.setToggle = function (_bVal) {
            this.bToggle = _bVal;
        };
        MenuButton.prototype.setSelected = function (_bVal) {
            if (this.bToggle) {
                this.bSelected = _bVal;
                if (this.bSelected) {
                    this.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_checkmark"));
                }
                else {
                    this.setIcon(null);
                }
            }
            else {
                _super.prototype.setSelected.call(this, _bVal);
            }
        };
        MenuButton.prototype.getIcon = function () {
            return this.icon;
        };
        MenuButton.prototype.setIcon = function (_icon, _align) {
            if (_align === void 0) { _align = "right"; }
            if (this.icon) {
                this.icon.destroy();
                this.icon = null;
            }
            if (_icon) {
                var padding = 8;
                this.icon = _icon;
                if (this.icon.height > this.height) {
                    this.icon.height = this.height - (padding * 1.5);
                    this.icon.scale.x = this.icon.scale.y;
                }
                if (_align == "left") {
                    this.icon.x = padding;
                }
                else if (_align == "center") {
                    this.icon.x = (this.width * 0.5) - (this.icon.width * 0.5);
                }
                else if (_align == "right") {
                    this.icon.x = this.width - this.icon.width - padding;
                }
                this.icon.y = (this.height * 0.5) - (this.icon.height * 0.5);
                this.addChild(this.icon);
            }
        };
        return MenuButton;
    }(ButtonBase));
    TacticalWeaponPack.MenuButton = MenuButton;
    var SplashButton = /** @class */ (function (_super) {
        __extends(SplashButton, _super);
        function SplashButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 300, 150);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_THEME, 1);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            var padding = 8;
            _this.labelText = _this.game.add.text(padding, 2, "", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.labelText.setTextBounds(0, 0, _this.width - (padding * 2), 20);
            _this.labelText.y = _this.height * 0.7;
            _this.addChild(_this.labelText);
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.labelText);
            _this.onOut();
            return _this;
        }
        SplashButton.prototype.destroy = function () {
            this.warningIcon = null;
            this.newIcon = null;
            this.icon = null;
            this.labelText = null;
            _super.prototype.destroy.call(this);
        };
        SplashButton.prototype.setNewIconVisible = function (_bVal) {
            if (!_bVal) {
                if (this.newIcon) {
                    this.newIcon.destroy();
                    this.newIcon = null;
                }
            }
            else {
                this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                this.newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                this.newIcon.x = (this.width - this.newIcon.width - 10);
                this.newIcon.y = 10;
                this.newIcon.alpha = 0.5;
                this.addChild(this.newIcon);
            }
        };
        SplashButton.prototype.setWarningIconVisible = function (_bVal) {
            if (!_bVal) {
                if (this.warningIcon) {
                    this.warningIcon.destroy();
                    this.warningIcon = null;
                }
            }
            else {
                this.warningIcon = this.game.add.image(0, 0, "atlas_ui", "icon_exclamation");
                this.warningIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
                this.warningIcon.x = (this.width - this.warningIcon.width - 10);
                this.warningIcon.y = 10;
                this.warningIcon.alpha = 0.5;
                this.addChild(this.warningIcon);
            }
        };
        SplashButton.prototype.setIcon = function (_image) {
            if (_image) {
                _image.x = (this.width * 0.5) - (_image.width * 0.5);
                _image.y = (this.height * 0.5) - (_image.height * 0.5) - 20;
                this.addChild(_image);
            }
            else {
                if (this.icon) {
                    this.icon.destroy();
                    this.icon = null;
                }
            }
            this.icon = _image;
        };
        SplashButton.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        SplashButton.prototype.setLabelStyle = function (_style) {
            this.labelText.setStyle(_style, true);
        };
        return SplashButton;
    }(ButtonBase));
    TacticalWeaponPack.SplashButton = SplashButton;
    var ModItemButton = /** @class */ (function (_super) {
        __extends(ModItemButton, _super);
        function ModItemButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 130, 80);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            _this.labelText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.labelText.alpha = 0.5;
            _this.labelText.setTextBounds(0, _this.height - 15, _this.width, 12);
            _this.addChild(_this.labelText);
            //GameUtil.SetTextShadow(this.labelText);
            _this.onOut();
            return _this;
        }
        ModItemButton.prototype.destroy = function () {
            this.labelText = null;
            this.newIcon = null;
            _super.prototype.destroy.call(this);
        };
        ModItemButton.prototype.showNewIcon = function () {
            if (!this.newIcon) {
                this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                this.newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                this.newIcon.x = this.width - this.newIcon.width - 4;
                this.newIcon.y = 4;
                this.addChild(this.newIcon);
            }
        };
        ModItemButton.prototype.hideNewIcon = function () {
            if (this.newIcon) {
                this.newIcon.destroy();
            }
            this.newIcon = null;
        };
        ModItemButton.prototype.setLabelText = function (_str) {
            this.labelText.setText(_str, true);
        };
        ModItemButton.prototype.setMod = function (_modeType, _id) {
            this.modeType = _modeType;
            if (_id) {
                var modImage = this.game.add.image(0, 0, "atlas_ui", _id);
                modImage.anchor.set(0.5, 0.5);
                modImage.scale.set(0.5, 0.5);
                modImage.x = this.width * 0.5;
                modImage.y = this.height * 0.5;
                this.addChild(modImage);
            }
        };
        return ModItemButton;
    }(ButtonBase));
    TacticalWeaponPack.ModItemButton = ModItemButton;
    var QuickPlayGameModeButton = /** @class */ (function (_super) {
        __extends(QuickPlayGameModeButton, _super);
        function QuickPlayGameModeButton(_gameModeData) {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 178, 190);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            _this.setGameMode(_gameModeData);
            _this.bestContainer = _this.game.add.group();
            var bestScore = TacticalWeaponPack.PlayerUtil.GetRankedData()["bestScores"][_gameModeData["id"]];
            var bestNum = _this.game.add.text(0, 0, bestScore.toString(), { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            var bestText = _this.game.add.text(0, 0, "Best score:", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            bestText.y = (bestNum.height * 0.5) - (bestText.height * 0.5);
            _this.bestContainer.add(bestText);
            bestNum.x = bestText.x + bestText.width + 4;
            _this.bestContainer.add(bestNum);
            if (bestScore == 0) {
                bestNum.alpha = 0.2;
                bestText.alpha = 0.2;
            }
            var starContainer = _this.game.add.group();
            var placements = TacticalWeaponPack.GameUtil.GetPlacementColours().reverse();
            var placementIndex = TacticalWeaponPack.GameModeDatabase.GetRankForScore(_gameModeData["id"], bestScore);
            for (var i = 0; i < placements.length; i++) {
                var star = _this.game.add.image(0, 0, "atlas_ui", "icon_star");
                star.x = i * star.width;
                starContainer.add(star);
                if (i <= placementIndex) {
                    star.tint = placements[placementIndex];
                }
                else {
                    star.alpha = 0.1;
                }
            }
            starContainer.x = (_this.bestContainer.width * 0.5) - (starContainer.width * 0.5);
            starContainer.y = _this.bestContainer.height;
            _this.bestContainer.addChild(starContainer);
            _this.bestContainer.x = (_this.width * 0.5) - (_this.bestContainer.width * 0.5);
            _this.bestContainer.y = _this.height - _this.bestContainer.height - 4;
            _this.addChild(_this.bestContainer);
            _this.onOut();
            return _this;
        }
        QuickPlayGameModeButton.prototype.destroy = function () {
            this.bestContainer = null;
            _super.prototype.destroy.call(this);
        };
        QuickPlayGameModeButton.prototype.setGameMode = function (_data) {
            var icon = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
            icon.scale.set(0.5, 0.5);
            icon.x = (this.width * 0.5) - (icon.width * 0.5);
            icon.y = (this.height * 0.5) - (icon.height * 0.5) - 20;
            this.addChild(icon);
        };
        return QuickPlayGameModeButton;
    }(ButtonBase));
    TacticalWeaponPack.QuickPlayGameModeButton = QuickPlayGameModeButton;
    var ClassItemButton = /** @class */ (function (_super) {
        __extends(ClassItemButton, _super);
        function ClassItemButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 340, 80);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            var padding = 8;
            _this.labelText = _this.game.add.text(padding, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
            _this.labelText.alpha = 0.5;
            _this.labelText.setTextBounds(0, 0, _this.width - (padding * 2), 24);
            _this.labelText.y = (_this.height * 0.5) - (_this.labelText.height);
            _this.addChild(_this.labelText);
            _this.itemText = _this.game.add.text(padding, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
            _this.itemText.setTextBounds(0, 0, _this.width - (padding * 2), 24);
            _this.itemText.y = (_this.height * 0.5);
            _this.addChild(_this.itemText);
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.itemText);
            _this.onOut();
            return _this;
        }
        ClassItemButton.prototype.destroy = function () {
            this.newIcon = null;
            this.checkmarkIcon = null;
            this.labelText = null;
            this.itemText = null;
            _super.prototype.destroy.call(this);
        };
        ClassItemButton.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        ClassItemButton.prototype.setLocked = function (_bVal, _str) {
            if (_str === void 0) { _str = null; }
            this.setEnabled(!_bVal);
            if (_bVal) {
                var lockIcon = this.game.add.image(0, 0, "atlas_ui", "icon_lock");
                lockIcon.x = this.width - lockIcon.width - 10;
                lockIcon.y = (this.height * 0.5) - (lockIcon.height * 0.5);
                this.addChild(lockIcon);
                if (_str) {
                    this.itemText.setText(_str, true);
                }
            }
        };
        ClassItemButton.prototype.setAsCurrent = function () {
            this.checkmarkIcon = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
            //this.checkmarkIcon.tint = ColourUtil.COLOUR_GREEN;
            this.checkmarkIcon.x = this.width - this.checkmarkIcon.width - 8;
            this.checkmarkIcon.y = (this.height * 0.5) - (this.checkmarkIcon.height * 0.5);
            this.addChild(this.checkmarkIcon);
        };
        ClassItemButton.prototype.showNewIcon = function () {
            if (!this.newIcon) {
                this.newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                this.newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                this.newIcon.x = this.width - this.newIcon.width - 8;
                this.newIcon.y = (this.height * 0.5) - (this.newIcon.height * 0.5);
                this.addChild(this.newIcon);
            }
        };
        ClassItemButton.prototype.hideNewIcon = function () {
            if (this.newIcon) {
                this.newIcon.destroy();
            }
            this.newIcon = null;
        };
        ClassItemButton.prototype.setWeapon = function (_data) {
            var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(_data["id"]);
            this.itemText.setText(weaponData["name"], true);
            var container = this.game.add.group();
            this.addChild(container);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRoundedRect(0, 0, this.width * 0.5, 50, TacticalWeaponPack.GameUtil.RECTANGLE_RADIUS);
            container.add(gfx);
            var weapon = this.game.add.image(0, 0, "atlas_weapons", _data["id"]);
            //var weapon = GameUtil.CreateWeapon(_data);
            //weapon.scale.set(0.25, 0.25);
            weapon.anchor.set(0.5, 0.5);
            weapon.x = (container.width * 0.5);
            weapon.y = (container.height * 0.5);
            container.add(weapon);
            container.x = (this.width * 0.5) - 8;
            container.y = (this.height * 0.5) - (container.height * 0.5);
            if (this.labelText.text == "") {
                this.itemText.y = (this.height * 0.5) - (this.itemText.height * 0.5);
            }
        };
        ClassItemButton.prototype.setSkill = function (_data) {
            var perkData = TacticalWeaponPack.SkillDatabase.GetSkill(_data["id"]);
            this.itemText.setText(perkData["name"], true);
            var container = this.game.add.group();
            this.addChild(container);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRoundedRect(0, 0, this.width * 0.5, 50, TacticalWeaponPack.GameUtil.RECTANGLE_RADIUS);
            container.add(gfx);
            var perk = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
            perk.scale.set(0.5, 0.5);
            perk.anchor.set(0.5, 0.5);
            perk.x = (container.width * 0.5);
            perk.y = (container.height * 0.5);
            container.add(perk);
            container.x = (this.width * 0.5) - 8;
            container.y = (this.height * 0.5) - (container.height * 0.5);
            if (this.labelText.text == "") {
                this.itemText.y = (this.height * 0.5) - (this.itemText.height * 0.5);
            }
        };
        ClassItemButton.prototype.setMod = function (_data) {
            var modData = _data; //WeaponDatabase.GetMod(_data["id"]);
            this.itemText.setText(modData["name"], true);
            var container = this.game.add.group();
            this.addChild(container);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRoundedRect(0, 0, this.width * 0.5, 50, TacticalWeaponPack.GameUtil.RECTANGLE_RADIUS);
            container.add(gfx);
            var mod = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
            mod.scale.set(0.5, 0.5);
            mod.anchor.set(0.5, 0.5);
            mod.x = (container.width * 0.5);
            mod.y = (container.height * 0.5);
            container.add(mod);
            container.x = (this.width * 0.5) - 8;
            container.y = (this.height * 0.5) - (container.height * 0.5);
            if (this.labelText.text == "") {
                this.itemText.y = (this.height * 0.5) - (this.itemText.height * 0.5);
            }
        };
        return ClassItemButton;
    }(ButtonBase));
    TacticalWeaponPack.ClassItemButton = ClassItemButton;
    var AchievementButton = /** @class */ (function (_super) {
        __extends(AchievementButton, _super);
        function AchievementButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 100, 80);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            _this.bar = new TacticalWeaponPack.UIBar({
                w: _this.width * 0.8,
                h: 2,
                bInterpColour: true,
                colours: [0xFFFFFF, TacticalWeaponPack.ColourUtil.COLOUR_GREEN]
            });
            _this.bar.x = (_this.width * 0.5) - (_this.bar.width * 0.5);
            _this.bar.y = 4;
            _this.addChild(_this.bar);
            _this.onOut();
            return _this;
        }
        AchievementButton.prototype.destroy = function () {
            this.bar = null;
            _super.prototype.destroy.call(this);
        };
        AchievementButton.prototype.setBarValue = function (_val) {
            if (this.bar) {
                this.bar.setValue(_val);
            }
        };
        AchievementButton.prototype.setAchievement = function (_data) {
            var id = _data["id"];
            var icon = this.game.add.image(0, 0, "atlas_ui", id);
            icon.anchor.set(0.5, 0.5);
            icon.x = this.width * 0.5;
            icon.y = this.height * 0.5;
            this.addChild(icon);
            var bUnlocked = TacticalWeaponPack.PlayerUtil.GetAchievements()[id] == true;
            var lockIcon;
            if (!bUnlocked) {
                lockIcon = this.game.add.image(0, 0, "atlas_ui", "icon_lock");
                icon.alpha = 0.2;
            }
            else {
                lockIcon = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
                icon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                this.bar.visible = false;
            }
            lockIcon.x = this.width - lockIcon.width - 4;
            lockIcon.y = this.height - lockIcon.height - 4;
            this.addChild(lockIcon);
        };
        return AchievementButton;
    }(ButtonBase));
    TacticalWeaponPack.AchievementButton = AchievementButton;
    var LeaderboardPlayerButton = /** @class */ (function (_super) {
        __extends(LeaderboardPlayerButton, _super);
        function LeaderboardPlayerButton(_width, _place, _name, _score, _bHeader, _placement, _url) {
            if (_url === void 0) { _url = null; }
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0x000000, _bHeader ? 0 : 0.5);
            gfx.drawRect(0, 0, _width, 30);
            var bg = gfx.generateTexture();
            _this = _super.call(this, bg) || this;
            gfx.destroy();
            var placeText = _this.game.add.text(20, 0, _bHeader ? "Rank" : _place.toString(), { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            placeText.setTextBounds(0, 3, bg.width * 0.1, bg.height);
            _this.addChild(placeText);
            var nameText = _this.game.add.text(placeText.x + placeText.textBounds.width + 12, 0, _name, { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
            nameText.setTextBounds(0, 3, bg.width * 0.5, bg.height);
            _this.addChild(nameText);
            var scoreText = _this.game.add.text(0, 0, _bHeader ? "Score" : TacticalWeaponPack.GameUtil.FormatNum(_score), { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
            scoreText.setTextBounds(bg.width * 0.8, 3, bg.width * 0.2, bg.height);
            _this.addChild(scoreText);
            if (_bHeader) {
                _this.setEnabled(false);
                _this.setBaseAlpha(1);
                _this.alpha = 0.5;
                scoreText.addColor("#FFFFFF", 0);
                placeText.x = 4;
            }
            else {
                _this.setBaseAlpha(0.8);
            }
            if (_placement > 0) {
                var medal = _this.game.add.image(0, 0, "atlas_ui", "icon_trophy");
                medal.x = 4;
                medal.y = (bg.height * 0.5) - (medal.height * 0.5);
                _this.addChild(medal);
                var placeColours = TacticalWeaponPack.GameUtil.GetPlacementColours();
                if (_placement <= placeColours.length) {
                    medal.tint = placeColours[_placement - 1];
                }
                else {
                    medal.alpha = 0.1;
                }
            }
            if (_url) {
                _this.setCallback(window.open, window, [_url, "_blank"]);
            }
            else {
                _this.setCanClick(false);
            }
            return _this;
        }
        return LeaderboardPlayerButton;
    }(ButtonBase));
    TacticalWeaponPack.LeaderboardPlayerButton = LeaderboardPlayerButton;
    var ControlButton = /** @class */ (function (_super) {
        __extends(ControlButton, _super);
        function ControlButton() {
            var _this = this;
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 240, 80);
            _this = _super.call(this, gfx.generateTexture()) || this;
            gfx.destroy();
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.8);
            gfx.beginFill(TacticalWeaponPack.ColourUtil.COLOUR_THEME, 0.4);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgOver = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgOver);
            var gfx = TacticalWeaponPack.GameUtil.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.width, _this.height);
            _this.bgUp = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.addChild(_this.bgUp);
            _this.keyDetail = new TacticalWeaponPack.KeyDetail(0, "");
            _this.addChild(_this.keyDetail);
            _this.labelText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.labelText.setTextBounds(0, 4, _this.width, 20);
            _this.addChild(_this.labelText);
            _this.onOut();
            return _this;
        }
        ControlButton.prototype.updateKey = function (_id) {
            this.keyId = _id;
            this.keyDetail.setKey(TacticalWeaponPack.PlayerUtil.GetControlsData()[_id]);
            this.keyDetail.x = (this.width * 0.5) - (this.keyDetail.width * 0.5) + 4;
            this.keyDetail.y = (this.height * 0.5) - (this.keyDetail.height * 0.5) + 8;
            this.labelText.setText(TacticalWeaponPack.PlayerUtil.GetKeyDescription(_id), true);
        };
        ControlButton.prototype.refreshKey = function () {
            if (this.keyId) {
                this.updateKey(this.keyId);
            }
        };
        return ControlButton;
    }(ButtonBase));
    TacticalWeaponPack.ControlButton = ControlButton;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var FXFilter = /** @class */ (function (_super) {
        __extends(FXFilter, _super);
        function FXFilter() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.createFilter();
            return _this;
        }
        FXFilter.prototype.destroy = function () {
            if (this.fxFilter) {
                this.fxFilter.dirty = true;
                this.fxFilter.destroy();
            }
            _super.prototype.destroy.call(this);
        };
        FXFilter.prototype.update = function () {
            if (this.fxFilter) {
                this.fxFilter.update();
            }
        };
        FXFilter.prototype.createFilter = function () {
            var fragmentSrc = [
                "precision mediump float;",
                "uniform float     time;",
                "uniform vec2      resolution;",
                "uniform vec2      mouse;",
                "float noise(vec2 pos) {",
                "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
                "}",
                "void main( void ) {",
                "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
                "float pos = (gl_FragCoord.y / resolution.y);",
                "float mouse_dist = 0.0;",
                "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",
                "pos -= (distortion * distortion) * 0.1;",
                "float c = sin(pos * 1200.0) * 0.25 + 0.5;",
                "c = pow(c, 0.5);",
                "c *= 0.5;",
                "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
                "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",
                "c += distortion * 0.08;",
                "// noise",
                "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
                "gl_FragColor = vec4( 0.0, c * 0.15, c * 0.25, 0.0 );",
                "}"
            ];
            this.fxFilter = new Phaser.Filter(this.game, null, fragmentSrc);
            this.fxFilter.setResolution(this.game.width, this.game.height);
            var img = this.game.add.sprite(0, 0);
            img.width = this.game.width;
            img.height = this.game.height;
            img.filters = [this.fxFilter];
            this.add(img);
        };
        return FXFilter;
    }(Phaser.Group));
    TacticalWeaponPack.FXFilter = FXFilter;
    var UISlider = /** @class */ (function (_super) {
        __extends(UISlider, _super);
        function UISlider(_settings, _onUpdateCallback, _onUpdateCallbackContext) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.value = 0;
            _this.min = 0;
            _this.max = 1;
            _this.increment = 1;
            _this.bIsDragging = false;
            _this.onUpdateCallback = _onUpdateCallback;
            _this.onUpdateCallbackContext = _onUpdateCallbackContext;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, 2, 4);
            _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.add(_this.bg);
            _this.fill = _this.game.add.graphics();
            _this.fill.beginFill(0xFFFFFF, 0.5);
            _this.fill.drawRect(0, 0, 32, 14);
            _this.add(_this.fill);
            gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 1);
            gfx.drawCircle(0, 0, 14);
            _this.thumb = new TacticalWeaponPack.ImageButton(gfx.generateTexture());
            _this.thumb.setBaseAlpha(1);
            gfx.destroy();
            _this.thumb.anchor.set(0.5, 0);
            _this.thumb.x = -_this.thumb.width * 0.5;
            _this.add(_this.thumb);
            _this.bg.y = (_this.thumb.height * 0.5) - (_this.bg.height * 0.5);
            if (_settings) {
                if (_settings["increment"] != undefined) {
                    _this.increment = _settings["increment"];
                }
                if (_settings["w"]) {
                    _this.setWidth(_settings["w"]);
                }
                _this.setMin(_settings["min"]);
                _this.setMax(_settings["max"]);
                if (_settings["value"] != undefined) {
                    _this.setValue(_settings["value"], true);
                }
                else {
                    _this.setValue(0, true);
                }
                _this.updateTicks();
            }
            _this.thumb.input.enableDrag();
            _this.thumb.input.setDragLock(true, false);
            _this.thumb.input.boundsRect = new Phaser.Rectangle(_this.thumb.x, 0, _this.bg.width + (_this.thumb.width * 0.5), _this.height);
            _this.thumb.events.onDragStart.add(_this.onThumbDown, _this);
            _this.thumb.events.onDragStop.add(_this.onThumbUp, _this);
            _this.thumb.events.onDragUpdate.add(_this.onThumbUpdate, _this);
            return _this;
        }
        UISlider.prototype.destroy = function () {
            this.onUpdateCallback = null;
            this.onUpdateCallbackContext = null;
            if (this.tween) {
                this.tween.stop();
            }
            this.tween = null;
            this.thumb = null;
            _super.prototype.destroy.call(this);
        };
        UISlider.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.fill) {
                if (this.fill.width != this.thumb.x) {
                    this.fill.width = this.thumb.x;
                    var desiredTint = Phaser.Color.linearInterpolation([0xFFFFFF, TacticalWeaponPack.ColourUtil.COLOUR_GREEN], this.thumb.x / this.width);
                    if (this.fill.tint != desiredTint) {
                        this.fill.tint = desiredTint;
                    }
                }
            }
        };
        UISlider.prototype.onThumbDown = function (sprite, pointer) {
            this.bIsDragging = true;
        };
        UISlider.prototype.onThumbUp = function (sprite, pointer) {
            this.bIsDragging = false;
            this.updateThumb();
        };
        UISlider.prototype.onThumbUpdate = function (sprite, pointer) {
            this.setValueFromPercent(this.thumb.x / this.bg.width);
        };
        UISlider.prototype.updateTicks = function () {
            if (this.increment) {
                var gfx = this.game.add.graphics();
                var width = 2;
                var numTicks = (this.max) / this.increment;
                var tickInterval = this.bg.width / (this.max / this.increment);
                for (var i = 0; i < (numTicks - 1); i++) {
                    gfx.beginFill(0xFFFFFF, 0.2);
                    gfx.drawRect(Math.round(i * tickInterval), 0, width, this.bg.height * 0.5);
                }
                var img = this.game.add.image(0, 0, gfx.generateTexture());
                gfx.destroy();
                img.x = tickInterval;
                img.y = this.bg.y + 1;
                this.add(img);
            }
        };
        UISlider.prototype.updateThumb = function () {
            var desiredX = 0;
            if (this.max > 1) {
                desiredX = Math.floor((this.value / this.max) * this.bg.width);
            }
            else {
                desiredX = Math.floor(this.value * this.bg.width);
            }
            if (this.tween) {
                this.tween.stop();
            }
            this.tween = this.game.add.tween(this.thumb).to({ x: desiredX }, 200, Phaser.Easing.Exponential.Out, true);
        };
        UISlider.prototype.setWidth = function (_val) {
            if (this.bg) {
                this.bg.width = _val;
            }
        };
        UISlider.prototype.setMin = function (_val) {
            this.min = _val;
        };
        UISlider.prototype.setMax = function (_val) {
            this.max = _val;
        };
        UISlider.prototype.setValue = function (_val, _bUpdate) {
            if (_bUpdate === void 0) { _bUpdate = false; }
            if (isNaN(_val)) {
                return;
            }
            this.value = this.roundToNearestIncrement(_val);
            var str = this.value.toString();
            if (this.max <= 1) {
                str = Math.round(this.value * 100).toString();
            }
            if (_bUpdate) {
                this.updateThumb();
            }
            if (this.onUpdateCallback) {
                this.onUpdateCallback.apply(this.onUpdateCallbackContext, [this.value]);
            }
        };
        UISlider.prototype.roundToNearestIncrement = function (_val) {
            return Math.ceil(_val / this.increment) * this.increment;
        };
        UISlider.prototype.setValueFromPercent = function (_val) {
            var val = (this.max * _val) + (this.min * _val);
            if (this.max > 1) {
                val = Math.round(val);
                val = Math.min(this.max, val);
                val = Math.max(this.min, val);
            }
            this.setValue(val);
        };
        UISlider.prototype.getValue = function () {
            return this.value;
        };
        return UISlider;
    }(Phaser.Group));
    TacticalWeaponPack.UISlider = UISlider;
    var UIBar = /** @class */ (function (_super) {
        __extends(UIBar, _super);
        function UIBar(_settings) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.currentValue = 0;
            _this.tweenSpeed = 750;
            _this.settings = _settings;
            if (_settings) {
                _this.setTweenFunction(_settings["tweenFunc"]);
                _this.setSize(_settings["w"], _settings["h"]);
                if (_settings["barColour"] != undefined) {
                    _this.setBarColour(_settings["barColour"]);
                }
                if (_settings["value"] != undefined) {
                    _this.setValue(_settings["value"]);
                }
                else {
                    _this.setValue(0);
                }
                if (_settings["ticks"]) {
                    _this.setTicks(_settings["ticks"]);
                }
            }
            return _this;
        }
        UIBar.prototype.destroy = function () {
            this.settings = null;
            this.tweenFunc = null;
            this.bg = null;
            this.bar = null;
            _super.prototype.destroy.call(this);
        };
        UIBar.prototype.setSize = function (_w, _h) {
            if (this.bg) {
                this.bg.destroy();
            }
            if (this.bar) {
                this.bar.destroy();
            }
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, _w, _h);
            this.bg = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.add(this.bg);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 1);
            gfx.drawRect(0, 0, _w, _h);
            this.bar = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.add(this.bar);
            this.bar.scale.x = 0;
            if (!this.barEdge) {
                var gfx = this.game.add.graphics();
                gfx.beginFill(0xFFFFFF, 0.8);
                gfx.drawRect(0, 0, 2, _h);
                this.barEdge = this.game.add.image(0, 0, gfx.generateTexture());
                this.add(this.barEdge);
                gfx.destroy();
            }
        };
        UIBar.prototype.setTicks = function (_val) {
            var spacing = this.width / (_val - 1);
            for (var i = 0; i < _val; i++) {
                if (i > 0 && i < _val - 1) {
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(0xFFFFFF, 0.35);
                    var w = 2;
                    var h = w;
                    gfx.drawRect(0, 0, w, h);
                    var img = this.game.add.image(0, 0, gfx.generateTexture());
                    img.x = (spacing * i) - (w * 0.5);
                    img.y = (this.height * 0.5) - (h * 0.5);
                    this.addAt(img, 0);
                    gfx.destroy();
                }
            }
        };
        UIBar.prototype.setBarColour = function (_val) {
            if (this.bar) {
                this.bar.tint = _val;
            }
        };
        UIBar.prototype.setTweenFunction = function (_func) {
            this.tweenFunc = _func;
        };
        UIBar.prototype.setValue = function (_val) {
            if (isNaN(_val)) {
                _val = 0;
            }
            this.currentValue = Math.max(0, Math.min(1, _val));
            if (this.bar) {
                if (this.tweenFunc != null) {
                    var tween = this.game.add.tween(this.bar.scale).to({ x: this.currentValue }, this.tweenSpeed, this.tweenFunc, true);
                }
                else {
                    this.bar.scale.x = this.currentValue;
                }
                if (this.settings["bInterpColour"] == true) {
                    var interp = Phaser.Color.linearInterpolation(this.settings["colours"], this.currentValue);
                    this.bar.tint = interp;
                }
                this.bar.visible = this.currentValue > 0;
            }
            if (this.barEdge) {
                var desiredX = Math.max(0, Math.min((this.bg.width * this.currentValue) - this.barEdge.width, this.bg.width - this.barEdge.width));
                if (this.tweenFunc != null) {
                    var tween = this.game.add.tween(this.barEdge).to({ x: desiredX }, this.tweenSpeed, this.tweenFunc, true);
                }
                else {
                    this.barEdge.x = desiredX;
                }
            }
        };
        UIBar.TYPE_DEFAULT = "TYPE_DEFAULT";
        UIBar.TYPE_STATS = "TYPE_STATS";
        return UIBar;
    }(Phaser.Group));
    TacticalWeaponPack.UIBar = UIBar;
    var Modifier = /** @class */ (function (_super) {
        __extends(Modifier, _super);
        function Modifier(_id, _modifierType, _data) {
            if (_data === void 0) { _data = null; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.selectedIndex = 0;
            _this.bEnabled = true;
            _this.id = _id;
            _this.modifierType = _modifierType;
            var buttonWidth = 120;
            var desiredHeight = 40;
            _this.labelText = _this.game.add.text(0, 2, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "left", boundsAlignV: "middle" });
            _this.labelText.alpha = 0.8;
            _this.labelText.setTextBounds(0, 0, 100, desiredHeight);
            _this.add(_this.labelText);
            if (_modifierType == Modifier.MODIFIER_BUTTON) {
                var gfx = _this.game.add.graphics();
                gfx.beginFill(0x000000, 0.2);
                gfx.drawRect(0, 0, buttonWidth * 1.5, desiredHeight);
                var img = _this.game.add.image(0, 0, gfx.generateTexture());
                _this.addAt(img, 0);
                gfx.destroy();
                img.x = _this.labelText.textBounds.width;
                _this.add(img);
                _this.valueText = _this.game.add.text(0, 2, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                _this.valueText.setTextBounds(img.x, img.y, img.width, img.height);
                _this.add(_this.valueText);
                _this.button = new TacticalWeaponPack.MenuButton(buttonWidth, "center");
                _this.button.setCallback(_this.onSelectClicked, _this, [_data["windowTitle"]]);
                _this.button.setLabelText("Select...");
                _this.button.setIcon(_this.game.add.image(0, 0, "atlas_ui", "icon_arrow"));
                _this.button.x = img.x + img.width;
                _this.add(_this.button);
            }
            else if (_modifierType == Modifier.MODIFIER_SLIDER) {
                _this.valueText = _this.game.add.text(0, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                _this.valueText.setTextBounds(0, 3, 64, desiredHeight);
                _this.add(_this.valueText);
                _this.slider = new UISlider(_data, _this.onUpdate, _this);
                _this.slider.x = _this.labelText.textBounds.width;
                _this.slider.y = (desiredHeight * 0.5) - (_this.slider.height * 0.5);
                _this.add(_this.slider);
                _this.valueText.x = _this.slider.x + _this.slider.width;
                var gfx = _this.game.add.graphics();
                gfx.beginFill(0x000000, 0.2);
                gfx.drawRect(0, 0, _this.valueText.textBounds.width, _this.valueText.textBounds.height);
                var img = _this.game.add.image(0, 0, gfx.generateTexture());
                _this.addAt(img, 0);
                gfx.destroy();
                img.x = _this.valueText.x;
                img.y = _this.valueText.y;
            }
            if (_data["label"]) {
                _this.setLabelText(_data["label"]);
            }
            return _this;
        }
        Modifier.prototype.destroy = function () {
            this.onUpdateCallback = null;
            this.onUpdateCallbackContext = null;
            this.slider = null;
            this.button = null;
            this.valueText = null;
            this.labelText = null;
            this.items = null;
            _super.prototype.destroy.call(this);
        };
        Modifier.prototype.setUpdateCallback = function (_func, _context) {
            this.onUpdateCallback = _func;
            this.onUpdateCallbackContext = _context;
        };
        Modifier.prototype.onUpdate = function (_val) {
            this.valueText.setText((_val * 10) + "%", true);
            if (this.onUpdateCallback) {
                this.onUpdateCallback.apply(this.onUpdateCallbackContext, [Math.round(_val) / 10]);
            }
        };
        Modifier.prototype.setEnabled = function (_bVal) {
            this.bEnabled = _bVal;
            if (_bVal) {
                this.alpha = 1;
                this.ignoreChildInput = false;
            }
            else {
                this.alpha = 0.2;
                this.ignoreChildInput = true;
            }
        };
        Modifier.prototype.onSelectClicked = function (_titleText) {
            var window = TacticalWeaponPack.GameUtil.game.createWindow({
                type: TacticalWeaponPack.Window.TYPE_SELECTOR,
                titleText: _titleText,
                id: this.id,
                items: this.items,
                index: this.selectedIndex,
                modifier: this,
                bHideCloseButton: true,
                onCloseCallback: this.selectIndex,
                onCloseCallbackContext: this,
                onCloseCallbackParameters: [this.selectedIndex]
            });
        };
        Modifier.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        Modifier.prototype.setItems = function (_items) {
            this.items = _items;
            if (this.modifierType == Modifier.MODIFIER_BUTTON) {
                this.selectIndex(0);
                this.button.setEnabled(this.items.length > 1);
            }
        };
        Modifier.prototype.selectIndex = function (_index) {
            if (this.items) {
                this.selectedIndex = _index;
                if (_index > this.items.length - 1) {
                    return;
                }
                this.valueText.setText(this.items[this.selectedIndex]["label"], true);
            }
        };
        Modifier.prototype.getSelectedIndex = function () {
            return this.selectedIndex;
        };
        Modifier.prototype.getId = function () {
            return this.id;
        };
        Modifier.prototype.getModifierType = function () {
            return this.modifierType;
        };
        Modifier.prototype.getValue = function () {
            if (this.modifierType == Modifier.MODIFIER_BUTTON) {
                if (this.items && this.items.length > 0) {
                    return this.items[this.selectedIndex]["value"];
                }
            }
            else if (this.modifierType == Modifier.MODIFIER_SLIDER) {
                return this.slider.getValue();
            }
            return null;
        };
        Modifier.prototype.getSlider = function () {
            return this.slider;
        };
        Modifier.MODIFIER_BUTTON = "MODIFIER_BUTTON";
        Modifier.MODIFIER_SLIDER = "MODIFIER_SLIDER";
        return Modifier;
    }(Phaser.Group));
    TacticalWeaponPack.Modifier = Modifier;
    var ChallengeItem = /** @class */ (function (_super) {
        __extends(ChallengeItem, _super);
        function ChallengeItem() {
            return _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
        }
        ChallengeItem.prototype.setItem = function (_val, _max, _str, _xpReward) {
            var text = this.game.add.text(0, 0, _str + ": " + _val + "/" + _max, { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            this.add(text);
            var bar = new UIBar({
                w: 180,
                h: 4,
                value: (_val / _max),
                bInterpColour: true,
                colours: [0xFFFFFF, TacticalWeaponPack.ColourUtil.COLOUR_GREEN],
                ticks: 5
            });
            bar.x = 120;
            bar.y = (text.height * 0.5) - (bar.height * 0.5) - 2;
            this.add(bar);
            var xpText = this.game.add.text(bar.x + bar.width + 4, 0, "+" + _xpReward + "XP", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            this.add(xpText);
        };
        return ChallengeItem;
    }(Phaser.Group));
    TacticalWeaponPack.ChallengeItem = ChallengeItem;
    var AchievementBubble = /** @class */ (function (_super) {
        __extends(AchievementBubble, _super);
        function AchievementBubble() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.timer = 0;
            return _this;
        }
        AchievementBubble.prototype.destroy = function () {
            TacticalWeaponPack.GameUtil.game.onAchievementHidden();
            this.tween = null;
            this.textTween = null;
            _super.prototype.destroy.call(this);
        };
        AchievementBubble.prototype.setAchievement = function (_id) {
            var bg = this.game.add.graphics();
            bg.beginFill(0x000000, 1);
            bg.lineStyle(1, TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 1);
            bg.drawRect(0, 0, this.width, this.height);
            this.add(bg);
            var achievement = TacticalWeaponPack.AchievementsDatabase.GetAchievement(_id);
            if (achievement) {
                TacticalWeaponPack.SoundManager.PlayUISound("ui_achievement", 0.5);
                var icon = this.game.add.image(0, 0, "atlas_ui", _id);
                icon.anchor.set(0.5, 0.5);
                icon.alpha = 0.1;
                icon.x = this.width * 0.5;
                icon.y = this.height * 0.5;
                this.add(icon);
                var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
                checkmark.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                checkmark.x = 10;
                checkmark.y = (this.height * 0.5) - (checkmark.height * 0.5);
                this.add(checkmark);
                var titleText = this.game.add.text(0, 0, "Achievement Unlocked", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_GREEN_STRING });
                titleText.x = (this.width * 0.5) - (titleText.width * 0.5);
                titleText.y = 4;
                this.add(titleText);
                var container = this.game.add.group();
                var nameText = this.game.add.text(0, 0, achievement["name"], { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                nameText.setTextBounds(0, 0, this.width, 20);
                container.add(nameText);
                var descText = this.game.add.text(0, 0, achievement["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                descText.alpha = 0.8;
                descText.setTextBounds(0, 0, this.width, 20);
                descText.y = nameText.y + nameText.textBounds.height;
                container.add(descText);
                container.y = (this.height * 0.5) - (container.height * 0.5) + (titleText.height * 0.2);
                this.add(container);
                var numAchievements = TacticalWeaponPack.AchievementsDatabase.GetAllIds().length;
                var numText = this.game.add.text(0, 0, TacticalWeaponPack.PlayerUtil.GetNumAchivementsUnlocked() + " of " + numAchievements + " achievements unlocked", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                numText.alpha = 0.35;
                numText.x = (this.width * 0.5) - (numText.width * 0.5);
                numText.y = this.height - descText.height;
                this.add(numText);
            }
            //this.textTween = this.game.add.tween(titleText).to({ alpha: 0.5 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
            this.tween = this.game.add.tween(this).from({ alpha: 0, y: this.y + 50 }, 500, Phaser.Easing.Exponential.Out, true);
            this.timer = AchievementBubble.MAX_TIMER;
        };
        AchievementBubble.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.timer > 0) {
                this.timer--;
            }
            else if (this.timer == 0) {
                this.tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
                this.tween.onComplete.add(this.destroy, this);
                this.timer = -1;
            }
        };
        Object.defineProperty(AchievementBubble.prototype, "width", {
            get: function () {
                return 300;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievementBubble.prototype, "height", {
            get: function () {
                return 100;
            },
            enumerable: true,
            configurable: true
        });
        AchievementBubble.MAX_TIMER = 210;
        return AchievementBubble;
    }(Phaser.Group));
    TacticalWeaponPack.AchievementBubble = AchievementBubble;
    var PlayerRankItem = /** @class */ (function (_super) {
        __extends(PlayerRankItem, _super);
        function PlayerRankItem(_rank) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.rankIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_rank_1");
            _this.rankIcon.scale.set(0.5, 0.5);
            _this.rankIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
            _this.add(_this.rankIcon);
            _this.rankText = _this.game.add.text(0, _this.rankIcon.height + 2, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
            _this.add(_this.rankText);
            _this.setRank(_rank);
            return _this;
        }
        PlayerRankItem.prototype.destroy = function () {
            this.rankIcon = null;
            this.rankText = null;
            _super.prototype.destroy.call(this);
        };
        PlayerRankItem.prototype.setRank = function (_val) {
            this.rankIcon.frameName = TacticalWeaponPack.PlayerUtil.GetRankIdFor(_val);
            this.rankText.setText(_val.toString());
            this.rankText.x = (this.rankIcon.width * 0.5) - (this.rankText.width * 0.5);
        };
        return PlayerRankItem;
    }(Phaser.Group));
    TacticalWeaponPack.PlayerRankItem = PlayerRankItem;
    var RankBar = /** @class */ (function (_super) {
        __extends(RankBar, _super);
        function RankBar(_w) {
            if (_w === void 0) { _w = 800; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var padding = 20;
            _this.xpBar = new UIBar({
                w: _w,
                h: 4,
                barColour: TacticalWeaponPack.ColourUtil.COLOUR_XP,
                ticks: 9,
                tweenFunc: Phaser.Easing.Exponential.Out
            });
            _this.add(_this.xpBar);
            _this.currentRank = new PlayerRankItem(1);
            _this.add(_this.currentRank);
            _this.xpBar.x = _this.currentRank.x + _this.currentRank.width + padding;
            _this.nextRank = new PlayerRankItem(1);
            _this.nextRank.alpha = 0.2;
            _this.nextRank.x = _this.xpBar.x + _this.xpBar.width + padding;
            _this.add(_this.nextRank);
            _this.xpBar.y = (_this.height * 0.5) - (_this.xpBar.height * 0.5);
            _this.updateForCurrentPlayer();
            return _this;
        }
        RankBar.prototype.destroy = function () {
            this.xpBar = null;
            this.currentRank = null;
            this.nextRank = null;
            _super.prototype.destroy.call(this);
        };
        RankBar.prototype.updateForCurrentPlayer = function () {
            this.updateRank();
            this.updateXP();
        };
        RankBar.prototype.updateXP = function () {
            this.xpBar.setValue(TacticalWeaponPack.PlayerUtil.GetCurrentXPPercent());
        };
        RankBar.prototype.updateRank = function () {
            var rank = TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"];
            this.currentRank.setRank(rank);
            if (rank < TacticalWeaponPack.PlayerUtil.MAX_RANK) {
                this.nextRank.setRank(rank + 1);
            }
            else {
                this.nextRank.setRank(rank);
            }
        };
        return RankBar;
    }(Phaser.Group));
    TacticalWeaponPack.RankBar = RankBar;
    var GameStat = /** @class */ (function (_super) {
        __extends(GameStat, _super);
        function GameStat(_title, _val, _size) {
            if (_size === void 0) { _size = 22; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 120, 50);
            _this.add(gfx);
            var titleText = _this.game.add.text(0, 0, _title, { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
            titleText.x = (_this.width * 0.5) - (titleText.width * 0.5);
            _this.add(titleText);
            var valueText = _this.game.add.text(0, 0, _val, { font: _size + "px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center" });
            valueText.x = (_this.width * 0.5) - (valueText.width * 0.5);
            valueText.y = titleText.y + titleText.height;
            _this.add(valueText);
            return _this;
        }
        return GameStat;
    }(Phaser.Group));
    TacticalWeaponPack.GameStat = GameStat;
    var UnlockItem = /** @class */ (function (_super) {
        __extends(UnlockItem, _super);
        function UnlockItem(_type, _id, _data) {
            if (_data === void 0) { _data = null; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, 128, 90);
            _this.add(_this.game.add.image(0, 0, gfx.generateTexture()));
            gfx.destroy();
            var text = _this.game.add.text(0, 0, "", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center" });
            text.alpha = 0.8;
            text.y = 4;
            _this.add(text);
            if (_type == "weapon") {
                var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(_id);
                text.setText(weaponData["name"], true);
                var weapon = _this.game.add.image(0, 0, "atlas_weapons", weaponData["id"]);
                weapon.x = (_this.width * 0.5) - (weapon.width * 0.5);
                weapon.y = (_this.height * 0.5) - (weapon.height * 0.5) + 4;
                _this.add(weapon);
            }
            else if (_type == "skill") {
                var skillData = TacticalWeaponPack.SkillDatabase.GetSkill(_id);
                text.setText(skillData["name"], true);
                var skill = _this.game.add.image(0, 0, "atlas_ui", skillData["id"]);
                skill.scale.set(0.5, 0.5);
                skill.x = (_this.width * 0.5) - (skill.width * 0.5);
                skill.y = (_this.height * 0.5) - (skill.height * 0.5) + 4;
                _this.add(skill);
            }
            else if (_type == "mod") {
                var modData = TacticalWeaponPack.WeaponDatabase.GetMod(_id);
                var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(_data["weaponId"]);
                text.setText(weaponData["name"] + ": " + modData["name"], true);
                text.addColor("#999999", 0);
                text.addColor("#FFFFFF", weaponData["name"].length + 1);
                var mod = _this.game.add.image(0, 0, "atlas_ui", _id);
                mod.scale.set(0.5, 0.5);
                mod.x = (_this.width * 0.5) - (mod.width * 0.5);
                mod.y = (_this.height * 0.5) - (mod.height * 0.5) + 2;
                _this.add(mod);
                var weaponIcon = _this.game.add.image(0, 0, "atlas_weapons", weaponData["id"]);
                weaponIcon.alpha = 0.35;
                weaponIcon.scale.set(0.5, 0.5);
                weaponIcon.x = (_this.width * 0.5) - (weaponIcon.width * 0.5);
                weaponIcon.y = (_this.height - weaponIcon.height - 4);
                _this.add(weaponIcon);
            }
            text.x = (_this.width * 0.5) - (text.width * 0.5);
            var newIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_new");
            newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
            newIcon.x = _this.width - newIcon.width;
            newIcon.y = _this.height - newIcon.height;
            _this.add(newIcon);
            return _this;
        }
        return UnlockItem;
    }(Phaser.Group));
    TacticalWeaponPack.UnlockItem = UnlockItem;
    var KeyDetail = /** @class */ (function (_super) {
        __extends(KeyDetail, _super);
        function KeyDetail(_key, _desc) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.descText = _this.game.add.text(0, 0, _desc, { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(_this.descText);
            _this.setKey(_key);
            return _this;
        }
        KeyDetail.prototype.destroy = function () {
            this.keyIcon = null;
            _super.prototype.destroy.call(this);
        };
        KeyDetail.prototype.setKey = function (_key) {
            if (this.keyIcon) {
                this.keyIcon.destroy();
            }
            this.keyIcon = new KeyIcon(TacticalWeaponPack.GameUtil.GetKeySize(_key));
            this.keyIcon.setKey(_key);
            this.add(this.keyIcon);
            this.descText.x = this.keyIcon.width + 8;
            this.descText.y = (this.keyIcon.height * 0.5) - (this.descText.height * 0.5) + 3;
        };
        KeyDetail.prototype.setDescText = function (_val) {
            this.descText.setText(_val, true);
        };
        return KeyDetail;
    }(Phaser.Group));
    TacticalWeaponPack.KeyDetail = KeyDetail;
    var KeyIcon = /** @class */ (function (_super) {
        __extends(KeyIcon, _super);
        function KeyIcon(_size) {
            if (_size === void 0) { _size = 32; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            gfx.drawRect(0, 0, _size, 32);
            var bg = _this.game.add.image(0, 0, gfx.generateTexture());
            _this.add(bg);
            gfx.destroy();
            _this.keyText = _this.game.add.text(0, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.keyText.setTextBounds(0, 3, bg.width, bg.height);
            _this.add(_this.keyText);
            return _this;
        }
        KeyIcon.prototype.destroy = function () {
            this.keyText = null;
            _super.prototype.destroy.call(this);
        };
        KeyIcon.prototype.setKey = function (_val) {
            this.keyText.setText(TacticalWeaponPack.GameUtil.GetKeyStringFromId(_val), true);
        };
        return KeyIcon;
    }(Phaser.Group));
    TacticalWeaponPack.KeyIcon = KeyIcon;
    var VolumeToggler = /** @class */ (function (_super) {
        __extends(VolumeToggler, _super);
        function VolumeToggler() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.updateImage();
            return _this;
        }
        VolumeToggler.prototype.destroy = function () {
            this.image = null;
            _super.prototype.destroy.call(this);
        };
        VolumeToggler.prototype.updateImage = function () {
            if (this.image) {
                this.image.destroy();
            }
            var bMuted = TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] == 0 && TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] == 0;
            this.image = new TacticalWeaponPack.ImageButton("atlas_ui", bMuted ? "icon_mute" : "icon_volume");
            this.image.setCallback(this.toggle, this);
            this.add(this.image);
        };
        VolumeToggler.prototype.toggle = function () {
            var bMuted = TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] == 0 && TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] == 0;
            if (bMuted) {
                TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] = 1;
                TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] = 1;
            }
            else {
                TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] = 0;
                TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] = 0;
            }
            TacticalWeaponPack.SoundManager.UpdateMusicVolume();
            if (TacticalWeaponPack.GameUtil.GetGameState()) {
                var pauseMenu = TacticalWeaponPack.GameUtil.GetGameState().getPauseMenu();
                if (pauseMenu) {
                    pauseMenu.refreshMenu();
                }
            }
            this.updateImage();
        };
        return VolumeToggler;
    }(Phaser.Group));
    TacticalWeaponPack.VolumeToggler = VolumeToggler;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var MenuSmoke = /** @class */ (function (_super) {
        __extends(MenuSmoke, _super);
        function MenuSmoke() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var numSmokes = 20;
            var maxSmokeSpeed = 24;
            var maxSmokeRotationSpeed = 5;
            var bEnabled = true;
            if (bEnabled) {
                for (var i = 0; i < numSmokes; i++) {
                    var smoke = _this.game.add.image(0, 0, "smoke");
                    smoke.anchor.set(0.5, 0.5);
                    smoke.width = smoke.height = TacticalWeaponPack.MathUtil.Random(_this.game.height, _this.game.height * 2);
                    smoke.x = (i * (_this.game.width / numSmokes));
                    smoke.y = _this.game.height * 0.2; //(smoke.height * 0.5);
                    smoke.alpha = TacticalWeaponPack.MathUtil.Random(5, 25) * 0.01;
                    smoke.rotation = TacticalWeaponPack.MathUtil.RandomAngle();
                    smoke.data = {
                        speed: TacticalWeaponPack.MathUtil.Random(-maxSmokeSpeed, maxSmokeSpeed) * 0.01,
                        rotationSpeed: (TacticalWeaponPack.MathUtil.Random(-maxSmokeRotationSpeed, maxSmokeRotationSpeed) * 0.01) * TacticalWeaponPack.MathUtil.TO_RADIANS
                    };
                    _this.add(smoke);
                }
            }
            return _this;
        }
        MenuSmoke.prototype.update = function () {
            for (var i = 0; i < this.length; i++) {
                var child = this.getAt(i);
                child.rotation += child.data["rotationSpeed"];
                child.x += child.data["speed"];
                var mult = child.width * 0.49;
                if (child.x > this.game.width + mult) {
                    child.x = -mult;
                }
                else if (child.x < -mult) {
                    child.x = this.game.width + mult;
                }
            }
        };
        MenuSmoke.prototype.setTint = function (_val) {
            for (var i = 0; i < this.length; i++) {
                var child = this.getAt(i);
                child.tint = _val;
            }
        };
        return MenuSmoke;
    }(Phaser.Group));
    TacticalWeaponPack.MenuSmoke = MenuSmoke;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var ElementBase = /** @class */ (function (_super) {
        __extends(ElementBase, _super);
        function ElementBase(_showTweenTime, _closeTweenTime) {
            if (_showTweenTime === void 0) { _showTweenTime = 400; }
            if (_closeTweenTime === void 0) { _closeTweenTime = 100; }
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.showTweenTime = 400;
            _this.closeTweenTime = 100;
            _this.bDestroyed = false;
            _this.showTweenTime = _showTweenTime;
            _this.closeTweenTime = _closeTweenTime;
            _this.inputEnableChildren = true;
            TacticalWeaponPack.GameUtil.game.addUIElement(_this);
            _this.show();
            return _this;
        }
        ElementBase.prototype.destroy = function () {
            this.tween = null;
            this.onShowCallback = null;
            this.onShowCallbackContext = null;
            this.onShowCallbackParameters = null;
            this.onCloseCallback = null;
            this.onCloseCallbackContext = null;
            this.onCloseCallbackParameters = null;
            TacticalWeaponPack.GameUtil.game.removeUIElement(this);
            this.bDestroyed = true;
            _super.prototype.destroy.call(this);
        };
        ElementBase.prototype.setOnShowCallback = function (_func, _funcContext, _parameters) {
            if (_parameters === void 0) { _parameters = null; }
            this.onShowCallback = _func;
            this.onShowCallbackContext = _funcContext;
            this.onShowCallbackParameters = _parameters;
        };
        ElementBase.prototype.setOnCloseCallback = function (_func, _funcContext, _parameters) {
            if (_parameters === void 0) { _parameters = null; }
            this.onCloseCallback = _func;
            this.onCloseCallbackContext = _funcContext;
            this.onCloseCallbackParameters = _parameters;
        };
        ElementBase.prototype.show = function () {
            this.alpha = 0;
            if (this.tween) {
                this.tween.stop();
            }
            this.tween = this.game.add.tween(this).to({ alpha: 1 }, this.showTweenTime, Phaser.Easing.Exponential.Out, true);
            this.tween.onComplete.add(this.onShow, this);
        };
        ElementBase.prototype.onShow = function () {
            if (this.onShowCallback) {
                this.onShowCallback.apply(this.onShowCallbackContext, this.onShowCallbackParameters);
            }
        };
        ElementBase.prototype.close = function () {
            this.inputEnableChildren = false;
            this.ignoreChildInput = true;
            if (this.tween) {
                this.tween.stop();
            }
            this.tween = this.game.add.tween(this).to({ alpha: 0 }, this.closeTweenTime, Phaser.Easing.Exponential.Out, true);
            this.tween.onComplete.add(this.onClose, this);
        };
        ElementBase.prototype.onClose = function () {
            if (this.onCloseCallback) {
                this.onCloseCallback.apply(this.onCloseCallbackContext, this.onCloseCallbackParameters);
            }
            this.destroy();
        };
        return ElementBase;
    }(Phaser.Group));
    TacticalWeaponPack.ElementBase = ElementBase;
    var Window = /** @class */ (function (_super) {
        __extends(Window, _super);
        function Window() {
            return _super.call(this) || this;
        }
        Window.prototype.destroy = function () {
            this.props = null;
            this.content = null;
            this.windowContainer = null;
            this.data = null;
            this.bg = null;
            this.overlay = null;
            _super.prototype.destroy.call(this);
        };
        Window.prototype.setFromData = function (_data) {
            this.data = _data;
            this.windowContainer = this.game.add.group();
            this.add(this.windowContainer);
            this.content = this.game.add.group();
            this.windowContainer.add(this.content);
            if (_data) {
                if (_data["onCloseCallback"]) {
                    this.onCloseCallback = _data["onCloseCallback"];
                }
                if (_data["onCloseCallbackContext"]) {
                    this.onCloseCallbackContext = _data["onCloseCallbackContext"];
                }
                if (_data["onCloseCallbackParameters"]) {
                    this.onCloseCallbackParameters = _data["onCloseCallbackParameters"];
                }
                if (_data["titleText"]) {
                    var useHeight = 32;
                    var titleText = this.game.add.text(0, 0, _data["titleText"], { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
                    TacticalWeaponPack.GameUtil.SetTextShadow(titleText);
                    titleText.alpha = 1;
                    titleText.setTextBounds(0, 3, Window.WINDOW_WIDTH, useHeight);
                    this.windowContainer.add(titleText);
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(0xFFFFFF, 0.05);
                    gfx.drawRect(0, 0, Window.WINDOW_WIDTH, useHeight);
                    var img = this.game.add.image(0, 0, gfx.generateTexture());
                    this.windowContainer.add(img);
                    gfx.destroy();
                }
                if (_data["icon"]) {
                    var icon = _data["icon"];
                    icon.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (icon.width * 0.5);
                    this.content.add(icon);
                }
                if (_data["messageText"]) {
                    var messageText = this.game.add.text(0, 0, _data["messageText"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
                    messageText.setTextBounds(0, 0, Window.MAX_CONTENT_WIDTH, messageText.height);
                    messageText.y = this.content.height + (this.content.height > 0 ? 20 : 0);
                    this.content.add(messageText);
                    if (_data["highlights"]) {
                        var message = _data["messageText"];
                        var highlights = _data["highlights"];
                        for (var i = 0; i < highlights.length; i++) {
                            var cur = highlights[i];
                            var index = _data["messageText"].indexOf(cur);
                            if (index >= 0) {
                                messageText.addColor(TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, index);
                                messageText.addColor("#FFFFFF", index + cur.length);
                            }
                        }
                    }
                }
                var type = _data["type"];
                if (type == Window.TYPE_YES_NO) {
                    var buttons = this.game.add.group();
                    var noButton = new TacticalWeaponPack.MenuButton(150, "center");
                    noButton.setCallback(this.close, this);
                    noButton.setLabelText("No");
                    buttons.add(noButton);
                    var yesButton = new TacticalWeaponPack.MenuButton(150, "center");
                    yesButton.setCallback(this.closeAndCallback, this, [
                        _data["yesCallback"],
                        _data["yesCallbackContext"],
                        _data["yesCallbackParams"]
                    ]);
                    yesButton.setLabelText("Yes");
                    yesButton.x = noButton.x + noButton.width + 4;
                    buttons.add(yesButton);
                    buttons.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (buttons.width * 0.5);
                    buttons.y = this.content.height + 20;
                    this.content.add(buttons);
                }
                else if (type == Window.TYPE_DOWNLOAD) {
                    var downloadButton = new TacticalWeaponPack.MenuButton(undefined, "center", TacticalWeaponPack.ColourUtil.COLOUR_GREEN);
                    downloadButton.setCallback(TacticalWeaponPack.GameUtil.OpenTWPDownload, TacticalWeaponPack.GameUtil);
                    downloadButton.setLabelText("Download Now!");
                    downloadButton.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (downloadButton.width * 0.5);
                    downloadButton.y = this.content.height + 20;
                    this.content.add(downloadButton);
                }
                else if (type == Window.TYPE_WELCOME) {
                    var rankedText = this.game.add.text(0, 0, "Ranked", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                    rankedText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (rankedText.width * 0.5);
                    rankedText.y = this.content.height + 20;
                    this.content.add(rankedText);
                    var infoText = this.game.add.text(0, 0, "Select a game mode and earn XP to unlock new weapons, attachments, and skills.\nSubmit your best scores in the worldwide leaderboards!", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center" });
                    infoText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (infoText.width * 0.5);
                    infoText.y = this.content.height;
                    this.content.add(infoText);
                    var firingRangeText = this.game.add.text(0, 0, "Firing Range", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                    firingRangeText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (firingRangeText.width * 0.5);
                    firingRangeText.y = this.content.height + 20;
                    this.content.add(firingRangeText);
                    var infoText = this.game.add.text(0, 0, "Test any weapon of your choice, even ones you haven't unlocked yet.\nYou won't earn XP when in the firing range.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center" });
                    infoText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (infoText.width * 0.5);
                    infoText.y = this.content.height;
                    this.content.add(infoText);
                }
                else if (type == Window.TYPE_CONTROLS) {
                    var controlsContainer = this.game.add.group();
                    controlsContainer.name = "controlsContainer";
                    var controls = [
                        TacticalWeaponPack.PlayerUtil.CONTROL_RELOAD,
                        TacticalWeaponPack.PlayerUtil.CONTROL_SWITCH_WEAPON,
                        TacticalWeaponPack.PlayerUtil.CONTROL_BARREL,
                        TacticalWeaponPack.PlayerUtil.CONTROL_ACTION
                    ];
                    for (var i = 0; i < controls.length; i++) {
                        var controlButton = new TacticalWeaponPack.ControlButton();
                        controlButton.setCallback(this.onControlButtonClicked, this, [controls[i]]);
                        controlButton.updateKey(controls[i]);
                        controlButton.y = controlsContainer.height + (i > 0 ? 4 : 0);
                        controlsContainer.add(controlButton);
                    }
                    controlsContainer.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (controlsContainer.width * 0.5);
                    controlsContainer.y = this.content.height + 20;
                    this.content.add(controlsContainer);
                }
                else if (type == Window.TYPE_PROFILE) {
                    var rankedData = TacticalWeaponPack.PlayerUtil.GetRankedData();
                    var xpText = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.FormatNum(rankedData["xp"]) + "XP", { font: "32px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                    xpText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (xpText.width * 0.5);
                    xpText.y = this.content.height + 20;
                    this.content.add(xpText);
                    var rankBar = new TacticalWeaponPack.RankBar(Window.MAX_CONTENT_WIDTH * 0.8);
                    rankBar.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (rankBar.width * 0.5);
                    rankBar.y = this.content.height;
                    this.content.add(rankBar);
                    var stats = this.game.add.group();
                    var padding = 30;
                    var kills = new StatItem();
                    kills.setText(rankedData["kills"], "Kills");
                    stats.add(kills);
                    var headshots = new StatItem();
                    headshots.setText(rankedData["headshots"], "Headshots");
                    headshots.x = stats.width + padding;
                    stats.add(headshots);
                    var shotsFired = new StatItem();
                    shotsFired.setText(rankedData["shotsFired"], "Shots Fired");
                    shotsFired.x = stats.width + padding;
                    stats.add(shotsFired);
                    var accuracy = new StatItem();
                    accuracy.setText(parseFloat(String(TacticalWeaponPack.PlayerUtil.GetCurrentAccuracy() * 100)).toFixed(2) + "%", "Accuracy");
                    accuracy.x = stats.width + padding;
                    stats.add(accuracy);
                    stats.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (stats.width * 0.5);
                    stats.y = this.content.height + 10;
                    this.content.add(stats);
                    var rankedKillsNum = TacticalWeaponPack.PlayerUtil.GetRankedData()["kills_ranked"];
                    var totalKillsNum = TacticalWeaponPack.PlayerUtil.GetRankedData()["kills"];
                    var killsBar = new TacticalWeaponPack.UIBar({
                        w: Window.MAX_CONTENT_WIDTH * 0.4,
                        h: 2,
                        barColour: TacticalWeaponPack.ColourUtil.COLOUR_GREEN,
                        value: rankedKillsNum / totalKillsNum
                    });
                    killsBar.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (killsBar.width * 0.5);
                    killsBar.y = this.content.height + 10;
                    this.content.add(killsBar);
                    var killsRankedText = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.FormatNum(rankedKillsNum) + " ranked kills", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    killsRankedText.x = killsBar.x - killsRankedText.width - 10;
                    killsRankedText.y = killsBar.y;
                    killsRankedText.alpha = 0.5;
                    this.content.add(killsRankedText);
                    var killsTotalText = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.FormatNum(totalKillsNum - rankedKillsNum) + " firing range kills", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    killsTotalText.x = killsBar.x + killsBar.width + 10;
                    killsTotalText.y = killsRankedText.y;
                    killsTotalText.alpha = 0.5;
                    this.content.add(killsTotalText);
                    killsBar.y += (killsRankedText.height * 0.5) - 3;
                    var favContainer = this.game.add.group();
                    var favText = this.game.add.text(0, 0, "Favorite Ranked Weapon:", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    favText.alpha = 0.8;
                    favContainer.add(favText);
                    var favId = TacticalWeaponPack.PlayerUtil.GetFavouriteWeapon();
                    var favNameText = this.game.add.text(0, 0, favId ? TacticalWeaponPack.WeaponDatabase.GetWeapon(favId)["name"] : "N/A", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    favNameText.x = (favText.width * 0.5) - (favNameText.width * 0.5);
                    favNameText.y = favText.height;
                    favContainer.add(favNameText);
                    if (favId) {
                        var wpnIcon = this.game.add.image(0, 0, "atlas_weapons", favId);
                        wpnIcon.x = (favContainer.width * 0.5) - (wpnIcon.width * 0.5);
                        wpnIcon.y = favContainer.height + 10;
                        favContainer.add(wpnIcon);
                        var favKillsText = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.FormatNum(rankedData["weapons"][favId]["kills"]) + " kills, " + TacticalWeaponPack.GameUtil.FormatNum(rankedData["weapons"][favId]["headshots"]) + " headshots", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                        favKillsText.x = (favContainer.width * 0.5) - (favKillsText.width * 0.5);
                        favKillsText.y = favContainer.height + 20;
                        favKillsText.alpha = 0.8;
                        favContainer.add(favKillsText);
                    }
                    favContainer.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (favContainer.width * 0.5);
                    favContainer.y = this.content.height + 20;
                    this.content.add(favContainer);
                }
                else if (type == Window.TYPE_NEW_UNLOCKS) {
                    TacticalWeaponPack.SoundManager.PlayUISound("ui_unlock");
                    var unlocks = this.game.add.group();
                    var items = TacticalWeaponPack.PlayerUtil.GetNewUnlocks();
                    items = items.sort(TacticalWeaponPack.GameUtil.CompareNewUnlocks);
                    var curX = 0;
                    var curY = 0;
                    var padding = 4;
                    for (var i = 0; i < items.length; i++) {
                        var item = new TacticalWeaponPack.UnlockItem(items[i]["type"], items[i]["id"], items[i]["data"]);
                        item.x = (item.width * curX) + (curX > 0 ? (padding * curX) : 0);
                        item.y = (item.height * curY) + (curY > 0 ? (padding * curY) : 0);
                        unlocks.add(item);
                        curX++;
                        if (curX >= 4) {
                            curX = 0;
                            curY++;
                        }
                        if (curY >= 3) {
                            break;
                        }
                    }
                    unlocks.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (unlocks.width * 0.5);
                    unlocks.y = this.content.height + 20;
                    this.content.add(unlocks);
                    var gfx = this.game.add.graphics();
                    gfx.lineStyle(1, 0xFFFFFF, 0.5);
                    gfx.lineTo(Window.MAX_CONTENT_WIDTH * 0.9, 0);
                    var newLine = this.game.add.image(0, 0, gfx.generateTexture());
                    gfx.destroy();
                    newLine.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (newLine.width * 0.5);
                    newLine.y = Math.round(this.content.height + 20);
                    this.content.add(newLine);
                    var editText = this.game.add.text(0, 0, "You can now equip " + (items.length > 1 ? "these items" : "this item") + " in your custom classes.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    editText.alpha = 0.5;
                    editText.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (editText.width * 0.5);
                    editText.y = this.content.height + 20;
                    this.content.add(editText);
                    var editClassesButton = new TacticalWeaponPack.MenuButton(undefined, "center");
                    editClassesButton.setCallback(this.closeAndCallback, this, [TacticalWeaponPack.GameUtil.OpenEditClasses, TacticalWeaponPack.GameUtil]);
                    editClassesButton.setLabelText("Edit Classes");
                    editClassesButton.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (editClassesButton.width * 0.5);
                    editClassesButton.y = this.content.height + 20;
                    this.content.add(editClassesButton);
                }
                else if (type == Window.TYPE_EDIT_CLASSES) {
                    var classes = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"];
                    var group = this.game.add.group();
                    var classPreview = new ClassPreview();
                    var buttons = this.game.add.group();
                    var mainMenu = TacticalWeaponPack.GameUtil.game.getMainMenu();
                    for (var i = 0; i < classes.length; i++) {
                        var classButton = new TacticalWeaponPack.MenuButton(140, "center");
                        classButton.setCallback(this.closeAndCallback, this, [mainMenu.loadMenu, mainMenu, [MainMenu.MENU_EDIT_CLASS, i]]);
                        classButton.events.onInputOver.add(this.onClassButtonOver, this, 0, classPreview, i);
                        classButton.events.onInputOut.add(this.onClassButtonOut, this, 0, classPreview);
                        classButton.setLabelText(classes[i]["name"]);
                        classButton.x = buttons.width + (i > 0 ? 4 : 0);
                        buttons.add(classButton);
                    }
                    group.add(buttons);
                    classPreview.x = (group.width * 0.5) - (classPreview.width * 0.5);
                    classPreview.y = group.height + 10;
                    group.add(classPreview);
                    buttons.x = (group.width * 0.5) - (buttons.width * 0.5);
                    group.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (group.width * 0.5);
                    group.y = this.content.height + 20;
                    this.content.add(group);
                }
                else if (type == Window.TYPE_CHALLENGES) {
                    var padding = 10;
                    var bars = this.game.add.group();
                    var rankedData = TacticalWeaponPack.PlayerUtil.GetRankedData();
                    var killsItem = new TacticalWeaponPack.ChallengeItem();
                    killsItem.setItem(rankedData["kills_ranked"] % 100, 100, "Kills", 100);
                    bars.add(killsItem);
                    var headshotsItem = new TacticalWeaponPack.ChallengeItem();
                    headshotsItem.setItem(rankedData["headshots_ranked"] % 50, 50, "Headshots", 100);
                    headshotsItem.y = bars.height + 4;
                    bars.add(headshotsItem);
                    var shotsFiredItem = new TacticalWeaponPack.ChallengeItem();
                    shotsFiredItem.setItem(rankedData["shotsFired_ranked"] % 500, 500, "Shots Fired", 100);
                    shotsFiredItem.y = bars.height + 4;
                    bars.add(shotsFiredItem);
                    bars.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (bars.width * 0.5);
                    bars.y = this.content.height + 20;
                    this.content.add(bars);
                }
                else if (type == Window.TYPE_QUICK_PLAY) {
                    var gameModes = this.game.add.group();
                    var bMultiplayer = _data["bMultiplayer"];
                    var arr = TacticalWeaponPack.GameModeDatabase.GetAllRankedGameModes();
                    for (var i = 0; i < arr.length; i++) {
                        var modeButton = new TacticalWeaponPack.QuickPlayGameModeButton(arr[i]);
                        modeButton.setCallback(this.closeAndCallback, this, [
                            TacticalWeaponPack.GameUtil.game.prepareGame,
                            TacticalWeaponPack.GameUtil.game,
                            [
                                {
                                    gameMode: arr[i]["id"]
                                }
                            ]
                        ]);
                        modeButton.x = gameModes.width + (i > 0 ? 4 : 0);
                        gameModes.add(modeButton);
                        modeButton.events.onInputOver.add(this.onQuickModeButtonOver, this, 0, arr[i]);
                        modeButton.events.onInputOut.add(this.onQuickModeButtonOut, this, 0);
                    }
                    gameModes.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (gameModes.width * 0.5);
                    gameModes.y = this.content.height + 10;
                    this.content.add(gameModes);
                    var modeNameText = this.game.add.text(0, 0, "", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                    modeNameText.name = "modeNameText";
                    modeNameText.setTextBounds(0, 0, Window.MAX_CONTENT_WIDTH, 30);
                    modeNameText.y = this.content.height + 10;
                    this.content.add(modeNameText);
                    var modeDescText = this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                    modeDescText.name = "modeDescText";
                    modeDescText.alpha = 0.8;
                    modeDescText.setTextBounds(0, 0, Window.MAX_CONTENT_WIDTH, 30);
                    modeDescText.y = this.content.height;
                    this.content.add(modeDescText);
                }
                else if (type == Window.TYPE_SELECTOR) {
                    this.props = {};
                    var padding = 8;
                    var container = this.game.add.group();
                    var prevButton = new TacticalWeaponPack.MenuButton(100, "center");
                    prevButton.setCallback(this.onSelectorPrev, this);
                    prevButton.setLabelText("\u25c0");
                    container.add(prevButton);
                    var pageText = this.game.add.text(0, 0, "1 of 1", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    pageText.alpha = 0.5;
                    pageText.x = prevButton.x + prevButton.width + padding;
                    pageText.y = (prevButton.height * 0.5) - (pageText.height * 0.5) + 2;
                    container.add(pageText);
                    var nextButton = new TacticalWeaponPack.MenuButton(100, "center");
                    nextButton.setCallback(this.onSelectorNext, this);
                    nextButton.setLabelText("\u25b6");
                    nextButton.x = pageText.x + pageText.width + padding;
                    container.add(nextButton);
                    this.props["pageText"] = pageText;
                    this.props["nextButton"] = nextButton;
                    this.props["prevButton"] = prevButton;
                    this.setSelectorItems(_data["items"], _data["index"]);
                    container.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (container.width * 0.5);
                    container.y = this.content.height + Window.WINDOW_PADDING;
                    this.content.add(container);
                    var selectButton = new TacticalWeaponPack.MenuButton(220, "center");
                    selectButton.setCallback(this.close, this);
                    selectButton.setLabelText("Select");
                    selectButton.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (selectButton.width * 0.5);
                    selectButton.y = this.content.height + Window.WINDOW_PADDING;
                    this.content.add(selectButton);
                }
                if (_data["bShowSpinner"] == true) {
                    var spinner = TacticalWeaponPack.GameUtil.CreateSpinner();
                    spinner.x = (Window.MAX_CONTENT_WIDTH * 0.5);
                    spinner.y = (this.content.height + (spinner.height * 0.5)) + 12;
                    this.content.add(spinner);
                }
                if (_data["bShowOkayButton"] == true) {
                    var okButton = new TacticalWeaponPack.MenuButton(undefined, "center");
                    okButton.setCallback(this.close, this);
                    okButton.setLabelText("OK");
                    okButton.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (okButton.width * 0.5);
                    okButton.y = this.content.height + 20;
                    this.content.add(okButton);
                }
                if (_data["bHideCloseButton"] != true) {
                    var closeButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_close");
                    closeButton.setCallback(this.close, this);
                    closeButton.x = (Window.WINDOW_WIDTH - closeButton.width);
                    if (titleText) {
                        closeButton.y = (titleText.y + (titleText.height * 0.5)) - (closeButton.height * 0.5) + 1;
                    }
                    this.windowContainer.add(closeButton);
                    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.addOnce(this.onEscKeyPressed, this);
                }
                if (_data["autoCloseTimer"]) {
                    var timer = this.game.time.create();
                    timer.add(_data["autoCloseTimer"], this.close, this);
                    timer.start();
                }
                var windowIcon = this.game.add.image(0, 0, "atlas_ui", "icon_speech");
                windowIcon.alpha = 0.1;
                windowIcon.x = 4;
                windowIcon.y = (titleText.y + (titleText.height * 0.5)) - (windowIcon.height * 0.5) + 1;
                this.windowContainer.add(windowIcon);
            }
            var gfx = this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            gfx.drawRect(0, 0, Window.WINDOW_WIDTH, this.content.height + (Window.WINDOW_PADDING * 2) + (titleText.height));
            this.bg = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.windowContainer.addAt(this.bg, 0);
            this.content.x = Window.WINDOW_PADDING;
            this.content.y = Window.WINDOW_PADDING + titleText.height;
            this.windowContainer.x = (this.game.width * 0.5) - (this.windowContainer.width * 0.5);
            this.windowContainer.y = (this.game.height * 0.5) - (this.windowContainer.height * 0.5);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, this.game.width, this.game.height);
            this.overlay = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.addAt(this.overlay, 0);
            var tween = this.game.add.tween(this.windowContainer).from({ y: this.windowContainer.y + 50 }, 350, Phaser.Easing.Exponential.Out, true);
        };
        Window.prototype.onEscKeyPressed = function () {
            if (!this.bDestroyed) {
                console.log(TacticalWeaponPack.GameUtil.game.keyMenu);
                if (!TacticalWeaponPack.GameUtil.game.keyMenu) {
                    this.close();
                }
            }
        };
        Window.prototype.show = function () {
            _super.prototype.show.call(this);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_window_open");
        };
        Window.prototype.close = function () {
            _super.prototype.close.call(this);
            var tween = this.game.add.tween(this.windowContainer).to({ y: this.windowContainer.y + 30 }, 100, Phaser.Easing.Exponential.Out, true);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_window_close");
        };
        Window.prototype.closeAndCallback = function (_callback, _callbackContext, _callbackParams) {
            this.onCloseCallback = _callback;
            this.onCloseCallbackContext = _callbackContext;
            this.onCloseCallbackParameters = _callbackParams;
            this.close();
        };
        Window.prototype.onControlButtonClicked = function (_id) {
            TacticalWeaponPack.GameUtil.game.openSetKeyMenu(_id, this.updateControls, this);
        };
        Window.prototype.updateControls = function () {
            var controlsContainer = this.content.getByName("controlsContainer");
            if (controlsContainer) {
                for (var i = 0; i < controlsContainer.length; i++) {
                    var but = controlsContainer.getAt(i);
                    if (but) {
                        but.refreshKey();
                    }
                }
            }
        };
        Window.prototype.onQuickModeButtonOver = function (_arg1, _arg2, _modeData) {
            var modeNameText = this.content.getByName("modeNameText");
            modeNameText.setText(_modeData["name"], true);
            var modeDescText = this.content.getByName("modeDescText");
            modeDescText.setText(_modeData["desc"], true);
        };
        Window.prototype.onQuickModeButtonOut = function (_arg1, _arg2, _modeData) {
            var modeNameText = this.content.getByName("modeNameText");
            modeNameText.setText("", true);
            var modeDescText = this.content.getByName("modeDescText");
            modeDescText.setText("", true);
        };
        Window.prototype.onClassButtonOver = function (_arg1, _arg2, _classPreview, _index) {
            _classPreview.setFromData(TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"][_index]);
        };
        Window.prototype.onClassButtonOut = function (_arg1, _arg2, _classPreview) {
            _classPreview.setFromData(null);
        };
        Window.prototype.setSelectorItems = function (_items, _index) {
            if (_index === void 0) { _index = 0; }
            this.props["items"] = _items;
            this.props["index"] = _index;
            var container = this.game.add.group();
            this.props["container"] = container;
            this.updateSelectorItem(_index);
            container.x = (Window.MAX_CONTENT_WIDTH * 0.5) - (container.width * 0.5);
            container.y = this.content.height + (this.content.height > 0 ? Window.WINDOW_PADDING : 0);
            this.content.add(container);
        };
        Window.prototype.updateSelectorItem = function (_index) {
            var id = this.data["id"];
            var container = this.props["container"];
            container.removeAll(true);
            this.props["index"] = _index;
            var padding = 12;
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, Window.MAX_CONTENT_WIDTH, 32);
            container.add(gfx);
            if (id == "gameMode") {
                var gameMode = TacticalWeaponPack.GameModeDatabase.GetGameMode(this.props["items"][this.props["index"]]["value"]);
                var nameText = this.game.add.text(0, 0, gameMode["name"], { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                nameText.x = (container.width * 0.5) - (nameText.width * 0.5);
                container.add(nameText);
                var icon = this.game.add.image(0, nameText.y + nameText.height + padding, "atlas_ui", gameMode["id"]);
                icon.x = (container.width * 0.5) - (icon.width * 0.5);
                container.add(icon);
                var descText = this.game.add.text(0, icon.y + icon.height + padding, gameMode["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                descText.x = (container.width * 0.5) - (descText.width * 0.5);
                container.add(descText);
            }
            var index = this.props["index"];
            var itemsLength = this.props["items"].length;
            this.props["pageText"].setText((index + 1) + " of " + itemsLength, true);
            this.props["nextButton"].setEnabled(index + 1 <= itemsLength - 1);
            this.props["prevButton"].setEnabled(index - 1 >= 0);
            this.onCloseCallbackParameters = [index];
        };
        Window.prototype.onSelectorNext = function () {
            var index = Math.min(this.props["index"] + 1, this.props["items"].length - 1);
            this.updateSelectorItem(index);
        };
        Window.prototype.onSelectorPrev = function () {
            var index = Math.max(this.props["index"] - 1, 0);
            this.updateSelectorItem(index);
        };
        Window.TYPE_MESSAGE = "TYPE_MESSAGE";
        Window.TYPE_YES_NO = "TYPE_YES_NO";
        Window.TYPE_ONLINE_CONNECT = "TYPE_ONLINE_CONNECT";
        Window.TYPE_SELECTOR = "TYPE_SELECTOR";
        Window.TYPE_EDIT_CLASSES = "TYPE_EDIT_CLASSES";
        Window.TYPE_CHALLENGES = "TYPE_CHALLENGES";
        Window.TYPE_QUICK_PLAY = "TYPE_QUICK_PLAY";
        Window.TYPE_DOWNLOAD = "TYPE_DOWNLOAD";
        Window.TYPE_NEW_UNLOCKS = "TYPE_NEW_UNLOCKS";
        Window.TYPE_PROFILE = "TYPE_PROFILE";
        Window.TYPE_CONTROLS = "TYPE_CONTROLS";
        Window.TYPE_WELCOME = "TYPE_WELCOME";
        Window.WINDOW_PADDING = 32;
        Window.WINDOW_WIDTH = 740;
        Window.MAX_CONTENT_WIDTH = Window.WINDOW_WIDTH - (Window.WINDOW_PADDING * 2);
        return Window;
    }(ElementBase));
    TacticalWeaponPack.Window = Window;
    var SplashMenu = /** @class */ (function (_super) {
        __extends(SplashMenu, _super);
        function SplashMenu() {
            var _this = _super.call(this, 5000) || this;
            var splash = _this.game.add.image(0, 0, "splash");
            splash.anchor.set(0.5, 0.5);
            splash.x = splash.width * 0.5;
            splash.y = splash.height * 0.5;
            _this.add(splash);
            var tween = _this.game.add.tween(splash.scale).to({ x: 1.1, y: 1.1 }, 10000, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
            _this.add(new TacticalWeaponPack.FXFilter());
            var container = _this.game.add.group();
            var titleText = _this.game.add.text(0, 0, "Tactical Weapon Pack", { font: "48px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(titleText);
            container.add(titleText);
            var descText = _this.game.add.text(0, 0, "Developed by XWILKINX", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            descText.alpha = 0.5;
            descText.x = (titleText.width * 0.5) - (descText.width * 0.5);
            descText.y = titleText.y + titleText.height + 2;
            container.add(descText);
            _this.add(container);
            container.x = (_this.game.width * 0.5) - (container.width * 0.5);
            container.y = (_this.game.height * 0.5) - (container.height * 0.5);
            var startTextContainer = _this.game.add.group();
            _this.add(startTextContainer);
            var startText = _this.game.add.text(0, 0, "Click to start", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            TacticalWeaponPack.GameUtil.SetTextShadow(startText);
            startText.alpha = 0.2;
            startText.x = (_this.game.width * 0.5) - (startText.width * 0.5);
            startText.y = (_this.game.height * 0.7);
            startTextContainer.add(startText);
            var tween = _this.game.add.tween(startText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
            var copyrightText = _this.game.add.text(0, 0, "\u00A9 2018 XWILKINX", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            copyrightText.alpha = 0.2;
            /*
            copyrightTextButton.setCallback(GameUtil.OpenWilkinHomepage, GameUtil);
            copyrightTextButton.setBaseAlpha(0.2);
            */
            copyrightText.x = (_this.game.width * 0.5) - (copyrightText.width * 0.5);
            copyrightText.y = (_this.game.height - copyrightText.height);
            _this.add(copyrightText);
            var tween = _this.game.add.tween(container).from({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = _this.game.add.tween(startTextContainer).from({ alpha: 0, y: startTextContainer.y + 50 }, 500, Phaser.Easing.Exponential.InOut, true, 2000);
            tween.onComplete.addOnce(_this.addClickEvent, _this);
            if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                _this.closeTweenTime = 1;
                _this.close();
            }
            return _this;
        }
        SplashMenu.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        SplashMenu.prototype.addClickEvent = function () {
            this.onChildInputDown.addOnce(this.onClicked, this);
        };
        SplashMenu.prototype.onClicked = function () {
            this.close();
            TacticalWeaponPack.SoundManager.PlayUISound("ui_button_click");
            TacticalWeaponPack.SoundManager.PlayUISound("ui_game_start");
        };
        return SplashMenu;
    }(ElementBase));
    TacticalWeaponPack.SplashMenu = SplashMenu;
    var MainMenu = /** @class */ (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu(_menuId) {
            var _this = _super.call(this, 1000) || this;
            _this.bg = _this.game.add.group();
            _this.bg.alpha = 0.5;
            _this.bg.x = -40;
            _this.add(_this.bg);
            _this.bgTween = _this.game.add.tween(_this.bg).to({ x: 40 }, 15000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
            _this.bgTween.onRepeat.add(_this.onImageLoop, _this);
            _this.onImageLoop();
            _this.menuSmoke = new TacticalWeaponPack.MenuSmoke();
            _this.menuSmoke.y = _this.game.height * 0.5;
            _this.add(_this.menuSmoke);
            _this.add(new TacticalWeaponPack.FXFilter());
            _this.container = _this.game.add.group();
            _this.add(_this.container);
            _this.bottomContainer = _this.game.add.group();
            _this.bottomContainer.x = _this.container.x;
            _this.bottomContainer.y = (_this.game.height - 50);
            _this.add(_this.bottomContainer);
            if (_menuId) {
                _this.loadMenu(_menuId);
            }
            else {
                _this.loadMenu(MainMenu.MENU_MAIN);
                if (TacticalWeaponPack.APIUtil.CurrentAPI == TacticalWeaponPack.APIUtil.API_NEWGROUNDS) {
                    TacticalWeaponPack.APIUtil.ValidateSession(true);
                    if (TacticalWeaponPack.APIUtil.IsLoggedIn()) {
                        TacticalWeaponPack.APIUtil.OnLoggedIn();
                    }
                }
            }
            return _this;
        }
        MainMenu.prototype.destroy = function () {
            if (this.bgTween) {
                this.bgTween.stop();
                this.bgTween = null;
            }
            this.bottomContainer = null;
            this.currentMenuId = null;
            this.container = null;
            _super.prototype.destroy.call(this);
        };
        MainMenu.prototype.onImageLoop = function () {
            if (this.bg) {
                var bHasChildren = this.bg.length > 0;
                if (bHasChildren) {
                    if (this.bg.length > 1) {
                        this.bg.getAt(0).destroy();
                    }
                    var child = this.bg.getAt(0);
                    var deleteTween = this.game.add.tween(child).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                }
                var image = this.game.add.image(0, 0, TacticalWeaponPack.GameUtil.GetRandomMenuImageId());
                this.bg.add(image);
                var newTween = this.game.add.tween(image).from({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }
        };
        MainMenu.prototype.showRank = function (_bVal) {
            if (_bVal) {
                this.rankInfo = new RankInfo();
                this.rankInfo.x = this.game.width - this.rankInfo.width;
                this.rankInfo.y = 4;
                this.rankInfo.setRank(TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"], TacticalWeaponPack.PlayerUtil.GetRankedData()["prestige"]);
                this.bottomContainer.add(this.rankInfo);
                this.rankInfo.visible = true;
            }
            else {
                if (this.rankInfo) {
                    this.rankInfo.destroy();
                }
                this.rankInfo = null;
            }
        };
        MainMenu.prototype.loadMenu = function (_id, _data) {
            if (_data === void 0) { _data = null; }
            this.container.removeAll(true);
            this.container.position.set(0, 0);
            this.bottomContainer.removeAll(true);
            var gfx = this.game.add.graphics();
            gfx.beginFill(0x000000, 1);
            gfx.drawRect(0, 0, this.game.width, 50);
            this.bottomContainer.add(gfx);
            this.currentMenuId = _id;
            var buttonPadding = 4;
            if (_id == MainMenu.MENU_MAIN) {
                this.showRank(null);
                var xwilkinxButton = new TacticalWeaponPack.TextButton("XWILKINX", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                xwilkinxButton.setCallback(TacticalWeaponPack.GameUtil.OpenWilkinHomepage, TacticalWeaponPack.GameUtil);
                xwilkinxButton.x = 10;
                xwilkinxButton.y = 10;
                this.container.add(xwilkinxButton);
                var adversityButton = new TacticalWeaponPack.TextButton("Adversity Weapon Pack", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                adversityButton.setCallback(TacticalWeaponPack.GameUtil.OpenAWPDownload, TacticalWeaponPack.GameUtil);
                adversityButton.x = 10;
                adversityButton.y = xwilkinxButton.y + xwilkinxButton.height;
                this.container.add(adversityButton);
                var moreGamesButton = new TacticalWeaponPack.TextButton("Play More Games", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                moreGamesButton.setCallback(TacticalWeaponPack.GameUtil.OpenAGHomepage, TacticalWeaponPack.GameUtil);
                moreGamesButton.x = 10;
                moreGamesButton.y = adversityButton.y + adversityButton.height;
                this.container.add(moreGamesButton);
                var likeUsButton = new TacticalWeaponPack.TextButton("Like Us!", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                likeUsButton.setCallback(TacticalWeaponPack.GameUtil.OpenAGFacebook, TacticalWeaponPack.GameUtil);
                likeUsButton.x = 10;
                likeUsButton.y = moreGamesButton.y + moreGamesButton.height;
                this.container.add(likeUsButton);
                var volumeToggler = new TacticalWeaponPack.VolumeToggler();
                volumeToggler.x = this.game.width - volumeToggler.width - 10;
                volumeToggler.y = 10;
                this.container.add(volumeToggler);
                var agButton = new TacticalWeaponPack.ImageButton("sponsor_ag_button");
                agButton.setCallback(TacticalWeaponPack.GameUtil.OpenAGHomepage, TacticalWeaponPack.GameUtil);
                agButton.x = (this.game.width * 0.5) - (agButton.width * 0.5);
                agButton.y = 10;
                this.container.add(agButton);
                var tacticalContainer = this.game.add.group();
                var tacticalText = this.game.add.text(0, 0, "Tactical Weapon Pack", { font: "42px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                TacticalWeaponPack.GameUtil.SetTextShadow(tacticalText);
                tacticalContainer.add(tacticalText);
                var sloganText = this.game.add.text(0, 0, TacticalWeaponPack.GameUtil.GetVersionNumber(), { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                sloganText.alpha = 0.2;
                sloganText.x = (tacticalText.width * 0.5) - (sloganText.width * 0.5);
                sloganText.y = tacticalText.y + tacticalText.height - 2;
                tacticalContainer.add(sloganText);
                if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                    /*
                    var debugText = this.game.add.text(0, 0, "DEBUGGING", { font: "18px " + FontUtil.FONT, fill: ColourUtil.COLOUR_XP_STRING });
                    debugText.x = (tacticalText.width * 0.5) - (debugText.width * 0.5);
                    debugText.y = sloganText.y + sloganText.height;
                    tacticalContainer.add(debugText);
                    */
                }
                this.container.add(tacticalContainer);
                var buttonsContainer = this.game.add.group();
                var rankedButton = new TacticalWeaponPack.SplashButton();
                rankedButton.setCallback(this.onSoloClicked, this);
                rankedButton.setLabelText("Play");
                rankedButton.setIcon(this.game.add.image(0, 0, "atlas_weapons", TacticalWeaponPack.WeaponDatabase.WEAPON_M16A4));
                buttonsContainer.add(rankedButton);
                if (TacticalWeaponPack.PlayerUtil.IsPendingNewItems()) {
                    rankedButton.setNewIconVisible(true);
                }
                var profileButton = new TacticalWeaponPack.SplashButton();
                profileButton.setCallback(this.onProfileClicked, this);
                profileButton.setLabelText("Profile");
                profileButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_profile"));
                profileButton.x = buttonsContainer.width + buttonPadding;
                if (TacticalWeaponPack.APIUtil.CurrentAPI && !TacticalWeaponPack.APIUtil.IsLoggedIn()) {
                    profileButton.setWarningIconVisible(true);
                }
                buttonsContainer.add(profileButton);
                var downloadButton = new TacticalWeaponPack.SplashButton();
                downloadButton.setCallback(this.onDownloadClicked, this);
                downloadButton.setLabelText("Download");
                downloadButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_download"));
                downloadButton.x = buttonsContainer.width + buttonPadding;
                buttonsContainer.add(downloadButton);
                tacticalContainer.x = (this.game.width * 0.5) - (tacticalContainer.width * 0.5);
                tacticalContainer.y = 110;
                buttonsContainer.y = tacticalContainer.y + tacticalContainer.height + 60;
                buttonsContainer.x = (this.game.width * 0.5) - (buttonsContainer.width * 0.5);
                this.container.add(buttonsContainer);
                var descText = this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                descText.alpha = 0.8;
                descText.setTextBounds(0, 0, this.container.width, 20);
                descText.y = this.container.height + 60;
                this.container.add(descText);
                //this.container.x = (this.game.width * 0.5) - (this.container.width * 0.5);
                //this.container.y = (this.game.height * 0.5) - (this.container.height * 0.5) - 40;
                rankedButton.events.onInputOver.add(this.onOverSetText, this, 0, descText, "Earn XP by playing ranked games or visit the firing range.");
                rankedButton.events.onInputOut.add(this.onOutClearText, this, 0, descText);
                profileButton.events.onInputOver.add(this.onOverSetText, this, 0, descText, "Manage your profile and settings.");
                profileButton.events.onInputOut.add(this.onOutClearText, this, 0, descText);
                downloadButton.events.onInputOver.add(this.onOverSetText, this, 0, descText, "Download the Tactical Weapon Pack assets.");
                downloadButton.events.onInputOut.add(this.onOutClearText, this, 0, descText);
                var buttons = TacticalWeaponPack.GameUtil.CreateSocialButtons();
                buttons.x = (this.bottomContainer.width * 0.5) - (buttons.width * 0.5);
                buttons.y = (this.bottomContainer.height * 0.5) - (buttons.height * 0.5);
                this.bottomContainer.add(buttons);
                var twp2container = this.game.add.group();
                var twp2bg = this.game.add.graphics();
                twp2bg.beginFill(0x000000, 0.5);
                twp2bg.drawRect(0, 0, 400, 74);
                twp2container.add(twp2bg);
                var twp2text = this.game.add.text(0, 0, "Tactical Weapon Pack 2 is now available", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_GREEN_STRING });
                twp2text.x = (twp2container.width * 0.5) - (twp2text.width * 0.5);
                twp2text.y = 4;
                twp2container.add(twp2text);
                var twp2button = new TacticalWeaponPack.MenuButton(undefined, "center", TacticalWeaponPack.ColourUtil.COLOUR_GREEN, 40);
                twp2button.setLabelText("Play Now!");
                twp2button.setCallback(TacticalWeaponPack.GameUtil.OpenTWP2, TacticalWeaponPack.GameUtil);
                twp2button.x = (twp2container.width * 0.5) - (twp2button.width * 0.5);
                twp2button.y = twp2text.y + twp2text.height;
                twp2container.add(twp2button);
                twp2container.x = (this.game.width * 0.5) - (twp2container.width * 0.5);
                twp2container.y = this.bottomContainer.y - twp2container.height - 4;
                this.container.add(twp2container);
                var tween = this.game.add.tween(twp2container).from({ x: 0, alpha: 0 }, 500, Phaser.Easing.Exponential.InOut, true);
            }
            else {
                var prevMenuId = MainMenu.MENU_MAIN;
                var prevMenuData = null;
                if (_id == MainMenu.MENU_PROFILE) {
                    var titleText = this.game.add.text(10, 10, "Profile", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(titleText);
                    var infoText = this.game.add.text(titleText.x, titleText.y + titleText.height, "Manage your profile and settings.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    infoText.alpha = 0.8;
                    this.container.add(infoText);
                    var achievementsText = this.game.add.text(titleText.x, infoText.y + infoText.height + 20, "Achievements", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    //achievementsText.alpha = 0.5;
                    this.container.add(achievementsText);
                    var achDescText = this.game.add.text(titleText.x, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    achDescText.alpha = 0.8;
                    var achievementsContainer = this.game.add.group();
                    var achievements = TacticalWeaponPack.AchievementsDatabase.GetAllAchievements();
                    for (var i = 0; i < achievements.length; i++) {
                        var curData = achievements[i];
                        var achButton = new TacticalWeaponPack.AchievementButton();
                        achButton.setCanClick(false);
                        achButton.x = achievementsContainer.width + (i > 0 ? buttonPadding : 0);
                        achButton.setAchievement(curData);
                        achievementsContainer.add(achButton);
                        achButton.events.onInputOver.add(this.onOverSetText, this, 0, achDescText, (curData["name"] + ": " + curData["desc"]));
                        achButton.events.onInputOut.add(this.onOutClearText, this, 0, achDescText);
                        var bUnlocked = TacticalWeaponPack.PlayerUtil.GetAchievements()[curData["id"]] == true;
                        if (bUnlocked == true) {
                            TacticalWeaponPack.APIUtil.UnlockAchievement(curData["id"]);
                        }
                        else {
                            achButton.setBaseAlpha(0.2);
                        }
                        achButton.setBarValue(TacticalWeaponPack.AchievementsDatabase.GetAchievementProgress(curData["id"]));
                    }
                    achievementsContainer.x = achievementsText.x;
                    achievementsContainer.y = this.container.height + 20;
                    this.container.add(achievementsContainer);
                    achDescText.y = this.container.height + achDescText.height;
                    this.container.add(achDescText);
                    var settingsText = this.game.add.text(titleText.x, this.container.height + 30, "Settings", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    //settingsText.alpha = 0.5;
                    this.container.add(settingsText);
                    var audioText = this.game.add.text(titleText.x, this.container.height + 20, "Audio", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(audioText);
                    var sliderWidth = this.game.width * 0.3;
                    var gameVolume = new TacticalWeaponPack.Modifier("gameVolume", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                        label: "Game Volume",
                        w: sliderWidth,
                        min: 0,
                        max: 10,
                        increment: 1,
                        value: TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] * 10
                    });
                    gameVolume.setUpdateCallback(TacticalWeaponPack.PlayerUtil.SetGameVolume, TacticalWeaponPack.PlayerUtil);
                    gameVolume.x = audioText.x + 10;
                    gameVolume.y = audioText.y + audioText.height;
                    this.container.add(gameVolume);
                    var musicVolume = new TacticalWeaponPack.Modifier("musicVolume", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                        label: "Music Volume",
                        w: sliderWidth,
                        min: 0,
                        max: 10,
                        increment: 1,
                        value: TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] * 10
                    });
                    musicVolume.setUpdateCallback(TacticalWeaponPack.PlayerUtil.SetMusicVolume, TacticalWeaponPack.PlayerUtil);
                    musicVolume.x = audioText.x + 10;
                    musicVolume.y = gameVolume.y + gameVolume.height + 4;
                    this.container.add(musicVolume);
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([audioText, gameVolume, musicVolume]));
                    var moreText = this.game.add.text(musicVolume.x + musicVolume.width + 40, audioText.y, "Actions", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(moreText);
                    var changeControlsButton = new TacticalWeaponPack.MenuButton(undefined, undefined, undefined, musicVolume.height);
                    changeControlsButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                            titleText: "Controls",
                            type: Window.TYPE_CONTROLS,
                            messageText: "View or modify game controls."
                        }]);
                    changeControlsButton.setLabelText("Controls");
                    changeControlsButton.x = moreText.x;
                    changeControlsButton.y = gameVolume.y;
                    this.container.add(changeControlsButton);
                    var deleteButton = new TacticalWeaponPack.MenuButton(undefined, undefined, TacticalWeaponPack.ColourUtil.COLOUR_RED_QUIT, changeControlsButton.height);
                    deleteButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                            titleText: "Delete Profile Data",
                            type: Window.TYPE_YES_NO,
                            messageText: "Are you sure you want to delete your profile data? This cannot be undone.",
                            yesCallback: TacticalWeaponPack.PlayerUtil.ResetData,
                            yesCallbackContext: TacticalWeaponPack.PlayerUtil
                        }]);
                    deleteButton.setLabelText("Delete Profile Data");
                    deleteButton.x = changeControlsButton.x;
                    deleteButton.y = changeControlsButton.y + changeControlsButton.height + 4;
                    this.container.add(deleteButton);
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([moreText, changeControlsButton, deleteButton]));
                    var apiText = this.game.add.text(titleText.x, this.container.height + 30, TacticalWeaponPack.APIUtil.GetCurrentAPIName(), { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    //apiText.alpha = 0.5;
                    this.container.add(apiText);
                    if (TacticalWeaponPack.APIUtil.CurrentAPI) {
                        if (TacticalWeaponPack.APIUtil.IsLoggedIn()) {
                            var nameText = this.game.add.text(titleText.x, this.container.height + 20, TacticalWeaponPack.PlayerUtil.player["name"], { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                            this.container.add(nameText);
                            var checkmarkIcon = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
                            checkmarkIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                            checkmarkIcon.alpha = 0.8;
                            checkmarkIcon.x = titleText.x;
                            checkmarkIcon.y = this.container.height + 4;
                            this.container.add(checkmarkIcon);
                            var connectedText = this.game.add.text(checkmarkIcon.x + checkmarkIcon.width + 4, checkmarkIcon.y, "Connected", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                            connectedText.alpha = 0.5;
                            connectedText.y = (checkmarkIcon.y + (checkmarkIcon.height * 0.5)) - (connectedText.height * 0.5) + 2;
                            this.container.add(connectedText);
                            if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                                var disconnectButton = new TacticalWeaponPack.MenuButton(100, "center", TacticalWeaponPack.ColourUtil.COLOUR_RED);
                                disconnectButton.setCallback(TacticalWeaponPack.APIUtil.Logout, TacticalWeaponPack.APIUtil);
                                disconnectButton.setLabelText("Disconnect");
                                disconnectButton.x = connectedText.x + connectedText.width + 40;
                                disconnectButton.y = nameText.y;
                                this.container.add(disconnectButton);
                            }
                        }
                        else {
                            var alertIcon = this.game.add.image(0, 0, "atlas_ui", "icon_close");
                            alertIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_RED;
                            alertIcon.alpha = 0.8;
                            alertIcon.x = titleText.x;
                            alertIcon.y = this.container.height + 20;
                            this.container.add(alertIcon);
                            var notConnectedText = this.game.add.text(alertIcon.x + alertIcon.width + 2, 0, "Not connected", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                            notConnectedText.alpha = 0.5;
                            notConnectedText.y = (alertIcon.y + (alertIcon.height * 0.5)) - (notConnectedText.height * 0.5) + 3;
                            this.container.add(notConnectedText);
                            if (TacticalWeaponPack.APIUtil.CanManuallyLogIn()) {
                                var connectButton = new TacticalWeaponPack.MenuButton();
                                connectButton.setCallback(TacticalWeaponPack.APIUtil.ValidateSession, TacticalWeaponPack.APIUtil, [true]);
                                connectButton.setLabelText("Connect to " + TacticalWeaponPack.APIUtil.GetCurrentAPIName());
                                connectButton.x = titleText.x;
                                connectButton.y = this.container.height + 20;
                                connectButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_" + TacticalWeaponPack.APIUtil.GetCurrentAPIId()));
                                this.container.add(connectButton);
                            }
                            var warningIcon = this.game.add.image(0, 0, "atlas_ui", "icon_exclamation");
                            warningIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
                            warningIcon.x = apiText.x + apiText.width + 10;
                            warningIcon.y = (apiText.y + (apiText.height * 0.5)) - (warningIcon.height * 0.5) - 3;
                            this.container.add(warningIcon);
                        }
                    }
                    if (TacticalWeaponPack.GameUtil.IsDebugging()) {
                        var unlockButton = new TacticalWeaponPack.MenuButton(100, "center", TacticalWeaponPack.ColourUtil.COLOUR_GREEN);
                        unlockButton.setCallback(TacticalWeaponPack.PlayerUtil.UnlockAll, TacticalWeaponPack.PlayerUtil);
                        unlockButton.setLabelText("Unlock All");
                        unlockButton.x = this.game.width - unlockButton.width - 10;
                        unlockButton.y = 10;
                        this.container.add(unlockButton);
                    }
                }
                else if (_id == MainMenu.MENU_RANKED) {
                    this.showRank(true);
                    var titleText = this.game.add.text(10, 10, "Play", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(titleText);
                    var infoText = this.game.add.text(titleText.x, titleText.y + titleText.height, "Earn XP by playing ranked games or visit the firing range.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    infoText.alpha = 0.8;
                    this.container.add(infoText);
                    var stats = new PlayerStats(TacticalWeaponPack.PlayerUtil.GetRankedData());
                    stats.x = this.game.width - stats.width - 10;
                    stats.y = 10;
                    this.container.add(stats);
                    var challenges = new RecentChallenges();
                    challenges.x = stats.x;
                    challenges.y = stats.y + stats.height + 10;
                    challenges.updateChallenges();
                    this.container.add(challenges);
                    var unlocks = new RecentUnlocks();
                    unlocks.x = challenges.x;
                    unlocks.y = challenges.y + challenges.height + 10;
                    unlocks.setUnlocks(TacticalWeaponPack.PlayerUtil.GetAllUnlocksForRank(TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"]).reverse());
                    this.container.add(unlocks);
                    var playText = this.game.add.text(titleText.x, infoText.y + infoText.height + 20, "Ranked", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(playText);
                    var buttonWidth = 300;
                    var quickPlayButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    quickPlayButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                            type: Window.TYPE_QUICK_PLAY,
                            titleText: "Quick Play",
                            messageText: "Select a game mode to play."
                        }]);
                    quickPlayButton.setLabelText("Quick Play");
                    quickPlayButton.x = playText.x + 10;
                    quickPlayButton.y = playText.y + playText.height + buttonPadding;
                    this.container.add(quickPlayButton);
                    var classesButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    classesButton.setCallback(TacticalWeaponPack.GameUtil.OpenEditClasses, TacticalWeaponPack.GameUtil);
                    classesButton.setLabelText("Edit Classes");
                    if (TacticalWeaponPack.PlayerUtil.IsPendingNewItems()) {
                        var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                        newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                        classesButton.setIcon(newIcon);
                    }
                    classesButton.x = quickPlayButton.x;
                    classesButton.y = quickPlayButton.y + quickPlayButton.height + buttonPadding;
                    this.container.add(classesButton);
                    var leaderboardsButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    leaderboardsButton.setCallback(this.loadMenu, this, [MainMenu.MENU_LEADERBOARDS]);
                    leaderboardsButton.setLabelText("Leaderboards");
                    leaderboardsButton.x = classesButton.x;
                    leaderboardsButton.y = classesButton.y + classesButton.height + buttonPadding;
                    if (!TacticalWeaponPack.APIUtil.HasLeaderboards()) {
                        leaderboardsButton.setEnabled(false);
                        leaderboardsButton.setLabelText("Leaderboards Unavailable");
                    }
                    this.container.add(leaderboardsButton);
                    var practiceText = this.game.add.text(titleText.x, leaderboardsButton.y + leaderboardsButton.height + 20, "Practice", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(practiceText);
                    var firingRangeButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    //firingRangeButton.setCallback(this.loadMenu, this, [MainMenu.MENU_FIRING_RANGE]);
                    firingRangeButton.setCallback(TacticalWeaponPack.GameUtil.game.prepareGame, TacticalWeaponPack.GameUtil.game, [{ gameMode: TacticalWeaponPack.GameModeDatabase.GAME_RANGE }]);
                    firingRangeButton.setLabelText("Firing Range");
                    firingRangeButton.x = quickPlayButton.x;
                    firingRangeButton.y = practiceText.y + practiceText.height + buttonPadding;
                    this.container.add(firingRangeButton);
                    var profileText = this.game.add.text(titleText.x, firingRangeButton.y + firingRangeButton.height + 20, "Advanced", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(profileText);
                    var prestigeButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    if (TacticalWeaponPack.PlayerUtil.GetRankedData()["prestige"] >= TacticalWeaponPack.PlayerUtil.MAX_PRESTIGE) {
                        prestigeButton.setLabelText("Prestige");
                        prestigeButton.setEnabled(false);
                        prestigeButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_checkmark"));
                    }
                    else if (TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"] >= TacticalWeaponPack.PlayerUtil.MAX_RANK) {
                        prestigeButton.setLabelText("Prestige");
                        prestigeButton.setEnabled(true);
                        prestigeButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                                type: Window.TYPE_YES_NO,
                                titleText: "Prestige",
                                messageText: "Prestiging will reset your rank, XP, and unlocks.\n\nAre you sure you want to prestige?",
                                yesCallback: TacticalWeaponPack.PlayerUtil.AddPrestige,
                                yesCallbackContext: TacticalWeaponPack.PlayerUtil,
                                yesCallbackParams: undefined
                            }]);
                    }
                    else {
                        prestigeButton.setLabelText("Prestige (Requires Rank " + TacticalWeaponPack.PlayerUtil.MAX_RANK + ")");
                        prestigeButton.setEnabled(false);
                        prestigeButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_lock"));
                    }
                    prestigeButton.x = classesButton.x;
                    prestigeButton.y = profileText.y + profileText.height + buttonPadding;
                    this.container.add(prestigeButton);
                    var wilkinButton = new TacticalWeaponPack.MenuButton(buttonWidth);
                    wilkinButton.setCallback(TacticalWeaponPack.GameUtil.OpenWilkinHomepage, TacticalWeaponPack.GameUtil);
                    wilkinButton.setLabelText("More XWILKINX");
                    wilkinButton.x = prestigeButton.x;
                    wilkinButton.y = prestigeButton.y + prestigeButton.height + buttonPadding;
                    this.container.add(wilkinButton);
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([playText, quickPlayButton, classesButton, leaderboardsButton]));
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([practiceText, firingRangeButton]));
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([profileText, prestigeButton, wilkinButton]));
                    if (!TacticalWeaponPack.PlayerUtil.player["bTutorial"]) {
                        TacticalWeaponPack.GameUtil.game.createWindow({
                            titleText: "Welcome",
                            type: Window.TYPE_WELCOME,
                            bShowOkayButton: true,
                            messageText: "Welcome to the Tactical Weapon Pack!"
                        });
                        TacticalWeaponPack.PlayerUtil.player["bTutorial"] = true;
                        TacticalWeaponPack.GameUtil.game.savePlayerData();
                    }
                    if (TacticalWeaponPack.PlayerUtil.HasNewUnlocks()) {
                        TacticalWeaponPack.GameUtil.game.createWindow({
                            titleText: "New Unlocks",
                            type: Window.TYPE_NEW_UNLOCKS,
                            messageText: "You've unlocked new items!"
                        });
                        TacticalWeaponPack.PlayerUtil.ClearNewUnlocks();
                    }
                }
                else if (_id == MainMenu.MENU_LEADERBOARDS) {
                    this.showRank(true);
                    prevMenuId = MainMenu.MENU_RANKED;
                    var titleText = this.game.add.text(10, 10, "Ranked", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    titleText.alpha = 0.2;
                    this.container.add(titleText);
                    var descText = this.game.add.text(titleText.x + titleText.width + 8, 10, "Leaderboards", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(descText);
                    var infoText = this.game.add.text(titleText.x, titleText.y + titleText.height, "Submit your score at the end of any ranked game to compete in the leaderboards!", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    infoText.alpha = 0.8;
                    this.container.add(infoText);
                    var leaderboards = new GameLeaderboards();
                    leaderboards.name = "leaderboards";
                    var scoreButtons = this.game.add.group();
                    scoreButtons.name = "scoreButtons";
                    var modes = TacticalWeaponPack.GameModeDatabase.GetAllRankedGameModes();
                    var len = modes.length + 1;
                    var butWidth = ((this.game.width - (buttonPadding * (len + 2))) / len);
                    var totalKillsMode = TacticalWeaponPack.GameModeDatabase.GetGameMode(TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS);
                    var totalKillsButton = new TacticalWeaponPack.MenuButton(butWidth, "center");
                    totalKillsButton.setCallback(this.loadLeaderboardScores, this, [totalKillsMode["id"]]);
                    totalKillsButton.setLabelText(totalKillsMode["name"]);
                    totalKillsButton.name = totalKillsMode["id"];
                    scoreButtons.add(totalKillsButton);
                    for (var i = 0; i < modes.length; i++) {
                        var modeButton = new TacticalWeaponPack.MenuButton(butWidth, "center");
                        modeButton.setCallback(this.loadLeaderboardScores, this, [modes[i]["id"]]);
                        modeButton.setLabelText(modes[i]["name"]);
                        modeButton.name = modes[i]["id"];
                        modeButton.x = scoreButtons.width + buttonPadding;
                        scoreButtons.add(modeButton);
                    }
                    scoreButtons.x = (this.game.width * 0.5) - (scoreButtons.width * 0.5);
                    scoreButtons.y = infoText.y + infoText.height + 10;
                    this.container.add(scoreButtons);
                    leaderboards.x = (this.game.width * 0.5) - (leaderboards.width * 0.5);
                    leaderboards.y = scoreButtons.y + scoreButtons.height + buttonPadding;
                    this.container.add(leaderboards);
                    var bestScore = new BestScoreContainer();
                    bestScore.name = "bestScore";
                    bestScore.x = (leaderboards.x * 0.5) - (bestScore.width * 0.5);
                    bestScore.y = (leaderboards.y + (leaderboards.height * 0.5)) - (bestScore.height * 0.5);
                    this.container.add(bestScore);
                    var worldMap = this.game.add.image(0, 0, "world");
                    worldMap.alpha = 0.1;
                    worldMap.x = (this.game.width * 0.5) - (worldMap.width * 0.5);
                    worldMap.y = leaderboards.y;
                    this.container.addAt(worldMap, 0);
                    this.loadLeaderboardScores(TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS);
                }
                else if (_id == MainMenu.MENU_EDIT_CLASS) {
                    this.showRank(true);
                    prevMenuId = MainMenu.MENU_RANKED;
                    var titleText = this.game.add.text(10, 10, "Ranked", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    titleText.alpha = 0.2;
                    this.container.add(titleText);
                    var descText = this.game.add.text(titleText.x + titleText.width + 8, 10, "Edit Classes", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(descText);
                    var infoText = this.game.add.text(titleText.x, titleText.y + titleText.height, "Modify your custom classes.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    infoText.alpha = 0.8;
                    this.container.add(infoText);
                    var helpButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_help");
                    helpButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                            type: Window.TYPE_MESSAGE,
                            titleText: "Edit Classes",
                            messageText: "Classes are used when playing ranked games.\n\nEach class can be assigned a primary weapon, secondary weapon, and skill.\n\nUnlock new weapons and skills by earning XP in games!"
                        }]);
                    helpButton.x = this.game.width - helpButton.width - 10;
                    helpButton.y = 10;
                    this.container.add(helpButton);
                    var allClasses = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"];
                    var classButtons = this.game.add.group();
                    classButtons.name = "classButtons";
                    var butWidth = (this.game.width - (4 * allClasses.length) - (titleText.x * 2)) / allClasses.length;
                    for (var i = 0; i < allClasses.length; i++) {
                        var cur = allClasses[i];
                        var but = new TacticalWeaponPack.MenuButton(butWidth, "center");
                        but.setCallback(this.loadCustomClass, this, [i]);
                        but.setLabelText(cur["name"]);
                        but.setSelected(false);
                        but.x = classButtons.width + (i > 0 ? 4 : 0);
                        classButtons.add(but);
                    }
                    classButtons.x = titleText.x;
                    classButtons.y = infoText.y + infoText.height + 10;
                    this.container.add(classButtons);
                    this.loadCustomClass(_data);
                }
                else if (_id == MainMenu.MENU_SELECT_ITEM) {
                    console.log(_data);
                    this.showRank(true);
                    prevMenuId = MainMenu.MENU_EDIT_CLASS;
                    prevMenuData = _data["classIndex"];
                    var titleText = this.game.add.text(10, 10, "Ranked", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    titleText.alpha = 0.2;
                    this.container.add(titleText);
                    var titleText = this.game.add.text(titleText.x + titleText.width + 8, titleText.y, "Edit Class", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    titleText.alpha = 0.2;
                    this.container.add(titleText);
                    var descText = this.game.add.text(titleText.x + titleText.width + 8, 10, _data["title"], { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(descText);
                    var itemSelector = new ItemSelector(true);
                    var types;
                    if (_data["category"] == "primary") {
                        types = [
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_SMG,
                                label: "SMGs"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_RIFLE,
                                label: "Assault Rifles"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_SNIPER,
                                label: "Sniper Rifles"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN,
                                label: "Shotguns"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_LMG,
                                label: "LMGs"
                            }
                        ];
                    }
                    else if (_data["category"] == "secondary") {
                        types = [
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_PISTOL,
                                label: "Pistols"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_MACHINE_PISTOL,
                                label: "Machine Pistols"
                            },
                            {
                                id: TacticalWeaponPack.WeaponDatabase.TYPE_LAUNCHER,
                                label: "Launchers"
                            }
                        ];
                    }
                    else {
                        types = [];
                    }
                    itemSelector.setPrevMenuId(_data["prevMenuId"]);
                    itemSelector.setCurrentClassIndex(_data["classIndex"]);
                    itemSelector.setCurrentTypeSlot(_data["category"]);
                    if (_data["currentWeapon"]) {
                        var currentWeapon = TacticalWeaponPack.WeaponDatabase.GetWeapon(_data["currentWeapon"]["id"]);
                        itemSelector.setCurrentItemId(currentWeapon["id"]);
                        itemSelector.setWeaponTypes(types, currentWeapon["type"]);
                    }
                    else if (_data["perkTier"] != undefined) {
                        itemSelector.setCurrentItemId(_data["currentPerk"]);
                        itemSelector.loadSkills();
                        var helpButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_help");
                        helpButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                                type: Window.TYPE_MESSAGE,
                                titleText: "Skills",
                                messageText: "Skills are player perks which are always active.\n\nUnlock new skills by ranking up."
                            }]);
                        helpButton.x = this.game.width - helpButton.width - 10;
                        helpButton.y = 10;
                        this.container.add(helpButton);
                    }
                    else if (_data["mod"] != undefined) {
                        itemSelector.setCurrentTypeSlot(_data["bSecondary"] ? "secondary" : "primary");
                        itemSelector.setCurrentItemId(_data["currentMod"]);
                        itemSelector.loadMods(_data["mod"], _data["weaponData"]["id"]);
                        var weaponInfo = new WeaponInfo();
                        weaponInfo.setWeapon(_data["weaponData"]["id"]);
                        var profileData = TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][_data["weaponData"]["id"]];
                        weaponInfo.setText(profileData["kills"], profileData["headshots"]);
                        weaponInfo.x = this.game.width - weaponInfo.width - 10;
                        weaponInfo.y = this.bottomContainer.y - weaponInfo.height - 10;
                        this.container.add(weaponInfo);
                        itemSelector.setWeaponInfo(weaponInfo);
                    }
                    itemSelector.x = 10;
                    itemSelector.y = titleText.y + titleText.height;
                    this.container.add(itemSelector);
                }
                else if (_id == MainMenu.MENU_FIRING_RANGE) {
                    this.showRank(true);
                    prevMenuId = MainMenu.MENU_RANKED;
                    var titleText = this.game.add.text(10, 10, "Weapons", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    titleText.alpha = 0.2;
                    this.container.add(titleText);
                    var descText = this.game.add.text(titleText.x + titleText.width + 8, 10, "Firing Range", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(descText);
                    var infoText = this.game.add.text(titleText.x, titleText.y + titleText.height, "Practice your aim and test any weapon at the firing range.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    infoText.alpha = 0.8;
                    this.container.add(infoText);
                    var helpButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_help");
                    helpButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                            type: Window.TYPE_MESSAGE,
                            titleText: "Firing Range",
                            messageText: "Use the firing range to practice your shooting.\n\nModify settings such as the target density and speed to provide a greater challenge!"
                        }]);
                    helpButton.x = this.game.width - helpButton.width - 10;
                    helpButton.y = 10;
                    this.container.add(helpButton);
                    var settingsText = this.game.add.text(titleText.x, infoText.y + infoText.height + 20, "Settings", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    this.container.add(settingsText);
                    var sliderWidth = this.game.width * 0.6;
                    var targetDensity = new TacticalWeaponPack.Modifier("time", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                        label: "Target Density",
                        w: sliderWidth,
                        min: 1,
                        max: 10,
                        increment: 1,
                        value: 5
                    });
                    targetDensity.x = settingsText.x + 10;
                    targetDensity.y = settingsText.y + settingsText.height;
                    this.container.add(targetDensity);
                    var targetSpeed = new TacticalWeaponPack.Modifier("speed", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                        label: "Target Speed",
                        w: sliderWidth,
                        min: 1,
                        max: 10,
                        increment: 1,
                        value: 5
                    });
                    targetSpeed.x = settingsText.x + 10;
                    targetSpeed.y = targetDensity.y + targetDensity.height + buttonPadding;
                    this.container.add(targetSpeed);
                    var targetDistance = new TacticalWeaponPack.Modifier("speed", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                        label: "Target Distance",
                        w: sliderWidth,
                        min: 1,
                        max: 10,
                        increment: 1,
                        value: 5
                    });
                    targetDistance.x = settingsText.x + 10;
                    targetDistance.y = targetSpeed.y + targetSpeed.height + buttonPadding;
                    this.container.add(targetDistance);
                    this.container.add(TacticalWeaponPack.GameUtil.CreateTree([settingsText, targetDensity, targetSpeed, targetDistance]));
                    var startButton = new TacticalWeaponPack.FiringRangeButton();
                    startButton.setCallback(this.startCustomGame, this, [{
                            gameMode: TacticalWeaponPack.GameModeDatabase.GAME_RANGE,
                            targetDensity: targetDensity.getValue(),
                            targetSpeed: targetSpeed.getValue(),
                            targetDistance: targetDistance.getValue(),
                        }]);
                    startButton.x = titleText.x; //(this.game.width * 0.5) - (startButton.width * 0.5);
                    startButton.y = this.container.height + 20;
                    this.container.add(startButton);
                }
                var backButton = new TacticalWeaponPack.TextButton("< Back", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                backButton.x = 10;
                backButton.y = (this.bottomContainer.height * 0.5) - (backButton.height * 0.5);
                backButton.setCallback(this.loadMenu, this, [prevMenuId, prevMenuData]);
                this.bottomContainer.add(backButton);
            }
            var tween = this.game.add.tween(this.container).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
        };
        MainMenu.prototype.loadCustomClass = function (_data) {
            var classIndex = _data;
            var buttonPadding = 4;
            var temp = this.container.getByName("classContainer");
            if (temp) {
                temp.destroy();
            }
            var classData = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"][classIndex];
            if (classData) {
                var classButtons = this.container.getByName("classButtons");
                for (var i = 0; i < classButtons.length; i++) {
                    var but = classButtons.getAt(i);
                    if (but) {
                        var bSelected = i == classIndex;
                        but.setSelected(bSelected);
                        but.setIcon(bSelected ? this.game.add.image(0, 0, "atlas_ui", "icon_checkmark") : null);
                    }
                }
                var classContainer = this.game.add.group();
                classContainer.name = "classContainer";
                var classNameText = this.game.add.text(0, 0, classData["name"], { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                classContainer.add(classNameText);
                var primaryContainer = this.game.add.group();
                primaryContainer.y = classContainer.height + buttonPadding;
                classContainer.add(primaryContainer);
                var primaryButton = new TacticalWeaponPack.ClassItemButton();
                primaryButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: "Primary",
                        category: "primary",
                        currentWeapon: classData["primary"]
                    }
                ]);
                primaryButton.setLabelText("Primary");
                primaryButton.setWeapon(classData["primary"]);
                if (TacticalWeaponPack.PlayerUtil.HasPendingItemsForWeaponCategories(TacticalWeaponPack.WeaponDatabase.GetPrimaryWeaponTypes())) {
                    primaryButton.showNewIcon();
                }
                primaryContainer.add(primaryButton);
                var magButton = new TacticalWeaponPack.ModItemButton();
                magButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["primary"]["id"])["name"] + " Ammo",
                        category: "mod",
                        mod: TacticalWeaponPack.WeaponDatabase.MOD_MAG,
                        currentMod: classData["primary"][TacticalWeaponPack.WeaponDatabase.MOD_MAG],
                        weaponData: classData["primary"]
                    }
                ]);
                magButton.setLabelText("Ammo");
                magButton.setMod(TacticalWeaponPack.WeaponDatabase.MOD_MAG, classData["primary"]["mag"]);
                magButton.x = primaryButton.x + primaryButton.width + buttonPadding;
                if (TacticalWeaponPack.PlayerUtil.HasPendingMod(TacticalWeaponPack.WeaponDatabase.MOD_MAG, classData["primary"]["id"])) {
                    magButton.showNewIcon();
                }
                primaryContainer.add(magButton);
                var opticButton = new TacticalWeaponPack.ModItemButton();
                opticButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["primary"]["id"])["name"] + " Optic",
                        category: "mod",
                        mod: TacticalWeaponPack.WeaponDatabase.MOD_OPTIC,
                        currentMod: classData["primary"][TacticalWeaponPack.WeaponDatabase.MOD_OPTIC],
                        weaponData: classData["primary"]
                    }
                ]);
                opticButton.setLabelText("Optic");
                opticButton.setMod(TacticalWeaponPack.WeaponDatabase.MOD_OPTIC, classData["primary"]["optic"]);
                opticButton.x = magButton.x + magButton.width + buttonPadding;
                if (TacticalWeaponPack.PlayerUtil.HasPendingMod(TacticalWeaponPack.WeaponDatabase.MOD_OPTIC, classData["primary"]["id"])) {
                    opticButton.showNewIcon();
                }
                primaryContainer.add(opticButton);
                var barrelButton = new TacticalWeaponPack.ModItemButton();
                barrelButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["primary"]["id"])["name"] + " Barrel",
                        category: "mod",
                        mod: TacticalWeaponPack.WeaponDatabase.MOD_BARREL,
                        currentMod: classData["primary"][TacticalWeaponPack.WeaponDatabase.MOD_BARREL],
                        weaponData: classData["primary"]
                    }
                ]);
                barrelButton.setLabelText("Barrel");
                barrelButton.setMod(TacticalWeaponPack.WeaponDatabase.MOD_BARREL, classData["primary"]["barrel"]);
                barrelButton.x = opticButton.x + opticButton.width + buttonPadding;
                if (TacticalWeaponPack.PlayerUtil.HasPendingMod(TacticalWeaponPack.WeaponDatabase.MOD_BARREL, classData["primary"]["id"])) {
                    barrelButton.showNewIcon();
                }
                primaryContainer.add(barrelButton);
                var secondaryContainer = this.game.add.group();
                secondaryContainer.y = classContainer.height + buttonPadding;
                classContainer.add(secondaryContainer);
                var secondaryWeaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["secondary"]["id"]);
                var secondaryButton = new TacticalWeaponPack.ClassItemButton();
                secondaryButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: "Secondary",
                        category: "secondary",
                        currentWeapon: classData["secondary"]
                    }
                ]);
                secondaryButton.setLabelText("Secondary");
                secondaryButton.setWeapon(classData["secondary"]);
                if (TacticalWeaponPack.PlayerUtil.HasPendingItemsForWeaponCategories(TacticalWeaponPack.WeaponDatabase.GetSecondaryWeaponTypes())) {
                    secondaryButton.showNewIcon();
                }
                secondaryContainer.add(secondaryButton);
                var mag2Button = new TacticalWeaponPack.ModItemButton();
                mag2Button.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["secondary"]["id"])["name"] + " Ammo",
                        category: "mod",
                        mod: TacticalWeaponPack.WeaponDatabase.MOD_MAG,
                        currentMod: classData["secondary"][TacticalWeaponPack.WeaponDatabase.MOD_MAG],
                        weaponData: classData["secondary"],
                        bSecondary: true
                    }
                ]);
                mag2Button.setLabelText("Ammo");
                mag2Button.setMod(TacticalWeaponPack.WeaponDatabase.MOD_MAG, classData["secondary"]["mag"]);
                mag2Button.x = secondaryButton.x + secondaryButton.width + buttonPadding;
                if (TacticalWeaponPack.PlayerUtil.HasPendingMod(TacticalWeaponPack.WeaponDatabase.MOD_MAG, classData["secondary"]["id"])) {
                    mag2Button.showNewIcon();
                }
                if (secondaryWeaponData["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_LAUNCHER) {
                    mag2Button.setEnabled(false);
                }
                secondaryContainer.add(mag2Button);
                var skillButton = new TacticalWeaponPack.ClassItemButton();
                skillButton.setCallback(this.loadMenu, this, [
                    MainMenu.MENU_SELECT_ITEM,
                    {
                        prevMenuId: _data["prevMenuId"],
                        classIndex: classIndex,
                        title: "Skill",
                        category: "perk_1",
                        currentPerk: classData["perk_1"]["id"],
                        perkTier: 1
                    }
                ]);
                skillButton.setLabelText("Skill");
                skillButton.setSkill(classData["perk_1"]);
                skillButton.y = classContainer.height + buttonPadding;
                if (TacticalWeaponPack.PlayerUtil.HasPendingSkill()) {
                    skillButton.showNewIcon();
                }
                classContainer.add(skillButton);
                classContainer.x = classButtons.x;
                classContainer.y = classButtons.y + classButtons.height + 10;
                this.container.add(classContainer);
                var tree = TacticalWeaponPack.GameUtil.CreateTree([classNameText, primaryContainer, secondaryContainer, skillButton]);
                classContainer.add(tree);
            }
        };
        MainMenu.prototype.loadLeaderboardScores = function (_id) {
            var leaderboards = this.container.getByName("leaderboards");
            if (leaderboards) {
                var scoreButtons = this.container.getByName("scoreButtons");
                if (scoreButtons) {
                    for (var i = 0; i < scoreButtons.length; i++) {
                        var button = scoreButtons.getAt(i);
                        if (button) {
                            var bSelected = button.name == _id;
                            button.setSelected(bSelected);
                            var icon = bSelected ? this.game.add.image(0, 0, "atlas_ui", "icon_checkmark") : null;
                            button.setIcon(icon);
                        }
                    }
                }
                leaderboards.loadScores(_id);
            }
            var bestScore = this.container.getByName("bestScore");
            if (bestScore) {
                if (_id == TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS) {
                    bestScore.setLabelText("RANKED KILLS");
                }
                else {
                    bestScore.setLabelText("PERSONAL BEST");
                }
                bestScore.setBestScore(TacticalWeaponPack.PlayerUtil.GetRankedData()["bestScores"][_id]);
            }
        };
        MainMenu.prototype.updateGamePreview = function (_gamePreview) {
            console.log(_gamePreview);
        };
        MainMenu.prototype.startCustomGame = function (_data) {
            TacticalWeaponPack.GameUtil.game.prepareGame(_data);
        };
        MainMenu.prototype.onSettingsButtonClicked = function (_button) {
            var id = _button.getButtonData()["id"];
            _button.toggleSelected();
            TacticalWeaponPack.PlayerUtil.GetSettingsData()[id] = _button.isSelected();
        };
        MainMenu.prototype.onOverSetText = function (_arg1, _arg2, _text, _val) {
            TacticalWeaponPack.GameUtil.OnOverSetText(_arg1, _arg2, _text, _val);
        };
        MainMenu.prototype.onOutClearText = function (_arg1, _arg2, _text) {
            TacticalWeaponPack.GameUtil.OnOutClearText(_arg1, _arg2, _text);
        };
        MainMenu.prototype.onSoloClicked = function () {
            this.loadMenu(MainMenu.MENU_RANKED);
        };
        MainMenu.prototype.onDownloadClicked = function () {
            TacticalWeaponPack.GameUtil.game.createWindow({
                type: Window.TYPE_DOWNLOAD,
                titleText: "Download",
                messageText: "Are you a developer, animator, or artist?\n\nAll assets in this pack are free to use in your own projects!",
                icon: this.game.add.image(0, 0, "atlas_ui", "icon_download")
            });
        };
        MainMenu.prototype.onProfileClicked = function () {
            this.loadMenu(MainMenu.MENU_PROFILE);
        };
        MainMenu.prototype.getCurrentMenuId = function () {
            return this.currentMenuId;
        };
        MainMenu.MENU_MAIN = "MENU_MAIN";
        MainMenu.MENU_RANKED = "MENU_RANKED";
        MainMenu.MENU_LEADERBOARDS = "MENU_LEADERBOARDS";
        MainMenu.MENU_PROFILE = "MENU_SETTINGS";
        MainMenu.MENU_EDIT_CLASS = "MENU_EDIT_CLASS";
        MainMenu.MENU_SELECT_ITEM = "MENU_SELECT_ITEM";
        MainMenu.MENU_FIRING_RANGE = "MENU_FIRING_RANGE";
        return MainMenu;
    }(ElementBase));
    TacticalWeaponPack.MainMenu = MainMenu;
    var PreGameMenu = /** @class */ (function (_super) {
        __extends(PreGameMenu, _super);
        function PreGameMenu(_data) {
            var _this = _super.call(this) || this;
            _this.data = _data;
            var splash = _this.game.add.image(0, 0, "splash");
            splash.alpha = 0.5;
            _this.add(splash);
            _this.add(new TacticalWeaponPack.FXFilter());
            _this.container = _this.game.add.group();
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, _this.game.width * 0.8, _this.game.height * 0.6);
            _this.container.add(gfx);
            var gameMode = TacticalWeaponPack.GameModeDatabase.GetGameMode(_data["gameMode"]);
            if (gameMode["id"] == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                TacticalWeaponPack.PlayerUtil.UnlockAchievement(TacticalWeaponPack.AchievementsDatabase.ACH_RANGE);
            }
            var gameIcon = _this.game.add.image(0, 0, "atlas_ui", gameMode["id"]);
            //gameIcon.scale.set(0.5, 0.5);
            gameIcon.x = (_this.container.width * 0.5) - (gameIcon.width * 0.5);
            gameIcon.y = 20;
            _this.container.add(gameIcon);
            var titleText = _this.game.add.text(0, 0, gameMode["name"], { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(titleText);
            titleText.x = (_this.container.width * 0.5) - (titleText.width * 0.5);
            titleText.y = gameIcon.y + gameIcon.height + 10;
            _this.container.add(titleText);
            var descText = _this.game.add.text(0, 0, gameMode["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            descText.alpha = 0.8;
            descText.x = (_this.container.width * 0.5) - (descText.width * 0.5);
            descText.y = titleText.y + titleText.height;
            _this.container.add(descText);
            _this.spinner = TacticalWeaponPack.GameUtil.CreateSpinner();
            _this.spinner.x = (_this.container.width * 0.5);
            _this.spinner.y = (_this.container.height) - (_this.spinner.height * 0.5) - 10;
            _this.container.add(_this.spinner);
            _this.tipText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.tipText.alpha = 0.5;
            _this.tipText.setTextBounds(0, 0, _this.container.width, 20);
            _this.tipText.y = _this.spinner.y - _this.tipText.height - 30;
            _this.container.add(_this.tipText);
            _this.add(_this.container);
            _this.container.x = (_this.game.width * 0.5) - (_this.container.width * 0.5);
            _this.container.y = (_this.game.height * 0.5) - (_this.container.height * 0.5);
            var timer = _this.game.time.create();
            timer.add(TacticalWeaponPack.GameUtil.IsDebugging() ? 100 : (TacticalWeaponPack.GameUtil.AdsEnabled() ? 3000 : 1000), _this.onGameReady, _this);
            timer.start();
            _this.setRandomTip();
            var keys = _this.createKeyInfo();
            keys.x = 10;
            keys.y = 10;
            _this.container.add(keys);
            return _this;
            //AdUtil.ShowAd();
        }
        PreGameMenu.prototype.destroy = function () {
            this.data = null;
            this.spinner = null;
            this.container = null;
            this.tipText = null;
            _super.prototype.destroy.call(this);
        };
        PreGameMenu.prototype.setRandomTip = function () {
            this.tipText.setText(TacticalWeaponPack.GameUtil.GetRandomTip(), true);
            var timer = this.game.time.create();
            timer.add(5000, this.setRandomTip, this);
            timer.start();
        };
        PreGameMenu.prototype.createKeyInfo = function () {
            var padding = 4;
            var group = this.game.add.group();
            var pauseKey = new TacticalWeaponPack.KeyDetail(Phaser.Keyboard.ESC, "Pause menu");
            group.add(pauseKey);
            var reloadKey = new TacticalWeaponPack.KeyDetail(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_RELOAD], "Reload");
            reloadKey.y = group.height + padding;
            group.add(reloadKey);
            if (this.data["gameMode"] == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                var switchKey = new TacticalWeaponPack.KeyDetail(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_ACTION], "Create target");
                switchKey.y = group.height + padding;
                group.add(switchKey);
            }
            else {
                var switchKey = new TacticalWeaponPack.KeyDetail(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_SWITCH_WEAPON], "Switch weapon");
                switchKey.y = group.height + padding;
                group.add(switchKey);
                var barrelKey = new TacticalWeaponPack.KeyDetail(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_BARREL], "Use barrel attachment");
                barrelKey.y = group.height + padding;
                group.add(barrelKey);
            }
            return group;
        };
        PreGameMenu.prototype.onGameReady = function () {
            var startText = this.game.add.text(0, 0, "Click to start", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            TacticalWeaponPack.GameUtil.SetTextShadow(startText);
            startText.alpha = 0.2;
            startText.x = (this.container.width * 0.5) - (startText.width * 0.5);
            startText.y = this.container.height - startText.height - 10;
            this.container.add(startText);
            var tween = this.game.add.tween(startText).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
            this.spinner.destroy();
            this.spinner = null;
            this.onChildInputDown.addOnce(this.onClicked, this);
        };
        PreGameMenu.prototype.onClicked = function () {
            TacticalWeaponPack.SoundManager.PlayUISound("ui_button_click");
            this.setOnCloseCallback(TacticalWeaponPack.GameUtil.game.startGameState, TacticalWeaponPack.GameUtil.game, [this.data]);
            this.close();
        };
        return PreGameMenu;
    }(ElementBase));
    TacticalWeaponPack.PreGameMenu = PreGameMenu;
    var ClassPreview = /** @class */ (function (_super) {
        __extends(ClassPreview, _super);
        function ClassPreview() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var padding = 4;
            _this.primary = new ClassPreviewItem();
            _this.add(_this.primary);
            var gfx = _this.game.add.graphics();
            gfx.lineStyle(1, 0xFFFFFF, 0.2);
            gfx.lineTo(_this.width, 0);
            gfx.y = _this.height + (padding * 0.5);
            _this.add(gfx);
            _this.secondary = new ClassPreviewItem();
            _this.secondary.y = _this.height + padding;
            _this.add(_this.secondary);
            var gfx = _this.game.add.graphics();
            gfx.lineStyle(1, 0xFFFFFF, 0.2);
            gfx.lineTo(_this.width, 0);
            gfx.y = _this.height + (padding * 0.5);
            _this.add(gfx);
            _this.perk1 = new ClassPreviewItem();
            _this.perk1.y = _this.height + padding;
            _this.add(_this.perk1);
            _this.clearItems();
            return _this;
        }
        ClassPreview.prototype.setFromData = function (_class) {
            if (!_class) {
                this.clearItems();
            }
            else {
                this.primary.setFromData({ weapon: _class["primary"] });
                this.secondary.setFromData({ weapon: _class["secondary"] });
                this.perk1.setFromData({ perk: _class["perk_1"] });
            }
        };
        ClassPreview.prototype.clearItems = function () {
            this.primary.setFromData({ desc: "< Primary >" });
            this.secondary.setFromData({ desc: "< Secondary >" });
            this.perk1.setFromData({ desc: "< Skill >" });
        };
        ClassPreview.prototype.destroy = function () {
            this.primary = null;
            this.secondary = null;
            this.perk1 = null;
            _super.prototype.destroy.call(this);
        };
        return ClassPreview;
    }(Phaser.Group));
    TacticalWeaponPack.ClassPreview = ClassPreview;
    var ClassPreviewItem = /** @class */ (function (_super) {
        __extends(ClassPreviewItem, _super);
        function ClassPreviewItem() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            //gfx.lineStyle(1, 0xFFFFFF, 0.2);
            gfx.beginFill(0xFFFFFF, 0.0);
            gfx.drawRect(0, 0, 600, 110);
            _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.add(_this.bg);
            _this.text = _this.game.add.text(0, 4, "", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            _this.add(_this.text);
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.text);
            _this.desc = _this.game.add.text(0, 4, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.desc.alpha = 0.5;
            _this.add(_this.desc);
            return _this;
        }
        ClassPreviewItem.prototype.destroy = function () {
            this.bg = null;
            this.text = null;
            this.container = null;
            _super.prototype.destroy.call(this);
        };
        ClassPreviewItem.prototype.setFromData = function (_data) {
            this.desc.setText("", true);
            if (this.container) {
                this.container.destroy();
                this.container = null;
            }
            if (_data) {
                if (_data["desc"]) {
                    this.text.setText(_data["desc"], true);
                    this.text.y = (this.bg.height * 0.5) - (this.text.height * 0.5);
                    this.text.alpha = 0.2;
                }
                else {
                    this.container = this.game.add.group();
                    this.add(this.container);
                    if (_data["weapon"]) {
                        var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(_data["weapon"]["id"]);
                        var image = this.game.add.image(0, 0, "atlas_weapons", weaponData["id"]);
                        image.anchor.set(0, 0.5);
                        //this.image = GameUtil.CreateWeapon(_data["weapon"]);
                        //this.image.scale.set(0.5, 0.5);
                        this.container.add(image);
                        var mods = [
                            _data["weapon"][TacticalWeaponPack.WeaponDatabase.MOD_MAG],
                            _data["weapon"][TacticalWeaponPack.WeaponDatabase.MOD_OPTIC],
                            _data["weapon"][TacticalWeaponPack.WeaponDatabase.MOD_BARREL]
                        ];
                        var padding = 24;
                        for (var i = 0; i < mods.length; i++) {
                            if (mods[i] && !TacticalWeaponPack.WeaponDatabase.IsDefaultMod(mods[i])) {
                                var plus = this.game.add.image(0, 0, "atlas_ui", "icon_plus");
                                plus.anchor.set(0, 0.5);
                                plus.alpha = 0.5;
                                plus.x = this.container.width + padding;
                                this.container.add(plus);
                                var mod = this.game.add.image(0, 0, "atlas_ui", mods[i]);
                                mod.anchor.set(0, 0.5);
                                mod.scale.set(0.5, 0.5);
                                mod.x = this.container.width + padding;
                                this.container.add(mod);
                            }
                        }
                        this.container.x = (this.bg.x + (this.bg.width * 0.5)) - (this.container.width * 0.5);
                        this.container.y = (this.bg.y + (this.bg.height * 0.5)) + 4;
                        this.text.setText(weaponData["name"], true);
                    }
                    else if (_data["perk"]) {
                        var perkData = TacticalWeaponPack.SkillDatabase.GetSkill(_data["perk"]["id"]);
                        var image = this.game.add.image(0, 0, "atlas_ui", perkData["id"]);
                        image.scale.set(0.5, 0.5);
                        image.anchor.set(0.5, 0.5);
                        image.x = this.bg.x + (this.bg.width * 0.5);
                        image.y = this.bg.y + (this.bg.height * 0.5);
                        this.container.add(image);
                        this.text.setText(perkData["name"], true);
                        this.desc.setText(perkData["desc"], true);
                    }
                    this.text.y = 4;
                    this.text.alpha = 1;
                }
                this.text.x = (this.bg.width * 0.5) - (this.text.width * 0.5);
                this.desc.x = (this.bg.width * 0.5) - (this.desc.width * 0.5);
                this.desc.y = (this.bg.height - this.desc.height);
            }
        };
        return ClassPreviewItem;
    }(Phaser.Group));
    TacticalWeaponPack.ClassPreviewItem = ClassPreviewItem;
    var ItemSelector = /** @class */ (function (_super) {
        __extends(ItemSelector, _super);
        function ItemSelector(_bLockItems) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.bLockItems = true;
            _this.bLockItems = _bLockItems;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, _this.game.width - 20, _this.game.height * 0.6);
            _this.add(gfx);
            _this.itemButtons = _this.game.add.group();
            _this.add(_this.itemButtons);
            _this.weaponStats = new WeaponStats();
            _this.weaponStats.visible = false;
            _this.add(_this.weaponStats);
            _this.itemNameText = _this.game.add.text(0, 0, "", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(_this.itemNameText);
            _this.itemDescText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.itemDescText.alpha = 0.8;
            _this.add(_this.itemDescText);
            return _this;
        }
        ItemSelector.prototype.destroy = function () {
            this.weaponInfo = null;
            this.itemButtons = null;
            this.itemNameText = null;
            this.itemImage = null;
            this.weaponStats = null;
            this.buttons = null;
            _super.prototype.destroy.call(this);
        };
        Object.defineProperty(ItemSelector.prototype, "height", {
            get: function () {
                return this.game.height * 0.6;
            },
            enumerable: true,
            configurable: true
        });
        ItemSelector.prototype.setPrevMenuId = function (_val) {
            this.prevMenuId = _val;
        };
        ItemSelector.prototype.setCurrentClassIndex = function (_val) {
            this.currentClassIndex = _val;
        };
        ItemSelector.prototype.setCurrentTypeSlot = function (_type) {
            this.currentTypeSlot = _type;
        };
        ItemSelector.prototype.setCurrentItemId = function (_id) {
            this.currentItemId = _id;
        };
        ItemSelector.prototype.setWeaponTypes = function (_types, _typeToLoad) {
            if (_typeToLoad === void 0) { _typeToLoad = null; }
            this.buttons = [];
            var container = this.game.add.group();
            this.add(container);
            var padding = 4;
            var buttonWidth = (this.width / _types.length) - (padding);
            var indexToLoad = 0;
            var pageToLoad = 0;
            for (var i = 0; i < _types.length; i++) {
                var type = _types[i];
                var typeButton = new TacticalWeaponPack.MenuButton(buttonWidth, "center");
                typeButton.setCallback(this.onCategoryClicked, this, [type["id"], typeButton]);
                typeButton.setButtonData(type);
                typeButton.setLabelText(type["label"]);
                typeButton.x = container.width + (i > 0 ? padding : 0);
                container.add(typeButton);
                this.buttons.push(typeButton);
                if (type["id"] == _typeToLoad) {
                    indexToLoad = i;
                    pageToLoad = 0; //Math.floor(i / ItemSelector.MAX_ITEMS_PER_PAGE);
                }
            }
            this.updateButtons();
            this.itemButtons.y = container.y + container.height + padding;
            if (_types.length > 0) {
                var weaponTypes = TacticalWeaponPack.WeaponDatabase.GetAllWeaponsByType(_typeToLoad);
                if (weaponTypes) {
                    for (var i = 0; i < weaponTypes.length; i++) {
                        if (weaponTypes[i]["id"] == this.currentItemId) {
                            pageToLoad = Math.floor(i / ItemSelector.MAX_ITEMS_PER_PAGE);
                            break;
                        }
                    }
                }
                this.loadWeaponCategory(_types[indexToLoad]["id"], pageToLoad);
            }
            this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + (padding * 4);
            this.itemNameText.y = this.itemButtons.y;
            this.itemDescText.x = this.itemNameText.x;
            this.itemDescText.y = this.itemNameText.y + this.itemNameText.height;
        };
        ItemSelector.prototype.updateButtons = function () {
            if (this.buttons) {
                if (this.bLockItems) {
                    for (var i = 0; i < this.buttons.length; i++) {
                        var typeButton = this.buttons[i];
                        var type = typeButton.getButtonData();
                        if (TacticalWeaponPack.PlayerUtil.HasPendingItemsForWeaponCategories([type["id"]])) {
                            var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                            newIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                            typeButton.setIcon(newIcon);
                        }
                        else {
                            typeButton.setIcon(null);
                        }
                    }
                }
            }
        };
        ItemSelector.prototype.loadWeaponCategory = function (_type, _page) {
            if (_page === void 0) { _page = 0; }
            for (var i = 0; i < this.buttons.length; i++) {
                var data = this.buttons[i].getButtonData();
                var bSelected = data["id"] == _type;
                this.buttons[i].setSelected(bSelected);
                //this.buttons[i].setIcon(bSelected ? this.game.add.image(0, 0, "atlas_ui", "icon_checkmark") : null);
            }
            this.itemButtons.removeAll(true);
            var padding = 4;
            var weapons = TacticalWeaponPack.WeaponDatabase.GetAllWeaponsByType(_type);
            var startIndex = (_page * ItemSelector.MAX_ITEMS_PER_PAGE);
            var viewable = weapons.slice(startIndex);
            for (var i = 0; i < Math.min(viewable.length, ItemSelector.MAX_ITEMS_PER_PAGE); i++) {
                var itemButton = new TacticalWeaponPack.ClassItemButton();
                itemButton.setCallback(this.onItemClicked, this, ["weapon", viewable[i]["id"]]);
                itemButton.setWeapon(viewable[i]);
                if (viewable[i]["id"] == this.currentItemId) {
                    itemButton.setAsCurrent();
                }
                var wpnData = TacticalWeaponPack.WeaponDatabase.GetWeapon(viewable[i]["id"]);
                var bLocked = this.bLockItems ? wpnData["unlockLevel"] > TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"] : false;
                itemButton.setLocked(bLocked, "Unlocked at level " + wpnData["unlockLevel"]);
                itemButton.y = this.itemButtons.height + (i > 0 ? padding : 0);
                if (!bLocked) {
                    itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "weapon", data: viewable[i], button: itemButton });
                    itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
                }
                if (this.bLockItems) {
                    if (TacticalWeaponPack.PlayerUtil.IsPendingItem(viewable[i]["id"])) {
                        itemButton.showNewIcon();
                    }
                }
                this.itemButtons.add(itemButton);
            }
            /* Pages */
            var maxPages = Math.ceil(weapons.length / ItemSelector.MAX_ITEMS_PER_PAGE);
            var prevButton = new TacticalWeaponPack.MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
            prevButton.setEnabled(_page > 0);
            prevButton.setCallback(this.loadWeaponCategory, this, [_type, (_page - 1)]);
            prevButton.y = this.itemButtons.height + padding;
            prevButton.setLabelText("<");
            this.itemButtons.add(prevButton);
            var pageText = this.game.add.text(0, 0, (_page + 1) + " of " + maxPages, { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            pageText.setTextBounds(0, 2, this.itemButtons.width / 3, prevButton.height);
            pageText.alpha = 0.5;
            pageText.x = prevButton.x + prevButton.width;
            pageText.y = prevButton.y;
            this.itemButtons.add(pageText);
            var nextButton = new TacticalWeaponPack.MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
            nextButton.setEnabled(_page < maxPages - 1);
            nextButton.setCallback(this.loadWeaponCategory, this, [_type, (_page + 1)]);
            nextButton.x = pageText.x + pageText.textBounds.width;
            nextButton.y = prevButton.y;
            nextButton.setLabelText(">");
            this.itemButtons.add(nextButton);
        };
        ItemSelector.prototype.loadSkills = function (_page) {
            if (_page === void 0) { _page = 0; }
            this.itemButtons.removeAll(true);
            var skills = TacticalWeaponPack.SkillDatabase.GetAllSkills();
            var startIndex = (_page * ItemSelector.MAX_ITEMS_PER_PAGE);
            var viewable = skills.slice(startIndex);
            for (var i = 0; i < Math.min(viewable.length, ItemSelector.MAX_ITEMS_PER_PAGE); i++) {
                var itemButton = new TacticalWeaponPack.ClassItemButton();
                itemButton.setCallback(this.onItemClicked, this, ["perk", viewable[i]["id"]]);
                itemButton.setSkill(viewable[i]);
                if (skills[i]["id"] == this.currentItemId) {
                    itemButton.setAsCurrent();
                }
                var bLocked = skills[i]["unlockLevel"] > TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"];
                itemButton.setLocked(bLocked, "Unlocked at level " + viewable[i]["unlockLevel"]);
                itemButton.y = this.itemButtons.height + (i > 0 ? 4 : 0);
                if (!bLocked) {
                    itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "perk", data: viewable[i], button: itemButton });
                    itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
                }
                if (this.bLockItems) {
                    if (TacticalWeaponPack.PlayerUtil.IsPendingItem(viewable[i]["id"])) {
                        itemButton.showNewIcon();
                    }
                }
                this.itemButtons.add(itemButton);
            }
            var padding = 4;
            this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + (padding * 4);
            this.itemNameText.y = this.itemButtons.y;
            this.itemDescText.x = this.itemNameText.x;
            this.itemDescText.y = this.itemNameText.y + this.itemNameText.height;
            /* Pages */
            /*
            var maxPages = Math.ceil(skills.length / ItemSelector.MAX_ITEMS_PER_PAGE);
            var prevButton = new MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
            prevButton.setEnabled(_page > 0);
            prevButton.setCallback(this.loadSkills, this, [(_page - 1)]);
            prevButton.y = this.itemButtons.height + padding;
            prevButton.setLabelText("<");
            this.itemButtons.add(prevButton);
            var pageText = this.game.add.text(0, 0, (_page + 1) + " of " + maxPages, { font: "14px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            pageText.setTextBounds(0, 2, this.itemButtons.width / 3, prevButton.height);
            pageText.alpha = 0.5;
            pageText.x = prevButton.x + prevButton.width;
            pageText.y = prevButton.y;
            this.itemButtons.add(pageText);
            var nextButton = new MenuButton(this.itemButtons.width / 3, "center", undefined, 30);
            nextButton.setEnabled(_page < maxPages - 1);
            nextButton.setCallback(this.loadSkills, this, [(_page + 1)]);
            nextButton.x = pageText.x + pageText.textBounds.width;
            nextButton.y = prevButton.y;
            nextButton.setLabelText(">");
            this.itemButtons.add(nextButton);
            */
        };
        ItemSelector.prototype.loadMods = function (_modType, _weaponId) {
            var mods;
            if (_modType == TacticalWeaponPack.WeaponDatabase.MOD_OPTIC) {
                mods = TacticalWeaponPack.WeaponDatabase.GetAllOptics();
            }
            else if (_modType == TacticalWeaponPack.WeaponDatabase.MOD_MAG) {
                mods = TacticalWeaponPack.WeaponDatabase.GetAllMags();
            }
            else if (_modType == TacticalWeaponPack.WeaponDatabase.MOD_BARREL) {
                mods = TacticalWeaponPack.WeaponDatabase.GetAllBarrels();
            }
            else if (_modType == TacticalWeaponPack.WeaponDatabase.MOD_BASE) {
                mods = TacticalWeaponPack.WeaponDatabase.GetAllBases();
            }
            for (var i = 0; i < mods.length; i++) {
                var bAvailable = TacticalWeaponPack.WeaponDatabase.CanHaveMod(_weaponId, mods[i]["id"]);
                if (bAvailable) {
                    var itemButton = new TacticalWeaponPack.ClassItemButton();
                    itemButton.setCallback(this.onItemClicked, this, ["mod", mods[i]["id"]]);
                    itemButton.setMod(mods[i]);
                    if (this.currentItemId) {
                        if (mods[i]["id"] == this.currentItemId) {
                            itemButton.setAsCurrent();
                        }
                    }
                    else {
                        if (TacticalWeaponPack.WeaponDatabase.IsDefaultMod(mods[i]["id"])) {
                            itemButton.setAsCurrent();
                        }
                    }
                    var modKey = mods[i]["unlockKills"] != undefined ? "unlockKills" : "unlockHeadshots";
                    var weaponKey = modKey == "unlockKills" ? "kills" : "headshots";
                    var bLocked = mods[i][modKey] > TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][_weaponId][weaponKey];
                    itemButton.setLocked(bLocked, "Unlocked after " + mods[i][modKey] + " " + (modKey == "unlockKills" ? "kills" : "headshots"));
                    itemButton.y = this.itemButtons.height + (i > 0 ? 4 : 0);
                    if (!bLocked) {
                        itemButton.events.onInputOver.add(this.onItemButtonOver, this, 0, { type: "mod", data: mods[i], button: itemButton });
                        itemButton.events.onInputOut.add(this.onWeaponButtonOut, this, 0);
                    }
                    if (this.bLockItems) {
                        if (TacticalWeaponPack.PlayerUtil.IsPendingItem(mods[i]["id"])) {
                            itemButton.showNewIcon();
                        }
                    }
                    this.itemButtons.add(itemButton);
                }
            }
            var padding = 4;
            this.itemNameText.x = this.itemButtons.x + this.itemButtons.width + (padding * 4);
            this.itemNameText.y = this.itemButtons.y;
            this.itemDescText.x = this.itemNameText.x;
            this.itemDescText.y = this.itemNameText.y + this.itemNameText.height;
        };
        ItemSelector.prototype.showItemImage = function () {
            if (this.itemImage) {
                var tween = this.game.add.tween(this.itemImage).from({ alpha: 0, x: this.itemImage.x + 50 }, 500, Phaser.Easing.Exponential.Out, true);
            }
        };
        ItemSelector.prototype.setMod = function (_data) {
            if (this.itemImage) {
                this.itemImage.destroy();
            }
            this.itemImage = this.game.add.image(0, 0, "atlas_mods", _data["id"]);
            if (this.itemImage) {
                this.itemImage.x = this.itemDescText.x;
                this.itemImage.y = this.itemDescText.y + this.itemDescText.height + 10;
                this.itemButtons.add(this.itemImage);
                this.itemNameText.setText(_data["name"], true);
                this.itemNameText.visible = true;
                this.itemDescText.setText(_data["desc"], true);
                this.itemDescText.visible = true;
                this.showItemImage();
            }
        };
        ItemSelector.prototype.setWeapon = function (_data) {
            if (this.itemImage) {
                this.itemImage.destroy();
            }
            this.itemImage = TacticalWeaponPack.GameUtil.CreateWeapon(_data);
            if (this.itemImage) {
                this.itemNameText.setText(_data["name"], true);
                this.itemNameText.visible = true;
                this.itemDescText.setText(_data["desc"], true);
                this.itemDescText.visible = true;
                this.itemImage.x = this.itemDescText.x;
                this.itemImage.y = this.itemDescText.y + this.itemDescText.height + 10;
                this.add(this.itemImage);
                this.showItemImage();
                this.weaponStats.setFromData(_data);
                this.weaponStats.x = this.itemNameText.x;
                this.weaponStats.y = (this.game.height * 0.7) - this.weaponStats.height;
                this.weaponStats.visible = true;
            }
        };
        ItemSelector.prototype.setPerk = function (_data) {
            if (this.itemImage) {
                this.itemImage.destroy();
            }
            this.itemImage = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
            if (this.itemImage) {
                this.itemImage.x = this.itemDescText.x;
                this.itemImage.y = this.itemDescText.y + this.itemDescText.height + 10;
                this.itemButtons.add(this.itemImage);
                this.itemNameText.setText(_data["name"], true);
                this.itemNameText.visible = true;
                this.itemDescText.setText(_data["desc"], true);
                this.itemDescText.visible = true;
                this.showItemImage();
            }
        };
        ItemSelector.prototype.onCategoryClicked = function (_id, _button) {
            this.loadWeaponCategory(_id);
            this.updateButtons();
        };
        ItemSelector.prototype.onItemClicked = function (_type, _id) {
            if (TacticalWeaponPack.GameUtil.GetGameState()) {
                var char = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                char.replaceInventoryItem(TacticalWeaponPack.WeaponDatabase.GetWeapon(_id), 0);
                TacticalWeaponPack.GameUtil.GetGameState().setPaused(false);
            }
            else {
                var classData = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"][this.currentClassIndex];
                if (_type == "mod") {
                    console.log(this.currentTypeSlot);
                    classData[this.currentTypeSlot][TacticalWeaponPack.WeaponDatabase.GetModType(_id)] = _id;
                }
                else {
                    if (classData[this.currentTypeSlot]["id"] != _id) {
                        classData[this.currentTypeSlot][TacticalWeaponPack.WeaponDatabase.MOD_OPTIC] = undefined;
                        classData[this.currentTypeSlot][TacticalWeaponPack.WeaponDatabase.MOD_MAG] = undefined;
                        classData[this.currentTypeSlot][TacticalWeaponPack.WeaponDatabase.MOD_BARREL] = undefined;
                    }
                    classData[this.currentTypeSlot]["id"] = _id;
                }
                var mainMenu = TacticalWeaponPack.GameUtil.game.getMainMenu();
                mainMenu.loadMenu(MainMenu.MENU_EDIT_CLASS, this.currentClassIndex);
                TacticalWeaponPack.GameUtil.game.savePlayerData();
            }
        };
        ItemSelector.prototype.setWeaponInfo = function (_val) {
            this.weaponInfo = _val;
        };
        ItemSelector.prototype.onItemButtonOver = function (_arg1, _arg2, _data) {
            if (_data["type"] == "weapon") {
                this.setWeapon(_data["data"]);
            }
            else if (_data["type"] == "perk") {
                this.setPerk(_data["data"]);
            }
            else if (_data["type"] == "mod") {
                this.setMod(_data["data"]);
                if (this.weaponInfo) {
                    this.weaponInfo.setWeaponMod(_data["data"]["id"]);
                }
            }
            if (this.bLockItems) {
                TacticalWeaponPack.PlayerUtil.ClearPendingItemById(_data["data"]["id"]);
                if (_data["button"]) {
                    _data["button"].hideNewIcon();
                }
                this.updateButtons();
            }
        };
        ItemSelector.prototype.onWeaponButtonOut = function (_arg1, _arg2, _classPreview) {
            if (this.itemImage) {
                this.itemImage.destroy();
            }
            this.weaponStats.visible = false;
            this.itemNameText.visible = false;
            this.itemDescText.visible = false;
            if (this.weaponInfo) {
                this.weaponInfo.setWeaponMod(null);
            }
        };
        ItemSelector.MAX_ITEMS_PER_PAGE = 5;
        return ItemSelector;
    }(Phaser.Group));
    TacticalWeaponPack.ItemSelector = ItemSelector;
    var WeaponInfo = /** @class */ (function (_super) {
        __extends(WeaponInfo, _super);
        function WeaponInfo() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, _this.game.width * 0.4, _this.game.height * 0.4);
            _this.add(_this.game.add.image(0, 0, gfx.generateTexture()));
            gfx.destroy();
            _this.titleText = _this.game.add.text(0, 0, "", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.titleText.setTextBounds(0, 4, _this.width, 32);
            _this.add(_this.titleText);
            _this.killsText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle", align: "center" });
            _this.killsText.alpha = 0.8;
            _this.killsText.setTextBounds(0, 0, _this.width, 60);
            _this.killsText.y = _this.titleText.y + _this.titleText.height;
            _this.add(_this.killsText);
            return _this;
        }
        WeaponInfo.prototype.destroy = function () {
            this.killsText = null;
            this.weaponIcon = null;
            _super.prototype.destroy.call(this);
        };
        WeaponInfo.prototype.setWeapon = function (_id) {
            if (this.weaponIcon) {
                this.weaponIcon.destroy();
            }
            var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(_id);
            this.weaponIcon = TacticalWeaponPack.GameUtil.CreateWeapon(weaponData);
            this.weaponIcon.scale.set(0.75, 0.75);
            this.weaponIcon.x = (this.width * 0.5) - (this.weaponIcon.width * 0.5);
            this.weaponIcon.y = this.killsText.y + this.killsText.height + 50;
            this.add(this.weaponIcon);
            this.titleText.setText(weaponData["name"], true);
        };
        WeaponInfo.prototype.setWeaponMod = function (_id) {
            if (this.weaponIcon) {
                if (_id) {
                    var modType = TacticalWeaponPack.WeaponDatabase.GetModType(_id);
                    if (modType == TacticalWeaponPack.WeaponDatabase.MOD_BARREL) {
                        var m203 = this.weaponIcon.getByName(TacticalWeaponPack.WeaponDatabase.BARREL_M203);
                        if (m203) {
                            m203.visible = _id == m203.name;
                        }
                        var laser = this.weaponIcon.getByName(TacticalWeaponPack.WeaponDatabase.BARREL_LASER);
                        if (laser) {
                            laser.visible = _id == laser.name;
                        }
                    }
                    else if (modType == TacticalWeaponPack.WeaponDatabase.MOD_OPTIC) {
                        var optic = this.weaponIcon.getByName("optic");
                        if (optic) {
                            optic.frameName = _id;
                        }
                    }
                    else if (modType == TacticalWeaponPack.WeaponDatabase.MOD_MAG) {
                        var mag = this.weaponIcon.getByName("mag");
                        if (mag) {
                            mag.frameName = _id;
                        }
                    }
                }
                else {
                    var optic = this.weaponIcon.getByName("optic");
                    if (optic) {
                        optic.frameName = TacticalWeaponPack.WeaponDatabase.OPTIC_DEFAULT;
                    }
                    var mag = this.weaponIcon.getByName("mag");
                    if (mag) {
                        mag.frameName = TacticalWeaponPack.WeaponDatabase.MAG_DEFAULT;
                    }
                    var m203 = this.weaponIcon.getByName(TacticalWeaponPack.WeaponDatabase.BARREL_M203);
                    if (m203) {
                        m203.visible = false;
                    }
                    var laser = this.weaponIcon.getByName(TacticalWeaponPack.WeaponDatabase.BARREL_LASER);
                    if (laser) {
                        laser.visible = false;
                    }
                }
            }
        };
        WeaponInfo.prototype.setText = function (_kills, _headshots) {
            this.killsText.setText("Kills: " + _kills + "\nHeadshots: " + _headshots, true);
        };
        return WeaponInfo;
    }(Phaser.Group));
    TacticalWeaponPack.WeaponInfo = WeaponInfo;
    var WeaponStats = /** @class */ (function (_super) {
        __extends(WeaponStats, _super);
        function WeaponStats() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var padding = 2;
            var barWidth = 350;
            var barHeight = 4;
            var barX = 80;
            var statsText = _this.game.add.text(0, 0, "Weapon Specs", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            //statsText.alpha = 0.8;
            _this.add(statsText);
            _this.killsText = _this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.killsText.alpha = 0.5;
            _this.killsText.y = _this.height;
            _this.add(_this.killsText);
            var barData = {
                w: barWidth,
                h: barHeight,
                tweenFunc: Phaser.Easing.Exponential.Out,
                bInterpColour: true,
                colours: [0xBBBBBB, TacticalWeaponPack.ColourUtil.COLOUR_GREEN],
                ticks: 9
            };
            var accuracyText = _this.game.add.text(0, _this.height + padding, "Accuracy", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(accuracyText);
            _this.accuracyBar = new TacticalWeaponPack.UIBar(barData);
            _this.accuracyBar.x = barX;
            _this.accuracyBar.y = accuracyText.y + (accuracyText.height * 0.5) - barHeight;
            _this.add(_this.accuracyBar);
            var damageText = _this.game.add.text(0, _this.height + padding, "Damage", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(damageText);
            _this.damageBar = new TacticalWeaponPack.UIBar(barData);
            _this.damageBar.x = barX;
            _this.damageBar.y = damageText.y + (damageText.height * 0.5) - barHeight;
            _this.add(_this.damageBar);
            var fireRateText = _this.game.add.text(0, _this.height + padding, "Fire Rate", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(fireRateText);
            _this.fireRateBar = new TacticalWeaponPack.UIBar(barData);
            _this.fireRateBar.x = barX;
            _this.fireRateBar.y = fireRateText.y + (fireRateText.height * 0.5) - barHeight;
            _this.add(_this.fireRateBar);
            var reloadText = _this.game.add.text(0, _this.height + padding, "Reload Speed", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            _this.add(reloadText);
            _this.reloadBar = new TacticalWeaponPack.UIBar(barData);
            _this.reloadBar.x = barX;
            _this.reloadBar.y = reloadText.y + (reloadText.height * 0.5) - barHeight;
            _this.add(_this.reloadBar);
            return _this;
        }
        WeaponStats.prototype.setFromData = function (_data) {
            var minVal = 0.05;
            var damageMult = 1;
            if (_data["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN) {
                damageMult = 3;
            }
            this.accuracyBar.setValue((15 - _data["accuracy"]) / 15);
            var damageMax = 100;
            this.damageBar.setValue((_data["damage"] * damageMult) / damageMax);
            this.fireRateBar.setValue(Math.max(minVal, (30 - _data["fireRate"]) / 30));
            this.reloadBar.setValue(Math.max(minVal, (5 - _data["reloadTime"]) / 5));
            var weaponData = TacticalWeaponPack.PlayerUtil.GetRankedData()["weapons"][_data["id"]];
            this.killsText.setText(weaponData["kills"] + " kills, " + weaponData["headshots"] + " headshots");
        };
        return WeaponStats;
    }(Phaser.Group));
    TacticalWeaponPack.WeaponStats = WeaponStats;
    var RecentUnlocks = /** @class */ (function (_super) {
        __extends(RecentUnlocks, _super);
        function RecentUnlocks() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.container = _this.game.add.group();
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, _this.game.width * 0.4, 230);
            var bg = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.add(bg);
            var padding = 30;
            _this.add(_this.container);
            var titleText = _this.game.add.text(0, 0, "Recent Unlocks", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (_this.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 10;
            _this.add(titleText);
            return _this;
        }
        RecentUnlocks.prototype.destroy = function () {
            this.container = null;
            _super.prototype.destroy.call(this);
        };
        RecentUnlocks.prototype.setUnlocks = function (_items) {
            this.container.removeAll(true);
            if (_items.length > 0) {
                var items = this.game.add.group();
                this.container.add(items);
                var lineMax = 3;
                var curX = 0;
                var curY = 0;
                for (var i = 0; i < Math.min(_items.length, 6); i++) {
                    var cur = _items[i];
                    var item = this.game.add.group();
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(0xFFFFFF, 0.1);
                    gfx.drawRect(0, 0, 128, 90);
                    item.add(gfx);
                    var text = this.game.add.text(0, 0, "", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                    text.y = 4;
                    item.add(text);
                    var typeText = this.game.add.text(0, 0, "", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                    typeText.alpha = 0.35;
                    typeText.y = item.height - typeText.height;
                    item.add(typeText);
                    items.add(item);
                    if (cur["type"] == "weapon") {
                        var weaponData = TacticalWeaponPack.WeaponDatabase.GetWeapon(cur["id"]);
                        text.setText(weaponData["name"], true);
                        typeText.setText("Weapon", true);
                        var weapon = this.game.add.image(0, 0, "atlas_weapons", weaponData["id"]);
                        weapon.x = (gfx.width * 0.5) - (weapon.width * 0.5);
                        weapon.y = (gfx.height * 0.5) - (weapon.height * 0.5) + 4;
                        item.add(weapon);
                    }
                    else if (cur["type"] == "skill") {
                        var skillData = TacticalWeaponPack.SkillDatabase.GetSkill(cur["id"]);
                        text.setText(skillData["name"], true);
                        typeText.setText("Skill", true);
                        var skill = this.game.add.image(0, 0, "atlas_ui", skillData["id"]);
                        skill.scale.set(0.5, 0.5);
                        skill.x = (gfx.width * 0.5) - (skill.width * 0.5);
                        skill.y = (gfx.height * 0.5) - (skill.height * 0.5) + 4;
                        item.add(skill);
                    }
                    item.x = curX * (item.width + 4);
                    item.y = curY * (item.height + 4);
                    text.x = (gfx.width * 0.5) - (text.width * 0.5);
                    typeText.x = (gfx.width * 0.5) - (typeText.width * 0.5);
                    /*
                    var newIcon = this.game.add.image(0, 0, "atlas_ui", "icon_new");
                    newIcon.tint = ColourUtil.COLOUR_GREEN;
                    newIcon.x = gfx.width - newIcon.width;
                    newIcon.y = gfx.height - newIcon.height;
                    item.add(newIcon);
                    */
                    var tween = this.game.add.tween(item).from({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true, (i + 1) * 100);
                    curX++;
                    if (curX >= lineMax) {
                        curX = 0;
                        curY++;
                    }
                }
                items.x = (this.width * 0.5) - (items.width * 0.5);
                items.y = _items.length > lineMax ? (this.height - items.height - 4) : ((this.height * 0.5) - (items.height * 0.5));
            }
            else {
                var text = this.game.add.text(0, 0, "None", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                text.alpha = 0.5;
                text.x = (this.width * 0.5) - (text.width * 0.5);
                text.y = (this.height * 0.5) - (text.height * 0.5) + 10;
                this.container.add(text);
            }
        };
        return RecentUnlocks;
    }(Phaser.Group));
    TacticalWeaponPack.RecentUnlocks = RecentUnlocks;
    var RecentChallenges = /** @class */ (function (_super) {
        __extends(RecentChallenges, _super);
        function RecentChallenges() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.container = _this.game.add.group();
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, _this.game.width * 0.4, 120);
            var bg = _this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            _this.add(bg);
            var padding = 30;
            _this.add(_this.container);
            var titleText = _this.game.add.text(0, 0, "Challenges", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (_this.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 10;
            _this.add(titleText);
            var infoButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_help");
            infoButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                    type: Window.TYPE_CHALLENGES,
                    titleText: "Challenges",
                    messageText: "Complete challenges to earn bonus XP.\n\nChallenges are repeatable and will reset once completed."
                }]);
            infoButton.x = _this.width - infoButton.width - 4;
            infoButton.y = 4;
            _this.add(infoButton);
            return _this;
        }
        RecentChallenges.prototype.destroy = function () {
            this.container = null;
            _super.prototype.destroy.call(this);
        };
        RecentChallenges.prototype.updateChallenges = function () {
            this.container.removeAll(true);
            var bHasChallenges = true;
            if (bHasChallenges) {
                var bars = this.game.add.group();
                var rankedData = TacticalWeaponPack.PlayerUtil.GetRankedData();
                var kills = new TacticalWeaponPack.ChallengeItem();
                kills.setItem(rankedData["kills_ranked"] % TacticalWeaponPack.PlayerUtil.CHALLENGE_KILLS, TacticalWeaponPack.PlayerUtil.CHALLENGE_KILLS, "Kills", 100);
                bars.add(kills);
                var headshots = new TacticalWeaponPack.ChallengeItem();
                headshots.setItem(rankedData["headshots_ranked"] % TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS, TacticalWeaponPack.PlayerUtil.CHALLENGE_HEADSHOTS, "Headshots", 100);
                headshots.y = bars.height + 4;
                bars.add(headshots);
                var shotsFired = new TacticalWeaponPack.ChallengeItem();
                shotsFired.setItem(rankedData["shotsFired_ranked"] % TacticalWeaponPack.PlayerUtil.CHALLENGE_SHOTS_FIRED, TacticalWeaponPack.PlayerUtil.CHALLENGE_SHOTS_FIRED, "Shots Fired", 100);
                shotsFired.y = bars.height + 4;
                bars.add(shotsFired);
                this.add(bars);
                bars.x = (this.width * 0.5) - (bars.width * 0.5);
                bars.y = (this.height * 0.5) - (bars.height * 0.5) + 12;
            }
            else {
                var text = this.game.add.text(0, 0, "None", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                text.alpha = 0.5;
                text.x = (this.width * 0.5) - (text.width * 0.5);
                text.y = (this.height * 0.5) - (text.height * 0.5) + 10;
                this.container.add(text);
            }
        };
        return RecentChallenges;
    }(Phaser.Group));
    TacticalWeaponPack.RecentChallenges = RecentChallenges;
    var PlayerStats = /** @class */ (function (_super) {
        __extends(PlayerStats, _super);
        function PlayerStats(_data) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.updateStats(_data);
            return _this;
        }
        PlayerStats.prototype.updateStats = function (_data) {
            this.removeAll(true);
            var container = this.game.add.group();
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.1);
            gfx.drawRect(0, 0, this.game.width * 0.4, 150);
            var bg = this.game.add.image(0, 0, gfx.generateTexture());
            gfx.destroy();
            this.add(bg);
            var padding = 30;
            this.add(container);
            /* Title */
            var titleText = this.game.add.text(0, 0, "Overview", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (this.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 10;
            this.add(titleText);
            /* Level group */
            var levelGroup = this.game.add.group();
            var gfx = this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 180, 40);
            levelGroup.add(gfx);
            var rankBg = this.game.add.graphics();
            rankBg.beginFill(0x000000, 0.2);
            rankBg.drawRect(0, 0, 90, 90);
            levelGroup.add(rankBg);
            var rankIcon = this.game.add.image(0, 0, "atlas_ui", TacticalWeaponPack.PlayerUtil.GetCurrentRankId());
            rankIcon.x = (rankBg.width * 0.5) - (rankIcon.width * 0.5);
            rankIcon.y = (rankBg.height * 0.5) - (rankIcon.height * 0.5);
            rankIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
            levelGroup.add(rankIcon);
            if (_data["prestige"] > 0) {
                var prestigeText = this.game.add.text(rankBg.x + (rankBg.width * 0.5), rankBg.y, "PRESTIGE", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center" });
                prestigeText.anchor.set(0.5, 0);
                levelGroup.add(prestigeText);
            }
            var levelText = this.game.add.text(0, 0, _data["rank"].toString(), { font: "48px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center" });
            levelGroup.add(levelText);
            levelText.x = rankBg.x + rankBg.width + 10;
            levelText.y = (rankBg.height * 0.5) - (levelText.height * 0.5) + 4;
            container.add(levelGroup);
            /* Group 1 */
            var group1 = this.game.add.group();
            var killsText = new StatItem();
            killsText.setText(_data["kills"], "Kills");
            group1.add(killsText);
            var assistsText = new StatItem();
            assistsText.setText(_data["headshots"], "Headshots");
            assistsText.y = killsText.y + killsText.height;
            group1.add(assistsText);
            group1.x = container.width + padding;
            group1.y = 12;
            container.add(group1);
            /* Group 2 */
            var group2 = this.game.add.group();
            var winsText = new StatItem();
            winsText.setText(_data["shotsFired"], "Shots Fired");
            group2.add(winsText);
            var lossesText = new StatItem();
            lossesText.setText(parseFloat(String(TacticalWeaponPack.PlayerUtil.GetCurrentAccuracy() * 100)).toFixed(2) + "%", "Accuracy");
            lossesText.y = winsText.y + winsText.height;
            group2.add(lossesText);
            group2.x = container.width + padding;
            group2.y = group1.y;
            container.add(group2);
            /* Align */
            container.x = (this.width * 0.5) - (container.width * 0.5);
            container.y = (this.height * 0.5) - (container.height * 0.5);
            /* XP */
            var xpPercent = TacticalWeaponPack.PlayerUtil.GetXPPercent(_data["xp"], _data["rank"]);
            var xpBar = new TacticalWeaponPack.UIBar({
                w: this.width,
                h: 8,
                tweenFunc: Phaser.Easing.Exponential.Out,
                barColour: TacticalWeaponPack.ColourUtil.COLOUR_XP,
                ticks: 9
            });
            if (TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"] >= TacticalWeaponPack.PlayerUtil.MAX_RANK) {
                xpPercent = 1;
            }
            xpBar.setValue(xpPercent);
            xpBar.y = this.height - xpBar.height;
            this.add(xpBar);
            var xpText = this.game.add.text(0, 0, (TacticalWeaponPack.GameUtil.FormatNum(_data["xp"]) + "XP"), { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            xpText.x = (xpBar.width * 0.5) - (xpText.width * 0.5);
            xpText.y = xpBar.y - xpText.height;
            this.add(xpText);
            var infoButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_help");
            infoButton.setCallback(TacticalWeaponPack.GameUtil.game.createWindow, TacticalWeaponPack.GameUtil.game, [{
                    type: Window.TYPE_PROFILE,
                    titleText: "Overview",
                    messageText: "Your current overview."
                }]);
            infoButton.x = this.width - infoButton.width - 4;
            infoButton.y = 4;
            this.add(infoButton);
        };
        return PlayerStats;
    }(Phaser.Group));
    TacticalWeaponPack.PlayerStats = PlayerStats;
    var StatItem = /** @class */ (function (_super) {
        __extends(StatItem, _super);
        function StatItem() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var desiredWidth = 50;
            _this.valueText = _this.game.add.text(0, 0, "1", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "top" });
            _this.valueText.setTextBounds(0, 0, desiredWidth, 18);
            _this.add(_this.valueText);
            _this.labelText = _this.game.add.text(0, _this.valueText.textBounds.height, "1", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "top" });
            _this.labelText.alpha = 0.8;
            _this.labelText.setTextBounds(0, 0, desiredWidth, 18);
            _this.add(_this.labelText);
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0);
            gfx.drawRect(0, 0, desiredWidth, _this.height);
            _this.add(gfx);
            return _this;
        }
        StatItem.prototype.setText = function (_value, _text) {
            this.valueText.setText(!isNaN(_value) ? TacticalWeaponPack.GameUtil.FormatNum(_value) : _value, true);
            this.labelText.setText(_text, true);
        };
        return StatItem;
    }(Phaser.Group));
    TacticalWeaponPack.StatItem = StatItem;
    var GameModePreview = /** @class */ (function (_super) {
        __extends(GameModePreview, _super);
        function GameModePreview() {
            return _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
        }
        GameModePreview.prototype.setGameMode = function (_data) {
            this.removeAll(true);
            var bg = this.game.add.graphics();
            bg.beginFill(0x000000, 0.5);
            bg.drawRect(0, 0, this.game.width * 0.4, this.game.height * 0.5);
            this.add(bg);
            if (_data) {
                var modeIcon = this.game.add.image(0, 0, "atlas_ui", _data["id"]);
                modeIcon.anchor.set(0.5, 0.5);
                modeIcon.scale.set(0.5, 0.5);
                modeIcon.x = this.width * 0.5;
                modeIcon.y = this.height * 0.5;
                this.add(modeIcon);
                var nameText = this.game.add.text(0, 0, _data["name"], { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                nameText.x = (this.width * 0.5) - (nameText.width * 0.5);
                nameText.y = 10;
                this.add(nameText);
                var playersText = this.game.add.text(0, 0, "Players: " + _data["minPlayers"] + "-" + _data["maxPlayers"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                playersText.alpha = 0.8;
                playersText.x = (this.width * 0.5) - (playersText.width * 0.5);
                playersText.y = nameText.y + nameText.height;
                this.add(playersText);
                var descText = this.game.add.text(0, 0, _data["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: this.width * 0.8 });
                descText.x = (this.width * 0.5) - (descText.width * 0.5);
                descText.y = this.height - descText.height;
                this.add(descText);
            }
        };
        return GameModePreview;
    }(Phaser.Group));
    TacticalWeaponPack.GameModePreview = GameModePreview;
    var CustomGamePreview = /** @class */ (function (_super) {
        __extends(CustomGamePreview, _super);
        function CustomGamePreview() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var bg = _this.game.add.graphics();
            bg.beginFill(0xFFFFFF, 0.1);
            bg.drawRect(0, 0, _this.game.width * 0.5, _this.game.height * 0.6);
            _this.add(bg);
            _this.container = _this.game.add.group();
            _this.add(_this.container);
            return _this;
        }
        CustomGamePreview.prototype.destroy = function () {
            this.container = null;
            _super.prototype.destroy.call(this);
        };
        CustomGamePreview.prototype.setGameData = function (_data) {
            this.container.removeAll(true);
            if (_data) {
                var gameMode = TacticalWeaponPack.GameModeDatabase.GetGameMode(_data["gameMode"]);
                var modeIcon = this.game.add.image(0, 0, "atlas_ui", _data["gameMode"]);
                modeIcon.scale.set(0.5, 0.5);
                modeIcon.x = (this.width * 0.5) - (modeIcon.width * 0.5);
                modeIcon.y = 10;
                this.container.add(modeIcon);
                var nameText = this.game.add.text(0, 0, gameMode["name"], { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                nameText.x = (this.width * 0.5) - (nameText.width * 0.5);
                nameText.y = modeIcon.y + modeIcon.height + 10;
                this.container.add(nameText);
                var descText = this.game.add.text(0, 0, gameMode["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", align: "center", wordWrap: true, wordWrapWidth: this.width * 0.9 });
                descText.alpha = 0.8;
                descText.x = (this.width * 0.5) - (descText.width * 0.5);
                descText.y = nameText.y + nameText.height;
                this.container.add(descText);
                /*
                var settingsContainer = this.game.add.group();
                var scoreText = this.game.add.text(0, 0, "Score Limit: " + _data["scoreLimit"], { font: "14px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                settingsContainer.add(scoreText);
                var timeText = this.game.add.text(0, 0, "Time Limit: " + _data["timeLimit"], { font: "14px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                timeText.y = scoreText.y + scoreText.height;
                settingsContainer.add(timeText);
                var playersText = this.game.add.text(0, 0, "Players: " + _data["players"], { font: "14px " + FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
                playersText.y = timeText.y + timeText.height;
                settingsContainer.add(playersText);
                scoreText.setTextBounds(0, 0, this.width, 20);
                timeText.setTextBounds(0, 0, this.width, 20);
                playersText.setTextBounds(0, 0, this.width, 20);
                settingsContainer.y = this.height - settingsContainer.height;
                this.add(settingsContainer);
                */
            }
        };
        return CustomGamePreview;
    }(Phaser.Group));
    TacticalWeaponPack.CustomGamePreview = CustomGamePreview;
    var BestScoreContainer = /** @class */ (function (_super) {
        __extends(BestScoreContainer, _super);
        function BestScoreContainer() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var bg = _this.game.add.graphics();
            bg.beginFill(0x000000, 0.5);
            bg.drawRect(0, 0, 240, 80);
            _this.add(bg);
            _this.labelText = _this.game.add.text(0, 0, "", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.labelText.setTextBounds(0, 0, _this.width, 24);
            _this.labelText.alpha = 0.8;
            _this.add(_this.labelText);
            _this.bestText = _this.game.add.text(0, 0, "N/A", { font: "32px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center", boundsAlignV: "middle" });
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.bestText);
            _this.bestText.setTextBounds(0, 6, _this.width, _this.height);
            _this.add(_this.bestText);
            return _this;
        }
        BestScoreContainer.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        BestScoreContainer.prototype.setLabelText = function (_val) {
            this.labelText.setText(_val, true);
        };
        BestScoreContainer.prototype.setBestScore = function (_val) {
            this.bestText.setText(TacticalWeaponPack.GameUtil.FormatNum(_val), true);
        };
        return BestScoreContainer;
    }(Phaser.Group));
    TacticalWeaponPack.BestScoreContainer = BestScoreContainer;
    var GameLeaderboards = /** @class */ (function (_super) {
        __extends(GameLeaderboards, _super);
        function GameLeaderboards() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var bg = _this.game.add.graphics();
            bg.beginFill(0xFFFFFF, 0.1);
            bg.drawRect(0, 0, _this.game.width * 0.4, _this.game.height * 0.7);
            _this.add(bg);
            var titleText = _this.game.add.text(0, 0, "Top Players", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (_this.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 10;
            _this.add(titleText);
            _this.loadContainer = _this.game.add.group();
            _this.add(_this.loadContainer);
            _this.playerContainer = _this.game.add.group();
            _this.playerContainer.y = titleText.y + titleText.height + 8;
            _this.add(_this.playerContainer);
            if (TacticalWeaponPack.APIUtil.CurrentAPI) {
                var apiIcon = _this.game.add.image(0, 0, "atlas_ui", "icon_" + TacticalWeaponPack.APIUtil.GetCurrentAPIId());
                apiIcon.scale.set(0.5, 0.5);
                apiIcon.alpha = 0.2;
                apiIcon.x = _this.width - apiIcon.width - 4;
                apiIcon.y = 4;
                _this.add(apiIcon);
            }
            return _this;
        }
        GameLeaderboards.prototype.destroy = function () {
            this.loadContainer = null;
            this.playerContainer = null;
            _super.prototype.destroy.call(this);
        };
        GameLeaderboards.prototype.showLoading = function (_bVal) {
            if (this.loadContainer) {
                this.loadContainer.visible = _bVal;
                this.loadContainer.removeAll(true);
            }
            if (this.playerContainer) {
                this.playerContainer.removeAll(true);
            }
            if (_bVal) {
                var spinner = TacticalWeaponPack.GameUtil.CreateSpinner();
                spinner.x = spinner.width * 0.5;
                spinner.y = spinner.height * 0.5;
                this.loadContainer.add(spinner);
                var loadingText = this.game.add.text(0, 0, "Loading scores...", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                loadingText.alpha = 0.5;
                loadingText.y = spinner.y + spinner.height;
                this.loadContainer.add(loadingText);
                spinner.x = (loadingText.width * 0.5);
                this.loadContainer.x = (this.width * 0.5) - (this.loadContainer.width * 0.5);
                this.loadContainer.y = (this.height * 0.5) - (this.loadContainer.height * 0.5);
                this.add(this.loadContainer);
            }
            else {
                this.loadContainer.removeAll(true);
            }
        };
        GameLeaderboards.prototype.refresh = function () {
            if (this.gameId) {
                this.loadScores(this.gameId);
            }
        };
        GameLeaderboards.prototype.loadScores = function (_gameId) {
            this.gameId = _gameId;
            this.showLoading(true);
            TacticalWeaponPack.APIUtil.LoadLeaderboards(_gameId, this);
        };
        GameLeaderboards.prototype.setError = function () {
            this.showLoading(false);
            this.playerContainer.removeAll(true);
            var text = this.game.add.text(0, 0, "An error has occurred. Please try again later.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            text.x = (this.width * 0.5) - (text.width * 0.5);
            text.y = (this.height * 0.5) - (text.height * 0.5) - (this.playerContainer.y);
            text.alpha = 0.5;
            this.playerContainer.add(text);
        };
        GameLeaderboards.prototype.setScores = function (_scores) {
            this.showLoading(false);
            this.playerContainer.removeAll(true);
            if (_scores.length > 0) {
                var padding = 2;
                var playerWidth = this.width * 0.9;
                var titlePlayer = new TacticalWeaponPack.LeaderboardPlayerButton(playerWidth, 0, "Player", 0, true, 0);
                titlePlayer.x = (this.width * 0.5) - (titlePlayer.width * 0.5);
                this.playerContainer.add(titlePlayer);
                for (var i = 0; i < Math.min(_scores.length, 10); i++) {
                    var cur = _scores[i];
                    var player = new TacticalWeaponPack.LeaderboardPlayerButton(playerWidth, i + 1, cur["name"], cur["score"], false, i + 1, cur["url"]);
                    player.x = titlePlayer.x;
                    player.y = this.playerContainer.height + padding;
                    this.playerContainer.add(player);
                }
            }
            else {
                var noneText = this.game.add.text(0, 0, "None", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                noneText.alpha = 0.5;
                noneText.x = (this.width * 0.5) - (noneText.width * 0.5);
                noneText.y = ((this.height * 0.5) - (noneText.height * 0.5)) - this.playerContainer.y;
                this.playerContainer.add(noneText);
            }
        };
        return GameLeaderboards;
    }(Phaser.Group));
    TacticalWeaponPack.GameLeaderboards = GameLeaderboards;
    var RankInfo = /** @class */ (function (_super) {
        __extends(RankInfo, _super);
        function RankInfo() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0);
            gfx.drawRect(0, 0, 100, 40);
            _this.add(gfx);
            _this.rankIcon = _this.game.add.image(_this.width * 0.5, _this.height * 0.5, "atlas_ui", "icon_rank_1");
            _this.rankIcon.scale.set(0.5, 0.5);
            _this.rankIcon.anchor.set(0.5, 0.5);
            _this.rankIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
            _this.add(_this.rankIcon);
            _this.rankNumText = _this.game.add.text(_this.rankIcon.x + (_this.rankIcon.width * 0.5) + 4, 0, "", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            _this.rankNumText.y = (_this.height * 0.5) - (_this.rankNumText.height * 0.5) + 3;
            _this.add(_this.rankNumText);
            _this.prestigeText = _this.game.add.text(0, 0, "", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
            _this.add(_this.prestigeText);
            return _this;
        }
        RankInfo.prototype.destroy = function () {
            this.rankNumText = null;
            this.rankIcon = null;
            this.prestigeText = null;
            _super.prototype.destroy.call(this);
        };
        RankInfo.prototype.setRank = function (_val, _prestige) {
            this.rankNumText.setText(_val.toString(), true);
            this.rankIcon.frameName = TacticalWeaponPack.PlayerUtil.GetCurrentRankId();
            this.prestigeText.setText(_prestige > 0 ? "PRESTIGE" : "", true);
            this.prestigeText.x = this.rankIcon.x - (this.rankIcon.width * 0.5) - this.prestigeText.width - 10;
            this.prestigeText.y = (this.height * 0.5) - (this.prestigeText.height * 0.5) + 3;
        };
        return RankInfo;
    }(Phaser.Group));
    TacticalWeaponPack.RankInfo = RankInfo;
    var MenuBase = /** @class */ (function (_super) {
        __extends(MenuBase, _super);
        function MenuBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MenuBase.prototype.show = function () {
            _super.prototype.show.call(this);
            TacticalWeaponPack.GameUtil.GetGameState().setWorldBlur(true);
            TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().hide();
        };
        MenuBase.prototype.close = function () {
            _super.prototype.close.call(this);
            TacticalWeaponPack.GameUtil.GetGameState().setWorldBlur(false);
            TacticalWeaponPack.GameUtil.GetGameState().getPlayerController().getHUD().show();
        };
        return MenuBase;
    }(ElementBase));
    TacticalWeaponPack.MenuBase = MenuBase;
    var ClassSelectorMenu = /** @class */ (function (_super) {
        __extends(ClassSelectorMenu, _super);
        function ClassSelectorMenu() {
            var _this = _super.call(this) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.2);
            gfx.drawRect(0, 0, _this.game.width, _this.game.height);
            _this.add(gfx);
            _this.windowContainer = _this.game.add.group();
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            gfx.drawRect(0, 0, _this.game.width - 240, _this.game.height - 80);
            _this.windowContainer.add(gfx);
            _this.add(_this.windowContainer);
            var gameMode = TacticalWeaponPack.GameModeDatabase.GetGameMode(TacticalWeaponPack.GameUtil.GetGameState().getGameMode().getId());
            var titleText = _this.game.add.text(0, 0, gameMode["name"] + ": Equip Class", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            titleText.x = (_this.windowContainer.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 10;
            _this.windowContainer.add(titleText);
            var descText = _this.game.add.text(0, 0, "You can customize your classes in the main menu.", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            descText.alpha = 0.2;
            descText.x = (_this.windowContainer.width * 0.5) - (descText.width * 0.5);
            descText.y = (_this.windowContainer.height - descText.height);
            _this.windowContainer.add(descText);
            _this.classContainer = _this.game.add.group();
            _this.classContainer.y = titleText.y + titleText.height + 20;
            _this.windowContainer.add(_this.classContainer);
            _this.classPreview = new ClassPreview();
            _this.windowContainer.add(_this.classPreview);
            _this.windowContainer.x = (_this.width * 0.5) - (_this.windowContainer.width * 0.5);
            _this.windowContainer.y = (_this.height * 0.5) - (_this.windowContainer.height * 0.5);
            _this.loadClasses();
            return _this;
        }
        ClassSelectorMenu.prototype.destroy = function () {
            this.classContainer = null;
            this.classPreview = null;
            _super.prototype.destroy.call(this);
        };
        ClassSelectorMenu.prototype.loadClasses = function () {
            this.classContainer.removeAll(true);
            var classes = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"];
            if (classes) {
                var padding = 4;
                var butWidth = ((this.windowContainer.width - padding * (classes.length + 2))) / classes.length;
                for (var i = 0; i < classes.length; i++) {
                    var cur = classes[i];
                    var button = new TacticalWeaponPack.MenuButton(butWidth, "center", TacticalWeaponPack.ColourUtil.COLOUR_GREEN);
                    button.setCallback(this.onClassClicked, this, [i]);
                    button.events.onInputOver.add(this.onClassButtonOver, this, 0, this.classPreview, i);
                    button.events.onInputOut.add(this.onClassButtonOut, this, 0, this.classPreview);
                    button.setLabelText(cur["name"]);
                    button.x = this.classContainer.width + (i > 0 ? padding : 0);
                    this.classContainer.add(button);
                }
            }
            this.classContainer.x = (this.windowContainer.width * 0.5) - (this.classContainer.width * 0.5);
            this.classPreview.x = (this.windowContainer.width * 0.5) - (this.classPreview.width * 0.5);
            this.classPreview.y = this.classContainer.y + this.classContainer.height + 24;
            var tween = this.game.add.tween(this.windowContainer).from({ alpha: 0, y: this.windowContainer.y + 100 }, 500, Phaser.Easing.Exponential.Out, true, 200);
        };
        ClassSelectorMenu.prototype.onClassClicked = function (_index) {
            this.close();
            var classData = TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"][_index];
            if (classData) {
                var char = TacticalWeaponPack.GameUtil.GetGameState().createPlayerCharacter(TacticalWeaponPack.GameUtil.GetGameState().getGameMode().getPlayerSpawnY());
                var primaryWeapon = TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["primary"]["id"]);
                primaryWeapon["optic"] = classData["primary"]["optic"];
                primaryWeapon["barrel"] = classData["primary"]["barrel"];
                primaryWeapon["magMod"] = classData["primary"]["mag"];
                if (primaryWeapon["magMod"] == TacticalWeaponPack.WeaponDatabase.MAG_EXTENDED) {
                    primaryWeapon["magSize"] = Math.round(primaryWeapon["magSize"] * 1.5);
                    primaryWeapon["mag"] = primaryWeapon["magSize"];
                }
                if (primaryWeapon["barrel"] == TacticalWeaponPack.WeaponDatabase.BARREL_M203) {
                    primaryWeapon["grenadesMax"] = 5;
                    primaryWeapon["grenades"] = primaryWeapon["grenadesMax"];
                }
                if (primaryWeapon["barrel"] && !TacticalWeaponPack.WeaponDatabase.IsDefaultMod(primaryWeapon["barrel"]) && primaryWeapon["barrel"] != TacticalWeaponPack.WeaponDatabase.BARREL_MUZZLE) {
                    TacticalWeaponPack.GameUtil.GetGameState().getHUD().getKeyInfo().show();
                }
                char.addInventoryItem(primaryWeapon);
                var secondaryWeapon = TacticalWeaponPack.WeaponDatabase.GetWeapon(classData["secondary"]["id"]);
                secondaryWeapon["magMod"] = classData["secondary"]["mag"];
                if (secondaryWeapon["magMod"] == TacticalWeaponPack.WeaponDatabase.MAG_EXTENDED) {
                    secondaryWeapon["magSize"] = Math.round(secondaryWeapon["magSize"] * 1.5);
                    secondaryWeapon["mag"] = secondaryWeapon["magSize"];
                }
                char.addInventoryItem(secondaryWeapon);
                char.addSkill(TacticalWeaponPack.SkillDatabase.GetSkill(classData["perk_1"]["id"]));
            }
            TacticalWeaponPack.GameUtil.GetGameState().getGameMode().prepareGame();
        };
        ClassSelectorMenu.prototype.onClassButtonOver = function (_arg1, _arg2, _classPreview, _index) {
            _classPreview.setFromData(TacticalWeaponPack.PlayerUtil.GetRankedData()["classes"][_index]);
        };
        ClassSelectorMenu.prototype.onClassButtonOut = function (_arg1, _arg2, _classPreview) {
            _classPreview.setFromData(null);
        };
        return ClassSelectorMenu;
    }(MenuBase));
    TacticalWeaponPack.ClassSelectorMenu = ClassSelectorMenu;
    var GameOverMenu = /** @class */ (function (_super) {
        __extends(GameOverMenu, _super);
        function GameOverMenu() {
            var _this = _super.call(this) || this;
            _this.score = 0;
            _this.totalKills = 0;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.35);
            gfx.drawRect(0, 0, _this.game.width, _this.game.height);
            _this.add(gfx);
            var timer = _this.game.time.create();
            _this.windowContainer = _this.game.add.group();
            _this.add(_this.windowContainer);
            timer.add(500, _this.showWindow, _this);
            timer.start();
            return _this;
        }
        GameOverMenu.prototype.destroy = function () {
            this.windowContainer = null;
            this.leaderboards = null;
            this.submitButton = null;
            this.restartButton = null;
            this.quitButton = null;
            _super.prototype.destroy.call(this);
        };
        GameOverMenu.prototype.showWindow = function () {
            var modeData = TacticalWeaponPack.GameModeDatabase.GetGameMode(TacticalWeaponPack.GameUtil.GetGameState().getData()["gameMode"]);
            var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
            var padding = 8;
            var gfx = this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            gfx.drawRect(0, 0, 520, 520);
            this.windowContainer.add(gfx);
            this.windowContainer.x = (this.width * 0.5) - (this.windowContainer.width * 0.5);
            this.windowContainer.y = (this.height * 0.5) - (this.windowContainer.height * 0.5);
            var titleText = this.game.add.text(0, 0, "Results: " + modeData["name"], { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(titleText);
            titleText.x = (this.windowContainer.width * 0.5) - (titleText.width * 0.5);
            titleText.y = 4;
            this.windowContainer.add(titleText);
            var container = this.game.add.group();
            this.windowContainer.add(container);
            var killsStat = new TacticalWeaponPack.GameStat("Kills", gameMode.getKills().toString());
            container.add(killsStat);
            var headshotsStat = new TacticalWeaponPack.GameStat("Headshots", gameMode.getHeadshots().toString());
            headshotsStat.x = killsStat.width;
            container.add(headshotsStat);
            var accuracy = gameMode.getAccuracy();
            var accuracyStat = new TacticalWeaponPack.GameStat("Accuracy", Math.round(accuracy * 100) + "%");
            accuracyStat.x = headshotsStat.x + headshotsStat.width;
            container.add(accuracyStat);
            var time = -1;
            if (!gameMode.isTimeLimited()) {
                time = gameMode.getTime();
                var timeStat = new TacticalWeaponPack.GameStat("Time", TacticalWeaponPack.GameUtil.ConvertToTimeString(time / 60));
                timeStat.x = accuracyStat.x + accuracyStat.width;
                container.add(timeStat);
            }
            container.x = (this.windowContainer.width * 0.5) - (container.width * 0.5);
            container.y = titleText.y + titleText.height + padding;
            this.totalKills = gameMode.getKills();
            var headshotMult = 1;
            var accuracyMult = 1;
            if (gameMode["id"] == TacticalWeaponPack.GameModeDatabase.GAME_SNIPER) {
                headshotMult = 2;
                accuracyMult = 2;
            }
            var score = gameMode.getKills();
            score += gameMode.getHeadshots() * headshotMult;
            if (time >= 0) {
                var timeMax = 1200;
                score += 50 * Math.max(1, 1 - (time / timeMax));
            }
            score *= accuracyMult + accuracy;
            if (gameMode["id"] == TacticalWeaponPack.GameModeDatabase.GAME_SNIPER) {
                score *= 0.5 * accuracy;
            }
            score = Math.round(score);
            this.score = score;
            var scoreStat = new TacticalWeaponPack.GameStat("Total Score", score.toString(), 32);
            scoreStat.x = (this.windowContainer.width * 0.5) - (scoreStat.width * 0.5);
            scoreStat.y = container.y + container.height + padding;
            this.windowContainer.add(scoreStat);
            var starContainer = this.game.add.group();
            var placements = TacticalWeaponPack.GameUtil.GetPlacementColours().reverse();
            var placementIndex = TacticalWeaponPack.GameModeDatabase.GetRankForScore(modeData["id"], this.score);
            for (var i = 0; i < placements.length; i++) {
                var star = this.game.add.image(0, 0, "atlas_ui", "icon_star");
                star.x = i * star.width;
                starContainer.add(star);
                if (i <= placementIndex) {
                    star.tint = placements[placementIndex];
                }
                else {
                    star.alpha = 0.1;
                }
            }
            starContainer.x = (this.windowContainer.width * 0.5) - (starContainer.width * 0.5);
            starContainer.y = scoreStat.y + scoreStat.height + padding;
            this.windowContainer.add(starContainer);
            var lastBestScore = TacticalWeaponPack.PlayerUtil.GetRankedData()["bestScores"][gameMode["id"]];
            var bNewBest = score > lastBestScore;
            if (bNewBest) {
                TacticalWeaponPack.PlayerUtil.GetRankedData()["bestScores"][gameMode["id"]] = score;
            }
            TacticalWeaponPack.PlayerUtil.GetRankedData()["bestScores"][TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS] += this.totalKills;
            var bestText = this.game.add.text(0, 0, bNewBest ? "New personal best!" : "Your personal best: " + lastBestScore, { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: bNewBest ? TacticalWeaponPack.ColourUtil.COLOUR_GREEN_STRING : "#CCCCCC" });
            bestText.x = (this.windowContainer.width * 0.5) - (bestText.width * 0.5);
            bestText.y = starContainer.y + starContainer.height + padding;
            this.windowContainer.add(bestText);
            var xpBonus = TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"] * 3;
            xpBonus += gameMode.getKills();
            xpBonus += gameMode.getHeadshots() * 2;
            xpBonus += Math.min(50, (gameMode.getShotsHit() * accuracy));
            xpBonus += 50 * accuracy;
            xpBonus = Math.round(xpBonus);
            TacticalWeaponPack.PlayerUtil.AddXP(xpBonus);
            var xpStat = new TacticalWeaponPack.GameStat("XP Bonus", "+" + TacticalWeaponPack.GameUtil.FormatNum(xpBonus) + "XP");
            xpStat.x = (this.windowContainer.width * 0.5) - (accuracyStat.width * 0.5);
            xpStat.y = bestText.y + bestText.height + (padding * 2);
            this.windowContainer.add(xpStat);
            var rankBar = new TacticalWeaponPack.RankBar(this.windowContainer.width * 0.6);
            rankBar.x = (this.windowContainer.width * 0.5) - (rankBar.width * 0.5);
            rankBar.y = xpStat.y + xpStat.height + padding;
            this.windowContainer.add(rankBar);
            var buttons = this.game.add.group();
            var butWidth = this.windowContainer.width - 8;
            this.submitButton = new TacticalWeaponPack.MenuButton(butWidth, "center");
            this.submitButton.setCallback(this.onSubmitClicked, this);
            this.submitButton.setLabelText("Submit Score: Sign In Required");
            this.submitButton.setEnabled(TacticalWeaponPack.APIUtil.IsLoggedIn());
            if (TacticalWeaponPack.APIUtil.IsLoggedIn()) {
                this.onSubmitClicked();
            }
            else if (!TacticalWeaponPack.APIUtil.HasLeaderboards()) {
                this.submitButton.setLabelText("Leaderboards Unavailable");
            }
            buttons.add(this.submitButton);
            this.restartButton = new TacticalWeaponPack.MenuButton(butWidth, "center");
            this.restartButton.setCallback(this.onRestartClicked, this);
            this.restartButton.setLabelText("Try Again");
            this.restartButton.y = buttons.height + 4;
            buttons.add(this.restartButton);
            this.quitButton = new TacticalWeaponPack.MenuButton(butWidth, "center", TacticalWeaponPack.ColourUtil.COLOUR_RED_QUIT);
            this.quitButton.setCallback(this.onQuitClicked, this);
            this.quitButton.setLabelText("Quit");
            this.quitButton.y = buttons.height + 4;
            buttons.add(this.quitButton);
            buttons.x = (this.windowContainer.width * 0.5) - (buttons.width * 0.5);
            buttons.y = this.windowContainer.height - buttons.height - 4;
            this.windowContainer.add(buttons);
            if (TacticalWeaponPack.APIUtil.HasLeaderboards()) {
                this.restartButton.setEnabled(false);
                this.quitButton.setEnabled(false);
            }
            var items = [
                killsStat,
                headshotsStat,
                accuracyStat,
                timeStat,
                scoreStat,
                starContainer,
                bestText,
                xpStat,
                rankBar
            ];
            var showTime = 350;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item) {
                    item.alpha = 0;
                    var tween = this.game.add.tween(item).to({ alpha: 1 }, showTime, Phaser.Easing.Exponential.Out, true, showTime + (i * 50));
                    if (i == items.length - 1) {
                        tween.onComplete.add(this.onTweenComplete, this, 0, [TacticalWeaponPack.APIUtil.HasLeaderboards() ? "tween_init" : "tween_2"]);
                    }
                }
            }
            var tween = this.game.add.tween(this.windowContainer).from({ alpha: 0 }, showTime, Phaser.Easing.Exponential.Out, true);
            //tween.onComplete.add(this.onTweenComplete, this, 0, ["tween_init"]);
        };
        GameOverMenu.prototype.onTweenComplete = function (_param1, _param2, _id) {
            if (_id == "tween_init") {
                var tween = this.game.add.tween(this.windowContainer).to({ x: 10 }, 800, Phaser.Easing.Exponential.Out, true);
                this.createLeaderboards();
                var desiredX = this.leaderboardsContainer.x;
                this.leaderboardsContainer.x = (this.game.width * 0.5) - (this.leaderboardsContainer.width * 0.5);
                var tween = this.game.add.tween(this.leaderboardsContainer).to({ x: desiredX, alpha: 1 }, 800, Phaser.Easing.Exponential.Out, true);
                tween.onComplete.add(this.onTweenComplete, this, 0, ["tween_2"]);
            }
            else if (_id == "tween_2") {
                if (this.leaderboards) {
                    this.leaderboards.loadScores(TacticalWeaponPack.GameUtil.GetGameState().getData()["gameMode"]);
                }
                this.onComplete();
            }
        };
        GameOverMenu.prototype.onComplete = function () {
            this.restartButton.setEnabled(true);
            this.quitButton.setEnabled(true);
        };
        GameOverMenu.prototype.createLeaderboards = function () {
            var titleText = this.game.add.text(0, 4, "Leaderboards", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(titleText);
            this.leaderboards = new GameLeaderboards();
            this.leaderboardsContainer = this.game.add.group();
            var gfx = this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            var padding = 40;
            gfx.drawRect(0, 0, this.leaderboards.width + padding, this.windowContainer.height);
            this.leaderboardsContainer.add(gfx);
            titleText.x = (this.leaderboardsContainer.width * 0.5) - (titleText.width * 0.5);
            this.leaderboardsContainer.add(titleText);
            this.leaderboards.x = (gfx.width * 0.5) - (this.leaderboards.width * 0.5);
            this.leaderboards.y = titleText.y + titleText.height + (padding * 0.5);
            this.leaderboardsContainer.add(this.leaderboards);
            this.leaderboardsContainer.x = this.game.width - this.leaderboardsContainer.width - 10;
            this.leaderboardsContainer.y = (this.game.height * 0.5) - (this.leaderboardsContainer.height * 0.5);
            this.add(this.leaderboardsContainer);
            var buttons = TacticalWeaponPack.GameUtil.CreateSocialButtons();
            buttons.x = (this.leaderboardsContainer.width * 0.5) - (buttons.width * 0.5);
            buttons.y = this.leaderboards.y + this.leaderboards.height + 10;
            this.leaderboardsContainer.add(buttons);
            this.leaderboardsContainer.alpha = 0;
        };
        GameOverMenu.prototype.onSubmitClicked = function () {
            this.submitButton.setEnabled(false);
            this.submitButton.setLabelText("Score Submitted!");
            this.submitButton.setIcon(this.game.add.image(0, 0, "atlas_ui", "icon_checkmark"));
            TacticalWeaponPack.APIUtil.SubmitScore(TacticalWeaponPack.GameUtil.GetGameState().getData()["gameMode"], this.score);
            if (this.leaderboards) {
                var timer = this.game.time.create();
                timer.add(1000, this.leaderboards.refresh, this.leaderboards);
                timer.start();
            }
            /* Total kills */
            TacticalWeaponPack.APIUtil.SubmitScore(TacticalWeaponPack.GameModeDatabase.GAME_TOTAL_KILLS, this.totalKills);
        };
        GameOverMenu.prototype.onRestartClicked = function () {
            this.setOnCloseCallback(TacticalWeaponPack.GameUtil.game.restartGame, TacticalWeaponPack.GameUtil.game);
            this.close();
        };
        GameOverMenu.prototype.onQuitClicked = function () {
            this.setOnCloseCallback(TacticalWeaponPack.GameUtil.game.loadMenu, TacticalWeaponPack.GameUtil.game, [MainMenu.MENU_RANKED]);
            this.close();
        };
        return GameOverMenu;
    }(MenuBase));
    TacticalWeaponPack.GameOverMenu = GameOverMenu;
    var PauseMenu = /** @class */ (function (_super) {
        __extends(PauseMenu, _super);
        function PauseMenu() {
            var _this = _super.call(this) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0.5);
            gfx.drawRect(0, 0, _this.game.width, _this.game.height);
            _this.add(gfx);
            var splash = _this.game.add.image(0, 0, TacticalWeaponPack.GameUtil.GetRandomMenuImageId());
            splash.alpha = 0.2;
            _this.add(splash);
            _this.add(new TacticalWeaponPack.FXFilter());
            _this.textContainer = _this.game.add.group();
            _this.titleText = _this.game.add.text(0, 0, "Paused", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.titleText);
            _this.textContainer.add(_this.titleText);
            _this.descText = _this.game.add.text(0, 0, "", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            TacticalWeaponPack.GameUtil.SetTextShadow(_this.descText);
            _this.descText.x = _this.titleText.x + _this.titleText.width + 8;
            _this.textContainer.add(_this.descText);
            _this.textContainer.y = 10;
            _this.add(_this.textContainer);
            var agButton = new TacticalWeaponPack.ImageButton("sponsor_ag_button");
            agButton.setCallback(TacticalWeaponPack.GameUtil.OpenAGHomepage, TacticalWeaponPack.GameUtil);
            agButton.x = 10;
            agButton.y = 10;
            _this.add(agButton);
            var volumeToggler = new TacticalWeaponPack.VolumeToggler();
            volumeToggler.x = _this.game.width - volumeToggler.width - 10;
            volumeToggler.y = 10;
            _this.add(volumeToggler);
            _this.container = _this.game.add.group();
            _this.container.y = _this.titleText.y + _this.titleText.height + 20;
            _this.add(_this.container);
            _this.loadMenu(PauseMenu.MENU_DEFAULT);
            return _this;
        }
        PauseMenu.prototype.destroy = function () {
            this.titleText = null;
            this.descText = null;
            _super.prototype.destroy.call(this);
        };
        PauseMenu.prototype.setDescText = function (_val) {
            if (_val) {
                this.titleText.alpha = 0.1;
                this.descText.setText(_val, true);
            }
            else {
                this.titleText.alpha = 1;
                this.descText.setText("", true);
            }
            this.descText.x = this.titleText.x + this.titleText.width + 8;
            this.textContainer.x = (this.width * 0.5) - (this.textContainer.width * 0.5);
        };
        PauseMenu.prototype.refreshMenu = function () {
            if (this.currentMenu == PauseMenu.MENU_DEFAULT) {
                var settingsBox = this.container.getByName("settingsBox");
                var settingsContainer = settingsBox.getByName("settingsContainer");
                var gameVolume = settingsContainer.getByName("gameVolume");
                gameVolume.getSlider().setValue(TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] * 10, true);
                var musicVolume = settingsContainer.getByName("musicVolume");
                musicVolume.getSlider().setValue(TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] * 10, true);
            }
        };
        PauseMenu.prototype.loadMenu = function (_id) {
            this.container.removeAll(true);
            this.currentMenu = _id;
            if (_id == PauseMenu.MENU_DEFAULT) {
                this.setDescText(null);
                var buttonAlign = "center";
                var buttonWidth = 300;
                var buttonPadding = 4;
                var buttons = this.game.add.group();
                this.add(buttons);
                var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
                if (gameMode instanceof TacticalWeaponPack.GameMode_Range) {
                    var weaponButton = new TacticalWeaponPack.MenuButton(buttonWidth, buttonAlign);
                    weaponButton.setCallback(this.onChangeWeaponClicked, this);
                    //weaponButton.setLabelText("Select Weapon");
                    buttons.add(weaponButton);
                    var char = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                    var item = char.getCurrentInventoryItem();
                    var weaponIcon = this.game.add.image(0, 0, "atlas_weapons", item["id"]);
                    weaponButton.setIcon(weaponIcon, "center");
                }
                var resumeButton = new TacticalWeaponPack.MenuButton(buttonWidth, buttonAlign);
                resumeButton.setCallback(this.onResumeClicked, this);
                resumeButton.setLabelText("Resume");
                resumeButton.y = buttons.height + (buttons.height > 0 ? buttonPadding : 0);
                buttons.add(resumeButton);
                var bShowXP = false; //gameMode.usesXP();
                if (bShowXP) {
                    var rankBar = new TacticalWeaponPack.RankBar();
                    rankBar.x = (this.game.width * 0.5) - (rankBar.width * 0.5);
                    rankBar.y = this.game.height - rankBar.height - 10 - this.container.y;
                    this.container.add(rankBar);
                }
                var restartButton = new TacticalWeaponPack.MenuButton(buttonWidth, buttonAlign);
                restartButton.setCallback(this.onRestartClicked, this);
                restartButton.setLabelText("Restart");
                restartButton.y = buttons.height + buttonPadding;
                buttons.add(restartButton);
                var quitButton = new TacticalWeaponPack.MenuButton(buttonWidth, buttonAlign, TacticalWeaponPack.ColourUtil.COLOUR_RED_QUIT);
                quitButton.setCallback(this.onQuitClicked, this);
                quitButton.setLabelText("Quit");
                quitButton.y = buttons.height + buttonPadding;
                buttons.add(quitButton);
                buttons.x = (this.game.width * 0.5) - (buttons.width * 0.5) - (this.container.x * 2);
                this.container.add(buttons);
                var boxWidth = 600;
                var boxHeight = 124;
                var gameContainer = this.game.add.group();
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x000000, 0.5);
                gfx.drawRect(0, 0, boxWidth, boxHeight);
                gameContainer.add(gfx);
                var modeIcon = this.game.add.image(0, 0, "atlas_ui", gameMode.getId());
                modeIcon.scale.set(0.5, 0.5);
                modeIcon.x = 20;
                modeIcon.y = (gfx.height * 0.5) - (modeIcon.height * 0.5);
                gameContainer.add(modeIcon);
                var gameTextContainer = this.game.add.group();
                gameContainer.add(gameTextContainer);
                var gameModeData = TacticalWeaponPack.GameModeDatabase.GetGameMode(gameMode.getId());
                var modeText = this.game.add.text(0, 0, gameModeData["name"], { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                gameTextContainer.add(modeText);
                var modeDescText = this.game.add.text(0, 0, gameModeData["desc"], { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                modeDescText.y = gameTextContainer.height;
                gameTextContainer.add(modeDescText);
                gameTextContainer.x = modeIcon.x + modeIcon.width + 20;
                gameTextContainer.y = (modeIcon.y + (modeIcon.height * 0.5)) - (gameTextContainer.height * 0.5);
                gameContainer.x = (this.game.width * 0.5) - (gameContainer.width * 0.5);
                gameContainer.y = this.container.height + 20;
                this.container.add(gameContainer);
                var settingsBox = this.game.add.group();
                settingsBox.name = "settingsBox";
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x000000, 0.5);
                gfx.drawRect(0, 0, boxWidth, boxHeight);
                settingsBox.add(gfx);
                this.container.add(settingsBox);
                var settingsContainer = this.game.add.group();
                settingsContainer.name = "settingsContainer";
                settingsBox.add(settingsContainer);
                var sliderWidth = gfx.width * 0.6;
                var gameVolume = new TacticalWeaponPack.Modifier("gameVolume", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                    label: "Game Volume",
                    w: sliderWidth,
                    min: 0,
                    max: 10,
                    increment: 1,
                    value: TacticalWeaponPack.PlayerUtil.GetSettingsData()["gameVolume"] * 10
                });
                gameVolume.name = "gameVolume";
                gameVolume.setUpdateCallback(TacticalWeaponPack.PlayerUtil.SetGameVolume, TacticalWeaponPack.PlayerUtil);
                settingsContainer.add(gameVolume);
                var musicVolume = new TacticalWeaponPack.Modifier("musicVolume", TacticalWeaponPack.Modifier.MODIFIER_SLIDER, {
                    label: "Music Volume",
                    w: sliderWidth,
                    min: 0,
                    max: 10,
                    increment: 1,
                    value: TacticalWeaponPack.PlayerUtil.GetSettingsData()["musicVolume"] * 10
                });
                musicVolume.name = "musicVolume";
                musicVolume.setUpdateCallback(TacticalWeaponPack.PlayerUtil.SetMusicVolume, TacticalWeaponPack.PlayerUtil);
                musicVolume.y = gameVolume.y + gameVolume.height + 4;
                settingsContainer.add(musicVolume);
                settingsContainer.x = (settingsBox.width * 0.5) - (settingsContainer.width * 0.5);
                settingsContainer.y = (settingsBox.height * 0.5) - (settingsContainer.height * 0.5);
                settingsBox.x = (this.width * 0.5) - (settingsBox.width * 0.5);
                settingsBox.y = this.container.height + 4;
                var bottomContainer = this.game.add.group();
                var gfx = this.game.add.graphics();
                gfx.beginFill(0x000000, 1);
                gfx.drawRect(0, 0, this.game.width, 50);
                bottomContainer.add(gfx);
                var buttons = TacticalWeaponPack.GameUtil.CreateSocialButtons();
                buttons.x = (bottomContainer.width * 0.5) - (buttons.width * 0.5);
                buttons.y = (bottomContainer.height * 0.5) - (buttons.height * 0.5);
                bottomContainer.add(buttons);
                this.container.add(bottomContainer);
                bottomContainer.y = this.game.height - bottomContainer.height - this.container.y;
            }
            else if (_id == PauseMenu.MENU_WEAPONS) {
                this.setDescText("Select Weapon");
                var char = TacticalWeaponPack.GameUtil.GetGameState().getPlayerPawn();
                var item = char.getCurrentInventoryItem();
                var itemSelector = new ItemSelector(false);
                itemSelector.x = 10;
                var types = [
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_PISTOL,
                        label: "Pistols"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_MACHINE_PISTOL,
                        label: "Machine Pistols"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_SMG,
                        label: "SMGs"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_RIFLE,
                        label: "Assault Rifles"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_SNIPER,
                        label: "Sniper Rifles"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN,
                        label: "Shotguns"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_LMG,
                        label: "LMGs"
                    },
                    {
                        id: TacticalWeaponPack.WeaponDatabase.TYPE_LAUNCHER,
                        label: "Launchers"
                    }
                ];
                itemSelector.setCurrentItemId(item["id"]);
                itemSelector.setWeaponTypes(types, item["type"]);
                this.container.add(itemSelector);
                var backButton = new TacticalWeaponPack.TextButton("< Back", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                backButton.setCallback(this.loadMenu, this, [PauseMenu.MENU_DEFAULT]);
                backButton.x = itemSelector.x;
                backButton.y = this.game.height - backButton.height - this.container.y;
                this.container.add(backButton);
            }
            this.container.alpha = 0;
            var tween = this.game.add.tween(this.container).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true);
        };
        PauseMenu.prototype.onResumeClicked = function () {
            TacticalWeaponPack.GameUtil.GetGameState().setPaused(false);
        };
        PauseMenu.prototype.onChangeWeaponClicked = function () {
            this.loadMenu(PauseMenu.MENU_WEAPONS);
        };
        PauseMenu.prototype.onQuitClicked = function () {
            TacticalWeaponPack.GameUtil.game.createWindow({
                titleText: "Quit",
                type: Window.TYPE_YES_NO,
                messageText: "Are you sure you want to quit this game?",
                yesCallback: TacticalWeaponPack.GameUtil.game.loadMenu,
                yesCallbackContext: TacticalWeaponPack.GameUtil.game,
                yesCallbackParams: [MainMenu.MENU_RANKED]
            });
        };
        PauseMenu.prototype.onRestartClicked = function () {
            TacticalWeaponPack.GameUtil.game.createWindow({
                titleText: "Restart",
                type: Window.TYPE_YES_NO,
                messageText: "Are you sure you want to restart this game?",
                yesCallback: TacticalWeaponPack.GameUtil.game.restartGame,
                yesCallbackContext: TacticalWeaponPack.GameUtil.game
            });
        };
        PauseMenu.MENU_DEFAULT = "MENU_DEFAULT";
        PauseMenu.MENU_WEAPONS = "MENU_WEAPONS";
        return PauseMenu;
    }(MenuBase));
    TacticalWeaponPack.PauseMenu = PauseMenu;
    var SetKeyMenu = /** @class */ (function (_super) {
        __extends(SetKeyMenu, _super);
        function SetKeyMenu(_keyId, _callback, _callbackContext) {
            var _this = _super.call(this) || this;
            _this.keyId = _keyId;
            _this.callback = _callback;
            _this.callbackContext = _callbackContext;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0.5);
            gfx.drawRect(0, 0, _this.game.width, _this.game.height);
            _this.add(gfx);
            var closeButton = new TacticalWeaponPack.ImageButton("atlas_ui", "icon_close");
            closeButton.setCallback(_this.close, _this);
            closeButton.x = _this.width - closeButton.width - 10;
            closeButton.y = 10;
            _this.add(closeButton);
            var totalWidth = _this.width * 0.5;
            var container = _this.game.add.group();
            var bg = _this.game.add.graphics();
            bg.beginFill(0xFFFFFF, 0);
            bg.drawRect(0, 0, totalWidth, 100);
            container.add(bg);
            _this.add(container);
            var infoText = _this.game.add.text(0, 0, "Press key to assign", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center" });
            infoText.x = (totalWidth * 0.5) - (infoText.width * 0.5);
            infoText.alpha = 0.8;
            container.add(infoText);
            var text = _this.game.add.text(0, 0, TacticalWeaponPack.PlayerUtil.GetKeyDescription(_keyId).toUpperCase(), { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, boundsAlignH: "center" });
            TacticalWeaponPack.GameUtil.SetTextShadow(text);
            text.x = (totalWidth * 0.5) - (text.width * 0.5);
            text.y = infoText.height;
            container.add(text);
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 1);
            gfx.drawRect(0, 0, 24, 2);
            gfx.x = (totalWidth * 0.5) - (gfx.width * 0.5);
            gfx.y = text.y + text.height + 24;
            container.add(gfx);
            var tween = _this.game.add.tween(gfx).to({ alpha: 0 }, 150, Phaser.Easing.Exponential.InOut, true, 0, Number.MAX_VALUE, true);
            container.x = (_this.width * 0.5) - (container.width * 0.5);
            container.y = (_this.height * 0.5) - (container.height * 0.5);
            _this.messageText = _this.game.add.text(0, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.messageText.setTextBounds(0, 0, _this.width, 20);
            _this.messageText.y = container.y + container.height + 20;
            _this.add(_this.messageText);
            _this.show();
            return _this;
        }
        SetKeyMenu.prototype.destroy = function () {
            this.callback = null;
            this.callbackContext = null;
            TacticalWeaponPack.GameUtil.game.input.keyboard.onDownCallback = null;
            TacticalWeaponPack.GameUtil.game.input.keyboard.callbackContext = null;
            TacticalWeaponPack.GameUtil.game.onSetKeyMenuDestroyed();
            _super.prototype.destroy.call(this);
        };
        SetKeyMenu.prototype.show = function () {
            _super.prototype.show.call(this);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_window_open");
        };
        SetKeyMenu.prototype.close = function () {
            _super.prototype.close.call(this);
            TacticalWeaponPack.SoundManager.PlayUISound("ui_window_close");
        };
        SetKeyMenu.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            TacticalWeaponPack.GameUtil.game.input.keyboard.onDownCallback = this.onKeySet;
            TacticalWeaponPack.GameUtil.game.input.keyboard.callbackContext = this;
        };
        SetKeyMenu.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            this.destroy();
        };
        SetKeyMenu.prototype.onKeySet = function (_event) {
            console.log("onKeySet " + _event.keyCode);
            var invalid = [
                Phaser.Keyboard.ESC,
                Phaser.Keyboard.ONE,
                Phaser.Keyboard.TWO
            ];
            if (_event.keyCode == invalid[0]) {
                this.close();
            }
            else if (invalid.indexOf(_event.keyCode) >= 0) {
                TacticalWeaponPack.SoundManager.PlayUISound("ui_error");
                this.messageText.setText("INVALID KEY", true);
                this.messageText.alpha = 1;
                var tween = this.game.add.tween(this.messageText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.InOut, true);
            }
            else {
                this.game.input.keyboard.onDownCallback = null;
                this.game.input.keyboard.callbackContext = null;
                var controls = TacticalWeaponPack.PlayerUtil.GetControlsData();
                controls[this.keyId] = _event.keyCode;
                TacticalWeaponPack.GameUtil.game.savePlayerData();
                TacticalWeaponPack.SoundManager.PlayUISound("ui_confirm");
                if (this.callback) {
                    this.callback.apply(this.callbackContext);
                }
                this.close();
            }
        };
        return SetKeyMenu;
    }(ElementBase));
    TacticalWeaponPack.SetKeyMenu = SetKeyMenu;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
var TacticalWeaponPack;
(function (TacticalWeaponPack) {
    var HUD = /** @class */ (function (_super) {
        __extends(HUD, _super);
        function HUD() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.blocker = _this.game.add.image(0, 0, "blocker");
            _this.blocker.width = _this.game.width;
            _this.blocker.height = _this.game.height;
            _this.add(_this.blocker);
            _this.crosshair = new Crosshair();
            _this.add(_this.crosshair);
            _this.createInventoryInfo();
            _this.createGameInfo();
            _this.createMiddleInfo();
            _this.createPlayerInfo();
            _this.createKeyInfo();
            _this.sponsorButton = new TacticalWeaponPack.ImageButton("sponsor_ag_small");
            _this.sponsorButton.setCallback(TacticalWeaponPack.GameUtil.OpenAGHomepage, TacticalWeaponPack.GameUtil);
            _this.sponsorButton.x = 10;
            _this.sponsorButton.y = _this.game.height - _this.sponsorButton.height - 10;
            _this.add(_this.sponsorButton);
            _this.targetInfos = [];
            TacticalWeaponPack.GameUtil.game.addUIElement(_this);
            _this.setHasPawn(false);
            var gradient = _this.game.add.image(0, 0, "gradient");
            _this.add(gradient);
            return _this;
        }
        HUD.prototype.destroy = function () {
            this.blocker = null;
            this.crosshair = null;
            this.addRankNotifier = null;
            this.targetInfos = null;
            this.inventoryInfo = null;
            this.playerInfo = null;
            this.gameInfo = null;
            TacticalWeaponPack.GameUtil.game.removeUIElement(this);
            _super.prototype.destroy.call(this);
        };
        HUD.prototype.tick = function () {
            if (this.crosshair) {
                this.crosshair.x = this.game.input.activePointer.x;
                this.crosshair.y = this.game.input.activePointer.y;
                this.crosshair.tick();
            }
            if (this.targetInfos) {
                for (var i = 0; i < this.targetInfos.length; i++) {
                    var cur = this.targetInfos[i];
                    var pawn = cur.getPawn();
                    if (pawn) {
                        var offset = 2;
                        var padding = 20;
                        var desiredX = (pawn.x - this.game.world.camera.x) - (cur.width * 0.5);
                        var desiredY = (pawn.y - this.game.world.camera.y) - (cur.height * 0.5) - 30;
                        desiredX *= this.game.world.scale.x;
                        desiredY *= this.game.world.scale.y;
                        var checkX = (this.game.width - padding - (cur.width * 0.5)) - offset;
                        cur.x = Math.max(offset, Math.min(checkX, desiredX));
                        var checkY = (this.game.height - padding - (cur.height * 0.5)) - offset;
                        cur.y = Math.max(offset, Math.min(checkY, desiredY));
                        if (cur.x == checkX || cur.x == offset) {
                            cur.setOffScreen(true);
                        }
                        else if (cur.y == checkY || cur.y == offset) {
                            cur.setOffScreen(true);
                        }
                        else {
                            cur.setOffScreen(false);
                        }
                        cur.getHealthBar().setValue(pawn.getHealthPercent());
                        if (pawn.isAlive() && pawn.destroyTimerIsEnabled()) {
                            cur.showTimeBar();
                            cur.getTimeBar().setValue(pawn.getDestroyTimer() / pawn.getDestroyTimerMax());
                        }
                        cur.visible = pawn.isAlive();
                    }
                }
            }
        };
        HUD.prototype.show = function () {
            this.visible = true;
            this.crosshair.show();
        };
        HUD.prototype.hide = function () {
            this.visible = false;
            this.crosshair.hide();
        };
        HUD.prototype.setBlockerVisible = function (_bVal) {
            var tween = this.game.add.tween(this.blocker).to({ alpha: _bVal ? 1 : 0 }, 200, Phaser.Easing.Exponential.Out, true);
            if (_bVal) {
                this.crosshair.hide();
                this.crosshair.setCanFire(false);
            }
            else {
                this.crosshair.show();
                this.crosshair.setCanFire(true);
            }
        };
        HUD.prototype.addCountdownText = function (_val) {
            if (_val) {
                var text = this.game.add.text(0, 0, _val, { font: "72px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                TacticalWeaponPack.GameUtil.SetTextShadow(text);
                text.anchor.set(0.5, 0.5);
                text.x = this.game.width * 0.5;
                text.y = this.game.height * 0.5;
                this.add(text);
                var tween = this.game.add.tween(text).from({ y: this.game.height }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Back.InOut, true);
                var tween = this.game.add.tween(text).from({ alpha: 0 }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Exponential.InOut, true);
                tween.onComplete.addOnce(this.onTweenComplete, this, 0, text, false);
                TacticalWeaponPack.SoundManager.PlayUISound("ui_countdown", 0.5);
            }
        };
        HUD.prototype.onTweenComplete = function (_param1, _param2, _text, _bDestroy) {
            if (_text) {
                if (_bDestroy) {
                    _text.destroy();
                }
                else {
                    var tween = this.game.add.tween(_text).to({ y: 0 }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Back.InOut, true);
                    var tween = this.game.add.tween(_text).to({ alpha: 0 }, HUD.COUNTDOWN_SPEED, Phaser.Easing.Exponential.InOut, true);
                    tween.onComplete.addOnce(this.onTweenComplete, this, 0, _text, true);
                }
            }
        };
        HUD.prototype.addXPNotifier = function (_x, _y, _value, _bHeadshot) {
            var xp = new XPNotifier(_x, _y, _value, _bHeadshot);
            TacticalWeaponPack.GameUtil.GetGameState().addToWorld(xp, TacticalWeaponPack.State_Game.INDEX_PAWNS);
        };
        HUD.prototype.addRankNotifier = function (_data) {
            if (!this.rankNotifier) {
                this.rankNotifier = new RankNotifier();
                this.rankNotifier.x = (this.game.width * 0.5) - (this.rankNotifier.width * 0.5);
                this.rankNotifier.y = (this.middleInfo ? this.middleInfo.y + this.middleInfo.height : 0) + 10;
                this.rankNotifier.setDesiredY(this.rankNotifier.y);
                this.add(this.rankNotifier);
            }
            this.rankNotifier.pushToQueue(_data);
        };
        HUD.prototype.onPawnAdded = function (_pawn) {
            if (_pawn.isPlayer()) {
                return;
            }
            for (var i = 0; i < this.targetInfos.length; i++) {
                var cur = this.targetInfos[i];
                if (cur.getPawn() == _pawn) {
                    return;
                }
            }
            var pawnInfo = new HUDTargetInfo();
            pawnInfo.setPawn(_pawn);
            this.targetInfos.push(pawnInfo);
            this.addAt(pawnInfo, 0);
        };
        HUD.prototype.onPawnRemoved = function (_pawn) {
            for (var i = 0; i < this.targetInfos.length; i++) {
                var cur = this.targetInfos[i];
                if (cur.getPawn() == _pawn) {
                    cur.destroy();
                    this.targetInfos.splice(i, 1);
                }
            }
        };
        HUD.prototype.createInventoryInfo = function () {
            this.inventoryInfo = new InventoryInfo();
            this.inventoryInfo.x = 10;
            this.inventoryInfo.y = 10;
            this.add(this.inventoryInfo);
        };
        HUD.prototype.createGameInfo = function () {
            this.gameInfo = new GameInfo();
            this.gameInfo.x = this.game.width - this.gameInfo.width - 10;
            this.gameInfo.y = 10;
            this.add(this.gameInfo);
        };
        HUD.prototype.createMiddleInfo = function () {
            this.middleInfo = new MiddleInfo();
            this.middleInfo.x = (this.game.width * 0.5) - (this.middleInfo.width * 0.5);
            this.middleInfo.y = 10;
            this.add(this.middleInfo);
        };
        HUD.prototype.createPlayerInfo = function () {
            this.playerInfo = new PlayerInfo();
            this.playerInfo.x = (this.game.width * 0.5) - (this.playerInfo.width * 0.5);
            this.playerInfo.y = (this.game.height) - (this.playerInfo.height) - 10;
            this.add(this.playerInfo);
        };
        HUD.prototype.createKeyInfo = function () {
            this.keyInfo = new KeyInfo();
            this.keyInfo.x = (this.game.width * 0.5) - (this.keyInfo.width * 0.5);
            this.keyInfo.y = (this.game.height) - (this.keyInfo.height) - 60;
            this.add(this.keyInfo);
        };
        HUD.prototype.getCrosshair = function () {
            return this.crosshair;
        };
        HUD.prototype.getMiddleInfo = function () {
            return this.middleInfo;
        };
        HUD.prototype.getPlayerInfo = function () {
            return this.playerInfo;
        };
        HUD.prototype.getKeyInfo = function () {
            return this.keyInfo;
        };
        HUD.prototype.setHasPawn = function (_bVal) {
            this.inventoryInfo.visible = _bVal;
            if (_bVal) {
                this.crosshair.show();
            }
            else {
                this.crosshair.hide();
            }
        };
        HUD.prototype.getInventoryInfo = function () {
            return this.inventoryInfo;
        };
        HUD.prototype.getGameInfo = function () {
            return this.gameInfo;
        };
        HUD.COUNTDOWN_SPEED = 400;
        HUD.BACKGROUND_ALPHA = 0.8;
        return HUD;
    }(Phaser.Group));
    TacticalWeaponPack.HUD = HUD;
    var Crosshair = /** @class */ (function (_super) {
        __extends(Crosshair, _super);
        function Crosshair() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.size = 4;
            _this.recoil = 0;
            _this.bReloading = false;
            _this.bCanFire = false;
            var graphics = _this.game.add.graphics(0, 0);
            graphics.beginFill(0xFFFFFF, 0.18);
            graphics.drawCircle(0, 0, 200);
            _this.recoilCircle = _this.game.add.image(0, 0, graphics.generateTexture());
            graphics.destroy();
            _this.recoilCircle.anchor.set(0.5, 0.5);
            _this.addChild(_this.recoilCircle);
            var graphics = _this.game.add.graphics();
            graphics.beginFill(0xFFFFFF, 1);
            var size = 2;
            graphics.drawCircle(-size * 0.5, -size * 0.5, size);
            _this.dot = _this.game.add.image(0, 0, graphics.generateTexture());
            graphics.destroy();
            _this.dot.anchor.set(0.5, 0.5);
            _this.addChild(_this.dot);
            _this.addChild(_this.recoilCircle);
            _this.dot2 = _this.game.add.image(0, 0, "atlas_ui", "icon_close");
            _this.dot2.anchor.set(0.5, 0.5);
            _this.addChild(_this.dot2);
            _this.reloadGraphics = _this.game.add.graphics();
            _this.reloadGraphics.rotation = -90 * TacticalWeaponPack.MathUtil.TO_RADIANS;
            _this.add(_this.reloadGraphics);
            _this.setNeedsReload(false);
            _this.setCanFire(true);
            return _this;
        }
        Crosshair.prototype.destroy = function () {
            this.dot = null;
            this.dot2 = null;
            this.recoilCircle = null;
            this.reloadGraphics = null;
            this.checkmark = null;
            if (this.checkmarkTween) {
                this.checkmarkTween.stop();
                this.checkmarkTween = null;
            }
            _super.prototype.destroy.call(this);
        };
        Crosshair.prototype.tick = function () {
            var useSize = !this.bCanFire ? 8 : this.size;
            this.recoil -= (this.recoil - useSize) * 0.15;
            this.recoilCircle.scale.x = this.recoilCircle.scale.y = Math.min(this.recoil * 0.02, 6);
        };
        Crosshair.prototype.setNeedsReload = function (_bVal) {
            var bWasVisible = false; //this.reloadContainer.visible;
            //this.reloadContainer.visible = _bVal;
            if (_bVal && !bWasVisible) {
                //this.reloadContainer.alpha = 0.5;
                //var tween = this.game.add.tween(this.reloadContainer).to({ alpha: 0.1 }, 200, Phaser.Easing.Cubic.InOut, true, 0, Number.MAX_VALUE, true);
            }
        };
        Crosshair.prototype.setSize = function (_val) {
            this.size = Math.max(3, _val);
        };
        Crosshair.prototype.addRecoil = function (_val) {
            this.recoil += Math.min(_val, 60);
        };
        Crosshair.prototype.setCanFire = function (_bVal) {
            this.bCanFire = _bVal;
            this.dot.visible = _bVal;
            this.dot2.visible = !_bVal;
            this.recoilCircle.alpha = _bVal ? 0.5 : 0.1;
            if (_bVal && !this.bReloading) {
                //this.reloadBar.alpha = 0;
            }
        };
        Crosshair.prototype.onReloadComplete = function () {
            if (!this.checkmark) {
                this.checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
                this.checkmark.tint = TacticalWeaponPack.ColourUtil.COLOUR_GREEN;
                this.checkmark.anchor.set(0.5, 0.5);
                this.add(this.checkmark);
            }
            this.checkmark.y = 40;
            this.checkmark.alpha = 1;
            if (this.checkmarkTween) {
                this.checkmarkTween.stop();
            }
            this.checkmarkTween = this.game.add.tween(this.checkmark).to({ alpha: 0, y: this.checkmark.y + 30 }, 350, Phaser.Easing.Exponential.InOut, true);
        };
        Crosshair.prototype.setReloading = function (_bVal) {
            var bPrev = this.bReloading;
            this.bReloading = _bVal;
            if (!_bVal) {
                this.reloadGraphics.clear();
            }
            if (this.bReloading) {
                this.setNeedsReload(false);
            }
        };
        Crosshair.prototype.setReloadingPercentage = function (_val) {
            this.reloadGraphics.clear();
            if (_val > 0 && _val < 1) {
                var desiredColor = Phaser.Color.linearInterpolation([0xFFFFFF, TacticalWeaponPack.ColourUtil.COLOUR_GREEN], _val);
                this.reloadGraphics.lineStyle(4, desiredColor, 0.8);
                this.reloadGraphics.arc(0, 0, 40, 0, (360 * TacticalWeaponPack.MathUtil.TO_RADIANS) * _val, false);
            }
        };
        Crosshair.prototype.show = function () {
            this.visible = true;
            TacticalWeaponPack.GameUtil.game.showMouse(false);
        };
        Crosshair.prototype.hide = function () {
            this.visible = false;
            this.setReloading(false);
            TacticalWeaponPack.GameUtil.game.showMouse(true);
        };
        return Crosshair;
    }(Phaser.Group));
    TacticalWeaponPack.Crosshair = Crosshair;
    var HUDElement = /** @class */ (function (_super) {
        __extends(HUDElement, _super);
        function HUDElement() {
            return _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
        }
        return HUDElement;
    }(Phaser.Group));
    TacticalWeaponPack.HUDElement = HUDElement;
    var KeyInfo = /** @class */ (function (_super) {
        __extends(KeyInfo, _super);
        function KeyInfo() {
            var _this = _super.call(this) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            gfx.drawRect(0, 0, 180, 40);
            _this.add(gfx);
            var bRange = TacticalWeaponPack.GameUtil.GetGameState().getGameMode() instanceof TacticalWeaponPack.GameMode_Range;
            var container = _this.game.add.group();
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0xFFFFFF, 0.5);
            gfx.drawRect(0, 0, 30, 30);
            var key = _this.game.add.image(0, 0, gfx.generateTexture());
            container.add(key);
            gfx.destroy();
            var keyText = _this.game.add.text(0, 2, bRange ? "Esc" : "F", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            keyText.setTextBounds(key.x, key.y, key.width, key.height);
            container.add(keyText);
            var infoText = _this.game.add.text(key.x + key.width + 8, 0, bRange ? "Change current weapon" : "Use barrel attachment", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            infoText.y = (key.height * 0.5) - (infoText.height * 0.5) + 2;
            container.add(infoText);
            _this.add(container);
            container.x = 6;
            container.y = (_this.height * 0.5) - (container.height * 0.5);
            _this.visible = false;
            return _this;
        }
        KeyInfo.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        KeyInfo.prototype.show = function () {
            this.visible = true;
            this.alpha = 1;
            var tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true, 4000);
            tween.onComplete.addOnce(this.onHide, this);
        };
        KeyInfo.prototype.onHide = function () {
            this.visible = false;
        };
        return KeyInfo;
    }(HUDElement));
    TacticalWeaponPack.KeyInfo = KeyInfo;
    var PlayerInfo = /** @class */ (function (_super) {
        __extends(PlayerInfo, _super);
        function PlayerInfo() {
            var _this = _super.call(this) || this;
            _this.rankBar = new TacticalWeaponPack.RankBar(_this.game.width * 0.6);
            _this.add(_this.rankBar);
            if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode().usesXP()) {
                _this.updateXP();
                _this.updateRank();
            }
            else {
                _this.rankBar.visible = false;
            }
            return _this;
        }
        PlayerInfo.prototype.destroy = function () {
            this.rankBar = null;
            _super.prototype.destroy.call(this);
        };
        PlayerInfo.prototype.updateForCurrentPlayer = function () {
            this.rankBar.updateForCurrentPlayer();
        };
        PlayerInfo.prototype.updateXP = function () {
            this.rankBar.updateXP();
        };
        PlayerInfo.prototype.updateRank = function () {
            this.rankBar.updateRank();
        };
        return PlayerInfo;
    }(HUDElement));
    TacticalWeaponPack.PlayerInfo = PlayerInfo;
    var GameInfo = /** @class */ (function (_super) {
        __extends(GameInfo, _super);
        function GameInfo() {
            var _this = _super.call(this) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            gfx.drawRect(0, 0, InventoryInfo.MAX_WIDTH, 80);
            _this.add(gfx);
            var container = _this.game.add.group();
            var leftTitle = _this.game.add.text(0, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            leftTitle.setTextBounds(0, 0, _this.width * 0.5, 20);
            leftTitle.y = 4;
            container.add(leftTitle);
            _this.leftText = _this.game.add.text(0, 0, "", { font: "24px " + TacticalWeaponPack.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.leftText.setTextBounds(0, 4, _this.width * 0.5, _this.height);
            container.add(_this.leftText);
            var rightTitle = _this.game.add.text(_this.width * 0.5, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            rightTitle.setTextBounds(0, 0, _this.width * 0.5, 20);
            rightTitle.y = 4;
            container.add(rightTitle);
            _this.rightText = _this.game.add.text(_this.width * 0.5, 0, "", { font: "24px " + TacticalWeaponPack.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.rightText.setTextBounds(0, 4, _this.width * 0.5, _this.height);
            container.add(_this.rightText);
            var gameMode = TacticalWeaponPack.GameUtil.GetGameState().getGameMode();
            if (gameMode instanceof TacticalWeaponPack.GameMode_Range) {
                leftTitle.setText("Kills", true);
                rightTitle.setText("Shots Fired", true);
            }
            else if (gameMode instanceof TacticalWeaponPack.GameMode_Sniper) {
                leftTitle.setText("Targets", true);
                rightTitle.setText("Accuracy", true);
            }
            else if (gameMode instanceof TacticalWeaponPack.RankedGameMode) {
                leftTitle.setText("Kills", true);
                rightTitle.setText("Accuracy", true);
            }
            container.y = (_this.height * 0.5) - (container.height * 0.5);
            _this.add(container);
            return _this;
        }
        GameInfo.prototype.destroy = function () {
            this.leftText = null;
            this.rightText = null;
            _super.prototype.destroy.call(this);
        };
        GameInfo.prototype.customUpdate = function (_data) {
            if (_data) {
                if (_data["kills"] != undefined) {
                    this.updateLeftText(_data["kills"]);
                }
                if (_data["targetsRemaining"] != undefined) {
                    this.updateLeftText(_data["targetsRemaining"]);
                }
                if (_data["shotsFired"] != undefined) {
                    this.updateRightText(_data["shotsFired"]);
                }
                if (_data["accuracy"] != undefined) {
                    this.updateRightText(_data["accuracy"]);
                }
            }
        };
        GameInfo.prototype.updateLeftText = function (_val) {
            var str = ("00000" + _val).slice(-5);
            this.leftText.setText(str, true);
            var bIgnore = false;
            for (var i = 0; i < str.length; i++) {
                if (bIgnore) {
                    this.leftText.addColor("#FFFFFF", i);
                }
                else {
                    if (str.charAt(i) == "0") {
                        this.leftText.addColor("#333333", i);
                    }
                    else {
                        this.leftText.addColor("#FFFFFF", i);
                        bIgnore = true;
                    }
                }
            }
            //this.leftText.setText(_val, true);
        };
        GameInfo.prototype.updateRightText = function (_val) {
            if (_val.indexOf("%") >= 0) {
                this.rightText.setText(_val, true);
                this.rightText.addColor("#FFFFFF", 0);
            }
            else {
                var str = ("00000" + _val).slice(-5);
                this.rightText.setText(str, true);
                var bIgnore = false;
                for (var i = 0; i < str.length; i++) {
                    if (bIgnore) {
                        this.rightText.addColor("#FFFFFF", i);
                    }
                    else {
                        if (str.charAt(i) == "0") {
                            this.rightText.addColor("#333333", i);
                        }
                        else {
                            this.rightText.addColor("#FFFFFF", i);
                            bIgnore = true;
                        }
                    }
                }
            }
            //this.rightText.setText(_val, true);
        };
        return GameInfo;
    }(HUDElement));
    TacticalWeaponPack.GameInfo = GameInfo;
    var MiddleInfo = /** @class */ (function (_super) {
        __extends(MiddleInfo, _super);
        function MiddleInfo() {
            var _this = _super.call(this) || this;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            gfx.drawRect(0, 0, 200, 40);
            _this.bg = _this.game.add.image(0, 0, gfx.generateTexture());
            _this.add(_this.bg);
            gfx.destroy();
            if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode().getId() == TacticalWeaponPack.GameModeDatabase.GAME_RANGE) {
                var container = _this.game.add.group();
                var gfx = _this.game.add.graphics();
                gfx.beginFill(0xFFFFFF, 0.5);
                gfx.drawRect(0, 0, 90, 30);
                var key = _this.game.add.image(0, 0, gfx.generateTexture());
                container.add(key);
                gfx.destroy();
                var keyText = _this.game.add.text(0, 2, TacticalWeaponPack.GameUtil.GetKeyStringFromId(TacticalWeaponPack.PlayerUtil.GetControlsData()[TacticalWeaponPack.PlayerUtil.CONTROL_ACTION]), { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                keyText.setTextBounds(key.x, key.y, key.width, key.height);
                container.add(keyText);
                var infoText = _this.game.add.text(key.x + key.width + 10, 0, "Create target", { font: "14px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                infoText.y = (key.height * 0.5) - (infoText.height * 0.5) + 2;
                container.add(infoText);
                _this.add(container);
                container.x = 6;
                container.y = (_this.bg.height * 0.5) - (container.height * 0.5);
            }
            else if (TacticalWeaponPack.GameUtil.GetGameState().getGameMode().getId() == TacticalWeaponPack.GameModeDatabase.GAME_DEFENDER) {
                _this.healthBar = new TacticalWeaponPack.UIBar({
                    w: _this.width * 0.8,
                    h: 8,
                    bInterpColour: true,
                    colours: TacticalWeaponPack.ColourUtil.GetHealthColours(),
                    tweenFunc: Phaser.Easing.Exponential.Out
                });
                _this.healthBar.x = (_this.width * 0.5) - (_this.healthBar.width * 0.5);
                _this.healthBar.y = (_this.height * 0.5) - (_this.healthBar.height * 0.5);
                _this.add(_this.healthBar);
                _this.healthBar.setValue(1);
            }
            else {
                _this.timeText = _this.game.add.text(0, 0, "", { font: "24px " + TacticalWeaponPack.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
                _this.timeText.setTextBounds(0, 4, _this.width, _this.height);
                _this.add(_this.timeText);
                _this.updateTimeText(0, false);
            }
            return _this;
        }
        MiddleInfo.prototype.destroy = function () {
            this.healthBar = null;
            this.bg = null;
            this.stopTween();
            this.timeText = null;
            _super.prototype.destroy.call(this);
        };
        MiddleInfo.prototype.stopTween = function () {
            if (this.tween) {
                this.tween.stop();
                this.tween = null;
            }
            if (this.timeText) {
                this.timeText.alpha = 1;
            }
        };
        MiddleInfo.prototype.updateTimeText = function (_val, _bTimeLimited) {
            if (!this.timeText) {
                return;
            }
            this.timeText.setText(TacticalWeaponPack.GameUtil.ConvertToTimeString(_val), true);
            if (_bTimeLimited) {
                if (_val == 0) {
                    this.stopTween();
                }
                else if (_val == 1) {
                    this.timeText.addColor(TacticalWeaponPack.ColourUtil.COLOUR_RED_STRING, 0);
                    this.stopTween();
                    this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 100, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
                }
                else if (_val == 5) {
                    this.timeText.addColor(TacticalWeaponPack.ColourUtil.COLOUR_RED_STRING, 0);
                    this.stopTween();
                    this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 250, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
                }
                else if (_val == 10) {
                    this.timeText.addColor(TacticalWeaponPack.ColourUtil.COLOUR_RED_STRING, 0);
                    this.stopTween();
                    this.tween = this.game.add.tween(this.timeText).to({ alpha: 0.35 }, 500, Phaser.Easing.Exponential.Out, true, 0, Number.MAX_VALUE, true);
                }
            }
        };
        MiddleInfo.prototype.updateHealthBar = function (_val) {
            if (this.healthBar) {
                this.healthBar.setValue(_val);
            }
        };
        return MiddleInfo;
    }(HUDElement));
    TacticalWeaponPack.MiddleInfo = MiddleInfo;
    var InventoryInfo = /** @class */ (function (_super) {
        __extends(InventoryInfo, _super);
        function InventoryInfo() {
            var _this = _super.call(this) || this;
            _this.bg = _this.game.add.graphics();
            _this.bg.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            _this.bg.drawRect(0, 0, InventoryInfo.MAX_WIDTH, InventoryInfo.MAX_HEIGHT);
            _this.add(_this.bg);
            _this.weaponText = _this.game.add.text(0, 0, "", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.weaponText.setTextBounds(0, 0, _this.bg.width, 20);
            _this.weaponText.y = 4;
            _this.add(_this.weaponText);
            _this.magText = _this.game.add.text(0, 0, "0", { font: "24px " + TacticalWeaponPack.FontUtil.FONT_HUD, fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle" });
            _this.magText.setTextBounds(0, 4, _this.bg.width, _this.bg.height);
            _this.add(_this.magText);
            _this.fireModeContainer = _this.game.add.group();
            var padding = 11;
            var semiText = _this.game.add.text(0, 0, "SEMI", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            semiText.name = TacticalWeaponPack.WeaponDatabase.MODE_SEMI;
            _this.fireModeContainer.add(semiText);
            var burstText = _this.game.add.text(0, 0, "BURST", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            burstText.name = TacticalWeaponPack.WeaponDatabase.MODE_BURST;
            burstText.y = semiText.y + padding;
            _this.fireModeContainer.add(burstText);
            var autoText = _this.game.add.text(0, 0, "AUTO", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
            autoText.name = TacticalWeaponPack.WeaponDatabase.MODE_AUTO;
            autoText.y = burstText.y + padding;
            _this.fireModeContainer.add(autoText);
            _this.fireModeContainer.x = 4;
            _this.fireModeContainer.y = (_this.height * 0.5) - (_this.fireModeContainer.height * 0.5);
            _this.add(_this.fireModeContainer);
            _this.ammoContainer = _this.game.add.group();
            _this.add(_this.ammoContainer);
            _this.rounds = [];
            _this.grenadeContainer = _this.game.add.group();
            _this.add(_this.grenadeContainer);
            _this.grenades = [];
            _this.inventory = _this.game.add.group();
            _this.add(_this.inventory);
            return _this;
        }
        InventoryInfo.prototype.destroy = function () {
            this.fireModeContainer = null;
            this.weaponText = null;
            this.magText = null;
            this.weaponIcon = null;
            this.ammoContainer = null;
            this.rounds = null;
            this.inventory = null;
            _super.prototype.destroy.call(this);
        };
        InventoryInfo.prototype.updateAmmo = function (_mag, _magMax) {
            var lowMax = _mag / _magMax;
            var lowRatio = 1 / 2;
            var bLowAmmo = lowMax < lowRatio;
            var lowAmmoColour = Phaser.Color.interpolateColor(TacticalWeaponPack.ColourUtil.COLOUR_RED, 0xFFFFFF, lowRatio, lowMax);
            var str = ("000" + _mag).slice(-3);
            this.magText.setText(str, true);
            var bIgnore = false;
            for (var i = 0; i < str.length; i++) {
                if (bIgnore) {
                    this.magText.addColor("#FFFFFF", i);
                }
                else {
                    if (str.charAt(i) == "0") {
                        this.magText.addColor("#333333", i);
                    }
                    else {
                        this.magText.addColor("#FFFFFF", i);
                        bIgnore = true;
                    }
                }
            }
            for (var i = 0; i < this.rounds.length; i++) {
                var round = this.rounds[i];
                round.alpha = i < _mag ? 1 : 0.2;
                if (bLowAmmo) {
                    round.tint = lowAmmoColour;
                }
                else {
                    round.tint = 0xFFFFFF;
                }
            }
        };
        InventoryInfo.prototype.updateGrenadeAmmo = function (_val, _max) {
            var lowMax = _val / _max;
            var lowRatio = 1 / 2;
            var bLowAmmo = lowMax < lowRatio;
            var lowAmmoColour = Phaser.Color.interpolateColor(TacticalWeaponPack.ColourUtil.COLOUR_RED, 0xFFFFFF, lowRatio, lowMax);
            for (var i = 0; i < this.grenades.length; i++) {
                var grenade = this.grenades[i];
                grenade.alpha = i < _val ? 1 : 0.2;
                if (bLowAmmo) {
                    grenade.tint = lowAmmoColour;
                }
                else {
                    grenade.tint = 0xFFFFFF;
                }
            }
        };
        InventoryInfo.prototype.updateSkills = function (_skills) {
            /*
            for (var i = 0; i < _skills.length; i++)
            {
                var icon = this.game.add.image(0, 0, "atlas_ui", _skills[i]);
                icon.alpha = 0.5;
                icon.scale.set(0.5, 0.5);
                icon.x = InventoryInfo.MAX_WIDTH + 4;
                icon.y = (InventoryInfo.MAX_HEIGHT * 0.5) - (icon.height * 0.5);
                this.add(icon);
            }
            */
        };
        InventoryInfo.prototype.setFireMode = function (_val) {
            for (var i = 0; i < this.fireModeContainer.length; i++) {
                var text = this.fireModeContainer.getAt(i);
                if (text) {
                    text.alpha = text.name == _val ? 0.8 : 0.2;
                }
            }
        };
        InventoryInfo.prototype.updateWeapon = function (_data) {
            if (_data) {
                this.weaponText.setText(_data["name"], true);
                this.setFireMode(_data["mode"]);
                //this.weaponIcon.frameName = _data["id"];
                this.ammoContainer.removeAll(true);
                this.grenadeContainer.removeAll(true);
                this.rounds = [];
                var roundWidth = 2;
                var roundHeight = 4;
                if (_data["magSize"] == 1) {
                    roundWidth = 4;
                }
                else if (_data["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SHOTGUN) {
                    roundWidth = 8;
                }
                else if (_data["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_SNIPER) {
                    roundHeight = 8;
                }
                if (_data["type"] == TacticalWeaponPack.WeaponDatabase.TYPE_LAUNCHER) {
                    roundWidth = 18;
                    roundHeight = 6;
                }
                var xCount = 0;
                var yCount = 0;
                for (var i = 0; i < _data["magSize"]; i++) {
                    if (xCount >= 50) {
                        xCount = 0;
                        yCount++;
                    }
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(0xFFFFFF, 1);
                    gfx.drawRect(0, 0, roundWidth, roundHeight);
                    //gfx.x = i * (roundWidth + 2);
                    gfx.x = xCount * (roundWidth + 2);
                    gfx.y = yCount * (roundHeight + 2);
                    this.ammoContainer.add(gfx);
                    this.rounds.push(gfx);
                    xCount++;
                }
                this.ammoContainer.x = (InventoryInfo.MAX_WIDTH * 0.5) - (this.ammoContainer.width * 0.5);
                this.ammoContainer.y = InventoryInfo.MAX_HEIGHT - this.ammoContainer.height - 8;
                this.updateAmmo(_data["mag"], _data["magSize"]);
                if (_data["grenades"] != undefined) {
                    this.ammoContainer.y -= 6;
                    this.grenades = [];
                    var roundWidth = 8;
                    var roundHeight = 6;
                    var xCount = 0;
                    var yCount = 0;
                    for (var i = 0; i < _data["grenadesMax"]; i++) {
                        if (xCount >= 50) {
                            xCount = 0;
                            yCount++;
                        }
                        var gfx = this.game.add.graphics();
                        gfx.beginFill(0xFFFFFF, 1);
                        gfx.drawRect(0, 0, roundWidth, roundHeight);
                        gfx.x = xCount * (roundWidth + 2);
                        gfx.y = yCount * (roundHeight + 2);
                        this.grenadeContainer.add(gfx);
                        this.grenades.push(gfx);
                        xCount++;
                    }
                    this.grenadeContainer.x = (InventoryInfo.MAX_WIDTH * 0.5) - (this.grenadeContainer.width * 0.5);
                    this.grenadeContainer.y = this.ammoContainer.y + this.ammoContainer.height + 4;
                    this.updateGrenadeAmmo(_data["grenades"], _data["grenadesMax"]);
                }
            }
        };
        InventoryInfo.prototype.updateInventory = function (_arr) {
            this.inventory.removeAll(true);
            for (var i = 0; i < _arr.length; i++) {
                var wpnHeight = 50;
                var group = this.game.add.group();
                var item = this.game.add.image(0, 0, "atlas_weapons", _arr[i]["id"]);
                item.y = (wpnHeight * 0.5) - (item.height * 0.5);
                group.add(item);
                var text = this.game.add.text(0, 0, "[ " + (i + 1) + " ]", { font: "12px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                TacticalWeaponPack.GameUtil.SetTextShadow(text);
                text.x = (item.width * 0.5) - (text.width * 0.5);
                text.y = wpnHeight;
                group.add(text);
                group.x = this.inventory.width + (i > 0 ? 20 : 0);
                this.inventory.add(group);
            }
            this.inventory.x = (InventoryInfo.MAX_WIDTH * 0.5) - (this.inventory.width * 0.5);
            this.inventory.y = this.bg.height;
        };
        InventoryInfo.prototype.updateInventoryIndex = function (_val) {
            if (this.inventory) {
                for (var i = 0; i < this.inventory.length; i++) {
                    var item = this.inventory.getAt(i);
                    if (_val == i) {
                        item.alpha = 1;
                    }
                    else {
                        item.alpha = 0.2;
                    }
                }
            }
        };
        InventoryInfo.MAX_WIDTH = 230;
        InventoryInfo.MAX_HEIGHT = 80;
        return InventoryInfo;
    }(HUDElement));
    TacticalWeaponPack.InventoryInfo = InventoryInfo;
    var HUDTargetInfo = /** @class */ (function (_super) {
        __extends(HUDTargetInfo, _super);
        function HUDTargetInfo() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.arrowSize = 4;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            gfx.drawRect(0, 0, 40, 8);
            _this.gfxOffScreen = _this.game.add.image(0, 0, gfx.generateTexture());
            _this.add(_this.gfxOffScreen);
            gfx.destroy();
            gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, HUD.BACKGROUND_ALPHA);
            gfx.drawRect(0, 0, 40, 8);
            var arrowY = 8;
            gfx.drawPolygon([
                [20 - _this.arrowSize, arrowY],
                [20 + _this.arrowSize, arrowY],
                [20, arrowY + _this.arrowSize]
            ]);
            _this.gfxDefault = _this.game.add.image(0, 0, gfx.generateTexture());
            _this.add(_this.gfxDefault);
            gfx.destroy();
            _this.healthBar = new TacticalWeaponPack.UIBar({
                w: _this.width - 8,
                h: 2,
                bInterpColour: true,
                colours: TacticalWeaponPack.ColourUtil.GetHealthColours()
            });
            _this.bars = _this.game.add.group();
            _this.add(_this.bars);
            _this.bars.add(_this.healthBar);
            _this.updateBars();
            _this.visible = false;
            return _this;
        }
        HUDTargetInfo.prototype.destroy = function () {
            this.gfxDefault = null;
            this.gfxOffScreen = null;
            this.healthBar = null;
            this.pawn = null;
            _super.prototype.destroy.call(this);
        };
        HUDTargetInfo.prototype.showTimeBar = function () {
            if (!this.timeBar) {
                this.timeBar = new TacticalWeaponPack.UIBar({
                    w: this.width - 8,
                    h: 2,
                    barColour: 0x448FE5
                });
                this.timeBar.y = this.healthBar.y + this.healthBar.height + 1;
                this.bars.add(this.timeBar);
            }
            this.updateBars();
        };
        HUDTargetInfo.prototype.updateBars = function () {
            this.bars.x = 4;
            this.bars.y = (((this.height * 0.5) - (this.bars.height * 0.5)) - (this.arrowSize * 0.5));
        };
        HUDTargetInfo.prototype.setPawn = function (_pawn) {
            this.pawn = _pawn;
        };
        HUDTargetInfo.prototype.getPawn = function () {
            return this.pawn;
        };
        HUDTargetInfo.prototype.getHealthBar = function () {
            return this.healthBar;
        };
        HUDTargetInfo.prototype.getTimeBar = function () {
            return this.timeBar;
        };
        HUDTargetInfo.prototype.setOffScreen = function (_bVal) {
            this.gfxOffScreen.visible = _bVal;
            this.gfxDefault.visible = !_bVal;
            this.alpha = _bVal ? 0.2 : 1;
        };
        return HUDTargetInfo;
    }(Phaser.Group));
    TacticalWeaponPack.HUDTargetInfo = HUDTargetInfo;
    var XPNotifier = /** @class */ (function (_super) {
        __extends(XPNotifier, _super);
        function XPNotifier(_x, _y, _value, _bHeadshot) {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.x = _x;
            _this.y = _y;
            _this.xpText = _this.game.add.text(0, 0, "+" + _value + "XP", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING, align: "center" });
            _this.add(_this.xpText);
            //GameUtil.SetTextShadow(this.xpText);
            if (_bHeadshot) {
                var star = _this.game.add.image(0, 0, "atlas_ui", "icon_star");
                star.x = (_this.xpText.width * 0.5) - (star.width * 0.5);
                star.y = -star.height;
                star.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
                _this.add(star);
            }
            _this.x -= _this.width * 0.5;
            _this.y -= _this.height * 0.5;
            var tween = _this.game.add.tween(_this).to({ y: _this.y - 30, alpha: 0 }, 750, Phaser.Easing.Exponential.In, true);
            return _this;
        }
        XPNotifier.prototype.destroy = function () {
            this.xpText = null;
            _super.prototype.destroy.call(this);
        };
        return XPNotifier;
    }(Phaser.Group));
    TacticalWeaponPack.XPNotifier = XPNotifier;
    var RankNotifier = /** @class */ (function (_super) {
        __extends(RankNotifier, _super);
        function RankNotifier() {
            var _this = _super.call(this, TacticalWeaponPack.GameUtil.game) || this;
            _this.desiredY = 0;
            var gfx = _this.game.add.graphics();
            gfx.beginFill(0x000000, 0.8);
            gfx.drawRect(0, 0, InventoryInfo.MAX_WIDTH, 64);
            _this.add(_this.game.add.image(0, 0, gfx.generateTexture()));
            gfx.destroy();
            _this.container = _this.game.add.group();
            _this.add(_this.container);
            _this.alpha = 1;
            _this.queue = [];
            return _this;
        }
        RankNotifier.prototype.destroy = function () {
            this.container = null;
            this.queue = null;
            _super.prototype.destroy.call(this);
        };
        RankNotifier.prototype.setDesiredY = function (_val) {
            this.desiredY = _val;
        };
        RankNotifier.prototype.setData = function (_data) {
            this.container.removeAll(true);
            this.container.position.set(0, 0);
            if (_data["type"] == "rank") {
                var rankIcon = this.game.add.image(0, 0, "atlas_ui", TacticalWeaponPack.PlayerUtil.GetCurrentRankId());
                rankIcon.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
                this.container.add(rankIcon);
                var gfx = this.game.add.graphics();
                gfx.beginFill(0xFFFFFF, 0.1);
                gfx.drawRect(0, 0, rankIcon.width, rankIcon.height);
                var rankBg = this.game.add.image(0, 0, gfx.generateTexture());
                gfx.destroy();
                this.container.addAt(rankBg, 0);
                var rankText = this.game.add.text(0, 0, "1", { font: "24px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                rankText.x = rankIcon.x + rankIcon.width + 8;
                rankText.y = (rankIcon.height * 0.5) - (rankText.height * 0.5) + 2;
                this.container.add(rankText);
                rankText.setText(TacticalWeaponPack.PlayerUtil.GetRankedData()["rank"].toString(), true);
                rankIcon.frameName = TacticalWeaponPack.PlayerUtil.GetCurrentRankId();
                var text = this.game.add.text(0, 0, "Promoted!", { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                text.x = rankText.x + rankText.width + 20;
                text.y = (rankIcon.height * 0.5) - (text.height * 0.5) + 2;
                this.container.add(text);
            }
            else if (_data["type"] == "challenge") {
                var checkmark = this.game.add.image(0, 0, "atlas_ui", "icon_checkmark");
                checkmark.tint = TacticalWeaponPack.ColourUtil.COLOUR_XP;
                this.container.add(checkmark);
                var text = this.game.add.text(0, 0, _data["text"], { font: "16px " + TacticalWeaponPack.FontUtil.FONT, fill: "#FFFFFF" });
                text.x = checkmark.x + checkmark.width + 12;
                text.y = (checkmark.height * 0.5) - (text.height * 0.5) + 2;
                this.container.add(text);
                var xpText = this.game.add.text(0, 0, "+100XP", { font: "18px " + TacticalWeaponPack.FontUtil.FONT, fill: TacticalWeaponPack.ColourUtil.COLOUR_XP_STRING });
                xpText.x = text.x + text.width + 20;
                xpText.y = text.y;
                this.container.add(xpText);
                TacticalWeaponPack.SoundManager.PlayUISound("ui_challenge_complete", 0.5);
            }
            this.container.x = (this.width * 0.5) - (this.container.width * 0.5);
            this.container.y = (this.height * 0.5) - (this.container.height * 0.5) + 2;
        };
        RankNotifier.prototype.pushToQueue = function (_data) {
            this.queue.push(_data);
            if (this.queue.length == 1) {
                this.loadNextInQueue();
            }
        };
        RankNotifier.prototype.show = function () {
            this.y = this.desiredY + 100;
            var tween = this.game.add.tween(this).to({ alpha: 1, y: this.desiredY }, 500, Phaser.Easing.Exponential.Out, true);
            var timer = this.game.time.create();
            timer.add(3000, this.hide, this);
            timer.start();
        };
        RankNotifier.prototype.hide = function () {
            var tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
            tween.onComplete.addOnce(this.onHide, this);
        };
        RankNotifier.prototype.onHide = function () {
            this.queue.splice(0, 1);
            if (this.queue.length > 0) {
                this.loadNextInQueue();
            }
        };
        RankNotifier.prototype.loadNextInQueue = function () {
            this.setData(this.queue[0]);
            this.show();
        };
        return RankNotifier;
    }(Phaser.Group));
    TacticalWeaponPack.RankNotifier = RankNotifier;
})(TacticalWeaponPack || (TacticalWeaponPack = {}));
//# sourceMappingURL=TacticalWeaponPack.js.map