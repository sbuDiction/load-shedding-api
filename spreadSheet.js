// This file has all the functions that read the excel file for data extraction.
const XLSX = require('xlsx');

// Load the Excel file
const workbook = XLSX.readFile('./files/Kwazulu-Natal_LS.xlsx', { cellFormula: true, sheetStubs: true });
// Sheet names from the loaded eskom spreadsheet
const scheduleName = workbook.SheetNames[0];
const provinceSheetName = workbook.SheetNames[1];
const citySheetName = workbook.SheetNames[2];
const suburbSheetName = workbook.SheetNames[3];

const extractCitiesFromSpreadSheet = () => {
    const citySheet = workbook.Sheets[citySheetName];
    const cityJson = XLSX.utils.sheet_to_json(citySheet);
    const cityList = [];

    // // Extract cityies
    cityJson.forEach(city => {
        // Store all the cities from the spreadsheet
        cityList.push(
            city['MP_NAME']
        );
    });
    return cityList;
}

const extractSuburbsFromSpreadSheet = () => {
    const suburbSheetName = workbook.SheetNames[3];
    const suburbSheet = workbook.Sheets[suburbSheetName];
    const suburbJson = XLSX.utils.sheet_to_json(suburbSheet);
    const suburbsList = [];

    suburbJson.forEach(suburb => {
        suburbsList.push(suburb);
    });
    return suburbsList;
}

module.exports = {
    extractCities: extractCitiesFromSpreadSheet,
    extractSuburbs: extractSuburbsFromSpreadSheet
}