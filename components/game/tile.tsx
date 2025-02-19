import Ripple from "@/components/ui/ripple";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";
import style from "./tile.module.css";

export function Tile({
  number,
  active = false,
  latestPulled = false,
}: {
  number: number;
  active?: boolean;
  latestPulled?: boolean;
}) {
  return (
    <div
      className={cn(
        "animate-in zoom-in duration-500 fill-mode-both grid",
        latestPulled && "relative z-10"
      )}
      style={
        {
          animationDelay: `${number * 0.02}s`,
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "rounded-sm bg-gray-300 opacity-50 text-stone-800 flex overflow-hidden items-center justify-center transition-colors duration-500",
          active && "bg-stone-800 text-gray-300 opacity-100 z-20",
          active && number % 11 === 0 && "bg-red-500 text-gray-300",
          latestPulled &&
            cn(style["animate-last"], "outline outline-2 outline-stone-50")
        )}
      >
        <span className="relative z-10">{number}</span>
        {latestPulled && <Ripple mainCircleSize={8} mainCircleOpacity={0.5} />}
      </div>
    </div>
  );
}
