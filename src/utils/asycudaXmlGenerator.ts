import { AsycudaDeclaration, ValidationError } from '../types/asycuda';

export interface CountryDetection {
  code: string;
  name: string;
}

export function inferCountryFromAddress(address: string | undefined | null): CountryDetection {
  if (!address) return { code: 'ZA', name: 'South Africa' };
  const text = address.toUpperCase();
  if (
    text.includes('SOUTH AFRICA') ||
    text.includes('RSA') ||
    text.includes('7646') ||
    text.includes('6570') ||
    text.includes('PAARL') ||
    text.includes('KNYSNA') ||
    text.includes('GAUTENG') ||
    text.includes('WESTERN CAPE') ||
    text.includes('JOHANNESBURG') ||
    text.includes('CAPE TOWN') ||
    text.includes('DURBAN') ||
    text.includes('PRETORIA') ||
    text.includes('VANDERBIJLPARK') ||
    text.includes('CENTURION') ||
    text.includes('SANDTON') ||
    text.includes('PORT ELIZABETH') ||
    text.includes('BLOEMFONTEIN')
  ) {
    return { code: 'ZA', name: 'South Africa' };
  }
  if (
    text.includes('NAMIBIA') ||
    text.includes('WINDHOEK') ||
    text.includes('WALVIS') ||
    text.includes('SWAKOPMUND') ||
    text.includes('NOORDOEWER') ||
    text.includes('ARIAMSVLEI') ||
    text.includes('AUSSENKHER') ||
    text.includes('AUSSPANNPLATZ')
  ) {
    return { code: 'NA', name: 'Namibia' };
  }
  if (text.includes('BOTSWANA') || text.includes('GABORONE')) {
    return { code: 'BW', name: 'Botswana' };
  }
  if (text.includes('GERMANY') || text.includes('DEUTSCHLAND')) {
    return { code: 'DE', name: 'Germany' };
  }
  if (text.includes('UNITED STATES') || text.includes('USA')) {
    return { code: 'US', name: 'United States' };
  }
  if (text.includes('CHINA')) {
    return { code: 'CN', name: 'China' };
  }
  if (text.includes('ZIMBABWE') || text.includes('HARARE')) {
    return { code: 'ZW', name: 'Zimbabwe' };
  }
  if (text.includes('ZAMBIA') || text.includes('LUSAKA')) {
    return { code: 'ZM', name: 'Zambia' };
  }
  return { code: 'ZA', name: 'South Africa' };
}

