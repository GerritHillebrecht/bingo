"use client";

const LOCALSTORAGE_NAME = "BINGO_GAME";

import { Field, PulledNumber, Tile } from "@/components/game";
import { CurrentNumber } from "@/components/game/current-number";
import { Overlay } from "@/components/game/overlay";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { CSSProperties, useEffect, useState } from "react";
import useSound from "use-sound";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { WinnersTable } from "@/components/game/winners";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function GamePage() {
  const bingoNumbers = 90;

  const [playWinner] = useSound("/audio/winner_v2.wav", { volume: 1 });
  const [playNumber] = useSound("/audio/new_number_v3.wav", { volume: 1 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [pulledNumbers, setPulledNumbers] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [winners, setWinners] = useState<string[]>([]);
  const [overlayTimeout, setOverlayTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [winnerNameInputValue, setwinnerNameInputValue] = useState("");
  const [showWinnerDialog, setshowWinnerDialog] = useState(false);

  const handleWinnerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setwinnerNameInputValue(event?.target?.value);
  };

  const handleAddWinner = () => {
    if (!winnerNameInputValue) return;
    const name: string = winnerNameInputValue;
    setWinners((prev) => [...prev, name]);
    setwinnerNameInputValue("");
  };

  function pullNumber(): void {
    if (pulledNumbers.length === bingoNumbers) {
      return;
    }

    while (true) {
      const number = Math.ceil(Math.random() * bingoNumbers);

      if (!pulledNumbers.includes(number)) {
        setCurrentNumber(number);
        showNewNumber();
        const newPulledNumbers = [...pulledNumbers, number];
        setPulledNumbers((prev) => [...prev, number]);
        playNumber();

        return localStorage.setItem(
          LOCALSTORAGE_NAME,
          JSON.stringify({
            pulledNumbers: newPulledNumbers,
            winners,
          })
        );
      }
    }
  }

  function showNewNumber(): void {
    if (overlayTimeout) {
      clearTimeout(overlayTimeout);
    }
    setShowOverlay(true);

    setOverlayTimeout(
      setTimeout(() => {
        setShowOverlay(false);
      }, 3000)
    );
  }

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(
      LOCALSTORAGE_NAME,
      JSON.stringify({
        pulledNumbers,
        winners,
      })
    );

    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    if (winners.length == 3) {
      showWinnerTable();
    }

    if (winners.length > 0) {
      playWinner();
      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    }
  }, [winners]);

  useEffect(() => {
    loadLocalStorage();
    setIsInitialized(true);
  }, []);

  function showWinnerTable() {
    setshowWinnerDialog(true);
  }

  function handleNewGameStart() {
    setPulledNumbers([]);
    setWinners([]);
    setshowWinnerDialog(false);
  }

  function loadLocalStorage() {
    const localData = localStorage.getItem(LOCALSTORAGE_NAME);

    if (localData) {
      const data = JSON.parse(localData);
      setPulledNumbers(data.pulledNumbers);
      setWinners(data.winners);
    }
  }

  return (
    <main className="h-screen grid">
      <div className="grid sm:p-3 gap-3 grid-cols-[3fr,1fr] overflow-hidden">
        <article className="grid relative">
          <Overlay show={showOverlay} number={currentNumber} />
          <Field>
            {Array.from({ length: bingoNumbers }, (_, i) => (
              <Tile
                key={i}
                number={i + 1}
                active={pulledNumbers.includes(i + 1)}
                latestPulled={pulledNumbers[pulledNumbers.length - 1] === i + 1}
              />
            ))}
          </Field>
        </article>
        <aside className="border rounded-sm grid grid-rows-[max-content,max-content,auto,max-content] overflow-hidden p-2">
          <div className="latest-number">
            <div className="grid grid-cols-[1fr,3fr] h-32 gap-2">
              <div className="border rounded flex flex-col items-center justify-center">
                <p className="opacity-60 text-xs">Ziehung Nr.</p>
                <h2 className="text-xl">{pulledNumbers.length}</h2>
              </div>
              <CurrentNumber
                currentNumber={pulledNumbers[pulledNumbers.length - 1]}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <Progress className="mb-1 mt-1" value={pulledNumbers.length / bingoNumbers * 100} max={bingoNumbers} />
            <Button onClick={pullNumber} className="w-full h-16 text-xl">
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
          <div className="flex flex-col items-center justify-center pb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Bingo hinzufügen</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sieger festlegen</DialogTitle>
                  <DialogDescription>
                    Legen den {winners?.length || 0 + 1}. Sieger fest.
                  </DialogDescription>
                </DialogHeader>

                <Input
                  id="name"
                  onChange={handleWinnerNameChange}
                  value={winnerNameInputValue}
                  className="col-span-7"
                  placeholder="Name des Siegers"
                />

                <DialogFooter className="!justify-start">
                  <DialogClose asChild>
                    <Button
                      onClick={handleAddWinner}
                      type="submit"
                      className="text-left"
                    >
                      {(winners?.length || 0) + 1}. Sieger festlegen
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {winners.length > 0 && <WinnersTable winners={winners} />}
          </div>
        </aside>
      </div>
      <Dialog open={showWinnerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rundensieger</DialogTitle>
            <DialogDescription>Die Sieger dieser Runde sind:</DialogDescription>
          </DialogHeader>

          <WinnersTable winners={winners} />

          <DialogFooter className="!justify-start">
            <DialogClose asChild>
              <Button
                onClick={handleNewGameStart}
                type="submit"
                className="text-left"
              >
                Neues Spiel Starten
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
