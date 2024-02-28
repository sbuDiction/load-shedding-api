/*
 * @Author: mikey.zhaopeng 
 * @Date: 2024-01-31 21:22:37 
 * @Last Modified by: sibusiso.nkosi
 * @Last Modified time: 2024-02-28 08:10:04
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
    extractSuburbsFromSheet = (suburbName) => new Promise(async (resolve, reject) => {
        fs.readdir('./files/', { encoding: 'utf8' }, (err, files) => {
            if (err) console.error(err);
            else {
                const suburbs = [];
                const uniqueList = [];
                let mapSuburbs = {}

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
                });
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

    static extractCityPowerSuburbs = () => new Promise(resolve => {
        const suburbs = [];
        const uniqueList = [];
        let suburbsMap = {};
        let extMap = {};
        const workbook = XLSX.readFile(`./files/Copy of Load Shedding Schedule Version 6 Rev 0.1 Block Areas_.xlsx`, { cellFormula: true, sheetStubs: true, });
        const suburbsSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(suburbsSheet);
        jsonData.forEach(suburb => {
            const suburbName = suburb['Area']
            const block = suburb['Load Block'];
            const match = suburbName.match(/\b(\d+),?/g);
            if (match) {
                const extensions = match.map(ext => {
                    return ext.replace(/\D/g, '');
                });
                if (extensions.length > 1) {
                    extensions.forEach(extNumber => {
                        let extName = GenerateAreaName.generate(suburbName);
                        const sid = GenerateSuburbId.generateSid(`${extName}, ${extNumber} City of Johannesburg Gauteng ${block}`)
                        suburbs.push({
                            sid: sid,
                            name: extName,
                            region: `City of Johannesburg, Gauteng`,
                            block: block
                        });
                    });
                }
            } else {
                const sid = GenerateSuburbId.generateSid(`${suburbName} City of Johannesburg  Gauteng ${block}`);
                suburbs.push({
                    sid: sid,
                    name: suburbName,
                    region: `City of Johannesburg, Gauteng`,
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

module.exports = SheetManager;