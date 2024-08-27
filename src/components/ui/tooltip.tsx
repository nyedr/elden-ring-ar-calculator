import { cn } from "@/lib/utils";
import { Icons } from "../icons";

export default function Tooltip({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className="relative group font-normal">
      <Icons.circleHelp className="ml-2 h-4 w-4 text-primary" />
      <div className="absolute z-10 bottom-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%] translate-y-[150%] hidden group-hover:block w-auto">
        <div
          className={cn(
            "bottom-full right-0 rounded bg-secondary w-64 px-3 py-2 text-primary text-sm",
            className
          )}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
