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

export const getAge = (birth_date: string): number => {

  if(!birth_date) {
    return 0;
  }

  var bdt = new Date(birth_date);
  var now = new Date();
  var age = now.getFullYear() - bdt.getFullYear();

  if (bdt.getMonth() > now.getMonth() || (bdt.getMonth() == now.getMonth() && bdt.getDate() > now.getDate())) {
    age--;
  }

  return age;
}
