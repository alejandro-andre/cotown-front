export const orderByName = (array: any[]): any[] => {
  return array.slice().sort((a, b) => {
    if (a.name === b.name) {
      return a.name < b.name ? -1 : 1
    } else {
      return a.name < b.name ? -1 : 1
    }
  });
};

export const formatDate = (date: Date) : string => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${month}-${day}`;
}

export const  prevMonth = (date: Date): Date => {
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

export const getAge = (birthdate: string) => {
  const timeDiff = Math.abs(Date.now() - new Date(birthdate).getTime());
  return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
}

