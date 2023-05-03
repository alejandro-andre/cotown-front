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

  // Table header constants of myBookingDetail components
  public static BOOKING_DETAIL_DATE_HEADER = 'date';
  public static BOOKING_DETAIL_RENT_HEADER = 'rent';
  public static BOOKING_DETAIL_SERVICE_HEADER = 'service';
  public static BOOKING_DETAIL_RENT_DISCOUN_HEADER = 'rent_discount';
  public static BOOKING_DETAIL_SERVICE_DISCOUNT_HEADER = 'service_discount';

  // Table header constants of myBooking component
  public static BOOKING_RESOURCE = 'resource';
  public static BOOKING_FROM = 'from';
  public static BOOKING_TO = 'to';
  public static BOOKING_STATUS = 'status';
  public static BOOKING_FLAT = 'flat';
  public static BOOKING_PLACE = 'place';
  public static BOOKING_RESOURCE_TYPE = 'resourceType';

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
