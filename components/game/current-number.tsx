import { cn } from "@/lib/utils";
import styles from "./current-number.module.css";
import { CSSProperties } from "react";

export function CurrentNumber({ currentNumber }: { currentNumber: number }) {
  return (
    <div className="border text-white bg-orange-600 rounded flex flex-col items-center justify-center">
      <p className="text-xs font-bold uppercase tracking-widest">Aktuelle Ziehung</p>
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
