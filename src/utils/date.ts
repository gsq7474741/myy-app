export const timestampToDateString = (
  timestamp: number,
  isMilliseconds: boolean = false
) => {
  const date = new Date(timestamp * (isMilliseconds ? 1 : 1000));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
