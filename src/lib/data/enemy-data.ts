import { DamageType, StatusEffect } from "./weapon-data";

export interface Poise {
  base: number;
  multiplier: number;
  effective: number;
  regenDelay: number;
}

export const allStatusEffects = [
  StatusEffect.Poison,
  StatusEffect.Bleed,
  StatusEffect.Scarlet_Rot,
  StatusEffect.Frost,
  StatusEffect.Sleep,
  StatusEffect.Madness,
  StatusEffect.Death_Blight,
];

export enum NewGame {
  NG = "NG",
  NGPlus = "NG+",
  NGPlus2 = "NG+2",
  NGPlus3 = "NG+3",
  NGPlus4 = "NG+4",
  NGPlus5 = "NG+5",
  NGPlus6 = "NG+6",
  NGPlus7 = "NG+7",
}

export interface EnemyDrop {
  drop: string;
  baseDropChance: number;
  isAffectedByDiscovery: boolean;
  quantity: number;
}

export interface Enemy {
  id: number;
  name: string;
  location: string;
  healthPoints: number;
  dlcClearHealthPoints: number | null;
  defence: {
    [key in DamageType]: number;
  };
  damageNegation: {
    [key in DamageType]: number;
  };
  poise: Poise;
  resistances: {
    [key in StatusEffect]: number | "Immune";
  };
  drops: EnemyDrop[];
}

export interface EnemyData {
  Location: string;
  Name: string;
  ID: string;
  "": string; // Unused field
  Health: string;
  dlcClear: string;
  _1: string; // Unused field
  Phys: string;
  Strike: string;
  Slash: string;
  Pierce: string;
  Magic: string;
  Fire: string;
  Ltng: string;
  Holy: string;
  _2: string; // Unused field
  Phys_1: string;
  Strike_1: string;
  Slash_1: string;
  Pierce_1: string;
  Magic_1: string;
  Fire_1: string;
  Ltng_1: string;
  Holy_1: string;
  _3: string; // Unused field
  Poison: string;
  "Scarlet Rot": string;
  Bleed: string;
  Frost: string;
  Sleep: string;
  Madness: string;
  Deathblight: string;
  _4: string; // Unused field
  Bleed_1: string;
  Frost_1: string;
  Sleep_1: string;
  Madness_1: string;
  "HP Burn Effect": string;
  _5: string; // Unused field
  Base: string;
  "Incoming Mult": string;
  Effective: string;
  "Regen Delay": string;
  _6: string; // Unused field
  "Part 1": string;
  "Part 2": string;
  "Part 3": string;
  "Part 4": string;
  "Part 5": string;
  "Part 6": string;
  "Part 7": string;
  "Part 8": string;
  "Weak Parts": string;
}

