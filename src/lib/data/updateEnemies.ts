import fs from "fs";
import path from "path";
import {
  Enemy,
  EnemyDamageType,
  EnemyData,
  EnemyDrop,
  NewGame,
  StatusEffect,
} from "./enemy-data";
import { fetchAndParseCSV } from "../utils";

// Constants
const SPREADSHEET_ID = "1BVwmKqB8pvuyJkSTGYOM2kAJxFMQ0jVsc6aKYz_Upes";
const ITEM_DROPS_GID = "1232031815"; // GID for the Item Drops sheet
const spreadSheetGids = [
  [0, NewGame.NG],
  [1675426262, NewGame.NGPlus],
  [1351816801, NewGame.NGPlus2],
  [376990822, NewGame.NGPlus3],
  [525058908, NewGame.NGPlus4],
  [767081188, NewGame.NGPlus5],
  [473411466, NewGame.NGPlus6],
  [1181312165, NewGame.NGPlus7],
];

const parseRes = (res: string): number | "Immune" => {
  if (res === "Immune") {
    return "Immune";
  }

  if (res.includes(",")) {
    return +res.replace(",", "");
  }

  return +res;
};

// Helper function to parse drop information
const parseDropInfo = (dropInfo: string): EnemyDrop | null => {
  const dropRegex = /(.*?) - \{(\d+)\} \(([\d\.]+)%\) \[(True|False)\]/i;

  if (!dropInfo) {
    console.log(`Invalid dropInfo provided: ${dropInfo}`);
    return null;
  }

  const match = dropInfo.match(dropRegex);

  if (match) {
    return {
      drop: match[1].trim(),
      quantity: parseInt(match[2], 10),
      baseDropChance: parseFloat(match[3]),
      isAffectedByDiscovery: match[4].toLowerCase() === "true",
    };
  } else {
    console.log(`Failed to parse drop: ${dropInfo}`);
    return null;
  }
};

// Function to update enemies with item drops
export const updateEnemies = async (update: boolean = false) => {
  // Fetch item drops data
  const ITEM_DROPS_DATA_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${ITEM_DROPS_GID}`;
  const itemDropsData = await fetchAndParseCSV(ITEM_DROPS_DATA_URL);

  const dropsMap = new Map<number, EnemyDrop[]>();

  itemDropsData.forEach((dropRow) => {
    const enemyID = +dropRow.ID;
    if (!dropsMap.has(enemyID)) {
      dropsMap.set(enemyID, []);
    }

    for (let i = 1; i <= 12; i++) {
      const dropInfo =
        dropRow[`Drop ${i} - {Number} (Base Chance) [Discovery]`];
      if (dropInfo) {
        const parsedDrop = parseDropInfo(dropInfo);
        if (parsedDrop) {
          dropsMap.get(enemyID)!.push(parsedDrop);
        }
      }
    }
  });

  for (const [gid, NG] of spreadSheetGids) {
    const ELDEN_RING_ENEMIES_DATA_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
    const enemiesData = await fetchAndParseCSV(
      ELDEN_RING_ENEMIES_DATA_URL,
      true
    );

    if (!enemiesData) {
      return;
    }

    // Parsing function for enemies
    const parseEnemyFromData = (data: EnemyData): Enemy => {
      // Use the map to find drops for the current enemy
      const drops = dropsMap.get(+data.ID) || [];

      return {
        id: +data.ID,
        name: data.Name,
        location: data.Location,
        healthPoints: +data.Health.replace(",", ""),
        dlcClearHealthPoints:
          data.dlcClear !== "-" ? +data.dlcClear.replace(",", "") : null,
        defence: {
          [EnemyDamageType.Physical]: +data.Phys,
          [EnemyDamageType.Strike]: +data.Strike,
          [EnemyDamageType.Slash]: +data.Slash,
          [EnemyDamageType.Pierce]: +data.Pierce,
          [EnemyDamageType.Magic]: +data.Magic,
          [EnemyDamageType.Fire]: +data.Fire,
          [EnemyDamageType.Lightning]: +data.Ltng,
          [EnemyDamageType.Holy]: +data.Holy,
        },
        damageNegation: {
          [EnemyDamageType.Physical]: +data.Phys_1,
          [EnemyDamageType.Strike]: +data.Strike_1,
          [EnemyDamageType.Slash]: +data.Slash_1,
          [EnemyDamageType.Pierce]: +data.Pierce_1,
          [EnemyDamageType.Magic]: +data.Magic_1,
          [EnemyDamageType.Fire]: +data.Fire_1,
          [EnemyDamageType.Lightning]: +data.Ltng_1,
          [EnemyDamageType.Holy]: +data.Holy_1,
        },
        poise: {
          base: +data.Base,
          multiplier: +data["Incoming Mult"],
          effective: +data.Effective,
          regenDelay: +data["Regen Delay"],
        },
        resistances: {
          [StatusEffect.Poison]: parseRes(data.Poison),
          [StatusEffect.Scarlet_Rot]: parseRes(data["Scarlet Rot"]),
          [StatusEffect.Bleed]: parseRes(data.Bleed),
          [StatusEffect.Frost]: parseRes(data.Frost),
          [StatusEffect.Sleep]: parseRes(data.Sleep),
          [StatusEffect.Madness]: parseRes(data.Madness),
          [StatusEffect.Death_Blight]: parseRes(data.Deathblight),
        },
        drops,
      };
    };

    const enemies: Enemy[] = enemiesData
      .map(parseEnemyFromData)
      .filter((enemy) => enemy.name !== "???");

    const enemiesJson = JSON.stringify(enemies);

    if (update) {
      const outputDir = path.resolve(process.cwd(), `./public/data/enemies`);
      const filePath = path.resolve(outputDir, `enemies${NG}.json`);

      console.log(`Updating ${filePath}`);
      fs.writeFileSync(filePath, enemiesJson);
    }
  }
};

updateEnemies(true);
