import { AsycudaDeclaration } from '../types/asycuda';

// Full verbatim reference ASYCUDA XML guideline from user specifications
export const REFERENCE_SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
<Total_number_of_items>5</Total_number_of_items>
</Nbers>
<Place_of_declaration>
<null/>
</Place_of_declaration>
<Date_of_declaration/>
<Selected_page>1</Selected_page>
</Property>
<Identification>
<Office_segment>
<Customs_clearance_office_code>ARIA</Customs_clearance_office_code>
<Customs_Clearance_office_name>Ariamsvlei</Customs_Clearance_office_name>
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
<UCR>6ZA25617343CINV622967</UCR>
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
<Exporter_code>25617343</Exporter_code>
<Exporter_name>Molenaar Industrial Technologies (Pty) Ltd.
200 Jan van Riebeeck Drive, Paarl, 7646
SOUTH AFRICA</Exporter_name>
</Exporter>
<Consignee>
<Consignee_code>03906477</Consignee_code>
<Consignee_name>KARSTEN FARMS
JC37 64M AUSSENKHER FARM
CAPE ORCHARD NAMIBIA</Consignee_name>
</Consignee>
<Financial>
<Financial_code/>
<Financial_name/>
</Financial>
</Traders>
<Declarant>
<Declarant_code>05204044</Declarant_code>
<Declarant_name>Goreefers Logistics Namibia P.O.Box 20Noordoewer</Declarant_name>
<Reference>
<Number>622967</Number>
</Reference>
</Declarant>
<General_information>
<Country>
<Country_first_destination/>
<Trading_country/>
<Export>
<Export_country_code>ZA</Export_country_code>
<Export_country_name>South Africa</Export_country_name>
<Export_country_region/>
</Export>
<Destination>
<Destination_country_code>NA</Destination_country_code>
<Destination_country_name>Namibia</Destination_country_name>
<Destination_country_region/>
</Destination>
<Country_of_origin_name>South Africa</Country_of_origin_name>
</Country>
<Value_details>30468.33</Value_details>
<CAP/>
<Additional_information/>
<Comments_free_text>
<null/>
</Comments_free_text>
</General_information>
<Transport>
<Means_of_transport>
<Departure_arrival_information>
<Identity>DBZ126NC / CNY564ND / CNY56FS</Identity>
<Nationality>ZA</Nationality>
</Departure_arrival_information>
<Border_information>
<Identity>FP DU TOIT</Identity>
<Nationality>ZA</Nationality>
<Mode>3</Mode>
</Border_information>
<Inland_mode_of_transport>
<null/>
</Inland_mode_of_transport>
</Means_of_transport>
<Container_flag>false</Container_flag>
<Delivery_terms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
<Situation/>
</Delivery_terms>
<Border_office>
<Code>ARIA</Code>
<Name>Ariamsvlei</Name>
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
<Location_of_goods>AUSSENKHER</Location_of_goods>
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
<Code>002</Code>
<Name>Bank Windhoek LTD</Name>
<Branch>
<null/>
</Branch>
<Reference>
<null/>
</Reference>
</Bank>
<Terms>
<Code>30</Code>
<Description>30 Days</Description>
</Terms>
<Total_invoice>1712000.00</Total_invoice>
<Deffered_payment_reference>
<null/>
</Deffered_payment_reference>
<Mode_of_payment>CASH</Mode_of_payment>
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
<Gross_weight>19120.0</Gross_weight>
</Weight>
<Total_cost>30468.33</Total_cost>
<Total_CIF>1742468.33</Total_CIF>
<Gs_Invoice>
<Amount_national_currency>1712000.00</Amount_national_currency>
<Amount_foreign_currency>1712000.00</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_name>South African Rand</Currency_name>
<Currency_rate>1</Currency_rate>
</Gs_Invoice>
<Gs_external_freight>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_name>
<null/>
</Currency_name>
<Currency_rate>1</Currency_rate>
</Gs_external_freight>
<Gs_internal_freight>
<Amount_national_currency>30468.33</Amount_national_currency>
<Amount_foreign_currency>30468.33</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_name>South African Rand</Currency_name>
<Currency_rate>1</Currency_rate>
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
<Total_invoice>1712000.00</Total_invoice>
<Total_weight>18000.0</Total_weight>
</Total>
</Valuation>

