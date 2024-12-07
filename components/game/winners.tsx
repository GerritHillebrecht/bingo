import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export function WinnersTable({ winners }: { winners: string[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Platzierung</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {winners.map((winner, place) => (
          <TableRow key={place}>
            <TableCell>{place + 1}.</TableCell>
            <TableCell>{winner}</TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
}
