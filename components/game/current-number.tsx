import { cn } from "@/lib/utils";
import styles from "./current-number.module.css";
import { CSSProperties } from "react";

export function CurrentNumber({ currentNumber }: { currentNumber: number }) {
  return (
    <div className="border text-white bg-orange-600 rounded flex items-center justify-center">
      <h1
        className={cn("text-6xl font-black", styles["current-number"])}
        style={
          {
            "--num": currentNumber,
          } as CSSProperties
        }
      ></h1>
    </div>
  );
}
