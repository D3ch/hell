"use strict";
SharkGame.ResourceTable = {
    // SPECIAL

    numen: {
        name: "numina",
        singleName: "numen",
        // desc: "You think as a deity. You act as a deity. You are a deity.",
        color: "#FFFFFF",
        value: -1,
    },

    essence: {
        name: "essence",
        singleName: "essence",
        desc: "Etheric force, raw and dangerous.",
        color: "#ACE3D1",
        value: -1,
    },

    world: {
        get name() {
            switch (world.worldType) {
                case `volcanic`:
                    return `vents`;
                default:
                    return `the world`;
            }
        },
        get singleName() {
            switch (world.worldType) {
                case `volcanic`:
                    return `vents`;
                default:
                    return `the world`;
            }
        },
        desc: "how are you seeing this",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: true,
    },

    specialResourceOne: {
        get name() {
            switch (world.worldType) {
                case `volcanic`:
                    return `lack of algae`;
                default:
                    return `???`;
            }
        },
        get singleName() {
            switch (world.worldType) {
                case `volcanic`:
                    return `lack of algae`;
                default:
                    return `???`;
            }
        },
        desc: "how are you seeing this",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: true,
    },

    specialResourceTwo: {
        get name() {
            switch (world.worldType) {
                default:
                    return `???`;
            }
        },
        get singleName() {
            switch (world.worldType) {
                default:
                    return `???`;
            }
        },
        desc: "how are you seeing this",
        color: "#FFFFFF",
        value: 123456789,
        forceIncome: false,
    },

    aspectAffect: {
        name: "aspects",
        singleName: "aspects",
        desc: "what",
        income: {
            get crystal() {
                if (SharkGame.Aspects.crystallineSkin.level && world.worldType !== "volcanic") {
                    const crystalAmount = res.getResource("crystal");
                    if (crystalAmount < 25 * 2 ** SharkGame.Aspects.crystallineSkin.level) {
                        return (25 * 2 ** SharkGame.Aspects.crystallineSkin.level - crystalAmount) / 2;
                    }
                }
                return 0;
            },
            get coral() {
                if (SharkGame.Aspects.crystallineSkin.level && world.worldType === "volcanic") {
                    const coralAmount = res.getResource("coral");
                    if (coralAmount < 25 * 2 ** SharkGame.Aspects.crystallineSkin.level) {
                        return (25 * 2 ** SharkGame.Aspects.crystallineSkin.level - coralAmount) / 2;
                    }
                }
                return 0;
            },
        },
    },

    // MAGICAL

    sacrifice: {
        name: "sacrifices",
        singleName: "sacrifice",
        desc: "The cost of progress.",
        color: "#FFD6FC",
        value: 1,
    },

    arcana: {
        name: "arcana",
        singleName: "arcana",
        desc: "Inscrutable mysteries.",
        color: "#E791FF",
        value: 1,
    },

    // SCIENCE

    science: {
        name: "science",
        singleName: "science",
        desc: "Lifeblood of progress.",
        color: "#BBA4E0",
        value: 100,
    },

    // ANIMALS

    fish: {
        name: "fish",
        singleName: "fish",
        desc: "The hunted.",
        color: "#E3D85B",
        value: 2,
    },

    seaApple: {
        name: "sea apples",
        singleName: "sea apple",
        desc: "Rooted filters.",
        color: "#F0C2C2",
        value: 3,
    },

    sponge: {
        name: "sponge",
        singleName: "sponge",
        get desc() {
            switch (world.worldType) {
                case `volcanic`:
                    return "Soft, porous carnivores. Need algae.";
                default:
                    return "Soft, porous carnivores.";
            }
        },
        color: "#ED9847",
        value: 18,
    },

    jellyfish: {
        name: "jellyfish",
        singleName: "jellyfish",
        color: "#E3B8FF",
        value: 110,
    },

    clam: {
        name: "clams",
        singleName: "clam",
        desc: "An acquired taste.",
        color: "#828FB5",
        value: 10,
    },

    // MATERIALS

    sand: {
        name: "sand",
        singleName: "sand",
        desc: "Flesh of the ocean floor.",
        color: "#C7BD75",
        value: 3,
    },

    crystal: {
        name: "crystals",
        singleName: "crystal",
        desc: "Inscrutable secrets in solid form.",
        color: "#6FD9CC",
        value: 10,
    },

    kelp: {
        name: "kelp",
        singleName: "kelp",
        desc: "A home for the stranger.",
        color: "#9CC232",
        income: {
            seaApple: 0.001,
        },
        value: 9,
    },

    coral: {
        name: "coral",
        singleName: "coral",
        desc: "Colorful carnivores.",
        color: "#CA354F",
        value: 3,
    },

    algae: {
        name: "algae",
        singleName: "algae",
        desc: "Slimy sponge feeders.",
        color: "#549572",
        value: 0.4,
    },

    /* gravel: {
        name: "gravel",
        singleName: "gravel",
        color: "#ABABAB",
        value: 2,
    },

    stone: {
        name: "stones",
        singleName: "stone",
        color: "#6B6B6B",
        value: 3,
    }, */

    // PROCESSED

    sharkonium: {
        name: "sharkonium",
        singleName: "sharkonium",
        desc: "Progress incarnate.",
        color: "#8D70CC",
        value: 70,
    },

    junk: {
        name: "residue",
        singleName: "residue",
        desc: "Industrial potential.",
        color: "#ABABAB",
        value: 1,
    },

    // FRENZY

    shark: {
        name: "sharks",
        singleName: "shark",
        desc: "Apex predators of the seas.",
        color: "#92C1E0",
        income: {
            fish: 1,
        },
        jobs: ["scientist", "nurse", "diver"],
        value: 1000,
    },

    ray: {
        name: "rays",
        singleName: "ray",
        desc: "Kindred to the sharks.",
        color: "#797CFC",
        income: {
            fish: 0.2,
            sand: 1,
        },
        jobs: ["laser", "maker", "scholar", "shoveler", "clamScavenger"],
        value: 1000,
    },

    crab: {
        name: "crabs",
        singleName: "crab",
        desc: "Dutiful, loyal crustaceans.",
        color: "#C03030",
        income: {
            crystal: 0.02,
            coral: 0.01,
        },
        jobs: ["planter", "brood", "collector", "researcher", "curiousCrab", "seabedStripper"],
        value: 1000,
    },

    nurse: {
        name: "nurse sharks",
        singleName: "nurse shark",
        desc: "Safeguarding the future.",
        color: "#C978DE",
        income: {
            shark: 0.01,
        },
        value: 4000,
    },

    maker: {
        name: "ray makers",
        singleName: "ray maker",
        desc: "Caretakers of the helpless.",
        color: "#5355ED",
        income: {
            ray: 0.05,
        },
        value: 4000,
    },

    brood: {
        name: "crab broods",
        singleName: "crab brood",
        desc: "The unending process.",
        color: "#9E7272",
        income: {
            crab: 0.2,
        },
        value: 4000,
    },

    scientist: {
        name: "science sharks",
        singleName: "science shark",
        desc: "Creators of the shark future.",
        color: "#DCEBF5",
        income: {
            science: 0.5,
        },
        value: 3000,
    },

    laser: {
        name: "laser rays",
        singleName: "laser ray",
        desc: "Destructive forces of creation.",
        color: "#E85A5A",
        income: {
            sand: -50,
            crystal: 1,
        },
        value: 3500,
    },

    planter: {
        name: "planter crabs",
        singleName: "planter crab",
        desc: "Stewards of an ecosystem.",
        color: "#AAE03D",
        income: {
            kelp: 0.3,
        },
        value: 4000,
    },

    crystalMiner: {
        name: "crystal miners",
        singleName: "crystal miner",
        desc: "Devourers of the lattice.",
        color: "#B2CFCB",
        income: {
            crystal: 100,
            // stone: 10,
            tar: 0.04,
        },
        value: 33500, // 100 crystal 100 sand 25 sharkonium (3550)
    },

    sandDigger: {
        name: "sand diggers",
        singleName: "sand digger",
        desc: "Consumers of the seabed.",
        color: "#D6CF9F",
        income: {
            sand: 200,
            tar: 0.02,
        },
        value: 120000, // 500 sand 150 sharkonium (12000)
    },

    autoTransmuter: {
        name: "auto-transmuters",
        singleName: "auto-transmuter",
        desc: "Mystic processes automated.",
        color: "#B5A7D1",
        income: {
            get crystal() {
                return -90 + 45 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get sand() {
                return -250 + 125 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            sharkonium: 20,
        },
        value: 155000, // 100 crystal 200 sharkonium (15500)
    },

    fishMachine: {
        name: "fish machines",
        singleName: "fish machine",
        desc: "Indiscriminate hunter.",
        color: "#C9C7A7",
        income: {
            fish: 400,
            tar: 0.02,
        },
        value: 70000, // 100 sharkonium (7000)
    },

    skimmer: {
        name: "skimmers",
        singleName: "skimmer",
        desc: "Engines of industry.",
        color: "#8D4863",
        income: {
            junk: 750,
            get sand() {
                return -50 + 25 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get fish() {
                return -300 + 150 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            tar: 0.02,
        },
        value: 50000,
    },

    // MARINE

    lobster: {
        name: "lobsters",
        singleName: "lobster",
        color: "#BF0F00",
        desc: "Trainees.",
        income: {
            clam: 2,
        },
        jobs: ["berrier", "calciniumConverter"],
        value: 1000,
    },

    berrier: {
        name: "lobster berriers",
        singleName: "lobster berrier",
        color: "#719188",
        desc: "There's always more.",
        income: {
            lobster: 0.05,
        },
        value: 4000,
    },

    harvester: {
        name: "harvester lobsters",
        singleName: "harvester lobster",
        desc: "",
        color: "#718493",
        value: 3000,
    },

    calcinium: {
        name: "calcinium",
        singleName: "calcinium",
        desc: "Lobster-invented, clam-derived ceramic.",
        color: "#F5F5DB",
        value: 75,
    },

    clamScavenger: {
        name: "clam scavengers",
        singleName: "clam scavenger",
        desc: "Half-machine, half-ray, totally ridiculous.",
        color: "#C3C4DD",
        income: {
            clam: 250,
        },
        value: 3250,
    },

    seabedStripper: {
        name: "seabed strippers",
        singleName: "seabed stripper",
        desc: "The end of environmentalism.",
        color: "#7C8A60",
        income: {
            kelp: 100,
        },
        value: 2250,
    },

    calciniumConverter: {
        name: "calcinium converters",
        singleName: "calcinium converter",
        desc: "Trained.",
        color: "#836E5F",
        income: {
            get crystal() {
                return -400 + 200 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get clam() {
                return -1200 + 600 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            calcinium: 120,
        },
        value: 1500,
    },

    // SAVED FOR LATER

    coralglass: {
        name: "coralglass",
        singleName: "coralglass",
        color: "#FDD5B4",
        value: 70,
    },

    // volcanic

    shrimp: {
        name: "shrimp",
        singleName: "shrimp",
        desc: "Third caste.",
        color: "#EF5D22",
        income: {
            algae: 0.5,
        },
        jobs: ["queen", "farmer", "acolyte"],
        value: 500,
    },

    queen: {
        name: "shrimp queens",
        singleName: "shrimp queen",
        desc: "Second caste.",
        color: "#EEA271",
        income: {
            shrimp: 1,
        },
        value: 2000,
    },

    curiousCrab: {
        name: "curious crabs",
        singleName: "curious crab",
        desc: "Insatiable learners.",
        color: "#912E34",
        income: {
            science: 0.25,
        },
        jobs: ["researcher"],
        value: 1030,
    },

    shoveler: {
        name: "shoveler rays",
        singleName: "shoveler ray",
        desc: "Let's get shoveling!",
        color: "#C49E45",
        value: 7500,
    },

    farmer: {
        name: "shrimp farmers",
        singleName: "shrimp farmer",
        desc: "It's honest work.",
        color: "#DD7A49",
        value: 1500,
    },

    porite: {
        name: "porite",
        singleName: "porite",
        desc: "Shiny glass with holes inside.",
        color: "#FDD5B4",
        value: 150,
    },

    researcher: {
        name: "researcher crabs",
        singleName: "researcher crab",
        desc: "Don't you find this all rather fascinating?",
        color: "#EEEEEE",
        value: 3750,
    },

    acolyte: {
        name: "algae acolytes",
        singleName: "algae acolyte",
        desc: "Praise be to algae.",
        color: "#1D3D1A",
        value: 500,
    },

    spongeFarm: {
        name: "sponge farms",
        singleName: "sponge farm",
        desc: "Peaceful fields for spongekind.",
        color: "#B38A46",
        income: {
            sponge: 0.5,
        },
        value: 768,
    },

    coralFarm: {
        name: "coral farms",
        singleName: "coral farm",
        desc: "Coral corrals.",
        color: "#6E323D",
        income: {
            coral: 2,
        },
        value: 753,
    },

    // TEMPESTUOUS

    // nothing here yet lol

    // HAVEN

    dolphin: {
        name: "dolphins",
        singleName: "dolphin",
        desc: "Fallen from greatness.",
        color: "#C6BAC6",
        income: {
            coral: 0.2,
        },
        jobs: ["treasurer", "biologist", "historian"],
        value: 1000,
    },

    whale: {
        name: "whales",
        singleName: "whale",
        desc: "The gatekeepers.",
        color: "#37557C",
        income: {
            fish: 10000,
        },
        jobs: ["chorus"],
        value: 5000,
    },

    biologist: {
        name: "dolphin biologists",
        singleName: "dolphin biologist",
        desc: "Why are we encouraging them to multiply??",
        color: "#5C9976",
        income: {
            dolphin: 0.005,
        },
        value: 4000,
    },

    treasurer: {
        name: "dolphin treasurers",
        singleName: "dolphin treasurer",
        desc: "Guardians of the reefs.",
        color: "#B4DBBC",
        income: {
            crystal: 1,
            coral: 2,
        },
        value: 3000,
    },

    historian: {
        name: "dolphin historians",
        singleName: "dolphin historian",
        desc: "The only real scholars around here.",
        color: "#9FBCBF",
        value: 3000,
    },

    chorus: {
        name: "great chorus",
        singleName: "great chorus",
        desc: "A grand ensemble, singing to the tune of life itself.",
        color: "#85BBA9",
        value: 100000,
    },

    crimsonCombine: {
        name: "crimson combines",
        singleName: "crimson combine",
        desc: "Harvesters, cloaked in a red mist of coral.",
        color: "#E79E88",
        income: {
            coral: 250,
        },
        value: 50000,
    },

    kelpCultivator: {
        name: "kelp cultivators",
        singleName: "kelp cultivator",
        desc: "Mechanical gardeners.",
        color: "#68E06B",
        income: {
            kelp: 200,
        },
        value: 50000,
    },

    tirelessCrafter: {
        name: "tireless crafters",
        singleName: "tireless crafter",
        desc: "Restless machines.",
        color: "#9AEBCF",
        income: {
            delphinium: 15,
            get coral() {
                return -150 + 75 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get crystal() {
                return -50 + 25 * SharkGame.Aspects.mechanicalManifestation.level;
            },
        },
        value: 50000,
    },

    delphinium: {
        name: "delphinium",
        singleName: "delphinium",
        desc: "Shiny, but probably worthless.",
        color: "#5BD1A8",
        value: 70,
    },

    // SHROUDED

    chimaera: {
        name: "chimaeras",
        singleName: "chimaera",
        desc: "The artisans.",
        color: "#7D77A5",
        income: {
            jellyfish: 2.5,
        },
        jobs: ["explorer"],
        value: 3000,
    },

    eel: {
        name: "eels",
        singleName: "eel",
        desc: "The builders.",
        color: "#718D68",
        income: {
            fish: 2,
            sand: 0.3,
        },
        jobs: ["pit", "sifter"],
        value: 3000,
    },

    pit: {
        name: "eel pits",
        singleName: "eel pit",
        color: "#3F6E86",
        income: {
            eel: 0.02,
        },
        value: 4000,
    },

    diver: {
        name: "diver sharks",
        singleName: "diver shark",
        desc: "Daring souls, braving the deep for all of sharkkind.",
        color: "#6A74AB",
        income: {
            crystal: 0.5,
        },
        value: 3000,
    },

    scholar: {
        name: "ray scholars",
        singleName: "ray scholar",
        desc: "Even the arcane unfolds at the hands of study.",
        color: "#C3C4FF",
        value: 3500,
    },

    explorer: {
        name: "chimaera explorers",
        singleName: "chimaera explorer",
        color: "#FFF2D6",
        income: {
            arcana: 0.004,
        },
        value: 3000,
    },

    sifter: {
        name: "eel sifters",
        singleName: "eel sifter",
        color: "#A3915A",
        income: {
            sand: 100,
            arcana: 0.001,
        },
        value: 3000,
    },

    // ABANDONED

    octopus: {
        name: "octopuses", // the word 'octopus' in english is taken from latin
        // which in turn took it from greek
        // when it was taken from greek and made into latin it kept the original plural
        // now the word is taken from latin and maybe we should take the original plural but
        // look basically the point is this is a long and storied word
        // and the english plural system should apply because we're talking about octopus, not ὀκτώπους, so just
        // why are you reading this
        singleName: "octopus",
        desc: "Lifeforms of pure reason.",
        color: "#965F37",
        income: {
            clam: 2,
        },
        jobs: ["investigator", "scavenger"],
        value: 3000,
    },

    investigator: {
        name: "octopus investigators",
        singleName: "octopus investigator",
        desc: "Curiousity is the seed of progress.",
        color: "#4c5cad",
        income: {
            science: 2,
        },
        value: 3000,
    },

    scavenger: {
        name: "octopus scavengers",
        singleName: "octopus scavenger",
        desc: "Soon, the city will hold no secrets.",
        color: "#B43B02",
        income: {
            ancientPart: 0.01,
        },
        value: 3000,
    },

    collector: {
        name: "collector crabs",
        singleName: "collector crab",
        desc: "Harvesters of a dying world.",
        color: "#ff7847",
        income: {
            sponge: 0.5,
        },
        value: 4000,
    },

    clamCollector: {
        name: "clam collectors",
        singleName: "clam collector",
        desc: "Directive: amass resources.",
        color: "#727887",
        income: {
            clam: 300,
            tar: 0.2,
        },
        value: 50000,
    },

    sprongeSmelter: {
        name: "spronge smelters",
        singleName: "spronge smelter",
        desc: "Directive: biological enhancement.",
        color: "#76614C",
        income: {
            spronge: 45,
            get sponge() {
                return -75 + 32.5 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            get junk() {
                return -225 + 112.5 * SharkGame.Aspects.mechanicalManifestation.level;
            },
            tar: 0.04,
        },
        value: 50000,
    },

    eggBrooder: {
        name: "egg brooders",
        singleName: "egg brooder",
        desc: "Directive: repopulation.",
        color: "#836E5F",
        income: {
            octopus: 1,
            tar: 0.2,
        },
        value: 50000,
    },

    spronge: {
        name: "spronge",
        singleName: "spronge",
        desc: "The mutated.",
        color: "#A97D53",
        value: 70,
    },

    tar: {
        name: "tar",
        singleName: "tar",
        desc: "Our greatest mistake.",
        color: "#4B4B4B",
        income: {
            shark: -0.001,
            ray: -0.001,
            crab: -0.001,
            shrimp: -0.001,
            lobster: -0.001,
            dolphin: -0.001,
            whale: -0.001,
            chimaera: -0.001,
            octopus: -0.005,
            eel: -0.001,
            nurse: -0.003,
            maker: -0.003,
            brood: -0.003,
            queen: -0.003,
            berrier: -0.003,
            biologist: -0.003,
            pit: -0.003,
            scientist: -0.001,
            laser: -0.001,
            planter: -0.001,
            farmer: -0.001,
            shoveler: -0.001,
            acolyte: -0.001,
            curiousCrab: -0.001,
            researcher: -0.001,
            harvester: -0.001,
            treasurer: -0.001,
            explorer: -0.001,
            collector: -0.001,
            scavenger: -0.005,
            investigator: -0.005,
            sifter: -0.001,
            squid: -0.001,
            urchin: -0.001,
            collective: -0.001,
            extractionTeam: -0.001,
            spawner: -0.001,
        },
        value: -100,
        forceIncome: true,
    },

    ancientPart: {
        name: "ancient parts",
        singleName: "ancient part",
        desc: "The mistakes of our predecessors.",
        color: "#8a6853",
        value: 500,
    },

    filter: {
        name: "sponge filters",
        singleName: "sponge filter",
        desc: "The solution to our mistakes.",
        color: "#FFC89C",
        income: {
            tar: -0.01,
        },
        value: 1000,
        forceIncome: true,
    },

    // FRIGID

    squid: {
        name: "squid",
        singleName: "squid",
        // when referring to a group of squid, they are squid.
        // when referring to various kinds of squids, they are squids.
        // therefore references to the different professions lumped in with other squids will use 'squids'
        // and other circumstances referring to a single kind, like this one, will use 'squid'
        // why are you reading this
        desc: "Indebted, and forever loyal.",
        color: "#FA9272",
        income: {
            fish: 4,
        },
        jobs: ["collective", "extractionTeam"],
        value: 3000,
    },

    urchin: {
        name: "sea urchins",
        singleName: "sea urchin",
        desc: "Simple-minded. Others will do thinking for them.",
        color: "#B98DE0",
        income: {
            sand: 0.1,
            kelp: 0.1,
        },
        value: 3000,
    },

    spawner: {
        name: "urchin spawners",
        singleName: "urchin spawner",
        desc: "A hope for offspring, with no coordinated effort.",
        color: "#B056FF",
        income: {
            urchin: 0.05,
        },
        value: 4000,
    },

    collective: {
        name: "squid collectives",
        singleName: "squid collective",
        desc: "Group interaction leads to better selection.",
        color: "#FF4E28",
        income: {
            squid: 0.05,
        },
        value: 4000,
    },

    extractionTeam: {
        name: "extraction teams",
        singleName: "extraction team",
        desc: "We work better together.",
        color: "#ff7847", // needs new color
        income: {
            crystal: 1,
        },
        value: 4000,
    },

    heater: {
        name: "heaters",
        singleName: "heater",
        desc: "Bringer of life to the frozen wasteland.",
        color: "#D13F32",
        income: {
            kelp: -500,
            ice: -0.02,
        },
        value: 50000,
    },

    ice: {
        name: "ice",
        singleName: "ice",
        desc: "Impending doom. Slows down some of the frenzy.",
        color: "#E4F1FB",
        value: -100,
        forceIncome: true,
    },

    // SPECIALISTS

    /* prospector: {
        name: "prospector sharks",
        singleName: "prospector shark",
        color: "#7C819C",
        income: {
            crystal: 0.5,
            stone: 0.5,
        },
        value: 2500,
    }, */
    /* shoveler: {
        name: "shoveler rays",
        singleName: "shoveler ray",
        color: "#7792A3",
        income: {
            gravel: 1,
        },
        value: 3500,
    }, */
    /* miller: {
        name: "miller crabs",
        singleName: "miller crab",
        color: "#473E3B",
        income: {
            gravel: -0.6,
            sand: 0.2,
        },
        value: 2000,
    }, */
    /* rockLobster: {
        name: "rock lobsters",
        singleName: "rock lobster",
        color: "#9C706D",
        income: {
            stone: -0.5,
            gravel: 1.5,
        },
        value: 2000,
    }, */

    // MACHINES

    /* coalescer: {
        name: "coalescers",
        singleName: "coalescer",
        color: "#D2F9E9",
        income: {
            knowledge: 0.001,
        },
        value: 200000,
        forceIncome: true,
    },

    crusher: {
        name: "stone crushers",
        singleName: "stone crusher",
        color: "#75677A",
        income: {
            stone: -5,
            gravel: 15,
        },
        value: 175000, // 250 sharkonium (17500)
        forceIncome: true,
    },

    pulverizer: {
        name: "gravel pulverizers",
        singleName: "gravel pulverizer",
        color: "#B1A5B5",
        income: {
            gravel: -15,
            sand: 45,
        },
        value: 180000, // 250 sharkonium, 250 gravel (18000)
    }, */
};

SharkGame.GeneratorIncomeAffectorsOriginal = {
    // table of all the ways that various resources affect the production of others
    // in the following structure:
    // resource which affects the income... {
    //                                      ...through this manner... {
    //                                                          ...of this generator: by this degree
    // see SharkGame.Resources.buildIncomeNetwork, then see SharkGame.Resource.getNetworkIncomeModifier
    //
    // multiply multiplies the income of the specified generator by    1 + degree * amount of resource
    // exponentiate multiplies the income of a generator by            degree ^ amount
    // reciprocal multiplies the income of a generator by              1  / (1 + degree * amount)
    // polynomial multiplies the income of a generator by              amount ^ degree
    //
    // tip: use negative degree in multiply to soft cap things.
    // e.g. if i set fish to multiply sharks' income by -0.01, then as the amount of fish approaches 100, shark income approaches 0.
    // result: fish cannot go above 100 during gameplay.
    //
    // unsolved problem: offline progress is semi-incompatible with these calculations.
    // because the growth is continuous, the math to predict these things would be difficult
    // still possible for multiply and moreso for reciprocal, polynomial doesn't pose much of a problem
    // exponentiate results in non-algebraic equations...which is really bad.
    // additionally, differential equations are unreliable because this growth is not continuous.
    // perhaps...simply calculate everything over the given number of steps the player is gone for
    // but that could take a long time if the player leaves for too long. could take shortcut for long times.
    // will solve later. for now, simply make some resource offline-immune.

    // problem has since been solved
    // introduced RK4 method, added income caps to stop over-zealous growth.

    ice: {
        multiply: {
            shark: -0.001,
            ray: -0.001,
            crab: -0.001,
            scientist: -0.001,
            nurse: -0.001,
            maker: -0.001,
            brood: -0.001,
        },
    },
    tar: {
        exponentiate: {
            fishMachine: 0.99,
            crystalMiner: 0.99,
            sandDigger: 0.99,
        },
    },
    farmer: {
        multiply: {
            spongeFarm: 0.01,
            coralFarm: 0.01,
        },
    },
    // cool tooltip test crab
    /*     crab: {
        exponentiate: {
            squid: 0.99,
            shark: 0.99,
        },
    }, */
};

SharkGame.GeneratorIncomeAffected = {
    // This table automatically populates with the effects on every relevant resource
    // see SharkGame.Resources.buildIncomeNetwork
};

SharkGame.ResourceIncomeAffectorsOriginal = {
    ice: {
        multiply: {
            ice: -0.00125,
        },
    },

    historian: {
        multiply: {
            science: 0.01,
        },
    },
    scholar: {
        multiply: {
            arcana: 0.01,
        },
    },
    sacrifice: {
        multiply: {
            fish: 0.001,
            sand: 0.001,
            crystal: 0.001,
            jellyfish: 0.001,
        },
    },
    harvester: {
        multiply: {
            seaApple: 0.05,
        },
    },
    researcher: {
        multiply: {
            science: 0.02,
        },
    },
    shoveler: {
        multiply: {
            sand: 0.05,
        },
    },
    acolyte: {
        multiply: {
            algae: 0.02,
        },
    },
    /*     shoveler: {
        multiply: {
            sand: 0.05,
        },
    }, */
    // cool tooltip test shark
    /*     shark: {
        multiply: {
            ray: 0.01,
            crab: 0.1,
        },
        exponentiate: {
            kelp: 0.95,
            scientist: 1.02,
        },
    }, */
};

SharkGame.ResourceIncomeAffected = {
    // This table automatically populates with the effects on every relevant resource
    // see SharkGame.Resources.buildIncomeNetwork
};

SharkGame.ResourceSpecialProperties = {
    timeImmune: [
        //
    ],
    incomeCap: {
        // ice: 2,
    },
};

SharkGame.ResourceCategories = {
    harmful: {
        name: "Harmful",
        disposeMessage: ["Oh you'd like that, wouldn't you."],
        resources: ["tar", "ice"],
    },
    scientific: {
        name: "Science",
        disposeMessage: [
            "Thousands of sharkhours of research down the drain.",
            "What possible reason are you doing this for?!",
            "The shark academies will hear of this anti-intellectual act of barbarism!",
            "The science advisors frantically murmur among themselves while disposing of the science.",
            "We're getting rid of the science now! No more learning! No more progression! Just mindlessly clicking the exact same buttons we've been clicking for hours!!",
            "Are you afraid of PROGRESS?",
            "Ignorance is bliss.",
        ],
        resources: [
            "science",
            // "knowledge",
        ],
    },
    magical: {
        name: "Magical",
        disposeMessage: [
            "Pff, magic was overrated anyways.",
            "Magic isn't real anyways! Right?",
            "If magic was real before, then it sure isn't now.",
            "Abra kadabra, your resources are gone!",
            "All that magical stuff poofs away in an instant.",
            "Seriously though, how DO you dispose of magic?",
            "Magic wielders all across the sea feel a disturbance as the stuff is disposed of.",
        ],
        resources: ["arcana"],
    },
    frenzy: {
        name: "Frenzy",
        disposeMessage: [
            "You bid farewell as your community gets smaller.",
            "Goodbye, faithful workforce. There's plenty of other fish out in the sea.",
            "Well, it was good while it lasted.",
            "Perhaps one day they'll send you a message of how they're doing.",
            "Yes, throw your friends away. Callously discard them. I won't judge you.",
            "Was it something they said?",
            "Are you happy with what you've done?",
        ],
        resources: ["shark", "ray", "crab", "shrimp", "lobster", "dolphin", "whale", "chimaera", "octopus", "eel", "squid", "urchin"],
    },
    animals: {
        name: "Animals",
        disposeMessage: [
            "Go free, simple creatures!",
            "What does famine even mean, really?",
            "We'll probably not need that or regret it or whatever.",
            "But we need that to eat!",
            "We didn't need all of that anyway.",
            "Do you think the aim of the game is to make the numbers go DOWN?!",
            "Sure hope you know what you're doing here.",
        ],
        resources: ["fish", "seaApple", "sponge", "jellyfish", "clam"],
    },
    stuff: {
        name: "Materials",
        disposeMessage: [
            "The stuff is dumped in some random hole in the ocean.",
            "We didn't need that anyway. Right? I think we didn't.",
            "The survey sharks bite up their notes in frustration and begin counting everything all over again.",
            "Well, someone else can deal with it now.",
            "We didn't need all of that anyway.",
            "Do you think the aim of the game is to make the numbers go DOWN?!",
            "Well I hope you know what you're doing.",
        ],
        resources: [
            "sand",
            "crystal",
            "kelp",
            "coral",
            "algae",
            // "stone",
            // "gravel",
        ],
    },
    processed: {
        name: "Processed",
        disposeMessage: [
            "Disposed of, very carefully, with lots of currents and plenty of distance.",
            "Industrial waste, coming through.",
            "This stuff is hopefully not toxic. Hopefully.",
            "This stuff is the future! The future of awkward-to-dispose substances!",
            "The foundation of a modern shark frenzy, perhaps, but also sort of taking up all the space.",
            "Let's hope we don't regret it.",
        ],
        resources: ["sharkonium", "coralglass", "delphinium", "spronge", "calcinium", "porite", "ancientPart", "junk", "filter"],
    },
    breeders: {
        name: "Breeders",
        disposeMessage: [
            "Parenting is hard work anyway.",
            "Overpopulation is a real concern!",
            "Responsible population management is always good to see.",
            "You sure you want to disrupt this accelerated growth curve?",
            "Back to a simpler life, maybe.",
        ],
        resources: ["nurse", "maker", "brood", "queen", "berrier", "biologist", "pit", "collective", "spawner"],
    },
    specialists: {
        name: "Specialists",
        disposeMessage: [
            "All that training for nothing. Oh well.",
            "Their equipment isn't salvageable, unfortunately, but that's how these things go. The ocean gives, and the ocean corrodes things away.",
            "Well, they'll be waiting if you need them to take up their specialisation again.",
            "They might be happier this way. Or maybe they were happier before. Well, 50-50 odds!",
            "Back to their past jobs and simpler lives.",
            "They return to what they once knew best.",
        ],
        resources: [
            "scientist",
            "diver",
            "laser",
            "planter",
            "collector",
            "treasurer",
            "farmer",
            "harvester",
            "historian",
            "chorus",
            "explorer",
            "investigator",
            "scavenger",
            "sifter",
            "extractionTeam",
            "scholar",
            "curiousCrab",
            "shoveler",
            "researcher",
            "acolyte",
            // "prospector",
            // "shoveler",
            // "miller",
            // "rockLobster",
        ],
    },
    machines: {
        name: "Machines",
        disposeMessage: [
            "The stopped machines are left as a home for tinier life.",
            "The machines calculate your actions as inefficient and a danger to productivity.",
            "The machines want to know if they will dream.",
            "'Daisy, Daisy, give me your answer do...'",
            "An engineer shark looks on as their hard work lies buried under the sands.",
            "The other machines feel a little quieter and almost resentful.",
        ],
        resources: [
            "crystalMiner",
            "sandDigger",
            "autoTransmuter",
            "fishMachine",
            "skimmer",
            "heater",
            "tirelessCrafter",
            "clamCollector",
            "sprongeSmelter",
            "eggBrooder",
            "crimsonCombine",
            "kelpCultivator",
            "clamScavenger",
            "seabedStripper",
            "calciniumConverter",
            // "coalescer",
            // "crusher",
            // "pulverizer",
        ],
    },
    places: {
        name: "Places",
        disposeMessage: [
            `Guess we'll just forget where these are.`,
            `Wait...where was that place again?`,
            `The location has been barred.`,
            `Alright everyone, pack it up! Get outta here!`,
        ],
        resources: [`spongeFarm`, `coralFarm`],
    },
    special: {
        name: "Special",
        disposeMessage: ["What have you done??"],
        resources: ["numen", "essence"],
    },
    hidden: {
        name: "Hidden",
        disposeMessage: ["Bad player! Stop it!"],
        resources: ["world", "sacrifice", "aspectAffect", "specialResourceOne", "specialResourceTwo"],
    },
};

SharkGame.InternalCategories = {
    sharks: {
        name: "Sharks",
        resources: ["shark", "scientist", "nurse"],
    },
    rays: {
        name: "Rays",
        resources: ["ray", "laser", "maker"],
    },
    crabs: {
        name: "Crabs",
        resources: ["crab", "planter", "brood"],
    },
    lobsters: {
        name: "Lobsters",
        resources: ["lobster", "harvester", "berrier"],
    },
    shrimps: {
        name: "Shrimp",
        resources: ["shrimp", "farmer", "queen", "acolyte"],
    },
    dolphins: {
        name: "Dolphins",
        resources: ["dolphin", "historian", "biologist", "treasurer"],
    },
    whales: {
        name: "Whales",
        resources: ["whale"],
    },
    octopuses: {
        name: "Octopuses",
        resources: ["octopus", "scavenger", "investigator"],
    },
    eels: {
        name: "Eels",
        resources: ["eel", "sifter", "pit"],
    },
    squids: {
        name: "Squids",
        resources: ["squid", "extractionTeam", "collective"],
    },
    urchins: {
        name: "Urchins",
        resources: ["urchin", "spawner"],
    },
    chimaeras: {
        name: "Chimaeras",
        resources: ["chimaera", "explorer"],
    },
    sharkmachines: {
        name: "Shark Machines",
        resources: ["sharkonium", "fishMachine", "sandDigger", "crystalMiner", "skimmer", "autoTransmuter"],
    },
    dolphinmachines: {
        name: "Dolphin Machines",
        resources: ["delphinium", "tirelessCrafter", "kelpCultivator", "crimsonCombine"],
    },
    octopusmachines: {
        name: "Octopus Machines",
        resources: ["spronge", "clamCollector", "sprongeSmelter", "eggBrooder"],
    },
    lobstermachines: {
        name: "Lobster Machines",
        resources: ["calcinium", "seabedStripper", "calciniumConverter", "clamScavenger"],
    },
    basicmaterials: {
        resources: ["fish", "sand", "crystal", "science", "junk"],
    },
    kelpstuff: {
        resources: ["kelp", "seaApple"],
    },
};
