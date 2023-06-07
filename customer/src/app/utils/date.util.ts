const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

export const formatDateWithTime = (date: Date | null) : string => {

  if(date === null) {
    return '';
  }
  return `${
    padL(date.getDate())}/${
    padL(date.getMonth()+1)}/${
    date.getFullYear()} ${
    padL(date.getHours())}:${
    padL(date.getMinutes())}:${
    padL(date.getSeconds())}`;
}

export const formatDate = (date: Date | null): string => {

  if(date === null) {
    return '';
  }
  return `${
    padL(date.getDate())}/${
    padL(date.getMonth()+1)}/${
    date.getFullYear()}`;
}