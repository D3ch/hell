function currentTime()
{
	return new Date().getTime();
}

//[inclusive,inclusive]
function rand(min, max)
{
	return Math.floor(min + (Math.random() * (max + 1 - min)));
}

//picks a random number in range but can be biased to the high or low end of the range.
//probabilityPower < 1 will result in numbers biased on the high end of the range
// > 1 will bias towards the low end of the range
function biasedRand(min, max, probabilityPower = .5)
{
	return Math.floor(min + ((max + 1 - min) * (Math.pow(Math.random(), probabilityPower))));
}

function randBigInt(min, max)
{
	var difference = (max - min);
	if(difference < Number.MAX_SAFE_INTEGER)
	{
		var result = rand(0, parseFloat(difference));
		return min + BigInt(result);
	}
	else
	{
		var randomValue = Math.random();
		return (min + doBigIntDecimalMultiplication(difference, randomValue));
	}
}

function getMaxOfArray(numArray)
{
	return Math.max.apply(null, numArray);
}

function calculateAverageOfArray(array)
{
	var total = 0;
	var count = 0;

	array.forEach(function (item, index)
	{
		total += item;
		count++;
	});

	return total / count;
}

function gaussianRand(mean = 0, stddev = 1, nsamples = 3)
{
	var run_total = 0;
	for(var i = 0; i < nsamples; i++)
	{
		run_total += Math.random();
	}
	return stddev * (run_total - nsamples / 2) / (nsamples / 2) + mean;
}

function doBigIntDecimalMultiplication(bigInt, decimal)
{
	var elevatedDecimal = Math.round(decimal * 10000);
	return (bigInt * BigInt(elevatedDecimal)) / 10000n;
}

function divideBigIntToDecimalNumber(numeratorBigInt, denominatorBigInt, decimalPlaces = 3)
{
	var elevator = Math.pow(10, decimalPlaces);
	var adjustedNumerator = numeratorBigInt * BigInt(elevator);
	var result = adjustedNumerator / denominatorBigInt;
	var resultAsSmallFloat = parseFloat(result);
	return resultAsSmallFloat / elevator;
}

function bigIntMin(...args)
{
	if(args.length < 1) {throw 'Min of empty list';}
	m = args[0];
	args.forEach(a => {if(a < m) {m = a} });
	return m;
}

function bigIntMax(...args)
{
	if(args.length < 1) {throw 'Max of empty list';}
	m = args[0];
	args.forEach(a => {if(a > m) {m = a} });
	return m;
}

function makeBigInt(value)
{
	if(value == undefined)
	{
		console.error("Undefined value cast attempt");
		return undefined;
	}
	if(typeof value == "bigint")
	{
		return value;
	}
	value = String(value);
	if(value.includes("e"))
	{
		var base = value.split("e")[0];
		var exponent = value.split("e")[1];
		var exponentiatedMultiplier = 10n ** BigInt(exponent);
		value = doBigIntDecimalMultiplication(exponentiatedMultiplier, base);
	}
	else if(value.includes("."))
	{
		value = value.substring(0, value.indexOf('.'));
	}
	return BigInt(value);
}

function shuffleArray(array)
{
	for(var i = array.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

/*
Returns an integer value some percent of the time based on the decimal % 1 value

Ex: 1.4 will return:
	1 - 60% of the time
	2 - 40% of the time
In other words there is a .4 in 1 chance of it rounding up
Sampling this function will return 1.4 on avg
*/
function randRoundToInteger(float)
{
	return Math.floor(float) + ((Math.random() < (float % 1)) ? 1 : 0);
}

function oscillate(currentTime, timeOnePass)
{
	return Math.abs(((currentTime / timeOnePass) % 2) - 1);
}

function lerp(start, end, t)
{
	return start + t * (end - start);
}

function formattedCountDown(secs)
{
	if(secs <= 0)
	{
		return "00:00:00";
	}
	else
	{
		var secsLeft = secs;
		if(typeof (secsLeft) == "bigint")
		{
			var hoursFormat = secsLeft / 3600n;
			secsLeft -= hoursFormat * 3600n;
			var minsFormat = secsLeft / 60n;
			secsLeft -= minsFormat * 60n;
			var secsFormat = secsLeft;
		}
		else
		{
			var hoursFormat = Math.floor(secsLeft / 3600);
			secsLeft -= hoursFormat * 3600;
			var minsFormat = Math.floor(secsLeft / 60);
			secsLeft -= minsFormat * 60;
			var secsFormat = Math.floor(secsLeft);
		}

		if(hoursFormat < 10) {hoursFormat = "0" + hoursFormat;}
		if(minsFormat < 10) {minsFormat = "0" + minsFormat;}
		if(secsFormat < 10) {secsFormat = "0" + secsFormat;}

		return hoursFormat + ":" + minsFormat + ":" + secsFormat;
	}
}

function shortenedFormattedTime(secs)
{
	if(secs <= 0)
	{
		return "0s";
	}
	else
	{
		var returnValue = "";
		var secsLeft = secs;
		var daysFormat = Math.floor(secsLeft / 86400);
		secsLeft -= daysFormat * 86400;
		var hoursFormat = Math.floor(secsLeft / 3600);
		secsLeft -= hoursFormat * 3600;
		var minsFormat = Math.floor(secsLeft / 60);
		secsLeft -= minsFormat * 60;
		var secsFormat = Math.floor(secsLeft);

		if(daysFormat > 1)
		{
			returnValue += daysFormat + _("d") + String.fromCharCode(8239);
		}
		else if(daysFormat == 1)
		{
			returnValue += daysFormat + _("d") + String.fromCharCode(8239);
		}

		if(hoursFormat > 1)
		{
			returnValue += hoursFormat + _("h") + String.fromCharCode(8239);
		}
		else if(hoursFormat == 1)
		{
			returnValue += hoursFormat + _("h") + String.fromCharCode(8239);
		}

		if(minsFormat > 1)
		{
			returnValue += minsFormat + _("m") + String.fromCharCode(8239);
		}
		else if(minsFormat == 1)
		{
			returnValue += minsFormat + _("m") + String.fromCharCode(8239);
		}

		if(secsFormat > 1)
		{
			returnValue += secsFormat + _("s");
		}
		else if(secsFormat == 1)
		{
			returnValue += secsFormat + _("s");
		}

		return returnValue;
	}
}

function beautifynum(n)
{
	switch(typeof n)
	{
		case 'number':
			if(n !== "" && n !== null)
			{
				var formattedNumber = "";
				if(n > 999999999999999999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000000000000000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("SEPTILLION")
				}
				else if(n > 999999999999999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000000000000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("SEXTILLION")
				}
				else if(n > 999999999999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000000000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("QUINTILLION")
				}
				else if(n > 999999999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("QUADRILLION")
				}
				else if(n > 999999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("TRILLION");
				}
				else if(n > 999999999)
				{
					formattedNumber = ((Math.floor(n / 100000000)) / 10).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + _("BILLION");
				}
				else
				{
					formattedNumber = Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				return formattedNumber;
			}
			else
			{
				return "0";
			}
			break;
		case 'bigint':
			if(n !== "" && n !== null)
			{
				return beautifynum(Number(n));
			}
			else
			{
				return "0";
			}
			break;
		case 'string':
			if(n.includes(".") || n.includes("e"))
			{
				return String(n);
			}
			else
			{
				return beautifynum(BigInt(n));
			}
		default:
			return String(n);
			break;
	}
}

function isJavascriptFile(fullPath)
{
	return confirmEnding(fullPath, ".js");
}

function confirmEnding(string, target)
{
	return string.substr(-target.length) === target;
}

function replaceAll(str, find, replace)
{
	return str.replace(new RegExp(find, 'g'), replace);
}

function shortenNum(n, precision = 3, shortenAfterDigits = 3)
{
	var returnValue = "";
	var numberLength = n.toString().length;

	switch(typeof n)
	{
		case 'number':
			if(numberLength > shortenAfterDigits && n >= 1000000000000000000000000)
			{
				returnValue = (n / 1000000000000000000000000).toFixed(precision).replace(/\.?0+$/, "") + "S";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000000000)
			{
				returnValue = (n / 1000000000000000000000).toFixed(precision).replace(/\.?0+$/, "") + "s";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000000)
			{
				returnValue = (n / 1000000000000000000).toFixed(precision).replace(/\.?0+$/, "") + "Q";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000)
			{
				returnValue = (n / 1000000000000000).toFixed(precision).replace(/\.?0+$/, "") + "q";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000)
			{
				returnValue = (n / 1000000000000).toFixed(precision).replace(/\.?0+$/, "") + "T";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000)
			{
				returnValue = (n / 1000000000).toFixed(precision).replace(/\.?0+$/, "") + "B";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000)
			{
				returnValue = (n / 1000000).toFixed(precision).replace(/\.?0+$/, "") + "M";
			}
			else if(numberLength > shortenAfterDigits && n >= 10000)
			{
				returnValue = (n / 1000).toFixed(precision).replace(/\.?0+$/, "") + "K";
			}
			else
			{
				return formattedNumber = Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
			}
			return returnValue.replace(".000", "");
			break;
		case 'bigint':
			var digitElevator = 10n ** BigInt(precision);
			if(numberLength > shortenAfterDigits && n >= 1000000000000000000000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000000000000000000000n)) / Number(digitElevator)) + "S";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000000000000000000n)) / Number(digitElevator)) + "s";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000000000000000n)) / Number(digitElevator)) + "Q";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000000)
			{
				returnValue = String(Number((n * digitElevator / 1000000000000000n)) / Number(digitElevator)) + "q";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000000000n)) / Number(digitElevator)) + "T";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000000n)) / Number(digitElevator)) + "B";
			}
			else if(numberLength > shortenAfterDigits && n >= 1000000n)
			{
				returnValue = String(Number((n * digitElevator / 1000000n)) / Number(digitElevator)) + "M";
			}
			else if(numberLength > shortenAfterDigits && n >= 10000n)
			{
				returnValue = String(Number((n * digitElevator / 1000n)) / Number(digitElevator)) + "K";
			}
			else
			{
				return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
			}
			return returnValue.replace(".000", "");
			break;
	}
}

