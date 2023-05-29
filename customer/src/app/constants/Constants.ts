import { Nav } from "./Interface";

export class Constants {
  //APP SETTINGS
  public static defaultBaseLanguageForTranslation = 'en';

  public static SPANISH =     {
    id: 'es',
    name: 'Español',
  };

  public static ENGISH = {
    id: 'en',
    name: 'English'
  }

  public static ARRAY_OF_LANGUAGES = [
    this.SPANISH,
    this.ENGISH
  ];

  public static IMAGE_PNG = 'image/png';
  public static IMAGE_JPG = 'image/jpg';
  public static DOCUMENT_PDF = 'application/pdf';


  // REST OF VARIABLES
  public static DATA: Nav = {
    name: 'myData',
    url: 'data'
  };

  public static TUTOR: Nav = {
    name: 'myTutor',
    url: 'tutor'
  };

  public static CONTACTS: Nav = {
    name: 'myContacts',
    url: 'contact'
  };

  public static DOCUMENTS: Nav = {
    name: 'myDocuments',
    url: 'documents'
  };

  public static BOOKINGS: Nav = {
    name: 'myBookings',
    url: 'bookings'
  };

  public static INVOICES: Nav = {
    name: 'myInvoices',
    url: 'invoices'
  };

  public static LOG_OUT: Nav = {
    name: 'logOut',
    url: 'logout'
  }

  public static DOCUMENT_TYPE_FRONT = 'Document';
  public static DOCUMENT_TYPE_BACK = 'Document_back';
  public static CONTRACT_SERVICES_PDF = 'Contract_services';
  public static CONTRACT_RENT_PDF = 'Contract_rent';

  // GENERALS
  public static DATE = 'date';
  public static RESOURCE = 'resource';
  public static CODE = 'code';
  public static CONCEPT = 'concept'
  public static PHONE = 'phone';
  public static EMAIL ='email';
  public static NAME ='name';
  public static TOTAL ='total';
  public static AMOUNT ='amount';
  public static PAY ='pay';
  public static DELETE = 'delete';
  public static MONTH = 'month';
  public static RENT = 'rent'
  public static SERVICES = 'services';
  public static RENT_SUPPLEMENT = 'rentSupplement';
  public static SERVICE_SUPPLEMENT = 'serviceSupplement';
  public static DATE_FROM = 'dateFrom';
  public static DATE_TO = 'dateTo';
  public static STATUS = 'status';
  public static FLAT_TYPE = 'flatType';
  public static PLACE_TYPE = 'placeType';
  public static RESOURCE_TYPE = 'resourceType';
  public static INVOICE_NUMBER = 'invoiceNumber';
  public static ISSUE_DATE = 'issueDate';
  public static BOOKING = 'booking';
  public static PAYMENT_NUMBER = 'paymentNumber';

  // Table header constants of myBookingDetail components
  public static BOOKING_DETAIL_DATE_HEADER = this.DATE;
  public static BOOKING_DETAIL_RENT_HEADER = this.RENT;
  public static BOOKING_DETAIL_SERVICE_HEADER = 'service';
  public static BOOKING_DETAIL_RENT_DISCOUN_HEADER = 'rent_discount';
  public static BOOKING_DETAIL_SERVICE_DISCOUNT_HEADER = 'service_discount';

  // Table header constants of myBooking component
  public static BOOKING_RESOURCE = this.RESOURCE;
  public static BOOKING_FROM = 'from';
  public static BOOKING_TO = 'to';
  public static BOOKING_STATUS = this.STATUS;
  public static BOOKING_FLAT = 'flat';
  public static BOOKING_PLACE = 'place';
  public static BOOKING_RESOURCE_TYPE = this.RESOURCE_TYPE;

  // Table header constants of Invoices
  public static INVOICE_CONCEPT = this.CONCEPT;
  public static INVOICE_RESOURCE = this.RESOURCE;
  public static INVOICE_TOTAL = this.TOTAL;
  public static INVOICE_DATE = this.DATE;
  public static INVOICE_CODE = this.CODE;

  // Table header constants of Payment
  public static PAYMENT_CONCEPT = this.CONCEPT;
  public static PAYMENT_RESOURCE = this.RESOURCE;
  public static PAYMENT_CODE = this.CODE;
  public static PAYMENT_AMOUNT = this.AMOUNT;
  public static PAYMENT_PAY = this.PAY;
  public static PAYMENT_DATE = this.DATE;

  // Table header constats of Contacts
  public static CONTACT_NAME = this.NAME;
  public static CONTACT_EMAIL = this.EMAIL;
  public static CONTACT_PHONE = this.PHONE;

  // Properties
  public static PROPERTY_RENT_DATE = 'rent_date';
  public static PROPERTY_RENT = this.RENT;
  public static PROPERTY_SERVICES = this.SERVICES;
  public static PROPERTY_RENT_DISCOUNT = 'rent_discount';
  public static PROPERTY_SERVICES_DISCOUNT = 'service_discount';
  public static PROPERTY_RESOURCE = this.RESOURCE;
  public static PROPERTY_START = 'start';
  public static PROPERTY_END = 'end';
  public static PROPERTY_STATUS = this.STATUS;
  public static PROPERTY_FLAT = 'flat';
  public static PROPERTY_PLACE = 'place';
  public static PROPERTY_RESOURCE_TYPE = 'resource_type';
  public static PROPERTY_NAME = this.NAME;
  public static PROPERTY_EMAIL = this.EMAIL;
  public static PROPERTY_PHONE = this.PHONE;
  public static PROPERTY_CODE = this.CODE;
  public static PROPERTY_ISSUE_DATE = 'issue_date';
  public static PROPERTY_CONCEPT = this.CONCEPT;
  public static PROPERTY_BOOKING = 'booking';
  public static PROPERTY_PAY = 'pay';
  public static PROPERTY_ID = 'id';
  public static PROPERTY_AMOUNT = this.AMOUNT;
  public static PROPERTY_TOTAL = this.TOTAL;

  /**
   * Urls of nav
   */

  public static NAV_URLS: Nav[] = [
    Constants.DATA,
    Constants.TUTOR,
    Constants.CONTACTS,
    Constants.DOCUMENTS,
    Constants.BOOKINGS,
    Constants.INVOICES,
    Constants.LOG_OUT
  ];
};
