// ############################################################
// ###################### CODE REDEMPTION #####################
// ############################################################
var redeemedCodes = [];

function showRedeemPrompt()
{
	showSimpleInput(_("Enter the code to redeem."), _("Redeem Code"), "", redeemCode, "Cancel");
}

function redeemCode()
{
	var redeemCode = getSafeCode();
	if(redeemedCodes.indexOf(redeemCode) == -1)
	{
		redeemTicketOnServer(redeemCode);
	}
	else
	{
		alert(_("Code already redeemed"));
	}
}

function getSafeCode()
{
	var rawCode = document.getElementById("simpleInputFieldText").value;
	var redeemCode = replaceAll(rawCode, " ", "");
	return redeemCode;
}

//code ticket redemption
function redeemTicketOnServer(ticketId)
{
	var xmlhttp;
	if(window.XMLHttpRequest)
	{
		xmlhttp = new XMLHttpRequest();
	}
	else
	{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function ()
	{
		console.log(xmlhttp.responseText);
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			var result = JSON.parse(xmlhttp.responseText);
			console.log(result);
			var isSuccess = result.success.toString();
			if(isSuccess == "success")
			{
				var redeemCode = getSafeCode();
				var endQuantityIndex = redeemCode.length - 1;
				var rewardQuantity = parseInt(redeemCode.slice(11, endQuantityIndex));
				var rewardQuantityBigInt = BigInt(redeemCode.slice(11, endQuantityIndex));
				var rewardType = redeemCode.slice(endQuantityIndex);

				if(rewardType == "T" && rewardQuantity > 0)
				{
					//tickets
					tickets += rewardQuantity;
					newNews(_("You gained {0} tickets", rewardQuantity), true);
				}
				else if(rewardType == "M" && rewardQuantity > 0)
				{
					//money
					addMoney(rewardQuantityBigInt);
					newNews(_("You gained money ${0}", rewardQuantity), true);
				}
				else if(rewardType == "C")
				{
					//normal chest
					openBasicChest();
				}
				else if(rewardType == "G")
				{
					//golden chest
					openGoldChest();
				}
				else if(rewardType == "E")
				{
					//Ethereal chest
					openEtherealChest();
				}
				else if(rewardType == "L" && rewardQuantity > 0)
				{
					//timelapse minutes
					timelapse(rewardQuantity);
					newNews(_("You gained timelapse {0}mins", parseFloat((rewardQuantity * STAT.timelapseDurationMultiplier()).toFixed(2))), true);
				}
				else if(rewardType == "D" && rewardQuantity > 0)
				{
					addDepth(rewardQuantity);
					newNews(_("You gained {0}km depth", rewardQuantity), true);
				}
				else if(rewardType == "S" && rewardQuantity > 0)
				{
					worldResources[BUILDING_MATERIALS_INDEX] += rewardQuantity;
					newNews(_("You gained {0} x Building Materials", rewardQuantity), true);
				}
				else if(rewardType == "A" && rewardQuantity > 0)
				{
					worldResources[BUILDING_MATERIALS_INDEX] += rewardQuantity;
					newNews(_("You gained {0} x Building Materials", rewardQuantity), true);
				}
				else if(rewardType == "O" && rewardQuantity > 0)
				{
					//oil
					worldResources[OIL_INDEX].numOwned += rewardQuantity;
					newNews(_("You gained {0} oil", rewardQuantity), true);
				}
				else if(rewardType == "B" && rewardQuantity > 0)
				{
					//standard buff
					if(rewardQuantity != 6)
					{
						buffs.startBuff(rewardQuantity, 600, "code");
					}
					else
					{
						buffs.startBuff(rewardQuantity, 30, "code");
					}
					newNews(_("You gained a buff!"), true);
				}
				if(redeemedCodes.length == 0)
				{
					logInfluencer(redeemCode);
				}
				redeemedCodes.push(redeemCode);
				document.getElementById("simpleInputFieldText").value = "";
				trackeEvent_redeemCode();
				hideSimpleInput();
			}
			else
			{
				alert(_("Error code doesn't exist or is invalid"));
			}
		}
	}

	xmlhttp.open("POST", CODE_REDEMPTION_ENDPOINT, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("r=" + ticketId);
}