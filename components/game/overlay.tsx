import { cn } from "@/lib/utils";
import style from "./current-number.module.css";
import { CSSProperties } from "react";
import ShineBorder from "@/components/ui/shine-border";

interface OverlayProps {
  show?: boolean;
  number: number;
}

export function Overlay({ show = false, number = 0 }: OverlayProps) {
  return (
    <div className="absolute inset-0 p-4 z-30 grid ">
      <ShineBorder
        className={cn(
          "shadow-xl fill-mode-forwards flex-col p-2 bg-transparent w-full backdrop-blur-sm backdrop-saturate-150",
          show && "animate-in zoom-in duration-500",
          !show && "animate-out zoom-out duration-500"
        )}
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <div className="flex items-center rounded shadow w-full justify-center h-full  bg-orange-700/80">
          <p
            className={cn(
              "text-[18rem] text-neutral-50",
              style["current-number"]
            )}
            style={
              {
                "--num": number,
              } as CSSProperties
            }
          ></p>
        </div>
      </ShineBorder>
      {/* <div
        className={cn(
          "shadow-xl flex items-center justify-center fill-mode-forwards flex-col backdrop-blur-sm backdrop-saturate-150 bg-orange-600/60 rounded",
          show && "animate-in zoom-in duration-500",
          !show && "animate-out zoom-out duration-500"
        )}
      >
        <p
          className={cn(
            "text-[18rem] text-neutral-50",
            style["current-number"]
          )}
          style={
            {
              "--num": number,
            } as CSSProperties
          }
        ></p>
      </div> */}
    </div>
  );
}
