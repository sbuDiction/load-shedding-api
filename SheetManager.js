/*
 * @Author: mikey.zhaopeng 
 * @Date: 2024-01-31 21:22:37 
 * @Last Modified by: sibusiso.nkosi
 * @Last Modified time: 2024-02-23 09:14:58
 */

const fs = require('fs');
const XLSX = require('xlsx');

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
                const uniqueList = [];
                let mapSuburbs = {}

                // let search = {};
                let regions = {};
                files.forEach(async fileName => {
                    // console.log(fileName);
                    const workbook = XLSX.readFile(`./files/${fileName}`, { cellFormula: true, sheetStubs: true });
                    const suburbSheetName = workbook.SheetNames[3];
                    const suburbSheet = workbook.Sheets[suburbSheetName];

                    // const province = 
                    const provinceRange = XLSX.utils.decode_range('A6');
                    const province = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: provinceRange, header: 1 });


                    const jsonList = XLSX.utils.sheet_to_json(suburbSheet);

                    const provinceName = province[0][0];
                    jsonList.forEach(suburb => {
                        suburbs.push({
                            sid: `${suburb['SP_NAME'].replace(` (${suburb['BLOCK']})`, '-')}${suburb['BLOCK']}-${suburb['MP_NAME']}-${provinceName.replace(' ', '-')}`.toLowerCase().replace(' ', '-'),
                            name: suburb['SP_NAME'],
                            region: `${suburb['MP_NAME']}, ${provinceName}`,
                            block: suburb['BLOCK']
                        });
                    })

                    suburbs.forEach(suburb => {
                        if (mapSuburbs[suburb.sid.trim()] === undefined) {
                            mapSuburbs[suburb.sid] = 0;
                            suburb.sid.replace(' ', '-')
                            uniqueList.push(suburb);
                        }
                        mapSuburbs[suburb.sid]++;
                    })
                    // console.table(jsonList);
                    // const { searchResults } = findAreaByName(jsonList, suburbName, provinceName);
                    // return;
                    // searchResults.length != 0 ? search[fileName] = searchResults.length : ''; // This line will find use one day!.

                });
                // console.log(mapSuburbs);
                resolve(uniqueList);
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
    static extractLoadsheddingScheduleFromSheet = () => new Promise(async (resolve) => {
        fs.readdir('./files/', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            const workbook = XLSX.readFile(`./files/${files[0]}`, { cellFormula: true, sheetStubs: true });
            const scheduleName = workbook.SheetNames[0];
            const scheduleSheet = workbook.Sheets[scheduleName];
            const loadsheddingRange = XLSX.utils.decode_range('A16:AH111');
            const loadsheddingJsonData = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadsheddingRange, header: 1 });
            resolve(loadsheddingJsonData);
        })
    })
}

module.exports = SheetManager;