<!-- ITEM 1: HS 34023910 -->
<Item>
<Packages>
<Number_of_packages>8</Number_of_packages>
<Kind_of_packages_code>BX</Kind_of_packages_code>
<Kind_of_packages_name>BOX</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>34023910</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>4680.00</Item_price>
<Value_item>4680.00</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>ZA</Country_of_origin_code>
<Description_of_goods>Pre-saturated cleaning swabs</Description_of_goods>
<Commercial_Description>WB296 PRE-SATURATED CLEANING SWABS BOX OF 10</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>4680.00</Amount_national_currency>
<Amount_foreign_currency>4680.00</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>

<!-- ITEM 2: HS 84223000 -->
<Item>
<Packages>
<Number_of_packages>8</Number_of_packages>
<Kind_of_packages_code>UN</Kind_of_packages_code>
<Kind_of_packages_name>UNIT</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>84223000</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>1660299.68</Item_price>
<Value_item>1660299.68</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>ZA</Country_of_origin_code>
<Description_of_goods>Machinery for labelling, sealing or packaging</Description_of_goods>
<Commercial_Description>VJ9560 LH107 AND RH107 DIRECT APPLY PRINTERS</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>1660299.68</Amount_national_currency>
<Amount_foreign_currency>1660299.68</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>

<!-- ITEM 3: HS 84439900 -->
<Item>
<Packages>
<Number_of_packages>80</Number_of_packages>
<Kind_of_packages_code>PC</Kind_of_packages_code>
<Kind_of_packages_name>PIECES</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>84439900</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>43068.88</Item_price>
<Value_item>43068.88</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>ZA</Country_of_origin_code>
<Description_of_goods>Parts and accessories of printing machinery</Description_of_goods>
<Commercial_Description>PRINTER PARTS, BRACKETS, BEACONS, PLUGS AND SENSORS</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>43068.88</Amount_national_currency>
<Amount_foreign_currency>43068.88</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>

<!-- ITEM 4: HS 85232900 -->
<Item>
<Packages>
<Number_of_packages>8</Number_of_packages>
<Kind_of_packages_code>PC</Kind_of_packages_code>
<Kind_of_packages_name>PIECES</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>85232900</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>1580.56</Item_price>
<Value_item>1580.56</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>ZA</Country_of_origin_code>
<Description_of_goods>Discs, tapes, solid-state non-volatile storage devices</Description_of_goods>
<Commercial_Description>WB200D VIDEO JET MEMORY STICK 8GB (BLACK)</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>1580.56</Amount_national_currency>
<Amount_foreign_currency>1580.56</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>

<!-- ITEM 5: HS 56049000 -->
<Item>
<Packages>
<Number_of_packages>8</Number_of_packages>
<Kind_of_packages_code>PC</Kind_of_packages_code>
<Kind_of_packages_name>PIECES</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>CIF</Code>
<Place>Aussenkher Farm</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>56049000</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>1378.48</Item_price>
<Value_item>1378.48</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>ZA</Country_of_origin_code>
<Description_of_goods>Rubber thread and cord, textile covered; textile yarn</Description_of_goods>
<Commercial_Description>WB2218 6330/50 CONTROLLER COVER-SMALL</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>1378.48</Amount_national_currency>
<Amount_foreign_currency>1378.48</Amount_foreign_currency>
<Currency_code>ZAR</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>

