import { type ClassValue, clsx } from "clsx";
import Papa from "papaparse";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCSV = <T>(csv: string) => {
  return Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  }) as Papa.ParseResult<T>;
};
