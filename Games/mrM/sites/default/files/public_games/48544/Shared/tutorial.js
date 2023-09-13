var tutsection = 9;
var tutcoordinates = [[0, 0, 0, 0], [.1, .93, .2, .5, .5, .3], [.87, .883, .87, .5, .3, .3], [.87, .06, .87, .3, .5, .3], [.23, .6, .5, .5, .5, .3], [.44, .65, .5, .5, .5, .3], [.68, .6, .5, .5, .5, .3], [.057, .90, .5, .5, .5, .3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var tuts = [darkdot, darkdot, darkdot, darkdot, darkdot, darkdot, darkdot, darkdot, darkdot, tut9, tut10, tut11, tut12, tut13];
var tutsText = [
	"Welcome Mr.Mine, I know you are new to this company so the workers here will show you around",
	"Oh wow it's THE Mr.Mine. It's an honor! I'm Digger. I dig up minerals and collect them for you. All your minerals are shown on the top.",
	"I see you've noticed the drill that I made. A fine piece of machinery ain't she? She helps us get down to the lower levels in the mine. It might take a while but she'll get through.",
	"And here is where you can see how far the drill has gone.  The further down she goes, the better minerals there are.  And keep an eye out on your capacity levels.  You don't want to overload.",
	"Do you have max capacity yet? If so, come on in and I can sell your ores at the best prices.",
	"I can manage our team of diggers.  Hire more diggers and upgrade them with shiny new tools.  They'll need it!",
	"Don't listen to Digger, he didn't build the drill.  But she sure is a beaut'. I can help upgrade her if you give me the right resources.  Buy the blueprints and use the right amount of minerals to craft the pieces.  Then equip them from your INVENTORY.",
	"What did mechanic say about me? Well anyways, we're going to get pretty deep in the mine so use these arrows to move up or down the mine to check up on us. We might find something cool down there.",
	"Wow it seems like you already mined some minerals! You are a natural.",
	"My family was kidnapped by the monsters from below.<br><br>Please Mr.Mine, save our city.",
	"Henry get out of here. Go play with the other orphans or something. <br><br>I'm the mayor of this town. At one point many thousands of years ago our city was on the surface but due to tectonic shifts we were swallowed by Earth. Due to our advanced technology the city survived and even thrived.",
	"About 10 years ago our oil preserves began to run out. We got our best engineers to work on a solution.  The solution was a futuristic oil rig which uses Californium and the rare Polonium-3.<br><br>The problem began when we started drilling for oil using this machine. Suddenly monsters appeared and began to take out people and pull them below. We can only assume they are lost.",
	"Oh yeahhh they are lost mayor. Those monsters took them.<br><br>Those monsters won't be around long. I will eliminate them. I won't sleep or eat or breathe until they are found.<br><br>Bring me a weapon and I will make it strong. Bring me a monster and I will defeat it. TYRUS!",
	"Please I beg of you save our people and our culture.<br><br>You may use our technology (oil rig and mineral compressor) and our weapons refinery."
];
var tutsNames = [
	_("Manager"),
	_("Digger"),
	_("Digger"),
	_("Digger"),
	_("Seller"),
	_("Manager"),
	_("Mechanic"),
	_("Digger"),
	_("Digger"),
	_("Little Henry"),
	_("Mayor"),
	_("Mayor"),
	_("Tyrus III"),
	_("Mayor")
];
var story = 0;

var helphtml = [
	["", "", "<center><br>Message us at <a href='https://www.facebook.com/pages/Mrmine/250535311763103' target='_blank' title='opens in new window' alt='opens in new window'>Facebook</a></center>", "<center><br><b><a href='http://oblouk.com' target='_blank' title='opens in new window' alt='opens in new window'>Austin Oblouk</a></b>- College Student at CSUF, Programmer<br><br><b>Others</b>- See the <a href='http://mrmine.com/changelog.txt' target='_blank' title='opens in new window' alt='opens in new window'>changelog</a> to see other contributors.  You can get on the <a href='http://mrmine.com/changelog.txt' target='_blank' title='opens in new window' alt='opens in new window'>changelog</a> by sending us your art contribution on <a href='https://www.facebook.com/pages/Mrmine/250535311763103' target='_blank' title='opens in new window' alt='opens in new window'>Facebook</a>.<br><br>We love making games like <a href='http://drmeth.com' target='_blank' alt='Opens in new window' title='Opens in new window'>DrMeth</a>, <a href='http://onedungeon.com' target='_blank' alt='Opens in new window' title='Opens in new window'>OneDungeon</a>, and MrMine.</center>", "<center>More stuff.</center>", "<center>No known bugs currently.</center>", "<b><s>+Underground City</s></b><br>&nbsp;+Stock Market<br>&nbsp;<s>+Extended Story Line</s><br>&nbsp;+Show off your game advancement to get rewards<br><br><b><s>+Battle System</s></b><br>&nbsp;<s>+Battle underground Monsters</s><br><br><b>+More Quests</b><br><br><b>+Accomplishments</b><br><br><b>+Mineral Compressor</b><br><b><s>+Oil Extractor</s></b><br><br>We want to know what you want to see added. Tell us on facebook and if we use your suggestion you will be rewarded with tickets.", "<center><a href='https://www.facebook.com/pages/Mrmine/250535311763103' target='_blank'>Facebook</a><br><a href='http://drmeth.com' target='_blank'>DrMeth</a><br><a href='http://reddit.com/r/mrmine' target='_blank'>Reddit (Unofficial)</a><br><a href='http://onedungeon.com/' target='_blank'>OneDungeon</a><br></center>"],
];

function startUndergroundCityStory()
{
	changeViewedDepth(3);
	tutsection = 9;
	document.getElementById("TUTORIALD").style.visibility = "visible";
	document.getElementById("TUTORIALD").style.zIndex = 999;
	story = 1;
	renderDialogues();
}

//######################### ONE TIME DIALOGUE #########################
//All this needs refactored

var oneTimeDialogue = {
	"isActive": false,
	"name": "",
	"text": "",
	"image": null,
	"callback": null
};

function startFoundGolemDialogue()
{
	oneTimeDialogue.isActive = true;
	oneTimeDialogue.name = _("Golem");
	oneTimeDialogue.text = _("Come come in<br>Out of the light<br><br>You <i>must</i> buy something..");
	oneTimeDialogue.image = golem;
	oneTimeDialogue.callback = function ()
	{
		newNews(_("You unlocked Golem's shop!"), true);
		openUi(CraftingWindow);
	};
	document.getElementById("TUTORIALD").style.visibility = "visible";
	document.getElementById("TUTORIALD").style.zIndex = 999;
	renderDialogues();
}

function startFoundGidgetDialogue()
{
	oneTimeDialogue.isActive = true;
	oneTimeDialogue.name = _("Gidget");
	oneTimeDialogue.text = _("I'm Gi-Gidget an autobot<br>I wa-was made by those below.<br>A cave in damaged me and I need new parts.<br><br>Please b-buy from my collection so I can be restored.");
	oneTimeDialogue.image = gidget;
	oneTimeDialogue.callback = function ()
	{
		newNews(_("You unlocked Gidget's shop!"), true);
		openUi(CraftingWindow);
	};
	document.getElementById("TUTORIALD").style.visibility = "visible";
	document.getElementById("TUTORIALD").style.zIndex = 999;
	renderDialogues();
}

/*function startRandomGolemDialogue()
{

}

function startRandomGidgetDialogue()
{

}*/

function endOneTimeDialogue()
{
	oneTimeDialogue = {
		"isActive": false,
		"name": "",
		"text": "",
		"image": null,
		"callback": null
	};
	document.getElementById("TUTORIALD").style.visibility = "hidden";
	document.getElementById("TUTORIALD").style.zIndex = -1;
}