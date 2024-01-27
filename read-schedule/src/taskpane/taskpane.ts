/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */
import * as fs from 'fs';
import axios from 'axios';

import loadsheddingMap from '../../.././json/loadshedding_map.json';
import { saveJSONFile, fromFileToJSON, LOAD_SHEDDING_MAP_FILE_PATH } from '../../../jsonFile.js';
import { processSpreadSheet } from '../loadShedding';


const blocks: object[] = [];

interface Block {
  blockNumber: number;
  schedule: number[][]
}

Office.onReady((info) => {
  console.log('Schedule has been loaded');
  console.log(loadsheddingMap);


  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
  }
});

export async function run() {
  try {
    await Excel.run(async (context) => {
      /**
       * Insert your Excel code here
       * 
      */

      const provinceList = [];
      const cityList = [];
      const suburbList = [];

      const workbook = context.workbook.worksheets;
      // const workbook2 = context.workbook;


      // Get the table by name
      // let table = workbook2.tables.getItem('tblSP');

      // // Load the table properties
      // table.load("name, columns, rows, showHeaders");
      // // table.rows.load('name');

      // // Run the queued commands
      // await context.sync();

      // console.log(table.toJSON());

      // // Access the table properties
      // console.log("Table Name: " + table.name);
      // console.log("Show Headers: " + table.showHeaders);

      // // Access columns and rows
      // let columns = table.columns;
      // let rows = table.rows;
      // // console.log(columns.count);
      // // columns.load('name');


      // await context.sync();
      // for (let i = 0; i < columns.count; i++) {
      //   let column = columns.getItemAt(i);
      //   column.load('name');
      //   await context.sync();
      //   console.log("Column Name: " + column.name);
      // }


      // for (let j = 0; j < rows.count; j++) {
      //   let rowValues = rows.getItemAt(j);
      //   rowValues.load('values')
      //   await context.sync();
      //   console.log("Row Values: " + rowValues.values);
      // }
      // // });



      // // Load first
      workbook.load("items/name");
      // // Sync object
      await context.sync();

      const scheduleSheetName = workbook.items[0];
      // const provinceSheetName = workbook.items[1];
      // const citySheetName = workbook.items[2];
      // const suburbSheetName = workbook.items[3];

      const scheduleSheet = context.workbook.worksheets.getItem(scheduleSheetName.name);



      // Add the onChanged event handler
      scheduleSheet.onChanged.add(onChange);

      // Run the queued commands
      await context.sync();

      // Get the range where you want to listen for value changes
      var range = scheduleSheet.getRange("A1");
      for (let i = 1; i < 17; i++) {
        range.values = [[i]];
        await context.sync();
      }

      setTimeout(async () => {
        await axios.post('http://localhost:5000/api/excel/data', { blocks });
        // await fetch('http://localhost:5000/api/excel/data', {
        //   method: 'POST',
        //   mode: 'no-cors',
        //   headers: {
        //     "Content-Type": "application/json",
        //     // 'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        //   body: JSON.stringify(blocks)
        // })
        //   .then(res => res.json())
        //   .then(status => {
        //     console.log(status);
        //   })
      }, 3000)
      // const provinceSheet = context.workbook.worksheets.getItem(provinceSheetName.name);
      // const citySheet = context.workbook.worksheets.getItem(citySheetName.name);
      // const suburbSheet = context.workbook.worksheets.getItem(suburbSheetName.name);

      // // provinceSheet.load('tables');
      // // provinceSheet.load('address');
      // // citySheet.load('tables');
      // // suburbSheet.load('tables');

      // // scheduleSheet.load('tables');
      // // scheduleSheet.load('address');
      // await context.sync();

      // // const tblAddress = scheduleSheet.tables.getItem('tblSP').getRange().address
      // await context.sync();

      // // console.log(tblAddress);
      // // console.log(provinceSheet.tables.getItem('tblSP').getRange());
      // // console.log(citySheet.tables.getItem('tblSP').getRange());
      // // console.log(suburbSheet.tables.getItem('tblSP').getRange().address);


      // const monthlyScheduleRangeAddress = 'B2:AH14';

      // const loadSheddingData = scheduleSheet.getRange(monthlyScheduleRangeAddress);
      // const currentCityVal = scheduleSheet.getRange('A8');
      // const currentSuburbVal = scheduleSheet.getRange('A10');

      // // processSpreadSheet(scheduleSheet, context);


      // // scheduleSheet.onChanged.add(onWorksheetChanged);

      // loadSheddingData.load("values");
      // currentCityVal.load('values');
      // currentSuburbVal.load('values');
      // await context.sync();
      // // call fn

      // let province: string = 'KwaZulu-Natal';

      // const loadSheddingDataToJson = loadSheddingData.toJSON();

      // const currentProvinceCities = loadsheddingMap[province]['cities'];
      // let isNext = false;
      // let cityIterator = currentProvinceCities.length - 1;
      // let suburbIterator = currentProvinceCities[cityIterator]['suburbs'].length - 1;
      // // console.log('INIT:', suburbIterator);


      // // currentCityVal.worksheet.onChanged
      // // console.log(currentProvinceCities[0]['suburbs']);
      // let city = currentProvinceCities[0];
      // let suburb = currentProvinceCities[0]['suburbs'][0];

      // currentCityVal.values = [[city['city']]];
      // currentSuburbVal.values = [[suburb['suburb']]];


      // currentProvinceCities.forEach(async currentCity => {

      // if (currentCity['city'] === currentCityVal.values.toString()) {
      // const suburbs = currentCity['suburbs'];
      // // city = currentCity['city'];
      // currentCityVal.values = [[currentCity['city']]];
      // currentCityVal.
      // suburbs.forEach(currentSuburb => {
      //   // suburb = currentSuburb['suburb'];
      //   currentSuburbVal.values = [[currentCity['suburb']]];
      //   console.log(`SCHEDULE DATA FOR ${currentSuburb['suburb']}:`, loadSheddingData.toJSON());

      //   // console.log('CITY:', currentCity['city']);
      //   // console.log('SUBURB:', element);
      //   // if(){}


      // });


      // console.log(loadsheddingMap[province]['cities'][cityIterator]['suburbs'][suburbIterator]['suburb']);


      // if (suburbs[suburbIterator])


      // suburbs.forEach(suburb => {
      // console.log(suburb['suburb'] === currentSuburbVal.values.toString());
      // console.log('SUBURB:', suburbs[suburbIterator]);

      // if (suburbs[suburbIterator]['city'] === currentCityVal.values.toString()) {
      //   console.log(suburbs[suburbIterator]['city']);

      //   suburbs[suburbIterator]['schedule'] = loadSheddingDataToJson.values;
      //   isNext = true;
      //   return;
      // }
      // suburbIterator--;
      // console.log('LOOP:', suburbs);


      // if (isNext) {
      //   isNext = false;
      //   console.log('Done Next Suburb');
      // }

      // });
      // }
      // });
      // console.log(currentProvinceCities);


    });
  } catch (error) {
    console.error(error);
  }
}

let blockCount = 1;

async function onChange(event: Excel.WorksheetChangedEventArgs) {
  // This function is an event handler that returns the address, trigger source, 
  // and insert or delete shift directions of the change.
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getItem('Schedule');

    const scheduleRange = sheet.getRange('B3:AH14');
    const blockRange = sheet.getRange('A1');

    scheduleRange.load('values');
    await context.sync();

    const jsonSchedule = scheduleRange.toJSON().values;

    const schedule: Block = {
      blockNumber: blockCount,
      schedule: jsonSchedule
    }

    blocks.push(schedule);
    blockCount++;
    console.log(blocks);

  });
}

