"use strict";
/**
 * Can be indexed with the name of a modifier to return the associated data in SharkGame.ModifierTypes.
 */
SharkGame.ModifierReference = new Map();

/**
 * @typedef {Object} modifier
 * @property {string} name - The name of the modifier, if applicable
 * @property {number} defaultValue - The default value that the modifier takes in the modifier map
 */
// I can't get the methods to be defined as a part of the type so

// AN OVERVIEW OF THE MODIFIER SYSTEM

// The modifier system is effectively an overblown upgrade system with infinite flexibility. It's hard to talk about the modifier system though; it's easier to use an example.
// When purchasing most upgrades, incomeMultiplier for the upgraded generator is changed in response. The value it takes is the multiplier, in this case.
// The apply function of incomeBoost handles multiplying all the necessary incomes on its own; the effects of modifiers are handled independently.
// When purchasing some upgrades, we want to increase efficiency rather than speed.
// incomeBoost makes sure to only change incomes with positive values that are not tar,
// and yet incomeBoost for the upgraded generator is still set to the multiplier it provides.
// Just one value of incomeBoost keeps track of the entire set of possible effects.
// This is because incomeBoost handles its own behavior independent of the rest of the system, and the number it takes is merely its 'degree'.
// The degrees of these modifiers are written to SharkGame.ModifierMap.
//
// Most modifiers behave this way. Their code is handled independently, specifically so that there are few restrictions on what they can achieve.

/**
 * @type {Record<string, Record<string, Record<string, modifier>>>}
 */
