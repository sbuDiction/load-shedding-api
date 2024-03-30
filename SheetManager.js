/*
 * @Author: mikey.zhaopeng 
 * @Date: 2024-01-31 21:22:37 
 * @Last Modified by: sibusiso.nkosi
 * @Last Modified time: 2024-03-16 22:57:13
 */

const fs = require('fs');
const XLSX = require('xlsx');
const GenerateAreaName = require('./utils/generate-area-name');
const GenerateSuburbId = require('./utils/generate-sid');

/**
 */
class SheetManager {
    /**
     * This function is for extracting all the `suburbs` data found in the suburb sheet.
     * @returns [] Returns a list of all the `suburbs` from the suburb sheet.
     */
    static extractEskomDirectSuburbs = () => new Promise(async (resolve, reject) => {
        fs.readdir('./sheets/suburbs-sheets/eskom-direct', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            else {
                const suburbs = [];
                const uniqueList = [];
                let suburbsMap = {};

                files.forEach(async fileName => {
                    const workbook = XLSX.readFile(`./sheets/suburbs-sheets/eskom-direct/${fileName}`, { cellFormula: true, sheetStubs: true });
                    const suburbSheetName = workbook.SheetNames[3];
                    const suburbSheet = workbook.Sheets[suburbSheetName];

                    const provinceRange = XLSX.utils.decode_range('A6');
                    const province = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: provinceRange, header: 1 });


                    const jsonList = XLSX.utils.sheet_to_json(suburbSheet);

                    const provinceName = province[0][0];
                    jsonList.forEach((suburb, i) => {
                        const sid = GenerateSuburbId.generateSid(`EskomDirect-${suburb['BLOCK']}-${suburb['SP_NAME']}${suburb['MP_NAME']}${provinceName}`);
                        suburbs.push({
                            sid,
                            name: suburb['SP_NAME'],
                            region: `Eskom Direct, ${suburb['MP_NAME']}, ${provinceName}`,
                            block: suburb['BLOCK']
                        });
                    })

                    suburbs.forEach(suburb => {
                        if (suburbsMap[suburb.sid] === undefined) {
                            suburbsMap[suburb.sid] = 0;
                            uniqueList.push(suburb);
                        }
                        suburbsMap[suburb.sid]++;
                    })
                });
                resolve(uniqueList);
            }
        })
    })
    /**
     * This function is for extracting all the `load shedding schedule` data from the sheet
     * @param {string} areaId
     * @returns 
     */
    static extractEskomDrirectSchedule = () => new Promise(async (resolve) => {
        const workbook = XLSX.readFile(`./sheets/schedule-sheets/Eskom Schedule.xlsx`, { cellFormula: true, sheetStubs: true });
        const scheduleName = workbook.SheetNames[0];
        const scheduleSheet = workbook.Sheets[scheduleName];
        const loadsheddingRange = XLSX.utils.decode_range('A16:AH111');
        XLSX.utils.sheet_to_csv()
        const loadsheddingJsonData = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadsheddingRange, header: 1 });
        resolve(loadsheddingJsonData);
    })

    static extractCityPowerSchedule = () => new Promise(resolve => {
        const workbook = XLSX.readFile(`./sheets/schedule-sheets/City Power Schedule.xlsx`, { cellFormula: true, sheetStubs: true });
        const scheduleName = workbook.SheetNames[0];
        const scheduleSheet = workbook.Sheets[scheduleName];
        const loadsheddingRange = XLSX.utils.decode_range('A4:AH99');
        const loadsheddingJsonData = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadsheddingRange, header: 1 });
        resolve(loadsheddingJsonData);
    })

    static extractCityPowerSuburbs = () => new Promise(resolve => {
        const suburbs = [];
        const uniqueList = [];
        let suburbsMap = {};
        const workbook = XLSX.readFile(`./sheets/suburbs-sheets/city-power/Copy of Load Shedding Schedule Version 6 Rev 0.1 Block Areas_.xlsx`, { cellFormula: true, sheetStubs: true, });
        const suburbsSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(suburbsSheet);
        jsonData.forEach((suburb, i) => {
            const suburbName = suburb['Area']
            const block = suburb['Load Block'];
            const sid = GenerateSuburbId.generateSid(`CityPower-${block}-${suburbName}CityofJohannesburgGauteng`);
            const match = suburbName.match(/\b(\d+),?/g);
            if (match) {
                const extensions = match.map(ext => {
                    return ext.replace(/\D/g, '');
                });
                if (extensions.length > 1) {
                    extensions.forEach((extNumber, i) => {
                        let extName = GenerateAreaName.generate(suburbName);
                        suburbs.push({
                            sid,
                            name: `${extName} ${extNumber}`,
                            region: `City Power, City of Johannesburg, Gauteng`,
                            block: block
                        });
                    });
                }
            } else {
                suburbs.push({
                    sid,
                    name: suburbName,
                    region: `City Power, City of Johannesburg, Gauteng`,
                    block: block
                });
            }
        })

        suburbs.forEach(suburb => {
            if (suburbsMap[suburb['sid']] === undefined) {
                suburbsMap[suburb['sid']] = 0;
                uniqueList.push(suburb);
            }
            suburbsMap[suburb['sid']]++;
        })
        resolve(uniqueList)
    })

}

// SheetManager.extractCityPowerSchedule();
// SheetManager.extractEskomSchedule();

module.exports = SheetManager;