export function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateAsycudaXml(declaration: AsycudaDeclaration): string {
  const h = declaration.header;
  const hsGroups = declaration.hsGroups;

  // Inferred country of export & origin from address if not set
  const detectedExport = inferCountryFromAddress(h.exporterName);
  const exportCountryCode = (h.exportCountryCode || detectedExport.code).trim().toUpperCase();
  const exportCountryName = h.exportCountryName || detectedExport.name;
  const destinationCountryCode = (h.destinationCountryCode || 'NA').trim().toUpperCase();
  const destinationCountryName = h.destinationCountryName || 'Namibia';
  const countryOfOriginName = h.countryOfOriginName || exportCountryName || 'South Africa';

  // Rule 2 & 3: Smart Net & Gross mass calculation
  // Net Mass (Block 38): If header net is missing/0, calculate sum from lines
  let netMass = h.netWeight || 0;
  if (!netMass && declaration.lineItems?.length > 0) {
    netMass = declaration.lineItems.reduce((acc, l) => acc + (l.netWeight || ((l.quantity || 1) * 1)), 0);
  }
  // Gross Mass (Block 35): If missing/0, apply fallback rule -> Gross Weight = Net Weight * 1.03
  let grossMass = h.grossWeight || 0;
  if (!grossMass && netMass > 0) {
    grossMass = Math.round(netMass * 1.03 * 10) / 10;
  } else if (!grossMass && !netMass) {
    grossMass = 0;
  }

  const totalInvStr = (h.totalInvoiceAmount || 0).toFixed(2);
  const freightStr = (h.freightCost || 0).toFixed(2);
  const totalCifStr = ((h.totalInvoiceAmount || 0) + (h.freightCost || 0)).toFixed(2);
  const grossWeightStr = grossMass.toFixed(1);
  const netWeightStr = netMass.toFixed(1);
  const currencyRateStr = (h.currencyRate || 1).toString();

  const itemsXml = hsGroups
    .map((item, idx) => {
      const itemPriceStr = (item.itemPrice || 0).toFixed(2);
      const valueItemStr = (item.valueItem || 0).toFixed(2);
      const commCode = (item.commodityCode || '').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
      const pkgCode = item.kindOfPackagesCode || 'PC';
      const pkgName = item.kindOfPackagesName || 'PIECES';
      const originCode = item.countryOfOriginCode || exportCountryCode || 'ZA';

      return `<!-- ITEM ${idx + 1}: HS ${commCode} -->
<Item>
<Packages>
<Number_of_packages>${item.numberOfPackages || 1}</Number_of_packages>
<Kind_of_packages_code>${escapeXml(pkgCode)}</Kind_of_packages_code>
<Kind_of_packages_name>${escapeXml(pkgName)}</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>${escapeXml(h.deliveryTermsCode || 'CIF')}</Code>
<Place>${escapeXml(h.deliveryTermsPlace || 'Aussenkher Farm')}</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>${escapeXml(commCode)}</Commodity_code>
<Precision_1>${escapeXml(item.precision1 || '000')}</Precision_1>
</HScode>
<Preference_code>${escapeXml(item.preferenceCode || 'SCU')}</Preference_code>
<Extended_customs_procedure>${escapeXml(item.extendedCustomsProcedure || '4000')}</Extended_customs_procedure>
<National_customs_procedure>${escapeXml(item.nationalCustomsProcedure || '016')}</National_customs_procedure>
<Item_price>${itemPriceStr}</Item_price>
<Value_item>${valueItemStr}</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>${escapeXml(originCode)}</Country_of_origin_code>
<Description_of_goods>${escapeXml(item.descriptionOfGoods || 'Imported goods')}</Description_of_goods>
<Commercial_Description>${escapeXml(item.commercialDescription || '')}</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>${itemPriceStr}</Amount_national_currency>
<Amount_foreign_currency>${itemPriceStr}</Amount_foreign_currency>
<Currency_code>${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_rate>${currencyRateStr}</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ASYCUDA>
<Export_release>
<Date_of_exit/>
<Time_of_exit/>
<Actual_office_of_exit_code>
<null/>
</Actual_office_of_exit_code>
<Actual_office_of_exit_name>
<null/>
</Actual_office_of_exit_name>
<Exit_reference>
<null/>
</Exit_reference>
<Comments>
<null/>
</Comments>
</Export_release>
<Assessment_notice/>
<Global_taxes/>
<Property>
<Sad_flow>I</Sad_flow>
<Forms>
<Number_of_the_form>1</Number_of_the_form>
<Total_number_of_forms>1</Total_number_of_forms>
</Forms>
<Nbers>
<Number_of_loading_lists/>
<Total_number_of_items>${hsGroups.length}</Total_number_of_items>
</Nbers>
<Place_of_declaration>
<null/>
</Place_of_declaration>
<Date_of_declaration/>
<Selected_page>1</Selected_page>
</Property>
<Identification>
<Office_segment>
<Customs_clearance_office_code>${escapeXml(h.borderOfficeCode || 'ARIA')}</Customs_clearance_office_code>
<Customs_Clearance_office_name>${escapeXml(h.borderOfficeName || 'Ariamsvlei')}</Customs_Clearance_office_name>
</Office_segment>
<Type>
<Type_of_declaration>IM</Type_of_declaration>
<Declaration_gen_procedure_code>4</Declaration_gen_procedure_code>
<Type_of_transit_document>
<null/>
</Type_of_transit_document>
</Type>
<Manifest_reference_number>
<null/>
</Manifest_reference_number>
<UCR>${escapeXml(h.ucr || '6ZA' + (h.exporterCode || '25617343') + 'CINV' + (h.referenceNumber || '622967'))}</UCR>
<Registration>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</Registration>
<Assessment>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</Assessment>
<receipt>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</receipt>
</Identification>
<Traders>
<Exporter>
<Exporter_code>${escapeXml(h.exporterCode || '25617343')}</Exporter_code>
<Exporter_name>${escapeXml(h.exporterName || 'Molenaar Industrial Technologies (Pty) Ltd.')}</Exporter_name>
</Exporter>
<Consignee>
<Consignee_code>${escapeXml(h.consigneeCode || '')}</Consignee_code>
<Consignee_name>${escapeXml(h.consigneeName || '')}</Consignee_name>
</Consignee>
<Financial>
<Financial_code/>
<Financial_name/>
</Financial>
</Traders>
<Declarant>
<Declarant_code>${escapeXml(h.declarantCode || '05204044')}</Declarant_code>
<Declarant_name>${escapeXml(h.declarantName || 'Goreefers Logistics Namibia P.O.Box 20Noordoewer')}</Declarant_name>
<Reference>
<Number>${escapeXml(h.referenceNumber || '622967')}</Number>
</Reference>
</Declarant>
<General_information>
<Country>
<Country_first_destination/>
<Trading_country/>
<Export>
<Export_country_code>${escapeXml(exportCountryCode)}</Export_country_code>
<Export_country_name>${escapeXml(exportCountryName)}</Export_country_name>
<Export_country_region/>
</Export>
<Destination>
<Destination_country_code>${escapeXml(destinationCountryCode)}</Destination_country_code>
<Destination_country_name>${escapeXml(destinationCountryName)}</Destination_country_name>
<Destination_country_region/>
</Destination>
<Country_of_origin_name>${escapeXml(countryOfOriginName)}</Country_of_origin_name>
</Country>
<Value_details>${freightStr}</Value_details>
<CAP/>
<Additional_information/>
<Comments_free_text>
<null/>
</Comments_free_text>
</General_information>
<Transport>
<Means_of_transport>
<Departure_arrival_information>
<Identity>${escapeXml(h.transportIdentity || 'DBZ126NC / CNY564ND / CNY56FS')}</Identity>
<Nationality>${escapeXml(h.transportNationality || 'ZA')}</Nationality>
</Departure_arrival_information>
<Border_information>
<Identity>${escapeXml(h.carrier || 'FP DU TOIT')}</Identity>
<Nationality>${escapeXml(h.transportNationality || 'ZA')}</Nationality>
<Mode>${escapeXml(h.transportMode || '3')}</Mode>
</Border_information>
<Inland_mode_of_transport>
<null/>
</Inland_mode_of_transport>
</Means_of_transport>
<Container_flag>false</Container_flag>
<Delivery_terms>
<Code>${escapeXml(h.deliveryTermsCode || 'CIF')}</Code>
<Place>${escapeXml(h.deliveryTermsPlace || 'Aussenkher Farm')}</Place>
<Situation/>
</Delivery_terms>
<Border_office>
<Code>${escapeXml(h.borderOfficeCode || 'ARIA')}</Code>
<Name>${escapeXml(h.borderOfficeName || 'Ariamsvlei')}</Name>
</Border_office>
<Place_of_loading>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
<Country/>
</Place_of_loading>
<Location_of_goods>${escapeXml(h.locationOfGoods || 'AUSSENKHER')}</Location_of_goods>
</Transport>
<Financial>
<Financial_transaction>
<code1>
<null/>
</code1>
<code2>
<null/>
</code2>
</Financial_transaction>
<Bank>
<Code>${escapeXml(h.bankCode || '002')}</Code>
<Name>${escapeXml(h.bankName || 'Bank Windhoek LTD')}</Name>
<Branch>
<null/>
</Branch>
<Reference>
<null/>
</Reference>
</Bank>
<Terms>
<Code>${escapeXml(h.paymentTermsCode || '30')}</Code>
<Description>${escapeXml(h.paymentTermsDescription || '30 Days')}</Description>
</Terms>
<Total_invoice>${totalInvStr}</Total_invoice>
<Deffered_payment_reference>
<null/>
</Deffered_payment_reference>
<Mode_of_payment>${escapeXml(h.modeOfPayment || 'CASH')}</Mode_of_payment>
<Amounts>
<Total_manual_taxes/>
<Global_taxes/>
<Totals_taxes/>
</Amounts>
<Guarantee>
<Name>
<null/>
</Name>
<Amount/>
<Date/>
<Excluded_country>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
</Excluded_country>
</Guarantee>
</Financial>
<Warehouse>
<Identification/>
<Delay/>
</Warehouse>
<Transit>
<Principal>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
<Representative>
<null/>
</Representative>
</Principal>
<Signature>
<Place>
<null/>
</Place>
<Date/>
</Signature>
<Destination>
<Office>
<null/>
</Office>
</Destination>
<Seals>
<Number/>
<Identity>
<null/>
</Identity>
</Seals>
<Result_of_control/>
<Time_limit/>
<Officer_name>
<null/>
</Officer_name>
</Transit>
<Valuation>
<Calculation_working_mode/>
<Weight>
<Gross_weight>${grossWeightStr}</Gross_weight>
</Weight>
<Total_cost>${freightStr}</Total_cost>
<Total_CIF>${totalCifStr}</Total_CIF>
<Gs_Invoice>
<Amount_national_currency>${totalInvStr}</Amount_national_currency>
<Amount_foreign_currency>${totalInvStr}</Amount_foreign_currency>
<Currency_code>${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>${escapeXml(h.currencyName || 'South African Rand')}</Currency_name>
<Currency_rate>${currencyRateStr}</Currency_rate>
</Gs_Invoice>
<Gs_external_freight>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>
<null/>
</Currency_name>
<Currency_rate>${currencyRateStr}</Currency_rate>
</Gs_external_freight>
<Gs_internal_freight>
<Amount_national_currency>${freightStr}</Amount_national_currency>
<Amount_foreign_currency>${freightStr}</Amount_foreign_currency>
<Currency_code>${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>${escapeXml(h.currencyName || 'South African Rand')}</Currency_name>
<Currency_rate>${currencyRateStr}</Currency_rate>
</Gs_internal_freight>
<Gs_insurance>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_insurance>
<Gs_other_cost>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_other_cost>
<Gs_deduction>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_deduction>
<Total>
<Total_invoice>${totalInvStr}</Total_invoice>
<Total_weight>${netWeightStr}</Total_weight>
</Total>
</Valuation>

${itemsXml}

</ASYCUDA>`;
}

export function validateAsycudaDeclaration(decl: AsycudaDeclaration): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!decl.header.invoiceNumber) {
    errors.push({ type: 'warning', field: 'invoiceNumber', message: 'Invoice number is empty' });
  }

  if (!decl.header.exporterName) {
    errors.push({ type: 'error', field: 'exporterName', message: 'Exporter name & address is required' });
  }

  if (!decl.header.consigneeCode) {
    errors.push({ type: 'info', field: 'consigneeCode', message: 'Consignee VAT / Importer Code is empty (optional if not registered).' });
  }

  if (!decl.hsGroups || decl.hsGroups.length === 0) {
    errors.push({ type: 'error', field: 'hsGroups', message: 'No HS Code item groups found. At least 1 item is required.' });
  } else {
    // Check HS codes
    decl.hsGroups.forEach((g, idx) => {
      const cleaned = (g.commodityCode || '').replace(/\D/g, '');
      if (cleaned.length < 6) {
        errors.push({
          type: 'error',
          field: `hsGroups[${idx}].commodityCode`,
          message: `Item #${idx + 1} HS Code "${g.commodityCode}" is less than 6 digits (should be 8 digits for ASYCUDA).`,
        });
      }
      if (!g.itemPrice || g.itemPrice <= 0) {
        errors.push({
          type: 'warning',
          field: `hsGroups[${idx}].itemPrice`,
          message: `Item #${idx + 1} has zero or negative item price.`,
        });
      }
      if (!g.descriptionOfGoods) {
        errors.push({
          type: 'warning',
          field: `hsGroups[${idx}].descriptionOfGoods`,
          message: `Item #${idx + 1} tariff goods description is empty.`,
        });
      }
    });

    // Check sum of HS groups vs invoice total
    const sumItems = decl.hsGroups.reduce((acc, curr) => acc + (curr.itemPrice || 0), 0);
    const invTotal = decl.header.totalInvoiceAmount || 0;
    const diff = Math.abs(sumItems - invTotal);
    if (diff > 5 && invTotal > 0) {
      errors.push({
        type: 'info',
        field: 'totalInvoiceAmount',
        message: `Sum of HS groups (${sumItems.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) differs from Total Invoice (${invTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}). Difference: ${diff.toFixed(2)} (may include freight/discounts).`,
      });
    }
  }

  return errors;
}

export function downloadXmlFile(xmlContent: string, fileName: string) {
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
