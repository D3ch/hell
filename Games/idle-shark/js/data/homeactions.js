"use strict";
SharkGame.HomeActions = {
    generated: {},

    getActionTable(worldType = world.worldType) {
        if (typeof SharkGame.HomeActions[worldType] !== "object" || worldType === "generated") {
            worldType = "default";
        }

        if (!_.has(SharkGame.HomeActions.generated, worldType)) {
            return (SharkGame.HomeActions.generated[worldType] = SharkGame.HomeActions.generateActionTable(worldType));
        } else {
            return SharkGame.HomeActions.generated[worldType];
        }
    },

    getActionData(table, actionName) {
        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[actionName]);

        if (data) {
            if (cad.actionPriceModifier !== 1) {
                _.each(data.cost, (costData) => {
                    costData.priceIncrease *= cad.actionPriceModifier;
                });
            }

            if (home.getActionCategory(actionName) === "frenzy") {
                _.each(data.cost, (costData) => {
                    costData.priceIncrease *= 0.5 ** SharkGame.Aspects.thePlan.level;
                });
            }
        }

        return data;
    },

    generateActionTable(worldType = world.worldType) {
        const defaultActions = SharkGame.HomeActions.default;

        if (!_.has(SharkGame.HomeActions, worldType)) {
            return defaultActions;
        }

        /** @type {Record<HomeActionName, HomeAction>} */
        const finalTable = {};
        const worldActions = SharkGame.HomeActions[worldType];

        // _.has
        _.each(Object.getOwnPropertyNames(worldActions), (actionName) => {
            if (!_.has(defaultActions, actionName)) {
                finalTable[actionName] = worldActions[actionName];
            } else {
                finalTable[actionName] = {};

                Object.defineProperties(
                    finalTable[actionName],
                    Object.getOwnPropertyDescriptors(worldActions[actionName])
                );

                const defaultPropertiesToDefine = _.pickBy(
                    Object.getOwnPropertyDescriptors(defaultActions[actionName]),
                    (_propertyDescriptor, propertyName) => {
                        return !_.has(finalTable, [actionName, propertyName]);
                    }
                );

                Object.defineProperties(finalTable[actionName], defaultPropertiesToDefine);
            }
        });

        return finalTable;
    },

    // something new to keep in mind:
    // the new system for keeping home actions in check at huge numbers doesn't work if the price increase isn't a whole number
    // so fractional costs are banned now
    // that's not a big deal anyways though, just multiply some numbers around to make the equivalent balance work out in the end with a non-fractional cost

    default: {
        // FREEBIES ////////////////////////////////////////////////////////////////////////////////

        catchFish: {
            name: "Catch fish",
            effect: {
                resource: {
                    get fish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {},
            outcomes: [
                "Dropped the bass.",
                "Ate a kipper. Wait. Hang on.",
                "You eat a fish hooray!",
                "Fish.",
                "Ate a shark. Wait. No, it wasn't a shark.",
                "Ate an anchovy.",
                "Ate a catfish.",
                "Ate a flounder.",
                "Ate a haddock.",
                "Ate a herring.",
                "Ate a mackerel.",
                "Ate a mullet.",
                "Ate a perch.",
                "Ate a pollock.",
                "Ate a salmon.",
                "Ate a sardine.",
                "Ate a sole.",
                "Ate a tilapia.",
                "Ate a trout.",
                "Ate a whitefish.",
                "Ate a bass.",
                "Ate a carp.",
                "Ate a cod.",
                "Ate a halibut.",
                "Ate a mahi mahi.",
                "Ate a monkfish.",
                "Ate a perch.",
                "Ate a snapper.",
                "Ate a bluefish.",
                "Ate a grouper.",
                "Ate a sea bass.",
                "Ate a yellowfin tuna.",
                "Ate a marlin.",
                "Ate an orange roughy.",
                "Ate a shark.",
                "Ate a swordfish.",
                "Ate a tilefish.",
                "Ate a tuna.",
                "Ate a swedish fish.",
                "Ate a goldfish.",
            ],
            helpText: "Use your natural shark prowess to find and catch a fish.",
        },

        debugbutton: {
            name: "Debug stuff",
            effect: {
                resource: {
                    fish: 10000000,
                    crystal: 10000000,
                    sharkonium: 100000000,
                    sand: 100000000,
                    kelp: 100000000,
                    science: 1000000000,
                    shark: 10000,
                },
            },
            cost: {},
            prereq: {
                // no prereqs
            },
            outcomes: [
                "Tested.",
                "Debugged.",
                "Ah, yes...this doesn't work as intended.",
                "Very interesting results here.",
                "A gift from the developer.",
                "You had better be testing something.",
                "Not intended for actual gameplay.",
                "...cheater.",
                "Oh, wow, you found the cheats menu and pressed a bunch of buttons. What a hacker!",
            ],
            helpText: "Use your natural coding prowess to find and catch bugs.",
            unauthorized: true,
        },

        prySponge: {
            name: "Pry sponge",
            effect: {
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["spongeCollection"],
                notWorlds: ["stone"],
            },
            outcomes: [
                "Pried an orange elephant ear sponge from the rocks.",
                "Pried a brain sponge from the rocks.",
                "Pried a branching tube sponge from the rocks.",
                "Pried a brown volcano carpet from the rocks.",
                "Pried a row pore rope sponge from the rocks.",
                "Pried a branching vase sponge from the rocks.",
                "Pried a chicken liver sponge from the rocks.",
                "Pried a red boring sponge from the rocks.",
                "Pried a heavenly sponge from the rocks.",
                "Pried a brown encrusting octopus sponge from the rocks.",
                "Pried a stinker sponge from the rocks.",
                "Pried a black-ball sponge from the rocks.",
                "Pried a strawberry vase sponge from the rocks.",
                "Pried a convoluted orange sponge from the rocks.",
                "Pried a touch-me-not sponge from the rocks. Ow.",
                "Pried a lavender rope sponge from the rocks.",
                "Pried a red-orange branching sponge from the rocks.",
                "Pried a variable boring sponge from the rocks.",
                "Pried a loggerhead sponge from the rocks.",
                "Pried a yellow sponge from the rocks.",
                "Pried an orange lumpy encrusting sponge from the rocks.",
                "Pried a giant barrel sponge from the rocks.",
            ],
            helpText: "Grab a sponge from the seabed for future use.",
        },

        getClam: {
            name: "Get clam",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Got a grooved carpet shell.",
                "Got a hard clam.",
                "Got a manila clam.",
                "Got a soft clam.",
                "Got an atlantic surf clam.",
                "Got an ocean quahog.",
                "Got a pacific razor clam.",
                "Got a pismo clam.",
                "Got a geoduck.",
                "Got an atlantic jackknife clam.",
                "Got a lyrate asiatic hard clam.",
                "Got an ark clam.",
                "Got a nut clam.",
                "Got a duck clam.",
                "Got a marsh clam.",
                "Got a file clam.",
                "Got a giant clam.",
                "Got an asiatic clam.",
                "Got a peppery furrow shell.",
                "Got a pearl oyster.",
            ],
            helpText: "Fetch a clam. Why do we need clams now? Who knows.",
        },

        getJellyfish: {
            name: "Grab jellyfish",
            effect: {
                resource: {
                    get jellyfish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["jellyfishHunting"],
            },
            outcomes: [
                "Grabbed a mangrove jellyfish.",
                "Grabbed a lagoon jellyfish.",
                "Grabbed a nomuras jellyfish.",
                "Grabbed a sea nettle jellyfish.",
                "Grabbed an upside down jellyfish.",
                "Grabbed a comb jellyfish.",
                "Grabbed a sand jellyfish.",
                "Grabbed a box jellyfish.",
                "Grabbed a sea wasp jellyfish.",
                "Grabbed a blue blubber.",
                "Grabbed a white spotted jellyfish.",
                "Grabbed an immortal jellyfish.",
                "Grabbed a pelagia noctiluca.",
                "Grabbed a moon light jellyfish.",
                "Grabbed an iracongi irukandji jellyfish.",
                "Grabbed an irukandji jellyfish.",
                "Grabbed a moon jellyfish.",
                "Grabbed an aurelia aurita.",
                "Grabbed a ball jellyfish.",
                "Grabbed a cannonball jellyfish.",
                "Grabbed a man of war.",
                "Grabbed a war jellyfish.",
                "Grabbed a blue bottle jellyfish.",
                "Grabbed a lion's mane jellyfish.",
                "Grabbed a mane jellyfish.",
                "Grabbed a sun jellyfish.",
                "Grabbed a square jellyfish.",
                "Grabbed a physalia jellyfish.",
                "Grabbed a king jellyfish.",
                "Grabbed a cassiopeia jellyfish.",
            ],
            helpText: "Take a great risk in catching a jellyfish without being stung.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "Study sea apples",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "There's science inside these things, surely!",
                "The cause of science is advanced!",
                "This is perhaps maybe insightful!",
                "Why are we even doing this? Who knows! Science!",
                "What is even the point of these things? Why are they named for fruit? They're squirming!",
            ],
            helpText: "Dissect the sea apples our kelp attracts to gain additional science. Research!",
        },

        /*
        "spongeToScience": {
            name: "Dissect sponge",
            effect: {
                resource: {
                    science: 1
                }
            },
            cost: [
                {resource: "sponge", costFunction: "constant", priceIncrease: 1}
            ],
            max: "sponge",
            prereq: {
                resource: {
                    sponge: 1
                },
                upgrade: [
                    "xenobiology"
                ]
            },
            outcomes: [
                "Squishy porous science!",
                "The sponge has been breached and the science is leaking out!",
                "This is the best use of a sponge. Teeth dissections are the best.",
                "Sponge is now so many shreds. But so much was learned!",
                "The sponge is apparently not a plant. Yet plants feel more sophisticated than these things."
            ],
            helpText: "Dissect sponges to learn their porous secrets. Science!"
        },
        */

        pearlConversion: {
            name: "Convert clam pearls",
            effect: {
                resource: {
                    crystal: 1,
                },
            },
            cost: [
                { resource: "clam", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "constant", priceIncrease: 4 },
            ],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pearls to crystals! One day. One day, we will get this right and only use the pearl.",
                "Welp, we somehow turned rocks to crystals. Oh. Nope, those were clams. Not rocks. It's so hard to tell sometimes.",
                "Okay, we managed to only use the pearls this time, but we, uh, had to break the clams open pretty roughly.",
                "Pearls to... nope. Clams to crystals. Science is hard.",
            ],
            helpText: "Convert a pearl (and the clam around it) into crystal.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute stuff to sharkonium",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutation destination!",
                "Transmutation rejuvenation!",
                "Transmogrification revelation!",
                "Transformation libation!",
                "Transfiguration nation! ...wait.",
                "Sharkonium arise!",
                "Arise, sharkonium!",
                "More sharkonium!",
                "The substance that knows no name! Except the name sharkonium!",
                "The substance that knows no description! It's weird to look at.",
                "The foundation of a modern shark frenzy!",
            ],
            helpText: "Convert ordinary resources into sharkonium, building material of the future!",
        },

        smeltCoralglass: {
            name: "Smelt stuff to coralglass",
            effect: {
                resource: {
                    coralglass: 1,
                },
            },
            cost: [
                { resource: "coral", costFunction: "constant", priceIncrease: 10 },
                { resource: "sand", costFunction: "constant", priceIncrease: 10 },
            ],
            max: "coralglass",
            prereq: {
                upgrade: ["coralglassSmelting"],
            },
            outcomes: [
                "Coralglass smelted!",
                "Coralglass melted! No. Wait.",
                "How does coral become part of glass? Well, you see, it's all very simple, or that's what the lobster told me.",
                "The backbo-- the exoskeleton of the crustacean industry!",
                "So fragile. Yet so useful.",
            ],
            helpText: "Smelt resources into coralglass for use in crustacean machines!",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "Recruit shark",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "A bignose shark joins you.",
                "A blacktip reef shark joins you.",
                "A blue shark joins you.",
                "A bull shark joins you.",
                "A cat shark joins you.",
                "A crocodile shark joins you.",
                "A dusky whaler shark joins you.",
                "A dogfish joins you.",
                "A graceful shark joins you.",
                "A grey reef shark joins you.",
                "A goblin shark joins you.",
                "A hammerhead shark joins you.",
                "A hardnose shark joins you.",
                "A lemon shark joins you.",
                "A milk shark joins you.",
                "A nervous shark joins you.",
                "An oceanic whitetip shark joins you.",
                "A pigeye shark joins you.",
                "A sandbar shark joins you.",
                "A silky shark joins you.",
                "A silvertip shark joins you.",
                "A sliteye shark joins you.",
                "A speartooth shark joins you.",
                "A spinner shark joins you.",
                "A spot-tail shark joins you.",
                "A mako shark joins you.",
                "A tiger shark joins you.",
                "A tawny shark joins you.",
                "A white shark joins you.",
                "A zebra shark joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of sharks join you.",
                "That's a lot of sharks.",
                "The shark community grows!",
                "More sharks! MORE SHARKS!",
                "Sharks for the masses. Mass sharks.",
                "A shiver of sharks! No, that's a legit name. Look it up.",
                "A school of sharks!",
                "A shoal of sharks!",
                "A frenzy of sharks!",
                "A gam of sharks! Yes, that's correct.",
                "A college of sharks! They're a little smarter than a school.",
            ],
            helpText: "Recruit a shark to help catch more fish.",
        },

        getManta: {
            name: "Hire ray",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 5,
                },
            },
            outcomes: [
                "These guys seem to be kicking up a lot of sand!",
                "A spotted eagle ray joins you.",
                "A manta ray joins you.",
                "A stingray joins you.",
                "A clownnose ray joins you.",
                "A bluespotted maskray joins you.",
                "A bluntnose stingray joins you.",
                "A oman masked ray joins you.",
                "A bulls-eye electric ray joins you.",
                "A shorttailed electric ray joins you.",
                "A bentfin devil ray joins you.",
                "A lesser electric ray joins you.",
                "A cortez electric ray joins you.",
                "A feathertail stingray joins you.",
                "A thornback ray joins you.",
                "A giant shovelnose ray joins you.",
                "A pacific cownose ray joins you.",
                "A bluespotted ribbontail ray joins you.",
                "A marbled ribbontail ray joins you.",
                "A blackspotted torpedo ray joins you.",
                "A marbled torpedo ray joins you.",
                "A atlantic torpedo ray joins you.",
                "A panther torpedo ray joins you.",
                "A spotted torpedo ray joins you.",
                "A ocellated torpedo joins you.",
                "A caribbean torpedo joins you.",
                "A striped stingaree joins you.",
                "A sparesly-spotted stingaree joins you.",
                "A kapala stingaree joins you.",
                "A common stingaree joins you.",
                "A eastern fiddler ray joins you.",
                "A bullseye stingray joins you.",
                "A round stingray joins you.",
                "A yellow stingray joins you.",
                "A cortez round stingray joins you.",
                "A porcupine ray joins you.",
                "A sepia stingaree joins you.",
                "A banded stingaree joins you.",
                "A spotted stingaree joins you.",
                "A sea pancake joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of rays join you.",
                "That's a lot of rays.",
                "The ray conspiracy grows!",
                "I can't even deal with all of these rays.",
                "More rays more rays more more more.",
                "A school of rays!",
                "A fever of rays! Yes, seriously. Look it up.",
                "A whole lotta rays!",
                "The sand is just flying everywhere!",
                "So many rays.",
            ],
            helpText: "Hire a ray to help collect fish. They might kick up some sand from the seabed.",
        },

        getCrab: {
            name: "Acquire crab",
            effect: {
                resource: {
                    crab: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 10 }],
            max: "crab",
            prereq: {
                resource: {
                    shark: 10,
                    ray: 4,
                },
            },
            outcomes: [
                "A crab starts sifting shiny things out of the sand.",
                "A bering hermit joins you.",
                "A blackeye hermit joins you.",
                "A butterfly crab joins you.",
                "A dungeness crab joins you.",
                "A flattop crab joins you.",
                "A greenmark hermit joins you.",
                "A golf-ball crab joins you.",
                "A graceful crab joins you.",
                "A graceful decorator crab joins you.",
                "A graceful kelp crab joins you.",
                "A green shore crab joins you.",
                "A heart crab joins you.",
                "A helmet crab joins you.",
                "A longhorn decorator crab joins you.",
                "A maroon hermit joins you.",
                "A moss crab joins you.",
                "A northern kelp crab joins you.",
                "A orange hairy hermit joins you.",
                "A purple shore crab joins you.",
                "A pygmy rock crab joins you.",
                "A puget sound king crab joins you.",
                "A red rock crab joins you.",
                "A scaled crab joins you.",
                "A sharpnose crab joins you.",
                "A spiny lithoid crab joins you.",
                "A widehand hermit joins you.",
                "A umbrella crab joins you.",
            ],
            multiOutcomes: [
                "A lot of crabs join you.",
                "CRABS EVERYWHERE",
                "Crabs. Crabs. Crabs!",
                "Feels sort of crab-like around here.",
                "A cast of crabs!",
                "A dose of crabs!",
                "A cribble of crabs! Okay, no, that one's made up.",
                "So many crabs.",
                "I'm sorry to say, but you have crabs. Everywhere.",
            ],
            helpText: "Hire a crab to find things that sharks and rays overlook.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {
            name: "Train science shark",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doctor Shark, coming right up!",
                "A scientist shark is revealed!",
                "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!",
                "PhD approved!",
                "Graduation complete!",
                "A new insight drives a new shark to take up the cause of science!",
            ],
            multiOutcomes: [
                "The training program was a success!",
                "Look at all this science!",
                "Building a smarter, better shark!",
                "Beakers! Beakers underwater! It's madness!",
                "Let the science commence!",
                "Underwater clipboards! No I don't know how that works either!",
                "Careful teeth record the discoveries!",
            ],
            helpText: "Train a shark in the fine art of research and the science of, well, science.",
        },

        /*
        getProspector: {
            name: "Recruit shark prospector",
            effect: {
                resource: {
                    prospector: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "prospector",
            prereq: {
                upgrade: ["prospectorSharks"],
            },
            outcomes: [
                "Ready to mine!",
                "Well, there are worse jobs.",
                "Pickaxe? Check. Hard work? Check. Lack of proper safety regulations? Double check.",
                "I'm not sure why sharks think this is a good job? It sucks??",
                "Trained in the art of mine-fu. Ready to bust crystals.",
            ],
            multiOutcomes: [
                "How do you even get leverage underwater? Newton's third law? Anyone?",
                "So, they're back in the mine.",
                "Too bad there isn't something even better than crystal down there, like, diamonds or something.",
                "Go! Collect resources! Give me stone!",
                "No rock left unturned! Then, break the rocks you turn over, there might be goodies inside!",
            ],
            helpText: "Train and equip a shark to break crystals and mine stone in sub-ocean caverns.",
        },
        */

        getNurse: {
            name: "Train nurse shark",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "A nurse shark is ready!",
                "Shark manufacturer primed.",
                "Nurse shark trained.",
                "Medical exam passed! Nurse shark is go!",
            ],
            multiOutcomes: [
                "More sharks are on the way soon.",
                "Shark swarm begins!",
                "There will be no end to the sharks!",
                "Sharks forever!",
                "The sharks will never end. The sharks are eternal.",
                "More sharks to make more sharks to make more sharks...",
            ],
            helpText: "Remove a shark from fish duty and set them to shark making duty.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {
            name: "Equip laser ray",
            effect: {
                resource: {
                    laser: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "laser",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["laserRays"],
            },
            outcomes: [
                "Laser ray online!",
                "Laser ray! With a laser ray! It's laser ray, with a laaaaaser raaaay!",
                "Laser ray.",
                "Ray suited up with a laaaaaaser!",
                "Ray lasered. To use a laser. Not the subject of a laser.",
            ],
            multiOutcomes: [
                "Boil the seabed!",
                "Churn the sand to crystal!",
                "Laser ray armada in position!",
                "Ray crystal processing initiative is growing stronger every day!",
                "Welcome to the future! The future is lasers!",
            ],
            helpText: "Remove a ray from sand detail and let them fuse sand into raw crystal.",
        },

        /*
        getShoveler: {
            name: "Equip shoveler ray",
            effect: {
                resource: {
                    shoveler: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "shoveler",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["crystalShovel"],
            },
            outcomes: [
                "Shovel ray, at your service!",
                "For shovelry!",
                "The ray is excited to get started.",
                "Gravel is the future...I guess!",
                "Strapped a shovel to a ray. That ray is now a professional. Go get 'em!",
            ],
            multiOutcomes: [
                "Blue heroes with spades!",
                "No sand, only coarse, heavy pebbles!",
                "Let's get shoveling!",
                "Dig in!",
                "And they said shovelry was dead.",
                "The rays seemed bleak before. Now, they're excited.",
            ],
            helpText: "Remove a ray from fish detail and let them collect gravel instead.",
        },
        */

        getMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from sand business and let them concentrate on making more rays.",
        },

        /*
        stoneGetMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 2 },
                { resource: "fish", costFunction: "linear", priceIncrease: 350 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
                world: "stone",
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from fish business and let them concentrate on making more rays.",
        },
        */

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {
            name: "Gear up planter crab",
            effect: {
                resource: {
                    planter: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sand", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "planter",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["kelpHorticulture"],
            },
            outcomes: [
                "Crab set up with seeds.",
                "Shell studded with kelp.",
                "Crab is going on a mission. A mission... to farm.",
                "Planter crab equipped and ready to move a few feet and start planting some things!",
                "Crab is ready to farm!",
            ],
            multiOutcomes: [
                "Carpet the seabed!",
                "Kelp kelp kelp kelp kelp kelp kelp kelp.",
                "Horticulturists unite!",
                "Strike the sand!",
                "Pat the sand very gently and put kelp in it!",
                "More kelp. The apples. They hunger. They hunger for kelp.",
            ],
            helpText: "Equip a crab with the equipment and training to plant kelp across the ocean bottom.",
        },

        /*
        getMiller: {
            name: "Equip miller crab",
            effect: {
                resource: {
                    miller: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 25 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "miller",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["gravelMilling"],
            },
            outcomes: [
                "Crab has milling gear.",
                "Why is it milling, and not grinding?",
                "Crab has been prepared for pebble disintegration.",
                "How, you ask? With big, meaty claws, how else?",
                "Making gravel flour, hopefully not for gravel bread.",
            ],
            multiOutcomes: [
                "Doing nature's job for it.",
                "Millions of years of erosion become mere minutes in your hands...",
                "Be gone, gravel!",
                "Sand, come to this world!",
                "Crush the pebbles! Crush them into what is technically just smaller pebbles!",
            ],
            helpText: "Equip a crab with the equipment and training to grind gravel directly into sand.",
        },
        */

        getBrood: {
            name: "Form crab brood",
            effect: {
                resource: {
                    brood: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 20 },
                { resource: "fish", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "brood",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["crabBiology"],
            },
            outcomes: [
                "A bunch of crabs pile together into some sort of weird cluster.",
                "Crab team, assemble! FORM THE CRAB BROOD!",
                "[This message has been censored for reasons of being mostly really gross.]",
                "Eggs, eggs everywhere, but never stop and think.",
                "Writhing crab pile. Didn't expect those words next to each other today, did you.",
                "The crab brood is a rarely witnessed phenomenon, due to being some strange behaviour of crabs that have been driven to seek crystals for reasons only they understand.",
            ],
            multiOutcomes: [
                "The broods grow. The swarm rises.",
                "All these crabs are probably a little excessive. ...is what I could say, but I'm going to say this instead. MORE CRABS.",
                "A sea of crabs on the bottom of the sea. Clickity clackity.",
                "Snip snap clack clack burble burble crabs crabs crabs crabs.",
                "More crabs are always a good idea. Crystals aren't cheap.",
                "The broods swell in number. The sharks are uneasy, but the concern soon passes.",
            ],
            helpText: "Meld several crabs into a terrifying, incomprehensible crab-producing brood cluster.",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        /*
        getRockLobster: {
            name: "Train rock lobster",
            effect: {
                resource: {
                    rockLobster: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "rockLobster",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["rockBreaking"],
            },
            outcomes: [
                "Break the rocks, lobster. Break them!",
                "Deployed lobster with a giant crystal nutcracker.",
                "Ready to rock.",
                "Crushing rocks is exactly as difficult as it sounds. This lobster can verify.",
            ],
            multiOutcomes: [
                "Rocks, begone!",
                "Stones? What stones?!",
                "Goodbye, slate.",
                "Goodbye, granite.",
                "Goodbye, generic-looking stone.",
                "Goodbye, pumice.",
                "Goodbye, quartz.",
                "Goodbye, basalt.",
                "Goodbye, limestone.",
                "Goodbye, schist.",
                "Goodbye, diorite.",
            ],
            helpText: "Give a lobster the right gear to crack open stones in the name of gravel.",
        },

        getHarvester: {
            name: "Train lobster harvester",
            effect: {
                resource: {
                    harvester: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 25 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "harvester",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "Yes, lobster, put these claws to better use.",
                "It is time for this one to seek more interesting prey. Wait. Wait, no, it's just as stationary. Never mind. False alarm.",
                "Lobster sticks to seabed!",
            ],
            multiOutcomes: [
                "Cut down the kelp forests!",
                "Rip the sponge and tear the kelp!",
                "Harvest the seafloor!",
                "The lobster tide shall claim the-- wait no you said harvesters. Okay. Adjusting that, then.",
                "These guys are pretty unenthusiastic about everything they do, aren't they.",
            ],
            helpText: "Train a lobster to cut down kelp faster than anything can plant it. Sustainable!",
        },
        */

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {
            name: "Build crystal miner",
            effect: {
                resource: {
                    crystalMiner: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 200 - 100 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 25 },
            ],
            max: "crystalMiner",
            prereq: {
                resource: {
                    sharkonium: 25,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Crystal miner activated.",
                "Crystal miner constructed.",
                "Mining machine online.",
                "Construction complete.",
                "Carve rock. Remove sand. Retrieve target.",
            ],
            multiOutcomes: [
                "The machines rise.",
                "The miners dig.",
                "The crystal shall be harvested.",
                "Crystal miners are complete.",
            ],
            helpText: "Construct a machine to automatically harvest crystals efficiently.",
        },

        getSandDigger: {
            name: "Build sand digger",
            effect: {
                resource: {
                    sandDigger: 1,
                },
            },
            cost: [
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 500 - 250 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "sandDigger",
            prereq: {
                resource: {
                    sharkonium: 150,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Sand digger constructed.",
                "Sand digger reaches into the seabed.",
                "The digger begins to shuffle sand into its machine maw. Rays dart away.",
                "The machine is online.",
                "The machine acts immediately, shovelling sand.",
            ],
            multiOutcomes: [
                "The machines increase in number.",
                "The diggers devour.",
                "All sand must be gathered.",
                "The rays are concerned.",
                "Devour the sands. Consume.",
                "Giant machines blot out our sun.",
            ],
            helpText: "Construct a machine to automatically dig up sand efficiently.",
        },

        getFishMachine: {
            name: "Build fish machine",
            effect: {
                resource: {
                    fishMachine: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 100 }],
            max: "fishMachine",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Fish machine activated.",
                "Fish machine constructed.",
                "Fishing machine online.",
                "Construction complete.",
                "The quarry moves. But the machine is faster.",
            ],
            multiOutcomes: [
                "One day there will be no fish left. Only the machines.",
                "Today the shark is flesh. Tomorrow, machine.",
                "Your metal servants can sate the hunger. The hunger for fish.",
                "The fishing machines are more efficient than the sharks. But they aren't very smart.",
                "Automated fishing.",
                "The power of many, many sharks, in many, many devices.",
            ],
            helpText: "Construct a machine to automatically gather fish efficiently.",
        },

        getAutoTransmuter: {
            name: "Build auto-transmuter",
            effect: {
                resource: {
                    autoTransmuter: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "autoTransmuter",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Auto-transmuter activated.",
                "Auto-transmuter constructed.",
                "Transmutation machine online.",
                "Construction complete.",
                "Provide inputs. Only the output matters.",
            ],
            multiOutcomes: [
                "Auto-transmuters are prepared.",
                "The difference between science and magic is reliable application.",
                "All is change.",
                "Change is all.",
                "The machines know many secrets, yet cannot speak of them.",
            ],
            helpText: "Construct a machine to automatically and efficiently transmute sand and crystal to sharkonium.",
        },

        getSkimmer: {
            name: "Build skimmer",
            effect: {
                resource: {
                    skimmer: 1,
                },
            },
            cost: [
                {
                    resource: "junk",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 400 - 200 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "skimmer",
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Skimmer activated.",
                "Skimmer constructed.",
                "Residue producer online.",
                "Construction complete.",
                "Sacrifices must be made for progress.",
            ],
            multiOutcomes: [
                "The lesser resource becomes the greatest of all.",
                "Transmutation is limited. The recycler is greater.",
                "Consumption and production are two halves of the greater whole.",
                "The creations of sharks emerge from a pattern as old as their species.",
            ],
            helpText:
                "Construct a machine to automatically recycle fish and sand into residue with perfect efficiency.",
        },

        // MODDED MACHINES

        /*
        getCoalescer: {
            name: "Construct coalescer",
            effect: {
                resource: {
                    coalescer: 1,
                },
            },
            cost: [
                { resource: "knowledge", costFunction: "linear", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 20000000 },
                { resource: "delphinium", costFunction: "linear", priceIncrease: 2500 },
            ],
            max: "coalescer",
            prereq: {
                upgrade: ["knowledgeCoalescers"],
            },
            outcomes: [
                "Accuring thought energy.",
                "Put together a coalescer.",
                "Constructed a thought coalescer.",
                "The structure begins sapping thoughts from the surroundings.",
                "It's not really a machine...it's more like a ritual station.",
                "For something made by dolphins, it might seem smart, but that's just because it's sapping your brainpower.",
            ],
            multiOutcomes: [
                "Now we're thinking with portals...maybe. I think it involves a portal.",
                "Praise be to the brain gods!",
                "Big brain time.",
                "How do the dolphins know to do this?",
                "Free our minds, oh great creations!",
                "The dolphins seem very, very pleased. I'm not sure that I like this anymore.",
            ],
            helpText: "Create a strange structure to consistently siphon knowledge from its surroundings.",
        },

        getCrusher: {
            name: "Build crusher",
            effect: {
                resource: {
                    crusher: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 250 }],
            max: "crusher",
            prereq: {
                resource: {
                    stone: 1,
                },
                upgrade: ["rockProcessing"],
            },
            outcomes: ["Crusher activated.", "Crusher constructed.", "Crushing begins.", "Construction complete."],
            multiOutcomes: [
                "Stone wasn't very useful anyways.",
                "Shoo, rocks!",
                "We can never run out of rocks. The cycle is forever.",
                "CRUSH. KILL. DESTORY. SMALL ROCKS IN PARTICULAR.",
            ],
            helpText: "Construct a machine to break stone down into gravel.",
        },

        getPulverizer: {
            name: "Build pulverizer",
            effect: {
                resource: {
                    pulverizer: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 250 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "pulverizer",
            prereq: {
                resource: {
                    gravel: 1,
                },
                upgrade: ["gravelPulverizing"],
            },
            outcomes: [
                "Pulverizing begins in T-minus 3...",
                "Flipping the swtich on, the tumblers churn out sand.",
                "Pulverizer, activated.",
                "Construction complete.",
            ],
            multiOutcomes: [
                "The sand. It flows.",
                "The machines take over for the crabs.",
                "Right now, sand is like gold...we can't find it anywhere.",
                "Machines are better than crabs. They won't gravel- er, grovel.",
                "Man, sand is expensive.",
            ],
            helpText: "Construct a machine to break down gravel into sand.",
        },
        */
    },
    abandoned: {
        catchFish: {},

        debugbutton: {},

        prySponge: {
            prereq: {
                upgrade: ["spongeCollection"],
            },
        },
        getClam: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        spongeFiltration: {
            name: "Manufacture sponge filter",
            effect: {
                resource: {
                    filter: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "filter",
            prereq: {
                resource: {
                    sponge: 1,
                },
                upgrade: ["environmentalism"],
            },
            outcomes: [
                "Sweet, sweet filtration!",
                "Smell that water! Couldn't you just eat it like fish?!",
                "Hope restored.",
                "In darkness, we find salvation.",
                "One organism corrects the mistakes of another.",
                "Clean water restored.",
                "Surely, this is sustainable.",
                "Begone, filth!",
                "Saved by sponge. Who would've thought?",
            ],
            helpText: "Create filters from sponge to get rid of tar.",
        },

        breakDownAncientPart: {
            name: "Break down ancient parts",
            effect: {
                resource: {
                    science: 2500,
                },
            },
            cost: [{ resource: "ancientPart", costFunction: "constant", priceIncrease: 1 }],
            max: "ancientPart",
            prereq: {
                upgrade: ["reverseEngineering"],
            },
            outcomes: [
                "Fascinating.",
                "Progress.",
                "Ohh. Now it makes sense. Wait, nevermind.",
                "What are these even made out of??",
                "Now that it's taken apart, how do we put it back together??",
                "The doohickey's connected to the...spring-thing. The spring-thing's connected to the...wait, no it isn't.",
                "A lot was learned from this! Maybe!",
            ],
            helpText: "Break down ancient parts to advance science.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        forgeSpronge: {
            name: "Forge sponge into spronge",
            effect: {
                resource: {
                    spronge: 1,
                    // tar: 0.001,
                },
            },
            cost: [
                {
                    resource: "sponge",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "junk",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "spronge",
            prereq: {
                upgrade: ["industrialGradeSponge"],
            },
            outcomes: [
                "It pulses. That's unsettling.",
                "It shakes and quivers and otherwise acts sort of like sharkonium which is kind of freaking me out uh help",
                "Well, the octopuses know how to use this, I think.",
                "What... what <em>is</em> that?!",
                "Spronge. What a name. I don't think I could name it anything myself. Apart from 'horrifying'.",
                "Sweet fishmas, it's glowing. It's glowing!",
            ],
            helpText: "Repurpose boring old sponge into spronge, building material of the future.",
        },

        fuseAncientPart: {
            name: "Fuse stuff into ancient parts",
            effect: {
                resource: {
                    ancientPart: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 100 - 20 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 300 - 60 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "ancientPart",
            prereq: {
                upgrade: ["highEnergyFusion"],
            },
            outcomes: [
                "FUSION!",
                "Progress.",
                "The past is irrelevant when we create the future.",
                "What are we making again? What is this material???",
                "The water boils with energy, and the finished product drops to the seafloor.",
                "Fusion completed.",
                "The lasers converge to a point, superheating the clams and reforming them.",
                "How could this be made without already having the parts??",
            ],
            helpText: "Convert clams (and crystals) directly into ancient parts.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getOctopus: {
            name: "Employ octopus",
            effect: {
                resource: {
                    octopus: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 15 }],
            max: "octopus",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "A capricorn night octopus joins you.",
                "A plain-body night octopus joins you.",
                "A hammer octopus joins you.",
                "A southern keeled octopus joins you.",
                "A two-spot octopus joins you.",
                "A caribbean reef octopus joins you.",
                "A southern white-spot octopus joins you.",
                "A bigeye octopus joins you.",
                "A carolinian octopus joins you.",
                "A lesser pacific striped octopus joins you.",
                "A chestnut octopus joins you.",
                "A big blue octopus joins you.",
                "A lilliput longarm octopus joins you.",
                "A red-spot night octopus joins you.",
                "A globe octopus joins you.",
                "A scribbled night octopus joins you.",
                "A bumblebee two-spot octopus joins you.",
                "A southern sand octopus joins you.",
                "A lobed octopus joins you.",
                "A starry night octopus joins you.",
                "A atlantic white-spotted octopus joins you.",
                "A maori octopus joins you.",
                "A mexican four-eyed octopus joins you.",
                "A galapagos reef octopus joins you.",
                "An ornate octopus joins you.",
                "A white-striped octopus joins you.",
                "A pale octopus joins you.",
                "A japanese pygmy octopus joins you.",
                "A east pacific red octopus joins you.",
                "A spider octopus joins you.",
                "A moon octopus joins you.",
                "A frilled pygmy octopus joins you.",
                "A tehuelche octopus joins you.",
                "A gloomy octopus joins you.",
                "A veiled octopus joins you.",
                "A bighead octopus joins you.",
                "A common octopus joins you.",
                "A club pygmy octopus joins you.",
                "A star-sucker pygmy octopus joins you.",
                "An atlantic banded octopus joins you.",
            ],
            multiOutcomes: [
                "Efficiency increases with limb count.",
                "Hard to understand, but hardworking nonetheless.",
                "The minds of the octopuses are a frontier unbraved by many sharks.",
                "They hardly seem to notice you. They take their payment and begin to harvest.",
                "They say something about the schedule being on target.",
                "One of the new batch tells you to find unity in efficiency.",
                "You could have sworn you saw an octopus among the crowd glinting like metal.",
                "Octopi? No. Octopodes? Definitely not.",
            ],
            helpText: "Pay an octopus for their efficient clam retrieval services.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getCollector: {
            name: "Instruct collector crab",
            effect: {
                resource: {
                    collector: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "collector",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["agriculture"],
            },
            outcomes: [
                "Crab understands how to snip sponge.",
                "Crab will now get sponges.",
                "This crab has graduated from sponge school.",
                "One more educated individual, ready to do a surprisingly difficult task.",
            ],
            multiOutcomes: [
                "The crabs now understand how to get sponges.",
                "Collect and conquer. The sponges. Conquer the sponges.",
                "Sponge incoming!",
                "The porous fiends are no match for the claws of a crab!",
                "Crystals? Who needs crystals when you can have sponge?!",
                "Yes, collecting sponges is much harder than it looks!",
                "Why do we need these again?",
                "Each rock will have a crab, as each sponge has a rock.",
            ],
            helpText: "Instruct a crab on the proper way to collect sponges from rocks.",
        },

        getBrood: {},

        // OCTOPUS JOBS ////////////////////////////////////////////////////////////////////////////////

        getInvestigator: {
            name: "Reassign octopus as Investigator",
            effect: {
                resource: {
                    investigator: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "investigator",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["octopusMethodology"],
            },
            outcomes: [
                "An octopus is an investigator now.",
                "Octopus, investigator.",
                "The role has been assigned. investigator.",
                "The delegation has been made. investigator.",
                "This individual now investigates.",
            ],
            multiOutcomes: [
                "Investigators will study the unknown in pursuit of collective gain.",
                "Investigators will study objects they do not understand.",
                "Investigators will examine any thing out of place.",
                "Investigators will act as instructed.",
            ],
            helpText: "Delegate an octopus to investigate strange objects and phenomena for science.",
        },

        getScavenger: {
            name: "Reassign octopus as scavenger",
            effect: {
                resource: {
                    scavenger: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "scavenger",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["farAbandonedExploration"],
            },
            outcomes: [
                "An octopus is a scavenger now.",
                "Octopus, scavenger.",
                "The role has been assigned. Scavenger.",
                "The delegation has been made. Scavenger.",
                "This individual now scavenges.",
            ],
            multiOutcomes: [
                "Scavengers will retrieve the broken pieces of a once great society.",
                "Scavengers will scavenge from the wreckage of the city.",
                "Scavengers will take only what is still useful.",
                "Scavengers will act as instructed.",
            ],
            helpText: "Delegate an octopus to scavenge strange mechanical components from the city.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getSkimmer: {
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["recyclerDiscovery"],
            },
        },

        // OCTOPUS MACHINES /////////////////////////////////////////////////////////

        getClamCollector: {
            name: "Build clam collector",
            effect: {
                resource: {
                    clamCollector: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 50 }],
            max: "clamCollector",
            prereq: {
                resource: {
                    spronge: 50,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: clam collector. Operation: in progress.",
                "Machine: clam collector. Operation: beginning.",
                "Machine: clam collector. Result: clam collection.",
                "Machine: clam collector. Result: food for the masses.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more clam collectors now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in automation.",
            ],
            helpText: "This octopus machine collects clams. Simple purpose, simple machine.",
        },

        getEggBrooder: {
            name: "Build egg brooder",
            effect: {
                resource: {
                    eggBrooder: 1,
                },
            },
            cost: [
                { resource: "spronge", costFunction: "linear", priceIncrease: 150 },
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "eggBrooder",
            prereq: {
                resource: {
                    spronge: 150,
                    octopus: 10,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: egg brooder. Operation: in progress.",
                "Machine: egg brooder. Operation: beginning.",
                "Machine: egg brooder. Result: egg maintenance.",
                "Machine: egg brooder. Result: population rises.",
                "Machine: egg brooder. Cost: within acceptable parameters.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more egg brooders now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in an optimised generation.",
            ],
            helpText: "This octopus machine broods and incubates octopus eggs.",
        },

        getSprongeSmelter: {
            name: "Build spronge smelter",
            effect: {
                resource: {
                    sprongeSmelter: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 100 }],
            max: "sprongeSmelter",
            prereq: {
                resource: {
                    spronge: 100,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: spronge smelter. Operation: in progress.",
                "Machine: spronge smelter. Operation: beginning.",
                "Machine: spronge smelter. Result: spronge smelting.",
                "Machine: spronge smelter. Result: further development.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more spronge smelters now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in an assured future.",
            ],
            helpText: "This octopus machine imbues sponge with industrial potential. Requires residue for function.",
        },
    },
    haven: {
        catchFish: {},

        debugbutton: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            effect: {
                resource: {
                    get science() {
                        return 4 * (1 + 0.01 * res.getResource("historian"));
                    },
                },
            },
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        fuseDelphinium: {
            name: "Fuse stuff into delphinium",
            effect: {
                resource: {
                    delphinium: 1,
                },
            },
            cost: [
                {
                    resource: "coral",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "delphinium",
            prereq: {
                upgrade: ["aquamarineFusion"],
            },
            outcomes: [
                "Fusion confusion.",
                "Fission's fishy.",
                "Delphinium, something that, much like its inventors, just isn't quite as legitimate in the ocean.",
                "Delphinium, a substance we tolerate!",
                "Delphinium! It's a product!",
                "Delphinium! It... uh, is a thing! That exists!",
            ],
            helpText: "Fuse valuable resources into delphinium, which is kinda like sharkonium. Except worse.",
        },

        craftPapyrus: {
            name: "Craft kelp papyrus",
            effect: {
                resource: {
                    papyrus: 1,
                },
            },
            cost: [{ resource: "kelp", costFunction: "constant", priceIncrease: 15 }],
            max: "papyrus",
            prereq: {
                upgrade: ["kelpPapyrus"],
            },
            outcomes: ["foobar."],
            helpText: "Using the power of the sun somehow, make crunchy, solid kelp sheets for writing stuff down.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getDolphin: {
            name: "Fetch dolphin",
            effect: {
                resource: {
                    dolphin: 1,
                },
            },
            cost: [
                { resource: "fish", costFunction: "linear", priceIncrease: 5 },
                { resource: "coral", costFunction: "linear", priceIncrease: 2 },
            ],
            max: "dolphin",
            prereq: {
                upgrade: ["cetaceanAwareness"],
            },
            outcomes: [
                "A white beaked dolphin joins you.",
                "A short finned pilot whale joins you.",
                "A pantropical dolphin joins you.",
                "A long-finned pilot whale joins you.",
                "A hourglass dolphin joins you.",
                "A bottlenose dolphin joins you.",
                "A striped dolphin joins you.",
                "A pygmy killer whale joins you.",
                "A melon-headed whale joins you.",
                "An irrawaddy dolphin joins you.",
                "A dusky dolphin joins you.",
                "A clymene dolphin joins you.",
                "A black dolphin joins you.",
                "A southern right-whale dolphin joins you.",
                "A rough toothed dolphin joins you.",
                "A short beaked common dolphin joins you.",
                "A pacific white-sided dolphin joins you.",
                "A northern right-whale dolphin joins you.",
                "A long-snouted spinner dolphin joins you.",
                "A long-beaked common dolphin joins you.",
                "An atlantic white sided dolphin joins you.",
                "An atlantic hump-backed dolphin joins you.",
                "An atlantic spotted dolphin joins you.",
            ],
            multiOutcomes: [
                "A pod of dolphins!",
                "More of them. Hm.",
                "More of these squeaky chatterers.",
                "More whiners.",
                "Do we need these guys?",
                "They have to be good for something.",
            ],
            helpText: "Pay a dolphin to help us get coral or something. Prepare to put up with whining.",
        },

        getWhale: {
            name: "Reach whale",
            effect: {
                resource: {
                    whale: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 25000 }],
            max: "whale",
            prereq: {
                upgrade: ["whaleCommunication"],
            },
            outcomes: [
                "A blue whale joins you.",
                "A pygmy blue whale joins you.",
                "A bowhead whale joins you.",
                "A fin whale joins you.",
                "A gray whale joins you.",
                "A humpback whale joins you.",
                "A southern minke whale joins you.",
                "A common minke whale  joins you.",
                "A dwarf minke whale joins you.",
                "A pygmy right whale joins you.",
                "A north right whale  joins you.",
                "A southern right whale joins you.",
                "A sei whale joins you.",
                "A beluga whale joins you.",
                "A sperm whale joins you.",
                "A pygmy sperm whale joins you.",
                "A dwarf sperm whale joins you.",
            ],
            multiOutcomes: [
                "A pod of whales!",
                "Aloof, mysterious, big.",
                "So majestic. Wait, no, we're looking at a boulder formation.",
                "The songs are mesmerising.",
                "They might not all eat fish, but they're great at rounding them up.",
            ],
            helpText: "Persuade one of the great whales to help us out. They can round up entire schools.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        // DOLPHIN JOBS ////////////////////////////////////////////////////////////////////////////////

        getTreasurer: {
            name: "Promote dolphin treasurer",
            effect: {
                resource: {
                    treasurer: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "coral", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "treasurer",
            prereq: {
                upgrade: ["coralCollection"],
            },
            outcomes: [
                "Treasurer of the dolphin treasures, go!",
                "We are trusting this dolphin with a lot. Is that wise?",
                "A dolphin is promoted to where it can do slightly more damage!",
                "Dolphin treasurer ready to do... whatever it is they do.",
            ],
            multiOutcomes: [
                "Do we need this many treasurers?",
                "Should we be encouraging this?",
                "We require more crystals.",
                "You might be playing a dangerous game trusting these guys.",
                "The treasury grows!",
            ],
            helpText:
                "Promote a dolphin to a harder job involving interest on precious coral and crystal or something like that.",
        },

        getHistorian: {
            name: "Qualify dolphin historian",
            effect: {
                resource: {
                    historian: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "historian",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["retroactiveRecordkeeping"],
            },
            outcomes: [
                "We've given a dolphin free opportunity to ramble. WHY?!",
                "Let's humour this dolphin's rambling.",
                "This historian might have some insight.",
                "Maybe this dolphin can answer the question of why we're even working with dolphins.",
                "There are questions we have that this historian could answer for us.",
            ],
            multiOutcomes: [
                "We begrudgingly acknowledge that working together is providing us with new insights.",
                "History is told by the victors. The dolphins are losers, but they'll tell it anyway.",
                "These pretentious clicking jerks can sometimes raise a good point.",
                "Oh joy. We're encouraging them to talk more.",
                "Maybe if we let them talk about themselves a lot, they'll stop being so mean??",
                "Ah, yes. Qualify an ego-stroker.",
                "For the last time, I don't need to hear the story of Dolphantine again!!",
            ],
            helpText:
                "Determine which of these dolphins is actually smart, and not just repeating meaningless stories.",
        },

        getBiologist: {
            name: "Train dolphin biologist",
            effect: {
                resource: {
                    biologist: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 40 },
            ],
            max: "biologist",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["dolphinBiology"],
            },
            outcomes: [
                "Dolphin biologist graduated!",
                "Biologist trained.",
                "Dolphin dedicated to dolphin duty.",
                "Specialist dolphin ready for dolphin.",
            ],
            multiOutcomes: [
                "More of them. Eesh.",
                "Dolphins proliferate.",
                "Dolphin biologists ready for whatever passes for their 'research'.",
                "Smug hedonists, the lot of them!",
                "The dolphin population regretfully grows.",
            ],
            helpText:
                "Train a dolphin to specialise in biology. Dolphin biology, specifically, and production, apparently.",
        },

        // WHALE JOBS ////////////////////////////////////////////////////////////////////////////////

        getChorus: {
            name: "Assemble great chorus",
            effect: {
                resource: {
                    chorus: 1,
                },
            },
            cost: [
                {
                    resource: "whale",
                    costFunction: "unique",
                    priceIncrease: 3000,
                },
                {
                    resource: "dolphin",
                    costFunction: "unique",
                    priceIncrease: 100000,
                },
            ],
            max: "chorus",
            prereq: {
                resource: {
                    whale: 1,
                },
                upgrade: ["eternalSong"],
            },
            outcomes: [
                "The chorus is made.",
                "The singers sing an immortal tune.",
                "The song is indescribable.",
                "Serenity, eternity.",
                "What purpose does the song have?",
                "Liquid infinity swirls around the grand chorus.",
            ],
            helpText: "Form the singers of the eternal song. Let it flow through this world.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getSkimmer: {},

        // DOLPHIN MACHINES /////////////////////////////////////////////////////////

        getCrimsonCombine: {
            name: "Build crimson combine",
            effect: {
                resource: {
                    crimsonCombine: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 75 },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 300 - 150 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "crimsonCombine",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "The combine activates, and navigates to the nearest reef.",
                "Animals are torn from the reefbed at lightning speed.",
                "A red fog surrounds the machine as it begins to harvest.",
                "The blades of the combine spin up, and begin their reckless harvest.",
            ],
            multiOutcomes: [
                "Soon, the coral will be ours, but at what cost?",
                "Sustainability has failed us.",
                "We must resort to drastic measures in the name of progress.",
                "Treasurers are slow. Machines are fast. But not that fast, it's still made of delphinium, mind you.",
                "I hope the biosphere didn't need this coral for anything.",
                "The red mist grows.",
            ],
            helpText: "This dolphin machine pries coral from the reefs at a reckless pace.",
        },

        getKelpCultivator: {
            name: "Build kelp cultivator",
            effect: {
                resource: {
                    kelpCultivator: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "seaApple",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 25 - 12.5 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "kelpCultivator",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "The kelp cultivator activates and begins planting its garden.",
                "The kelp cultivator turns on and nagivates to a suitable planting spot.",
                "The kelp cultivator will not disturb the natural order.",
                "The kelp cultivator works in tandem with nature.",
            ],
            multiOutcomes: [
                "Sustainability is a must.",
                "These gentle machines are, in fact, slow and methodical, just as expected from dolphin machines.",
                "Toward their gardens, these machines can almost feel care.",
                "The machines do not like the sea apples. They forcefully extract them for us.",
                "I mean, it's clearly eco-friendly, but is it really necessary to go this slow??",
            ],
            helpText: "This dolphin machine carefully tends to gardens of kelp.",
        },

        getTirelessCrafter: {
            name: "Build tireless crafter",
            effect: {
                resource: {
                    tirelessCrafter: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "tirelessCrafter",
            prereq: {
                resource: {
                    delphinium: 200,
                },
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "Tireless crafter fuses the matter.",
                "Tireless crafter never ceases.",
                "Tireless crafter lays foundation for a future.",
                "Tireless crafter is an accident waiting to happen.",
            ],
            multiOutcomes: [
                "Delphinium. The warped counterpart to sharkonium.",
                "A silent, heatless process, much like the auto-transmuter's method of operation.",
                "Delphinium. We don't understand it. It feels a lot like sharkonium, but warmer.",
                "The complexity of these machines is unwarranted. The dolphins think themselves smarter, but we have simpler, more effective solutions.",
            ],
            helpText:
                "This dolphin machine creates delphinium. What good that is to us is a mystery. Use it to make their useless machines, I guess?",
        },
    },
    frigid: {
        catchFish: {},

        debugbutton: {},

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getSquid: {
            name: "Enlist squid",
            effect: {
                resource: {
                    squid: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "squid",
            prereq: {
                upgrade: ["civilContact"],
            },
            outcomes: [
                "A giant squid joins you.",
                "A bush-club squid joins you.",
                "A comb-finned squid joins you.",
                "A glass squid joins you.",
                "An armhook squid joins you.",
                "A jewel squid joins you.",
                "A scaled squid joins you.",
                "A big-fin squid joins you.",
                "A whip-lash squid joins you.",
                "A flying squid joins you.",
                "A hooked squid joins you.",
                "A glacial squid joins you.",
                "A fire squid joins you.",
                "A grass squid joins you.",
            ],
            multiOutcomes: [
                "The squid join the frenzy, but stay close to the village.",
                "The squid are cooperative and obedient. They do as directed.",
                "A squiggle of squid! No, of course that's not real.",
                "You all. Hunting duty. Get on it.",
                "Squid are ready to hunt.",
                "The squid venture out in search of fish.",
                "The squid have no qualms about joining the frenzy.",
                "The squid offer their utmost respect.",
            ],
            helpText: "Enlist a squid to help us hunt down fish. Squid are used to the cold.",
        },

        getCrab: {
            prereq: {
                resource: {
                    shark: 6,
                },
            },
            helpText: "Hire a crab to find things that sharks overlook.",
        },

        getUrchin: {
            name: "Attract urchin",
            effect: {
                resource: {
                    urchin: 1,
                },
            },
            cost: [{ resource: "kelp", costFunction: "linear", priceIncrease: 1 }],
            max: "urchin",
            prereq: {
                upgrade: ["urchinAttraction"],
            },
            outcomes: [
                "A collector urchin joins you.",
                "A burrowing urchin joins you.",
                "A fire urchin joins you.",
                "A lance urchin joins you.",
                "A long-spined urchin joins you.",
                "A reef urchin joins you.",
                "A rock-boring urchin joins you.",
                "A pencil urchin joins you.",
                "A needle urchin joins you.",
                "A violet urchin joins you.",
                "A purple urchin joins you.",
                "A double-spined urchin joins you.",
                "A flower urchin joins you.",
            ],
            multiOutcomes: [
                "ow ow ow spikes hurt",
                "The urchins join the frenzy. The frenzy keeps its distance.",
                "Prickly.",
                "A pile of sea urchins. A whole pile of them.",
                "The urchins, they're everywhere!",
                "How many urchins could we possibly need?",
                "The urchins go straight to harvesting kelp, and in the process, sand.",
                "And we're sure that we need urchins this badly?",
                "I wonder if these things can be weaponized...",
                "These aren't poisonous...Right?",
            ],
            helpText: "Attract an urchin who will gather kelp and sand. Urchins are used to the cold.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // SQUID JOBS ////////////////////////////////////////////////////////////////////////////////

        getExtractionTeam: {
            // i consider this a squid job
            name: "Organize extraction team",
            effect: {
                resource: {
                    extractionTeam: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "squid", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "extractionTeam",
            prereq: {
                upgrade: ["assistedExtraction"],
            },
            outcomes: [
                "Team assembled.",
                "Initiating teamwork.",
                "Cooperation commencing.",
                "The crab climbs onto the squid's head. Now, they are a team.",
                "Crab + Squid = Crystal???",
                "The squid's speed quickly makes up for the effect of the cold on the crab, and they zip into the distance.",
                "The squid straps the crab to itself with a band of kelp. That's one way, I guess.",
            ],
            multiOutcomes: [
                "The method of cooperation varies, but the result is always the same.",
                "Some of these pairs have...unique strategies. That one has make a bundle with its kelp.",
                "The pairs dart off into the ocean.",
                "The teams form a loose group, which then moves in a general direction.",
                "Teamwork makes the dream work, or something.",
                "That's a lot of crystal.",
                "Has anyone ever stopped to consider why these things need kelp?",
            ],
            helpText: "Convince a squid and a crab to work together to gather crystals.",
        },

        getCollective: {
            name: "Assemble squid collective",
            effect: {
                resource: {
                    collective: 1,
                },
            },
            cost: [
                { resource: "squid", costFunction: "constant", priceIncrease: 10 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "collective",
            prereq: {
                upgrade: ["squidBiology"],
            },
            outcomes: [
                "The squid have been collected.",
                "The group congregates and begins doing whatever it is they do.",
                "A collective of squid collectively collects itself.",
                "I collect that this collective is collectively collected.",
                "Why is it not called a collection?",
                "A bunch of squid get together and do something or other.",
            ],
            multiOutcomes: [
                "Collect the squid. Collect them.",
                "Collected a bunch of squid, I guess.",
                "Why do squid have to do everything as a team???",
                "I'm a bit concerned about future living space at this point.",
                "How many squid could possibly be needed to do this job??",
            ],
            helpText: "Bring together a group of squid to produce even more squid.",
        },

        // CRAB JOB ////////////////////////////////////////////////////////////////////////////////

        getBrood: {},

        // URCHIN JOB ////////////////////////////////////////////////////////////////////////////////////

        getSpawner: {
            name: "Designate urchin spawner",
            effect: {
                resource: {
                    spawner: 1,
                },
            },
            cost: [
                { resource: "urchin", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "spawner",
            prereq: {
                upgrade: ["urchinBiology"],
            },
            outcomes: [
                "Wait, so, run this process by me again real quick?",
                "The urchin stops collecting kelp.",
                "If urchins could talk, I'd want to know what they think of this change of profession.",
            ],
            multiOutcomes: [
                "Hold on - more?",
                "Wait, who said we needed more?",
                "Did we not already have enough?",
                "At this rate, the entire sea floor will eventually fill up with urchins!",
                "Seriously, I can't look anywhere and NOT see more of them.",
                "I'm gonna wake up tomorrow covered in these things, I swear.",
                "I'm a bit concerned about future living space at this point.",
            ],
            helpText: "Tell an urchin to go make more urchins.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getHeater: {
            name: "Build heater",
            effect: {
                resource: {
                    heater: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "kelp",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 750 - 375 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "heater",
            prereq: {
                upgrade: ["artificialHeating"],
            },
            outcomes: [
                "Heater activated.",
                "Heater constructed.",
                "Climate control online.",
                "Construction complete.",
                "Less-ice-inator is ready to go.",
            ],
            multiOutcomes: [
                "The ice crawls toward us regardless.",
                "Are we fighting a hopeless cause?",
                "The machines extend our lives, but can they truly save us?",
                "The warmth. The warmth we desired so much.",
                "The frozen sea lives a little longer.",
                "This world dies slower.",
            ],
            get helpText() {
                return SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1
                    ? "Construct one of the machines we used to slow the formerly-advancing ice shelf. Not much use now."
                    : "Construct a machine to slow down the advancing ice shelf.";
            },
        },
    },
    shrouded: {
        catchFish: {},

        debugbutton: {},

        getJellyfish: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        jellyfishToScience: {
            name: "Dismantle jellyfish",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "constant", priceIncrease: 1 }],
            max: "jellyfish",
            prereq: {
                resource: {
                    jellyfish: 150,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "Eww eww gross it's so gloopy and fragile and OW IT STUNG ME",
                "These things are like a bag of wonders. Weird, tasteless wonders.",
                "Wow, sea apples seemed weird, but these things barely exist.",
                "Well, they turned out just as fragile as they looked.",
                "So interesting!",
            ],
            helpText: "Examine the goop inside the stinging jellies! Discovery!",
        },

        makeSacrifice: {
            name: "Perform Arcane Sacrifice",
            effect: {
                resource: {
                    sacrifice: 1,
                },
            },
            cost: [{ resource: "arcana", costFunction: "constant", priceIncrease: 1 }],
            max: "arcana",
            prereq: {
                upgrade: ["arcaneSacrifice"],
            },
            outcomes: [
                "For the greater good.",
                "For the good of us all.",
                "The power within these shards is now ours.",
                "The flash is dizzying, but the power is worth it.",
                "The shards rupture into tiny pieces that disintegrate everywhere.",
                "That familiar feeling.",
                "Feel the power. Feel the flow of energy.",
            ],
            helpText:
                "Smash large quantities of arcana to release the energy contained within, so that it might be used for the greater good.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "Recruit shark",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "A bignose shark joins you.",
                "A blacktip reef shark joins you.",
                "A blue shark joins you.",
                "A bull shark joins you.",
                "A cat shark joins you.",
                "A crocodile shark joins you.",
                "A dusky whaler shark joins you.",
                "A dogfish joins you.",
                "A graceful shark joins you.",
                "A grey reef shark joins you.",
                "A goblin shark joins you.",
                "A hammerhead shark joins you.",
                "A hardnose shark joins you.",
                "A lemon shark joins you.",
                "A milk shark joins you.",
                "A nervous shark joins you.",
                "An oceanic whitetip shark joins you.",
                "A pigeye shark joins you.",
                "A sandbar shark joins you.",
                "A silky shark joins you.",
                "A silvertip shark joins you.",
                "A sliteye shark joins you.",
                "A speartooth shark joins you.",
                "A spinner shark joins you.",
                "A spot-tail shark joins you.",
                "A mako shark joins you.",
                "A tiger shark joins you.",
                "A tawny shark joins you.",
                "A white shark joins you.",
                "A zebra shark joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of sharks join you.",
                "That's a lot of sharks.",
                "The shark community grows!",
                "More sharks! MORE SHARKS!",
                "Sharks for the masses. Mass sharks.",
                "A shiver of sharks! No, that's a legit name. Look it up.",
                "A school of sharks!",
                "A shoal of sharks!",
                "A frenzy of sharks!",
                "A gam of sharks! Yes, that's correct.",
                "A college of sharks! They're a little smarter than a school.",
            ],
            helpText: "Recruit a shark to help catch more fish.",
        },

        getManta: {
            name: "Hire ray",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 10,
                },
            },
            outcomes: [
                "These guys seem to be kicking up a lot of sand!",
                "A spotted eagle ray joins you.",
                "A manta ray joins you.",
                "A stingray joins you.",
                "A clownnose ray joins you.",
                "A bluespotted maskray joins you.",
                "A bluntnose stingray joins you.",
                "A oman masked ray joins you.",
                "A bulls-eye electric ray joins you.",
                "A shorttailed electric ray joins you.",
                "A bentfin devil ray joins you.",
                "A lesser electric ray joins you.",
                "A cortez electric ray joins you.",
                "A feathertail stingray joins you.",
                "A thornback ray joins you.",
                "A giant shovelnose ray joins you.",
                "A pacific cownose ray joins you.",
                "A bluespotted ribbontail ray joins you.",
                "A marbled ribbontail ray joins you.",
                "A blackspotted torpedo ray joins you.",
                "A marbled torpedo ray joins you.",
                "A atlantic torpedo ray joins you.",
                "A panther torpedo ray joins you.",
                "A spotted torpedo ray joins you.",
                "A ocellated torpedo joins you.",
                "A caribbean torpedo joins you.",
                "A striped stingaree joins you.",
                "A sparesly-spotted stingaree joins you.",
                "A kapala stingaree joins you.",
                "A common stingaree joins you.",
                "A eastern fiddler ray joins you.",
                "A bullseye stingray joins you.",
                "A round stingray joins you.",
                "A yellow stingray joins you.",
                "A cortez round stingray joins you.",
                "A porcupine ray joins you.",
                "A sepia stingaree joins you.",
                "A banded stingaree joins you.",
                "A spotted stingaree joins you.",
                "A sea pancake joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of rays join you.",
                "That's a lot of rays.",
                "The ray conspiracy grows!",
                "I can't even deal with all of these rays.",
                "More rays more rays more more more.",
                "A school of rays!",
                "A fever of rays! Yes, seriously. Look it up.",
                "A whole lotta rays!",
                "The sand is just flying everywhere!",
                "So many rays.",
            ],
            helpText: "Hire a ray to help collect fish. They might kick up some sand from the seabed.",
        },

        getEel: {
            name: "Hire eel",
            effect: {
                resource: {
                    eel: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "eel",
            prereq: {
                upgrade: ["seabedGeology"],
            },
            outcomes: [
                "A false moray joins you.",
                "A mud eel joins you.",
                "A spaghetti eel joins you.",
                "A moray eel joins you.",
                "A thin eel joins you.",
                "A worm eel joins you.",
                "A conger joins you.",
                "A longneck eel joins you.",
                "A pike conger joins you.",
                "A duckbill eel joins you.",
                "A snake eel joins you.",
                "A snipe eel joins you.",
                "A sawtooth eel joins you.",
                "A cutthroat eel joins you.",
                "An electric eel joins you.",
                "A bobtail snipe eel joins you.",
                "A silver eel joins you.",
                "A long finned eel joins you.",
                "A short finned eel joins you.",
            ],
            multiOutcomes: [
                "Eels combining elements of the sharks and the eels to create something not quite as good as either.",
                "The seabed sways with the arrival of new eels.",
                "Fish and sand go hand in hand with eels! Well, fin and fin.",
                "Don't mess with the creatures with jaws inside their jaws.",
                "Eel nation arise!",
                "That's a lot of eels.",
                "So there's more eels. Whee.",
                "The eels increase in number.",
                "More eels happened. Yay.",
            ],
            helpText: "Offer a new home and fish supply to an eel. They can round up fish and sand.",
        },

        getChimaera: {
            name: "Procure chimaera",
            effect: {
                resource: {
                    chimaera: 1,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "linear", priceIncrease: 20 }],
            max: "chimaera",
            prereq: {
                resource: {
                    jellyfish: 20,
                },
                upgrade: ["chimaeraReunification"],
            },
            outcomes: [
                "A ploughnose chimaera joins you.",
                "A cape elephantfish joins you.",
                "An australian ghost shark joins you.",
                "A whitefin chimaera joins you.",
                "A bahamas ghost shark joins you.",
                "A southern chimaera joins you.",
                "A longspine chimaera joins you.",
                "A cape chimaera joins you.",
                "A shortspine chimaera joins you.",
                "A leopard chimaera joins you.",
                "A silver chimaera joins you.",
                "A pale ghost shark joins you.",
                "A spotted ratfish joins you.",
                "A philippine chimaera joins you.",
                "A black ghostshark joins you.",
                "A blackfin ghostshark joins you.",
                "A marbled ghostshark joins you.",
                "A striped rabbitfish joins you.",
                "A large-eyed rabbitfish joins you.",
                "A spookfish joins you.",
                "A dark ghostshark joins you.",
                "A purple chimaera joins you.",
                "A pointy-nosed blue chimaera joins you.",
                "A giant black chimaera joins you.",
                "A smallspine spookfish joins you.",
                "A pacific longnose chimaera joins you.",
                "A dwarf sicklefin chimaera joins you.",
                "A sicklefin chimaera joins you.",
                "A paddle-nose chimaera joins you.",
                "A straightnose rabbitfish joins you.",
            ],
            multiOutcomes: [
                "Many chimaeras come from the deep.",
                "Like ghosts, they come.",
                "The chimaeras avert your gaze, but set to work quickly.",
                "The jellyfish stocks shall climb ever higher!",
                "Well, it saves you the effort of braving the stinging tentacles.",
                "What have they seen, deep in the chasms?",
                "They aren't sharks, but they feel so familiar.",
                "The long-lost kindred return.",
            ],
            helpText: "Convince a chimaera to hunt in the darker depths for us.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getDiver: {
            name: "Prepare diver shark",
            effect: {
                resource: {
                    diver: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "diver",
            prereq: {
                resource: {
                    shark: 3,
                },
            },
            outcomes: [
                "Well, better you than me.",
                "Good luck down there!",
                "You're doing good work for us, diver shark.",
                "Fare well on your expeditions, shark!",
            ],
            multiOutcomes: [
                "Follow the crystals!",
                "We will find the secrets of the deep!",
                "Brave the deep!",
                "Find the crystals for science!",
                "Deep, dark, scary waters. Good luck, all of you.",
            ],
            helpText: "Let a shark go deep into the darkness for more crystals and whatever else they may find.",
        },

        getScientist: {
            name: "Train science shark",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doctor Shark, coming right up!",
                "A scientist shark is revealed!",
                "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!",
                "PhD approved!",
                "Graduation complete!",
                "A new insight drives a new shark to take up the cause of science!",
            ],
            multiOutcomes: [
                "The training program was a success!",
                "Look at all this science!",
                "Building a smarter, better shark!",
                "Beakers! Beakers underwater! It's madness!",
                "Let the science commence!",
                "Underwater clipboards! No I don't know how that works either!",
                "Careful teeth record the discoveries!",
            ],
            helpText: "Train a shark in the fine art of research and the science of, well, science.",
        },

        getNurse: {
            name: "Train nurse shark",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "A nurse shark is ready!",
                "Shark manufacturer primed.",
                "Nurse shark trained.",
                "Medical exam passed! Nurse shark is go!",
            ],
            multiOutcomes: [
                "More sharks are on the way soon.",
                "Shark swarm begins!",
                "There will be no end to the sharks!",
                "Sharks forever!",
                "The sharks will never end. The sharks are eternal.",
                "More sharks to make more sharks to make more sharks...",
            ],
            helpText: "Remove a shark from fish duty and set them to shark making duty.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
            ],
            helpText: "Remove a ray from sand business and let them concentrate on making more rays.",
        },

        getScholar: {
            name: "Train ray scholar",
            effect: {
                resource: {
                    scholar: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "scholar",
            prereq: {
                upgrade: ["arcaneStudy"],
            },
            outcomes: [
                "Study buddy!",
                "Another scholar receives their doctorate in magical stuff.",
                "The ray receives their degree.",
                "The ray receives a certificate.",
                "Ray, ready to learn!",
                "Congratulations buddy, you've earned the right to speculate about weird fragment thingies!",
            ],
            multiOutcomes: [
                "No, not ray scientists, scholars!",
                "Curious minds begin to tinker and toy with the strange substance that composes arcana.",
                "Just how much is there to learn about this stuff?",
                "They don't do science. They do study.",
                "The other side of the coin of research.",
                "The scientists and the scholars rarely collaborate, so they form their own schools.",
            ],
            helpText: "Train a ray to study the mystical properties of arcana.",
        },

        // EEL JOBS ////////////////////////////////////////////////////////////////////////////////

        getPit: {
            name: "Dig eel pit",
            effect: {
                resource: {
                    pit: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 3 },
                { resource: "fish", costFunction: "linear", priceIncrease: 50 },
                { resource: "sand", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "pit",
            prereq: {
                resource: {
                    eel: 1,
                },
                upgrade: ["eelHabitats"],
            },
            outcomes: [
                "Why does it take three eels? Oh well. We don't really need to know.",
                "Dig that pit. We can dig it.",
                "Let's get digging.",
                "Oh, hey, this hole's already empty. Well, isn't that something.",
            ],
            multiOutcomes: [
                "Let's get digging.",
                "Eel tide rises.",
                "More eels! They're handy to have.",
                "Many eyes from the caves.",
                "Secret homes!",
                "The eels are content.",
            ],
            helpText: "Find a suitable pit for eels to make more eels.",
        },

        getSifter: {
            name: "Train eel sifter",
            effect: {
                resource: {
                    sifter: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "sifter",
            prereq: {
                upgrade: ["arcaneSifting"],
            },
            outcomes: [
                "Eel sifter ready to find things!",
                "Eel ready to sift through the sands!",
                "Time to sift, eel. Time to seek, search and sift.",
                "Time for this little guy to find some goodies.",
            ],
            multiOutcomes: [
                "Time to find the things!",
                "Sift. It's a fun word. Siiiiffft.",
                "Sifters scouring the seabed for some special stuff.",
                "Shifters ready to shift! Wait. No. Hang on.",
                "Sifting the seabed for scores of surprises!",
            ],
            helpText: "Specialise an eel in finding interesting things on the seabed.",
        },

        // CHIMAERA JOBS ////////////////////////////////////////////////////////////////////////////////

        getExplorer: {
            name: "Prepare chimaera explorer",
            effect: {
                resource: {
                    explorer: 1,
                },
            },
            cost: [
                { resource: "chimaera", costFunction: "constant", priceIncrease: 1 },
                { resource: "jellyfish", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "explorer",
            prereq: {
                upgrade: ["abyssalEnigmas"],
            },
            outcomes: [
                "A seeker of mysteries is prepared.",
                "The chimaera explorer is ready for their journey.",
                "Explorer ready for some answers!",
                "The chimaera swims down to the ocean below.",
            ],
            multiOutcomes: [
                "The exploration party is ready.",
                "Learn the secrets of the deeps!",
                "More mysteries to uncover.",
                "Ancient riddles for ancient creatures.",
                "Find the truth beneath the waves!",
            ],
            helpText:
                "Help prepare a chimaera for exploration to parts unknown in search of the mysterious and elusive arcana.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},
    },
    marine: {
        catchFish: {},

        debugbutton: {},

        getClam: {
            name: "Get clam",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Got a grooved carpet shell.",
                "Got a hard clam.",
                "Got a manila clam.",
                "Got a soft clam.",
                "Got an atlantic surf clam.",
                "Got an ocean quahog.",
                "Got a pacific razor clam.",
                "Got a pismo clam.",
                "Got a geoduck.",
                "Got an atlantic jackknife clam.",
                "Got a lyrate asiatic hard clam.",
                "Got an ark clam.",
                "Got a nut clam.",
                "Got a duck clam.",
                "Got a marsh clam.",
                "Got a file clam.",
                "Got a giant clam.",
                "Got an asiatic clam.",
                "Got a peppery furrow shell.",
                "Got a pearl oyster.",
            ],
            helpText: "Fetch a clam. Why do we need clams now? Who knows.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "Study sea apples",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "There's science inside these things, surely!",
                "The cause of science is advanced!",
                "This is perhaps maybe insightful!",
                "Why are we even doing this? Who knows! Science!",
                "What is even the point of these things? Why are they named for fruit? They're squirming!",
            ],
            helpText: "Dissect the sea apples our kelp attracts to gain additional science. Research!",
        },

        pearlConversion: {
            name: "Convert clam pearls",
            effect: {
                resource: {
                    get crystal() {
                        if (SharkGame.Upgrades.purchased.includes(`highEnergyFusion`)) return 5;
                        return 1;
                    },
                },
            },
            cost: [
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        if (SharkGame.Upgrades.purchased.includes(`highEnergyFusion`)) return 1;
                        return 5;
                    },
                },
            ],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pearls to crystals! One day. One day, we will get this right and only use the pearl.",
                "Welp, we somehow turned rocks to crystals. Oh. Nope, those were clams. Not rocks. It's so hard to tell sometimes.",
                "Okay, we managed to only use the pearls this time, but we, uh, had to break the clams open pretty roughly.",
                "Pearls to... nope. Clams to crystals. Science is hard.",
            ],
            helpText: "Convert pearls (and the clams around them) into crystal.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute stuff to sharkonium",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutation destination!",
                "Transmutation rejuvenation!",
                "Transmogrification revelation!",
                "Transformation libation!",
                "Transfiguration nation! ...wait.",
                "Sharkonium arise!",
                "Arise, sharkonium!",
                "More sharkonium!",
                "The substance that knows no name! Except the name sharkonium!",
                "The substance that knows no description! It's weird to look at.",
                "The foundation of a modern shark frenzy!",
            ],
            helpText: "Convert ordinary resources into sharkonium, building material of the future!",
        },

        fuseCalcinium: {
            name: "Fuse stuff to calcinium",
            effect: {
                resource: {
                    calcinium: 1,
                },
            },
            cost: [
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "calcinium",
            prereq: {
                upgrade: ["calciniumStudies"],
            },
            outcomes: [
                `Fusion complete.`,
                `Clams sacrificed.`,
                `The fresh calcinium boils the water around it as it cools.`,
                `The clams and crystals meld together into a single unit.`,
                `The structures of the clams and crystals interlock, then solidify.`,
                `Bits of debris shoot out, glowing with heat as two become one.`,
                `Onlookers watch in awe as the lightshow goes on.`,
                `The pearl works its magic.`,
                `Completed fusion.`,
            ],
            helpText: "Smelt resources into calcinium for use in crustacean machines.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getLobster: {
            name: "Gain lobster",
            effect: {
                resource: {
                    lobster: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 10 }],
            max: "lobster",
            prereq: {
                resource: {
                    clam: 10,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "A scampi joins you.",
                "A crayfish joins you.",
                "A clawed lobster joins you.",
                "A spiny lobster joins you.",
                "A slipper lobster joins you.",
                "A hummer lobster joins you.",
                "A crawfish joins you.",
                "A rock lobster joins you.",
                "A langouste joins you.",
                "A shovel-nose lobster joins you.",
                "A crawdad joins you.",
            ],
            multiOutcomes: [
                "Lobsters lobsters lobsters lobsters.",
                "But they weren't rocks...",
                "The clam forecast is looking good!",
                "They're all about the clams!",
                "More lobsters, because why not?",
                "HEAVY LOBSTERS",
                "More lobsters for the snipping and the cutting and the clam grab!",
                "Clam patrol, here we go.",
            ],
            helpText: "Hire a lobster to scoop up clams for us.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {},

        getClamScavenger: {
            name: "Equip clam scavenger",
            effect: {
                resource: {
                    clamScavenger: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "calcinium", costFunction: "linear", priceIncrease: 15 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "clamScavenger",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumRobotics"],
            },
            outcomes: [
                `Scavenger ready to scavenge.`,
                `Claw arm operational.`,
                `Arm training complete.`,
                `One ray, able to use goofy oversized arm, coming right up.`,
                `A ray, ready to have a big arm do its job for it.`,
                `Ray equipped.`,
                `Ray ready to indiscriminately tear up the seabed.`,
            ],
            multiOutcomes: [
                `These arms are big.`,
                `Scoop scoop scoop.`,
                `Expensive equipment equipped.`,
                `Directive: dig clams.`,
                `The faint sound of grinding stone fills the water.`,
                `Why a crab claw? why not a lobster? Actually, wait...is there a difference?`,
            ],
            helpText: "Strap a big goofy claw arm to a ray and train it to scoop huge amounts of clams.",
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        getSeabedStripper: {
            name: "Equip seabed stripper",
            effect: {
                resource: {
                    seabedStripper: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 150 },
                { resource: "planter", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "seabedStripper",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumRobotics"],
            },
            outcomes: [
                `Planter has been upgraded.`,
                `Seabed stripper, ready to destroy the forests.`,
                `One seabed stripper, ready to pretend to be a sea spider.`,
                `One snippy crab coming right up.`,
                `Snip.`,
                `The crab gestures with all its claws.`,
                `Promoted a planter.`,
                `Improved a planter.`,
            ],
            multiOutcomes: [
                `Snip snip snip.`,
                `The claws rip into kelp like a synchronized dance.`,
                `The sound of plants ripping fills the water.`,
                `Directive: extract kelp from forests.`,
                `Many small snippers come to life and begin snipping through kelp at incredible speed.`,
                `The crabs join another group headed out in search of new forests.`,
                `Too many arms, honestly.`,
            ],
            helpText: "Equip a planter with many additional arms for maximum efficiency.",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        getBerrier: {
            name: "Form lobster berrier",
            effect: {
                resource: {
                    berrier: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "berrier",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "We didn't need to see the process behind this.",
                "One lobster brimming with eggs to go.",
                "It's like some weird counterpart to the planter crab. But with eggs.",
                "Lobster with rocks ready to make a move. Oh, okay, eggs, whatever, see, they look like shiny pebbles from a distance and... oh, forget it.",
            ],
            multiOutcomes: [
                "Berrier isn't even a word!",
                "Berries and eggs aren't even the same thing!",
                "How do these things swim with this much weighing them down?",
                "We aren't running out of volunteers any time soon.",
                "Did you see them fight for this job? Claws everywhere, I tell you!",
            ],
            helpText: "Dedicate a lobster to egg production. We don't know how it works. Ask the lobsters.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

        getCalciniumConverter: {
            name: "Assemble calcinium converter",
            effect: {
                resource: {
                    calciniumConverter: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 100 },
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "calciniumConverter",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumCybernetics"],
            },
            outcomes: [
                `One lobster-turned-cyborg coming right up.`,
                `Incoming cyborg.`,
                `Lobster has been augmented.`,
                `The lobster gets to work immediately.`,
                `The lobster ignores your presence as it searches for materials.`,
                `The converter begins to convert.`,
                `The converter asks for materials.`,
            ],
            multiOutcomes: [
                `Lasers charged.`,
                `Fusion beams ready.`,
                `Future!?`,
                `Directive: automate.`,
                `Setting phasers to fuse...`,
                `The power of the sun in an attached limb!`,
                `Focus. Focus. Come on...fuse!`,
                `Two becomes one.`,
            ],
            helpText: "Modify a lobster to fuse calcinium with cool cyborg laser beams.", // This crustacean machine distributes lobster eggs for optimal hatching conditions.
        },
    },
    volcanic: {
        // FREEBIES ////////////////////////////////////////////////////////////////////////////////

        catchFish: {},

        debugbutton: {},

        prySponge: {
            effect: {
                events: ["volcanicTallyPrySponge"],
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            removedBy: {
                custom() {
                    return SharkGame.flags.prySpongeGained > 200;
                },
                otherActions: ["prySponge2"],
                upgrades: ["agriculture"],
            },
        },

        prySponge2: {
            name: "Pry sponge",
            effect: {
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["consistentCommunication"],
            },
            outcomes: [
                "Pried an orange elephant ear sponge from the rocks.",
                "Pried a brain sponge from the rocks.",
                "Pried a branching tube sponge from the rocks.",
                "Pried a brown volcano carpet from the rocks.",
                "Pried a row pore rope sponge from the rocks.",
                "Pried a branching vase sponge from the rocks.",
                "Pried a chicken liver sponge from the rocks.",
                "Pried a red boring sponge from the rocks.",
                "Pried a heavenly sponge from the rocks.",
                "Pried a brown encrusting octopus sponge from the rocks.",
                "Pried a stinker sponge from the rocks.",
                "Pried a black-ball sponge from the rocks.",
                "Pried a strawberry vase sponge from the rocks.",
                "Pried a convoluted orange sponge from the rocks.",
                "Pried a touch-me-not sponge from the rocks. Ow.",
                "Pried a lavender rope sponge from the rocks.",
                "Pried a red-orange branching sponge from the rocks.",
                "Pried a variable boring sponge from the rocks.",
                "Pried a loggerhead sponge from the rocks.",
                "Pried a yellow sponge from the rocks.",
                "Pried an orange lumpy encrusting sponge from the rocks.",
                "Pried a giant barrel sponge from the rocks.",
            ],
            helpText: "Grab a sponge from the seabed for future use.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        toggleAutoSmelt: {
            name: "Use vents to smelt porite",
            effect: {
                events: ["volcanicToggleSmelt"],
            },
            cost: {},
            prereq: {
                upgrade: ["superSmelting"],
            },
            outcomes: ["Toggled automatic smelting."],
            helpText: "Toggle automatic smelting of porite.",
            getSpecialTooltip() {
                let text = `AUTOSMELT ${SharkGame.flags.autoSmelt ? "ON" : "OFF"}<br>`;
                if (SharkGame.flags.autoSmelt) {
                    const sponge = res.getResource(`sponge`);
                    const sand = res.getResource(`sand`);
                    const spongeCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[0].priceIncrease;
                    const sandCost = SharkGame.HomeActions.volcanic.smeltPorite.cost[1].priceIncrease;
                    const maxSpongeCycles = sponge / spongeCost;
                    const maxSandCycles = sand / sandCost;

                    text += `<span class="littleGeneralText">`;
                    if (maxSpongeCycles < maxSandCycles)
                        text += `${sharktext.getResourceName(
                            `sponge`,
                            false,
                            false,
                            sharkcolor.getElementColor("tooltipbox", "background-color")
                        )}`;
                    if (maxSandCycles <= maxSpongeCycles)
                        text += `${sharktext.getResourceName(
                            `sand`,
                            false,
                            false,
                            sharkcolor.getElementColor("tooltipbox", "background-color")
                        )}`;
                    text += ` is limiting ${sharktext.getResourceName(
                        `porite`,
                        false,
                        false,
                        sharkcolor.getElementColor("tooltipbox", "background-color")
                    )} production</span>`;
                }
                return sharktext.boldString(text);
            },
        },

        smeltPorite: {
            name: "Smelt stuff to porite",
            effect: {
                resource: {
                    porite: 1,
                },
            },
            cost: [
                {
                    resource: "sponge",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - 1 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 20 - 4 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "porite",
            prereq: {
                upgrade: ["secretSmelting"],
            },
            outcomes: [
                "Porite smelted!",
                "Porite melted! No. Wait.",
                "How does sponge become part of glass? Well, you see, it's all very simple, or that's what the shrimp told me.",
                "The backbo-- the exoskeleton of the shrimp industry!",
                "So fragile. Yet so useful.",
            ],
            helpText: "Smelt resources into porite for use in shrimp tools!",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getManta: {
            prereq: {
                resource: {
                    fish: 15,
                },
            },
        },

        getCrab: {
            prereq: {
                resource: {
                    ray: 4,
                },
            },
        },

        getShrimp: {
            name: "Acquire shrimp",
            effect: {
                resource: {
                    shrimp: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "shrimp",
            prereq: {
                resource: {
                    sponge: 5,
                },
                upgrade: ["consistentCommunication"],
            },
            outcomes: [
                "An african filter shrimp joins you.",
                "An amano shrimp joins you.",
                "A bamboo shrimp joins you.",
                "A bee shrimp joins you.",
                "A black tiger shrimp joins you.",
                "A blue bee shrimp joins you.",
                "A blue pearl shrimp joins you.",
                "A blue tiger shrimp joins you.",
                "A brown camo shrimp joins you.",
                "A cardinal shrimp joins you.",
                "A crystal red shrimp joins you.",
                "A dark green shrimp joins you.",
                "A glass shrimp joins you.",
                "A golden bee shrimp joins you.",
                "A harlequin shrimp joins you.",
                "A malaya shrimp joins you.",
                "A neocaridina heteropoda joins you.",
                "A ninja shrimp joins you.",
                "An orange bee shrimp joins you.",
                "An orange delight shrimp joins you.",
                "A purple zebra shrimp joins you.",
                "A red cherry shrimp joins you.",
                "A red goldflake shrimp joins you.",
                "A red tiger shrimp joins you.",
                "A red tupfel shrimp joins you.",
                "A snowball shrimp joins you.",
                "A sulawesi shrimp joins you.",
                "A tiger shrimp joins you.",
                "A white bee shrimp joins you.",
                "A yellow shrimp joins you.",
            ],
            multiOutcomes: [
                "That's a lot of shrimp.",
                "So many shrimp, it's like a cloud!",
                "I can't cope with this many shrimp!",
                "Shrimp, they're like bugs, except not bugs or anything related at all!",
                "They're so tiny!",
                "How can something so small take up so much space?",
                "Sponge forever!",
            ],
            helpText:
                "Convince shrimp to assist you in the gathering of algae, which increases how much sponge you can keep at once.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
            ],
            helpText: "Remove a ray from sand business and let them concentrate on making more rays.",
        },

        getShoveler: {
            name: "Instruct a ray shoveler",
            effect: {
                resource: {
                    shoveler: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`massProduction`) ? 10 : 50;
                    },
                },
            ],
            max: "shoveler",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["secretSmithing"],
            },
            outcomes: [
                "Shoveler instructed.",
                "Shoveler equipped.",
                "The shoveler begins digging up sand scattered by the vents.",
                "The shoveler heads for the nearest vent.",
                "The shoveler straps on its gear.",
                "This ray looks determined to increase productivity.",
            ],
            multiOutcomes: [
                "Glory to the sand.",
                "It's shoveling time!",
                "Dig dig dig.",
                "Can you dig it?",
                "The ray has a tool. It's a shovel, because it's a tool designed for shoving stuff.",
                "The rays descend on the nearest vent.",
                "The rays disperse and make their way to individual vents.",
                "The rays begin clearing the top layer of sand around nearby vents.",
            ],
            helpText: "Teach a ray to quickly move sand around using a huge, specialized scoop.",
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        /* getCatcher: {
            name: "Gear up catcher crab",
            effect: {
                resource: {
                    catcher: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sand", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "catcher",
            prereq: {
                upgrade: ["kelpCatching"],
            },
            outcomes: [
                "Crab ready to catch.",
                "Crab has its eyes on a piece of drifting kelp as soon as it reaches a vent.",
                "This one will make a game-winning catch someday, I can just feel it.",
                "Crab ready to pitch- I mean catch.",
                "Equipped crab with extendo-reach.",
                "This crab now reaches farther.",
            ],
            multiOutcomes: [
                "A bunch of claw-doodad-wielding crabs make their way to the nearest vent.",
                "The extendo-grip crabs are gripping stuff.",
                "The crabs test out their new equipment by messing with each other from afar. Hey, get back to work!",
                "The crabs nestle into their chosen spots around the vent output.",
                "Though monotonous, they seem content with this life.",
                "These crabs are ready to have some fun with extendo-reach.",
                "The crabs just seem happy to help.",
            ],
            helpText: "Grant a crab the tools and training to help them catch stuff coming from the vents.",
        }, */

        getCuriousCrab: {
            name: "Recognize curious crab",
            effect: {
                resource: {
                    curiousCrab: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "coral", costFunction: "constant", priceIncrease: 10 },
            ],
            max: "curiousCrab",
            prereq: {
                resource: {
                    coral: 5,
                },
            },
            outcomes: [
                "This crab is itching to know things.",
                "The crab starts examining random debris on the seafloor.",
                "This crab is very curious.",
                "I need to know. I MUST KNOW!",
                "This crab will not stop until everything is learned. Everything ever.",
            ],
            multiOutcomes: [
                "The crabs just seem happy to help.",
                "Curious ones identified.",
                "Hmm...",
                "They seem lost in collective thought.",
                "The crabs begin talking with each other about some weird questions they came up with.",
                "The crabs begin discussing some funny ideas that they had.",
            ],
            helpText: "Find a crab that is curious and recognize them as a curious crab.",
        },

        getResearcher: {
            name: "Gear up researcher",
            effect: {
                resource: {
                    researcher: 1,
                },
            },
            cost: [
                { resource: "curiousCrab", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`massProduction`) ? 5 : 25;
                    },
                },
            ],
            max: "researcher",
            prereq: {
                upgrade: ["secretSmithing"],
            },
            outcomes: ["Ready for collaboration.", "These papers won't write themselves!"],
            multiOutcomes: [
                "Do you know who ate all the donuts?",
                "Why do we all have to wear these <i>ridiculous ties?</i>",
                "This is all within theoretical limits.",
                "I hope those containment parameters are still nominal.",
                "No, not headcrabs. Just regular crabs.",
                "Yes, this all looks nominal.",
                "I am rather looking forward to this analysis, aren't you?",
                "Aren't you a bit worried about that exponential cascade scenario we discussed?",
                "The crabs just seem happy to help.",
            ],
            helpText: "Grant a curious crab enough equipment to perform actual experiments.",
        },

        getBrood: {
            name: "Form crab brood",
            effect: {
                resource: {
                    brood: 1,
                },
            },
            cost: [
                {
                    resource: "crab",
                    costFunction: "constant",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`broodingBiology`) ? 5 : 20;
                    },
                },
                { resource: "fish", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "brood",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["crabBiology"],
            },
            outcomes: [
                "A bunch of crabs pile together into some sort of weird cluster.",
                "Crab team, assemble! FORM THE CRAB BROOD!",
                "[This message has been censored for reasons of being mostly really gross.]",
                "Eggs, eggs everywhere, but never stop and think.",
                "Writhing crab pile. Didn't expect those words next to each other today, did you.",
                "The crab brood is a rarely witnessed phenomenon, due to being some strange behaviour of crabs that have been driven to seek crystals for reasons only they understand.",
            ],
            multiOutcomes: [
                "The broods grow. The swarm rises.",
                "All these crabs are probably a little excessive. ...is what I could say, but I'm going to say this instead. MORE CRABS.",
                "A sea of crabs on the bottom of the sea. Clickity clackity.",
                "Snip snap clack clack burble burble crabs crabs crabs crabs.",
                "More crabs are always a good idea. Crystals aren't cheap.",
                "The broods swell in number. The sharks are uneasy, but the concern soon passes.",
            ],
            helpText: "Meld several crabs into a terrifying, incomprehensible crab-producing brood cluster.",
        },

        // SHRIMP JOBS ////////////////////////////////////////////////////////////////////////////////

        getQueen: {
            name: "Crown shrimp queen",
            effect: {
                resource: {
                    queen: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "queen",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["eusociality"],
            },
            outcomes: [
                "Up the ranks you go, little one.",
                "Shrimp queen prepped for duty!",
                "A royal shrimp is she!",
                "More shrimp for the shrimp superorganism!",
                "Give it time before they start singing about wanting to break free.",
                "Long live the tiny tiny shrimp queen!",
            ],
            multiOutcomes: [
                "Okay, so it's not exactly a royal role, but hey, they're gonna be making eggs for a long time. Humour them.",
                "This is the weirdest monarchy in existence.",
                "Welcome to the superorganisation!",
                "They want to ride their bicycle.",
                "Give it time before they start singing about wanting to break free.",
                "Queens for the shrimp colony! Eggs for the egg throne!",
                "Go, more shrimps!",
                "Neverending shrimp cycle, GO!",
            ],
            helpText: "Crown a shrimp queen to make more shrimp.",
        },

        getFarmer: {
            name: "Assign shrimp farmer",
            effect: {
                resource: {
                    farmer: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "porite",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`massProduction`) ? 2 : 10;
                    },
                },
            ],
            max: "farmer",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["secretSmithing"],
            },
            outcomes: [
                "One shrimp equipped with tiny pitchfork and cute little hat.",
                "Gave a shrimp the tools it needs to farm efficiently.",
                "The shrimp happily takes on its new role.",
                "In a way, this is a promotion.",
                "One shrimp, ready to contribute even more to society than usual.",
            ],
            multiOutcomes: [
                "The shrimps are excited to contribute to the sponge mass.",
                "These are some pretty fluid castes.",
                "Promotions for everybody!",
                "Glory to the king! We honor him with our cute little pitchforks.",
                "The sponge must grow.",
                "The sponge is life.",
                "Glory to the sponge. Glory to the shrimp mass.",
            ],
            helpText: "Dedicate a shrimp to the cultivation of plants.",
        },

        getAcolyte: {
            name: "Indoctrinate algae acolyte",
            effect: {
                resource: {
                    acolyte: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "algae", costFunction: "linear", priceIncrease: 2500 },
            ],
            max: "acolyte",
            prereq: {
                upgrade: ["algaeAcolytes"],
            },
            outcomes: [
                "Acolyte indoctrinated.",
                "Another one begins their journey to algae enlightenment.",
                "This one has awoken their third eye, or something like that.",
                "This shrimp will now do whatever activities these shrimp do and cause more algae to appear because of it.",
            ],
            multiOutcomes: [
                "Our organization grows.",
                "I'm sure this cult behavior will have no negative repurcussions.",
                "Algae goes up...",
                "More algae. MORE.",
                "This amount of algae is definitely sustainable and not going to hurt us in the long-run.",
                "I want more sponge, and there's only one way I know to get it! More algae!",
                "The algae must be pleased, or it will not grow.",
                "Appease the greens.",
            ],
            helpText: "Indoctrinate a shrimp into the cult of algae to boost algae production.",
        },

        getSpongeFarm: {
            name: "Construct sponge farm",
            effect: {
                events: ["volcanicBoughtFarm"],
                resource: {
                    spongeFarm: 1,
                },
            },
            cost: [
                { resource: "sponge", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`landReform`) ? 50 : 250;
                    },
                },
            ],
            max: "spongeFarm",
            prereq: {
                upgrade: ["agriculture"],
            },
            outcomes: [
                "Sponge farm constructed, sponge barn raised.",
                "Now growing sponge in this general location.",
                "Sand tilled. Sponge planted.",
                "'Right here, this will be a farm!' And so it was.",
            ],
            multiOutcomes: [
                "Do we really need to till the sand to grow sponge?",
                "Grow, sponge! Grow!",
                "I hope we have enough algae to support this level of production.",
                "The shrimp are pleased.",
                "Is anybody staffing these?",
                "Farms are a-go.",
                "Designated growing spots.",
            ],
            helpText: "Pick a spot and set up a sponge farm there.",
        },

        getCoralFarm: {
            name: "Construct coral farm",
            effect: {
                resource: {
                    coralFarm: 1,
                },
            },
            cost: [
                { resource: "coral", costFunction: "constant", priceIncrease: 1 },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return SharkGame.Upgrades.purchased.includes(`landReform`) ? 50 : 250;
                    },
                },
            ],
            max: "coralFarm",
            prereq: {
                upgrade: ["coralCloning"],
            },
            outcomes: [
                "Coral farm constructed, coral barn raised.",
                "Now growing coral in this general location.",
                "Sand tilled. Coral planted.",
                "'Right here, this will be a farm!' And so it was.",
            ],
            multiOutcomes: [
                "Do we really need to till the sand to grow coral?",
                "Grow, coral! Grow!",
                "The crabs are pleased.",
                "Is anybody staffing these?",
                "Farms are a-go.",
                "Designated growing spots.",
            ],
            helpText: "Pick a spot and set up a coral farm there.",
        },
    },
};

SharkGame.HomeActionCategories = {
    all: {
        // This category should be handled specially.
        name: "All",
        actions: [],
    },

    basic: {
        name: "Basic",
        actions: ["catchFish", "debugbutton", "prySponge", "getClam", "getJellyfish"],
    },

    frenzy: {
        name: "Frenzy",
        actions: [
            "getShark",
            "getManta",
            "getCrab",
            "getShrimp",
            "getLobster",
            "getDolphin",
            "getWhale",
            "getEel",
            "getChimaera",
            "getOctopus",
            "getSquid",
            "getUrchin",
        ],
    },

    professions: {
        name: "Jobs",
        actions: [
            "getDiver",
            // "getProspector",
            "getScientist",
            "getLaser",
            "getShoveler",
            "getPlanter",
            "getCollector",
            // "getMiller",
            "getFarmer",
            // "getRockLobster",
            "getPhilosopher",
            "getTreasurer",
            "getTechnician",
            "getSifter",
            "getTransmuter",
            "getExplorer",
            "getInvestigator",
            "getScavenger",
            "getHistorian",
            "getExtractionTeam",
            "getScholar",
            "getExtractor",
            "getCuriousCrab",
            "getResearcher",
            "getAcolyte",
        ],
    },

    breeders: {
        name: "Producers",
        actions: [
            "getNurse",
            "getMaker",
            // "stoneGetMaker",
            "getBrood",
            "getQueen",
            "getBerrier",
            "getBiologist",
            "getPit",
            "getCollective",
            "getSpawner",
        ],
    },

    processing: {
        name: "Processing",
        actions: [
            "seaApplesToScience",
            // "spongeToScience",
            "jellyfishToScience",
            "pearlConversion",
            "advancedPearlConversion",
            "spongeFiltration",
            "breakDownAncientPart",
            "transmuteSharkonium",
            "smeltCoralglass",
            "fuseDelphinium",
            "forgeSpronge",
            "fuseAncientPart",
            "makeSacrifice",
            "fuseCalcinium",
        ],
    },

    machines: {
        name: "Shark Machines",
        actions: [
            "getCrystalMiner",
            "getSandDigger",
            "getAutoTransmuter",
            "getFishMachine",
            "getSkimmer",
            // "getCrusher",
            // "getPulverizer",
            "getHeater",
        ],
    },

    otherMachines: {
        name: "Other Machines",
        actions: [
            "getSpongeFarmer",
            "getBerrySprayer",
            "getGlassMaker",
            "getTirelessCrafter",
            "getClamCollector",
            "getEggBrooder",
            "getSprongeSmelter",
            // "getCoalescer",
            "getCrimsonCombine",
            "getKelpCultivator",
            "getSeabedStripper",
            "getCalciniumConverter",
            "getClamScavenger",
        ],
    },

    places: {
        name: "Places",
        actions: ["getSpongeFarm", "getCoralFarm"],
    },

    unique: {
        name: "Unique",
        actions: ["getChorus"],
    },
};
