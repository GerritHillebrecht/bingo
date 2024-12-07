import { Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function WinnersTable({
  winners,
  setWinners,
}: {
  winners: string[];
  setWinners: any;
}) {
  function deleteWinner(index: number) {
    console.log("delete winner");
    setWinners((prev: string[]) => {
      const newWinners = [...prev];
      newWinners.splice(index, 1);
      return newWinners;
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sieger</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Löschen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {winners.map((winner, place) => (
          <TableRow key={place}>
            <TableCell>{place + 1}.</TableCell>
            <TableCell>{winner}</TableCell>
            <TableCell className="w-[min-content] text-end">
              <Button
                onClick={() => deleteWinner(place)}
                size="icon"
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
