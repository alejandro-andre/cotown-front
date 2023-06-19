import { INav } from "./Interface";

export class Constants {

  // Languages
  public static defaultBaseLanguageForTranslation = 'es';
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
  public static NAV_DATA:      INav = { name: 'my_data',      url: 'data' };
  public static NAV_CONTACTS:  INav = { name: 'my_contacts',  url: 'contact' };
  public static NAV_DOCUMENTS: INav = { name: 'my_documents', url: 'documents' };
  public static NAV_BOOKINGS:  INav = { name: 'my_bookings',  url: 'bookings' };
  public static NAV_INVOICES:  INav = { name: 'my_invoices',  url: 'invoices' };
  public static NAV_PDFS:      INav = { name: 'pdfs',         url: 'pdfs' };
  public static NAV_LOG_OUT:   INav = { name: 'log_out',      url: 'logout' }
  public static NAV_URLS: INav[] = [
    Constants.NAV_DATA,
    Constants.NAV_CONTACTS,
    Constants.NAV_DOCUMENTS,
    Constants.NAV_BOOKINGS,
    Constants.NAV_INVOICES,
    Constants.NAV_PDFS,
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
