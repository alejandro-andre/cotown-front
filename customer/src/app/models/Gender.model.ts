export interface GenderInterface {
  name: string,
  id: number | null
}


export class Gender {
  genders: GenderInterface[] = [];

  constructor(data: GenderInterface[] = [] as GenderInterface []) {
    this.genders = data;
  }
};
