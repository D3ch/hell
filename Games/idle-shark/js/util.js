"use strict";
/**
 * @type Record<string, (a: number, b: number, k: number) => number>
 */
SharkGame.MathUtil = {
    // current = current amount
    // desired = desired amount
    // cost = constant price
    // returns: cost to get to b from a
    constantCost(current, difference, cost) {
        if (typeof current === "object") {
            return cost.times(difference);
        }
        return difference * cost;
    },

    // current = current amount
    // available = available price amount
    // cost = constant price
    // returns: absolute max items that can be held with invested and current resources
    constantMax(current, available, cost) {
        if (typeof current === "object") {
            return available.dividedBy(cost).plus(current);
        }
        available = Math.floor(Math.floor(available) * (1 - 1e-9) + 0.1); // safety margin
        return available / cost + current;
    },

    // current = current amount
    // desired = desired amount
    // cost = cost increase per item
    // returns: cost to get to b from a
    linearCost(current, difference, constant) {
        if (typeof current === "object") {
            return constant.dividedBy(2).times(difference.times(difference).plus(difference).plus(current.times(2).times(difference)));
        } else {
            return (constant / 2) * (difference * difference + difference + 2 * difference * current);
        }
    },

    // current = current amount
    // available = available price amount
    // cost = cost increase per item
    // returns: absolute max items that can be held with invested and current resources
    linearMax(current, available, cost) {
        if (typeof current === "object") {
            return current.times(current).plus(current).plus(available.times(2).dividedBy(cost)).plus(0.25).squareRoot().minus(0.5);
        } else {
            available = Math.floor(Math.floor(available) * (1 - 1e-9)); // safety margin
            return Math.sqrt(current * current + current + (2 * available) / cost + 0.25) - 0.5;
        }
    },

    // these need to be adapted probably?
    // will anything ever use these
    // exponentialCost(a, b, k) {
    //     return (k * Math.pow()) - ();
    // },
    //
    // exponentialMax(a, b, k) {
    //     return Math.floor(Math.log(Math.pow(b,a) + (b-1) * b / k) / Math.log(a));
    // }

    // artificial limit - whatever has these functions for cost/max can only have one of)
    uniqueCost(current, difference, cost) {
        if (typeof current === "object") {
            if (current.lessThan(1) && current.plus(difference).lessThanOrEqualTo(2)) {
                return cost;
            } else {
                return new Decimal(Number.POSITIVE_INFINITY);
            }
        }
        if (current < 1 && current + difference <= 2) {
            return cost;
        } else {
            return Number.POSITIVE_INFINITY; // be careful this doesn't fuck things up
        }
    },

    // this takes an argument to know whether or not to return a Decimal or a Number
    uniqueMax(current) {
        return typeof current === "object" ? new Decimal(1) : 1;
    },

    getBuyAmount(noMaxBuy) {
        if (SharkGame.Settings.current.buyAmount === "custom") {
            return $("#custom-input")[0] && Math.floor($("#custom-input")[0].valueAsNumber) >= 1 && $("#custom-input")[0].valueAsNumber < 1e18
                ? Math.floor($("#custom-input")[0].valueAsNumber)
                : 1;
        } else {
            if (SharkGame.Settings.current.buyAmount < 0 && noMaxBuy) {
                return 1;
            } else {
                return SharkGame.Settings.current.buyAmount;
            }
        }
    },

    // This is weird
    getPurchaseAmount(resource, owned = res.getResource(resource)) {
        const buy = sharkmath.getBuyAmount();

        if (buy > 0) {
            return buy;
        } else {
            return Math.floor(owned / -buy);
        }
    },
};

// linear floor(sqrt(current^2 + current + 2 * price/k + 1/4) - 1/2)
// exponential floor(log(b^old + (b-1) * price / k) / log(b))
// linear total cost = k / 2 * (n^2 + n)
// exponential total cost = k * (b^n - 1) / (b - 1)

