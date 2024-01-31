// This file has all the functions that read the excel file for data extraction.
const XLSX = require('xlsx');

// Load the Excel file
const workbook = XLSX.readFile('./files/Kwazulu-Natal_LS.xlsx', { cellFormula: true, sheetStubs: true }); // KZN sheet
// Sheet names from the loaded eskom spreadsheet
const scheduleName = workbook.SheetNames[0];
// const provinceSheetName = workbook.SheetNames[1];
const citySheetName = workbook.SheetNames[2];
const suburbSheetName = workbook.SheetNames[3];
/**
 * This function is for extracting all the `cities` data found in the city sheet
 * @returns [] Returns a list of all the `cities` from the city sheet
 */
const extractCitiesFromSheet = () => {
    const citySheet = workbook.Sheets[citySheetName];
    const cityJson = XLSX.utils.sheet_to_json(citySheet);
    const cityList = [];
    cityJson.forEach(city => {
        cityList.push(
            city['MP_NAME']
        );
    });
    return cityList;
}
/**
 * This function is for extracting all the `suburbs` data found in the suburb sheet.
 * @returns [] Returns a list of all the `suburbs` from the suburb sheet.
 */
const extractSuburbsFromSheet = () => {
    const suburbSheet = workbook.Sheets[suburbSheetName];
    const suburbJson = XLSX.utils.sheet_to_json(suburbSheet);
    const suburbsList = [];
    suburbJson.forEach(suburb => {
        suburbsList.push(suburb);
    });
    return suburbsList;
}

const extractLoadsheddingScheduleFromSheet = () => {
    const scheduleSheet = workbook.Sheets[scheduleName];
    const loadsheddingRange = XLSX.utils.decode_range('A16:AH111');
    const loadsheddingJsonData = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadsheddingRange, header: 1 });
    // console.table(loadsheddingJsonData);
    // console.table([loadsheddingJsonData[0]]);
    return loadsheddingJsonData;
}


class SheetHelpers {

}

module.exports = {
    extractCities: extractCitiesFromSheet,
    extractSuburbs: extractSuburbsFromSheet,
    extractLoadsheddingScheduleFromSheet
}