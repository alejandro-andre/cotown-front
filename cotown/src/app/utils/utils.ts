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
