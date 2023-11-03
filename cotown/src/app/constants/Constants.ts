export class Constants {
  /**
   * Colors of status of rooms
   */

  public static colors: {[key: string]: string} = {
    grupobloqueado: '#ffd0ff',
    grupoconfirmado: '#ff80ff',
    pendientepago: '#ffd080',
    caducada: '#000000' ,
    confirmada: '#ffa000',
    firmacontrato: '#ffffd0',
    contrato: '#ffff00',
    checkinconfirmado: '#b0f0b0',
    checkin: '#70f070',
    inhouse: '#40c040',
    checkout: '#a0d0f0',
    devolvergarantia: '#60a0f0',
    finalizada: '#d0d0d0',
  }

  /**
   * Types of tittle
   */
  public static types: any = {
    piso: 'title_h1',
    habitacion: 'title_h2',
    plaza: 'title_h3'
  }

  public static resourceNotAvailable = {
    color: 'rgba(128, 128, 128, 0.7)',
    type:  'stripes'
  }

  public static blockedResource = {
    color: 'rgba(0, 64, 0, 0.7)',
    type: 'stripes'
  }

  public static allStaticNumericValue = -1;
  public static availableStatus = 'available';
  public static defaultLanguage = 'es';
  public static defaultBaseLanguageForTranslation = 'en';
}
