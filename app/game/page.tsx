"use client";

import { Field, PulledNumber, Tile } from "@/components/game";
import { CurrentNumber } from "@/components/game/current-number";
import { Overlay } from "@/components/game/overlay";
import { Button } from "@/components/ui/button";
import { LOCALSTORAGE_NAME, save_to_storage } from "@/lib/storage";
import { showConfetti } from "@/lib/utils";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import useSound from "use-sound";
import { toast } from "sonner";
import LetterPullup from "@/components/ui/letter-pullup";

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
  const [currentNumber, setCurrentNumber] = useState(0);
  const [winners, setWinners] = useState<string[]>([]);
  const [newNumberOverlayTimeout, setnewNumberOverlayTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [winnerNameInputValue, setwinnerNameInputValue] = useState("");
  const [showNumberOverlay, setShowNumberOverlay] = useState(false);
  const [showWinnersDialog, setShowWinnersDialog] = useState(false);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const handleWinnerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setwinnerNameInputValue(event?.target?.value);
  };

  const handleAddWinner = () => {
    if (!winnerNameInputValue) {
      toast.error("Bitte gib den Namen des Siegers an.");
      return;
    }
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

        return save_to_storage(newPulledNumbers, winners);
      }
    }
  }

  function showNewNumber(): void {
    if (newNumberOverlayTimeout) {
      clearTimeout(newNumberOverlayTimeout);
    }
    setShowNumberOverlay(true);

    setnewNumberOverlayTimeout(
      setTimeout(() => {
        setShowNumberOverlay(false);
      }, 3000)
    );
  }

  useEffect(() => {
    if (!isInitialized) return;

    save_to_storage(pulledNumbers, winners);

    if (winners.length == 3) {
      showWinnerTable();
    }

    if (winners.length > 0) {
      playWinner();
      showConfetti();
      setShowWinnerDialog(true);

      setTimeout(() => {
        setShowWinnerDialog(false);
      }, 3500);
    }
  }, [winners]);

  useEffect(() => {
    loadLocalStorage();
    setIsInitialized(true);
  }, []);

  function showWinnerTable() {
    setShowWinnersDialog(true);
  }

  function handleNewGameStart() {
    setPulledNumbers([]);
    setWinners([]);
    setShowWinnersDialog(false);
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
          <Overlay show={showNumberOverlay} number={currentNumber} />
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
            <Progress
              className="mb-1 mt-1"
              value={(pulledNumbers.length / bingoNumbers) * 100}
              max={bingoNumbers}
            />
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
          <div className="border rounded bg-white p-2">
            <div className="flex flex-col items-center justify-center pb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Bingo hinzufügen</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sieger festlegen</DialogTitle>
                    <DialogDescription>
                      Legen den {(winners?.length || 0) + 1}. Sieger fest.
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
            </div>
            {winners.length > 0 && <WinnersTable winners={winners} />}
          </div>
        </aside>
      </div>
      <Dialog open={showWinnersDialog}>
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
      <Dialog open={showWinnerDialog}>
        <DialogContent className="bg-transparent border-none shadow-none text-white">
          <p className="text-center">{winners.length}. Sieger</p>
          <LetterPullup
            className="!text-9xl text-white font-black"
            words={winners.at(-1) ?? "What the fuck"}
            delay={0.25}
          />
          {/* <h1 className="text-9xl font-black">{winners.at(-1)}</h1> */}
        </DialogContent>
      </Dialog>
    </main>
  );
}