</ASYCUDA>`;
export const MOLENAAR_SAMPLE: AsycudaDeclaration = {
  header: {
    invoiceNumber: '622967',
    invoiceDate: '2026-03-15',
    ucr: '6ZA25617343CINV622967',
    exporterCode: '25617343',
    exporterName: 'Molenaar Industrial Technologies (Pty) Ltd.\n200 Jan van Riebeeck Drive, Paarl, 7646\nSOUTH AFRICA',
    consigneeCode: '03906477',
    consigneeName: 'KARSTEN FARMS\nJC37 64M AUSSENKHER FARM\nCAPE ORCHARD NAMIBIA',
    declarantCode: '05204044',
    declarantName: 'Goreefers Logistics Namibia P.O.Box 20Noordoewer',
    referenceNumber: '622967',
    exportCountryCode: 'ZA',
    exportCountryName: 'South Africa',
    destinationCountryCode: 'NA',
    destinationCountryName: 'Namibia',
    countryOfOriginName: 'South Africa',
    transportIdentity: 'DBZ126NC / CNY564ND / CNY56FS',
    transportNationality: 'ZA',
    carrier: 'FP DU TOIT',
    transportMode: '3',
    borderOfficeCode: 'ARIA',
    borderOfficeName: 'Ariamsvlei',
    deliveryTermsCode: 'CIF',
    deliveryTermsPlace: 'Aussenkher Farm',
    locationOfGoods: 'AUSSENKHER',
    bankCode: '002',
    bankName: 'Bank Windhoek LTD',
    paymentTermsCode: '30',
    paymentTermsDescription: '30 Days',
    modeOfPayment: 'CASH',
    currencyCode: 'ZAR',
    currencyName: 'South African Rand',
    currencyRate: 1,
    totalInvoiceAmount: 1712000.00,
    freightCost: 85600.00,
    totalCif: 1797600.00,
    grossWeight: 19120.0,
    netWeight: 18000.0,
  },
  lineItems: [
    {
      lineNumber: 1,
      itemCode: 'WB296',
      description: 'WB296 PRE-SATURATED CLEANING SWABS BOX OF 10',
      hsCode: '34023910',
      quantity: 8,
      unit: 'BX',
      unitPrice: 585.00,
      totalAmount: 4680.00,
      countryOfOrigin: 'ZA',
      netWeight: 80.0,
      grossWeight: 85.0,
    },
    {
      lineNumber: 2,
      itemCode: 'VJ9560',
      description: 'VJ9560 LH107 AND RH107 DIRECT APPLY PRINTERS',
      hsCode: '84223000',
      quantity: 8,
      unit: 'UN',
      unitPrice: 207537.46,
      totalAmount: 1660299.68,
      countryOfOrigin: 'ZA',
      netWeight: 17200.0,
      grossWeight: 18200.0,
    },
    {
      lineNumber: 3,
      itemCode: 'PRT-PARTS',
      description: 'PRINTER PARTS, BRACKETS, BEACONS, PLUGS AND SENSORS',
      hsCode: '84439900',
      quantity: 80,
      unit: 'PC',
      unitPrice: 538.36,
      totalAmount: 43068.88,
      countryOfOrigin: 'ZA',
      netWeight: 650.0,
      grossWeight: 750.0,
    },
    {
      lineNumber: 4,
      itemCode: 'WB200D',
      description: 'WB200D VIDEO JET MEMORY STICK 8GB (BLACK)',
      hsCode: '85232900',
      quantity: 8,
      unit: 'PC',
      unitPrice: 197.57,
      totalAmount: 1580.56,
      countryOfOrigin: 'ZA',
      netWeight: 40.0,
      grossWeight: 45.0,
    },
    {
      lineNumber: 5,
      itemCode: 'WB2218',
      description: 'WB2218 6330/50 CONTROLLER COVER-SMALL',
      hsCode: '56049000',
      quantity: 8,
      unit: 'PC',
      unitPrice: 172.31,
      totalAmount: 1378.48,
      countryOfOrigin: 'ZA',
      netWeight: 30.0,
      grossWeight: 40.0,
    },
  ],
  hsGroups: [
    {
      commodityCode: '34023910',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 8,
      kindOfPackagesCode: 'BX',
      kindOfPackagesName: 'BOX',
      descriptionOfGoods: 'Pre-saturated cleaning swabs',
      commercialDescription: 'WB296 PRE-SATURATED CLEANING SWABS BOX OF 10',
      countryOfOriginCode: 'ZA',
      itemPrice: 4680.00,
      valueItem: 4680.00,
      netWeight: 80.0,
      grossWeight: 85.0,
    },
    {
      commodityCode: '84223000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 8,
      kindOfPackagesCode: 'UN',
      kindOfPackagesName: 'UNIT',
      descriptionOfGoods: 'Machinery for labelling, sealing or packaging',
      commercialDescription: 'VJ9560 LH107 AND RH107 DIRECT APPLY PRINTERS',
      countryOfOriginCode: 'ZA',
      itemPrice: 1660299.68,
      valueItem: 1660299.68,
      netWeight: 17200.0,
      grossWeight: 18200.0,
    },
    {
      commodityCode: '84439900',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 80,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Parts and accessories of printing machinery',
      commercialDescription: 'PRINTER PARTS, BRACKETS, BEACONS, PLUGS AND SENSORS',
      countryOfOriginCode: 'ZA',
      itemPrice: 43068.88,
      valueItem: 43068.88,
      netWeight: 650.0,
      grossWeight: 750.0,
    },
    {
      commodityCode: '85232900',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 8,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Discs, tapes, solid-state non-volatile storage devices',
      commercialDescription: 'WB200D VIDEO JET MEMORY STICK 8GB (BLACK)',
      countryOfOriginCode: 'ZA',
      itemPrice: 1580.56,
      valueItem: 1580.56,
      netWeight: 40.0,
      grossWeight: 45.0,
    },
    {
      commodityCode: '56049000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 8,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Rubber thread and cord, textile covered; textile yarn',
      commercialDescription: 'WB2218 6330/50 CONTROLLER COVER-SMALL',
      countryOfOriginCode: 'ZA',
      itemPrice: 1378.48,
      valueItem: 1378.48,
      netWeight: 30.0,
      grossWeight: 40.0,
    },
  ],
};

// Sample 2: Agri-Logistics & Vineyard Irrigation Supplies
export const AGRITECH_SAMPLE: AsycudaDeclaration = {
  header: {
    invoiceNumber: 'INV-773914',
    invoiceDate: '2026-03-20',
    ucr: '6ZA18493021CINV773914',
    exporterCode: '18493021',
    exporterName: 'AgriFlow Fluid & Irrigation Systems (Pty) Ltd.\n14 Industrial Crescent, Stellenbosch, 7600\nSOUTH AFRICA',
    consigneeCode: '03906477',
    consigneeName: 'KARSTEN FARMS\nJC37 64M AUSSENKHER FARM\nCAPE ORCHARD NAMIBIA',
    declarantCode: '05204044',
    declarantName: 'Goreefers Logistics Namibia P.O.Box 20Noordoewer',
    referenceNumber: '773914',
    exportCountryCode: 'ZA',
    exportCountryName: 'South Africa',
    destinationCountryCode: 'NA',
    destinationCountryName: 'Namibia',
    countryOfOriginName: 'South Africa',
    transportIdentity: 'DBZ126NC / CNY564ND / CNY56FS',
    transportNationality: 'ZA',
    carrier: 'FP DU TOIT',
    transportMode: '3',
    borderOfficeCode: 'ARIA',
    borderOfficeName: 'Ariamsvlei',
    deliveryTermsCode: 'CIF',
    deliveryTermsPlace: 'Aussenkher Farm',
    locationOfGoods: 'AUSSENKHER',
    bankCode: '002',
    bankName: 'Bank Windhoek LTD',
    paymentTermsCode: '30',
    paymentTermsDescription: '30 Days',
    modeOfPayment: 'CASH',
    currencyCode: 'ZAR',
    currencyName: 'South African Rand',
    currencyRate: 1,
    totalInvoiceAmount: 486250.00,
    freightCost: 24312.50,
    totalCif: 510562.50,
    grossWeight: 8400.0,
    netWeight: 7950.0,
  },
  lineItems: [
    {
      lineNumber: 1,
      itemCode: 'DRIP-16-1000',
      description: 'DRIPLINE TUBING 16MM HEAVY WALL 1000M COIL',
      hsCode: '39173200',
      quantity: 50,
      unit: 'RO',
      unitPrice: 1850.00,
      totalAmount: 92500.00,
      countryOfOrigin: 'ZA',
      netWeight: 2200.0,
      grossWeight: 2350.0,
    },
    {
      lineNumber: 2,
      itemCode: 'PUMP-CENT-40KW',
      description: 'MULTISTAGE CENTRIFUGAL IRRIGATION WATER PUMP 40KW',
      hsCode: '84137000',
      quantity: 2,
      unit: 'UN',
      unitPrice: 125000.00,
      totalAmount: 250000.00,
      countryOfOrigin: 'ZA',
      netWeight: 3800.0,
      grossWeight: 4000.0,
    },
    {
      lineNumber: 3,
      itemCode: 'VALVE-SOL-3INCH',
      description: 'HYDRAULIC SOLENOID CONTROL VALVES 3 INCH',
      hsCode: '84818000',
      quantity: 15,
      unit: 'PC',
      unitPrice: 4250.00,
      totalAmount: 63750.00,
      countryOfOrigin: 'ZA',
      netWeight: 1450.0,
      grossWeight: 1520.0,
    },
    {
      lineNumber: 4,
      itemCode: 'SENS-SOIL-PRO',
      description: 'DIGITAL SOIL MOISTURE AND TEMPERATURE PROBES',
      hsCode: '90278000',
      quantity: 20,
      unit: 'PC',
      unitPrice: 4000.00,
      totalAmount: 80000.00,
      countryOfOrigin: 'ZA',
      netWeight: 500.0,
      grossWeight: 530.0,
    },
  ],
  hsGroups: [
    {
      commodityCode: '39173200',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 50,
      kindOfPackagesCode: 'RO',
      kindOfPackagesName: 'ROLLS',
      descriptionOfGoods: 'Tubes, pipes and hoses, rigid, of plastics',
      commercialDescription: 'DRIPLINE TUBING 16MM HEAVY WALL 1000M COIL',
      countryOfOriginCode: 'ZA',
      itemPrice: 92500.00,
      valueItem: 92500.00,
      netWeight: 2200.0,
      grossWeight: 2350.0,
    },
    {
      commodityCode: '84137000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 2,
      kindOfPackagesCode: 'UN',
      kindOfPackagesName: 'UNIT',
      descriptionOfGoods: 'Other centrifugal pumps for liquids',
      commercialDescription: 'MULTISTAGE CENTRIFUGAL IRRIGATION WATER PUMP 40KW',
      countryOfOriginCode: 'ZA',
      itemPrice: 250000.00,
      valueItem: 250000.00,
      netWeight: 3800.0,
      grossWeight: 4000.0,
    },
    {
      commodityCode: '84818000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 15,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Taps, cocks, valves and similar appliances for pipes',
      commercialDescription: 'HYDRAULIC SOLENOID CONTROL VALVES 3 INCH',
      countryOfOriginCode: 'ZA',
      itemPrice: 63750.00,
      valueItem: 63750.00,
      netWeight: 1450.0,
      grossWeight: 1520.0,
    },
    {
      commodityCode: '90278000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 20,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Instruments and apparatus for physical or chemical analysis',
      commercialDescription: 'DIGITAL SOIL MOISTURE AND TEMPERATURE PROBES',
      countryOfOriginCode: 'ZA',
      itemPrice: 80000.00,
      valueItem: 80000.00,
      netWeight: 500.0,
      grossWeight: 530.0,
    },
  ],
};
