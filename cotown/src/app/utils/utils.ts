export const formatDate = (date: Date, format: string) : string => {
  const day = ("00" + date.getDate()).slice(-2);
  const month = ("00" + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear();
  if (format === 'DMY')
    return `${day}/${month}/${year}`;
  if (format === 'MDY')
    return `${month}/${day}/${year}`;
  return `${year}-${month}-${day}`;
}

export const prevMonth = (date: Date): Date => {
  date.setTime(date.getTime() + (1000*60*60*24*6));
  let month = date.getMonth() - 1;
  let year = date.getFullYear();
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  return new Date(year, month, 1);
}

export const nextMonth = (date: Date): Date => {
  date.setTime(date.getTime() + (1000*60*60*24*6))
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month > 11) {
    month = 0;
    year += 1;
  }
  return new Date(year, month, 1);
}

export const getAge = (birth_date: string) => {
  if(!birth_date) {
    return '';
  }
  var bdt = new Date(birth_date);
  var now = new Date();
  var age = now.getFullYear() - bdt.getFullYear();
  if (bdt.getMonth() > now.getMonth() || (bdt.getMonth() == now.getMonth() && bdt.getDate() > now.getDate())) {
    age--;
  }
  return age;
}

