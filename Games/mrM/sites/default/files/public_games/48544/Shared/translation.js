if(!String.format)
{
	String.format = function (format)
	{
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function (match, number)
		{
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	};
}

//##############################################
//############# LANGUAGE OVERRIDE ##############
//##############################################
var languageOverride = "";
if(localStorage['languageOverride'])
{
	languageOverride = localStorage['languageOverride'];
}

function setNewLanguageOverride(newLanguage)
{
	if(languageOverride != newLanguage)
	{
		localStorage['languageOverride'] = newLanguage;
		languageOverride = newLanguage;

		if(chosen == -1)
		{
			//refresh game
			location.reload();
		}
		else if(isMobile())
		{
			savegame();
			location.reload();
		}
		else
		{
			alert(_("Reload the game to fully apply changes"));
		}
	}
}
//##############################################
//############# LOADING LANGUAGE ###############
//##############################################

var language = "english";
function loadLanguage()
{
	return "english";
}

var listOfAllTranslationsNeeded = [];

function _(format)
{
	var args = Array.prototype.slice.call(arguments, 1);
	return String.format.apply(null, [translate(format)].concat(args));
}

function actuallyUsedLanguage()
{
	if(languageOverride)
	{
		return languageOverride;
	}
	else
	{
		return language;
	}
}

function translate(format, toLanguage = "")
{
	return format;
}

//################### CHANGE HELPERS ##################
function patchTranslations(inputString, find, replace)
{
	for(var language in translations)
	{
		for(var sourceText in translations[language])
		{
			if(sourceText == inputString)
			{
				translations[language][sourceText] = translations[language][sourceText].replace(find, replace);
				translations[language][sourceText.replace(find, replace)] = translations[language][sourceText];
				delete translations[language][sourceText];
			}
		}
	}
}

function getFormattedTranslations()
{
	var outputString = "";
	for(var language in translations)
	{
		outputString += 'translations["' + language + '"] = {\r\n';
		for(var sourceText in translations[language])
		{
			outputString += '\t"' + sourceText + '": "' + translations[language][sourceText] + '",\r\n';
		}
		outputString += '};\r\n\r\n';
	}
	console.log(outputString);
}

function getUntranslatedForEachLanguage()
{
	var instructions = "(1) Please place the translated text on the right hand side in the quotes provided.\r\n" +
		"   For example:\r\n" +
		'       "Some text": "" would become "Some text": "Translated text in your language"\r\n' +
		'   Spanish example:\r\n' +
		'       "You gained $100": "Ganaste $100"\r\n' +
		'\r\n' +
		"(2) When the source has a {0} and a {1} these must be included in the translated results. They will be replaced with some text or values when rendered in the game.\r\n" +
		"   For example:\r\n" +
		'       "{0} minute timelapse": "{0} translated text"\r\n' +
		'   Spanish example:\r\n' +
		'       "You gained ${0}": "Ganaste ${0}"\r\n' +
		"\r\n" +
		"(3) Please provide the results back as a .txt file (NOT an excel or word file)\r\n" +
		"\r\n" +
		"(4) For game context please see the game being translated located here and just do your best:\r\n" +
		"    https://store.steampowered.com/app/1397920/MrMine/\r\n" +
		"    https://mrmine.com\r\n" +
		"    Youtube video of game: https://www.youtube.com/watch?v=j3252zzpWkE\r\n\r\n" +
		"(5) Following ALL these instructions will result in a nice tip.";

	for(language in translations)
	{
		var outputString = "";
		var wordsToTranslate = 0;
		for(var key in translations['empty'])
		{
			if(!translations[language].hasOwnProperty(key))
			{
				wordsToTranslate += key.split(" ").length;
				outputString += '"' + key + '": "",\r\n';
			}
		}
		outputString = "############## Words To Translate: " + wordsToTranslate + ' ##############\r\n########## Translate Everything Below This ###########\r\n######################################################\r\n\r\n' + outputString;
		outputString = "######################################################\r\n#################### Instructions ####################\r\n######################################################\r\n\r\n" + instructions + "\r\n\r\n######################################################\r\n" + outputString;
		saveContentToFile("../LanguageExports/" + language + ".txt", outputString)
	}
}

function findTranslationMistakes()
{
	for(language in translations)
	{
		if(language != 'empty')
		{
			for(var key in translations[language])
			{
				if(translations[language].hasOwnProperty(key))
				{
					for(var i = 0; i < 3; i++)
					{
						if(key.includes("{" + i + "}") && !translations[language][key].includes("{" + i + "}"))
						{
							console.log(language + " missing {" + i + "} for '" + key + "'");
						}
					}
					if(translations[language][key] == "")
					{
						console.log(language + " missing translation for '" + key + "'");
					}
				}
			}
		}
	}
}

//Source: https://stackoverflow.com/a/63520666
function characterIsSupported(character, font = getComputedStyle(document.body).fontFamily)
{
	//Create the canvases
	let testCanvas = document.createElement("canvas");
	let referenceCanvas = document.createElement("canvas");
	testCanvas.width = referenceCanvas.width = testCanvas.height = referenceCanvas.height = 150;

	//Render the characters
	let testContext = testCanvas.getContext("2d");
	let referenceContext = referenceCanvas.getContext("2d");
	testContext.font = referenceContext.font = "20px " + font;
	testContext.fillStyle = referenceContext.fillStyle = "black";
	testContext.fillText(character, 0, 100);
	referenceContext.fillText('\uffff', 0, 100);

	//Check if the canvases are identical
	var reducer = (previousValue, currentValue) => previousValue + currentValue;
	var testValue = testContext.getImageData(0, 0, 150, 150).data.reduce(reducer);
	var errorValue = referenceContext.getImageData(0, 0, 150, 150).data.reduce(reducer);
	if(testValue == 0)
	{
		console.log("zero: " + character);
	}
	return testValue != errorValue;
}

function checkLanguageFontCompatibility(language, font)
{
	var supported = 0;
	var checked = 0;
	var characterCached = [];

	for(var key in translations[language])
	{
		if(translations[language].hasOwnProperty(key))
		{
			for(var i = 0; i < translations[language][key].length; i++)
			{
				if(!characterCached.hasOwnProperty(translations[language][key][i]))
				{
					checked++;
					var isSupported = characterIsSupported(translations[language][key][i], font);
					characterCached[translations[language][key][i]] = isSupported;
					if(isSupported)
					{
						supported++;
					}
					else
					{
						console.log("error: " + translations[language][key][i]);
					}
				}
			}
		}
	}
	console.log(supported / checked);
}

function getTranslatedForEachLanguage(key)
{
	var logValue = key + "\r\n";
	for(var language in translations)
	{
		if(translations[language].hasOwnProperty(key))
		{
			logValue += language + "\t" + translations[language][key] + "\r\n";
		}
	}
	console.log(logValue);
}

function getTranslatedForEachLanguageMultiple(keys)
{
	var logValue = "";
	for(var language in translations)
	{
		logValue += language + "\r\n";
		for(var i = 0; i < keys.length; i++)
		{
			var key = keys[i];
			if(translations[language].hasOwnProperty(key))
			{
				logValue += '"' + key + '": "' + translations[language][key] + '",\r\n';
			}
		}
	}
	console.log(logValue);
}

var translations = [];

translations["english"] = {};
