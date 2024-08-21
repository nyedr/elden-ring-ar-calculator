import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Enemy, EnemyData, EnemyDrop, NewGame } from "./enemy-data";
import { DamageType, StatusEffect } from "./weapon-data";

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

async function fetchAndParseCSV(
  api_url: string,
  withoutHeaders: boolean = false
): Promise<any[]> {
  try {
    const response = await fetch(api_url);
    const csvData = await response.text();

    const lines = csvData.split("\n");
    const dataWithoutHeaders = lines.slice(1).join("\n");

    const results = Papa.parse(withoutHeaders ? dataWithoutHeaders : csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (results.errors.length > 0) {
      console.error("Errors parsing the CSV file:", results.errors, results);
    }

    return results.data;
  } catch (error) {
    console.error("Error fetching the CSV file:", error);
    return [];
  }
}

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
          [DamageType.Physical]: +data.Phys,
          [DamageType.Strike]: +data.Strike,
          [DamageType.Slash]: +data.Slash,
          [DamageType.Pierce]: +data.Pierce,
          [DamageType.Magic]: +data.Magic,
          [DamageType.Fire]: +data.Fire,
          [DamageType.Lightning]: +data.Ltng,
          [DamageType.Holy]: +data.Holy,
        },
        damageNegation: {
          [DamageType.Physical]: +data.Phys_1,
          [DamageType.Strike]: +data.Strike_1,
          [DamageType.Slash]: +data.Slash_1,
          [DamageType.Pierce]: +data.Pierce_1,
          [DamageType.Magic]: +data.Magic_1,
          [DamageType.Fire]: +data.Fire_1,
          [DamageType.Lightning]: +data.Ltng_1,
          [DamageType.Holy]: +data.Holy_1,
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
      const outputDir = path.resolve(
        process.cwd(),
        `./src/lib/data/csv/enemies`
      );
      const filePath = path.resolve(outputDir, `enemies${NG}.json`);

      console.log(`Updating ${filePath}`);
      fs.writeFileSync(filePath, enemiesJson);
    }
  }
};

updateEnemies(true);