export const allEnemyLocations = [
  "Abandoned Cave",
  "Academy Crystal Cave",
  "Academy of Raya Lucaria",
  "Ainsel River",
  "Ainsel River - Boss",
  "Altus Plateau",
  "Altus Plateau - Abandoned Coffin, Ruin-Strewn Precipice Exit",
  "Altus Plateau - Altus Highway Junction",
  "Altus Plateau - Bower of Bounty, Writheblood Ruins",
  "Altus Plateau - East Windmill Village, Highway Lookout Tower",
  "Altus Plateau - Erdtree-Gazing Hill, Lux Ruins",
  "Altus Plateau - Forest-Spanning Greatbridge, St. Trina's Hideaway, Sainted Hero's Grave Entrance",
  "Altus Plateau - Golden Lineage Evergaol",
  "Altus Plateau - Mirage Rise; Mt. Gelmir - Bridge of Iniquity",
  "Altus Plateau - Perfumer's Ruins, Unsightly Catacombs Entrance",
  "Altus Plateau - Rampartside Path, Altus Tunnel Entrance",
  "Altus Plateau - Road of Iniquity Side Path",
  "Altus Plateau - Second Church of Marika",
  "Altus Plateau - Shaded Castle",
  "Altus Plateau - South of Tree Sentinel Duo",
  "Altus Plateau - Southwest of Tree Sentinel Duo",
  "Altus Plateau - Tree Sentinel Duo, Perfumer's Grotto Entrance",
  "Altus Plateau - Village Windmill Pasture, East Windmill Pasture",
  "Altus Plateau - West of Tree Sentinel Duo, Stormcaller Church",
  "Altus Plateau - West Windmill Pasture",
  "Altus Plateau - West Windmill Village",
  "Altus Plateau - Windmill Heights",
  "Altus Plateau - Woodfolk Ruins, Minor Erdtree",
  "Altus Plateau - Wyndham Ruins, Wyndham Catacombs Entrance",
  "Altus Tunnel",
  "Auriza Hero's Grave",
  "Auriza Side Tomb",
  "Bellum Highway",
  "Bellum Highway - Church of Inhibition, Southwest of Grand Lift of Dectus",
  "Bellum Highway - Converted Fringe Tower; Liurnia of the Lakes - Black Knife Catacombs Entrance",
  "Bellum Highway - East Raya Lucaria Gate",
  "Bellum Highway - Frenzied Flame Village, Minor Erdtree",
  "Bellum Highway - Frenzy-Flaming Tower",
  "Black Knife Catacombs",
  "Caelid",
  "Caelid - Caelem Ruins, Forsaken Ruins, Minor Erdtree, Minor Erdtree Catacombs Entrance",
  "Caelid - Caelid Highway South",
  "Caelid - Cathedral of Dragon Communion, Caelid Catacombs Entrance",
  "Caelid - Central Radahn Arena",
  "Caelid - Deep Siofra Well; Greyoll's Dragonbarrow - Dragonbarrow West",
  "Caelid - East Aeonia Swamp",
  "Caelid - East Sellia, Church of the Plague",
  "Caelid - Far Southwest Radahn Arena, Aeonia Swamp Bank Southeast Cliffside",
  "Caelid - Fort Gael North",
  "Caelid - Fort Gael, Caelid Waypoint Ruins, Gaol Cave Entrance",
  "Caelid - Gowry's Shack",
  "Caelid - Redmane Castle",
  "Caelid - Redmane Castle South Cliffside",
  "Caelid - Smoldering Church, Rotview Balcony",
  "Caelid - Smoldering Wall, Abandoned Cave Entrance",
  "Caelid - South Great-Jar Area",
  "Caelid - Southern Aeonia Swamp Bank",
  "Caelid - Southwest of Caelid Highway South",
  "Caelid - West Aeonia Swamp",
  "Caelid - West of Caelid Highway South",
  "Caelid - West Sellia, Sellia Crystal Tunnel Entrance",
  "Caelid Catacombs",
  "Capital Outskirts",
  "Capital Outskirts - Capital Rampart, Auriza Side Tomb Entrance",
  "Capital Outskirts - East of Outer Wall Phantom Tree",
  "Capital Outskirts - Minor Erdtree",
  "Capital Outskirts - Minor Erdtree Church, Sealed Tunnel Entrance",
  "Capital Outskirts - Northeast Outer Wall Battleground, Hermit Merchant's Shack",
  "Capital Outskirts - Northwest Outer Wall Battleground",
  "Capital Outskirts - Outer Wall Phantom Tree",
  "Capital Outskirts - South of Minor Erdtree",
  "Capital Outskirts - South of Outer Wall Phantom Tree",
  "Capital Outskirts - Southeast Outer Wall Battleground",
  "Capital Outskirts - Southwest Outer Wall Battleground",
  "Cave of the Forlorn",
  "Chapel of Anticipation",
  "Cliffbottom Catacombs",
  "Coastal Cave",
  "Consecrated Snowfield",
  "Consecrated Snowfield - Apostate Derelict",
  "Consecrated Snowfield - Consecrated Snowfield Catacombs Entrance",
  "Consecrated Snowfield - East of Ordina",
  "Consecrated Snowfield - Far West Cliffside",
  "Consecrated Snowfield - Hidden Path to the Haligtree, Southeast Foggy Area",
  "Consecrated Snowfield - North of Yelough Anix Ruins",
  "Consecrated Snowfield - Northeast Foggy Area, Inner Consecrated Snowfield",
  "Consecrated Snowfield - Northwest Foggy Area, East of Yelough Anix Ruins",
  "Consecrated Snowfield - Ordina, Liturgical Town",
  "Consecrated Snowfield - South of Ordina",
  "Consecrated Snowfield - Southeast of Ordina",
  "Consecrated Snowfield - Southwest Foggy Area",
  "Consecrated Snowfield - West of Ordina",
  "Consecrated Snowfield - Yelough Anix Ruins, Yelough Anix Tunnel Entrance",
  "Consecrated Snowfield Catacombs",
  "Crumbling Farum Azula",
  "Deathtouched Catacombs",
  "Deeproot Depths",
  "Divine Tower of Caelid",
  "Divine Tower of East Altus",
  "Divine Tower of Limgrave",
  "Divine Tower of Liurnia",
  "Divine Tower of West Altus",
  "Dragonbarrow Cave",
  "Earthbore Cave",
  "East Limgrave",
  "East Liurnia",
  "East Liurnia / Liurnia to Atlus Plateau",
  "Gael Tunnel",
  "Gaol Cave",
  "Gelmir Hero's Grave",
  "Giant-Conquering Hero's Grave",
  "Giants' Mountaintop Catacombs",
  "Greyoll's Dragonbarrow",
  "Greyoll's Dragonbarrow - Bestial Sanctum",
  "Greyoll's Dragonbarrow - Divine Tower of Caelid Entrance",
  "Greyoll's Dragonbarrow - Dragonbarrow Fork",
  "Greyoll's Dragonbarrow - Fort Faroth",
  "Greyoll's Dragonbarrow - Isolated Merchant's Shack",
  "Greyoll's Dragonbarrow - Minor Erdtree, Dragonbarrow Cave Entrance",
  "Greyoll's Dragonbarrow - Northwest Farum Greatbridge",
  "Greyoll's Dragonbarrow - South of Divine Tower of Caelid, Deep Siofra Well",
  "Greyoll's Dragonbarrow - Southeast Farum Greatbridge, Lenne's Rise",
  "Greyoll's Dragonbarrow - Southwest Farum Greatbridge",
  "Groveside Cave",
  "Hidden Path to the Haligtree",
  "Highroad Cave",
  "Impaler's Catacombs",
  "Lakeside Crystal Cave",
  "Leyndell",
  "Leyndell - Divine Tower of East Altus Entrance; Mountaintops of the Giants - Forbidden Lands Start",
  "Leyndell, Ashen Capital",
  "Leyndell, Royal Capital",
  "Limgrave",
  "Limgrave - Agheel Lake North, Murkwater Cave Entrance",
  "Limgrave - Agheel Lake South, Forlorn Hound Evergaol",
  "Limgrave - Artist's Shack",
  "Limgrave - Church of Dragon Communion, Coastal Cave Exit",
  "Limgrave - Church of Elleh, Stranded Graveyard Exit",
  "Limgrave - Coastal Cave Entrance",
  "Limgrave - Dragon-Burnt Ruins",
  "Limgrave - Fort Haight",
  "Limgrave - Fort Haight West",
  "Limgrave - Gatefront, Stormhill Evergaol, Groveside Cave Entrance, Limgrave Tunnels Entrance",
  "Limgrave - Mistwood Outskirts",
  "Limgrave - Murkwater Coast, Murkwater Catacombs Entrance",
  "Limgrave - Rear Gael Tunnel Entrance; Caelid - Gael Tunnel Entrance",
  "Limgrave - Seaside Ruins",
  "Limgrave - Siofra River Well, Mistwood Ruins, Minor Erdtree, Nokron Entrance",
  "Limgrave - South of Stranded Graveyard Exit",
  "Limgrave - South of Summonwater Village",
  "Limgrave - Stormfoot Catacombs Entrance",
  "Limgrave - Summonwater Village",
  "Limgrave - Summonwater Village Outskirts",
  "Limgrave - Third Church of Marika, Gaol Cave Exit",
  "Limgrave - Waypoint Ruins",
  "Limgrave Tunnels",
  "Liurnia - Liurnia Highway South Endpoint, Path to Stormhill",
  "Liurnia of the Lakes",
  "Liurnia of the Lakes - Artist's Shack, Eastern Liurnia Lake Shore",
  "Liurnia of the Lakes - Behind Caria Manor, Royal Grave Evergaol, Part of Ravine",
  "Liurnia of the Lakes - Boilprawn Shack, Fallen Ruins of the Lake",
  "Liurnia of the Lakes - Caria Manor",
  "Liurnia of the Lakes - Church of Irith",
  "Liurnia of the Lakes - Church of Vows",
  "Liurnia of the Lakes - Converted Tower",
  "Liurnia of the Lakes - Crystalline Woods, Path to the Four Belfries",
  "Liurnia of the Lakes - Cuckoo's Evergaol, West of Meeting Place",
  "Liurnia of the Lakes - Eastern Tableland Northeast Cliffside",
  "Liurnia of the Lakes - Eastern Tableland, Ainsel River Well",
  "Liurnia of the Lakes - Far West Gate Town, North Rose Church",
  "Liurnia of the Lakes - Folly on the Lake, South Rose Church",
  "Liurnia of the Lakes - Foot of the Four Belfries",
  "Liurnia of the Lakes - Gate Town Bridge",
  "Liurnia of the Lakes - Gate Town Northwest",
  "Liurnia of the Lakes - Gate Town Southeast",
  "Liurnia of the Lakes - Gate Town Southwest",
  "Liurnia of the Lakes - Highway Lookout Tower",
  "Liurnia of the Lakes - Jarburg, Divine Tower of Liurnia Entrance",
  "Liurnia of the Lakes - Lake-Facing Cliffs, Stormveil Castle Exit, Stillwater Cave Entrance",
  "Liurnia of the Lakes - Laskyar Ruins, Malefactor's Evergaol",
  "Liurnia of the Lakes - Liurnia Highway Far North",
  "Liurnia of the Lakes - Liurnia Highway North",
  "Liurnia of the Lakes - Liurnia Highway South, Purified Ruins, Cliffbottom Catacombs Entrance",
  "Liurnia of the Lakes - Liurnia Lake Shore",
  "Liurnia of the Lakes - Main Academy Gate, Academy of Raya Lucaria Entrance",
  "Liurnia of the Lakes - Mausoleum Compound",
  "Liurnia of the Lakes - Meeting Place, Academy Crystal Cave Entrance",
  "Liurnia of the Lakes - Minor Erdtree, Road's End Catacombs Entrance",
  "Liurnia of the Lakes - North of Gate Town Bridge",
  "Liurnia of the Lakes - North of Sorcerer's Isle",
  "Liurnia of the Lakes - Northern Liurnia Lake Shore, Kingsrealm Ruins",
  "Liurnia of the Lakes - Ranni's Rise, Seluvis's Rise",
  "Liurnia of the Lakes - Ravine-Veiled Village; Bellum Highway - Grand Lift of Dectus; Altus Plateau - Altus Plateau; Ruin-Strewn Precipice Entrance",
  "Liurnia of the Lakes - Revenger's Shack",
  "Liurnia of the Lakes - Road to the Manor",
  "Liurnia of the Lakes - Ruined Labyrinth, Uld Palace Ruins",
  "Liurnia of the Lakes - Scenic Isle, Laskyar Ruins",
  "Liurnia of the Lakes - Slumbering Wolf's Shack, Lakeside Crystal Cave Entrance",
  "Liurnia of the Lakes - Sorcerer's Isle West, East Belfry",
  "Liurnia of the Lakes - South of Caria Manor, West of Ravine Entrance",
  "Liurnia of the Lakes - South of Mausoleum Compound, Raya Lucaria Crystal Tunnel Entrance",
  "Liurnia of the Lakes - South of Scenic Isle, East of Slumbering Wolf's Shack",
  "Liurnia of the Lakes - South Raya Lucaria Gate",
  "Liurnia of the Lakes - Southeast Ravine, Lake at Caria Manor Entrance; Bellum Highway - Bellum Church",
  "Liurnia of the Lakes - Temple Quarter",
  "Liurnia of the Lakes - Testu's Rise, East Gate Bridge Trestle",
  "Liurnia of the Lakes - The Four Belfries, Giant's Caravan Below",
  "Liurnia of the Lakes - Village of the Albinaurics; Moonlight Altar - Moonfolk Ruins",
  "Liurnia of the Lakes - West of Raya Lucaria Crystal Tunnel; Bellum Highway - South of East Raya Lucaria Gate",
  "Liurnia of the Lakes - West of Scenic Isle",
  "Minor Erdtree Catacombs",
  "Miquella's Haligtree",
  "Mohgwyn Palace",
  "Moonlight Altar",
  "Moonlight Altar - Altar South, Chelona's Rise",
  "Moonlight Altar - Cathedral of Manus Celes",
  "Moonlight Altar - Deep Ainsel Well",
  "Moonlight Altar - Lunar Estate Ruins",
  "Moonlight Altar - Ringleader's Evergaol",
  "Moonlight Altar - West of Deep Ainsel Well",
  "Morne Tunnel",
  "Mountaintops of the Giants",
  "Mountaintops of the Giants - Ancient Snow Valley Ruins, Stargazers' Ruins",
  "Mountaintops of the Giants - Before Freezing Lake, Heretical Rise",
  "Mountaintops of the Giants - Before Grand Lift of Rold",
  "Mountaintops of the Giants - East Zamor Ruins",
  "Mountaintops of the Giants - Forbidden Lands Midway",
  "Mountaintops of the Giants - Guardians' Garrison",
  "Mountaintops of the Giants - North of Zamor Ruins",
  "Mountaintops of the Giants - Northeast Giants' Gravepost",
  "Mountaintops of the Giants - Northwest Giants' Gravepost",
  "Mountaintops of the Giants - Northwest of Freezing Lake, East of Castle Sol",
  "Mountaintops of the Giants - Shack of the Lofty; Consecrated Snowfield - Minor Erdtree, Albinauric Rise, Cave of the Forlorn Entrance",
  "Mountaintops of the Giants - South Castle Sol, Snow Valley Ruins Overlook",
  "Mountaintops of the Giants - Southwest Freezing Lake, Lord Contender's Evergaol, Spiritcaller Cave Entrance",
  "Mountaintops of the Giants - Southwest Giants' Gravepost",
  "Mountaintops of the Giants - West of Castle Sol; Consecrated Snowfield - North of Minor Erdtree",
  "Mountaintops of the Giants - West of First Church of Marika",
  "Mountaintops of the Giants - West Zamor Ruins, Grand Lift of Rold",
  "Mountaintops of the Giants - Whiteridge Road, Minor Erdtree",
  "Mt. Gelmir",
  "Mt. Gelmir - Craftsman's Shack, Hermit's Shack",
  "Mt. Gelmir - First Mt. Gelmir Campsite, Corpse-Stench Shack; Altus Plateau - West of Shaded Castle",
  "Mt. Gelmir - Fort Laiedd",
  "Mt. Gelmir - Minor Erdtree, Seethewater Cave Entrance",
  "Mt. Gelmir - Ninth Mt. Gelmir Campsite, Road of Iniquity, Volcano Manor Entrance",
  "Mt. Gelmir - Primeval Sorcerer Azur, Gelmir Hero's Grave Entrance",
  "Mt. Gelmir - Seethewater River, Hermit Village, Wyndham Catacombs Entrance, Sage's Cave Entrance, Abductor Virgins Exit",
  "Mt. Gelmir - Seethewater Terminus",
  "Murkwater Catacombs",
  "Murkwater Cave",
  "Nokron, Eternal City - Boss",
  "North Atlus Plateau",
  "Northeast Mountaintops",
  "Northwest Mountaintops",
  "Old Altus Tunnel",
  "Perfumer's Grotto",
  "Raya Lucaria Crystal Tunnel",
  "Road's End Catacombs",
  "Roundtable Hold",
  "Ruin-Strewn Precipice",
  "Sage's Cave",
  "Sainted Hero's Grave",
  "Seethewater Cave",
  "Sellia Crystal Tunnel",
  "Sellia Hideaway",
  "Siofra River",
  "Siofra River - Boss",
  "Siofra River Bank",
  "Southeast Caelid",
  "Southeast Mountaintops",
  "Southeast Weeping Peninsula Coast",
  "Southwest Liurnia",
  "Southwest Mountaintops",
  "Spirit Summon",
  "Spiritcaller Cave",
  "Stillwater Cave",
  "Stone Platform",
  "Stormfoot Catacombs",
  "Stormhill",
  "Stormhill - Forested West Cliffside",
  "Stormhill - North of Stormhill Shack",
  "Stormhill - North of Warmaster's Shack",
  "Stormhill - Northwest Cliffside",
  "Stormhill - Path to Liurnia",
  "Stormhill - Saintsbridge, Deathtouched Catacombs Entrance, Highroad Cave Entrance",
  "Stormhill - Stormhill Shack, Stormveil Castle Entrance",
  "Stormhill - Warmaster's Shack, Stormgate",
  "Stormveil Castle",
  "Stranded Graveyard",
  "Subterranean Shunning-Grounds",
  "Tombsward Catacombs",
  "Tombsward Cave",
  "Unsightly Catacombs",
  "Volcano Cave",
  "Volcano Manor",
  "War-Dead Catacombs",
  "Weeping Peninsula",
  "Weeping Peninsula - Beside the Crater-Pocked Glade, Oridys's Rise",
  "Weeping Peninsula - Bridge of Sacrifice, Forest Lookout Tower, Earthbore Cave Entrance",
  "Weeping Peninsula - Castle Morne",
  "Weeping Peninsula - Castle Morne Approach North",
  "Weeping Peninsula - Castle Morne Approach Northeast Cliffside",
  "Weeping Peninsula - Castle Morne Approach Northwest Cliffside",
  "Weeping Peninsula - Castle Morne Approach South",
  "Weeping Peninsula - Castle Morne Rampart, Ailing Village Outskirts",
  "Weeping Peninsula - Church of Pilgrimage, Demi-Human Forest Ruins",
  "Weeping Peninsula - Fourth Church of Marika, Witchbane Ruins",
  "Weeping Peninsula - Impaler's Catacombs Entrance",
  "Weeping Peninsula - Isolated Merchant's Shack",
  "Weeping Peninsula - Minor Erdtree, Tombsward Catacombs Entrance, Morne Tunnel Entrance",
  "Weeping Peninsula - Morne Moangrave",
  "Weeping Peninsula - North of Fourth Church of Marika",
  "Weeping Peninsula - Tombsward Ruins",
  "Weeping Peninsula - Tombsward; Weeping Evergaol; Tombsward Cave Entrance",
  "Weeping Peninsula - Tower of Return",
  "West Consecrated Snowfield",
  "West Limgrave",
  "West Liurnia",
  "West Weeping Peninsula",
  "Wyndham Catacombs",
  "Yelough Anix Tunnel",
  "[DLC]",
  "[DLC] Abyssal Woods",
  "[DLC] Ancient Ruins of Rauh",
  "[DLC] Belurat Gaol",
  "[DLC] Belurat, Tower Settlement",
  "[DLC] Bonny Gaol",
  "[DLC] Castle Ensis",
  "[DLC] Cerulean Coast",
  "[DLC] Charo's Hidden Grave",
  "[DLC] Ellac River",
  "[DLC] Enir-Ilim",
  "[DLC] Finger Birthing Grounds",
  "[DLC] Finger Ruins of Dheo",
  "[DLC] Fog Rift Catacombs",
  "[DLC] Fog Rift Fort",
  "[DLC] Foot of the Jagged Peak",
  "[DLC] Fort of Reprimand",
  "[DLC] Gravesite Plain",
  "[DLC] Hinterland",
  "[DLC] Jagged Peak",
  "[DLC] Jagged Peak/Enir-Ilim/Finger Birthing Grounds",
  "[DLC] Rauh Base",
  "[DLC] Recluses' River",
  "[DLC] Scadu Altus",
  "[DLC] Scadutree Base",
  "[DLC] Scaduview",
  "[DLC] Scaduview/Ancient Ruins of Rauh",
  "[DLC] Scorpion River Catacombs",
  "[DLC] Shadow Keep",
  "[DLC] Stone Coffin Fissure",
  "[DLC] Castle Ensis / Cerulean Coast",
  "[DLC] Scaduview / Ancient Ruins of Rauh",
  "[DLC] Stone Coffin Fissure / Shadow Keep",
  "[DLC] Jagged Peak / Enir-Ilim / Finger Birthing Grounds",
  "[DLC] Recluses' River / Specimen Storehouse",
  "[DLC] Abyssal Woods / Hinterland",
];

