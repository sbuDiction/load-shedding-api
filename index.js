// // import pkg from 'xlsx';
// // const { readFile,utils } = pkg;

const { getCurrentLoadShedding } = require("./load-shedding-functions");
const { extractLoadsheddingScheduleFromSheet } = require("./sheet-functions");

// // const workbook = readFile('./files/Kwazulu-Natal_LS.xlsx');
// // const sheet = workbook.Sheets['Schedule'];
// // const cell = sheet['C1'];

// // console.log(cell);

// // Import the xlsx library (make sure to include the library in your project)
// const XLSX = require('xlsx');
// const fs = require('fs');
// const jsonData = require('./json/loadshedding-data-example.json');
// const { saveJSONFile } = require('./jsonFile');
// const { getLoadSheddingSchedule } = require('./loadSheddingFunctions');

// // Load the Excel file
// const workbook = XLSX.readFile('./files/Kwazulu-Natal_LS.xlsx', { cellFormula: true, sheetStubs: true });

// // Sheet names from the loaded eskom spreadsheet
// const scheduleName = workbook.SheetNames[0];
// const provinceSheetName = workbook.SheetNames[1];
// const citySheetName = workbook.SheetNames[2];
// const suburbSheetName = workbook.SheetNames[3];

// // List of cities
// const scheduleSheet = workbook.Sheets[scheduleName];
// const provinceSheet = workbook.Sheets[provinceSheetName];
// const citySheet = workbook.Sheets[citySheetName];
// const suburbSheet = workbook.Sheets[suburbSheetName];

// // Convert sheet to json data
// const scheduleJson = XLSX.utils.sheet_to_json(scheduleSheet);
// const provinceJson = XLSX.utils.sheet_to_json(provinceSheet);
// const cityJson = XLSX.utils.sheet_to_json(citySheet);
// const suburbJson = XLSX.utils.sheet_to_json(suburbSheet);

// const eskomDataRange = XLSX.utils.decode_range('D16:AH111');
// const loadSheddingScheduleRange = XLSX.utils.decode_range('D3:AH14');

// const cityCell = scheduleSheet['A8'];
// const suburbCell = scheduleSheet['A10'];
// const blockNumberCell = scheduleSheet['A1'];

// const jsonRange = XLSX.utils.sheet_to_json(scheduleSheet, { range: eskomDataRange, header: 1 });
// const jsonLoadsheddingRange = XLSX.utils.sheet_to_json(scheduleSheet, { range: loadSheddingScheduleRange, header: 1 });

// // const blocksMap = new Map();

// // const readBlock = (range) => {
// //     // console.log(range);
// // }

// // This blocks var is for the number of blocks
// // const blocks = 17; // Adjusted for 1 based indexing actual blocks is 16.
// // for (let i = 1; i < blocks; i++) {
//     // blockNumberCell.v = 1;
//     // XLSX.writeFileXLSX(workbook, './files/Kwazulu-Natal_LS.xlsx', (err) => {
//     //     if (err) {
//     //         console.error(err);
//     //     } else {
//     //         console.log('File has been written successfully!');
//     //         // setTimeout(readBlock(jsonLoadsheddingRange), 3000);
//     //     }
//     // });
//     // console.log(`BLOCK:${i}`, jsonLoadsheddingRange);

// // }



// // XLSX.writeFileXLSX(workbook, 'Kwazulu-Natal_LS.xlsx');
// const workbook4 = XLSX.readFile('./Kwazulu-Natal_LS.xlsx', { cellFormula: true, sheetStubs: true });
// // console.log(jsonLoadsheddingRange);
// const scheduleSheet4 = workbook4.Sheets[scheduleName];
// const loadSheddingScheduleRange2 = XLSX.utils.decode_range('D3:AH14');
// const jsonLoadsheddingRange2 = XLSX.utils.sheet_to_json(scheduleSheet4, { range: loadSheddingScheduleRange2, header: 1 });
// // console.log(loadSheddingScheduleRange2);
// // console.log(scheduleSheet4['E3']);
// const calenderMap = new Map();
// // console.table(jsonLoadsheddingRange);
// // console.log(jsonRange[0][0]);


// // console.log(schedule);
// // for (let i = 2; i < jsonData[1].length; i++) {
// //     const schedule = getLoadSheddingSchedule(i);
// //     console.log(schedule);
// //     // calenderMap.set(jsonData[0][i], { schedule });
// // }
// // console.table(calenderMap);

// const date = new Date();
// // console.table(jsonData);
// // console.log(calenderMap.get(date.getDate()));







// // console.log(getRange);
// // Access all values in the range
// // jsonRange.forEach((row, rowIndex) => {
// //     // console.log(row);
// //     Object.keys(row).forEach(columnIndex => {
// //         const cellValue = row[columnIndex];
// //         // console.log(cellValue);
// //         // console.log(`Cell[${range.s.r + rowIndex + 1},${range.s.c + parseInt(columnIndex, 10) + 1}]:`, cellValue);
// //     });
// // });

// // const rows = 112;
// // const columns = 32

// // const grid = [];

// // for (let i = 16; i < rows - 16; i++) {
// //     const row = [];
// //     console.log(scheduleSheet[`C${i}`]);
// //     for (let x = 1; x < columns; x++) {
// //         console.log(scheduleSheet[``]);
// //     }
// //     // grid.push(row);
// //     // console.log('Row:', row);
// //     // const cell = array[i];
// //     // console.log(scheduleSheet[`C${i}`]);


// // }
// // console.table(grid);

// // console.log(workbook.Props);

// // let loadSheddingMap = {};

// // provinceJson.forEach((province) => {
// //     if (loadSheddingMap[province['PROVINCE']] === undefined) {
// //         loadSheddingMap[province['PROVINCE']] = { cities: [], };
// //     }
// // });



// // // Extract cityies
// // cityJson.forEach(city => {
// //     const currentCities = [];
// //     // Store all the cities from the spreadsheet
// //     loadSheddingMap['KwaZulu-Natal']['cities'].push({
// //         city: city['MP_NAME'],
// //         suburbs: []
// //     });
// // });


// // suburbJson.forEach(suburb => {
// //     const cities = loadSheddingMap['KwaZulu-Natal']['cities'];
// //     cities.forEach((city) => {
// //         if (city['city'] === suburb['MP_NAME']) {
// //             city['suburbs'].push(
// //                 {
// //                     suburb: suburb['SP_NAME'],
// //                     block: suburb['BLOCK'],
// //                     city: suburb['MP_NAME']
// //                 }
// //             )
// //         }
// //     })

// // });

// // saveJSONFile()

const data = extractLoadsheddingScheduleFromSheet();
// console.table(data);
getCurrentLoadShedding(data,2,2);
// console.log(data[1][0]);