const NUMBER_SUFFIXES = ['', 'K', 'M', 'B', 'T', 'q', 'Q', 's', 'S'];
function shortenAndBeautifyNum(n, precision = 1)
{
	for(var index = 0; index < NUMBER_SUFFIXES.length * 3; index++)
	{
		if(n < Math.pow(10, index * 3 + 3))
		{
			if(typeof (n) === "bigint")
			{
				n = (n * BigInt(Math.pow(10, precision))) / BigInt(Math.pow(10, index * 3));
				return Number(n) / Math.pow(10, precision) + NUMBER_SUFFIXES[index];
			}
			else
			{
				n = n / Math.pow(10, index * 3);
				return n.toFixed(precision).replace('.' + '0'.repeat(precision), '') + NUMBER_SUFFIXES[index];
			}
		}
	}

}

function getArraySum(arrayReference)
{
	return arrayReference.reduce(function (a, b)
	{
		return a + b;
	}, 0);
}

// Base64 encode / decode
// http://www.webtoolkit.info/
var Base64 = {
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input)
	{
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while(i < input.length)
		{

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if(isNaN(chr2))
			{
				enc3 = enc4 = 64;
			} else if(isNaN(chr3))
			{
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function (input)
	{
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while(i < input.length)
		{

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if(enc3 != 64)
			{
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64)
			{
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string)
	{
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for(var n = 0; n < string.length; n++)
		{

			var c = string.charCodeAt(n);

			if(c < 128)
			{
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048))
			{
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else
			{
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext)
	{
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while(i < utftext.length)
		{

			c = utftext.charCodeAt(i);

			if(c < 128)
			{
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224))
			{
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else
			{
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

function utf8_to_b64(str)
{
	try
	{
		return Base64.encode(unescape(encodeURIComponent(str)));
	}
	catch(err)
	{
		return '';
	}
}

function b64_to_utf8(str)
{
	try
	{
		return decodeURIComponent(escape(Base64.decode(str)));
	}
	catch(err)
	{
		return '';
	}
}

function getLanguageCode(language)
{
	switch(language)
	{
		case "english":
			return "en";

		case "brazilian":
			return "pt-BR";

		case "bulgarian":
			return "bg";

		case "czech":
			return "cs";

		case "danish":
			return "da";

		case "dutch":
			return "nl";

		case "finnish":
			return "fi";

		case "french":
			return "fr";

		case "german":
			return "de";

		case "greek":
			return "el";

		case "hungarian":
			return "hu";

		case "italian":
			return "it";

		case "japanese":
			return "ja";

		case "koreana":
			return "ko";

		case "koreana":
			return "ko";

		case "norwegian":
			return "no";

		case "polish":
			return "pl";

		case "portuguese":
			return "pt";

		case "romanian":
			return "ro";

		case "russian":
			return "ru";

		case "schinese":
			return "zh-Hans";

		case "spanish":
			return "es";

		case "swedish":
			return "sv";

		case "tchinese":
			return "zh-Hant";

		case "thai":
			return "th";

		case "turkish":
			return "tr";

		case "ukrainian":
			return "uk";

		case "hindi":
			return "hi";

		case "indonesian":
			return "id";

		case "vietnamese":
			return "vi";

		case "slovak":
			return "sk";

		case "filipino":
			return "tl";

		default:
			return "en";
	}
}

function getLanguageFromCode(language)
{
	switch(language.substring(0, 2))
	{
		case "en":
			return "english";

		case "pt":
			return "brazilian";

		case "bg":
			return "bulgarian";

		case "cs":
			return "czech";

		case "da":
			return "danish";

		case "nl":
			return "dutch";

		case "fi":
			return "finnish";

		case "fr":
			return "french";

		case "de":
			return "german";

		case "el":
			return "greek";

		case "hu":
			return "hungarian";

		case "it":
			return "italian";

		case "ja":
			return "japanese";

		case "ko":
			return "koreana";

		case "ko":
			return "koreana";

		case "no":
			return "norwegian";

		case "nb":
			return "norwegian";

		case "nn":
			return "norwegian";

		case "pl":
			return "polish";

		case "pt":
			return "portuguese";

		case "ro":
			return "romanian";

		case "ru":
			return "russian";

		case "zh":
			return "schinese";

		case "es":
			return "spanish";

		case "sv":
			return "swedish";

		case "th":
			return "thai";

		case "tr":
			return "turkish";

		case "kr":
			return "turkish";

		case "uk":
			return "ukrainian";

		case "id":
			return "indonesian";

		case "in":
			return "indonesian";

		case "ar":
			return "arabic";

		case "hi":
			return "hindi";

		case "vi":
			return "vietnamese";

		case "sk":
			return "slovak";

		case "tl":
			return "filipino";

		default:
			return "english";
	}
}

function loadJS(FILE, loadedCallback, callbackScope)
{
	var script = document.createElement("script");
	if(loadedCallback != null)
	{
		script.callbackScope = callbackScope;
		script.onload = function () {loadedCallback.call(this.callbackScope);};
	}
	script.src = FILE;
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
	return true;
}

var savedCanvasStates = {};
function saveCanvasState(canvas)
{
	savedCanvasStates[canvas] = {
		"font": canvas.font,
		"fillStyle": canvas.fillStyle,
		"strokeStyle": canvas.strokeStyle
	}
}

function restoreCanvasState(canvas)
{
	if(savedCanvasStates.hasOwnProperty(canvas))
	{
		canvas.font = savedCanvasStates[canvas].font;
		canvas.fillStyle = savedCanvasStates[canvas].fillStyle;
		canvas.strokeStyle = savedCanvasStates[canvas].strokeStyle;
	}
}

function generateRandomCharacter()
{
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr(Math.floor(Math.random() * 62), 1);
}

function hexToRgb(hex)
{
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToHex(r, g, b)
{
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getInterpolatedColorArray(startColorHex, startAlpha, endColorHex, endAlpha, numStepsIncludingStartAndEnd)
{
	var result = [];

	var startRgba = hexToRgb(startColorHex);
	startRgba.a = startAlpha;
	var endRgba = hexToRgb(endColorHex);
	endRgba.a = endAlpha;

	var rDifference = endRgba.r - startRgba.r;
	var gDifference = endRgba.g - startRgba.g;
	var bDifference = endRgba.b - startRgba.b;
	var aDifference = endRgba.a - startRgba.a;

	for(var i = 0; i <= numStepsIncludingStartAndEnd; i++)
	{
		var colorPointMultiplier = i / numStepsIncludingStartAndEnd;
		var rPoint = startRgba.r + Math.round(colorPointMultiplier * rDifference);
		var gPoint = startRgba.g + Math.round(colorPointMultiplier * gDifference);
		var bPoint = startRgba.b + Math.round(colorPointMultiplier * bDifference);
		var aPoint = Math.round((startRgba.a + (colorPointMultiplier * aDifference)) * 100) / 100;
		var colorPoint = {"r": rPoint, "g": gPoint, "b": bPoint, "a": aPoint};
		result.push(colorPoint);
	}

	return result;
}

function shortenStringAndAddEllipsis(text, charactersToShortenTo)
{
	if(text.length > charactersToShortenTo)
	{
		return text.substr(0, charactersToShortenTo - 3) + "...";
	}
	else
	{
		return text;
	}
}

function getIndefiniteArticleForString(str)
{
	// Naively try to determine the indefinite article for a given noun
	if(["the", "a", "an"].includes(str.split(' ')[0].toLowerCase()))
	{
		// Return nothing if the string begins with an article
		return "";
	}
	else if("aeiou8".includes(str[0].toLowerCase()))
	{
		// Will miss some words and numbers greater than 9
		return "an ";
	}
	else
	{
		return "a "
	}
}

function fillTextWrapWithHeightLimit(context, text, x, y, maxWidth, maxHeight, justify = "left", lineSpacing = 0.5, verticalJustify = "top", measureOnly)
{
	if(debugShrunkText)
	{
		context.save();
		context.fillStyle = "#CCCCCC";
		context.strokeStyle = "#000000";
		context.strokeRect(x, y, maxWidth, maxHeight);
		context.fillRect(x, y, maxWidth, maxHeight);
		context.restore();
	}

	context.save();

	var textCacheKey = text + "_" + x + "_" + maxWidth;
	if(!textSizeCache.exists(textCacheKey))
	{
		var fontSize = parseInt(context.font.split('px')[0]);
		var fontFamily = context.font.split('px')[1];
		var estimatedLines = Math.ceil(context.measureText(text).width / maxWidth);
		var lineHeight = fontSize * (1 + lineSpacing);
		var maximumFontSizePossible = fontSize * 3 * maxHeight / (estimatedLines * lineHeight);
		if(fontSize > maximumFontSizePossible)
		{
			fontSize = maximumFontSizePossible;
			context.font = fontSize + "px " + fontFamily;
		}

		while(fillTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, true).height > maxHeight)
		{
			fontSize--;
			context.font = fontSize + "px " + fontFamily;
		}
		textSizeCache.set(textCacheKey, context.font);
	}
	else
	{
		context.font = textSizeCache.get(textCacheKey);
	}

	if(verticalJustify == "top")
	{
		var result = fillTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, measureOnly);
	}
	else
	{
		var dimensions = fillTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, true);
		var extraVerticalSpace = maxHeight - dimensions.height;

		if(verticalJustify == "bottom")
		{
			var result = fillTextWrap(context, text, x, y + extraVerticalSpace, maxWidth, justify, lineSpacing, measureOnly);
		}
		else if(verticalJustify == "center")
		{
			var result = fillTextWrap(context, text, x, y + (extraVerticalSpace / 2), maxWidth, justify, lineSpacing, measureOnly);
		}
	}
	result.font = context.font;
	context.restore();
	return result;
}

function strokeTextWrapWithHeightLimit(context, text, x, y, maxWidth, maxHeight, justify = "left", lineSpacing = 0.5, verticalJustify = "top")
{
	if(debugShrunkText)
	{
		context.save();
		context.fillStyle = "#CCCCCC";
		context.strokeStyle = "#000000";
		context.strokeRect(x, y, maxWidth, maxHeight);
		context.fillRect(x, y, maxWidth, maxHeight);
		context.restore();
	}

	context.save();

	var textCacheKey = text + "_" + x + "_" + maxWidth;
	if(!textSizeCache.exists(textCacheKey))
	{
		var fontSize = parseInt(context.font.split('px')[0]);
		var fontFamily = context.font.split('px')[1];
		var estimatedLines = Math.ceil(context.measureText(text).width / maxWidth);
		var lineHeight = fontSize * (1 + lineSpacing);
		var maximumFontSizePossible = fontSize * 3 * maxHeight / (estimatedLines * lineHeight);
		if(fontSize > maximumFontSizePossible)
		{
			fontSize = maximumFontSizePossible;
			context.font = fontSize + "px " + fontFamily;
		}

		while(strokeTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, true).height > maxHeight)
		{
			fontSize--;
			context.font = fontSize + "px " + fontFamily;
		}
		textSizeCache.set(textCacheKey, context.font);
	}
	else
	{
		context.font = textSizeCache.get(textCacheKey);
	}

	if(verticalJustify == "top")
	{
		var result = strokeTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, false);
	}
	else
	{
		var dimensions = strokeTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, true);
		var extraVerticalSpace = maxHeight - dimensions.height;

		if(verticalJustify == "bottom")
		{
			var result = strokeTextWrap(context, text, x, y + extraVerticalSpace, maxWidth, justify, lineSpacing, false);
		}
		else if(verticalJustify == "center")
		{
			var result = strokeTextWrap(context, text, x, y + (extraVerticalSpace / 2), maxWidth, justify, lineSpacing, false);
		}
	}
	context.restore();
	return result;
}


// Draw text to a canvas, wrapping to a new line if the width exceeds maxWidth.
// Returns the bounding box of the drawn text
// Most commonly used via the fillTextWrap, etc. functions below
function drawTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, measureOnly, mode)
{
	if(text == "" || maxWidth <= 0)
		return {
			x1: x,
			y1: y,
			x2: x,
			y2: y,
			width: 0,
			height: 0
		};
	text = text.toString();
	text = replaceAll(text, "<br>", "\n");
	text = text.replace(/<[^<>]+>/g, '');
	var words = text.split(" ");
	var wordWidth;
	var line = [];
	var lines = [];
	var lineWidth = 0;
	var lineY = y;
	var fontSize = parseInt(context.font.split('px')[0]);
	var longestLineWidth = 0;
	var spaceWidth = context.measureText(' ').width;
	context.save();
	for(var i = 0; i < words.length; ++i)
	{
		wordWidth = context.measureText(words[i]).width + (i > 0 ? spaceWidth : 0);
		if(wordWidth > maxWidth)
		{
			// Split up words that are wider than maxWidth
			var firstWordWidth = Math.floor(words[i].length * maxWidth / wordWidth);
			var newWord = words[i].slice(firstWordWidth);
			words[i] = words[i].slice(0, firstWordWidth);
			words.splice(i + 1, 0, newWord);
			wordWidth = context.measureText(words[i]).width + (i > 0 ? spaceWidth : 0);
		}
		// DP: this requires spaces between line break tags/characters, probably want to fix later
		if(words[i] == "<br>" || words[i] == "\n" || i > 0 && lineWidth + wordWidth > maxWidth)
		{
			switch(justify)
			{
				case "left":
					renderArgs = [line.join(" "), x, lineY];
					break;
				case "right":
					renderArgs = [line.join(" "), x + maxWidth - lineWidth, lineY];
					break;
				case "center":
					renderArgs = [line.join(" "), x + maxWidth / 2 - lineWidth / 2, lineY];
					break;
				default:
					renderArgs = [line.join(" "), x, lineY];
			}
			lines.push(
				{
					text: renderArgs[0],
					x: renderArgs[1],
					y: renderArgs[2]
				}
			);
			if(!measureOnly)
			{
				var renderArgs;
				switch(mode)
				{
					case "fill":
						context.fillText(...renderArgs);
						break;
					case "stroke":
						context.lineJoin = "bevel";
						context.strokeText(...renderArgs);
						break;
					case "outline":
						context.lineJoin = "bevel";
						context.strokeText(...renderArgs);
						context.fillText(...renderArgs);
						break;
					default:
						context.fillText(...renderArgs);
				}
			}
			line = [];
			lineWidth = 0;
			lineY += fontSize * (1 + lineSpacing);
			if(words[i] == "<br>" || words[i] == "\n")
			{
				continue;
			}
		}
		line.push(words[i]);
		lineWidth += wordWidth;

		if(wordWidth > maxWidth)
		{
			fontSize *= maxWidth / lineWidth;
			context.font = fontSize + "px " + context.font.split('px')[1];
		}

		if(lineWidth > longestLineWidth)
		{
			longestLineWidth = lineWidth;
		}
	}
	switch(justify)
	{
		case "left":
			renderArgs = [line.join(" "), x, lineY];
			break;
		case "right":
			renderArgs = [line.join(" "), x + maxWidth - lineWidth, lineY];
			break;
		case "center":
			renderArgs = [line.join(" "), x + maxWidth / 2 - lineWidth / 2, lineY];
			break;
		default:
			renderArgs = [line.join(" "), x, lineY];
	}
	lines.push(
		{
			text: renderArgs[0],
			x: renderArgs[1],
			y: renderArgs[2]
		}
	);
	if(!measureOnly)
	{
		var renderArgs;
		switch(mode)
		{
			case "fill":
				context.fillText(...renderArgs);
				break;
			case "stroke":
				context.lineJoin = "bevel";
				context.strokeText(...renderArgs);
				break;
			case "outline":
				context.lineJoin = "bevel";
				context.strokeText(...renderArgs);
				context.fillText(...renderArgs);
				break;
			default:
				context.fillText(...renderArgs);
		}
	}
	context.restore();
	return {
		x1: x,
		y1: y,
		x2: x + longestLineWidth,
		y2: lineY + fontSize,
		width: longestLineWidth,
		height: lineY + fontSize - y,
		lines: lines
	}
}

function fillTextWrap(context, text, x, y, maxWidth, justify = "left", lineSpacing = 0.5, measureOnly = false)
{
	return drawTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, measureOnly, "fill");
}

function strokeTextWrap(context, text, x, y, maxWidth, justify = "left", lineSpacing = 0.5, measureOnly = false)
{
	return drawTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, measureOnly, "stroke");
}

function outlineTextWrap(context, text, x, y, maxWidth, justify = "left", lineSpacing = 0.5, measureOnly = false)
{
	return drawTextWrap(context, text, x, y, maxWidth, justify, lineSpacing, measureOnly, "outline");
}

// Draw text to a canvas, shrinking the text until it fits in a given box
// Returns the bounding box of the drawn text
// This is for single line text
var debugShrunkText = false;
function fillTextShrinkToFit(context, text, x, y, maxWidth, justify = "left", stretchTextAmount = 0, measureOnly = false)
{
	if(debugShrunkText)
	{
		context.save();
		context.fillStyle = "#CCCCCC";
		context.strokeStyle = "#000000";
		var splitFont = context.font.split('px')[0].split(' ');
		var startingFontSize = parseInt(splitFont[splitFont.length - 1]);
		context.strokeRect(x, y, maxWidth, startingFontSize);
		context.fillRect(x, y, maxWidth, startingFontSize);
		context.restore();
	}

	context.save();
	text = text.toString();
	var lineWidth = context.measureText(text).width;
	var splitFont = context.font.split('px')[0].split(' ');
	var fontSize = parseInt(splitFont[splitFont.length - 1]);
	var stretchAmount = (1 - stretchTextAmount);
	if(lineWidth > maxWidth)
	{
		if(stretchTextAmount > 0)
		{
			fontSize *= maxWidth / (lineWidth * stretchAmount);
			context.font = fontSize + "px " + context.font.split('px')[1];
			context.scale(stretchAmount, 1);
			lineWidth = context.measureText(text).width;
			x /= stretchAmount;
			maxWidth /= stretchAmount;
		}
		else
		{
			fontSize *= maxWidth / lineWidth;
			context.font = fontSize + "px " + context.font.split('px')[1];
			lineWidth = context.measureText(text).width;
		}
	}
	if(!measureOnly)
	{
		switch(justify)
		{
			case "left":
				context.fillText(text, x, y);
				break;
			case "right":
				context.fillText(text, x + maxWidth - lineWidth, y);
				break;
			case "center":
				context.fillText(text, x + maxWidth / 2 - lineWidth / 2, y);
				break;
		}
	}
	context.restore();
	return {
		x1: x,
		y1: y,
		x2: "center" ? x + maxWidth / 2 + lineWidth / 2 : x + lineWidth,
		y2: y + fontSize,
		width: lineWidth,
		height: fontSize
	}
}

function strokeTextShrinkToFit(context, text, x, y, maxWidth, justify = "left")
{
	context.save();
	context.lineJoin = "bevel";
	text = text.toString();
	var lineWidth = context.measureText(text).width;
	var fontSize = parseInt(context.font.split('px')[0]);
	if(lineWidth > maxWidth)
	{
		fontSize = fontSize * maxWidth / lineWidth;
		context.font = fontSize + "px " + context.font.split('px')[1];
		lineWidth = context.measureText(text).width;
	}
	switch(justify)
	{
		case "left":
			context.strokeText(text, x, y);
			break;
		case "right":
			context.strokeText(text, x + maxWidth - lineWidth, y);
			break;
		case "center":
			context.strokeText(text, x + maxWidth / 2 - lineWidth / 2, y);
			break;
	}
	context.restore();
	return {
		x1: x,
		y1: y,
		x2: x + lineWidth,
		y2: y + fontSize,
		width: lineWidth,
		height: fontSize
	}
}

function roundRect(context, x, y, width, height, radius, fill, stroke)
{
	if(typeof stroke === 'undefined')
	{
		stroke = true;
	}
	if(typeof radius === 'undefined')
	{
		radius = 5;
	}
	if(typeof radius === 'number')
	{
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else
	{
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for(var side in defaultRadius)
		{
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	context.beginPath();
	context.moveTo(x + radius.tl, y);
	context.lineTo(x + width - radius.tr, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	context.lineTo(x + width, y + height - radius.br);
	context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	context.lineTo(x + radius.bl, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	context.lineTo(x, y + radius.tl);
	context.quadraticCurveTo(x, y, x + radius.tl, y);
	context.closePath();
	if(fill)
	{
		context.fill();
	}
	if(stroke)
	{
		context.stroke();
	}

}

function getScaledImageDimensions(image, targetWidth = -1, targetHeight = -1)
{
	return getScaledDimensions(image.width, image.height, targetWidth, targetHeight);
}

function getScaledDimensions(realWidth, realHeight, targetWidth = -1, targetHeight = -1)
{
	if(targetWidth == -1 && targetHeight == -1)
	{
		return {width: realHeight, height: realHeight};
	}
	else if(targetWidth == -1)
	{
		targetWidth = realWidth * targetHeight / realHeight;
	}
	else if(targetHeight == -1)
	{
		targetHeight = realHeight * targetWidth / realWidth;
	}
	return {width: targetWidth, height: targetHeight};
}

function fitBoxInBox(sourceWidth, sourceHeight, x, y, maxWidth, maxHeight, horizontalAlign = "center", verticalAlign = "center")
{
	var scale = 1;
	var xOffset = 0;
	var yOffset = 0;
	var verticalScale = maxHeight / sourceHeight;
	if(sourceWidth * verticalScale >= maxWidth)
	{
		// If scaling based on height makes it too wide, use width instead
		scale = maxWidth / sourceWidth;
		xOffset = 0;
		switch(verticalAlign)
		{
			case "center":
				yOffset = maxHeight / 2 - (sourceHeight * scale) / 2;
				break;
			case "top":
				yOffset = 0;
				break;
			case "bottom":
				yOffset = maxHeight - (sourceHeight * scale);
				break;
			default:
				yOffset = 0;
				break;
		}
	}
	else
	{
		scale = verticalScale;
		yOffset = 0;
		switch(horizontalAlign)
		{
			case "center":
				xOffset = maxWidth / 2 - (sourceWidth * scale) / 2;
				break;
			case "left":
				xOffset = 0;
				break;
			case "right":
				xOffset = maxWidth - (sourceWidth * scale);
				break;
			default:
				xOffset = 0;
				break;
		}
	}

	return {
		x: x + xOffset,
		y: y + yOffset,
		width: sourceWidth * scale,
		height: sourceHeight * scale
	}
}

function getItemCoordsInList(itemWidth, itemHeight, hPadding, vPadding, itemsPerRow, index)
{
	var indexInRow = index % itemsPerRow;
	var rowNum = Math.floor(index / itemsPerRow);
	var coords = {
		x: hPadding * (indexInRow + 1) + itemWidth * indexInRow,
		y: (vPadding + itemHeight) * rowNum
	}
	return coords;
}

function openExternalLinkInDefaultBrowser(link)
{
	if(getBuildTarget() == STEAM_BUILD)
	{
		require("electron").shell.openExternal(link);
	}
	else
	{
		window.open(link, '_blank');
	}
}

function generateExternalLinkHtml(link, anchor)
{
	return '<span style=\'cursor: pointer; color: #6666FF; text-decoration: underline;\' onClick=\'openExternalLinkInDefaultBrowser(\"' + link + '\")\'>' + anchor + '</span>';
}

function openDiscord()
{
	return;
	openExternalLinkInDefaultBrowser(_("https://discord.gg/C3KwWQr"));
}

function openTwitter()
{
	return;
	openExternalLinkInDefaultBrowser("https://twitter.com/MrMineidle");
}

function openTikTok()
{
	return;
	openExternalLinkInDefaultBrowser("https://www.tiktok.com/@mrmineidle");
}

function openInstagram()
{
	return;
	openExternalLinkInDefaultBrowser("https://www.instagram.com/mrmineidle/");
}

function timeStampToDate(UNIX_timestamp)
{
	var a = new Date(UNIX_timestamp);
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

function getSaveDetails(save)
{
	var decodedSaveData = b64_to_utf8(b64_to_utf8(save.split("|")[1])).split("|");
	var money = decodedSaveData[0];
	var depth = decodedSaveData[1];
	return {
		"money": money,
		"depth": depth
	};
}

function fallbackCopyTextToClipboard(text)
{
	var textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try
	{
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch(err)
	{
		console.error('Fallback: Oops, unable to copy', err);
	}

	document.body.removeChild(textArea);
}
function copyTextToClipboard(text)
{
	if(isMobile())
	{
		cordova.plugins.clipboard.copy(text);
	}
	if(!navigator.clipboard)
	{
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(function ()
	{
		console.log('Async: Copying to clipboard was successful!');
	}, function (err)
	{
		console.error('Async: Could not copy text: ', err);
	});
}

function getStandardDeviation(array)
{
	const n = array.length
	const mean = array.reduce((a, b) => a + b) / n
	return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function getPageLoadPercent()
{
	var imgs = document.getElementsByTagName("img");
	var numLoaded = 0;
	for(var i = 0; i < imgs.length; i++)
	{
		if(imgs[i].complete && typeof imgs[i].naturalWidth != 'undefined' && imgs[i].naturalWidth != 0)
		{
			numLoaded++;
		}
	}
	return numLoaded / imgs.length;
}

function duplicate2dArray(array)
{
	var newArray = [];
	for(var i = 0; i < array.length; i++)
	{
		newArray[i] = array[i].slice();
	}
	return newArray;
}

function create2dArray(width, height, valueToPopulateWith)
{
	var resultArray = [];
	for(var i = 0; i < height; i++)
	{
		resultArray.push([]);
		for(var j = 0; j < width; j++)
		{
			resultArray[i].push(valueToPopulateWith);
		}
	}
	return resultArray;
}

//Don't use this unless you need to it is slow
function deepCopyObject(obj)
{
	return JSON.parse(JSON.stringify(obj));
}

// ############################################################################
// ################################# LZSTRING #################################
// ############################################################################

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function ()
{

	// private property
	var f = String.fromCharCode;
	var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
	var baseReverseDic = {};

	function getBaseValue(alphabet, character)
	{
		if(!baseReverseDic[alphabet])
		{
			baseReverseDic[alphabet] = {};
			for(var i = 0; i < alphabet.length; i++)
			{
				baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			}
		}
		return baseReverseDic[alphabet][character];
	}

	var LZString = {
		compressToBase64: function (input)
		{
			if(input == null) return "";
			var res = LZString._compress(input, 6, function (a) {return keyStrBase64.charAt(a);});
			switch(res.length % 4)
			{ // To produce valid Base64
				default: // When could this happen ?
				case 0: return res;
				case 1: return res + "===";
				case 2: return res + "==";
				case 3: return res + "=";
			}
		},

		decompressFromBase64: function (input)
		{
			if(input == null) return "";
			if(input == "") return null;
			return LZString._decompress(input.length, 32, function (index) {return getBaseValue(keyStrBase64, input.charAt(index));});
		},

		compressToUTF16: function (input)
		{
			if(input == null) return "";
			return LZString._compress(input, 15, function (a) {return f(a + 32);}) + " ";
		},

		decompressFromUTF16: function (compressed)
		{
			if(compressed == null) return "";
			if(compressed == "") return null;
			return LZString._decompress(compressed.length, 16384, function (index) {return compressed.charCodeAt(index) - 32;});
		},

		//compress into uint8array (UCS-2 big endian format)
		compressToUint8Array: function (uncompressed)
		{
			var compressed = LZString.compress(uncompressed);
			var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

			for(var i = 0, TotalLen = compressed.length; i < TotalLen; i++)
			{
				var current_value = compressed.charCodeAt(i);
				buf[i * 2] = current_value >>> 8;
				buf[i * 2 + 1] = current_value % 256;
			}
			return buf;
		},

		//decompress from uint8array (UCS-2 big endian format)
		decompressFromUint8Array: function (compressed)
		{
			if(compressed === null || compressed === undefined)
			{
				return LZString.decompress(compressed);
			} else
			{
				var buf = new Array(compressed.length / 2); // 2 bytes per character
				for(var i = 0, TotalLen = buf.length; i < TotalLen; i++)
				{
					buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
				}

				var result = [];
				buf.forEach(function (c)
				{
					result.push(f(c));
				});
				return LZString.decompress(result.join(''));

			}

		},


		//compress into a string that is already URI encoded
		compressToEncodedURIComponent: function (input)
		{
			if(input == null) return "";
			return LZString._compress(input, 6, function (a) {return keyStrUriSafe.charAt(a);});
		},

		//decompress from an output of compressToEncodedURIComponent
		decompressFromEncodedURIComponent: function (input)
		{
			if(input == null) return "";
			if(input == "") return null;
			input = input.replace(/ /g, "+");
			return LZString._decompress(input.length, 32, function (index) {return getBaseValue(keyStrUriSafe, input.charAt(index));});
		},

		compress: function (uncompressed)
		{
			return LZString._compress(uncompressed, 16, function (a) {return f(a);});
		},
		_compress: function (uncompressed, bitsPerChar, getCharFromInt)
		{
			if(uncompressed == null) return "";
			var i, value,
				context_dictionary = {},
				context_dictionaryToCreate = {},
				context_c = "",
				context_wc = "",
				context_w = "",
				context_enlargeIn = 2, // Compensate for the first entry which should not count
				context_dictSize = 3,
				context_numBits = 2,
				context_data = [],
				context_data_val = 0,
				context_data_position = 0,
				ii;

			for(ii = 0; ii < uncompressed.length; ii += 1)
			{
				context_c = uncompressed.charAt(ii);
				if(!Object.prototype.hasOwnProperty.call(context_dictionary, context_c))
				{
					context_dictionary[context_c] = context_dictSize++;
					context_dictionaryToCreate[context_c] = true;
				}

				context_wc = context_w + context_c;
				if(Object.prototype.hasOwnProperty.call(context_dictionary, context_wc))
				{
					context_w = context_wc;
				} else
				{
					if(Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w))
					{
						if(context_w.charCodeAt(0) < 256)
						{
							for(i = 0; i < context_numBits; i++)
							{
								context_data_val = (context_data_val << 1);
								if(context_data_position == bitsPerChar - 1)
								{
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else
								{
									context_data_position++;
								}
							}
							value = context_w.charCodeAt(0);
							for(i = 0; i < 8; i++)
							{
								context_data_val = (context_data_val << 1) | (value & 1);
								if(context_data_position == bitsPerChar - 1)
								{
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else
								{
									context_data_position++;
								}
								value = value >> 1;
							}
						} else
						{
							value = 1;
							for(i = 0; i < context_numBits; i++)
							{
								context_data_val = (context_data_val << 1) | value;
								if(context_data_position == bitsPerChar - 1)
								{
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else
								{
									context_data_position++;
								}
								value = 0;
							}
							value = context_w.charCodeAt(0);
							for(i = 0; i < 16; i++)
							{
								context_data_val = (context_data_val << 1) | (value & 1);
								if(context_data_position == bitsPerChar - 1)
								{
									context_data_position = 0;
									context_data.push(getCharFromInt(context_data_val));
									context_data_val = 0;
								} else
								{
									context_data_position++;
								}
								value = value >> 1;
							}
						}
						context_enlargeIn--;
						if(context_enlargeIn == 0)
						{
							context_enlargeIn = Math.pow(2, context_numBits);
							context_numBits++;
						}
						delete context_dictionaryToCreate[context_w];
					} else
					{
						value = context_dictionary[context_w];
						for(i = 0; i < context_numBits; i++)
						{
							context_data_val = (context_data_val << 1) | (value & 1);
							if(context_data_position == bitsPerChar - 1)
							{
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else
							{
								context_data_position++;
							}
							value = value >> 1;
						}


					}
					context_enlargeIn--;
					if(context_enlargeIn == 0)
					{
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					// Add wc to the dictionary.
					context_dictionary[context_wc] = context_dictSize++;
					context_w = String(context_c);
				}
			}

			// Output the code for w.
			if(context_w !== "")
			{
				if(Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w))
				{
					if(context_w.charCodeAt(0) < 256)
					{
						for(i = 0; i < context_numBits; i++)
						{
							context_data_val = (context_data_val << 1);
							if(context_data_position == bitsPerChar - 1)
							{
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else
							{
								context_data_position++;
							}
						}
						value = context_w.charCodeAt(0);
						for(i = 0; i < 8; i++)
						{
							context_data_val = (context_data_val << 1) | (value & 1);
							if(context_data_position == bitsPerChar - 1)
							{
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else
							{
								context_data_position++;
							}
							value = value >> 1;
						}
					} else
					{
						value = 1;
						for(i = 0; i < context_numBits; i++)
						{
							context_data_val = (context_data_val << 1) | value;
							if(context_data_position == bitsPerChar - 1)
							{
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else
							{
								context_data_position++;
							}
							value = 0;
						}
						value = context_w.charCodeAt(0);
						for(i = 0; i < 16; i++)
						{
							context_data_val = (context_data_val << 1) | (value & 1);
							if(context_data_position == bitsPerChar - 1)
							{
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else
							{
								context_data_position++;
							}
							value = value >> 1;
						}
					}
					context_enlargeIn--;
					if(context_enlargeIn == 0)
					{
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					delete context_dictionaryToCreate[context_w];
				} else
				{
					value = context_dictionary[context_w];
					for(i = 0; i < context_numBits; i++)
					{
						context_data_val = (context_data_val << 1) | (value & 1);
						if(context_data_position == bitsPerChar - 1)
						{
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else
						{
							context_data_position++;
						}
						value = value >> 1;
					}


				}
				context_enlargeIn--;
				if(context_enlargeIn == 0)
				{
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				}
			}

			// Mark the end of the stream
			value = 2;
			for(i = 0; i < context_numBits; i++)
			{
				context_data_val = (context_data_val << 1) | (value & 1);
				if(context_data_position == bitsPerChar - 1)
				{
					context_data_position = 0;
					context_data.push(getCharFromInt(context_data_val));
					context_data_val = 0;
				} else
				{
					context_data_position++;
				}
				value = value >> 1;
			}

			// Flush the last char
			while(true)
			{
				context_data_val = (context_data_val << 1);
				if(context_data_position == bitsPerChar - 1)
				{
					context_data.push(getCharFromInt(context_data_val));
					break;
				}
				else context_data_position++;
			}
			return context_data.join('');
		},

		decompress: function (compressed)
		{
			if(compressed == null) return "";
			if(compressed == "") return null;
			return LZString._decompress(compressed.length, 32768, function (index) {return compressed.charCodeAt(index);});
		},

		_decompress: function (length, resetValue, getNextValue)
		{
			var dictionary = [],
				next,
				enlargeIn = 4,
				dictSize = 4,
				numBits = 3,
				entry = "",
				result = [],
				i,
				w,
				bits, resb, maxpower, power,
				c,
				data = {val: getNextValue(0), position: resetValue, index: 1};

			for(i = 0; i < 3; i += 1)
			{
				dictionary[i] = i;
			}

			bits = 0;
			maxpower = Math.pow(2, 2);
			power = 1;
			while(power != maxpower)
			{
				resb = data.val & data.position;
				data.position >>= 1;
				if(data.position == 0)
				{
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}

			switch(next = bits)
			{
				case 0:
					bits = 0;
					maxpower = Math.pow(2, 8);
					power = 1;
					while(power != maxpower)
					{
						resb = data.val & data.position;
						data.position >>= 1;
						if(data.position == 0)
						{
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb > 0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 1:
					bits = 0;
					maxpower = Math.pow(2, 16);
					power = 1;
					while(power != maxpower)
					{
						resb = data.val & data.position;
						data.position >>= 1;
						if(data.position == 0)
						{
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb > 0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 2:
					return "";
			}
			dictionary[3] = c;
			w = c;
			result.push(c);
			while(true)
			{
				if(data.index > length)
				{
					return "";
				}

				bits = 0;
				maxpower = Math.pow(2, numBits);
				power = 1;
				while(power != maxpower)
				{
					resb = data.val & data.position;
					data.position >>= 1;
					if(data.position == 0)
					{
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}

				switch(c = bits)
				{
					case 0:
						bits = 0;
						maxpower = Math.pow(2, 8);
						power = 1;
						while(power != maxpower)
						{
							resb = data.val & data.position;
							data.position >>= 1;
							if(data.position == 0)
							{
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}

						dictionary[dictSize++] = f(bits);
						c = dictSize - 1;
						enlargeIn--;
						break;
					case 1:
						bits = 0;
						maxpower = Math.pow(2, 16);
						power = 1;
						while(power != maxpower)
						{
							resb = data.val & data.position;
							data.position >>= 1;
							if(data.position == 0)
							{
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}
						dictionary[dictSize++] = f(bits);
						c = dictSize - 1;
						enlargeIn--;
						break;
					case 2:
						return result.join('');
				}

				if(enlargeIn == 0)
				{
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}

				if(dictionary[c])
				{
					entry = dictionary[c];
				} else
				{
					if(c === dictSize)
					{
						entry = w + w.charAt(0);
					} else
					{
						return null;
					}
				}
				result.push(entry);

				// Add w+entry[0] to the dictionary.
				dictionary[dictSize++] = w + entry.charAt(0);
				enlargeIn--;

				w = entry;

				if(enlargeIn == 0)
				{
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}

			}
		}
	};
	return LZString;
})();

if(typeof define === 'function' && define.amd)
{
	define(function () {return LZString;});
} else if(typeof module !== 'undefined' && module != null)
{
	module.exports = LZString
} else if(typeof angular !== 'undefined' && angular != null)
{
	angular.module('LZString', [])
		.factory('LZString', function ()
		{
			return LZString;
		});
}

function ajax(url, params, method, callback = null)
{
	var queryString;
	if(!params)
	{
		return
	} else if(typeof (params) == "object")
	{
		queryString = createQueryString(params);
	} else if(typeof (params) == "string")
	{
		queryString = params;
	}
	method = method.toUpperCase();
	if(method != "POST")
	{
		url += "?" + queryString;
		// Don't need to send the query string once it's appended to the url
		queryString = null;
	}
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function ()
	{
		if(xhr.readyState == 4 && callback != null)
		{
			if(typeof (xhr.responseText) !== "undefined")
			{
				callback(xhr.responseText, xhr);
			} else
			{
				callback(null, xhr);
			}
		}
	}
	xhr.send(queryString);
}

function createQueryString(obj)
{
	var parts = [];
	Object.keys(obj).forEach(function (key)
	{
		parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
	});
	return parts.join('&');
}

function handleNameSubmission()
{
	// ajax(
	// 	"https://mrmine.com/game/desktop/backend/minernames.php",
	// 	{"uid": platform.getUserId()},
	// 	"GET",
	// 	function (response)
	// 	{
	// 		if(response)
	// 		{
	// 			response = JSON.parse(response);
	// 			if(response.isEligible)
	// 			{
	// 				paidForMinerName = true;
	// 				showSimpleInput(
	// 					_("Thank you for contributing to Mr.Mine! As a reward, please enter your name to appear in-game under a miner (Max 12 characters)."),
	// 					_("Submit Name"),
	// 					"",
	// 					function ()
	// 					{
	// 						var name = document.getElementById("simpleInputFieldText").value;
	// 						ajax(
	// 							"https://mrmine.com/game/desktop/backend/minernames.php",
	// 							{"uid": platform.getUserId(), "name": name},
	// 							"POST",
	// 							function (response)
	// 							{
	// 								if(response)
	// 								{
	// 									response = JSON.parse(response);
	// 									if(response.success)
	// 									{
	// 										hideSimpleInput();
	// 										var startDepthForMinerNames = 100;
	// 										customMinerDatabaseIndex = response.currentNameCount;
	// 										var minerDepth = startDepthForMinerNames + Math.floor(response.currentNameCount / 10);
	// 										var minerNumber = response.currentNameCount % 10;
	// 										alert(_(
	// 											"Thank you! Your name will be added in the next update. It will be assigned to a miner between 100 and 300km. Soon you will be able to customize your miner too!",
	// 										));
	// 									}
	// 									else
	// 									{
	// 										alert(_("Sorry, something went wrong. Please try again."));
	// 									}
	// 								}
	// 							}
	// 						);
	// 					},
	// 					_("Cancel"),
	// 					12
	// 				);
	// 			}
	// 		}
	// 	}
	// );
}

var remainingLanguages = [];
var screenshotsTaken = 0;

function takeScreeshotsForAllLanguages()
{
	screenshotsTaken++;
	remainingLanguages = [];
	for(var screenshotLanguage in translations)
	{
		remainingLanguages.push(screenshotLanguage);
	}
	console.log(remainingLanguages);
	takeScreeshotForLanguage();
}

function takeScreeshotForLanguage()
{
	console.log(remainingLanguages);
	if(remainingLanguages.length == 0)
	{
		console.log("finished");
		return;
	}
	language = remainingLanguages[0];
	remainingLanguages.shift();

	let folder = "../Screenshots/screenshot_" + screenshotsTaken;
	let fileName = language + "_" + currentTime() + ".png";
	let location = folder + "/" + fileName;

	if(!fs.existsSync(folder))
	{
		fs.mkdir(folder, {}, (err) =>
		{
			if(err) 
			{
				console.log(err)
			}
			else
			{
				takeScreenshot(location).then(() => {takeScreeshotForLanguage();});
			}
		});
	}
	else
	{
		takeScreenshot(location).then(() => {takeScreeshotForLanguage();});
	}

	console.log(language);
}

function takeScreenshot(fileName)
{
	animate();
	let win = getCurrentWindow();

	return win.webContents
		.capturePage({
			x: 0,
			y: 0,
			width: win.getSize()[0],
			height: win.getSize()[1],
		})
		.then((img) =>
		{
			fs.writeFile(fileName,
				img.toPNG(), "base64", function (err)
			{
				if(err) throw err;
				console.log("Saved!");
			});
		})
		.catch((err) =>
		{
			console.log(err);
		});
}

function getStandardDeviationPercent(std)
{
	return erf(std / Math.SQRT2);
}

function cdf(x, mean, variance)
{
	return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
}

function erf(x)
{
	// save the sign of x
	var sign = (x >= 0) ? 1 : -1;
	x = Math.abs(x);

	// constants
	var a1 = 0.254829592;
	var a2 = -0.284496736;
	var a3 = 1.421413741;
	var a4 = -1.453152027;
	var a5 = 1.061405429;
	var p = 0.3275911;

	// A&S formula 7.1.26
	var t = 1.0 / (1.0 + p * x);
	var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
	return sign * y; // erf(-x) = -erf(x);
}

//Reference: http://www.independent-software.com/determining-coordinates-on-a-html-canvas-bezier-curve.html
function getBezierXY(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey)
{
	return {
		x: Math.pow(1 - t, 3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x + 3 * t * t * (1 - t) * cp2x + t * t * t * ex,
		y: Math.pow(1 - t, 3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y + 3 * t * t * (1 - t) * cp2y + t * t * t * ey
	};
}

//Reference: http://www.independent-software.com/determining-coordinates-on-a-html-canvas-bezier-curve.html
function getBezierAngle(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey)
{
	var dx = Math.pow(1 - t, 2) * (cp1x - sx) + 2 * t * (1 - t) * (cp2x - cp1x) + t * t * (ex - cp2x);
	var dy = Math.pow(1 - t, 2) * (cp1y - sy) + 2 * t * (1 - t) * (cp2y - cp1y) + t * t * (ey - cp2y);
	return -Math.atan2(dx, dy) + 0.5 * Math.PI;
}

function generateNameStubs(numNames)
{
	var result = "";
	var currentDepth = paidMinerNames[paidMinerNames.length - 1].depth + rand(1, 2);
	var previousWorkerLocation = 1;
	var i = 0;
	while(i < numNames)
	{
		if(!isDepthWithoutWorkers(currentDepth) && !isDepthWithoutWorkers(currentDepth - 1) && !isDepthWithoutWorkers(currentDepth + 1))
		{
			var newWorkerLocation = rand(1, 9);
			while(newWorkerLocation == previousWorkerLocation)
			{
				newWorkerLocation = rand(1, 9);
			}
			previousWorkerLocation = newWorkerLocation;
			result += '{"name": String.fromCharCode(9733) + "", "depth": ' + currentDepth + ', "workerIndex": ' + newWorkerLocation + '},\r\n';
			i++;
		}
		currentDepth += rand(1, 2);
	}
	return result;
}

//##############################################################
//################## VIDEO GENERATION BELOW ####################
//##############################################################

// 1) Call runScenes to generate chained eval callbacks
// 2) Run one of the following ffmpeg commands from command line:
//     Best: ffmpeg -i videoFrames/%d.png -c:v libvpx-vp9 -lossless 1 output1.webm
//     Second Best: ffmpeg -i videoFrames/%d.png -c:v ffv1 output2.avi
//     Third Best: ffmpeg -i videoFrames/%d.png -c:v huffyuv output3.avi

function runScenes()
{
	buffs.activeBuffs = [];

	var scene4 = "function(){generateAnimatedSequence(360, 480, 993, 1003, 25);}";
	var scene3 = "function(){generateAnimatedSequence(240, 360, 980, 990, 25, " + scene4 + ");}";
	var scene2 = "function(){generateAnimatedSequence(120, 240, 293, 300, 25, " + scene3 + ");}";
	var scene1 = "function(){generateAnimatedSequence(0, 120, 1, 4, 25, " + scene2 + ");}";
	eval("(" + scene1 + ")();");
}

function runFadeToBlack()
{
	buffs.activeBuffs = [];
	worldAtDepth(1).workersHired = 1;
	worldAtDepth(1).workerLevel = 0;

	var scene9 = "function(){generateAnimatedSequence(2000, 2250, 80, 90, 25); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 7;}";
	var scene8 = "function(){generateAnimatedSequence(1750, 2000, 70, 80, 25, " + scene9 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 6;}";
	var scene7 = "function(){generateAnimatedSequence(1500, 1750, 60, 70, 25, " + scene8 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 5;}";
	var scene6 = "function(){generateAnimatedSequence(1250, 1500, 50, 60, 25, " + scene7 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 4;}";
	var scene5 = "function(){generateAnimatedSequence(1000, 1250, 40, 50, 25, " + scene6 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 3;}";
	var scene4 = "function(){generateAnimatedSequence(750, 1000, 30, 40, 25, " + scene5 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 2;}";
	var scene3 = "function(){generateAnimatedSequence(500, 750, 20, 30, 25, " + scene4 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 1;}";
	var scene2 = "function(){generateAnimatedSequence(250, 500, 10, 20, 25, " + scene3 + "); worldAtDepth(1).workersHired = 10; worldAtDepth(1).workerLevel = 0;}";
	var scene1 = "function(){generateAnimatedSequence(0, 250, 1, 10, 25, " + scene2 + "); worldAtDepth(1).workersHired = 5; worldAtDepth(1).workerLevel = 0;}";
	eval("(" + scene1 + ")();");
}

function generateAnimatedSequence(startFrameNumber, endFrameNumber, startRenderDepth, endRenderDepth, fps, finalCallback = "function(){console.log('done');}")
{
	var callbackChain = "(";
	for(var i = startFrameNumber; i < endFrameNumber; i++)
	{
		var renderDepthFloat = startRenderDepth + ((i - startFrameNumber) / (endFrameNumber - startFrameNumber)) * (endRenderDepth - startRenderDepth);
		callbackChain += "function(){ generateSeamlessWorldImage(" + i + ", " + fps + ", " + renderDepthFloat + ", ";
	}
	callbackChain += finalCallback;
	for(var i = startFrameNumber; i < endFrameNumber; i++)
	{
		callbackChain += ")}";
	}
	callbackChain += ")();";

	eval(callbackChain);
}

function generateSeamlessWorldImage(frameNumber, fps, renderDepthFloat, callback)
{
	var startAnimationCounter = framesRendered2;
	var framesUntilIncrementAnimation = fps / 10;
	var currentFrameNum = Math.floor(frameNumber / framesUntilIncrementAnimation);

	currentlyViewedDepth = Math.floor(renderDepthFloat);
	framesRendered2 = currentFrameNum;
	numFramesRendered = currentFrameNum;
	animate();

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = mainw;
	tempCanvas.height = mainh * 2;

	var tempCanvasFinal = document.createElement('canvas');
	tempCanvasFinal.width = mainw;
	tempCanvasFinal.height = mainh;

	tempCanvas.getContext("2d").drawImage(main, mainw * .082, mainh * .112, mainw * .853, mainh * .888, 0, 0, mainw, mainh);
	currentlyViewedDepth = Math.min(currentlyViewedDepth + 5, depth);
	framesRendered2 = currentFrameNum;
	numFramesRendered = currentFrameNum;
	animate();
	tempCanvas.getContext("2d").drawImage(main, mainw * .082, mainh * .112, mainw * .853, mainh * .888, 0, mainh, mainw, mainh);

	tempCanvasFinal.getContext("2d").drawImage(tempCanvas, 0, mainh * (renderDepthFloat % 1 * .2), mainw, mainh, 0, 0, mainw, mainh);

	var imageUrl = tempCanvasFinal.toDataURL("image/png");
	const base64Data = imageUrl.replace(/^data:image\/png;base64,/, "");
	fs.writeFile("../Screenshots/videoFrames/" + frameNumber + ".png", base64Data, 'base64', function (err)
	{
		callback();
	});
}

function generateDrillCombinationAnimations(callback)
{
	//generate a large canvas with all drills on it
	//render multiple frames of this and then export the frames as images

	var tempCanvases = [];
	for(var i = 0; i < 4; i++)
	{
		var tempCanvas = document.createElement('canvas');
		tempCanvas.width = 1920;
		tempCanvas.height = 1080;
		var tempContext = tempCanvas.getContext("2d");
		tempCanvases.push(tempCanvas);

		//loop through drills
		for(var j = 0; j < 32; j++)
		{
			tempContext.drawImage(window["drilltop" + j], 168 * (i % 4), 0, 168, 158, 192 * (j % 10), 216 * Math.floor(j / 10), 168, 158);
			tempContext.drawImage(window["drillbit" + j], 168 * (i % 4), 0, 168, 158, 192 * (j % 10), 216 * Math.floor(j / 10), 168, 158);
		}

		var imageUrl = tempCanvas.toDataURL("image/png");
		const base64Data = imageUrl.replace(/^data:image\/png;base64,/, "");
		fs.writeFile("../Screenshots/drillFrames/" + i + ".png", base64Data, 'base64', function (err)
		{
			callback();
		});
	}
}

function isDev()
{
	if(typeof process !== "undefined")
	{
		if(typeof process.env.APP_DEV !== "undefined")
		{
			return process.env.APP_DEV.includes("true");
		}
		else
		{
			return false;
		}
	}
	else if(window.location)
	{
		return window.location.href.split("?")[0] == "https://mrmine.com/dev/desktop/index.html";
	}
	return false;
}

function getId(length)
{
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for(var i = 0; i < length; i++)
	{
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


//##############################################################
//################### END VIDEO GENERATION #####################
//##############################################################

function unicodeToStringCode(text)
{
	var result = "";
	var characterArray = text.split("&#");
	for(var i = 0; i < characterArray.length; i++)
	{
		var code = characterArray[i].split(";")[0];
		var remaining = characterArray[i].split(";")[1];
		if(!isNaN(code))
		{
			result += String.fromCharCode(code);
		}
		else
		{
			result += code;
		}
		if(remaining !== undefined)
		{
			result += remaining;
		}
	}
	return result;
}

async function testWebmUnpack()
{
	var numFrames = 30;
	let videoBlob = await fetch('Shared/Assets/Unused/output.webm').then(r => r.blob());

	let videoObjectUrl = URL.createObjectURL(videoBlob);
	let video = document.createElement("video");
	video.src = videoObjectUrl;
	video.crossOrigin = "anonymous";
	document.body.append(video);
	await video.play();
	video.addEventListener("seeked", async () => {if(seekResolve) seekResolve();});

	while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2)
	{
		await new Promise(r => setTimeout(r, 1000));
	}

	var canvas = document.createElement('canvas');
	canvas.width = video.videoWidth * numFrames;
	canvas.height = video.videoHeight;
	var ctx = canvas.getContext("2d");

	var duration = video.duration;
	var frameTime = numFrames / duration;
	for(var i = 0; i < numFrames; i++)
	{
		video.currentTime = (i + 0.5) * frameTime;
		video.play();
		await new Promise(r => (seekResolve = r));
		ctx.drawImage(video, i * video.videoWidth, 0);
	}
	console.log('ended');
	testWebm.src = canvas.toDataURL('image/webp', 1);
}