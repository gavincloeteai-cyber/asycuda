export interface InvoiceHeader {
  invoiceNumber: string;
  invoiceDate: string;
  ucr: string;
  exporterCode: string;
  exporterName: string;
  consigneeCode: string;
  consigneeName: string;
  declarantCode: string;
  declarantName: string;
  referenceNumber: string;
  exportCountryCode: string;
  exportCountryName: string;
  destinationCountryCode: string;
  destinationCountryName: string;
  countryOfOriginName: string;
  transportIdentity: string;
  transportNationality: string;
  carrier: string;
  transportMode: string;
  borderOfficeCode: string;
  borderOfficeName: string;
  deliveryTermsCode: string;
  deliveryTermsPlace: string;
  locationOfGoods: string;
  bankCode: string;
  bankName: string;
  paymentTermsCode: string;
  paymentTermsDescription: string;
  modeOfPayment: string;
  currencyCode: string;
  currencyName: string;
  currencyRate: number;
  totalInvoiceAmount: number;
  freightCost: number;
  totalCif: number;
  grossWeight: number;
  netWeight: number;
}

export interface RawInvoiceLineItem {
  id?: string;
  lineNumber: number;
  itemCode?: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  countryOfOrigin?: string;
  netWeight?: number;
  grossWeight?: number;
}

export interface GroupedHsItem {
  id?: string;
  commodityCode: string;
  precision1: string;
  preferenceCode: string;
  extendedCustomsProcedure: string;
  nationalCustomsProcedure: string;
  numberOfPackages: number;
  kindOfPackagesCode: string;
  kindOfPackagesName: string;
  descriptionOfGoods: string;
  commercialDescription: string;
  countryOfOriginCode: string;
  itemPrice: number;
  valueItem: number;
  netWeight?: number;
  grossWeight?: number;
}

export interface BorderOfficeOption {
  code: string;
  name: string;
  description: string;
}

export const STANDARD_BORDER_OFFICES: BorderOfficeOption[] = [
  { code: 'ARIA', name: 'Ariamsvlei', description: 'Ariamsvlei (South Africa / Namibia B1 Border)' },
  { code: 'NOOR', name: 'Noordoewer', description: 'Noordoewer (South Africa / Namibia Orange River)' },
  { code: 'TKL', name: 'Transkalahari', description: 'Transkalahari (Botswana / Namibia Corridor)' },
];

export interface AsycudaDeclaration {
  header: InvoiceHeader;
  lineItems: RawInvoiceLineItem[];
  hsGroups: GroupedHsItem[];
}

export interface ValidationError {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
}