SharkGame.TextUtil = {
    plural(number) {
        return number === 1 ? "" : "s";
    },

    getDeterminer(name) {
        const firstLetter = SharkGame.ResourceMap.get(name).name.charAt(0);

        // note to self: make the next line not suck
        // Possibly add an "uncountable" property to resources somehow? Manual works fine though
        if (
            [
                "kelp",
                "sand",
                "algae",
                "coral",
                "spronge",
                "delphinium",
                "coralglass",
                "porite",
                "sharkonium",
                "residue",
                "tar",
                "ice",
                "science",
                "arcana",
                "kelp",
                "calcinium",
            ].includes(name)
        ) {
            return "";
        } else if ("aeiou".includes(firstLetter)) {
            return "an";
        } else {
            return "a";
        }
    },

    getIsOrAre(name, amount = res.getResource(name)) {
        // should make a universal list for these somewhere in textutil, ya?
        if (
            [
                "sand",
                "algae",
                "coral",
                "sponge",
                "spronge",
                "delphinium",
                "coralglass",
                "porite",
                "sharkonium",
                "residue",
                "tar",
                "ice",
                "science",
                "arcana",
                "kelp",
                "calcinium",
            ].includes(name) ||
            amount === 1
        ) {
            return "is";
        }
        return "are";
    },

    shouldHideNumberOfThis(name) {
        return [`world`, `aspectAffect`, `specialResourceOne`, `specialResourceTwo`].includes(name);
    },

    /** @param {string} string */
    boldString(string) {
        return `<span class='bold'>${string}</span>`;
    },

    beautify(number, suppressDecimals, toPlaces) {
        if (cad.noNumberBeautifying) {
            return number.toExponential(5);
        } else if (SharkGame.Settings.current.notation === "exponen") {
            return number.toExponential(2);
        }

        let formatted;

        let negative = false;
        if (number < 0) {
            negative = true;
            number *= -1;
        }

        if (number === Number.POSITIVE_INFINITY) {
            formatted = "infinite";
        } else if (number < 1 && number >= 0) {
            if (suppressDecimals) {
                formatted = "0";
            } else if (number >= 0.01) {
                formatted = number.toFixed(2) + "";
            } else if (number >= 0.001) {
                formatted = number.toFixed(3) + "";
            } else if (number >= 0.0001) {
                formatted = number.toFixed(4) + "";
            } else if (number >= 0.00001) {
                // number > 0.00001 && negative -> number > 0.00001 && number < 0 -> false
                formatted = number.toFixed(5) + "";
            } else {
                formatted = "0";
            }

            if (negative) {
                formatted = "-" + formatted;
            }
        } else {
            let suffixes;
            switch (SharkGame.Settings.current.notation) {
                case "SI":
                    suffixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
                    break;
                default:
                    suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
            }
            const digits = Math.floor(Math.log10(number));
            // Max for a case where the supported suffix is not specified
            const precision = Math.max(0, 2 - (digits % 3));
            const suffixIndex = Math.floor(digits / 3);

            let suffix;
            if (suffixIndex >= suffixes.length) {
                if (number > 1e290) {
                    formatted = "max";
                } else if (number > 1e200) {
                    formatted = "too much";
                } else if (number > 1e100) {
                    formatted = "tons";
                } else {
                    formatted = "lots";
                }
            } else {
                suffix = suffixes[suffixIndex];
                // fix number to be compliant with suffix
                if (suffixIndex > 0) {
                    number /= Math.pow(1000, suffixIndex);
                }
                let formattedNumber;
                if (suffixIndex === 0) {
                    if (toPlaces && toPlaces - digits > 0 && number !== Math.floor(number)) {
                        formattedNumber = number.toFixed(toPlaces - digits);
                    } else {
                        formattedNumber = Math.floor(number);
                    }
                } else if (suffixIndex > 0) {
                    formattedNumber = number.toFixed(precision) + suffix;
                } else {
                    formattedNumber = number.toFixed(precision);
                }
                formatted = (negative ? "-" : "") + formattedNumber;
            }
        }

        return formatted;
    },

    beautifyIncome(number, also = "") {
        if (cad.noNumberBeautifying) {
            return number.toExponential(3) + also;
        }

        const abs = Math.abs(number);
        if (abs >= 0.001) {
            number = sharktext.beautify(number, false, 2);
            number += also;
            number += "/s";
        } else if (abs > 0.000001) {
            number *= 3600;
            number = number.toFixed(3);
            number += also;
            number += "/h";
        } else {
            number = 0 + also + "/s";
        }
        return number;
    },

    formatTime(milliseconds) {
        const numCentiseconds = Math.floor((milliseconds % 1000) / 10);
        const numSeconds = Math.floor(milliseconds / 1000);
        const numMinutes = Math.floor(numSeconds / 60);
        const numHours = Math.floor(numMinutes / 60);
        const numDays = Math.floor(numHours / 24);
        const numWeeks = Math.floor(numDays / 7);
        const numMonths = Math.floor(numWeeks / 4);
        const numYears = Math.floor(numMonths / 12);

        const formatCentiseconds =
            (milliseconds / 1000 < 10 ? "." + numCentiseconds.toString(10).padStart(2, "0") : "") + (numMinutes === 0 ? "s" : "");
        const formatSeconds = (numSeconds % 60).toString(10).padStart(numSeconds >= 60 ? 2 : 0, "0");
        const formatMinutes = numMinutes > 0 ? (numMinutes % 60).toString(10).padStart(2, "0") + ":" : "";
        const formatHours = numHours > 0 ? (numHours % 24).toString() + ":" : "";
        const formatDays = numDays > 0 ? (numDays % 7).toString() + "D, " : "";
        const formatWeeks = numWeeks > 0 ? (numWeeks % 4).toString() + "W, " : "";
        const formatMonths = numMonths > 0 ? (numMonths % 12).toString() + "M, " : "";
        const formatYears = numYears > 0 ? numYears.toString() + "Y, " : "";

        return formatYears + formatMonths + formatWeeks + formatDays + formatHours + formatMinutes + formatSeconds + formatCentiseconds;
    },

    getResourceName(resourceName, darken, arbitraryAmount, background, textToColor) {
        if (res.isCategory(resourceName)) {
            return textToColor || SharkGame.ResourceCategories[resourceName].name;
        }
        const resource = SharkGame.ResourceMap.get(resourceName);
        const amount = arbitraryAmount || Math.floor(SharkGame.PlayerResources.get(resourceName).amount);
        let name = textToColor || (amount - 1 < SharkGame.EPSILON ? resource.singleName : resource.name);
        let extraStyle = "";

        if (SharkGame.flags.egg) {
            if (amount > 1) {
                name = `eggs`;
            } else {
                name = `egg`;
            }
        }

        // easter egg logic
        if (name === "world") {
            name = Math.random() > 0.0005 ? "world" : "ZA WARUDO";
        }

        if (SharkGame.Settings.current.boldCosts) {
            name = name.bold();
        }

        if (SharkGame.Settings.current.colorCosts !== "none") {
            let color = SharkGame.Settings.current.colorCosts === "color" ? resource.color : sharkcolor.getBrightColor(resource.color);
            if (darken) {
                color = sharkcolor.colorLum(resource.color, -0.5);
            } else if (background) {
                // this code
                const backRLum = sharkcolor.getRelativeLuminance(background);
                const colorRLum = sharkcolor.getRelativeLuminance(color);
                let contrast;
                if (colorRLum > backRLum) {
                    contrast = (colorRLum + 0.05) / (backRLum + 0.05);
                } else {
                    contrast = (backRLum + 0.05) / (colorRLum + 0.05);
                }
                const tolerance = 3.5; // for easy changing
                if (contrast < tolerance) {
                    const requiredLuminance = tolerance * backRLum + 0.05 * tolerance - 0.05;
                    color = sharkcolor.correctLuminance(color, requiredLuminance > 1 ? (backRLum + 0.05) / tolerance - 0.05 : requiredLuminance);
                }
            }
            // if (background) color = background;
            extraStyle = " style='color:" + color + "'";
        }
        return "<span class='click-passthrough'" + extraStyle + ">" + name + "</span>";
    },

    // make a resource list object into a string describing its contents
    resourceListToString(resourceList, darken, backgroundColor) {
        if ($.isEmptyObject(resourceList)) {
            return "";
        }
        let formattedResourceList = "";
        _.each(resourceList, (resourceAmount, resourceId) => {
            if (typeof resourceAmount === "object") {
                resourceAmount = resourceAmount.toNumber();
            }
            if (resourceAmount > 0 && world.doesResourceExist(resourceId)) {
                formattedResourceList += sharktext.beautify(resourceAmount);
                formattedResourceList += " " + sharktext.getResourceName(resourceId, darken, resourceAmount, backgroundColor) + ", ";
            }
        });
        // snip off trailing suffix
        formattedResourceList = formattedResourceList.slice(0, -2);
        return formattedResourceList;
    },
};

