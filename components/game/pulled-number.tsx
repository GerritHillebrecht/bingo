export function PulledNumber({
  pulledNumber,
  index,
}: {
  pulledNumber: number;
  index: number;
}) {
  return (
    <div className="p-2 border rounded-sm shadow flex items-center relative animate-in zoom-in hover:bg-neutral-100">
      <div className="h-4 w-4 left-0 top-0 -translate-x-[40%] -translate-y-[40%] absolute text-white leading-none aspect-square text-[0.5rem] rounded-full bg-neutral-600 flex items-center justify-center">
        {index}
      </div>
      <p className="text-center w-full text-lg font-[500]">{pulledNumber}</p>
    </div>
  );
}
