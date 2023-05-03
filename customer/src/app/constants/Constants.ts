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
