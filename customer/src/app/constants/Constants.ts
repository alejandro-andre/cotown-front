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

  // GENERALS
  public static DATE = 'date';
  public static RESOURCE = 'resource';
  public static CODE = 'code';
  public static CONCEPT = 'concept'

  // Table header constants of myBookingDetail components
  public static BOOKING_DETAIL_DATE_HEADER = this.DATE;
  public static BOOKING_DETAIL_RENT_HEADER = 'rent';
  public static BOOKING_DETAIL_SERVICE_HEADER = 'service';
  public static BOOKING_DETAIL_RENT_DISCOUN_HEADER = 'rent_discount';
  public static BOOKING_DETAIL_SERVICE_DISCOUNT_HEADER = 'service_discount';

  // Table header constants of myBooking component
  public static BOOKING_RESOURCE = this.RESOURCE;
  public static BOOKING_FROM = 'from';
  public static BOOKING_TO = 'to';
  public static BOOKING_STATUS = 'status';
  public static BOOKING_FLAT = 'flat';
  public static BOOKING_PLACE = 'place';
  public static BOOKING_RESOURCE_TYPE = 'resourceType';

  // Table header constants of Invoices
  public static INVOICE_CONCEPT = this.CONCEPT;
  public static INVOICE_RESOURCE= this.RESOURCE;
  public static INVOICE_TOTAL = 'total';
  public static INVOICE_DATE = this.DATE;
  public static INVOICE_CODE = this.CODE;


  // Table header constants of Payment
  public static PAYMENT_CONCEPT = this.CONCEPT;
  public static PAYMENT_RESOURCE = this.RESOURCE;
  public static PAYMENT_CODE = this.CODE;
  public static PAYMENT_AMOUNT = 'amount';
  public static PAYMENT_PAY = 'pay';
  public static PAYMENT_DATE = this.DATE;

  // Table header constats of Contacts
  public static CONTACT_NAME = 'name';
  public static CONTACT_EMAIL = 'email';
  public static CONTACT_PHONE = 'phone';


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