export const allEnemyDrops = [
  "Academy Glintstone Staff",
  "Aeonian Butterfly",
  "Alabaster Lord's Sword",
  "Albinauric Bloodclot",
  "Albinauric Bow",
  "Albinauric Shield",
  "Altus Bloom",
  "Antiquity Scholar's Cookbook [1]",
  "Aristocrat Boots",
  "Aristocrat Coat",
  "Aristocrat Garb",
  "Aristocrat Garb (Altered)",
  "Aristocrat Hat",
  "Aristocrat Headband",
  "Arrow",
  "Arteria Leaf",
  "Ascetic's Ankle Guards",
  "Ascetic's Loincloth",
  "Ascetic's Wrist Guards",
  "Ash of War: Golden Vow",
  "Ash of War: Gravitas",
  "Bandit's Curved Sword",
  "Banished Knight Armor",
  "Banished Knight Armor (Altered)",
  "Banished Knight Gauntlets",
  "Banished Knight Greaves",
  "Banished Knight Helm",
  "Banished Knight Helm (Altered)",
  "Banished Knight's Greatsword",
  "Banished Knight's Halberd",
  "Banished Knight's Shield",
  "Battle Hammer",
  "Battlemage Legwraps",
  "Battlemage Manchettes",
  "Battlemage Robe",
  "Beast Blood",
  "Beast Horn",
  "Beast Liver",
  "Beastman's Cleaver",
  "Beastman's Curved Sword",
  "Beastman's Jar-Shield",
  "Black Dumpling",
  "Black Knight Armor",
  "Black Knight Gauntlets",
  "Black Knight Greaves",
  "Black Knight Helm",
  "Black Pyrefly",
  "Blackflame Monk Armor",
  "Blackflame Monk Gauntlets",
  "Blackflame Monk Greaves",
  "Blackflame Monk Hood",
  "Blessed Bone Shard",
  "Blood-Tainted Excrement",
  "Bloodfiend's Arm",
  "Bloodfiend's Fork",
  "Bloodfiend's Sacred Spear",
  "Bloodhound Claws",
  "Bloodhound Knight Armor",
  "Bloodhound Knight Gauntlets",
  "Bloodhound Knight Greaves",
  "Bloodhound Knight Helm",
  "Bloodrose",
  "Bloodsoaked Tabard",
  "Bloodstained Dagger",
  "Blue Festive Garb",
  "Blue Festive Hood",
  "Blue Silver Bracelets",
  "Blue Silver Mail Armor",
  "Blue Silver Mail Hood",
  "Blue Silver Mail Skirt",
  "Bolt",
  "Brass Shield",
  "Budding Cave Moss",
  "Budding Horn",
  "Celebrant's Cleaver",
  "Celebrant's Rib-Rake",
  "Celebrant's Sickle",
  "Chain-Draped Tabard",
  "Chainlink Flail",
  "Clayman's Harpoon",
  "Cleanrot Armor",
  "Cleanrot Gauntlets",
  "Cleanrot Greaves",
  "Cleanrot Helm",
  "Cleanrot Knight's Sword",
  "Cleanrot Spear",
  "Club",
  "Commoner's Garb",
  "Commoner's Headband (Altered)",
  "Commoner's Shoes",
  "Congealed Putrescence",
  "Crab Eggs",
  "Cracked Crystal",
  "Crescent Moon Axe",
  "Cuckoo Glintstone",
  "Cuckoo Greatshield",
  "Cuckoo Knight Armor",
  "Cuckoo Knight Gauntlets",
  "Cuckoo Knight Greaves",
  "Cuckoo Knight Helm",
  "Cuckoo Surcoat",
  "Curseblade Mask",
  "Curseblade's Cirque",
  "Curved Club",
  "Curved Great Club",
  "Dagger",
  "Deep-Purple Lily",
  "Depraved Perfumer Gloves",
  "Depraved Perfumer Headscarf",
  "Depraved Perfumer Robe",
  "Depraved Perfumer Trousers",
  "Dewgem",
  "Dewkissed Herba",
  "Digger's Staff",
  "Dirty Chainmail",
  "Dismounter",
  "Divine Beast Helm",
  "Divine Beast Warrior Armor",
  "Divine Bird Helm",
  "Divine Bird Warrior Armor",
  "Divine Bird Warrior Gauntlets",
  "Divine Bird Warrior Greaves",
  "Dragon Communion Seal",
  "Dragon Cult Prayerbook",
  "Duelist Greataxe",
  "Duelist Greaves",
  "Duelist Helm",
  "Dwelling Arrow",
  "Eclipse Crest Greatshield",
  "Ember of Messmer",
  "Envoy's Greathorn",
  "Envoy's Horn",
  "Envoy's Long Horn",
  "Erdleaf Flower",
  "Erdtree Surcoat",
  "Executioner's Greataxe",
  "Exile Armor",
  "Exile Gauntlets",
  "Exile Greaves",
  "Exile Hood",
  "Explosive Stone",
  "Explosive Stone Clump",
  "Eye of Yelough",
  "Faded Erdleaf Flower",
  "Falchion",
  "Festive Garb",
  "Festive Garb (Altered)",
  "Festive Hood",
  "Finger Mimic",
  "Fire Blossom",
  "Fire Knight Armor",
  "Fire Knight Gauntlets",
  "Fire Knight Greaves",
  "Fire Knight Helm",
  "Fire Knight's Greatsword",
  "Fire Knight's Shortsword",
  "Fire Monk Armor",
  "Fire Monk Gauntlets",
  "Fire Monk Greaves",
  "Fire Monk Hood",
  "Fire Prelate Armor",
  "Fire Prelate Armor (Altered)",
  "Fire Prelate Gauntlets",
  "Fire Prelate Greaves",
  "Fire Prelate Helm",
  "Fire Spritestone",
  "Flight Pinion",
  "Fly Mold",
  "Foot Soldier Cap",
  "Foot Soldier Gauntlets",
  "Foot Soldier Greaves",
  "Foot Soldier Helm",
  "Foot Soldier Helmet",
  "Foot Soldier Tabard",
  "Forked Greatsword",
  "Forked Hatchet",
  "Forked-Tongue Hatchet",
  "Formic Rock",
  "Four-Toed Fowl Foot",
  "Frozen Maggot",
  "Frozen Raisin",
  "Fulgurbloom",
  "Fur Leggings",
  "Fur Raiment",
  "Gas Stone",
  "Gelmir Glintstone Staff",
  "Ghost Glovewort [1]",
  "Ghost Glovewort [2]",
  "Ghost Glovewort [3]",
  "Ghost Glovewort [4]",
  "Ghost Glovewort [5]",
  "Ghost Glovewort [6]",
  "Ghost Glovewort [7]",
  "Ghost Glovewort [8]",
  "Ghost Glovewort [9]",
  "Gilded Foot Soldier Cap",
  "Gilded Greatshield",
  "Glaive",
  "Glass Shard",
  "Glintstone Firefly",
  "Glintstone Scrap",
  "Glintstone Staff",
  "Glowstone",
  "Godrick Knight Armor",
  "Godrick Knight Gauntlets",
  "Godrick Knight Greaves",
  "Godrick Knight Helm",
  "Godrick Soldier Gauntlets",
  "Godrick Soldier Greaves",
  "Godrick Soldier Helm",
  "Gold-Tinged Excrement",
  "Golden Centipede",
  "Golden Greatshield",
  "Golden Horn Tender",
  "Golden Rune [10]",
  "Golden Rune [11]",
  "Golden Rune [12]",
  "Golden Rune [13]",
  "Golden Rune [1]",
  "Golden Rune [2]",
  "Golden Rune [3]",
  "Golden Rune [4]",
  "Golden Rune [5]",
  "Golden Rune [6]",
  "Golden Rune [7]",
  "Golden Rune [8]",
  "Golden Rune [9]",
  "Golden Sunflower",
  "Golem Fist",
  "Golem Greatbow",
  "Golem's Great Arrow",
  "Golem's Halberd",
  "Golem's Magic Arrow",
  "Grave Glovewort [1]",
  "Grave Glovewort [2]",
  "Grave Glovewort [3]",
  "Grave Glovewort [4]",
  "Grave Glovewort [5]",
  "Grave Glovewort [6]",
  "Grave Glovewort [7]",
  "Grave Glovewort [8]",
  "Grave Glovewort [9]",
  "Grave Scythe",
  "Grave Violet",
  "Gravekeeper Cloak",
  "Gravel Stone",
  "Gravel Stone Seal",
  "Gravity Stone Chunk",
  "Gravity Stone Fan",
  "Great Arrow",
  "Great Dragonfly Head",
  "Great Ghost Glovewort",
  "Great Horned Headband",
  "Great Knife",
  "Great Omenkiller Cleaver",
  "Greatbow",
  "Greathorn Hammer",
  "Grossmesser",
  "Guardian Bracers",
  "Guardian Garb",
  "Guardian Garb (Full Bloom)",
  "Guardian Greaves",
  "Guardian Mask",
  "Guardian's Swordspear",
  "Haima Glintstone Crown",
  "Haligtree Crest Greatshield",
  "Haligtree Crest Surcoat",
  "Haligtree Gauntlets",
  "Haligtree Greaves",
  "Haligtree Helm",
  "Haligtree Knight Armor",
  "Haligtree Knight Gauntlets",
  "Haligtree Knight Greaves",
  "Halo Scythe",
  "Heavy Crossbow",
  "Hefty Beast Bone",
  "Herba",
  "High Page Clothes",
  "High Page Hood",
  "Highwayman Cloth Armor",
  "Highwayman Gauntlets",
  "Highwayman Hood",
  "Horned Warrior Armor",
  "Horned Warrior Gauntlets",
  "Horned Warrior Greaves",
  "Horned Warrior Helm",
  "Horned Warrior's Sword",
  "Human Bone Shard",
  "Immunizing Horn Charm +1",
  "Imp Head (Cat)",
  "Imp Head (Fanged)",
  "Imp Head (Long-Tongued)",
  "Imp Head (Wolf)",
  "Innard Meat",
  "Inverted Hawk Towershield",
  "Iron Cleaver",
  "Iron Greatsword",
  "Iron Spear",
  "Ivory-Draped Tabard",
  "Jawbone Axe",
  "Kaiden Armor",
  "Kaiden Gauntlets",
  "Kaiden Helm",
  "Kaiden Trousers",
  "Knight's Greatsword",
  "Knot Resin",
  "Kukri",
  "Land Octopus Ovary",
  "Large Glintstone Scrap",
  "Larval Tear",
  "Lazuli Glintstone Sword",
  "Lazuli Robe",
  "Leather-Draped Tabard",
  "Leyndell Knight Armor",
  "Leyndell Knight Gauntlets",
  "Leyndell Knight Greaves",
  "Leyndell Knight Helm",
  "Leyndell Soldier Gauntlets",
  "Leyndell Soldier Greaves",
  "Leyndell Soldier Helm",
  "Living Jar Shard",
  "Lizard Greatsword",
  "Longbow",
  "Longhaft Axe",
  "Lordsworn's Bolt",
  "Lordsworn's Shield",
  "Lordsworn's Straight Sword",
  "Lump of Flesh",
  "Magma Blade",
  "Man-Serpent's Shield",
  "Mantis Blade",
  "Marionette Soldier Armor",
  "Marionette Soldier Birdhelm",
  "Marionette Soldier Helm",
  "Mausoleum Gauntlets",
  "Mausoleum Greaves",
  "Mausoleum Knight Armor",
  "Mausoleum Knight Gauntlets",
  "Mausoleum Knight Greaves",
  "Mausoleum Surcoat",
  "Melted Mushroom",
  "Messmer Soldier Armor",
  "Messmer Soldier Gauntlets",
  "Messmer Soldier Greaves",
  "Messmer Soldier Helm",
  "Messmer Soldier Shield",
  "Messmer Soldier's Axe",
  "Messmer Soldier's Spear",
  "Miquella's Lily",
  "Miranda Powder",
  "Misbegotten Shortbow",
  "Monk's Flameblade",
  "Monk's Flamemace",
  "Mushroom",
  "Nascent Butterfly",
  "Nectarblood Burgeon",
  "Night Maiden Armor",
  "Night Maiden Twin Crown",
  "Noble's Estoc",
  "Noble's Slender Sword",
  "Nox Bracelets",
  "Nox Greaves",
  "Nox Monk Armor",
  "Nox Monk Hood",
  "Nox Swordstress Armor",
  "Nox Swordstress Crown",
  "Octopus Head",
  "Old Aristocrat Cowl",
  "Old Aristocrat Gown",
  "Old Aristocrat Shoes",
  "Old Fang",
  "Omen Bairn",
  "Omen Cleaver",
  "Omenkiller Boots",
  "Omenkiller Long Gloves",
  "Omenkiller Robe",
  "Omensmirk Mask",
  "Page Garb",
  "Page Hood",
  "Page Trousers",
  "Partisan",
  "Pearlescent Scale",
  "Perfumer Gloves",
  "Perfumer Hood",
  "Perfumer Robe",
  "Perfumer Sarong",
  "Perfumer's Bolt",
  "Perfumer's Shield",
  "Pest's Glaive",
  "Pickaxe",
  "Poisonbloom",
  "Poisoned Stone",
  "Poisoned Stone Clump",
  "Prelate's Inferno Crozier",
  "Prince of Death's Cyst",
  "Pumpkin Helm",
  "Rada Fruit",
  "Radahn Soldier Gauntlets",
  "Radahn Soldier Greaves",
  "Radahn Soldier Helm",
  "Rainbow Stone",
  "Rauh Burrow",
  "Raw Meat Dumpling",
  "Raya Lucarian Gauntlets",
  "Raya Lucarian Greaves",
  "Raya Lucarian Helm",
  "Raya Lucarian Robe",
  "Red Branch Shortbow",
  "Redflesh Mushroom",
  "Redmane Greatshield",
  "Redmane Knight Armor",
  "Redmane Knight Gauntlets",
  "Redmane Knight Greaves",
  "Redmane Knight Helm",
  "Redmane Surcoat",
  "Revered Spirit Ash",
  "Rickety Shield",
  "Rimed Crystal Bud",
  "Ripple Crescent Halberd",
  "Rotten Battle Hammer",
  "Rotten Crystal Spear",
  "Rotten Crystal Staff",
  "Rotten Duelist Greaves",
  "Rotten Duelist Helm",
  "Rotten Greataxe",
  "Rotten Staff",
  "Rowa Fruit",
  "Rowa Raisin",
  "Ruin Fragment",
  "Rune Arc",
  "Sacramental Bud",
  "Sacred Bloody Flesh",
  "Sacred Crown Helm",
  "Sacrificial Twig",
  "Sanctuary Stone",
  "Scadutree Fragment",
  "Scarlet Bud",
  "Scarlet Tabard",
  "Scimitar",
  "Scorpion Liver",
  "Scripture Wooden Shield",
  "Serpent Arrow",
  "Shadow Militiaman Armor",
  "Shadow Militiaman Gauntlets",
  "Shadow Militiaman Greaves",
  "Shadow Militiaman Helm",
  "Shaman Furs",
  "Shaman Leggings",
  "Shining Horned Headband",
  "Short Spear",
  "Short Sword",
  "Shortbow",
  "Silver Firefly",
  "Silver Horn Tender",
  "Silver Tear Husk",
  "Sliver of Meat",
  "Slumbering Egg",
  "Smithing Stone [1]",
  "Smithing Stone [2]",
  "Smithing Stone [3]",
  "Smithing Stone [4]",
  "Smithing Stone [5]",
  "Smithing Stone [6]",
  "Smithing Stone [7]",
  "Smithing Stone [8]",
  "Smoldering Butterfly",
  "Soldier's Crossbow",
  "Somber Smithing Stone [1]",
  "Somber Smithing Stone [2]",
  "Somber Smithing Stone [3]",
  "Somber Smithing Stone [4]",
  "Somber Smithing Stone [5]",
  "Somber Smithing Stone [6]",
  "Somber Smithing Stone [7]",
  "Somber Smithing Stone [8]",
  "Somber Smithing Stone [9]",
  "Sorcerer Leggings",
  "Sorcerer Manchettes",
  "Spear",
  "Spiked Club",
  "Spiked Spear",
  "Spirit Calculus",
  "Spiritflame Arrow",
  "Spiritgrave Stone",
  "St. Trina's Arrow",
  "Staff of the Guilty",
  "Stone Club",
  "Stormhawk Feather",
  "String",
  "Strip of White Flesh",
  "Sun Realm Shield",
  "Surging Frenzied Flame",
  "Sweet Raisin",
  "Tarnished Golden Sunflower",
  "Thin Beast Bones",
  "Thorned Whip",
  "Torchpole",
  "Toxic Mushroom",
  "Tree-and-Beast Surcoat",
  "Trina's Lily",
  "Troll Knight's Sword",
  "Turtle Neck Meat",
  "Volcanic Stone",
  "Vulgar Militia Armor",
  "Vulgar Militia Gauntlets",
  "Vulgar Militia Greaves",
  "Vulgar Militia Helm",
  "Vulgar Militia Saw",
  "Vulgar Militia Shotel",
  "Warhawk's Talon",
  "Warped Axe",
  "Warpick",
  "Watchdog's Greatsword",
  "Weathered Straight Sword",
  "Whiteflesh Mushroom",
  "Winter-Lantern Fly",
  "Yellow Ember",
  "[Sorcery] Briars of Sin",
  "[Sorcery] Gravity Well",
];
