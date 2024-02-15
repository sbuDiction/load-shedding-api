/*
 * @Author: mikey.zhaopeng 
 * @Date: 2024-01-31 21:22:37 
 * @Last Modified by: sibusiso.nkosi
 * @Last Modified time: 2024-02-12 10:41:10
 */

const fs = require('fs');
const XLSX = require('xlsx');
const { findAreaByName, findAreaById } = require('./api-fuctions');

/**
 * @alias  XLSX:number
 */
class SheetManager {
    /**
     * This function is for extracting all the `suburbs` data found in the suburb sheet.
     * @returns [] Returns a list of all the `suburbs` from the suburb sheet.
     */
    extractSuburbsFromSheet = (suburbName) => new Promise(async (resolve, reject) => {
        fs.readdir('./files/', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            else {
                const suburbs = [];
                // let search = {};
                let regions = {};
                files.forEach(async fileName => {
                    const workbook = XLSX.readFile(`./files/${fileName}`, { cellFormula: true, sheetStubs: true });
                    const suburbSheetName = workbook.SheetNames[3];
                    const suburbSheet = workbook.Sheets[suburbSheetName];
                    const jsonList = XLSX.utils.sheet_to_json(suburbSheet);
                    const { searchResults, regionMap } = findAreaByName(jsonList, suburbName);
                    suburbs.push(...searchResults);
                    // searchResults.length != 0 ? search[fileName] = searchResults.length : ''; // This line will find use one day!.
                    regions = regionMap;
                });
                resolve({ suburbs, regions });
            }
        })
    })
    /**
     * This function is for extracting all the `cities` data found in the city sheet
     * @returns [] Returns a list of all the `cities` from the city sheet
     */
    extractCitiesFromSheet = workbook => {
        const citySheetName = workbook.SheetNames[2];
        const citySheet = workbook.Sheets[citySheetName];
        const cityJson = XLSX.utils.sheet_to_json(citySheet);
        return cityJson;
    }
    /**
     * This function is for extracting all the `load shedding schedule` data from the sheet
     * @param {string} areaId
     * @returns 
     */
    extractLoadsheddingScheduleFromSheet = areaId => new Promise(async (resolve) => {
        fs.readdir('./files/', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            files.forEach(fileName => {
                const workbook = XLSX.readFile(`./files/${fileName}`, { cellFormula: true, sheetStubs: true });

                const suburbSheetName = workbook.SheetNames[3];
                const suburbSheet = workbook.Sheets[suburbSheetName];
                const jsonList = XLSX.utils.sheet_to_json(suburbSheet);

                const results = findAreaById(jsonList, areaId);
                if (results.hasOwnProperty('id')) {
                    const scheduleName = workbook.SheetNames[0];
                    const scheduleSheet = workbook.Sheets[scheduleName];
                    const loadsheddingRange = XLSX.utils.decode_range('A16:AH111');
                    const loadsheddingJsonData = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadsheddingRange, header: 1 });
                    resolve({ schedule: loadsheddingJsonData, area: results });
                }
            });
        })
    })

    extractAllSuburbs = () => {

    }

}

module.exports = SheetManager;