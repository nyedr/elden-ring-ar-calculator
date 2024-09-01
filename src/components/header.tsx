import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between gap-5">
      <Link href="/">
        <h1 className="text-3xl sm:hidden font-bold whitespace-nowrap flex items-center gap-2">
          ER v1.13
        </h1>
        <h1 className="text-3xl hidden sm:flex font-bold whitespace-nowrap items-center gap-2">
          Elden Ring v1.13
        </h1>
      </Link>
      <Link className={buttonVariants({ variant: "link" })} href="/enemies">
        Enemies
      </Link>
      <div className="flex items-center gap-5">
        <ThemeToggle />
        <Link
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "lg",
            }),
            "rounded-full p-2 w-14 h-14"
          )}
          target="_blank"
          href="https://github.com/nyedr/elden-ring-ar-calculator"
        >
          <Icons.gitHub className="w-9 h-9" />
        </Link>
      </div>
    </header>
  );
}
