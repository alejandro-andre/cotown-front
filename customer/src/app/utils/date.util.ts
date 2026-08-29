const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

/*
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
*/ 
// new Date('YYYY-MM-DD') parsea como UTC y resta un día en husos negativos: se construye en local
export const parseLocalDate = (date: string | Date | null): Date | null => {

  if (!date) {
    return null;
  }

  if (date instanceof Date) {
    return date;
  }

  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (parts) {
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }

  return new Date(date);
}

export const getAge = (birth_date: string | null): number => {

  if(!birth_date) {
    return 18;
  }

  var bdt = parseLocalDate(birth_date)!;
  var now = new Date();
  var age = now.getFullYear() - bdt.getFullYear();

  if (bdt.getMonth() > now.getMonth() || (bdt.getMonth() == now.getMonth() && bdt.getDate() > now.getDate())) {
    age--;
  }

  return age;
}