SharkGame.ModifierTypes = {
    upgrade: {
        multiplier: {
            incomeMultiplier: {
                defaultValue: 1,
                // documentation for just the first modifier since i cant seem to find a way to add it to the type definition
                /**
                 * Changes the incomes of various resources in accordance with the modifier's effects, and returns how its own value should change after application.
                 * @param {any} current Usually a number, but may also be an array. Represents the current degree/state of the modifier with respect to the resource being modified.
                 * @param {any} degree The change to the value of the modifier.
                 * @param {string} resource The resource to apply the effect to.
                 * @returns The new degree/state for the modifier. See res.applyModifier().
                 */
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * degree;
                    });
                    return current * degree;
                },
                /**
                 * Generates a description of a modifier's effect at a specific degree on a specific resource. Used in world selection when viewing world properties using distant foresight, and for the descriptions of the effects of upgrades.
                 * @param {*} degree The hypothetical value of the modifier.
                 * @param {*} resource The resource that the effect would be applied to.
                 * @param {string} background The background of the effect text to ensure there is enough contrast.
                 * @returns A description of the hypothetical effect of the modifier.
                 */
                effectDescription(degree, resource, background) {
                    return sharktext.getResourceName(resource, undefined, undefined, background) + " speed × " + degree;
                },
                /**
                 * Tells how much a specific generator-income pair with specific modifier degrees has its income multiplied. Only used for multiplier-like modifiers, otherwise returns 1. Used in the grotto in advanced view; see res.getMultiplierProduct().
                 * @param {number} genDegree The degree of this modifier on the generator resource.
                 * @param {number} _outDegree The degree of this modifier on the generated resource.
                 * @param {string} _gen The generator resource.
                 * @param {string} _out The generated resource.
                 * @returns A number: how much the income is multiplied.
                 */
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                /**
                 * Takes an arbitrary amount of income and simulates the effect of applying the modifier. Used when reapplying modifiers; see res.reapplyModifiers().
                 * @param {number} input The hypothetical number representing income.
                 * @param {number} genDegree The hypothetical degree of this modifier on the generator resource.
                 * @param {number} _outDegree The hypothetical degree of this modifier on the generated resource.
                 * @param {string} _gen The hypothetical generator resource.
                 * @param {string} _out The hypothetical generated resource.
                 * @returns The income if the modifier was applied under these condition.
                 */
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
                },
            },
            resourceBoost: {
                defaultValue: 1,
                apply(current, degree, boostedResource) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * degree;
                            }
                        });
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return "All " + sharktext.getResourceName(resource, undefined, undefined, background) + " production × " + degree;
                },
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
                },
            },
            incomeBoost: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        if (income > 0 && resouceId !== "tar") {
                            incomes[resouceId] = income * degree;
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return sharktext.getResourceName(resource, undefined, undefined, background) + " efficiency × " + degree;
                },
                getEffect(genDegree, _outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (input > 0 && out !== "tar" ? genDegree : 1);
                },
            },
            sandMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    if (incomes.sand) {
                        incomes.sand = incomes.sand * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return (
                        sharktext.getResourceName(resource, undefined, undefined, background) +
                        " collection of " +
                        sharktext.getResourceName("sand", undefined, undefined, background) +
                        " × " +
                        degree
                    );
                },
                getEffect(genDegree, _outDegree, _gen, out) {
                    return out === "sand" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (out === "sand" ? genDegree : 1);
                },
            },
            kelpMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    if (incomes.kelp) {
                        incomes.kelp = incomes.kelp * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return (
                        sharktext.getResourceName(resource, undefined, undefined, background) +
                        " collection of " +
                        sharktext.getResourceName("kelp", undefined, undefined, background) +
                        " × " +
                        degree
                    );
                },
                getEffect(genDegree, _outDegree, _gen, out) {
                    return out === "kelp" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (out === "kelp" ? genDegree : 1);
                },
            },
            heaterMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    if (incomes.ice && incomes.ice < 0) {
                        incomes.ice = incomes.ice * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return (
                        sharktext.getResourceName(resource, false, 2, background) +
                        " melt " +
                        sharktext.getResourceName("ice", undefined, undefined, background) +
                        " " +
                        degree +
                        "× faster."
                    );
                },
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (out === "ice" && input < 0 ? genDegree : 1);
                },
            },
        },
        other: {
            addCoralIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.coral = (baseIncomes.coral ? baseIncomes.coral : 0) + degree;
                    res.reapplyModifiers(resource, "coral");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`coral`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
            addJellyIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.jellyfish = (baseIncomes.jellyfish ? baseIncomes.jellyfish : 0) + degree;
                    res.reapplyModifiers(resource, "jellyfish");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`jellyfish`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
            addFishIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.fish = (baseIncomes.fish ? baseIncomes.fish : 0) + degree;
                    res.reapplyModifiers(resource, "fish");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`fish`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
            addSpongeIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.sponge = (baseIncomes.sponge ? baseIncomes.sponge : 0) + degree;
                    res.reapplyModifiers(resource, "sponge");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`sponge`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
            addAlgaeIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.algae = (baseIncomes.algae ? baseIncomes.algae : 0) + degree;
                    res.reapplyModifiers(resource, "algae");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`algae`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
            addSandIncome: {
                defaultValue: 0,
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get(resource).baseIncome) {
                        SharkGame.ResourceMap.get(resource).baseIncome = {};
                    }
                    if (!SharkGame.ResourceMap.get(resource).income) {
                        SharkGame.ResourceMap.get(resource).income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.sand = (baseIncomes.sand ? baseIncomes.sand : 0) + degree;
                    res.reapplyModifiers(resource, "sand");
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return `Add ${degree} ${sharktext.getResourceName(`sand`, false, false, background)}/s to ${sharktext.getResourceName(
                        resource,
                        false,
                        69,
                        background
                    )}`;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
                },
            },
        },
    },

    world: {
        multiplier: {
            planetaryIncomeMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Multiplier",
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        incomes[resouceId] = income * (1 + degree);
                    });
                    return current * (1 + degree);
                },
                effectDescription(degree, resource, background) {
                    return "Income from " + sharktext.getResourceName(resource, false, 2, background) + " ×" + (1 + degree).toFixed(2);
                },
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
                },
            },
            planetaryIncomeReciprocalMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Reciprocal Multiplier",
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * (1 / (1 + degree));
                    });
                    return current * (1 / (1 + degree));
                },
                effectDescription(degree, resource, background) {
                    return "Income from " + sharktext.getResourceName(resource, false, 2, background) + " ×" + (1 / (1 + degree)).toFixed(2);
                },
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
                },
            },
            planetaryResourceBoost: {
                defaultValue: 1,
                name: "Planetary Boost",
                apply(current, degree, boostedResource) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * (1 + degree);
                            }
                        });
                    });
                    return current * (1 + degree);
                },
                effectDescription(degree, resource, background) {
                    return "All " + sharktext.getResourceName(resource, false, 2, background) + " production ×" + (1 + degree).toFixed(2);
                },
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
                },
            },
            planetaryResourceReciprocalBoost: {
                defaultValue: 1,
                name: "Planetary Reciprocal Boost",
                apply(current, degree, boostedResource) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * (1 / (1 + degree));
                            }
                        });
                    });
                    return current * (1 / (1 + degree));
                },
                effectDescription(degree, resource, background) {
                    return "All " + sharktext.getResourceName(resource, false, 2, background) + " production ×" + (1 / (1 + degree)).toFixed(2);
                },
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
                },
            },
            planetaryFishMultiplier: {
                defaultValue: 1,
                apply(current, degree, boostedGenerator) {
                    const incomes = SharkGame.ResourceMap.get(boostedGenerator).income;
                    if (incomes.fish) {
                        incomes.fish = incomes.fish * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, boostedGenerator, background) {
                    return (
                        sharktext.getResourceName(boostedGenerator, undefined, undefined, background) +
                        " collection of " +
                        sharktext.getResourceName("fish", undefined, undefined, background) +
                        " × " +
                        degree
                    );
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (out === "fish" ? genDegree : 1);
                },
            },
        },
        other: {
            planetaryIncome: {
                defaultValue: 0,
                name: "Income per Climate Level",
                apply(current, degree, resource) {
                    if (!SharkGame.ResourceMap.get("world").baseIncome) {
                        SharkGame.ResourceMap.get("world").baseIncome = {};
                        SharkGame.ResourceMap.get("world").income = {};
                    }
                    const baseIncomes = SharkGame.ResourceMap.get("world").baseIncome;
                    baseIncomes[resource] = (baseIncomes[resource] ? baseIncomes[resource] : 0) + degree;
                    res.reapplyModifiers("world", resource);
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return (
                        "Gain " + sharktext.beautify(degree) + " " + sharktext.getResourceName(resource, false, degree, background) + " per second"
                    );
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // planetary income handled separately
                    return input;
                },
            },
            planetaryStartingResources: {
                defaultValue: 0,
                name: "Planetary Starting Resources",
                apply(current, degree, resource) {
                    res.changeResource(resource * degree);
                    return current + degree;
                },
                effectDescription(degree, resource, background) {
                    return "Start with " + degree + " " + sharktext.getResourceName(resource, false, degree, background);
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // starting resources has no bearing on income
                    return input;
                },
            },
            planetaryGeneratorRestriction: {
                defaultValue: [],
                name: "Restricted Generator-Income Combination",
                apply(current, restriction, generator) {
                    SharkGame.ResourceMap.get(generator).income[restriction] = 0;
                    if (typeof current !== "object") {
                        return [restriction];
                    }
                    current.push(restriction);
                    return current;
                },
                effectDescription(restriction, generator, background) {
                    return (
                        sharktext.getResourceName(generator, false, 2, background) +
                        " cannot produce " +
                        sharktext.getResourceName(restriction, false, 2, background)
                    );
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return genDegree.includes(out) ? 0 : input;
                },
            },
        },
    },

    aspect: {
        multiplier: {
            pathOfIndustry: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        if (income > 0 && resouceId !== "tar") {
                            incomes[resouceId] = income * degree;
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return sharktext.getResourceName(resource, undefined, undefined, background) + " efficiency × " + degree;
                },
                getEffect(genDegree, _outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (input > 0 && out !== "tar" ? genDegree : 1);
                },
            },
            constructedConception: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        if (income > 0 && resouceId !== "tar") {
                            incomes[resouceId] = income * 2 ** degree;
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return sharktext.getResourceName(resource, undefined, undefined, background) + " efficiency × " + degree;
                },
                getEffect(genDegree, _outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? 2 ** (genDegree - 1) : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (input > 0 && out !== "tar" ? 2 ** (genDegree - 1) : 1);
                },
            },
            theTokenForGenerators: {
                defaultValue: 1,
                apply(current, degree, resource) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * degree;
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return sharktext.getResourceName(resource, undefined, undefined, background) + " speed × " + degree;
                },
                getEffect(genDegree, _outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
                },
            },
            theTokenForResources: {
                defaultValue: 1,
                apply(current, degree, boostedResource) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * degree;
                            }
                        });
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, background) {
                    return "All " + sharktext.getResourceName(resource, undefined, undefined, background) + " production × " + degree;
                },
                getEffect(_genDegree, outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? outDegree : 1;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input > 0 ? input * outDegree : input;
                },
            },
        },
        other: {
            clawSharpening: {
                defaultValue: 0,
                apply(_current, degree, resource) {
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.fish = 0.1 * 2 ** (degree - 1);
                    res.reapplyModifiers(resource, "fish");
                    return degree;
                },
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    return input;
                },
            },
        },
    },
};
