import { Nav } from "./Interface";

export class Constants {

  // Languages
  public static defaultBaseLanguageForTranslation = 'en';
  public static SPANISH =     {
    id: 'es',
    locale: 'es-ES',
    date: 'dd/MM/yyyy',
    name: 'Español',
  };
  public static ENGLISH = {
    id: 'en',
    locale: 'en-US',
    date: 'MM/dd/yyyy',
    name: 'English'
  }
  public static LANGUAGES = [
    this.SPANISH,
    this.ENGLISH
  ];

  // Navigation
  public static NAV_DATA:      Nav = { name: 'myData',      url: 'data' };
  public static NAV_CONTACTS:  Nav = { name: 'myContacts',  url: 'contact' };
  public static NAV_DOCUMENTS: Nav = { name: 'myDocuments', url: 'documents' };
  public static NAV_BOOKINGS:  Nav = { name: 'myBookings',  url: 'bookings' };
  public static NAV_INVOICES:  Nav = { name: 'myInvoices',  url: 'invoices' };
  public static NAV_LOG_OUT:   Nav = { name: 'logOut',      url: 'logout' }
  public static NAV_URLS: Nav[] = [
    Constants.NAV_DATA,
    Constants.NAV_CONTACTS,
    Constants.NAV_DOCUMENTS,
    Constants.NAV_BOOKINGS,
    Constants.NAV_INVOICES,
    Constants.NAV_LOG_OUT
  ];

  // PDF Mimetype
  public static DOCUMENT_PDF = 'application/pdf';

  // Document fields
  public static DOCUMENT_TYPE_FRONT   = 'Document';
  public static DOCUMENT_TYPE_BACK    = 'Document_back';
  public static CONTRACT_SERVICES_PDF = 'Contract_services';
  public static CONTRACT_RENT_PDF     = 'Contract_rent';
};
