export interface AffinityOption {
  text: string;
  icon?: string;
}

export const randomColor = () => {
  const randomHue = Math.floor(Math.random() * 360);
  return hslToHex(randomHue);
};

export const hslToHex = (h: number, s: number = 70, l: number = 36): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to Hex and pad with zeroes if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const maxRegularUpgradeLevel = 25;
export const maxSpecialUpgradeLevel = 10;

/**
 * @param regularUpgradeLevel the upgrade level of a regular weapon
 * @returns the corresponding upgrade level for a somber weapon
 */
export function toSpecialUpgradeLevel(regularUpgradeLevel: number) {
  // For in between levels with no exact equivalent, round down. I think this is what you would
  // look for in practice, e.g. if you pick +24 you probably want +9 sombers because you're not
  // spending an Ancient Dragon (Somber) Smithing Stone, although it's not necessarily the same
  // matchmaking range.
  return Math.floor(
    (regularUpgradeLevel + 0.5) *
      (maxSpecialUpgradeLevel / maxRegularUpgradeLevel)
  );
}

/**
 * @param regularUpgradeLevel the upgrade level of a somber weapon
 * @returns the corresponding upgrade level for a regular weapon
 */
export function toRegularUpgradeLevel(specialUpgradeLevel: number) {
  return Math.floor(specialUpgradeLevel * 2.5);
}