SharkGame.ColorUtil = {
    colorLum(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, "");
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = "#";
        for (let i = 0; i < 3; i++) {
            let color = parseInt(hex.substr(i * 2, 2), 16);
            color = Math.round(Math.min(Math.max(0, color + color * lum), 255)).toString(16);
            rgb += ("00" + color).substr(color.length);
        }

        return rgb;
    },

    getRelativeLuminance(color) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        let red = parseInt(color.substr(0, 2), 16);
        let green = parseInt(color.substr(2, 2), 16);
        let blue = parseInt(color.substr(4, 2), 16);
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        let lum = 0;
        _.each([red, green, blue], (piece, index) => {
            if (piece <= 0.03928) {
                piece = piece / 12.92;
            } else {
                piece = ((piece + 0.055) / 1.055) ** 2.4;
            }
            lum += piece * [0.2126, 0.7152, 0.0722][index];
        });
        return lum;
    },

    correctLuminance(color, luminance) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        let red = parseInt(color.substr(0, 2), 16);
        let green = parseInt(color.substr(2, 2), 16);
        let blue = parseInt(color.substr(4, 2), 16);
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        const varA = 1.075 * (0.2126 * red ** 2 + 0.7152 * green ** 2 + 0.0722 * blue ** 2);
        const varB = -0.075 * (0.2126 * red + 0.7152 * green + 0.0722 * blue);
        const ratio = Math.max((-varB + Math.sqrt(varB ** 2 + 4 * varA * luminance)) / (2 * varA), 0);
        red = parseInt(Math.min(255, 255 * red * ratio).toFixed(0))
            .toString(16)
            .padStart(2, "0");
        green = parseInt(Math.min(255, 255 * green * ratio).toFixed(0))
            .toString(16)
            .padStart(2, "0");
        blue = parseInt(Math.min(255, 255 * blue * ratio).toFixed(0))
            .toString(16)
            .padStart(2, "0");
        return "#" + red + green + blue;
    },

    convertColorString(color) {
        const colors = color
            .substring(4)
            .replace(/[^0-9a-f]/gi, " ")
            .split(" ");
        let colorstring = "#";
        for (let i = 0; i < 3; i++) {
            colorstring += ("00" + parseInt(colors[i * 2]).toString(16)).substr(parseInt(colors[i * 2]).toString(16).length);
        }
        return colorstring;
    },

    getBrightColor(color) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        let red = parseInt(color.substr(0, 2), 16);
        let green = parseInt(color.substr(2, 2), 16);
        let blue = parseInt(color.substr(4, 2), 16);
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        const most = Math.max(red, green, blue);
        red = parseInt((255 * (1 / most) * red).toFixed(0)).toString(16);
        green = parseInt((255 * (1 / most) * green).toFixed(0)).toString(16);
        blue = parseInt((255 * (1 / most) * blue).toFixed(0)).toString(16);
        return "#" + red + green + blue;
    },

    getElementColor(id, propertyName = "background-color") {
        const color = getComputedStyle(document.getElementById(id)).getPropertyValue(propertyName);
        return sharkcolor.convertColorString(color);
    },

    getVariableColor(variable) {
        return getComputedStyle(document.body).getPropertyValue(variable).replace(/ /g, "");
    },
};

SharkGame.TimeUtil = {
    getRunTime(ignoreMinuteHandAndPause) {
        const realRunTime = _.now() - SharkGame.timestampRunStart;
        const pausedTime = SharkGame.persistentFlags.totalPausedTime + SharkGame.persistentFlags.currentPausedTime;
        let storedTime = 0;
        if (typeof SharkGame.flags.hourHandLeft === `number`) {
            storedTime = SharkGame.flags.minuteHandTimer - SharkGame.flags.hourHandLeft;
        }
        if (typeof SharkGame.flags.bonusTime === `number`) {
            storedTime -= SharkGame.flags.bonusTime;
        }

        if (ignoreMinuteHandAndPause) {
            return realRunTime;
        } else {
            return realRunTime - pausedTime - storedTime;
        }
    },
};

SharkGame.MiscUtil = {
    tryAddProperty(object, property, value) {
        if (_.isUndefined(object[property])) {
            object[property] = value;
        }
        return object;
    },
};
