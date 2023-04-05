export class Constants {
  /**
   * Colors of status of rooms
   */
  public static colors: any = {
    confirmada: '#002B5B',
    solicitud: '#1A5F7A',
    checkin: '#159895',
    checkout: '#57C5B6',
    finalizada: '#537FE7'
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
}
