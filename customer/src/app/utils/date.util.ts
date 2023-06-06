
export const formatDateWithTime = (date: Date | null) : string => {

  if(date === null) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const min = date.getMinutes();
  const hours = date.getHours();
  const sec = date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
}

export const formatDate = (date: Date | null): string => {

  if (date !== null) {
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${year}-${month}-${day}`;
  }

  return '';
}