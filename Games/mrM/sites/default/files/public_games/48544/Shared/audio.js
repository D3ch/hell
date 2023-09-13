var mute = 0;
var mutebuttons = 0;
var muteisotopes = 0;
var mutecapacity = 0;
var mainMusic = "Shared/Audio/newmusic.mp3";

var clickAudio = [new Audio("Shared/Audio/click1.wav"), new Audio("Shared/Audio/click2.wav"), new Audio("Shared/Audio/click3.wav"), new Audio("Shared/Audio/click4.wav"), new Audio("Shared/Audio/click5.wav")];
var clickMineral = [new Audio("Shared/Audio/clickmineral1new.mp3"), new Audio("Shared/Audio/clickmineral2new.mp3"), new Audio("Shared/Audio/clickmineral3new.mp3"), new Audio("Shared/Audio/clickmineral4new.mp3")];
var closeAudio = [new Audio("Shared/Audio/cliclack2.wav"), new Audio("Shared/Audio/cliclack3.wav")]
var buyAudio = new Audio("Shared/Audio/buy.wav");
var isotopeFoundAudio = new Audio("Shared/Audio/special.wav");
var failureAudio = new Audio("Shared/Audio/nope.wav");
var music = platform.initMusic();
var capacityFullAudio = new Audio("Shared/Audio/CapacityFull.mp3");
var armoryUpgradeAudio = new Audio("Shared/Audio/armoryupgrade.mp3");
var craftDrillAudio = new Audio("Shared/Audio/craftdrill.mp3");
var craftStructureAudio = new Audio("Shared/Audio/craftstructure.mp3");
var defeatBossAudio = new Audio("Shared/Audio/defeatboss.mp3");
var discoverMineralAudio = new Audio("Shared/Audio/discovermineral.mp3");
var droneReturnAudio = new Audio("Shared/Audio/dronereturn.mp3");
var hireAudio = new Audio("Shared/Audio/hire.mp3");
var questCollectAudio = new Audio("Shared/Audio/questcollect.mp3");
var questCompleteAudio = new Audio("Shared/Audio/questcomplete.mp3");
var sacrificeMineralAudio = new Audio("Shared/Audio/sacrificemineral.mp3");
var sacrificeWarped = new Audio("Shared/Audio/sacrificeWarped.mp3");
var sacrificeDivine = new Audio("Shared/Audio/sacrificeDivine.mp3");
var scientistCollectAudio = new Audio("Shared/Audio/scientistscollect.mp3");
var takeoffCountdownAudio = new Audio("Shared/Audio/takeoffcountdown.mp3");
var tradeAudio = new Audio("Shared/Audio/trade.mp3");
var caveAppearsAudio = new Audio("Shared/Audio/caveappears.mp3");
var caveCollapseAudio = new Audio("Shared/Audio/cavecollapse.mp3");
var chestGoldOpenAudio = new Audio("Shared/Audio/chestgoldopen.mp3");
var chestOpenAudio = new Audio("Shared/Audio/chestopen.mp3");
capacityFullAudio.volume = 0.05;

function setVolume()
{
	if(localStorage.getItem("mute") === null)
	{
		mute = 0;
		mutebuttons = 0;
		mutecapacity = 1;
		muteisotopes = 0;
		localStorage["mute"] = 0;
		localStorage["mutebuttons"] = 0;
		localStorage["mutecapacity"] = 1;
		localStorage["muteisotopes"] = 0;

	}
	else
	{
		mute = parseInt(localStorage["mute"]);
		mutebuttons = parseInt(localStorage["mutebuttons"]);
		mutecapacity = parseInt(localStorage["mutecapacity"]);
		muteisotopes = parseInt(localStorage["muteisotopes"]);
	}
	platform.toggleMusic();
}