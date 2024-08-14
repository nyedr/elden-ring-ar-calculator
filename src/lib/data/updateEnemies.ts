import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Enemy, EnemyData, NewGame } from "./enemy-data";
import { DamageType, StatusEffect } from "./weapon-data";

const SPREADSHEET_ID = "1BVwmKqB8pvuyJkSTGYOM2kAJxFMQ0jVsc6aKYz_Upes";
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

async function fetchAndParseCSV(api_url: string): Promise<EnemyData[] | null> {
  try {
    const response = await fetch(api_url);
    const csvData = await response.text();

    const lines = csvData.split("\n");
    const dataWithoutHeaders = lines.slice(1).join("\n");

    const results = Papa.parse(dataWithoutHeaders, {
      header: true,
      skipEmptyLines: true,
    }) as Papa.ParseResult<EnemyData>;

    if (results.errors.length > 0) {
      console.error("Errors parsing the CSV file:", results.errors, results);
    }

    return results.data;
  } catch (error) {
    console.error("Error fetching the CSV file:", error);
    return null;
  }
}

export const updateEnemies = async (update: boolean = false) => {
  for (const [gid, NG] of spreadSheetGids) {
    const ELDEN_RING_ENEMIES_DATA_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

    const enemiesData = await fetchAndParseCSV(ELDEN_RING_ENEMIES_DATA_URL);

    if (!enemiesData) {
      return;
    }

    const parseEnemyFromData = (data: any): Enemy => {
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
          [StatusEffect.Poison]:
            data.Poison === "Immune" ? "Immune" : +data.Poison,
          [StatusEffect.Scarlet_Rot]:
            data["Scarlet Rot"] === "Immune" ? "Immune" : +data["Scarlet Rot"],
          [StatusEffect.Bleed]:
            data.Bleed === "Immune" ? "Immune" : +data.Bleed,
          [StatusEffect.Frost]:
            data.Frost === "Immune" ? "Immune" : +data.Frost,
          [StatusEffect.Sleep]:
            data.Sleep === "Immune" ? "Immune" : +data.Sleep,
          [StatusEffect.Madness]:
            data.Madness === "Immune" ? "Immune" : +data.Madness,
          [StatusEffect.Death_Blight]:
            data.Deathblight === "Immune" ? "Immune" : +data.Deathblight,
        },
      };
    };

    const enemies: Enemy[] = enemiesData.map(parseEnemyFromData);

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
