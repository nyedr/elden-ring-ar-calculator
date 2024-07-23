import Papa from "papaparse";
import { attackElementCorrectParamCSV } from "@/lib/data/csv/AttackElementCorrectParam";

export default function Home() {
  const data = Papa.parse(attackElementCorrectParamCSV, {
    header: true,
    skipEmptyLines: true,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <pre className="bg-secondary p-5 rounded-lg w-full">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </main>
  );
}
