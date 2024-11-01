"use client";

import { Field, PulledNumber, Tile } from "@/components/game";
import { CSSProperties, useState } from "react";
import { Button } from "@/components/ui/button";
import { CurrentNumber } from "@/components/game/current-number";
import { Overlay } from "@/components/game/overlay";

export default function GamePage() {
  const [pulledNumbers, setPulledNumbers] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);

  function pullNumber(): void {
    if (pulledNumbers.length === 90) {
      return;
    }

    while (true) {
      const number = Math.ceil(Math.random() * 90);

      if (!pulledNumbers.includes(number)) {
        setShowOverlay(true);
        setCurrentNumber(number);
        setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
        return setPulledNumbers((prev) => [...prev, number]);
      }
    }
  }

  return (
    <main className="h-screen grid">
      <div className="grid sm:p-4 gap-2 grid-cols-[3fr,1fr] overflow-hidden">
        <article className="grid relative">
          <Overlay show={showOverlay} number={currentNumber} />
          <Field>
            {Array.from({ length: 90 }, (_, i) => (
              <Tile
                key={i}
                number={i + 1}
                active={pulledNumbers.includes(i + 1)}
                latestPulled={pulledNumbers[pulledNumbers.length - 1] === i + 1}
              />
            ))}
          </Field>
        </article>
        <aside className="border rounded-sm grid grid-rows-[max-content,max-content,auto] overflow-hidden p-2">
          <div className="latest-number">
            <div className="grid grid-cols-[1fr,3fr] h-32 gap-2">
              <div className="border rounded flex flex-col items-center justify-center">
                <p className="opacity-60 text-xs">Ziehung</p>
                <h2 className="text-xl">{pulledNumbers.length}</h2>
              </div>
              <CurrentNumber
                currentNumber={pulledNumbers[pulledNumbers.length - 1]}
              />
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <Button onClick={pullNumber} className="w-full">
              Nummer ziehen
            </Button>
          </div>
          <div
            className="numbers overflow-y-auto"
            style={{ scrollbarWidth: "thin" } as CSSProperties}
          >
            <div className="grid gap-2 p-2 grid-cols-3">
              {pulledNumbers.length > 1 &&
                pulledNumbers
                  .slice(0, -1)
                  .toReversed()
                  .map((number, i) => (
                    <PulledNumber
                      key={number}
                      pulledNumber={number}
                      index={pulledNumbers.length - i - 1}
                    />
                  ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
