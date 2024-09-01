import type { ReactNode } from "react";
import { AffinityOption, affinityOptions } from "../uiUtils";
import Link from "next/link";

export type RegulationVersionName = "latest" | "reforged" | "convergence";

export interface RegulationVersion {
  name: string;

  info?: ReactNode;

  affinityOptions: Map<number, AffinityOption>;

  /**
   * Hack: in Elden Ring Reforged there is no attack power bonus for two handing
   */
  disableTwoHandingAttackPowerBonus?: boolean;

  /**
   * The Convergence mod makes all weapons only go up to +10
   */
  maxUpgradeLevel?: number;

  /**
   * The Convergence mod has separate spell scaling for each damage type
   */
  splitSpellScaling?: boolean;

  /**
   * Elden Ring Reforged changes the penalty for not having the required attributes for a weapon
   */
  ineffectiveAttributePenalty?: number;

  fetch(): Promise<Response>;
}

const regulationVersions: Record<RegulationVersionName, RegulationVersion> = {
  latest: {
    name: "Patch 1.13 (latest)",
    info: (
      <>
        <h1>
          <Link
            href="https://en.bandainamcoent.eu/elden-ring/elden-ring/shadow-of-the-erdtree"
            target="_blank"
            rel="noopener noreferer"
          >
            ELDEN RING Shadow of the Erdtree
          </Link>{" "}
          has been released!
        </h1>
        Please report any bugs or missing data{" "}
        <Link
          href="https://github.com/ThomasJClark/elden-ring-weapon-calculator/issues/new"
          target="_blank"
        >
          here
        </Link>
        . Uncheck the &ldquo;Include DLC weapons&rdquo; checkbox if you wish to
        avoid seeing items from the new expansion.
      </>
    ),
    affinityOptions,
    fetch: () => fetch(`/regulation-vanilla-v1.13.js?${8}`),
  },
  reforged: {
    name: "ELDEN RING Reforged (mod)",
    info: (
      <>
        Using regulation data from the{" "}
        <Link
          href="https://www.nexusmods.com/eldenring/mods/541"
          target="_blank"
          rel="noopener noreferer"
        >
          ELDEN RING Reforged
        </Link>{" "}
        mod v0.13.48
      </>
    ),
    affinityOptions,
    disableTwoHandingAttackPowerBonus: true,
    ineffectiveAttributePenalty: 0.5,
    fetch: () => fetch(`/regulation-reforged-v0.13.48.js?${8}`),
  },
  convergence: {
    name: "The Convergence (mod)",
    info: (
      <>
        Using regulation data from{" "}
        <Link
          href="https://www.nexusmods.com/eldenring/mods/3419"
          target="_blank"
          rel="noopener noreferer"
        >
          The Convergence Mod
        </Link>{" "}
        v2.0.2 Test Build
      </>
    ),
    affinityOptions,
    maxUpgradeLevel: 15,
    splitSpellScaling: true,
    fetch: () => fetch(`/regulation-convergence-v2.0.2.test-build.js?${8}`),
  },
};

export default regulationVersions;
