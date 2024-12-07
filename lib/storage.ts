export const LOCALSTORAGE_NAME = "BINGO_GAME";

export function save_to_storage(pulledNumbers: number[], winners: string[]) {
  localStorage.setItem(
    LOCALSTORAGE_NAME,
    JSON.stringify({
      pulledNumbers,
      winners,
    })
  );
}
