export class Constants {
  /**
   * Colors of status of rooms
   */


  public static colors: {[key: string]: string} = {
    solicitud: '#1A5F7A',
    pendientepago: '#025CF2',
    caducada: '#F52828' ,
    confirmada: '#002B5B',
    cancelada: '#7B17F5',
    firmacontrato: '#63F202',
    contrato: '#0ED0E6',
    checkinconfirmado: '#0A4A37',
    checkin: '#159895',
    inhouse: '#FFB145',
    checkout: '#57C5B6',
    devolvergarantia: '#45FF0A',
    finalizada: '#537FE7',
    penalizacion: '#E6CF07'
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
    color: 'rgba(255, 100, 100, 0.7)',
    type:  'stripes'
  }

  public static blockedResource = {
    color: '#C0C0C0',
    type: 'stripes'
  }

  public static allStaticNumericValue = -1;
  public static availableStatus = 'available';
  public static defaultLanguage = 'es';
  public static defaultBaseLanguageForTranslation = 'en';
}
