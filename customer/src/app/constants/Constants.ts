import { Nav } from "./Interface";

export class Constants {
  public static DATA: Nav = {
    name: 'My data',
    url: 'data'
  };

  public static CONTACTS: Nav = {
    name: 'My Contacts',
    url: 'contact'
  };

  public static DOCUMENTS: Nav = {
    name: 'My documents',
    url: 'documents'
  };

  public static BOOKINGS: Nav = {
    name: 'My Bookings',
    url: 'bookings'
  };

  public static INVOICES: Nav = {
    name: 'My invoice',
    url: 'invoices'
  };

  public static BOOKING_DATE_HEADER = 'date';
  public static BOOKING_RENT_HEADER = 'rent';
  public static BOOKING_SERVICE_HEADER = 'service';
  public static BOOKING_RENT_DISCOUN_HEADER = 'rent_discount';
  public static BOOKING_SERVICE_DISCOUNT_HEADER = 'service_discount';

  /**
   * Urls of nav
   */

  public static NAV_URLS: Nav[] = [
    Constants.DATA,
    Constants.CONTACTS,
    Constants.DOCUMENTS,
    Constants.BOOKINGS,
    Constants.INVOICES,
  ];
};
