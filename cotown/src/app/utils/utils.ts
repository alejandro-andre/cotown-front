export const orderByName = (array: any[]): any[] => {
  return array.slice().sort((a, b) => {
    if (a.name === b.name) {
      return a.name < b.name ? -1 : 1
    } else {
      return a.name < b.name ? -1 : 1
    }
  });
};
